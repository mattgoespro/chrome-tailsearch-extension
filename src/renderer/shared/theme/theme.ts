import { createTheme } from "@mui/material";
import MuiCreateStyled from "@mui/system/createStyled";

export const theme = createTheme({
  palette: {
    mode: "dark",
    common: {
      black: "#1f1f1f",
      white: "#f0f0f0"
    },
    primary: {
      main: "#1976d2",
      light: "#4791db",
      dark: "#115293",
      contrastText: "#fff"
    },
    secondary: {
      main: "#dc004e",
      light: "#e33371",
      dark: "#9a0036",
      contrastText: "#fff"
    },
    error: {
      main: "#f44336",
      light: "#e57373",
      dark: "#d32f2f",
      contrastText: "#fff"
    },
    warning: {
      main: "#ff9800",
      light: "#ffb74d",
      dark: "#f57c00",
      contrastText: "#fff"
    },
    info: {
      main: "#2196f3",
      light: "#64b5f6",
      dark: "#1976d2",
      contrastText: "#fff"
    },
    success: {
      main: "#4caf50",
      light: "#81c784",
      dark: "#388e3c",
      contrastText: "#fff"
    },
    text: {
      primary: "#696969",
      disabled: "#a9a9a9",
      secondary: "#808080"
    },
    background: {
      default: "#101010",
      paper: "#1f1f1f"
    }
  },
  typography: (palette) => ({
    fontFamily: "Roboto, sans-serif",
    fontSize: 14,
    h1: {
      fontFamily: "Open Sans, sans-serif",
      fontSize: "2em",
      fontWeight: 500,
      color: palette.getContrastText(palette.background.paper),
      margin: "0.5rem"
    },
    h2: {
      fontSize: "1.5em",
      fontWeight: 500,
      color: palette.getContrastText(palette.background.paper),
      margin: "0.5rem"
    },
    h3: {
      fontSize: "1.25em",
      fontWeight: 500,
      color: palette.getContrastText(palette.background.paper),
      margin: "0.5rem"
    },
    button: {
      fontFamily: "Nunito Sans, sans-serif",
      fontSize: "0.875em",
      fontWeight: 400,
      textTransform: "uppercase"
    },
    overline: {
      fontSize: "0.75em",
      fontWeight: 400,
      textTransform: "uppercase",
      color: palette.text.secondary
    },
    body1: {
      fontSize: "1em",
      fontWeight: 400,
      color: palette.text.primary
    },
    body2: {
      fontSize: "0.875em",
      fontFamily: "Nunito Sans, sans-serif",
      fontWeight: 400,
      color: palette.text.primary
    },
    caption: {
      fontSize: "1em",
      fontFamily: "Nunito Sans, sans-serif",
      color: palette.text.primary,
      marginBottom: "0.5rem"
    }
  }),
  components: {
    MuiContainer: {
      defaultProps: {
        sx: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "center"
          // flex: 1
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
      defaultProps: {
        size: "small",
        color: "primary"
      }
    }
  },
  spacing: 2,
  shape: {
    borderRadius: 4
  }
});

export const createStyled = MuiCreateStyled({
  defaultTheme: theme
});
