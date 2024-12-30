import React, { useState, useEffect } from "react";
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
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import DropdownMenu from "../../components/dropdownMenu/DropdownMenu";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  deleteTrash,
  fetchTrash,
  restoreFromBin,
} from "../../features/trashSlice";
import { fetchMyProfile } from "../../features/userSlice";
import { fileDownload, fileView } from "../../features/filesSlice";
import SEO from "../../components/SEO/SEO";

const Bin = () => {
  const { type } = useParams();
  const [allData, setAllData] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [sortBy, setSortBy] = useState("size");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState([]);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectFile, setSelectFile] = useState(false);

  const filesPerPage = 10;

  const { loading } = useSelector((state) => state.files);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(
          fetchTrash({ type, sortBy, orderDirection })
        );
        setAllData(response?.payload?.data || []);
        setFilteredFiles(response?.payload?.data || []);
      } catch (error) {
        toast.error(error.message || "Failed to fetch files");
      }
    };
    fetchData();
  }, [type, sortBy, orderDirection, dispatch]);

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
    setSelectedFile(file?.file);
    setViewModalOpen(true);

    const res = await dispatch(fileView(file?.file?.id));
    if (res.payload?.success) {
      toast.success(`${file?.file?.name} opened`);
    }
  };

  const handleDownload = async (file) => {
    try {
      console.log("file", file);

      const response = await fetch(file?.file?.path);
      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file?.file.name;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      const res = await dispatch(fileDownload(file?.file?.id));

      if (res.payload?.success) {
        toast.success(`${file?.file?.name} downloaded successfully`);
      }
    } catch (error) {
      toast.error(`Failed to download ${file?.file?.name}`);
      console.error(error);
    }
  };

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;
    const fileId = fileToDelete.id;

    try {
      const response = await dispatch(deleteTrash(selectedFiles));
      console.log(response);
      if (response.payload?.success) {
        toast.success("File deleted successfully");
        setDeleteModalOpen(false);
        setFileToDelete(null);
        setFilteredFiles((prevFiles) =>
          prevFiles.filter(
            (file) =>
              !selectedFiles.some((selectedFile) => selectedFile === file.id)
          )
        );
        dispatch(fetchMyProfile());
      } else {
        toast.error(response.payload.message);
        console.log(response.payload);
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete file");
    }
  };

  const handleRestoreFile = async (file) => {
    try {
      console.log(file);
      const response = await dispatch(restoreFromBin(file.id));
      if (response.payload?.success) {
        toast.success("File restored successfully");
        setFilteredFiles((prevFiles) =>
          prevFiles.filter((f) => f.id !== file.id)
        );
      } else {
        toast.error(response.payload.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to restore file");
    }
  };

  const dropdownOptions = (file) => [
    { label: "View", onClick: () => handleView(file) },
    { label: "Download", onClick: () => handleDownload(file) },
    { label: "Restore", onClick: () => handleRestoreFile(file) },
    {
      label: "Delete",
      onClick: () => {
        setSelectedFiles((prev) => [...prev, file.id]);
        setDeleteModalOpen(true);
      },
    },
  ];

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

  return (
    <>
      <SEO
        title="Bin - Gofilez"
        description="Manage and restore deleted files from the bin. Secure and free cloud storage solutions."
        keywords="bin, cloud storage, deleted files, secure storage, manage files"
      />
      <Box sx={{ padding: 4 }}>
        <Typography
          className="capitalize"
          variant="h4"
          component="h1"
          sx={{ marginBottom: 2 }}
        >
          {type}
        </Typography>
        <Paper sx={{ padding: 3, marginBottom: 4, boxShadow: 3 }}>
          <Typography variant="h6" sx={{ marginBottom: 1 }}>
            Total Space:
            <Typography variant="body1" component="b" sx={{ marginLeft: 1 }}>
              {allData.reduce((acc, file) => acc + file.file.size, 0) / 1e6} MB
            </Typography>
          </Typography>
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
            {selectFile ? "Deselect " : "Select "}
          </Button>
          {selectFile && (
            <Button
              variant="contained"
              color="error"
              sx={{ marginBottom: 2, marginLeft: "10px" }}
              onClick={() => {
                if (selectedFiles.length > 0) {
                  setDeleteModalOpen(true);
                } else {
                  toast.error("No files selected for deletion");
                }
              }}
            >
              Delete Selected Files
            </Button>
          )}
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
                        {file.file.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {(file.file.size / 1e6).toFixed(2)} MB
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {new Date(file.updatedAt).toLocaleTimeString()},{" "}
                        {new Date(file.updatedAt).toLocaleDateString()}
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
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <Pagination
            count={Math.ceil(filteredFiles.length / filesPerPage)}
            page={page}
            onChange={handlePaginationChange}
            color="primary"
          />
        </Box>
        <Dialog
          open={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        >
          <DialogTitle>Delete File</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              Are you sure you want to delete this file? This action cannot be
              undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteModalOpen(false)} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDeleteFile} color="secondary">
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
    </>
  );
};

export default Bin;
