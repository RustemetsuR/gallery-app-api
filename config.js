const path = require("path");

const rootPath = __dirname;

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, "public/uploads"),
  db: {
    name: "gallery-app",
    url: 'mongodb://localhost',
  },
  fb: {
    appId: "736873663902554",
    appSecret: "16875b609ea39f852ce5ff71789d23f3"
  }
};