"use client";
import Layout from "../../components/Layout";
import { useContext, useEffect, useState } from "react";
import { ProductsContext } from "../../components/ProductsContext";
import Product from '../../models/Product';
import { to } from '../../.next/static/chunks/[turbopack]_browser_dev_hmr-client_d6d8d4._';

export default function CheckoutPage(){
    const {selectedProducts, setSelectedProducts} = useContext(ProductsContext);
    const [productsInfo, setProductsInfo] = useState([]);
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    function moreOfThisProduct(id) {
        setSelectedProducts(prev => [...prev, id]);
    }
    function lessOfThisProduct(id) {
        setSelectedProducts(prev => {
            if (!Array.isArray(prev)) return prev;
            const pos = prev.indexOf(id);
            if(pos!==-1){
                return prev.filter((value, index) => index != pos);
            }
            else return prev;
        });
    }
    useEffect(() => {
        const uniqIds = [...new Set(selectedProducts)];
        fetch('/api/products?ids='+uniqIds.join(','))
            .then(response => response.json())
            .then(json => setProductsInfo(json));
    }, [selectedProducts]);

    let deliveryPrice = 5;
    let subtotal = 0;
    if(selectedProducts?.length) {
        for (let id of selectedProducts) {
            const product = productsInfo.find(p => p._id===id);
            if(!product) continue;
            subtotal+=product.price;
        }
    }
    const total = deliveryPrice+subtotal;

    return (
        <Layout>
            {!productsInfo.length && (
                <div>no products in your shopping cart</div>
            )}
            {productsInfo.length && productsInfo.map(productInfo => {
                const amount = selectedProducts.filter(id => id === productInfo._id).length;
                if(amount === 0 ) return null;

                return (
                <div className="flex mb-5" key={productInfo._id}>
                    <div className="bg-gray-100 p-5 rounded-xl shrink-0">
                        <img className="w-24" src={productInfo.picture} alt=""/>
                    </div>
                    <div className="pl-4">
                        <h3 className="font-bold text-lg">{productInfo.name}</h3>
                        <p className="text-sm leading-4 text-gray-500 w-[400px]">{productInfo.description}</p>
                        <div className="flex">
                            <div className="grow">${productInfo.price}</div>
                            <div>
                                <button onClick={() => lessOfThisProduct(productInfo._id)} className="border border-emerald-500 px-2 rounded-lg text-emerald">-</button>
                                <span className="px-2">
                                    {selectedProducts.filter(id => id === productInfo._id).length}
                                </span>
                                <button onClick={() => moreOfThisProduct(productInfo._id)} className="bg-emerald-500 px-2 rounded-lg text-white">+</button>
                            </div>
                        </div>
                    </div>
                </div>
            )})}
            <form action="/api/checkout" method="POST">
                <div className="mt-4">
                    <input name="address" value={address} onChange={e => setAddress(e.target.value)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="Street address, number"/>
                    <input name="city" value={city} onChange={e => setCity(e.target.city)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="City and postal code"></input>
                    <input name="name" value={name} onChange={e => setName(e.target.name)} className="bg-gray-100 w-full rounded-lg px-4 py-2 mb-2" type="text" placeholder="Your Name"></input>
                    <input name="email" value={email} onClick={e => setEmail(e.target.email)} className="bg-gray-100 w-full rounded-lg px-4 px-2 mb-2" type="email" placeholder="Email address"></input>
                </div>
                <div className="mt-5">
                    <div className="flex mb-3">
                        <h3 className="grow text-gray-400 font-bold">Subtotal:</h3>
                        <h3 className="font-bold">${subtotal}</h3>
                    </div>
                    <div className="flex mb-3">
                        <h3 className="grow text-gray-400 font-bold">Delivery:</h3>
                        <h3 className="font-bold">${deliveryPrice}</h3>
                    </div>
                    <div className="flex mb-3 border-t pt-3 border-emerald-200 border-dashed">
                        <h3 className="grow text-gray-400 font-bold">Total:</h3>
                        <h3 className="font-bold">${total}</h3>
                    </div>
                </div>
                <input type="hidden" name="products" value={selectedProducts.join(',')}/>
                <button type="submit" className="bg-emerald-500 px-5 py-2 rounded-xl font-bold text-white w-full my-4 shadow-emerald-300 shadow-lg">Pay ${total}</button>
            </form>
        </Layout>
    );
}