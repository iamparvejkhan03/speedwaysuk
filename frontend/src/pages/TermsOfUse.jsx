import { Link } from "react-router-dom";
import { Container } from "../components";
import { otherData } from "../assets";

const TermsOfUse = () => {
    return (
        <section className="pt-32 pb-10 text-gray-800">
            <Container>
                <h1 className="text-4xl md:text-5xl font-bold my-5 text-black">Terms of Use</h1>

                <p className="mb-2">Effective Date: December 11, 2025</p>
                <p className="mb-4">Last Updated: December 11, 2025</p>

                <p className="mb-4">
                    Welcome to Speed Ways UK ("we," "our," "us"). These Terms of Use ("Terms") govern your access to and
                    use of the Speed Ways UK website, listings, and automotive marketplace services (collectively, the "Services").
                    By using our Services, you agree to these Terms. If you do not agree, you must not use the platform.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">1. Eligibility</h2>
                <ul className="mb-4">
                    <li>- You must be at least 18 years old and legally able to enter into binding contracts.</li>
                    <li>- By using Speed Ways UK, you confirm that you meet all eligibility requirements.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">2. Nature of Our Services</h2>
                <div className="mb-4">
                    <p>- Speed Ways UK is an online marketplace specialising in the buying and selling of vehicles.</p>
                    <p>- At present, all vehicles listed on the platform are listed directly by Speed Ways UK.</p>
                    <p>- There are no auctions or bidding features; users may purchase through “Buy Now” or submit a price via “Make an Offer”.</p>
                    <p>- We are responsible for the accuracy of our own listings but do not make guarantees beyond the information provided.</p>
                </div>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">3. User Accounts</h2>
                <ul className="mb-4">
                    <li>- To purchase a vehicle or submit an offer, you may be required to create an account.</li>
                    <li>- You must provide accurate and complete information.</li>
                    <li>- You are responsible for maintaining the confidentiality of your login information.</li>
                    <li>- You are responsible for all activities performed under your account.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">4. Buying a Vehicle</h2>
                <ul className="mb-4">
                    <li>- When using “Buy Now,” you are entering into a legally binding agreement to purchase.</li>
                    <li>- When submitting an offer, you acknowledge that acceptance by Speed Ways UK forms a binding agreement.</li>
                    <li>- All vehicles are sold “as described,” based on the detailed information and disclosures provided on the listing page.</li>
                    <li>- You are responsible for reviewing all photos, inspection details, and descriptions before purchasing.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">5. Payments</h2>
                <ul className="mb-4">
                    <li>- Payments are conducted via secure bank transfer only.</li>
                    <li>- You must submit payment within the timeframe provided at checkout or by our support team.</li>
                    <li>- All payment instructions will be issued directly by Speed Ways UK.</li>
                    <li>- Failure to complete payment may result in cancellation of the order.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">6. Listings, Content & Intellectual Property</h2>
                <div className="mb-4">
                    <p>- All images, descriptions, and media on Speed Ways UK are owned by Speed Ways UK unless stated otherwise.</p>
                    <p>- You may not copy, reproduce, or distribute our content without permission.</p>
                    <p>- We strive to provide accurate descriptions but recommend buyers inspect vehicles prior to purchase when possible.</p>
                </div>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">7. Vehicle Condition & Inspections</h2>
                <div className="mb-4">
                    <p>- Vehicles are sold based on the honest and detailed descriptions provided by Speed Ways UK.</p>
                    <p>- Buyers are encouraged to arrange a viewing or third-party inspection before completing purchase.</p>
                    <p>- We make no guarantee beyond what is documented in the listing page.</p>
                </div>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">8. Prohibited Conduct</h2>
                <p className="mb-4">You agree not to engage in:</p>
                <ul className="mb-4">
                    <li>- Fraudulent activity or attempts to bypass payment processes.</li>
                    <li>- Misrepresentation or submission of false information.</li>
                    <li>- Attempting to disrupt, damage, or interfere with the platform.</li>
                    <li>- Copying, scraping, or duplicating content without permission.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">9. Limitation of Liability</h2>
                <div className="mb-4">
                    <p>- Speed Ways UK is not liable for indirect or consequential damages arising from use of the Services.</p>
                    <p>- Vehicle purchases are final and must be carefully reviewed before committing.</p>
                    <p>- To the maximum extent permitted by UK law, your sole remedy is discontinuing use of the Services.</p>
                </div>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">10. Indemnification</h2>
                <p className="mb-4">
                    You agree to indemnify and defend Speed Ways UK, its employees, owners, and affiliates from any claims or
                    damages arising from misuse of the platform or violation of these Terms.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">11. Termination</h2>
                <ul className="mb-4">
                    <li>- We may suspend or terminate your access at any time if you violate these Terms.</li>
                    <li>- Upon termination, you must stop using the Services immediately.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">12. Governing Law & Disputes</h2>
                <div className="mb-4">
                    <p>- These Terms are governed by the laws of the United Kingdom.</p>
                    <p>- Any disputes shall be resolved in UK courts or through arbitration where applicable.</p>
                    <p>- You waive any right to bring collective or class actions against Speed Ways UK.</p>
                </div>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">13. Amendments</h2>
                <p className="mb-4">
                    Speed Ways UK may update these Terms at any time. Updated terms will be posted with a revised date.
                    Continued use after updates indicates acceptance of the new Terms.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">14. Survival</h2>
                <p className="mb-4">
                    Sections including Limitation of Liability, Indemnification, Governing Law, and Survival
                    remain in effect even after termination of your account.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">15. Contact Us</h2>
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

export default TermsOfUse;