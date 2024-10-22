import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";

const NavBar = ({ onSearchChange }) => {
    return (
        <header className="shadow-md bg-white">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    <a href="#" className="text-xl font-bold font-roboto">BookSphere</a>
                    <nav className="hidden md:flex space-x-4 font-roboto">
                        <Link to="/home">Home</Link>
                        <Link to="/">Categories</Link>
                        <Link to="/">Rentals</Link>
                        <Link to="/">My Library</Link>
                        <Link to="/">Wishlist</Link>
                    </nav>
                </div>
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="Search for books, authors, or categories"
                        className="px-4 py-2 rounded-lg border border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={onSearchChange}
                    />
                    <FontAwesomeIcon icon={faBell} className='text-gray-700 h-5 hover:text-blue-500 cursor-pointer' />
                    <Link to='/cart'><FontAwesomeIcon icon={faCartShopping} className='text-gray-700 h-5 hover:text-blue-500 cursor-pointer' /></Link>
                    <Link to='/profile'><FontAwesomeIcon icon={faUser} className='text-gray-700 h-5 hover:text-blue-500 cursor-pointer' /></Link>
                </div>
            </div>
        </header>
    );
};

export default NavBar;
