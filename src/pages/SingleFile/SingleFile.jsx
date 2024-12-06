import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import DropdownMenu from "../../components/dropdownMenu/DropdownMenu";
import { useDispatch, useSelector } from "react-redux";
import { getSingleFile } from "../../features/filesSlice";
import { toast } from "react-toastify";
import { useTheme } from "../../context/ThemeContext";
import { useParams } from "react-router-dom";

const SingleFile = () => {
  const { isDarkMode } = useTheme();
  const { id } = useParams(); 
  const dispatch = useDispatch();

  const { loading } = useSelector((state) => state.files);
  const [file, setFile] = useState(null);

  // Fetch the single file by ID
  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await dispatch(getSingleFile(id));

        console.log(response)
        setFile(response?.payload?.data || null);
      } catch (error) {
        toast.error(error.message || "Failed to fetch the file");
      }
    };
    fetchFile();
  }, [id, dispatch]);

  // Handle file actions
  const handleView = () => {
    if (file) {
      const fileUrl = `${import.meta.env.VITE_API_URL}/../../${file.path}`;
      window.open(fileUrl, "_blank");
    }
  };

  const handleDownload = () => {
    if (file) {
      const fileUrl = `${import.meta.env.VITE_API_URL}/../../${file.path}`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${file.name} downloaded successfully`);
    }
  };

  const dropdownOptions = [
    { label: "View", onClick: handleView },
    { label: "Download", onClick: handleDownload },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" component="h1" sx={{ marginBottom: 2 }}>
        File Details
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
          }}
        >
          <CircularProgress />
        </Box>
      ) : file ? (
        <Paper
          sx={{
            padding: 3,
            marginBottom: 2,
            boxShadow: 2,
            borderRadius: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            transition: "0.3s ease",
            "&:hover": { boxShadow: 6 },
          }}
          key={file.id}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "#ff2424",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                <ArticleIcon sx={{ color: "white", fontSize: 30 }} />
              </div>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {file.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {(file.size / 1e6).toFixed(2)} MB
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(file.updatedAt).toLocaleDateString()}{" "}
                  {new Date(file.updatedAt).toLocaleTimeString()}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Shared by: {file.user?.name || "Unknown"}
                </Typography>
              </Box>
            </Box>
            <DropdownMenu options={dropdownOptions} />
          </Box>
        </Paper>
      ) : (
        <Typography variant="body1" color="textSecondary">
          File not found or unavailable.
        </Typography>
      )}
    </Box>
  );
};

export default SingleFile;
