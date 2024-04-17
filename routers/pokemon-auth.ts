import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";

const uri = "mongodb+srv://DBManager:HmnVABk3hUo3zL9P@tripleharmony.9nn57t6.mongodb.net/"

const client = new MongoClient(uri);

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.render('pokemon-auth');
});

router.post('/register', async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log(`Received register request for user: ${username} with email: ${email} and password: ${hashedPassword}`);
    res.render('pokemon-auth');
});

export default router;
