import Auction from "../models/auction.model.js";
import User from "../models/user.model.js";
import //   offerMadeEmail,
//   offerAcceptedEmail,
//   offerRejectedEmail,
//   offerCounteredEmail,
//   offerWithdrawnEmail,
"../utils/nodemailer.js";
import {
  auctionWonAdminEmail,
  bidConfirmationEmail,
  newOfferNotificationEmail,
  offerAcceptedEmail,
  offerCanceledEmail,
  offerRejectedEmail,
  sendAuctionEndedSellerEmail,
  sendAuctionWonEmail,
} from "../utils/nodemailer.js";

/**
 * @desc    Make an offer on an auction
 * @route   POST /api/v1/auctions/offer/:id
 * @access  Private
 */
export const makeOffer = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, message } = req.body;
    const buyer = req.user;

    // Validate auction status
    if (!buyer?.isActive) {
      return res.status(400).json({
        success: false,
        message: `Account is inactive. Can't send an offer.`,
      });
    }

    // Find auction
    const auction = await Auction.findById(id)
      .populate("seller", "username firstName lastName email")
      .populate("offers.buyer", "username firstName lastName email");

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Check if user is seller
    if (auction.seller._id.toString() === buyer._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot make an offer on your own auction",
      });
    }

    // Validate auction allows offers
    if (!auction.allowOffers) {
      return res.status(400).json({
        success: false,
        message: "This auction does not accept offers",
      });
    }

    // Validate auction status
    if (auction.status !== "active") {
      return res.status(400).json({
        success: false,
        message: `Cannot make offer. Auction status: ${auction.status}`,
      });
    }

    // Check if auction has ended
    if (new Date() > auction.endDate) {
      return res.status(400).json({
        success: false,
        message: "Auction has ended",
      });
    }

    // Validate offer amount
    const offerAmount = parseFloat(amount);
    if (isNaN(offerAmount) || offerAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid offer amount",
      });
    }

    // Check minimum offer
    if (offerAmount < auction.startPrice) {
      return res.status(400).json({
        success: false,
        message: `Offer must be at least $${auction.startPrice.toLocaleString()}`,
      });
    }

    // Check if buy now price exists and offer is higher
    if (auction.buyNowPrice && offerAmount >= auction.buyNowPrice) {
      return res.status(400).json({
        success: false,
        message: `Your offer is higher than the Buy Now price ($${auction.buyNowPrice.toLocaleString()}). Consider using Buy Now instead.`,
      });
    }

    // Check for existing pending offer from same buyer
    const existingPendingOffer = auction.offers.find(
      (offer) =>
        offer.buyer._id.toString() === buyer._id.toString() &&
        offer.status === "pending"
    );

    if (existingPendingOffer) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending offer on this auction",
      });
    }

    // Make the offer
    await auction.makeOffer(
      buyer._id,
      buyer.username,
      offerAmount,
      message || ""
    );

    // Save auction
    await auction.save();

    // Populate updated auction
    const updatedAuction = await Auction.findById(id)
      .populate("offers.buyer", "email username firstName lastName")
      .populate("seller", "email username firstName lastName");

    res.status(201).json({
      success: true,
      message: "Offer submitted successfully",
      data: {
        auction: updatedAuction,
      },
    });

    bidConfirmationEmail(
      buyer?.email,
      buyer?.firstName || buyer?.username,
      updatedAuction?.title,
      updatedAuction?.specifications?.get("year"),
      offerAmount,
      updatedAuction?.buyNowPrice || updatedAuction?.startPrice,
      updatedAuction?._id
    ).catch((error) => console.error("Failed to send buyer email:", error));

    newOfferNotificationEmail(
      updatedAuction?.seller,
      updatedAuction,
      offerAmount,
      buyer
    ).catch((error) => console.error("Failed to send seller email:", error));
  } catch (error) {
    console.error("Make offer error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to submit offer",
    });
  }
};

/**
 * @desc    Get user's offers for an auction
 * @route   GET /api/v1/auctions/:id/offers/my
 * @access  Private
 */
export const getMyOffers = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const auction = await Auction.findById(id).populate(
      "offers.buyer",
      "username firstName lastName"
    );

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Filter offers to only show user's offers
    const userOffers = auction.offers.filter(
      (offer) => offer.buyer._id.toString() === userId.toString()
    );

    res.status(200).json({
      success: true,
      data: {
        offers: userOffers,
        auctionId: auction._id,
        auctionTitle: auction.title,
        auctionStatus: auction.status,
      },
    });
  } catch (error) {
    console.error("Get my offers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your offers",
    });
  }
};

