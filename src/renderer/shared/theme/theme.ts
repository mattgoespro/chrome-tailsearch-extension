import { createTheme } from "@mui/material";
import { PaletteOptions } from "@mui/material/styles";

const palette: PaletteOptions = {
  mode: "dark",
  primary: {
    main: "#1976d2"
  },
  secondary: {
    main: "#dc004e"
  },
  common: {
    black: "#0e0e0e",
    white: "#f0f0f0"
  },
  text: {
    primary: "#e6e6e6",
    secondary: "#525252"
  },
  background: {
    default: "#121212",
    paper: "#292929"
  },
  success: {
    main: "#4caf50",
    contrastText: "#e6e6e6"
  },
  warning: {
    main: "#ff9800",
    contrastText: "#e6e6e6"
  },
  error: {
    main: "#f44336",
    contrastText: "#e6e6e6"
  }
};

export const theme = createTheme({
  palette,
  typography: {
    fontFamily: "Roboto, sans-serif",
    fontSize: 14,
    h1: {
      fontSize: "2.5em",
      color: "#dee0e6",
      fontWeight: 300,
      fontFamily: "Nunito Sans, sans-serif",
      textAlign: "center",
      margin: "1.5rem"
    },
    h2: {
      fontSize: "1.25em",
      fontWeight: 500
    },
    subtitle1: {
      fontSize: "1.125em"
    },
    body1: {
      fontSize: "1rem"
    },
    button: {
      fontSize: "1em",
      textTransform: "uppercase",
      fontWeight: 500,
      fontFamily: "Nunito Sans, sans-serif",
      letterSpacing: "0.125em"
    },
    overline: {
      fontSize: "1em",
      fontFamily: "Roboto, sans-serif",
      textTransform: "uppercase",
      letterSpacing: "0.125em"
    }
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          margin: "2rem",
          backgroundColor: "#111111"
        }
      }
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary"
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            backgroundColor: "#1976d2",
            color: "#fff",
            borderRadius: "4px",
            padding: "6px 16px",
            maxWidth: "5rem",
            "&:hover": {
              backgroundColor: "#0055aa",
              borderColor: "#0055aa",
              boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)"
            }
          }
        },
        {
          props: { variant: "outlined", color: "primary" },
          style: {
            borderColor: "#1976d2",
            color: "#1976d2",
            "&:hover": {
              backgroundColor: "#0055aa",
              borderColor: "#0055aa"
            }
          }
        }
      ]
    },
    MuiAutocomplete: {
      variants: [
        {
          props: { color: "primary" },
          style: {
            backgroundColor: "#1d1d1d",
            border: "1px solid #1976d2",
            borderRadius: "4px",
            "&:hover": {
              borderColor: "#1976d2"
            },
            "&.Mui-focused": {
              borderColor: "#1976d2",
              boxShadow: "0 0 0 2px rgba(25, 118, 210, 0.2)"
            }
          }
        }
      ],
      defaultProps: {
        color: "primary"
      }
    }
  },
  shape: {
    borderRadius: 4
  }
});
