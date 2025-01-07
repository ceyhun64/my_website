const express = require('express')
const router = express.Router()
const { join } = require('path')
const Content = require(join(__dirname, '..', 'model', 'contentModel.js'))

const pageInfo={
    source:'home.jpg',
    title:'My Blog',
    subtitle:'It`s a Dream'
}

router.get('/', async(req, res) => {
    try {
        const content=await Content.find().exec()
        // console.log(content)

        return res.render('site/index', {
             pageInfo,
             allData: content.map(item=>item.toJSON())

         })
    } catch (error) {
        console.log(error)
        return res.redirect('/error')

    }
})

module.exports = router