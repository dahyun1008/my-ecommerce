"use client";
import dynamic from "next/dynamic";
import { createContext } from "react";
import { useEffect, useState } from "react";

const NoSSRProductsContextProvider = dynamic(() => Promise.resolve(ProductsContextProvider), { ssr: false });

export const ProductsContext = createContext({
    selectedProducts: [],
    setSelectedProducts: ()=>{}
});

function ProductsContextProvider({children}){
    const [selectedProducts, setSelectedProducts] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            try {
                const cartData = localStorage.getItem("cart");
                const parseDate = cartData ? JSON.parse(cartData) : [];
                setSelectedProducts(Array.isArray(parseDate) ? parseDate : []);
            } catch (error) {
                console.error("Error parsing localStorage daa:", error);
                setSelectedProducts([]);
            }
        }
    }, []);

    useEffect(() => {
        if (selectedProducts !== null) {
            try {
                localStorage.setItem("cart", JSON.stringify(selectedProducts));
            } catch (error) {
                console.error("Error saving to localStorage:", error);
            }
        }
    }, [selectedProducts]);

    if (selectedProducts === null) {
        return null;
    }

    return (
        <ProductsContext.Provider value={{ selectedProducts: selectedProducts || [], setSelectedProducts }}>
            {children}
        </ProductsContext.Provider>
    );
}

export default NoSSRProductsContextProvider;