import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function TenantDashboardPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome to your portal</CardTitle>
        <CardDescription>
          This is your tenant dashboard. More features are coming soon.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Check back here for updates on your lease, payments, and maintenance
        requests.
      </CardContent>
    </Card>
  );
}
