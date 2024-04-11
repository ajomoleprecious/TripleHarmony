import { Request, Response, Router } from "express";

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    // Assuming you have configured a view engine like EJS
    res.render('huidige-pokemon'); // Make sure 'huidige-pokemon' is a valid view file
});

export default router;
