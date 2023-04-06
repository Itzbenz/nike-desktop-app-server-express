const express = require("express");
const cors = require("cors");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const env = require("./env");

const app = express();


const port = env.port

app.use(helmet());
app.use(compression());
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
/* Start Logging */
const log_path = env.log_path || path.join(__dirname, "logs");

// if log path not exist, log_path folder will be created
if (!fs.existsSync(log_path)) {
   fs.mkdirSync(log_path, { recursive: true });
}
app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
});


// Log all error requests status
app.use(
   morgan("combined", {
      skip: (req, res) => {
         return res.statusCode < 400;
      },
      stream: fs.createWriteStream(path.join(log_path, "error.log"), {
         flags: "a",
      }),
   })
);

// Log all success request status
app.use(
   morgan("combined", {
      skip: (req, res) => {
         return res.statusCode > 400;
      },
      stream: fs.createWriteStream(path.join(log_path, "access.log"), {
         flags: "a",
      }),
   })
);
/* End Logging */

/* Dynamic CORS */
app.use(
   cors({
      origin: "*",
   })
);
/* End Dynamic CORS */


/* Start of Routing Modules */
require("./routes/license_route")(app);
/* End of Routing Modules */

/* Check database connection */

app.listen(port, "0.0.0.0", () => {
   console.log(`Server API listen on port ${port}`);
   console.log("http://localhost:" + port );
});

module.exports = app;
