"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  TextField,
  IconButton,
  Box,
  Paper,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SendIcon from "@mui/icons-material/Send";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { v4 as uuidv4 } from "uuid";

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [identity, setIdentity] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    setSessionId(uuidv4());
    setIdentity("email@user.com");
  }, []);

  useEffect(() => {
    if (sessionId && identity)
      sendMessage("Phone: +17703610560", identity, sessionId).then(
        async (response) => {
          if (!response.ok) {
            console.log("Failed to get a response from Twilio.");
            throw new Error("Network response was not ok");
          }

          const data = await response.json();
          console.log("AI Response:", data);
          const botResponse = {
            sender: "Assistant",
            text:
              data.body ||
              `Sorry, please try that again. I wasn't listening...`,
          };
          setMessages([botResponse]);
        }
      );
  }, [identity, sessionId]);

  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          chatContainerRef.current;
        if (scrollTop + clientHeight < scrollHeight) {
          setIsScrolling(true);
        } else {
          setIsScrolling(false);
          setHasUnreadMessages(false);
        }
      }
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (chatContainer) {
        chatContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  useEffect(() => {
    if (!isScrolling && chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    } else if (isScrolling) {
      setHasUnreadMessages(true);
    }
  }, [messages]);

  async function sendMessage(input, identity, sessionId) {
    setIsTyping(true);
    const botResponse = await fetch("/api/aiAssistantsDemo/aiAssistants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: input,
        identity: identity,
        session_id: sessionId,
      }),
    });
    setIsTyping(false);
    return botResponse;
  }

  const handleSend = async () => {
    if (input.trim() !== "") {
      const newMessages = [...messages, { sender: "User", text: input }];
      setMessages(newMessages);
      setInput("");
      console.log("Session ID:", sessionId);
      console.log("User message:", input);
      console.log("identity:", identity);

      try {
        const response = await sendMessage(input, identity, sessionId);

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("AI Response:", data);
        const botResponse = {
          sender: "Assistant",
          text:
            data.body || `Sorry, please try that again. I wasn't listening...`,
        };
        setMessages([...newMessages, botResponse]);
      } catch (error) {
        const botResponse = {
          sender: "Bot",
          text: "Failed to get a response from Twilio.",
        };
        setMessages([...newMessages, botResponse]);
      }
    }
  };

  const handleScrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
      setIsScrolling(false);
      setHasUnreadMessages(false);
    }
  };

  return (
    <Container sx={{ display: "flex", justifyContent: "center", mt: 5, mb: 5 }}>
      <Paper
        sx={{
          padding: 5,
          width: { xs: 1 / 1, md: 3 / 4, lg: 2 / 3 },
          maxheight: "80vh",
          overflowY: "auto",
        }}
        elevation={10}
      >
        <Box ref={chatContainerRef}>
          {messages.map((message, index) => (
            <Typography
              key={index}
              className={`message ${message.sender.toLowerCase()} mb-2`}
            >
              <strong>{message.sender}:</strong> {message.text}
            </Typography>
          ))}
          {isTyping && (
            <Box>
              <CircularProgress size={20} />
              <Typography>
                <strong>Assistant:</strong> Thinking...
              </Typography>
            </Box>
          )}
        </Box>
        {hasUnreadMessages && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleScrollToBottom}
            className="scroll-to-bottom"
            startIcon={<ArrowDownwardIcon />}
          >
            New Message Waiting
          </Button>
        )}
        <Box sx={{ mt: 5 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid size={11}>
              <TextField
                fullWidth
                variant="outlined"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Type your message here..."
                className="mr-2"
              />
            </Grid>
            <Grid size={1}>
              <IconButton color="primary" onClick={handleSend}>
                <SendIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default ChatComponent;
