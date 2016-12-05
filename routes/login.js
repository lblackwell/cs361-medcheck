var express = require('express');
var router = express.Router();

var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;

var reg_form = forms.create({
    username: fields.string({ required: true }),
    password: fields.password({ required: validators.required('You definitely want a password') }),
    confirm:  fields.password({
        required: validators.required('don\'t you know your own password?'),
        validators: [validators.matchField('password')]
    }),
    email: fields.email()
});


/* GET login page. */
router.get('/login', function(req, res, next) {
    console.log("HERE!!");
    res.sendfile('./views/UserSignIn.html');
});

module.exports = router;
