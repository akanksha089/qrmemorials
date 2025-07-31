import ReactQuill from "react-quill";
import { ImCross } from "react-icons/im";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from '../../config';
import { getUserData } from '../../utility/auth'

const editTributeModal = ({ isOpen, onClose, tribute, onUpdate }) => {
    // Inside your component
    const [formData, setFormData] = useState({
        full_name: "",
        email: "",
        relation: "",
        memory_text: "",
        tribute_text: "",
        profile_photo: null,
    });
    const userToken = getUserData();
    const token = userToken.token;

    useEffect(() => {
        if (tribute && isOpen) {
            setFormData({
                full_name: tribute.full_name || "",
                email: tribute.email || "",
                relation: tribute.relation || "",
                memory_text: tribute.memory_text || "",
                tribute_text: tribute.tribute_text || "",
                profile_photo: null,
            });
        }
    }, [tribute, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, profile_photo: e.target.files[0] }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        data.append("package_id", tribute.package_id);
        data.append("full_name", formData.full_name);
        data.append("email", formData.email);
        data.append("relation", formData.relation);
        data.append("memory_text", formData.memory_text);
        data.append("tribute_text", formData.tribute_text);

        if (formData.profile_photo) {
            data.append("profile_photo", formData.profile_photo);
        }
        // Debug log formData
        for (let pair of data.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/v1/packages/tributes/update/${tribute.id}`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`
                    },
                    withCredentials: true, // only if your API needs auth cookies
                }
            );

            if (res.data.success && onUpdate) {
                onUpdate(res.data.updatedTribute); // ✅ pass back updated data
            }
            onClose();
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 overflow-y-auto">
            <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Submit a Tribute</h2>
                    <button onClick={onClose}>
                        <ImCross size={24} className="text-primary" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="full_name"
                        placeholder="Full Name"
                        className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                        onChange={handleChange}
                        value={formData.full_name}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                        onChange={handleChange}
                        value={formData.email}
                    />
                    <select
                        name="relation"
                        className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                        onChange={handleChange}
                        value={formData.relation}
                        required
                    >
                        <option value="" disabled>Select Relation</option>
                        <option value="Parent">Parent</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Husband">Husband</option>
                        <option value="Wife">Wife</option>
                        <option value="Grandfather">Grandfather</option>
                        <option value="Grandmother">Grandmother</option>
                        <option value="Grandson">Grandson</option>
                        <option value="Granddaughter">Granddaughter</option>
                        <option value="Step-Father">Step-Father</option>
                        <option value="Step-Mother">Step-Mother</option>
                        <option value="Step-sibling">Step-sibling</option>
                        <option value="Step-child">Step-child</option>
                        <option value="Uncle">Uncle</option>
                        <option value="Aunt">Aunt</option>
                        <option value="Male Cousin">Male Cousin</option>
                        <option value="Female Cousin">Female Cousin</option>
                        <option value="Nephew">Nephew</option>
                        <option value="Niece">Niece</option>
                        <option value="Mother-in-Law">Mother-in-Law</option>
                        <option value="Father-in-Law">Father-in-Law</option>
                        <option value="Brother-in-Law">Brother-in-Law</option>
                        <option value="Sister-in-Law">Sister-in-Law</option>
                        <option value="Son-in-Law">Son-in-Law</option>
                        <option value="Daughter-in-Law">Daughter-in-Law</option>
                    </select>
                    <input
                        name="memory_text"
                        placeholder="Your Favorite Memory"
                        className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                        onChange={handleChange}
                        value={formData.memory_text}
                    />
                    <input
                        type="file"
                        name="profile_photo"
                        accept="image/*"
                        className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                        onChange={handleFileChange}
                    />
                    <div>
                        <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                            Tribute Message
                        </label>
                        <div className="bg-white border border-[#E3E5E6] rounded">
                            <ReactQuill
                                theme="snow"
                                value={formData.tribute_text}
                                onChange={(value) =>
                                    setFormData((prev) => ({ ...prev, tribute_text: value }))
                                }
                                className="min-h-[100px]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            // disabled={loading}
                            className="px-4 py-2 bg-primary text-white rounded"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default editTributeModal;


