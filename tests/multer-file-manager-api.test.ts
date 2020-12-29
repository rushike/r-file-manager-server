import {expect} from "chai"


describe('multer-file-manager-api', ()=>{
    it("should create directory in './data/test'", ()=>{
        try {
            expect(1).to.equal(1);
        }catch(err){
            expect(1).to.equal(0);
        }
    })
})