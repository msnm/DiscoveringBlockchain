pragma solidity ^0.4.25;

contract Lottery {

    address public manager;
    address[] public players;

    function Lottery() public {
        //Using the global msg object (msg.sender, msg.data, msg.value, msg.gaz)
        manager = msg.sender; //The person who instantiates the contract is the sender and thus the manager.
    }

    //Need to send a long some ether to put in the lottery (= payable)
    function enter() public payable {
        //Global function that checks before it executes the rest of the function.
        //Here we will make sure that some min amount of ether is added.
        //require is a guard.
        require(msg.sender != manager); //Manager cannot play himself;
        require(msg.value >= 0.01 ether);
        players.push(msg.sender); //Know we are the player that interacts with this contract
    }


    //Only the manager can call this function!
    function pickWinner() public restricted {
        uint index = random() % players.length;
        //On every address there are functions. Transfer sends ether to the address
        //this.balance is all the ether of this contract
        players[index].transfer(this.balance);
        players = new address[](0); //Resetting the players after the lottery winner is know, so it can be reused!
    }

    //Reusable parts of code you can add to functions
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns (address[]) {
        return players;
    }

    //There is no random generator in solidity thus we create an imperfect pseudo random gen.
    function random() private view returns (uint) {
        //Sha3 algo is a global function, that returns a decimal thus need to cast it.
        return uint(keccak256(block.difficulty, now, players));
    }
}
