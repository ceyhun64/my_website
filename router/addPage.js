const express = require('express')
const router = express.Router()
const { join } = require('path')
const Content = require(join(__dirname, '..', 'model', 'contentModel.js'))

const nowTime=()=>{
    const date=new Date()
    const day=date.getDate()
    const month=date.getMonth()
    const year=date.getFullYear()
    const allName=`${day}.${month+1}.${year}`
    return allName
}

router.get('/', (req, res) => {
    if (!res.locals.user) {
        return res.redirect('/error')

    }
    return res.render('site/add')
})




router.post('/', (req, res) => {
    try {
        if (!res.locals.user) {
            return res.json({
                case: false,
                message: 'Yetkisiz erişim!'
            })
        }
        if (!req.body || !req.files) {
            return res.json({
                case: false,
                message: 'Veri iletilemedi!'
            })
        }

        const { title, content, name } = req.body
        const { file } = req.files


        if (!title || !content || !name || !file) {
            return res.json({
                case: false,
                message: 'Veri iletilemedi!'
            })
        }

        if (file.size > 1024 * 1024 * 5) {
            return res.json({
                case: false,
                message: 'Dosya boyutu istenilen aralıkta değil!'
            })
        }


        if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
            const extension = file.mimetype.split('/')[1];
            const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}.${extension}`;
            const pathName = join(__dirname, '..', 'public', 'img', 'content', uniqueName)

            file.mv(pathName, (err) => {
                if (err != undefined) {
                    return res.json({
                        case: false,
                        message: 'Dosya eklenemedi!'
                    })
                
                } else{
                    const db=new Content({
                        title,
                        content,
                        name,
                        'path': `/img/content/${uniqueName}`,
                        date:nowTime()
                    })
                    db.save().then(()=>{
                        return res.json({
                            case: true,
                            message: 'Veri başarılı bir şekilde eklendi, yönlendiriliyorsunuz...'
                        })
                    }).catch(err=>{
                        console.log(err)
                        return res.json({
                            case: true,
                            message: 'Bir hata oluştu.'
                        })
                    })
                }
          })
        }
        else {
            return res.json({
                case: false,
                message: 'Dosya istenilen türde değil!'
            })
        }

    } catch (error) {
        console.log(error);
        return res.json({
            case: false,
            message: 'Beklenilmeyen bir hata oluştu.'
        })
    }
})


module.exports = router