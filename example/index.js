const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

app.use("/", express.static(__dirname));

app.use(
  "/oogy_controller_manager.js",
  express.static(
    path.join(
      __dirname,
      "node_modules",
      "oogy-controller-manager",
      "dist",
      "oogy_controller_manager.js"
    )
  )
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
