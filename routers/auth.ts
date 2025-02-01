import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";
import { client } from "../index";
import express from "express";
import { User } from "../models/User";
import dotenv from "dotenv";
dotenv.config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = Router();
// Serve static files from the 'public' directory
router.use(express.static('public'));


// Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "tripleharmony.ap@gmail.com",
        pass: process.env.GMAIL_PASS as string
    }
});

// Send email
async function sendMail(recipient: string, subject: string, message: string) {
    try {
        await transporter.sendMail({
            from: '"Triple Harmony" <tripleharmony.ap@gmail.com>',
            to: recipient,
            subject: subject,
            html: message,
            priority: "high"
        });
    }
    catch (error: any) {
        console.log(error);
    }
}

interface ErrorMessages {
    [key: string]: string;
}

function handleErrors(error: any): ErrorMessages {
    const errors: ErrorMessages = {
        email: '',
        username: '',
        password: ''
    };

    // Incorrect username
    if (error.message === 'incorrect username') {
        errors.username = 'Dit gebruikersnaam is niet geregistreerd';
    }

    // Incorrect password
    if (error.message === 'incorrect password') {
        errors.password = 'Het ingevoerde wachtwoord is onjuist.';
    }

    // Not verified
    if (error.message === 'account not verified') {
        errors.username = 'Uw account is nog niet geverifieerd. Controleer uw e-mail voor de verificatielink.';
    }

    // Duplicate error code
    if (error.code === 11000) {
        if (error.keyValue.email) {
            errors.email = 'Dit e-mailadres is al geregistreerd';
        }
        if (error.keyValue.username) {
            errors.username = 'Deze gebruikersnaam is al geregistreerd';
        }
        return errors;
    }

    // Validation errors
    if (error.message.includes('User validation failed')) {
        Object.values(error.errors).forEach(({ path, message }: any) => {
            errors[path] = message;
        });
    }
    return errors;
}

// Create JSON web token
const maxAge = 1 * 24 * 60 * 60; // 1 day
const createToken = (id: string) => {
    return jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: maxAge });
}

router.get('/', async (req: Request, res: Response) => {
    res.render('pokemon-auth');
});

router.post('/register', async (req: Request, res: Response) => {
    const { email, username, password } = req.body;
    try {
        const user = await User.create({ email, username, password });
        res.status(201).json({ user: user._id });

        // Constructing the email message
        const emailMessage = `
            <h2>Beste ${user.username},</h2>
            <br>
            <b>Welkom bij Triple Harmony! We zijn verheugd om u als lid van onze gemeenschap te verwelkomen.</b>
            <br>
            <p>Voordat u zich kunt onderdompelen in de wereld van Pokémon op onze website, moeten we uw account verifiëren. Klik op de onderstaande link om uw e-mailadres te verifiëren:</p>
            <br>
            <a href="${req.protocol}://${req.get('host')}/pokemon-auth/verify/${user._id}">Verificatielink</a>
            <br>
            <p>Zodra uw account is geverifieerd, heeft u volledige toegang tot alle functies en inhoud op onze website. We hopen dat u een plezierige ervaring heeft met het verkennen en interactie met ons platform.</p>
            <br>
            <p>Als u vragen heeft of hulp nodig heeft, neem dan gerust contact op met ons ondersteuningsteam op <a href="mailto:tripleharmony.ap@gmail.com">deze email</a>.</p>
            <br>
            <p>Met vriendelijke groet,</p>
            <p>Het Triple Harmony-team</p>`;

        // Sending the email
        await sendMail(email, "Welkom bij Triple Harmony - Verifieer uw account", emailMessage);
    }
    catch (error: any) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
});

// ( /pokemon-auth/login )
router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000, secure: true, sameSite: 'strict'});
        res.status(200).json({ user: user._id });
    }
    catch (error) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
});

router.get('/verify/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    try {
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
});

router.post('/reset', async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        // find user by email
        const user = await client.db("users").collection("usersAccounts").findOne({ email });
        // generate random password
        const password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await client.db("users").collection("usersAccounts").updateOne({ email }, { $set: { password: password } });
        if (user) {
            // Constructing the email message
            const emailMessage = `
                <h2>Beste ${user.username},</h2>
                <br>
                <b>Wachtwoord resetten</b>
                <br>
                <p>U heeft een verzoek ingediend om uw wachtwoord te resetten.</p>
                <br>
                <p> Uw tijdelijke wachtwoord is: <b style="color: red;">${password}</b></p>
                <br>
                <p>Wij raden u aan om uw wachtwoord zo snel mogelijk te wijzigen met deze <a href="${req.protocol}://${req.get('host')}/pokemon-auth/change-password/${user._id}">link</a>.</p>
                <br>
                <p>Als u geen verzoek heeft ingediend om uw wachtwoord te resetten, kunt u deze e-mail veilig negeren.</p>
                <br>
                <p>Als u vragen heeft of hulp nodig heeft, neem dan gerust contact op met ons ondersteuningsteam op <a href="mailto:tripleharmony.ap@gmail.com">deze email</a>.</p>
                <br>
                <p>Met vriendelijke groet,</p>
                <p>Het Triple Harmony-team</p>`;
            // Sending the email
            await sendMail(email, "Wachtwoord hersteld", emailMessage);
            res.status(200).render('pokemon-auth-message', { title: "Wachtwoord resetten", message: "Een e-mail is verzonden naar uw e-mailadres met uw nieuwe tijdelijke wachtwoord." });
        }
        else {
            res.status(404).render('pokemon-auth-message', { title: "Wachtwoord resetten", message: "Er is geen gebruiker met het opgegeven e-mailadres." });
        }
    }
    catch (_) {
        res.status(500).render('pokemon-auth-message', { title: "Wachtwoord resetten", message: "Er is een fout opgetreden bij het herstellen van uw wachtwoord. Probeer het later opnieuw." });
    }
});

router.get('/logout', (req: Request, res: Response) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/pokemon-auth');
});

router.get('/change-password/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    res.render('change-password', { id });
});

router.post('/change-password/:id', async (req: Request, res: Response) => {
    const id = req.params.id;
    const { oldPassword, newPassword } = req.body;
    try {
        const user = await client.db("users").collection("usersAccounts").findOne({ _id: new ObjectId(id) });
        if (user) {
            if (oldPassword === newPassword) {
                res.status(400).render('pokemon-auth-message', { title: "Wachtwoord wijzigen", message: "Het nieuwe wachtwoord mag niet hetzelfde zijn als het oude wachtwoord." });
            }
            if (oldPassword !== user.password) {
                res.status(400).render('pokemon-auth-message', { title: "Wachtwoord wijzigen", message: "Het oude wachtwoord is onjuist. Gelieve ook na te kijken of u de juiste tijdelijk wachtwoord heeft ingevoerd." });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            await client.db("users").collection("usersAccounts").updateOne({ _id: new ObjectId(id) }, { $set: { password: hashedPassword } });
            res.status(200).render('pokemon-auth-message', { title: "Wachtwoord wijzigen", message: "Uw wachtwoord is succesvol gewijzigd." });
        }
        else {
            res.status(404).render('pokemon-auth-message', { title: "Wachtwoord wijzigen", message: "De gebruiker met het opgegeven ID bestaat niet." });
        }
    }
    catch (_) {
        res.status(500).render('pokemon-auth-message', { title: "Wachtwoord wijzigen", message: "Er is een fout opgetreden bij het wijzigen van uw wachtwoord. Probeer het later opnieuw." });
    }
});

router.get("/register-success", (req: Request, res: Response) => {
    res.render("register-success");
});



export default router;
