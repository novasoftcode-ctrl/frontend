import React, { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "@/config/api";

interface StoreData {
    _id: string;
    name: string;
    slug: string;
    logoUrl: string;
    coverUrl: string;
    category: string;
    description: string;
    address: string;
    phone: string;
    email: string;
    officeHours: {
        daysFrom: string;
        daysTo: string;
        timeFrom: string;
        timeTo: string;
    };
    socialMedia: {
        instagram?: string;
        facebook?: string;
    };
}

interface StoreContextType {
    storeData: StoreData | null;
    loading: boolean;
    error: string | null;
    refreshStore: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { slug } = useParams<{ slug: string }>();
    const [storeData, setStoreData] = useState<StoreData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStore = async () => {
        if (!slug) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await fetch(`${API_BASE_URL}/api/store/${slug.toLowerCase()}`);
            if (!response.ok) {
                throw new Error("Store not found");
            }
            const data = await response.json();
            setStoreData(data);
            localStorage.setItem("vendor_store_data", JSON.stringify(data));
        } catch (err: any) {
            setError(err.message);
            setStoreData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStore();
    }, [slug]);

    return (
        <StoreContext.Provider value={{ storeData, loading, error, refreshStore: fetchStore }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (context === undefined) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
};
