import { Box, Container, Typography } from '@mui/material';

import { InsightsList } from "../../components";

export const Home = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" gutterBottom>
          Data Visualisation Dashboard
        </Typography>
      </Box>
      <InsightsList />
    </Container>
  );
};
