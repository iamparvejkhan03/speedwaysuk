import { model, Schema } from "mongoose";
import mongoose from "mongoose";
import agendaService from "../services/agendaService.js";

// Create a separate schema for offers
const offerSchema = new Schema(
  {
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    buyerUsername: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "rejected",
        "countered",
        "expired",
        "withdrawn",
      ],
      default: "pending",
    },
    sellerResponse: {
      type: String,
      trim: true,
    },
    counterOffer: {
      amount: Number,
      message: String,
    },
    expiresAt: {
      type: Date,
      default: function () {
        // Offers expire after 48 hours by default
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 48);
        return expiryDate;
      },
    },
  },
  {
    timestamps: true,
  }
);

const auctionSchema = new Schema(
  {
    // Basic Auction Info
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subTitle: { 
      type: String,
      trim: true,
    },
    specifications: {
      type: Map,
      of: Schema.Types.Mixed,
      default: new Map(),
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      trim: true,
    },
    videoLink: {
      type: String,
      trim: true,
    },

    // Features field (replaces avionics for cars)
    features: {
      type: String,
      default: "",
    },

    // Seller Information
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerUsername: {
      type: String,
      required: true,
    },

    // Pricing & Bidding
    startPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    currentPrice: {
      type: Number,
      default: function () {
        return this.startPrice;
      },
    },
    bidIncrement: {
      type: Number,
      required: false,
      min: 0,
    },
    reservePrice: {
      type: Number,
      min: 0,
    },
    buyNowPrice: {
      // NEW: Buy Now Price
      type: Number,
      min: 0,
    },
    auctionType: {
      type: String,
      enum: ["standard", "reserve", "buy_now"], // ADDED 'buy_now'
      required: true,
    },
    allowOffers: {
      // NEW: Allow users to make offers
      type: Boolean,
      default: false,
    },

    // Timing
    startDate: {
      type: Date,
      required: false,
    },
    endDate: {
      type: Date,
      required: false,
    },

    // Media - Updated for car auctions
    photos: [
      {
        url: String,
        publicId: String,
        filename: String,
        order: { type: Number, default: 0 },
      },
    ],
    documents: [
      {
        url: String,
        publicId: String,
        filename: String,
        originalName: String,
        documentType: { type: String, default: "general" },
      },
    ],
    serviceRecords: [
      {
        url: String,
        publicId: String,
        filename: String,
        originalName: String,
        order: { type: Number, default: 0 },
      },
    ],

    // Bidding
    bids: [
      {
        bidder: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        bidderUsername: String,
        amount: Number,
        timestamp: {
          type: Date,
          default: Date.now,
        },
        isBuyNow: {
          // NEW: Flag for buy now purchases
          type: Boolean,
          default: false,
        },
      },
    ],
    currentBidder: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    bidCount: {
      type: Number,
      default: 0,
    },

    // Offers - NEW: Array of offers
    offers: [offerSchema],

    // Status
    status: {
      type: String,
      enum: [
        "draft",
        "active",
        "approved",
        "ended",
        "cancelled",
        "sold",
        "reserve_not_met",
        "sold_buy_now",
      ], // ADDED 'sold_buy_now'
      default: "draft",
    },
    winner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    finalPrice: {
      type: Number,
    },

    commissionAmount: {
      type: Number,
      default: 0,
    },
    bidPaymentRequired: {
      type: Boolean,
      default: true,
    },

    // Metadata
    views: {
      type: Number,
      default: 0,
    },
    watchlistCount: {
      type: Number,
      default: 0,
    },

    // Auto-extend auction if bids near end time
    autoExtend: {
      type: Boolean,
      default: true,
    },
    lastBidTime: Date,
    notifications: {
      ending30min: { type: Boolean, default: false },
      ending2hour: { type: Boolean, default: false },
      ending24hour: { type: Boolean, default: false },
      ending30minSentAt: Date,
      ending2hourSentAt: Date,
      ending24hourSentAt: Date,
      offerReceived: { type: Boolean, default: false }, // NEW: Offer notifications
      offerExpiring: { type: Boolean, default: false },
    },
    // In your auction.model.js schema
    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "processing",
        "completed",
        "failed",
        "refunded",
        "cancelled",
      ],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "bank_transfer", "paypal", "other", null],
      default: null,
    },
    paymentDate: {
      type: Date,
    },
    transactionId: {
      type: String,
    },
    invoice: {
      url: String,
      publicId: String,
      filename: String,
      uploadedAt: Date,
      uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better performance
auctionSchema.index({ status: 1, endDate: 1 });
auctionSchema.index({ seller: 1, createdAt: -1 });
auctionSchema.index({ category: 1, status: 1 });
auctionSchema.index({ startDate: 1, endDate: 1 });
auctionSchema.index({ "offers.status": 1 }); // NEW: Index for offer status
auctionSchema.index({ "offers.expiresAt": 1 }); // NEW: Index for offer expiry

// Virtual for time remaining
auctionSchema.virtual("timeRemaining").get(function () {
  if (this.status !== "active") return 0;
  return Math.max(0, this.endDate - new Date());
});

// Check if auction is about to end
auctionSchema.methods.isEndingSoon = function () {
  return this.timeRemaining < 5 * 60 * 1000;
};

// Get ending soon auctions
auctionSchema.statics.getEndingSoonAuctions = function () {
  return this.find({
    status: "active",
    endDate: { $gt: new Date() },
    timeRemaining: { $lt: 15 * 60 * 1000 },
  });
};

auctionSchema.virtual("timeRemainingFormatted").get(function () {
  if (!this.isActive) return "Auction ended";

  const ms = this.timeRemaining;
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
});

// Virtual for isActive
auctionSchema.virtual("isActive").get(function () {
  return this.status === "active" && new Date() < this.endDate;
});

// NEW: Virtual for isBuyNowAvailable
auctionSchema.virtual("isBuyNowAvailable").get(function () {
  return (
    this.buyNowPrice &&
    this.auctionType === "buy_now" &&
    this.status === "active" &&
    !this.winner
  );
});

// Method to place a bid
auctionSchema.methods.placeBid = async function (
  bidderId,
  bidderUsername,
  amount
) {
  const now = new Date();

  // Safety net: if agenda job missed activation, activate now
  if (this.status === "draft" && now >= this.startDate && now < this.endDate) {
    this.status = "active";
    await agendaService.scheduleAuctionEnd(this._id, this.endDate);
  }

  if (this.status !== "active") {
    throw new Error("Auction is not active");
  }

  if (now >= this.endDate) {
    throw new Error("Auction has ended");
  }

  const minBid =
    this.bidCount === 0
      ? this.currentPrice
      : this.currentPrice + this.bidIncrement;
  if (amount < minBid) {
    throw new Error(`Bid must be at least $${minBid}`);
  }

  // Add bid
  this.bids.push({
    bidder: bidderId,
    bidderUsername,
    amount,
    timestamp: now,
    isBuyNow: false,
  });

  this.currentPrice = amount;
  this.currentBidder = bidderId;
  this.bidCount += 1;
  this.lastBidTime = now;

  // Auto-extend if bidding near end time (last 5 minutes)
  if (this.autoExtend) {
    const timeRemaining = this.endDate - now;
    if (timeRemaining < 2 * 60 * 1000) {
      const newEndDate = new Date(this.endDate.getTime() + 2 * 60 * 1000);
      this.endDate = newEndDate;
      await agendaService.cancelAuctionJobs(this._id);
      await agendaService.scheduleAuctionEnd(this._id, newEndDate);
    }
  }

  return this.save();
};

// NEW: Method to buy now
auctionSchema.methods.buyNow = async function (buyerId, buyerUsername) {
  const now = new Date();

  if (this.status !== "active") {
    throw new Error("Auction is not active");
  }

  if (!this.buyNowPrice) {
    throw new Error("Buy Now is not available for this auction");
  }

  if (now >= this.endDate) {
    throw new Error("Auction has ended");
  }

  // Add buy now as a bid with special flag
  this.bids.push({
    bidder: buyerId,
    bidderUsername: buyerUsername,
    amount: this.buyNowPrice,
    timestamp: now,
    isBuyNow: true,
  });

  // Set auction as sold
  this.currentPrice = this.buyNowPrice;
  this.currentBidder = buyerId;
  // this.bidCount += 1;
  this.winner = buyerId;
  this.finalPrice = this.buyNowPrice;
  this.status = "sold";
  this.endDate = now; // End auction immediately

  // Reject all pending offers (if any)
  this.offers.forEach((offer) => {
    if (offer.status === "pending") {
      offer.status = "rejected";
      offer.sellerResponse = "Offer rejected - item purchased via Buy Now";
    }
  });

  // Cancel any scheduled jobs
  await agendaService.cancelAuctionJobs(this._id);

  return this.save();
};

// NEW: Method to make an offer
auctionSchema.methods.makeOffer = async function (
  buyerId,
  buyerUsername,
  amount,
  message = ""
) {
  const now = new Date();

  if (!this.allowOffers) {
    throw new Error("Offers are not allowed for this auction");
  }

  if (this.status !== "active") {
    throw new Error("Auction is not active");
  }

  if (now >= this.endDate) {
    throw new Error("Auction has ended");
  }

  // Check if buyer already has a pending offer
  const existingPendingOffer = this.offers.find(
    (offer) =>
      offer.buyer.toString() === buyerId.toString() &&
      offer.status === "pending"
  );

  if (existingPendingOffer) {
    throw new Error("You already have a pending offer for this auction");
  }

  // Add offer
  this.offers.push({
    buyer: buyerId,
    buyerUsername,
    amount,
    message,
    status: "pending",
    expiresAt: new Date(now.getTime() + 48 * 60 * 60 * 1000), // 48 hours
  });

  // Set notification flag
  this.notifications.offerReceived = true;

  return this.save();
};

// NEW: Method to respond to an offer
auctionSchema.methods.respondToOffer = async function (
  offerId,
  response,
  counterAmount = null,
  counterMessage = ""
) {
  const offer = this.offers.id(offerId);

  if (!offer) {
    throw new Error("Offer not found");
  }

  if (offer.status !== "pending") {
    throw new Error("Offer has already been responded to");
  }

  if (new Date() > offer.expiresAt) {
    offer.status = "expired";
    return this.save();
  }

  switch (response) {
    case "accept":
      // Accept the offer - end auction and mark as sold
      offer.status = "accepted";
      this.currentPrice = offer.amount;
      this.currentBidder = offer.buyer;
      this.winner = offer.buyer;
      this.finalPrice = offer.amount;
      this.status = "sold";
      this.endDate = new Date(); // End auction immediately

      // Reject all other pending offers
      this.offers.forEach((o) => {
        if (o.status === "pending" && o._id.toString() !== offerId) {
          o.status = "rejected";
          o.sellerResponse = "Offer rejected - auction sold to another buyer";
        }
      });

      // Cancel any scheduled jobs
      await agendaService.cancelAuctionJobs(this._id);
      break;

    case "reject":
      offer.status = "rejected";
      offer.sellerResponse = "Offer rejected";
      break;

    case "counter":
      if (!counterAmount) {
        throw new Error("Counter amount is required");
      }
      offer.status = "countered";
      offer.counterOffer = {
        amount: counterAmount,
        message: counterMessage,
      };
      break;

    default:
      throw new Error("Invalid response type");
  }

  return this.save();
};

// NEW: Method for buyer to respond to counter offer
auctionSchema.methods.respondToCounterOffer = async function (offerId, accept) {
  const offer = this.offers.id(offerId);

  if (!offer) {
    throw new Error("Offer not found");
  }

  if (offer.status !== "countered") {
    throw new Error("This offer is not in countered status");
  }

  if (new Date() > offer.expiresAt) {
    offer.status = "expired";
    return this.save();
  }

  if (accept) {
    // Accept the counter offer
    offer.status = "accepted";
    this.currentPrice = offer.counterOffer.amount;
    this.currentBidder = offer.buyer;
    this.winner = offer.buyer;
    this.finalPrice = offer.counterOffer.amount;
    this.status = "sold";
    this.endDate = new Date();

    // Reject all other pending offers
    this.offers.forEach((o) => {
      if (o.status === "pending" && o._id.toString() !== offerId) {
        o.status = "rejected";
        o.sellerResponse = "Offer rejected - auction sold to another buyer";
      }
    });

    // Cancel any scheduled jobs
    await agendaService.cancelAuctionJobs(this._id);
  } else {
    // Reject the counter offer
    offer.status = "rejected";
    offer.sellerResponse = "Counter offer rejected by buyer";
  }

  return this.save();
};

// NEW: Method to withdraw an offer
auctionSchema.methods.withdrawOffer = async function (offerId, userId) {
  const offer = this.offers.id(offerId);

  if (!offer) {
    throw new Error("Offer not found");
  }

  if (offer.buyer._id.toString() !== userId.toString()) {
    throw new Error("You can only withdraw your own offers");
  }

  if (offer.status !== "pending") {
    throw new Error("Only pending offers can be withdrawn");
  }

  offer.status = "withdrawn";
  return this.save();
};

// Suggested model methods:
auctionSchema.methods.markPaymentProcessing = function () {
  this.paymentStatus = "processing";
  return this.save();
};

auctionSchema.methods.markPaymentCompleted = function (
  transactionId,
  paymentMethod
) {
  this.paymentStatus = "completed";
  this.paymentDate = new Date();
  this.transactionId = transactionId;
  this.paymentMethod = paymentMethod;
  return this.save();
};

auctionSchema.methods.markPaymentFailed = function () {
  this.paymentStatus = "failed";
  return this.save();
};

auctionSchema.virtual("isPaymentPending").get(function () {
  return this.paymentStatus === "pending";
});

auctionSchema.virtual("isPaymentCompleted").get(function () {
  return this.paymentStatus === "completed";
});

auctionSchema.methods.attachInvoice = function (
  url,
  publicId,
  filename,
  uploadedBy
) {
  this.invoice = {
    url,
    publicId,
    filename,
    uploadedAt: new Date(),
    uploadedBy,
  };
  return this.save();
};

auctionSchema.methods.removeInvoice = function () {
  this.invoice = undefined;
  return this.save();
};

auctionSchema.virtual("hasInvoice").get(function () {
  return !!(this.invoice && this.invoice.url);
});

// Method to check if reserve is met
auctionSchema.methods.isReserveMet = function () {
  if (this.auctionType !== "reserve") return true;
  return this.currentPrice >= this.reservePrice;
};

// Method to end auction
auctionSchema.methods.endAuction = function () {
  if (this.status !== "active") return;

  this.status = "ended";

  // For standard auctions OR reserve auctions that met reserve
  if (
    this.bidCount > 0 &&
    (this.auctionType === "standard" || this.isReserveMet())
  ) {
    this.status = "sold";
    this.winner = this.currentBidder;
    this.finalPrice = this.currentPrice;
  } else if (this.auctionType === "reserve" && !this.isReserveMet()) {
    this.status = "reserve_not_met";
  }

  // Also reject any pending offers when auction ends
  this.offers.forEach((offer) => {
    if (offer.status === "pending") {
      offer.status = "expired";
      offer.sellerResponse = "Offer expired - auction ended";
    }
  });

  return this.save();
};

// Static method to get active auctions
auctionSchema.statics.getActiveAuctions = function () {
  return this.find({
    status: "active",
    endDate: { $gt: new Date() },
  }).populate("seller", "username firstName lastName");
};

// NEW: Method to get auctions with offers for a specific user
auctionSchema.statics.getAuctionsWithOffersForUser = function (userId) {
  return this.find({
    $or: [{ seller: userId }, { "offers.buyer": userId }],
  }).populate("seller", "username firstName lastName");
};

// Pre-save middleware
auctionSchema.pre("save", function (next) {
  // Ensure current price is at least start price
  if (this.currentPrice < this.startPrice) {
    this.currentPrice = this.startPrice;
  }

  // Validate end date is after start date
  if (this.endDate && this.startDate && this.endDate <= this.startDate) {
    return next(new Error("End date must be after start date"));
  }

  // Validate buy now price is higher than start price
  if (this.buyNowPrice && this.buyNowPrice < this.startPrice) {
    return next(
      new Error("Buy Now price must be greater than or equal to start price")
    );
  }

  // Validate buy now price is higher than reserve price for reserve auctions
  if (
    this.auctionType === "reserve" &&
    this.buyNowPrice &&
    this.buyNowPrice < this.reservePrice
  ) {
    return next(
      new Error("Buy Now price must be greater than or equal to reserve price")
    );
  }

  next();
});

// Pre-remove middleware
auctionSchema.pre("remove", async function (next) {
  try {
    await agendaService.cancelAuctionJobs(this._id);
    next();
  } catch (error) {
    next(error);
  }
});

// Update when auction dates change
auctionSchema.pre("save", async function (next) {
  if (this.isModified("startDate") || this.isModified("endDate")) {
    try {
      await agendaService.cancelAuctionJobs(this._id);
      if (this.status === "draft") {
        await agendaService.scheduleAuctionActivation(this._id, this.startDate);
      }
      if (this.status === "draft" || this.status === "active") {
        await agendaService.scheduleAuctionEnd(this._id, this.endDate);
      }
    } catch (error) {
      console.error("Error rescheduling agenda jobs:", error);
    }
  }
  next();
});

// NEW: Middleware to clean up expired offers
auctionSchema.methods.cleanupExpiredOffers = function () {
  const now = new Date();
  let changed = false;

  this.offers.forEach((offer) => {
    if (offer.status === "pending" && now > offer.expiresAt) {
      offer.status = "expired";
      offer.sellerResponse = "Offer expired";
      changed = true;
    }
  });

  if (changed) {
    return this.save();
  }
  return Promise.resolve(this);
};

const Auction = model("Auction", auctionSchema);
const Offer = model("Offer", offerSchema);

export { Offer };
export default Auction;