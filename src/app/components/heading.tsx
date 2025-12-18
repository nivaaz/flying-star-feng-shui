import React from "react";

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

const Heading: React.FC<HeadingProps> = ({
  children,
  level = 1,
  className = "",
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  const baseStyles = "font-bold text-blue-900 dark:text-blue-100";
  const levelStyles = {
    1: "text-4xl",
    2: "text-3xl",
    3: "text-2xl",
    4: "text-xl",
    5: "text-lg",
    6: "text-base",
  };

  return (
    <Tag className={`${baseStyles} ${levelStyles[level]} ${className}`}>
      {children}
    </Tag>
  );
};

export default Heading;
