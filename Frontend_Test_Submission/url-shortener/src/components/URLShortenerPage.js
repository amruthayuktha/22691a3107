import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper, Alert } from '@mui/material';

const URLShortenerPage = () => {
  const [urls, setUrls] = useState([{ longUrl: '', validity: '', customShortcode: '' }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleAddUrl = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: '', customShortcode: '' }]);
    }
  };

  const handleChange = (index, event) => {
    const newUrls = [...urls];
    newUrls[index][event.target.name] = event.target.value;
    setUrls(newUrls);
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    setResults([]);

    const validUrls = urls.every(url => validateUrl(url.longUrl));
    if (!validUrls) {
      setError('Please enter valid URLs.');
      return;
    }

    const newResults = urls.map(url => {
      const shortCode = url.customShortcode || Math.random().toString(36).substring(2, 8);
      const validity = url.validity || 30;
      const expiryDate = new Date(Date.now() + validity * 60000).toLocaleString();
      const shortUrl = `http://localhost:3000/${shortCode}`;

      // Save to local storage to simulate persistence
      const storedUrls = JSON.parse(localStorage.getItem('shortenedUrls')) || {};
      storedUrls[shortCode] = {
        longUrl: url.longUrl,
        createdAt: new Date().toLocaleString(),
        expiresAt: expiryDate,
        clicks: 0,
        clickData: []
      };
      localStorage.setItem('shortenedUrls', JSON.stringify(storedUrls));


      return {
        longUrl: url.longUrl,
        shortUrl: shortUrl,
        expiresAt: expiryDate,
      };
    });

    setResults(newResults);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Shorten URLs
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        {urls.map((url, index) => (
          <Paper key={index} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">URL #{index + 1}</Typography>
            <TextField
              fullWidth
              label="Long URL"
              name="longUrl"
              value={url.longUrl}
              onChange={(e) => handleChange(index, e)}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Validity (minutes)"
              name="validity"
              type="number"
              value={url.validity}
              onChange={(e) => handleChange(index, e)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Custom Shortcode (optional)"
              name="customShortcode"
              value={url.customShortcode}
              onChange={(e) => handleChange(index, e)}
              margin="normal"
            />
          </Paper>
        ))}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Button variant="contained" onClick={handleAddUrl} disabled={urls.length >= 5}>
            Add Another URL
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Shorten
          </Button>
        </Box>
      </form>
      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5">Results</Typography>
          {results.map((result, index) => (
            <Paper key={index} sx={{ p: 2, mt: 2 }}>
              <Typography>Original URL: {result.longUrl}</Typography>
              <Typography>Short URL: <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">{result.shortUrl}</a></Typography>
              <Typography>Expires At: {result.expiresAt}</Typography>
            </Paper>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default URLShortenerPage;
