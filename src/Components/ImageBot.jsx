import React, { useState } from "react";
import axios from "axios";
import "../Styles/toggle.css";
import "../Styles/file.css";

const DiscordFileUploader = () => {
  const [file, setFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [nitro, setNitro] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState(25 * 1024 * 1024);
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile.name);

    // Validate file size
    nitro ? setMaxFileSize(50 * 1024 * 1024) : setMaxFileSize(25 * 1024 * 1024);

    if (selectedFile && selectedFile.size <= maxFileSize) {
      setFile(selectedFile);
      setStatusMessage(`Selected file: ${selectedFile.name}`);
    } else {
      setStatusMessage("Uh Oh! File size exceeds the 25MB limit.");
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setStatusMessage("Please select a valid file first.");
      return;
    }

    try {
      setStatusMessage("Uploading file...");
      const formData = new FormData();
      formData.append("file", file);

      //Adding a message with the file upload
      formData.append(
        "payload_json",
        JSON.stringify({ content: `File: ${file.name}` })
      );

      const response = await axios.post(webhookUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      //   console.log(response.status);

      if (response.status >= 200 && response.status <= 299) {
        setStatusMessage(`${file.name} uploaded successfully!`);
        setFile(null); // Clear file selection
      } else {
        setStatusMessage("Failed to upload the file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setStatusMessage(
        "An error occurred during the upload. Please check your webhook URL."
      );
    }
  };

  const handleToggle = () => {
    setNitro((prevState) => !prevState);
  };

  return (
    <div className="file-uploader">
      <h1>Upload File to Discord</h1>
      <div className="file-input-wrapper">
        <label className="custom-file-input">
          <span className="file-input-button">Choose File</span>
          <span className="file-name">
            {file ? file.name : "No file selected"}
          </span>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden-file-input"
          />
        </label>
        <button onClick={handleUpload} disabled={!file || !webhookUrl}>
          Upload File
        </button>
      </div>

      {/* <input type="file" onChange={handleFileChange} /> */}

      <p>{statusMessage}</p>

      <div className="toggle-container">
        <div className="toggle-switch">
          <input
            id="toggle"
            type="checkbox"
            checked={nitro}
            onChange={handleToggle}
          />
          <span className="slider"></span>
        </div>
        <label htmlFor="toggle" className="toggle-label">
          <h2>{nitro ? "Nitro User" : "Non-Nitro User"}</h2>
        </label>
      </div>
    </div>
  );
};

export default DiscordFileUploader;
