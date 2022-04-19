import * as React from 'react';
import { Box, Typography } from '@mui/material';

export function DefaultLegend() {
  return (
    <Box paddingLeft={2}>
      <Typography color="textSecondary">Select Points in the Embedding Space to show a Summary Visualization.</Typography>
    </Box>
  );
}
