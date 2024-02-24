import { Sequelize } from 'sequelize'

const db = new Sequelize(process.env.DB_NAME as string, process.env.DB_USER as string, process.env.DB_PASS as string, {
    host: process.env.DB_HOST as string,
    port: (parseInt((process.env.DB_PORT as string)) || 3306) as number,
    dialect: "mysql",
    logging: false
})

export const connectDB = async (retryCount = 0, maxRetries = 20) => {
    try {
        await db.authenticate();
        console.log('Connection to MySQL has been established successfully');
        return;
    } catch (err) {
        console.error('Unable to connect to MySQL database', err);

        const delay = Math.pow(2, retryCount) * 1000;

        if (retryCount < maxRetries) {
            console.log(`Retrying in ${delay / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            await connectDB(retryCount + 1);
        } else {
            console.error('Max connection retries reached. Exiting...');
        }
    }
}

export default db