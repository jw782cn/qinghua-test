import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export type CardItem = {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
};

export const FeatureCard = ({ icon, title, description }: Omit<CardItem, 'id'>) => {
  return (
    <Card className="border border-gray-200 rounded-xl overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <div className="h-10 w-10 bg-black rounded-full flex items-center justify-center mb-2">
          {icon}
        </div>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <CardDescription className="text-sm text-gray-500">
          {description}
        </CardDescription>
        <div className="mt-4 bg-gray-100 rounded-lg h-24"></div>
      </CardContent>
    </Card>
  );
}; 