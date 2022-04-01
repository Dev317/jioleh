import React, { useEffect, useState } from "react";
import { client } from "../client";
import Spinner from "./Spinner";
import { ethers } from "ethers";
import Campaign from "../contracts/Campaign.json";

const regBtnStyles =
  "bg-red-500 text-white font-bold p-2 rounded-full w-fit outline-none";
const delBtnStyles =
  "bg-white text-red-500 font-bold p-2 border border-red-500 rounded-full w-fit outline-none";
const rewardBtnStyles =
  "bg-purple-500 text-white font-bold p-2 rounded-full w-fit outline-none";

const getCampaignContract = (campaignAddress) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const factoryContract = new ethers.Contract(
    campaignAddress,
    Campaign.abi,
    signer
  );

  return factoryContract;
};

const VendorCampaignDetail = (props) => {
  const [vendor, setVendor] = useState(props.vendor);
  const [editingMode, setEditingMode] = useState(false);
  const [form, setForm] = useState();

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

    if (vendor != null) {
      setForm({
        campaignName: vendor.campaignName,
        budget: parseFloat(vendor.budget),
        rewardAmount: parseFloat(vendor.rewardAmount),
        refereeReward: vendor.refereeReward,
        dailyLimit: parseInt(vendor.dailyLimit),
        startDate: vendor.startDate,
        duration: parseInt(vendor.duration),
      });
    }

    if (errorMessage.show) {
      new Promise((r) => {
        setTimeout(r, 6000);
      }).then(() => setErrorMessage({ message: "", show: false }));
    }
  }, [vendor, errorMessage.show]);

  const handleUpdate = (e) => {
    client
      .patch(vendor._id)
      .set({
        campaignName: form.campaignName,
        budget: parseFloat(form.budget),
        rewardAmount: parseFloat(form.rewardAmount),
        refereeReward: form.refereeReward,
        dailyLimit: parseInt(form.dailyLimit),
        startDate: form.startDate,
        duration: parseInt(form.duration),
      })
      .commit()
      .then((updatedVendor) => {
        setVendor(updatedVendor);
      })
      .catch((err) => setErrorMessage({ message: err.message, show: true }));
  };

  const handleDelete = (e) => {
    client
      .patch(vendor._id)
      .set({
        hasCampaign: false,
        campaignName: "",
        budget: 0,
        rewardAmount: 0,
        refereeReward: "",
        dailyLimit: 0,
        startDate: "1970-01-01",
        duration: 0,
        contractAddress: "",
        pendingPayment: false,
      })
      .commit()
      .then((updatedVendor) => {
        setVendor(updatedVendor);
      })
      .catch((err) => setErrorMessage({ message: err.message, show: true }));
  };

  const transferReward = async () => {
    const ethValue = vendor.rewardAmount;
    const parsedRewardAmount = ethers.utils.parseEther(ethValue.toString());

    const campaignContract = getCampaignContract(vendor.contractAddress);

    await campaignContract.approvePromoter(
      "promoterUsername",
      "promoterUserId",
      "postId",
      vendor.pendingAddresses[0],
      { gasLimit: 2500000 }
    );
    await campaignContract.sendReward(vendor.pendingAddresses[0], {
      value: parsedRewardAmount,
      gasPrice: "90000",
      gasLimit: "2500000",
    });
    const newBudget = vendor.budget - vendor.rewardAmount;

    const pendingPayment =
      vendor.pendingAddresses.length - 1 === 0 ? false : true;

    // console.log("updating backend");
    await client
      .patch(vendor._id)
      .set({
        budget: newBudget,
        pendingPayment: pendingPayment,
      })
      .unset(["pendingAddresses[0]"])
      .commit()
      .then((updatedVendor) => {
        setVendor(updatedVendor);
      });
    window.location.reload();
  };

  if (!vendor) {
    return <Spinner message="Loading campaign..." />;
  }

  return (
    <div className="relative pb-2 h-full justify-center">
      <div className="flex flex-col pb-5">
        {!vendor.hasCampaign ? (
          <div className="relative flex flex-col w-full items-center">
            <p className="block font-bold mb-2 mt-3">
              A campaign has not been started.
            </p>
          </div>
        ) : (
          <div className="relative flex flex-col w-full items-center">
            {editingMode ? (
              <form className="w-full max-w-sm text-sm p-5">
                <div className="mb-4">
                  <label
                    className="block font-bold mb-2"
                    for="campaignName"
                  >
                    Campaign Name
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3"
                    id="campaignName"
                    type="text"
                    value={form.campaignName}
                    onChange={(e) =>
                      setFormField("campaignName", e.target.value)
                    }
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
                    onChange={(e) =>
                      setFormField("rewardAmount", e.target.value)
                    }
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block font-bold mb-2 mt-3"
                    for="refereeReward"
                  >
                    Reward Referee receives on First Visit
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3"
                    id="refereeReward"
                    type="text"
                    value={form.refereeReward}
                    onChange={(e) =>
                      setFormField("refereeReward", e.target.value)
                    }
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
                  />
                </div>

                <div className="flex justify-between ...">
                  <button
                    type="button"
                    onClick={(e) => {
                      handleUpdate();
                      setEditingMode(!editingMode);
                    }}
                    className={`${regBtnStyles}`}
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      setEditingMode(!editingMode);
                    }}
                    className={`${regBtnStyles}`}
                  >
                    Back
                  </button>
                </div>
              </form>
            ) : (
              <div className="w-full max-w-md text-sm p-5">
                <div className="grid grid-cols-5 gap-2 text-sm">
                  <div className="col-span-3 ...">
                    <p className="font-bold break-words mt-3">Campaign Name:</p>
                  </div>
                  <div className="col-span-2 ...">
                    <p className="break-words mt-3">
                      {vendor.campaignName == null ? "-" : vendor.campaignName}
                    </p>
                  </div>
                  <div className="col-span-3 ...">
                    <p className="font-bold break-words mt-3">Campaign Budget:</p>
                  </div>
                  <div className="col-span-2 ...">
                    <p className="break-words mt-3">
                      {vendor.budget == null ? "-" : vendor.budget}
                    </p>
                  </div>
                  <div className="col-span-3 ...">
                    <p className="font-bold break-words mt-3">
                      Reward Amount per Scan:
                    </p>
                  </div>
                  <div className="col-span-2 ...">
                    <p className="break-words mt-3">
                      {vendor.rewardAmount == null ? "-" : vendor.rewardAmount}
                    </p>
                  </div>
                  <div className="col-span-3 ...">
                    <p className="font-bold break-words mt-3">
                      Referee Reward :
                    </p>
                  </div>
                  <div className="col-span-2 ...">
                    <p className="break-words mt-3">
                      {vendor.campaignName == null ? "-" : vendor.refereeReward}
                    </p>
                  </div>
                  <div className="col-span-3 ...">
                    <p className="font-bold break-words mt-3">
                      Daily Redemption Limit:
                    </p>
                  </div>
                  <div className="col-span-2 ...">
                    <p className="break-words mt-3">
                      {vendor.dailyLimit == null ? "-" : vendor.dailyLimit}
                    </p>
                  </div>
                  <div className="col-span-3 ...">
                    <p className="font-bold break-words mt-3">
                      Campaign Start Date:
                    </p>
                  </div>
                  <div className="col-span-2 ...">
                    <p className="break-words mt-3">
                      {vendor.startDate == null ? "-" : vendor.startDate}
                    </p>
                  </div>
                  <div className="col-span-3 ...">
                    <p className="font-bold break-words mt-3">
                      Campaign Duration (Days):
                    </p>
                  </div>
                  <div className="col-span-2 ...">
                    <p className="break-words mt-3">
                      {vendor.duration == null ? "-" : vendor.duration}
                    </p>
                  </div>

                  <div className="col-span-3 ...">
                    <p className="font-bold break-words mt-3">Payment Pending:</p>
                  </div>
                  <div className="col-span-2  ...">
                    {vendor.pendingPayment ? (
                      <button
                        type="button"
                        onClick={() => {
                          transferReward();
                        }}
                        className={`${rewardBtnStyles}`}
                      >
                        Transfer
                      </button>
                    ) : (
                      <p className="break-words mt-3">No pending payment</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      setEditingMode(!editingMode);
                    }}
                    className={`${regBtnStyles} col-span-2 mt-10 ...`}
                  >
                    Edit Campaign
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      handleDelete();
                    }}
                    className={`${delBtnStyles} col-start-4 col-span-2 mt-10 ...`}
                  >
                    Delete Campaign
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorCampaignDetail;
