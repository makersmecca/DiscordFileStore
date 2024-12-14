import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/toggle.css";
import "../Styles/file.css";
import "../Styles/input.css";

const getWebhookInfo = async (webhookUrl) => {
  try {
    const response = await axios.get(webhookUrl);
    return response.data;
  } catch (error) {
    console.error("Error fetching webhook info:", error);
    return null;
  }
};

const FileBot = () => {
  const [files, setFiles] = useState([]);
  const [statusMessages, setStatusMessages] = useState([]);
  const [nitro, setNitro] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState(25 * 1024 * 1024); // Default: 25MB
  const [webhookUrl, setWebhookUrl] = useState(
    localStorage.getItem("webhookurl") || ""
  );
  const [inputURL, setInputURL] = useState("");
  const [serverInfo, setServerInfo] = useState({
    guildName: "",
    channelName: "",
  });

  const [uploadBtnStatus, setUploadBtnStatus] = useState("");

  useEffect(() => {
    const fetchWebhookInfo = async () => {
      if (webhookUrl) {
        const info = await getWebhookInfo(webhookUrl);
        if (info) {
          setServerInfo({
            guildName: info.guild_id,
            channelName: info.channel_id,
          });
        }
      }
    };

    fetchWebhookInfo();
  }, [webhookUrl]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);

    nitro ? setMaxFileSize(50 * 1024 * 1024) : setMaxFileSize(25 * 1024 * 1024);

    // Validate file sizes
    const validFiles = selectedFiles.filter((file) => file.size <= maxFileSize);
    const invalidFiles = selectedFiles.filter(
      (file) => file.size > maxFileSize
    );

    if (invalidFiles.length > 0) {
      alert(
        `Some files exceeded the ${
          maxFileSize / (1024 * 1024)
        }MB limit and were excluded.`
      );
    }

    setFiles(validFiles);
    setStatusMessages([]); // Clear status messages for new file selection
  };

  const handleUploadBtn = () => {
    setUploadBtnStatus("Uploading...");
    handleUpload();
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      alert("Please select at least one valid file.");
      return;
    }

    if (!webhookUrl) {
      alert("Please provide a valid Discord webhook URL.");
      return;
    }

    const uploadStatuses = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      formData.append(
        "payload_json",
        JSON.stringify({ content: `File: ${file.name}` })
      );

      try {
        const response = await axios.post(webhookUrl, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.status >= 200 && response.status <= 299) {
          uploadStatuses.push(`${file.name} uploaded successfully!`);
        } else {
          uploadStatuses.push(`Failed to upload ${file.name}`);
        }
      } catch (error) {
        console.error(`Error uploading ${file.name}:`, error);
        uploadStatuses.push(`Error uploading ${file.name}`);
      }
    }

    setStatusMessages(uploadStatuses);
    setFiles([]); // Clear file selection after upload
  };

  const handleToggle = () => {
    setNitro((prevState) => !prevState);
  };

  const handleChangeWebhook = (e) => {
    e.preventDefault();
    setInputURL(e.target.value);
  };

  const handleSubmitWebHook = (e) => {
    e.preventDefault();
    localStorage.setItem("webhookurl", inputURL);
    setWebhookUrl(inputURL);
    setInputURL("");
  };

  return (
    <div className="file-uploader">
      <h1>Upload Files to Discord</h1>
      <p>
        {serverInfo.guildName === ""
          ? "Server Not Set"
          : `Server: ${serverInfo.guildName}`}
      </p>
      <div className="file-input-wrapper">
        <label className="custom-file-input">
          <span className="file-input-button">Choose Files</span>
          <span className="file-name">
            {files.length > 0
              ? `${files.length} file(s) selected`
              : "No files selected"}
          </span>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden-file-input"
          />
        </label>
        <button
          onClick={handleUploadBtn}
          disabled={files.length === 0 || !webhookUrl}
        >
          Upload Files
        </button>
      </div>

      <ul className="file-list">
        {files.map((file, index) => (
          <li key={index}>
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB){" "}
            {uploadBtnStatus}
          </li>
        ))}
      </ul>

      <p>{statusMessages.length > 0 && "Upload Status:"}</p>
      <ul className="file-list">
        {statusMessages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>

      <div className="webhook-container">
        <input
          type="text"
          className="webhook-input"
          placeholder={`${webhookUrl ? webhookUrl : "Your Webhook URL"}`}
          onChange={handleChangeWebhook}
          value={inputURL}
        />
        <button
          type="button"
          className="webhook-button"
          onClick={handleSubmitWebHook}
        >
          {webhookUrl ? "Update" : "Set"}
        </button>
      </div>

      <div className="toggle-container">
        <label className="toggle-switch">
          <input
            id="toggleSwitch"
            type="checkbox"
            checked={nitro}
            onChange={handleToggle}
          />
          <span className="slider"></span>
        </label>
        <label htmlFor="toggleSwitch" className="toggle-label">
          <h2>{nitro ? "Nitro User" : "Non-Nitro User"}</h2>
        </label>
      </div>
    </div>
  );
};

export default FileBot;
