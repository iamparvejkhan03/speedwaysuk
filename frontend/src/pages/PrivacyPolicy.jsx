import { Link } from "react-router-dom";
import { Container } from "../components";
import { otherData } from "../assets";

const PrivacyPolicy = () => {
    return (
        <section className="pt-32 pb-10 text-gray-800">
            <Container>
                <h1 className="text-4xl md:text-5xl font-bold my-5 text-black">Privacy Policy</h1>

                <p className="mb-2">Effective Date: December 10, 2025</p>
                <p className="mb-4">Last Updated: December 10, 2025</p>

                <p className="mb-4">
                    Speed Ways UK ("we," "our," "us") respects your privacy. This Privacy Policy explains how we collect,
                    use, and protect your information when you use our website and automotive marketplace services 
                    (the "Services"). By using Speed Ways UK, you agree to the practices outlined below.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">1. Information We Collect</h2>
                <ul className="mb-4">
                    <li>- Personal information such as your name, email, phone number, and address.</li>
                    <li>- Account details including login credentials and verification information.</li>
                    <li>- Automatically collected data such as IP address, browser type, device details, and cookies.</li>
                    <li>- Purchase and transaction details for Buy Now or Make an Offer activity.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">2. How We Use Information</h2>
                <ul className="mb-4">
                    <li>- To operate and improve the Speed Ways UK platform.</li>
                    <li>- To manage user accounts and authenticate identity.</li>
                    <li>- To process purchases, offers, and communication between buyer and platform.</li>
                    <li>- To prevent fraud, enhance security, and ensure compliance with our policies.</li>
                    <li>- To send service updates, alerts, and promotional content (with opt-out available).</li>
                    <li>- To analyse performance and improve user experience.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">3. Sharing of Information</h2>
                <ul className="mb-4">
                    <li>- With trusted third-party service providers (payment processors, hosting partners, analytics).</li>
                    <li>- With buyers only when necessary to complete a confirmed purchase.</li>
                    <li>- When required by law or legal process.</li>
                    <li>- During business transitions such as mergers or acquisitions.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">4. Data Security</h2>
                <p className="mb-4">
                    We use industry-standard security measures to protect your data. However, no system is fully secure,
                    and you acknowledge the risks of transmitting information over the internet.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">5. Data Retention</h2>
                <p className="mb-4">
                    We retain personal data as long as necessary to comply with legal obligations and support
                    platform functionality.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">6. Cookies & Tracking Technologies</h2>
                <p className="mb-4">
                    We use cookies for authentication, analytics, and improving site performance. You may disable cookies,
                    but some features may not work correctly.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">7. Your Rights</h2>
                <p className="mb-4">
                    You may request access, correction, deletion, or restriction of your personal information in accordance
                    with applicable data protection laws. Contact us to exercise these rights.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">8. Children’s Privacy</h2>
                <p className="mb-4">
                    Our Services are not intended for individuals under 18. We do not knowingly collect information from minors.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">9. International Users</h2>
                <p className="mb-4">
                    If you access Speed Ways UK from outside the United Kingdom, you consent to your data being processed
                    in the UK, where our systems are located.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">10. Changes to This Policy</h2>
                <p className="mb-4">
                    We may update this Privacy Policy at any time. A new “Last Updated” date will be posted on this page.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">11. Governing Law</h2>
                <p className="mb-4">
                    This Privacy Policy is governed by UK law.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">12. Contact Us</h2>
                <p className="mb-4">
                    Speed Ways UK <br />
                    {otherData.address} <br />
                    <Link className="text-blue-600 underline" to="mailto:info@speedways.uk">
                        info@speedways.uk
                    </Link> <br />
                    <Link className="text-blue-600 underline" to="tel:+441234567890">
                        +441234567890
                    </Link> <br />
                </p>
            </Container>
        </section>
    );
};

export default PrivacyPolicy;