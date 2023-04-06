const LicenseModel = require('../models/license');
const crypto = require('crypto');
const {handleErrorRes} = require("../config/error_handler");


exports.get = async (req, res) => {
    try {
        //check if body or params or query
        const hwid = req.body.hwid || req.params.hwid || req.query.hwid;
        const code = req.body.code || req.params.code || req.query.code;
        let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (!hwid || !code) {
            res.status(400).json({
                code: "400",
                status: "Bad Request",
                message: "Missing parameters",
            });
            return;
        }
        const license = await LicenseModel.findOne({
            where: {
                code: code,
            },
        });
        if (license) {
            //hash ip
            const hash = crypto.createHash('sha256');
            hash.update(ip);
            ip = hash.digest('hex');

            if (license.ip_hash !== ip) {
                license.ip_hash = ip;
                license.last_ip_change = new Date();
            }
            if (license.hwid !== hwid) {
                license.hwid = hwid;
                license.last_hwid_change = new Date();
            }
            license.save();
            res.status(200).json({
                code: "200",
                status: "OK",
                data: license,
            });
        } else {
            res.status(404).json({
                code: "404",
                status: "Not Found",
                message: "License not found",
            });
        }
    } catch (e) {
        handleErrorRes(res, e)
    }
}
exports.get_all = async (req, res) => {
    try {
        const licenses = await LicenseModel.findAll();
        res.status(200).json({
            code: "200",
            status: "OK",
            data: licenses,
        });
    } catch (e) {
        handleErrorRes(res, e)
    }
}

exports.create = async (req, res) => {
    try {
        const code = req.body.code;
        const external_id = req.body.external_id;
        if (!code || !external_id) {
            res.status(400).json({
                code: "400",
                status: "Bad Request",
                message: "Missing parameters",
            });
            return;
        }

        const license = await LicenseModel.create({
            code: code,
            external_id: external_id,
        });
        res.status(200).json({
            code: "200",
            status: "OK",
            data: license,
        });
    } catch (e) {
        handleErrorRes(res, e)
    }
}

exports.update = async (req, res) => {
    try {
        const code = req.body.code;
        const external_id = req.body.external_id;
        if (!code || !external_id) {
            res.status(400).json({
                code: "400",
                status: "Bad Request",
                message: "Missing parameters",
            });
            return;
        }

        const license = await LicenseModel.update({
            external_id: external_id,
        }, {
            where: {
                code: code,
            }
        });
        res.status(200).json({
            code: "200",
            status: "OK",
            data: license,
        });
    } catch (e) {
        handleErrorRes(res, e)
    }
}

exports.delete = async (req, res) => {
    try {
        const code = req.body.code || req.params.code;
        if (!code) {
            res.status(400).json({
                code: "400",
                status: "Bad Request",
                message: "Missing parameters",
            });
            return;
        }

        const license = await LicenseModel.destroy({
            where: {
                code: code,
            }
        });
        res.status(200).json({
            code: "200",
            status: "OK",
            data: license,
        });
    } catch (e) {
        handleErrorRes(res, e)
    }
}

