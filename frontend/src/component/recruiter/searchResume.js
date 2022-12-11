import React from 'react'
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
    FormGroup,
    MenuItem,
    Checkbox,
} from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import SearchIcon from "@material-ui/icons/Search";

export default function SearchResume() {
    return (
        <div>
            <Grid
                container
                item
                direction="column"
                alignItems="center"
                style={{ padding: "30px", minHeight: "93vh" }}
            >
                <Grid
                    item
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs>
                        <Typography variant="h3">Search through Resumes</Typography>
                    </Grid>
                    <Grid item xs style={{marginTop:'15px'}}>
                        <TextField
                            label="Search Resumes"
                            //   value={searchOptions.query}
                            //   onChange={(event) =>
                            //     setSearchOptions({
                            //       ...searchOptions,
                            //       query: event.target.value,
                            //     })
                            //   }
                            //   onKeyPress={(ev) => {
                            //     if (ev.key === "Enter") {
                            //       getData();
                            //     }
                            //   }}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment>
                                    <IconButton //onClick={() => getData()}
                                    >
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
                        <IconButton //onClick={() => setFilterOpen(true)}
                        >
                             
                        </IconButton>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}
