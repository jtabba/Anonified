import { extendTheme } from "@chakra-ui/react";

export const themeBlack = "#181818";
export const themeGrey = "#717171";
export const themeBlue = "#0075A2";
export const themeWhite = "#F0F0F0";

export const customTheme = extendTheme({
	colors: {
		primary: {
			white: "#F0F0F0",
			black: "#181818",
			grey: "#717171",
			blue: "#0075A2",
			darkBlue: "#004C6A",
			500: "#181818"
		}
	},
	textStyles: {
		header: {
			fontSize: ["md", "lg", "xl", "2xl"],
			margin: "30px"
		},
		body: {
			fontSize: ["sm", "md", "lg", "xl"],
			margin: "15px",
			color: "primary.white"
		},
		description: {
			fontSize: ["sm", "md", "lg", "xl"]
		},
		caption: {
			fontSize: ["xs", "smaller", "sm", "md"],
			margin: 0,
			color: "primary.black",
			fontWeight: "500"
		},
		error: {
			fontSize: ["xs", "smaller", "sm", "md"],
			margin: 0,
			color: "primary.white",
			borderBottom: "1px solid red"
		}
	}
});
