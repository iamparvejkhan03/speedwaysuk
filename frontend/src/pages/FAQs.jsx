import { Container } from "../components";
import { MessageCircleQuestion, Search, Shield, HelpCircle, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { faqImg } from "../assets";

const faqs = [
    {
        category: "Buying",
        icon: <HelpCircle size={20} />,
        questions: [
            {
                question: "Are there any fees for buying a vehicle?",
                answer: "No additional buyer’s premium is charged. The price you see is the price you pay, whether you choose Buy Now or Make an Offer. Only standard bank transfer charges from your bank may apply."
            },
            {
                question: "Can I inspect a vehicle before purchasing?",
                answer: "Yes. All vehicles come with detailed photos, full descriptions, and condition reports. If you want to view a vehicle in person, our team can schedule an appointment at one of our partner locations."
            },
            {
                question: "How does 'Make an Offer' work?",
                answer: "Simply submit your offer through the listing page. Our team reviews it and responds quickly. If your offer is accepted, the car is reserved for you while payment is arranged."
            }
        ]
    },
    {
        category: "Payments",
        icon: <Phone size={20} />,
        questions: [
            {
                question: "What payment methods are accepted?",
                answer: "All purchases are completed via secure bank transfer. Once your offer is accepted or you use Buy Now, our team provides verified account details and guides you through the payment process safely."
            },
            {
                question: "What happens after I make the payment?",
                answer: "Once payment is confirmed, we issue the purchase confirmation and arrange vehicle collection or delivery. You will receive all documents and updates directly from our support team."
            },
            {
                question: "Is off-platform communication or payment allowed?",
                answer: "No. All communication and payments must go through Speed Ways UK for your safety. This ensures fraud prevention, verified documentation, and full transaction protection."
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
                            Find quick answers to common questions about buying vehicles on Speed Ways UK.
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

                {/* FAQ Grid */}
                {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                    {faqs.map((category) => (
                        <div key={category.category} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    {category.icon}
                                </div>
                                <h3 className="text-xl font-bold text-primary">{category.category}</h3>
                            </div>
                            <ul className="space-y-4">
                                {category.questions.map((q, idx) => (
                                    <li key={idx} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                        <h4 className="font-medium text-gray-900 mb-2">{q.question}</h4>
                                        <p className="text-sm text-gray-600">{q.answer.substring(0, 80)}...</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div> */}

                {/* Detailed FAQ Accordion */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-primary mb-8 text-center">Detailed Questions & Answers</h2>

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
                                    <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="px-8 pb-6">
                                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-8 py-12 text-center">
                                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                                <p className="text-gray-600">Try adjusting your search or filter to find what you're looking for.</p>
                            </div>
                        )}
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
                            <Link
                                to="/contact"
                                className="inline-flex items-center justify-center gap-3 bg-white text-primary hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-300 hover:shadow-lg"
                            >
                                <MessageCircleQuestion size={20} />
                                Contact Support
                            </Link>
                            <a
                                href="mailto:info@speedways.uk"
                                className="inline-flex items-center justify-center gap-3 bg-transparent border-2 border-white text-white hover:bg-white/10 font-semibold py-3 px-8 rounded-lg transition-all duration-300"
                            >
                                <Mail size={20} />
                                Email Us
                            </a>
                        </div>
                        <div className="mt-8 pt-8 border-t border-white/20">
                            <p className="text-white/80">Typically respond within 24 hour during week days.</p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}

export default FAQsPage;