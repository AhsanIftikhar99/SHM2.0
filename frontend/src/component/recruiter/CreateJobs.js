import { useContext, useRef, useState } from "react";
import { Button, Grid, Paper, makeStyles, TextField, MenuItem } from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";
import { Editor } from "@tinymce/tinymce-react";
import styles from "./createJob.module.css"
import { SetPopupContext } from "../../App";

import apiList from "../../lib/apiList";

const useStyles = makeStyles((theme) => ({
	body: {
		height: "inherit",
	},
	popupDialog: {
		height: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		// padding: "30px",
	},
}));

const CreateJobs = (props) => {
	const classes = useStyles();
	const setPopup = useContext(SetPopupContext);

	const editorRef = useRef(null);

	const [jobDetails, setJobDetails] = useState({
		title: "",
		maxApplicants: 100,
		maxPositions: 30,
		deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
			.toISOString()
			.substr(0, 16),
		skillsets: [],
		jobType: "Full Time",
		duration: 0,
		salary: 0,
		jobDescription: ``,
	});

	const handleInput = (key, value) => {
		setJobDetails({
			...jobDetails,
			[key]: value,
		});
	};

	const handleUpdate = () => {
		// console.log(jobDetails);
		if (jobDetails.skillsets.length === 0) {
			setPopup({
				open: true,
				severity: "error",
				message: "Skills are required",
			});
			return;
		} else if (jobDetails.salary === 0) {
			setPopup({
				open: true,
				severity: "error",
				message: "Salary cannot be 0",
			});
			return;
		}

		var jobData = {};

		if (editorRef.current) {
			// console.log(editorRef.current.getContent());
			jobData = { ...jobDetails, jobDescription: editorRef.current.getContent() }
		}



		// console.log(jobData);


		axios
			.post(apiList.jobs, jobData, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			})
			.then((response) => {
				setPopup({
					open: true,
					severity: "success",
					message: response.data.message,
				});
				setJobDetails({
					title: "",
					maxApplicants: 100,
					maxPositions: 30,
					deadline: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000)
						.toISOString()
						.substr(0, 16),
					skillsets: [],
					jobType: "Full Time",
					duration: 0,
					salary: 0,
					jobDescription: ``,
				});
			})
			.catch((err) => {
				setPopup({
					open: true,
					severity: "error",
					message: err.response.data.message,
				});
				console.log(err.response);
			});
	};

	return (
		<>
			<Grid
				container
				item
				direction="column"
				alignItems="center"
				style={{ padding: "30px", minHeight: "93vh", width: "80%", opacity: 0.9 }}>
				{/* <Grid item style={{marginBottom:'20px'}}>
          <Typography variant="h2">Add Job</Typography>
        </Grid> */}
				<Paper elevation={3}>
					<Grid item container xs direction="column" justify="center">
						<Grid item>
							<Paper
								style={{
									padding: "80px",
									outline: "none",
									display: "flex",
									flexDirection: "column",
									justifyContent: "center",
									alignItems: "center",
								}}>
								<p
									style={{
										fontSize: "34px",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
									}}>
									Create Job Ad
								</p>
								<Grid container direction="row" alignItems="stretch" spacing={4}>
									<Grid item xs={6}>
										<TextField
											required="true"
											label="Title"
											value={jobDetails.title}
											onChange={(event) =>
												handleInput("title", event.target.value)
											}
											variant="outlined"
											fullWidth
										/>
									</Grid>
									<Grid item xs={6}>
										<ChipInput
											required="true"
											// className={classes.inputBox}
											label="Skills Required"
											variant="outlined"
											helperText="Press enter to add skills"
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
									<Grid item xs={6}>
										<TextField
											select
											label="Job Type"
											variant="outlined"
											value={jobDetails.jobType}
											onChange={(event) => {
												handleInput("jobType", event.target.value);
											}}
											fullWidth>
											<MenuItem value="Full Time">Full Time</MenuItem>
											<MenuItem value="Part Time">Part Time</MenuItem>
										</TextField>
									</Grid>
									<Grid item xs={6}>
										<TextField
											label="Positions Available"
											type="number"
											variant="outlined"
											value={jobDetails.maxPositions}
											onChange={(event) => {
												handleInput("maxPositions", event.target.value);
											}}
											InputProps={{ inputProps: { min: 1 } }}
											fullWidth
										/>
									</Grid>
									<Grid item xs={6}>
										<TextField
											required="true"
											label="Salary"
											type="number"
											variant="outlined"
											value={jobDetails.salary}
											onChange={(event) => {
												handleInput("salary", event.target.value);
											}}
											InputProps={{ inputProps: { min: 0 } }}
											fullWidth
										/>
									</Grid>
									<Grid item xs={6}>
										<TextField
											label="Application Deadline"
											type="datetime-local"
											value={jobDetails.deadline}
											onChange={(event) => {
												handleInput("deadline", event.target.value);
											}}
											InputLabelProps={{
												shrink: true,
											}}
											variant="outlined"
											fullWidth
										/>
									</Grid>
									{/* <Grid item xs={6}>
                  <TextField
                    label="Maximum Number Of Applicants"
                    type="number"
                    variant="outlined"
                    value={jobDetails.maxApplicants}
                    onChange={(event) => {
                      handleInput("maxApplicants", event.target.value);
                    }}
                    InputProps={{ inputProps: { min: 1 } }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={6}>
                 
                </Grid> */}
									<div className={styles.editorContainer}>
										<h4 className={styles.editorHeading}>Job Description</h4>
										<Editor
											apiKey="t5zg64cjxqc7b06oe4bhtr71xqbgi7x1bfmq0yb0xq2s1nx6"
											onInit={(evt, editor) => (editorRef.current = editor)}
											initialValue="<p>Enter the description for the job.</p>"
											init={{
												height: 500,
												width: 1000,
												menubar: false,
												plugins: [
													"advlist",
													"autolink",
													"lists",
													"link",
													"preview",
													"fullscreen",
													"code",
													"wordcount",
												],
												toolbar:
													"undo redo | blocks | " +
													"bold italic forecolor | alignleft aligncenter " +
													"alignright alignjustify | bullist numlist outdent indent",
												content_style:
													"body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
											}}
										/>

									</div>

								</Grid>
								<Button
									variant="contained"
									color="primary"
									style={{ padding: "10px 50px", marginTop: "30px" }}
									onClick={() => handleUpdate()}>
									Create Job
								</Button>
							</Paper>
						</Grid>
					</Grid>
				</Paper>
			</Grid>
		</>
	);
};

export default CreateJobs;
