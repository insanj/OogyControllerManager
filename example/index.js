import express from "express";
import { OogyControllerManager } from "oogy-controller-manager";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

const expressControllerManager =
  new OogyControllerManager.OogyControllerManager();
console.info(
  "> created controller in express environment",
  expressControllerManager
);

app.use("/", express.static(__dirname));

app.use(
  "/OogyControllerManager.js",
  express.static(
    join(
      __dirname,
      "node_modules",
      "oogy-controller-manager",
      "dist",
      "OogyControllerManager.js"
    )
  )
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
