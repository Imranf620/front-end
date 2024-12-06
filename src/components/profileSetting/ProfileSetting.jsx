import React, { useState } from 'react';
import { Box, Typography, Divider, CircularProgress, Button } from '@mui/material';
import ProfileImage from './ProfileImage';
import UserDetails from './UserDetails';
import { useTheme } from '../../context/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../features/userSlice';
import { toast } from 'react-toastify';
import axios from 'axios';

const ProfileSetting = () => {
  const { isDarkMode } = useTheme();
  const { user, loading, error } = useSelector(state => state.auth);

  const baseApi = import.meta.env.VITE_API_URL;

  const [image, setImage] = useState(null);
  const [username, setUsername] = useState(user?.user?.name || '');
  const [email, setEmail] = useState(user?.user?.email || '');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(user?.user?.image || '');  // Use existing image URL if present
  console.log("imageUrl", imageUrl);

  const dispatch = useDispatch();

  const handleImageChange = (newImage) => {
    setImage(newImage);
    console.log(`Image selected: ${newImage}`);
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

        const { url, downloadUrl } = response.data;

        console.log('downloadUrl', downloadUrl)

        const s3UploadResponse = await axios.put(url, image, {
          headers: {
            'Content-Type': image.type,
          },
        });

        if (s3UploadResponse.status === 200) {
          console.log('Image uploaded to S3:', downloadUrl);
          const uploadedImageUrl = downloadUrl;
          setImageUrl(downloadUrl);
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
    </Box>
  );
};

export default ProfileSetting;
