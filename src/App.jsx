import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BusProvider } from './context/BusContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import ParentDashboard from './pages/ParentDashboard';
import DriverDashboard from './pages/DriverDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Layout from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <BusProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/parent/*" element={<ParentDashboard />} />
              <Route path="/driver/*" element={<DriverDashboard />} />
              <Route path="/admin/*" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        </BusProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
