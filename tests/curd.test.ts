import {expect} from "chai"
import {DBFileManager} from "../src/db/index"
import {Curd} from "../src/db/curd"

describe('curd', ()=>{
    it("should create directory in database", ()=>{
        try {
            var dbfm : DBFileManager = new DBFileManager();  
            var curd : Curd = new Curd(dbfm.connect());
            curd.create_dir("./test", "new_test_dir")  
            expect(1).to.equal(1);
        }catch(err){
            expect(1).to.equal(0);
        }
    })
})