const router = require('express').Router()
const {Post,User, Reply} = require('../models')
const withAuth = require('../utils/auth')

// These are routes that go into the URL. They are not for fetch requests.

// This takes users to the homepage
router.get('/', async (req, res) => {
    try {
        const allPosts = await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username']
                },
                {
                    model: Reply
                }
            ]
        })

        const postSerialized = allPosts.map((post) => post.get({
            plain: true
        }))




        

        res.render('landing', {
            postSerialized,
            logged_in: req.session.logged_in
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

// This takes users to an individual post, based on post_id
router.get('/post/:id', async (req, res) => {
    try {
        const postFromId = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username']
                }
            ]
        })

        const post = postFromId.get({plain: true})

        res.render('editPost', {
            post,
            logged_in: req.session.logged_in
        })
    } catch (err) {
        res.status(500).json(err)
    }
})

// This takes users to login page
router.get('/login', (req,res) => {
    if (req.session.logged_in) {
        res.redirect('/dashboard')
        return
    }

    res.render('login')
})
// This takes uers to registration page
router.get('/register', (req,res) => {
    if (req.session.logged_in) {
        res.redirect('dashboard')
        return
    }

    res.render('register')
})
// This takes users to dashboard
router.get('/dashboard', async (req, res) => {
    try {
        if(req.session.logged_in) {
            const allUserPosts = await Post.findAll({
                where: {
                    userId: req.session.userId
                },
                include: [
                    {
                        model: User,
                        attributes: ['username']
                    }
                ]
            })
    
            const allUserPostsSerialized = allUserPosts.map((post) => post.get({
                plain: true
            }))
    
            res.render('dashboard', {
                allUserPostsSerialized,
                logged_in: req.session.logged_in
            })
        } else {
            res.redirect('login')
        }

    } catch (err) {
        res.status(500).json(err)
    } 
})
// This takes users to the writepost page
router.get('/writepost', async (req,res) => {
    try {
        if(req.session.logged_in) {
            res.render('writePost')
        } else {
            res.redirect('login')
        }
    } catch (err) {
        res.status(500).json(err)
    }
})
// Thsi takes users to the edit post based on post_id
router.get('/editpost/:id', async (req, res) => {
    try {
        if(req.session.logged_in) {
            const postFromId = await Post.findByPk(req.params.userId)
            const postSerialized = postFromId.map((post) => post.get({
                plain: true
            }))
            res.render('editPost')
        } else {
            res.redirect('login')
        }
    } catch(err) {
        res.status(500).json(err)
    }
})

module.exports = router