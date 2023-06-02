import { RetrieveTabPanel } from "../../components/TabPanels/RetrieveTabPanel";
import { ComposeTabPanel } from "../../components/TabPanels/ComposeTabPanel";
import { AnonifyChatTabPanel } from "../../components/TabPanels/AnonifyChatTabPanel";
import { TabList, Text } from "@chakra-ui/react";
import {
	StyledTab,
	StyledTabIndicator,
	StyledTabs,
	StyledTabPanels
} from "../../components/TabPanels/styles";
import { LiveChatProvider } from "../../hooks/useLiveChatSocket";

export const Main = () => {
	return (
		<StyledTabs>
			<TabList>
				<StyledTab>
					<Text textStyle={"description"}>Compose</Text>
				</StyledTab>
				<StyledTab>
					<Text textStyle={"description"}>Retrieve</Text>
				</StyledTab>
				<StyledTab>
					<Text textStyle={"description"}>Live Chat</Text>
				</StyledTab>
			</TabList>
			<StyledTabIndicator />
			<StyledTabPanels>
				<ComposeTabPanel />
				<RetrieveTabPanel />
				<LiveChatProvider>
					<AnonifyChatTabPanel />
				</LiveChatProvider>
			</StyledTabPanels>
		</StyledTabs>
	);
};
