const nodemailer = require('nodemailer')

module.exports = app => {

    class EmailHelper {
        
        enviarEmailCompra(emailDestinatario, produtos) {

            //emailDestinatario = 'arturdolzan@gmail.com'

            let usuario = 'atendimentomimos@gmail.com';
            let senha = '123456'; 

            let transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: usuario,
                    pass: senha
                }
            });

            let mailOptions = {
                from: usuario,
                to: emailDestinatario,
                subject: 'Confirmação de Compra Mimos (Não responda este e-mail)',
                html: 'Tem que ve' 
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email enviado: ' + info.response);
                }
            });   
        }

    }

    return { EmailHelper } 
}