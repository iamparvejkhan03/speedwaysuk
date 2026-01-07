import { Car, Clock, Search, Shield, Sparkles } from "lucide-react";
import { Container } from "../components";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { heroImg } from "../assets";
import { useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useState } from "react";

function Hero() {
    const searchForm = useForm();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await axiosInstance.get('/api/v1/admin/categories/public/active');

            if (response.data.success) {
                // Filter out "Explore" category and get active categories
                const apiCategories = response.data.data.filter(cat =>
                    !cat.isExplore && cat.isActive !== false
                );

                setCategories(apiCategories);
            } else {
                // Fallback to static categories
                setCategories([
                    { name: 'Sports', slug: 'sports' },
                    { name: 'Convertible', slug: 'Convertible' },
                    { name: 'Luxury', slug: 'luxury' },
                ]);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories');
            // Fallback to static categories
            setCategories([
                { name: 'Sports', slug: 'sports' },
                { name: 'Convertible', slug: 'Convertible' },
                { name: 'Luxury', slug: 'luxury' },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchForm = (searchData) => {
        try {
            const params = new URLSearchParams();

            if (searchData.search) {
                params.append('search', searchData.search);
            }

            if (searchData.category) {
                params.append('category', searchData.category);
            }

            // Navigate to auctions page with query parameters
            navigate(`/auctions?${params.toString()}`);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <section
            className="min-h-screen max-w-screen py-20 md:py-32 flex items-center bg-center bg-no-repeat bg-cover relative overflow-hidden"
            style={{ backgroundImage: `url(${heroImg})` }}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/50" />

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#edcd1f]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

            <Container>
                <div className="relative z-10">
                    <div className="max-w-4xl px-2 flex flex-col items-start gap-6 mt-5 lg:mt-10">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-5 py-2.5 rounded-full text-sm font-medium mb-2">
                            <Sparkles size={18} className="text-[#edcd1f]" />
                            <Car size={20} className="text-[#edcd1f]" />
                            <span className="font-semibold">Exclusive Cars. Exceptional Deals.</span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold text-white leading-tight">
                            Wholesale Vehicles for the Motor Trade
                            <span className="block">
                                <span className="text-[#edcd1f] relative">
                                    Remarketing & Auctions
                                    <span className="absolute -bottom-2 left-0 w-full h-1 bg-[#edcd1f]/50 rounded-full"></span>
                                </span>
                            </span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-white/90 leading-relaxed max-w-4xl mt-3">
                            Connecting motor traders with nearly new vehicles at wholesale prices.
                            Partnering with leasing, finance, fleet, and insurance companies to deliver reliable trade stock through a secure remarketing platform.
                        </p>

                        {/* Search Form */}
                        <form onSubmit={searchForm.handleSubmit(handleSearchForm)} className="my-2 w-full max-w-3xl">
                            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-1.5 shadow-2xl border border-white/20">
                                <div className="flex flex-col sm:flex-row gap-2 p-5">
                                    {/* Search Input */}
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                            <input
                                                type="text"
                                                id="search"
                                                placeholder="Search by keyword..."
                                                className="w-full bg-gray-50/80 text-gray-900 py-3.5 pl-12 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#edcd1f] focus:border-transparent"
                                                {...searchForm.register('search', { required: false })}
                                            />
                                        </div>
                                    </div>

                                    {/* Category Select */}
                                    <div className="sm:w-64">
                                        <div className="relative">
                                            <select
                                                id="category"
                                                className="w-full bg-gray-50/80 text-gray-900 py-3.5 px-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#edcd1f] focus:border-transparent appearance-none"
                                                {...searchForm.register('category')}
                                                disabled={loading}
                                            >
                                                <option value="">All Categories</option>
                                                {loading ? (
                                                    <option value="" disabled>Loading categories...</option>
                                                ) : error ? (
                                                    <option value="" disabled>Error loading categories</option>
                                                ) : (
                                                    categories
                                                        .filter(category =>
                                                            category.name.toLowerCase() !== 'explore' &&
                                                            !category.isExplore
                                                        )
                                                        .map((category) => (
                                                            <option key={category.slug || category.name} value={category.slug || category.name}>
                                                                {category.name}
                                                            </option>
                                                        ))
                                                )}
                                            </select>
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="sm:w-auto">
                                        <button
                                            type="submit"
                                            className="w-full sm:w-auto flex justify-center items-center gap-3 py-3.5 px-8 rounded-lg bg-[#edcd1f] text-gray-900 font-semibold hover:bg-[#d4b41a] transition-all duration-300 hover:shadow-lg active:translate-y-0"
                                        >
                                            <Search size={20} />
                                            <span>Search Now</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            {error && (
                                <p className="text-red-300 text-sm mt-2">{error}</p>
                            )}
                        </form>

                        {/* Features */}
                        <div className="flex flex-wrap gap-6 md:gap-10 mt-1">
                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3">
                                <div className="p-2 bg-[#edcd1f]/20 rounded-lg">
                                    <Clock size={20} className="text-[#edcd1f]" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">Real-Time Offers</h4>
                                    <p className="text-white/70 text-sm">Live auction updates</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3">
                                <div className="p-2 bg-[#edcd1f]/20 rounded-lg">
                                    <Car size={20} className="text-[#edcd1f]" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">Premium Collection</h4>
                                    <p className="text-white/70 text-sm">Exclusive vehicles only</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3">
                                <div className="p-2 bg-[#edcd1f]/20 rounded-lg">
                                    <Shield size={20} className="text-[#edcd1f]" />
                                </div>
                                <div>
                                    <h4 className="text-white font-medium">Verified Listings</h4>
                                    <p className="text-white/70 text-sm">100% authentic vehicles</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}

export default Hero;