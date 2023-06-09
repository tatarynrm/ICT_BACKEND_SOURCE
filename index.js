require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const EventEmitter = require("events");

const eventEmitter = new EventEmitter();
const server = http.createServer(app);
// const socketIo = require("socket.io");
// const io = socketIo(server);
const { Server } = require("socket.io");
// const io = new Server(server);
const path = require("path");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const OracleEventEmitter = require("./utils/eventEmitters");
// const EventEmitter = require("events");
const pool = require("./db/pool");
const authRouter = require("./routes/auth");
const usersRoute = require("./routes/users");
const cargosRoute = require("./routes/cargos");
const zasRoute = require("./routes/zas");
const UrRoute = require("./routes/UR");
// const chatRoute = require("./routes/chat");
const zapRoute = require("./routes/zap");
const commentsRoute = require("./routes/comments");
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
app.use("/zas", zasRoute);
app.use("/ur", UrRoute);
// app.use("/chat", chatRoute);
app.use("/zap", zapRoute);
app.use("/comments", commentsRoute);
// ROUTES------------------------------------------------------------------------------------------------------

// NODEMAILER

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "tatarynrm@gmail.com",
    pass: "uexmjdtvgddhnmkj",
  },
});
const handlebarOptions = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: "./views/",
    defaultLayout: false,
  },
  viewPath: "./views/",
  extName: ".hbs",
};
transporter.use("compile", hbs(handlebarOptions));

// NODEMAILER
app.post("/mail-send", async (req, res) => {
  const { from, to, theme } = req.body;
  try {
    const mailOptions = {
      from: `${from}`,
      to: `${to}`,
      subject: `${theme}`,
      template: "email",
      context: {
        title: "кукук",
        full_name: "СУКА",
      },
    };
    const mail = await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.json({ status: false });
      } else {
        console.log(`Email sent: ${info.response}`);
        res.json(info);
      }
    });
  } catch (error) {
    console.log(error);
  }
});

// Connect to the Oracle database
// oracleEmitter.connect();

// Execute a sample query
// oracleEmitter.executeQuery("SELECT * FROM employees");

// Disconnect from the Oracle database
// oracleEmitter.disconnect();

// oracleEmitter.executeQuery(`SELECT * FROM ICTDAT.OS`);

// WEB SOCKETS------------------------------------------------------------------------
const io = new Server(server, {
  // cors: {
  //   origin: "http://localhost:3000",
  //   methods: ["GET", "POST"],
  // },
});

let onlineUsers = [];
const addNewUser = (userId, socketId) => {
  !onlineUsers.some((user) => user.userId === userId) &&
    onlineUsers.push({ userId, socketId });
};

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUsers.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  socket.on("newUser", (userId) => {
    addNewUser(userId, socket.id);
  });
  io.sockets.emit("getUsers", onlineUsers);
  socket.on("newZap", (data) => {
    console.log("---data-", data);
    io.sockets.emit("showNewZap", data);
  });
  socket.on("newComment", (data) => {
    console.log("comment data", data);
    io.sockets.emit("showNewComment", data);
  });

  socket.on("disconnect", () => {
    // removeUser(socket.id);
    console.log("disconnect");
  });
});

// WEB SOCKETS END.........................................................

// Server run------------------------------------------------------------------------------------------------------
server.listen(process.env.PORT, () => {
  console.log(`Listen ${process.env.PORT}`);
});
