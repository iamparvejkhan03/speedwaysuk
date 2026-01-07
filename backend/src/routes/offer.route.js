import express from "express";
import {
  makeOffer,
  getMyOffers,
  getAuctionOffersForSeller,
  respondToOffer,
  acceptCounterOffer,
  withdrawOffer,
  getAllMyOffers,
  getAllOffersForSeller,
  cleanupExpiredOffers,
  getAdminAllOffers,
  getAdminAuctionOffers,
  adminRespondToOffer,
  adminCancelOffer,
  getAdminOfferStats,
  adminEndAuctionWithOffer,
  reactivateOffer
} from "../controllers/offer.controller.js";
import { auth, authAdmin } from "../middlewares/auth.middleware.js";

const offerRouter = express.Router();

// ============ OFFER ROUTES ============

// 1. Make an offer on an auction
// POST /api/v1/offers/auction/:id
offerRouter.post("/auction/:id", auth, makeOffer);

// 2. Get user's offers for a specific auction
// GET /api/v1/offers/auction/:id/my
offerRouter.get("/auction/:id/my", auth, getMyOffers);

// 3. Get all offers for seller's auction (seller only)
// GET /api/v1/offers/auction/:id/seller
offerRouter.get("/auction/:id/seller", auth, getAuctionOffersForSeller);

// 4. Seller responds to an offer (accept/reject/counter)
// POST /api/v1/offers/auction/:auctionId/offer/:offerId/respond
offerRouter.post("/auction/:auctionId/offer/:offerId/respond", auth, respondToOffer);

// 5. Buyer accepts a counter offer
// POST /api/v1/offers/auction/:auctionId/offer/:offerId/accept-counter
offerRouter.post("/auction/:auctionId/offer/:offerId/accept-counter", auth, acceptCounterOffer);

// 6. Buyer withdraws their offer
// POST /api/v1/offers/auction/:auctionId/offer/:offerId/withdraw
offerRouter.post("/auction/:auctionId/offer/:offerId/withdraw", auth, withdrawOffer);

// 7. Get all user's offers across all auctions
// GET /api/v1/offers/my
offerRouter.get("/my", auth, getAllMyOffers);

// 8. Get all offers for seller across all auctions
// GET /api/v1/offers/seller
offerRouter.get("/seller", auth, getAllOffersForSeller);

// 9. Clean up expired offers (admin/scheduled)
// POST /api/v1/offers/cleanup-expired
offerRouter.post("/cleanup-expired", auth, cleanupExpiredOffers);

// 10. Reactivate and accept a rejected offer
// POST /api/v1/offers/:offerId/reactivate
offerRouter.post('/:offerId/reactivate', auth, reactivateOffer);

offerRouter.get('/admin/all', auth, authAdmin, getAdminAllOffers);
offerRouter.get('/admin/auction/:auctionId', auth, authAdmin, getAdminAuctionOffers);
offerRouter.post('/admin/:offerId/respond', auth, authAdmin, adminRespondToOffer);
offerRouter.post('/admin/:offerId/cancel', auth, authAdmin, adminCancelOffer);
offerRouter.get('/admin/stats', auth, authAdmin, getAdminOfferStats);
offerRouter.post('/admin/:offerId/end-auction', auth, authAdmin, adminEndAuctionWithOffer);

export default offerRouter;