const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(`${__dirname}/data/results.json`)

server.use(router)
server.listen(3000, () => {
    console.log('JSON Server is running')
})