"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import NextLink from "next/link";
import MUILink from "@mui/material/Link";
import Logo from "./Logo";
import theme from "../styles/theme";
import { measureFontSize } from "../utils/measureFontSize";
import { usePathname } from "next/navigation";

const pages = [
  { name: "AI Assistants", path: "/aiAssistantsDemo/aiAssistants" },
  {
    name: "Voice Intelligence",
    path: "/voiceIntelligenceDemo",
    subLinks: [
      { name: "Home", path: "/voiceIntelligenceDemo" },
      { name: "Upload Media", path: "/voiceIntelligenceDemo/upload_media" },
      { name: "Configuration", path: "/voiceIntelligenceDemo/config" },
      { name: "Operators", path: "/voiceIntelligenceDemo/operators" },
      {
        name: "Create Operator",
        path: "/voiceIntelligenceDemo/create_operator",
      },
    ],
  },
];
const settings = ["Profile", "Account", "Dashboard", "Logout"];

const Header = () => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [padding, setPadding] = React.useState(0);
  const [isMounted, setIsMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setIsMounted(true);
    const { height } = measureFontSize("monospace", "16px"); // Adjust font family and size as needed
    setPadding(height);
    window.addEventListener("load", () => {
      const appConfig = {
        deploymentKey: "CVe4f515426c7cf289b011cbeefe158990",
      };
      Twilio.initWebchat(appConfig);
    });
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const isCurrentPage = (path) => {
    if (!isMounted) return false;
    return pathname.startsWith(path);
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: theme.palette.secondary.main }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters style={{ padding: `${padding}px` }}>
          <MUILink
            href="/"
            underline="none"
            sx={{
              display: "flex",
              alignItems: "center",
              textDecoration: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
              }}
            >
              <Logo color={theme.palette.primary.main} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  mr: 2,
                  ml: 1,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: theme.palette.primary.main,
                  textDecoration: "none",
                }}
              >
                twilio
              </Typography>
            </Box>
          </MUILink>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              {pages.map((page) => [
                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                  <NextLink href={page.path} passHref>
                    <Typography sx={{ textAlign: "center" }}>
                      {page.name}
                    </Typography>
                  </NextLink>
                </MenuItem>,
                isMounted &&
                  isCurrentPage(page.path) &&
                  page.subLinks &&
                  page.subLinks.map((subLink) => (
                    <MenuItem
                      key={subLink.name}
                      onClick={handleCloseNavMenu}
                      sx={{ pl: 4 }}
                    >
                      <NextLink href={subLink.path} passHref>
                        <Typography sx={{ textAlign: "center" }}>
                          {subLink.name}
                        </Typography>
                      </NextLink>
                    </MenuItem>
                  )),
              ])}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: theme.palette.primary.main,
              textDecoration: "none",
            }}
          >
            twilio
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex" }}>
              {pages.map((page) => (
                <React.Fragment key={page.name}>
                  <NextLink href={page.path} passHref>
                    <Button
                      onClick={handleCloseNavMenu}
                      sx={{
                        my: 2,
                        color: "white",
                        display: "block",
                        borderBottom: isCurrentPage(page.path)
                          ? "2px solid white"
                          : "none", // Add thin line below active link
                      }}
                    >
                      {page.name}
                    </Button>
                  </NextLink>
                </React.Fragment>
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
              }}
            >
              {pages.map(
                (page) =>
                  isMounted &&
                  isCurrentPage(page.path) &&
                  page.subLinks &&
                  page.subLinks.map((subLink) => (
                    <NextLink key={subLink.name} href={subLink.path} passHref>
                      <Button
                        onClick={handleCloseNavMenu}
                        sx={{
                          my: 1,
                          color: "white",
                          display: "block",
                          pl: 4,
                          fontWeight: "normal", // Less bold
                          textTransform: "capitalize", // Capitalized case
                          fontSize: "0.875rem", // Smaller size
                        }}
                      >
                        {subLink.name}
                      </Button>
                    </NextLink>
                  ))
              )}
            </Box>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                {/* <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" /> */}
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: "center" }}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
