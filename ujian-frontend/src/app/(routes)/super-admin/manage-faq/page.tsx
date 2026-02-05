import { getFaqs } from "@/actions/faq";
import FaqManagementClient from "./FaqManagementClient";
import PageHeader from "@/components/common/PageHeader";

export const metadata = {
    title: "Manage FAQ - Admin",
    description: "Kelola daftar pertanyaan umum",
};


export const dynamic = "force-dynamic";

export default async function ManageFaqPage() {
    const faqs = await getFaqs();

    return (
        <div className="space-y-6 p-6">
            <PageHeader
                title="Manage FAQ"
                description="Kelola pertanyaan dan jawaban yang sering diajukan."
            />
            <FaqManagementClient initialData={faqs} />
        </div>
    );
}
