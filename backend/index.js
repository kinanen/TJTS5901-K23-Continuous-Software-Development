const app = require("./app");
const http = require("http");
const config = require("./utils/config");
const logger = require("./utils/logger");
const helmet = require("helmet");
const cors = require("cors");

const allowedOrigins = ["http://http://localhost:3000", "https://fastandfurious.azurewebsites.net"];

app.use(cors({ origin: allowedOrigins }));
app.use(helmet());

const server = http.createServer(app);

server.listen(config.WEBSITES_PORT, () => {
  logger.info(`Server running on port: ${config.WEBSITES_PORT}`);
});
