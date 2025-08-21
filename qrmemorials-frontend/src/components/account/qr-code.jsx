import QRCode from 'react-qr-code';
import { Link } from 'react-router-dom';
import { WEB_BASE_URL } from "../../config";

function QRCodeTab({ packageId  }) {
   const profileUrl = `${WEB_BASE_URL}/profile/${packageId}`; // fallback for public profiles
  

            // Download the QR code as an image
    const downloadQRCode = () => {
        const svg = document.getElementById('qr-code');
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = 'qr-code.png';
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    };

    return (
        <div className="w-full dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px]">
            <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6">
                John Methew
            </h4>

            <div className="flex justify-start items-start">
                {/* <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuIy6HNc3zXzJ9-y-rNEfnaSdhcgeXytmnQg&s"
                    alt="QR Code for John Methew"
                    className="w-52 h-52"
                /> */}
                <QRCode value={profileUrl} size={208} />
            </div>
            <p className="mt-5 sm:mt-8 md:mt-12">{profileUrl}</p>
            <div className="mt-5 sm:mt-8 md:mt-12">
                <button onClick={downloadQRCode} className="bg-[#9E8F69] text-white w-44 h-10 font-semibold hover:bg-slate-800 active:bg-slate-800" data-text="Submit">
                    <span>Download QR Code</span>
                </button>
            </div>
            <div className="mt-5 sm:mt-8 ">
                <Link     to={profileUrl} className="bg-transparent text-gray-500 py-3 px-8 font-semibold border-2 border-[#9E8F69] active:border-[#d3b978] hover:text-[#9E8F69]" data-text="Preview Profile">
                    <span>Preview Profile</span>
                </Link>
            </div>
        </div>

    )
}

export default QRCodeTab