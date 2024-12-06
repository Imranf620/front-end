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
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import DropdownMenu from "../../components/dropdownMenu/DropdownMenu";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteTrash, fetchTrash, restoreFromBin } from "../../features/trashSlice";
import { fetchMyProfile } from "../../features/userSlice";

const Bin = () => {
  const { type } = useParams();
  const [allData, setAllData] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [sortBy, setSortBy] = useState("size");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);


  const filesPerPage = 10;

  const { loading } = useSelector((state) => state.files);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(fetchTrash({ type, sortBy, orderDirection }));
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

  const paginatedFiles = filteredFiles.slice((page - 1) * filesPerPage, page * filesPerPage);

  const handleView = (file) => {
    const fileUrl = `${import.meta.env.VITE_API_URL}/../../${file.path}`;
    window.open(fileUrl, "_blank");
  };

  const handleDownload = (file) => {
    const fileUrl = `${import.meta.env.VITE_API_URL}/../../${file.path}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`${file.name} downloaded successfully`);
  };

  

  const handleDeleteFile = async () => {
    if (!fileToDelete) return;
    const fileId = fileToDelete.id;

    try {
      const response = await dispatch(deleteTrash(fileId));
      if (response.payload?.success) {
        toast.success("File deleted successfully");
        setDeleteModalOpen(false);
        setFileToDelete(null);
        setFilteredFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
        dispatch(fetchMyProfile())

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
        console.log(file)
      const response = await dispatch(restoreFromBin(file.id));
      if (response.payload?.success) {
        toast.success("File restored successfully");
        setFilteredFiles((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
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
    { label: "Delete", onClick: () => { setFileToDelete(file); setDeleteModalOpen(true); } },
  ];

  return (
    <Box sx={{ padding: 4 }}>
      <Typography className="capitalize" variant="h4" component="h1" sx={{ marginBottom: 2 }}>
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
              <Select value={sortBy} onChange={handleSortChange} label="Sort By">
                <MenuItem value="size">Size</MenuItem>
                <MenuItem value="date">Date</MenuItem>
                <MenuItem value="name">Name</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
              <InputLabel>Order</InputLabel>
              <Select value={orderDirection} onChange={handleOrderDirectionChange} label="Order">
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
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
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
                      {file.file.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {(file.file.size / 1e6).toFixed(2)} MB
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(file.updatedAt).toLocaleTimeString()}, {new Date(file.updatedAt).toLocaleDateString()}
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
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this file? This action cannot be undone.
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
    </Box>
  );
};

export default Bin;
