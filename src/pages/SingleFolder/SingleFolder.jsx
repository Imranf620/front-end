import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  TextField,
} from "@mui/material";
import { MdFolder } from "react-icons/md";

import ArticleIcon from "@mui/icons-material/Article";
import { Add, Delete, Share, Upload } from "@mui/icons-material";
import { toast } from "react-toastify";
import FolderDialog from "../../components/FolderDialog/FolderDialog";
import {
  deleteFile,
  editFileName,
  fileDownload,
  fileView,
  shareFile,
  uploadFile,
} from "../../features/filesSlice";
import { useDispatch } from "react-redux";
import SEO from "../../components/SEO/SEO";
import DropdownMenu from "../../components/dropdownMenu/DropdownMenu";
import { useTheme } from "../../context/ThemeContext";
import { reFetchContext } from "../../context/ReFetchContext";

const SingleFolder = () => {
  const [folder, setFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubfolders, setSelectedSubfolders] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [confirmUploadOpen, setConfirmUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [refetch, setRefetch] = useState(false);
  const [filteredFiles, setFilteredFiles] = useState([]);

  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [renameFileData, setRenameFileData] = useState(null);
  const [newName, setNewName] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareOption, setShareOption] = useState("public");
  const [emailListArray, setEmailListArray] = useState([""]);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectFile, setSelectFile] = useState(false);
  const baseApi = import.meta.env.VITE_API_URL;
  const FRONT_END_URL = import.meta.env.VITE_API_URL;
  const location = useLocation()
  const id  =  location.state.folderId
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
    const { handleRefetch } = useContext(reFetchContext);
  

  useEffect(() => {
    fetchFolderData();
  }, [baseApi, id, refetch]);

  const fetchFolderData = () => {
    setLoading(true);
    axios
      .get(`${baseApi}/folders/${id}`, { withCredentials: true })
      .then((res) => {
        setFolder(res.data.data);
        setFilteredFiles(res.data.data.files);
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
    if (
      selectedSubfolders.length === folder.children.length &&
      selectedFiles.length === folder.files.length
    ) {
      setSelectedSubfolders([]);
    } else {
      setSelectedSubfolders(folder.children.map((subfolder) => subfolder.id));
      setSelectedFiles(folder.files.map((file) => file.id));
    }
  };

  const handleDeleteSubfolders = async () => {
    if (selectedSubfolders.length > 0) {
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
    }

    if (selectedFiles.length > 0) {
      await handleDeleteFile();
    }
  };

  const handleShareSubfolders = () => {
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

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setConfirmUploadOpen(true);
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

  const handleUploadConfirm = async () => {
    if (!selectedFile) {
      toast.error("No file selected!");
      return;
    }

    setConfirmUploadOpen(false);
    setUploadProgress(0);
    setIsUploading(true);

    try {
      const response = await axios.post(
        `${baseApi}/pre-ass-url`,
        {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        },
        { withCredentials: true }
      );

      const { url, publicUrl } = response.data;

      const uploadResponse = await axios.put(url, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });

      const result = await dispatch(
        uploadFile({
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.type,
          path: publicUrl,
          folderId: id,
        })
      );

      if (result.payload?.success) {
        toast.success(result.payload.message);
        setRefetch(!refetch);
      } else {
        toast.error(result.payload.message);
      }
    } catch (error) {
      toast.error("Error uploading file: " + error.message);
    } finally {
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  const handleUploadCancel = () => {
    setConfirmUploadOpen(false);
    setSelectedFile(null);
  };

  const dropdownOptions = (file) => [
    { label: "View", onClick: () => handleView(file) },
    { label: "Download", onClick: () => handleDownload(file) },
    { label: "Share", onClick: () => handleShare(file) },
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
    },
  ];

  const handleShare = async (file) => {
    setSelectedFile(file);
    setShareModalOpen(true);
    if (file.fileShares && file.fileShares.length > 0) {
      setEmailListArray(file.fileShares.map((share) => share.email));
    } else {
      setEmailListArray([""]);
    }
  };

  const handleShareFile = async () => {
    const validEmails = emailListArray.filter((email) =>
      validateEmail(email.trim())
    );

    if (shareOption === "shared" && validEmails.length === 0) {
      toast.error("Please enter at least one valid email.");
      return;
    }

    const shareData = {
      fileId: selectedFile.id,
      visibility:
        shareOption === "public"
          ? "PUBLIC"
          : shareOption === "shared"
          ? "SHARED"
          : "PRIVATE", // New case for private visibility
      emails: shareOption === "shared" ? validEmails : [],
    };

    try {
      const result = await dispatch(shareFile(shareData));

      if (result?.payload?.success) {
        toast.success(
          shareOption === "public"
            ? "File shared publicly!"
            : shareOption === "shared"
            ? "File shared with specific users!"
            : "File set to private!"
        );

        if (shareOption === "public") {
          const shareUrl = `${FRONT_END_URL}/dashboard/shared/${shareData?.fileId}`;
          navigator.clipboard.writeText(shareUrl);
          toast.success("File link copied to clipboard!");
        }
      } else {
        toast.error("Failed to share file");
      }
    } catch (error) {
      toast.error("Failed to share file");
      console.error("Error sharing file:", error);
    } finally {
      setShareModalOpen(false);
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
  const handleCloseRenameModal = () => {
    setRenameModalOpen(false);
    setRenameFileData(null);
    setNewName("");
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
        handleCloseRenameModal();
      } else {
        toast.error(response.payload.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to rename file");
    }
  };

  const handleDeleteFile = async () => {
    if (selectedFiles.length === 0) return;

    try {
      const response = await dispatch(deleteFile(selectedFiles));
      if (response.payload?.success) {
        toast.success("Files deleted successfully");
        setFilteredFiles((prev) =>
          prev.filter((file) => !selectedFiles.includes(file.id))
        );
        setDeleteModalOpen(false);
        setSelectedFiles([]);
      } else {
        toast.error(response.payload.message || "Failed to delete files");
      }
    } catch (error) {
      toast.error(error.message || "Failed to delete file");
    }
  };

  const handleView = async (file) => {
    setSelectedFile(file);
    setViewModalOpen(true);

    const res = await dispatch(fileView(file.id));
    if (res.payload?.success) {
      toast.success(`${file.name} opened`);
    }
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
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  const handleAddEmail = () => {
    setEmailListArray([...emailListArray, ""]);
  };
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };
  const handleRemoveEmail = (index) => {
    const newEmailList = emailListArray.filter((_, i) => i !== index);
    setEmailListArray(newEmailList);
  };

  return (
    <>
      <SEO
        title={`${folder?.name} - Gofilez`}
        description={`View and manage ${folder?.name} folder in Gofilez cloud storage`}
        keywords="folder, cloud storage, file management, secure storage"
      />

      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-bold">{folder?.name}</h1>
          <Button
            onClick={() => navigate(-1)}
            variant="outlined"
            color="primary"
          >
            Back
          </Button>
        </div>

        <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outlined"
              onClick={() => {
                setIsSelecting(!isSelecting);
                setSelectedFiles([]);
                setSelectedSubfolders([]);
              }}
            >
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
            {(selectedSubfolders.length > 0 || selectedFiles.length > 0) &&
              isSelecting && (
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

            {/* Upload Button */}
            <Button
              variant="contained"
              color="primary"
              startIcon={<Upload />}
              component="label"
            >
              {isUploading ? "Uploading..." : "Upload File"}
              <input
                type="file"
                hidden
                onChange={handleFileSelection}
                accept="*/*"
              />
            </Button>
          </Box>
        </div>

        {isUploading && (
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{ marginBottom: 2 }}
          />
        )}

        {/* Confirm Upload Dialog */}
        <Dialog open={confirmUploadOpen} onClose={handleUploadCancel}>
          <DialogTitle>Confirm Upload</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to upload the file:{" "}
              <strong>{selectedFile?.name}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUploadCancel} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleUploadConfirm} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>

        {/* Subfolder display */}
        <div className="flex flex-wrap  items-center gap-4">
          {folder?.children?.map((subfolder) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={subfolder.id}
              className="relative"
            >
              <Card className="cursor-pointer h-[105px] w-[250px] md:w-[300px]">
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
                    <Typography
                      variant="h6"
                      className="font-semibold truncate"
                      style={{ maxWidth: "100%" }}
                    >
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

          {filteredFiles?.length > 0 &&
            folder.files.map((file) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={file.id}
                className="relative"
              >
                <Card className="cursor-pointer h-[105px] w-[250px] md:w-[300px] ">
                  {isSelecting && (
                    <div className="absolute top-2 right-2">
                      <Checkbox
                        checked={selectedFiles.includes(file.id)}
                        onChange={() => handleFileSelect(file.id)}
                      />
                    </div>
                  )}
                  <CardContent>
                    <div className="flex items-center space-x-3">
                      <ArticleIcon size={40} className="text-[#b21ad8]" />
                      <Typography
                        variant="h6"
                        className="font-semibold truncate"
                        style={{ maxWidth: "100%" }}
                      >
                        {file.name || "Untitled File"}
                      </Typography>
                    </div>
                    <Typography variant="body2" color="textSecondary">
                      {(file.size / 1e6).toFixed(2)} MB
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {new Date(file.updatedAt).toLocaleTimeString()},
                      {new Date(file.updatedAt).toLocaleDateString()}
                    </Typography>
                  </CardContent>
                  <div className="absolute top-2 right-2">
                    <DropdownMenu options={dropdownOptions(file)} />
                  </div>
                </Card>
              </Grid>
            ))}
        </div>

        <FolderDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          onCreate={handleCreateFolder}
          parentId={id}
        />

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
            <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleDeleteFile} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={shareModalOpen} onClose={() => setShareModalOpen(false)}>
          <DialogTitle>Share File</DialogTitle>
          <DialogContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Visibility</label>
                <select
                  value={shareOption}
                  onChange={(e) => setShareOption(e.target.value)}
                  className={`w-full px-3 py-2 border outline-none rounded-md ${
                    isDarkMode ? "bg-[#333] text-white" : "bg-white text-black"
                  }`}
                >
                  <option value="public">Public</option>
                  <option value="shared">Shared with Specific Users</option>
                  <option value="private">Private</option>
                </select>
              </div>
              {shareOption === "shared" && (
                <div>
                  <label className="text-sm font-medium">Emails</label>
                  {emailListArray.map((email, index) => (
                    <div key={index} className="flex gap-2 py-2 items-center">
                      <TextField
                        label="Email"
                        variant="outlined"
                        size="small"
                        value={email}
                        onChange={(e) => {
                          const newEmails = [...emailListArray];
                          newEmails[index] = e.target.value;
                          setEmailListArray(newEmails);
                        }}
                        sx={{ backgroundColor: isDarkMode ? "#444" : "#fff" }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddEmail}
                    className="text-blue-500"
                  >
                    Add Email
                  </button>
                </div>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShareModalOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleShareFile} color="primary">
              Share
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
      </div>
    </>
  );
};

export default SingleFolder;
