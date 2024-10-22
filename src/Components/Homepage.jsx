import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { database, storage } from '../../Firebase';
import { getDownloadURL, ref as storageRef } from 'firebase/storage';
import NavBar from './Navbar';
import Loader from './Loader/Loader';

const HomePage = () => {
    const [books, setBooks] = useState([]);
    const [bookImages, setBookImages] = useState({});
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const booksRef = ref(database, 'Books');
        get(booksRef).then((snapshot) => {
            if (snapshot.exists()) {
                const booksData = snapshot.val();
                const booksArray = Object.keys(booksData).map(key => ({
                    id: key,
                    ...booksData[key]
                }));
                setBooks(booksArray);

                // Fetch images for each book
                booksArray.forEach(book => {
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
            setLoading(false); // Set loading to false after data is fetched
        }).catch((error) => {
            console.error("Error fetching data: ", error);
            setLoading(false); // Set loading to false in case of an error
        });
    }, []);

    const handleBuyNow = (book) => {
        navigate('/purchase', { state: { book: { ...book, imageURL: bookImages[book.id] } } });
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Filter books based on the search query
    const filteredBooks = books.filter(book => 
        book.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        book.author.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Return the Loader if loading is true
    if (loading) {
        return (
            <div className='min-h-screen flex flex-col'>
                <NavBar onSearchChange={handleSearchChange}/>
                <div className='flex-grow mx-auto p-4 pt-6 flex justify-center items-center'>
                    <Loader />
                </div>
            </div>
        );
    }

    return (
        <div className='bg-gray-100 text-gray-800 min-h-screen font-roboto'>
            <NavBar onSearchChange={handleSearchChange} />
            <div className='container mx-auto p-4 pt-6'>
                <h1 className='text-3xl font-bold mb-4'>Welcome to our Bookstore</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
                    {filteredBooks.map(book => (
                        <div
                            key={book.id}
                            className='bg-white p-4 shadow rounded transform transition-transform duration-300 hover:scale-105 hover:shadow-lg'
                        >
                            <img
                                src={bookImages[book.id] || 'https://via.placeholder.com/150'}
                                alt={book.name}
                                className='w-full mb-4 transition-opacity duration-300 hover:opacity-90'
                            />
                            <h2 className='text-lg font-semibold'>{book.name}</h2>
                            <p className='text-sm text-gray-600'>by {book.author}</p>
                            <p className='text-green-500 font-bold mt-2'>{`$${book.price}`}</p>
                            <button
                                onClick={() => handleBuyNow(book)}
                                className='mt-4 bg-blue-500 text-white px-4 py-2 rounded transition-colors duration-300 hover:bg-blue-600'
                            >
                                Buy Now
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomePage;
