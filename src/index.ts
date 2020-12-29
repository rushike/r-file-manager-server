import app from "./server"
import FileManagerAPI from "./multer-file-manager-api"
import FileManager from "./file-manager"
import API from './api'
import dotenv from 'dotenv'
if (process.env.NODE_ENV !== 'production') {
	dotenv.config();
}

const fmapi = new FileManagerAPI(app);

app.listen(process.env.PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})