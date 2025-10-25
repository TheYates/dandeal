import { ThemeProvider } from "@/components/common/theme-provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      storageKey="admin-theme"
    >
      {children}
    </ThemeProvider>
  );
}

