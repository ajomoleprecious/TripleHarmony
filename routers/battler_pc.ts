import { Request, Response, Router } from "express";
import { verifyUser } from "../middleware/verifyUser";

const router = Router();
router.use(verifyUser);

router.get("/", (req: Request, res: Response) => {
  res.render("pokemon-battler-vs-pc");
});


export default router;