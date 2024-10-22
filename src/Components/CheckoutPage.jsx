import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ref, set } from 'firebase/database';
import { database } from '../../Firebase';
import NavBar from './Navbar';

const CheckoutPage = () => {
    const location = useLocation();
    const { book, quantity } = location.state || {};
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [showCongrats, setShowCongrats] = useState(false); // State for showing the congratulation modal

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userDetails = {
            name,
            phone,
            address,
            paymentMethod,
            book: {
                name: book?.name,
                author: book?.author,
                price: book?.price,
                imageURL: book?.imageURL,
                quantity
            },
            totalPrice: book?.price * quantity,
        };

        try {
            await set(ref(database, `orders/${phone}`), userDetails);
            setShowCongrats(true);  // Show congratulation modal
        } catch (error) {
            console.error('Error saving details to the database:', error);
            alert('An error occurred while processing your purchase. Please try again.');
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen font-roboto relative">
            <NavBar />
            <section className="container mx-auto px-4 py-12">
                <h1 className="text-4xl font-bold mb-6 text-center text-blue-600">Checkout</h1>
                <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto">
                    <div className="flex flex-col md:flex-row mb-6">
                        <img
                            src={book?.imageURL || "https://placehold.co/300x450"}
                            alt="Book Cover"
                            className="rounded-lg shadow-md w-40 md:w-48 mb-4 md:mb-0 md:mr-6 object-cover"
                        />
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">{book?.name || "The Book Title"}</h2>
                            <p className="text-gray-600 mb-1">by <span className="text-blue-500">{book?.author || "Author Name"}</span></p>
                            <p className="text-gray-600 mb-1">Quantity: {quantity}</p>
                            <p className="text-green-600 font-semibold mb-4">Total Price: ${book?.price * quantity}</p>
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">Address</label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 font-medium text-gray-700">Payment Method</label>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                required
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Select a payment method</option>
                                <option value="credit-card">Credit Card</option>
                                <option value="paypal">PayPal</option>
                                <option value="bank-transfer">Bank Transfer</option>
                                <option value="UPI">UPI</option>
                                <option value="Cash On Delivery">Cash On Delivery</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition duration-300 ease-in-out"
                        >
                            Complete Purchase
                        </button>
                    </form>
                </div>
            </section>

            {/* Congratulation Modal */}
            {showCongrats && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center w-full max-w-md">
                        <h2 className="text-4xl font-bold text-blue-500 mb-4 animate-float animate-bounce">
                            Congratulations!
                        </h2>
                        <p className="text-lg text-gray-700">Your order has been placed successfully.</p>
                        <button 
                            className="mt-6 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out"
                            onClick={() => setShowCongrats(false)} // Close modal on button click
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckoutPage;
