import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";

const router = Router();

router.use(verifyUser); 

router.get('/', async (req: Request, res: Response) => {
    // Assuming you have configured a view engine like EJS
    res.render('huidige-pokemon'); // Make sure 'huidige-pokemon' is a valid view file
});

export default router;
