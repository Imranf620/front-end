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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import DropdownMenu from "../../components/dropdownMenu/DropdownMenu";
import { useDispatch, useSelector } from "react-redux";
import { fileDownload, fileView, getAllAccessibleFiles } from "../../features/filesSlice";
import { toast } from "react-toastify";
import { reFetchContext } from "../../context/ReFetchContext";
import { useTheme } from "../../context/ThemeContext";

const Shared = () => {
  const { type } = useParams();
  const { isDarkMode } = useTheme();

  const [allData, setAllData] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [sortBy, setSortBy] = useState("size");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [page, setPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const { refetch } = useContext(reFetchContext);

  const filesPerPage = 10;

  const { loading } = useSelector((state) => state.files);
  const dispatch = useDispatch();

  // Fetch Files
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(getAllAccessibleFiles());
        setAllData(response?.payload?.data || []);
        setFilteredFiles(response?.payload?.data || []);
      } catch (error) {
        toast.error(error.message || "Failed to fetch files");
      }
    };
    fetchData();
  }, [type, dispatch, refetch]);

  // Handle Sorting Changes
  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleOrderDirectionChange = (event) => {
    setOrderDirection(event.target.value);
  };

  // Sort Files
  useEffect(() => {
    const sortedFiles = [...allData].sort((a, b) => {
      let valueA, valueB;
      if (sortBy === "size") {
        valueA = a.size;
        valueB = b.size;
      } else if (sortBy === "date") {
        valueA = new Date(a.updatedAt);
        valueB = new Date(b.updatedAt);
      } else if (sortBy === "name") {
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
      }
      if (orderDirection === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
    setFilteredFiles(sortedFiles);
  }, [sortBy, orderDirection, allData]);

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
    

    const res = await dispatch(fileView(file?.id));
    if (res.payload?.success) {
      toast.success(`${file?.name} opened`);
    }
  };


  const handleDownload = async (file) => {
    try {
      console.log("file", file)

      const response = await fetch(file?.path);
      const blob = await response.blob(); 

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = file?.name; 
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      const res = await dispatch(fileDownload(file?.id));

      if (res.payload?.success) {
        toast.success(`${file.name} downloaded successfully`);
      }

    } catch (error) {
      toast.error(`Failed to download ${file?.name}`);
      console.error(error);
    }
  };
  const dropdownOptions = (file) => [
    { label: "View", onClick: () => handleView(file) },
    { label: "Download", onClick: () => handleDownload(file) },
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
            {allData.reduce((acc, file) => acc + file.size, 0) / 1e6} MB
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
                      {new Date(file.fileShares[0].sharedAt).toLocaleTimeString()}, {new Date(file.updatedAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Shared by: {file.user.name}
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

export default Shared;
