import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Styles/toggle.css";
import "../Styles/file.css";
import "../Styles/input.css";

const getWebhookInfo = async (webhookUrl) => {
  try {
    const response = await axios.get(webhookUrl);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching webhook info:", error);
    return null;
  }
};

const DiscordFileUploader = () => {
  const [file, setFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [nitro, setNitro] = useState(false);
  const [maxFileSize, setMaxFileSize] = useState(25 * 1024 * 1024);
  const [webhookUrl, setWebhookUrl] = useState(
    localStorage.getItem("webhookurl") || ""
  );
  const [inputURL, setInputURL] = useState("");
  //   const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

  const [serverInfo, setServerInfo] = useState({
    guildName: "",
    channelName: "",
  });

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
      <h1>Upload File to Discord</h1>
      <p>
        {serverInfo.guildName === ""
          ? "Server Not Set"
          : `Server//${serverInfo.guildName}`}
      </p>
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

      <p>{statusMessage}</p>

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

export default DiscordFileUploader;
