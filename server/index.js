import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from 'cors'

// Importing Routes                    // always add .js while importing routes
import AuthRoute from './Routes/AuthRoute.js'; 
import UserRoute from './Routes/UserRoute.js';
import PostRoute from './Routes/PostRoute.js';
import UploadRoute from './Routes/UploadRoute.js';

const app = express();  //created express server 

//TO SERVER IMAGES FOR PUBLIC 
app.use(express.static('public'))
app.use('/images',express.static('public'))

//MiddleWare

app.use(cors());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));



//.env file
dotenv.config();



//database connection
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrLParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(process.env.PORT, () =>
      console.log(`Listenning at ${process.env.PORT}`)
    )
  )
  .catch((error) => console.log(error));


  // usage of Routes
 app.use('/auth',AuthRoute)
 app.use('/user',UserRoute)
 app.use('/post',PostRoute)
 app.use('/upload',UploadRoute);