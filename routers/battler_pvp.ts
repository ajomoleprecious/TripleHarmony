import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
const express = require("express");

const router = Router();
router.use(verifyUser);

router.get("/", (req: Request, res: Response) => {
    // get full URL
    const url = 'https' + '://' + req.get('host') + req.originalUrl;
    const roomID = req.query.roomID? `${url}/?roomID=${req.query.roomID}` : `${url}/?roomID=${Math.floor(Math.random() * 1000)}`;

    res.render("pokemon-battler", { roomID });
});

export default router;