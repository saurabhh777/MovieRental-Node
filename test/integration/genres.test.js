
const { array } = require("joi");
const mongoose =require("mongoose");
const supertest =require("supertest");
const app =require("../../index");
const req =supertest(app);
const {Genre}=require("../../models/genres");
const { User } = require("../../models/user");

describe("/api/genres",()=>{
    afterEach(async() =>{
        await Genre.deleteMany({});
    })
    describe("GET/",()=>{
        it("should return all genres",async()=>{
            await Genre.insertMany([{name:"genre1"},{name:"genre2"}])
            const res =await req.get("/api/genres");
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some((g)=>g.name =="genre1")).toBeTruthy();
            expect(res.body.some((g)=> g.name=="genre2")).toBeTruthy();
        })
    })
    describe("GET/:id",()=>{
        
        it("should return 404 if invalid id is passed ",async()=>{
            const res= await req.get("/api/genres/1");
            expect(res.status).toBe(404);
    })
    it("should return genre if valid id is passed",async()=>{
        const genre =new Genre({
            name:"genre1"
        });
        await genre.save();
        const res= await req.get("/api/genres/" +genre._id);
        
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("_id");
        expect(res.body).toHaveProperty("name",genre.name);

    })  
    
    it("should return error message if the genres is not exit with this id",async()=>{
        const id= new mongoose.Types.ObjectId();
        const res =await req.get("/api/genres/"+id);
        expect(res.status).toBe(404);
    })

describe("POST/",()=>{
it("should return 401 if the user is not logged in",async()=>{
    
})
it("should return 400 if genre is maximum 50 character ",async()=>{
                const token =new User().getAuthToken();

            const res = await req
            .post("/api/genres")
            .set("x-auth-token",token)
            .send({name:"g1"});
            expect(res.status).toBe(400);
}) 
})
it("should save the genre if it is valid",async ()=>{
            const token =new User().getAuthToken();
            const res =await req
            .post("/api/genres")
            .set("x-auth-token",token)
            .send({name:"genre1"});
            const genre =await Genre.find({name:"genre1"});
            expect(genre).not.toBeNull();
} )
})

it("should return the genre if it is valid",async ()=>{
        const token =new User().getAuthToken();
        const res =await req
        .post("/api/genres")
        .set("x-auth-token",token)
        .send({name:"genre1"});
       expect(res.body).toHaveProperty("_id");
       expect(res.body).toHaveProperty("name","genre1");
    })
describe("PUT /",() =>{
it("should return 401 if client is not logged in",async()=>{
            const id=mongoose.Types.ObjectId();
            const res=await req
            .put("/api/genres/"+id).
            send({name:"genre"})
            expect(res.status).toBe(401)

        })
            
        
it("should return 400 if genre is less than 5 character",async()=>{
                const token =new User().getAuthToken();
                const genre= new Genre({name:"genre1"});
                await genre.save();
                const res = await req
                .put("/api/genres/"+genre._id)
                .set("x-auth-token",token)
                .send({name:"g1"});
                expect(res.status).toBe(400);
    })
    
      
it("should return 400 if genre is more than 50 character ",async()=>{
            const name=new Array(52).join("a");
            const token =new User().getAuthToken();
        const id= mongoose.Types.ObjectId();
        const res = await req
        .put("/api/genres/"+id)
        .set("x-auth-token",token)
        .send({name:name});
        expect(res.status).toBe(400);
    }) 
    
  
it("should return 404 if invalid id is passed ",async()=>{
            const res= await req.get("/api/genres/1");
            expect(res.status).toBe(404);
    
    })
it("should return 404 if genre with the given id was not found",async()=>{
        const id= new mongoose.Types.ObjectId();
        const res =await req.get("/api/genres/"+id);
        expect(res.status).toBe(404);
    })
it("should update the genre if input is valid",async()=>{
        const token=new User().getAuthToken();
        let genre=new Genre({
            name:"genre1"
        });
        await genre.save();
        const res=await req
        .put("/api/genres/"+genre._id)
        .set("x-auth-token",token)
        .send({name:"new genre"});
        genre= await Genre.findById(genre._id);
        expect(genre.name).toBe("new genre");
    })
it("should retur the updated genre if it is valid",async()=>{
        const token =new User().getAuthToken();
        let genre =new Genre({
            name:"genre1",
          _id: mongoose.Types.ObjectId().toHexString(),
      
        });
        await genre.save();
        const res=await req
        .put("/api/genres/"+genre._id)
        .set("x-auth-token",token)
        .send({name:"new genre"});
       expect(res.body).toHaveProperty("_id",genre._id.toHexString());
       expect(res.body).toHaveProperty("name","new genre")

})
describe("DELETE/",()=>{
it("should return 401 if client is not logged in",async()=>{
    const id=mongoose.Types.ObjectId();
    const res=await req
    .delete("/api/genres/"+id)
    .send({name:"genre"})
    expect(res.status).toBe(401)  
})
it("should return 403 if the user is not an admin",async()=>{
    const token =new User({isAdmin:false}).getAuthToken();
    const id=mongoose.Types.ObjectId();
    const res=await req
    .delete("/api/genres/"+id)
    .set("x-auth-token",token)
    expect(res.status).toBe(403) 
})
it("should  return 404 if id is invalid",async()=>{    
    const token =new User({isAdmin:true}).getAuthToken();
    const id=mongoose.Types.ObjectId();
    const res=await req
    .delete("/api/genres/"+id)
    .set("x-auth-token",token)
    .send({name:"genre"})
    expect(res.status).toBe(404)  
})
})
it("should return 404 if no genre with the given id was found",async()=>{
    const token =new User({isAdmin:true}).getAuthToken();
    const id=mongoose.Types.ObjectId();
    const res = await req
    .delete("/api/genres/"+id) 
    .set("x-auth-token",token)
    .send({name:"new genre"}) 
    expect(res.status).toBe(404) 
})

it("should delete the genre if input is valid",async()=>{
    const token =new User({isAdmin:true}).getAuthToken();
    const genre =new Genre({name:"genre1"})
    await genre.save();
    const res = await req
    .delete("/api/genres/"+ genre._id)
    .set("x-auth-token",token) 
})
it("should return the removed genre",async()=>{
    const token =new User({isAdmin:true}).getAuthToken();
    const genre=new Genre({name:"genre1"});

    const id=mongoose.Types.ObjectId().toHexString();
    await genre.save();
    const res=await req
    .delete("/api/genres/"+genre._id)
    .set("x-auth-token",token)
    expect(res.body).toHaveProperty("_id",genre._id.toHexString());
    expect(res.body).toHaveProperty("name",genre.name);
    
})
})
})
    
     


