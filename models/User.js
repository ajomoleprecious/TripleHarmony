const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

// Define the schema
const registerUserSchema = new mongoose.Schema({
    email : {
        type : String,
        required : [true, 'Een email is verplicht'],
        unique : true,
        lowercase : true,
        validate : [isEmail, 'Dit is geen geldig email adres']
    },
    username : {
        type : String,
        required : [true, 'Een gebruikersnaam is verplicht'],
        unique : true,
        lowercase : true
    },
    password : {
        type : String,
        required : [true, 'Een wachtwoord is verplicht'],
        minlength : [8, 'Het wachtwoord moet minimaal 8 karakters bevatten']
    },
    verified : {
        type : Boolean,
        default : false
    }
}, { versionKey: false });

// Pre save hook (middleware) to run before saving a new user
registerUserSchema.pre('save', async function(next) {
    // Hash the password with salt rounds
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
});


// Get the connection to the users database
const usersDB = mongoose.connection.useDb('users');

// static method to login the user
registerUserSchema.statics.login = async function(email, password) {
    // Find the user with the email
    const user = await this.findOne({ email });
    // If the user exists, compare the password
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw Error('Fout wachtwoord');
    }
    throw Error('Fout email adres');
}

// Create the User model using the schema and connection
const User = usersDB.model('User', registerUserSchema, 'usersAccounts');

// Export the User model
module.exports = User;
