import { ChartColumnIncreasing, Shield, Store, ChevronRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { about, faqImg, whoWeAre } from "../assets";
import { useEffect, useRef, useState } from "react";

function About() {
    const ref = useRef();
    const [iconColor, setIconColor] = useState({first:false, second:false, third:false});
    const [isVisible, setIsVisible] = useState(false);
    const [expanded, setExpanded] = useState({first:false, second:false, third:false});

    const handleScroll = () => {
        if(!ref?.current) return;

        const top = ref?.current?.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        // Animation trigger
        if(top < windowHeight * 0.8) {
            setIsVisible(true);
        }

        // Icon color animations - adjusted for better timing
        if(top < 400){
            setIconColor({...iconColor, first: true});
        }
        if(top < 300){
            setIconColor({...iconColor, first: true, second: true});
        }
        if(top < 200){
            setIconColor({...iconColor, first: true, second: true, third: true});
        }
        if(top > 400){
            setIconColor({...iconColor, first: false, second: false, third: false});
        }
    }

    const toggleExpand = (section) => {
        setExpanded(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section ref={ref} className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-0 items-center ">
            {/* Image Section - Enhanced */}
            <div className="lg:col-span-5 relative group">
                <div className="relative overflow-hidden rounded-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/5 z-10"></div>
                    <img 
                        loading="lazy" 
                        src={faqImg} 
                        alt="SpeedWays Auto Team" 
                        className={`w-full h-64 sm:h-80 lg:h-full object-cover transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-105 opacity-90'}`}
                    />
                    {/* Decorative elements */}
                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#edcd1f]/20 rounded-full blur-xl"></div>
                    <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
                </div>
                
                {/* Floating stats badge */}
                <div className={`absolute -bottom-6 left-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100 transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Shield className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-primary">95%</p>
                            <p className="text-sm text-gray-600">Success Rate</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacing column */}
            <div className="lg:col-span-1 hidden lg:block"></div>

            {/* Content Section - Enhanced */}
            <div className="lg:col-span-6">
                <div className={`transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#edcd1f]/10 rounded-full mb-4">
                        <span className="w-2 h-2 bg-[#edcd1f] rounded-full"></span>
                        <span className="text-sm font-semibold text-secondary">About Us</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-bold my-4 text-primary leading-tight">
                        Who <span className="text-[#edcd1f]">We Are</span>
                    </h2>
                    
                    <p className="text-lg text-gray-700 leading-relaxed mb-8 border-l-4 border-[#edcd1f] pl-4 py-1">
                        SpeedWays Auto Limited is a trade-only vehicle remarketing and auction platform, providing motor traders with access to nearly new vehicles at wholesale prices. We partner with leasing, finance, fleet, and insurance companies, supported by secure technology and an experienced team to ensure transparent, efficient, and reliable transactions.
                    </p>

                    {/* Features Grid - Enhanced with collapsible sections */}
                    <div className="space-y-4 my-8">
                        {/* Trusted Expertise */}
                        <div className={`bg-gray-50 rounded-xl transition-all duration-300 ${expanded.first ? 'shadow-md' : ''} ${iconColor.first ? 'border-l-4 border-[#edcd1f]' : ''}`}>
                            <button 
                                onClick={() => toggleExpand('first')}
                                className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-white/50"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${iconColor.first ? 'bg-[#edcd1f]' : 'bg-gray-100'}`}>
                                        <Shield className={`h-7 w-7 transition-colors duration-300 ${iconColor.first ? 'text-black' : 'text-primary'}`} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-xl font-bold text-primary mb-1">
                                            Trusted Expertise
                                        </h3>
                                    </div>
                                </div>
                                <ChevronDown className={`h-5 w-5 text-[#edcd1f] transition-transform duration-300 ${expanded.first ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-300 ${expanded.first ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 pl-20">
                                    <p className="text-gray-600">
                                        Our deep experience in the automotive market ensures each auction is handled professionally from start to finish.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Seller & Buyer Focused */}
                        <div className={`bg-gray-50 rounded-xl transition-all duration-300 ${expanded.second ? 'shadow-md' : ''} ${iconColor.second ? 'border-l-4 border-[#edcd1f]' : ''}`}>
                            <button 
                                onClick={() => toggleExpand('second')}
                                className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-white/50"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${iconColor.second ? 'bg-[#edcd1f]' : 'bg-gray-100'}`}>
                                        <Store className={`h-7 w-7 transition-colors duration-300 ${iconColor.second ? 'text-black' : 'text-primary'}`} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-xl font-bold text-primary mb-1">
                                            Seller & Buyer Focused
                                        </h3>
                                    </div>
                                </div>
                                <ChevronDown className={`h-5 w-5 text-[#edcd1f] transition-transform duration-300 ${expanded.second ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-300 ${expanded.second ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 pl-20">
                                    <p className="text-gray-600">
                                        From listing your vehicle to placing a bid, SpeedWays Auto ensures a secure and transparent process throughout.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Proven Outcomes */}
                        <div className={`bg-gray-50 rounded-xl transition-all duration-300 ${expanded.third ? 'shadow-md' : ''} ${iconColor.third ? 'border-l-4 border-[#edcd1f]' : ''}`}>
                            <button 
                                onClick={() => toggleExpand('third')}
                                className="w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:bg-white/50"
                            >
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-500 ${iconColor.third ? 'bg-[#edcd1f]' : 'bg-gray-100'}`}>
                                        <ChartColumnIncreasing className={`h-7 w-7 transition-colors duration-300 ${iconColor.third ? 'text-black' : 'text-primary'}`} />
                                    </div>
                                    <div className="text-left">
                                        <h3 className="text-xl font-bold text-primary mb-1">
                                            Proven Outcomes
                                        </h3>
                                    </div>
                                </div>
                                <ChevronDown className={`h-5 w-5 text-[#edcd1f] transition-transform duration-300 ${expanded.third ? 'rotate-180' : ''}`} />
                            </button>
                            
                            <div className={`overflow-hidden transition-all duration-300 ${expanded.third ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="px-4 pb-4 pl-20">
                                    <p className="text-gray-600">
                                        From everyday cars to high-end vehicles, sellers close deals and buyers gain confidence with every auction.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button - Enhanced */}
                    <Link 
                        to={'/about'} 
                        className="group inline-flex items-center gap-3 bg-[#edcd1f] hover:bg-[#d4b41a] text-black font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                        <span>Read More</span>
                        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

export default About;