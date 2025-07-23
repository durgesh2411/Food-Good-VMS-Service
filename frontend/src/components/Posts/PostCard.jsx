import React from "react";

const cardClasses =
  "bg-card dark:bg-card-foreground text-card-foreground dark:text-card p-4 rounded-lg shadow-md border";

const textClasses = "mt-4";
const dateClasses = "text-sm  mt-2 text-black ";

const PostCard = ({ post }) => {
  const convertedDate = new Date(post.createdAt);
  const formattedDate = convertedDate.toLocaleString();
  return (
    <div className={cardClasses}>
      <div className="flex items-center">
        <h2 className="ml-4 font-bold">{post.fullName}</h2>
      </div>
      <p className={textClasses}>{post.content}</p>
      <p className={dateClasses}>Posted on: {formattedDate}</p>
    </div>
  );
};

export default PostCard;
