import { Link } from "react-router";
import { Container } from "../components";
import { otherData } from "../assets";

const BuyerAgreement = () => {
    return (
        <section className="pt-32 pb-10 text-gray-800">
            <Container>
                <h1 className="text-4xl md:text-5xl font-bold my-5 text-black">Buyer Agreement</h1>

                <p className="mb-2">Effective Date: December 11, 2025</p>
                <p className="mb-4">Last Updated: December 11, 2025</p>

                <p className="mb-4">
                    This Buyer Agreement outlines the terms for customers purchasing vehicles or products from
                    Speed Ways UK (“we,” “our”). By using our website or completing a purchase, you agree to these terms.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">1. Eligibility</h2>
                <ul className="mb-4">
                    <li>- You must be at least 18 years old and legally able to enter into a purchase agreement.</li>
                    <li>- You must provide accurate contact and payment details.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">2. Buying Process</h2>
                <ul className="mb-4">
                    <li>- Purchases can be made through “Buy Now” or “Make an Offer.”</li>
                    <li>- Submitting an offer does not guarantee acceptance.</li>
                    <li>- Once your offer is accepted or you complete a Buy Now checkout, you agree to proceed with payment.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">3. Vehicle Information & Inspections</h2>
                <ul className="mb-4">
                    <li>- All vehicle descriptions and photos are provided by Speed Ways UK.</li>
                    <li>- You may request an inspection or viewing before confirming your purchase.</li>
                    <li>- Speed Ways UK does not guarantee suitability for your individual needs.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">4. Payments</h2>
                <ul className="mb-4">
                    <li>- Payments are completed via secure bank transfer after purchase confirmation.</li>
                    <li>- A vehicle is considered sold only after full payment is received.</li>
                    <li>- Failure to complete payment may result in cancellation at our discretion.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">5. Delivery & Collection</h2>
                <ul className="mb-4">
                    <li>- Buyers may arrange collection or request delivery assistance.</li>
                    <li>- Any delivery fees will be communicated in advance.</li>
                    <li>- Ownership transfers once payment is received and paperwork is completed.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">6. Prohibited Conduct</h2>
                <ul className="mb-4">
                    <li>- No fraudulent information, misuse of the platform, or false purchase commitments.</li>
                    <li>- No attempts to bypass Speed Ways UK procedures or payment requirements.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">7. Risk & Liability</h2>
                <ul className="mb-4">
                    <li>- Vehicles are sold “as described” in the listing.</li>
                    <li>- Speed Ways UK is not responsible for post-purchase issues caused by misuse or external factors.</li>
                    <li>- Buyers accept all responsibility once the vehicle is collected or delivered.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">8. Disputes</h2>
                <p className="mb-4">
                    Any disputes arising from a purchase will be handled directly between the buyer and Speed Ways UK.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">9. Limitation of Liability</h2>
                <p className="mb-4">
                    Speed Ways UK is not liable for indirect, incidental, or consequential damages. By purchasing from us,
                    you agree to release Speed Ways UK from any claims related to the transaction beyond the value of the purchase.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">10. Amendments</h2>
                <p className="mb-4">
                    This Agreement may be updated at any time. Continued use of our website indicates acceptance of the latest version.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">11. Governing Law</h2>
                <p className="mb-4">
                    This Agreement is governed by the laws of the United Kingdom.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">Contact</h2>
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

export default BuyerAgreement;