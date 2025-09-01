import type React from "react";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // No need to manually set profileLanguage here anymore
  // This is now handled in the language-context.tsx

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">{children}</main>
    </div>
  );
}
