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
  Modal,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/material/styles";

const StyledTable = styled(Table)({
  minWidth: 650,
  border: "1px solid #ddd",
});

const StyledTableHead = styled(TableHead)({
  backgroundColor: "#f5f5f5",
});

export default function Operators() {
  const [operators, setOperators] = useState([]);
  const [attachedOperators, setAttachedOperators] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchOperators();
    fetchAttachedOperators();
  }, []);

  const fetchOperators = async () => {
    try {
      const response = await fetch("/api/voiceIntelligenceDemo/operators");
      if (!response.ok) throw new Error("Failed to fetch operators");
      const data = await response.json();
      setOperators(data);
    } catch (error) {
      console.error("Error fetching operators:", error);
    }
  };

  const fetchAttachedOperators = async () => {
    try {
      const response = await fetch(
        "/api/voiceIntelligenceDemo/attached_operators"
      );
      if (!response.ok) throw new Error("Failed to fetch attached operators");
      const data = await response.json();
      setSelectedService(data.selectedService);
      setAttachedOperators(
        data.attachedOperators.filter((op) => op.author !== "twilio")
      );
    } catch (error) {
      console.error("Error fetching attached operators:", error);
    }
  };

  const handleConfigClick = (config) => {
    setSelectedConfig(config);
    setOpenModal(true);
  };

  const handleDelete = async (operator) => {
    const response = await fetch(`/api/voiceIntelligenceDemo/operators`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sid: operator.sid }),
    });

    if (response.ok) {
      await fetchOperators();
    } else {
      alert("Error deleting operator");
    }
  };

  const handleAttach = async (operator) => {
    if (!selectedService) {
      alert("No service selected");
      return;
    }

    const response = await fetch(
      `/api/voiceIntelligenceDemo/attach_operators`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sid: operator.sid,
          serviceSid: selectedService.sid,
        }),
      }
    );

    if (response.ok) {
      await fetchAttachedOperators();
    } else {
      alert("Error attaching operator");
    }
  };

  const handleRemove = async (operator) => {
    const response = await fetch(
      `/api/voiceIntelligenceDemo/attached_operators`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sid: operator.sid,
          serviceSid: selectedService.sid,
        }),
      }
    );

    if (response.ok) {
      await fetchAttachedOperators();
    } else {
      alert("Error removing operator from service");
    }
  };

  const unattachedOperators = operators.filter(
    (operator) =>
      !attachedOperators.some((attached) => attached.sid === operator.sid)
  );

  return (
    <Container maxWidth="lg">
      {/* Attached Operators */}
      <Box mt={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          Attached Operators
        </Typography>
        <TableContainer component={Paper}>
          <StyledTable>
            <StyledTableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Friendly Name</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Config</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {attachedOperators.map((operator) => (
                <TableRow key={operator.sid}>
                  <TableCell>{operator.description}</TableCell>
                  <TableCell>{operator.friendlyName}</TableCell>
                  <TableCell>{operator.author}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="primary"
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => handleConfigClick(operator.config)}
                    >
                      View Config
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleRemove(operator)}
                    >
                      Remove from Service
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </Box>

      {/* Unattached Operators */}
      <Box mt={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          Unattached Operators
        </Typography>
        <TableContainer component={Paper}>
          <StyledTable>
            <StyledTableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Config</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {unattachedOperators.map((operator) => (
                <TableRow key={operator.sid}>
                  <TableCell>{operator.description}</TableCell>
                  <TableCell>{operator.author}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      color="primary"
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => handleConfigClick(operator.config)}
                    >
                      View Config
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={() => handleAttach(operator)}
                      color="primary"
                    >
                      Attach
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </Box>

      {/* Custom Operators */}
      <Box mt={4}>
        <Typography variant="h4" component="h2" gutterBottom>
          Custom Operators
        </Typography>
        <TableContainer component={Paper}>
          <StyledTable>
            <StyledTableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Config</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {operators.map(
                (operator) =>
                  operator.author !== "Twilio" && (
                    <TableRow key={operator.sid}>
                      <TableCell>{operator.description}</TableCell>
                      <TableCell>{operator.author}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          color="primary"
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleConfigClick(operator.config)}
                        >
                          View Config
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleDelete(operator)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </StyledTable>
        </TableContainer>
      </Box>

      {/* Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            width: "80vw",
            maxWidth: "1200px",
            maxHeight: "90vh", // Limit height
            overflowY: "auto", // Enable vertical scrolling
            borderRadius: 2,
            boxShadow: 24,
          }}
        >
          <Typography variant="h6">Operator Config</Typography>
          <Typography sx={{ mt: 2, whiteSpace: "pre-wrap" }}>
            {JSON.stringify(selectedConfig, null, 2)}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenModal(false)}
            sx={{ mt: 2 }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}
