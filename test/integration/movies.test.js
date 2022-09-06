
const supertest = require("supertest");
const app = require("../../index");
const req = supertest(app);
const { Genre } = require("../../models/genres");
const { Movie } = require("../../models/movies");
const mongoose = require("mongoose");
const { User } = require("../../models/user");

describe("/api/movies", () => {
  afterEach(async () => {
    await Genre.deleteMany({});
    await Movie.deleteMany({});
  });
  describe("GET /", () => {
    it("should return all Movies", async () => {
      const genre = new Genre({
        name: "movie genre",
      });
      await genre.save();
      await Movie.insertMany([
        {
          title: "movie1",
          dailyRentalRate: 1,
          numberInStock: 1,
          genre: { name: genre.name, _id: genre._id },
        },
        {
          title: "movie2",
          dailyRentalRate: 1,
          numberInStock: 1,
          genre: { name: genre.name, _id: genre._id },
        },
      ]);
      const res = await req.get("/api/movies");
      expect(res.status).toBe(200);
      expect(res.body.some((m) => m.title == "movie1")).toBeTruthy();
      expect(res.body.some((m) => m.title == "movie2")).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    it("should return 404 if invalid id is passed", async () => {
      const res = await req.get("/api/movies/1");
      expect(res.status).toBe(404);
    });
    it("should return movie if valid id is passed", async () => {
      const genre = new Genre({
        name: "movie genre2",
      });
      await genre.save();
      const movie = new Movie({
        title: "movieid",
        dailyRentalRate: 1,
        numberInStock: 1,
        genre: {
          _id: genre._id,
          name: genre.name,
        },
      });
      await movie.save();
      const res = await req.get("/api/movies/" + movie._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", movie.title);
    });
    it("should return 404 if movie is not found", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await req.get("/api/movies/" + id);
      expect(res.status).toBe(404);
    });
  });
  describe("POST /", () => {
    it("should return 401 if the user is not logged in", async () => {
      const res = await req.post("/api/movies").send({ title: "movie3" });
      expect(res.status).toBe(401);
    });
    it("should return 400 if title is less than 3 characters", async () => {
      const token = new User().getAuthToken();
      const res = await req
        .post("/api/movies")
        .set("x-auth-token", token)
        .send({ title: "t1", dailyRentalRate: 1, numberInStock: 1 });
      expect(res.status).toBe(400);
    });
    it("should return 400 if title is more than 50 characters", async () => {
      const token = new User().getAuthToken();
      const title = new Array(52).join("b");
      const res = await req
        .post("/api/movies")
        .set("x-auth-token", token)
        .send({ title: title, dailyRentalRate: 1, numberInStock: 1 });
      expect(res.status).toBe(400);
    });
    it("should save the movie if it is valid", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "genrep",
      });
      await genre.save();
      await req.post("/api/movies").set("x-auth-token", token).send({
        title: "movie4",
        dailyRentalRate: 1,
        numberInStock: 1,
        genreId: genre._id,
      });
      const movies = await Movie.find({ title: "movie4" });
      expect(movies[0]).not.toBeNull();
    });
    it("should return the movie if it is valid", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "genre12",
      });
      await genre.save();
      const res = await req
        .post("/api/movies")
        .set("x-auth-token", token)
        .send({
          title: "movie5",
          dailyRentalRate: 1,
          numberInStock: 1,
          genreId: genre._id,
        });

      //expect(res.body).not.toBeNull();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", "movie5");
    });
  });
  describe("PUT /:id", () => {
    it("should return 401 if the user is not logged in", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await req.put("/api/movies/" + id).send({});
      expect(res.status).toBe(401);
    });
    it("should return 400 if title is less than 3 characters", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "genre12",
      });
      await genre.save();
      const movie = new Movie({
        title: "title11",
        dailyRentalRate: 1,
        numberInStock: 1,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      const res = await req
        .put("/api/movies/" + movie._id)
        .set("x-auth-token", token)
        .send({ title: "t1", dailyRentalRate: 1, numberInStock: 1 });
      expect(res.status).toBe(400);
    });
    it("should return 400 if title is more than 50 characters", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "genre13",
      });
      await genre.save();
      const movie = new Movie({
        title: "title12",
        dailyRentalRate: 1,
        numberInStock: 1,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      const res = await req
        .put("/api/movies/" + movie._id)
        .set("x-auth-token", token)
        .send({
          title: new Array(52).join("c"),
          dailyRentalRate: 1,
          numberInStock: 1,
        });
      expect(res.status).toBe(400);
    });
    it("should return 404 if movie is not found with valid id", async () => {
      const token = new User().getAuthToken();
      const id = mongoose.Types.ObjectId();
      const res = await req
        .put("/api/movies/" + id)
        .set("x-auth-token", token)
        .send({title:"sdfash",dailyRentalRate:3,numberInStock:5,genreId:mongoose.Types.ObjectId()});
      expect(res.status).toBe(404);
    });
    it("should update movie if it is valid", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "genre14",
      });
      await genre.save();
      let movie = new Movie({
        title: "movie13",
        dailyRentalRate: 1,
        numberInStock: 1,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      await req
        .put("/api/movies/" + movie._id)
        .set("x-auth-token", token)
        .send({
          title: "movie14",
          dailyRentalRate: 1,
          numberInStock: 1,
          genreId: genre._id,
        });
      movie = await Movie.findOne({ title: "movie14" });
      expect(movie).not.toBeNull();
    });
    it("should return movie if it is valid", async () => {
      const token = new User().getAuthToken();
      const genre = new Genre({
        name: "genre15",
      });
      await genre.save();
      let movie = new Movie({
        title: "movie15",
        dailyRentalRate: 1,
        numberInStock: 1,
        genre: { name: genre.name, _id: genre._id },
      });
      await movie.save();
      const res = await req
        .put("/api/movies/" + movie._id)
        .set("x-auth-token", token)
        .send({
          title: "movie16",
          dailyRentalRate: 1,
          numberInStock: 1,
          genreId: genre._id,
        });
      expect(res.body).not.toBeNull();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", "movie16");
    });
    describe("delete/:id ",()=>{
      it("should return 401 if client is not logged in", async () => {
        const genre = new Genre({ name: "genre1" });
        await genre.save();
        let movie = new Movie({
          title: "movie15",
          dailyRentalRate: 1,
          numberInStock: 1,
          genre: { name: genre.name, _id: genre._id },
        });
        await movie.save();
        const res = await req.delete("/api/movies/" + movie._id);
        expect(res.status).toBe(401);
  })
  it("should return 403 if user is not admin ",async()=>{
    const token = new User().getAuthToken();
    const genre= new Genre({name:"genre1"});
    await genre.save();
    let movie=new Movie({
      title:"movie15",
      dailyRentalRate:1,
      numberInStock:1,
      genre: { name: genre.name, _id: genre._id },
    });
    await movie.save();
    const res = await req
      .delete("/api/movies/" + movie._id)
      .set("x-auth-token", token);
    expect(res.status).toBe(403);
  });
  it("should return 404 if id is invalid", async () => {
    const token = new User({ isAdmin: true }).getAuthToken();
    const res = await req.delete("/api/movies/1").set("x-auth-token", token);
    expect(res.status).toBe(404);
  });
  it("should return 404 if no movie with the given id was found", async () => {
    const token = new User({ isAdmin: true }).getAuthToken();
    const id = mongoose.Types.ObjectId();
    const res = await req
      .delete("/api/movies/" + id)
      .set("x-auth-token", token);
    expect(res.status).toBe(404);
  });
  it("should delete the movie if input is valid", async () => {
    const token = new User({ isAdmin: true }).getAuthToken();
    const genre = new Genre({ name: "genre111" });
    await genre.save();
    const movie = new Movie({
      title: "movie111",
      dailyRentalRate: 1,
      numberInStock: 1,
      genre: { name: genre.name, _id: genre._id },
    });
    await movie.save();
    await req.delete("/api/movies/" + movie._id).set("x-auth-token", token);
    const movieInDb = await Movie.findById(movie._id);
    expect(movieInDb).toBeNull();
  });
  it("should return the deletedmovie if input is valid", async () => {
    const token = new User({ isAdmin: true }).getAuthToken();
    const genre = new Genre({ name: "genre112" });
    await genre.save();
    const movie = new Movie({
      title: "movie112",
      dailyRentalRate: 1,
      numberInStock: 1,
      genre: { name: genre.name, _id: genre._id },
    });
    await movie.save();
    const res = await req
      .delete("/api/movies/" + movie._id)
      .set("x-auth-token", token);
    expect(res.body).toHaveProperty("_id", movie._id.toHexString());
    expect(res.body).toHaveProperty("title", movie.title);
  });
        })
  })
  })
  