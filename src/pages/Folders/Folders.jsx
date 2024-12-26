import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Typography,
  Checkbox,
  Menu,
  MenuItem,
  Box,
} from "@mui/material";
import FolderDialog from "./../../components/FolderDialog/FolderDialog";
import { MdFolder } from "react-icons/md";
import { Add, Delete, Share, MoreVert } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SEO from "../../components/SEO/SEO";

const Folders = () => {
  const [allFolders, setAllFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [refetch, setRefetch] = useState(false)
  const baseApi = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${baseApi}/folders`, { withCredentials: true })
      .then((res) => {
        setAllFolders(res.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching folders:", error);
        setLoading(false);
      });
  }, [baseApi, refetch]);

  const toggleFolderSelection = (folderId) => {
    setSelectedFolders((prev) =>
      prev.includes(folderId) ? prev.filter((id) => id !== folderId) : [...prev, folderId]
    );
  };

  const handleDeleteFolders = () => {
    axios
      .delete(`${baseApi}/folders`, { data: { ids: selectedFolders }, withCredentials: true })
      .then(() => {
        setAllFolders((prev) => prev.filter((folder) => !selectedFolders.includes(folder.id)));
        setSelectedFolders([]);
        toast.success(`Folders deleted successfully`)
      })
      .catch((error) => console.error("Error deleting folders:", error));
  };

  const handleShareFolders = () => {
    console.log("Sharing folders:", selectedFolders);
  
  };

  const toggleSelectAll = () => {
    if (selectedFolders.length === allFolders.length) {
      setSelectedFolders([]);
    } else {
      setSelectedFolders(allFolders.map((folder) => folder.id));
    }
  };

  const openFolder = (folderId) => {
    if (!isSelecting) {
      navigate(`/dashboard/folders/all/${folderId}`);
    }
  };

  const handleCreateFolder = (newFolder) => {
  
    setRefetch(!refetch)
  };

  return (
    <>
      <SEO 
        title="All Folders - Gofilez" 
        description="Browse all your folders in one place. Manage, organize, and share files with ease using Gofilez cloud storage." 
        keywords="folders, cloud storage, file organization, secure storage, manage files" 
      />
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Folders</h1>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="outlined"
            onClick={() => setIsSelecting(!isSelecting)}
          >
            {isSelecting ? "Cancel" : "Select"}
          </Button>
          {isSelecting && (
            <Button
              variant="outlined"
              onClick={toggleSelectAll}
            >
              {selectedFolders.length === allFolders.length ? "Unselect All" : "Select All"}
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-3">
          {selectedFolders.length > 0 && (
            <>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Share />}
                onClick={handleShareFolders}
              >
                Share
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Delete />}
                onClick={handleDeleteFolders}
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
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : allFolders.length===0? <h1>
          No folders found. Click the 'Create Folder' button to add a new one.
  
      </h1> :(
        <Grid container spacing={3}>
          {allFolders?.map((folder) => (
            <Grid item xs={12} sm={6} className="relative" md={4} key={folder.id}>
              <Card className="cursor-pointer ">
                {isSelecting && (
                  <div className="absolute top-6 right-2">
                    <Checkbox
                      checked={selectedFolders.includes(folder.id)}
                      onChange={() => toggleFolderSelection(folder.id)}
                      className=" "
                    />
                  </div>
                )}
                <CardContent onClick={() => openFolder(folder.id)}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <MdFolder size={30} className="text-[#b21ad8]" />
                      <Typography variant="h6" className="font-semibold">
                        {folder.name}
                      </Typography>
                    </div>
                   
                  </div>
                  <Typography variant="body2" color="textSecondary">
                    {folder.files ? folder.files.length : 0} Files
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

     
      <FolderDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onCreate={handleCreateFolder}
      />
    </div>
    </>

  );
};

export default Folders;
