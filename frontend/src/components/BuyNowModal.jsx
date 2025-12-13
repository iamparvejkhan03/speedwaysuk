import { CheckCircle, XCircle, PoundSterling, Package, Clock, AlertCircle } from 'lucide-react';

const BuyNowModal = ({ isOpen, onClose, onConfirm, auction, loading }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-full">
                            <Package className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Buy Now Confirmation</h3>
                            <p className="text-sm text-gray-600">Instant purchase</p>
                        </div>
                    </div>

                    {/* Warning Alert */}
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="font-medium text-yellow-800">This action cannot be undone</p>
                                <p className="text-sm text-yellow-700 mt-1">
                                    The auction will end immediately and you will be declared the winner.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                        <div className="text-center">
                            <p className="text-gray-600 mb-1">Buy Now Price</p>
                            <div className="flex items-center justify-center gap-2">
                                <PoundSterling className="h-6 w-6 text-green-600" />
                                <p className="text-3xl font-bold text-green-600">
                                    £{auction.buyNowPrice.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action List */}
                    <div className="mb-6">
                        <p className="font-medium text-gray-700 mb-2">This will:</p>
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>End the auction immediately</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Declare you as the winner</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Set final price to £{auction.buyNowPrice.toLocaleString()}</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Reject all pending offers (if any)</span>
                            </li>
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <XCircle className="h-5 w-5" />
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <CheckCircle className="h-5 w-5" />
                                    Confirm Purchase
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuyNowModal;