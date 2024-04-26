import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import express from "express";

const router = Router();
router.use(verifyUser);
// Serve static files from the 'public' directory
router.use(express.static('public'));

router.get("/", (req: Request, res: Response) => {
    res.render("pokemon-finder");
});
export default router;