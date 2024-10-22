import React, { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../../Firebase';
import NavBar from './Navbar';
import Loader from './Loader/Loader';

const ProfilePage = () => {
    const [userData, setUserData] = useState(null);
    const [phone, setPhone] = useState(''); // User's phone number input
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchUserData = async (phone) => {
        setLoading(true); // Start loading when fetching data
        setError(''); // Clear any previous error
        try {
            const userRef = ref(database, `orders/${phone}`);
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                setUserData(snapshot.val());
                setError(''); // Clear error if data is found
            } else {
                setError('No user data found for this phone number.');
                setUserData(null);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setError('An error occurred while fetching user data.');
        }
        setLoading(false); // Stop loading after fetching is done
    };

    useEffect(() => {
        if (phone) {
            fetchUserData(phone);
        } else {
            setUserData(null); // Clear data if phone number is empty
            setError('');
        }
    }, [phone]);

    return (
        <div className="bg-gray-100 min-h-screen">
            <NavBar />
            <section className="container mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-6">Profile</h1>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">User Details</h2>
                    <input
                        type="tel"
                        placeholder="Enter phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 mb-4 border rounded-lg"
                    />
                    {loading ? (
                        <div className='flex justify-center items-center'>
                            <Loader />
                        </div>
                    ) : (
                        <>
                            {error && <p className="text-red-500">{error}</p>}
                            {userData ? (
                                <div className="flex flex-col items-center">
                                    {/* Display Book Image */}
                                    <img
                                        src={userData.book?.imageURL || "https://placehold.co/150x200"}
                                        alt="Book Cover"
                                        className="w-32 h-48 mb-4 rounded-md shadow-md object-cover"
                                    />
                                    <p className="mb-2 text-lg">Name: {userData.name}</p>
                                    <p className="mb-2">Phone: {userData.phone}</p>
                                    <p className="mb-2">Address: {userData.address}</p>
                                    <p className="mb-2">Payment Method: {userData.paymentMethod}</p>
                                    <h3 className="mt-4 font-semibold text-lg">Book Details:</h3>
                                    <p className="mb-2">Title: {userData.book?.name}</p>
                                    <p className="mb-2">Author: {userData.book?.author}</p>
                                    <p className="mb-2">Quantity: {userData.book?.quantity}</p>
                                    <p className="mb-2">Total Price: ${userData.totalPrice}</p>
                                </div>
                            ) : (
                                !error && <p>Please enter a phone number to view details.</p>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;
