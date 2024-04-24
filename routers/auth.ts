import { Request, Response, Router } from "express";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";
import { client } from "../index";

const jwt = require('jsonwebtoken');


const User = require('../models/User') as any;

const router = Router();



const transporter = nodemailer.createTransport({
    host: "mail.smtp2go.com",
    port: 2525,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
        user: "tripleharmony.ap@hotmail.com",
        pass: "nXhWE8ZraSZoYONO",
    },
});

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
    return jwt.sign({ id }, 'Precious_Aziz_Mohammed', { expiresIn: maxAge });
}

router.get('/', async (req: Request, res: Response) => {
    res.render('pokemon-auth');
});

//pokemon-auth/register
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
    }
    catch (error: any) {
        const errors = handleErrors(error);
        res.status(400).json({ errors });
    }
});


router.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
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
                <p> Uw nieuwe wachtwoord is: <b style="color: red;">wachtwoord123</b></p>
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
                subject: "Wachtwoord hersteld",
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
});

router.get('/logout', (req: Request, res: Response) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/pokemon-auth');
});

export default router;
