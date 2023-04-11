const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

const app = require("./app");
const { dbConnect } = require("./database/dbConnect");

const port = process.env.PORT || 8000;

dbConnect();
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
