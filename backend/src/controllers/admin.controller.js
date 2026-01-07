import User from "../models/user.model.js";
import Auction from "../models/auction.model.js";
import Comment from "../models/comment.model.js";
import Watchlist from "../models/watchlist.model.js";
import agendaService from "../services/agendaService.js";
import axios from "axios";

import {
  deleteFromCloudinary,
  uploadDocumentToCloudinary,
  uploadImageToCloudinary,
} from "../utils/cloudinary.js";

import {
  auctionApprovedEmail,
  auctionListedEmail,
  paymentCompletedEmail,
  sendBulkAuctionNotifications,
} from "../utils/nodemailer.js";

export const getAdminStats = async (req, res) => {
  try {
    // Get total users count
    const totalUsers = await User.countDocuments({ isActive: true });

    // Get user type breakdown
    const userTypeStats = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: "$userType", count: { $sum: 1 } } },
    ]);

    // Get total auctions count
    const totalAuctions = await Auction.countDocuments();

    // Get auction status breakdown
    const auctionStatusStats = await Auction.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Get active auctions
    const activeAuctions = await Auction.countDocuments({
      status: "active",
      endDate: { $gt: new Date() },
    });

    // Calculate total revenue from sold auctions
    const revenueStats = await Auction.aggregate([
      { $match: { status: "sold" } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$finalPrice" },
          highestSale: { $max: "$finalPrice" },
          averageSale: { $avg: "$finalPrice" },
          totalSold: { $sum: 1 },
        },
      },
    ]);

    const totalRevenue = revenueStats[0]?.totalRevenue || 0;
    const highestSaleAmount = revenueStats[0]?.highestSale || 0;
    const averageSalePrice = revenueStats[0]?.averageSale || 0;
    const totalSoldAuctions = revenueStats[0]?.totalSold || 0;

    // Get highest sale auction details
    const highestSaleAuction = await Auction.findOne({ status: "sold" })
      .sort({ finalPrice: -1 })
      .populate("seller", "username firstName lastName")
      .populate("winner", "username firstName lastName")
      .select("title finalPrice seller winner createdAt");

    // Calculate success rate
    const completedAuctions = await Auction.countDocuments({
      status: { $in: ["sold", "ended", "reserve_not_met"] },
    });

    const soldAuctions = await Auction.countDocuments({ status: "sold" });
    const successRate =
      completedAuctions > 0
        ? Math.round((soldAuctions / completedAuctions) * 100)
        : 0;

    // Get pending moderation counts
    const pendingAuctions = await Auction.countDocuments({ status: "draft" });
    const pendingUserVerifications = await User.countDocuments({
      isVerified: false,
      isActive: true,
    });

    const pendingModeration = pendingAuctions;

    // Get recent user registrations (last 7 days)
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    // Get today's revenue
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayRevenueStats = await Auction.aggregate([
      {
        $match: {
          status: "sold",
          updatedAt: {
            $gte: today,
            $lt: tomorrow,
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$finalPrice" } } },
    ]);

    const todayRevenue = todayRevenueStats[0]?.total || 0;

    // Get system metrics
    const totalComments = await Comment.countDocuments();
    // const totalWatchlists = await Watchlist.countDocuments();
    const watchlistItems = await Watchlist.aggregate([
      {
        $lookup: {
          from: "auctions",
          localField: "auction",
          foreignField: "_id",
          as: "auction",
        },
      },
      {
        $unwind: "$auction",
      },
      {
        $match: {
          "auction.status": "active",
        },
      },
      {
        $count: "count",
      },
    ]);

    const totalWatchlists = watchlistItems[0]?.count || 0;

    // Get bidding activity (last 24 hours)
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentBids = await Auction.aggregate([
      { $unwind: "$bids" },
      { $match: { "bids.timestamp": { $gte: yesterday } } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const recentBidsCount = recentBids[0]?.count || 0;

    const highestBidStats = await Auction.aggregate([
      { $unwind: "$bids" },
      {
        $group: {
          _id: null,
          highestBidAmount: { $max: "$bids.amount" },
          averageBidAmount: { $avg: "$bids.amount" },
          totalBids: { $sum: 1 },
        },
      },
    ]);

    // Get top performing categories
    const categoryStats = await Auction.aggregate([
      { $match: { status: "sold" } },
      {
        $group: {
          _id: "$category",
          totalRevenue: { $sum: "$finalPrice" },
          auctionCount: { $sum: 1 },
          avgPrice: { $avg: "$finalPrice" },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);

    // Get user engagement metrics
    const totalBids = await Auction.aggregate([
      { $group: { _id: null, totalBids: { $sum: "$bidCount" } } },
    ]);

    const totalBidsCount = totalBids[0]?.totalBids || 0;

    // Get total offers count
    const totalOffers = await Auction.aggregate([
      { $unwind: "$offers" },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const totalOffersCount = totalOffers[0]?.count || 0;

    // Get offers by status breakdown
    const offersByStatus = await Auction.aggregate([
      { $unwind: "$offers" },
      { $group: { _id: "$offers.status", count: { $sum: 1 } } },
    ]);

    // Get recent offers (last 24 hours)
    const recentOffers = await Auction.aggregate([
      { $unwind: "$offers" },
      { $match: { "offers.createdAt": { $gte: yesterday } } },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    const recentOffersCount = recentOffers[0]?.count || 0;

    // Calculate total offer value and average offer
    const offerValueStats = await Auction.aggregate([
      { $unwind: "$offers" },
      {
        $match: {
          "offers.status": {
            $in: ["pending", "accepted", "rejected", "expired", "withdrawn"],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalOfferValue: { $sum: "$offers.amount" },
          avgOfferAmount: { $avg: "$offers.amount" },
          highestOffer: { $max: "$offers.amount" },
        },
      },
    ]);

    const totalOfferValue = offerValueStats[0]?.totalOfferValue || 0;
    const avgOfferAmount = offerValueStats[0]?.avgOfferAmount || 0;
    const highestOfferAmount = offerValueStats[0]?.highestOffer || 0;

    const stats = {
      // Basic counts
      totalUsers,
      totalAuctions,
      activeAuctions,
      totalSoldAuctions,

      // User statistics
      userTypeStats: userTypeStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),

      // Auction statistics
      auctionStatusStats: auctionStatusStats.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),

      // Financial metrics
      totalRevenue,
      todayRevenue,
      highestSaleAmount,
      averageSalePrice,
      highestSaleAuction: highestSaleAuction
        ? {
            title: highestSaleAuction.title,
            amount: highestSaleAuction.finalPrice,
            seller: highestSaleAuction.seller?.username || "Unknown",
            winner: highestSaleAuction.winner?.username || "Unknown",
            date: highestSaleAuction.createdAt,
          }
        : null,

      // Performance metrics
      successRate,
      pendingModeration,
      recentUsers,

      // Engagement metrics
      totalComments,
      totalWatchlists,
      totalBids: totalBidsCount,
      recentBids: recentBidsCount,
      highestBidAmount: highestBidStats[0]?.highestBidAmount || 0,
      averageBidAmount: highestBidStats[0]?.averageBidAmount || 0,

      // Engagement metrics section
      totalOffers: totalOffersCount,
      recentOffers: recentOffersCount,
      offersByStatus: offersByStatus.reduce((acc, curr) => {
        acc[curr._id] = curr.count;
        return acc;
      }, {}),
      pendingOffers: offersByStatus.pending || 0,
      totalOfferValue: totalOfferValue,
      averageOfferAmount: avgOfferAmount,
      highestOfferAmount: highestOfferAmount,

      // Category performance
      categoryStats,

      // System metrics (you can implement real ones based on your monitoring)
      avgResponseTime: 2.3,
      systemHealth: 99.8,

      // Additional insights
      newUsersThisWeek: recentUsers,
      auctionsEndingToday: await Auction.countDocuments({
        status: "active",
        endDate: {
          $gte: today,
          $lt: tomorrow,
        },
      }),
    };

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching admin statistics",
    });
  }
};

// Get all users for admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", filter = "all" } = req.query;

    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = {
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ],
    };

    // Add filter if not 'all'
    if (filter !== "all") {
      searchQuery.userType = filter;
    }

    // Get users with pagination
    const users = await User.find(searchQuery)
      .select(
        "-password -refreshToken -resetPasswordToken -emailVerificationToken"
      )
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalUsers = await User.countDocuments(searchQuery);

    // Get user statistics
    const userStats = await User.aggregate([
      {
        $group: {
          _id: "$userType",
          count: { $sum: 1 },
        },
      },
    ]);

    // Convert stats to object
    const stats = {
      total: totalUsers,
      admins: userStats.find((stat) => stat._id === "admin")?.count || 0,
      sellers: userStats.find((stat) => stat._id === "seller")?.count || 0,
      bidders: userStats.find((stat) => stat._id === "bidder")?.count || 0,
    };

    res.status(200).json({
      success: true,
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalUsers / limit),
          totalUsers,
          hasNext: page * limit < totalUsers,
          hasPrev: page > 1,
        },
        stats,
      },
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching users",
    });
  }
};

// Get user details with statistics
export const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select(
      "-password -refreshToken -resetPasswordToken -emailVerificationToken"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let userStats = {};

    if (user.userType === "seller") {
      // Seller statistics
      const auctionStats = await Auction.aggregate([
        { $match: { seller: user._id } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalRevenue: { $sum: "$finalPrice" },
          },
        },
      ]);

      const activeAuctions =
        auctionStats.find((stat) => stat._id === "active")?.count || 0;
      const soldAuctions =
        auctionStats.find((stat) => stat._id === "sold")?.count || 0;
      const totalRevenue =
        auctionStats.find((stat) => stat._id === "sold")?.totalRevenue || 0;

      // Calculate rating (you might want to implement a proper rating system)
      const rating = 4.5 + Math.random() * 0.5; // Mock rating for now

      userStats = {
        totalSales: totalRevenue,
        activeListings: activeAuctions,
        totalAuctions: await Auction.countDocuments({ seller: user._id }),
        soldAuctions,
        rating: Math.round(rating * 10) / 10,
      };
    } else if (user.userType === "bidder") {
      // Bidder statistics
      const totalOffers = await Auction.aggregate([
        { $match: { "offers.buyer": user._id } },
        { $unwind: "$offers" },
        { $match: { "offers.buyer": user._id } },
        { $group: { _id: null, count: { $sum: 1 } } },
      ]);

      const wonAuctions = await Auction.countDocuments({
        winner: user._id,
        status: "sold",
      });

      const totalAuctionOfferSent = await Auction.countDocuments({
        "offers.buyer": user._id,
      });

      const watchlistItems = await Watchlist.countDocuments({
        user: user._id,
      });

      const totalOffersCount = totalOffers[0]?.count || 0;
      const successRate =
        totalOffersCount > 0
          ? Math.round((wonAuctions / totalAuctionOfferSent) * 100)
          : 0;

      userStats = {
        totalOffers: totalOffersCount,
        auctionsWon: wonAuctions,
        watchlistItems,
        successRate,
      };
    } else if (user.userType === "admin") {
      userStats = {
        role: "Super Admin", // You might want to store this in user model
        lastLogin: user.updatedAt,
      };
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          stats: userStats,
        },
      },
    });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching user details",
    });
  }
};

