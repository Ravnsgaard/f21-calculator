import { createTheme } from "@mui/material/styles";
import { Source_Sans_3 } from "next/font/google";
export const sourceSans = Source_Sans_3({ subsets: ["latin"], weight: ["300","400","600","700"] });
export const theme = createTheme({
  typography: { fontFamily: sourceSans.style.fontFamily },
  palette: { mode: "light", primary: { main: "#6200ee" }, secondary: { main: "#03dac6" } }
});
