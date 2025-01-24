import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getSingleVideo } from "../../features/filesSlice";
import { Box, Typography, CircularProgress } from "@mui/material";

const SingleVideo = ({ random, fetchAllRelaltedVideos }) => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const getVideo = async () => {
      const res = await dispatch(getSingleVideo(random));
      setVideo(res.payload.data);
      fetchAllRelaltedVideos(res.payload.data.category);
      setLoading(false);
    };
    getVideo();
  }, [dispatch, random]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#121212",
        paddingY: 4,
        minHeight: "100vh",
      }}
    >
      {/* Main Video Display */}
      <Box
        sx={{
          width: "90%",
          maxWidth: "1100px",
          boxShadow: 4,
          borderRadius: 3,
          overflow: "hidden",
          textAlign: "left",
          backgroundColor: "#181818",
          padding: 2,
        }}
      >
        <video
          style={{
            width: "100%",
            height: "550px",
            borderRadius: "10px",
            objectFit: "cover",
          }}
          controls
          autoPlay
          muted
          loop
        >
          <source src={video?.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <Typography variant="h5" fontWeight="bold" sx={{ marginTop: 2, color: "#fff" }}>
          {video?.name}
        </Typography>
        <Typography variant="body1" color="#b3b3b3">
          {video?.description}
        </Typography>
      </Box>

      {/* Related Videos Section */}
      <Box sx={{ width: "90%", maxWidth: "1100px", marginTop: 4 }}>
        <Typography variant="h6" fontWeight="bold" color="#fff">
          Related Videos
        </Typography>
       
      </Box>
    </Box>
  );
};

export default SingleVideo;