// Update user status (activate/deactivate)
export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? "activated" : "deactivated"} successfully`,
      data: { user },
    });
  } catch (error) {
    console.error("Update user status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating user status",
    });
  }
};

// Delete user and clean up related data
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete your own account",
      });
    }

    // 1. Cancel all auctions created by this user
    const userAuctions = await Auction.find({ seller: userId });

    for (const auction of userAuctions) {
      // Cancel the auction
      auction.status = "cancelled";

      // Cancel agenda jobs for this auction
      await agendaService.cancelAuctionJobs(auction._id);

      await auction.save();
    }

    // 2. Remove user's bids from all auctions and update current highest bidder
    const auctionsWithUserBids = await Auction.find({
      "bids.bidder": userId,
      status: "active", // Only update active auctions
    });

    for (const auction of auctionsWithUserBids) {
      // Remove all bids by this user
      auction.bids = auction.bids.filter(
        (bid) => bid.bidder.toString() !== userId.toString()
      );

      // Update bid count
      auction.bidCount = auction.bids.length;

      // Find the new highest bidder
      if (auction.bids.length > 0) {
        // Sort bids by amount descending and get the highest
        const sortedBids = auction.bids.sort((a, b) => b.amount - a.amount);
        const highestBid = sortedBids[0];

        auction.currentBidder = highestBid.bidder;
        auction.currentPrice = highestBid.amount;
      } else {
        // No bids left, reset to start price
        auction.currentBidder = null;
        auction.currentPrice = auction.startPrice;
      }

      await auction.save();
    }

    // 3. Delete user's comments (soft delete by marking as deleted)
    await Comment.updateMany(
      { user: userId },
      {
        status: "deleted",
        deletedAt: new Date(),
        deletedBy: req.user._id,
        adminDeleteReason: "User account deleted by admin",
      }
    );

    // 4. Remove user's watchlist items
    await Watchlist.deleteMany({ user: userId });

    // 5. Finally delete the user
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message:
        "User deleted successfully. All related data has been cleaned up.",
      data: {
        cancelledAuctions: userAuctions.length,
        updatedAuctions: auctionsWithUserBids.length,
      },
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting user",
    });
  }
};

// Update user role/type
export const updateUserType = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userType } = req.body;

    // Validate user type
    if (!["admin", "seller", "bidder"].includes(userType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user type",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { userType },
      { new: true, runValidators: true }
    ).select("-password -refreshToken");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${userType}`,
      data: { user },
    });
  } catch (error) {
    console.error("Update user type error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating user type",
    });
  }
};

