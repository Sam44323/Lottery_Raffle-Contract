pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;

    constructor() public {
        manager = msg.sender;
    }

    function enter() public payable {
        // need .01 ether to eneter the lottery
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function randomNumberGenerator() private view returns (uint256) {
        return
            uint256(
                keccak256(abi.encodePacked(block.difficulty, now, players))
            );
    }

    function pickWinner() public restricted {
        uint256 index = randomNumberGenerator() % players.length;
        players[index].transfer(this.balance);
        players = new address[](0);
    }

    function getAllPlayers() public view returns (address[]) {
        return players;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
}
