import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Typography
} from '@mui/material';
import { DonutChart, EnergyTrendChart, TrendLineChart } from '../Chart';

import { useFetchInsights } from '../../api';
import { useState } from 'react';

export const InsightsList = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { insights, isLoading, error } = useFetchInsights(apiUrl);
  const [selectedChart, setSelectedChart] = useState<string>('DonutChart');

  const handleChartChange = (event: SelectChangeEvent<string>) => {
    setSelectedChart(event.target.value);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {isLoading && <Typography>Loading insights...</Typography>}
      {error && <Typography color="error">Error fetching insights: {error}</Typography>}

      {!isLoading && !error && insights && (
        <>
          <Box sx={{ mb: 4 }}>
            <FormControl fullWidth>
              <InputLabel id="chart-selector-label">Select a Chart</InputLabel>
              <Select
                labelId="chart-selector-label"
                id="chartSelector"
                value={selectedChart}
                label="Select a Chart"
                onChange={handleChartChange}
                sx={{ mb: 2 }}
              >
                <MenuItem value="DonutChart">Donut Chart</MenuItem>
                <MenuItem value="EnergyTrendChart">Energy Trend Chart</MenuItem>
                <MenuItem value="TrendLineChart">Trend Line Chart</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Paper elevation={3} sx={{padding: 2}}>
                {selectedChart === 'DonutChart' && <DonutChart data={insights} />}
                {selectedChart === 'EnergyTrendChart' && <EnergyTrendChart data={insights} />}
                {selectedChart === 'TrendLineChart' && <TrendLineChart data={insights} />}
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};
