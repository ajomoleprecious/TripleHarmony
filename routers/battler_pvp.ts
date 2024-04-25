import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
const http = require("http");
const { Server } = require("socket.io");
const app = require("express");


const router = Router();
router.use(verifyUser);

const server = http.createServer(app);
const io = new Server(server);
const socket = io.on("connection", (socket: any) => {
    socket.on("join-room", (roomID: string) => {
        socket.join(roomID);
        socket.to(roomID).emit("user-connected", socket.id);
    });
});

router.get("/", (req: Request, res: Response) => {
    // get full URL
    //const url = req.protocol + '://' + req.get('host') + req.originalUrl;
    const url = 'https' + '://' + req.get('host') + req.originalUrl;
    const roomID = req.query.roomID ? `${url}/?roomID=${req.params.roomID}` : `${url}/?roomID=${Math.floor(Math.random() * 1000)}`;

    socket.emit("connection", roomID);
    res.render("pokemon-battler", { roomID });
});


export default router;