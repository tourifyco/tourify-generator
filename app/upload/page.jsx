'use client';

import { useState } from 'react';

export default function UploadPage() {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.length) return;

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    alert(result.message || 'Upload complete!');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Upload Property Photos</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />
        <br /><br />
        <button type="submit">Generate Video Tour</button>
      </form>
    </div>
  );
}
