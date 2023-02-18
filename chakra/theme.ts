import { extendTheme } from "@chakra-ui/react";
import "@fontsource/open-sans/300.css";
import "@fontsource/open-sans/400.css";
import "@fontsource/open-sans/600.css";
import "@fontsource/open-sans/700.css";
import { Button } from "./Button";

const colors = {
  brand: {
    100: "#FF3C00",
  },
};

const fonts = {
  body: "Open Sans, sans-serif",
};

const styles = {
  global: () => {
    return {
      body: {
        bg: "gray.200",
      },
    };
  },
};

export const theme = extendTheme({
  colors,
  fonts,
  styles,
  components: {
    Button,
  },
});
