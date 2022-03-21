//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

contract Factory {
    address[] public deployedCampaigns;
    uint256 public campaignCount;
    mapping(address => uint256) campaignIndexMapping;

    function createCampaign(
        address ownerAddress,
        string memory campaignName,
        uint256 rewardAmount,
        uint256 fundingAmount,
        uint256 dailyLimit,
        uint256 duration
    ) public returns (address) {
        address newCampaign = address(
            new Campaign(
                ownerAddress,
                campaignName,
                rewardAmount,
                fundingAmount,
                dailyLimit,
                duration
            )
        );
        deployedCampaigns.push(address(newCampaign));
        campaignIndexMapping[newCampaign] = campaignCount;
        campaignCount += 1;
        return newCampaign;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function getDeployedCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }

    function getCampaignAddress(uint256 index) public view returns (address) {
        return deployedCampaigns[index];
    }

    function getTotalCampaigns() public view returns (uint256) {
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
    uint256 public rewardAmount;
    mapping(address => bool) public allowedPromoter;
    mapping(address => bool) public rewardCheck;
    mapping(address => uint256) public promoterEarning;
    mapping(address => uint256) public promoterIndex;
    uint256 public promoterCount;
    uint256 public fundingAmount;
    uint256 public dailyLimit;
    uint256 public duration;
    uint256 public deadline;
    Promoter[] public promoters;

    constructor(
        address _brandOwner,
        string memory _campaignName,
        uint256 _rewardAmount,
        uint256 _fundingAmount,
        uint256 _dailyLimit,
        uint256 _duration
    ) {
        brandOwner = _brandOwner;
        campaignName = _campaignName;
        rewardAmount = _rewardAmount;
        fundingAmount = _fundingAmount;
        dailyLimit = _dailyLimit;
        duration = _duration;
        deadline = (block.timestamp / 1 days) + (_duration * 1 days);
    }

    function funding() public payable {
        require(msg.value >= fundingAmount);
    }

    modifier onlyBrandOwner() {
        require(msg.sender == brandOwner);
        _;
    }

    function approvePromoter(
        string memory username,
        string memory userId,
        string memory postId,
        address promoterAddress
    ) public onlyBrandOwner {
        Promoter memory newPromoter = Promoter({
            username: username,
            userId: userId,
            postId: postId,
            walletAddress: promoterAddress
        });

        promoters.push(newPromoter);
        promoterIndex[promoterAddress] = promoterCount;
        promoterCount += 1;
        rewardCheck[promoterAddress] = false;
    }

    function sendReward(address payable promoterAddress) public payable {
        require(
            rewardCheck[promoterAddress] != true,
            "Promoter already received reward!"
        );
        require(msg.value == rewardAmount, "Reward amount does not match!");
        require(block.timestamp <= deadline);
        rewardCheck[promoterAddress] = true;
        (bool sent, ) = promoterAddress.call{value: msg.value}(
            "Sending reward"
        );
        promoterEarning[promoterAddress] = msg.value;
        require(sent, "Failed to send Ether");
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function retrievePromoterEarning(address promoterAddress)
        public
        view
        returns (uint256)
    {
        return promoterEarning[promoterAddress];
    }

    function getPromoterSummary(address promoterAddress)
        public
        view
        returns (
            string memory,
            string memory,
            string memory
        )
    {
        uint256 index = promoterIndex[promoterAddress];
        Promoter memory retrievedPromoter = promoters[index];
        return (
            retrievedPromoter.username,
            retrievedPromoter.userId,
            retrievedPromoter.postId
        );
    }

    function getCampaignSummary()
        public
        view
        returns (
            string memory,
            uint256,
            uint256,
            uint256,
            uint256
        )
    {
        return (
            campaignName,
            rewardAmount,
            fundingAmount,
            dailyLimit,
            duration
        );
    }

    function getPromoterCount() public view returns (uint256) {
        return promoterCount;
    }

    function getDeadline() public view returns (uint256) {
        return deadline;
    }
}