// Get all auctions for admin
export const getAllAuctions = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", filter = "all" } = req.query;

    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = {
      $or: [
        { title: { $regex: search, $options: "i" } },
        { sellerUsername: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ],
    };

    // Add status filter if not 'all'
    if (filter !== "all") {
      if (filter === "active") {
        searchQuery.status = "active";
        searchQuery.endDate = { $gt: new Date() };
      } else if (filter === "pending") {
        searchQuery.status = "draft";
      } else if (filter === "ended") {
        searchQuery.status = { $in: ["ended", "sold", "reserve_not_met"] };
      } else {
        searchQuery.status = filter;
      }
    }

    // Get auctions with pagination and populate seller info
    const auctions = await Auction.find(searchQuery)
      .populate("seller", "firstName lastName username phone email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalAuctions = await Auction.countDocuments(searchQuery);

    // Get auction statistics
    const auctionStats = await Auction.aggregate([
      {
        $facet: {
          total: [{ $count: "count" }],
          active: [
            {
              $match: {
                status: "active",
                endDate: { $gt: new Date() },
              },
            },
            { $count: "count" },
          ],
          draft: [{ $match: { status: "draft" } }, { $count: "count" }],
          sold: [{ $match: { status: "sold" } }, { $count: "count" }],
          featured: [{ $match: { featured: true } }, { $count: "count" }],
        },
      },
    ]);

    const stats = {
      total: auctionStats[0]?.total[0]?.count || 0,
      active: auctionStats[0]?.active[0]?.count || 0,
      pending: auctionStats[0]?.draft[0]?.count || 0,
      sold: auctionStats[0]?.sold[0]?.count || 0,
      featured: auctionStats[0]?.featured[0]?.count || 0,
    };

    res.status(200).json({
      success: true,
      data: {
        auctions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalAuctions / limit),
          totalAuctions,
          hasNext: page * limit < totalAuctions,
          hasPrev: page > 1,
        },
        stats,
      },
    });
  } catch (error) {
    console.error("Get all auctions error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching auctions",
    });
  }
};

// Get auction details
export const getAuctionDetails = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId)
      .populate("seller", "firstName lastName username email phone")
      .populate("winner", "firstName lastName username")
      .populate("currentBidder", "firstName lastName username");

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Convert specifications Map to plain object
    const auctionObject = auction.toObject();

    if (
      auctionObject.specifications &&
      auctionObject.specifications instanceof Map
    ) {
      auctionObject.specifications = Object.fromEntries(
        auctionObject.specifications
      );
    } else if (
      auction.specifications &&
      auction.specifications instanceof Map
    ) {
      // Fallback: convert from the original document if toObject() doesn't preserve the Map
      auctionObject.specifications = Object.fromEntries(auction.specifications);
    }

    // Calculate additional statistics
    const auctionStats = {
      totalBids: auction.bidCount,
      totalWatchers: auction.watchlistCount,
      totalViews: auction.views,
      timeRemaining: auction.timeRemaining,
      isReserveMet: auction.isReserveMet(),
    };

    res.status(200).json({
      success: true,
      data: {
        auction: {
          ...auctionObject,
          stats: auctionStats,
        },
      },
    });
  } catch (error) {
    console.error("Get auction details error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching auction details",
    });
  }
};

