import { lazy, Suspense } from "react";
import { Hero, Container, Testimonial, HowItWorksCard, LoadingSpinner, About, AuctionCard } from "../components";
import Marquee from "react-fast-marquee";
import { BadgeCheck, Gavel, Tag, Upload, Filter, UserCog2, LucideVerified, UserPlus, Clock, PhoneCall, Target, Users, ArrowRight, User, CarFront, Hand } from "lucide-react";
import { volkswagen, ford, bmw, hyundai, kia, engineCategoryIcon, mercedes, skoda, volvo, audi, renault, tesla, lamborghini, convertible, electric, hatchback, luxury, pickup, sedan, sports, suv, truck, van } from "../assets";
import { useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../utils/axiosInstance";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const FAQs = lazy(() => import('../components/FAQs'));
const CTA = lazy(() => import('../components/CTA'));
const CategoryIconsSection = lazy(() => import('../components/CategoryIconsSection'));

const faqs = [
    {
        question: "Who can bid on vehicles?",
        answer: "Any registered and verified user who is at least 18 years old can bid on cars listed on our platform.",
    },
    {
        question: "What happens if I win an auction?",
        answer: "If you are the winning bidder, our team will contact you directly to finalize the purchase and guide you through secure payment via bank or wire transfer.",
    },
    {
        question: "Is my bid binding?",
        answer: "Yes. Once you place a bid, it is considered binding. If you win, you are expected to complete the purchase.",
    },
    {
        question: "How will I receive the vehicle after payment?",
        answer: "After payment is confirmed, you can arrange pickup or delivery with our team or the seller, depending on the vehicle location.",
    },
    {
        question: "Can I inspect a vehicle before bidding?",
        answer: "Yes, most listings include detailed photos and descriptions. If in-person inspection is allowed, the listing will mention it along with contact details.",
    },
    {
        question: "Are there any hidden charges?",
        answer: "No, there are no hidden fees. All costs will be clearly communicated before you complete your purchase.",
    },
    {
        question: "How do I know my payment is secure?",
        answer: "We only use verified methods such as bank transfers or wire transfers. Our team handles the process directly to ensure a safe and transparent transaction.",
    },
];

const howItWorks = [
    {
        icon: <User className="h-8 w-8" />,
        title: 'Create Your Account',
        description: 'Sign up in minutes and unlock access to verified vehicles, exclusive offers, and real-time updates.',
        step: '01'
    },
    {
        icon: <CarFront className="h-8 w-8" />,
        title: 'Browse Cars',
        description: 'Explore a wide range of vehicles, check verified details, and shortlist the ones that match your needs.',
        step: '02'
    },
    {
        icon: <Hand className="h-8 w-8" />,
        title: 'Make an Offer',
        description: 'Submit your best offer or secure the car instantly. Once accepted, we will help you finalize the deal.',
        step: '03'
    }
];

const testimonials = [
    {
        name: 'Michael R.',
        review: 'The "Make an Offer" feature was perfect. I got exactly what I wanted for my Porsche 911 without the stress of traditional auctions.',
        rating: 5,
        vehicle: 'Porsche 911 Turbo S'
    },
    {
        name: 'Samantha L.',
        review: 'Buying my dream car was so simple with the "Buy Now" option. The entire process was transparent and hassle-free.',
        rating: 5,
        vehicle: 'Mercedes-Benz G-Class'
    },
    {
        name: 'James K.',
        review: 'Sold my classic Mustang through the platform. The instant "Buy Now" purchase saved me weeks of waiting for bids.',
        rating: 4,
        vehicle: 'Ford Mustang GT'
    },
    {
        name: 'Olivia M.',
        review: 'Made an offer on a BMW M3 and it was accepted within hours. The negotiation process was smooth and fair.',
        rating: 5,
        vehicle: 'BMW M3 Competition'
    },
    {
        name: 'Daniel P.',
        review: 'The "Buy Now" option gave me immediate ownership of my Audi R8. No bidding wars, just straight to purchase.',
        rating: 5,
        vehicle: 'Audi R8 V10'
    },
    {
        name: 'Sophia H.',
        review: 'Loved being able to make offers on multiple vehicles. Ended up securing my dream Range Rover at a great price.',
        rating: 4,
        vehicle: 'Land Rover Range Rover'
    },
    {
        name: 'Christopher B.',
        review: 'As a first-time buyer, the "Make an Offer" system was intuitive. Felt in control of the purchase price.',
        rating: 5,
        vehicle: 'Tesla Model S Plaid'
    },
    {
        name: 'Emma W.',
        review: 'Sold my vintage Corvette with "Buy Now" pricing. Had serious offers within minutes of listing.',
        rating: 5,
        vehicle: 'Chevrolet Corvette Stingray'
    }
];

const HowItWorksSelling = [
    {
        icon: <Upload />,
        title: 'List Your Car',
        description: 'Upload clear photos and key details to get your auction started.'
    },
    {
        icon: <UserCog2 />,
        title: 'Expert Review',
        description: `Each vehicle is reviewed and refined for maximum visibility and buyer trust.`
    },
    {
        icon: <Gavel />,
        title: 'Go Live and Engage',
        description: `Once approved, your car listing goes live for interested buyers to view and interact with.`
    },
    {
        icon: <BadgeCheck />,
        title: 'Secure the Deal',
        description: 'After the auction closes, you and the buyer complete the transaction on agreed terms.'
    }
];

const HowItWorksBuying = [
    {
        icon: <UserPlus />,
        title: 'Create Your Account',
        description: 'Sign up in minutes and set up your profile to access all premium vehicle listings.'
    },
    {
        icon: <Clock />,
        title: 'Browse Cars',
        description: 'Explore verified listings, compare details, and follow vehicles you’re interested in — all with real-time updates.'
    },
    {
        icon: <Gavel />,
        title: 'Make an Offer',
        description: 'Submit an offer, negotiate with the seller, or instantly secure the car using Buy Now — no hidden fees.'
    },
    {
        icon: <BadgeCheck />,
        title: 'Complete the Purchase',
        description: 'Once your offer is accepted or bought the vehicle with buy now option, we finalize payment and collection securely.'
    }
];

const trustedBrands = [
    {
        src: bmw,
        alt: 'BMW'
    },
    {
        src: hyundai,
        alt: 'Hyundai'
    },
    {
        src: volvo,
        alt: 'Volvo'
    },
    {
        src: audi,
        alt: 'Audi'
    },
    {
        src: volkswagen,
        alt: 'Volkswagen'
    },
    {
        src: ford,
        alt: 'Ford'
    },
    {
        src: kia,
        alt: 'Kia'
    },
    {
        src: mercedes,
        alt: 'Mercedes'
    },
    {
        src: skoda,
        alt: 'Skoda'
    },
    {
        src: renault,
        alt: 'Renault'
    },
    {
        src: tesla,
        alt: 'Tesla'
    },
    {
        src: lamborghini,
        alt: 'Lamborghini'
    },
];

const categoryIcons = [
    {
        name: 'Convertible',
        icon: convertible,
        type: 'img'
    },
    {
        name: 'Electric',
        icon: electric,
        type: 'img'
    },
    {
        name: 'Hatchback',
        icon: hatchback,
        type: 'img'
    },
    {
        name: 'Luxury',
        icon: luxury,
        type: 'img'
    },
    {
        name: 'Pickup',
        icon: pickup,
        type: 'img'
    },
    {
        name: 'Sedan',
        icon: sedan,
        type: 'img'
    },
    {
        name: 'Sports',
        icon: sports,
        type: 'img'
    },
    {
        name: 'SUV',
        icon: suv,
        type: 'img'
    },
    {
        name: 'Van',
        icon: van,
        type: 'img'
    },
    {
        name: 'Explore',
        icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 13 13">
            <path fill="currentColor" d="M6.5,1A5.5,5.5,0,1,1,1,6.5,5.51,5.51,0,0,1,6.5,1m0-1A6.5,6.5,0,1,0,13,6.5,6.49,6.49,0,0,0,6.5,0Z" />
            <path fill="currentColor" d="M9.7,5.78V7.15a.07.07,0,0,1-.07.07H7.28V9.57a.07.07,0,0,1-.07.07H5.79a.07.07,0,0,1-.07-.07V7.22H3.37a.07.07,0,0,1-.07-.07V5.78a.1.1,0,0,1,.1-.1H5.72V3.33a.07.07,0,0,1,.07-.07H7.21a.07.07,0,0,1,.07.07V5.68H9.6A.1.1,0,0,1,9.7,5.78Z" />
        </svg>,
    }
];

function Home() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('active'); // 'sold', 'active', 'approved'

    // Map tab values to API status values
    const tabStatusMap = {
        'sold': 'sold',
        'active': 'active',
        'approved': 'approved'
    };

    const tabTitles = {
        'active': 'Live Auctions',
        'sold': 'Closed Auctions',
        'approved': 'Upcoming Auctions'
    };

    const tabDescriptions = {
        'active': 'Explore a handpicked lineup of high-quality vehicles — find your perfect car with clear bidding and verified listings you can trust.',
        'sold': 'Browse completed vehicle auctions — including sold and reserve-not-met listings — to make confident, well-informed buying decisions.',
        'approved': 'Discover what’s arriving soon — premium cars entering auction shortly, giving you time to research and strategize your bids.'
    };

    const fetchAuctions = async (tab = activeTab, category = null, limit = 4, sortBy = 'highestBid') => {
        setLoading(true);
        try {
            const status = tabStatusMap[tab];
            const params = new URLSearchParams();
            params.append('status', status);
            params.append('limit', limit.toString());
            params.append('sortBy', sortBy);
            if (category && category !== 'all') {
                params.append('category', category);
            }

            const { data } = await axiosInstance.get(`/api/v1/auctions/top?${params}`);
            if (data.success) {
                setAuctions(data.data.auctions);
            }
        } catch (err) {
            console.error('Fetch auctions error:', err);
            toast.error("Failed to load auctions");
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        fetchAuctions(tab);
    };

    useEffect(() => {
        fetchAuctions('active'); // Load sold auctions by default
    }, []);

    const handleLoadByStatus = () => {
        const status = tabStatusMap[activeTab];
        const params = new URLSearchParams();
        params.append('status', status);
        navigate(`/auctions?${params.toString()}`);
    };

    const handleSearchByTitle = (title) => {
        const params = new URLSearchParams();
        if (title === 'Explore') {
            navigate(`/auctions`);
        } else {
            params.append('search', title);
            navigate(`/auctions?${(params.toString()).toLocaleLowerCase()}`);
        }
    }

    return (
        <>
            <Hero />

            {/* Marquee section */}
            <Container>
                <Marquee speed={50} gradient={false}>
                    <div className="flex gap-8 w-full my-14 mr-8">
                        {
                            trustedBrands.map(brand => (
                                <div key={brand.alt} className="flex items-center justify-center border rounded-lg shadow hover:shadow-lg transition-all border-slate-200 p-4 md:p-5">
                                    <img src={brand.src} alt={brand.alt} className="h-7 sm:h-7 md:h-8 lg:h-10 xl:h-12" />
                                </div>
                            ))
                        }
                    </div>
                </Marquee>
            </Container>

            {/* Category Icons Section */}
            {/* <Container className="mb-14">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-7">
                    {
                        categoryIcons.map(categoryIcon => (
                            <div onClick={() => handleSearchByTitle(categoryIcon.name)} key={categoryIcon.name} className="flex flex-col gap- items-center justify-center p-3 rounded-lg shadow-md max-h-28 cursor-pointer">
                                {categoryIcon.type && categoryIcon.type === 'img' ? <img className="max-h-16" src={categoryIcon.icon} alt={categoryIcon.name} /> : categoryIcon.icon}
                                <p className="text-base sm:text-lg font-medium">{categoryIcon.name}</p>
                            </div>
                        ))
                    }
                </div>
            </Container> */}
            <CategoryIconsSection />

            {/* Dynamic Auctions section */}
            <Container className="mb-14 flex flex-col">
                <div className="flex items-center justify-between flex-wrap gap-y-3">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary order-1">{tabTitles[activeTab]}</h2>
                    <p className="text-sm md:text-base text-gray-500 order-2 md:order-3">
                        {tabDescriptions[activeTab]}
                    </p>
                    <div className="flex items-center gap-5 order-2 mb-3">
                        <div className="flex space-x-2 bg-white p-1 border border-gray-500/50 rounded-md text-sm">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="options"
                                    id="active"
                                    className="hidden peer"
                                    checked={activeTab === 'active'}
                                    onChange={() => handleTabChange('active')}
                                />
                                <label htmlFor="active" className="cursor-pointer rounded py-2 px-4 sm:px-8 text-[#1e2d3b] transition-colors duration-200 peer-checked:bg-[#edcd1f] peer-checked:text-black">
                                    Live
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="options"
                                    id="sold"
                                    className="hidden peer"
                                    checked={activeTab === 'sold'}
                                    onChange={() => handleTabChange('sold')}
                                />
                                <label htmlFor="sold" className="cursor-pointer rounded py-2 px-4 sm:px-8 text-gray-500 transition-colors duration-200 peer-checked:bg-[#edcd1f] peer-checked:text-black">
                                    Closed
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    name="options"
                                    id="approved"
                                    className="hidden peer"
                                    checked={activeTab === 'approved'}
                                    onChange={() => handleTabChange('approved')}
                                />
                                <label htmlFor="approved" className="cursor-pointer rounded py-2 px-4 sm:px-8 text-gray-500 transition-colors duration-200 peer-checked:bg-[#edcd1f] peer-checked:text-black">
                                    Upcoming
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <>
                        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-7 gap-y-10 mt-8">
                            {auctions.map((auction) => (
                                <AuctionCard
                                    key={auction._id}
                                    auction={auction}
                                />
                            ))}
                        </section>

                        {auctions.length > 0 && (
                            <button
                                onClick={handleLoadByStatus}
                                className="px-8 py-3 bg-[#edcd1f] text-black rounded-lg hover:bg-[#edcd1f]/90 focus:outline-none focus:ring-2 focus:ring-[#edcd1f] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 mt-10 mx-auto"
                            >
                                View More
                            </button>
                        )}

                        {auctions.length === 0 && !loading && (
                            <div className="text-center py-16 text-gray-500">
                                <Filter size={48} className="mx-auto mb-4 text-gray-300" />
                                <p className="text-lg font-medium">No auctions found</p>
                                <p className="text-sm">Try adjusting your filters or search terms</p>
                            </div>
                        )}
                    </>
                )}
            </Container>

            {/* Who we are section */}
            <Container className="my-14">
                <About />
            </Container>

            {/* <Container className="my-14">
                <section className="">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">How It Works For Sellers</h2>
                    <p className="text-sm md:text-base text-gray-500 mt-3 mb-8">
                        Easy process, smooth results — see how Speed Ways UK streamlines every stage of selling your car.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 xl:gap-8">
                        {
                            HowItWorksSelling && HowItWorksSelling.map((howItWork, i) => {
                                return (
                                    <HowItWorksCard key={howItWork.title} index={i} icon={howItWork.icon} title={howItWork.title} description={howItWork.description} />
                                )
                            })
                        }
                    </div>
                </section>
            </Container> */}

            {/* <Container className="my-14">
                <section className="">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">How It Works</h2>
                    <p className="text-sm md:text-base text-gray-500 mt-3 mb-8">
                        Effortless bidding, confident buying — experience how Speed Ways UK makes finding the right car simple and smooth.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 xl:gap-8">
                        {
                            HowItWorksBuying && HowItWorksBuying.map((howItWork, i) => {
                                return (
                                    <HowItWorksCard key={howItWork.title} index={i} icon={howItWork.icon} title={howItWork.title} description={howItWork.description} />
                                )
                            })
                        }
                    </div>
                </section>
            </Container> */}

            <Container className="my-14">
                <div className="text-left mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        How It Works
                    </h2>
                    <p className="text-sm md:text-base text-gray-500">
                        We combine verified listings and expert support to give buyers a safe and transparent vehicle trading experience.
                    </p>
                </div>


                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {howItWorks.map((item, index) => (
                        <div
                            key={index}
                            className="relative group bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            {/* Step number in top-right corner */}
                            <div className="absolute top-6 right-6">
                                <span className="text-3xl font-bold text-gray-200">{item.step}</span>
                            </div>

                            {/* Icon container */}
                            <div className="inline-flex items-center justify-center p-4 bg-gray-100 group-hover:bg-[#edcd1f] transition-colors duration-200 rounded-xl mb-6">
                                <div className="text-primary">
                                    {item.icon}
                                </div>
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{item.description}</p>

                            {/* Connector line for desktop */}
                            {index < howItWorks.length - 1 && (
                                <div className="hidden md:block absolute top-1/2 -right-5 w-10 h-0.5 bg-gray-200"></div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex justify-center items-center">
                    <Link to={`/register`} className="mt-8 px-8 py-3 bg-[#edcd1f] text-black font-medium rounded-lg hover:bg-[#edcd1f]/90 transition-colors flex items-center gap-2">
                        <span>Get Started</span>
                        <ArrowRight />
                    </Link>
                </div>
            </Container>

            <Container className="my-14">
                <section>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">
                        What Our Customers Say
                    </h2>
                    <p className="text-sm md:text-base text-gray-500 mt-3">
                        Trusted by car buyers and sellers across the UK — discover why thousands rely on Speed Ways UK for every automotive deal.
                    </p>
                    <Marquee speed={50} gradient={false} pauseOnHover={true}>
                        <div className="flex flex-wrap justify-between items-stretch gap-5 mt-8 mx-5 text-left pb-1">
                            {
                                testimonials?.slice(0, 4).map(testimonial => (
                                    <Testimonial
                                        key={testimonial.name}
                                        name={testimonial.name}
                                        review={testimonial.review}
                                        rating={testimonial.rating}
                                        vehicle={testimonial.vehicle}
                                    />
                                ))
                            }
                        </div>
                    </Marquee>

                    <Marquee speed={50} direction="right" gradient={false} pauseOnHover={true}>
                        <div className="flex flex-wrap justify-between items-stretch gap-5 mt-8 mx-5 text-left pb-1">
                            {
                                testimonials?.slice(4, 8).map(testimonial => (
                                    <Testimonial
                                        key={testimonial.name}
                                        name={testimonial.name}
                                        review={testimonial.review}
                                        rating={testimonial.rating}
                                        vehicle={testimonial.vehicle}
                                    />
                                ))
                            }
                        </div>
                    </Marquee>
                </section>
            </Container>

            {/* <Container className="my-14">
                <Suspense fallback={<LoadingSpinner />}>
                    <FAQs faqs={faqs} />
                </Suspense>
            </Container> */}

            <Container className="my-14">
                <Suspense fallback={<LoadingSpinner />}>
                    <CTA />
                </Suspense>
            </Container>
        </>
    )
}

export default Home;