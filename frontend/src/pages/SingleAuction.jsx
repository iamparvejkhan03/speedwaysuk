import { CalendarDays, CheckSquare, Clock, Download, File, Fuel, Gauge, Gavel, Heart, Loader, MapPin, MessageCircle, PaintBucket, Plane, ShieldCheck, Tag, User, Users, Weight, Zap, PoundSterling } from "lucide-react";
import { BidConfirmationModal, BuyNowModal, Container, LoadingSpinner, MobileBidStickyBar, SpecificationsSection, TabSection, TimerDisplay, WatchlistButton } from "../components";
import { Link, useNavigate, useParams } from "react-router-dom";
import { lazy, Suspense, useRef, useState, useEffect } from "react";
import useAuctionCountdown from "../hooks/useAuctionCountDown";
import axiosInstance from "../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { useComments } from "../hooks/useComments";
import { useWatchlist } from "../hooks/useWatchlist";
import { useAuth } from "../contexts/AuthContext";

const YouTubeEmbed = lazy(() => import('../components/YouTubeEmbed'));
const ImageLightBox = lazy(() => import('../components/ImageLightBox'));
const MakeOfferModal = lazy(() => import('../components/MakeOfferModal'));

function SingleAuction() {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bidding, setBidding] = useState(false);
    const [buying, setBuying] = useState(false);
    const [makingOffer, setMakingOffer] = useState(false);
    const [bidAmount, setBidAmount] = useState('');
    const [offerAmount, setOfferAmount] = useState('');
    const [offerMessage, setOfferMessage] = useState('');
    const [isMakeOfferModalOpen, setIsMakeOfferModalOpen] = useState(false);
    const bidSectionRef = useRef(null);
    const commentSectionRef = useRef(null);
    const auctionTime = useAuctionCountdown(auction);
    const countdown = useAuctionCountdown(auction);
    const [activeTab, setActiveTab] = useState('description');
    const { pagination } = useComments(id);
    const { isWatchlisted, toggleWatchlist, watchlistCount } = useWatchlist(id);
    const hasFetchedRef = useRef(false);
    const [isBidModalOpen, setIsBidModalOpen] = useState(false);
    const formRef = useRef();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showBuyNowModal, setShowBuyNowModal] = useState(false);

    const updateAuctionState = (updatedAuction) => {
        setAuction(updatedAuction);
    };

    const handleOpenBidModal = () => {
        setIsBidModalOpen(true);
    };

    const handleConfirmBid = (e) => {
        handleBid(e);
        setIsBidModalOpen(false);
    };

    const handleCloseBidModal = () => {
        setIsBidModalOpen(false);
    };

    const handleOpenMakeOfferModal = () => {
        setIsMakeOfferModalOpen(true);
    };

    const handleCloseMakeOfferModal = () => {
        setIsMakeOfferModalOpen(false);
        setOfferAmount('');
        setOfferMessage('');
    };

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                setLoading(true);
                const { data } = await axiosInstance.get(`/api/v1/auctions/${id}`);
                if (data.success) {
                    setAuction(data.data.auction);
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Failed to fetch auction');
                console.error('Fetch auction error:', error);
            } finally {
                setLoading(false);
            }
        };

        if (countdown?.status === 'ended') {
            const timer = setTimeout(() => {
                fetchAuction();
            }, 2000);
            return () => clearTimeout(timer);
        } else if (!hasFetchedRef.current) {
            hasFetchedRef.current = true;
            fetchAuction();
        }
    }, [id, countdown?.status]);

    const scrollToBidSection = () => {
        bidSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    const scrollToCommentSection = () => {
        commentSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    const handleTabClick = (tabId) => {
        setActiveTab(tabId);
        if (tabId === 'comments' || tabId === 'bids') {
            scrollToCommentSection();
        }
    };

    // ============= BID HANDLER =============
    const handleBid = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('You must login to bid.');
            navigate('/login');
            return;
        }

        if (user._id?.toString() === auction?.seller?._id?.toString()) {
            toast.error(`You can't bid on your own auction.`);
            return;
        }

        if (!bidAmount || (parseFloat(bidAmount) <= auction.currentPrice && auction.bidCount > 0)) {
            toast.error(`Bid must be higher than current price: £${auction.currentPrice}`);
            return;
        }

        try {
            setBidding(true);

            // Check if user needs to make payment intent (first bid by this user)
            const { data: userBidPayments } = await axiosInstance.get(`/api/v1/bid-payments/auction/${id}`);
            const activePayments = userBidPayments.data.bidPayments.filter(
                payment => payment.status !== 'canceled' && payment.type === 'bid_authorization'
            );

            const hasExistingPayment = activePayments.length > 0;

            if (!hasExistingPayment) {
                // Get commission amount from backend
                const { data: commissionData } = await axiosInstance.get(`/api/v1/admin/commissions`);
                const commission = commissionData.data.commissions.find(c => c.category === auction.category);
                const commissionAmount = commission ? commission.commissionAmount : 0;

                if (commissionAmount > 0) {
                    const userConfirmed = window.confirm(
                        `A £${commissionAmount} temporary hold will be placed on your credit card for bidding. This amount will be released after the auction ends if you are not the winning bidder. Continue?`
                    );

                    if (!userConfirmed) {
                        toast.error('Payment is required to place bid');
                        setBidding(false);
                        return;
                    }

                    // Create payment intent only after user confirms
                    await axiosInstance.post('/api/v1/bid-payments/create-intent', {
                        auctionId: id,
                        bidAmount: parseFloat(bidAmount)
                    });
                }
            }

            // Place the bid after payment is handled
            const { data } = await axiosInstance.post(`/api/v1/auctions/bid/${id}`, {
                amount: parseFloat(bidAmount)
            });

            if (data.success) {
                setAuction(data.data.auction);
                setBidAmount('');
                toast.success('Bid placed successfully!');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to place bid');
            console.error('Bid error:', error);
        } finally {
            setBidding(false);
        }
    };

    // ============= BUY NOW HANDLER =============
    const handleBuyNow = async () => {
        if (!user) {
            toast.error('You must login to buy now.');
            navigate('/login');
            return;
        }

        if (user._id?.toString() === auction?.seller?._id?.toString()) {
            toast.error(`You can't buy your own auction.`);
            return;
        }

        if (!auction.buyNowPrice) {
            toast.error('Buy Now is not available for this auction.');
            return;
        }

        if (countdown.status !== 'counting-down') {
            toast.error('Auction is not active.');
            return;
        }

        // const userConfirmed = window.confirm(
        //     `Are you sure you want to buy this item for £${auction.buyNowPrice.toLocaleString()}? This will end the auction immediately and you will be the winner.`
        // );

        // if (!userConfirmed) {
        //     return;
        // }

        try {
            setBuying(true);

            // Execute Buy Now - SIMPLIFIED VERSION
            const { data } = await axiosInstance.post(`/api/v1/buy-now/${id}`);

            if (data.success) {
                setAuction(data.data.auction);
                toast.success('Congratulations! You have purchased this item.');

                // Optionally scroll to show success message
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to complete Buy Now purchase');
            console.error('Buy Now error:', error);
        } finally {
            setBuying(false);
        }
    };

    // ============= MAKE OFFER HANDLER =============
    const handleMakeOffer = async (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('You must login to make an offer.');
            navigate('/login');
            return;
        }

        if (user._id?.toString() === auction?.seller?._id?.toString()) {
            toast.error(`You can't make an offer on your own auction.`);
            return;
        }

        if (!auction.allowOffers) {
            toast.error('Offers are not allowed for this auction.');
            return;
        }

        if (!offerAmount || parseFloat(offerAmount) <= 0) {
            toast.error('Please enter a valid offer amount.');
            return;
        }

        if (parseFloat(offerAmount) < auction.startPrice) {
            toast.error(`Offer must be at least £${auction.startPrice}`);
            return;
        }

        if (auction.buyNowPrice && parseFloat(offerAmount) >= auction.buyNowPrice) {
            toast.error(`Offer is higher than Buy Now price. Consider using Buy Now instead.`);
            return;
        }

        try {
            setMakingOffer(true);

            const { data } = await axiosInstance.post(`/api/v1/offers/auction/${id}`, {
                amount: parseFloat(offerAmount),
                message: offerMessage
            });

            if (data.success) {
                // Update auction state
                setAuction(data.data.auction);

                handleCloseMakeOfferModal();
                toast.success('Your offer has been submitted successfully!');

                // Switch to offers tab
                setActiveTab('offers');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to submit offer');
        } finally {
            setMakingOffer(false);
        }
    };

    // Handle document download
    const handleDocumentDownload = (documentUrl, filename) => {
        const link = document.createElement('a');
        link.href = documentUrl;
        link.download = filename;
        link.target = '_blank';
        link.click();
    };

    // Extract YouTube ID from URL
    const getYouTubeId = (url) => {
        if (!url) return null;
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    };

    const youtubeVideoId = getYouTubeId(auction?.videoLink);
    const minBidAmount = auction?.bidCount > 0 ? auction?.currentPrice + auction?.bidIncrement : auction?.currentPrice;

    // Check if Buy Now is available
    const isBuyNowAvailable = auction?.buyNowPrice &&
        auction?.auctionType === 'buy_now' &&
        countdown?.status === 'counting-down' &&
        !auction?.winner;

    // Check if Make Offer is available
    const isMakeOfferAvailable = auction?.allowOffers &&
        countdown?.status === 'counting-down' &&
        !auction?.winner;

    if (loading) {
        return (
            <Container className="py-32 min-h-[70vh] flex items-center justify-center">
                <LoadingSpinner size="large" />
            </Container>
        );
    }

    if (!auction) {
        return (
            <Container className="py-32 min-h-[70vh] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-600">Auction not found</h2>
                    <Link to="/auctions" className="text-[#edcd1f] hover:underline mt-4 inline-block">
                        Back to Auctions
                    </Link>
                </div>
            </Container>
        );
    }

    return (
        <Container className={`pt-32 pb-16 min-h-[70vh] grid grid-cols-1 lg:grid-cols-3 items-start gap-10`}>
            <section className="col-span-1 lg:col-span-2">
                {/* Title and top section */}
                <div className="flex flex-wrap gap-2 capitalize justify-between items-center text-secondary">
                    <Link to={`/auctions?category=${auction.category}`} className="underline">
                        Category: {auction.category}
                    </Link>
                    <div className="flex items-center gap-3">
                        <p onClick={toggleWatchlist}
                            className={`flex items-center gap-2 py-1 px-3 border border-gray-200 rounded-full transition-colors ${isWatchlisted
                                ? 'bg-gray-100 text-black hover:bg-gray-200'
                                : 'text-secondary hover:bg-gray-200'
                                } disabled:opacity-50`}>
                            <Heart size={18} fill={isWatchlisted ? 'currentColor' : 'none'} />
                            <span>{watchlistCount || auction?.watchlistCount || 0}</span>
                        </p>

                        <p onClick={() => handleTabClick('comments')}
                            className="flex items-center gap-2 border border-gray-200 py-1 px-3 rounded-full cursor-pointer hover:bg-gray-100">
                            <MessageCircle size={18} />
                            <span>{pagination?.totalComments || 0}</span>
                        </p>

                        {/* <p onClick={() => handleTabClick('bids')}
                            className="flex items-center gap-2 border border-gray-200 py-1 px-3 rounded-full cursor-pointer hover:bg-gray-100">
                            <Gavel size={20} />
                            <span>{auction.bids?.length || 0}</span>
                        </p> */}

                        {/* Offers Count */}
                        {auction.offers && auction.offers.length > 0 && (
                            <p onClick={() => handleTabClick('offers')}
                                className="flex items-center gap-2 border border-gray-200 py-1 px-3 rounded-full cursor-pointer hover:bg-gray-100">
                                <PoundSterling size={18} />
                                <span>{auction.offers.filter(o => o.status === 'pending').length}</span>
                            </p>
                        )}
                    </div>
                </div>

                <div className="my-5">
                    <MobileBidStickyBar
                        currentBid={auction.currentPrice}
                        timeRemaining={countdown}
                        onBidClick={() => scrollToBidSection()}
                        buyNowPrice={auction.buyNowPrice}
                        onBuyNowClick={isBuyNowAvailable ? handleBuyNow : null}
                        onMakeOfferClick={isMakeOfferAvailable ? handleOpenMakeOfferModal : null}
                        allowOffers={auction.allowOffers}
                        auctionType={auction.auctionType}
                        status={countdown.status}
                    />
                </div>

                {/* Buy Now Badge */}
                {isBuyNowAvailable && (
                    <div className="mb-4 inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                        <Zap size={16} />
                        <span className="font-semibold">Buy Now Available: £{auction.buyNowPrice.toLocaleString()}</span>
                    </div>
                )}

                {/* Image section */}
                <ImageLightBox images={auction.photos} auctionType={auction?.auctionType} isReserveMet={auction.currentPrice >= auction.reservePrice} />

                <hr className="my-8" />

                <h2 className="text-2xl md:text-3xl font-semibold my-4 text-primary">{auction.title}</h2>
                <h3 className="text-lg md:text-xl font-semibold text-primary">{auction?.subTitle}</h3>

                <hr className="my-8" />

                {/* Info section */}
                <div>
                    {/* <h3 className="my-5 text-primary text-xl font-semibold">Auction Overview</h3> */}

                    {/* Dynamic Specifications Section */}
                    <SpecificationsSection auction={auction} />
                </div>

                {/* Features Section */}
                {auction.features && (
                    <>
                        <div>
                            <hr className="my-8" />
                            <h3 className="my-5 text-primary text-xl font-semibold">Features & Options</h3>
                            <div className="prose prose-lg max-w-none border rounded-lg px-6 py-3 bg-white text-md">
                                {auction.features ? (
                                    <div dangerouslySetInnerHTML={{ __html: auction.features }} />
                                ) : (
                                    <p className="text-gray-500">No Features provided.</p>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Document section */}
                {auction.documents && auction.documents.length > 0 && (
                    <div>
                        <hr className="my-8" />
                        <h3 className="my-5 text-primary text-xl font-semibold">Document(s)</h3>
                        <div className="flex gap-5 max-w-full flex-wrap">
                            {auction.documents.map((doc, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleDocumentDownload(doc.url, doc.originalName || doc.filename)}
                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 cursor-pointer border border-gray-200 py-3 px-5 rounded-md text-secondary group hover:text-primary"
                                >
                                    <File size={20} className="flex-shrink-0" />
                                    <span className="group-hover:underline max-w-[125px] truncate">
                                        {doc.originalName || doc.filename}
                                    </span>
                                    <Download size={20} className="flex-shrink-0" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Service Records Section */}
                {auction.serviceRecords && auction.serviceRecords.length > 0 && (
                    <>
                        <div>
                            <h3 className="my-5 text-primary text-xl font-semibold">Service Records</h3>
                            <ImageLightBox
                                images={auction.serviceRecords}
                                type="logbooks"
                            />
                        </div>
                    </>
                )}

                {/* Video section */}
                {youtubeVideoId && (
                    <>
                        <hr className="my-8" />
                        <div>
                            <h3 className="my-5 text-primary text-xl font-semibold">Video Look</h3>
                            <Suspense fallback={<LoadingSpinner />}>
                                <YouTubeEmbed videoId={youtubeVideoId} title={auction.title} />
                            </Suspense>
                        </div>
                    </>
                )}

                <hr className="my-8" />

                <Suspense fallback={<LoadingSpinner />}>
                    <TabSection
                        ref={commentSectionRef}
                        description={auction.description}
                        bids={auction.bids}
                        offers={auction.offers}
                        auction={auction}
                        activatedTab={activeTab}
                        onAuctionUpdate={updateAuctionState}
                    />
                </Suspense>

            </section>

            {/* Bid Section */}
            <section ref={bidSectionRef} className="col-span-1 lg:col-span-1 border border-gray-200 bg-gray-100 rounded-lg sticky top-24">
                {/* Timer section */}
                <TimerDisplay countdown={countdown} auction={auction} />

                <hr className="mx-6" />

                {/* Current bid section */}
                <div className="p-4 flex flex-col gap-3">
                    {/* <div className="flex flex-col gap-2">
                        <p className="font-light">{auction.bidCount > 0 ? 'Current Bid' : 'Start Bidding At'}</p>
                        <p className="flex items-center gap-1 text-3xl sm:text-4xl font-medium">
                            <span>£ </span>
                            <span> {auction.currentPrice.toLocaleString()}</span>
                        </p>
                    </div> */}

                    {
                        auction.allowOffers && (
                            <>
                                {/* <div className="flex flex-col gap-2">
                                    <p className="font-light">{auction.bidCount > 0 ? 'Current Offer' : 'Offer Starting At'}</p>
                                    <p className="flex items-center gap-1 text-3xl sm:text-4xl font-medium">
                                        <span>£ </span>
                                        <span> {auction.currentPrice.toLocaleString()}</span>
                                    </p>
                                </div> */}

                                <div className="flex flex-col gap-2">
                                    <p className="font-light">{auction.status === 'sold' ? 'Final Offer' : 'Offer Starting At'}</p>
                                    <p className="flex items-center gap-1 text-3xl sm:text-4xl font-medium">
                                        <span>£ </span>
                                        <span> {auction.currentPrice.toLocaleString()}</span>
                                    </p>
                                </div>

                                {/* <p className="flex w-full justify-between border-b pb-2">
                                    <span className="text-secondary">Starting Offer</span>
                                    <span className="font-medium">£ {auction.startPrice.toLocaleString()}</span>
                                </p> */}

                                <p className="flex w-full justify-between border-b pb-2">
                                    <span className="text-secondary">No. of Offers</span>
                                    <span className="font-medium">{auction?.offers?.length}</span>
                                </p>
                            </>
                        )
                    }

                    {/* {auction.auctionType === 'reserve' && (
                        <p className={`${auction.currentPrice >= auction.reservePrice ? 'text-green-600' : 'text-secondary'}`}>
                            {auction.currentPrice >= auction.reservePrice ? 'Reserve Met' : 'Reserve Not Met'}
                        </p>
                    )} */}



                    {/* <p className="flex w-full justify-between border-b pb-2">
                        <span className="text-secondary">No. of Bids</span>
                        <span className="font-medium">{auction.bidCount}</span>
                    </p> */}

                    {/* <p className="flex w-full justify-between border-b pb-2">
                        <span className="text-secondary">Min. Bid Increment</span>
                        <span className="font-medium">${auction?.bidIncrement?.toLocaleString()}</span>
                    </p> */}

                    {/* Buy Now Price Display */}
                    {auction.buyNowPrice && (
                        <div className="bg-white border border-green-300 rounded-lg p-3 mb-2">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-secondary text-sm">Buy Now Price</p>
                                    <p className="text-2xl font-bold text-green-600">£{auction.buyNowPrice.toLocaleString()}</p>
                                </div>
                                <Zap className="text-green-500" size={24} />
                            </div>
                        </div>
                    )}

                    {/* Conditional Action Buttons based on auction status */}
                    {countdown.status === 'counting-down' ? (
                        <>
                            {/* Bid Form */}
                            {/* <form ref={formRef} onSubmit={handleBid} className="flex flex-col gap-4">
                                <input
                                    type="number"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    className="py-3 px-5 w-full rounded-lg focus:outline-2 focus:outline-primary"
                                    placeholder={`Bid £${auction.bidCount > 0 ? minBidAmount : auction.startPrice} or higher`}
                                    min={minBidAmount}
                                />
                                <button
                                    type="button"
                                    disabled={bidding}
                                    onClick={() => handleOpenBidModal(bidAmount)}
                                    className="flex items-center justify-center gap-2 w-full bg-primary text-white py-3 px-6 cursor-pointer rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
                                >
                                    {bidding ? (
                                        <Loader size={16} className="animate-spin-slow" />
                                    ) : (
                                        <>
                                            <Gavel />
                                            <span>Place Bid</span>
                                        </>
                                    )}
                                </button>

                                <BidConfirmationModal
                                    isOpen={isBidModalOpen}
                                    onClose={handleCloseBidModal}
                                    onConfirm={handleConfirmBid}
                                    bidAmount={bidAmount}
                                    auction={auction}
                                    ref={formRef}
                                />
                            </form> */}

                            {/* Buy Now Button */}
                            {isBuyNowAvailable && (
                                <>
                                    <button
                                        onClick={() => setShowBuyNowModal(true)}
                                        disabled={buying || !isBuyNowAvailable}
                                        className="flex items-center justify-center gap-2 w-full bg-green-600 text-white py-3 px-6 cursor-pointer rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                                    >
                                        {buying ? (
                                            <Loader size={16} className="animate-spin-slow" />
                                        ) : (
                                            <>
                                                <Zap />
                                                <span>Buy Now £{auction.buyNowPrice.toLocaleString()}</span>
                                            </>
                                        )}
                                    </button>

                                    <BuyNowModal
                                        isOpen={showBuyNowModal}
                                        onClose={() => setShowBuyNowModal(false)}
                                        onConfirm={handleBuyNow}
                                        auction={auction}
                                        loading={buying}
                                    />
                                </>
                            )}

                            {/* Make Offer Button */}
                            {isMakeOfferAvailable && (
                                <button
                                    onClick={handleOpenMakeOfferModal}
                                    className="flex items-center justify-center gap-2 w-full bg-[#edcd1f] text-black py-3 px-6 cursor-pointer rounded-lg hover:bg-[#edcd1f]/90 transition-colors"
                                >
                                    <PoundSterling />
                                    <span>Make an Offer</span>
                                </button>
                            )}

                            {/* Make Offer Modal */}
                            <Suspense fallback={null}>
                                <MakeOfferModal
                                    isOpen={isMakeOfferModalOpen}
                                    onClose={handleCloseMakeOfferModal}
                                    onSubmit={handleMakeOffer}
                                    offerAmount={offerAmount}
                                    setOfferAmount={setOfferAmount}
                                    offerMessage={offerMessage}
                                    setOfferMessage={setOfferMessage}
                                    loading={makingOffer}
                                    auction={auction}
                                />
                            </Suspense>
                        </>
                    ) : countdown.status === 'approved' ? (
                        <div className="text-center py-4 bg-blue-100 rounded-lg border border-blue-200">
                            <p className="font-medium text-blue-700">Auction Not Started</p>
                            <p className="text-sm text-blue-600 mt-1">Bidding will begin when the auction starts</p>
                        </div>
                    ) : countdown.status === 'ended' ? (
                        <div className="text-center py-4 bg-yellow-100 rounded-lg border border-yellow-200">
                            <p className="font-medium text-yellow-700">Auction Ended</p>
                            {auction.winner ? (
                                <p className="text-sm text-yellow-600 mt-1">Winner: {auction.winner.username}</p>
                            ) : auction.status === 'sold' ? (
                                <p className="text-sm text-green-600 mt-1">Item Sold</p>
                            ) : auction.status === 'reserve_not_met' ? (
                                <p className="text-sm text-yellow-600 mt-1">Reserve Not Met</p>
                            ) : auction.status === 'sold_buy_now' ? (
                                <p className="text-sm text-green-600 mt-1">Sold via Buy Now</p>
                            ) : (
                                <p className="text-sm text-yellow-600 mt-1">No winning bidder</p>
                            )}
                        </div>
                    ) : countdown.status === 'cancelled' ? (
                        <div className="text-center py-4 bg-yellow-100 rounded-lg border border-yellow-200">
                            <p className="font-medium text-yellow-700">Auction Cancelled</p>
                            {auction.winner ? (
                                <p className="text-sm text-yellow-600 mt-1">Winner: {auction.winner.username}</p>
                            ) : auction.status === 'sold' ? (
                                <p className="text-sm text-green-600 mt-1">Item Sold</p>
                            ) : (
                                <p className="text-sm text-yellow-600 mt-1">No winning bidder</p>
                            )}
                        </div>
                    ) : countdown.status === 'draft' ? (
                        <div className="text-center py-4 bg-yellow-100 rounded-lg border border-yellow-200">
                            <p className="font-medium text-yellow-700">Auction Pending</p>
                            {auction.winner ? (
                                <p className="text-sm text-yellow-600 mt-1">Winner: {auction.winner.username}</p>
                            ) : auction.status === 'sold' ? (
                                <p className="text-sm text-green-600 mt-1">Item Sold</p>
                            ) : (
                                <p className="text-sm text-yellow-600 mt-1">Needs Admin Approval</p>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-4 bg-gray-100 rounded-lg">
                            <p className="font-medium text-gray-600">Loading auction status...</p>
                        </div>
                    )}

                    {/* Watchlist Count */}
                    {auction.watchlistCount > 0 && (
                        <p className="text-center bg-white p-3 text-secondary text-sm flex items-center justify-center gap-2 border border-gray-200 rounded-lg">
                            <Users className="w-4 h-4" />
                            <span>{auction.watchlistCount} user{auction.watchlistCount !== 1 ? 's' : ''} watching</span>
                        </p>
                    )}

                    <p className="text-center bg-white p-3 text-secondary text-sm flex items-center justify-center gap-2 border border-gray-200 rounded-lg">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{auction.views} views</span>
                    </p>

                    {/* Pending Offers Count */}
                    {auction.offers && auction.offers.filter(o => o.status === 'pending').length > 0 && (
                        <p className="text-center bg-white p-3 text-secondary text-sm flex items-center justify-center gap-2 border border-gray-200 rounded-lg">
                            <PoundSterling className="w-4 h-4" />
                            <span>{auction.offers.filter(o => o.status === 'pending').length} pending offer{auction.offers.filter(o => o.status === 'pending').length !== 1 ? 's' : ''}</span>
                        </p>
                    )}
                </div>
            </section>
        </Container>
    );
}

export default SingleAuction;