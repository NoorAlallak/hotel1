import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLanguage } from "../Context/LanguageContext";

const Media = () => {
  const { t } = useLanguage();
  const [media, setMedia] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const res = await axios.get("http://localhost:3000/media", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedia(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMedia();
  }, []);

  const handleFileSelect = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("files[]", file));

    try {
      const res = await axios.post("http://localhost:3000/media", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (progressEvent) => {
          setUploadProgress(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        },
      });
      setMedia([...media, ...res.data]);
      setSelectedFiles([]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // --- Delete Media ---
  const deleteMedia = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`http://localhost:3000/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMedia(media.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t("media")}</h2>
        <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center cursor-pointer">
          <i className="fas fa-cloud-upload-alt mr-2"></i>
          Upload Files
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*"
          />
        </label>
      </div>

      {/* Upload Section */}
      {selectedFiles.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium mb-4">
            Upload Files ({selectedFiles.length} selected)
          </h3>
          <div className="space-y-4">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div className="flex items-center">
                  <i className="fas fa-image text-gray-400 text-xl mr-3"></i>
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setSelectedFiles(
                      selectedFiles.filter((_, i) => i !== index)
                    )
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}

            {isUploading && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
              >
                {isUploading ? "Uploading..." : "Start Upload"}
              </button>
              <button
                onClick={() => setSelectedFiles([])}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {media.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              <img
                src={`http://localhost:3000${item.url}`}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm truncate">{item.name}</h3>
                <button
                  onClick={() => deleteMedia(item.id)}
                  className="text-red-500 hover:text-red-700 ml-2"
                >
                  <i className="fas fa-trash text-xs"></i>
                </button>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{item.size}</span>
                <span>
                  {new Date(item.uploaded).toISOString().split("T")[0]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {media.length === 0 && (
        <div className="text-center py-12">
          <i className="fas fa-images text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500">No media files uploaded yet.</p>
        </div>
      )}
    </div>
  );
};

export default Media;
