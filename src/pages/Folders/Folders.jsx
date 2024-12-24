import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Grid, Card, CardContent, Typography } from "@mui/material";
import FolderDialog from "./../../components/FolderDialog/FolderDialog"
import { MdFolder } from "react-icons/md";
import { Add } from "@mui/icons-material";


const Folders = () => {
  const [allFolders, setAllFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const baseApi = import.meta.env.VITE_API_URL;

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
  }, [baseApi]);

  const openFolder = (folderId) => {
    setSelectedFolderId(folderId);
    // Navigate to folder details or show contents in the UI
    console.log(`Open folder with ID: ${folderId}`);
  };

  const handleCreateFolder = (newFolder) => {
    setAllFolders((prevFolders) => [...prevFolders, newFolder]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Folders</h1>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={() => setOpenDialog(true)}
        className="mb-6"
      >
        Create Folder
      </Button>

      {loading ? (
        <div className="flex justify-center items-center">
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={3}>
          {allFolders?.map((folder) => (
            <Grid item xs={12} sm={6} md={4} key={folder.id}>
              <Card className="cursor-pointer" onClick={() => openFolder(folder.id)}>
                <CardContent>
                  <div className="flex items-center space-x-3">
                    <MdFolder size={30} className="text-gray-600" />
                    <Typography variant="h6" className="font-semibold">
                      {folder.name}
                    </Typography>
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
        parentId={selectedFolderId}
      />
    </div>
  );
};

export default Folders;
