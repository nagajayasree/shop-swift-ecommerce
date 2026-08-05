import { useTranslations } from "next-intl";

export default function Cart() {
    const t = useTranslations();

    return (
        <div className="p-6 dark:bg-neutral-900/100">
            <h3 className="text-xl text-neutral-900 dark:text-white">
                {t("CartPage.title")}
            </h3>
        </div>
    );
}
