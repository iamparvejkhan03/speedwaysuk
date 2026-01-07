import { Link } from "react-router-dom";
import { Container } from "../components";

const PrivacyPolicy = () => {
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
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
                    <p className="text-gray-600 mb-6">SpeedWays Auto Limited | Last Updated: {formattedDate}</p>
                    
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                        <p className="text-blue-800 font-semibold mb-2">TRADE-ONLY PLATFORM</p>
                        <p className="text-blue-700 text-sm">
                            SpeedWays Auto is a trade-only platform registered in England and Wales. 
                            This policy explains how we handle your information.
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-full mx-auto">
                    <div className="space-y-8">
                        {/* Introduction */}
                        <div className="mb-8">
                            <p className="text-gray-700 mb-4">
                                <strong>SpeedWays Auto Limited</strong> ("we", "our", "us") is committed to protecting 
                                and respecting your privacy. This Privacy Policy explains how we collect, use, and 
                                safeguard your information when you use our trade-only automotive marketplace platform.
                            </p>
                            <p className="text-gray-700">
                                By registering for, accessing, or using the Platform, you agree to this Privacy Policy.
                            </p>
                        </div>

                        {/* Section 1 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">1. Information We Collect</h2>
                            
                            <h3 className="font-semibold text-gray-800 mb-2 mt-4">Personal Information</h3>
                            <ul className="text-gray-700 space-y-1 list-disc pl-5">
                                <li>Full name, business name, and contact details</li>
                                <li>Business address and registered company details</li>
                                <li>VAT registration number and company registration number</li>
                                <li>Email address and telephone number</li>
                                <li>Bank account details for payment processing</li>
                            </ul>
                            
                            <h3 className="font-semibold text-gray-800 mb-2 mt-4">Platform & Transaction Data</h3>
                            <ul className="text-gray-700 space-y-1 list-disc pl-5">
                                <li>Account credentials and login information</li>
                                <li>Vehicle listings, bids, offers, and purchase history</li>
                                <li>Communication records with other traders</li>
                                <li>Payment and transaction records</li>
                            </ul>
                            
                            <h3 className="font-semibold text-gray-800 mb-2 mt-4">Automatically Collected Data</h3>
                            <ul className="text-gray-700 space-y-1 list-disc pl-5">
                                <li>IP address, device type, browser information</li>
                                <li>Usage data including pages visited and time spent</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </div>

                        {/* Section 2 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">2. How We Use Your Information</h2>
                            <p className="text-gray-700 mb-3">We process your information for:</p>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>Platform operation and account management</li>
                                <li>Verifying trade status and authenticating users</li>
                                <li>Processing vehicle purchases and payments</li>
                                <li>Sending service updates and transaction alerts</li>
                                <li>Preventing fraud and ensuring platform security</li>
                                <li>Complying with legal obligations</li>
                                <li>Analysing platform usage and improving experience</li>
                                <li>Business-to-business communications (opt-out available)</li>
                            </ul>
                        </div>

                        {/* Section 3 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">3. Legal Basis for Processing</h2>
                            <p className="text-gray-700 mb-3">Under UK data protection law, we process based on:</p>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li><strong>Contractual Necessity:</strong> To fulfil our contractual obligations</li>
                                <li><strong>Legitimate Interests:</strong> To operate our business effectively</li>
                                <li><strong>Legal Obligation:</strong> To comply with UK laws</li>
                                <li><strong>Consent:</strong> Where required, we obtain explicit consent</li>
                            </ul>
                        </div>

                        {/* Section 4 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">4. Information Sharing</h2>
                            <p className="text-gray-700 mb-3">We may share your information with:</p>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>Service providers (payment processors, IT services, hosting partners)</li>
                                <li>Other traders (limited info for transaction completion)</li>
                                <li>Legal authorities when required by law</li>
                                <li>Successors in business transfers (mergers, acquisitions)</li>
                            </ul>
                        </div>

                        {/* Section 5 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">5. Data Security</h2>
                            <p className="text-gray-700 mb-3">We implement security measures including:</p>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5 mb-3">
                                <li>SSL/TLS encryption for data transmission</li>
                                <li>Secure server infrastructure with firewalls</li>
                                <li>Access controls and authentication protocols</li>
                                <li>Regular security assessments</li>
                            </ul>
                            <div className="bg-gray-50 p-4 rounded">
                                <p className="text-gray-600 text-sm">
                                    While we strive to protect your information, no internet transmission is 100% secure. 
                                    We cannot guarantee absolute security.
                                </p>
                            </div>
                        </div>

                        {/* Section 6 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">6. Cookies</h2>
                            <p className="text-gray-700 mb-3">
                                We use cookies for platform functionality, analytics, and marketing. 
                                You can manage cookies through your browser settings.
                            </p>
                        </div>

                        {/* Section 7 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">7. Your Rights (UK)</h2>
                            <p className="text-gray-700 mb-3">You have the right to:</p>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>Access your personal data</li>
                                <li>Request correction of inaccurate data</li>
                                <li>Request deletion under certain conditions</li>
                                <li>Restrict or object to processing</li>
                                <li>Data portability</li>
                            </ul>
                            <p className="text-gray-600 text-sm mt-3">
                                To exercise these rights, contact us. We may need to verify your identity first.
                            </p>
                        </div>

                        {/* Section 8 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">8. Data Retention</h2>
                            <p className="text-gray-700 mb-3">We retain information as long as necessary for:</p>
                            <ul className="text-gray-700 space-y-2 list-disc pl-5">
                                <li>Duration of your account activity</li>
                                <li>Legal requirements (e.g., financial records for 7 years)</li>
                                <li>Business needs and operational requirements</li>
                                <li>Dispute resolution and legal claims</li>
                            </ul>
                        </div>

                        {/* Section 9 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">9. International Transfers</h2>
                            <p className="text-gray-700">
                                Your information is primarily processed in the UK. If transferred outside the UK, 
                                we ensure appropriate safeguards are in place.
                            </p>
                        </div>

                        {/* Section 10 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">10. Third-Party Links</h2>
                            <p className="text-gray-700">
                                Our platform may contain links to third-party websites. This policy applies only 
                                to SpeedWays Auto.
                            </p>
                        </div>

                        {/* Section 11 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-3">11. Policy Changes</h2>
                            <p className="text-gray-700">
                                We may update this policy periodically. The "Last Updated" date indicates revisions. 
                                Material changes will be communicated.
                            </p>
                        </div>

                        {/* Section 12 */}
                        <div className="border-t pt-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
                            <p className="text-gray-700 mb-4">
                                For questions about this policy or your data protection rights:
                            </p>
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
                                This Privacy Policy is governed by the laws of England and Wales. Any disputes 
                                will be subject to the exclusive jurisdiction of the courts of England and Wales.
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

export default PrivacyPolicy;