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

    // const campaignContract = new ethers.Contract(campaignAddr, Campaign.abi, addr1);
    // console.log(campaignContract);
  });
});