/**
 * @desc    Get all offers for seller's auction
 * @route   GET /api/v1/auctions/:id/offers/seller
 * @access  Private (Seller only)
 */
export const getAuctionOffersForSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const sellerId = req.user._id;

    const auction = await Auction.findById(id).populate(
      "offers.buyer",
      "username firstName lastName email"
    );

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Verify user is the seller
    if (auction.seller.toString() !== sellerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to view offers for this auction",
      });
    }

    // Sort offers: pending first, then by amount descending
    const sortedOffers = auction.offers.sort((a, b) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      return b.amount - a.amount;
    });

    res.status(200).json({
      success: true,
      data: {
        auction: {
          _id: auction._id,
          title: auction.title,
          status: auction.status,
          startPrice: auction.startPrice,
          buyNowPrice: auction.buyNowPrice,
          allowOffers: auction.allowOffers,
        },
        offers: sortedOffers,
        stats: {
          total: auction.offers.length,
          pending: auction.offers.filter((o) => o.status === "pending").length,
          accepted: auction.offers.filter((o) => o.status === "accepted")
            .length,
          rejected: auction.offers.filter((o) => o.status === "rejected")
            .length,
          countered: auction.offers.filter((o) => o.status === "countered")
            .length,
          expired: auction.offers.filter((o) => o.status === "expired").length,
        },
      },
    });
  } catch (error) {
    console.error("Get auction offers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch auction offers",
    });
  }
};

/**
 * @desc    Seller responds to an offer (accept/reject/counter)
 * @route   POST /api/v1/auctions/:auctionId/offers/:offerId/respond
 * @access  Private (Seller only)
 */
export const respondToOffer = async (req, res) => {
  try {
    const { offerId } = req.params; // Changed from auctionId to getting from body
    const { auctionId, response, counterAmount, counterMessage } = req.body; // Get auctionId from body
    const sellerId = req.user._id;

    // Find auction
    const auction = await Auction.findById(auctionId)
      .populate("offers.buyer", "username firstName lastName email")
      .populate("seller", "username firstName lastName email");

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Verify user is the seller
    if (auction.seller._id.toString() !== sellerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to respond to offers for this auction",
      });
    }

    // Validate auction status
    if (auction.status !== "active") {
      return res.status(400).json({
        success: false,
        message: `Cannot respond to offer. Auction status: ${auction.status}`,
      });
    }

    // Find the offer
    const offer = auction.offers.id(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Validate response type
    const validResponses = ["accept", "reject", "counter"];
    if (!validResponses.includes(response)) {
      return res.status(400).json({
        success: false,
        message: "Invalid response type. Must be: accept, reject, or counter",
      });
    }

    // Validate counter offer if response is counter
    if (response === "counter") {
      const counterAmountValue = parseFloat(counterAmount);
      if (isNaN(counterAmountValue) || counterAmountValue <= 0) {
        return res.status(400).json({
          success: false,
          message: "Valid counter amount is required",
        });
      }

      // Counter must be higher than original offer
      if (counterAmountValue <= offer.amount) {
        return res.status(400).json({
          success: false,
          message: "Counter offer must be higher than the original offer",
        });
      }

      // Check if counter is higher than buy now price
      if (auction.buyNowPrice && counterAmountValue >= auction.buyNowPrice) {
        return res.status(400).json({
          success: false,
          message: "Counter offer cannot exceed Buy Now price",
        });
      }
    }

    // Respond to offer
    await auction.respondToOffer(
      offerId,
      response,
      response === "counter" ? parseFloat(counterAmount) : null,
      counterMessage || ""
    );

    // Save auction
    await auction.save();

    // Populate updated auction
    const updatedAuction = await Auction.findById(auctionId)
      .populate("offers.buyer", "username firstName lastName")
      .populate("seller", "username firstName lastName")
      .populate("winner", "username firstName lastName");

    // Send email notification to buyer
    // try {
    //   if (response === "accept") {
    //     await offerAcceptedEmail(
    //       offer.buyer.email,
    //       offer.buyer.firstName || offer.buyer.username,
    //       offer.amount,
    //       auction.title,
    //       auction._id,
    //       auction.seller.username
    //     );
    //   } else if (response === "reject") {
    //     await offerRejectedEmail(
    //       offer.buyer.email,
    //       offer.buyer.firstName || offer.buyer.username,
    //       offer.amount,
    //       auction.title,
    //       auction._id,
    //       auction.seller.username
    //     );
    //   } else if (response === "counter") {
    //     await offerCounteredEmail(
    //       offer.buyer.email,
    //       offer.buyer.firstName || offer.buyer.username,
    //       offer.amount,
    //       parseFloat(counterAmount),
    //       auction.title,
    //       auction._id,
    //       auction.seller.username,
    //       counterMessage || ""
    //     );
    //   }
    // } catch (emailError) {
    //   console.error("Failed to send response notification email:", emailError);
    //   // Don't fail the request if email fails
    // }

    res.status(200).json({
      success: true,
      message: `Offer ${response}ed successfully`,
      data: {
        auction: updatedAuction,
      },
    });
  } catch (error) {
    console.error("Respond to offer error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to respond to offer",
    });
  }
};

