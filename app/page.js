"use client";

import { Container, Typography, Box, Button, Paper } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleNavigateToConfig = () => {
    router.push("/voiceIntelligenceDemo/config");
  };

  const handleNavigateToVoiceDemo = () => {
    router.push("/voiceIntelligenceDemo");
  };

  const handleNavigateToAIDemo = () => {
    router.push("/aiAssistantsDemo");
  };

  return (
    <div>
      <Container
        maxWidth="md"
        style={{ marginTop: "32px", marginBottom: "32px" }}
      >
        <Paper elevation={3} style={{ padding: "24px" }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to the Twilio Demos Tool
          </Typography>
          <Typography variant="body1" paragraph>
            Explore the powerful capabilities of Twilio through our interactive
            demos. This tool provides two exciting demos:
          </Typography>
          <Box component="ul" sx={{ paddingLeft: "16px" }}>
            <li>
              <Typography variant="body1">
                <strong>Voice Intelligence Demo:</strong> Analyze and transcribe
                voice interactions with Twilio's Voice Intelligence.
              </Typography>
            </li>
            <li>
              <Typography variant="body1">
                <strong>AI Assistants Demo:</strong> Interact with AI-powered
                assistants to enhance customer engagement.
              </Typography>
            </li>
          </Box>
          <Typography variant="body1" paragraph>
            To get started, visit the <strong>Configuration</strong> page to set
            up your Account SID, Auth Token, and select the Voice Intelligence
            service.
          </Typography>
          <Box display="flex" gap={2} marginTop={2}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNavigateToConfig}
            >
              Go to Configuration
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleNavigateToVoiceDemo}
            >
              Voice Intelligence Demo
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleNavigateToAIDemo}
            >
              AI Assistants Demo
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}
