import { Box, Card, CardContent, Typography, Chip, Stack } from '@mui/material';
import { SentimentVerySatisfied, SentimentVeryDissatisfied, Tag } from '@mui/icons-material';

interface SearchResult {
  id: string;
  platform: string;
  username: string;
  content: string;
  timestamp: string;
  sentiment: {
    score: number;
    label: string;
  };
  entities: Array<{
    text: string;
    type: string;
  }>;
}

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
  return (
    <Stack spacing={2}>
      {results.map((result) => (
        <Card key={result.id}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="subtitle1" color="text.secondary">
                {result.platform} • {result.username}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(result.timestamp).toLocaleString()}
              </Typography>
            </Box>

            <Typography paragraph>
              {result.content}
            </Typography>

            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              {result.sentiment.score > 0 ? (
                <Chip
                  icon={<SentimentVerySatisfied />}
                  label={`Positive (${result.sentiment.score.toFixed(2)})`}
                  color="success"
                  size="small"
                />
              ) : (
                <Chip
                  icon={<SentimentVeryDissatisfied />}
                  label={`Negative (${result.sentiment.score.toFixed(2)})`}
                  color="error"
                  size="small"
                />
              )}
            </Box>

            {result.entities.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {result.entities.map((entity, index) => (
                  <Chip
                    key={index}
                    icon={<Tag />}
                    label={`${entity.text} (${entity.type})`}
                    size="small"
                    variant="outlined"
                  />
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
} 