/**
 * @desc    Buyer accepts a counter offer
 * @route   POST /api/v1/auctions/:auctionId/offers/:offerId/accept-counter
 * @access  Private
 */
export const acceptCounterOffer = async (req, res) => {
  try {
    const { offerId } = req.params; // Changed from auctionId to getting from body
    const { auctionId } = req.body; // Get auctionId from body
    const buyerId = req.user._id;

    // Find auction
    const auction = await Auction.findById(auctionId)
      .populate("offers.buyer", "username firstName lastName email")
      .populate("seller", "username firstName lastName email");

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Find the offer
    const offer = auction.offers.id(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Verify user is the buyer who made the offer
    if (offer.buyer._id.toString() !== buyerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this counter offer",
      });
    }

    // Validate offer status
    if (offer.status !== "countered") {
      return res.status(400).json({
        success: false,
        message: "This offer is not in countered status",
      });
    }

    // Check if counter offer has expired
    if (new Date() > offer.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "This counter offer has expired",
      });
    }

    // Accept the counter offer
    await auction.respondToCounterOffer(offerId, true);

    // Save auction
    await auction.save();

    // Populate updated auction
    const updatedAuction = await Auction.findById(auctionId)
      .populate("offers.buyer", "username firstName lastName")
      .populate("seller", "username firstName lastName")
      .populate("winner", "username firstName lastName");

    // Send email notification to seller
    // try {
    //   await offerAcceptedEmail(
    //     auction.seller.email,
    //     auction.seller.firstName || auction.seller.username,
    //     offer.counterOffer.amount,
    //     auction.title,
    //     auction._id,
    //     offer.buyer.username
    //   );
    // } catch (emailError) {
    //   console.error(
    //     "Failed to send acceptance notification email:",
    //     emailError
    //   );
    //   // Don't fail the request if email fails
    // }

    res.status(200).json({
      success: true,
      message:
        "Counter offer accepted successfully! Auction is now sold to you.",
      data: {
        auction: updatedAuction,
      },
    });
  } catch (error) {
    console.error("Accept counter offer error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to accept counter offer",
    });
  }
};

/**
 * @desc    Buyer withdraws their offer
 * @route   POST /api/v1/auctions/:auctionId/offers/:offerId/withdraw
 * @access  Private
 */
export const withdrawOffer = async (req, res) => {
  try {
    const { offerId, auctionId } = req.params; // Changed from auctionId to getting from body
    const buyerId = req.user._id;

    // Find auction
    const auction = await Auction.findById(auctionId)
      .populate("offers.buyer", "username firstName lastName email")
      .populate("seller", "username firstName lastName email");

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Find the offer
    const offer = auction.offers.id(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Verify user is the buyer who made the offer
    if (offer.buyer._id.toString() !== buyerId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to withdraw this offer",
      });
    }

    // Validate offer status
    if (offer.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending offers can be withdrawn",
      });
    }

    // Withdraw the offer
    await auction.withdrawOffer(offerId, buyerId);

    // Save auction
    await auction.save();

    // Populate updated auction
    const updatedAuction = await Auction.findById(auctionId)
      .populate("offers.buyer", "username firstName lastName")
      .populate("seller", "username firstName lastName");

    // Send email notification to seller
    // try {
    //   await offerWithdrawnEmail(
    //     auction.seller.email,
    //     auction.seller.firstName || auction.seller.username,
    //     offer.buyer.username,
    //     offer.amount,
    //     auction.title,
    //     auction._id
    //   );
    // } catch (emailError) {
    //   console.error(
    //     "Failed to send withdrawal notification email:",
    //     emailError
    //   );
    //   // Don't fail the request if email fails
    // }

    res.status(200).json({
      success: true,
      message: "Offer withdrawn successfully",
      data: {
        auction: updatedAuction,
      },
    });
  } catch (error) {
    console.error("Withdraw offer error:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Failed to withdraw offer",
    });
  }
};

