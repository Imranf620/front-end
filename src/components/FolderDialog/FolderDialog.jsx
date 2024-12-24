import { Dialog, DialogContent, DialogTitle, TextField , DialogActions, Button} from "@mui/material";
import axios from "axios";
import { useState } from "react";

const FolderDialog = ({ open, onClose, onCreate, parentId }) => {
    const [newFolderName, setNewFolderName] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const baseApi = import.meta.env.VITE_API_URL;
  
    const createFolder = () => {
      if (!newFolderName.trim()) {
        setErrorMessage("Folder name is required");
        return;
      }
  
      axios
        .post(`${baseApi}/folders/create`, { name: newFolderName, parentId }, { withCredentials: true })
        .then((res) => {
          onCreate(res.data);
          setNewFolderName("");
          onClose();
        })
        .catch((error) => {
          console.error("Error creating folder:", error);
          setErrorMessage("Failed to create folder.");
        });
    };
  
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Create New Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Folder Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            error={!!errorMessage}
            helperText={errorMessage}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={createFolder} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  

export default FolderDialog