
const Sequalize = require("sequelize")

const sequelize = new Sequalize({
    dialect: "sqlite",
    storage: "db.db"
})

module.exports = {
    sequelize
}