import React, { useState } from 'react';
import { Box, Typography, Divider, CircularProgress, Button, TextField, IconButton } from '@mui/material';
import ProfileImage from './ProfileImage';
import UserDetails from './UserDetails';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, updatePassword } from '../../features/userSlice';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ProfileSetting = () => {
  const { isDarkMode } = useTheme();
  const { user, loading, error } = useSelector(state => state.auth);

  const baseApi = import.meta.env.VITE_API_URL;

  const [image, setImage] = useState(null);
  const [username, setUsername] = useState(user?.user?.name || '');
  const [email, setEmail] = useState(user?.user?.email || '');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.user?.image || '');
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const dispatch = useDispatch();

  const handleImageChange = (newImage) => {
    setImage(newImage);
  };

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    let imageToUpload = image;

    if (image) {
      try {
        setUploading(true);

        const response = await axios.post(`${baseApi}/pre-ass-url`, {
          fileName: image.name,
          fileType: image.type,
          profile:true
        }, { withCredentials: true });

        const { url, downloadUrl , publicUrl} = response.data;

        const s3UploadResponse = await axios.put(url, image, {
          headers: {
            'Content-Type': image.type,
          },
        });

        if (s3UploadResponse.status === 200) {
          const uploadedImageUrl = publicUrl;
          setImageUrl(publicUrl);
          imageToUpload = uploadedImageUrl;
        }

      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Error updating profile');
        setUploading(false);
        return;
      }
    }

    const result = await dispatch(updateProfile({ name: username, email, image: imageToUpload }));
    if (result.payload?.success) {
      toast.success(result.payload.message);
    } else {
      toast.error('Error updating profile');
    }

    setUploading(false);
  };

  const handlePasswordChange = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("Please enter both the old and new passwords.");
      return;
    }

    setUpdatingPassword(true);

    const res = await dispatch(updatePassword({ oldPassword, newPassword }));
    if (res.payload?.success) {
      toast.success(res.payload.message);
      setShowPasswordInput(false);
      setOldPassword("");
      setNewPassword("");
    } else {
      toast.error(res.payload?.message || 'Error updating password');
    }

    setUpdatingPassword(false);
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        margin: 'auto',
        padding: 3,
        backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" textAlign="center" mb={3}>
        Profile Settings
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <ProfileImage onImageChange={handleImageChange} imageUrl={imageUrl} />
      <Divider sx={{ mb: 3 }} />
      <UserDetails
        username={username}
        email={email}
        setUsername={setUsername}
        setEmail={setEmail}
      />
      {loading || uploading ? (
        <CircularProgress />
      ) : (
        <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
          Update Profile
        </Button>
      )}
      {error && <Typography color="error">{error?.message}</Typography>}
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mt: 3 }}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setShowPasswordInput(!showPasswordInput)}
        >
          {showPasswordInput ? 'Cancel' : 'Change Password'}
        </Button>

        {showPasswordInput && (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Old Password"
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowOldPassword(!showOldPassword)}>
                    {showOldPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <TextField
              label="New Password"
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                ),
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={handlePasswordChange}
              disabled={updatingPassword}
            >
              {updatingPassword ? <CircularProgress size={24} color="inherit" /> : 'Update Password'}
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ProfileSetting;
