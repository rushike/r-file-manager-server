import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ObjectID, ObjectIdColumn, } from "typeorm"

@Entity("files")
export class FileEntry {

    @PrimaryGeneratedColumn()
    id!: number;
    // @ObjectIdColumn()
    // id =  ObjectID;

    @Column({nullable : true, name : "name"})
    name ?: string;

    @Column({nullable : true, name : "type"})
    type ?: string;

    @Column({nullable : true,  name: "parent" })
    parent?: string;

    @Column({nullable : true,  name: "path" })
    path?: string;

    @Column({nullable : true,  name: "children_count" })
    children_count?: number;

    @Column({nullable : true,  name: "thumbnail_url" })
    thumbnail_url?: string;

    @Column({nullable : true, name : "filename"})
    filename?: string;

    @Column({nullable : true, name : "isDir", default : false})
    isdir? : boolean;

    @Column({nullable : true, name : "ishidden", default : false})
    ishidden? : boolean;

    @Column({nullable : true, name : "issymlink", default : false})
    issymlink? : boolean;

    @Column({nullable : true, name : "openable", default : true})
    openable? : boolean;

    @Column({nullable : true, name : "selectable", default : true})
    selectable? : boolean;

    @Column({nullable : true, name : "isencrypted", default : false})
    isencrypted? : boolean;

    @Column({nullable : true, name : "draggable", default : false})
    draggable? : boolean;

    @Column({nullable : true, name : "droppable", default : false})
    droppable? : boolean;

    @Column({nullable : true, name : "size", default : false})
    size? : boolean;
    
    @Column({nullable : true,  name: "tags" })
    tags?: string;

    @CreateDateColumn()
    created_at? : Date;

    @UpdateDateColumn()
    modified_at? : Date;
    
    @Column({nullable : true,  name: "options" })
    options?: string;
}