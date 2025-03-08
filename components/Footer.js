import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = ({ className }) => {
  return (
    <Box
      component="footer"
      py={2}
      bgcolor="primary.main"
      color="white"
      textAlign="center"
      className={className}
    >
      <Typography variant="body2">
        {new Date().getFullYear()} - Created by Shane Artman Twilio Demos - All
        rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
