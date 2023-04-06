const env = require("./../env");
module.exports = async function (req, res, next) {
    if(!env.admin_token) {
        next()
        return
    }
    const admin_token = req.headers['admin-token']
    if (admin_token === env.admin_token) {
        next()
    } else {
        res.status(401).json({
            code: "401",
            status: "Unauthorized",
            message: "Invalid admin token",
        });
    }
}