import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

const RedirectHandler = () => {
  const { shortCode } = useParams();
  const [message, setMessage] = useState('Redirecting...');

  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem('shortenedUrls')) || {};
    const urlData = storedUrls[shortCode];

    if (urlData) {
      // Log the click
      urlData.clicks += 1;
      urlData.clickData.push({
        timestamp: new Date().toLocaleString(),
        source: document.referrer || 'Direct',
        location: 'Unknown' // In a real app, you'd use an IP lookup service
      });
      localStorage.setItem('shortenedUrls', JSON.stringify(storedUrls));

      window.location.href = urlData.longUrl;
    } else {
      setMessage('URL not found');
    }
  }, [shortCode]);

  return (
    <Container>
      <Typography>{message}</Typography>
    </Container>
  );
};

export default RedirectHandler;
