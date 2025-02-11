import Footer from "./Footer";

export default function Layout({children}) {
    return (
        <div className="bg-white text-black">
            <div className="">
                {children}
            </div>
            <Footer />
        </div>
    );
}