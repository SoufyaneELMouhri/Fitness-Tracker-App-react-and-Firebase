import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./Router/routes";
import { useAuth } from "./context/AuthContext";
import Spinner from "./Components/componentGuests/Spinner";

function App() {
  const { loading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading || showSplash) {
    return <Spinner />;
  }

  return <RouterProvider router={router} />;
}

export default App;
