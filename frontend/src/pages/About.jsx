import { Verified, Upload, Tag, Gavel, BadgeCheck, UserCog2, UserPlus, Clock, Heart, Shield, Users, Award, Car, Calendar, Cpu, CheckCircle, Mail } from "lucide-react";
import { aboutUs, audi, bmw, faqImg, ford, hyundai, kia, lamborghini, mercedes, renault, skoda, tesla, volkswagen, volvo } from "../assets";
import { Container, HowItWorksCard, Testimonial } from "../components";
import { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";

const stats = [
    {
        name: 'Trusted Marketplace',
        data: '100%'
    },
    {
        name: 'Completed Sales',
        data: '95%'
    },
    {
        name: 'Verified Listings',
        data: '100%'
    },
    {
        name: 'Customer Satisfaction',
        data: `5/5`
    }
];

const HowItWorksSelling = [
    {
        icon: <Upload />,
        title: 'Submit Your Listing',
        description: 'Begin by submitting your aircraft, aviation parts, or memorabilia through our secure online form. Upload clear photos, accurate details, and any supporting documents to showcase your aircraft or aviation related item.'
    },
    {
        icon: <UserCog2 />,
        title: 'Expert Curation',
        description: `Our aviation specialists carefully review and refine each submission to ensure it's presented in the most compelling way possible. Every listing is tailored for maximum visibility, credebility, and results - giving both you and the buyer confidence in every transaction.`
    },
    {
        icon: <Gavel />,
        title: 'Go Live and Engage',
        description: `Once approved, your listing is published on PlaneVault for our global audience of qualified buyers. You'll have the opportunity to answer questions, share insights, and help your auction reach its highest potential.`
    },
    {
        icon: <BadgeCheck />,
        title: 'Complete the Sale',
        description: 'When the auction closes, PlaneVault connects the winning bidder and seller directly. From there, both parties finalize the transaction on their own terms. For security and convenience, we recommend completing payment through wire transfer or a trusted escrow service'
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

function About() {
    return (
        <section className="pt-24 md:pt-32 pb-16 max-w-full text-gray-600">
            <div className="bg-white">
                <Container>
                    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-12 md:py-16">
                        {/* Left Content */}
                        <div className="order-2 lg:order-1">
                            <p className="text-sm font-medium text-[#1e2d3b] mb-4">About Us</p>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8 leading-tight">
                                Redefining <br />
                                Car Auctions <br />
                                Through Trust.
                            </h1>
                            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10">
                                Your trust is our highest priority, with a seamless car-auction experience crafted around your needs.

                                Trusted by countless buyers and sellers, we deliver a secure, transparent, and modern way to buy and sell vehicles.
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-blue-50 rounded-xl p-6">
                                    <div className="flex flex-col justify-center sm:flex-row items-center sm:gap-4">
                                        <div className="p-3 bg-white rounded-lg">
                                            <Car className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">1000+</h3>
                                            <p className="text-gray-600 text-sm">Cars Sold</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 rounded-xl p-6">
                                    <div className="flex flex-col justify-center sm:flex-row items-center sm:gap-4">
                                        <div className="p-3 bg-white rounded-lg">
                                            <Users className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">500+</h3>
                                            <p className="text-gray-600 text-sm">Trusted Buyers</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Image */}
                        <div className="order-1 lg:order-2">
                            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
                                {/* Replace this with your actual image */}
                                <img src={faqImg} alt="About Us" className="" />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            {/* Our stats */}
            <Container className="mb-14 pt-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Car className="h-8 w-8 text-blue-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">1000+</h3>
                        <p className="text-gray-600 mt-2">Cars Sold</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <Shield className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">500+</h3>
                        <p className="text-gray-600 mt-2">Trusted Buyers</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-purple-100 rounded-full">
                                <Mail className="h-8 w-8 text-purple-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">24/7</h3>
                        <p className="text-gray-600 mt-2">Customer Support</p>
                    </div>

                    <div className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-center mb-4">
                            <div className="p-3 bg-amber-100 rounded-full">
                                <Award className="h-8 w-8 text-amber-600" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900">98%</h3>
                        <p className="text-gray-600 mt-2">Buyer Satisfaction</p>
                    </div>
                </div>
            </Container>

            {/* Brands we work with */}
            <Container className="mb-14">
                <div className="max-w-full mx-auto mb-8 text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                        Brands We Work With
                    </h2>
                    <p className="text-lg text-gray-700">
                        We work with a wide range of car brands to bring you the best selection of vehicles.
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1.5 mx-auto">
                    {/* <div className="flex items-center justify-center h-20 w-44 md:h-24 md:w-60 bg-slate-100/80 hover:bg-slate-100 transition-all duration-100">
                        <img src={audi} alt="audi" className="h-10" />
                    </div> */}
                    <div className="flex items-center justify-center h-20 w-44 md:h-24 md:w-60 bg-slate-100/80 hover:bg-slate-100 transition-all duration-100">
                        <img src={kia} alt="kia" className="h-10 mix-blend-multiply" />
                    </div>
                    <div className="flex items-center justify-center h-20 w-44 md:h-24 md:w-60 bg-slate-100/80 hover:bg-slate-100 transition-all duration-100">
                        <img src={hyundai} alt="hyundai" className="h-10 mix-blend-multiply" />
                    </div>
                    {/* <div className="flex items-center justify-center h-20 w-44 md:h-24 md:w-60 bg-slate-100/80 hover:bg-slate-100 transition-all duration-100">
                        <img src={ford} alt="ford" className="h-10" />
                    </div> */}
                    <div className="flex items-center justify-center h-20 w-44 md:h-24 md:w-60 bg-slate-100/80 hover:bg-slate-100 transition-all duration-100">
                        <img src={mercedes} alt="mercedes" className="h-12 mix-blend-multiply" />
                    </div>
                    <div className="flex items-center justify-center h-20 w-44 md:h-24 md:w-60 bg-slate-100/80 hover:bg-slate-100 transition-all duration-100">
                        <img src={bmw} alt="bmw" className="h-12 mix-blend-multiply" />
                    </div>
                    <div className="flex items-center justify-center h-20 w-44 md:h-24 md:w-60 bg-slate-100/80 hover:bg-slate-100 transition-all duration-100">
                        <img src={volkswagen} alt="volkswagen" className="h-12 mix-blend-multiply" />
                    </div>
                    <div className="flex items-center justify-center h-20 w-44 md:h-24 md:w-60 bg-slate-100/80 hover:bg-slate-100 transition-all duration-100">
                        <img src={volvo} alt="volvo" className="h-12 mix-blend-multiply" />
                    </div>
                    <div className="flex items-center justify-center h-20 w-44 md:h-24 md:w-60 bg-slate-100/80 hover:bg-slate-100 transition-all duration-100">
                        <img src={lamborghini} alt="lamborghini" className="h-12 mix-blend-multiply" />
                    </div>
                    <div className="flex items-center justify-center h-20 w-44 md:h-24 md:w-60 bg-slate-100/80 hover:bg-slate-100 transition-all duration-100">
                        <img src={renault} alt="renault" className="h-12 mix-blend-multiply" />
                    </div>
                    <div className="flex items-center justify-center h-20 w-44 md:h-24 md:w-60 bg-slate-100/80 hover:bg-slate-100 transition-all duration-100">
                        <img src={tesla} alt="tesla" className="h-12 mix-blend-multiply" />
                    </div>
                    <div className="flex items-center justify-center h-20 w-44 md:h-24 md:w-60 bg-slate-100/80 hover:bg-slate-100 transition-all duration-100">
                        <img src={skoda} alt="skoda" className="h-12 mix-blend-multiply" />
                    </div>
                </div>
            </Container>

            {/* Why choose SpeedWays Auto */}
            <div className="">
                <Container>
                    <div className="max-w-full mx-auto mb-10 text-left">
                        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                            Why Choose Us?
                        </h2>
                        <p className="text-lg text-gray-700">
                            A smarter, safer, and more transparent way to buy and sell vehicles online.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Decorative line */}
                        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"></div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12">

                            {/* Left Column */}
                            <div className="space-y-8 md:pr-12">

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Verified & Trusted Listings
                                        </h3>
                                        <p className="text-gray-600">
                                            Every vehicle goes through thorough verification, giving buyers confidence and sellers credibility.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <Clock className="h-5 w-5 text-blue-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Real-Time Updates
                                        </h3>
                                        <p className="text-gray-600">
                                            Stay informed with instant notifications on offers, price changes, and auction activity.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Cpu className="h-5 w-5 text-purple-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Smart, Modern Platform
                                        </h3>
                                        <p className="text-gray-600">
                                            Built with advanced technology for smooth browsing, secure offers, and hassle-free transactions.
                                        </p>
                                    </div>
                                </div>

                            </div>

                            {/* Right Column */}
                            <div className="space-y-8 md:pl-12">

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="p-2 bg-amber-100 rounded-lg">
                                            <Heart className="h-5 w-5 text-amber-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Buyer Focused
                                        </h3>
                                        <p className="text-gray-600">
                                            If you're purchasing, every feature is designed to support a fair, transparent experience.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="p-2 bg-cyan-100 rounded-lg">
                                            <Calendar className="h-5 w-5 text-cyan-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Easy Offers
                                        </h3>
                                        <p className="text-gray-600">
                                            Keep an eye on live and upcoming auctions and make offers effortlessly through your dashboard.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <Shield className="h-5 w-5 text-red-600" />
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            Secure & Transparent Process
                                        </h3>
                                        <p className="text-gray-600">
                                            Clear documentation, protected payments, and strict security measures ensure peace of mind throughout the transaction.
                                        </p>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>
                </Container>
            </div>

            {/* <Container className="my-14">
                <section className="">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">How It Works - Selling on PlaneVault</h2>
                    <p className="text-sm md:text-base text-gray-500 mt-3 mb-8">
                        Simple steps, seamless auctions — see how Plane Vault makes listing and selling aviation assets effortless.
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

            <Container className="my-14">
                <section className="">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">How It Works</h2>
                    <p className="text-sm md:text-base text-gray-500 mt-3 mb-8">
                        Effortless bidding, confident buying — experience how SpeedWays Auto makes finding the right car simple and smooth.
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
            </Container>

            {/* Testimonials section */}
            <section className="my-14">
                <Container>
                    <h2 className="text-3xl md:text-4xl font-bold text-primary">
                        What Our Customers Say
                    </h2>
                    <p className="text-sm md:text-base text-gray-500 mt-3">
                        Trusted by car buyers and sellers across the UK — discover why thousands rely on SpeedWays Auto for every automotive deal.
                    </p>
                    <Marquee speed={50} gradient={false} pauseOnHover={true}>
                        <div className="flex flex-wrap justify-between items-stretch gap-5 mt-8 mx-5 text-left">
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
                        <div className="flex flex-wrap justify-between items-stretch gap-5 mt-8 mx-5 text-left">
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
                </Container>
            </section>
        </section >
    );
}

export default About;