import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Checkbox,
  Box,
} from "@mui/material";
import { MdFolder } from "react-icons/md";
import { Add, Delete, Share } from "@mui/icons-material";
import { toast } from "react-toastify";
import FolderDialog from "../../components/FolderDialog/FolderDialog";

const SingleFolder = () => {
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubfolders, setSelectedSubfolders] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const baseApi = import.meta.env.VITE_API_URL;
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    fetchFolderData();
  }, [baseApi, id, refetch]);

  const fetchFolderData = () => {
    setLoading(true);
    axios
      .get(`${baseApi}/folders/${id}`, { withCredentials: true })
      .then((res) => {
        setFolder(res.data.data);
        console.log(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching folder:", error);
        setLoading(false);
      });
  };

  const toggleSubfolderSelection = (subfolderId) => {
    setSelectedSubfolders((prev) =>
      prev.includes(subfolderId)
        ? prev.filter((id) => id !== subfolderId)
        : [...prev, subfolderId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedSubfolders.length === folder.children.length) {
      setSelectedSubfolders([]);
    } else {
      setSelectedSubfolders(folder.children.map((subfolder) => subfolder.id));
    }
  };

  const handleDeleteSubfolders = () => {
    axios
      .delete(`${baseApi}/folders`, {
        data: { ids: selectedSubfolders },
        withCredentials: true,
      })
      .then(() => {
        setRefetch(!refetch);
        setSelectedSubfolders([]);
        toast.success("Subfolders deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting subfolders:", error);
        toast.error("Failed to delete subfolders. Please try again.");
      });
  };

  const handleShareSubfolders = () => {
    console.log("Sharing subfolders:", selectedSubfolders);
    toast.info("Share functionality is not implemented yet.");
  };

  const openFolder = (folderId) => {
    if (!isSelecting) {
      navigate(`/dashboard/folders/all/${folderId}`);
    }
  };

  const handleCreateFolder = (newFolder) => {
    setRefetch(!refetch);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold">{folder?.name}</h1>
        <Button onClick={() => navigate(-1)} variant="outlined" color="primary">
          Back
        </Button>
      </div>

      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <div className="flex items-center space-x-2">
          <Button variant="outlined" onClick={() => setIsSelecting(!isSelecting)}>
            {isSelecting ? "Cancel" : "Select"}
          </Button>
          {isSelecting && (
            <Button variant="outlined" onClick={toggleSelectAll}>
              {selectedSubfolders.length === folder.children.length
                ? "Unselect All"
                : "Select All"}
            </Button>
          )}
        </div>

        <Box className="flex flex-wrap items-center gap-2">
          {selectedSubfolders.length > 0 && (
            <>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Share />}
                onClick={handleShareSubfolders}
              >
                Share
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDeleteSubfolders}
              >
                Delete
              </Button>
            </>
          )}
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Create Folder
          </Button>
        </Box>
      </div>

      {folder?.children?.length > 0 ? (
        <Grid container spacing={2}>
          {folder.children.map((subfolder) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={subfolder.id}
              className="relative"
            >
              <Card className="cursor-pointer">
                {isSelecting && (
                  <div className="absolute top-2 right-2">
                    <Checkbox
                      checked={selectedSubfolders.includes(subfolder.id)}
                      onChange={() => toggleSubfolderSelection(subfolder.id)}
                    />
                  </div>
                )}
                <CardContent onClick={() => openFolder(subfolder.id)}>
                  <div className="flex items-center space-x-3">
                    <MdFolder size={40} className="text-[#b21ad8]" />
                    <Typography variant="h6" className="font-semibold">
                      {subfolder.name || "New Folder"}
                    </Typography>
                  </div>
                  <Typography variant="body2" color="textSecondary">
                    {subfolder.children?.length || 0} Subfolders
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" className="text-gray-500">
          No subfolders available.
        </Typography>
      )}

      <FolderDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onCreate={handleCreateFolder}
        parentId={id}
      />
    </div>
  );
};

export default SingleFolder;
