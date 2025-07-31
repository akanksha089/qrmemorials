import ReactQuill from "react-quill";
import { ImCross } from "react-icons/im";


const TributeModal = ({ isOpen, onClose, handleChange, handleSubmit, handleFileChange, loading, formData, setFormData }) => {


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
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                        onChange={handleChange}
                    />
                    <select
                        name="relation"
                        className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                        onChange={handleChange}
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
                            disabled={loading}
                            className="px-4 py-2 bg-primary text-white rounded"
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default TributeModal;
