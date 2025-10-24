import { ThemeProvider } from "@/components/theme-provider";

export default function InviteLayout({
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
      storageKey="invite-theme"
    >
      {children}
    </ThemeProvider>
  );
}

