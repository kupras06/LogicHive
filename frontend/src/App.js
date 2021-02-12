import "./App.css";
import {
  TextField,
  Button,
  Grid,
} from "@material-ui/core";
import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import ListItem from "./listItem";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(5),
    color: theme.palette.text.secondary,
  },
}));

function App() {
  const classes = useStyles();

  const [meme, setMeme] = useState([]);
  const [newUser, setnewUser] = useState("");
  const [newurl, setnewurl] = useState("");
  const [newcontent, setnewcontent] = useState("");
  const [error, setError] = useState("");

  const newUserChanged = (e) => {
    setnewUser(e.target.value);
  };

  const newUrlChanged = (e) => {
    setnewurl(e.target.value);
  };

  const newcontentChanged = (e) => {
    setError("")
    setnewcontent(e.target.value);
  };

  const Submit = () => {
    if(newUser === "" || newurl === "" || newcontent === ""){
      setError("Please Enter the required field");
    } else {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      userName: newUser,
      image: newurl,
      content: newcontent,
    });

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:9090/memes", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        meme.push(result);
        setMeme([...meme]);
        setnewUser("");
        setnewcontent("");
        setnewurl("");
      })
      .catch((error) => console.log("error", error));
    }
  };

  const editHandler = (editedItem,idx) => {
    const idToEdit = meme[idx]._id;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(editedItem);

    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch(`http://localhost:9090/memes/${idToEdit}`, requestOptions)
    .then((response)=> response.json())
    .then(result=> {
      meme[idx] = result;
      setMeme([...meme]);
    })
  }

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("http://localhost:9090/memes", requestOptions)
      .then((response) => response.json())
      .then((result) => setMeme(result))
      .catch((error) => console.log("error", error));
  }, []);

  return (
    <div className="Container">
      <div className="Left">
        <Grid className="form" item xs={5}>
          <Paper className={classes.paper}>
          <form className={classes.root} noValidate autoComplete="off">
              <TextField
                onChange={newUserChanged}
                id="standard-basic"
                label="Name"
                value={newUser}
                required
              />
              <br />
              <TextField
                required
                onChange={newUrlChanged}
                id="standard-basic"
                label="Meme URL"
                value={newurl}
              />
              <br />
              <TextField
                onChange={newcontentChanged}
                id="standard-basic"
                label="Content"
                value={newcontent}
                required
              />
              <br />
              <br/>
              <p style={{color:"red"}}>{error}</p>
              <Button onClick={Submit} variant="contained" color="primary">
                Submit
              </Button>
            </form>
          </Paper>
        </Grid>
      </div>
      <div className="Right">
        <Grid className="display-items" item xs={7}>
          <ol>
            {meme.map((ele, idx) => {
              return (
                <ListItem
                  key={ele._id}
                  idx={idx}
                  pic={ele.image}
                  para={ele.content}
                  head={ele.userName}
                  editHandler={editHandler}
                />
              );
            })}
          </ol>
        </Grid>
      </div>
    </div>
  );
}

export default App;
