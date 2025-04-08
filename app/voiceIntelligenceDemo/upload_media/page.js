"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
} from "@mui/material";

const defaultParticipants = [
  {
    channel_participant: 1,
    image_url: "https://shane.ngrok.io/images/agent-stew.jpg",
    full_name: "Stew",
    role: "Agent",
    email: "agent@bigco.com",
    user_id: "Stew-xt44432",
  },
  {
    channel_participant: 2,
    image_url: "https://shane.ngrok.io/images/customer-mary.jpg",
    full_name: "Mary",
    role: "Customer",
    email: "customer.email@gmailx.com",
    media_participant_id: "+12005551212",
  },
];

const imageBaseUrl = "https://shane.ngrok.io/images/";

const menuItems = [
  "agent-derek.jpg",
  "agent-marisa.jpg",
  "agent-stew.jpg",
  "agnet-isabelle.jpg",
  "customer-alfonzo.jpg",
  "customer-chris.jpg",
  "customer-mark.jpg",
  "customer-mary.jpg",
];

export default function UploadMedia() {
  useEffect(() => {
    setParticipants(defaultParticipants);
  }, []);

  const [message, setMessage] = useState("");
  const [participants, setParticipants] = useState(defaultParticipants);
  const router = useRouter();

  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = [...participants];
    updatedParticipants[index][field] = value;
    setParticipants(updatedParticipants);
  };

  const handleFileChange = (event) => {
    const fileName = event.target.files[0]?.name || "No file chosen";
    setMessage(`Selected file: ${fileName}`);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("participants", JSON.stringify(participants));
    setMessage("Uploading file...");

    const response = await fetch("/api/voiceIntelligenceDemo/upload", {
      method: "POST",
      body: formData,
    });

    console.log("FormData:", formData);

    if (response.status === 200) {
      const data = await response.json();
      setMessage(`Success - transcriptSid: ${data.transcriptSid}`);
      router.push("/voiceIntelligenceDemo");
    } else {
      const errorText = await response.text();
      setMessage(`Error: ${errorText}`);
    }
  };

  // Function to convert filename to title case
  const formatLabel = (fileName) => {
    return fileName
      .replace(/-/g, " ") // Remove hyphens
      .replace(/\.jpg$/i, "") // Remove ".jpg" extension
      .trim()
      .split(" ") // Split into words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter
      .join(" "); // Join words back together
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Upload Audio File for Transcription
      </Typography>
      <Paper elevation={3} style={{ padding: "16px", marginBottom: "16px" }}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <TextField
            fullWidth
            type="file"
            name="file"
            accept=".mp3,.flac,.wav,.mp4"
            required
            onChange={handleFileChange}
            style={{ marginBottom: "16px" }}
          />
          <Typography variant="h5" component="h2" gutterBottom>
            Participants
          </Typography>
          {participants.map((participant, index) => (
            <Box key={index} mb={2}>
              <Typography variant="h6" component="h3" gutterBottom>
                Channel Participant {participant.channel_participant}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={participant.full_name}
                    onChange={(e) =>
                      handleParticipantChange(
                        index,
                        "full_name",
                        e.target.value
                      )
                    }
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={participant.email}
                    onChange={(e) =>
                      handleParticipantChange(index, "email", e.target.value)
                    }
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="User ID"
                    value={participant.user_id}
                    onChange={(e) =>
                      handleParticipantChange(index, "user_id", e.target.value)
                    }
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Media Participant ID"
                    value={participant.media_participant_id}
                    onChange={(e) =>
                      handleParticipantChange(
                        index,
                        "media_participant_id",
                        e.target.value
                      )
                    }
                    variant="outlined"
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>Image URL</InputLabel>
                    <Select
                      value={participant.image_url}
                      onChange={(e) =>
                        handleParticipantChange(
                          index,
                          "image_url",
                          e.target.value
                        )
                      }
                      label="Image URL"
                      renderValue={(selected) => {
                        const selectedItem = menuItems.find(
                          (fileName) =>
                            `${imageBaseUrl}${fileName}` === selected
                        );

                        return selectedItem ? (
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              src={`${imageBaseUrl}${selectedItem}`}
                              alt={formatLabel(selectedItem)}
                              sx={{ w: 5, h: 5, mr: 1 }}
                            />
                            {formatLabel(selectedItem)}
                          </Box>
                        ) : null;
                      }}
                    >
                      {menuItems.map((fileName) => (
                        <MenuItem
                          key={fileName}
                          value={`${imageBaseUrl}${fileName}`}
                        >
                          <Avatar
                            src={`${imageBaseUrl}${fileName}`}
                            alt={formatLabel(fileName)}
                            sx={{ w: 5, h: 5, mr: 1 }}
                          />
                          {formatLabel(fileName)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth variant="outlined" margin="normal">
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={participant.role}
                      onChange={(e) =>
                        handleParticipantChange(index, "role", e.target.value)
                      }
                      label="Role"
                    >
                      <MenuItem value="Customer">Customer</MenuItem>
                      <MenuItem value="Agent">Agent</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Button type="submit" variant="contained" color="primary">
            Upload
          </Button>
        </form>
      </Paper>
      {message && (
        <Typography variant="body1" color="textSecondary">
          {message}
        </Typography>
      )}
    </Container>
  );
}
