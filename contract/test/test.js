const { expect } = require("chai");
const { ethers } = require("hardhat");
const Campaign = require("../artifacts/contracts/Campaign.sol/Campaign.json");

describe("Deploy", function () {
  it("Should deploy a campaign contract", async function () {
    const [owner] = await ethers.getSigners();
    const CampaignFactory = await ethers.getContractFactory("Factory");
    const campaignFactory = await CampaignFactory.deploy();
    await campaignFactory.deployed();

    const campaignName = "test1";
    const rewardAmount = 10;
    const fundingAmount = 1;
    const dailyLimit = 5;
    const duration = 5;

    const campaignAddr = await campaignFactory.createCampaign(owner.address, campaignName, rewardAmount, fundingAmount, dailyLimit, duration);
    expect(campaignAddr).to.not.equal(null);
  });
});

describe("Transfer", function () {
  it("Should transfer reward", async function () {

    const [owner, addr1] = await ethers.getSigners();
    let initialBalance = await addr1.getBalance();

    const campaignName = "test1";
    const rewardAmount = 1;
    const fundingAmount = 10;
    const dailyLimit = 5;
    const duration = 5;

    const Campaign = await ethers.getContractFactory("Campaign");
    const campaign = await Campaign.deploy(owner.address, campaignName, rewardAmount, fundingAmount, dailyLimit, duration);
    await campaign.deployed();

    await campaign.approvePromoter("promoterUsername", "promoterUserId", "postId", addr1.address);
    await campaign.sendReward(addr1.address, { value : rewardAmount});

    const endingBalance = await addr1.getBalance();
    expect(endingBalance.sub(initialBalance)).to.equal(1);
  });
});
