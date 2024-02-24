import db from "../config/database"
import Sequelize from "sequelize"

const Products = db.define('products', {
    product_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nama: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
    harga: {
        type: Sequelize.INTEGER(),
        allowNull: false
    },
    gambar: {
        type: Sequelize.STRING(100),
        allowNull: true
    },
    product_status: {
        type: Sequelize.ENUM('ACTIVE', 'NOT_ACTIVE', 'PENDING'),
        allowNull: false
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

export default Products