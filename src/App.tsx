import { useEffect } from "react";
import AppRouter from "./router/AppRouter";

const App = () => {
  useEffect(() => {
    // Warm up the backend API/cache on initial mount
    fetch("/api/public/health", { method: "HEAD" }).catch(() => {});
  }, []);

  return <AppRouter />;
};

export default App;
