const http = require("http");
const { exec } = require("child_process");
const config = require("./config.json");

const server = http.createServer((req, res) => {
  let data = "";
  req.on("data", (chunk) => {
    data += chunk;
  });
  req.on("end", handleDeployment(req, res, data));
});

const handleDeployment = (req, res, data) => {
  console.log(req.headers);
  console.log(JSON.parse(data));
  if (req.headers) {
    const { ref, repository } = JSON.parse(data);
    if (
      ref.split("/")[ref.split("/").length - 1] == config.branch &&
      repository.name == config.project_name
    ) {
      exec(
        `bash ~/deploy.sh "${config.project_local_path}" ${config.pm2_process_id} `,
        (err, stdout, stderr) => {
          if (err) {
            console.error(`exec error: ${err}`);
            res.write(err);
            res.end();
            return;
          }
          console.log(stdout);
          res.write(stdout);
          res.end();
          return;
        }
      );
    } else {
      console.log("wrong branch");
    }
  } else {
    res.write("Headers Not Found");
    res.end();
    return;
  }
};

console.log("server started at 8080");
server.listen(config.deploy_server_port);
