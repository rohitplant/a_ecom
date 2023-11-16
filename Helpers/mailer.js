let mailer = require("nodemailer")

function mail(mailoption) {
    return new Promise((res,rej)=>{
        let transporter = mailer.createTransport({
            host:"smtp.gmail.com",
            port:465,
            secure:true,
            auth:{
                user:"rohitdisk11@gmail.com",
                pass:"opol optr mhgq iukd"
            }
        })

        transporter.sendMail(mailoption,(err,info)=>{
            if(err){
                return rej(err)
            }
            return res(`mail is send to ${mailoption.to}`)
        })
        
    })

    

   
}

module.exports={mail}