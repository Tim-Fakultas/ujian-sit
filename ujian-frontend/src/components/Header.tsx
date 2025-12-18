import { FileText } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Header({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <Card className="mb-6 bg-white dark:bg-neutral-900 border-gray-200 dark:border-neutral-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100">
            <FileText className="h-5 w-5" />
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {desc}
          </CardDescription>
        </CardHeader>
    </Card>
  );
}
