import Footer from "./Footer";

export default function Layout({children}) {
    return (
        <div>
            <div className="">
                {children}
            </div>
            <Footer />
        </div>
    );
}