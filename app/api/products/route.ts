import { NextResponse } from "next/server";
import { initMongoose } from "../../../lib/mongoose";
import Product from "../../../models/Product";

export async function findAllProducts() {
    return Product.find().exec();
}

export async function GET() {  // 👈 GET 메서드를 명시적으로 정의해야 함!
    await initMongoose();
    const products = await findAllProducts();
    return NextResponse.json(products);
}