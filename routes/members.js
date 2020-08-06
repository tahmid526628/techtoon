const express = require('express')
const user = require('../models/user')
const router = express.Router()

router.get('/:username', (req, res) => {
    if(req.user){
        if(req.params.username === req.user.username){
            res.render('members', {title: "Members", user: req.user})
        }
        else{
            req.flash("success", "Please register to a member")
            res.redirect('/')
        }
    }
    else{
        req.flash("success", "Please login first")
        res.redirect('/')
    }
})

module.exports = router