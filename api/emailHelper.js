const nodemailer = require('nodemailer')

module.exports = app => {


    const enviarEmailConfirmacao = (req, res) => {

        if (!req.body.destinatario) {
            return res.status(400).json('Não foi informado o campo destinatario no corpo da requisição!')
        }

        if (!req.body.nome) {
            return res.status(400).json('Não foi informado o campo nome no corpo da requisição!')
        }

        if (!req.body.telefone) {
            return res.status(400).json('Não foi informado o campo telefone no corpo da requisição!')
        }

        if (!req.body.produtos) {
            return res.status(400).json('Não foi informado os produtos corpo da requisição!')
        }

        if (req.body.produtos.length === 0) {
            return res.status(400).json('Nenhum produto informado!')
        }

        enviarEmailCompraParaCliente(req.body.destinatario)

        let html = criarHtmlCliente({
                    nome: req.body.nome,
                    email: req.body.destinatario,
                    telefone: req.body.telefone
                })

        html += criarHtmlProdutos(req.body.produtos)

        enviarEmailCompraParaMimos(req.body.destinatario, html)

        return res.status(200).json('E-mail encaminhado com sucesso!')
    }

    const criarHtmlCliente = (cliente) => {

        let html = ` <div> `
        html += ` <h3>Cliente</h3> `
        html += ` <p>Nome: ${cliente.nome}</p> `
        html += ` <p>Email: ${cliente.email}</p> `
        html += ` <p>Telefone: ${cliente.telefone}</p> `
        html += ` </div> `

        return html
    }

    const criarHtmlProdutos = (produtos) => {

        let html = ` <div> `
        html += ` <h3>Produtos</h3> `

        produtos.map((item, idx) => {
            
            html += ` <p>id: ${item.id} Nome: ${item.nome} Qtde: ${item.qtde} </p> `
        })
        
        html += ` </div> `

        return html
    }
    
    const enviarEmailCompraParaCliente = (emailDestinatario) => {

        let usuario = 'atendimentositemimos@gmail.com';
        let senha = 'passwordm49m1234'; 

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
            html: '<div>Confirmação de compra Mimos. Obrigado por comprar conosco. Em breve entraremos em contato =)</div>' 
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email enviado: ' + info.response);
            }
        });   
    }

    const enviarEmailCompraParaMimos = (emailDestinatario, htmlProdutos) => {

        let usuario = 'atendimentositemimos@gmail.com';
        let senha = 'passwordm49m1234'; 

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: usuario,
                pass: senha
            }
        });

        let mailOptions = {
            from: usuario,
            to: usuario,
            subject: `Pedido de Compra de ${emailDestinatario}`,
            html: htmlProdutos 
        };

        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email enviado: ' + info.response);
            }
        });   
    }

    return { enviarEmailConfirmacao } 
}