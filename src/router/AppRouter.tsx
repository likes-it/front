import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../component/Layout';
import LandingPage from '../page/LandingPage';
// import AboutPage from '../page/AboutPage';
// import ContactPage from '../page/ContactPage';
import LoginPage from '../page/LoginPage';
import RegisterPage from '../page/RegisterPage';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        {/* <Route path="/about" element={<Layout><AboutPage /></Layout>} /> */}
        {/* <Route path="/contact" element={<Layout><ContactPage /></Layout>} /> */}

        {/* Routes sans layout, par exemple pour l'authentification */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}
