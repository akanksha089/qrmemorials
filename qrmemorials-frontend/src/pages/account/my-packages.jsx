import React, { useEffect, useState } from 'react';
import { Link, useParams, } from 'react-router-dom';
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
import QRCodeTab from '../../components/account/qr-code';
import Aos from 'aos';
import {API_BASE_URL} from '../../config'; // adjust path if needed
import { getUserData } from '../../utility/auth'
import axios from 'axios';
import { toast } from 'react-toastify';

const MyPackages = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState("Biography")
    const [formData, setFormData] = useState({
        package_id: '',
        full_name: '',
        cemetery_name: '',
        birth_date: '',
        death_date: '',
        cemetery_location: '',
        photo_position: 'center',
        biography_text: '',
        grave_location: '',
        link_text_1: '',
        link_url_1: '',
        link_text_2: '',
        link_url_2: '',
        link_text_3: '',
        link_url_3: '',
        link_text_4: '',
        link_url_4: '',
        profile_photo: '',
        background_photo: '',
        biography_photo: '',
        account_type: 'public'
    });
    const [eulogyData, setEulogyData] = useState({
        package_id: '',
        eulogy_text: '',
    })
    const [files, setFiles] = useState({
        profile_photo: null,
        background_photo: null,
        biography_photo: null
    });
    const [biographyExists, setBiographyExists] = useState(false);
    const [biographyId, setBiographyId] = useState(null);
    const [eulogyExists, setEulogyExists] = useState(false);
    const [eulogyId, setEulogyId] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [message, setMessage] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { id: packageId } = useParams();

    const userToken = getUserData();
    const token = userToken.token;
    useEffect(() => {
        Aos.init()
    })
    // Set package_id when component mounts
    useEffect(() => {
        if (id) {
            setEulogyData(prev => ({
                ...prev,
                package_id: id
            }));
        }
    }, [id]);
    useEffect(() => {
        if (id) {
            setFormData(prev => ({
                ...prev,
                package_id: id
            }));
        }
    }, [id]);
    useEffect(() => {
        if (activeTab !== "Biography" || !formData.package_id) return;

        const fetchBiography = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/v1/packages/biography/${formData.package_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.data.success && res.data.biography) {
                    const bio = res.data.biography;
                    setFormData({
                        package_id: bio.package_id || "",
                        full_name: bio.full_name || "",
                        cemetery_name: bio.cemetery_name || "",
                        birth_date: bio.birth_date ? bio.birth_date.split("T")[0] : "",
                        death_date: bio.death_date ? bio.death_date.split("T")[0] : "",
                        cemetery_location: bio.cemetery_location || "",
                        photo_position: bio.photo_position || "center",
                        biography_text: bio.biography_text || "",
                        grave_location: bio.grave_location || "",
                        link_text_1: bio.link_text_1 || "",
                        link_url_1: bio.link_url_1 || "",
                        link_text_2: bio.link_text_2 || "",
                        link_url_2: bio.link_url_2 || "",
                        link_text_3: bio.link_text_3 || "",
                        link_url_3: bio.link_url_3 || "",
                        link_text_4: bio.link_text_4 || "",
                        link_url_4: bio.link_url_4 || "",
                        account_type: bio.account_type || "public",
                        // 👇 ADD THESE THREE
                        profile_photo: bio.profile_photo || "",
                        background_photo: bio.background_photo || "",
                        biography_photo: bio.biography_photo || "",
                    });
                    setFiles({
                        profile_photo: bio.profile_photo || null,
                        background_photo: bio.background_photo || null,
                        biography_photo: bio.biography_photo || null
                    });
                    setBiographyExists(true);
                    setBiographyId(bio.id); // Adjust if your DB key is named differently
                } else {
                    setBiographyExists(false);
                    setBiographyId(null);
                }
            } catch (error) {
                console.error("Failed to fetch biography", error);
                setBiographyExists(false);
                setBiographyId(null);
            }
        };

        fetchBiography();
    }, [activeTab, formData.package_id, token]);

    useEffect(() => {
        if (activeTab !== "Eulogy" || !eulogyData.package_id) return;

        const fetchEulogy = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/v1/packages/eulogy/${eulogyData.package_id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (res.data.success && res.data.eulogy) {
                    const eu = res.data.eulogy;
                    setEulogyData({
                        package_id: eu.package_id || "",
                        eulogy_text: eu.eulogy_text || "",
                    });
                    setEulogyExists(true);
                    setEulogyId(eu.id); // Adjust if your DB key is named differently
                } else {
                    setEulogyExists(false);
                    setEulogyId(null);
                }
            } catch (error) {
                console.error("Failed to fetch biography", error);
                setEulogyExists(false);
                setEulogyId(null);
            }
        };

        fetchEulogy();
    }, [activeTab, eulogyData.package_id, token]);

    const handleTabClick = (tab) => {
        setActiveTab(tab)
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleChangeEulogy = (e) => {
        const { name, value } = e.target;
        setEulogyData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFiles(prev => ({ ...prev, [name]: files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.package_id) {
            toast.error("Package ID is missing.");
            return;
        }

        try {
            const submitData = new FormData();

            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value);
            });

            Object.entries(files).forEach(([key, file]) => {
                if (file) submitData.append(key, file);
            });

            let url = `${API_BASE_URL}/api/v1/packages/biography`;
            let method = "post";

            if (biographyExists && biographyId) {
                url = `${API_BASE_URL}/api/v1/packages/biography/update/${biographyId}`;
                // If your backend prefers PUT or PATCH for update, change method accordingly
                method = "post";
            }

            const res = await axios({
                method,
                url,
                data: submitData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                }
            });

            if (res.data.success) {
                toast.success(biographyExists ? "Biography updated successfully!" : "Biography created successfully!");
            } else {
                toast.error(res.data.error || "Operation failed.");
            }

            console.log(res.data);
        } catch (err) {
            console.error(err);
            toast.error(biographyExists ? "Failed to update biography." : "Failed to create biography.");
        }
    };

    const handleEulogySubmit = async (e) => {
        e.preventDefault();

        if (!eulogyData.package_id) {
            toast.error("Package ID is missing.");
            return;
        }

        try {
            const submitData = new FormData();

            Object.entries(eulogyData).forEach(([key, value]) => {
                submitData.append(key, value);
            });

            let url = `${API_BASE_URL}/api/v1/packages/eulogy`;
            let method = "post";

            if (eulogyExists && eulogyId) {
                url = `${API_BASE_URL}/api/v1/packages/eulogy/update/${eulogyId}`;
                // If your backend prefers PUT or PATCH for update, change method accordingly
                method = "post";
            }

            const res = await axios({
                method,
                url,
                data: submitData,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                }
            });

            if (res.data.success) {
                toast.success(eulogyExists ? "Eulogy updated successfully!" : "Eulogy created successfully!");
            } else {
                toast.error(res.data.error || "Operation failed.");
            }

            console.log(res.data);
        } catch (err) {
            console.error(err);
            toast.error(eulogyExists ? "Failed to update Eulogy." : "Failed to Ereate eulogy.");
        }
    };

    // Handle file selection and preview
    const handleFileChangeGallery = (e) => {
        const files = Array.from(e.target.files);

        if (files.length > 10) {
            setMessage('You can only upload up to 10 images at a time.');
            return;
        }

        setSelectedFiles(files);

        const previews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(previews);
        setMessage('');
    };

    // Upload selected images to server
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setMessage('Please select images to upload.');
            return;
        }

        const formData = new FormData();
        selectedFiles.forEach(file => formData.append('images', file));

        try {
            const res = await axios.post(`${API_BASE_URL}/api/v1/packages/${packageId}/gallery`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}`, },
            });

            setUploadedImages([...uploadedImages, ...res.data.images]);
            setMessage(res.data.message || 'Upload Images successful!');
            toast.success('Images uploaded successfully!');

            setSelectedFiles([]);
            setPreviewUrls([]);
        } catch (err) {
            console.error(err);
            toast.error('Upload failed. Please try again.');
            setMessage('Upload failed. Please try again.');
        }
    };

    const handleFileChangeVedio = (file) => {
        setVideoFile(file);
    };

    const handleUploadVedio = async () => {
        if (!videoFile) {
            toast.error('No video selected.');
            return;
        }

        const formData = new FormData();
        formData.append('video', videoFile); // 'video' must match multer field name
        formData.append('package_id', packageId);
        formData.append('name', videoFile.name);
        formData.append('description', 'Video gallery item');

        try {
            setUploading(true);

            const res = await axios.post(`${API_BASE_URL}/api/v1/videos/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`, // if needed
                },
            });

            toast.success(res.data.message || 'Video uploaded successfully');
            setVideoFile(null);
        } catch (err) {
            console.error(err);
            toast.error('Upload failed. Check console.');
        } finally {
            setUploading(false);
        }
    };



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
                                    </div>
                                </div>

                            </div>
                            <div>
                                {activeTab === "Biography" && <Biography handleChange={handleChange}
                                    handleFileChange={handleFileChange} handleSubmit={handleSubmit} formData={formData}
                                    biographyExists={biographyExists} files={files} />}
                                {activeTab === "Photo Gallery" && <PhotoGallery
                                    handleFileChangeGallery={handleFileChangeGallery}
                                    handleUpload={handleUpload}
                                />}
                                {activeTab === "Videos" && <Videos handleFileChangeVedio={handleFileChangeVedio}
                                    handleUploadVedio={handleUploadVedio}
                                />}
                                {activeTab === "Eulogy" && <Eulogy
                                    handleChangeEulogy={handleChangeEulogy}
                                    handleEulogySubmit={handleEulogySubmit}
                                    eulogyData={eulogyData}
                                />}
                                {activeTab === "Family Tree" && <FamilyTree
                                    packageId={packageId}
                                    token={token}
                                    activeTab={activeTab}
                                    API_BASE_URL={API_BASE_URL}
                                />}
                                {activeTab === "Tributes" && <Tributes />}
                                {activeTab === "User Requests" && <UserRequests />}
                                {activeTab === "QR Code" && <QRCodeTab  
                                 packageId={packageId}
                                 />}
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
