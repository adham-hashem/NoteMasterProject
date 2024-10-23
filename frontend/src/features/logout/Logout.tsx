import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../features/context/AuthContext"; // Import your Auth context

function Logout() {
    const navigate = useNavigate();
    const { setToken } = useAuth(); // Get setToken from Auth context

    useEffect(() => {
        localStorage.removeItem("jwtToken");
        setToken(null); // Set the token to null in context
        navigate('/'); // Redirect after logout
    }, [navigate, setToken]);

    return (
        <h2>You have been logged out</h2>
    )
}

export default Logout;
