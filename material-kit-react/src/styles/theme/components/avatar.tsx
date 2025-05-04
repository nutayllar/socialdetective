// src/styles/theme/components/avatar.tsx
import type { Components, Theme } from '@mui/material/styles';

export const MuiAvatar: Components<Theme>['MuiAvatar'] = {
  styleOverrides: {
    root: {
      // Example: border and shadow
      border: '2px solid #fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
  },
};