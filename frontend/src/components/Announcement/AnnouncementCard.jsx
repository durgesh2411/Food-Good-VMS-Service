import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";

export function AnnouncementCard({ announcement }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const createdAtDate = new Date(announcement.createdAt);
  const formattedDate = createdAtDate.toLocaleString();
  
  // Character limit for truncation
  const charLimit = 200;
  const shouldTruncate = announcement.content && announcement.content.length > charLimit;
  
  const displayContent = shouldTruncate && !isExpanded 
    ? announcement.content.substring(0, charLimit) + "..." 
    : announcement.content;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-2 sm:px-6 lg:px-8">
      <div className="space-y-4">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-800 dark:text-gray-200 line-clamp-2">
              {announcement.title}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              <div className="whitespace-pre-wrap break-words leading-relaxed">
                {displayContent}
              </div>
              
              {shouldTruncate && (
                <button
                  onClick={toggleExpanded}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm mt-3 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded inline-block"
                >
                  {isExpanded ? 'Read Less' : 'Read More'}
                </button>
              )}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
              {formattedDate}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
