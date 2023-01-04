import React, { useState, useContext } from "react";
import { Grid, IconButton, InputAdornment, TextField, Typography } from "@material-ui/core";
// import FilterListIcon from "@material-ui/icons/FilterList";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import apiList, { server } from "../../lib/apiList";
import { SetPopupContext } from "../../App";
import styles from "./searchResume.module.css";

const SearchResume = () => {
	const setPopup = useContext(SetPopupContext);
	const [keywordsSearched, setKeywordsSearched] = useState("");
	const [allResumes, setAllResumes] = useState([]);
	// const [rawData, setRawData] = useState([]);

	const searchHandler = (e) => {
		if (!e) {
			return;
		}

		if (e.key === "Enter" || e.type === "click") {
			axios
				.post(apiList.search, { keywordsSearched })
				.then((response) => {
					setAllResumes(response.data.selectedResumes);
					// setRawData(response.data.rawData);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const getResume = (pdfName) => {
		if (pdfName && pdfName !== "") {
			const address = `${server}/host/resume/${pdfName}`;
			// console.log(address);

			axios(address, {
				method: "GET",
				responseType: "blob",
			})
				.then((response) => {
					//   console.log("Response",response)
					const file = new Blob([response.data], { type: "application/pdf" });
					const fileURL = URL.createObjectURL(file);
					window.open(fileURL);
				})
				.catch((error) => {
					console.log(error);
					setPopup({
						open: true,
						severity: "error",
						message: "Error",
					});
				});
		} else {
			setPopup({
				open: true,
				severity: "error",
				message: "No resume found",
			});
		}
	};

	return (
		<div>
			<Grid
				container
				item
				direction="column"
				alignItems="center"
				style={{ padding: "30px", minHeight: "93vh" }}>
				<Grid item container direction="column" justify="center" alignItems="center">
					<Grid item xs>
						<Typography variant="h3">Search Resumes</Typography>
					</Grid>
					<Grid item xs style={{ marginTop: "15px" }}>
						<TextField
							label="Search Resumes"
							onKeyDown={searchHandler}
							value={keywordsSearched}
							onChange={(e) => setKeywordsSearched(e.target.value)}
							InputProps={{
								endAdornment: (
									<InputAdornment>
										<IconButton onClick={searchHandler}>
											<SearchIcon />
										</IconButton>
									</InputAdornment>
								),
							}}
							style={{ width: "500px" }}
							variant="outlined"
						/>
					</Grid>
					<p>Use Comma or Space to seperate keywords</p>
					<Grid item>
						<IconButton //onClick={() => setFilterOpen(true)}
						></IconButton>
					</Grid>

					{allResumes.map((resume, index) => {
						return (
							<div
								className={styles.ResumeButton}
								key={allResumes[index]}
								onClick={() => getResume(allResumes[index])}>
								<p>Resume {index + 1}</p>
								<div style={{color: "grey", fontSize: "10px", fontWeight: "lighter"}}>{allResumes[index]}</div>
							</div>
						);
					})}
				</Grid>
			</Grid>
		</div>
	);
};

export default SearchResume;
