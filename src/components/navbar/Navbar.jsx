import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { Brightness4, Brightness7, CloudUpload } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile, logout } from "../../features/userSlice";
import { uploadFile } from "../../features/filesSlice";
import { reFetchContext } from "../../context/ReFetchContext";

import axios from "axios";

const Navbar = ({ toggleDarkMode, isDarkMode, handleToggle }) => {
  const { loading, user } = useSelector((state) => state.auth);
  const [uploadProgress, setUploadProgress] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const { handleRefetch } = useContext(reFetchContext);
  const navigate = useNavigate();
  const baseApi = import.meta.env.VITE_API_URL;
  const [isUploading, setIsUploading] = useState(false);

  const handleMenuClick = useCallback((event) => {
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
  }, []);

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    try {
      const result = await dispatch(logout());
      if (result.payload.success === true) {
        navigate("/");
      }
      toast.success(result.payload.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles([...files]);
    setOpenDialog(true);
  };

  const handleConfirmUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No files selected!");
      return;
    }

    setUploadProgress(Array(selectedFiles.length).fill(0));
    setIsUploading(true);
    
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        // Step 1: Get presigned URL from backend
        const response = await axios.post(
          `${baseApi}/pre-ass-url`,
          {
            fileName: file.name,
            fileType: file.type,
          },
          { withCredentials: true }
        );

        const { url, downloadUrl, publicUrl } = response.data;

        // Step 2: Upload file
        const uploadResponse = await axios.put(url, file, {
          headers: {
            "Content-Type": file.type,
          },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress((prevProgress) => {
              const newProgress = [...prevProgress];
              newProgress[i] = percent;
              return newProgress;
            });
          },
        });

        // Step 3: Upload file info to backend
        const result = await dispatch(
          uploadFile({
            name: file.name,
            size: file.size,
            type: file.type,
            path: publicUrl,
          })
        );

        if (result.payload?.success) {
          toast.success(result.payload.message);
          handleRefetch();
          dispatch(fetchMyProfile());
        } else {
          toast.error(result.payload.message);
        }
      }
    } catch (error) {
      toast.error("Error uploading file(s): " + error.message);
    } finally {
      setUploadProgress([]);
      setIsUploading(false);
      setOpenDialog(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFiles([]);
    setOpenDialog(false);
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleProfileClick = () => {
    navigate(`/profile`);
  };

  const handlePackageClick = () => {
    navigate(`/packages`);
  };

  return (
    <AppBar position="sticky" color="secondary">
      <Toolbar className="flex justify-between items-center">
        <Typography variant="h6">Gofilez</Typography>

        <div className="flex items-center gap-1 md:gap-4">
          {!isUploading && user?.user?.role === "USER" && (
            <Tooltip title="Upload Files">
              <Button
                variant="contained"
                color="secondary"
                startIcon={<CloudUpload />}
                component="label"
              >
                Upload
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  multiple
                />
              </Button>
            </Tooltip>
          )}

          {isUploading && (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <CircularProgress size={20} color="primary" />
              <Typography variant="subtitle1" style={{ color: "#fff" }}>
                Uploading... {Math.max(...uploadProgress)}%
              </Typography>
            </div>
          )}

          <Tooltip title="User Profile">
            <IconButton onClick={handleMenuClick} color="inherit">
              <Avatar alt="User" src={user?.user?.image} />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            PaperProps={{
              style: {
                backgroundColor: isDarkMode ? "#424242" : "#9C27B0",
                color: "#ffffff",
              },
            }}
          >
            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
            <MenuItem onClick={handlePackageClick}>Subscriptions</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>

          <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"}>
            <>
              <IconButton onClick={toggleDarkMode} color="inherit">
                {isDarkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <div className="lg:hidden">
                <MenuIcon onClick={handleToggle} />
              </div>
            </>
          </Tooltip>
        </div>
      </Toolbar>

      <Dialog open={openDialog && !isUploading} onClose={handleCancelUpload}>
        <DialogTitle>Confirm File Upload</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to upload the selected files?
          </Typography>
          <ul>
            {selectedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelUpload} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmUpload} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default React.memo(Navbar);
