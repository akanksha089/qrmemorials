import React from 'react'

function QRCode() {
    return (
        <div className="w-full dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px]">
            <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6">
                John Methew
            </h4>

            <div className="flex justify-start items-start">
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuIy6HNc3zXzJ9-y-rNEfnaSdhcgeXytmnQg&s"
                    alt="QR Code for John Methew"
                    className="w-52 h-52"
                />
            </div>
            <div className="mt-5 sm:mt-8 md:mt-12">
                <button className="bg-[#9E8F69] text-white w-44 h-10 font-semibold hover:bg-slate-800 active:bg-slate-800" data-text="Submit">
                    <span>Download QR Code</span>
                </button>
            </div>
            <div className="mt-5 sm:mt-8 ">
                <button className="bg-transparent text-gray-500 w-44 h-10 font-semibold border-2 border-[#9E8F69] active:border-[#d3b978]" data-text="Preview Profile">
                    <span>Preview Profile</span>
                </button>
            </div>
        </div>

    )
}

export default QRCode