import { useState, useEffect, useContext } from "react";
import {
	Button,
	Chip,
	Grid,
	IconButton,
	InputAdornment,
	makeStyles,
	Paper,
	TextField,
	Typography,
	Modal,
	Slider,
	FormControlLabel,
	MenuItem,
	Checkbox,
} from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import axios from "axios";
import SearchIcon from "@material-ui/icons/Search";
import FilterListIcon from "@material-ui/icons/FilterList";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import ChipInput from "material-ui-chip-input";
import FileUploadInput from "../lib/FileUploadInput";
import DescriptionIcon from "@material-ui/icons/Description";
import "typeface-roboto";
import { SetPopupContext } from "../App";
import { Editor } from "@tinymce/tinymce-react";

import apiList from "../lib/apiList";
import { userType } from "../lib/isAuth";

const useStyles = makeStyles((theme) => ({
	body: {
		height: "inherit",
	},
	button: {
		width: "100%",
		height: "100%",
	},
	jobTileOuter: {
		padding: "30px",
		margin: "20px 0",
		boxSizing: "border-box",
		width: "100%",
	},
	popupDialog: {
		height: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
}));

const JobTile = (props) => {
	const classes = useStyles();
	const { job } = props;
	const setPopup = useContext(SetPopupContext);
	const [jobDetails, setJobDetails] = useState({
		name: "",
		phoneNum: "",
		email: "",
		skillsets: [],
		Education: "",
		resume: "",
	});

	const [open, setOpen] = useState(false);
	const [sop, setSop] = useState("");
	const [openDetails, setOpenDetails] = useState(false);

	var formattedJobDetails;

	if (job.description) {
		formattedJobDetails = job.description;
	} else {
		formattedJobDetails = "<p>No Job Details</p>";
	}

	const handleClose = () => {
		setOpen(false);
		setSop("");
	};

	const handleCloseDetails = () => {
		setOpenDetails(false);
	};

	const handleApply = () => {
		console.log(job._id);
		console.log(sop);
		axios
			.post(
				`${apiList.jobs}/${job._id}/applications`,
				{
					sop: sop,
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			)
			.then((response) => {
				setPopup({
					open: true,
					severity: "success",
					message: response.data.message,
				});
				handleClose();
			})
			.catch((err) => {
				console.log(err.response);
				setPopup({
					open: true,
					severity: "error",
					message: err.response.data.message,
				});
				handleClose();
			});
	};

	const handleInput = (key, value) => {
		setJobDetails({
			...jobDetails,
			[key]: value,
		});
	};

	const deadline = new Date(job.deadline).toLocaleDateString();

	return (
		<Paper className={classes.jobTileOuter} elevation={3}>
			<Grid container>
				<Grid container item xs={9} spacing={1} direction="column">
					<Grid item>
						<Typography variant="h5">{job.title}</Typography>
					</Grid>
					<Grid item>
						<Rating value={job.rating !== -1 ? job.rating : null} readOnly />
					</Grid>
					<Grid item>Role : {job.jobType}</Grid>
					<Grid item>Salary : {job.salary} PKR/month</Grid>
					<Grid item>
						Duration : {job.duration !== 0 ? `${job.duration} month` : `Flexible`}
					</Grid>
					<Grid item>Posted By : {job.recruiter.name}</Grid>
					<Grid item>Application Deadline : {deadline}</Grid>

					<Grid item>
						{job.skillsets.map((skill) => (
							<Chip label={skill} style={{ marginRight: "2px" }} />
						))}
					</Grid>
				</Grid>
				<Grid item xs={3}></Grid>
				<Grid item xs={5}></Grid>
				<Grid item xs={2}>
					<Button
						variant="contained"
						color="primary"
						className={classes.button}
						onClick={() => {
							handleApply()
						}}
						disabled={userType() === "recruiter"}>
						Apply
					</Button>
				</Grid>
				<div style={{ marginLeft: "10px" }}>
					<Button
						variant="contained"
						color="primary"
						className={classes.button}
						onClick={() => {
							setOpenDetails(true);
						}}
						
						disabled={userType() === "recruiter"? true : false }
						>
						View Details
					</Button>
				</div>
			</Grid>

			<Modal open={open} onClose={handleClose} className={classes.popupDialog}>
				<Paper
					style={{
						padding: "20px",
						outline: "none",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						width: "65%",
						alignItems: "center",
					}}>
					<Grid style={{ marginBottom: "50px " }}>
						<Typography variant="h4">Apply for a Job</Typography>
					</Grid>
					<Grid
						container
						direction="row"
						// alignItems="stretch"
						spacing={2}>
						<Grid item xs={6}>
							<TextField
								label="Name"
								value={jobDetails.name}
								onChange={(event) => handleInput("name", event.target.value)}
								variant="outlined"
								fullWidth
							/>
						</Grid>
						<Grid item xs={6}>
							<TextField
								label="Phone Number"
								value={jobDetails.phoneNum}
								onChange={(event) => handleInput("phoneNum", event.target.value)}
								variant="outlined"
								fullWidth
								inputProps={{ maxLength: 11 }}
							/>
						</Grid>
						<Grid item xs={6} style={{ paddingTop: "20px" }}>
							<TextField
								label="Email"
								value={jobDetails.email}
								onChange={(event) => handleInput("email", event.target.value)}
								variant="outlined"
								fullWidth
								type={"email"}
							/>
						</Grid>
						<Grid item xs={6} style={{ paddingTop: "20px" }}>
							<ChipInput
								className={classes.inputBox}
								label="Skills"
								variant="outlined"
								helperText="Press enter to add skillsets"
								value={jobDetails.skillsets}
								onAdd={(chip) =>
									setJobDetails({
										...jobDetails,
										skillsets: [...jobDetails.skillsets, chip],
									})
								}
								onDelete={(chip, index) => {
									let skillsets = jobDetails.skillsets;
									skillsets.splice(index, 1);
									setJobDetails({
										...jobDetails,
										skillsets: skillsets,
									});
								}}
								fullWidth
							/>
						</Grid>
						<Grid item xs={6} style={{ paddingTop: "20px" }}>
							<TextField
								label="Education"
								value={jobDetails.Education}
								onChange={(event) => handleInput("Education", event.target.value)}
								variant="outlined"
								fullWidth
							/>
						</Grid>
						<Grid item xs={6} style={{ paddingTop: "20px" }}>
							<FileUploadInput
								className={classes.inputBox}
								label="Resume (.pdf)"
								icon={<DescriptionIcon />}
								value={jobDetails.resume}
								onChange={(event) => {
									// setFiles({
									//   ...files,
									//   resume: event.target.files[0],
									// })
									console.log("running", { event: event.target.files });
									setJobDetails({
										...jobDetails,
										resume: event.target.files[0],
									});
								}}
								uploadTo={apiList.uploadResume}
								handleInput={handleInput}
								identifier={"resume"}
							/>
						</Grid>
						{/* <Grid item xs={12}>
              <TextField
                label="Write SOP (upto 250 words)"
                multiline
                rows={8}
                style={{ width: "100%", marginBottom: "30px" }}
                variant="outlined"
                value={sop}
                onChange={(event) => {
                  if (
                    event.target.value.split(" ").filter(function (n) {
                      return n != "";
                    }).length <= 250
                  ) {
                    setSop(event.target.value);
                  }
                }}
              />
            </Grid> */}
					</Grid>

					<Button
						variant="contained"
						color="primary"
						style={{ marginTop: "20px" }}
						onClick={() => handleApply()}>
						Submit
					</Button>
				</Paper>
			</Modal>

			<Modal open={openDetails} onClose={handleCloseDetails} className={classes.popupDialog}>
				<Paper
					style={{
						padding: "20px",
						outline: "none",
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						width: "65%",
						alignItems: "center",
					}}>
					<Editor
						disabled={userType() === "recruiter"? false : true}
						apiKey="t5zg64cjxqc7b06oe4bhtr71xqbgi7x1bfmq0yb0xq2s1nx6"
						// onInit={(evt, editor) => (editorRef.current = editor)}
						initialValue={formattedJobDetails}
						init={{
							readonly: true,
							selector: "textarea",
							height: 500,
							width: 800,
							menubar: false,
							content_style:
								"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
						}}
					/>

					<Button
						variant="outlined"
						color="secondary"
						style={{ marginTop: "20px" }}
						onClick={() => setOpenDetails(false)}>
						Close
					</Button>
				</Paper>
			</Modal>
		</Paper>
	);
};

const FilterPopup = (props) => {
	const classes = useStyles();
	const { open, handleClose, searchOptions, setSearchOptions, getData } = props;
	return (
		<>
			<Modal open={open} onClose={handleClose} className={classes.popupDialog}>
				<Paper
					style={{
						padding: "50px",
						outline: "none",
						minWidth: "50%",
					}}>
					<Grid container direction="column" alignItems="center" spacing={3}>
						<Grid container item alignItems="center">
							<Grid item xs={3}>
								Job Type
							</Grid>
							<Grid
								container
								item
								xs={9}
								justify="space-around"
								// alignItems="center"
							>
								<Grid item>
									<FormControlLabel
										control={
											<Checkbox
												name="fullTime"
												checked={searchOptions.jobType.fullTime}
												onChange={(event) => {
													setSearchOptions({
														...searchOptions,
														jobType: {
															...searchOptions.jobType,
															[event.target.name]:
																event.target.checked,
														},
													});
												}}
											/>
										}
										label="Full Time"
									/>
								</Grid>
								<Grid item>
									<FormControlLabel
										control={
											<Checkbox
												name="partTime"
												checked={searchOptions.jobType.partTime}
												onChange={(event) => {
													setSearchOptions({
														...searchOptions,
														jobType: {
															...searchOptions.jobType,
															[event.target.name]:
																event.target.checked,
														},
													});
												}}
											/>
										}
										label="Part Time"
									/>
								</Grid>
								<Grid item>
									<FormControlLabel
										control={
											<Checkbox
												name="wfh"
												checked={searchOptions.jobType.wfh}
												onChange={(event) => {
													setSearchOptions({
														...searchOptions,
														jobType: {
															...searchOptions.jobType,
															[event.target.name]:
																event.target.checked,
														},
													});
												}}
											/>
										}
										label="Work From Home"
									/>
								</Grid>
							</Grid>
						</Grid>
						<Grid container item alignItems="center">
							<Grid item xs={3}>
								Salary
							</Grid>
							<Grid item xs={9}>
								<Slider
									valueLabelDisplay="auto"
									valueLabelFormat={(value) => {
										return value * (100000 / 100);
									}}
									marks={[
										{ value: 0, label: "0" },
										{ value: 100, label: "100000" },
									]}
									value={searchOptions.salary}
									onChange={(event, value) =>
										setSearchOptions({
											...searchOptions,
											salary: value,
										})
									}
								/>
							</Grid>
						</Grid>
						<Grid container item alignItems="center">
							<Grid item xs={3}>
								Duration
							</Grid>
							<Grid item xs={9}>
								<TextField
									select
									label="Duration"
									variant="outlined"
									fullWidth
									value={searchOptions.duration}
									onChange={(event) =>
										setSearchOptions({
											...searchOptions,
											duration: event.target.value,
										})
									}>
									<MenuItem value="0">All</MenuItem>
									<MenuItem value="1">1</MenuItem>
									<MenuItem value="2">2</MenuItem>
									<MenuItem value="3">3</MenuItem>
									<MenuItem value="4">4</MenuItem>
									<MenuItem value="5">5</MenuItem>
									<MenuItem value="6">6</MenuItem>
									<MenuItem value="7">7</MenuItem>
								</TextField>
							</Grid>
						</Grid>
						<Grid container item alignItems="center">
							<Grid item xs={3}>
								Sort
							</Grid>
							<Grid item container direction="row" xs={9}>
								<Grid
									item
									container
									xs={4}
									justify="space-around"
									alignItems="center"
									style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}>
									<Grid item>
										<Checkbox
											name="salary"
											checked={searchOptions.sort.salary.status}
											onChange={(event) =>
												setSearchOptions({
													...searchOptions,
													sort: {
														...searchOptions.sort,
														salary: {
															...searchOptions.sort.salary,
															status: event.target.checked,
														},
													},
												})
											}
											id="salary"
										/>
									</Grid>
									<Grid item>
										<label for="salary">
											<Typography>Salary</Typography>
										</label>
									</Grid>
									<Grid item>
										<IconButton
											disabled={!searchOptions.sort.salary.status}
											onClick={() => {
												setSearchOptions({
													...searchOptions,
													sort: {
														...searchOptions.sort,
														salary: {
															...searchOptions.sort.salary,
															desc: !searchOptions.sort.salary.desc,
														},
													},
												});
											}}>
											{searchOptions.sort.salary.desc ? (
												<ArrowDownwardIcon />
											) : (
												<ArrowUpwardIcon />
											)}
										</IconButton>
									</Grid>
								</Grid>
								<Grid
									item
									container
									xs={4}
									justify="space-around"
									alignItems="center"
									style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}>
									<Grid item>
										<Checkbox
											name="duration"
											checked={searchOptions.sort.duration.status}
											onChange={(event) =>
												setSearchOptions({
													...searchOptions,
													sort: {
														...searchOptions.sort,
														duration: {
															...searchOptions.sort.duration,
															status: event.target.checked,
														},
													},
												})
											}
											id="duration"
										/>
									</Grid>
									<Grid item>
										<label for="duration">
											<Typography>Duration</Typography>
										</label>
									</Grid>
									<Grid item>
										<IconButton
											disabled={!searchOptions.sort.duration.status}
											onClick={() => {
												setSearchOptions({
													...searchOptions,
													sort: {
														...searchOptions.sort,
														duration: {
															...searchOptions.sort.duration,
															desc: !searchOptions.sort.duration.desc,
														},
													},
												});
											}}>
											{searchOptions.sort.duration.desc ? (
												<ArrowDownwardIcon />
											) : (
												<ArrowUpwardIcon />
											)}
										</IconButton>
									</Grid>
								</Grid>
								<Grid
									item
									container
									xs={4}
									justify="space-around"
									alignItems="center"
									style={{ border: "1px solid #D1D1D1", borderRadius: "5px" }}>
									<Grid item>
										<Checkbox
											name="rating"
											checked={searchOptions.sort.rating.status}
											onChange={(event) =>
												setSearchOptions({
													...searchOptions,
													sort: {
														...searchOptions.sort,
														rating: {
															...searchOptions.sort.rating,
															status: event.target.checked,
														},
													},
												})
											}
											id="rating"
										/>
									</Grid>
									<Grid item>
										<label for="rating">
											<Typography>Rating</Typography>
										</label>
									</Grid>
									<Grid item>
										<IconButton
											disabled={!searchOptions.sort.rating.status}
											onClick={() => {
												setSearchOptions({
													...searchOptions,
													sort: {
														...searchOptions.sort,
														rating: {
															...searchOptions.sort.rating,
															desc: !searchOptions.sort.rating.desc,
														},
													},
												});
											}}>
											{searchOptions.sort.rating.desc ? (
												<ArrowDownwardIcon />
											) : (
												<ArrowUpwardIcon />
											)}
										</IconButton>
									</Grid>
								</Grid>
							</Grid>
						</Grid>

						<Grid item>
							<Button
								variant="contained"
								color="primary"
								style={{ padding: "10px 50px" }}
								onClick={() => getData()}>
								Apply
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</Modal>
		</>
	);
};

