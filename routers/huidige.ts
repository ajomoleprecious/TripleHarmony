import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";
import express from "express";

const router = Router();

router.use(verifyUser);
// Serve static files from the 'public' directory
router.use(express.static('public'));

router.get('/', async (req: Request, res: Response) => {
    // Assuming you have configured a view engine like EJS
    res.render('huidige-pokemon'); // Make sure 'huidige-pokemon' is a valid view file
});

export default router;
