"use client";

import { useState } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  TextField,
} from "@mui/material";

export default function CreateContentTemplate() {
  const [activities, setActivities] = useState([
    {
      Activity: "",
      Description: "",
      media_for_rcs: "",
      "SMS CTA Button 1 Text": "",
      "SMS CTA Button 2 Text": "",
    },
  ]);
  const [result, setResult] = useState(null);

  const handleActivityChange = (idx, field, value) => {
    const updated = [...activities];
    updated[idx][field] = value;
    setActivities(updated);
  };

  const handleAddActivity = () => {
    setActivities([
      ...activities,
      {
        Activity: "",
        Description: "",
        media_for_rcs: "",
        "SMS CTA Button 1 Text": "",
        "SMS CTA Button 2 Text": "",
      },
    ]);
  };

  const handleRemoveActivity = (idx) => {
    setActivities(activities.filter((_, i) => i !== idx));
  };

  const handleGenerate = async () => {
    // Call your API route to generate the template
    const response = await fetch("/api/rcs/generateContentTemplate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activities }),
    });
    const data = await response.json();
    setResult(data);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Create RCS Content Template
        </Typography>
        <Typography variant="body1" paragraph>
          Enter one or more activities to generate a Twilio RCS content template.
        </Typography>
        {activities.map((activity, idx) => (
          <Box key={idx} sx={{ mb: 3, p: 2, border: "1px solid #eee", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Activity {idx + 1}
            </Typography>
            <TextField
              label="Activity"
              value={activity.Activity}
              onChange={e => handleActivityChange(idx, "Activity", e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Description"
              value={activity.Description}
              onChange={e => handleActivityChange(idx, "Description", e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Media URL"
              value={activity.media_for_rcs}
              onChange={e => handleActivityChange(idx, "media_for_rcs", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="CTA Button 1 Text"
              value={activity["SMS CTA Button 1 Text"]}
              onChange={e => handleActivityChange(idx, "SMS CTA Button 1 Text", e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="CTA Button 2 Text"
              value={activity["SMS CTA Button 2 Text"]}
              onChange={e => handleActivityChange(idx, "SMS CTA Button 2 Text", e.target.value)}
              fullWidth
              margin="normal"
            />
            {activities.length > 1 && (
              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 1 }}
                onClick={() => handleRemoveActivity(idx)}
              >
                Remove Activity
              </Button>
            )}
          </Box>
        ))}
        <Box display="flex" gap={2} mb={2}>
          <Button variant="outlined" onClick={handleAddActivity}>
            Add Another Activity
          </Button>
          <Button variant="contained" onClick={handleGenerate}>
            Generate Content Template
          </Button>
        </Box>
        {result && (
          <Box mt={4}>
            <Typography variant="h6">Generated Content Template:</Typography>
            <Paper sx={{ p: 2, mt: 2, background: "#f9f9f9" }}>
              <pre style={{ margin: 0, fontSize: 14 }}>
                {JSON.stringify(result, null, 2)}
              </pre>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
}