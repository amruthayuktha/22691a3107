import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const URLShortenerStatisticsPage = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const storedUrls = JSON.parse(localStorage.getItem('shortenedUrls')) || {};
    const statsData = Object.entries(storedUrls).map(([shortCode, data]) => ({
      shortUrl: `http://localhost:3000/${shortCode}`,
      ...data
    }));
    setStats(statsData);
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        URL Shortener Statistics
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell>Clicks</TableCell>
              <TableCell>Click Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.map((stat, index) => (
              <TableRow key={index}>
                <TableCell><a href={stat.shortUrl} target="_blank" rel="noopener noreferrer">{stat.shortUrl}</a></TableCell>
                <TableCell>{stat.longUrl}</TableCell>
                <TableCell>{stat.createdAt}</TableCell>
                <TableCell>{stat.expiresAt}</TableCell>
                <TableCell>{stat.clicks}</TableCell>
                <TableCell>
                  {stat.clickData.map((click, i) => (
                    <div key={i}>
                      {click.timestamp} - {click.source} - {click.location}
                    </div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default URLShortenerStatisticsPage;
