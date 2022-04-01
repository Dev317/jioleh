import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { client } from "../client";
import { TokenContext } from "../context/TokenContext";
import { ethers } from "ethers";
import Factory from "../contracts/Factory.json";

const factoryAddress = process.env.REACT_APP_FACTORY_ADDRESS;

const getFactoryContract = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const factoryContract = new ethers.Contract(
    factoryAddress,
    Factory.abi,
    signer
  );

  return factoryContract;
};

export default function VendorCreateCampaign(props) {
  const [vendor, setVendor] = useState(props.vendor);
  const [form, setForm] = useState({});
  const navigate = useNavigate();
  const { connectWallet, currentAccount } = useContext(TokenContext);

  const [errorMessage, setErrorMessage] = useState({
    message: "",
    show: false,
  });

  const setFormField = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  useEffect(() => {
    localStorage.getItem("campaign")
      ? setVendor(JSON.parse(localStorage.getItem("campaign")))
      : setVendor(props.vendor);
  }, [props.vendor]);

  useEffect(() => {
    localStorage.setItem("campaign", JSON.stringify(vendor));

    if (errorMessage.show) {
      new Promise((r) => {
        setTimeout(r, 6000);
      }).then(() => setErrorMessage({ message: "", show: false }));
    }
  }, [vendor, errorMessage.show]);

  const createCampaign = async (form) => {
    const factoryContract = getFactoryContract();
    const parsedBudget = ethers.utils.parseEther(form.budget);
    const parsedRewardAmount = ethers.utils.parseEther(form.rewardAmount);

    let transactionHash = await factoryContract.createCampaign(
      vendor.walletAddress,
      form.campaignName,
      parsedRewardAmount,
      parsedBudget,
      parseInt(form.dailyLimit),
      parseInt(form.duration)
    );

    await transactionHash.wait();
    const campaignCount = await factoryContract.getTotalCampaigns();
    const campaignAddress = await factoryContract.getCampaignAddress(
      campaignCount - 1
    );

    // console.log('Campaign created successfully!');
    // console.log("Campaign address: ",campaignAddress);
    return campaignAddress;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let contractAddress = await createCampaign(form);
    contractAddress = contractAddress.toString();

    client
      .patch(vendor._id)
      .set({
        hasCampaign: true,
        campaignName: form.campaignName,
        budget: parseFloat(form.budget),
        rewardAmount: parseFloat(form.rewardAmount),
        refereeReward: form.refereeReward,
        dailyLimit: parseInt(form.dailyLimit),
        startDate: form.startDate,
        duration: parseInt(form.duration),
        contractAddress: contractAddress,
        pendingPayment: false,
      })
      .commit()
      .then((updatedVendor) => {
        localStorage.setItem("campaign", JSON.stringify(updatedVendor));
        navigate("/vendor/vendor-campaign-detail");
      })
      .catch((err) => setErrorMessage({ message: err.message, show: true }));
  };

  return (
    <div className="relative pb-2 h-full justify-center">
      <div className="flex flex-col pb-5">
        <div className="relative flex flex-col w-full items-center">
          {vendor.hasCampaign ? (
            <p className="block font-bold mb-2 mt-3">
              A campaign has already been created!
            </p>
          ) : (
            <form className="w-full max-w-sm text-sm p-5" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block font-bold mb-2" for="campaignName">
                  Campaign Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3"
                  id="campaignName"
                  type="text"
                  value={form.campaignName}
                  onChange={(e) => setFormField("campaignName", e.target.value)}
                  placeholder="Enter campaign name..."
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2" for="budget">
                  Campaign Budget
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3"
                  id="budget"
                  type="number"
                  step="0.01"
                  value={form.budget}
                  onChange={(e) => setFormField("budget", e.target.value)}
                  placeholder="Enter your budget for the campaign..."
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2" for="rewardAmount">
                  Reward Amount per Scan
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3"
                  id="rewardAmount"
                  type="number"
                  step="0.01"
                  value={form.rewardAmount}
                  onChange={(e) => setFormField("rewardAmount", e.target.value)}
                  placeholder="Enter referrer's reward amount per scan..."
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2" for="refereeReward">
                  Reward Referee receives on First Visit
                </label>
                <input
                className="shadow appearance-none border rounded w-full py-2 px-3"
                id="refereeReward"
                type="text"
                value={form.refereeReward}
                onChange={(e) => setFormField("refereeReward", e.target.value)}
                placeholder="Enter reward referee will get on first visit..."
              />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2" for="dailyLimit">
                  Daily Redemption Limit
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3"
                  id="dailyLimit"
                  type="number"
                  value={form.dailyLimit}
                  onChange={(e) => setFormField("dailyLimit", e.target.value)}
                  placeholder="Enter maximum daily redemption limit..."
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2" for="startDate">
                  Campaign Start Date
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3"
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => setFormField("startDate", e.target.value)}
                  placeholder="Enter campaign start date..."
                />
              </div>
              <div className="mb-4">
                <label className="block font-bold mb-2" for="duration">
                  Campaign Duration (Days)
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 mb-3"
                  id="duration"
                  type="number"
                  value={form.duration}
                  onChange={(e) => setFormField("duration", e.target.value)}
                  placeholder="Enter campaign duration in days..."
                />
              </div>
              <div className="flex justify-between ...">
                {!currentAccount ? (
                  <button
                    onClick={() => connectWallet(vendor._id)}
                    className="bg-blue-500 text-white font-bold p-2 rounded-full w-fit outline-none"
                  >
                    Connect Wallet
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      window.open("https://pay.sendwyre.com/", "_blank");
                    }}
                    className="bg-purple-500 text-white font-bold p-2 rounded-full w-fit outline-none"
                  >
                    Fund Wallet
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-red-500 text-white font-bold p-2 rounded-full w-fit outline-none"
                >
                  Create
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
