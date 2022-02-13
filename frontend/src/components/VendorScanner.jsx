import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { client } from "../client";

const qrConfig = { fps: 10, qrbox: { width: 300, height: 300 } };

let html5QrCode;

const SAMPLE_VENDOR = "12345678910";

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
    <div className="flex h-full items-center flex-col">
      <div id="reader" width="100%" />
      <button
        type="button"
        onClick={() => handleClickAdvanced()}
        className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
      >
        Scan
      </button>
      <button onClick={() => props.stop()}>Stop</button>
    </div>
  );
};

export default function VendorScanner() {
  const [errorMessage, setErrorMessage] = useState({
    message: "",
    show: false,
  });

  useEffect(() => {
    if (errorMessage.show) {
      new Promise((r) => {
        setTimeout(r, 15000);
      }).then(() => setErrorMessage({ message: "", show: false }));
    }
  }, [errorMessage.show]);

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
        const query =
          '*[_type == "qr_scanned" && viewer == $viewer && vendor == $vendor]';
        const params = { viewer: viewer, vendor: SAMPLE_VENDOR };

        client.fetch(query, params).then((qrScanned) => {
          if (qrScanned.length > 0) {
            reject(new Error("Already redeemed for this vendor"));
          } else {
            const doc = {
              _type: "qr_scanned",
              viewer: viewer,
              poster: poster,
              vendor: SAMPLE_VENDOR,
            };

            client
              .create(doc)
              .then((res) => {
                client
                  .patch(viewer)
                  .setIfMissing({ visitedPlacesId: [] })
                  .append("visitedPlacesId", [SAMPLE_VENDOR])
                  .commit()
                  .then((res) => {
                    resolve(JSON.stringify(res));
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
        setErrorMessage({ message: r, show: true });
      })
      .catch((err) => {
        setErrorMessage({ message: err.message, show: true });
      });
  }

  return (
    <div className="relative pb-2 h-full justify-center items-center">
      <Scanner
        onResult={(res) => {
          handleOnResult(res);
        }}
        stop={handleStop}
      />
      {errorMessage.show ? <p>{errorMessage.message}</p> : <div></div>}
    </div>
  );
}
