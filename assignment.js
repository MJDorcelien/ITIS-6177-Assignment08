const express = require('express')
const app = express()
const port = 3000

const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const cors = require('cors')

const options = {
    swaggerDefinition: {
        info: {
            title: 'Personal Budget API',
            version: '1.0.0',
            description: 'Personal Budget API autogenerated by swagger doc'
        },
        host: 'localhost:3000',
        basePath: '/',
    },
    apis: ['./server.js']
}

const specs = swaggerJsdoc(options)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs))
app.use(cors())

const mariadb = require('mariadb')
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'sample',
    port: 3306,
    connectionLimit: 5
})

app.get('/customers/:name', (req, res) => {
    var name = req.params.name
    pool.getConnection()
        .then(conn => {
            conn.query(`update customer set cust_city = "London" where cust_name="${name}"`)
            res.send(`${name} was updated`)
        })
})

app.delete('/customers/:name', (req, res) => {
    var name = req.params.name
    pool.getConnection()
        .then(conn => {
            conn.query(`delete from customer where cust_name="${name}"`)
            res.send(`${name} was deleted`)
        })
})

/**
 * @swagger
 * /customers:
 *      get:
 *          description: Return all customers
 *          produces:
 *              - applicaton/json
 *          responses:
 *              200:
 *                  description: Object customers
 */
app.get('/customers', (req, res) => {
    pool.getConnection()
        .then(conn => {
            conn.query("SELECT * FROM customer")
                .then((rows) => {
                    console.log(rows)
                    res.json(rows)
                })
        }).catch(err => {
            console.log(err)
        })
})

app.get('/customers/:name', (req, res) => {
    var name = req.params.name
    pool.getConnection()
        .then(conn => {
            conn.query(`SELECT * FROM customer WHERE CUST_NAME="${name}"`)
                .then((rows) => {
                    console.log(rows)
                    res.json(rows)
                })
        }).catch(err => {
            console.log(err)
        })
})

app.listen(port, () => {
    console.log(`Example app listening a http://localhost:${port}`)
})