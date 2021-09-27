const database = require('../config/database')
const connectdb = database.getDb()
const redis = database.getRedis()
const Controller = require('./Controller.js')
const { ObjectId } = require('mongodb')

const UserController = {
    get_user_by_account_number: async (req, res, next) => {
        try {

            const accountNumber = req.params.accountNumber

            await redis.hgetall("user:accountNumber_" + accountNumber, async function (err, result) {
                if (!result) {
                    const data = await connectdb.collection("crud-user").findOne({
                        accountNumber: parseInt(accountNumber)
                    })


                    if (!data) {
                        return Controller.ok(res, null, "Data Not Found!")
                    } else {
                        redis.hmset("user:accountNumber_" + data.accountNumber, [
                            "userName", data.userName,
                            "accountNumber", data.accountNumber,
                            "emailAddress", data.emailAddress,
                            "identityNumber", data.identityNumber
                        ], [])

                        return Controller.ok(res, data, "Get User By Account Number")
                    }
                } else {
                    return Controller.ok(res, result, "Get User By Account Number")
                }
            })

        } catch (error) {
            return Controller.clientError(res, null, error.toString())
        }
    },
    get_user_by_identity_number: async (req, res, next) => {
        try {

            const identityNumber = req.params.identityNumber

            await redis.hgetall("user:identityNumber" + identityNumber, async function (err, result) {
                if (!result) {
                    const data = await connectdb.collection("crud-user").findOne({
                        identityNumber: parseInt(identityNumber)
                    })

                    if (!data) {
                        return Controller.ok(res, null, "Data Not Found!")
                    } else {
                        redis.hmset("user:accountNumber_" + data.accountNumber, [
                            "userName", data.userName,
                            "accountNumber", data.accountNumber,
                            "emailAddress", data.emailAddress,
                            "identityNumber", data.identityNumber
                        ], [])

                        return Controller.ok(res, data, "Get User By Identity Number")
                    }
                } else {
                    return Controller.ok(res, result, "Get User By Identity Number")
                }
            })

        } catch (error) {
            return Controller.clientError(res, null, error.toString())
        }
    },
    add_user: async (req, res, next) => {
        try {

            const { userName, accountNumber,
                emailAddress, identityNumber } = req.body

            if (!userName || !accountNumber || !emailAddress || !identityNumber) {
                return Controller.ok(res, null, "Data Empty!")
            }

            await connectdb.collection("crud-user").insertOne({
                userName: userName,
                identityNumber: identityNumber,
                accountNumber: accountNumber,
                emailAddress: emailAddress
            }, (err, results) => {
                if (err) {
                    return Controller.clientError(res, null, err.toString())
                }

                redis.hmset("user:accountNumber_" + accountNumber, [
                    "userName", userName,
                    "accountNumber", accountNumber,
                    "emailAddress", emailAddress,
                    "identityNumber", identityNumber
                ], [])

                redis.hmset("user:identityNumber_" + identityNumber, [
                    "userName", userName,
                    "accountNumber", accountNumber,
                    "emailAddress", emailAddress,
                    "identityNumber", identityNumber
                ], [])

                return Controller.ok(res, null, "Success Add User!")
            })

        } catch (error) {
            return Controller.clientError(res, null, error.toString())
        }
    },

    update_user: async (req, res, next) => {
        try {

            const { userName, emailAddress } = req.body

            if (!emailAddress) {
                return Controller.ok(res, null, "Data Empty!")
            }

            const checkFound = await connectdb.collection("crud-user").findOne({
                userName: userName,
            })

            const checkDuplicates = await connectdb.collection("crud-user").findOne({
                userName: { $ne: userName },
                $or: [
                    { emailAddress: emailAddress }
                ]
            })

            if (!checkFound) {
                return Controller.ok(res, null, "Data Not Found!")
            }
            if (checkDuplicates) {
                return Controller.ok(res, null, "Data Duplicates!")
            }

            await connectdb.collection("crud-user").updateOne({ userName: userName }, {
                $set: {
                    emailAddress: emailAddress
                }
            }, (err, results) => {
                if (err) {
                    return Controller.clientError(res, null, err.toString())
                }
                redis.hmset("user:accountNumber_" + results.accountNumber, [
                    "emailAddress", emailAddress
                ], [])

                redis.hmset("user:identityNumber_" + results.identityNumber, [
                    "emailAddress", emailAddress
                ], [])

                return Controller.ok(res, null, "Success Update User!")
            })

        } catch (error) {
            return Controller.clientError(res, null, error.toString())
        }
    },

    add_user: async (req, res, next) => {
        try {

            const { userName, accountNumber,
                emailAddress, identityNumber } = req.body

            if (!userName || !accountNumber || !emailAddress || !identityNumber) {
                return Controller.ok(res, null, "Data Empty!")
            }

            await connectdb.collection("crud-user").insertOne({
                userName: userName,
                identityNumber: identityNumber,
                accountNumber: accountNumber,
                emailAddress: emailAddress
            }, (err, results) => {
                if (err) {
                    return Controller.clientError(res, null, err.toString())
                }

                redis.hmset("user:accountNumber_" + accountNumber, [
                    "userName", userName,
                    "accountNumber", accountNumber,
                    "emailAddress", emailAddress,
                    "identityNumber", identityNumber
                ], [])

                redis.hmset("user:identityNumber_" + identityNumber, [
                    "userName", userName,
                    "accountNumber", accountNumber,
                    "emailAddress", emailAddress,
                    "identityNumber", identityNumber
                ], [])

                return Controller.ok(res, null, "Success Add User!")
            })

        } catch (error) {
            return Controller.clientError(res, null, error.toString())
        }
    },

    delete_user: async (req, res, next) => {
        try {

            const { userName } = req.body

            if (!userName) {
                return Controller.ok(res, null, "Data Empty!")
            }

            const checkFound = await connectdb.collection("crud-user").findOne({
                userName: userName,
            })

            if (!checkFound) {
                return Controller.ok(res, null, "Data Not Found!")
            }

            await connectdb.collection("crud-user").deleteOne({
                userName: userName
            }, (err, results) => {
                if (err) {
                    return Controller.clientError(res, null, err.toString())
                }
                redis.del("user:accountNumber_" + checkFound.accountNumber);
                redis.del("user:identityNumber_" + checkFound.identityNumber_);

                return Controller.ok(res, null, "Success Delete User!")
            })

        } catch (error) {
            return Controller.clientError(res, null, error.toString())
        }
    },
}


module.exports = UserController