import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(5),
    color: theme.palette.text.secondary,
  },
}));

export default function List(props) {
  const classes = useStyles();

  const [editedItem, seteditedItem] = useState({});
  const [editMode, seteditMode] = useState(false);
  const [editpic, seteditpic] = useState(props.pic);
  const [editcontent, seteditcontent] = useState(props.para);

  const updatePic = (e) => {
    seteditpic(e.target.value);
  }

  const updateContent = (e) => {
    seteditcontent(e.target.value);
  }

  const saveEditedItem = () => {
    editedItem.todo = props.head;
    editedItem.image = editpic;
    editedItem.content = editcontent;

    props.editHandler(editedItem,props.idx);
    seteditedItem({});
    seteditMode(false);
  }

  // const img = new Image();
  // img.src = props.pic;
  // img.onload = function(){
  //   console.log("valid Image");
  // }
  
  // img.onerror = function() {
  //   console.log("Image error");
  // }

  

  return (
    <div id="main">
      {editMode ? (
        <>
          <Paper className={classes.paper}>
            <form noValidate autoComplete="off">
              <TextField
                id="standard-basic"
                label="Name"
                placeholder="Add title"
                disabled
                value={props.head}
              />
              <br />
              <TextField
                id="standard-basic"
                label="Meme URL"
                placeholder="Add title"
                onChange={updatePic}
                value={editpic}
              />
              <br />
              <TextField
                id="standard-basic"
                label="Content"
                placeholder="Add title"
                onChange={updateContent}
                value={editcontent}
              />
              <br />
              <Button onClick={saveEditedItem} variant="contained" color="primary">
                Save
              </Button>
            </form>
          </Paper>
        </>
      ) : (
        <>
          <h2>User: {props.head}</h2>
          <img alt="" src={props.pic} />
          <p>{props.para}</p>
          <Button
            variant="contained"
            color="primary"
            onClick={() => seteditMode(true)}
          >
            Edit
          </Button>
        </>
      )}
    </div>
  );
}
