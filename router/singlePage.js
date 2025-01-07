const express = require('express')
const router = express.Router()
const { join } = require('path')
const Content = require(join(__dirname, '..', 'model', 'contentModel.js'))
const fs=require('fs')

router.get('/:id', async(req, res) => {
    try {
        const { id } = req.params
        const data=await Content.findById(id).exec()

        return res.render('site/single',{
            singleData:data.toJSON()
        })
    } catch (error) {
        console.log(error)
        return res.redirect('/error')
    }
})

router.delete('/:id',async(req,res)=>{
    try {
        if(!res.locals.user){
            return res.json({
                case:false,
                message:'Yetkisiz erişim!'
            })
        }
        
        let{id}=req.params
        const data=await Content.findById(id).exec()
        let fileName=data.path
        let pathName=join(__dirname,'..','public',fileName)

        Content.findByIdAndDelete(id).then(()=>{
            fs.unlink(pathName,(err)=>{
                if(err!=null){
                    return res.json({
                        case:false,
                        message:'Dosya silme işleminde bir hata oluştu'
                    })
                }
                return res.json({
                    case:true,
                    message:'Dosya silme işlemi başarılı bir şekilde gerçekleştirildi'
                })

            })
           
        }).catch((err)=>{
            console.log(err)
            return res.json({
                case:false,
                message:'Bir hata oluştu!'
            })
        })
         
        
    } catch (error) {
        console.log(error)
        return res.redirect('/error')

    }
})

module.exports = router