/**
 * @desc    Get all user's offers across all auctions
 * @route   GET /api/v1/offers/my
 * @access  Private
 */
export const getAllMyOffers = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all auctions where user has made offers
    const auctions = await Auction.find({
      "offers.buyer": userId,
    })
      .populate("offers.buyer", "username firstName lastName")
      .populate("seller", "username firstName lastName")
      .sort({ createdAt: -1 });

    // Extract and flatten offers
    const allOffers = [];
    auctions.forEach((auction) => {
      const userOffers = auction.offers.filter(
        (offer) => offer.buyer._id.toString() === userId.toString()
      );

      userOffers.forEach((offer) => {
        allOffers.push({
          ...offer.toObject(),
          auction: {
            _id: auction._id,
            title: auction.title,
            status: auction.status,
            auctionType: auction.auctionType,
            startPrice: auction.startPrice,
            buyNowPrice: auction.buyNowPrice,
            sellerUsername: auction.sellerUsername,
            seller: auction.seller,
            endDate: auction.endDate,
            photos: auction.photos,
          },
        });
      });
    });

    // Sort by creation date (newest first)
    allOffers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate stats
    const stats = {
      total: allOffers.length,
      pending: allOffers.filter((o) => o.status === "pending").length,
      accepted: allOffers.filter((o) => o.status === "accepted").length,
      rejected: allOffers.filter((o) => o.status === "rejected").length,
      countered: allOffers.filter((o) => o.status === "countered").length,
      expired: allOffers.filter((o) => o.status === "expired").length,
      withdrawn: allOffers.filter((o) => o.status === "withdrawn").length,
    };

    res.status(200).json({
      success: true,
      data: {
        offers: allOffers,
        stats,
      },
    });
  } catch (error) {
    console.error("Get all my offers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch your offers",
    });
  }
};

/**
 * @desc    Get all offers for seller across all auctions
 * @route   GET /api/v1/offers/seller
 * @access  Private (Seller only)
 */
export const getAllOffersForSeller = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // Find all auctions where user is seller
    const auctions = await Auction.find({ seller: sellerId })
      .populate("offers.buyer", "username firstName lastName email")
      .populate("seller", "username firstName lastName")
      .sort({ createdAt: -1 });

    // Extract and flatten offers
    const allOffers = [];
    auctions.forEach((auction) => {
      auction.offers.forEach((offer) => {
        allOffers.push({
          ...offer.toObject(),
          auction: {
            _id: auction._id,
            title: auction.title,
            status: auction.status,
            auctionType: auction.auctionType,
            startPrice: auction.startPrice,
            buyNowPrice: auction.buyNowPrice,
            endDate: auction.endDate,
            photos: auction.photos,
          },
        });
      });
    });

    // Sort by creation date (newest first)
    allOffers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate stats
    const stats = {
      total: allOffers.length,
      pending: allOffers.filter((o) => o.status === "pending").length,
      accepted: allOffers.filter((o) => o.status === "accepted").length,
      rejected: allOffers.filter((o) => o.status === "rejected").length,
      countered: allOffers.filter((o) => o.status === "countered").length,
      expired: allOffers.filter((o) => o.status === "expired").length,
      withdrawn: allOffers.filter((o) => o.status === "withdrawn").length,
    };

    res.status(200).json({
      success: true,
      data: {
        offers: allOffers,
        stats,
      },
    });
  } catch (error) {
    console.error("Get all offers for seller error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch offers",
    });
  }
};

/**
 * @desc    Clean up expired offers (can be scheduled via cron)
 * @route   POST /api/v1/offers/cleanup-expired
 * @access  Private/Admin
 */
