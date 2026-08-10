import { getTranslations } from "next-intl/server";

export default async function Account() {
    const t = await getTranslations();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4 text-gray-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white">
                {t("AccountPage.title")}
            </h1>
            <p className="text-lg text-gray-600 dark:text-neutral-300">
                {t("AccountPage.info")}
            </p>
        </div>
    );
}
