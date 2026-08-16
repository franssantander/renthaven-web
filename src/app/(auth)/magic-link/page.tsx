import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MagicLinkPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Magic link sign-in</CardTitle>
          <CardDescription>This module is coming soon.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          We&apos;re still building this out. Check back soon.
        </CardContent>
      </Card>
    </div>
  );
}
