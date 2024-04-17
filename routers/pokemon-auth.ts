import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { MongoClient, ObjectId } from "mongodb";

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
    const user = {
        email,
        username,
        password: hashedPassword,
        verified: false
    };
    try {
        await client.connect();
        await client.db("users").collection("usersAccounts").insertOne(user);
        res.status(201).render('pokemon-auth');
    }
    catch (_) {
        res.status(500).send("Error bij het registreren van de gebruiker. Probeer het later opnieuw.");
    }
    finally {
        await client.close();
    }
});

export default router;
