import { Request, Response, Router } from "express";
import bcrypt from "bcrypt";
import { MongoClient, ObjectId } from "mongodb";
import { User } from "../interfaces";
const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

const uri = "mongodb+srv://DBManager:HmnVABk3hUo3zL9P@tripleharmony.9nn57t6.mongodb.net/";
const client = new MongoClient(uri);

const transporter = nodemailer.createTransport({
    host: "mail.smtp2go.com",
    port: 2525,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "tripleharmony.ap@hotmail.com",
        pass: "nXhWE8ZraSZoYONO",
    },
});

const router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.render('pokemon-auth');
});

router.post('/register', async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user: User = {
        _id: new ObjectId(),
        email,
        username,
        password: hashedPassword,
        verified: false
    };
    try {
        await client.connect();
        if (await client.db("users").collection("usersAccounts").findOne({ email })) {
            res.status(409).render('pokemon-auth-message', { title: "Registreren is mislukt", message: "Er bestaat al een account met het opgegeven e-mailadres." });
            return;
        }
        await client.db("users").collection("usersAccounts").insertOne(user);
        // Constructing the email message
        const emailMessage = `
            <h2>Beste ${user.username},</h2>
            <br>
            <b>Welkom bij Triple Harmony! We zijn verheugd om u als lid van onze gemeenschap te verwelkomen.</b>
            <br>
            <p>Voordat u zich kunt onderdompelen in de wereld van Pokémon op onze website, moeten we uw account verifiëren. Klik op de onderstaande link om uw e-mailadres te verifiëren:</p>
            <br>
            <a href="https://tripleharmony.azurewebsites.net/pokemon-auth/verify/${user._id}">Verificatielink</a>
            <br>
            <p>Zodra uw account is geverifieerd, heeft u volledige toegang tot alle functies en inhoud op onze website. We hopen dat u een plezierige ervaring heeft met het verkennen en interactie met ons platform.</p>
            <br>
            <p>Als u vragen heeft of hulp nodig heeft, neem dan gerust contact op met ons ondersteuningsteam op <a href="mailto:tripleharmony.ap@hotmail.com">deze email</a>.</p>
            <br>
            <p>Met vriendelijke groet,</p>
            <p>Het Triple Harmony-team</p>`;

        // Sending the email
        await transporter.sendMail({
            from: '"Triple Harmony" <tripleharmony.ap@hotmail.com>',
            to: email,
            subject: "Welkom bij Triple Harmony - Verifieer uw account",
            html: emailMessage,
            priority: "high"
        });

        res.status(201).render('pokemon-auth-message', { title: "Registreren is gelukt", message: "Uw account is succesvol geregistreerd. Controleer uw e-mail om uw account te verifiëren. Bekijk eventueel in uw spam folder of ongewenste e-mailmap als u de verificatie-e-mail niet in uw inbox kunt vinden." });
    }
    catch (_) {
        res.status(500).render('pokemon-auth-message', { title: "Registreren is mislukt", message: "Er is een fout opgetreden bij het registreren van je account. " });
    }
    finally {
        await client.close();
    }
});

router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        await client.connect();
        const user = await client.db("users").collection("usersAccounts").findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            if (!user.verified) {
                res.status(401).render('pokemon-auth-message', { title: "Aanmelden is mislukt", message: "Uw account is nog niet geverifieerd. Controleer uw e-mail om uw account te verifiëren." });
                return;
            }
            res.status(200).redirect('/pokemon-submenu')
        }
        else {
            res.status(401).render('pokemon-auth-message', { title: "Aanmelden is mislukt", message: "Gebruikersnaam of wachtwoord is onjuist." });
        }
    }
    catch (_) {
        res.status(500).send("Error bij het inloggen van de gebruiker. Probeer het later opnieuw.");
    }
    finally {
        await client.close();
    }
});

router.get('/verify/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
        await client.connect();
        const user = await client.db("users").collection("usersAccounts").findOne({ _id: new ObjectId(id) });
        if (user) {
            await client.db("users").collection("usersAccounts").updateOne({ _id: new ObjectId(id) }, { $set: { verified: true } });
            res.status(200).render('pokemon-auth-message', { title: "Account geverifieerd", message: "Uw account is succesvol geverifieerd. U kunt nu inloggen op onze website." });
        }
        else {
            res.status(404).render('pokemon-auth-message', { title: "Account verifiëren is mislukt", message: "De gebruiker met het opgegeven ID bestaat niet." });
        }
    }
    catch (_) {
        res.status(500).render('pokemon-auth-message', { title: "Account verifiëren is mislukt", message: "Er is een fout opgetreden bij het verifiëren van uw account. Probeer het later opnieuw." });
    }
    finally {
        await client.close();
    }
});

router.post('/reset', async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        await client.connect();
        const user = await client.db("users").collection("usersAccounts").findOne({ email });
        await client.db("users").collection("usersAccounts").updateOne({ email }, { $set: { password: "wachtwoord123" } });
        if (user) {
            const emailMessage = `
                <h2>Beste ${user.username},</h2>
                <br>
                <b>Wachtwoord resetten</b>
                <br>
                <p>U heeft een verzoek ingediend om uw wachtwoord te resetten.</p>
                <br>
                <p> Uw nieuwe wachtwoord is: <b>wachtwoord123</b></p>
                <br>
                <p>Als u geen verzoek heeft ingediend om uw wachtwoord te resetten, kunt u deze e-mail veilig negeren.</p>
                <br>
                <p>Als u vragen heeft of hulp nodig heeft, neem dan gerust contact op met ons ondersteuningsteam op <a href="mailto:tripleharmony.ap@hotmail.com">deze email</a>.</p>
                <br>
                <p>Met vriendelijke groet,</p>
                <p>Het Triple Harmony-team</p>`;
            await transporter.sendMail({
                from: '"Triple Harmony" <tripleharmony.ap@hotmail.com>',
                to: email,
                subject: "Wachtwoord herstellen",
                html: emailMessage,
                priority: "high"
            });
            res.status(200).render('pokemon-auth-message', { title: "Wachtwoord resetten", message: "Een e-mail is verzonden naar uw e-mailadres met uw nieuwe wachtwoord." });
        }
        else {
            res.status(404).render('pokemon-auth-message', { title: "Wachtwoord resetten", message: "Er is geen gebruiker met het opgegeven e-mailadres." });
        }
    }
    catch (_) {
        res.status(500).render('pokemon-auth-message', { title: "Wachtwoord resetten", message: "Er is een fout opgetreden bij het herstellen van uw wachtwoord. Probeer het later opnieuw." });
    }
    finally {
        await client.close();
    }
});

export default router;
