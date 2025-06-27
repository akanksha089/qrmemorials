import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import NavbarOne from "../../components/navbar/navbar-one";
import bg from '../../assets/img/bg/soul-default-background-new.png'
import AccountTab from "../../components/account/account-tab";
import FooterOne from "../../components/footer/footer-one";
import ScrollToTop from "../../components/scroll-to-top";

import Aos from "aos";
export default function Profile() {
    const [activeTab, setActiveTab] = useState("Biography")

    useEffect(() => {
        Aos.init()
    })


    const tabs = [
        { id: "page1", label: "Pilot Training" },
        { id: "page2", label: "Titan maintenance", active: true },
        { id: "page3", label: "Loadout" },
        { id: "page4", label: "Server Browser" },
        { id: "page5", label: "Settings" },
    ];


    return (
        <>
            <NavbarOne />

            {/* Background Section */}
            <div
                className="relative bg-overlay bg-cover bg-center h-40 sm:h-52 lg:h-60"
                style={{ backgroundImage: `url(${bg})` }}
            >
                {/* Profile Image Overlapping */}
                <div className="absolute left-1/2 transform -translate-x-1/2 top-full -translate-y-1/2">
                    <img
                        className="w-44 h-44 lg:w-[300px] lg:h-[300px] rounded-full object-cover object-center shadow-lg"
                        src="https://qrmemorials.com.au/wp-content/themes/bosa-ecommerce/assets/images/memorial-demo-profile-pic.png"
                        alt="Profile"
                    />
                </div>
            </div>

            {/* Profile Text Section */}
            <div className="pt-28 lg:pt-44 text-center space-y-4">
                <p className="text-base lg:text-xl tracking-tighter text-black uppercase">
                    In Loving Memory of
                </p>
                <h2 className="text-2xl lg:text-4xl font-semibold text-gray-800 capitalize">
                    Jhon Ferry
                </h2>
                <p className="text-sm lg:text-lg font-light text-black mt-1 uppercase">
                    Oct 13, 1977 – Oct 02, 2024
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6 justify-center">
                    <button className="bg-transparent border text-lg font-medium text-black px-8 py-3 rounded-full border-black active:border-[#d3b978] hover:bg-[#bb976d] transition">
                        Leave a Tribute
                    </button>
                    <button className="bg-transparent border text-lg font-medium text-black px-8 py-3 rounded-full border-black active:border-[#d3b978] hover:bg-[#bb976d] transition flex items-center gap-2">
                        Share
                        <img
                            src="https://qrmemorials.com.au/wp-content/themes/bosa-ecommerce/assets/images/share_icon.png"
                            alt="Share"
                            className="w-6 h-6"
                        />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <ul className="grid grid-flow-col text-center text-gray-500 border-b border-gray-200 mt-10">
                {tabs.map((tab) => (
                    <li key={tab.id}>
                        <a
                            href={`#${tab.id}`}
                            className={`flex justify-center border-t-4 py-4 transition ${tab.active
                                    ? 'text-black border-black'
                                    : 'border-transparent hover:text-black hover:border-black bg-gray-100'
                                }`}
                        >
                            {tab.label}
                        </a>
                    </li>
                ))}
            </ul>

            <FooterOne />
            <ScrollToTop />
        </>


    );
}
