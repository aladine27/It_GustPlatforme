import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#fff'
    },
    secondary: {
      main: '#0082c8',
      contrastText: '#fff'
    },
    background: {
      default: '#f5f7fa',
      paper: '#F3F6FB',
    },
    success: { main: '#2e7d32', contrastText: '#fff' },
    warning: { main: '#fbc02d', contrastText: '#fff' },
    info:    { main: '#0288d1', contrastText: '#fff' },
    error:   { main: '#d32f2f', contrastText: '#fff' }
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 800, color: '#1976d2' },
    h2: { fontSize: '2rem',   fontWeight: 700, color: '#1976d2' },
    h3: { fontSize: '1.5rem', fontWeight: 700, color: '#1976d2' },
    h4: { fontSize: '1.25rem',fontWeight: 600 },
    h5: { fontSize: '1.1rem', fontWeight: 500 },
    h6: { fontSize: '1rem',   fontWeight: 500 },
    subtitle1: { fontSize: '1.08rem', color: '#333' },
    subtitle2: { fontSize: '0.96rem', color: '#555' },
    body1: { fontSize: '1rem', color: '#333' },
    body2: { fontSize: '0.92rem', color: '#555' },
    button: { fontWeight: 700, textTransform: 'none' }
  },
  shape: {
    borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24,
          fontWeight: 700,
          textTransform: 'none',
          boxShadow: '0px 2px 8px 0 rgba(25,118,210,0.08)',
          padding: '10px 22px',
          outline: 'none !important',
          '&:focus': {
            outline: 'none !important',
            boxShadow: 'none',
          }
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          background: '#fff',
        },
        notchedOutline: {
          borderColor: '#e3f2fd',
        }
      }
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium',
        fullWidth: true
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          background: '#e3f2fd',
          fontWeight: 700,
          color: '#1976d2',
          fontSize: '1.06rem',
        },
        body: {
          fontSize: '1rem'
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { background: '#f4f8fd' }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.95rem'
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#e3f2fd',
          color: '#1976d2',
          boxShadow: '0px 2px 8px 0 rgba(25,118,210,0.09)'
        }
      }
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 56,
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          background: '#F3F6FB',
          borderRadius: 12,
          border: '1.5px solid #e3f2fd'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#F3F6FB',
          borderRadius: 16,
          border: '1.5px solid #e3f2fd',
          boxShadow: '0 6px 24px rgba(25,118,210,0.07)'
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 9
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '32px 24px'
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: theme.typography.fontFamily,
          fontWeight: theme.typography.fontWeightBold,
          fontSize: '1.25rem',
          padding: theme.spacing(2),
        }),
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: ({ theme }) => ({
          padding: theme.spacing(2),
          borderTop: `1px solid ${theme.palette.divider}`,
          justifyContent: 'flex-end',
        }),
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          // On garde la couleur par défaut du parent (hérite du bouton, Chip, etc.)
        }
      }
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { color: '#1976d2', fontWeight: 600 }
      }
    },
    MuiPagination: {
      styleOverrides: {
        root: {
          marginTop: 16
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: '#e3f2fd',
          borderRadius: 10,
        },
        indicator: {
          backgroundColor: '#1976d2',
          height: 4,
          borderRadius: 3
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          color: '#1976d2',
          fontSize: '1.06rem',
          '&.Mui-selected': {
            color: '#fff',
            background: '#1976d2',
            borderRadius: 8
          }
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: '#F3F6FB',
          borderRight: '1.5px solid #e3f2fd'
        }
      }
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          minWidth: 320,
        }
      }
    },

    // ==== Nouveaux éléments ====

    // Switch stylé
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          color: '#bdbdbd', // thumb gris clair par défaut
        },
        colorPrimary: {
          '&.Mui-checked': {
            color: '#fff', // thumb blanc quand checked
          }
        },
        track: {
          borderRadius: 16,
          backgroundColor: '#bdbdbd',
          opacity: 1,
          '.Mui-checked.Mui-checked + &': {
            backgroundColor: '#1976d2',
            opacity: 0.5,
          }
        }
      }
    },
    // Tooltip clair avec ombre
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: '#fff',
          color: '#1976d2',
          fontSize: '0.92rem',
          borderRadius: 10,
          boxShadow: '0 3px 16px 0 rgba(25,118,210,0.12)',
          padding: '8px 16px'
        },
        arrow: {
          color: '#fff'
        }
      }
    },
    // Accordion façon carte moderne
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#F3F6FB',
          borderRadius: 12,
          boxShadow: '0 3px 16px 0 rgba(25,118,210,0.07)',
          '&:before': { display: 'none' }
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          '& .MuiAccordionSummary-expandIconWrapper': {
            color: '#1976d2'
          }
        }
      }
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 16,
        }
      }
    },
    // List stylée (nav, sidebar, menus, etc.)
    MuiList: {
      styleOverrides: {
        root: {
          padding: 0
        }
      }
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          '&.Mui-selected': {
            backgroundColor: '#1976d2',
            color: '#fff',
          },
          '&.Mui-selected:hover': {
            backgroundColor: '#1565c0',
            color: '#fff',
          },
          '&:hover': {
            backgroundColor: '#e3f2fd',
          }
        }
      }
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontWeight: 600,
        },
        secondary: {
          color: '#555',
        }
      }
    },
    // Breadcrumbs
    MuiBreadcrumbs: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.92rem'
        },
        separator: {
          marginLeft: 8,
          marginRight: 8,
          color: '#bdbdbd'
        }
      }
    },
  }
});

theme = responsiveFontSizes(theme);

// ! Ici export nommé :
export { theme };
