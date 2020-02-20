const express= require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postRouter = require('./routes/posts');
const userRouter = require('./routes/users');
const path = require('path');
const app = express();

mongoose.connect("mongodb+srv://debankurdas:"+process.env.MONGO_ATLAS_PW+"@cluster0-ebgm5.mongodb.net/node-angular")
.then(()=>{
  console.log("Connected to database");
})
.catch(() => {
  console.log("Connection error");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use("/images", express.static(path.join('backend/images')));
app.use((req,res,next)=>
{
  res.setHeader(
    'Access-Control-Allow-Origin','*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    "Origin, X-Requested-With,Content-Type,Accept,Authorization"
    );
  res.setHeader(
    'Access-Control-Allow-Methods',
    "GET,POST,PATCH,PUT,DELETE,OPTIONS"
    );
    next();
})

app.use('/api/posts',postRouter);
app.use('/api/users',userRouter);

module.exports = app;

