require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const server = http.createServer(app);
const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const pool = require("./db/index");
const authRouter = require("./routes/auth");
const usersRoute = require("./routes/users");
const cargosRoute = require("./routes/cargos");
// Middlewares------------------------------------------------------------------------------------------------------
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(express.json());
// Middlewares------------------------------------------------------------------------------------------------------

// ROUTES------------------------------------------------------------------------------------------------------
app.use("/auth", authRouter);
app.use("/users", usersRoute);
app.use("/cargos", cargosRoute);

// ROUTES------------------------------------------------------------------------------------------------------

// app.get("/", (req, res) => {
//   res.send("<h1>Hello world</h1>");
// });

// Server run------------------------------------------------------------------------------------------------------
server.listen(process.env.PORT, () => {
  console.log(`Listen ${process.env.PORT}`);
  const getUsers = async () => {
    try {
      // const connection = await oracledb.getConnection(pool);
      // const result = await connection.execute(
      //   `select * from ictdat.os where zvildat is null and ismen = 1`
      // );
      // console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  // getUsers();
});
