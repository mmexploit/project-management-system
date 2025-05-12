import {
  MantineProvider,
  createTheme,
  MantineColorsTuple,
  MantineThemeOverride,
  CSSVariablesResolver,
} from "@mantine/core";

const myColor: MantineColorsTuple = [
  "#e6f1f8",
  "#b1d5ea",
  "#8bc0df",
  "#55a4d1",
  "#3592c8",
  "#0277ba",
  "#026ca9",
  "#015484",
  "#014166",
  "#01324e",
];

const successColor : MantineColorsTuple = [
  "#f0fdf4",
  "#dcfce7",
  "#bbf7d0",
  "#86efac",
  "#4ade80",
  "#22c55e",
  "#16a34a",
  "#15803d",
  "#166534",
  "#14532d",
]

const errorColor: MantineColorsTuple = [
  "#fef2f2",
  "#fee2e2",
  "#fecaca",
  "#fca5a5",
  "#f87171",
  "#ef4444",
  "#dc2626",
  "#b91c1c",
  "#991b1b",
  "#7f1d1d"
]

export const theme: Partial<MantineThemeOverride> = {
  primaryColor: "primary",
  primaryShade: 3,
  defaultRadius: "sm",
  colors: {
    primary: myColor,
    success: successColor,
    error: errorColor
  },
  fontSizes: {
    xs: "12px",
    sm: "14px",
    md: "16px",
    lg: "18px",
    xl: "20px",
  },
  headings: {
    sizes: {
      h1: {
        fontSize: "48px",
        fontWeight: "700",
      },
      h2: {
        fontSize: "30px",
        fontWeight: "700",
      },
      h3: {
        fontSize: "24px",
        fontWeight: "500",
      },
      h4: {
        fontSize: "20px",
        fontWeight: "500",
      },
    },
  },
  components: {
    Button: {
      defaultProps: {
        size: "sm",
        c: "black",
      },
      styles: { root: { paddingLeft: 24, paddingRight: 24 } },
    },

    Input: {
      defaultProps: {
        size: "sm",
      },
    },

    Text: {
      defaultProps: {
        size: "sm",
      },
    },

    TextInput: {
      defaultProps: {
        size: "sm",
      },
      styles: {},
    },

    NumberInput: {
      defaultProps: {
        size: "sm",
      },
    },
    Select: {
      defaultProps: {
        size: "sm",
      },
    },
    PasswordInput: {
      defaultProps: {
        size: "sm",
      },
    },
    Checkbox: {
      defaultProps: {
        size: "sm",
        labelPosition: "right",
      },
      styles: { input: { cursor: "pointer" } },
    },
    Radio: {
      defaultProps: {
        labelPosition: "right",
      },
    },
    Dropzone: {
      defaultProps: {
        size: "sm",
      },
      styles: {
        root: {
          backgroundColor: "#b1d5ea",
        }
      }
    },
    SegmentedControl: {
      defaultProps: {
        size: "xs",
        c: "black",
      },
      styles: {
        root: {
          backgroundColor: "#b1d5ea",
          paddingLeft: "10px",
          paddingRight: "10px",
          paddingTop: "7px",
          paddingBottom: "7px",
          color: "black",
        },
      },
    },
    Paper: {
      styles: {
        root: {
          border: "0.5px solid #1E1E1E1A",
        },
      },
    },
    Badge: {
      styles: {
        root: {
          // color: "black",
          paddingTop: 4,
          paddingBottom: 4,
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
  },
};
