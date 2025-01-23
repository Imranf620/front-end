import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { getGuestFile } from "../../features/filesSlice";
import Loader from "../../pages/Loader/Loader";

const GuestFile = () => {
  const location = useLocation();
  const fileId = location.pathname.replace(/^\/+/, "");
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileError, setFileError] = useState(false);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        console.log("file loading", fileId);
        const response = await dispatch(getGuestFile(fileId));
        setFile(response.payload.data);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchFile();
  }, [fileId, dispatch]);

  if (isLoading) return <Loader />;

  if (!file) {
    return <div>No file found.</div>;
  }

  const { fileUrl, name, size, type } = file;

  const handleDownload = async (e) => {
    e.preventDefault();
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const link = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    link.href = url;
    link.download = name;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
      <h3 className="text-3xl font-semibold text-center text-gray-800 mb-4">
        {name}
      </h3>
      <p className="text-lg text-center text-gray-600 mb-6">
        Size: {size < 1024 ? `${size.toFixed(2)} B` : size < 1024 * 1024 ? `${(size / 1024).toFixed(2)} KB` : size < 1024 * 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(2)} MB` : `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`}
      </p>

      <div className="text-center mb-6">
        {type.startsWith("image") && (
          <img src={fileUrl} alt={name} className="max-w-full max-h-96 mx-auto object-contain" onError={() => setFileError(true)} />
        )}
        {type.startsWith("audio") && (
          <audio controls src={fileUrl} className="max-w-full" onError={() => setFileError(true)}>
            Your browser does not support the audio element.
          </audio>
        )}
        {type.startsWith("video") && (
          <video controls className="w-full max-h-96 mx-auto object-contain" onError={() => setFileError(true)}>
            <source src={fileUrl} type="video/mp4" />
            Your browser does not support the video element.
          </video>
        )}
      </div>

      <div className="flex justify-center gap-6">
        {type === "application/pdf" ? (
          <button
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-md hover:bg-blue-700 transition duration-300 transform hover:scale-105"
            onClick={openModal}
          >
            View File
          </button>
        ) : null}
        <button
          className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-800 text-white rounded-md hover:bg-green-700 transition duration-300 transform hover:scale-105"
          onClick={handleDownload}
        >
          Download File
        </button>
      </div>

      {isModalOpen && type === "application/pdf" && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full shadow-lg">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-semibold text-black">File Preview</h4>
              <button className="text-red-500 font-semibold" onClick={closeModal}>Close</button>
            </div>
            <div className="mt-4 text-center">
              {fileError ? (
                <p className="text-red-500">File preview is not available.</p>
              ) : (
                <iframe src={fileUrl} className="w-full h-96" style={{ border: "none" }} onError={() => setFileError(true)}></iframe>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestFile;