const Home = (props) => {
	const [jobs, setJobs] = useState([]);
	const [filterOpen, setFilterOpen] = useState(false);
	const [searchOptions, setSearchOptions] = useState({
		query: "",
		jobType: {
			fullTime: false,
			partTime: false,
			wfh: false,
		},
		salary: [0, 100],
		duration: "0",
		sort: {
			salary: {
				status: false,
				desc: false,
			},
			duration: {
				status: false,
				desc: false,
			},
			rating: {
				status: false,
				desc: false,
			},
		},
	});

	const setPopup = useContext(SetPopupContext);
	useEffect(() => {
		getData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getData = () => {
		let searchParams = [];
		if (searchOptions.query !== "") {
			searchParams = [...searchParams, `q=${searchOptions.query}`];
		}
		if (searchOptions.jobType.fullTime) {
			searchParams = [...searchParams, `jobType=Full%20Time`];
		}
		if (searchOptions.jobType.partTime) {
			searchParams = [...searchParams, `jobType=Part%20Time`];
		}
		if (searchOptions.jobType.wfh) {
			searchParams = [...searchParams, `jobType=Work%20From%20Home`];
		}
		if (searchOptions.salary[0] !== 0) {
			searchParams = [...searchParams, `salaryMin=${searchOptions.salary[0] * 1000}`];
		}
		if (searchOptions.salary[1] !== 100) {
			searchParams = [...searchParams, `salaryMax=${searchOptions.salary[1] * 1000}`];
		}
		if (searchOptions.duration !== "0") {
			searchParams = [...searchParams, `duration=${searchOptions.duration}`];
		}

		let asc = [],
			desc = [];

		Object.keys(searchOptions.sort).forEach((obj) => {
			const item = searchOptions.sort[obj];
			if (item.status) {
				if (item.desc) {
					desc = [...desc, `desc=${obj}`];
				} else {
					asc = [...asc, `asc=${obj}`];
				}
			}
		});
		searchParams = [...searchParams, ...asc, ...desc];
		const queryString = searchParams.join("&");
		console.log(queryString);
		let address = apiList.jobs;
		if (queryString !== "") {
			address = `${address}?${queryString}`;
		}

		axios
			.get(address, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})
			.then((response) => {
				console.log(response.data);
				setJobs(
					response.data.filter((obj) => {
						const today = new Date();
						const deadline = new Date(obj.deadline);
						return deadline > today;
					})
				);
			})
			.catch((err) => {
				console.log(err);
				setPopup({
					open: true,
					severity: "error",
					message: "Error",
				});
			});
	};

	return (
		<>
			<Grid
				container
				item
				direction="column"
				alignItems="center"
				style={{ padding: "30px", minHeight: "93vh", opacity: 0.9, width: "50%" }}>
				<Grid item container direction="column" justify="center" alignItems="center">
					<Grid item xs>
						<Typography variant="h2">Jobs</Typography>
					</Grid>
					<Grid item xs>
						<TextField
							label="Search Jobs"
							value={searchOptions.query}
							onChange={(event) =>
								setSearchOptions({
									...searchOptions,
									query: event.target.value,
								})
							}
							onKeyPress={(ev) => {
								if (ev.key === "Enter") {
									getData();
								}
							}}
							InputProps={{
								endAdornment: (
									<InputAdornment>
										<IconButton onClick={() => getData()}>
											<SearchIcon />
										</IconButton>
									</InputAdornment>
								),
							}}
							style={{ width: "500px" }}
							variant="outlined"
						/>
					</Grid>
					<Grid item>
						<IconButton onClick={() => setFilterOpen(true)}>
							<FilterListIcon />
						</IconButton>
					</Grid>
				</Grid>

				<Grid container item xs direction="column" alignItems="stretch" justify="center">
					{jobs.length > 0 ? (
						jobs.map((job) => {
							console.log("JOBS", { job });
							return <JobTile job={job} />;
						})
					) : (
						<Typography variant="h5" style={{ textAlign: "center" }}>
							No jobs found
						</Typography>
					)}
				</Grid>
			</Grid>
			<FilterPopup
				open={filterOpen}
				searchOptions={searchOptions}
				setSearchOptions={setSearchOptions}
				handleClose={() => setFilterOpen(false)}
				getData={() => {
					getData();
					setFilterOpen(false);
				}}
			/>
		</>
	);
};

export default Home;