// Update auction status
export const updateAuctionStatus = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const { status, featured } = req.body;

    const updateData = {};
    if (status) updateData.status = status;
    if (featured !== undefined) updateData.featured = featured;

    const auction = await Auction.findByIdAndUpdate(auctionId, updateData, {
      new: true,
      runValidators: true,
    }).populate("seller", "firstName lastName username");

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    let message = "Auction updated successfully";
    if (status) message = `Auction ${status} successfully`;
    if (featured !== undefined) {
      message = `Auction ${featured ? "featured" : "unfeatured"} successfully`;
    }

    res.status(200).json({
      success: true,
      message,
      data: { auction },
    });
  } catch (error) {
    console.error("Update auction status error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating auction status",
    });
  }
};

// Approve auction (change from draft to active)
export const approveAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId).populate("seller");

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    if (auction.status !== "draft") {
      return res.status(400).json({
        success: false,
        message: "Only draft auctions can be approved",
      });
    }

    // Check if auction start date is in the future
    const now = new Date();
    if (auction.startDate > now) {
      auction.status = "approved";
      // Schedule activation for start date - keep as draft for now
      await agendaService.scheduleAuctionActivation(
        auction._id,
        auction.startDate
      );
      await auctionApprovedEmail(auction.seller, auction);
    } else {
      // Activate immediately
      auction.status = "active";

      await auction.populate("seller", "email username firstName");

      await auctionListedEmail(auction, auction.seller);

      // If end date is in past, end the auction
      if (auction.endDate <= now) {
        await auction.endAuction();
      }
    }

    await auction.save();

    res.status(200).json({
      success: true,
      message: "Auction approved successfully",
      data: { auction },
    });

    // const bidders = await User.find({ userType: 'bidder' });
    const bidders = await User.find({
      _id: { $ne: auction?.seller?._id }, // Exclude auction owner
      userType: { $ne: "admin" }, // Exclude admin users
      isActive: true, // Only active users
    }).select("email username firstName preferences userType");

    await sendBulkAuctionNotifications(bidders, auction, auction.seller);
  } catch (error) {
    console.error("Approve auction error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while approving auction",
    });
  }
};

// Delete auction
export const deleteAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId);
    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Prevent deletion of active auctions with bids
    if (auction.status === "active" && auction.bidCount > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Cannot delete active auction with bids. Please cancel it first.",
      });
    }

    await Auction.findByIdAndDelete(auctionId);

    res.status(200).json({
      success: true,
      message: "Auction deleted successfully",
    });
  } catch (error) {
    console.error("Delete auction error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while deleting auction",
    });
  }
};

// End auction manually
export const endAuction = async (req, res) => {
  try {
    const { auctionId } = req.params;

    const auction = await Auction.findById(auctionId);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    if (auction.status !== "active") {
      return res.status(400).json({
        success: false,
        message: "Only active auctions can be ended manually",
      });
    }

    await auction.endAuction();

    res.status(200).json({
      success: true,
      message: "Auction ended successfully",
      data: { auction },
    });
  } catch (error) {
    console.error("End auction error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while ending auction",
    });
  }
};

