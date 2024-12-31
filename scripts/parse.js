const fs = require("fs");
const path = require("path");

const data = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "..", "node-firestore-import-export.json")
  )
);

function createJsonFiles(data) {
  const chainCollection = data.__collections__.v0;

  for (const chainId in chainCollection) {
    console.log(chainId);

    const nftContracts = chainCollection[chainId].__collections__.nftContract;

    for (const contractAddress in nftContracts) {
      const metadataCollection =
        nftContracts[contractAddress].__collections__.metadata;

      for (const tokenId in metadataCollection) {
        const tokenData = metadataCollection[tokenId];
        delete tokenData.__collections__;

        // Define the directory structure
        const dirPath = path.join(
          __dirname,
          "..",
          "data",
          chainId,
          contractAddress
        );
        fs.mkdirSync(dirPath, { recursive: true });

        // Define the file path
        const filePath = path.join(dirPath, tokenId);

        // Write the JSON file
        fs.writeFileSync(filePath, JSON.stringify(tokenData, null, 2));
        console.log(`Created file: ${filePath}`);
      }
    }
  }
}

createJsonFiles(data);
