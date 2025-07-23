// CardComponent.js
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";

export function CardComponent({ title, icon: Icon, value, description }) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 ease-in-out">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
