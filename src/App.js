import * as React from 'react';
import './App.css';
import { makeStyles } from '@mui/styles';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import MenuItem from '@mui/material/MenuItem';
import { toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import Drawer from '@mui/material/Drawer';

const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    border: "2px solid black",
    color: 'white',
    height: 48,
  },
  parentGrid: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "30px"
  },
  greenDot: {
    height: "15px", width: "15px", "background-color": "#32e532",
    "border-radius": 50, display: "inline-block"
  },
  redDot: {
    height: "15px", width: "15px", "background-color": "red",
    "border-radius": 50, display: "inline-block"
  },
  greyDot: {
    height: "15px", width: "15px", "background-color": "grey",
    "border-radius": 50, display: "inline-block"
  },
  actionRow: {
    position: 'fixed',
    bottom: 13,
    width: '100%'
  },
  blueBox: {
    border: '2px solid blue',
    width: "95%",
    margin: "25px 0 0 5px"
  },
  blueBoxInsideDiv: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    padding: "15px"
  },

  paddingTopCls: {
    paddingTop: "20px"
  }
});

const schemaList = [
  { label: "First Name", value: "first_name" },
  { label: "Last Name", value: "last_name" },
  { label: "Gender", value: "gender" },
  { label: "Age", value: "age" },
  { label: "Account Name", value: "account_name" },
  { label: "City", value: "city" },
  { label: "State", value: "state" }
]

const userTraits = ["first_name", "last_name", "gender", "age", "account_name"];

