import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import express from "express";

const router = Router();
router.use(verifyUser);
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
    const roomID = req.query.roomID? `${url}/?roomID=${req.query.roomID}` : `${url}/?roomID=${Math.floor(Math.random() * 1000)}`;

    res.render("pokemon-battler", { roomID });
});

export default router;