import React, { useEffect, useState } from "react";
import ArticleIcon from "@mui/icons-material/Article";
import DropdownMenu from "../dropdownMenu/DropdownMenu";
import { useTheme } from "../../context/ThemeContext";
import { useDispatch } from "react-redux";
import { getLatestFiles, deleteFile, editFileName, shareFile } from "../../features/filesSlice";
import { toast } from "react-toastify";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, CircularProgress, Typography } from "@mui/material";

const RecentFiles = () => {
  const [recentFiles, setRecentFiles] = useState([]);
  const { isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareOption, setShareOption] = useState("public");
  const [emailListArray, setEmailListArray] = useState([""]);
  const [viewModalOpen, setViewModalOpen] = useState(false);


  useEffect(() => {
    const fetchLatestFiles = async () => {
      try {
        const response = await dispatch(getLatestFiles());
        if (response?.payload?.data) {
          setRecentFiles(response.payload.data);
        } else {
          toast.error("No files found.");
        }
      } catch (error) {
        toast.error("Failed to fetch files.");
      }
    };
    fetchLatestFiles();
  }, [dispatch]);

  const handleOptionClick = (option, file) => {
    switch (option) {
      case "View":
        handleView(file);
        break;
      case "Download":
        handleDownload(file);
        break;
      case "Delete":
        handleDelete(file);
        break;
      case "Share":
        handleShare(file);
        break;
      case "Rename":
        handleRename(file);
        break;
      default:
        break;
    }
  };

  const handleView = (file) => {
    setSelectedFile(file);
    setViewModalOpen(true);
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

      // Trigger the download
      link.click();

      // Clean up by removing the link and revoking the object URL
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      // Success message
      toast.success(`${file.name} downloaded successfully`);
    } catch (error) {
      toast.error(`Failed to download ${file.name}`);
      console.error(error);
    }
  };


  const handleDelete = (file) => {
    setSelectedFile(file);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const result = await dispatch(deleteFile(selectedFile.id));
      if (result?.payload?.success) {
        setRecentFiles((prevFiles) => prevFiles.filter((f) => f.id !== selectedFile.id));
        toast.success(`${selectedFile.name} deleted successfully`);
      } else {
        toast.error("Error deleting file");
      }
    } catch (error) {
      toast.error("Failed to delete file");
    } finally {
      setDeleteConfirmationOpen(false);
    }
  };

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

        if(shareOption === "public"){
          const shareUrl = `${FRONT_END_URL}/dashboard/shared/${shareData.fileId}`;
          navigator.clipboard.writeText(shareUrl);
          toast.success("File link copied to clipboard!");
        }
      
          
      } else {
        toast.error("Failed to share file");
      }
    } catch (error) {
      toast.error("Failed to share file");
    } finally {
      setShareModalOpen(false);
    }
  };

  

const handleRename = (file) => {
  const lastDotIndex = file.name.lastIndexOf(".");
  const baseName = file.name.substring(0, lastDotIndex);
  const extension = file.name.substring(lastDotIndex);

  setSelectedFile({ ...file, extension }); // Store extension separately
  setNewName(baseName); // Set base name as editable value
  setRenameModalOpen(true);
};


const handleRenameFile = async () => {
  if (!newName.trim()) {
    toast.error("File name cannot be empty.");
    return;
  }

  const updatedName = `${newName.trim()}${selectedFile.extension}`;
  if (updatedName === selectedFile.name) {
    toast.info("File name is unchanged.");
    setRenameModalOpen(false);
    return;
  }

  try {
    const response = await dispatch(editFileName({ fileId: selectedFile.id, newName: updatedName }));
    if (response?.payload?.success) {
      toast.success("File renamed successfully");
      setRecentFiles((prevFiles) =>
        prevFiles.map((file) =>
          file.id === selectedFile.id ? { ...file, name: updatedName } : file
        )
      );
    } else {
      toast.error(response?.payload?.message || "Failed to rename file");
    }
  } catch (error) {
    toast.error(error.message || "Failed to rename file");
  } finally {
    setRenameModalOpen(false);
  }
};

  const dropdownOptions = (file) => [
    { label: "View", onClick: () => handleOptionClick("View", file) },
    { label: "Download", onClick: () => handleOptionClick("Download", file) },
    { label: "Delete", onClick: () => handleOptionClick("Delete", file) },
    { label: "Share", onClick: () => handleOptionClick("Share", file) },
    { label: "Rename", onClick: () => handleOptionClick("Rename", file) },
  ];

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
    <div className={`p-6 ${isDarkMode ? "bg-[#272727]" : "bg-gray-50"} rounded-lg shadow-md`}>
      <h1 className="text-2xl font-semibold mb-4">Recent Files Uploaded</h1>
      <div className="flex flex-wrap gap-4">
        {recentFiles.map((file) => (
          <div key={file.id} className={`flex w-full justify-between items-center ${isDarkMode ? "bg-black" : "bg-white"} p-4 rounded-lg shadow-md`}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
                <ArticleIcon className="text-white text-xl cursor-pointer" />
              </div>
              <div>
              <p className="text-sm font-medium  text-ellipsis overflow-hidden text-wrap whitespace-nowrap w-24 xl:w-auto  ">{file.name}</p>
                <h2 className=" text-xs">{new Date(file.updatedAt).toLocaleTimeString()}, {new Date(file.updatedAt).toLocaleDateString()}</h2>
              </div>
            </div>
            <DropdownMenu options={dropdownOptions(file)} />
          </div>
        ))}
      </div>

      {/* Rename File Dialog */}
      <Dialog open={renameModalOpen} onClose={() => setRenameModalOpen(false)}>
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="New File Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ marginBottom: 2, marginTop: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleRenameFile} color="primary">
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmationOpen} onClose={() => setDeleteConfirmationOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete {selectedFile?.name}?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmationOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="primary">
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
          className={`w-full px-3 py-2 border outline-none rounded-md ${isDarkMode ? 'bg-[#333] text-white' : 'bg-white text-black'}`}
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
                sx={{ backgroundColor: isDarkMode ? '#444' : '#fff' }}
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
<Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="md">
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
        <video
          controls
          style={{ width: "100%", height: "auto" }}
        >
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
  );
};

export default RecentFiles;
