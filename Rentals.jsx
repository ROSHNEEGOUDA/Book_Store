import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';
import { database, storage } from '../../Firebase'; 
import NavBar from './Navbar';

const MyLibraryPage = () => {
    const [rentedBooks, setRentedBooks] = useState([]);
    const [pdfURL, setPdfURL] = useState(null); 
    const [error, setError] = useState(null);

    useEffect(() => {
        const storedRentedBooks = JSON.parse(localStorage.getItem('rentedBooks') || '[]');
        setRentedBooks(removeDuplicates(storedRentedBooks));

        // Fetch rented books from Realtime Database
        const dbRef = ref(database, 'Books');
        onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const booksArray = Object.values(data);
                const uniqueBooks = removeDuplicates([...storedRentedBooks, ...booksArray]);
                setRentedBooks(uniqueBooks);
            }
        }, (error) => {
            setError("Failed to fetch books from database.");
            console.error("Database error: ", error);
        });
    }, []);

    const removeDuplicates = (books) => {
        const uniqueBooks = [];
        const bookIds = new Set();
        books.forEach((book) => {
            if (!bookIds.has(book.id)) {
                bookIds.add(book.id);
                uniqueBooks.push(book);
            }
        });
        return uniqueBooks;
    };

    const handleViewPDF = async (pdfPath) => {
        if (!pdfPath) {
            console.error("PDF path is undefined");
            setError("The PDF path is missing. Please check the book information.");
            return;
        }

        try {
            // Ensure the pdfPath is correct and relative to storage root
            console.log("Fetching PDF for path:", pdfPath); // Debugging line
            const pdfStorageRef = storageRef(storage, pdfPath);
            const url = await getDownloadURL(pdfStorageRef);
            console.log("Fetched PDF URL:", url); // Debugging line
            setPdfURL(url);
        } catch (error) {
            console.error("Error fetching PDF URL: ", error);
            setError("Failed to load PDF.");
        }
    };

    const closePDFViewer = () => setPdfURL(null);

    return (
        <div className="container mx-auto px-4 py-8">
            <NavBar />
            <h2 className="text-2xl font-semibold mb-4">Your Rented Books</h2>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            {rentedBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {rentedBooks.map((book, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                            <img
                                src={book.imageURL || "https://placehold.co/150x220"}
                                alt={`${book.name} Cover`}
                                className="w-full rounded-lg mb-4"
                            />
                            <h3 className="text-xl font-semibold">{book.name}</h3>
                            <p className="text-gray-700">by {book.author}</p>
                            <button
                                onClick={() => handleViewPDF(book.pdfURL)}
                                className="text-blue-500 hover:underline mt-4 block"
                            >
                                View PDF
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-700">You have no rented books.</p>
            )}

            {pdfURL && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                    <div className="bg-white rounded-lg shadow-lg w-11/12 h-5/6 relative">
                        <button
                            className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
                            onClick={closePDFViewer}
                        >
                            Close
                        </button>
                        <iframe 
                            src={pdfURL} 
                            className="w-full h-full" 
                            allow="fullscreen" 
                            sandbox="allow-scripts allow-same-origin"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyLibraryPage;
