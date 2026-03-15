import React from "react";
import { cn } from "@/lib/utils";

interface AdSpaceProps {
  className?: string;
  type?: "leaderboard" | "rectangle" | "banner";
}

export function AdSpace({ className, type = "banner" }: AdSpaceProps) {
  return (
    <div className={cn(
      "ad-space w-full",
      type === "leaderboard" && "h-[90px] max-w-[728px] mx-auto",
      type === "rectangle" && "h-[250px] w-[300px] mx-auto",
      type === "banner" && "h-[100px]",
      className
    )} />
  );
}