// Update auction details
export const updateAuction = async (req, res) => {
  try {
    const { id } = req.params;

    const auction = await Auction.findById(id);

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // if (auction.status === "sold" || auction.status === "sold_buy_now") {
    //   return res.status(401).json({
    //     success: false,
    //     message: `Sold auctions can't be edited`,
    //   });
    // }

    // For FormData, we need to access fields from req.body directly
    const {
      title,
      subTitle,
      category,
      features,
      description,
      specifications,
      location,
      videoLink,
      startPrice,
      bidIncrement,
      auctionType,
      reservePrice,
      buyNowPrice,
      allowOffers,
      startDate,
      endDate,
      removedPhotos,
      removedDocuments,
      removedServiceRecords,
      photoOrder,
      serviceRecordOrder,
    } = req.body;

    // Basic validation - check if fields exist in req.body
    if (
      !title ||
      !category ||
      !description ||
      !auctionType ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
        missing: {
          title: !title,
          category: !category,
          description: !description,
          auctionType: !auctionType,
          startDate: !startDate,
          endDate: !endDate,
        },
      });
    }

    // Validate start price for all auction types
    if (!startPrice || parseFloat(startPrice) < 0) {
      return res.status(400).json({
        success: false,
        message: "Start price is required and must be positive",
      });
    }

    // CHECK: If auction is sold, we'll reset everything
    const isSoldAuction =
      auction.status === "sold" || auction.status === "sold_buy_now";

    if (isSoldAuction) {
      const resetData = {
        // Reset all bidding/offers/winner data
        bids: [],
        offers: [],
        currentPrice: parseFloat(startPrice),
        currentBidder: null,
        winner: null,
        finalPrice: null,
        bidCount: 0,

        // Reset payment info
        paymentStatus: "pending",
        paymentMethod: null,
        paymentDate: null,
        transactionId: null,
        invoice: null,

        // Reset notifications
        notifications: {
          ending30min: false,
          ending2hour: false,
          ending24hour: false,
          ending30minSentAt: null,
          ending2hourSentAt: null,
          ending24hourSentAt: null,
          offerReceived: false,
          offerExpiring: false,
        },

        lastBidTime: null,

        // Reset views and watchlist if you want a fresh start
        views: 0,
        // watchlistCount: 0,

        // Reset commission
        commissionAmount: 0,
        bidPaymentRequired: true,

        // Set status based on new dates
        status: "draft", // Start as draft since it's being re-listed
      };

      // Apply reset data to auction object
      Object.assign(auction, resetData);
    }

    // Validate bid increment for standard and reserve auctions
    if (
      (auctionType === "standard" || auctionType === "reserve") &&
      (!bidIncrement || parseFloat(bidIncrement) <= 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Bid increment is required for standard and reserve auctions",
      });
    }

    // Validate buy now price for buy_now auctions
    if (auctionType === "buy_now") {
      if (!buyNowPrice || parseFloat(buyNowPrice) < parseFloat(startPrice)) {
        return res.status(400).json({
          success: false,
          message:
            "Buy Now price must be provided and greater than or equal to start price",
        });
      }
    }

    // Validate reserve price for reserve auctions
    if (auctionType === "reserve") {
      if (!reservePrice || parseFloat(reservePrice) < parseFloat(startPrice)) {
        return res.status(400).json({
          success: false,
          message:
            "Reserve price must be provided and greater than or equal to start price",
        });
      }
    }

    // Handle specifications
    let finalSpecifications = new Map();

    // Convert existing specifications to Map if they exist
    if (auction.specifications && auction.specifications instanceof Map) {
      auction.specifications.forEach((value, key) => {
        if (value !== null && value !== undefined && value !== "") {
          finalSpecifications.set(key, value);
        }
      });
    } else if (
      auction.specifications &&
      typeof auction.specifications === "object"
    ) {
      Object.entries(auction.specifications).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== "") {
          finalSpecifications.set(key, value);
        }
      });
    }

    // Parse and merge new specifications
    if (specifications) {
      try {
        let newSpecs;
        if (typeof specifications === "string") {
          newSpecs = JSON.parse(specifications);
        } else {
          newSpecs = specifications;
        }

        if (typeof newSpecs === "object" && newSpecs !== null) {
          Object.entries(newSpecs).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== "") {
              finalSpecifications.set(key, value.toString());
            } else {
              finalSpecifications.delete(key);
            }
          });
        }
      } catch (parseError) {
        console.error("Error parsing specifications:", parseError);
        return res.status(400).json({
          success: false,
          message: "Invalid specifications format",
        });
      }
    }

    // Handle removed photos
    let finalPhotos = [...auction.photos];
    if (removedPhotos) {
      try {
        const removedPhotoIds =
          typeof removedPhotos === "string"
            ? JSON.parse(removedPhotos)
            : removedPhotos;

        if (Array.isArray(removedPhotoIds)) {
          // Remove photos from the array and delete from Cloudinary
          for (const photoId of removedPhotoIds) {
            const photoIndex = finalPhotos.findIndex(
              (photo) =>
                photo.publicId === photoId || photo._id?.toString() === photoId
            );

            if (photoIndex > -1) {
              const removedPhoto = finalPhotos[photoIndex];
              // Delete from Cloudinary
              if (removedPhoto.publicId) {
                await deleteFromCloudinary(removedPhoto.publicId);
              }
              finalPhotos.splice(photoIndex, 1);
            }
          }
        }
      } catch (error) {
        console.error("Error processing removed photos:", error);
      }
    }

    // Handle removed documents
    let finalDocuments = [...auction.documents];
    if (removedDocuments) {
      try {
        const removedDocIds =
          typeof removedDocuments === "string"
            ? JSON.parse(removedDocuments)
            : removedDocuments;

        if (Array.isArray(removedDocIds)) {
          for (const docId of removedDocIds) {
            const docIndex = finalDocuments.findIndex(
              (doc) => doc.publicId === docId || doc._id?.toString() === docId
            );

            if (docIndex > -1) {
              const removedDoc = finalDocuments[docIndex];
              // Delete from Cloudinary
              if (removedDoc.publicId) {
                await deleteFromCloudinary(removedDoc.publicId);
              }
              finalDocuments.splice(docIndex, 1);
            }
          }
        }
      } catch (error) {
        console.error("Error processing removed documents:", error);
      }
    }

    // Handle new photo uploads
    const newPhotos = [];
    if (req.files && req.files.photos) {
      const photos = Array.isArray(req.files.photos)
        ? req.files.photos
        : [req.files.photos];
      for (const photo of photos) {
        try {
          const result = await uploadImageToCloudinary(
            photo.buffer,
            "auction-photos"
          );
          newPhotos.push({
            url: result.secure_url,
            publicId: result.public_id,
            filename: photo.originalname,
            order: finalPhotos.length + newPhotos.length, // Maintain order
          });
        } catch (uploadError) {
          console.error("Photo upload error:", uploadError);
          return res.status(400).json({
            success: false,
            message: `Failed to upload photo: ${photo.originalname}`,
          });
        }
      }
    }

    // Handle photo ordering
    if (photoOrder) {
      try {
        const parsedPhotoOrder =
          typeof photoOrder === "string" ? JSON.parse(photoOrder) : photoOrder;

        if (Array.isArray(parsedPhotoOrder)) {
          // Create a map of existing photos by their ID for quick lookup
          const existingPhotosMap = new Map();
          finalPhotos.forEach((photo) => {
            const photoId = photo.publicId || photo._id?.toString();
            if (photoId) {
              existingPhotosMap.set(photoId, photo);
            }
          });

          // Track used new photos to prevent duplicates
          const usedNewPhotos = new Set();
          const reorderedPhotos = [];

          for (const orderItem of parsedPhotoOrder) {
            if (orderItem.isExisting) {
              // Find existing photo by ID
              const existingPhoto = existingPhotosMap.get(orderItem.id);
              if (existingPhoto) {
                reorderedPhotos.push(existingPhoto);
                // Remove from map to avoid duplicates
                existingPhotosMap.delete(orderItem.id);
              }
            } else {
              // For new photos, find by the temporary ID from frontend
              let foundNewPhoto = null;
              for (let i = 0; i < newPhotos.length; i++) {
                if (!usedNewPhotos.has(i)) {
                  foundNewPhoto = newPhotos[i];
                  usedNewPhotos.add(i);
                  break;
                }
              }

              if (foundNewPhoto) {
                reorderedPhotos.push(foundNewPhoto);
              }
            }
          }

          // Add any remaining existing photos that weren't in the photoOrder
          existingPhotosMap.forEach((photo) => reorderedPhotos.push(photo));

          // Add any remaining new photos that weren't used
          newPhotos.forEach((photo, index) => {
            if (!usedNewPhotos.has(index)) {
              reorderedPhotos.push(photo);
            }
          });

          finalPhotos = reorderedPhotos;
        }
      } catch (error) {
        console.error("Error processing photo order:", error);
        // Fallback: append new photos at the end
        finalPhotos = [...finalPhotos, ...newPhotos];
      }
    } else {
      // If no photoOrder is provided, just append new photos at the end
      finalPhotos = [...finalPhotos, ...newPhotos];
    }

    // Handle new document uploads
    if (req.files && req.files.documents) {
      const documents = Array.isArray(req.files.documents)
        ? req.files.documents
        : [req.files.documents];
      for (const doc of documents) {
        try {
          const result = await uploadDocumentToCloudinary(
            doc.buffer,
            doc.originalname,
            "auction-documents"
          );
          finalDocuments.push({
            url: result.secure_url,
            publicId: result.public_id,
            filename: doc.originalname,
            originalName: doc.originalname,
            resourceType: "raw",
          });
        } catch (uploadError) {
          console.error("Document upload error:", uploadError);
          return res.status(400).json({
            success: false,
            message: `Failed to upload document: ${doc.originalname}`,
          });
        }
      }
    }

    // Handle removed service records
    let finalServiceRecords = [...(auction.serviceRecords || [])];
    if (removedServiceRecords) {
      try {
        const removedServiceRecordIds =
          typeof removedServiceRecords === "string"
            ? JSON.parse(removedServiceRecords)
            : removedServiceRecords;

        if (Array.isArray(removedServiceRecordIds)) {
          for (const recordId of removedServiceRecordIds) {
            const recordIndex = finalServiceRecords.findIndex(
              (record) =>
                record.publicId === recordId ||
                record._id?.toString() === recordId
            );

            if (recordIndex > -1) {
              const removedRecord = finalServiceRecords[recordIndex];
              // Delete from Cloudinary
              if (removedRecord.publicId) {
                await deleteFromCloudinary(removedRecord.publicId);
              }
              finalServiceRecords.splice(recordIndex, 1);
            }
          }
        }
      } catch (error) {
        console.error("Error processing removed service records:", error);
      }
    }

    // Handle new service record uploads
    const newServiceRecords = [];
    if (req.files && req.files.serviceRecords) {
      const serviceRecords = Array.isArray(req.files.serviceRecords)
        ? req.files.serviceRecords
        : [req.files.serviceRecords];
      for (const record of serviceRecords) {
        try {
          const result = await uploadImageToCloudinary(
            record.buffer,
            "auction-service-records"
          );
          newServiceRecords.push({
            url: result.secure_url,
            publicId: result.public_id,
            filename: record.originalname,
            originalName: record.originalname,
            order: finalServiceRecords.length + newServiceRecords.length,
          });
        } catch (uploadError) {
          console.error("Service record upload error:", uploadError);
          return res.status(400).json({
            success: false,
            message: `Failed to upload service record: ${record.originalname}`,
          });
        }
      }
    }

    // Handle service record ordering
    if (serviceRecordOrder) {
      try {
        const parsedServiceRecordOrder =
          typeof serviceRecordOrder === "string"
            ? JSON.parse(serviceRecordOrder)
            : serviceRecordOrder;

        if (Array.isArray(parsedServiceRecordOrder)) {
          // Create a map of existing service records by their ID for quick lookup
          const existingServiceRecordsMap = new Map();
          finalServiceRecords.forEach((record) => {
            const recordId = record.publicId || record._id?.toString();
            if (recordId) {
              existingServiceRecordsMap.set(recordId, record);
            }
          });

          // Track used new service records to prevent duplicates
          const usedNewServiceRecords = new Set();
          const reorderedServiceRecords = [];

          for (const orderItem of parsedServiceRecordOrder) {
            if (orderItem.isExisting) {
              // Find existing service record by ID
              const existingRecord = existingServiceRecordsMap.get(
                orderItem.id
              );
              if (existingRecord) {
                reorderedServiceRecords.push(existingRecord);
                // Remove from map to avoid duplicates
                existingServiceRecordsMap.delete(orderItem.id);
              }
            } else {
              // For new service records, find by the temporary ID from frontend
              let foundNewRecord = null;
              for (let i = 0; i < newServiceRecords.length; i++) {
                if (!usedNewServiceRecords.has(i)) {
                  foundNewRecord = newServiceRecords[i];
                  usedNewServiceRecords.add(i);
                  break;
                }
              }

              if (foundNewRecord) {
                reorderedServiceRecords.push(foundNewRecord);
              }
            }
          }

          // Add any remaining existing service records that weren't in the order
          existingServiceRecordsMap.forEach((record) =>
            reorderedServiceRecords.push(record)
          );

          // Add any remaining new service records that weren't used
          newServiceRecords.forEach((record, index) => {
            if (!usedNewServiceRecords.has(index)) {
              reorderedServiceRecords.push(record);
            }
          });

          finalServiceRecords = reorderedServiceRecords;
        }
      } catch (error) {
        console.error("Error processing service record order:", error);
        // Fallback: append new service records at the end
        finalServiceRecords = [...finalServiceRecords, ...newServiceRecords];
      }
    } else {
      // If no serviceRecordOrder is provided, just append new service records at the end
      finalServiceRecords = [...finalServiceRecords, ...newServiceRecords];
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    // Prepare update data
    const updateData = {
      title,
      subTitle: subTitle || "",
      category,
      features: features || "",
      description,
      specifications: finalSpecifications,
      location: location || "",
      videoLink: videoLink || "",
      startPrice: parseFloat(startPrice),
      auctionType,
      allowOffers: allowOffers === "true" || allowOffers === true,
      startDate: start,
      endDate: end,
      photos: finalPhotos,
      documents: finalDocuments,
      serviceRecords: finalServiceRecords,
    };

    // Add bid increment only for standard and reserve auctions
    if (auctionType === "standard" || auctionType === "reserve") {
      updateData.bidIncrement = parseFloat(bidIncrement);
    } else {
      // Clear bid increment for other auction types
      updateData.bidIncrement = undefined;
    }

    // Add reserve price if applicable
    if (auctionType === "reserve") {
      updateData.reservePrice = parseFloat(reservePrice);
    } else {
      updateData.reservePrice = undefined;
    }

    // Add buy now price if applicable
    if (auctionType === "buy_now") {
      updateData.buyNowPrice = parseFloat(buyNowPrice);
    } else {
      updateData.buyNowPrice = undefined;
    }

    // Handle status changes based on new dates
    // Handle status changes based on new dates (only for non-sold auctions)
    // Handle status changes based on new dates (only for non-sold auctions)
    if (!isSoldAuction) {
      if (start > now && end > now) {
        // Dates are in future - activate if not already active
        if (auction.status == "active") {
          updateData.status = "approved";
        } else if (auction.status == "ended") {
          updateData.status = "approved";
        } else if (auction.status == "reserve_not_met") {
          updateData.status = "approved";
        }
      } else if (end <= now) {
        // Auction has ended
        if (auction.status === "active") {
          updateData.status = "ended";
          // Trigger end auction logic
          await auction.endAuction();
        }
      } else if (start <= now && end > now) {
        // Auction should be active now (start date passed but end date in future)
        if (auction.status !== "active") {
          updateData.status = "active";
        }
      }
    } else {
      // For sold auctions being reset, determine status based on new dates
      // BUT: If dates haven't changed, we should check the actual date values
      const originalStart = auction.startDate;
      const originalEnd = auction.endDate;
      const startChanged = start.getTime() !== originalStart.getTime();
      const endChanged = end.getTime() !== originalEnd.getTime();

      // If dates haven't changed, keep the original date logic but reset everything else
      if (!startChanged && !endChanged) {
        // Use the original date logic but with reset status
        if (originalStart > now) {
          updateData.status = "draft"; // Future date, start as draft
        } else if (originalStart <= now && originalEnd > now) {
          updateData.status = "active"; // Should be active now
        } else if (originalEnd <= now) {
          updateData.status = "ended"; // Already ended
        }
      } else {
        // If dates have changed, use the new dates
        if (start > now) {
          updateData.status = "draft"; // Future date, start as draft
        } else if (start <= now && end > now) {
          updateData.status = "active"; // Should be active now
        } else if (end <= now) {
          updateData.status = "ended"; // Already ended
        }
      }

      // Add reset fields to updateData for sold auctions
      updateData.bids = [];
      updateData.offers = [];
      updateData.currentPrice = parseFloat(startPrice);
      updateData.currentBidder = null;
      updateData.winner = null;
      updateData.finalPrice = null;
      updateData.bidCount = 0;
      updateData.paymentStatus = "pending";
      updateData.paymentMethod = null;
      updateData.paymentDate = null;
      updateData.transactionId = null;
      updateData.invoice = null;
      updateData.notifications = {
        ending30min: false,
        ending2hour: false,
        ending24hour: false,
        ending30minSentAt: null,
        ending2hourSentAt: null,
        ending24hourSentAt: null,
        offerReceived: false,
        offerExpiring: false,
      };
      updateData.lastBidTime = null;
      updateData.commissionAmount = 0;
      updateData.bidPaymentRequired = true;
    }

    const updatedAuction = await Auction.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("seller", "username firstName lastName");

    // Reschedule jobs if dates changed
    if (
      start.getTime() !== new Date(auction.startDate).getTime() ||
      end.getTime() !== new Date(auction.endDate).getTime()
    ) {
      await agendaService.cancelAuctionJobs(auction._id);

      // Only schedule activation if start date is in future
      if (start > new Date()) {
        await agendaService.scheduleAuctionActivation(auction._id, start);
      } else {
        // If start date is in past, activate immediately
        if (auction.status === "draft") {
          updatedAuction.status = "active";
          await updatedAuction.save();
        }
      }

      await agendaService.scheduleAuctionEnd(auction._id, end);
    }

    res.status(200).json({
      success: true,
      message: isSoldAuction
        ? "Sold auction has been reset and updated successfully"
        : "Auction updated successfully",
      data: { auction: updatedAuction },
      reset: isSoldAuction,
    });
  } catch (error) {
    console.error("Update auction error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error while updating auction",
    });
  }
};

