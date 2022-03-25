import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { client } from "../client";
import { fetchUser } from "../utils/fetchUser";

const qrConfig = { fps: 10, qrbox: { width: 300, height: 300 } };

let html5QrCode;

const Scanner = (props) => {
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
      </div>
    </div>
  );
};

export default function UserScanner() {
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
        const user = fetchUser();
        const vendor = url.searchParams.get("vendor");
        client
          .getDocument(user?.googleId)
          .then((userDoc) => {
            if (userDoc.visitedPlacesId.includes(vendor)) {
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
