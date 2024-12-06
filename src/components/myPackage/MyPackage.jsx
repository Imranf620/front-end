import React, { useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
} from '@mui/material';
import { useTheme } from '../../context/ThemeContext';
import SelectPackage from '../selectPackage/SelectPackage';
import { useSelector } from 'react-redux';

const MyPackage = () => {
  const { isDarkMode } = useTheme();
  const [isModalOpen, setModalOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  console.log(user?.user)

  // Selected package details
  const selectedPackage = {
    days: user?.user.validDays,
    uploadSpeed: user?.user.uploadSpeed,
    downloadSpeed: user?.user.downloadSpeed,
    storage: user?.user.totalStorage,
    price: user?.user.payments.length===1 ?  80.0 : 0.00,
  };

  // Styles
  const styles = {
    container: {
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor: isDarkMode ? '#333' : '#f5f5f5',
    },
    header: {
      padding: '10px',
      borderRadius: '10px 10px 0 0',
      backgroundColor: isDarkMode ? '#424242' : '#9C27B0',
      color: '#ffffff',
      textAlign: 'center',
    },
    tableCellHeader: {
      fontWeight: 'bold',
      color: isDarkMode ? '#ffffff' : '#000000',
    },
    button: {
      marginTop: '20px',
      color: '#ffffff',
      backgroundColor: isDarkMode ? '#9C27B0' : '#7B1FA2',
      '&:hover': {
        backgroundColor: isDarkMode ? '#7B1FA2' : '#9C27B0',
      },
    },
    modalContent: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '90%',
      maxWidth: '600px',
      backgroundColor: isDarkMode ? '#424242' : '#ffffff',
      borderRadius: '10px',
      boxShadow: 24,
      padding: '20px',
    },
  };

  // Modal handlers
  const handleUpgradeClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant="h5">Your Subscription Package</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={styles.tableCellHeader}>Feature</TableCell>
              <TableCell sx={styles.tableCellHeader}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Days</TableCell>
              <TableCell>{selectedPackage.days} Days</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Upload Speed</TableCell>
              <TableCell>{selectedPackage.uploadSpeed} Mbps</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Download Speed</TableCell>
              <TableCell>{selectedPackage.downloadSpeed} Mbps</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Storage</TableCell>
              <TableCell>{selectedPackage.storage} GB</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Total Price</TableCell>
              <TableCell>${selectedPackage.price}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        sx={styles.button}
        onClick={handleUpgradeClick}
      >
        Upgrade Your Subscription
      </Button>

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="upgrade-modal-title"
        aria-describedby="upgrade-modal-description"
      >
        <Box sx={styles.modalContent}>
          <SelectPackage upgrade={true} onCancel={handleCloseModal} />
        </Box>
      </Modal>
    </Box>
  );
};

export default MyPackage;
