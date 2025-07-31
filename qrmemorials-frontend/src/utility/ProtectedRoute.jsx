// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT payload
    const expiry = payload.exp * 1000; // convert exp to milliseconds
    return Date.now() > expiry;
  } catch (e) {
        console.error("Invalid token:", e);

    return true; // invalid token format or decoding failed
  }
};

const ProtectedRoute = ({ children }) => {
    
  const token = localStorage.getItem("authToken"); // ✅ use the correct key

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
