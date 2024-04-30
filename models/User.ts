const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

// Define the schema
const UserSchema = new mongoose.Schema({
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
        minlength : [8, 'Het wachtwoord moet minstens 8 tekens lang zijn.']
    },
    verified : {
        type : Boolean,
        default : false
    }
}, { versionKey: false });

// Pre save hook (middleware) to run before saving a new user
UserSchema.pre('save', async function(this: any, next: any) {
    // Hash the password with salt rounds
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    
    next();
});

// Get the connection to the users database
const usersDB = mongoose.connection.useDb('users');

// static method to login the user
UserSchema.statics.login = async function(username : any, password : any) {
    // Find the user with the username
    const user = await this.findOne({ username });
    // If the user exists, compare the password
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            if (user.verified === false) {
                throw Error('account not verified');
            }
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect username');
}

// Create the User model using the schema and connection
export const User = usersDB.model('User', UserSchema, 'usersAccounts');

// Export the User model
//module.exports = User;
