const Controller = {
    ok(res, data, message = "OK") {
        return res.status(200).json({
            code: 200,
            status: true,
            message: message,
            data: data,
        });
    },
    ok_paging(res, count, page, data, message = "OK") {
        return res.status(200).json({
            code: 200,
            status: true,
            message: message,
            data: data,
            count: count,
            page: page
        });
    },
    clientError(res, data, message = "CLIENT_ERROR") {
        return res.status(400).json({
            code: 400,
            status: false,
            message: message,
            data: data,
        });
    },
    validationError(res, data, message = "VALIDATION_ERROR") {
        return res.status(422).json({
            code: 422,
            status: false,
            message: message,
            data: data,
        });
    },
    unauthorized(res, data, message = "UNAUTORIZED") {
        return res.status(401).json({
            code: 401,
            status: false,
            message: message,
            data: data,
        });
    },
    notFound(res, data, message = "NOT_FOUND") {
        return res.status(404).json({
            code: 404,
            status: false,
            message: message,
            data: data,
        });
    },
    fail(res, data, message = "FAIL") {
        return res.status(500).json({
            code: 500,
            status: false,
            message: message,
            data: data,
        });
    },

    //helper
    getQuery(data, q = []) {
        let newQuery = {};

        q.forEach((element) => {
            if (data[element]) {
                newQuery[element] = data[element];
            }
        });

        return newQuery;
    },

    async baseAll(req, res, model, q) {
        try {
            const query = await Controller.getQuery(req.query, q);

            let data = model;

            if (Object.keys(req.query).length > 0) {
                data = await data.findAll({
                    where: query,
                    include: [
                        { all: true, nested: true },
                    ]
                });
            } else {
                data = await data.findAll();
            }

            return Controller.ok(res, data, 'success get data');
        } catch (err) {
            return Controller.clientError(res, err, 'ERROR');
        }
    },

    async baseId(req, res, model) {
        try {
            let data = model;

            data = await data.findByPk(req.params.id, {
                include: [{ all: true, nested: true }],
            });

            if (!data) return Controller.clientError(res, null, 'data not found');

            return Controller.ok(res, data, 'success get data');
        } catch (err) {
            return Controller.clientError(res, err, 'ERROR');
        }
    },

    async baseUpdate(req, res, model, q, beforeUpdate) {
        try {
            const data = Controller.getQuery(req.body, q);

            await beforeUpdate(data);

            const update = await model.update(data, { where: { id: req.params.id } });

            if (!update[0])
                return Controller.clientError(
                    res,
                    null,
                    "failed update, data not found"
                );

            const result = await model.findByPk(req.params.id);

            return Controller.ok(res, result, 'success update data');
        } catch (error) {
            return Controller.clientError(res, null, error);
        }
    },

    async baseDelete(req, res, model, beforeDelete) {
        try {
            const check = await model.findByPk(req.params.id);

            if (!check) return Controller.clientError(res, null, 'data not found');

            await beforeDelete();

            const result = await model.destroy({ where: { id: req.params.id } });

            return Controller.ok(res, null, 'success delete data');
        } catch (error) {
            return Controller.clientError(res, null, error);
        }
    },
}




module.exports = Controller;