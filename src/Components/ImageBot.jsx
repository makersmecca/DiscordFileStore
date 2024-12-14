import { useState } from "react";

function DiscordImageSender() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [status, setStatus] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleWebhookChange = (event) => {
    setWebhookUrl(event.target.value);
  };

  const sendImage = async () => {
    if (!selectedFile || !webhookUrl) {
      setStatus("Please select a file and enter webhook URL");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch(webhookUrl, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setStatus("Image sent successfully!");
        setSelectedFile(null);
      } else {
        setStatus("Failed to send image");
      }
    } catch (error) {
      setStatus("Error: " + error.message);
    }
  };

  return (
    <div className="discord-sender">
      <h2>Discord Image Sender</h2>

      <div>
        <input
          type="text"
          placeholder="Enter Discord Webhook URL"
          onChange={handleWebhookChange}
          value={webhookUrl}
        />
      </div>

      <div>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <button onClick={sendImage} disabled={!selectedFile || !webhookUrl}>
        Send Image
      </button>

      {status && <p>{status}</p>}
    </div>
  );
}

export default DiscordImageSender;
