import express from "express";
import multer from "multer";
import body_parser from 'body-parser'
const app : express.Express = express();
// for parsing json
app.use(body_parser.json()); 

// for parsing application/xwww-
app.use(body_parser.urlencoded({ extended: true })); 

// parsing for file data is done by multer in multer file manager based on need
export default app;