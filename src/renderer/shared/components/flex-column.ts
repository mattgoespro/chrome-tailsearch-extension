import Container, { ContainerProps } from "@mui/material/Container";
import { createStyled } from "../theme/theme";

type FlexColumnProps = {
  centerVertical?: boolean;
  centerHorizontal?: boolean;
} & ContainerProps;

export const FlexColumn = createStyled(Container, {
  label: "FlexColumn",
  name: "FlexColumn",
  shouldForwardProp: (prop) => prop !== "centerVertical" && prop !== "centerHorizontal"
})<FlexColumnProps>(({ centerVertical, centerHorizontal }) => ({
  display: "flex",
  flexDirection: "column",
  justifyContent: centerHorizontal ? "center" : undefined,
  alignItems: centerVertical ? "center" : undefined
}));
