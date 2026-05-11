const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying BlockVote contract...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying from address:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", ethers.formatEther(balance), "ETH\n");

  const BlockVote = await ethers.getContractFactory("BlockVote");
  const blockVote = await BlockVote.deploy();
  await blockVote.waitForDeployment();

  const contractAddress = await blockVote.getAddress();
  console.log("BlockVote deployed to:", contractAddress);

  // Seed demo data
  console.log("\nSeeding demo elections...");
  const now = Math.floor(Date.now() / 1000);

  await blockVote.createElection(
    "General Student Council Election 2026",
    "Student Council",
    now - 3600,
    now + (2 * 86400)
  );
  await blockVote.addCandidate(1, "Ahmed Raza",  "Progress Alliance");
  await blockVote.addCandidate(1, "Sara Khan",   "Unity Front");
  await blockVote.addCandidate(1, "Bilal Ahmed", "Independent");
  await blockVote.addCandidate(1, "Hina Malik",  "Future Forward");
  console.log("Election 1 created with 4 candidates");

  await blockVote.createElection(
    "Faculty Representative Vote — Spring 2026",
    "Faculty",
    now - 1800,
    now + (5 * 86400)
  );
  await blockVote.addCandidate(2, "Dr. Usman Ali", "Academic Excellence");
  await blockVote.addCandidate(2, "Prof. Nadia",   "Student First");
  await blockVote.addCandidate(2, "Kamran Shah",   "Reform Party");
  console.log("Election 2 created with 3 candidates");

  // Export ABI + address to frontend
  const artifactPath = path.join(__dirname, "../artifacts/contracts/BlockVote.sol/BlockVote.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

  const exportDir = path.join(__dirname, "../../frontend/src/contracts");
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

  const exportData = {
    address: contractAddress,
    abi: artifact.abi
  };

  fs.writeFileSync(
    path.join(exportDir, "BlockVote.json"),
    JSON.stringify(exportData, null, 2)
  );

  console.log("\n═══════════════════════════════════════");
  console.log("DEPLOYMENT COMPLETE");
  console.log("Contract address:", contractAddress);
  console.log("ABI exported to frontend/src/contracts/BlockVote.json");
  console.log("═══════════════════════════════════════\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});