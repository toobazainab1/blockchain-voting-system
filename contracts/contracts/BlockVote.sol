// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title BlockVote
 * @dev Blockchain-based voting system for IIU BSSE-F23-B project
 */
contract BlockVote {

    struct Candidate {
        uint256 id;
        string  name;
        string  party;
        uint256 voteCount;
        bool    exists;
    }

    struct Election {
        uint256  id;
        string   title;
        string   category;
        uint256  startTime;
        uint256  endTime;
        bool     exists;
        bool     resultsPublished;
        uint256  totalVotes;
        uint256  candidateCount;
        uint256  integrityScore;
    }

    struct VoteRecord {
        uint256 electionId;
        uint256 candidateId;
        uint256 timestamp;
        bytes32 voteHash;
    }

    address public admin;
    uint256 public electionCount;
    uint256 public totalVotesCast;

    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(uint256 => Candidate)) public candidates;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => VoteRecord)) private voteRecords;
    mapping(bytes32 => bool) public voteExists;
    mapping(uint256 => bytes32[]) public electionVoteHashes;

    event ElectionCreated(uint256 indexed electionId, string title, uint256 startTime, uint256 endTime);
    event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name, string party);
    event VoteCast(uint256 indexed electionId, uint256 indexed candidateId, address indexed voter, bytes32 voteHash, uint256 timestamp);
    event ElectionClosed(uint256 indexed electionId, uint256 totalVotes, uint256 winnerCandidateId);
    event ResultsPublished(uint256 indexed electionId, uint256 winnerCandidateId, string winnerName, uint256 winnerVotes);

    modifier onlyAdmin() {
        require(msg.sender == admin, "BlockVote: Only admin can call this");
        _;
    }

    modifier electionExists(uint256 _electionId) {
        require(elections[_electionId].exists, "BlockVote: Election does not exist");
        _;
    }

    modifier electionIsOpen(uint256 _electionId) {
        require(
            block.timestamp >= elections[_electionId].startTime &&
            block.timestamp <= elections[_electionId].endTime,
            "BlockVote: Election is not currently open"
        );
        _;
    }

    modifier notVoted(uint256 _electionId) {
        require(!hasVoted[_electionId][msg.sender], "BlockVote: You have already voted in this election");
        _;
    }

    constructor() {
        admin = msg.sender;
        electionCount = 0;
        totalVotesCast = 0;
    }

    function createElection(
        string memory _title,
        string memory _category,
        uint256 _startTime,
        uint256 _endTime
    ) external onlyAdmin returns (uint256) {
        require(_endTime > _startTime, "BlockVote: End time must be after start time");

        electionCount++;
        uint256 newId = electionCount;

        elections[newId] = Election({
            id:               newId,
            title:            _title,
            category:         _category,
            startTime:        _startTime,
            endTime:          _endTime,
            exists:           true,
            resultsPublished: false,
            totalVotes:       0,
            candidateCount:   0,
            integrityScore:   100
        });

        emit ElectionCreated(newId, _title, _startTime, _endTime);
        return newId;
    }

    function addCandidate(
        uint256 _electionId,
        string memory _name,
        string memory _party
    ) external onlyAdmin electionExists(_electionId) returns (uint256) {
        elections[_electionId].candidateCount++;
        uint256 candidateId = elections[_electionId].candidateCount;

        candidates[_electionId][candidateId] = Candidate({
            id:        candidateId,
            name:      _name,
            party:     _party,
            voteCount: 0,
            exists:    true
        });

        emit CandidateAdded(_electionId, candidateId, _name, _party);
        return candidateId;
    }

    function castVote(
        uint256 _electionId,
        uint256 _candidateId
    )
        external
        electionExists(_electionId)
        electionIsOpen(_electionId)
        notVoted(_electionId)
    {
        require(candidates[_electionId][_candidateId].exists, "BlockVote: Candidate does not exist");

        bytes32 voteHash = keccak256(abi.encodePacked(
            msg.sender, _electionId, _candidateId, block.timestamp, block.number
        ));

        hasVoted[_electionId][msg.sender] = true;
        candidates[_electionId][_candidateId].voteCount++;
        elections[_electionId].totalVotes++;
        totalVotesCast++;
        voteExists[voteHash] = true;
        electionVoteHashes[_electionId].push(voteHash);

        voteRecords[_electionId][msg.sender] = VoteRecord({
            electionId:  _electionId,
            candidateId: _candidateId,
            timestamp:   block.timestamp,
            voteHash:    voteHash
        });

        emit VoteCast(_electionId, _candidateId, msg.sender, voteHash, block.timestamp);
    }

    function getElection(uint256 _electionId)
        external view electionExists(_electionId)
        returns (
            uint256 id, string memory title, string memory category,
            uint256 startTime, uint256 endTime, bool isOpen,
            uint256 totalVotes, uint256 candidateCount, uint256 integrityScore
        )
    {
        Election storage e = elections[_electionId];
        bool open = block.timestamp >= e.startTime && block.timestamp <= e.endTime;
        return (e.id, e.title, e.category, e.startTime, e.endTime, open, e.totalVotes, e.candidateCount, e.integrityScore);
    }

    function getCandidate(uint256 _electionId, uint256 _candidateId)
        external view electionExists(_electionId)
        returns (uint256 id, string memory name, string memory party, uint256 voteCount)
    {
        Candidate storage c = candidates[_electionId][_candidateId];
        require(c.exists, "BlockVote: Candidate does not exist");
        return (c.id, c.name, c.party, c.voteCount);
    }

    function getAllCandidates(uint256 _electionId)
        external view electionExists(_electionId)
        returns (
            uint256[] memory ids,
            string[] memory names,
            string[] memory parties,
            uint256[] memory voteCounts
        )
    {
        uint256 count = elections[_electionId].candidateCount;
        ids        = new uint256[](count);
        names      = new string[](count);
        parties    = new string[](count);
        voteCounts = new uint256[](count);

        for (uint256 i = 1; i <= count; i++) {
            Candidate storage c = candidates[_electionId][i];
            ids[i-1]        = c.id;
            names[i-1]      = c.name;
            parties[i-1]    = c.party;
            voteCounts[i-1] = c.voteCount;
        }
        return (ids, names, parties, voteCounts);
    }

    function checkHasVoted(uint256 _electionId, address _voter) external view returns (bool) {
        return hasVoted[_electionId][_voter];
    }

    function getMyVoteHash(uint256 _electionId) external view returns (bytes32) {
        require(hasVoted[_electionId][msg.sender], "BlockVote: You have not voted in this election");
        return voteRecords[_electionId][msg.sender].voteHash;
    }

    function verifyVoteHash(bytes32 _voteHash) external view returns (bool) {
        return voteExists[_voteHash];
    }

    function getLeader(uint256 _electionId)
        external view electionExists(_electionId)
        returns (uint256 leaderId, string memory leaderName, uint256 leaderVotes)
    {
        uint256 count = elections[_electionId].candidateCount;
        uint256 maxVotes = 0;
        uint256 leadingId = 0;

        for (uint256 i = 1; i <= count; i++) {
            if (candidates[_electionId][i].voteCount > maxVotes) {
                maxVotes  = candidates[_electionId][i].voteCount;
                leadingId = i;
            }
        }

        if (leadingId == 0) return (0, "No votes yet", 0);
        return (leadingId, candidates[_electionId][leadingId].name, candidates[_electionId][leadingId].voteCount);
    }

    function getVoteHashes(uint256 _electionId)
        external view electionExists(_electionId)
        returns (bytes32[] memory)
    {
        return electionVoteHashes[_electionId];
    }

    function getTotalVotesCast() external view returns (uint256) {
        return totalVotesCast;
    }

    function getIntegrityScore(uint256 _electionId)
        external view electionExists(_electionId)
        returns (uint256)
    {
        return elections[_electionId].integrityScore;
    }

    function publishResults(uint256 _electionId)
        external onlyAdmin electionExists(_electionId)
    {
        require(block.timestamp > elections[_electionId].endTime, "BlockVote: Election has not ended yet");
        require(!elections[_electionId].resultsPublished, "BlockVote: Results already published");

        elections[_electionId].resultsPublished = true;

        uint256 count = elections[_electionId].candidateCount;
        uint256 maxVotes = 0;
        uint256 winnerId = 0;

        for (uint256 i = 1; i <= count; i++) {
            if (candidates[_electionId][i].voteCount > maxVotes) {
                maxVotes = candidates[_electionId][i].voteCount;
                winnerId = i;
            }
        }

        emit ElectionClosed(_electionId, elections[_electionId].totalVotes, winnerId);

        if (winnerId > 0) {
            emit ResultsPublished(_electionId, winnerId, candidates[_electionId][winnerId].name, candidates[_electionId][winnerId].voteCount);
        }
    }
}