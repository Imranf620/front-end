import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Modal,
} from "@mui/material";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { getPricing } from "../../features/paymentSlice";

const VITE_PAYMENT_API= import.meta.env.VITE_PAYMENT_API

const stripePromise = loadStripe(
  VITE_PAYMENT_API
);

const SelectPackage = ({ upgrade = false, onCancel }) => {
  const [days, setDays] = useState(30);
  const [uploadSpeed, setUploadSpeed] = useState(10);
  const [downloadSpeed, setDownloadSpeed] = useState(10);
  const [storage, setStorage] = useState(100);
  const [price, setPrice] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();

  const availableDays = [7, 14, 30, 60, 90];
  const availableSpeeds = [10, 50, 100, 200, 500];
  const availableStorage = [50, 100, 200, 500, 1000];
  const [packagePrices, setpackagePrices] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPricing = async () => {
      const result = await dispatch(getPricing());
      console.log(result.payload.data);
      setpackagePrices(result.payload.data);
    };
    fetchPricing();
  }, [dispatch]);

  const pricing = {
    perDayPrice: 2,
    perMbpsSpeedPrice: 0.75,
    perGbStoragePrice: 0.5,
  };

  // Function to calculate the total price
  const calculatePrice = () => {
    const totalPrice =
      days * pricing.perDayPrice +
      (uploadSpeed + downloadSpeed) * pricing.perMbpsSpeedPrice +
      storage * pricing.perGbStoragePrice;
    setPrice(totalPrice);
  };

  // Ensure the price is calculated on component mount
  useEffect(() => {
    calculatePrice();
  }, [days, uploadSpeed, downloadSpeed, storage]);

  const handleDaysChange = (event) => {
    setDays(event.target.value);
  };

  const handleUploadSpeedChange = (event) => {
    setUploadSpeed(event.target.value);
  };

  const handleDownloadSpeedChange = (event) => {
    setDownloadSpeed(event.target.value);
  };

  const handleStorageChange = (event) => {
    setStorage(event.target.value);
  };

  const handleSubscribeClick = () => {
    setOpenModal(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <Typography variant="h4" gutterBottom className="text-gray-900">
        Choose Your Package
      </Typography>

      <Box mb={3}>
        <Typography variant="h6" className="text-gray-700">
          Select Days:
        </Typography>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Days</InputLabel>
          <Select value={days} onChange={handleDaysChange} label="Select Days">
            {availableDays.map((day) => (
              <MenuItem key={day} value={day}>
                {day} Days
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mb={3}>
        <Typography variant="h6" className="text-gray-700">
          Select Upload Speed (Mbps):
        </Typography>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Upload Speed</InputLabel>
          <Select
            value={uploadSpeed}
            onChange={handleUploadSpeedChange}
            label="Select Upload Speed"
          >
            {availableSpeeds.map((speed) => (
              <MenuItem key={speed} value={speed}>
                {speed} Mbps
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mb={3}>
        <Typography variant="h6" className="text-gray-700">
          Select Download Speed (Mbps):
        </Typography>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Download Speed</InputLabel>
          <Select
            value={downloadSpeed}
            onChange={handleDownloadSpeedChange}
            label="Select Download Speed"
          >
            {availableSpeeds.map((speed) => (
              <MenuItem key={speed} value={speed}>
                {speed} Mbps
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mb={3}>
        <Typography variant="h6" className="text-gray-700">
          Select Storage (GB):
        </Typography>
        <FormControl fullWidth variant="outlined">
          <InputLabel>Select Storage</InputLabel>
          <Select
            value={storage}
            onChange={handleStorageChange}
            label="Select Storage"
          >
            {availableStorage.map((stor) => (
              <MenuItem key={stor} value={stor}>
                {stor} GB
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Box mb={3}>
        <Typography variant="h5" className="text-gray-900">
          Total Price: ${price.toFixed(2)}
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        color="secondary"
        onClick={handleSubscribeClick}
        className="py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Subscribe Now
      </Button>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box className="w-96 p-6 bg-white rounded-lg shadow-xl mx-auto mt-32">
          <Typography variant="h5" gutterBottom className="text-gray-900">
            Enter Payment Details
          </Typography>

          <Elements stripe={stripePromise}>
            <StripePaymentForm price={price} setOpenModal={setOpenModal} />
          </Elements>
        </Box>
      </Modal>
    </div>
  );
};

const StripePaymentForm = ({ price, setOpenModal }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (error) {
      alert(error.message);
    } else {
      console.log(paymentMethod);
      alert("Payment successful!");
      setOpenModal(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement className="p-2 border rounded-md" />
      <Typography variant="h6" className="text-blue-600 mt-4">
        Total: ${price.toFixed(2)}
      </Typography>
      <Button
        variant="contained"
        type="submit"
        disabled={!stripe}
        fullWidth
        className="mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Pay Now
      </Button>
    </form>
  );
};

export default SelectPackage;
