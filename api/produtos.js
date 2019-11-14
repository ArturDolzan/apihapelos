const moment = require('moment')
const Promise = require('bluebird');

module.exports = app => {
    
    const getProdutos = (req, res) => {
        // const date = req.query.date ? req.query.date
        //     : moment().endOf('day').toDate()

        app.db('produtos')
            .select(
                'id',
                'nome',
                'descricao',
                'tamanho',
                'dimensoes',
                'preco',
                'cor',
                'desconto',
                'likes'              
            )
            .select(app.db.raw(` replace(replace(replace(replace(replace(encode(foto, 'base64'), '\n', ''), '\', ''), ';', ''), ':', ''), ',', '') AS foto`))
            .orderBy('nome', 'asc')
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const recuperarPorId = (req, res) => {
        
        if (!req.params.id) {
            return res.status(400).json('É necessário passar o código do produto na requisição!')
        }

        app.db('produtos')
            .select(
                'id',
                'nome',
                'descricao',
                'tamanho',
                'dimensoes',
                'preco',
                'cor',
                'desconto',
                'likes'                
            )
            .select(app.db.raw(` replace(replace(replace(replace(replace(encode(foto, 'base64'), '\n', ''), '\', ''), ';', ''), ':', ''), ',', '') AS foto`))
            .where({id: req.params.id})
            .then(tasks => res.json(tasks))
            .catch(err => res.status(400).json(err))
    }

    const save = (req, res) => {
        if (!req.body.descricao.trim()) {
            return res.status(400).send('Nome é um campo obrigatório')
        }

        app.db('produtos')
            .insert({
                nome: req.body.nome,
                descricao: req.body.descricao,
                tamanho: req.body.tamanho,
                dimensoes: req.body.dimensoes,
                preco: req.body.preco,
                cor: req.body.cor,
                desconto: req.body.desconto,
                likes: 0,
                foto: app.db.raw(`decode(?, 'base64')`, req.body.foto)
            })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const remove = (req, res) => {
        app.db('produtos')
            .where({ id: req.params.id })
            .del()
            .then(rowsDeleted => {
                if (rowsDeleted > 0) {
                    res.status(204).send()
                } else {
                    const msg = `Não foi encontrado Produto com id ${req.params.id}.`
                    res.status(400).send(msg)
                }
            })
            .catch(err => res.status(400).json(err))
    }

    const addLike = (req, res) => {
        
        if (!req.params.id) {
            return res.status(400).json(`É necessário passar o Id do produto na query da requisição!`)
        }

        app.db('produtos')
            .select('likes')
            .where({ id: req.params.id })
            .first()
            .then(produto => {
                
                if (!produto) {
                    return res.status(400).json(`Produto de id ${req.params.id} não encontrado!`)
                }

                app.db('produtos')
                    .where({ id: req.params.id })
                    .update({ 
                        likes: produto.likes + 1
                    })
                    .then((data) => {                        
                        res.status(200).send({ id: data })
                    })

            })
            .catch(err => res.status(400).json(err))
    }



    const updateTaskPhoto = (req, res) => {

        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .update({ 
                photo: app.db.raw(`decode(?, 'base64')`, req.body.photo)
             })
            .then(_ => res.status(204).send())
            .catch(err => res.status(400).json(err))
    }

    const uploadBase64Photo = (req, res) => {
        
        app.db('tasks')
            .where({ id: req.params.id, userId: req.user.id })
            .first()
            .then(task => {

                if (!task) {                                       
                    const msg = `ReMed com id ${req.params.id} não encontrado.`
                    return res.status(400).send(msg)
                }

                if (!req.body.photo) {
                    const msg = `É necessário passar a propriedade photo (base64) no corpo da requisição do tipo Post`
                    return res.status(400).send(msg)
                }

                updateTaskPhoto(req, res)
            })
            .catch(err => res.status(400).json(err))
    }

    const downloadBase64Photo = (req, res) => {
        //'data:image/gif;base64,'
        app.db('tasks')
        .where({id: req.params.id, userId: req.user.id})
        .select(app.db.raw(` replace(replace(replace(replace(replace(encode(photo, 'base64'), '\n', ''), '\', ''), ';', ''), ':', ''), ',', '') AS image_url`))        
        .then(task => {
            
            res.json(task)
        })
        .catch(err => res.status(400).json(err))

    }

    const testeTransacao = (req, res) => {

        app.db.transaction(trx => {

            return trx('tasks')
            .where({id: req.params.id, userId: req.user.id})
            .update({desc: 'Teste transacao tuka'})
            .transacting(trx)
            .then(task => {
                
                console.log('PRIMEIRO')

                return trx('tasks')
                    .where({id: req.params.id, userId: req.user.id})
                    .first()
                    .transacting(trx)
                    .then(task => {
                        
                        console.log(task)

                    })

            })
            .then(trx.commit)
            .catch(trx.rollback)

        })
        .then(() => {            
            console.log('Transação executada com sucesso!')
            res.status(200).json('Transação executada com sucesso!')
        })
        .catch(err => res.status(400).json(err))

    }

    const testeTransacaoLista = (req, res) => {

        const itens = [
            { desc: "Tarefa 1", estimateAt: moment().endOf('day').toDate(), doneAt: null, photo: null, userId: req.user.id },
            { desc: "Tarefa 2", estimateAt: moment().endOf('day').toDate(), doneAt: null, photo: null, userId: req.user.id },
            { desc: "Tarefa 3", estimateAt: moment().endOf('day').toDate(), doneAt: null, photo: null, userId: req.user.id },
            { desc: "Tarefa 4", estimateAt: moment().endOf('day').toDate(), doneAt: null, photo: null, userId: req.user.id },
            { desc: "Tarefa 5", estimateAt: moment().endOf('day').toDate(), doneAt: null, photo: null, userId: req.user.id },
            { desc: "Tarefa 6", estimateAt: moment().endOf('day').toDate(), doneAt: null, photo: null, userId: req.user.id },
            { desc: "Tarefa 7", estimateAt: moment().endOf('day').toDate(), doneAt: null, photo: null, userId: req.user.id }
        ]
        
        app.db.transaction(trx => {

            return Promise.map(itens, (item, idx) => {
                
                return trx('tasks')
                .insert(item)
                .transacting(trx)

            })
            .then(trx.commit)
            .catch(trx.rollback)

        })
        .then(() => {
            console.log('Transação executada com sucesso!')
            res.status(200).json('Transação executada com sucesso!')
        })
        .catch(err => res.status(400).json(err))

    }

    return { getProdutos, save, remove, uploadBase64Photo, downloadBase64Photo, recuperarPorId, addLike }
}
