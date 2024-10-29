import React from "react";
import { useNavigate } from "react-router-dom"; // Use useNavigate from react-router-dom
import { useAuth } from "../../context/AuthContext";
import OverlayLoader from "../../components/OverlayLoader";
import { routes } from "../../config/routes";

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate

    React.useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate(routes.account.login); // Redirect to login if not authenticated
      }
    }, [isAuthenticated, loading, navigate]);

    // If loading or not authenticated, show a loading indicator or nothing
    if (loading || !isAuthenticated) {
      return <OverlayLoader />; // You can replace this with a spinner or any other component
    }

    // Render the wrapped component if authenticated
    return <WrappedComponent />;
  };

  return Wrapper;
};

export default withAuth;