export const cleanupExpiredOffers = async (req, res) => {
  try {
    const now = new Date();

    // Find auctions with pending offers that have expired
    const auctions = await Auction.find({
      "offers.status": "pending",
      "offers.expiresAt": { $lt: now },
    });

    let cleanedCount = 0;

    for (const auction of auctions) {
      let changed = false;

      auction.offers.forEach((offer) => {
        if (offer.status === "pending" && new Date(offer.expiresAt) < now) {
          offer.status = "expired";
          offer.sellerResponse = "Offer expired";
          changed = true;
          cleanedCount++;
        }
      });

      if (changed) {
        await auction.save();
      }
    }

    res.status(200).json({
      success: true,
      message: `Cleaned up ${cleanedCount} expired offers`,
      data: { cleanedCount },
    });
  } catch (error) {
    console.error("Cleanup expired offers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cleanup expired offers",
    });
  }
};

/**
 * @desc    Get all offers across all auctions (Admin)
 * @route   GET /api/v1/offers/admin/all
 * @access  Private/Admin
 */
export const getAdminAllOffers = async (req, res) => {
  try {
    const {
      status = "all",
      category = "all",
      search = "",
      sortBy = "recent",
      page = 1,
      limit = 20,
    } = req.query;

    // Build filter
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (category && category !== "all") {
      filter["auction.category"] = category;
    }

    if (search) {
      filter.$or = [
        { "auction.title": { $regex: search, $options: "i" } },
        { buyerUsername: { $regex: search, $options: "i" } },
        { "auction.sellerUsername": { $regex: search, $options: "i" } },
      ];
    }

    // Find all auctions with offers
    const auctions = await Auction.find({
      "offers.0": { $exists: true }, // Only auctions with offers
    })
      .populate("seller", "username firstName lastName email company phone")
      .populate(
        "offers.buyer",
        "username firstName lastName email company phone"
      )
      .populate("winner", "username firstName lastName email")
      .sort({ createdAt: -1 });

    // Flatten and transform offers
    let allOffers = [];
    auctions.forEach((auction) => {
      auction.offers.forEach((offer) => {
        allOffers.push({
          ...offer.toObject(),
          auction: {
            _id: auction._id,
            title: auction.title,
            category: auction.category,
            auctionType: auction.auctionType,
            status: auction.status,
            startPrice: auction.startPrice,
            buyNowPrice: auction.buyNowPrice,
            currentPrice: auction.currentPrice,
            startDate: auction.startDate,
            endDate: auction.endDate,
            seller: {
              _id: auction.seller._id,
              username: auction.seller.username,
              name: `${auction.seller.firstName} ${auction.seller.lastName}`.trim(),
              email: auction.seller.email,
              phone: auction.seller.phone,
              company: auction.seller.company,
            },
            allowOffers: auction.allowOffers,
          },
        });
      });
    });

    // Apply filters
    if (status !== "all") {
      allOffers = allOffers.filter((offer) => offer.status === status);
    }

    if (category !== "all") {
      allOffers = allOffers.filter(
        (offer) => offer.auction.category === category
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      allOffers = allOffers.filter(
        (offer) =>
          offer.auction.title.toLowerCase().includes(searchLower) ||
          offer.buyerUsername.toLowerCase().includes(searchLower) ||
          offer.auction.seller.username.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    allOffers.sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "amount_high":
          return b.amount - a.amount;
        case "amount_low":
          return a.amount - b.amount;
        case "expiring_soon":
          if (a.status === "pending" && b.status === "pending") {
            return new Date(a.expiresAt) - new Date(b.expiresAt);
          }
          return a.status === "pending" ? -1 : 1;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    // Pagination
    const totalOffers = allOffers.length;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedOffers = allOffers.slice(startIndex, endIndex);

    // Calculate statistics
    const stats = {
      total: allOffers.length,
      pending: allOffers.filter((o) => o.status === "pending").length,
      accepted: allOffers.filter((o) => o.status === "accepted").length,
      rejected: allOffers.filter((o) => o.status === "rejected").length,
      countered: allOffers.filter((o) => o.status === "countered").length,
      expired: allOffers.filter((o) => o.status === "expired").length,
      withdrawn: allOffers.filter((o) => o.status === "withdrawn").length,
      byCategory: {},
      byStatus: {},
      totalValue: allOffers.reduce((sum, offer) => sum + offer.amount, 0),
      avgOfferAmount:
        allOffers.length > 0
          ? allOffers.reduce((sum, offer) => sum + offer.amount, 0) /
            allOffers.length
          : 0,
    };

    // Get categories for filter
    const categories = await Auction.distinct("category", {
      "offers.0": { $exists: true },
    });

    res.status(200).json({
      success: true,
      data: {
        offers: paginatedOffers,
        stats,
        filterOptions: {
          categories: ["all", ...categories],
          statuses: [
            "all",
            "pending",
            "accepted",
            "rejected",
            "countered",
            "expired",
            "withdrawn",
          ],
        },
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalOffers / limit),
          totalOffers,
          hasNextPage: endIndex < totalOffers,
          hasPrevPage: startIndex > 0,
        },
      },
    });
  } catch (error) {
    console.error("Get admin all offers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch offers",
    });
  }
};

