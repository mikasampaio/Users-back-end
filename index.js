const express = require("express")
const uuid = require("uuid")
const cors = require("cors")

const port = process.env.PORT || 3001
const app = express()
app.use(express.json())
app.use(cors())

/* Guardar as informações do usuário dentro de uma váriavel */
const users = []

const checkedUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ message: "Usuário não encontrado" })
    }

    request.userIndex = index
    request.userId = id

    next()
}

/* A rota GET irá mostrar todos os usuários que tiver */
app.get("/user", (request, response) => {
    return response.json(users)
})

/* Crie uma rota que envie dados e que armazene no array de usuários */
app.post("/user", (request, response) => {
    /* O body receberá o nome e a idade do usuário */
    const { name, age } = request.body

    /* Depois irá criar o usuário recebendo o nome, a idade, e um novo ID */
    const user = { id: uuid.v4(), name, age }

    /* Adicionar a informação do user dentro dos users */
    users.push(user)

    /* Retorna somente o usuário que criou */
    /* STATUS 201 =  significa que a conta foi criado com sucesso */
    return response.status(201).json(user)

})

/* PUT - atualizar um usuário existente
Route params = user/:id, tem a função de buscar, deletar ou atualiza o usuário
*/
app.put("/user/:id", checkedUserId, (request, response) => {
    const index = request.userIndex
    const id = request.userId

    /* Primeiramente irá pegar o ID do usuário */

    /* Após, pegar as NOVAS informações do usuário na parte BODY */
    const { name, age } = request.body

    /* Montar o usuário atualizado */
    const updateUser = { id, name, age }

    /* Posição do array, onde está o usuário */

    /* Caso não encontrar o ID do usuário, ou seja a posição do array estiver -1, deve mandar mensagem */

    users[index] = updateUser

    return response.json(users)

})

app.delete("/user/:id", checkedUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
})

app.listen(port, () => {
    console.log(`Hello server started on port ${port} `)
})