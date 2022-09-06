const { JsonWebTokenError } = require("jsonwebtoken");
const { iteratee } = require("lodash");
const mongoose = require("mongoose");
const auth =require("../../../middleware/auth")
const {User}=require("../../../models/user");
describe("auth middleware",()=>{
    it("should populate req.use if valid token is provided",()=>{
        const user ={
            _id:mongoose.Types.ObjectId(),
            isAdmin:false
        };
        const token =new User (user ).getAuthToken();
        const req={
            header:jest.fn().mockReturnValue(token)
        }
        const res={};
        const next =jest.fn();
        auth(req,res,next);
        expect(req.user).toMatchObject(user)

    })
})
