import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const Video = ({ video }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", marginBottom: 3 }}>
      <Card
        sx={{
          width: "100%", // Make video cover the full width
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Video Section */}
        <Box>
          <video
            style={{
              width: "100%",
              height: "auto",
              aspectRatio: "16/9", // Keeps the aspect ratio of the video
              borderBottom: "1px solid #ccc", // Adds a separation line between the video and content
            }}
            controls
          >
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>

        {/* Title & Description Below Video */}
        <CardContent sx={{ padding: 2 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {video.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {video.description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Video;
