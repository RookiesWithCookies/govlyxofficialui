import AppRouter from "./router/AppRouter";
import ScreenshotProtectionOverlay from "./components/security/ScreenshotProtectionOverlay";

const App = () => {
  return (
    <>
      <AppRouter />
      <ScreenshotProtectionOverlay />
    </>
  );
};

export default App;
