import React, { ReactNode } from "react";

export default function Center({ children }: { children: ReactNode }) {
  return (
    <div className="absolute md:top-1/2 top-60 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 mx-4">
      {children}
    </div>
  );
}
