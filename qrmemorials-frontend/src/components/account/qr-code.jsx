import { useRef, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { WEB_BASE_URL } from "../../config";
import QRCode from 'qrcode';

function QRCodeTab({ packageId }) {
  const canvasRef = useRef(null);
  const [isQRCodeReady, setIsQRCodeReady] = useState(false);
  const profileUrl = `${WEB_BASE_URL}/profile/${packageId}`; // fallback for public profiles

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("❌ Canvas not ready");
      return;
    }

    QRCode.toCanvas(canvas, profileUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    })
      .then(() => setIsQRCodeReady(true))
      .catch((err) => {
        console.error("QR code generation failed:", err);
        setIsQRCodeReady(false);
      });
  }, [profileUrl]);

  const downloadQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("❌ Canvas not ready");
      return;
    }

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = "qr-code.png";
    link.click();
  };
  return (
    <div className="w-full dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px]">
      <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6">
        John Methew
      </h4>

      {/* <div className="flex justify-start items-start">
            <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuIy6HNc3zXzJ9-y-rNEfnaSdhcgeXytmnQg&s"
                    alt="QR Code for John Methew"
                    className="w-52 h-52"
                /> 
                <QRCode value={profileUrl} size={208} />
            </div> */}

      <div className="flex justify-start items-start">
        <canvas ref={canvasRef} width={200} height={200} style={{ display: 'none' }} />
        <img
          src={canvasRef.current?.toDataURL("image/png")}
          alt="QR Code Preview"
          className="w-52 h-52"
          onLoad={() => setIsQRCodeReady(true)}
        />
      </div>
      <p className="mt-5 sm:mt-8 md:mt-12">{profileUrl}</p>
      <div className="mt-5 sm:mt-8 md:mt-12">
        <button
          onClick={downloadQRCode}
          disabled={!isQRCodeReady}
          className={`w-44 h-10 font-semibold text-white ${isQRCodeReady
            ? "bg-[#9E8F69] hover:bg-slate-800 active:bg-slate-800"
            : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          <span>Download QR Code</span>
        </button>
      </div>
      <div className="mt-5 sm:mt-8 ">
        <Link to={profileUrl} className="bg-transparent text-gray-500 py-3 px-8 font-semibold border-2 border-[#9E8F69] active:border-[#d3b978] hover:text-[#9E8F69]" data-text="Preview Profile">
          <span>Preview Profile</span>
        </Link>
      </div>
    </div>

  )
}

export default QRCodeTab