const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BlockVote", function () {
  let blockVote;
  let admin, voter1, voter2, voter3;

  const inOneMinute = () => Math.floor(Date.now() / 1000) + 60;
  const inOneHour   = () => Math.floor(Date.now() / 1000) + 3600;
  const oneHourAgo  = () => Math.floor(Date.now() / 1000) - 3600;
  const twoHoursAgo = () => Math.floor(Date.now() / 1000) - 7200;

  beforeEach(async function () {
    [admin, voter1, voter2, voter3] = await ethers.getSigners();
    const BlockVoteFactory = await ethers.getContractFactory("BlockVote");
    blockVote = await BlockVoteFactory.deploy();
    await blockVote.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the admin correctly", async function () {
      expect(await blockVote.admin()).to.equal(admin.address);
    });

    it("Should start with zero elections", async function () {
      expect(await blockVote.electionCount()).to.equal(0);
    });

    it("Should start with zero total votes", async function () {
      expect(await blockVote.getTotalVotesCast()).to.equal(0);
    });
  });

  describe("Election Creation", function () {
    it("Admin should be able to create an election", async function () {
      await expect(
        blockVote.createElection("Student Council Election 2026", "Student Council", inOneMinute(), inOneHour())
      ).to.emit(blockVote, "ElectionCreated");
      expect(await blockVote.electionCount()).to.equal(1);
    });

    it("Non-admin should NOT be able to create an election", async function () {
      await expect(
        blockVote.connect(voter1).createElection("Fake Election", "Fake", inOneMinute(), inOneHour())
      ).to.be.revertedWith("BlockVote: Only admin can call this");
    });

    it("Should reject election with end time before start time", async function () {
      await expect(
        blockVote.createElection("Bad Election", "Test", inOneHour(), inOneMinute())
      ).to.be.revertedWith("BlockVote: End time must be after start time");
    });
  });

  describe("Candidate Management", function () {
    beforeEach(async function () {
      await blockVote.createElection("Test Election", "Test", inOneMinute(), inOneHour());
    });

    it("Admin should be able to add candidates", async function () {
      await expect(
        blockVote.addCandidate(1, "Ahmed Raza", "Progress Alliance")
      ).to.emit(blockVote, "CandidateAdded");
    });

    it("Should retrieve candidate details correctly", async function () {
      await blockVote.addCandidate(1, "Ahmed Raza", "Progress Alliance");
      const candidate = await blockVote.getCandidate(1, 1);
      expect(candidate.name).to.equal("Ahmed Raza");
      expect(candidate.party).to.equal("Progress Alliance");
      expect(candidate.voteCount).to.equal(0);
    });

    it("Non-admin should NOT be able to add candidates", async function () {
      await expect(
        blockVote.connect(voter1).addCandidate(1, "Fake", "Fake Party")
      ).to.be.revertedWith("BlockVote: Only admin can call this");
    });
  });

  describe("Voting", function () {
    beforeEach(async function () {
      await blockVote.createElection("Open Election", "Test", oneHourAgo(), inOneHour());
      await blockVote.addCandidate(1, "Ahmed Raza", "Progress Alliance");
      await blockVote.addCandidate(1, "Sara Khan", "Unity Front");
    });

    it("Voter should be able to cast a vote", async function () {
      await expect(blockVote.connect(voter1).castVote(1, 1)).to.emit(blockVote, "VoteCast");
    });

    it("Candidate vote count should increase after vote", async function () {
      await blockVote.connect(voter1).castVote(1, 1);
      const candidate = await blockVote.getCandidate(1, 1);
      expect(candidate.voteCount).to.equal(1);
    });

    it("Election total votes should increase", async function () {
      await blockVote.connect(voter1).castVote(1, 1);
      await blockVote.connect(voter2).castVote(1, 2);
      const election = await blockVote.getElection(1);
      expect(election.totalVotes).to.equal(2);
    });

    it("Should PREVENT double voting", async function () {
      await blockVote.connect(voter1).castVote(1, 1);
      await expect(
        blockVote.connect(voter1).castVote(1, 2)
      ).to.be.revertedWith("BlockVote: You have already voted in this election");
    });

    it("Different voters should be able to vote independently", async function () {
      await blockVote.connect(voter1).castVote(1, 1);
      await blockVote.connect(voter2).castVote(1, 1);
      await blockVote.connect(voter3).castVote(1, 2);
      const c1 = await blockVote.getCandidate(1, 1);
      const c2 = await blockVote.getCandidate(1, 2);
      expect(c1.voteCount).to.equal(2);
      expect(c2.voteCount).to.equal(1);
    });

    it("Should correctly track who has voted", async function () {
      expect(await blockVote.checkHasVoted(1, voter1.address)).to.equal(false);
      await blockVote.connect(voter1).castVote(1, 1);
      expect(await blockVote.checkHasVoted(1, voter1.address)).to.equal(true);
    });

    it("Vote hash should be verifiable on chain", async function () {
      await blockVote.connect(voter1).castVote(1, 1);
      const myHash = await blockVote.connect(voter1).getMyVoteHash(1);
      expect(await blockVote.verifyVoteHash(myHash)).to.equal(true);
    });

    it("Should correctly identify the leading candidate", async function () {
      await blockVote.connect(voter1).castVote(1, 1);
      await blockVote.connect(voter2).castVote(1, 1);
      await blockVote.connect(voter3).castVote(1, 2);
      const leader = await blockVote.getLeader(1);
      expect(leader.leaderName).to.equal("Ahmed Raza");
      expect(leader.leaderVotes).to.equal(2);
    });

    it("Should NOT allow voting after election ends", async function () {
      await blockVote.createElection("Closed Election", "Test", twoHoursAgo(), oneHourAgo());
      await blockVote.addCandidate(2, "Test Candidate", "Test Party");
      await expect(
        blockVote.connect(voter1).castVote(2, 1)
      ).to.be.revertedWith("BlockVote: Election is not currently open");
    });
  });

  describe("Results", function () {
    it("Should publish results after election ends", async function () {
      await blockVote.createElection("Ended Election", "Test", twoHoursAgo(), oneHourAgo());
      await blockVote.addCandidate(1, "Winner", "Party A");
      await expect(blockVote.publishResults(1)).to.emit(blockVote, "ElectionClosed");
    });

    it("Should NOT publish results before election ends", async function () {
      await blockVote.createElection("Open Election", "Test", oneHourAgo(), inOneHour());
      await blockVote.addCandidate(1, "Candidate", "Party");
      await expect(blockVote.publishResults(1)).to.be.revertedWith("BlockVote: Election has not ended yet");
    });
  });

  describe("Integrity", function () {
    it("Election integrity score should start at 100", async function () {
      await blockVote.createElection("Test", "Test", inOneMinute(), inOneHour());
      expect(await blockVote.getIntegrityScore(1)).to.equal(100);
    });

    it("Total votes should accumulate across elections", async function () {
      await blockVote.createElection("E1", "Test", oneHourAgo(), inOneHour());
      await blockVote.addCandidate(1, "C1", "P1");
      await blockVote.connect(voter1).castVote(1, 1);
      await blockVote.connect(voter2).castVote(1, 1);

      await blockVote.createElection("E2", "Test", oneHourAgo(), inOneHour());
      await blockVote.addCandidate(2, "C2", "P2");
      await blockVote.connect(voter3).castVote(2, 1);

      expect(await blockVote.getTotalVotesCast()).to.equal(3);
    });
  });
});