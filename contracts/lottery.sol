pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function randomNumberGenerator() private view returns (uint256) {
        return
            uint256(
                keccak256(abi.encodePacked(block.difficulty, now, players))
            );
    }

    function picWinner() public restricted {
        uint256 index = randomNumberGenerator() % players.length;
        players[index].transact(this.balance);
        players = new address[](0);
    }

    function getAllPlayer() public returns (address[]) {
        return players;
    }

    modifier restricted() {
        // for entering codes that will be used in multiple places in code
        require(msg.sender == manager);
        _;
    }
}
