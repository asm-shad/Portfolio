"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  postId: number;
  className?: string;
  children: ReactNode;
};

export default function TrackedBlogLink({
  href,
  postId,
  className,
  children,
}: Props) {
  const handleClick = () => {
    // fire-and-forget; don’t block navigation
    fetch(`${process.env.NEXT_PUBLIC_API_BASE}/post/${postId}/views`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // keep if your API expects cookies; else remove
      keepalive: true,
    }).catch(() => {});
  };

  // Let <Link> handle navigation; we just tap the click
  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
