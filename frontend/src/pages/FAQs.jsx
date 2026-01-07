import { Container } from "../components";
import { MessageCircleQuestion, Search, Shield, HelpCircle, Phone, Mail, Car, CreditCard, Truck, Store, FileText, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { faqImg } from "../assets";

const faqs = [
    {
        category: "Buyer",
        icon: <Car size={20} />,
        questions: [
            {
                question: "Who can buy vehicles on SpeedWays?",
                answer: "SpeedWays is a trade-only platform. Only verified motor traders, including sole traders and limited companies based in the UK or Ireland, may register and purchase. Consumers are not permitted."
            },
            {
                question: "Are there any fees for buying a vehicle?",
                answer: "No. Currently, there are no buyer's fees, premiums, or transaction charges. The agreed vehicle price is the price invoiced."
            },
            {
                question: "Can I inspect a vehicle before purchasing?",
                answer: "Yes. Buyers are encouraged to inspect and, where permitted, test drive vehicles before payment and collection. All vehicles are sold as seen / trade sale, so inspection should be completed before payment."
            },
            {
                question: "Are vehicles sold with a warranty?",
                answer: "No. All vehicles are sold on a trade sale, sold-as-seen basis, without warranty and without consumer rights. Vehicle descriptions are provided for guidance only."
            },
            {
                question: "Can I return a vehicle after purchase?",
                answer: "No. No refunds or returns are accepted under any circumstances, once a vehicle has been paid for and/or collected."
            },
            {
                question: "How does 'Make an Offer' work?",
                answer: "You may submit an offer on eligible vehicles. If your offer is accepted, a legally binding contract is formed and payment must be completed within the required timeframe."
            },
            {
                question: "Are bids and Buy Now purchases binding?",
                answer: "Yes. All bids, accepted offers, and Buy Now purchases are legally binding. Bid retractions are not permitted."
            }
        ]
    },
    {
        category: "Payments",
        icon: <CreditCard size={20} />,
        questions: [
            {
                question: "What payment methods are accepted?",
                answer: "Payment is accepted by bank transfer only. Cash, card payments, and third-party payments are not permitted."
            },
            {
                question: "How long do I have to make payment?",
                answer: "Full cleared payment must be received within three (3) working days of: winning an auction, an offer being accepted, or completing a Buy Now purchase, unless otherwise agreed in writing."
            },
            {
                question: "What happens after I make payment?",
                answer: "Once payment has cleared: an invoice is issued, collection or delivery can be arranged, a release code may be provided for third-party collection. Ownership transfers only after full payment is received."
            },
            {
                question: "Is off-platform communication or payment allowed?",
                answer: "No. All communication, offers, and payments must be made through SpeedWays Auto Limited. Off-platform activity may result in account suspension or termination."
            }
        ]
    },
    {
        category: "Collection & Delivery",
        icon: <Truck size={20} />,
        questions: [
            {
                question: "Can I collect the vehicle myself?",
                answer: "Yes. Collection is available by appointment only. Please notify us at least one hour before arrival so the vehicle can be prepared."
            },
            {
                question: "Do you offer delivery?",
                answer: "Yes. Delivery can be arranged at the buyer's request. Costs will be quoted in advance and must be paid before dispatch."
            },
            {
                question: "When does risk transfer to the buyer?",
                answer: "Risk transfers to the buyer once the vehicle is collected or delivered, whichever occurs first."
            }
        ]
    },
    {
        category: "Seller (Trade Services)",
        icon: <Store size={20} />,
        questions: [
            {
                question: "I have stock to sell — can SpeedWays help?",
                answer: "Yes. We offer bespoke vehicle remarketing services for motor traders, fleet operators, leasing companies, and partners. You can request a tailored quote based on your stock and required services."
            },
            {
                question: "What services do you offer to sellers?",
                answer: "Our trade services include: vehicle inspection and appraisal, professional vehicle listings, remarketing on our platform and partner platforms, vehicle storage, vehicle collection and delivery, vehicle preparation, mechanical repairs, bodywork and cosmetic repairs."
            },
            {
                question: "Do you inspect and appraise vehicles before listing?",
                answer: "Yes. We can inspect and appraise vehicles before listing to help ensure accurate descriptions and maximise sale value."
            },
            {
                question: "How much does it cost to sell vehicles with SpeedWays?",
                answer: "Fees are bespoke and depend on: vehicle type, volume of stock, services required. Please contact us for a tailored quotation."
            },
            {
                question: "Do you sell vehicles on behalf of other companies?",
                answer: "Yes. SpeedWays acts as both: a principal seller (vehicles we own), and an agent/intermediary (vehicles owned by partners). In all cases, SpeedWays manages the sales process and issues the invoice."
            }
        ]
    },
    {
        category: "Accounts & Compliance",
        icon: <FileText size={20} />,
        questions: [
            {
                question: "How do you verify trade accounts?",
                answer: "We verify trade status using Companies House, VAT checks, online presence, and, where required, additional documentation."
            },
            {
                question: "What happens if a buyer fails to complete a purchase?",
                answer: "If payment is not completed: the sale may be cancelled, the vehicle may be resold, losses and costs may be recovered, the account may be suspended or permanently banned."
            },
            {
                question: "Can my account be suspended?",
                answer: "Yes. Accounts may be suspended or terminated for non-payment, time-wasting, misuse of the platform, false information, or attempting off-platform transactions."
            }
        ]
    },
    {
        category: "General",
        icon: <Clock size={20} />,
        questions: [
            {
                question: "What are your business hours?",
                answer: "Monday – Friday: 9:00am – 5:00pm | Saturday: 9:00am – 2:30pm"
            },
            {
                question: "How can I contact SpeedWays?",
                answer: "SpeedWays Auto Limited | Phone: +44 (0)161 883 2737 | Email: admin@speedways.uk"
            }
        ]
    }
];

function FAQsPage() {
    const [openIndex, setOpenIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");

    const filteredFaqs = faqs.flatMap(category =>
        category.questions.filter(q =>
            (activeCategory === "all" || category.category === activeCategory) &&
            (q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                q.answer.toLowerCase().includes(searchTerm.toLowerCase()))
        ).map(q => ({ ...q, category: category.category }))
    );

    return (
        <section className="pt-24 md:pt-32 bg-gradient-to-b from-white to-gray-50 max-w-full">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary/5 via-white to-[#edcd1f]/5 py-16">
                <Container>
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#edcd1f]/10 rounded-full mb-4">
                            <span className="w-2 h-2 bg-[#edcd1f] rounded-full"></span>
                            <span className="text-sm font-semibold text-secondary">FAQ Center</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
                            Find quick answers to common questions about buying and selling vehicles on SpeedWays Auto.
                        </p>

                        {/* Search Bar */}
                        <div className="max-w-2xl mx-auto mb-12">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search for answers..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-[#edcd1f] focus:border-transparent outline-none transition-all duration-200"
                                />
                            </div>
                        </div>
                    </div>
                </Container>
            </div>

            <Container className="py-12">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 mb-12 justify-center">
                    <button
                        onClick={() => setActiveCategory("all")}
                        className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${activeCategory === "all" ? 'bg-[#edcd1f] text-black shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                    >
                        All Questions
                    </button>
                    {faqs.map((cat) => (
                        <button
                            key={cat.category}
                            onClick={() => setActiveCategory(cat.category)}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 ${activeCategory === cat.category ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                        >
                            {cat.icon}
                            {cat.category}
                        </button>
                    ))}
                </div>

                {/* Category Summary Cards (Optional) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {faqs.map((category) => (
                        <div key={category.category} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    {category.icon}
                                </div>
                                <h3 className="text-lg font-bold text-primary">{category.category}</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                                {category.questions.length} questions
                            </p>
                            <ul className="space-y-2">
                                {category.questions.slice(0, 2).map((q, idx) => (
                                    <li key={idx} className="text-sm font-medium text-gray-900 truncate">
                                        • {q.question}
                                    </li>
                                ))}
                                {category.questions.length > 2 && (
                                    <li className="text-sm text-gray-500">
                                        + {category.questions.length - 2} more questions
                                    </li>
                                )}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Detailed FAQ Accordion */}
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-3xl font-bold text-primary mb-8 text-center">Detailed Questions & Answers</h2>
                    
                    {searchTerm && (
                        <div className="mb-6 text-center">
                            <p className="text-gray-600">
                                Found <span className="font-bold text-primary">{filteredFaqs.length}</span> result{filteredFaqs.length !== 1 ? 's' : ''} for "<span className="font-semibold">{searchTerm}</span>"
                            </p>
                        </div>
                    )}

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, index) => (
                                <div key={index} className="border-b border-gray-100 last:border-0">
                                    <button
                                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        className="w-full px-8 py-6 flex items-start justify-between text-left hover:bg-gray-50 transition-all duration-200"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                                                    {faq.category}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 pr-8">{faq.question}</h3>
                                        </div>
                                        <div className={`ml-4 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 transition-all duration-300 ${openIndex === index ? 'rotate-180 bg-[#edcd1f]' : ''}`}>
                                            <svg className={`w-5 h-5 transition-colors ${openIndex === index ? 'text-black' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="px-8 pb-6">
                                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-8 py-12 text-center">
                                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                                <p className="text-gray-600 mb-4">Try adjusting your search or filter to find what you're looking for.</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setActiveCategory("all");
                                    }}
                                    className="px-4 py-2 bg-[#edcd1f] text-black rounded-lg font-medium hover:bg-[#edcd1f]/90 transition-colors"
                                >
                                    Clear Search & Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Important Notice */}
                <div className="mt-12 p-6 bg-yellow-50 border border-yellow-200 rounded-xl max-w-5xl mx-auto">
                    <div className="flex items-start gap-4">
                        <Shield className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-yellow-800 mb-2">Important Legal Notice</h3>
                            <p className="text-yellow-700 text-sm">
                                SpeedWays is a trade-only platform. All sales are on a trade sale, sold-as-seen basis without warranty. 
                                All bids, offers, and Buy Now purchases are legally binding. Please review our full Terms & Conditions 
                                and Buyer Agreement for complete details.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="mt-14 bg-gradient-to-r from-[#1e2d3b] to-[#1e2d3b]/90 rounded-2xl p-8 md:p-12 text-white">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Still have questions?</h2>
                        <p className="text-lg text-white/90 mb-8">
                            Our support team is here to help you with any other questions you might have.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+441618832737"
                                className="inline-flex items-center justify-center gap-3 bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg"
                            >
                                <Phone size={20} />
                                Call Us: +44 (0)161 883 2737
                            </a>
                            <a
                                href="mailto:admin@speedways.uk"
                                className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-all duration-300"
                            >
                                <Mail size={20} />
                                Email Us
                            </a>
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/20">
                            <p className="text-white/80">
                                <span className="font-semibold">Business Hours:</span> Mon-Fri 9:00am – 5:00pm | Sat 9:00am – 2:30pm
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default FAQsPage;