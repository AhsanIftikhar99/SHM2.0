import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Modal,
  Paper,
  makeStyles,
  TextField,
  MenuItem,
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";


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
  });

  const handleInput = (key, value) => {
    setJobDetails({
      ...jobDetails,
      [key]: value,
    });
  };

  const handleUpdate = () => {
    console.log(jobDetails);
    if(jobDetails.skillsets.length===0)
    {
      setPopup({
        open: true,
        severity: "error",
        message: "Skills are required",
      });
      return
    }
    else if(jobDetails.salary===0)
    {
      setPopup({
        open: true,
        severity: "error",
        message: "Salary cannot be 0",
      });
      return
    }
    axios
      .post(apiList.jobs, jobDetails, {
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
        style={{ padding: "30px", minHeight: "93vh", width: "80%",opacity:0.9 }}
      >

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
                }}
              >
                <p
                  style={{
                    fontSize: '34px',
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >Create A JobAd</p>
                <Grid
                  container
                  direction="row"
                  alignItems="stretch"
                  spacing={4}
                >
                  <Grid item xs={6}>
                    <TextField
                      required='true'
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
                      className={classes.inputBox}
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
                      fullWidth
                    >
                      <MenuItem value="Full Time">Full Time</MenuItem>
                      <MenuItem value="Part Time">Part Time</MenuItem>
                      <MenuItem value="Work From Home">Work From Home</MenuItem>
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
                </Grid>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ padding: "10px 50px", marginTop: "30px" }}
                  onClick={() => handleUpdate()}
                >
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
