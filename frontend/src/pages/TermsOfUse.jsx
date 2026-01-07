import { Link } from "react-router-dom";
import { Container } from "../components";

const TermsOfUse = () => {
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
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Terms of Use</h1>
                    <p className="text-gray-600 mb-6">SpeedWays Auto Limited | Last Updated: {formattedDate}</p>
                    
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                        <p className="text-red-800 font-semibold mb-2">TRADE-ONLY PLATFORM</p>
                        <p className="text-red-700 text-sm">
                            This website and platform are strictly for motor trade users. By using SpeedWays Auto, 
                            you confirm you are acting in the course of business. All sales are on a "sold as seen" 
                            trade sale basis without warranty.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-full mx-auto">
                    <div className="space-y-8">
                        {/* Introduction */}
                        <div className="mb-8">
                            <p className="text-gray-700 mb-4">
                                <strong>SpeedWays Auto Limited</strong> ("we", "our", "us") operates a trade-only online 
                                marketplace for motor vehicles. These Terms of Use ("Terms") govern your access to and use 
                                of our website, platform, and services.
                            </p>
                            <p className="text-gray-700">
                                By registering for, accessing, or using the Platform, you agree to be bound by these Terms.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Trade-Only Platform</h2>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>This Platform is strictly for motor trade users only</li>
                                <li>By using the Platform, you confirm you are acting in the course of business</li>
                                <li>Only verified motor traders in the UK or Ireland may use the Platform</li>
                                <li>Consumer use is strictly prohibited</li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">2. Account Registration</h2>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>Registration is free for trade users</li>
                                <li>Approval is at our discretion</li>
                                <li>Trade verification may be required</li>
                                <li>We may suspend or terminate accounts for misuse or non-payment</li>
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Our Role</h2>
                            <p className="text-gray-700 mb-3">SpeedWays Auto may act as:</p>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5 mb-3">
                                <li>Principal seller of vehicles we own</li>
                                <li>Agent/intermediary for third-party vendors</li>
                            </ul>
                            <div className="bg-gray-50 p-4 rounded">
                                <p className="text-gray-700 font-semibold">
                                    In all cases, SpeedWays issues the invoice and receives payment.
                                </p>
                            </div>
                        </div>

                        {/* Section 4 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Auctions, Offers & Buy Now</h2>
                            <div className="bg-red-50 p-4 rounded mb-3">
                                <p className="text-red-700 font-semibold mb-2">LEGALLY BINDING</p>
                                <ul className="text-red-700 space-y-1">
                                    <li>• All bids, offers, and Buy Now actions are legally binding</li>
                                    <li>• Bid retractions are not permitted</li>
                                    <li>• Failure to complete payment constitutes a breach</li>
                                </ul>
                            </div>
                        </div>

                        {/* Section 5 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Payments</h2>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>Bank transfer only</li>
                                <li>Payment due within 3 working days</li>
                                <li>Vehicles will not be released until payment clears</li>
                            </ul>
                        </div>

                        {/* Section 6 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Collection & Delivery</h2>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>Collection by appointment only</li>
                                <li>Minimum one hour notice required</li>
                                <li>Delivery available at additional cost</li>
                                <li>Release codes may be required for third-party collection</li>
                            </ul>
                        </div>

                        {/* Section 7 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Sold As Seen – Trade Sale</h2>
                            <div className="bg-yellow-50 p-4 rounded mb-3">
                                <p className="text-red-600 font-bold text-center mb-2">ALL VEHICLES ARE SOLD:</p>
                                <div className="text-center space-y-1">
                                    <p className="text-red-600">Trade sale (as seen)</p>
                                    <p className="text-red-600">Without warranty</p>
                                    <p className="text-red-600">Without consumer rights</p>
                                </div>
                            </div>
                            <p className="text-gray-700">
                                Vehicle descriptions are for guidance only. Buyers should inspect before payment.
                            </p>
                        </div>

                        {/* Section 8 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Title & Risk</h2>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>Title and ownership pass once full payment is received</li>
                                <li>Risk passes upon collection or delivery</li>
                            </ul>
                        </div>

                        {/* Section 9 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">9. No Returns</h2>
                            <div className="bg-red-50 p-4 rounded mb-3">
                                <p className="text-red-700 font-bold text-center mb-2">NO RETURNS OR REFUNDS</p>
                                <p className="text-red-700 text-sm text-center">
                                    No refunds or returns are accepted under any circumstances.
                                </p>
                            </div>
                        </div>

                        {/* Section 10 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Enforcement</h2>
                            <p className="text-gray-700 mb-2">If payment is not completed, we may:</p>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>Cancel the sale</li>
                                <li>Resell the vehicle</li>
                                <li>Recover losses and costs</li>
                                <li>Suspend or terminate the account</li>
                            </ul>
                        </div>

                        {/* Section 11 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Limitation of Liability</h2>
                            <p className="text-gray-700">
                                Liability is limited to the purchase price of the vehicle, except where excluded by law 
                                (e.g., death or personal injury caused by negligence).
                            </p>
                        </div>

                        {/* Section 12 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">12. Governing Law</h2>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>England and Wales law applies</li>
                                <li>English courts have exclusive jurisdiction</li>
                            </ul>
                        </div>

                        {/* Contact */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
                            <div className="bg-gray-50 p-4 rounded">
                                <p className="font-semibold text-gray-900 mb-2">SpeedWays Auto Limited</p>
                                <p className="text-gray-700 text-sm mb-1">Wilmslow Rd, Heald Green, Cheadle SK8 3PW, UK</p>
                                <p className="text-gray-700 text-sm mb-1">
                                    Email: <a href="mailto:admin@speedways.uk" className="text-blue-600 hover:underline break-all">admin@speedways.uk</a>
                                </p>
                                <p className="text-gray-700 text-sm">
                                    Phone: <a href="tel:+441618832737" className="text-blue-600 hover:underline">+44 (0)161 883 2737</a>
                                </p>
                            </div>
                        </div>

                        {/* Footer Note */}
                        <div className="border-t pt-6 mt-8">
                            <p className="text-gray-500 text-sm">
                                These Terms were last updated on {formattedDate}. We may update these Terms at any time. 
                                Continued use constitutes acceptance of modified Terms.
                            </p>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="mt-12 pt-8 border-t">
                        <div className="flex flex-wrap gap-3">
                            <Link 
                                to="/privacy-policy" 
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link 
                                to="/buyer-agreement" 
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition-colors"
                            >
                                Buyer Agreement
                            </Link>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
};

export default TermsOfUse;