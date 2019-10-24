const fs = require('fs-extra')
const jsonServer = require('json-server')
const api = jsonServer.create()

const db = `${__dirname}/scraper/data/results.json`
const router = jsonServer.router(db)

const middlewares = [
    ...jsonServer.defaults({ readOnly: true }),
    ...[
        (req, res, next) => fs
            .readJson(db)
            .then(contents => {
                router.db.assign(contents).write();
                next();
            })
    ]
];

api.use(middlewares)
api.use(router)
api.listen(process.env.PORT || 3000, () => {
    console.log('JSON Server is running')
})