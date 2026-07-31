import { Suspense } from "react";
import ShopPage from "./(shop)/products/page";
import Loading from "./(shop)/products/loading";

export default function Home() {
    return (
        <div className="w-full">
            <Suspense fallback={<Loading />}>
                <ShopPage />
            </Suspense>
        </div>
    );
}