const {DataTypes} = require("sequelize");
const sequelize = require("../config/database");

const License = sequelize.define("tbl_license", {
    code: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    hwid: {
        type: DataTypes.STRING,
    },
    last_hwid_change: {
        type: DataTypes.DATE,
    },
    ip_hash: {
        type: DataTypes.STRING,
    },
    last_ip_change: {
        type: DataTypes.DATE,
    },
    external_id: {//external id from payment provider
        type: DataTypes.STRING,
        allowNull: false,
    },
});
License.sync();
module.exports = License;