/**
 * @desc    Get offers for a specific auction (Admin)
 * @route   GET /api/v1/offers/admin/auction/:auctionId
 * @access  Private/Admin
 */
export const getAdminAuctionOffers = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId)
      .populate("seller", "username firstName lastName email phone")
      .populate(
        "offers.buyer",
        "username firstName lastName email phone company"
      )
      .populate("winner", "username firstName lastName");

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        auction: {
          _id: auction._id,
          title: auction.title,
          status: auction.status,
          category: auction.category,
          auctionType: auction.auctionType,
          startPrice: auction.startPrice,
          buyNowPrice: auction.buyNowPrice,
          currentPrice: auction.currentPrice,
          startDate: auction.startDate,
          endDate: auction.endDate,
          seller: auction.seller,
          allowOffers: auction.allowOffers,
        },
        offers: auction.offers.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        ),
        stats: {
          total: auction.offers.length,
          pending: auction.offers.filter((o) => o.status === "pending").length,
          accepted: auction.offers.filter((o) => o.status === "accepted")
            .length,
          rejected: auction.offers.filter((o) => o.status === "rejected")
            .length,
          countered: auction.offers.filter((o) => o.status === "countered")
            .length,
          expired: auction.offers.filter((o) => o.status === "expired").length,
          withdrawn: auction.offers.filter((o) => o.status === "withdrawn")
            .length,
        },
      },
    });
  } catch (error) {
    console.error("Get admin auction offers error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch auction offers",
    });
  }
};

/**
 * @desc    Admin responds to an offer (can override seller response)
 * @route   POST /api/v1/offers/admin/:offerId/respond
 * @access  Private/Admin
 */
/**
 * @desc    Admin responds to an offer (can override seller response)
 * @route   POST /api/v1/offers/admin/:offerId/respond
 * @access  Private/Admin
 */
export const adminRespondToOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { auctionId, response, message } = req.body;
    const admin = req.user;

    if (!admin) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }

    // Find auction
    const auction = await Auction.findById(auctionId)
      .populate("offers.buyer", "username firstName lastName email phone")
      .populate("seller", "username firstName lastName email phone");

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Find the offer
    const offer = auction.offers.id(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Validate response
    const validResponses = ["accept", "reject"];
    if (!validResponses.includes(response)) {
      return res.status(400).json({
        success: false,
        message: "Invalid response. Must be: accept or reject",
      });
    }

    // Use the auction model's respondToOffer method for proper handling
    if (response === "accept") {
      await auction.respondToOffer(
        offerId,
        "accept",
        null,
        message || "Offer accepted by administrator"
      );
    } else {
      // For reject, just update the offer status
      offer.status = "rejected";
      offer.sellerResponse = message || "Offer rejected by administrator";
      offer.updatedAt = new Date();
      await auction.save();
    }

    // Populate updated data
    const updatedAuction = await Auction.findById(auctionId)
      .populate("offers.buyer", "username firstName lastName email phone")
      .populate("seller", "username firstName lastName email phone")
      .populate("winner", "username firstName lastName email phone address");

    res.status(200).json({
      success: true,
      message: `Offer ${response}ed by administrator`,
      data: {
        auction: updatedAuction,
        offer:
          response === "accept" ? updatedAuction.offers.id(offerId) : offer,
      },
    });

    // Send appropriate email based on response
    if (response === "accept") {
      offerAcceptedEmail(
        offer.buyer.email,
        offer.buyer.firstName || offer.buyer.username,
        updatedAuction.seller,
        updatedAuction,
        offer.amount,
        offerId
      ).catch((error) =>
        console.error("Failed to send offer accepted email:", error)
      );

      sendAuctionEndedSellerEmail(
        updatedAuction
      ).catch((error) =>
        console.error("Failed to send seller ended auction email:", error)
      );

      sendAuctionWonEmail(updatedAuction).catch((error) =>
        console.error("Failed to send buyer won auction email:", error)
      );

      auctionWonAdminEmail(admin?.email, updatedAuction, offer?.buyer?.email).catch((error) =>
        console.error("Failed to send admin auction won email:", error)
      );
    } else {
      offerRejectedEmail(
        offer.buyer.email,
        offer.buyer.firstName || offer.buyer.username,
        auction.seller,
        auction,
        offer.amount,
        offerId,
        offer.sellerResponse || "No reason provided"
      ).catch((error) =>
        console.error("Failed to send offer accepted email:", error)
      );
    }
  } catch (error) {
    console.error("Admin respond to offer error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to respond to offer",
    });
  }
};

