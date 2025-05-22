import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../component/Layout';
import LandingPage from '../page/LandingPage';
import LoginPage from '../page/LoginPage';
import RegisterPage from '../page/RegisterPage';
import MinePage from '../page/MinePage';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout><LandingPage /></Layout>} />
        <Route path="/my-images" element={<Layout><MinePage /></Layout>} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}
