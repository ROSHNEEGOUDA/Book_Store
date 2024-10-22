import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database, storage } from '../../Firebase';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';

const BookRecommendationsPage = ({ addToCart }) => {
    const [books, setBooks] = useState([]);
    const [bookImages, setBookImages] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const { book: selectedBook } = location.state || {};

    useEffect(() => {
        const bookRef = ref(database, 'Books');
        get(bookRef).then((snapshot) => {
            if (snapshot.exists()) {
                const bookData = snapshot.val();
                const booksArray = Object.keys(bookData).map(key => ({
                    id: key,
                    ...bookData[key]
                }));
                
                // Set only the first four books
                const fourBooks = booksArray.slice(0, 5);
                setBooks(fourBooks);

                // Fetch images for the first four books
                fourBooks.forEach(book => {
                    if (book.imageURL) {
                        const imageStorageRef = storageRef(storage, book.imageURL);
                        getDownloadURL(imageStorageRef)
                            .then((url) => {
                                setBookImages(prevState => ({
                                    ...prevState,
                                    [book.id]: url
                                }));
                            })
                            .catch((error) => {
                                console.error("Error fetching image URL: ", error);
                            });
                    }
                });
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error("Error fetching data: ", error);
        });
    }, []);

    const handleBuyNow = (book) => {
        navigate('/purchase', { state: { book: { ...book, imageURL: bookImages[book.id] } } });
    };

    const handleAddToCart = (book) => {
        addToCart({ ...book, imageURL: bookImages[book.id] });
    };

    // Filter out the selected book from recommendations (if one is selected)
    const filteredBooks = books.filter(b => b.id !== selectedBook?.id);

    return (
        <div className="bg-gray-100 text-gray-800 min-h-screen">
            <section className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-8">Recommended Books for You</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {filteredBooks.map((book) => (
                        <div key={book.id} className="bg-white shadow-md rounded-lg p-4">
                            <img
                                src={bookImages[book.id] || "https://placehold.co/150x200"}
                                alt={book.name}
                                className="w-full mb-4"
                            />
                            <h3 className="text-lg font-semibold">{book.name}</h3>
                            <p className="text-gray-600">by {book.author}</p>
                            <p className="text-green-600 font-bold mt-2">${book.price}</p>
                            <button
                                onClick={() => handleBuyNow(book)}
                                className="bg-blue-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-blue-600"
                            >
                                Buy Now
                            </button>
                            <button
                                onClick={() => handleAddToCart(book)}
                                className="bg-green-500 text-white px-4 py-2 mt-4 rounded-lg hover:bg-green-600 ml-4"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default BookRecommendationsPage;
