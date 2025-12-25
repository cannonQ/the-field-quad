import { extendTheme } from "@chakra-ui/react";
import '@fontsource-variable/outfit';
import "@fontsource/poppins";

// 2. Add your color mode config
const config = {
  initialColorMode: "light",
  // useSystemColorMode: false,
  disableTransitionOnChange: false,
};

const styles = {
  global: (props) => ({
    body: {
      color: "white",
      // bg: mode("linear-gradient(#dbf5fa, #CAF0F8)", "#012a4a")(props),
      // // bg: mode('white', "#012a4a")(props),
      // transitionProperty: "background-color",
      // transitionDuration: "normal",
    },
  }),
};

// Components:
export const Button = {
  // The styles all button have in common
  baseStyle: {
    // borderRadius: "full",
    // fontWeight: 'bold',
    // textTransform: 'uppercase',
    // borderRadius: 'base', // <-- border radius is same for all variants and sizes
  },
  // Two sizes: sm and md
  // sizes: {
  //   sm: {
  //     fontSize: 'sm',
  //     px: 4, // <-- px is short for paddingLeft and paddingRight
  //     py: 3, // <-- py is short for paddingTop and paddingBottom
  //   },
  //   md: {
  //     fontSize: 'md',
  //     px: 6, // <-- these values are tokens from the design system
  //     py: 4, // <-- these values are tokens from the design system
  //   },
  // },
  // Two variants: outline and solid
  variants: {
    // outline: {
    //   border: '2px solid',
    //   borderColor: 'purple.500',
    //   color: 'purple.500',
    // },
    // solid: {
    //   bg: 'purple.500',
    //   color: 'white',
    // },
  },
  // The default size and variant values
  // defaultProps: {
  //   size: 'md',
  //   variant: 'outline',
  // },
};

export const colors = {
  brand: {
    0: "#dbf5fa",
    100: "#CAF0F8",
    200: "#CAF0F8",
    300: "#90E0EF",
    400: "#90E0EF",
    500: "#00B4D8",
    600: "#0077B6",
    700: "#0077B6",
    800: "#012a4a",
    900: "#012a4a",
  },
};

export const theme = extendTheme({
  styles,
  // colors,
  components: {
    Button,
    Tooltip: {
      baseStyle: (props) => ({
        // bgColor: "#00B4D8",
        borderRadius: "lg",
        px: 4,
        py: 2,
        // fontWeight: "semibold"
        textAlign: "center",
      }),
      arrow: {
        // bgColor: "#00B4D8",
      },
    },
    Modal: {
      // setup light/dark mode component defaults
      baseStyle: (props) => ({
        dialog: {
          // bg: mode('white', '#141214')(props),
          borderRadius: "xl",
        },
      }),
    },
    Input: {
      baseStyle: {
        field: {
          // borderRadius: 0
        },
      },
    },
    Alert: {
      defaultProps: {
        colorScheme: "brand",
      },
    },
  },
  fonts: {
    // heading: 'Poppins',
    // body: 'Poppins',
    heading: "Poppins", // monospace;,
    body: "Poppins", //monospace;,
  },
  config,
});
