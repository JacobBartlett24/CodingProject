const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let directory = [
  "foo",
  "bar",
  "foo/foo1",
  "bar/bar1",
  "foo/foo1/foo2",
  "bar/bar1/bar2",
];

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
    createFolder(inputLine);
  } else if (inputLine[0].toUpperCase() == "LIST") {
    listFolders(".", 0);
  } else if (inputLine[0].toUpperCase() == "DELETE") {
    deleteFolder(inputLine);
  } else if (inputLine[0].toUpperCase() == "MOVE") {
    moveFolder(inputLine);
  }
}

function moveFolder(inputLine) {
  const fromFolder = inputLine[1];
  const toFolder = inputLine[2];

  const fromFolderIndex = directory.indexOf(fromFolder);

  if (fromFolderIndex === -1) {
    console.log(`Could not move`);
    return;
  }

  if (!directory.includes(toFolder)) {
    console.log(`Could not move`);
    return;
  }

  let slicePoint = fromFolder.split("/").length - 1;

  directory = directory.map((folder) => {
    if (folder.includes(fromFolder)) {
      let splitFolder = folder.split("/");
      let newPath = splitFolder.slice(slicePoint);
      return `${toFolder}/${newPath.join("/")}`;
    }
    return folder;
  });
}

function listFolders() {
  const sortedDirectory = sortDirectory();

  for (let i = 0; i < sortedDirectory.length; i++) {
    let splitString = sortedDirectory[i].split("/");
    let indentation = "";
    splitString.forEach((section, i) => {
      if (i !== 0) {
        indentation += "  ";
      }
    });

    console.log(`${indentation}${splitString[splitString.length - 1]}`);
  }
}

function sortDirectory() {
  return directory.sort((a, b) => {
    const aParts = a.split("/");
    const bParts = b.split("/");

    for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
      if (aParts[i] !== bParts[i]) {
        return aParts[i].localeCompare(bParts[i]);
      }
    }

    return aParts.length - bParts.length;
  });
}

function createFolder(inputLine) {
  let hasError = createCommandHasErrors(inputLine);

  if (hasError) {
    return;
  }

  folderName = inputLine[1];

  if (folderName.indexOf("/") > -1) {
    let folders = folderName.split("/");
    let path = folders[0];

    for (let i = 0; i < folders.length - 1; i++) {
      if (i !== 0) {
        path += `/${folders[i]}`;
      }

      if (!directory.includes(path)) {
        console.warn(
          `Cannot create ${folderName}, ${folders[i]} does not exist`
        );
        return;
      }
    }
  }

  directory.push(folderName);
}

function createCommandHasErrors(inputLine) {
  if (inputLine.length > 2) {
    console.warn("Too many args for 'CREATE'");
    return true;
  } else if (inputLine.length == 1) {
    console.warn("Too few args for 'CREATE'");
    return true;
  }
  return false;
}

function deleteFolder(inputLine) {
  folderName = inputLine[1];

  var folderIndex = directory.indexOf(folderName);

  if (folderIndex == -1) {
    console.warn(`Cannot remove ${folderName}, does not exist.`);
    return;
  }

  directory = directory.filter((folder) => {
    return !folder.includes(folderName);
  });
}
