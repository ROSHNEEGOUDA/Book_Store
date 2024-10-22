import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from './Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import BookRecommendationsPage from './BookRecommendationsPage';
import Loader from './Loader/Loader';

const BookPurchasePage = () => {
    const location = useLocation();
    const { book } = location.state || {}; // Get book details from state
    const [activeTab, setActiveTab] = useState('book-info');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState([]); 
    const navigate = useNavigate();

    const openTab = (tabName) => {
        setActiveTab(tabName);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const addToCart = (book) => {
        setCart((prevCart) => [...prevCart, book]);
    };

    const handleBuyNow = () => {
        addToCart(book); // Add the book to the cart
        navigate('/purchase-details', {
            state: { 
                book: {
                    ...book, // This spreads the existing book details
                    imageURL: book?.imageURL // Pass the image URL if available
                }, 
                quantity 
            }
        });
    };
    
    

    if (loading) {
        return (
            <div className='min-h-screen flex flex-col'>
                <NavBar />
                <div className='flex-grow flex justify-center items-center'>
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 text-gray-800 min-h-screen">
            <NavBar />

            {/* Book Purchase Section */}
            <section className="container mx-auto px-4 py-12 font-roboto">
                <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
                    {/* Book Image */}
                    <div className="md:w-1/3">
                        <img 
                            src={book?.imageURL || "https://placehold.co/300x450"} 
                            alt="Book Cover" 
                            className="rounded-lg shadow-lg w-full" 
                        />
                    </div>

                    {/* Book Details */}
                    <div className="md:w-2/3">
                        <h1 className="text-3xl font-bold mb-4">{book?.name || "The Book Title"}</h1>
                        <p className="text-gray-700 mb-6">by <span className="text-blue-600">{book?.author || "Author Name"}</span></p>
                        <div className="flex items-center mb-4">
                            {/* Rating Section */}
                            <div className="flex space-x-1 mb-4">
                                {[...Array(5)].map((_, index) => (
                                    <FontAwesomeIcon
                                        key={index}
                                        icon={faStar}
                                        className={`text-md cursor-pointer transition-colors duration-200 ${index < 3 ? 'text-yellow-300' : 'text-gray-300'}`}
                                    />
                                ))}
                                <span className="ml-2 mt-1 text-gray-600">(450 Reviews)</span>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-2xl font-bold text-green-600">${book?.price || "0.00"}</p>
                            {/* Add other details like price, description, etc., here */}
                        </div>

                        {/* Quantity */}
                        <div className="mb-6">
                            <label className="block mb-2 font-semibold">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(e.target.value)}
                                className="w-1/3 px-4 py-2 border rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Buy and Rent Buttons */}
                        <div className="flex space-x-4">
                            <button
                                onClick={handleBuyNow} 
                                className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600 border-b-4 border-blue-700 transform hover:translate-y-1 active:translate-y-2 transition-transform duration-200 ease-in-out"
                            >
                                Buy Now
                            </button>
                            <button className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 border-b-4 border-green-700 transform hover:translate-y-1 active:translate-y-2 transition-transform duration-200 ease-in-out">
                                Rent Now
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tabs for Book Info, Reviews, Recommendations */}
            <section className="container mx-auto px-4 py-8 font-roboto">
                <div className="flex space-x-4 border-b mb-6">
                    <button
                        className={`relative text-gray-800 px-4 py-2 transition duration-300 ease-in-out ${activeTab === 'book-info' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                        onClick={() => openTab('book-info')}
                    >
                        Book Info
                        {activeTab === 'book-info' && (
                            <span className="absolute left-0 bottom-0 h-1 w-full bg-blue-500"></span>
                        )}
                    </button>
                    <button
                        className={`relative text-gray-800 px-4 py-2 transition duration-300 ease-in-out ${activeTab === 'reviews' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                        onClick={() => openTab('reviews')}
                    >
                        Reviews
                        {activeTab === 'reviews' && (
                            <span className="absolute left-0 bottom-0 h-1 w-full bg-blue-500"></span>
                        )}
                    </button>
                    <button
                        className={`relative text-gray-800 px-4 py-2 transition duration-300 ease-in-out ${activeTab === 'recommendations' ? 'text-blue-500' : 'hover:text-blue-500'}`}
                        onClick={() => openTab('recommendations')}
                    >
                        Recommendations
                        {activeTab === 'recommendations' && (
                            <span className="absolute left-0 bottom-0 h-1 w-full bg-blue-500"></span>
                        )}
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'book-info' && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Book Details</h2>
                        <p className="text-gray-700 mb-4">{book?.description || "No description available."}</p>
                        <p className="text-gray-700 mb-4">Genre: <span className="font-semibold">{book?.genre || "Genre"}</span></p>
                        <p className="text-gray-700 mb-4">Pages: <span className="font-semibold">{book?.pages || "130"}</span></p>
                        <p className="text-gray-700">Published: <span className="font-semibold">{book?.published || "N/A"}</span></p>
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Customer Reviews</h2>
                        <div className="mb-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faUserCircle} className='h-7' />
                                    <p className="font-semibold">John Doe</p>
                                </div>
                                <div className="flex items-center">
                                    {[...Array(5)].map((_, index) => (
                                        <FontAwesomeIcon
                                            key={index}
                                            icon={faStar}
                                            className={`text-md cursor-pointer transition-colors duration-200 ${index < 3 ? 'text-yellow-300' : 'text-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 mt-2">Great book! Loved the plot and the characters. Highly recommend.</p>
                        </div>

                        <h3 className="text-xl font-semibold mt-6 mb-4">Leave a Review</h3>
                        <textarea
                            rows="4"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Write your review here"
                        ></textarea>
                        <div className="flex justify-end mt-2">
                            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">Submit Review</button>
                        </div>
                    </div>
                )}

                {activeTab === 'recommendations' && (
                    <div>
                        <BookRecommendationsPage />
                    </div>
                )}
            </section>

            {/* Footer */}
            <footer className="text-gray-300 py-8 bg-gray-900">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-between items-start">
                        <div className="w-full md:w-1/4 mb-8 md:mb-0">
                            <h3 className="text-lg font-semibold mb-4">About Us</h3>
                            <p className="text-gray-400">BookSphere is your one-stop shop for books across various genres and formats. Whether you want to purchase or rent, we have you covered!</p>
                        </div>
                        <div className="w-full md:w-1/4 mb-8 md:mb-0">
                            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
                            <ul className="space-y-2">
                                <li><a href="#" className="hover:underline">Facebook</a></li>
                                <li><a href="#" className="hover:underline">Twitter</a></li>
                                <li><a href="#" className="hover:underline">Instagram</a></li>
                            </ul>
                        </div>
                        <div className="w-full md:w-1/4 mb-8 md:mb-0">
                            <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
                            <p className="text-gray-400">Have questions? Reach out to us at <a href="mailto:support@booksphere.com" className="text-blue-500">support@booksphere.com</a></p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default BookPurchasePage;
