import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import AuthProvider from "./context/AuthContext.jsx";
import "./i18n";
import { LanguageProvider } from "./context/LanguageContext"; 
import StoreContextProvider from "./context/StoreContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <StoreContextProvider>
      <LanguageProvider>
        <App />
        <Toaster position="top-right" />
      </LanguageProvider>
    </StoreContextProvider>
  </AuthProvider>
);
