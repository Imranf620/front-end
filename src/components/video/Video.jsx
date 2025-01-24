import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  CircularProgress,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { deleteMyVideo } from "../../features/filesSlice";

const Video = ({ video }) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleMenuOpen = (event) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const share = () => {
    try {
      const videoLink = `${window.location.origin}${window.location.pathname}/${video.random}`;
      navigator.clipboard.writeText(videoLink);
      toast.success("Video link copied successfully");
      handleMenuClose();
    } catch (error) {
      toast.error("Error sharing video");
    }
  };

  const deleteVideo = async () => {
    setDeleting(true);
    const res = await dispatch(deleteMyVideo(video.id));
    if (res.payload.success) {
      toast.success("Video deleted successfully");
    } else {
      toast.error(res.payload.message);
    }
    setDeleting(false);
    handleMenuClose();
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 3, width: "100%" }}>
      <Card
        sx={{
          width: "90%",
          maxWidth: "900px",
          boxShadow: 4,
          borderRadius: 3,
          overflow: "hidden",
          textAlign: "left",
          bgcolor: "white",
          padding: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "500px",
            borderRadius: "10px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <video
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "10px",
            }}
            controls
          >
            <source src={video.url} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </Box>

        <CardContent sx={{ padding: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" fontWeight="bold">
              {video.name}
            </Typography>

            <IconButton onClick={handleMenuOpen}>
              <MoreVertIcon />
            </IconButton>

            <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
              <MenuItem onClick={share}>Share</MenuItem>
              {user.user.id === video.uploadedBy && (
                <MenuItem onClick={deleteVideo} sx={{ color: "red" }} disabled={deleting}>
                  {deleting ? <CircularProgress size={20} /> : "Delete"}
                </MenuItem>
              )}
            </Menu>
          </Box>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            {video.description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Video;
