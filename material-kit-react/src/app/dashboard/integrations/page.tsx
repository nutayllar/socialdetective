"use client";
import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([
    {
      platform: 'Twitter',
      username: 'john_doe',
      text: 'This is a test tweet!',
      timestamp: new Date().toISOString(),
      sentiment: { label: 'Positive', score: 0.85 }
    }
  ]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);
    try {
      const response = await fetch('/api/search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ query, platform }),
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4">Social Search</Typography>
      <Box component="form" onSubmit={handleSearch} sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <TextField
              fullWidth
              label="Keyword, Username, or Hashtag"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={loading}
            />
          </Grid>
          <Grid xs={12} md={3}>
            <TextField
              select
              fullWidth
              label="Platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              disabled={loading}
            >
              <MenuItem value="twitter">Twitter</MenuItem>
              <MenuItem value="instagram">Instagram</MenuItem>
            </TextField>
          </Grid>
          <Grid xs={12} md={3}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading || !query.trim()}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Search
            </Button>
          </Grid>
        </Grid>
      </Box>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && results.length > 0 && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {results.map((result, idx) => (
            <Grid key={idx} xs={12} md={6} lg={4}>
              <Box sx={{
                border: '1px solid #eee',
                borderRadius: 2,
                p: 2,
                bgcolor: 'background.paper',
                boxShadow: 1,
              }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    {result.platform}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    • {result.username}
                  </Typography>
                </Stack>
                <Typography variant="body1" sx={{ mb: 1 }}>{result.text}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  {new Date(result.timestamp).toLocaleString()}
                </Typography>
                {result.sentiment && (
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Sentiment: <b>{result.sentiment.label}</b> ({result.sentiment.score})
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}