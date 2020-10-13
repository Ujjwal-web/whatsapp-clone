//importing
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import Pusher from "pusher";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";


//app config
const app = express();
const port = process.env.PORT || 9000;
const pusher = new Pusher({
  appId: "1087172",
  key: "964745683bd9b9136771",
  secret: "20bdbfdd74d833b02b87",
  cluster: "ap2",
  encrypted: true,
});
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended : true}));
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname , './front-end/build')));

//middleware
app.use(express.json());
app.use(cors());
// app.use((req,res,next) => {
//   res.setHeader("Acess-Control-Allow-Origin","*");
//   res.setHeader("Acess-Control-Allow-Headers","*");
//   next();
// })

// db GVqfFPj7BPH2JbOp
const connection_url =
  "mongodb+srv://admin:GVqfFPj7BPH2JbOp@cluster0.qlur2.mongodb.net/whatsappdb?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("DB CONNECTED");

  const msgCollection = db.collection("messagecontents");

  const changeStream = msgCollection.watch();
  changeStream.on("change", (change) => {
    // console.log("new xhwge", change);
    if (change.operationType === "insert") {
      const messageDetails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        name: messageDetails.name,
        message: messageDetails.message,
        received : messageDetails.received,
      });
    } else {
      console.log("error in trigger");
    }
  });
});

//api routes
app.get("/", (req, res) => res.status(200).send("hello world"));

app.get("/messages/sync", (req, res) => {
  Messages.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.post("/messages/new", (req, res) => {
  const dbMessage = req.body;

  Messages.create(dbMessage, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

//listen
if(process.env.NODE_ENV === 'production'){
  app.get('/*',(req,res) => {
    res.sendFile(path.resolve(__dirname,'./front-end','build','index.html'))
  })
}

app.listen(port, () => console.log(`listing on ${port}`));
