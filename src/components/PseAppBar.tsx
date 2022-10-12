import { AppBar, Toolbar } from '@mui/material';
import * as React from 'react';

export function PseAppBar({ children, style }) {
  return (
    <AppBar variant="outlined" position="relative" color="transparent" elevation={0} style={style}>
      <Toolbar>{children}</Toolbar>
    </AppBar>
  );
}
