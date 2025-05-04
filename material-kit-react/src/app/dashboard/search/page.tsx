import { useState } from 'react';
import {
  Box, Card, CardContent, TextField, Button, Typography, Grid, CircularProgress, Alert, MenuItem
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState('twitter');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

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
    <Box sx={{ py: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Social Media Search
          </Typography>
          <form onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  label="Keyword, Username, or Hashtag"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={loading}
                />
              </Grid>
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
                  disabled={loading || !query.trim()}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {results.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Search Results
              </Typography>
              {results.map((result, idx) => (
                <Card key={idx} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary">
                      {result.platform} • {result.username}
                    </Typography>
                    <Typography variant="body1">{result.text}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {result.timestamp}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}