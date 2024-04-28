import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import { currentAvatar } from "../middleware/userAvatar";
import { client } from "../index";
import express from "express";

const router = Router();
router.use(verifyUser);
router.use(currentAvatar);
// Serve static files from the 'public' directory
router.use(express.static('public'));

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
  serveClient: false,
  path: "localhost:3000/pokemon-battler/socket.io"
});

// Socket.io
io.on("connection", (socket: any) => {
  console.log("User connected: " + socket.id);
});

// http://localhost:3000/pokemon-battler
router.get("/", (req: Request, res: Response) => {
  // get full URL
  const url = 'http' + '://' + req.get('host') + req.originalUrl;
  const roomID = req.query.roomID ? `${url}/?roomID=${req.query.roomID}` : `${url}/?roomID=${Math.floor(Math.random() * 1000)}`;
  const avatar = res.locals.currentAvatar;
  res.render("pokemon-battler", { roomID, avatar });
});

router.post("/change-avatar/:avatar", async (req, res) => {
  res.locals.avatar = req.params.avatar;
  try {
      await client.db("users").collection("usersAvatars").updateOne({ _id: res.locals.user._id }, { $set: { avatar: res.locals.avatar } }, { upsert: true });
      res.status(200).json({ message: "Avatar is succesvol gewijzigd." });
  }
  catch (err) {
      console.error(err);
  }
});

export default router;