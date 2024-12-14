import React, { useState } from "react";
import axios from "axios";

const DiscordFileUploader = () => {
  const [file, setFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile.name);

    // Validate file size (Discord limit: 25MB)
    if (selectedFile && selectedFile.size <= 25 * 1024 * 1024) {
      setFile(selectedFile);
      setStatusMessage(`Selected file: ${selectedFile.name}`);
    } else {
      setStatusMessage("File size exceeds the 25MB limit.");
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

      // Optional: Add a message with the file upload
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

  return (
    <div className="file-uploader">
      <h1>Upload File to Discord</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!file || !webhookUrl}>
        Upload File
      </button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default DiscordFileUploader;