/**
 * @desc    Admin cancels an offer (force withdraw)
 * @route   POST /api/v1/offers/admin/:offerId/cancel
 * @access  Private/Admin
 */
export const adminCancelOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { auctionId, reason } = req.body;

    const auction = await Auction.findById(auctionId)
      .populate("offers.buyer", "email username firstName lastName email")
      .populate("seller", "email username firstName lastName email");

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    const offer = auction.offers.id(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Save previous status for reference
    const previousStatus = offer.status;

    // Cancel the offer
    offer.status = "withdrawn";
    offer.sellerResponse = `Offer cancelled by administrator: ${
      reason || "Violation of terms"
    }`;
    offer.updatedAt = new Date();

    await auction.save();

    res.status(200).json({
      success: true,
      message: "Offer cancelled by administrator",
      data: {
        auction: auction,
        offer: offer,
        previousStatus: previousStatus,
      },
    });

    // Send email to buyer in background
    offerCanceledEmail(
      offer.buyer.email,
      offer.buyer.firstName || offer.buyer.username,
      auction.seller,
      auction,
      offer.amount,
      offerId
    ).catch((error) =>
      console.error("Failed to send offer canceled email:", error)
    );
  } catch (error) {
    console.error("Admin cancel offer error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel offer",
    });
  }
};

/**
 * @desc    Get admin offer statistics
 * @route   GET /api/v1/offers/admin/stats
 * @access  Private/Admin
 */
