import React, { useState } from "react";
import axios from "axios";

const ImageBot = () => {
  const [imageFile, setImageFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const webhookUrl = import.meta.env.VITE_WEBHOOK_URL;

  const handleImageChange = (e) => {
    console.log(e);
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!imageFile) {
      setStatusMessage("Please select an image file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append(
      "payload_json",
      JSON.stringify({ content: "Here is an image!" })
    );

    try {
      setStatusMessage("Uploading...");
      await axios.post(webhookUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setStatusMessage("Image uploaded successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      setStatusMessage("Failed to upload the image. Please try again.");
    }
  };

  return (
    <div className="image-uploader">
      <h1>Upload an Image to Discord</h1>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{statusMessage}</p>
    </div>
  );
};

export default ImageBot;
