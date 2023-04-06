const License = require("../controllers/License");
const adminOnly = require("../middleware/admin_only");
module.exports = (app) => {
    app.route("/api/v1/validate").get(License.get);
    app.route("/api/v1/license/:code").get(adminOnly, License.get);
    app.route("/api/v1/license").get(adminOnly, License.get_all);
    app.route("/api/v1/license").post(adminOnly, License.create);
    app.route("/api/v1/license").put(adminOnly, License.update);
    app.route("/api/v1/license/:code").delete(adminOnly, License.delete);
}