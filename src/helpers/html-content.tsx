// components/html-content.tsx
"use client";

import DOMPurify from "dompurify";

interface HtmlContentProps {
  content: string;
  className?: string;
}

export function HtmlContent({ content, className = "" }: HtmlContentProps) {
  // Sanitize the HTML to prevent XSS attacks
  const cleanHtml = DOMPurify.sanitize(content);

  return (
    <div
      className={`prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanHtml }}
    />
  );
}
