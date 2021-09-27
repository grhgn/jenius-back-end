const database = require('../config/database')
const connectdb = database.getDb()
const redis = database.getRedis()
const Controller = require('./Controller.js')
const { ObjectId } = require('mongodb')
const jwt = require('jsonwebtoken')

const AuthorizationController = {
    generate_token: async (req, res, next) => {
        try {

            const token = jwt.sign({ data: "data" }, "random_secret_key", { expiresIn: '2h' })

            return Controller.ok(res, { token: token }, "Generate Token")

        } catch (error) {
            return Controller.clientError(res, null, error.toString())
        }
    },
    check_token: async (req, res, next) => {
        try {
            if(req.headers['authorization'] == "" || req.headers['authorization'] == null){
                return Controller.clientError(res, null, 'TokenError')                
            }

            const token = req.headers['authorization'].replace("Bearer ", "")
            const secret_key = "random_secret_key"

            await jwt.verify(token, secret_key, async (err, decoded) => {
                if (err) {
                    return Controller.clientError(res, null, 'TokenError')
                } else {
                    next()
                }
            });
        } catch (error) {
            return Controller.unauthorized(res, null, error.toString())
        }
    },
}


module.exports = AuthorizationController