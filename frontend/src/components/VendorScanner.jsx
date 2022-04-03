import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { client } from "../client";
import { userQuery, vendorQuery } from "../utils/data";

const qrConfig = { fps: 10, qrbox: { width: 300, height: 300 } };

let html5QrCode;

const Scanner = (props) => {
  useEffect(() => {
    html5QrCode = new Html5Qrcode("reader");
  }, []);

  useEffect(() => {
    if (props.startQR) {
      handleClickAdvanced();
    } else {
      handleStop();
    }
  }, [props.startQR]);

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
    </div>
  );
};

export default function VendorScanner({ vendor }) {
  const [alertMessage, setAlertMessage] = useState({
    message: "",
    error: false,
    show: false,
  });

  const [startQR, setStartQR] = useState(true);

  useEffect(() => {
    if (alertMessage.show) {
      new Promise((r) => {
        setTimeout(r, 6000);
      }).then(() => {
        setAlertMessage({ message: "", error: false, show: false });
        setStartQR(true);
      });
    }
  }, [alertMessage.show]);

  const handleScanQR = (data) => {
    return new Promise((resolve, reject) => {
      setStartQR(false);
      const url = new URL(data);
      if (url.hostname !== "jioleh.kuehbies.com") {
        reject(new Error("Invalid QR code"));
      } else {
        const viewer = url.searchParams.get("viewer");
        const poster = url.searchParams.get("poster");
        if (viewer === poster)
          reject(new Error("Cannot scan user's own QR code"));
        const query =
          '*[_type == "qr_scanned" && viewer == $viewer && vendor == $vendor]';
        //const vendor = JSON.parse(localStorage.getItem("vendor"));
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
            const query = userQuery(poster);
            client.create(doc).then((res) => {
              client
                .patch(viewer)
                .setIfMissing({ visitedPlacesId: [] })
                .append("visitedPlacesId", [vendor._id])
                .commit()
                .then((res) => {
                  // Retrieving promoter wallet address
                  client.fetch(query).then((data) => {
                    // console.log("Promoter address:", data[0].walletAddress);
                    // Updating vendor 'pendingPayment' and 'pendingAddress' attributes
                    // console.log("Adding new address to backend");
                    client
                      .patch(vendor._id)
                      .set({
                        pendingPayment: true,
                      })
                      .setIfMissing({ pendingAddresses: [] })
                      .append("pendingAddresses", [data[0].walletAddress])
                      .commit()
                      .then((res) => {
                        // console.log("Updating client campaign");
                        client.fetch(vendorQuery(vendor._id)).then((data) => {
                          window.localStorage.setItem(
                            "campaign",
                            JSON.stringify(data[0])
                          );
                          window.localStorage.setItem(
                            "vendor",
                            JSON.stringify(data[0])
                          );
                          resolve("Successful");
                        });
                      });
                  });
                })
                .catch((err) => {
                  reject(err);
                });
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
    <div className="relative h-screen flex flex-col justify-center pb-5 items-center">
      <span className="flex py-5">
        <h1 className="text-lg font-bold mr-2">Scan a user's QR code</h1>
      </span>
      <Scanner
        onResult={(res) => {
          handleOnResult(res);
        }}
        startQR={startQR}
      />
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
      <div className="max-w-md p-5 flex text-gray-500 text-sm">
        <svg
          className="align-self-start mr-3 w-20 h-20"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p>
          When a user shows you a QR code posted by another user, scan the QR
          code so that the referrer will receive their monetary rewards. This
          referee will also be able to tag your eatery in their future posts!
        </p>
      </div>
    </div>
  );
}
