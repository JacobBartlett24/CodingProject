const readline = require("node:readline");
const fs = require("node:fs");
const path = require("node:path");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("line", (input) => {
  if (input.toLowerCase() === "exit") {
    console.log("Goodbye!");
    rl.close();
  } else {
    let inputLine = input.split(" ");
    selectMethod(inputLine);
  }
});

function selectMethod(inputLine) {
  if (inputLine[0].toUpperCase() == "CREATE") {
    createFile(inputLine);
  } else if (inputLine[0].toUpperCase() == "LIST") {
    listFiles(".");
  }
}

function listFiles(fullPath) {
  const fileDepthCount = fullPath.split("/").length - 1;
  let indention = "";
  for (let i = 0; i < fileDepthCount; i++) {
    indention += "ss";
  }

  fs.readdir(fullPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    const folders = files.filter((file) =>
      fs.statSync(path.join(fullPath, file)).isDirectory()
    );

    if (folders.length > 0) {
      folders.forEach((folder) => {
        if (folder !== ".git") {
          listFiles(path.join(fullPath, folder));
          console.log(`${indention}${folder}`);
        }
      });
    }
  });
}

function createFile(inputLine) {
  folderName = inputLine[1];

  if (inputLine.length > 2) {
    console.warn("Too many args for 'CREATE'");
    return;
  }

  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (err) {
    console.warn("Cannot create folder");
  }
}
