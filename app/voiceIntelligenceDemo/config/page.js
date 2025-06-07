"use client";

import { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
} from "@mui/material"; // Update the path to the actual location of the Container component

export default function Config() {
  const [accountSid, setAccountSid] = useState("");
  const [authToken, setAuthToken] = useState("");
  const [serviceSid, setServiceSid] = useState("");
  const [services, setServices] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [isLoading, setIsLoading] = useState(true);
  const [originalAccountSid, setOriginalAccountSid] = useState("");
  const [DialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      const response = await fetch("/api/voiceIntelligenceDemo/config");
      const data = await response.json();
      setAccountSid(data.accountSid || "");
      setAuthToken(data.authToken ? "********" : "");
      setServiceSid(data.serviceSid || "");
    };
    fetchConfig();
  }, []);

  useEffect(() => {
    if (accountSid && authToken) {
      const fetchServices = async () => {
        try {
          const response = await fetch("/api/voiceIntelligenceDemo/services");
          const data = await response.json();
          setServices(data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching services:", error);
          setIsLoading(false);
          throw new Error(
            "Failed to fetch services. Please check your Account SID and Auth Token."
          );
        }
      };
      fetchServices();
    }
  }, [accountSid, authToken]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingText((prev) => {
        if (prev === "Loading.") return "Loading..";
        if (prev === "Loading..") return "Loading...";
        return "Loading.";
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleFocus = (setter) => () => {
    setOriginalAccountSid(accountSid);
    setter("");
  };

  const handleSaveConfig = async () => {
    const response = await fetch("/api/voiceIntelligenceDemo/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accountSid, authToken }),
    });

    if (response.ok) {
      setDialogOpen(true);
      setTimeout(() => {
        setDialogOpen(false);
        // router.push("/config");
      }, 2000);
    } else {
      const errorText = await response.text();
      alert(`Error saving configuration: ${errorText}`);
    }
  };

  const handleServiceChange = async (serviceSid) => {
    setServiceSid(serviceSid);
    const response = await fetch("/api/voiceIntelligenceDemo/config", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ serviceSid }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert(`Error saving service configuration: ${errorText}`);
    }
  };

  const handleBlur = () => {
    console.log("Account SID:", accountSid);
    if (accountSid.trim() === "") {
      setAccountSid(originalAccountSid);
    }
  };

  const handleAuthTokenBlur = () => {
    if (authToken.trim() === "") {
      setAuthToken("********");
    }
  };

  const handleDialogClickOpen = () => {
    setOpen(true);
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 2 }}>
      <Paper elevation={5} sx={{ p: 2 }}>
        <Typography variant="h4" component="h1">
          Configuration
        </Typography>
        <Typography variant="body1">
          <label className="block mb-2">Account SID:</label>
        </Typography>
        <TextField
          label="Account SID"
          variant="outlined"
          value={accountSid}
          onChange={(e) => setAccountSid(e.target.value)}
          onFocus={handleFocus(setAccountSid)}
          onBlur={handleBlur}
          placeholder="AC..."
          required
          fullWidth
          sx={{ my: 2 }}
        />
        <Typography variant="body1">
          <label className="block mb-2">Auth Token:</label>
        </Typography>
        <TextField
          type="password"
          value={authToken}
          onChange={(e) => setAuthToken(e.target.value)}
          onFocus={handleFocus(setAuthToken)}
          onBlur={handleAuthTokenBlur}
          placeholder="********"
          required
          fullWidth
          variant="outlined"
          margin="normal"
          label="Auth Token"
          sx={{ my: 2 }}
        />
        <Button variant="contained" onClick={handleSaveConfig} color="primary">
          Save
        </Button>
        <Box sx={{ my: 3 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Select the Conversational Service:
          </Typography>
          {isLoading ? (
            <div className="text-center text-2xl font-bold text-gray-500">
              Loading
              <span className="inline-block w-4">{loadingText.slice(7)}</span>
            </div>
          ) : (
            services.map((service) => (
              <div key={service.sid} className="mb-2">
                <input
                  type="radio"
                  id={service.sid}
                  name="serviceSid"
                  value={service.sid}
                  checked={serviceSid === service.sid}
                  onChange={(e) => handleServiceChange(e.target.value)}
                  className="mr-2"
                />
                <label htmlFor={service.sid}>{service.friendlyName}</label>
              </div>
            ))
          )}
        </Box>
        <Dialog
          open={DialogOpen}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Saving Configuration"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Configuration Saved Successfully
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Paper>
    </Container>
  );
}
