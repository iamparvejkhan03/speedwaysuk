import { useState, useEffect } from "react";
import { AccountInactiveBanner, BidderContainer, BidderHeader, BidderSidebar, LoadingSpinner } from "../../components";
import {
    Search,
    Filter,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    TrendingUp,
    RefreshCw,
    Calendar,
    Eye,
    AlertCircle,
    MessageSquare,
    Shield,
    Award,
    FileText,
    Ban,
    TrendingDown
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { Link } from "react-router-dom";
import { useDebounce } from "../../hooks/useDebounce";
import toast from "react-hot-toast";

function MyOffers() {
    const [offers, setOffers] = useState([]);
    const [allOffers, setAllOffers] = useState([]);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);
    const [sortBy, setSortBy] = useState("recent");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [responding, setResponding] = useState(false);
    const [statistics, setStatistics] = useState({
        total: 0,
        pending: 0,
        accepted: 0,
        rejected: 0,
        countered: 0,
        expired: 0,
        withdrawn: 0
    });

    // Fetch all offers on component mount
    useEffect(() => {
        fetchMyOffers();
    }, []);

    // Apply client-side filtering when filters change
    useEffect(() => {
        if (allOffers.length === 0) return;

        let filtered = [...allOffers];

        // Apply status filter
        if (filter !== "all") {
            filtered = filtered.filter(offer => offer.status === filter);
        }

        // Apply search filter
        if (debouncedSearchTerm) {
            filtered = filtered.filter(offer =>
                offer.auction.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                offer.auction.sellerUsername.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "recent":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case "amount_high":
                    return b.amount - a.amount;
                case "amount_low":
                    return a.amount - b.amount;
                case "expiring_soon":
                    if (a.status === 'pending' && b.status === 'pending') {
                        return new Date(a.expiresAt) - new Date(b.expiresAt);
                    }
                    return a.status === 'pending' ? -1 : 1;
                default:
                    return 0;
            }
        });

        setOffers(filtered);
    }, [filter, debouncedSearchTerm, sortBy, allOffers]);

    const fetchMyOffers = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data } = await axiosInstance.get("/api/v1/offers/my");

            if (data.success) {
                setAllOffers(data.data.offers);
                setOffers(data.data.offers);
                setStatistics(data.data.stats);
            } else {
                setError("Failed to fetch your offers");
            }
        } catch (err) {
            setError("Error loading your offers");
            console.error("Fetch my offers error:", err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status) => {
        const config = {
            pending: {
                icon: <Clock className="text-yellow-600" size={16} />,
                text: "Pending",
                bgColor: "bg-yellow-50",
                textColor: "text-yellow-800",
                borderColor: "border-yellow-200",
                description: "Waiting for seller response"
            },
            accepted: {
                icon: <CheckCircle className="text-green-600" size={16} />,
                text: "Accepted",
                bgColor: "bg-green-50",
                textColor: "text-green-800",
                borderColor: "border-green-200",
                description: "Offer accepted! Auction sold to you."
            },
            rejected: {
                icon: <XCircle className="text-red-600" size={16} />,
                text: "Rejected",
                bgColor: "bg-red-50",
                textColor: "text-red-800",
                borderColor: "border-red-200",
                description: "Seller declined your offer"
            },
            countered: {
                icon: <TrendingUp className="text-blue-600" size={16} />,
                text: "Countered",
                bgColor: "bg-blue-50",
                textColor: "text-blue-800",
                borderColor: "border-blue-200",
                description: "Seller made a counter offer"
            },
            expired: {
                icon: <Clock className="text-gray-600" size={16} />,
                text: "Expired",
                bgColor: "bg-gray-50",
                textColor: "text-gray-800",
                borderColor: "border-gray-200",
                description: "Offer expired after 48 hours"
            },
            withdrawn: {
                icon: <RefreshCw className="text-gray-600" size={16} />,
                text: "Withdrawn",
                bgColor: "bg-gray-50",
                textColor: "text-gray-800",
                borderColor: "border-gray-200",
                description: "You withdrew this offer"
            }
        };

        return config[status] || {
            icon: <AlertCircle className="text-gray-600" size={16} />,
            text: status,
            bgColor: "bg-gray-50",
            textColor: "text-gray-800",
            borderColor: "border-gray-200",
            description: ""
        };
    };

    const getTimeRemaining = (expiresAt) => {
        if (!expiresAt) return null;

        const now = new Date();
        const expiry = new Date(expiresAt);
        const diffMs = expiry - now;

        if (diffMs <= 0) return "Expired";

        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        if (diffDays > 0) {
            return `${diffDays}d ${diffHours}h remaining`;
        } else if (diffHours > 0) {
            return `${diffHours}h ${diffMinutes}m remaining`;
        }
        return `${diffMinutes}m remaining`;
    };

    const getUrgencyColor = (timeRemaining) => {
        if (!timeRemaining || timeRemaining === "Expired") return "text-gray-600 bg-gray-50 border-gray-200";
        if (timeRemaining.includes('h') && !timeRemaining.includes('d')) return "text-red-600 bg-red-50 border-red-200";
        if (timeRemaining.includes('d') && parseInt(timeRemaining) <= 1) return "text-amber-600 bg-amber-50 border-amber-200";
        return "text-green-600 bg-green-50 border-green-200";
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'GBP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAuctionStatusColor = (status) => {
        const config = {
            active: "text-green-600 bg-green-50 border-green-200",
            ended: "text-gray-600 bg-gray-50 border-gray-200",
            cancelled: "text-red-600 bg-red-50 border-red-200",
            sold: "text-blue-600 bg-blue-50 border-blue-200",
            draft: "text-yellow-600 bg-yellow-50 border-yellow-200"
        };
        return config[status] || "text-gray-600 bg-gray-50 border-gray-200";
    };

    const handleWithdrawOffer = async (offerId, auctionId) => {
        if (!window.confirm('Are you sure you want to withdraw this offer? This action cannot be undone.')) {
            return;
        }

        try {
            setResponding(true);

            // Call the withdraw endpoint with auctionId and offerId in params
            const res = await axiosInstance.post(`/api/v1/offers/auction/${auctionId}/offer/${offerId}/withdraw`);

            if (res.data.success) {
                // Update the offers list locally
                const updatedOffers = allOffers.map(offer => {
                    if (offer._id === offerId) {
                        return {
                            ...offer,
                            status: 'withdrawn',
                            sellerResponse: 'Offer withdrawn by buyer'
                        };
                    }
                    return offer;
                });

                // Update the filtered offers
                const updatedFilteredOffers = offers.map(offer => {
                    if (offer._id === offerId) {
                        return {
                            ...offer,
                            status: 'withdrawn',
                        };
                    }
                    return offer;
                });

                setAllOffers(updatedOffers);
                setOffers(updatedFilteredOffers);

                // Update statistics
                setStatistics(prevStats => ({
                    ...prevStats,
                    pending: prevStats.pending - 1,
                    withdrawn: prevStats.withdrawn + 1,
                    total: prevStats.total // total remains the same
                }));

                toast.success('Offer withdrawn successfully');

                // If you want to refresh the data from server instead of local update:
                // await fetchMyOffers(); // Uncomment this if you prefer server refresh
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to withdraw offer');
            console.error('Withdraw offer error:', error);
        } finally {
            setResponding(false);
        }
    };

    if (loading) {
        return (
            <section className="flex min-h-screen">
                <BidderSidebar />
                <div className="w-full relative">
                    <BidderHeader />
                    <BidderContainer>
                        <div className="flex justify-center items-center min-h-96">
                            <LoadingSpinner />
                        </div>
                    </BidderContainer>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="flex min-h-screen">
                <BidderSidebar />
                <div className="w-full relative">
                    <BidderHeader />
                    <BidderContainer>
                        <AccountInactiveBanner />
                        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                            <p className="text-red-600">{error}</p>
                            <button
                                onClick={fetchMyOffers}
                                className="mt-4 bg-[#edcd1f] text-black px-4 py-2 rounded-lg hover:bg-[#edcd1f]/90"
                            >
                                Try Again
                            </button>
                        </div>
                    </BidderContainer>
                </div>
            </section>
        );
    }

    return (
        <section className="flex min-h-screen">
            <BidderSidebar />

            <div className="w-full relative">
                <BidderHeader />

                <BidderContainer>
                    <AccountInactiveBanner />
                    {/* Header Section */}
                    <div className="max-w-full pt-16 pb-7 md:pt-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold my-5">My Offers</h2>
                                <p className="text-secondary">Track your private offers and negotiations with sellers.</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                    {offers.length} total offers
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm">Pending Offers</p>
                                    <p className="text-2xl font-bold mt-1">{statistics.pending}</p>
                                    <p className="text-blue-200 text-xs mt-1">Waiting for response</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <Clock size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm">Accepted Offers</p>
                                    <p className="text-2xl font-bold mt-1">{statistics.accepted}</p>
                                    <p className="text-green-200 text-xs mt-1">Successful purchases</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <CheckCircle size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-100 text-sm">Rejected Offers</p>
                                    <p className="text-2xl font-bold mt-1">{statistics.rejected}</p>
                                    <p className="text-red-200 text-xs mt-1">Seller rejected</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <TrendingDown size={24} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm">Total Value</p>
                                    <p className="text-2xl font-bold mt-1">
                                        {formatCurrency(offers.reduce((sum, offer) => sum + offer.amount, 0))}
                                    </p>
                                    <p className="text-purple-200 text-xs mt-1">Across all offers</p>
                                </div>
                                <div className="p-3 bg-white/20 rounded-lg">
                                    <DollarSign size={24} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Controls */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search by auction title or seller..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="flex items-center gap-2">
                                    <Filter size={18} className="text-gray-500" />
                                    <select
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="recent">Most Recent</option>
                                        <option value="amount_high">Highest Amount</option>
                                        <option value="amount_low">Lowest Amount</option>
                                        <option value="expiring_soon">Expiring Soon</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Status Filters */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setFilter("all")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "all" ? "bg-blue-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                All Offers ({statistics.total})
                            </button>
                            <button
                                onClick={() => setFilter("pending")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "pending" ? "bg-yellow-100 text-yellow-800 border border-yellow-200 shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                <Clock size={14} className="inline mr-1" />
                                Pending ({statistics.pending})
                            </button>
                            <button
                                onClick={() => setFilter("accepted")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "accepted" ? "bg-green-100 text-green-800 border border-green-200 shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                <CheckCircle size={14} className="inline mr-1" />
                                Accepted ({statistics.accepted})
                            </button>
                            <button
                                onClick={() => setFilter("rejected")}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === "rejected" ? "bg-red-100 text-red-800 border border-red-200 shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                            >
                                <XCircle size={14} className="inline mr-1" />
                                Rejected ({statistics.rejected})
                            </button>
                        </div>
                    </div>

                    {/* Offers List */}
                    <div className="space-y-6">
                        {offers.length > 0 ? (
                            offers.map((offer) => {
                                const statusConfig = getStatusConfig(offer.status);
                                const timeRemaining = offer.status === 'pending' ? getTimeRemaining(offer.expiresAt) : null;
                                const auctionImage = offer.auction.photos && offer.auction.photos.length > 0
                                    ? offer.auction.photos[0]?.url
                                    : '/default-auction.jpg';

                                return (
                                    <div key={offer._id} className={`bg-white rounded-xl shadow-sm border ${statusConfig.borderColor} overflow-hidden transition-all duration-200 hover:shadow-lg`}>
                                        <div className="p-6">
                                            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                                                {/* Auction Image and Basic Info */}
                                                <div className="flex-shrink-0">
                                                    <div className="relative">
                                                        <img
                                                            src={auctionImage}
                                                            alt={offer.auction.title}
                                                            className="w-48 h-32 object-cover rounded-lg border border-gray-200"
                                                        />
                                                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${getAuctionStatusColor(offer.auction.status)}`}>
                                                            {offer.auction.status.charAt(0).toUpperCase() + offer.auction.status.slice(1)}
                                                        </div>
                                                        {timeRemaining && (
                                                            <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(timeRemaining)}`}>
                                                                <Clock size={10} className="inline mr-1" />
                                                                {timeRemaining}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Offer Details */}
                                                <div className="flex-1">
                                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-700">
                                                                    {offer.auction.auctionType}
                                                                </span>
                                                                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                                                    {statusConfig.icon}
                                                                    {statusConfig.text}
                                                                </div>
                                                            </div>

                                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{offer.auction.title}</h3>
                                                            <p className="text-gray-600 text-sm mb-4">
                                                                Seller: <span className="font-medium">{offer.auction.sellerUsername}</span>
                                                            </p>

                                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                                                                <div>
                                                                    <p className="text-gray-500">Your Offer</p>
                                                                    <p className="font-semibold text-lg text-blue-600">{formatCurrency(offer.amount)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500">Auction Starting Price</p>
                                                                    <p className="font-semibold">{formatCurrency(offer.auction.startPrice)}</p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-gray-500">Submitted On</p>
                                                                    <p className="font-semibold">{formatDate(offer.createdAt)}</p>
                                                                </div>
                                                            </div>

                                                            {/* Counter Offer Section */}
                                                            {offer.status === 'countered' && offer.counterOffer && (
                                                                <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <TrendingUp className="h-4 w-4 text-blue-600" />
                                                                        <h4 className="font-medium text-blue-800">Counter Offer from Seller</h4>
                                                                    </div>
                                                                    <div className="flex items-center justify-between">
                                                                        <div>
                                                                            <p className="text-xl font-bold text-blue-700">
                                                                                {formatCurrency(offer.counterOffer.amount)}
                                                                            </p>
                                                                            <p className="text-sm text-blue-600">New price proposed by seller</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-sm text-gray-600">Previous: {formatCurrency(offer.amount)}</p>
                                                                            <p className="text-sm font-medium text-blue-600">
                                                                                +{formatCurrency(offer.counterOffer.amount - offer.amount)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    {offer.counterOffer.message && (
                                                                        <div className="mt-3 p-3 bg-white rounded border border-blue-100">
                                                                            <p className="text-sm text-gray-700">
                                                                                <span className="font-medium">Seller's message:</span> {offer.counterOffer.message}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}

                                                            {/* Seller Response */}
                                                            {offer.sellerResponse && offer.status !== 'countered' && (
                                                                <div className={`p-3 rounded-lg ${offer.status === 'accepted' ? 'bg-green-50 border border-green-100' :
                                                                    offer.status === 'rejected' ? 'bg-red-50 border border-red-100' :
                                                                        'bg-gray-50 border border-gray-100'
                                                                    }`}>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <MessageSquare className="h-4 w-4 text-gray-500" />
                                                                        <span className="font-medium text-gray-700">Seller Response:</span>
                                                                    </div>
                                                                    <p className={`text-sm ${offer.status === 'accepted' ? 'text-green-700' :
                                                                        offer.status === 'rejected' ? 'text-red-700' :
                                                                            'text-gray-600'
                                                                        }`}>
                                                                        "{offer.sellerResponse}"
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {/* Offer Message */}
                                                            {offer.message && (
                                                                <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                                    <div className="flex items-start gap-2">
                                                                        <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                                                        <div>
                                                                            <p className="text-sm font-medium text-gray-700 mb-1">Your Message to Seller:</p>
                                                                            <p className="text-sm text-gray-600">{offer.message}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex flex-col gap-3 min-w-[200px]">
                                                            <Link
                                                                to={`/auction/${offer.auction._id}`}
                                                                target="_blank"
                                                                className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-center"
                                                            >
                                                                <Eye size={16} />
                                                                View Auction
                                                            </Link>

                                                            {offer.status === 'pending' && (
                                                                <button
                                                                    onClick={() => handleWithdrawOffer(offer._id, offer.auction._id)}
                                                                    disabled={responding}
                                                                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    {responding ? (
                                                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></span>
                                                                    ) : (
                                                                        <>
                                                                            <RefreshCw size={16} />
                                                                            Withdraw Offer
                                                                        </>
                                                                    )}
                                                                </button>
                                                            )}

                                                            {offer.status === 'countered' && (
                                                                <div className="space-y-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            // Implement accept counter offer functionality
                                                                            console.log('Accept counter offer:', offer._id);
                                                                        }}
                                                                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors w-full"
                                                                    >
                                                                        <CheckCircle size={16} />
                                                                        Accept Counter
                                                                    </button>
                                                                    <button
                                                                        onClick={() => {
                                                                            if (window.confirm('Are you sure you want to decline this counter offer?')) {
                                                                                // Implement decline counter offer functionality
                                                                                console.log('Decline counter offer:', offer._id);
                                                                            }
                                                                        }}
                                                                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors w-full"
                                                                    >
                                                                        <Ban size={16} />
                                                                        Decline Counter
                                                                    </button>
                                                                </div>
                                                            )}

                                                            {offer.status === 'accepted' && (
                                                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                                    <div className="flex items-center gap-2 text-green-700 mb-1">
                                                                        <Award size={16} />
                                                                        <p className="font-medium">Auction Won!</p>
                                                                    </div>
                                                                    <p className="text-sm text-green-600">
                                                                        Final price: <span className="font-bold">{formatCurrency(offer.amount)}</span>
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Progress Bar */}
                                        <div className={`h-1 w-full ${statusConfig.textColor.replace('text-', 'bg-')}`}></div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                <DollarSign size={64} className="mx-auto text-gray-300 mb-4" />
                                <h3 className="text-2xl font-semibold text-gray-700 mb-2">No offers found</h3>
                                <p className="text-gray-500 mb-6">
                                    {searchTerm || filter !== "all"
                                        ? "No offers match your current filters. Try adjusting your search criteria."
                                        : "You haven't made any offers yet. Start making offers on auctions to see them here!"}
                                </p>
                                <div className="flex gap-4 justify-center">
                                    <button
                                        onClick={() => {
                                            setFilter("all");
                                            setSearchTerm("");
                                        }}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                    <Link
                                        to="/auctions"
                                        target="_blank"
                                        className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Browse Auctions
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats Footer */}
                    {offers.length > 0 && (
                        <div className="mt-8 mb-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                                <div>
                                    <p className="text-sm text-gray-600">Total Offers Made</p>
                                    <p className="text-2xl font-bold text-gray-900">{statistics.total}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Success Rate</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {statistics.total > 0
                                            ? Math.round((statistics.accepted / statistics.total) * 100)
                                            : 0}%
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Avg. Offer Amount</p>
                                    <p className="text-2xl font-bold text-blue-600">
                                        {formatCurrency(
                                            offers.length > 0
                                                ? offers.reduce((sum, offer) => sum + offer.amount, 0) / offers.length
                                                : 0
                                        )}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Active Negotiations</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {statistics.pending + statistics.countered}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </BidderContainer>
            </div>
        </section>
    );
}

export default MyOffers;