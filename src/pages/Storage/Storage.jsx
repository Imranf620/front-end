import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Pagination,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import DropdownMenu from "../../components/dropdownMenu/DropdownMenu";
import { useDispatch, useSelector } from "react-redux";
import {
  editFileName,
  fetchFiles,
  deleteFile,
  shareFile,
  fileDownload,
  fileView,
} from "../../features/filesSlice"; // Import the deleteFile action
import { toast } from "react-toastify";
import { reFetchContext } from "../../context/ReFetchContext";
import { useTheme } from "../../context/ThemeContext";

const Storage = () => {
  const { type } = useParams();
  const { isDarkMode } = useTheme();

  const [allData, setAllData] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [sortBy, setSortBy] = useState("size");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [page, setPage] = useState(1);

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameFileData, setRenameFileData] = useState(null);
  const [newName, setNewName] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); 
  const [fileToDelete, setFileToDelete] = useState(null); 
  const { refetch, handleRefetch } = useContext(reFetchContext);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareOption, setShareOption] = useState("public");
  const [emailListArray, setEmailListArray] = useState([""]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const FRONT_END_URL = import.meta.env.VITE_FRONTEND_API_URL;

  const filesPerPage = 10;

  const { loading } = useSelector((state) => state.files);
  const dispatch = useDispatch();

  // Fetch Files
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          fetchFiles({ type, sortBy, orderDirection })
        );
        setAllData(response?.payload?.data || []);
        setFilteredFiles(response?.payload?.data || []);
      } catch (error) {
        toast.error(error.message || "Failed to fetch files");
      }
    };
    fetchData();
  }, [type, sortBy, orderDirection, dispatch, refetch]);

  // Handle Sorting Changes
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleOrderDirectionChange = (event) => {
    setOrderDirection(event.target.value);
  };

  const handlePaginationChange = (event, value) => {
    setPage(value);
  };

  const paginatedFiles = filteredFiles.slice(
    (page - 1) * filesPerPage,
    page * filesPerPage
  );
  const handleView = async (file) => {
    setSelectedFile(file);
    setViewModalOpen(true);

    const res = await dispatch(fileView(file.id))
    if (res.payload?.success) {
      toast.success(`${file.name} opened`);
    }

  };

  const handleDownload = async (file) => {
    try {
      // Fetch the file data (this assumes file.path is a URL to the file)
      const response = await fetch(file.path);
      const blob = await response.blob(); // Convert the response to a Blob

      // Create an object URL for the Blob
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name; // Set the file name for the download
      document.body.appendChild(link);

      // Trigger the download
      link.click();

      // Clean up by removing the link and revoking the object URL
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      const res = await dispatch(fileDownload(file.id))

      if (res.payload?.success) {
        toast.success(`${file.name} downloaded successfully`);
      }

      // Success message
    } catch (error) {
      toast.error(`Failed to download ${file.name}`);
      console.error(error);
    }
  };

  

  const handleShare = async (file) => {
    setSelectedFile(file);
    setShareModalOpen(true);
    if (file.fileShares && file.fileShares.length > 0) {
      setEmailListArray(file.fileShares.map((share) => share.email));
    } else {
      setEmailListArray([""]);
    }
  };

  const handleShareFile = async () => {
    const validEmails = emailListArray.filter((email) =>
      validateEmail(email.trim())
    );

    if (shareOption === "shared" && validEmails.length === 0) {
      toast.error("Please enter at least one valid email.");
      return;
    }
    

    const shareData = {
      fileId: selectedFile.id,
      visibility:
        shareOption === "public"
          ? "PUBLIC"
          : shareOption === "shared"
          ? "SHARED"
          : "PRIVATE", // New case for private visibility
      emails: shareOption === "shared" ? validEmails : [],
    };

    try {
      const result = await dispatch(shareFile(shareData));

      
      if (result?.payload?.success) {
        toast.success(
          shareOption === "public"
            ? "File shared publicly!"
            : shareOption === "shared"
            ? "File shared with specific users!"
            : "File set to private!"
        );

        if(shareOption === "public"){
          const shareUrl = `${FRONT_END_URL}/dashboard/shared/${shareData.fileId}`;
          navigator.clipboard.writeText(shareUrl);
          toast.success("File link copied to clipboard!");
        }
      
          
      } else {
        toast.error("Failed to share file");
      }
    } catch (error) {
      toast.error("Failed to share file");
    } finally {
      setShareModalOpen(false);
    }
  };

  const handleOpenRenameModal = (file) => {
    setRenameFileData(file);
    const nameWithoutExtension = file.name.substring(
      0,
      file.name.lastIndexOf(".")
    ); 
    const extension = file.name.substring(file.name.lastIndexOf("."));
    setNewName(nameWithoutExtension); 
    setRenameModalOpen(true);
  };
  const handleCloseRenameModal = () => {
    setRenameModalOpen(false);
    setRenameFileData(null);
    setNewName("");
  };

  const handleRenameFile = async () => {
    if (!newName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    const fileExtension = renameFileData.name.substring(
      renameFileData.name.lastIndexOf(".")
    );
    const newFileName = `${newName}${fileExtension}`;

    try {
      const response = await dispatch(
        editFileName({ fileId: renameFileData.id, newName: newFileName })
      );
      if (response.payload?.success) {
        toast.success("File renamed successfully");
        handleRefetch();
        handleCloseRenameModal();
      } else {
        toast.error(response.payload.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to rename file");
    }
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;
    const fileId = fileToDelete.id;

    try {
      const response = await dispatch(deleteFile(fileId));
      if (response.payload?.success) {
        toast.success("File deleted successfully");
        setDeleteModalOpen(false);
        setFileToDelete(null);

        // Filter out the deleted file from the filteredFiles array
        setFilteredFiles((prevFiles) =>
          prevFiles.filter((file) => file.id !== fileId)
        );
      } else {
        toast.error(response.payload.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete file");
    }
  };

  const dropdownOptions = (file) => [
    { label: "View", onClick: () => handleView(file) },
    { label: "Download", onClick: () => handleDownload(file) },
    { label: "Share", onClick: () => handleShare(file) },
    { label: "Rename", onClick: () => handleOpenRenameModal(file) },
    {
      label: "Delete",
      onClick: () => {
        setFileToDelete(file);
        setDeleteModalOpen(true);
      },
    }, // Add Delete option
  ];

  const handleAddEmail = () => {
    setEmailListArray([...emailListArray, ""]);
  };
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const handleRemoveEmail = (index) => {
    const newEmailList = emailListArray.filter((_, i) => i !== index);
    setEmailListArray(newEmailList);
  };

  return (
    <Box sx={{ padding: 4 }}>
      {/* Heading */}
      <Typography
        className="capitalize"
        variant="h4"
        component="h1"
        sx={{ marginBottom: 2 }}
      >
        {type}
      </Typography>

      {/* Total Space */}
      <Paper sx={{ padding: 3, marginBottom: 4, boxShadow: 3 }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Total Space:
          <Typography variant="body1" component="b" sx={{ marginLeft: 1 }}>
            {allData.reduce((acc, file) => acc + file.size, 0) / 1e6} MB
          </Typography>
        </Typography>

        {/* Sort By Selector */}
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography variant="body1">Sort by:</Typography>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortChange}
                label="Sort By"
              >
                <MenuItem value="size">Size</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel>Order</InputLabel>
              <Select
                value={orderDirection}
                onChange={handleOrderDirectionChange}
                label="Order"
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Files Section */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Files:
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
      ) : filteredFiles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedFiles.map((file) => (
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
                "&:hover": {
                  boxShadow: 6,
                },
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
                      {new Date(file.updatedAt).toLocaleTimeString()},{" "}
                      {new Date(file.updatedAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                     Total Downloads: {file.totalDownloads}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                     Total Views: {file.totalViews}
                    </Typography>
                  </Box>
                </Box>
                <DropdownMenu options={dropdownOptions(file)} />
              </Box>
            </Paper>
          ))}
        </div>
      ) : (
        <Typography variant="body1" color="textSecondary">
          No files available.
        </Typography>
      )}

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <Pagination
          count={Math.ceil(filteredFiles.length / filesPerPage)}
          page={page}
          onChange={handlePaginationChange}
          color="primary"
        />
      </Box>

      {/* Rename Modal */}
      <Dialog open={renameModalOpen} onClose={handleCloseRenameModal}>
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            label="New File Name"
            sx={{
              marginBottom: 2,
              marginTop: 2,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRenameModal} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRenameFile} color="primary">
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this file? This action cannot be
            undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteFile} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={shareModalOpen} onClose={() => setShareModalOpen(false)}>
        <DialogTitle>Share File</DialogTitle>
        <DialogContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Visibility</label>
              <select
                value={shareOption}
                onChange={(e) => setShareOption(e.target.value)}
                className={`w-full px-3 py-2 border outline-none rounded-md ${
                  isDarkMode ? "bg-[#333] text-white" : "bg-white text-black"
                }`}
              >
                <option value="public">Public</option>
                <option value="shared">Shared with Specific Users</option>
                <option value="private">Private</option>
              </select>
            </div>
            {shareOption === "shared" && (
              <div>
                <label className="text-sm font-medium">Emails</label>
                {emailListArray.map((email, index) => (
                  <div key={index} className="flex gap-2 py-2 items-center">
                    <TextField
                      label="Email"
                      variant="outlined"
                      size="small"
                      value={email}
                      onChange={(e) => {
                        const newEmails = [...emailListArray];
                        newEmails[index] = e.target.value;
                        setEmailListArray(newEmails);
                      }}
                      sx={{ backgroundColor: isDarkMode ? "#444" : "#fff" }}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(index)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddEmail}
                  className="text-blue-500"
                >
                  Add Email
                </button>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleShareFile} color="primary">
            Share
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="md">
  <DialogTitle>View File</DialogTitle>
  <DialogContent>
    {selectedFile ? (
      selectedFile.type.startsWith("image") ? (
        <img
          src={selectedFile.path}
          alt="file"
          style={{ width: "100%", height: "auto" }}
        />
      ) : selectedFile.type === "application/pdf" ? (
        <embed
          src={selectedFile.path}
          width="100%"
          height="500px"
          type="application/pdf"
        />
      ) : selectedFile.type.startsWith("video") ? (
        <video
          controls
          style={{ width: "100%", height: "auto" }}
        >
          <source src={selectedFile.path} type={selectedFile.type} />
          Your browser does not support the video tag.
        </video>
      ) : (
        <Typography variant="body2" color="textSecondary">
          Cannot preview this file type.
        </Typography>
      )
    ) : (
      <CircularProgress />
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setViewModalOpen(false)} color="secondary">
      Close
    </Button>
  </DialogActions>
</Dialog>

    </Box>
  );
};

export default Storage;
