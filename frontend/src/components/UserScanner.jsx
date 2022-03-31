import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { client } from "../client";
import { fetchUser } from "../utils/fetchUser";

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

export default function UserScanner({ user }) {
  const [startQR, setStartQR] = useState(true);
  const [alertMessage, setAlertMessage] = useState({
    message: "",
    error: false,
    show: false,
  });

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
        const vendor = url.searchParams.get("vendor");
        console.log(vendor);
        client
          .getDocument(user?._id)
          .then((userDoc) => {
            console.log(userDoc.visitedPlacesId);
            if (userDoc.visitedPlacesId !== undefined && userDoc.visitedPlacesId.includes(vendor)) {
              reject(new Error("Already visited this vendor"));
            } else {
              client
                .patch(userDoc._id)
                .setIfMissing({ visitedPlacesId: [] })
                .append("visitedPlacesId", [vendor])
                .commit()
                .then((res) => {
                  resolve("Successfully added!");
                })
                .catch((err) => {
                  reject(err);
                });
            }
          })
          .catch((err) => reject(err));
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
      <div className="flex flex-col items-center p-5 text-center">
        <h1 className="text-lg font-bold mb-2">Scan a vendor's QR code</h1>
      </div>
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
              className="inline flex-shrink-0 mr-3 w-5 h-5"
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
          If you have visited an eatery registered under Jio Leh! for the first
          time, you can ask them for their QR code. After being registered with
          them, you can post Foodsteps and tag this eatery for rewards!
        </p>
      </div>
    </div>
  );
}
