"use client";

import { ThemeProvider } from "@mui/material/styles";
import theme from "../styles/theme";
import "../styles/globals.css";
import ErrorBoundary from "../components/ErrorBoundary";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function Layout({ children }) {
  return (
    <html lang="en">
      <link
        href="https://fonts.cdnfonts.com/css/twilio-sans-mono"
        rel="stylesheet"
      ></link>
      <body>
        <ThemeProvider theme={theme}>
          <ErrorBoundary>
            <div id="root">
              <Header />
              <div className="content">{children}</div>
              <Footer className="footer"/>
            </div>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
