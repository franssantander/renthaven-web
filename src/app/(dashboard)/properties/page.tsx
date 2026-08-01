import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PropertiesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Properties</CardTitle>
        <CardDescription>This module is coming soon.</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        We&apos;re still building this out. Check back soon.
      </CardContent>
    </Card>
  );
}
