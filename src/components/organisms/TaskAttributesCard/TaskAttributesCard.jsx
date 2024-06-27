import React, { useState } from "react";
import {
	Card,
	Box,
	Button,
	CardContent,
	Typography,
	Stack,
} from "components/atoms";
import TaskDetailAttribute from "components/molecules/TaskDetailAttribute";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import MakeQuoteModal from "components/molecules/MakeQuoteModal/MakeQuoteModal";
import { useTheme, Divider } from "@mui/material";
import { styled } from "@mui/material/styles";
import { formatDate, formatAmount } from "/src/utils.jsx";
import PropTypes from "prop-types";
import { useCancelTaskMutation, useGetUserNameByIdQuery } from "store/apiSlice";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAddQuoteMutation } from "/src/store/apiSlice";
import ConfirmationModal from "components/molecules/ConfirmationModal";
import TaskStatusChip from "src/components/molecules/TaskStatusChip";
const StyledCardContent = styled(CardContent)(({ theme }) => ({
	display: "flex",
	flexDirection: "column",

	".show-more-button": {
		float: "right",
	},
	".attributes": {
		paddingBottom: "1rem",
	},
	[theme.breakpoints.up("md")]: {
		flexDirection: "row",
		position: "relative",
		".attributes": {
			flex: 1,
			paddingBottom: 0,
		},
		".show-more-button": {
			position: "absolute",
			right: 0,
		},
	},
}));
/**
 *
 * Task Attributes Card
 */
