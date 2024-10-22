import React from 'react';

const Cart = ({ cart }) => {
    return (
        <div className='bg-gray-100 text-gray-800 min-h-screen font-roboto'>
            <div className='container mx-auto p-4 pt-6'>
                <h1 className='text-3xl font-bold mb-4'>Your Cart</h1>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6'>
                    {cart.length > 0 ? (
                        cart.map((book) => (
                            <div
                                key={book.id}
                                className='bg-white p-4 shadow rounded transform transition-transform duration-300 hover:scale-105 hover:shadow-lg'
                            >
                                <img
                                    src={book.imageURL || 'https://via.placeholder.com/150'}
                                    alt={book.name}
                                    className='w-full mb-4 transition-opacity duration-300 hover:opacity-90'
                                />
                                <h2 className='text-lg font-semibold'>{book.name}</h2>
                                <p className='text-sm text-gray-600'>by {book.author}</p>
                                <p className='text-green-500 font-bold mt-2'>{`$${book.price}`}</p>
                            </div>
                        ))
                    ) : (
                        <p className='text-gray-500'>Your cart is empty.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
