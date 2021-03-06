// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2020 grammm GmbH

import { createMuiTheme } from '@material-ui/core/styles';

import grey from './colors/grey';
import blue from './colors/blue';

const mode = window.localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light';

const theme = createMuiTheme({
  overrides: {
    MuiFormControlLabel: {
      root: {
        color: mode === 'light' ? '#333' : '#fff',
      },
    },
    MuiPaper: {
      elevation1: {
        borderRadius: 8,
        margin: 16,
        boxShadow: mode === 'light' ? '0px 3px 3px -2px rgba(0, 0, 0, 0.06),0px 3px 4px 0px rgba(0, 0, 0, 0.042),0px 1px 8px 0px rgba(0, 0, 0, 0.036)' : '0 0 1px 0 rgba(0,0,0,0.70), 0 3px 4px -2px rgba(0,0,0,0.50)',
      },
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: mode === 'light' ? '#fff' : blue[600],
        color: mode === 'light' ? '#333' : '#fff',
        boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.06),0px 8px 10px 1px rgba(0, 0, 0, 0.042),0px 3px 14px 2px rgba(0, 0, 0, 0.036)',
      },
    },
    MuiTableCell: {
      head: {
        height: '30px',
        padding: '10px 16px',
      },
      body: {
        height: '40px',
        border: 'none',
      },
    },
    MuiTableRow: {
      hover: {
        '&:hover': {
          backgroundColor: '#ddd',
          cursor: 'pointer',
        },
      },
    },
    MuiButton: {
      contained: {
        boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.06), 0px 8px 10px 1px rgba(0, 0, 0, 0.042), 0px 3px 14px 2px rgba(0, 0, 0, 0.036)',
      
        '&.Mui-disabled': {
          background: 'linear-gradient(#e0e0e0, #e0e0e0)',
          color: '#999',
        },
      },
      containedPrimary: {
        background: 'linear-gradient(150deg, #56CCF2, #2F80ED)',
      },
      containedSecondary: {
        background: 'linear-gradient(150deg, #FF512F, #DD2476)',
        color: '#fff',
      },
    },
    MuiGridListTile: {
      tile: {
        display: 'flex',
        flex: 1,
      },
    },
    MuiTooltip: {
      tooltip: {
        fontSize: 14,
      },
    },
  },
  MuiIconButton: {
    root: {
      color: 'red !important',
    },
  },
  typography: {
    h1: {
      color: mode === 'light' ? '#333' : '#fff',
      fontSize: '2em',
      fontWeight: 'bold',
    },
    h2: {
      color: mode === 'light' ? '#333' : '#fff',
      fontSize: '1.5em',
      fontWeight: 'bold',
    },
  },
  palette: {
    type: mode,
    primary: blue,
    secondary: grey,
    background: {
      paper: mode === 'light' ? '#fff' : '#2d323b',
    },
  },
});

export default theme;
