import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllTrash } from "../../features/trashSlice";
import {
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
  Box,
  Pagination,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import GridViewIcon from "@mui/icons-material/GridView";
import TableRowsIcon from "@mui/icons-material/TableRows";
import { adminFileDelete } from "../../features/adminSlice";
import { toast } from "react-toastify";

const Trash = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState(
    () => localStorage.getItem("viewMode") || "grid"
  );
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [trashFiles, setTrashFiles] = useState([]);
  const [selectFile, setSelectFile] = useState(false); // To toggle checkboxes visibility
  const [currentPage, setCurrentPage] = useState(1);
  const [filesPerPage] = useState(5); // You can adjust this number as per your preference

  const fetchTrash = useCallback(async () => {
    try {
      setLoading(true);
      const res = await dispatch(
        getAllTrash({ search, orderBy, orderDirection })
      );
      setTrashFiles(res.payload.data);
    } catch (error) {
      console.error("Error fetching trash files:", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch, search, orderBy, orderDirection]);

  useEffect(() => {
    fetchTrash();
  }, [fetchTrash]);

  const handleFileSelection = useCallback((fileId) => {
    setSelectedFiles((prevSelected) =>
      prevSelected.includes(fileId)
        ? prevSelected.filter((id) => id !== fileId)
        : [...prevSelected, fileId]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedFiles.length === trashFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(trashFiles.map((file) => file.id));
    }
  }, [selectedFiles, trashFiles]);

  const handleDeleteSelectedFiles = useCallback(async () => {
    if (selectedFiles.length > 0) {
      try {
        console.log(selectedFiles);
        const res = await dispatch(adminFileDelete(selectedFiles));
        if(res.payload.success) {
            toast.success(res.payload.message);
            setTrashFiles(trashFiles.filter(file => !selectedFiles.includes(file.id)));
        }
        setSelectedFiles([]);
      } catch (error) {
        toast.error("Failed to delete selected files");
      }
    } else {
      toast.warn("Please select a file.");
    }
  }, [selectedFiles, dispatch, trashFiles]);

  const handleToggleView = () => {
    const newMode = viewMode === "grid" ? "table" : "grid";
    setViewMode(newMode);
    localStorage.setItem("viewMode", newMode);
  };

  // Pagination Logic
  const indexOfLastFile = currentPage * filesPerPage;
  const indexOfFirstFile = indexOfLastFile - filesPerPage;
  const currentFiles = trashFiles?.slice(indexOfFirstFile, indexOfLastFile);
  const totalPages = Math.ceil(trashFiles?.length / filesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <div>
      <Typography variant="h4" component="h1" sx={{ marginBottom: 2 }}>
        Trash Files
      </Typography>
      <Paper
        sx={{ padding: 3, marginBottom: 4, boxShadow: 3, borderRadius: 2 }}
      >
        <Grid
          container
          spacing={2}
          alignItems="center"
          sx={{ marginBottom: 2 }}
        >
          <Grid item>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              Sort by:
            </Typography>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" sx={{ minWidth: 150 }}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={orderBy}
                onChange={(e) => setOrderBy(e.target.value)}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="size">Size</MenuItem>
                <MenuItem value="date">Date</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl variant="outlined" sx={{ minWidth: 150 }}>
              <InputLabel>Order</InputLabel>
              <Select
                value={orderDirection}
                onChange={(e) => setOrderDirection(e.target.value)}
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by keyword"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        //   sx={{ backgroundColor: "#f9f9f9", borderRadius: 1, boxShadow: 1 }}
        />
      </Paper>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <IconButton onClick={handleToggleView}>
          {viewMode === "grid" ? <TableRowsIcon /> : <GridViewIcon />}
        </IconButton>
      </Box>

      <div>
        <Button
          variant="outlined"
          onClick={handleSelectAll}
          sx={{ marginBottom: 2 }}
        >
          {selectedFiles?.length === trashFiles?.length
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
            onClick={handleDeleteSelectedFiles}
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
            height: "100%",
          }}
        >
          <CircularProgress />
        </Box>
      ) : viewMode === "grid" ? (
        <Grid container spacing={2}>
          {currentFiles?.map((file) => (
            <Grid item key={file.id} sx={{position:"relative"}}   xs={12} sm={6} md={4}>
              <Paper sx={{ padding: 2, boxShadow: 1 }}>
                {selectFile && (
                  <Checkbox
                    checked={selectedFiles.includes(file.id)}
                    onChange={() => handleFileSelection(file.id)}
                     sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        zIndex: 1,
                        cursor: "pointer",
 
                     }}
                  />
                )}
                <Typography variant="body1">{file.name}</Typography>
                <Typography variant="body2">
                  {(file.size / 1e6).toFixed(2)} MB
                </Typography>
                <Typography variant="body2">
                  Last Modified: {new Date(file.updatedAt).toLocaleString()}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      ) : (
        <TableContainer component={Paper} sx={{ marginBottom: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                {selectFile && (
                  <TableCell>
                    <Checkbox
                      checked={selectedFiles.length === trashFiles.length}
                      onChange={handleSelectAll}
                    />
                  </TableCell>
                )}
                <TableCell>Name</TableCell>
                <TableCell>Size (MB)</TableCell>
                <TableCell>Last Modified</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentFiles?.length > 0 ? (
                currentFiles.map((file) => (
                  <TableRow key={file.id}>
                    {selectFile && (
                      <TableCell>
                        <Checkbox
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => handleFileSelection(file.id)}
                        />
                      </TableCell>
                    )}
                    <TableCell>{file.name}</TableCell>
                    <TableCell>{(file.size / 1e6).toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(file.updatedAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4}>No files found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </div>
  );
};

export default Trash;
