const express = require('express')
const nodemailer = require('nodemailer')
const { getMaxListeners } = require('../app')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('contact', {title: 'Contact'})
})

router.post('/send', (req, res) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: 'false',
        auth: {
            user: 'techtoon526628@gmail.com',
            pass: '#526628Tuples!Tahmid$'
        }
    })

    let mailOptions = {
        from: 'TechToon <techtoon526628@gmail.com>',
        to: 'tahmidkhandokar82@gmail.com',
        subject: 'website submission',
        text: 'You have got a website submission',
        html: '<p>You\'ve got a website submission with the following details....'+
            '<ul><li>Name: ' + req.body.name + '</li>'+
            '<li>Email: ' + req.body.email + '</li>'+
            '<li>Message: ' + req.body.message + '</li></ul>'+
            '</p>'
    }

    transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            console.log(err)
            res.send("500! Try again letter")
        }
        else{
            res.redirect('/')
            console.log(info)
        }
    })
})

module.exports = router