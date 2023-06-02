import {
	Tabs,
	TabsProps,
	TabPanels,
	Tab,
	TabProps,
	TabPanel,
	TabPanelProps,
	TabIndicator,
	TabIndicatorProps,
	forwardRef,
	TabPanelsProps
} from "@chakra-ui/react";

export const StyledTabs = forwardRef<TabsProps, "div">((props, ref) => (
	<Tabs
		isFitted
		size={"lg"}
		variant={"unstyled"}
		borderRadius={"10px"}
		bg={"primary.black"}
		// height={"calc(65vh)"}
		width={"calc(55vw)"}
		position={"absolute"}
		top={"50%"}
		left={"50%"}
		transform={"translate(-50%, -50%)"}
		ref={ref}
		{...props}
	/>
));

export const StyledTab = forwardRef<TabProps, "div">((props, ref) => (
	<Tab
		color={"primary.grey"}
		fontWeight={"500"}
		_selected={{
			color: "primary.white",
			bg: "primary.darkBlue",
			borderRadius: "5px 5px 0 0"
		}}
		ref={ref}
		{...props}
	/>
));

export const StyledTabIndicator = forwardRef<TabIndicatorProps, "div">(
	(props, ref) => (
		<TabIndicator
			mt="-2px"
			height="2px"
			bg="primary.black"
			ref={ref}
			{...props}
		/>
	)
);

export const StyledTabPanels = forwardRef<TabPanelsProps, "div">(
	(props, ref) => (
		<TabPanels
			bg={"primary.blue"}
			// height={"calc(60vh)"}
			borderRadius={"0 5px 5px 5px"}
			ref={ref}
			{...props}
		/>
	)
);

export const StyledTabPanel = forwardRef<TabPanelProps, "div">((props, ref) => (
	<TabPanel
		bg={"primary.blue"}
		borderRadius={"0 0 5px 5px"}
		display={"flex"}
		minHeight={"calc(30vh)"}
		rowGap={5}
		padding={"15px 5px 30px 5px"}
		flexDirection={"column"}
		justifyContent={"space-evenly"}
		alignItems={"center"}
		ref={ref}
		{...props}
	/>
));
