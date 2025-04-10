"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Button,
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React from "react";
import ReactJson from "react-json-view";

const isMarkdown = (text) => {
  // Check for common Markdown markers such as headers (#), emphasis (*, _), code (```) or links ([...](...))
  return /(\n\s*#|\*\*|\*|__|_|`)/.test(text);
};

const customListItem = function CustomListItem({ node, ...props }) {
  // Convert children to a single string to examine text.
  // Note: This simple approach might need to be adjusted for more complex children.
  const textContent = React.Children.toArray(props.children)
    .map((child) => (typeof child === "string" ? child : ""))
    .join("");

  console.log("Custom List Item Text Content:", textContent);
  // For example, if the text starts with ** and includes *Title:* then we treat it as a header.
  if (/^\s*\*\*.*?\*\*/.test(textContent)) {
    console.log("Rendering as header");
    return (
      <Typography variant="h6" gutterBottom>
        {props.children}
      </Typography>
    );
  } else {
    console.log("Rendering as list item");
    return (
      <ListItem {...props}>
        <ListItemText sx={{}} primary={props.children} />
      </ListItem>
    );
  }

  return <li {...props} />;
};

export default function OperatorResults() {
  const [operatorResults, setOperatorResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const transcriptSid = searchParams.get("transcriptSid");

  useEffect(() => {
    const fetchOperatorResults = async () => {
      try {
        console.log(
          "Fetching operator results for transcript SID:",
          transcriptSid
        );
        const response = await fetch(
          `/api/voiceIntelligenceDemo/operator_results/${transcriptSid}`
        );
        if (!response.ok) {
          setIsLoading(false);
          setOperatorResults({ error: "Failed to fetch operator results" });
          return;
        }
        const data = await response.json();
        setOperatorResults(data);
        setIsLoading(false);
        console.log("Operator results:", data);
      } catch (error) {
        console.error("Error fetching operator results:", error);
        setIsLoading(false);
      }
    };

    if (transcriptSid) {
      fetchOperatorResults();
    } else {
      router.push("/");
    }
  }, [transcriptSid, router]);

  const renderJsonResults = (jsonResults, parentIndex) => {
    return (
      <Paper
        elevation={3}
        style={{ padding: "16px", marginTop: "16px" }}
        key={`json-results-${parentIndex}`}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          JSON Results
        </Typography>
        <ReactJson
          src={jsonResults}
          theme="monokai" // you can choose from available themes
          collapsed={false} // set to true to collapse nested objects by default
          enableClipboard={true} // optional: lets users copy JSON values
          displayDataTypes={false} // optional: hide data types
        />
        {/* <List>
          {Object.entries(jsonResults).map(([key, value], index) => (
            <ListItem key={`${key}-${index}`}>
              <ListItemText
                primary={key}
                secondary={
                  typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value)
                }
              />
            </ListItem>
          ))}
        </List> */}
      </Paper>
    );
  };

  const renderTextGenerationResults = (textGenerationResults, parentIndex) => {
    return (
      <Paper
        elevation={3}
        style={{ padding: "16px", marginTop: "16px" }}
        key={`text-generation-results-${parentIndex}`}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Text Generation Results
          </Typography>
          {textGenerationResults.format === "text" &&
            (isMarkdown(textGenerationResults.result) ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Standard mappings for headings
                  h1: ({ node, children, ...props }) => (
                    <Typography variant="h4" gutterBottom {...props}>
                      {children}
                    </Typography>
                  ),
                  h2: ({ node, children, ...props }) => (
                    <Typography variant="h5" gutterBottom {...props}>
                      {children}
                    </Typography>
                  ),
                  h3: ({ node, children, ...props }) => (
                    <Typography variant="h6" gutterBottom {...props}>
                      {children}
                    </Typography>
                  ),
                  p: ({ node, children, ...props }) => (
                    <Typography variant="body1" paragraph {...props}>
                      {children}
                    </Typography>
                  ),
                  // Override list items using our custom component:
                  li: customListItem,
                }}
              >
                {textGenerationResults.result}
              </ReactMarkdown>
            ) : (
              <Typography variant="body1">
                {textGenerationResults.result}
              </Typography>
            ))}
        </Box>
      </Paper>
    );
  };

  const renderExtractResults = (extractResults, parentIndex) => {
    return (
      <Paper
        elevation={3}
        style={{ padding: "16px", marginTop: "16px" }}
        key={`extract-results-${parentIndex}`}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Extract Results
        </Typography>
        <List>
          {Object.entries(extractResults).map(([key, value], index) => (
            <ListItem key={`${key}-${index}`}>
              <ListItemText
                primary={key}
                secondary={
                  typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value)
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  };

  const renderExtractMatch = (extractMatch, parentIndex) => {
    return (
      <Paper
        elevation={3}
        style={{ padding: "16px", marginTop: "16px" }}
        key={`extract-match-${parentIndex}`}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Extract Match
        </Typography>
        <Typography variant="body1">{String(extractMatch)}</Typography>
      </Paper>
    );
  };

  const renderConversationClassifyResults = (
    predictedLabel,
    predictedProbability,
    parentIndex
  ) => {
    return (
      <Paper
        elevation={3}
        style={{ padding: "16px", marginTop: "16px" }}
        key={`conversation-classify-results-${parentIndex}`}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Conversation Classify Results
        </Typography>
        <Typography variant="body1">
          Predicted Label: {predictedLabel}
        </Typography>
        <Typography variant="body1">
          Predicted Probability: {predictedProbability}
        </Typography>
      </Paper>
    );
  };

  const renderOperatorResults = (results) => {
    return results.map((result, index) => (
      <Box key={`operator-result-${index}`} mt={4}>
        <Typography variant="h5" component="h3" gutterBottom>
          {result.name}
        </Typography>
        {result.operator_type === "json" &&
          result.json_results &&
          renderJsonResults(result.json_results, index)}
        {result.operator_type === "text-generation" &&
          result.text_generation_results &&
          renderTextGenerationResults(result.text_generation_results, index)}
        {result.operator_type === "extract" &&
          result.extract_match != null &&
          renderExtractMatch(result.extract_match, index)}
        {result.operator_type === "extract" &&
          result.extract_results &&
          Object.keys(result.extract_results).length > 0 &&
          renderExtractResults(result.extract_results, index)}
        {result.operator_type === "conversation-classify" &&
          result.predicted_label &&
          result.predicted_probability != null &&
          renderConversationClassifyResults(
            result.predicted_label,
            result.predicted_probability,
            index
          )}
      </Box>
    ));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Operator Results
      </Typography>
      <Box mt={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.back()}
        >
          Back
        </Button>
      </Box>
      {isLoading ? (
        <Typography variant="h6" color="textSecondary">
          Loading...
        </Typography>
      ) : (
        <Box mt={4}>
          {operatorResults && operatorResults.error ? (
            <Typography variant="h6" color="error">
              {operatorResults.error}
            </Typography>
          ) : (
            operatorResults &&
            operatorResults.operator_results &&
            renderOperatorResults(operatorResults.operator_results)
          )}
        </Box>
      )}
    </Container>
  );
}
