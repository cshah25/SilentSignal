import React from "react";

export default function PaddingContainer({ children, padding = "1rem" }) {
  const resolvedPadding = typeof padding === "number" ? `${padding}px` : padding;

  return (
    <div style={{ padding: resolvedPadding }}>
      {children}
    </div>
  );
}
