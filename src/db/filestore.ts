import { FileEntry } from "./entity/files";

export class FileStore{
    file ?: FileEntry;
    children ?: [FileStore]; 

    to_json(){
        return {}
    }
}