import directory_tree from 'directory-tree'
import hash from "object-hash"
import path from "path"


const CHONKY_TRANSFORMER : any = {
    "extension" : "ext",
    "ext" : "extension",

    // "childrenCount" : null, need to specify this in recusive call part of transformation

    "ctime" : "modDate",
    "modDate" : "ctim",

    "size" : "size",

    "name" : "name",

    "path" : "path",
}

export default class FileManager{
    tree : any = {};

    options : {root : string}

    chonky_tree : any = {}

    constructor(options : {root : string} | undefined){
        this.options = options || {root : "."}
    }

    sync(){
        this.tree = directory_tree(this.options.root, {attributes : ["ctime"]});
        this.chonky_tree = this.chonky_transform(this.tree)    
    }

    chonky_transform(directory_tree : any){
        var chonky_tree : any = {}
        if(directory_tree.hasOwnProperty("children") && Array.isArray(directory_tree["children"])){
            chonky_tree["childrenCount"] = directory_tree["children"].length
            chonky_tree["children"] = {}
            for (var val of directory_tree["children"] || []){
                chonky_tree["children"][val.name] =  this.chonky_transform(val)
            }
        }
        for(var key in directory_tree){
            if (CHONKY_TRANSFORMER.hasOwnProperty(key)){
                chonky_tree[CHONKY_TRANSFORMER[key]] = directory_tree[key]
            }
            
        }
        
        chonky_tree["isDir"] = directory_tree.type == "directory"
        chonky_tree["isSymlink"] = directory_tree.type == "symbolicLink"
        chonky_tree["id"] = hash(directory_tree)
        return chonky_tree
    }

    get_(pathstr : string){
        var {dir, base} = path.parse(pathstr)
        console.log("dir, base  : ", dir, base)
        if([".", "", "\\", "/"].includes(dir)){
            return this.chonky_tree["children"][base];
        }
        var tree : any = this.get_(dir)

        return tree["children"][base]
    }

    get(pathstr : string, children = true){
        var tree_object =  this.get_(pathstr)
        if (children && tree_object.hasOwnProperty("children")){
            return Object.values(tree_object["children"]);
        }else if(!children && tree_object.hasOwnProperty("children")){
            delete tree_object["children"]
            return tree_object;
        }else if (!children){
            return tree_object
        }return []
    }

    create_folder(path : string){

    }

    create_file(){

    }

    delete_file(){

    }

    rename_file(){

    }

}
