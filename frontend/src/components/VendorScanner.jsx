import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { client } from "../client";
import { EthContext } from "../context/EthContext";
import { useContext } from "react";
import { fetchVendor } from "../utils/fetchUser";

const qrConfig = { fps: 10, qrbox: { width: 300, height: 300 } };

let html5QrCode;

const SAMPLE_VENDOR = "12345678910";

const Scanner = (props) => {

  const { currentAccount, connectWallet, formData, handleChange, handleRewardChange, createCampaign, rewardFormData, transferReward } = useContext(EthContext);
  const vendor = fetchVendor();
  console.log(currentAccount, connectWallet)
  console.log(vendor);
  const vendorName = vendor.username;
  formData.vendorName = vendorName;
  rewardFormData.vendorName = vendorName;

  const handleSubmit = async (e) => {
    const { campaignName, rewardAmount, fundingAmount } = formData;
    e.preventDefault();

    if ( !campaignName || !rewardAmount || !fundingAmount) {
      return;
    }

    createCampaign();
  }

  const handleTransfer = async (e) => {
    const { promoterUsername, promoterUserId, postId, promoterAddress, vendorName } = rewardFormData;
    e.preventDefault();

    console.log(rewardFormData)
    
    console.log('transferring');
    transferReward();
  }

  useEffect(() => {
    html5QrCode = new Html5Qrcode("reader");

    return () => {
      props.stop();
    };
  }, []);

  const handleClickAdvanced = () => {
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      props.onResult(decodedText);
    };

    html5QrCode.start(
      { facingMode: "environment" },
      qrConfig,
      qrCodeSuccessCallback
    );
  };

  return (
    <div className="flex items-center flex-col">
      <div id="reader" width="100%" />
      <div className="pt-3 flex flex-col">
      
        <button
          type="button"
          onClick={() => handleClickAdvanced()}
          className="bg-red-500 text-white font-bold p-4 rounded-full w-28 outline-none"
        >
          Scan
        </button>
        <button
          type="button"
          onClick={() => props.stop()}
          className="bg-primary text-black font-bold p-4 rounded-full w-28 outline-1"
        >
          Stop
        </button>
        {currentAccount ? (<div></div>) : (
        <button
            type="button"
            onClick={() => connectWallet()}
            className="bg-blue-500 text-white font-bold p-4 rounded-full w-28 outline-none"
          >
            Connect Wallet
          </button>
        )}
      </div>
      <br/>
      <h1 className="outline-none text-2xl sm:text-xl font-bold border-gray-200 p-2">Campaign Creation</h1>

      <div className="flex flex-1 flex-col gap-2 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            // value={campaignNameForm}
            onChange={(e) => handleChange(e, 'campaignName')}
            placeholder="Campaign name"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <input
            type="number"
            // value={rewardAmountForm}
            onChange={(e) => handleChange(e, 'rewardAmount')}
            placeholder="Reward amount"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <input
            type="number"
            // value={fundingAmountForm}
            onChange={(e) => handleChange(e, 'fundingAmount')}
            placeholder="Budget"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
      </div>
      <div className="flex justify-end items-end mt-5">
        <button
          type="button"
          onClick={(e) => handleSubmit(e)}
          className="bg-purple-500 text-white font-bold p-2 rounded-full w-28 outline-none"
        >
          Create
        </button>
      </div>
      <br/>
      <h1 className="outline-none text-2xl sm:text-xl font-bold border-gray-200 p-1">Transfer Reward</h1>
      <div className="flex flex-1 flex-col gap-2 lg:pl-5 mt-5 w-full">
          <input
            type="text"
            onChange={(e) => handleRewardChange(e, 'promoterUsername')}
            placeholder="Promoter username"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <input
            type="text"
            onChange={(e) => handleRewardChange(e, 'promoterAddress')}
            placeholder="Promoter address"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
      </div>
      <div className="flex justify-end items-end mt-5">
        <button
          type="button"
          onClick={(e) => handleTransfer(e)}
          className="bg-green-500 text-white font-bold p-2 rounded-full w-28 outline-none"
        >
          Transfer
        </button>
      </div>
    </div>
    
  );
};

export default function VendorScanner() {
  const [alertMessage, setAlertMessage] = useState({
    message: "",
    error: false,
    show: false,
  });

  useEffect(() => {
    if (alertMessage.show) {
      new Promise((r) => {
        setTimeout(r, 6000);
      }).then(() =>
        setAlertMessage({ message: "", error: false, show: false })
      );
    }
  }, [alertMessage.show]);

  const handleStop = () => {
    try {
      html5QrCode
        .stop()
        .then((res) => {
          html5QrCode.clear();
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const handleScanQR = (data) => {
    return new Promise((resolve, reject) => {
      handleStop();
      const url = new URL(data);
      if (url.hostname !== "jioleh.kuehbies.com") {
        reject(new Error("Invalid QR code"));
      } else {
        const viewer = url.searchParams.get("viewer");
        const poster = url.searchParams.get("poster");
        if (viewer == poster)
          reject(new Error("Cannot scan user's own QR code"));
        const query =
          '*[_type == "qr_scanned" && viewer == $viewer && vendor == $vendor]';
        const vendor = JSON.parse(localStorage.getItem("vendor"));
        const params = { viewer: viewer, vendor: vendor._id };

        client.fetch(query, params).then((qrScanned) => {
          if (qrScanned.length > 0) {
            reject(new Error("Already redeemed for this vendor"));
          } else {
            const doc = {
              _type: "qr_scanned",
              viewer: viewer,
              poster: poster,
              vendor: vendor._id,
            };

            client
              .create(doc)
              .then((res) => {
                client
                  .patch(viewer)
                  .setIfMissing({ visitedPlacesId: [] })
                  .append("visitedPlacesId", [vendor._id])
                  .commit()
                  .then((res) => {
                    resolve("Successfully redeemed!");
                  })
                  .catch((err) => {
                    reject(err);
                  });
              })
              .catch((err) => {
                reject(err);
              });
          }
        });
      }
    });
  };

  function handleOnResult(res) {
    handleScanQR(res)
      .then((r) => {
        setAlertMessage({ message: r, error: false, show: true });
      })
      .catch((err) => {
        setAlertMessage({ message: err.message, error: true, show: true });
      });
  }

  return (
    <div className="relative pb-5 h-screen flex flex-col justify-center items-center">
      <div class="p-5 max-w-sm rounded overflow-hidden shadow-lg">
        <Scanner
          onResult={(res) => {
            handleOnResult(res);
          }}
          stop={handleStop}
        />
      </div>
      {alertMessage.show ? (
        alertMessage.error ? (
          <div
            className="flex mt-3 p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800"
            role="alert"
          >
            <svg
              className="inline flex-shrink-0 mr-3 w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <span className="font-medium">{alertMessage.message}</span>
          </div>
        ) : (
          <div
            className="flex mt-3 p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800"
            role="alert"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="font-medium">{alertMessage.message}</span>
          </div>
        )
      ) : (
        <div></div>
      )}
    </div>
  );
}
