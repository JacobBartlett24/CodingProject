const readline = require("node:readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let directory = [];

// Gather user input
rl.on("line", (input) => {
  if (input.toLowerCase() === "exit") {
    console.log("Exiting program...");
    rl.close();
  } else {
    let inputLine = input.split(" ");
    selectMethod(inputLine);
  }
});

// Select Methods
function selectMethod(inputLine) {
  if (inputLine[0].toUpperCase() == "CREATE") {
    createFolder(inputLine);
  } else if (inputLine[0].toUpperCase() == "LIST") {
    listFolders(".", 0);
  } else if (inputLine[0].toUpperCase() == "DELETE") {
    deleteFolder(inputLine);
  } else if (inputLine[0].toUpperCase() == "MOVE") {
    moveFolder(inputLine);
  } else {
    console.warn("Invalid method");
  }
}

function moveFolder(inputLine) {
  const fromFolder = inputLine[1];
  const toFolder = inputLine[2];

  const fromFolderIndex = directory.indexOf(fromFolder);

  // Validate for non existent folders
  let hasErrors = moveCommandHasErrors(fromFolderIndex, toFolder, inputLine);

  if (hasErrors) {
    return;
  }

  let slicePoint = fromFolder.split("/").length - 1;

  // Move folders and format paths
  directory = directory.map((folder) => {
    if (folder.includes(fromFolder)) {
      let splitFolder = folder.split("/");
      let newPath = splitFolder.slice(slicePoint);
      return `${toFolder}/${newPath.join("/")}`;
    }
    return folder;
  });
}

function moveCommandHasErrors(fromFolderIndex, toFolder, inputLine) {
  if (inputLine.length > 3) {
    console.warn("Too many args for 'CREATE'");
    return true;
  } else if (inputLine.length < 3) {
    console.warn("Too few args for 'CREATE'");
    return true;
  }

  if (fromFolderIndex === -1) {
    console.warn(`Could not move - ${fromFolder} does not exist`);
    return true;
  }

  if (!directory.includes(toFolder)) {
    console.warn(`Could not move - ${toFolder} does not exist`);
    return true;
  }
  return false;
}

function listFolders() {
  const sortedDirectory = sortDirectory();

  const seenPaths = new Set();

  // Log folders with indentation
  sortedDirectory.forEach((path) => {
    let splitString = path.split("/");
    let currentPath = "";

    splitString.forEach((section, index) => {
      currentPath += (index > 0 ? "/" : "") + section;
      if (!seenPaths.has(currentPath)) {
        seenPaths.add(currentPath);
        console.log(
          "  ".repeat(index) +
            `${currentPath.split("/")[currentPath.split("/").length - 1]}`
        );
      }
    });
  });
}

function sortDirectory() {
  return directory.sort((a, b) => {
    const aParts = a.split("/");
    const bParts = b.split("/");

    // Sort by similar strings
    for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
      const comparison = aParts[i].localeCompare(bParts[i]);
      if (comparison !== 0) {
        return comparison;
      }
    }

    // Sort by slice length
    return aParts.length - bParts.length;
  });
}

function createFolder(inputLine) {
  let hasError = createCommandHasErrors(inputLine);

  if (hasError) {
    return;
  }

  folderName = inputLine[1];
  // Create folder, considering appending paths
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
  // Validate create
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

  let folderIndex = directory.indexOf(folderName);
  let hasError = deleteCommandHasErrors(folderName, folderIndex, inputLine);

  if (hasError) {
    return;
  }

  // Delete folder
  directory = directory.filter((folder) => {
    return !folder.includes(folderName);
  });
}

function deleteCommandHasErrors(folderName, folderIndex, inputLine) {
  if (inputLine.length > 2) {
    console.warn("Too many args for 'DELETE'");
    return true;
  } else if (inputLine.length === 1) {
    console.warn("Too few args for 'DELETE'");
    return true;
  }

  // If folder not found, warn and return
  if (folderIndex == -1) {
    let folders = folderName.split("/");
    let path = "";
    let missingFolder = "";

    for (let i = 0; i < folders.length; i++) {
      path = i === 0 ? `${folders[i]}` : `/${folders[i]}`;
      missingFolder = directory.includes(path) ? "" : path;
      if (missingFolder !== "") {
        console.warn(
          `Cannot delete ${folderName} - ${missingFolder} does not exist.`
        );
        return true;
      }
    }
  }
  return false;
}
