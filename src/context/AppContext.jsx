import { createContext , useContext, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
    const [darkMode, setDarkMode] = useState(true);
    const [role, setRole] = useState("Viewer");

    const toggleTheme = () => {
        setDarkMode(prev => !prev);
    };

    const toggleRole = () => {
        setRole(prev => prev === "Viewer" ? "Admin" : "Viewer");
    };

    return (
        <AppContext.Provider value={{ darkMode, isDark: darkMode , toggleTheme, role, toggleRole }}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp(){
    return useContext(AppContext);
}