import React, { useState } from "react";
import { Close } from "@mui/icons-material";
import {
  Button,
  TextField,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  CircularProgress,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { uploadSocialVideo } from "../../features/filesSlice";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const UploadModel = ({ close, filterdata }) => {
  const [file, setFile] = useState(null);
  const [sharingOption, setSharingOption] = useState("PUBLIC");
  const [specificUsers, setSpecificUsers] = useState([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [uploadProgress, setUploadProgress] = useState([]);
  const baseApi = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch()

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type.startsWith("video/")) {
      setFile(uploadedFile);
    } else {
      toast.warn("Please upload a valid video file.");
      setFile(null);
    }
  };

  const handleSharingChange = (event) => {
    setSharingOption(event.target.value);
  };

  const handleUserChange = (index, event) => {
    const newUsers = [...specificUsers];
    newUsers[index] = event.target.value;
    setSpecificUsers(newUsers);
  };

  const handleAddUser = () => {
    setSpecificUsers([...specificUsers, ""]);
  };

  const handleRemoveUser = (index) => {
    const newUsers = specificUsers.filter((_, i) => i !== index);
    setSpecificUsers(newUsers);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleUpload = async () => {
    if (!file || !category) {
      toast.warn("Please fill in all fields before uploading.");
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(
        `${baseApi}/pre-ass-url`,
        {
          fileName: file.name,
          fileType: file.type,
        },
        { withCredentials: true }
      );

      const { url, publicUrl } = response.data;

      const uploadResponse = await axios.put(url, file, {
        headers: {
          "Content-Type": file.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      const result = await dispatch(
        uploadSocialVideo({
          name: file.name,
          size: file.size,
          type: file.type,
          path: publicUrl,
          description,
          category,
          sharingOption,
          specificUsers,
        })
      );

      if (result.payload?.success) {
        toast.success(result.payload.message);
        close();
      } else {
        toast.error(result.payload.message);
      }
    } catch (error) {
      toast.error("Error uploading file: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (e) => {
    setCategory(e.target.value);
    setOpenCategory(false);
  };

  return (
    <Box sx={{ padding: 2, position: "relative", width: "100%", maxWidth: 600 }}>
      <Button onClick={close} sx={{ position: "absolute", top: 10, right: 10 }}>
        <Close />
      </Button>

      <h2>Upload Video</h2>

      <Button
        variant="outlined"
        component="label"
        sx={{
          marginBottom: 2,
          padding: "10px 20px",
          borderColor: file ? "green" : "primary.main",
          color: file ? "green" : "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {file ? file.name : "Choose Video File"}
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          hidden
        />
      </Button>

      <TextField
        label="Video Description"
        variant="outlined"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        sx={{ marginBottom: 2 }}
      />

      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={handleCategorySelect}
          open={openCategory}
          onOpen={() => setOpenCategory(true)}
          onClose={() => setOpenCategory(false)}
        >
          {filterdata.map((cat, index) => (
            <MenuItem key={index} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ marginTop: 2 }}>
        <InputLabel>Sharing</InputLabel>
        <Select
          value={sharingOption}
          label="Sharing"
          onChange={handleSharingChange}
        >
          <MenuItem value="PUBLIC">Public</MenuItem>
          <MenuItem value="PRIVATE">Private</MenuItem>
          <MenuItem value="SHARED">Specific User</MenuItem>
        </Select>
      </FormControl>

      {sharingOption === "SHARED" && (
        <Box sx={{ marginTop: 2 }}>
          {specificUsers.map((user, index) => (
            <Grid container alignItems="center" key={index} spacing={2}>
              <Grid item xs={12} sm={9}>
                <TextField
                  label={`User ${index + 1} Email`}
                  variant="outlined"
                  value={user}
                  onChange={(e) => handleUserChange(index, e)}
                  fullWidth
                  error={user && !isValidEmail(user)}
                  helperText={
                    user && !isValidEmail(user) ? "Invalid email format" : ""
                  }
                />
                {specificUsers[0].trim() === "" && (
                  <Box
                    sx={{
                      marginLeft: 2,
                      color: "brown",
                      fontSize: "0.75rem",
                      fontStyle: "italic",
                    }}
                  >
                    Please enter an email
                  </Box>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sm={3}
                sx={{ display: "flex", justifyContent: "center" }}
              >
                {index > 0 && (
                  <IconButton onClick={() => handleRemoveUser(index)}>
                    <RemoveIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
          <IconButton onClick={handleAddUser} sx={{ marginTop: 2 }}>
            <AddIcon />
          </IconButton>
        </Box>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        sx={{ marginTop: 2 }}
        disabled={
          !file ||
          !category ||
          (sharingOption === "SHARED" &&
            specificUsers.some((user) => !isValidEmail(user)))
        }
        fullWidth
      >
        {loading ? <CircularProgress size={24} color="secondary" /> : "Upload"}
      </Button>
    </Box>
  );
};

export default UploadModel;
