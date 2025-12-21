
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignUp from './pages/SignUp';
import Header from './components/Header'; // Import the Header
import Footer from './components/Footer';
import SignIn from './pages/SignIn';
import AddProperty from './pages/AddProperty';
import PropertyPage from './pages/PropertyPage';
import Properties from "./pages/Properties";
import Wishlist from "./pages/Wishlist";

export default function App() {
  return (
    <BrowserRouter>
      {/* The Header is placed outside the Routes so it shows on every page */}
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/listing/:id" element={<PropertyPage />} />
        <Route path="/add-property" element={<AddProperty />} />
        <Route path="/search" element={<Properties />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}