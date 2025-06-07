"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Typography,
  Container,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const formatDuration = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
};

export default function Home() {
  const [fileList, setFileList] = useState([]);
  const [loadingText, setLoadingText] = useState("Loading.");
  const [isLoading, setIsLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [iframeUrl, setIframeUrl] = useState(null);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const [serviceSid, setServiceSid] = useState(null);

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/voiceIntelligenceDemo/services");
      if (!response.ok) {
        throw new Error("Failed to fetch services");
      }
      const services = await response.json();
      setServices(services);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchTranscripts = async () => {
    try {
      const response = await fetch("/api/voiceIntelligenceDemo/transcripts");
      if (!response.ok) {
        throw new Error("Failed to fetch transcripts");
      }
      const data = await response.json();
      const transcriptsWithServiceNames = data.map((transcript) => {
        const service = services.find((service) => service.sid === serviceSid);
        return {
          ...transcript,
          serviceFriendlyName: service
            ? service.friendlyName
            : transcript.serviceSid,
          serviceSid: serviceSid,
        };
      });
      setFileList(transcriptsWithServiceNames);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching transcripts:", error);
    }
  };

  useEffect(() => {
    const checkCredentials = async () => {
      const response = await fetch("/api/voiceIntelligenceDemo/config");
      const data = await response.json();
      if (!data.accountSid || !data.authToken) {
        router.push("/config");
      } else {
        await fetchServices();
        await fetchTranscripts();
        setServiceSid(data.serviceSid);
      }
    };

    checkCredentials();
  }, [router]);

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

  const handleMenuOpen = (event, file) => {
    setAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleDelete = async () => {
    if (!selectedFile) return;
    const response = await fetch("/api/voiceIntelligenceDemo/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcriptSid: selectedFile.sid,
        fileName: selectedFile.name,
      }),
    });

    if (response.ok) {
      await fetchTranscripts(); // Refresh the list of transcripts
      handleMenuClose();
    } else {
      const errorText = await response.text();
      alert(`Error deleting transcript: ${errorText}`);
    }
  };

  const handleOperatorResults = () => {
    if (!selectedFile) return;
    router.push(
      `/voiceIntelligenceDemo/operator_results?transcriptSid=${selectedFile.sid}`
    );
    handleMenuClose();
  };

  const handleTranscriptionViewer = async () => {
    if (!selectedFile) return;
    try {
      const response = await fetch(
        "/api/voiceIntelligenceDemo/transcription_viewer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcriptSid: selectedFile.sid,
            serviceSid: serviceSid,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch transcription viewer URL");
      }

      const viewerHtml = await response.text();
      setToken(viewerHtml);
      console.log("Viewer URL:", viewerHtml);
      handleMenuClose();
    } catch (error) {
      console.error("Error fetching transcription viewer URL:", error);
      alert("Error fetching transcription viewer URL");
    }
  };

  const handleDeleteAll = async () => {
    if (fileList.length === 0) {
      alert("No files to delete.");
      return;
    }

    const confirmDelete = confirm(
      `Are you sure you want to delete ALL (${fileList.length}) transcripts?`
    );
    if (!confirmDelete) return;

    try {
      // New approach: single POST to /deleteAll
      const response = await fetch("/api/voiceIntelligenceDemo/deleteAll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcriptSids: fileList.map((f) => f.sid),
        }),
      });

      if (response.status === 200) {
        // Everything got deleted
        await fetchTranscripts();
        alert("All transcripts have been deleted.");
      } else if (response.status === 207) {
        // Partial success/failure
        const json = await response.json();
        console.warn("Some deletes failed:", json.failedSids);
        await fetchTranscripts();
        alert(
          `Deleted most transcripts, but failed to delete: ${json.failedSids.join(
            ", "
          )}`
        );
      } else {
        // Unexpected error
        const errText = await response.text();
        console.error("Batch delete error:", errText);
        alert(`Failed to delete all transcripts: ${errText}`);
      }
    } catch (error) {
      console.error("Error calling deleteAll:", error);
      alert("An error occurred while deleting all transcripts. Check console.");
    }
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Uploaded Files
      </Typography>
      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/voiceIntelligenceDemo/upload_media")}
        >
          Upload
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ ml: 2 }}
          onClick={handleDeleteAll}
        >
          Delete All
        </Button>
      </Box>
      {isLoading ? (
        <Typography variant="h6" color="textSecondary">
          Loading<span>{loadingText.slice(7)}</span>
        </Typography>
      ) : (
        <>
          <TableContainer component={Paper} style={{ maxHeight: 400 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell>SID</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Updated</TableCell>
                  <TableCell>Duration (mm:ss)</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fileList.map((file) => (
                  <TableRow key={file.sid}>
                    <TableCell>{file.name || "None"}</TableCell>
                    <TableCell>{file.sid}</TableCell>
                    <TableCell>{file.serviceFriendlyName}</TableCell>
                    <TableCell>
                      {new Date(Date.parse(file.dateCreated)).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(Date.parse(file.dateUpdated)).toLocaleString()}
                    </TableCell>
                    <TableCell>{formatDuration(file.duration)}</TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="more"
                        aria-controls="long-menu"
                        aria-haspopup="true"
                        onClick={(event) => handleMenuOpen(event, file)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        id="long-menu"
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                        <MenuItem onClick={handleOperatorResults}>
                          Operator Results
                        </MenuItem>
                        <MenuItem onClick={handleTranscriptionViewer}>
                          View Transcription
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {token && (
            <Box mt={4}>
              <div>
                <iframe
                  width="100%"
                  height="700px"
                  src={`https://assets.twilio.com/public_assets/annotator/latest/index.html?token=${token}`}
                />
              </div>
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
