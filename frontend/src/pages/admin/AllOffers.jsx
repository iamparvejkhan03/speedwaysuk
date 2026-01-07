import { useState, useEffect, useMemo } from "react";
import {
    Search, Filter, Calendar, PoundSterling, Users, TrendingUp, Award,
    Clock, CheckCircle, XCircle, RefreshCw, AlertCircle, MessageSquare,
    Eye, Package, User, Mail, Phone, Building, FileText, Shield, Ban,
    ChevronRight, MoreVertical, Download, BarChart3, TrendingDown
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { toast } from "react-hot-toast";
import { AdminContainer, AdminHeader, AdminSidebar } from "../../components";

function AllOffers() {
    const [offers, setOffers] = useState([]);
    const [allOffers, setAllOffers] = useState([]);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [selectedAuction, setSelectedAuction] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [filterOptions, setFilterOptions] = useState({});
    const [processing, setProcessing] = useState(false);
    const [showRespondModal, setShowRespondModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [responseData, setResponseData] = useState({
        action: 'accept',
        message: ''
    });
    const [cancelReason, setCancelReason] = useState('');

    // Filters
    const [filters, setFilters] = useState({
        status: "all",
        category: "all",
        search: "",
        sortBy: "recent",
        dateRange: "all"
    });

    // Fetch all offers
    const fetchAllOffers = async () => {
        try {
            setLoading(true);

            const [offersResponse, statsResponse] = await Promise.all([
                axiosInstance.get(`/api/v1/offers/admin/all`),
                axiosInstance.get('/api/v1/offers/admin/stats')
            ]);

            if (offersResponse.data.success) {
                setAllOffers(offersResponse.data.data.offers);
                // setFilteredOffers(offersResponse.data.data.offers);
                setFilterOptions(offersResponse.data.data.filterOptions);
                if (offersResponse.data.data.offers.length > 0) {
                    setSelectedOffer(offersResponse.data.data.offers[0]);
                }
            }

            if (statsResponse.data.success) {
                setStats(statsResponse.data.data);
            }

        } catch (error) {
            console.error('Fetch admin offers error:', error);
            toast.error('Failed to load offers');
        } finally {
            setLoading(false);
        }
    };

    // Apply filters locally
    const filteredOffers = useMemo(() => {
        let filtered = [...allOffers];

        // Search filter
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(offer =>
                offer.auction.title.toLowerCase().includes(searchTerm) ||
                offer.buyerUsername.toLowerCase().includes(searchTerm) ||
                (offer.auction.seller?.name?.toLowerCase() || '').includes(searchTerm) ||
                (offer.auction.seller?.username?.toLowerCase() || '').includes(searchTerm)
            );
        }

        // Status filter
        if (filters.status !== "all") {
            filtered = filtered.filter(offer => offer.status === filters.status);
        }

        // Category filter
        if (filters.category !== "all") {
            filtered = filtered.filter(offer => offer.auction.category === filters.category);
        }

        // Date range filter
        if (filters.dateRange !== "all") {
            const now = new Date();
            const cutoff = new Date();

            switch (filters.dateRange) {
                case "today":
                    cutoff.setHours(0, 0, 0, 0);
                    break;
                case "week":
                    cutoff.setDate(now.getDate() - 7);
                    break;
                case "month":
                    cutoff.setMonth(now.getMonth() - 1);
                    break;
            }

            filtered = filtered.filter(offer => new Date(offer.createdAt) >= cutoff);
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (filters.sortBy) {
                case "recent":
                    return new Date(b.createdAt) - new Date(a.createdAt);
                case "oldest":
                    return new Date(a.createdAt) - new Date(b.createdAt);
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
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

        return filtered;
    }, [allOffers, filters]);

    // Initial fetch
    useEffect(() => {
        fetchAllOffers();
    }, []);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters({
            status: "all",
            category: "all",
            search: "",
            sortBy: "recent",
            dateRange: "all"
        });
    };

    // Helper functions
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

    const getTimeRemaining = (expiresAt) => {
        if (!expiresAt) return null;
        const now = new Date();
        const expiry = new Date(expiresAt);
        const diffMs = expiry - now;

        if (diffMs <= 0) return "Expired";

        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        return `${diffHours}h ${diffMinutes}m`;
    };

    const getStatusConfig = (status) => {
        const config = {
            pending: {
                icon: <Clock className="text-yellow-600" size={16} />,
                text: "Pending",
                bgColor: "bg-yellow-50",
                textColor: "text-yellow-800",
                borderColor: "border-yellow-200"
            },
            accepted: {
                icon: <CheckCircle className="text-green-600" size={16} />,
                text: "Accepted",
                bgColor: "bg-green-50",
                textColor: "text-green-800",
                borderColor: "border-green-200"
            },
            rejected: {
                icon: <XCircle className="text-red-600" size={16} />,
                text: "Rejected",
                bgColor: "bg-red-50",
                textColor: "text-red-800",
                borderColor: "border-red-200"
            },
            countered: {
                icon: <TrendingUp className="text-blue-600" size={16} />,
                text: "Countered",
                bgColor: "bg-blue-50",
                textColor: "text-blue-800",
                borderColor: "border-blue-200"
            },
            expired: {
                icon: <Clock className="text-gray-600" size={16} />,
                text: "Expired",
                bgColor: "bg-gray-50",
                textColor: "text-gray-800",
                borderColor: "border-gray-200"
            },
            withdrawn: {
                icon: <RefreshCw className="text-gray-600" size={16} />,
                text: "Withdrawn",
                bgColor: "bg-gray-50",
                textColor: "text-gray-800",
                borderColor: "border-gray-200"
            }
        };
        return config[status] || config.pending;
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "Aircraft":
                return <Package size={18} className="text-blue-600" />;
            case "Engines & Parts":
                return <Package size={18} className="text-green-600" />;
            case "Memorabilia":
                return <Award size={18} className="text-amber-600" />;
            default:
                return <Package size={18} className="text-gray-600" />;
        }
    };

    // Admin actions
    const handleRespondToOffer = async () => {
        if (!selectedOffer) return;

        try {
            setProcessing(true);

            const res = await axiosInstance.post(`/api/v1/offers/admin/${selectedOffer._id}/respond`, {
                auctionId: selectedOffer.auction._id,
                response: responseData.action,
                message: responseData.message
            });

            if (res.data.success) {
                toast.success(`Offer ${responseData.action}ed by admin`);
                setShowRespondModal(false);
                setResponseData({ action: 'accept', message: '' });

                // Refresh offers
                await fetchAllOffers();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to respond to offer');
        } finally {
            setProcessing(false);
        }
    };

    const handleCancelOffer = async () => {
        if (!selectedOffer || !cancelReason.trim()) return;

        try {
            setProcessing(true);

            const res = await axiosInstance.post(`/api/v1/offers/admin/${selectedOffer._id}/cancel`, {
                auctionId: selectedOffer.auction._id,
                reason: cancelReason
            });

            if (res.data.success) {
                toast.success('Offer cancelled by admin');
                setShowCancelModal(false);
                setCancelReason('');

                // Refresh offers
                await fetchAllOffers();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to cancel offer');
        } finally {
            setProcessing(false);
        }
    };

    const handleReactivateOffer = async () => {
        if (!selectedOffer) return;

        if (!window.confirm(`Are you sure you want to reactivate and accept this offer for ${formatCurrency(selectedOffer.amount)}?\nThis will end the auction and sell it to ${selectedOffer.buyerUsername}.`)) {
            return;
        }

        try {
            setProcessing(true);

            const res = await axiosInstance.post(`/api/v1/offers/${selectedOffer._id}/reactivate`, {
                auctionId: selectedOffer.auction._id,
                reason: "Offer reactivated by administrator"
            });

            if (res.data.success) {
                toast.success('Offer reactivated and accepted successfully');

                // Refresh offers
                await fetchAllOffers();
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to reactivate offer');
        } finally {
            setProcessing(false);
        }
    };

    // Stats cards configuration
    const statCards = [
        {
            title: "Total Offers",
            value: stats.totalOffers?.toString() || "0",
            change: "Across all auctions",
            icon: <PoundSterling size={24} />,
            color: "blue"
        },
        {
            title: "Pending Offers",
            value: (stats.statusStats?.pending?.count || 0).toString(),
            change: "Awaiting response",
            icon: <Clock size={24} />,
            color: "yellow"
        },
        {
            title: "Success Rate",
            value: `${stats.successRate || 0}%`,
            change: "Accepted offers",
            icon: <TrendingUp size={24} />,
            color: "green"
        },
        {
            title: "Total Value",
            value: formatCurrency(
                Object.values(stats.statusStats || {}).reduce((sum, stat) => sum + (stat.totalAmount || 0), 0)
            ),
            change: "Offered amount",
            icon: <Award size={24} />,
            color: "purple"
        }
    ];

    if (loading) {
        return (
            <section className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="w-full relative">
                    <AdminHeader />
                    <AdminContainer>
                        <div className="flex justify-center items-center min-h-96">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    </AdminContainer>
                </div>
            </section>
        );
    }

    return (
        <section className="flex min-h-screen bg-gray-50">
            <AdminSidebar />
            <div className="w-full relative">
                <AdminHeader />
                <AdminContainer>
                    <div className="max-w-full pt-16 pb-7 md:pt-0">
                        <h2 className="text-3xl md:text-4xl font-bold my-5 text-gray-800">Offers Management</h2>
                        {/* <p className="text-gray-600">Monitor and manage all private offers across auctions.</p> */}
                    </div>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {statCards.map((stat, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                        <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                                    </div>
                                    <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                            {/* Search */}
                            <div className="lg:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search offers, auctions, buyers, sellers..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        value={filters.search}
                                        onChange={(e) => handleFilterChange('search', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filters.status}
                                    onChange={(e) => handleFilterChange('status', e.target.value)}
                                >
                                    <option value="all">All Status</option>
                                    {filterOptions.statuses?.map(status => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Category Filter */}
                            {/* <div>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filters.category}
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                >
                                    <option value="all">All Categories</option>
                                    {filterOptions.categories?.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div> */}

                            {/* Sort By */}
                            <div>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    value={filters.sortBy}
                                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                >
                                    <option value="recent">Most Recent</option>
                                    <option value="oldest">Oldest First</option>
                                    <option value="amount_high">Highest Amount</option>
                                    <option value="amount_low">Lowest Amount</option>
                                    <option value="expiring_soon">Expiring Soon</option>
                                </select>
                            </div>

                            {/* Date Range */}
                            <div className="flex gap-3">
                                <select
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    value={filters.dateRange}
                                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                                >
                                    <option value="all">All Time</option>
                                    <option value="today">Today</option>
                                    <option value="week">Last 7 Days</option>
                                    <option value="month">Last 30 Days</option>
                                </select>
                            </div>
                        </div>

                        {/* Date Range & Clear Filters */}
                        <div className="flex justify-end items-center mt-4">
                            <div className="flex items-center gap-4">
                                <div className="text-sm text-gray-500">
                                    Showing {filteredOffers.length} of {allOffers.length} offers
                                </div>
                                <button
                                    onClick={clearFilters}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    Clear all filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Offers List & Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Offers Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold">All Offers ({filteredOffers.length})</h3>
                                </div>
                                <div className="max-h-[600px] overflow-y-auto">
                                    {filteredOffers.map(offer => {
                                        const statusConfig = getStatusConfig(offer.status);
                                        return (
                                            <div
                                                key={offer._id}
                                                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${selectedOffer?._id === offer._id ? 'bg-blue-50 border-blue-200' : ''
                                                    }`}
                                                onClick={() => setSelectedOffer(offer)}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.textColor}`}>
                                                                {statusConfig.text}
                                                            </span>
                                                            <span className="text-xs text-gray-600">
                                                                {formatCurrency(offer.amount)}
                                                            </span>
                                                        </div>
                                                        <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                                                            {offer.auction.title}
                                                        </h4>
                                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                                            <User size={12} />
                                                            <span>Buyer: {offer.buyerUsername}</span>
                                                        </div>
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-xs text-gray-500">
                                                                {formatDate(offer.createdAt)}
                                                            </span>
                                                            {offer.status === 'pending' && offer.expiresAt && (
                                                                <span className="text-xs text-yellow-600">
                                                                    <Clock size={10} className="inline mr-1" />
                                                                    {getTimeRemaining(offer.expiresAt)}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Selected Offer Details */}
                        <div className="lg:col-span-2">
                            {selectedOffer ? (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                                    {/* Offer Header */}
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    {getCategoryIcon(selectedOffer.auction.category)}
                                                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                                        {selectedOffer.auction.category}
                                                    </span>
                                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${getStatusConfig(selectedOffer.status).bgColor} ${getStatusConfig(selectedOffer.status).textColor}`}>
                                                        {getStatusConfig(selectedOffer.status).icon}
                                                        {getStatusConfig(selectedOffer.status).text}
                                                    </div>
                                                </div>
                                                <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedOffer.auction.title}</h2>
                                                <p className="text-gray-600 text-sm">
                                                    Auction ID: <span className="font-mono">{selectedOffer.auction._id.toString()}</span>
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <a
                                                    href={`/auction/${selectedOffer.auction._id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                                    title="View Auction"
                                                >
                                                    <Eye size={18} />
                                                </a>
                                            </div>
                                        </div>

                                        {/* Offer Details */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {/* Offer Amount & Timing */}
                                            <div className="space-y-4">
                                                <div className="bg-gray-50 p-4 rounded-lg">
                                                    <div className="text-sm text-gray-600 mb-2">Offer Details</div>
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <div className="text-2xl font-bold text-blue-600">
                                                                {formatCurrency(selectedOffer.amount)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">Offered Amount</div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="font-medium">
                                                                {formatCurrency(selectedOffer.auction.startPrice)}
                                                            </div>
                                                            <div className="text-sm text-gray-500">Starting Price</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="bg-gray-50 p-3 rounded-lg">
                                                        <div className="text-sm text-gray-600">Submitted</div>
                                                        <div className="font-medium">{formatDate(selectedOffer.createdAt)}</div>
                                                    </div>
                                                    {selectedOffer.status === 'pending' && selectedOffer.expiresAt && (
                                                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                                                            <div className="text-sm text-yellow-700">Expires In</div>
                                                            <div className="font-medium text-yellow-800">
                                                                <Clock size={14} className="inline mr-1" />
                                                                {getTimeRemaining(selectedOffer.expiresAt)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Buyer & Seller Info */}
                                            <div className="space-y-4">
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <div className="text-sm text-blue-700 mb-2">Buyer Information</div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <User size={14} className="text-blue-600" />
                                                            <span className="font-medium">{selectedOffer.buyerUsername}</span>
                                                        </div>
                                                        {selectedOffer.buyer && (
                                                            <>
                                                                {selectedOffer.buyer.email && (
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <Mail size={12} className="text-gray-500" />
                                                                        <span className="text-gray-600">{selectedOffer.buyer.email}</span>
                                                                    </div>
                                                                )}
                                                                {selectedOffer.buyer.phone && (
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <Phone size={12} className="text-gray-500" />
                                                                        <span className="text-gray-600">{selectedOffer.buyer.phone}</span>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="bg-green-50 p-4 rounded-lg">
                                                    <div className="text-sm text-green-700 mb-2">Seller Information</div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <User size={14} className="text-green-600" />
                                                            <span className="font-medium">{selectedOffer.auction.seller?.name || selectedOffer.auction.sellerUsername}</span>
                                                        </div>
                                                        {selectedOffer.auction.seller && (
                                                            <>
                                                                {selectedOffer.auction.seller.email && (
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <Mail size={12} className="text-gray-500" />
                                                                        <span className="text-gray-600">{selectedOffer.auction.seller.email}</span>
                                                                    </div>
                                                                )}
                                                                {selectedOffer.auction.seller.company && (
                                                                    <div className="flex items-center gap-2 text-sm">
                                                                        <Building size={12} className="text-gray-500" />
                                                                        <span className="text-gray-600">{selectedOffer.auction.seller.company}</span>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Messages & Actions */}
                                    <div className="p-6">
                                        {/* Offer Message */}
                                        {selectedOffer.message && (
                                            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MessageSquare size={16} className="text-gray-500" />
                                                    <h4 className="font-medium text-gray-700">Buyer's Message</h4>
                                                </div>
                                                <p className="text-gray-600 text-sm">{selectedOffer.message}</p>
                                            </div>
                                        )}

                                        {/* Seller Response */}
                                        {selectedOffer.sellerResponse && (
                                            <div className={`mb-6 p-4 rounded-lg border ${selectedOffer.status === 'accepted' ? 'bg-green-50 border-green-200' :
                                                selectedOffer.status === 'rejected' ? 'bg-red-50 border-red-200' :
                                                    'bg-gray-50 border-gray-200'
                                                }`}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <MessageSquare size={16} className={
                                                        selectedOffer.status === 'accepted' ? 'text-green-600' :
                                                            selectedOffer.status === 'rejected' ? 'text-red-600' :
                                                                'text-gray-500'
                                                    } />
                                                    <h4 className="font-medium">Seller Response</h4>
                                                </div>
                                                <p className={
                                                    selectedOffer.status === 'accepted' ? 'text-green-700' :
                                                        selectedOffer.status === 'rejected' ? 'text-red-700' :
                                                            'text-gray-600'
                                                }>
                                                    {selectedOffer.sellerResponse}
                                                </p>
                                            </div>
                                        )}

                                        {/* Counter Offer */}
                                        {selectedOffer.status === 'countered' && selectedOffer.counterOffer && (
                                            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingUp size={16} className="text-blue-600" />
                                                    <h4 className="font-medium text-blue-800">Counter Offer</h4>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 mb-3">
                                                    <div>
                                                        <div className="text-sm text-blue-600">Counter Amount</div>
                                                        <div className="text-xl font-bold text-blue-700">
                                                            {formatCurrency(selectedOffer.counterOffer.amount)}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-sm text-gray-600">Difference</div>
                                                        <div className="font-medium text-blue-600">
                                                            +{formatCurrency(selectedOffer.counterOffer.amount - selectedOffer.amount)}
                                                        </div>
                                                    </div>
                                                </div>
                                                {selectedOffer.counterOffer.message && (
                                                    <div className="p-3 bg-white rounded border border-blue-100">
                                                        <p className="text-sm text-gray-700">
                                                            <span className="font-medium">Seller's message:</span> {selectedOffer.counterOffer.message}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Admin Actions */}
                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                            <h4 className="font-medium text-gray-700 mb-4">Administrator Actions</h4>
                                            <div className="flex flex-wrap gap-3">
                                                {selectedOffer.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => {
                                                                setResponseData({ action: 'accept', message: 'Offer accepted by administrator' });
                                                                setShowRespondModal(true);
                                                            }}
                                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                                                        >
                                                            <CheckCircle size={16} />
                                                            Accept Offer
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setResponseData({ action: 'reject', message: 'Offer rejected by administrator' });
                                                                setShowRespondModal(true);
                                                            }}
                                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                                        >
                                                            <XCircle size={16} />
                                                            Reject Offer
                                                        </button>
                                                    </>
                                                )}
                                                {/* {selectedOffer.status !== 'withdrawn' && selectedOffer.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => setShowCancelModal(true)}
                                                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                                                    >
                                                        <Ban size={16} />
                                                        Cancel Offer
                                                    </button>
                                                )} */}
                                                {/* button conditionally for rejected offers */}
                                                {selectedOffer.status === 'rejected' && selectedOffer.canBeReactivated !== false && (
                                                    <button
                                                        onClick={() => {
                                                            handleReactivateOffer();
                                                        }}
                                                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                                                    >
                                                        <RefreshCw size={16} />
                                                        Reactivate & Accept
                                                    </button>
                                                )}
                                                <a
                                                    href={`/auction/${selectedOffer.auction._id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                                                >
                                                    <Eye size={16} />
                                                    View Auction Details
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                    <PoundSterling size={48} className="mx-auto text-gray-300 mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Offer Selected</h3>
                                    <p className="text-gray-500">Select an offer from the list to view details and take action</p>
                                </div>
                            )}
                        </div>
                    </div>
                </AdminContainer>
            </div>

            {/* Response Modal */}
            {showRespondModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {responseData.action === 'accept' ? 'Accept Offer' : 'Reject Offer'}
                        </h3>

                        {responseData.action === 'accept' && (
                            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <p className="text-sm text-blue-700 font-medium mb-2">⚠️ This will:</p>
                                <ul className="text-sm text-blue-600 space-y-1 list-disc pl-4">
                                    <li>End the auction immediately</li>
                                    <li>Declare <strong>{selectedOffer?.buyerUsername}</strong> as winner</li>
                                    <li>Set final price to <strong>{formatCurrency(selectedOffer?.amount)}</strong></li>
                                    <li>Reject all other pending offers</li>
                                </ul>
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message to {responseData.action === 'accept' ? 'buyer' : 'buyer'} (optional)
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                                value={responseData.message}
                                onChange={(e) => setResponseData(prev => ({ ...prev, message: e.target.value }))}
                                placeholder={`Enter message to explain why you're ${responseData.action}ing this offer...`}
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowRespondModal(false);
                                    setResponseData({ action: 'accept', message: '' });
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRespondToOffer}
                                className={`px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2 ${responseData.action === 'accept' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                    }`}
                                disabled={processing}
                            >
                                {processing ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        {responseData.action === 'accept' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                                        {responseData.action === 'accept' ? 'Accept Offer' : 'Reject Offer'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">Cancel Offer</h3>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Reason for cancellation (required)
                            </label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                rows="3"
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="Enter reason for cancelling this offer..."
                                required
                            />
                        </div>
                        <div className="text-sm text-gray-600 mb-4">
                            This action will notify the user about the cancellation.
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setShowCancelModal(false);
                                    setCancelReason('');
                                }}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCancelOffer}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                                disabled={processing || !cancelReason.trim()}
                            >
                                {processing ? (
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <Ban size={16} />
                                        Cancel Offer
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default AllOffers;