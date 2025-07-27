import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const cardClasses =
  "bg-card dark:bg-card-foreground text-card-foreground dark:text-card p-4 rounded-lg shadow-md border h-fit";

const textClasses = "mt-4 text-gray-700 dark:text-gray-300 leading-relaxed";
const dateClasses = "text-sm  mt-2 text-black ";

const PostCard = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { t } = useTranslation();
  const convertedDate = new Date(post.createdAt);
  const formattedDate = convertedDate.toLocaleString();

  // Character limit for truncation
  const charLimit = 150;
  const shouldTruncate = post.content && post.content.length > charLimit;

  const displayContent = shouldTruncate && !isExpanded
    ? post.content.substring(0, charLimit) + "..."
    : post.content;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={cardClasses}>
      <div className="flex items-center">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
          <span className="text-blue-600 dark:text-blue-300 font-semibold text-sm">
            {post.fullName?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <h2 className="ml-3 font-bold text-gray-800 dark:text-gray-200">{post.fullName}</h2>
      </div>

      <div className={textClasses}>
        <p className="whitespace-pre-wrap break-words">
          {displayContent}
        </p>

        {shouldTruncate && (
          <button
            onClick={toggleExpanded}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium text-sm mt-2 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
          >
            {isExpanded ? t("posts.readLess") : t("posts.readMore")}
          </button>
        )}
      </div>

      <p className={dateClasses}>{t("posts.postedOn")} {formattedDate}</p>
    </div>
  );
};

export default PostCard;
