import { ArrowCircleRight } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
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
  gsap.registerPlugin(ScrollTrigger);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState({});
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareOption, setShareOption] = useState("public");
  const [email, setEmail] = useState("");
  const [customUrl, setCustomUrl] = useState("");
  const [emails, setEmails] = useState([""]);
  const [loading, setLoading] = useState(false);
  const baseApi = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch()
  const [progress, setProgress] = useState(0);


  const {fileId} = useParams()

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

    let fileId ;
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

      const { url, downloadUrl , publicUrl} = response.data;
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
        let res  =  await dispatch(uploadGuestFile({selectedFile, downloadUrl,publicUrl}))
        setProgress(0);
        setIsShareDialogOpen(false);
        fileId= res.payload.data.id
        if(res.payload.success==false) {
          toast.error(res.payload.message)
          return
        }
      }
    } catch (error) {
      setProgress(0);
    } finally{
      setLoading(false);
    }

  

    const sharedUrl = customUrl ? `${customUrl}` : `${import.meta.env.VITE_FRONTEND_API_URL}/home/${fileId}`;

    navigator.clipboard.writeText(sharedUrl).then(() => {
      toast.success("Link copied to clipboard!");
    });

    if (shareOption === "public") {
      toast.info(`File shared publicly.`);
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

    gsap.from(".hero-heading", {
      opacity: 100,
      y: -50,
      duration: 1,
      ease: "power4.out",
    });
    gsap.from(".hero-subheading", {
      opacity: 0,
      y: -30,
      duration: 1,
      delay: 0.3,
      ease: "power4.out",
    });
    gsap.from(".hero-button", {
      opacity: 100,
      y: 0,
      duration: 1,
      delay: 0.5,
      ease: "power4.out",
    });
    gsap.from(".hero-img", {
      opacity: 0,
      x: -50,
      duration: 1,
      delay: 0.7,
      ease: "power4.out",
    });
   

    gsap.utils
      .toArray(
        ".hero-heading, .hero-subheading, .hero-button, .hero-img, .content-section"
      )
      .forEach((el) => {
        gsap.from(el, {
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "top 50%",
            scrub: true,
            markers: false,
          },
          opacity: 0,
          y: 30,
          duration: 1,
          ease: "power4.out",
        });
      });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <HomeNav />
      <div
        className={`${
          isScrolled ? "bg-white text-black" : "bg-black text-white"
        } px-6 pt-16 text-center transition-all duration-500 ease-in-out`}
      >
        <h1 className="hero-heading text-4xl font-bold mt-40 opacity-100">
          Get to work, with a lot less work
        </h1>
        <h4 className="hero-subheading text-xl mb-8 opacity-100">
          Storify delivers tools that help you move your work forward faster,
          keep it safe, and let you collaborate with ease.
        </h4>
        <div className="flex gap-6 items-center mx-auto w-full justify-center pb-20">
          <button className="hero-button  px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-400 transition-all duration-300 ease-in-out">
            Signup Free
          </button>
          <div className="flex items-center mt-4">
            <u className="cursor-pointer text-lg hover:text-blue-500 transition-all duration-300">
              <Link to="/pricing">Find your plan</Link>
            </u>
            <ArrowCircleRight className="ml-2 text-xl" />
          </div>
        </div>

        {fileId &&<GuestFile/> }

        <div className="mb-16">
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
        </div>

        <div className="relative mx-auto w-[80%] hero-img">
          <img
            src="https://fjord.dropboxstatic.com/warp/conversion/dropbox/warp/en-us/test/homepageredesign2024/hero/all-files-desktop.png?id=75a3b2c3-59ab-45f6-bdaa-fa64bac618e7&width=2880&output_type=png"
            alt="Desktop Illustration"
            className="transition-all duration-500 transform hover:scale-105"
          />
          <img
            className="absolute right-auto md:-right-20 h-[80%] top-1/2 -translate-y-1/2 transition-all duration-500 transform hover:scale-105"
            src="https://fjord.dropboxstatic.com/warp/conversion/dropbox/warp/en-us/test/homepageredesign2024/hero/all-files-laptop.png?id=75a3b2c3-59ab-45f6-bdaa-fa64bac618e7&width=2880&output_type=png"
            alt="Laptop Illustration"
          />
        </div>
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
                {loading ? 'Generating URL...' : 'Share'}
            </Button>
          </div>
        </div>
      </Dialog>

      <Footer />
    </>
  );
};

export default HomePage;
