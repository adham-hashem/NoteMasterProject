import { ReactNode, useEffect, useState, createContext, useContext } from "react";

// Define the shape of the Auth context props
interface AuthContextProps {
    token: string | null; // Holds the JWT token
    setToken: (token: string | null) => void; // Function to update the token
}

// Create the Auth context
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Define the props for the AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

// Create the AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('jwtToken'));

    // Effect to synchronize the token with localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('jwtToken', token); // Save the token in localStorage
        } else {
            localStorage.removeItem('jwtToken'); // Remove the token from localStorage if it's null
        }
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the Auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider'); // Error if used outside of the provider
    }
    return context; // Return the context value
};

export default AuthContext;
