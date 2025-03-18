import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = ({ className }) => {
  return (
    <Box
      sx={{
        bottom: 0,
        py: 2,
        textAlign: "center",
        width: "100%",
      }}
      bgcolor="primary.main"
      color="white"
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
