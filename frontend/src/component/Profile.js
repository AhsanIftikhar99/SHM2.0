import { useContext, useEffect, useState } from "react";
import {
  Button,
  Grid,
  Typography,
  Paper,
  makeStyles,
  TextField,
  Avatar
} from "@material-ui/core";
import axios from "axios";
import ChipInput from "material-ui-chip-input";
import FileUploadInput from "../lib/FileUploadInput";
import DescriptionIcon from "@material-ui/icons/Description";
import FaceIcon from "@material-ui/icons/Face";

import { SetPopupContext } from "../App";

import apiList, { server } from "../lib/apiList";



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

const MultifieldInput = (props) => {
  const classes = useStyles();
  const { education, setEducation } = props;

  return (
    <>
      {education.map((obj, key) => (
        <Grid item container className={classes.inputBox} key={key}>
          <Grid item xs={6}>
            <TextField
              label={`Institution Name #${key + 1}`}
              value={education[key].institutionName}
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].institutionName = event.target.value;
                setEducation(newEdu);
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Start Year"
              value={obj.startYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].startYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="End Year"
              value={obj.endYear}
              variant="outlined"
              type="number"
              onChange={(event) => {
                const newEdu = [...education];
                newEdu[key].endYear = event.target.value;
                setEducation(newEdu);
              }}
            />
          </Grid>
        </Grid>
      ))}
      <Grid item style={{ alignSelf: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={() =>
            setEducation([
              ...education,
              {
                institutionName: "",
                startYear: "",
                endYear: "",
              },
            ])
          }
          className={classes.inputBox}
        >
          Add another institution details
        </Button>
      </Grid>
    </>
  );
};

const Profile = (props) => {
  const classes = useStyles();
  const setPopup = useContext(SetPopupContext);
  // const [userData, setUserData] = useState();
  // eslint-disable-next-line no-unused-vars
  const [open, setOpen] = useState(false);

  const [profileDetails, setProfileDetails] = useState({
    name: "",
    education: [],
    skills: [],
    resume: "",
    profile: "",
  });

  const [education, setEducation] = useState([
    {
      institutionName: "",
      startYear: "",
      endYear: "",
    },
  ]);

  const handleInput = (key, value) => {
    setProfileDetails({
      ...profileDetails,
      [key]: value,
    });
  };

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = () => {
    axios
      .get(apiList.user, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setProfileDetails(response.data)
        if (response.data.education.length > 0) {
          setEducation(
            response.data.education.map((edu) => ({
              institutionName: edu.institutionName ? edu.institutionName : "",
              startYear: edu.startYear ? edu.startYear : "",
              endYear: edu.endYear ? edu.endYear : "",
            }))
          );
        }
      })
      .catch((err) => {
        console.log(err.response.data);
        setPopup({
          open: true,
          severity: "error",
          message: "Error",
        });
      });
  };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  // const editDetails = () => {
  //   setOpen(true);
  // };

  const getResume = () => {
    if (
      profileDetails.resume &&
      profileDetails.resume !== ""
    ) {
      const address = `${server}${profileDetails.resume}`;
      console.log(address);
      console.log(profileDetails);
      axios(address, {
        method: "GET",
        responseType: "blob",
      })
        .then((response) => {
          console.log("Response",response)
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

  const handleUpdate = () => {


    let updatedDetails = {
      ...profileDetails,
      education: education
        .filter((obj) => obj.institutionName.trim() !== "")
        .map((obj) => {
          if (obj["endYear"] === "") {
            delete obj["endYear"];
          }
          return obj;
        }),
    };
    console.log("Updated obj", updatedDetails);
    axios
      .put(apiList.user, updatedDetails, {
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
        getData();
      })
      .catch((err) => {
        setPopup({
          open: true,
          severity: "error",
          message: err.response.data.message,
        });
        console.log(err.response);
      });
    setOpen(false);
  };




  return (
    <>
      <Grid style={{ paddingBottom: '20px' }}></Grid>
        <Paper elevation={3} style={{ opacity: 0.9 }}>
          <Grid
            container
            item
            direction="column"
            alignItems="center"
            style={{ padding: "30px", minHeight: "93vh" }}
          >
            <Grid item>
              <Typography variant="h3">Profile</Typography>
            </Grid>
            <Grid style={{ paddingTop: '50px', paddingBottom: '50px' }}>
              <Avatar alt="profileimage" style={{ width: '15rem', height: '15rem' }} src={`${server}${profileDetails.profile}`} />
            </Grid>
            <Grid item xs>
              <Paper
                elevation={2}
                style={{
                  padding: "20px",
                  outline: "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid container direction="column" alignItems="stretch" spacing={3}>
                  <Grid item>
                    <TextField
                      label="Name"
                      value={profileDetails.name}
                      onChange={(event) => handleInput("name", event.target.value)}
                      className={classes.inputBox}
                      variant="outlined"
                      fullWidth
                    />
                  </Grid>
                  <MultifieldInput
                    education={education}
                    setEducation={setEducation}
                  />
                  <Grid item>
                    <ChipInput
                      className={classes.inputBox}
                      label="Skills"
                      variant="outlined"
                      helperText="Press enter to add skills"
                      value={profileDetails.skills}
                      onAdd={(chip) =>
                        setProfileDetails({
                          ...profileDetails,
                          skills: [...profileDetails.skills, chip],
                        })
                      }
                      onDelete={(chip, index) => {
                        let skills = profileDetails.skills;
                        skills.splice(index, 1);
                        setProfileDetails({
                          ...profileDetails,
                          skills: skills,
                        });
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid>
                  </Grid>
                  <Grid item>
                    <FileUploadInput
                      className={classes.inputBox}
                      label="Update Resume (.pdf)"
                      icon={<DescriptionIcon />}
                      uploadTo={apiList.uploadResume}
                      handleInput={handleInput}
                      identifier={"resume"}
                    />
                  </Grid>
                  <Grid item>
                    <FileUploadInput
                      className={classes.inputBox}
                      label="Update Profile Photo (.jpg/.png)"
                      icon={<FaceIcon />}
                      uploadTo={apiList.uploadProfileImage}
                      handleInput={handleInput}
                      identifier={"profile"}
                    />
                  </Grid>
                </Grid>
                <Grid xs={12}  spacing={4} direction='column' alignItems='center' style={{marginTop:'20px'}}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{  }}
                  onClick={() => handleUpdate()}
                >
                  Update Details
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ marginLeft:'10px' }}
                  onClick={() => getResume()}
                >
                  View Resume
                </Button>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      <Grid style={{ paddingBottom: '20px' }}></Grid>
      {/* <Modal open={open} onClose={handleClose} className={classes.popupDialog}> */}

      {/* </Modal> */}
    </>
  );
};

export default Profile;
