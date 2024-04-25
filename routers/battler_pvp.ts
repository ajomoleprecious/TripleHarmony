import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
const http = require("http");
const { Server } = require("socket.io");
const app = require("express");


const router = Router();
router.use(verifyUser);

const server = http.createServer(app);
const io = new Server(server);

router.get("/", (req: Request, res: Response) => {
    res.render("pokemon-battler");
});


export default router;