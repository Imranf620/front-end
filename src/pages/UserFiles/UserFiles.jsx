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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import DropdownMenu from "../../components/dropdownMenu/DropdownMenu";
import { useDispatch, useSelector } from "react-redux";
import {
  editFileName,
  fetchFiles,
  deleteFile,
  fileDownload,
  fileView,
} from "../../features/filesSlice";
import { toast } from "react-toastify";
import { reFetchContext } from "../../context/ReFetchContext";
import { useTheme } from "../../context/ThemeContext";
import { adminFileDelete, getUserFiles } from "../../features/adminSlice";

const UserFiles = () => {
  const { userId } = useParams();
  const { isDarkMode } = useTheme();

  const [allData, setAllData] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [sortBy, setSortBy] = useState("size");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameFileData, setRenameFileData] = useState(null);
  const [newName, setNewName] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectFile, setSelectFile] = useState(false);

  const { refetch, handleRefetch } = useContext(reFetchContext);

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.files);

  const filesPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          getUserFiles({ userId, sortBy, orderDirection })
        );
        console.log(response.payload.data);
        setAllData(response?.payload?.data || []);
        setFilteredFiles(response?.payload?.data || []);
      } catch (error) {
        toast.error(error.message || "Failed to fetch files");
      }
    };
    fetchData();
  }, [sortBy, orderDirection, dispatch, refetch]);

  const dropdownOptions = (file) => [
    { label: "View", onClick: () => handleView(file) },
    { label: "Download", onClick: () => handleDownload(file) },
    { label: "Rename", onClick: () => handleOpenRenameModal(file) },
    {
      label: "Delete",
      onClick: () => {
        setSelectedFiles((prev) => {
          if (!prev.some((existingFile) => existingFile === file.id)) {
            return [...prev, file.id];
          }
          return prev;
        });
        setDeleteModalOpen(true);
      },
    }, // Add Delete option
  ];

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

  const handleCloseRenameModal = () => {
    setRenameModalOpen(false);
    setRenameFileData(null);
    setNewName("");
  };

  const handleView = async (file) => {
    setSelectedFile(file);
    setViewModalOpen(true);
    console.log(file);

    const res = await dispatch(fileView(file.id));
    if (res.payload?.success) {
      toast.success(`${file.name} opened`);
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
  const handleDownload = async (file) => {
    try {
      const response = await fetch(file.path);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      const res = await dispatch(fileDownload(file.id));
      if (res.payload?.success) {
        toast.success(`${file.name} downloaded successfully`);
      }
    } catch (error) {
      toast.error(`Failed to download ${file.name}`);
    }
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
        setRenameModalOpen(false);
      }
    } catch (error) {
      toast.error(error.message || "Failed to rename file");
    }
  };
  const handleFileSelect = (fileId) => {
    setSelectedFiles((prevSelectedFiles) => {
      if (prevSelectedFiles.includes(fileId)) {
        return prevSelectedFiles.filter((id) => id !== fileId);
      } else {
        return [...prevSelectedFiles, fileId];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectFile(true);
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map((file) => file.id));
    }
  };
  const handleDeleteFiles = async () => {
    try {
      const response = await dispatch(adminFileDelete(selectedFiles));
      if (response.payload?.success) {
        toast.success("Files deleted successfully");
        setFilteredFiles((prev) =>
          prev.filter((file) => !selectedFiles.includes(file.id))
        );
        setDeleteModalOpen(false);
        setSelectedFiles([]);
      } else {
        toast.error(response.payload?.message || "Failed to delete files");
      }
    } catch (error) {
      toast.error("Failed to delete files");
    }
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
        Files
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
      <div>
        <Button
          variant="outlined"
          onClick={handleSelectAll}
          sx={{ marginBottom: 2 }}
        >
          {selectedFiles.length === filteredFiles.length
            ? "Deselect All"
            : "Select All"}
        </Button>
        <Button
          variant="outlined"
          sx={{ marginBottom: 2, marginLeft: "10px" }}
          onClick={() => {
            setSelectFile(!selectFile);
            setSelectedFiles([]);
          }}
        >
          {selectFile ? "Deselect" : "Select"}
        </Button>
       { selectFile &&  <Button
          variant="contained"
          color="error"
          sx={{ marginBottom: 2, marginLeft: "10px" }}
          disabled={selectedFiles.length === 0}
          onClick={() => setDeleteModalOpen(true)}
        >
          Delete Selected
        </Button>}
      </div>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ">
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
                position: "relative",
                "&:hover": {
                  boxShadow: 6,
                },
              }}
              key={file.id}
            >
              {selectFile && (
                <FormControlLabel
                  sx={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    cursor: "pointer",
                    zIndex: "100",
                  }}
                  control={
                    <Checkbox
                      checked={selectedFiles.includes(file.id)}
                      onChange={() => handleFileSelect(file.id)}
                      sx={{
                        color: "primary.main",

                        "&.Mui-checked": {
                          color: "primary.main",
                        },
                      }}
                    />
                  }
                  label=""
                />
              )}
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
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        width: "144px",
                        textOverflow: "ellipsis",
                        whiteSpace: "wrap",
                        overflow: "hidden",
                      }}
                    >
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
                    <Typography variant="body2" color="textSecondary">
                      user: {file?.user?.email}
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
        <DialogTitle>Delete Files</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete these files? This action cannot be
            undone.
          </Typography>
          <ul>
            {selectedFiles.map((fileId) => {
              const file = filteredFiles.find((f) => f.id === fileId);
              return <li key={fileId}>{file?.name}</li>;
            })}
          </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteFiles} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        maxWidth="md"
      >
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
              <video controls style={{ width: "100%", height: "auto" }}>
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

export default UserFiles;