export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = req.user;
    const { paymentStatus, paymentMethod, transactionId, notes } = req.body;

    // Find auction with populated data
    const auction = await Auction.findById(id)
      .populate("seller", "email username firstName lastName")
      .populate("winner", "email username firstName lastName");

    if (!auction) {
      return res.status(404).json({
        success: false,
        message: "Auction not found",
      });
    }

    // Validate auction is sold
    if (auction.status !== "sold" && auction.status !== "sold_buy_now") {
      return res.status(400).json({
        success: false,
        message: "Payment status can only be updated for sold auctions",
      });
    }

    // Validate payment status
    const validStatuses = [
      "pending",
      "processing",
      "completed",
      "failed",
      "refunded",
      "cancelled",
    ];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment status",
      });
    }

    // Handle invoice upload if provided
    let invoiceData = null;
    if (req.file) {
      const invoiceFile = req.file;
      try {
        const result = await uploadDocumentToCloudinary(
          invoiceFile.buffer,
          invoiceFile.originalname,
          "auction-invoices"
        );

        invoiceData = {
          url: result.secure_url,
          publicId: result.public_id,
          filename: invoiceFile.originalname,
          uploadedAt: new Date(),
          uploadedBy: admin._id,
        };
      } catch (uploadError) {
        console.error("Invoice upload error:", uploadError);
        return res.status(400).json({
          success: false,
          message: "Failed to upload invoice file",
        });
      }
    }

    // Update payment status and related fields
    auction.paymentStatus = paymentStatus;

    // Only update payment method if provided and status is not pending
    if (paymentMethod && paymentStatus !== "pending") {
      const validMethods = ["credit_card", "bank_transfer", "paypal", "other"];
      if (validMethods.includes(paymentMethod)) {
        auction.paymentMethod = paymentMethod;
      }
    }

    // Update transaction ID if provided
    if (transactionId && transactionId.trim() !== "") {
      auction.transactionId = transactionId.trim();
    }

    // Set payment date for completed status
    if (paymentStatus === "completed") {
      auction.paymentDate = new Date();
    }

    // Attach invoice if uploaded
    if (invoiceData) {
      auction.invoice = invoiceData;
    }

    await auction.save();

    // Populate updated auction
    const updatedAuction = await Auction.findById(id)
      .populate("seller", "username firstName lastName email phone address")
      .populate("winner", "username firstName lastName email phone address");

    res.status(200).json({
      success: true,
      message: `Payment status updated to ${paymentStatus}`,
      data: {
        auction: updatedAuction,
      },
    });

    if (paymentStatus === "completed" && updatedAuction.winner) {
      // Send payment success email to winner
      paymentCompletedEmail(
        updatedAuction?.winner,
        updatedAuction,
        updatedAuction?.finalPrice
      ).catch((error) =>
        console.error("Failed to send payment success email:", error)
      );
    }
  } catch (error) {
    console.error("Update payment status error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update payment status",
    });
  }
};

