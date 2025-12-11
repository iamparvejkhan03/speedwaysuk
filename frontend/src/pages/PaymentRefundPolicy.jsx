import { Link } from "react-router-dom";
import { Container } from "../components";
import { otherData } from "../assets";

const PaymentRefundPolicy = () => {
    return (
        <section className="pt-32 pb-10 text-gray-800">
            <Container>
                <h1 className="text-4xl md:text-5xl font-bold my-5 text-black">Payment & Refund Policy</h1>

                <p className="mb-2">Effective Date: December 11, 2025</p>
                <p className="mb-4">Last Updated: December 11, 2025</p>

                <p className="mb-4">
                    This Payment & Refund Policy explains how payments, refunds, and order processing work at Speed Ways UK.
                    By making a purchase through our platform, you agree to the terms outlined below.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">1. Accepted Payment Methods</h2>
                <ul className="mb-4">
                    <li>- Speed Ways UK accepts payment exclusively via bank transfer.</li>
                    <li>- We do not accept credit/debit cards, cash payments, cheques, or third-party payment gateways.</li>
                    <li>- Bank details for payment will be provided directly by our team after order confirmation.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">2. Order Confirmation</h2>
                <ul className="mb-4">
                    <li>- An order is considered confirmed only after Speed Ways UK sends a written confirmation via email.</li>
                    <li>- Once confirmed, the buyer must complete payment within the timeframe provided.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">3. Deposits</h2>
                <ul className="mb-4">
                    <li>- In most cases, Speed Ways UK does not require a deposit.</li>
                    <li>- If a deposit is required for a specific vehicle, the amount and terms will be clearly communicated before payment.</li>
                    <li>- Deposits are non-refundable unless Speed Ways UK cancels the order.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">4. Payment Requirements</h2>
                <ul className="mb-4">
                    <li>- Full payment must be received before collection or delivery is arranged.</li>
                    <li>- All payments must come from a bank account in the buyer’s name.</li>
                    <li>- Proof of payment must be shared with our team for verification.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">5. Collection & Delivery</h2>
                <ul className="mb-4">
                    <li>- Speed Ways UK arranges collection or delivery of the vehicle after full payment is received.</li>
                    <li>- Delivery charges (if any) will be communicated before payment.</li>
                    <li>- Buyers must provide accurate collection/delivery details.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">6. Refunds</h2>
                <ul className="mb-4">
                    <li>- Payments made for a confirmed order are non-refundable unless Speed Ways UK is unable to provide the vehicle.</li>
                    <li>- Refunds are not issued for buyer mistakes, change of mind, or delays caused by the buyer.</li>
                    <li>- Any incorrect or duplicate payments will be refunded after verification.</li>
                </ul>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">7. Accuracy of Listings</h2>
                <p className="mb-4">
                    Speed Ways UK ensures all vehicle descriptions, images, and details are accurate to the best of our knowledge.
                    Buyers are encouraged to request videos, photos, or inspection before making payment.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">8. Disputes</h2>
                <p className="mb-4">
                    Any payment or refund disputes must be raised directly with Speed Ways UK.
                    We will review all cases fairly in accordance with UK consumer standards.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">9. Limitation of Liability</h2>
                <p className="mb-4">
                    Speed Ways UK is not responsible for delays caused by banks, incorrect payment details provided by the buyer,
                    or third-party transport delays.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">10. Amendments</h2>
                <p className="mb-4">
                    Speed Ways UK may update this policy at any time. Continued use of our services means you accept the latest policy.
                </p>

                <h2 className="text-2xl text-black font-semibold mt-6 mb-4">11. Governing Law</h2>
                <p className="mb-4">
                    This Policy is governed by the laws of the United Kingdom.
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

export default PaymentRefundPolicy;