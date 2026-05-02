const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 8080;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`\n🚀 SlotIQ Server running on port ${PORT}`);
    console.log(`📡 API: http:
    console.log(`💚 Health: http:
  });
};

startServer();