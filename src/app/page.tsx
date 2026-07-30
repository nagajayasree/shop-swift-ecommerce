import { Suspense } from "react";
import ShopPage from "@/features/products/components/ShopPage";
import Loading from "./(shop)/loading";

export default function Home() {
    return (
        <div className="w-full">
            <Suspense fallback={<Loading />}>
                <ShopPage />
            </Suspense>
        </div>
    );
}