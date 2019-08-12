pragma solidity ^0.4.25;


//Whenever a contract deploys another contract it is the user that needs to pay for it!
//This way we do not have to pay it and the user cannot alter the code of the contract!
contract CampaignFactory {
    address[] deployedCampaigns;

    function createCampaign(uint minimumContribution) public {
        address newCampaing = new Campaign(minimumContribution, msg.sender);
        deployedCampaigns.push(newCampaing);
    }

    function getDeployedCampaigns() public view returns (address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {

    //Storage variables
    address public manager; //The Manager of the kickstarter Campaign
    uint public minimumContribution;

    //address[] public approvers; there can be millions of contributors, so whenever we need to loop over these people this will cost to much gas (linear search time)! Therefore use a mapping (constant search time), then we do not have to loop over all persons if we just want to find a specific address of a contributor.
    //mappings keys are not stored, there hashes are. This means we cannot retrieve the keys of a mapping, but we can lookup on a key that will be hashed and then the hashed key can be looked up.
    //if for a key no value is found a default value is returned. This default value depends on the value type of the mapping. If it is a string then you get an empty string.
    mapping(address => bool) contributors; //default value is false, thus if we lookup an address that does not exists we will get false. Therefore we set the values of existing address as true
    uint contributorsCount;

    Request[] public requests;

    //Constructor
    constructor(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    //Functions
    function contribute() public payable {
        require(msg.value >= minimumContribution);
        contributors[msg.sender] = true; //way to add a value to the mapping
        contributorsCount++;
    }

    function createRequest(string description, uint value, address recipient) public restrictedToManager {
        Request memory request =  Request({ //storage is a pointer to an existing variable in storage
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
            });
        requests.push(request);
    }

    function approveRequest(uint indexOfRequest) public restrictedToDonator {
        Request storage request = requests[indexOfRequest]; //Want to store it in the contract not in memory only when we make the changes!
        require(!request.approvals[msg.sender]); //If this person has already voted then he cannot vote again
        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint indexOfRequest) public restrictedToManager {
        Request storage request = requests[indexOfRequest];
        require(request.approvalCount > (contributorsCount / 2));
        require(!request.complete);
        request.recipient.transfer(request.value);
        request.complete = true;
    }

    modifier restrictedToManager() {
        require(msg.sender == manager);
        _;
    }

    modifier restrictedToDonator() {
        require(contributors[msg.sender]);
        _;
    }

    // Struct definitions
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

}