export const getAdminOfferStats = async (req, res) => {
  try {
    // Get total offers
    const totalAuctionsWithOffers = await Auction.countDocuments({
      "offers.0": { $exists: true },
    });

    // Get total offers count
    const totalOffersResult = await Auction.aggregate([
      { $match: { "offers.0": { $exists: true } } },
      { $project: { offersCount: { $size: "$offers" } } },
      { $group: { _id: null, total: { $sum: "$offersCount" } } },
    ]);

    const totalOffers = totalOffersResult[0]?.total || 0;

    // Get offers by status
    const statusStats = await Auction.aggregate([
      { $unwind: "$offers" },
      {
        $group: {
          _id: "$offers.status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$offers.amount" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get offers by category
    const categoryStats = await Auction.aggregate([
      { $match: { "offers.0": { $exists: true } } },
      { $unwind: "$offers" },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          avgAmount: { $avg: "$offers.amount" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Get recent activity
    const recentOffers = await Auction.aggregate([
      { $match: { "offers.0": { $exists: true } } },
      { $sort: { "offers.createdAt": -1 } },
      { $limit: 5 },
      {
        $project: {
          title: 1,
          offers: { $slice: ["$offers", 5] },
        },
      },
    ]);

    // Calculate success rate
    const successStats = await Auction.aggregate([
      { $unwind: "$offers" },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          accepted: {
            $sum: {
              $cond: [{ $eq: ["$offers.status", "accepted"] }, 1, 0],
            },
          },
        },
      },
    ]);

    const successRate =
      successStats[0]?.total > 0
        ? Math.round((successStats[0]?.accepted / successStats[0]?.total) * 100)
        : 0;

    res.status(200).json({
      success: true,
      data: {
        totalAuctionsWithOffers,
        totalOffers,
        statusStats: statusStats.reduce((acc, stat) => {
          acc[stat._id] = { count: stat.count, totalAmount: stat.totalAmount };
          return acc;
        }, {}),
        categoryStats,
        recentActivity: recentOffers,
        successRate,
        averageOffersPerAuction:
          totalAuctionsWithOffers > 0
            ? Math.round(totalOffers / totalAuctionsWithOffers)
            : 0,
      },
    });
  } catch (error) {
    console.error("Get admin offer stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch offer statistics",
    });
  }
};

/**
 * @desc    Admin ends auction by accepting an offer (with audit trail)
 * @route   POST /api/v1/offers/admin/:offerId/end-auction
 * @access  Private/Admin
 */
export const adminEndAuctionWithOffer = async (req, res) => {
  try {
    const { offerId } = req.params;
    const { auctionId, reason } = req.body;
    const adminId = req.user._id;

    // Find auction
    const auction = await Auction.findById(auctionId)
      .populate("offers.buyer", "username firstName lastName email phone")
      .populate("seller", "username firstName lastName email phone")
      .populate("currentBidder", "username firstName lastName email phone");

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Find the offer
    const offer = auction.offers.id(offerId);
    if (!offer) {
      return res.status(404).json({
        success: false,
        message: "Offer not found",
      });
    }

    // Validate auction can be ended
    if (auction.status === "sold" || auction.status === "sold_buy_now") {
      return res.status(400).json({
        success: false,
        message: "Auction is already sold",
      });
    }

    if (auction.status !== "active") {
      return res.status(400).json({
        success: false,
        message: `Cannot end inactive auction. Current status: ${auction.status}`,
      });
    }

    // Accept the offer and end auction using the model's method
    await auction.respondToOffer(
      offerId,
      "accept",
      null,
      reason || "Auction ended by administrator via offer acceptance"
    );

    // Add admin audit trail
    auction.endedBy = adminId;
    auction.endedReason = reason || "Admin ended via offer acceptance";
    await auction.save();

    // Populate updated auction
    const updatedAuction = await Auction.findById(auctionId)
      .populate("offers.buyer", "username firstName lastName email phone")
      .populate("seller", "username firstName lastName email phone")
      .populate("winner", "username firstName lastName email phone")
      .populate("endedBy", "username firstName lastName");

    // Handle bid payments cleanup if there were bids
    if (auction.bidCount > 0) {
      try {
        // Import and use your existing payment cleanup function
        const { cancelAllBidderAuthorizations } = await import(
          "../controllers/bidPayment.controller.js"
        );
        await cancelAllBidderAuthorizations(auctionId);
        console.log(
          `✅ Cancelled bidder authorizations for auction ${auctionId}`
        );
      } catch (paymentError) {
        console.error("Error cancelling bidder authorizations:", paymentError);
        // Continue even if payment cleanup fails
      }
    }

    // Send notifications
    // try {
    //   // Notify buyer
    //   await auctionEndedByAdminEmail(
    //     offer.buyer.email,
    //     offer.buyer.firstName || offer.buyer.username,
    //     offer.amount,
    //     auction.title,
    //     auction._id,
    //     req.user.username,
    //     reason || "Administrative action"
    //   );

    //   // Notify seller
    //   await auctionEndedByAdminSellerEmail(
    //     auction.seller.email,
    //     auction.seller.firstName || auction.seller.username,
    //     offer.amount,
    //     auction.title,
    //     auction._id,
    //     req.user.username,
    //     reason || "Administrative action"
    //   );

    //   // Notify all bidders if any
    //   if (auction.bidCount > 0) {
    //     const uniqueBidderIds = [
    //       ...new Set(auction.bids.map((bid) => bid.bidder.toString())),
    //     ];
    //     for (const bidderId of uniqueBidderIds) {
    //       if (bidderId !== offer.buyer._id.toString()) {
    //         const bidder = await User.findById(bidderId);
    //         if (bidder) {
    //           await auctionEndedByAdminBidderEmail(
    //             bidder.email,
    //             bidder.username,
    //             auction.title,
    //             auction._id,
    //             req.user.username,
    //             reason || "Administrative action"
    //           );
    //         }
    //       }
    //     }
    //   }
    // } catch (emailError) {
    //   console.error("Failed to send notification emails:", emailError);
    // }

    res.status(200).json({
      success: true,
      message: "Auction ended successfully via offer acceptance",
      data: {
        auction: updatedAuction,
        offer: updatedAuction.offers.id(offerId),
        action: {
          performedBy: req.user.username,
          reason: reason || "Administrative action",
          timestamp: new Date(),
        },
      },
    });
  } catch (error) {
    console.error("Admin end auction with offer error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to end auction via offer",
    });
  }
};
