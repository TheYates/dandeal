import { ThemeProvider } from "@/components/theme-provider";

export default function SignInLayout({
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
      storageKey="signin-theme"
    >
      {children}
    </ThemeProvider>
  );
}

