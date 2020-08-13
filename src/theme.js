import { createMuiTheme } from '@material-ui/core/styles';

import grey from './colors/grey';
import brightBlue from './colors/brightBlue';
import blue from './colors/blue';

const mode = window.localStorage.getItem('darkMode') === 'true' ? 'dark' : 'light';

const theme = createMuiTheme({
  overrides: {
    MuiAppBar: {
      positionAbsolute: {
        boxShadow: 'none',
      },
    },
    MuiTableCell: {
      head: {
        backgroundColor: grey['900'],
        color: 'white',
      },
    },
    MuiTableRow: {
      root: {
        "&:nth-child(odd)": {
          backgroundColor: mode === 'light' ? '#f0f0f0' : 'rgba(255, 255, 255, 0.12)',
        },
        '&$hover': {
          "&:hover": {
            backgroundColor: '#e0e0e0',
          },
        },
        '&$selected': {
          backgroundColor: brightBlue['300'],
        },
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
  palette: {
    type: mode,
    primary: blue,
    secondary: grey,
  },
  
});

export default theme;
