"use client";

import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme";
import "../styles/globals.css";
import ErrorBoundary from "../components/ErrorBoundary";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Box, CssBaseline } from "@mui/material";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.cdnfonts.com/css/twilio-sans-mono"
          rel="stylesheet"
        />
        <script
          defer
          src="https://media.twiliocdn.com/sdk/js/webchat-v3/releases/3.2.0/webchat.min.js"
          integrity="sha256-r+FZzVxmBgpQkyhlaMOiKdNPQGGHgM="
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorBoundary>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                minHeight: "100vh", // Ensures full height
              }}
            >
              <Header />
              <Box sx={{ flexGrow: 1 }}>
                {" "}
                {/* Pushes footer to the bottom */}
                {children}
              </Box>
              <Footer />
            </Box>
            <div id="twilio-webchat-widget-root"></div>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
