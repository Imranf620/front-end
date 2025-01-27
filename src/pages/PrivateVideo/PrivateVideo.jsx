import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSingleVideo } from "../../features/filesSlice";
import { Box, Typography, CircularProgress } from "@mui/material";
import { io } from "socket.io-client";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import "./PrivateVideo.css";
import VoiceChat from "../../components/voice/Voice";

const socket = import.meta.env.VITE_FRONTEND_API_URL == "http://localhost:3000"
  ? io("http://localhost:4000")
  : io("https://gofilez.com", { path: "/api/socket.io/" });

const PrivateVideo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [video, setVideo] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const { random } = useParams();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const videoRef = useRef(null);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const res = await dispatch(getSingleVideo(random));
        setVideo(res.payload.data);
        if (res.error) {
          setError("Failed to load video.");
        } else {
          setLoading(false);
        }
      } catch (err) {
        setError("An error occurred while fetching the video.");
        setLoading(false);
      }
    };
    getVideo();
  }, [dispatch, random]);

  useEffect(() => {
    const handleVideoStateChange = ({ isPlaying, currentTime , videoId}) => {
      if (!videoRef.current || video.id!=videoId) return;

      if (Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
        videoRef.current.currentTime = currentTime;
      }

      if (isPlaying && videoRef.current.paused) {
        videoRef.current
          .play()
          .catch((error) => console.error("Error playing video:", error));
      } else if (!isPlaying && !videoRef.current.paused) {
        videoRef.current.pause();
      }

      setIsPlaying(isPlaying);
    };

    socket.on("videoState", handleVideoStateChange);

    return () => {
      socket.off("videoState", handleVideoStateChange);
    };
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      if (video.uploadedBy === user?.user?.id) {
        socket.emit("syncTime", video.currentTime);
      }
    };

    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    console.log(video.id)

    if (videoRef.current.paused) {
      videoRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          if (video.uploadedBy === user?.user?.id) {
            socket.emit("togglePlay", {
              state: "play",
              currentTime: videoRef.current.currentTime,
              videoId: video.id,
            });
          }
        })
        .catch((error) => console.error("Error playing video:", error));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      if (video.uploadedBy === user?.user?.id) {
        socket.emit("togglePlay", {
          state: "pause",
          currentTime: videoRef.current.currentTime,
          videoId: video.id,
        });
      }
    }
  };

  const handleSeek = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    if (video.uploadedBy === user?.user?.id) {
      socket.emit("seekVideo", currentTime, video.id);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }
  

  const isInviteValid = video?.invites?.some(
    (invite) => invite.inviteeId === user?.user.id
  );
  const isVideoUploader = video.uploadedBy === user.user.id;
  if(!isVideoUploader && !isInviteValid){
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography variant="h6" color="error">
          You are not authorized to view this video.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        textAlign: "center",
      }}
    >
      {isInviteValid ? (
        <>
          <Typography variant="h4" color="primary">
            Welcome guest
          </Typography>
          <Box mt={2}>
            <video
              className="guest-video"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
              ref={videoRef}
              width="100%"
              height="auto"
              controls
              onSeeked={handleSeek}
            >
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </Box>
        </>
      ) : (
        <div>
          <Typography variant="h4" color="primary">
            Welcome Host
          </Typography>
          <Box sx={{ position: "relative" }} mt={2}>
            <video
              ref={videoRef}
              width="100%"
              height="auto"
              controls
              onSeeked={handleSeek}
            >
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <Box
              sx={{
                position: "absolute",
                backgroundColor: "transparent",
                cursor: "pointer",
                top: 0,
                left: 0,
                width: "100%",
                height: "90%",
              }}
              onClick={togglePlay}
            >
              <Box sx={{ position: "relative" }}>
                <Box sx={{ position: "absolute" }}>
                  {isPlaying ? (
                    <PauseCircleOutlineIcon sx={{ color: "white" }} />
                  ) : (
                    <PlayArrowIcon sx={{ color: "white" }} />
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </div>
      ) }

      <VoiceChat video={video}/>
    </Box>
  );
};

export default PrivateVideo;
