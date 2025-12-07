import { FileText } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function Header({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <Card className="mb-6 dark:bg-neutral-900 bg-white">
      <CardHeader>
        <CardTitle>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </div>
        </CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
    </Card>
  );
}
