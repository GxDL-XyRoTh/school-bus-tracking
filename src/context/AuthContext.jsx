import { createContext, useContext, useState } from 'react';
import { USERS } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (role) => {
        // For demo simplicity, login as the mock user for that role
        if (USERS[role]) {
            setUser(USERS[role]);
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
