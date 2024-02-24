import db from "../config/database"
import Sequelize from "sequelize"

const Users = db.define('users', {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    password: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    fullname: {
      type: Sequelize.STRING(200),
      allowNull: false
    },
    telpon: {
      type: Sequelize.STRING(13),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(200),
      allowNull: false,
    },
    role: {
      type: Sequelize.ENUM("ADMIN", "USER"),
      allowNull: false,
    },
    user_status: {
      type: Sequelize.ENUM('ACTIVE', 'NOT_ACTIVE', 'PENDING'),
      allowNull: false,
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    },
    updated_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      allowNull: false
    }
}, {
  timestamps: false
})

export default Users