"use client";
import { initMongoose } from "@/lib/mongoose";
import Product from "../components/Product";
import Footer from "../components/Footer";
import Layout from "../components/Layout";
import Image from "next/image";
import React from "react";
import { useEffect, useState } from "react";
import { findAllProducts } from "./api/products/route";

export default function Home() {
  const [productsInfo, setProductsInfo] = useState([]);
  const [phrase, setPhrase] = useState('');
  useEffect(()=>{
    fetch('/api/products')
      .then(response => response.json())
      .then(json => setProductsInfo(json));
  }, []);

  const categoriesNames = [...new Set(productsInfo.map(p => p.category))];

  let products;
  if(phrase) {
    products = productsInfo.filter(p => p.name.toLowerCase().includes(phrase));
  } else {
    products = productsInfo;
  }

  return (
    <Layout>
      <div className="bg-white text-black">
        <input value={phrase} onChange={e => setPhrase(e.target.value)} type="text" placeholder="Search for products..." className="bg-gray-100 text-black w-full py-2 px-4 rounded-xl"/>
        <div>
          {categoriesNames.map(categoryName => (
            <div key={categoryName}>
              {products.find(p => p.category === categoryName) && (
                <div>
                  <h2 className="text-2xl py-5 capitalize">{categoryName}</h2>
                  <div className="flex -mx-5 overflow-x-scroll snap-x scrollbar-hide">
                    {products.filter(p => p.category === categoryName).map(productInfo => (
                      <div key={productInfo._id} className='px-5 snap-start'>
                        <Product { ...productInfo} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
