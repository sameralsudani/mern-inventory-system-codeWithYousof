import  { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

// Create the LanguageContext
const LanguageContext = createContext();

// LanguageProvider component to wrap the app
export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en"); // Default language is English

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
};

LanguageProvider.propTypes = {
  children: PropTypes.node.isRequired,
};


// Custom hook to use the LanguageContext
export const useLanguage = () => useContext(LanguageContext);