import { Link } from "react-router-dom";
import { Container } from "../components";
import { otherData } from "../assets";

const SellerAgreement = () => {
    return (
        <section className="pt-32 pb-10 text-gray-800">
            <Container>
                <h1 className="text-4xl md:text-5xl font-bold my-5 text-black">Seller Agreement</h1>

                <p className="mb-2">Effective Date: December 11, 2025</p>
                <p className="mb-4">Last Updated: December 11, 2025</p>

                <p className="mb-4">
                    This Seller Agreement outlines the terms under which SpeedWays Auto (“we,” “our”) lists and sells
                    vehicles and automotive products on our platform. At this time, SpeedWays Auto is the sole seller on
                    the website. Users cannot list or sell items directly.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">1. Seller Status</h2>
                <ul className="mb-4">
                    <li>- SpeedWays Auto is the only authorised seller on the platform.</li>
                    <li>- Customers may browse, purchase via Buy Now, or submit offers through Make an Offer.</li>
                    <li>- No third-party listings are currently permitted.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">2. Listing Accuracy</h2>
                <ul className="mb-4">
                    <li>- All vehicle descriptions, specifications, and photos are provided directly by SpeedWays Auto.</li>
                    <li>- We ensure information is accurate to the best of our knowledge at the time of listing.</li>
                    <li>- Any known issues or defects with vehicles will be disclosed transparently.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">3. Pricing & Offers</h2>
                <ul className="mb-4">
                    <li>- All listings include fixed prices (“Buy Now”).</li>
                    <li>- Customers may alternatively use the “Make an Offer” feature.</li>
                    <li>- Offers are reviewed case by case, and SpeedWays Auto may accept, reject, or counter the offer.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">4. Payments</h2>
                <ul className="mb-4">
                    <li>- All payments are arranged directly through secure bank transfer.</li>
                    <li>- No payment is completed on the website; instructions are provided after purchase confirmation.</li>
                    <li>- A vehicle is marked sold only once payment is confirmed by our accounts team.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">5. Delivery & Collection</h2>
                <ul className="mb-4">
                    <li>- Customers may arrange vehicle collection or request delivery assistance.</li>
                    <li>- Delivery charges, if applicable, will be communicated before confirming arrangements.</li>
                    <li>- Ownership transfers once full payment is received and necessary paperwork is completed.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">6. Returns & Cancellations</h2>
                <ul className="mb-4">
                    <li>- All sales are final unless otherwise stated.</li>
                    <li>- Cancellations after confirmation may not be possible once processing begins.</li>
                    <li>- Any exceptions will be subject to SpeedWays Auto’s discretion.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">7. Liability</h2>
                <ul className="mb-4">
                    <li>- Vehicles are sold “as described” based on the information provided in the listing.</li>
                    <li>- SpeedWays Auto is not liable for misuse, improper handling, or post-purchase damages.</li>
                    <li>- Customers are encouraged to request inspection or viewing before purchase.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">8. Amendments</h2>
                <p className="mb-4">
                    SpeedWays Auto may update this Seller Agreement at any time. Continued use of our platform constitutes
                    acceptance of the most recent version.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">9. Governing Law</h2>
                <p className="mb-4">
                    This Agreement is governed by the laws of the United Kingdom.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">Contact</h2>
                <p className="mb-4">
                    SpeedWays Auto <br />
                    {otherData.address} <br />
                    <Link className="text-blue-600 underline" to={`mailto:${otherData.email}`}>
                        info@speedwaysuk.com
                    </Link> <br />
                    <Link className="text-blue-600 underline" to={`tel:${otherData.phone}`}>
                        (942) 874-7458
                    </Link>
                </p>
            </Container>
        </section>
    );
};

export default SellerAgreement;