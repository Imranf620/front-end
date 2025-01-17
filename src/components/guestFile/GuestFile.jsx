import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getGuestFile } from "../../features/filesSlice";
import Loader from "../../pages/Loader/Loader";

const GuestFile = () => {
  const { fileId } = useParams();
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFileLoading, setIsFileLoading] = useState(true);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await dispatch(getGuestFile(fileId));
        setFile(response.payload.data);
        console.log(response.payload.data);
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

  const handleFileLoaded = () => setIsFileLoading(false);

  return (
    <div className="bg-white bg-opacity-60 p-6 rounded-lg shadow-lg max-w-xs mx-auto">
      <h3 className="text-xl font-semibold text-center text-gray-800">
        {name}
      </h3>
      <p className="text-sm text-center text-gray-600">
  Size: {size < 1024 ? `${(size).toFixed(2)} B` : size < 1024 * 1024 ? `${(size / 1024).toFixed(2)} KB` : size < 1024 * 1024 * 1024 ? `${(size / (1024 * 1024)).toFixed(2)} MB` : `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`}
</p>

      <div className="mt-4 text-center space-x-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          onClick={openModal}
        >
          View File
        </button>

        <button
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
          onClick={handleDownload}
        >
          Download File
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full">
            <div className="flex justify-between items-center">
              <h4 className="text-xl text-black font-semibold">File Preview</h4>
              <button
                className="text-red-500 font-semibold"
                onClick={closeModal}
              >
                Close
              </button>
            </div>

            <div className="mt-4 text-center">
              {type.startsWith("image") && (
                <img
                  src={fileUrl}
                  alt={name}
                  className="max-w-full max-h-96  mx-auto object-contain"
                  onLoad={handleFileLoaded}
                />
              )}

              {type.startsWith("audio") && !isFileLoading && (
                <audio
                  controls
                  src={fileUrl}
                  className="max-w-full"
                  onLoadedData={handleFileLoaded}
                >
                  Your browser does not support the audio element.
                </audio>
              )}
              {type === "application/pdf" && (
                <div className="mt-4 text-center">
                  <iframe
                    src={fileUrl}
                    className="w-full h-96"
                    style={{ border: "none" }}
                    onLoad={handleFileLoaded}
                  ></iframe>
                </div>
              )}

              {type.startsWith("video") && (
                <div className="mt-4 text-center">
                  <video
                    controls
                    className="w-full h-auto max-w-full mx-auto"
                    style={{
                      maxWidth: "100%",
                      height: "auto",
                      aspectRatio: "16/9",
                    }}
                  >
                    <source src={fileUrl} type="video/mp4" />
                    Your browser does not support the video element.
                  </video>
                </div>
              )}

              {!isFileLoading &&
                !type.startsWith("image") &&
                !type.startsWith("audio") &&
                !type.startsWith("video") &&
                ![
                  "application/pdf",
                  "application/msword",
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                ].includes(type) && <p>Cannot preview this file type</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GuestFile;
