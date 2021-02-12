const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const request = require("request");
const port = 9090;

const app = express();
app.use(cors());
app.use(express.json());

const db = mongoose.createConnection("mongodb://localhost:27017/memeApp", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const memeSchema = new mongoose.Schema({
  userName: String,
  image: String,
  content: String,
});

const memeModel = db.model("meme", memeSchema);

let requestCount = 0;

app.get("/memes", async (req, res) => {
  requestCount++;
  console.log("Request id :",requestCount);
  try{
  const allmemes = await memeModel.find();
  console.log("Request resolved successfully");
  res.send(allmemes);
  } catch (e) {
    console.error("Error Database is Empty....Request cannot be processed")
    res.sendStatus(404);
  }
});

app.get("/memes/:id", async(req,res) => {
  requestCount++;
  console.log("Request id :",requestCount);
  const id = req.params.id;
  try {
    const meme = await memeModel.findById(id);
    console.log(meme);
    res.send(meme)
  } catch (e) {
    console.log("Data with ",id," is not available")
    res.sendStatus(404);
  }

  
})

app.post("/memes", async (req, res) => {
  requestCount++;
  console.log("Request id :",requestCount);
  const { userName, image, content } = req.body;

  request(image, async function(error,respose,body){
    if(respose.headers["content-type"].substring(0,5)==="image"){
      console.log("if",respose.headers["content-type"]);
      try{  
        const newMeme = new memeModel({ userName, image, content });
        await newMeme.save();
      
        console.log("Post request was successful....Data added to the database!!!!")
      
        res.send(newMeme);
      
        } catch (e) {
          console.log("Request cannot be processed....", e)
        }
    } else {
      console.log(respose.headers["content-type"]);
      res.send({error:"Invalid Image url"})
    }
  })

  
});

app.delete("/memes/:id", async(req,res)=>{
  requestCount++;
  console.log("Request id :",requestCount);
  const memeid = req.params.id;
  try {
    await memeModel.deleteOne({_id:memeid});

    console.log("Request processed...Data with id ",memeid," deleted successfully");

    res.sendStatus(200);
  } catch (e) {
    console.log("Error Database is Empty....Request cannot be processed")
    console.log("OR Data not found")
    res.sendStatus(404);
  }
});

app.put("/memes/:id", async(req,res)=>{
  requestCount++;
  console.log("Request id :",requestCount);

  const {image,content} = req.body
  try {
    const meme = await memeModel.findById(req.params.id)

    meme.image = image;
    meme.content = content;

    await meme.save();

    console.error("Changes made successfully to the database")

    res.send(meme);
  } catch (e) {

    console.erro("Id ",req.params.id," not found!!!!")

    res.sendStatus(404);
  }
})

app.listen(port, () => console.log("Server Started..."));



