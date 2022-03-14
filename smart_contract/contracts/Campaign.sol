//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

contract Factory {
    address[] public deployedCampaigns;
    uint public campaignCount;
    mapping(address=>uint) campaignIndexMapping;

    function createCampaign(string memory campaignName, uint rewardAmount, uint fundingAmount) public returns (address){
        address newCampaign = address(new Campaign(campaignName, rewardAmount, fundingAmount));
        deployedCampaigns.push(address(newCampaign));
        campaignIndexMapping[newCampaign] = campaignCount;
        campaignCount += 1;

        return newCampaign;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getDeployedCampaigns() public view returns(address[] memory) {
        return deployedCampaigns;
    }

    function getCampaignAddress(uint index) public view returns(address) {
        return deployedCampaigns[index];
    }

    function getTotalCampaigns() public view returns(uint) {
        return campaignCount;
    }
}


contract Campaign {
    struct Promoter {
        string username;
        string userId;
        string postId;
        address walletAddress;
    }

    address public brandOwner;
    string public campaignName;
    uint public rewardAmount;
    mapping(address => bool) public allowedPromoter;
    mapping(address => bool) public rewardCheck;
    mapping(address=> uint) public promoterEarning;
    mapping(address=> uint) public promoterIndex;
    uint public promoterCount;
    uint public fundingAmount;
    Promoter[] public promoters;

    constructor(string memory _campaignName, uint _rewardAmount, uint _fundingAmount) {
        brandOwner = msg.sender;
        campaignName = _campaignName;
        rewardAmount = _rewardAmount;
        fundingAmount = _fundingAmount;
    }

    function funding() public payable {
        require(msg.value >= fundingAmount);
    }

    modifier onlyBrandOwner() {
        require(msg.sender == brandOwner);
        _;
    }

    function approvePromoter(string memory username, string memory userId, string memory postId, address promoterAddress) public onlyBrandOwner {
        Promoter memory newPromoter = Promoter({
            username: username,
            userId : userId,
            postId : postId,
            walletAddress : promoterAddress
        });

        promoters.push(newPromoter);
        promoterIndex[promoterAddress] = promoterCount;
        promoterCount += 1;
        rewardCheck[promoterAddress] = false;
    }

    function sendReward(address payable promoterAddress) public payable {
        require(rewardCheck[promoterAddress] != true, "Promoter already received reward!");
        require(msg.value == rewardAmount, "Reward amount does not match!");
        rewardCheck[promoterAddress] = true;
        (bool sent,) = promoterAddress.call{value: msg.value}("Sending reward");
        promoterEarning[promoterAddress] = msg.value;
        require(sent, "Failed to send Ether");
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function retrievePromoterEarning(address promoterAddress) public view returns(uint) {
        return promoterEarning[promoterAddress];
    }

    function getPromoterSummary(address promoterAddress) public view returns (string memory, string memory, string memory) {
        uint index = promoterIndex[promoterAddress];
        Promoter memory retrievedPromoter = promoters[index];
        return (retrievedPromoter.username, retrievedPromoter.userId, retrievedPromoter.postId);
    }

    function getCampaingSummary() public view returns(string memory, uint, uint) {
        return (campaignName, rewardAmount, fundingAmount);
    }

    function getPromoterCount() public view returns(uint) {
        return promoterCount;
    }
}
