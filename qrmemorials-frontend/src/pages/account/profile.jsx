import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import NavbarOne from "../../components/navbar/navbar-one";
import bg from '../../assets/img/bg/soul-default-background-new.png'
import AccountTab from "../../components/account/account-tab";
import FooterOne from "../../components/footer/footer-one";
import ScrollToTop from "../../components/scroll-to-top";
import About from '../../components/profile/about';
import Photos from '../../components/profile/photos';
import Video from '../../components/profile/video';
import Tribute from '../../components/profile/tribute';
import Eulogy from '../../components/profile/eulogy';
import Family from '../../components/profile/family';
import GraveLocation from '../../components/profile/graveLocation'
import TributeModal from "../../components/profile/TributeModal ";
import { API_BASE_URL } from '../../config';
import { getUserData } from '../../utility/auth'
import axios from 'axios';
import { toast } from 'react-toastify';
import Aos from "aos";
export default function Profile() {
    const { id: packageId } = useParams();
    const [activeTab, setActiveTab] = useState('page1');
    const [biography, setBiography] = useState(null); // Biography data
    const [photos, setPhotos] = useState(null); // Photos data
    const [tributes, setTributes] = useState(null); // tributes data
    const [eulogy, setEulogy] = useState(null); // eulogy data
    const [family, setFamily] = useState(null); // family data
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isPrivate, setIsPrivate] = useState(false);
    const [accessStatus, setAccessStatus] = useState(null); // 'approved', 'pending', null
    const [emailUser, setEmailUser] = useState('');
    const [name, setName] = useState('');
    const [formData, setFormData] = useState({
        package_id: "",
        full_name: "",
        email: "",
        relation: "",
        memory_text: "",
        tribute_text: "",
    });
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const userToken = getUserData();
    const token = userToken.token;
    const user = getUserData(); // from localStorage
    const userEmail = user?.email?.trim().toLowerCase();

    const accessId = new URLSearchParams(window.location.search).get("access_id");

    useEffect(() => {
        Aos.init()
    })
    // Set package_id from route param
    useEffect(() => {
        if (packageId) {
            setFormData((prev) => ({ ...prev, package_id: packageId }));
        }
    }, [packageId]);
    useEffect(() => {
        const fetchBiography = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/v1/packages/biography/${packageId}`
                    , {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch biography");
                const data = await res.json();
                const bio = data.biography;
                setBiography(bio);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        const fetchPhotos = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/v1/packages/gallery/${packageId}`
                    , {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch gallery");
                const data = await res.json();
                const gallery = data.gallery
                setPhotos(gallery);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        const fetchTributes = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/v1/packages/all-tributes/${packageId}`
                    , {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch all-tributes");
                const data = await res.json();
                const tributes = data.tributes
                setTributes(tributes);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        const fetchEulogy = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/v1/packages/eulogy/${packageId}`
                    , {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch eulogy");
                const data = await res.json();
                const eulogy = data.eulogy
                setEulogy(eulogy);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchFamily = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/v1/packages/family/${packageId}`
                    , {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                if (!res.ok) throw new Error("Failed to fetch family");
                const data = await res.json();
                const family = data.members
                setFamily(family);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        const fetchVideos = async () => {
            try {
                const res = await axios.get(`${API_BASE_URL}/api/v1/packages/${packageId}/videos`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                });

                if (res.data.success) {
                    setVideos(res.data.videos);
                } else {
                    setError('Failed to load videos.');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching videos.');
            } finally {
                setLoading(false);
            }
        };
        fetchBiography(); fetchPhotos(); fetchTributes(); fetchEulogy(); fetchFamily(); fetchVideos();
    }, [packageId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/api/v1/biography/${packageId}`, {
                    params: {
                        email: userEmail,
                        access_id: accessId,
                    },
                });

                if (response.data.biography) {
                    setBiography(response.data.biography);
                    setIsPrivate(false);
                } else {
                    setBiography(null);
                    setIsPrivate(true);
                    setAccessStatus(response.data.status); // null | pending | approved
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, [packageId, userEmail, accessId]);

    const tabs = [
        { id: "page1", label: "About" },
        { id: "page2", label: "Photos" },
        { id: "page3", label: "Video" },
        { id: "page4", label: "Tributes" },
        { id: "page5", label: "Eulogy" },
        { id: "page6", label: "Family" },
        { id: "page7", label: "Grave location" },
    ];

    function renderContent() {
        switch (activeTab) {
            case 'page1': return <About biography={biography} />;
            case 'page2': return <Photos photos={photos} />;
            case 'page3': return <Video videos={videos} />;
            case 'page4': return <Tribute tributes={tributes} />;
            case 'page5': return <Eulogy eulogy={eulogy} />;
            case 'page6': return <Family family={family} />;
            case 'page7': return <GraveLocation biography={biography} />;
            default: return null;
        }
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setProfilePhoto(e.target.files[0]);
    };
    const onClose = () => setModalOpen(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.package_id) {
            toast.error("Package ID is missing.");
            setLoading(false); // ✅ stop loading
            return;
        }
        try {
            const data = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                data.append(key, value);
            });
            if (profilePhoto) {
                data.append("profile_photo", profilePhoto);
            }

            const response = await axios.post(`${API_BASE_URL}/api/v1/packages/tributes`, data, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true, // if cookies/token auth
            });

            setFormData({
                ...formData,
                tribute_text: "",  // Clear the tribute_text field after success
            });
            console.log(response.data);
            toast.success("Tribute submitted successfully!");
            console.log("Closing modal now...");
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Submission failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleAccessRequest = async () => {
        if (!email || !name) return;

        try {
            axios.post(`${API_BASE_URL}/api/v1/${packageId}/access-request`, { email, name, })
            setAccessStatus('pending');
        } catch (err) {
            console.error('Request failed', err);
        }
    };

    const formatDateRange = (birthDateStr, deathDateStr) => {
        const options = { year: 'numeric', month: 'short', day: '2-digit' };

        const birthDate = new Date(birthDateStr).toLocaleDateString('en-US', options);
        const deathDate = new Date(deathDateStr).toLocaleDateString('en-US', options);

        return `${birthDate} – ${deathDate}`;
    };

    console.log('isPrivate:', isPrivate);
    console.log('accessStatus:', accessStatus);
    console.log('biography:', biography);
    return (

        <>
            {/* Access Modal (if private and not approved) */}
            {isPrivate && accessStatus !== 'approved' && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black bg-opacity-70">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto text-center shadow-xl">
                        <h2 className="text-xl font-semibold mb-4">This memorial is private</h2>

                        {accessStatus === 'pending' ? (
                            <p className="text-gray-600">Your access request is pending approval.</p>
                        ) : (
                            <>
                                <p className="mb-3 text-gray-600">Please enter your email to request access.</p>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-primary"

                                />
                                <input
                                    type="email"
                                    value={emailUser}
                                    onChange={(e) => setEmailUser(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring focus:ring-primary"
                                />
                                <button
                                    onClick={handleAccessRequest}
                                    className="bg-[#9E8F69] text-white px-6 py-2 rounded hover:bg-[#7c6a4f] transition"
                                >
                                    Request Access
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Blurred Background (only if private) */}
            <div className={`${isPrivate && accessStatus !== 'approved' ? 'blur-md pointer-events-none select-none' : ''}`}>
                {/* Your full page UI goes here */}
                <NavbarOne />

                {/* Background Section */}
                <div
                    className="relative bg-overlay bg-cover bg-center h-40 sm:h-52 lg:h-60"
                    style={{
                        backgroundImage: `url(${biography?.background_photo || bg})`
                    }}>
                    {/* Profile Image Overlapping */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 top-full -translate-y-1/2">
                        <img
                            className="w-44 h-44 lg:w-[300px] lg:h-[300px] rounded-full object-cover object-center shadow-lg"
                            // src="https://qrmemorials.com.au/wp-content/themes/bosa-ecommerce/assets/images/memorial-demo-profile-pic.png"
                            src={biography && biography.profile_photo ? biography.profile_photo : "https://qrmemorials.com.au/wp-content/themes/bosa-ecommerce/assets/images/memorial-demo-profile-pic.png"}
                            alt="Profile"
                        />
                    </div>
                </div>

                {/* Profile Text Section */}
                <div className="pt-28 lg:pt-44 text-center space-y-3 sm:space-y-4">
                    {/* Heading */}
                    <p className="text-sm sm:text-base lg:text-xl tracking-tight text-black uppercase">
                        In Loving Memory of
                    </p>

                    <h2 className="text-xl sm:text-3xl lg:text-4xl font-semibold text-gray-800 capitalize">
                        {/* Jhon Ferry */}
                        {biography && biography.full_name ? ` ${biography.full_name}` : ""}
                    </h2>

                    <p className="text-xs sm:text-sm lg:text-lg font-light text-black mt-1 uppercase">
                        {/* Oct 13, 1977 – Oct 02, 2024 */}
                        {formatDateRange(biography?.birth_date, biography?.death_date)}

                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-5 sm:mt-6 justify-center items-center">
                        <button onClick={() => setModalOpen(true)} className="bg-transparent border text-sm sm:text-base lg:text-lg font-medium text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border-black active:border-[#d3b978] hover:bg-[#bb976d] transition">
                            Leave a Tribute
                        </button>

                        <button className="bg-transparent border text-sm sm:text-base lg:text-lg font-medium text-black px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border-black active:border-[#d3b978] hover:bg-[#bb976d] transition flex items-center gap-2">
                            Share
                            <img
                                src="https://qrmemorials.com.au/wp-content/themes/bosa-ecommerce/assets/images/share_icon.png"
                                alt="Share"
                                className="w-5 h-5 sm:w-6 sm:h-6"
                            />
                        </button>
                    </div>
                </div>
                <TributeModal
                    isOpen={isModalOpen}
                    onClose={onClose}
                    handleChange={handleChange}
                    handleFileChange={handleFileChange}
                    handleSubmit={handleSubmit}
                    formData={formData}
                    setFormData={setFormData}
                    loading={loading}
                />
                <div className="w-4/5 mx-auto">
                    {/* Tabs */}
                    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 text-center text-gray-500 border-b border-gray-200 mt-10">
                        {tabs.map((tab) => (
                            <li key={tab.id}>
                                <button
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex justify-center items-center text-sm sm:text-base border-t-4 py-3 sm:py-4 transition w-full
                ${activeTab === tab.id
                                            ? 'text-black border-black bg-white'
                                            : 'border-transparent hover:text-black hover:border-black bg-gray-100'}`}
                                >
                                    {tab.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                    {/* Content */}
                    <div className="my-6 lg:my-20" data-aos="fade-up">
                        {renderContent()}
                    </div>
                </div>

                <FooterOne />
                <ScrollToTop />
            </div>

        </>



    );
}
