import { Plane, PlaneTakeoff, Shield, TrendingUp, Users, CheckCircle, Gauge, Car, Wrench } from "lucide-react";
import { useNavigate } from "react-router";
import { cta } from "../assets";
import { useEffect, useState } from "react";

function CTA() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        const section = document.querySelector('.cta-section');
        if (section) observer.observe(section);

        return () => {
            if (section) observer.unobserve(section);
        };
    }, []);

    return (
        <section className="cta-section max-w-full text-white rounded-3xl relative overflow-hidden my-12">
            {/* Fixed Background with Fallback */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/60">
                {cta ? (
                    <img
                        src={cta}
                        alt="Automotive Marketplace UK"
                        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40"
                        loading="lazy"
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-[#edcd1f]/20"></div>
                )}

                {/* Background animation */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#edcd1f]/20 rounded-full blur-3xl animate-pulse delay-1000" />
                </div>
            </div>

            {/* Content */}
            <div className={`relative z-10 py-16 md:py-10 px-6 md:px-12 lg:px-20 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="max-w-full mx-auto">

                    {/* Badge */}
                    <div className="flex justify-center mb-8">
                        <div className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 transition-all duration-700 ${isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                            <div className="p-1.5 bg-[#edcd1f] rounded-full">
                                <Shield className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-medium text-white">
                                Trusted by 500+ Car Buyers Across the UK
                            </span>
                        </div>
                    </div>

                    {/* Main Heading */}
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                            <span className="block">Your Trusted Platform</span>
                            <span className="text-[#edcd1f]">For Car Auctions</span>
                        </h2>
                        <p className="text-lg text-white/90 max-w-3xl mx-auto mb-8">
                            Conduct secure, transparent, and fast automotive transactions—built for UK car enthusiasts.
                        </p>
                    </div>

                    {/* Features Grid */}
                    {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {[
                            { icon: <Shield className="h-6 w-6" />, title: "Secure Deals", desc: "Verified buyers & sellers for safe transactions" },
                            { icon: <TrendingUp className="h-6 w-6" />, title: "Best Market Prices", desc: "Get the most competitive car valuations" },
                            { icon: <Users className="h-6 w-6" />, title: "UK-Wide Community", desc: "Connect with trusted car dealers & owners" }
                        ].map((feature, index) => (
                            <div
                                key={index}
                                className={`bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center transition-all duration-500 hover:bg-white/10 hover:border-white/20 hover:transform hover:-translate-y-2 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
                                style={{ transitionDelay: `${index * 200}ms` }}
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-[#edcd1f] rounded-xl mb-4 mx-auto">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                                <p className="text-white/70 text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div> */}

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
                        <button
                            onClick={() => navigate('/login')}
                            className="group inline-flex items-center justify-center gap-3 bg-[#edcd1f] hover:bg-[#d4b41a] text-black font-bold py-4 px-10 rounded-xl text-base transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 min-w-[200px]"
                        >
                            <span>Get Started</span>
                            <Gauge className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                        </button>

                        <button
                            onClick={() => navigate('/contact')}
                            className="group inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white/30 hover:border-white text-white font-semibold py-4 px-10 rounded-xl text-base transition-all duration-300 hover:bg-white/10 min-w-[200px]"
                        >
                            <span>Have a Question?</span>
                            <svg className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>

                    {/* Trust Indicators */}
                    <div className="border-t border-white/20 pt-8 mt-8">
                        <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-center">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-[#edcd1f]" />
                                <div className="text-left">
                                    <p className="text-2xl font-bold">98%</p>
                                    <p className="text-sm text-white/70">Satisfaction</p>
                                </div>
                            </div>
                            <div className="hidden md:block w-px h-10 bg-white/20"></div>

                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-[#edcd1f]" />
                                <div className="text-left">
                                    <p className="text-2xl font-bold">24/7</p>
                                    <p className="text-sm text-white/70">UK Support</p>
                                </div>
                            </div>
                            <div className="hidden md:block w-px h-10 bg-white/20"></div>

                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-[#edcd1f]" />
                                <div className="text-left">
                                    <p className="text-2xl font-bold">1000+</p>
                                    <p className="text-sm text-white/70">Cars Sold</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom tagline */}
                    <div className="text-center mt-8">
                        <p className="text-white/60 text-sm">
                            Trusted by UK drivers • transparent listings • fast deals
                        </p>
                    </div>
                </div>
            </div>

            {/* Floating icons animation */}
            {isVisible && (
                <>
                    <div className="absolute top-1/4 left-10 opacity-20 animate-float">
                        <Car className="h-12 w-12" />
                    </div>
                    <div className="absolute bottom-1/4 right-10 opacity-20 animate-float-delayed">
                        <Wrench className="h-10 w-10 -rotate-12" />
                    </div>
                </>
            )}
        </section>

    );
}

export default CTA;