import Container, { ContainerProps } from "@mui/material/Container";
import { createStyled } from "../theme/theme";

type CenterProps = {
  margin?: string;
  padding?: string;
} & ContainerProps;

export const Center = createStyled(Container, {
  label: "Center",
  name: "Center",
  shouldForwardProp: (prop) => prop !== "margin" && prop !== "padding"
})<CenterProps>(({ margin, padding }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: margin || "0",
  padding: padding || "0"
}));
