'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [videoURL, setVideoURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setVideoURL(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a photo first!");

    setIsLoading(true);
    setError('');
    setVideoURL(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.video_url) {
        alert("✅ Video generated successfully!");
        setVideoURL(data.video_url);
      } else {
        alert("❌ Something went wrong generating your video.");
        setError(data.message || 'Error generating video.');
        console.error(data.details);
      }
    } catch (err) {
      alert("❌ Network or server error.");
      setError('Unexpected error. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Tourify AI – 👀 TEST VERSION</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
        <br /><br />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Generating Video...' : 'Generate Video Tour'}
        </button>
      </form>

      <br />
      {videoURL && (
        <div>
          <h2>Your Video Tour:</h2>
          <video width="480" controls src={videoURL} />
          <p><a href={videoURL} target="_blank" rel="noopener noreferrer">Download Video</a></p>
        </div>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
