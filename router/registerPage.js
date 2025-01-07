const express = require('express')
const router = express.Router()
const { join } = require('path')
const User = require(join(__dirname, '..', 'model', 'userModel.js'));

router.get('/', (req, res) => {
    if (res.locals.user) {
        return res.redirect('/error')
    }
    res.render('site/register')
})

router.post('/', async (req, res) => {
    try {
        if (!req.body) {
            return res.json({
                case: false,
                message: 'veri iletilemedi Req.body'
            })
        }
        const { email, username, password } = req.body

        if (!email || !username || !password) {
            return res.json({
                case: false,
                message: 'veri iletilemedi single data'
            })
        }

        const gmailRGX = new RegExp(/@gmail.com/, 'g')

        if (!gmailRGX.test(email)) {
            return res.json({
                case: false,
                message: 'Email alanı hatalıdır!'
            })
        }

        const usernameRGX = new RegExp(/^[a-zA-Z0-9_]{1,20}$/, 'g');

        if (!usernameRGX.test(username)) {
            return res.json({
                case: false,
                message: 'Kullanıcı adı en fazla 20 karakter uzunluğunda olmalıdır.'
            });
        }

        const passwordRGX = new RegExp(/^[a-zA-Z0-9!@#$%^&*()_+=\-{}[\]:;"'<>,.?/\\|~`]{8,20}$/, 'g');

        if (!passwordRGX.test(password)) {
            return res.json({
                case: false,
                message: 'Şifre alanı en az 8 en çok 20 karakter olmalı'
            });
        }

        const userControl = await User.find({ 'email': email }).exec()
        if (userControl.length != 0) {
            return res.json({
                case: false,
                message: 'Email alanı zaten kayıtlıdır'
            })
        }
        const user = new User({
            'email': email,
            'username': username,
            'password': password
        })

        user.save().then((data) => {

            let ID = data._id
            ID = String(ID)
            req.session.userID = ID
            return res.json({
                case: true,
                message: 'Kullanıcı kaydı başarılı bir şekilde oluşturuldu!'
            })
        }).catch((err) => {
            console.log(err)
            return res.json({
                case: false,
                message: 'Bir hata oluştu'
            })
        })

    } catch (error) {
        console.log(error)
        return res.json({
            case: false,
            message: 'beklenmeyen bir hata oluştu'
        })
    }
})


module.exports = router