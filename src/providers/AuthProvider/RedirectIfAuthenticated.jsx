import React from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate from react-router-dom
import { useAuth } from "../../context/AuthContext";
import OverlayLoader from "../../components/OverlayLoader";
import { routes } from "../../config/routes";

const RedirectIfAuthenticated = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate

    React.useEffect(() => {
      if (!loading && isAuthenticated) {
        navigate(routes.home); // Redirect to dashboard if authenticated
      }
    }, [isAuthenticated, loading, navigate]);

    // Show a loading indicator while loading or if authenticated
    if (loading || isAuthenticated) {
      return <OverlayLoader/>; // You can replace this with a spinner or any other component
    }

    // Render the wrapped component if not authenticated
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default RedirectIfAuthenticated;
