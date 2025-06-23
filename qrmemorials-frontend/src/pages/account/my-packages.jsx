import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import bg from '../../assets/img/shortcode/breadcumb.jpg'
import NavbarOne from '../../components/navbar/navbar-one'
import AccountTab from '../../components/account/account-tab'
import FooterOne from '../../components/footer/footer-one'
import ScrollToTop from '../../components/scroll-to-top'
import Biography from '../../components/account/Biography';
import PhotoGallery from '../../components/account/photo-gallery';
import Videos from '../../components/account/videos';
import Eulogy from '../../components/account/eulogy';
import FamilyTree from '../../components/account/family-tree';
import Tributes from '../../components/account/tributes';
import UserRequests from '../../components/account/user-requests';
import QRCode from '../../components/account/qr-code';
import Aos from 'aos';


const MyPackages = () => {
    const [packages, setPackages] = useState([]);
    const [activeTab, setActiveTab] = useState("Biography")
    const location = useLocation();
    const current = location.pathname;
    useEffect(() => {
        Aos.init()
    })
    const handleTabClick = (tab) => {
        setActiveTab(tab)
    }
    return (
        <>
            <NavbarOne />

            <div className="flex items-center gap-4 flex-wrap bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70" style={{ backgroundImage: `url(${bg})` }}>
                <div className="text-center w-full">
                    <h2 className="text-white text-8 md:text-[40px] font-normal leading-none text-center">Package 1</h2>
                    <ul className="flex items-center justify-center gap-[10px] text-base md:text-lg leading-none font-normal text-white mt-3 md:mt-4">
                        <li><Link to="/">Home</Link></li>
                        <li>/</li>
                        <li className="text-primary">Package 1</li>
                    </ul>
                </div>
            </div>
            <div className="s-py-100">
                <div className="container-fluid">
                    <div className="max-w-[1720px] mx-auto flex items-start gap-8 md:gap-12 2xl:gap-24 flex-col md:flex-row my-profile-navtab">
                        <div className="w-full md:w-[200px] lg:w-[300px] flex-none" data-aos="fade-up" data-aos-delay="100">
                            <AccountTab />
                        </div>
                        <div>
                            <div className="flex items-start justify-between gap-8 max-w-[1720px] mx-auto flex-col lg:flex-row border-b border-bdr-clr dark:border-bdr-clr-drk pb-8 md:pb-[50px]" data-aos="fade-up" data-aos-delay="100">
                                <div>
                                    <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6">Package 1</h4>
                                    <div className="flex flex-wrap gap-[10px] md:gap-[15px]">

                                        {["Biography", "Photo Gallery", "Videos", "Eulogy", "Family Tree", "Tributes", "User Requests", "QR Code"].map(tab => (
                                            <button
                                                key={tab}
                                                className={`btn btn-theme-outline btn-sm shop1-button ${activeTab === tab ? "active" : ""}`} data-text={tab}
                                                onClick={() => handleTabClick(tab)}
                                            >
                                                <span>{tab}</span>
                                            </button>
                                        ))}
                                        {/* <Link className="btn btn-theme-outline btn-sm shop1-button" to="/product-category" data-text="Biography"><span>Biography</span></Link>
                                        <Link className="btn btn-theme-outline btn-sm shop1-button" to="product-category" data-text="Photo Gallery"><span>Photo Gallery</span></Link>
                                        <Link className="btn btn-theme-outline btn-sm shop1-button" to="product-category" data-text="Videos"><span>Videos</span></Link>
                                        <Link className="btn btn-theme-outline btn-sm shop1-button" to="product-category" data-text="Eulogy"><span>Eulogy</span></Link>
                                        <Link className="btn btn-theme-outline btn-sm shop1-button" to="product-category" data-text="Family Tree"><span>Family Tree</span></Link>
                                        <Link className="btn btn-theme-outline btn-sm shop1-button" to="/product-category" data-text="Tributes"><span>Tributes</span></Link>
                                        <Link className="btn btn-theme-outline btn-sm shop1-button" to="product-category" data-text="User Requests"><span>User Requests</span></Link>
                                        <Link className="btn btn-theme-outline btn-sm shop1-button" to="product-category" data-text="QR Code"><span>QR Code</span></Link> */}
                                    </div>
                                </div>

                            </div>
                            <div>
                                {activeTab==="Biography" &&  <Biography />}
                                {activeTab==="Photo Gallery" &&  <PhotoGallery />}
                                {activeTab==="Videos" &&  <Videos />}
                                {activeTab==="Eulogy" &&  <Eulogy />}
                                {activeTab==="Family Tree" &&  <FamilyTree/>}
                                {activeTab==="Tributes" &&  <Tributes/>}
                                {activeTab==="User Requests" &&  <UserRequests/>}
                                {activeTab==="QR Code" &&  <QRCode/>}
                            </div>
                           
                        </div>

                    </div>
                </div>

            </div>
            <FooterOne />

            <ScrollToTop />
        </>
    );
};

export default MyPackages;
