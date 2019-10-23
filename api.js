const jsonServer = require('json-server')
const api = jsonServer.create()
const router = jsonServer.router(`${__dirname}/scraper/data/results.json`)

api.use(router)
api.listen(process.env.PORT || 3000, () => {
    console.log('JSON Server is running')
})