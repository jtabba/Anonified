import { QueryClientProvider, QueryClient } from "react-query";
import { Box, ChakraProvider } from "@chakra-ui/react";
import { Main } from "./pages/main/index";
import { customTheme } from "./assets/theme";
import { render } from "react-dom";
import "./index.css";

const App = () => {
	const queryClient = new QueryClient();

	return (
		<ChakraProvider theme={customTheme}>
			<QueryClientProvider client={queryClient}>
				<Box
					backgroundColor="primary.black"
					height={"calc(100vh)"}
					width={"calc(100vw)"}
				>
					<Main />
				</Box>
			</QueryClientProvider>
		</ChakraProvider>
	);
};

render(<App />, document.getElementById("App"));
