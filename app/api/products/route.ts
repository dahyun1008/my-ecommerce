import { NextResponse } from "next/server";
import { initMongoose } from "../../../lib/mongoose";
import Product from "../../../models/Product";

export async function findAllProducts() {
    return Product.find().exec();
}

export async function GET(request) {  // 👈 GET 메서드를 명시적으로 정의해야 함!
    await initMongoose();
    
    const {searchParams} = new URL(request.url);
    const ids = searchParams.get("ids");
    if (ids) {
        const productIds = ids.split(',');
        const products = await Product.find({_id: {$in: productIds}}).exec();
        return NextResponse.json(products);
    } else {
        const products = await findAllProducts();
        return NextResponse.json(products);
    }
}