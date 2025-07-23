import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";

export function AnnouncementCard({ announcement }) {
  const createdAtDate = new Date(announcement.createdAt);
  const formattedDate = createdAtDate.toLocaleString();
  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-2 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>{announcement.title}</CardTitle>
            <CardDescription>{announcement.content}</CardDescription>
          </CardHeader>
          <CardFooter>
            <div className="text-sm text-muted-foreground">{formattedDate}</div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
