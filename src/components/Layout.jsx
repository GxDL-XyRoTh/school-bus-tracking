import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Bus, LogOut } from 'lucide-react';
import Button from './Button';

export default function Layout({ children }) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const publicPaths = ['/', '/login'];
    const isPublicPage = publicPaths.includes(location.pathname);

    if (isPublicPage) {
        return <>{children}</>;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => navigate(user ? `/${user.role}` : '/')}
                    >
                        <div className="bg-primary/10 p-2 rounded-lg text-primary">
                            <Bus size={24} />
                        </div>
                        <h1 className="text-xl font-bold text-slate-800">
                            School Bus Tracker
                        </h1>
                    </div>

                    {user && (
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-medium text-slate-700">{user.name}</span>
                                <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                            </div>
                            <Button variant="ghost" onClick={handleLogout} className="p-2 hover:bg-slate-100 rounded-full">
                                <LogOut size={20} className="text-slate-500" />
                            </Button>
                        </div>
                    )}
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 flex-1">
                {children}
            </main>

            <footer className="bg-white border-t border-slate-200 py-6 text-center text-slate-400 text-sm">
                © 2026 School Bus Tracker. Safety First.
            </footer>
        </div>
    );
}
