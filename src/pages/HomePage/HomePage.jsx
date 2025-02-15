import { ArrowCircleRight } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Footer from "../../components/footer/Footer";

import {
  Button,
  Dialog,
  FormControl,
  FormControlLabel,
  LinearProgress,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import HomeNav from "../../components/homeNav/HomeNav";
import { toast } from "react-toastify";
import axios from "axios";
import { uploadGuestFile } from "../../features/filesSlice";
import { useDispatch } from "react-redux";
import GuestFile from "../../components/guestFile/GuestFile";

const HomePage = () => {

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState({});
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareOption, setShareOption] = useState("public");
  const [customUrl, setCustomUrl] = useState("");
  const [emails, setEmails] = useState([""]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [guestFile, setGuestFile] = useState();
  const baseApi = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();

  // const { fileId } = useParams();
  const location = useLocation()
  const fileId= location.pathname.replace(/^\/+/, "")


  const handleEmailChange = (index, event) => {
    const updatedEmails = [...emails];
    updatedEmails[index] = event.target.value;
    setEmails(updatedEmails);
  };

  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setIsShareDialogOpen(true);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setIsShareDialogOpen(true);
    }
  };

  const handleShareDialogClose = () => {
    setIsShareDialogOpen(false);
    setSelectedFile("");
  };

  const handleShare = async () => {
    let fileId;
    setLoading(true);

    try {
      const response = await axios.post(
        `${baseApi}/pre-ass-url`,
        {
          fileName: selectedFile.name,
          fileType: selectedFile.type,
        },
        { withCredentials: true }
      );

      const { url, downloadUrl, publicUrl } = response.data;
      setIsShareDialogOpen(false);

      const uploadResponse = await axios.put(url, selectedFile, {
        headers: {
          "Content-Type": selectedFile.type,
        },
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progressPercentage = Math.round((loaded * 100) / total);
          setProgress(progressPercentage);
        },
      });
      if (uploadResponse.status === 200) {
        let res = await dispatch(uploadGuestFile({ selectedFile, publicUrl }));
        setProgress(0);
        setIsShareDialogOpen(false);
        setGuestFile(res.payload.data);
        const random = res.payload.data.random;
        if (res.payload.success) {
          const sharedUrl = customUrl
            ? `${customUrl}`
            : `${import.meta.env.VITE_FRONTEND_API_URL}/${random}`;

          // Copy URL to clipboard
          navigator.clipboard.writeText(sharedUrl).then(() => {
            toast.success("Link copied to clipboard!");
          });
        }
        if (res.payload.success === false) {
          toast.error(res.payload.message);
          return;
        }
      }
    } catch (error) {
      setProgress(0);
    } finally {
      setLoading(false);
    }

    if (shareOption === "public") {
      // toast.info(`File shared publicly.`);
    } else {
      toast.info(`File shared with email(s): ${emails.join(", ")}`);
      const res = await axios.post(`${baseApi}/mail`, {
        selectedFile,
        emails,
        publicUrl,
      });
      toast.success(res.data.message);
    }

    setIsShareDialogOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex bg-black flex-col min-h-screen">
      <header>
        <HomeNav />
      </header>
      <div
        className={`${
          isScrolled ? "bg-white text-black" : "bg-black text-white"
        } h-full px-6 pt-16 text-center transition-all duration-500 ease-in-out`}
      >
        <div className="my-6">{fileId && <GuestFile />}</div>

        <div className="flex gap-6 items-center mx-auto w-full justify-center pb-20">
          <Link
            to="/signup"
            className="hero-button  px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-400 transition-all duration-300 ease-in-out"
          >
            Signup Free
          </Link>
          <div className="flex items-center mt-4">
            <u className="cursor-pointer text-lg hover:text-blue-500 transition-all duration-300">
              <Link to="/pricing">Find your plan</Link>
            </u>
            <ArrowCircleRight className="ml-2 text-xl" />
          </div>
        </div>

        {!fileId && (
          <div className="">
            <div
              className={`border-2 ${
                isDragging
                  ? "border-blue-500 bg-blue-50"
                  : "border-dashed border-gray-300"
              } rounded-lg p-6 flex flex-col items-center justify-center transition-all duration-300`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label
                htmlFor="file"
                className="flex flex-col items-center cursor-pointer hover:text-blue-500 transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span className="text-gray-500 text-sm mb-2">
                  Drag & drop files here
                </span>
                <span className="text-sm text-blue-500 underline">
                  or click to upload
                </span>
              </label>
              <input
                type="file"
                id="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
            {selectedFile.fileName && (
              <p className="text-sm text-gray-500 mt-2">
                Uploaded:{" "}
                <span className="font-medium">{selectedFile.fileName}</span>
              </p>
            )}
            <p className="text-sm text-gray-500 mt-2">(Max file size: 15 GB)</p>
            {progress > 0 && (
              <div className="mt-4">
                <LinearProgress variant="determinate" value={progress} />
                <p className="text-center text-sm mt-2">{progress}%</p>
              </div>
            )}

            {guestFile && (
              <Dialog open={true} onClose={() => setGuestFile(null)}>
                <div className="p-6 bg-white rounded-lg shadow-lg">
                  <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
                    Success! Your file has been uploaded.
                  </h2>
                  <p className="text-center text-gray-600 mb-4">
                    Your file has been successfully uploaded. You can access it
                    using the link below:
                  </p>
                  <div className="mb-6 text-center">
                    <a
                      href={guestFile.publicUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {import.meta.env.VITE_FRONTEND_API_URL}/{guestFile.random}
                    </a>
                  </div>
                  <div className="flex justify-center space-x-4">
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        const urlToCopy = `${
                          import.meta.env.VITE_FRONTEND_API_URL
                        }/${guestFile.random}`;
                        navigator.clipboard
                          .writeText(urlToCopy)
                          .then(() => {
                            toast.success("Link copied to clipboard!");
                          })
                          .catch(() => {
                            toast.error("Failed to copy the link.");
                          });
                      }}
                      className="flex items-center space-x-2"
                    >
                      <ArrowCircleRight className="mr-2" />
                      <span>Copy URL</span>
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => setGuestFile(null)}
                      className="flex items-center space-x-2"
                    >
                      <span>Close</span>
                    </Button>
                  </div>
                </div>
              </Dialog>
            )}
          </div>
        )}
      </div>

      <Dialog open={isShareDialogOpen} onClose={handleShareDialogClose}>
        <div className="p-6 w-[400px]">
          <h3 className="text-lg font-bold">Share your file</h3>
          <TextField
            label="Custom URL (optional)"
            fullWidth
            className="mt-4"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
          />
          <FormControl component="fieldset" className="mt-4">
            <RadioGroup
              value={shareOption}
              onChange={(e) => setShareOption(e.target.value)}
            >
              <FormControlLabel
                value="public"
                control={<Radio />}
                label="Public"
              />
              <FormControlLabel
                value="private"
                control={<Radio />}
                label="Private (Share via email)"
              />
            </RadioGroup>
          </FormControl>

          {shareOption === "private" && (
            <div>
              {emails.map((email, index) => (
                <TextField
                  key={index}
                  label={`Email ${index + 1}`}
                  fullWidth
                  className="mt-2"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e)}
                />
              ))}
              <Button onClick={handleAddEmail} className="mt-2" size="small">
                Add another email
              </Button>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button onClick={handleShareDialogClose} color="secondary">
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleShare}
              disabled={!selectedFile || loading}
            >
              {loading ? "Generating URL..." : "Share"}
            </Button>
          </div>
        </div>
      </Dialog>
      <footer className="mt-auto">
        <hr />
        <Footer />
      </footer>
    </div>
  );
};

export default HomePage;
