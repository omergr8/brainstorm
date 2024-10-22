import React from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import { routes } from "@/config/routes";
import OverlayLoader from "@/components/OverlayLoader";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Wrapper: React.FC<P> = (props) => {
    const { isAuthenticated, loading, loadingPercentage } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
      if (!loading && !isAuthenticated) {
        router.push(routes.account.login); // Redirect to login if not authenticated
      }
    }, [isAuthenticated, loading, router]);

    // If loading or not authenticated, show a loading indicator or nothing
    if (loading || !isAuthenticated) {
      return <OverlayLoader text={loadingPercentage} />; // You can replace this with a spinner or any other component
    }

    // Render the wrapped component if authenticated
    return <WrappedComponent {...(props as P)} />;
  };

  return Wrapper;
};

export default withAuth;
