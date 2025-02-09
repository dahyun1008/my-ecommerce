"use client";
import { createContext } from "react";
import { useEffect, useState } from "react";
import useLocalStorageState from "use-local-storage-state";

export const ProductsContext = createContext({
    selectedProducts: [],
    setSelectedProducts: ()=>{}
});

export function ProductsContextProvider({children}){
    const [selectedProducts, setSelectedProducts] = useState(() => {
        if (typeof window !== "undefined") {
            try {
                const cartData = localStorage.getItem("cart");
                const parsedData = cartData ? JSON.parse(cartData) : [];
                return Array.isArray(parsedData) ? parsedData : [];
            } catch (error) {
                console.error("Error parsing localStorage data:", error);
                return [];
            }
        }
        return [];
    });

    useEffect(() => {
        if (Array.isArray(selectedProducts)) {
            try {
                localStorage.setItem("cart", JSON.stringify(selectedProducts));
            } catch (error) {
                console.error("Error saving to localStorage:", error);
            }
        }
    }, [selectedProducts]);

    return (
        <ProductsContext.Provider value={{ selectedProducts: selectedProducts || [], setSelectedProducts }}>
            {children}
        </ProductsContext.Provider>
    );
}