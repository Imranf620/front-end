import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteUserProfile,
  getUserDetail,
  updateUserProfile,
} from "../../features/adminSlice";
import Loader from "../Loader/Loader";
import {
  TextField,
  Button,
  Tooltip,
  IconButton,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import UserFiles from "../UserFiles/UserFiles";
import { useTheme } from "../../context/ThemeContext";

const UserProfile = () => {
  const { isDarkMode } = useTheme();

  const [userDetail, setUserDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const dispatch = useDispatch();
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const res = await dispatch(getUserDetail(userId));

        if (res.payload.success) {
          setUserDetail(res.payload.data);
          console.log(res.payload.data);

          setFormData({
            name: res.payload.data.name,
            email: res.payload.data.email,
          });
        } else {
          toast.error(res.payload.message);
        }
      } catch (error) {
        toast.error("Failed to fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [dispatch, userId]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const deleteProfile = async () => {
    try {
      const res = await dispatch(deleteUserProfile(userId));
      if (res.payload.success) {
        toast.success(res.payload.message);
        navigate("/admin/users");
      } else {
        toast.error(res.payload.message);
      }
    } catch (error) {
      toast.error("Failed to delete profile");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await dispatch(updateUserProfile({ userId, ...formData }));
      if (res.payload.success) {
        toast.success(res.payload.message);
        setEditMode(false);
        setUserDetail(res.payload.data.user); // Update the local state after successful update
      } else {
        toast.error(res.payload.message);
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) return <Loader />;

  return (
    <>
      <div
        className={`p-6 max-w-4xl mx-auto ${
          isDarkMode ? "bg-black" : "bg-white"
        } rounded-lg shadow-md`}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          User Profile
        </h2>
        <div className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-6">
          <div className="text-center sm:text-left sm:w-1/3 space-y-2">
            {/* Profile Image */}

            <Tooltip
              className="w-48 h-48 mb-4 rounded-full overflow-hidden bg-gray-200 mx-auto sm:mx-0"
              title="User Profile"
            >
              <IconButton color="inherit">
                <Avatar
                  alt="User"
                  src={userDetail?.image || "/default-avatar.png"}
                  sx={{ width: 192, height: 192 }} //
                />
              </IconButton>
            </Tooltip>

            <p className="text-lg font-medium">{userDetail?.name}</p>
            <p className="text-sm text-gray-600">{userDetail?.email}</p>
            <p className="text-sm text-gray-600">
              <strong>Status:</strong>{" "}
              {userDetail?.active ? "Active" : "Inactive"}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Subscription:</strong>{" "}
              {new Date(userDetail?.subscribedAt).toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Total Storage:</strong> {userDetail?.totalStorage} GB
            </p>
            <p className="text-sm text-gray-600">
              <strong>Storage Used:</strong>{" "}
              {userDetail?.files
                ? calculateStorageUsage(userDetail?.files)
                : "0"}{" "}
              GB
            </p>
            <p className="text-sm text-gray-600">
              <strong> Days Remaining for Renewal:</strong>{" "}
              {userDetail?.remainingDays} days
            </p>
          </div>

          <div className="sm:w-2/3 w-full space-y-4">
            {editMode ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <TextField
                    label="Name"
                    variant="outlined"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </div>
                <div>
                  <TextField
                    label="Email"
                    variant="outlined"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    margin="normal"
                  />
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className="w-full py-2 text-white font-semibold rounded-lg shadow-md"
                >
                  Update Profile
                </Button>
                <Button onClick={()=>setEditMode(false)}
                  type="button"
                  variant="contained"
                  color="error"
                  className="w-full py-2 text-white font-semibold rounded-lg shadow-md"
                >
                  Close
                </Button>
              </form>
              
            ) : (
              <>
                <Button
                  onClick={() => setEditMode(true)}
                  variant="outlined"
                  color="primary"
                  className="w-full py-2 text-primary-600 font-semibold rounded-lg shadow-md"
                >
                  Edit Profile
                </Button>
                <Button
                  onClick={() => setConfirmDelete(true)}
                  variant="outlined"
                  color="secondary"
                  className="w-full py-2 text-primary-600 font-semibold rounded-lg shadow-md"
                >
                  Delete Profile
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this profile? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={async () => {
              setConfirmDelete(false);
              await deleteProfile();
            }}
            color="secondary"
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <UserFiles userId={userId} />
    </>
  );
};

// Calculate the storage usage (helper function)
const calculateStorageUsage = (files) => {
  if (!files || files.length === 0) {
    return "0.00"; // No files, so storage used is 0
  }
  const totalSize = files.reduce((total, file) => total + (file.size || 0), 0); // Ensure file.size exists
  const totalSizeInGB = totalSize / (1024 * 1024 * 1024); // Convert bytes to GB
  return totalSizeInGB.toFixed(2);
};

export default UserProfile;
