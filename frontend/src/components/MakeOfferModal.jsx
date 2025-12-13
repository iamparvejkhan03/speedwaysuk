import React, { useState } from 'react';
import { X, PoundSterling, MessageSquare } from 'lucide-react';

const MakeOfferModal = ({
    isOpen,
    onClose,
    onSubmit,
    offerAmount,
    setOfferAmount,
    offerMessage,
    setOfferMessage,
    loading,
    auction
}) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(e);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-semibold text-gray-800">Make an Offer</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Offer Amount
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <PoundSterling className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                value={offerAmount}
                                onChange={(e) => setOfferAmount(e.target.value)}
                                className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter your offer amount"
                                min={auction?.startPrice}
                                step="0.01"
                                required
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Minimum offer: £{auction?.startPrice?.toLocaleString()}
                        </p>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Message to Seller (Optional)
                        </label>
                        <div className="relative">
                            <div className="absolute top-3 left-3">
                                <MessageSquare className="h-5 w-5 text-gray-400" />
                            </div>
                            <textarea
                                value={offerMessage}
                                onChange={(e) => setOfferMessage(e.target.value)}
                                className="pl-10 block w-full border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Add a message to the seller..."
                                rows="3"
                            />
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Your offer will expire in 48 hours if not responded to.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !offerAmount || parseFloat(offerAmount) < auction?.startPrice}
                            className="flex-1 bg-[#edcd1f] text-black py-3 px-4 rounded-lg hover:bg-[#edcd1f]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting...' : 'Submit Offer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MakeOfferModal;