// export const fetchDVLAData = async (req, res) => {
//   try {
//     const { registrationNumber } = req.params;

//     // Make sure registrationNumber exists
//     if (!registrationNumber) {
//       return res.status(400).json({
//         success: false,
//         message: "Registration number is required",
//       });
//     }

//     // Call DVLA API with correct structure
//     const dvlaResponse = await backendAxios.post(
//       `https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiry/v1/vehicles`,
//       {
//         registrationNumber: registrationNumber
//       },
//       {
//         headers: {
//           "x-api-key": "kkrJPemNwS7mTx65GqRBH4njJd1fyz5h23k8udHD",
//           "Content-Type": "application/json",
//           // Optional: Add Accept header for good practice
//           "Accept": "application/json"
//         }
//       }
//     );

//     // DVLA API typically returns 200 for successful requests
//     // But let's check for any 2xx status code
//     if (dvlaResponse.status < 200 || dvlaResponse.status >= 300) {
//       return res.status(dvlaResponse.status).json({
//         success: false,
//         message: "Failed to fetch data from DVLA",
//         error: dvlaResponse.data
//       });
//     }

//     const vehicleData = dvlaResponse.data;

//     console.log("DVLA vehicle data:", vehicleData);

//     res.status(200).json({
//       success: true,
//       data: vehicleData,
//     });
//   } catch (error) {
//     console.error("Fetch DVLA data error:", error);

//     // Provide more specific error messages
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.error("Error response data:", error.response.data);
//       console.error("Error status:", error.response.status);
//       console.error("Error headers:", error.response.headers);

//       return res.status(error.response.status).json({
//         success: false,
//         message: `DVLA API error: ${error.response.status} - ${error.response.statusText}`,
//         error: error.response.data
//       });
//     } else if (error.request) {
//       // The request was made but no response was received
//       console.error("No response received:", error.request);
//       return res.status(503).json({
//         success: false,
//         message: "No response from DVLA API. Please try again later.",
//       });
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.error("Request setup error:", error.message);
//       return res.status(500).json({
//         success: false,
//         message: "Internal server error while fetching DVLA data",
//       });
//     }
//   }
// };

export const fetchDVLAData = async (req, res) => {
  try {
    const { registrationNumber } = req.body;

    if (!registrationNumber) {
      return res.status(400).json({
        success: false,
        message: "registrationNumber is required",
      });
    }

    const response = await axios.post(
      process.env.DVLA_WORKER_URL,
      { registrationNumber },
      { timeout: 10000 }
    );

    res.status(200).json({
      success: true,
      message: "Vehicle details fetched successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("DVLA Worker error:", error?.response?.data || error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch vehicle details",
    });
  }
};
