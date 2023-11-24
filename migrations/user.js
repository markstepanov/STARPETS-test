
const { Sequelize, DataTypes} = require('sequelize');
const db = require("../db")



const User = db.sequelize.define("user", {
    balance: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

async function up({ context: queryInterface }) {
	await queryInterface.createTable('users', {
        id: {
			type: Sequelize.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		balance: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		createdAt: {
			type: Sequelize.DATE,
			allowNull: false
		},
		updatedAt: {
			type: Sequelize.DATE,
			allowNull: false
		}
	});


    await User.create({
        balance: 1000
    })

}

async function down({ context: queryInterface }) {
	await queryInterface.dropTable('users');
}

module.exports = { up, down , User}