function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [segmentName, setSegmentName] = React.useState("");
  const [selectedShema, setSelectedSchema] = React.useState("");
  const [schemaError, setSchemaError] = React.useState(false);
  const [selectedSchemaList, setSelectedSchemaList] = React.useState([]);
  const [helperText, setHelperText] = React.useState("");
  const [schemaMainDropdown, setSchemaMainDropdown] = React.useState(schemaList);
  const [saveError, setSaveError] = React.useState("");

  const onClickSaveSegment = () => {
    setOpen(!open);
  }

  const onClose = () => {
    setOpen(!open);
    setSaveError("");
    setSelectedSchemaList([...[]]);
  }

  const getSchemasDropdown = (toDisable) => {

    const optionArr = toDisable.length ? schemaList : schemaMainDropdown;

    return optionArr.map((item) => (
      <MenuItem disabled={toDisable.includes(item.value)} value={item.value}>{item.label}</MenuItem>
    ))
  }

  const onSchemaChange = (e) => {
    setSelectedSchema(e.target.value);
    setSchemaError(false);
    setHelperText("");
  }

  const addSchema = () => {
    if (!selectedShema) {
      setSchemaError(true);
      setHelperText("Please select schema")
    } else {
      if (selectedSchemaList.includes(selectedShema)) {
        setSchemaError(true);
        setHelperText("This schema is already added")
      } else {
        selectedSchemaList.push(selectedShema);
        setSchemaError(false);
        setHelperText("");
      }
      const updated = schemaMainDropdown.filter(s => s.value !== selectedShema)
      setSchemaMainDropdown([...updated]);
      setSelectedSchemaList([...selectedSchemaList]);
      setSelectedSchema("");
      setSaveError("");
    }
  }

  const onSelectedSchemaChange = (e, i) => {
    selectedSchemaList[i] = e.target.value;
    setSelectedSchemaList([...selectedSchemaList]);
  }

  const getSelectedSchemaList = () => {
    return selectedSchemaList.map((s, i) => {
      return <div style={{ display: "flex", gap: "5px", alignItems: "center" }}><span className={userTraits.includes(s) ? classes.greenDot : classes.redDot}></span><TextField
        select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        label="Add schema to segment"
        value={s}
        onChange={(e) => { onSelectedSchemaChange(e, i) }}
        style={{ width: "75%" }}
      >{getSchemasDropdown(selectedSchemaList)}</TextField></div>
    })
  }

  const onSegmentNameChange = (e) => {
    setSegmentName(e.target.value);
    setSaveError("");
  }

  const saveSegment = () => {
    if (!segmentName && selectedSchemaList.length == 0) {
      setSaveError("Please enter segment name and add schemas");
    } else if (!segmentName) {
      setSaveError("Please enter segment name");
    } else if (selectedSchemaList.length == 0) {
      setSaveError("Please enter add schemas");
    } else {
      const obj = {};

      obj['segment_name'] = segmentName;
      obj["schema"] = selectedSchemaList.map(s => schemaList.find(f => f.value === s));

      axios.post('https://webhook.site/217731d7-3da7-4b04-aaec-339da2ee4d71', obj).then(function (response) {
        console.log(response);
        setOpen(!open);
        setSaveError("");
        setSelectedSchemaList([...[]]);
        toast.success("Segment added successfully !");
      })
        .catch(function (error) {
          console.log(error);
          toast.error("Something went wrong !");
        });

    }
  }

  return (
    <>
    
    <Grid container spacing={2} className={classes.parentGrid}>
      
      <Button variant="contained" style={{ background: "#62c5a0" }} onClick={onClickSaveSegment}>Save Segment</Button>
      <Drawer
        anchor={"right"}
        open={open}
        onClose={onClose}
        style={{ width: "32%" }}
      >
        <AppBar sx={{ position: 'relative', background: "  #62c5c5" }} >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Saving Segment
            </Typography>
          </Toolbar>
        </AppBar>
        <div style={{ height: "80%", overflowY: "scroll" }}>
          {saveError !== "" ? <span style={{ color: "red" }}>{saveError}</span> : null}
          <Grid container spacing={2} style={{
            display: "flex", "flex-direction": "column", 'align-items': 'center',
            "padding-top": "20px", width: "100%"
          }}>
            <Grid item style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <div style={{ display: "flex", "flex-direction": "column", 'align-items': 'flex-start', paddingLeft: "22px", width: "100%" }}>
                <Typography variant="button" gutterBottom component="div">
                  Enter the Name of the Segment
                </Typography>
                <TextField style={{ width: "90%" }} id="outlined-basic" placeholder='Name of the segment'
                  variant="outlined" onChange={onSegmentNameChange} />
              </div>
            </Grid>
            <Grid item style={{ paddingTop: "25px" }}>
              <div style={{ "font-size": "13px", fontWeight: '600', paddingLeft: "22px" }}>To save your segment, you need to add the schemas to build the query</div>
            </Grid>
            <Grid item style={{ display: "flex", justifyContent: "flex-end", width: "100%", gap: "10px", paddingTop: "25px" }}>
              <div><span className={classes.greenDot}>
              </span>-User Traits</div>
              <div><span className={classes.redDot}></span>-Group Traits</div>
            </Grid>
          </Grid>
          {selectedSchemaList?.length ? <div className={classes.blueBox}>
            <div className={classes.blueBoxInsideDiv}>
              {getSelectedSchemaList()}
            </div>
          </div> : null}
          <Grid item style={{ display: "flex", justifyContent: "flex-start", gap: "10px", alignItems: "center", paddingLeft: "22px" }} className={classes.paddingTopCls}>
            <span className={classes.greenDot}></span>
            <TextField
              select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Add schema to segment"
              value={selectedShema}
              onChange={onSchemaChange}
              style={{ width: "70%" }}
              helperText={helperText}
              error={schemaError}
            >{getSchemasDropdown([])}</TextField>
          </Grid>
          <Grid item className={classes.paddingTopCls}>
            <button
              onClick={addSchema}
              style={{
                paddingLeft: "40px", display: "flex", alignItems: "center", gap: "4px",
                border: "none", background: "none", textDecoration: "underline",
                color: schemaMainDropdown.length ? "#50c878" : "grey"
              }}
              disabled={schemaMainDropdown.length === 0}
            >
              <AddIcon></AddIcon><span>Add New Schema</span>
            </button>
          </Grid>
        </div>
        <div className={classes.actionRow}>
          <div style={{
            display: "flex", gap: "10px", justifyContent: "flex-start", width: "28%",
            paddingLeft: "15px"
          }}>
            <Button variant="contained" style={{ background: "#318f6c" }} onClick={saveSegment}>Save the Segment</Button>
            <Button variant="outlined" style={{ borderColor: "#e9dede", color: "red" }} onClick={onClickSaveSegment}>Cancel</Button>
          </div>
        </div>
      </Drawer>
    </Grid>
    <ToastContainer>toast</ToastContainer>
    </>
  );
}

export default App;
