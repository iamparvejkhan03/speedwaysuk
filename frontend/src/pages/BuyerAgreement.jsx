import { Link } from "react-router";
import { Container } from "../components";

const BuyerAgreement = () => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <section className="pt-28 pb-16 bg-white">
            <Container>
                {/* Header */}
                <div className="max-w-full mx-auto mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Buyer Agreement</h1>
                    <p className="text-gray-600 mb-6">SpeedWays Auto Limited | Last Updated: {formattedDate}</p>
                    
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <p className="text-red-800 font-semibold mb-2">TRADE-ONLY PLATFORM</p>
                        <p className="text-red-700 text-sm">
                            This agreement applies exclusively to motor trade buyers based in the UK or Ireland. 
                            By using SpeedWays Auto, you confirm you are acting in the course of business.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-full mx-auto">
                    <div className="space-y-8">
                        {/* Introduction */}
                        <div className="mb-8">
                            <p className="text-gray-700 mb-4">
                                <strong>SpeedWays Auto Limited</strong> ("we", "our", "us") and you, the motor trade buyer 
                                ("Buyer"), enter into this Buyer Agreement governing all purchases made through our platform.
                            </p>
                            <p className="text-gray-700">
                                By placing a bid, making an offer, or using Buy Now, you agree to be bound by this Agreement.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Eligibility</h2>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>This agreement applies only to motor trade buyers based in the UK or Ireland</li>
                                <li>Only verified trade accounts may purchase vehicles</li>
                                <li>Consumer use is strictly prohibited</li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Binding Contract</h2>
                            <p className="text-gray-700 mb-3">A binding contract is formed when:</p>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5 mb-3">
                                <li>A bid is accepted</li>
                                <li>An offer is accepted</li>
                                <li>Buy Now is used</li>
                            </ul>
                            <div className="bg-gray-50 p-4 rounded">
                                <p className="text-red-600 font-semibold text-sm">
                                    All actions are legally binding. No retractions or cancellations permitted.
                                </p>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Vehicle Condition</h2>
                            <p className="text-gray-700 mb-3">Vehicles are sold:</p>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5 mb-3">
                                <li>Trade sale (B2B only)</li>
                                <li>As seen</li>
                                <li>Without warranty</li>
                                <li>Without consumer rights</li>
                            </ul>
                            <p className="text-gray-600 text-sm">
                                Descriptions, photographs, and specifications are provided for guidance only.
                            </p>
                        </div>

                        {/* Section 4 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Inspection</h2>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>Buyers are encouraged to inspect and test drive vehicles before payment</li>
                                <li>Failure to inspect is at the buyer's sole risk</li>
                                <li>No claims can be made for issues visible upon inspection</li>
                            </ul>
                        </div>

                        {/* Section 5 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">5. No Returns or Claims</h2>
                            <div className="bg-red-50 border border-red-200 p-4 rounded mb-3">
                                <p className="text-red-700 font-bold text-center mb-2">ABSOLUTE FINAL SALE</p>
                                <div className="text-center space-y-1">
                                    <p className="text-red-600">No claims once vehicle leaves our premises</p>
                                    <p className="text-red-600">No refunds under any circumstances</p>
                                    <p className="text-red-600">No disputes accepted after collection/delivery</p>
                                </div>
                            </div>
                        </div>

                        {/* Section 6 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Payment</h2>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>Bank transfer only (no cash, cards, or third-party payments)</li>
                                <li>Full payment due within 3 working days of contract formation</li>
                                <li>Vehicles will not be released until payment clears</li>
                            </ul>
                        </div>

                        {/* Section 7 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Collection & Delivery</h2>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>Collection by appointment only</li>
                                <li>Minimum one hour notice required for collection</li>
                                <li>Delivery available at buyer's cost (quoted in advance)</li>
                                <li>Release codes required for third-party collection</li>
                            </ul>
                        </div>

                        {/* Section 8 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Default</h2>
                            <p className="text-gray-700 mb-2">If payment is not completed, we may:</p>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>Cancel the sale</li>
                                <li>Resell the vehicle</li>
                                <li>Recover losses and costs</li>
                                <li>Suspend or terminate the account</li>
                            </ul>
                        </div>

                        {/* Section 9 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">9. Limitation of Liability</h2>
                            <p className="text-gray-700">
                                Our liability is limited to the purchase price of the vehicle, except where 
                                excluded by law (e.g., death or personal injury caused by negligence).
                            </p>
                        </div>

                        {/* Section 10 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Governing Law</h2>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>This agreement is governed by England and Wales law</li>
                                <li>English courts have exclusive jurisdiction</li>
                            </ul>
                        </div>

                        {/* Acceptance & Contact */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Acceptance & Contact</h2>
                            <p className="text-gray-700 mb-4">
                                By using SpeedWays Auto, you acknowledge you have read and agree to this Buyer Agreement.
                            </p>
                            <div className="bg-gray-50 p-4 rounded">
                                <p className="font-semibold text-gray-900 mb-2">SpeedWays Auto Limited</p>
                                <p className="text-gray-700 text-sm mb-1">Wilmslow Rd, Heald Green, Cheadle SK8 3PW, UK</p>
                                <p className="text-gray-700 text-sm mb-1">
                                    Email: <a href="mailto:admin@speedways.uk" className="text-blue-600 hover:underline">admin@speedways.uk</a>
                                </p>
                                <p className="text-gray-700 text-sm">
                                    Phone: <a href="tel:+441618832737" className="text-blue-600 hover:underline">+44 (0)161 883 2737</a>
                                </p>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="border-t pt-6 mt-8">
                            <p className="text-gray-500 text-sm">
                                This Buyer Agreement was last updated on {formattedDate}. It forms an integral part of 
                                the contract for every vehicle purchased through SpeedWays Auto.
                            </p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="mt-12 pt-8 border-t">
                        <div className="flex flex-wrap gap-3">
                            <Link 
                                to="/terms-of-use" 
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
                            >
                                Terms of Use
                            </Link>
                            <Link 
                                to="/privacy-policy" 
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
                            >
                                Privacy Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default BuyerAgreement;