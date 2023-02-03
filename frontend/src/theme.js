import { extendTheme, theme as base } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      // 100: "#",
      // ...
      // 900: "#",
    },
  },
  fonts: {
    heading: `Montserrat, ${base.fonts?.heading}`,
    body: `Montserrat, ${base.fonts?.body}`,
  },
});

export default theme;