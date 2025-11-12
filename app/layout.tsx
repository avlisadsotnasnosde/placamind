import type { Metadata } from "next";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import theme from "./layout/theme";

export const metadata: Metadata = {
    title: "Memorizador de Placas",
    description: "Criado por Edson Silva",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-br" suppressHydrationWarning>
            <body>
                <InitColorSchemeScript attribute="class" />
                <AppRouterCacheProvider options={{ enableCssLayer: true }}>
                    <ThemeProvider theme={theme}>
                        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                        <CssBaseline />
                        {children}
                    </ThemeProvider>
                </AppRouterCacheProvider>
            </body>
        </html>
    );
}
