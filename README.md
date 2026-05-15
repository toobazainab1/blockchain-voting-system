# BlockVote 🗳️⛓️
> Blockchain-Secured University Voting System

A full-stack decentralized voting platform built with React, Node.js, MongoDB, and Ethereum smart contracts. Every vote is permanently recorded on the blockchain with cryptographic proof.

## 🌐 Live Demo
**Frontend:** https://blockchain-voting-system-green.vercel.app

## ✨ Features
- 🔐 Wallet-linked registration (MetaMask) — one wallet = one voter
- 🗳️ Votes permanently recorded on Ethereum blockchain
- 📄 Vote receipt with real blockchain transaction hash
- 🤖 AI voter sentiment analysis after voting
- 📜 Official vote certificate (printable as PDF)
- 🔍 Audit trail — verify any vote using its transaction hash
- 📊 Live election results with animated charts
- ⏱️ Live countdown timers for open elections

## 🏗️ Project Structure
\`\`\`
blockchain-voting-system/
├── frontend/           # React.js app
├── backend/            # Node.js + Express API
└── contracts/          # Solidity smart contract
\`\`\`

## 🚀 How to Run Locally

### Prerequisites
- Node.js v22+
- Git
- MetaMask browser extension
- MongoDB Atlas account

### Step 1 — Clone
\`\`\`bash
git clone https://github.com/toobazainab1/blockchain-voting-system.git
cd blockchain-voting-system
\`\`\`

### Step 2 — Install dependencies
\`\`\`bash
cd backend && npm install
cd ../frontend && npm install
cd ../contracts && npm install
\`\`\`

### Step 3 — Create backend .env
\`\`\`
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
ADMIN_SECRET=your_admin_secret
PORT=5000
\`\`\`

### Step 4 — Run (4 terminals)

Terminal 1 — Local blockchain:
\`\`\`bash
cd contracts && npx hardhat node
\`\`\`

Terminal 2 — Deploy contract:
\`\`\`bash
cd contracts && npx hardhat run scripts/deploy.js --network localhost
\`\`\`

Terminal 3 — Backend:
\`\`\`bash
cd backend && npm run dev
\`\`\`

Terminal 4 — Frontend:
\`\`\`bash
cd frontend && npm start
\`\`\`

### Step 5 — Create admin (once only)
\`\`\`bash
curl -X POST http://localhost:5000/api/auth/setup-admin \
  -H "Content-Type: application/json" \
  -d '{"secretKey": "your_admin_secret_from_env"}'
\`\`\`

## 🦊 MetaMask Setup
1. Install MetaMask Chrome extension
2. Add Hardhat network: RPC URL: http://127.0.0.1:8545, Chain ID: 31337
3. Import a Hardhat test account from Terminal 1
4. Switch to Hardhat network

## 📡 API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register voter |
| POST | /api/auth/login | Login |
| GET | /api/elections | Get all elections |
| POST | /api/elections | Create election (admin) |
| POST | /api/votes/cast | Cast a vote |
| GET | /api/votes/results/:id | Get results |

## ⛓️ Smart Contract Functions
\`\`\`solidity
createElection(title, category, startTime, endTime)
addCandidate(electionId, name, party)
castVote(electionId, candidateId)
verifyVoteHash(voteHash)
getLeader(electionId)
publishResults(electionId)
\`\`\`

## 🔒 Security
- JWT authentication on all protected routes
- bcrypt password hashing
- MetaMask wallet signature on registration
- Role-based access (voter / admin)
- Admin portal on secret URL

## ⚙️ Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 19, React Router, Ethers.js |
| Backend | Node.js, Express 4, JWT |
| Database | MongoDB Atlas, Mongoose |
| Blockchain | Solidity 0.8.19, Hardhat |
| AI | Anthropic Claude API |
| Deployment | Vercel |

*BlockVote — Blockchain Voting System 2026*
