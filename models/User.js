const mongoose = require('mongoose');
const { isEmail } = require('validator');

const registerUser = new mongoose.Schema({
    email : {
        type : String,
        required : [true, 'Een email is verplicht'],
        unique : [true, 'Deze email is al in gebruik'],
        lowercase : true,
        validate : [isEmail, 'Dit is geen geldig email adres']
    },
    username : {
        type : String,
        required : [true, 'Een gebruikersnaam is verplicht'],
        unique : [true, 'Deze gebruikersnaam is al in gebruik'],
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
});

const User = mongoose.model('User', registerUser);

module.exports = User;