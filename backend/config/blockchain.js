const { ethers } = require('ethers');
const BlockVoteABI = require('../../contracts/artifacts/contracts/BlockVote.sol/BlockVote.json');

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545');
const wallet = new ethers.Wallet(process.env.HARDHAT_PRIVATE_KEY, provider);
const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  BlockVoteABI.abi,
  wallet
);

module.exports = contract;