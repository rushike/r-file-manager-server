import multer from "multer";
import express from "express"
import fs from 'fs';
import path from 'path'
import body_parser from 'body-parser'
import FileManager from "./file-manager"

var urlencoded_parser = body_parser.urlencoded({ extended: false })
export default class FileManagerAPI{
    
    app : express.Express;

    options : any;

    fm : FileManager;


    constructor(app : express.Express, options = {root : "./data/files"}) {
        this.app = app
        this.options = this.set_options(options);
        this.fm = new FileManager({root : options.root})
        this.start()
    }

    set_options(options : any){
        options.root = "./data/files";
        this.options = options;
        return options
    }
    get_disk_storage(parent : string = "", name : string = ""){
        var options = this.options
        
        return multer.diskStorage({
            destination: function (req, file, cb) {
                fs.mkdir(path.join(options.root, req.body.parent || ""), { recursive: true }, (err) => {
                    if (err) throw err;
                });
                cb(null, path.join(options.root, req.body.parent || ""))
            },
            filename: function (req, file, cb) {
                var name = ""
                if(!req.body.name) name = file.originalname
                else {
                    var name_ext = req.body.name.split(".").pop()
                    var file_ext = file.originalname.split(".").pop()
                    if(name_ext !=  file_ext)
                        name = [req.body.name, file_ext].join(".")
                }                
                cb(null, path.join(parent, name))
            }
        })
    }
    get_multer_disk(parent = "", name = "") : multer.Multer{
        return multer(
            {                 
                storage : this.get_disk_storage(parent, name)
            }
        )
    }
    start(){
        this.get_files()
        this.create_folder();
        this.create_file();
        this.rm_file();
        this.rm_dir()
        this.rename_file();
        this.fm.sync()
    }

    get_files(){
        this.app.get('/admin/files/get', (req, res, next)=>{
            if(req.query.path){
                var pathstr = req.query.path?.toString()
                var children = (req.query.children?.toString() || 'true') == 'true'
                res.send({ "status" : 200, "data" : this.fm.get(pathstr, children), "message" : "ok"})
            }else {
                res.send({"status" : 400, "data" : [], "message" : "'path' not specified in GET arguments"})
            }
        });
    }

    create_folder(){
        var options = this.options
        var root = this.get_multer_disk()
        this.app.post('/admin/files/mkdir', root.none(), function (req: any, res: any, next: any) {
            var params = req.body
            if(!params.parent) params.parent = path.join(options.root, "noroot")
            else params.parent = path.join(options.root, params.parent)
            if(!params.name) params.name = "test"  + (Math.random() * 100).toFixed(0)
            fs.mkdirSync(path.join(params.parent, params.name), { recursive: true })
            res.send("directory created")
        })
    }

    /**
     * Upload file to directory specified in form data
     * Note : Please put rest file details above file in UI form
     * Throws Error if given config file like .gitignore, .env etc
     */
    create_file(){
        var root : multer.Multer = this.get_multer_disk()
        this.app.post('/admin/files/upload-file', root.any(), async (req : any, res : any) => {
            try {
                res.sendStatus(200)
            } catch (err) {
                res.sendStatus(400);
            }
        })
    }

    rm_file(){
        var options = this.options
        var root : multer.Multer = this.get_multer_disk()
        this.app.post('/admin/files/rm', root.none(), function (req: any, res: any, next: any) {
            var params = req.body
            console.log(params)
            if(params.path) {
                try {
                    params.parent = path.join(options.root, "noroot")
                    fs.unlinkSync(params.path);
                    res.send({
                        status : 200,
                        message : `File ${params.path} deleted success fully`
                    });
                } catch(err){
                    res.send({
                        status : 400,
                        message : `File ${params.path} doesn't exists`
                    })
                }
            }
            else res.send({
                status : 400,
                message : "file not deleted specify path param"
            });
        })
    }

    /**
     * removes the empty directory
     */
    rm_dir(){
        var options = this.options
        var root : multer.Multer = this.get_multer_disk()
        this.app.post('/admin/files/rmdir', root.none(), function (req: any, res: any, next: any) {
            var params = req.body
            if(params.path) {
                try {
                    fs.rmdirSync(path.join(options.root, params.path), {recursive :  false});
                    res.send({
                        status : 200,
                        message : `File ${path.join(options.root, params.path)} deleted success fully`
                    });
                } catch(err){
                    res.send({
                        status : 400,
                        message : `File ${params.path} doesn't exists`
                    })
                }
            }
            else res.send({
                status : 400,
                message : "file not deleted specify path param"
            });
        })
    }



    rename_file(){
        var options = this.options
        var root : multer.Multer = this.get_multer_disk()
        this.app.post('/admin/files/rename', root.none(), function (req: any, res: any, next: any) {
            var params = req.body
            console.log(params)
            if(params.parent && params.curr_name && params.new_name) {
                try {
                    var curr_file_name = path.join(options.root, params.parent, params.curr_name)
                    var new_file_name = path.join(options.root, params.parent, params.new_name)
                    fs.renameSync(curr_file_name, new_file_name);
                    res.send({
                        status : 200,
                        message : `File ${params.path} deleted success fully`
                    });
                } catch(err){
                    console.log(err)
                    res.send({
                        status : 400,
                        message : `File ${params.path} doesn't exists`
                    })
                }
            }
            else res.send({
                status : 400,
                message : "file not deleted specify param [parent, curr_file, new_file]"
            });
        })
    }
    
}