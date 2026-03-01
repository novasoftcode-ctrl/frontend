import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeColors = {
    primary: string;
    secondary: string;
};

const ThemeContext = createContext<{
    theme: ThemeColors | null;
    setTheme: (theme: ThemeColors) => void;
}>({
    theme: null,
    setTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setThemeState] = useState<ThemeColors | null>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem("vendor_store_theme");
        if (savedTheme) {
            try {
                const parsed = JSON.parse(savedTheme);
                setThemeState(parsed);
                applyTheme(parsed);
            } catch (e) {
                console.error("Error parsing theme", e);
            }
        }
    }, []);

    const applyTheme = (colors: ThemeColors) => {
        const root = document.documentElement;

        // Convert hex to HSL for Tailwind compatibility if needed, 
        // but here we can just override the variables directly if our CSS uses them.
        // Since index.css uses HSL, we should ideally provide HSL values.
        // However, to keep it simple and robust, we can use hex directly for the main colors.

        root.style.setProperty("--primary", hexToHSL(colors.primary));
        root.style.setProperty("--secondary", hexToHSL(colors.secondary));

        // Update gradient-bg and others if they don't use the variables
        root.style.setProperty("--gradient-primary", `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`);
    };

    const setTheme = (colors: ThemeColors) => {
        setThemeState(colors);
        localStorage.setItem("vendor_store_theme", JSON.stringify(colors));
        applyTheme(colors);
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

// Helper function to convert hex to HSL string compatible with shadcn/ui (H S% L%)
function hexToHSL(hex: string): string {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.slice(1, 3), 16);
        g = parseInt(hex.slice(3, 5), 16);
        b = parseInt(hex.slice(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}