const TaskAttributesCard = ({
	taskData,
	isOwner,
	canMakeOffer,
	isAssignedToCurrentUser,
	offeredAlready,
	quotes,
	currentUser,
}) => {
	const {
		_id,
		title,
		postedBy,
		status,
		budget,
		locationType,
		locationName,
		dateType,
		date,
	} = taskData;
	/**
	 * Hooks
	 */
	const { palette, breakpoints } = useTheme();
	const [quoteDialogOpen, setQuoteDialogOpen] = useState(false);
	const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
	const [cancelTask, { loading: cancelTaskLoading }] = useCancelTaskMutation();
	const navigate = useNavigate();
	const { data: posterName } = useGetUserNameByIdQuery(postedBy);
	const [addQuote, { addQuoteLoading }] = useAddQuoteMutation();
	const { enqueueSnackbar } = useSnackbar();
	/**
	 * Variables
	 */
	const { textLight } = palette;
	/**
	 * Functions
	 */
	const handleDialogOpen = () => {
		setQuoteDialogOpen(!quoteDialogOpen);
	};

	const handleSubmitQuote = async (formData) => {
		if (formData.message) {
			const response = await addQuote({ taskId: _id, body: formData });
			if (response.error) {
				enqueueSnackbar("Unable to Process! Please wait", { variant: "error" });
			} else {
				enqueueSnackbar("Quote Submitted", { variant: "info" });
			}
		}
		setQuoteDialogOpen(false);
	};
	const handleTaskModalClose = async (shouldCancel) => {
		if (shouldCancel) {
			const taskId = taskData._id;
			await cancelTask(taskId);
		}
		setCancelModalOpen(false);
		// Force reload page
		window.location.reload();
	};
	const currentQuote = quotes.filter(
		(quote) => quote.userId === currentUser
	)[0];
	return (
		<>
			<ConfirmationModal
				open={cancelModalOpen}
				title={"Cancel Task?"}
				message={"Are you sure you want to delte this task? "}
				handleClose={handleTaskModalClose}
			/>
			<MakeQuoteModal
				open={quoteDialogOpen}
				onDialogClose={handleSubmitQuote}
				budget={budget}
			/>
			<Card
				sx={{
					[breakpoints.up("sm")]: {
						padding: "2rem",
					},
				}}
			>
				<TaskStatusChip status={taskData.status} />
				<StyledCardContent>
					<Box className='attributes'>
						{/* Title */}
						<Typography
							variant='h6'
							sx={{ margin: "0.8rem 0.5rem" }}
						>
							{title}
						</Typography>
						<Box>
							{/* Task Owner */}
							<TaskDetailAttribute
								label={"Task Owner"}
								icon={<Person2OutlinedIcon sx={{ fontSize: "1.2rem" }} />}
								value={posterName}
							/>
							{/* Location */}
							<TaskDetailAttribute
								label={"Location"}
								icon={<LocationOnOutlinedIcon sx={{ fontSize: "1.2rem" }} />}
								value={locationType === "remote" ? "Remote" : locationName}
							/>
							{/* Date */}
							<TaskDetailAttribute
								label={"Date"}
								icon={<CalendarMonthOutlinedIcon sx={{ fontSize: "1.2rem" }} />}
								value={
									dateType === "in" || dateType === "on"
										? `${dateType} ${formatDate(date)}`
										: "Flexible"
								}
							/>
							{status === "assigned" && (
								<TaskDetailAttribute
									label={"TaskGenie"}
									icon={<Person2OutlinedIcon sx={{ fontSize: "1.2rem" }} />}
									value={locationName}
								/>
							)}
						</Box>
					</Box>
					<Divider
						orientation='horizontal'
						flexItem
					/>
					<Divider
						orientation='vertical'
						flexItem
					/>
					{/* Budget and Task Action */}
					<Stack
						direction='column'
						gap={3}
						justifyContent='center'
						alignItems='center'
						className='budget-action-wrapper'
						sx={{ padding: "1rem" }}
					>
						{/*  Budget */}
						<Stack
							direction='row'
							gap={3}
							justifyContent='center'
							sx={{ alignItems: "center" }}
						>
							<Box className='task-budget'>
								<Typography sx={{ color: textLight.main }}>Budget</Typography>
							</Box>
							<Box
								sx={{
									margin: "0 auto",
									alignSelf: "center",
								}}
							>
								<Typography
									variant='h4'
									sx={{
										fontWeight: "bold",
									}}
								>
									{formatAmount(budget)}
								</Typography>
							</Box>
						</Stack>
						{isOwner && taskData?.status === "open" && (
							<Button
								variant='outlined'
								color='error'
								loading={cancelTaskLoading}
								onClick={() => {
									setCancelModalOpen(true);
								}}
							>
								Cancel Task
							</Button>
						)}
						{/* Show only if user can make an offer */}
						{canMakeOffer && (
							<Stack>
								<Box>
									<Button
										sx={{ margin: "0 auto" }}
										onClick={handleDialogOpen}
										loading={addQuoteLoading}
									>
										Make a Quote
									</Button>
								</Box>
							</Stack>
						)}
						{offeredAlready && (
							<Box
								sx={{
									backgroundColor: "#e0f2f1",
									color: "#00796b",
									borderRadius: "10px",
									padding: "1rem 3rem",
								}}
							>
								{!isAssignedToCurrentUser ? (
									<Box>
										<Stack gap={1}>
											<Box>
												<Typography>
													<b>Your Message</b>
												</Typography>
												<Typography variant='body2'>
													{currentQuote.message}
												</Typography>
											</Box>
											<Box>
												<Typography>
													<b>You Quoted</b>
												</Typography>
												<Typography>{currentQuote.price}</Typography>
											</Box>
											<Button
												variant='outlined'
												color='error'
												size='small'
											>
												Delete
											</Button>
										</Stack>
									</Box>
								) : (
									<Stack gap={1}>
										<Typography variant='body2'>Assigned to you</Typography>
										<Typography variant='body2'>
											Accepted Price <b>2400</b>
										</Typography>
										<Box
											sx={{ textAlign: "center", display: "flex", gap: "8px" }}
										>
											<Button
												variant='outlined'
												color='error'
												size='small'
											>
												Cancel
											</Button>
											<Button size='small'>Complete</Button>
										</Box>
									</Stack>
								)}
							</Box>
						)}
					</Stack>
				</StyledCardContent>
			</Card>
		</>
	);
};
// Prop validation
TaskAttributesCard.propTypes = {
	taskData: PropTypes.shape({
		_id: PropTypes.string,
		title: PropTypes.string,
		userId: PropTypes.string,
		status: PropTypes.string,
		budget: PropTypes.number,
		locationType: PropTypes.string,
		locationName: PropTypes.string,
		dateType: PropTypes.string,
		date: PropTypes.string,
	}).isRequired,
	// postedBy: PropTypes.string,
	canMakeOffer: PropTypes.bool,
	isOwner: PropTypes.bool,
	isAssignedToCurrentUser: PropTypes.bool,
	offeredAlready: PropTypes.bool,
};

export default TaskAttributesCard;
