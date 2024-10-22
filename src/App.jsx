import React, {useState} from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import BookPurchasePage from "./Components/BookPurchase"
import HomePage from "./Components/Homepage"
import CheckoutPage from "./Components/CheckoutPage"
import ProfilePage from "./Components/ProfilePage"

function App() {

  const [cart, setCart] = useState([]);

    const addToCart = (book) => {
        setCart((prevCart) => [...prevCart, book]);
    };

  return (
    <>
     <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/purchase" element={<BookPurchasePage />} />
        <Route path="/purchase-details" element={<CheckoutPage/>} />
        <Route path="/profile" element={<ProfilePage/>} />
      </Routes>
     </Router>
    </>
  )
}

export default App
