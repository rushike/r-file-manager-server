import { FileEntry } from "./entity/files";
import { getConnection, Repository } from "typeorm";
import { sleep } from "deasync";

export class Curd{
    
    connection : any;

    options : any;

    repository : Repository<FileEntry>;

    constructor(connection : any, options : any = {}){
        this.connection = connection;
        this.options = options;
        this.repository = getConnection().getRepository(FileEntry);
    }

    create_file(parent : string, name : string, file : any = null, options : any = {}){
        var file : any = this.repository.create();
        Object.keys(options).forEach(key => {
            if(key in file){
                file[key] = options[key];
            }
        })

        file.name = name;
        file.parent = parent;
        file.path = [parent, name].join("/");
        file.isdir = true;
        file.children_count = 0;
        file.options = options;

        this.repository.save(file);
    }

    create_dir(parent : string, name : string, options : any = {}){
        // console.log("Creating the directory ..., repo : ", this.repository)
        var file : any = this.repository.create();
        Object.keys(options).forEach(key => {
            if(key in file){
                file[key] = options[key];
            }
        });

        file.name = name;
        file.parent = parent;
        file.path = [parent, name].join("/");
        file.type = "dir";
        file.isdir = true;
        file.children_count = 0;
        file.filename = name;
        file.tags = "";
        file.options = {};
        this.repository.save(file);    
    }

    get_file(name: string) : FileEntry{
        var file : FileEntry = new FileEntry();
        this.repository.find({
            name : name
        });
        return file;
    }

    get_all() : object{
        return this.repository.find();
    }

    get_json_tree() : object{
        return {}
    }
}