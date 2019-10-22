const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router(`${__dirname}/data/results.json`)

server.use(router)
server.listen(process.env.PORT, () => {
    console.log('JSON Server is running')
})