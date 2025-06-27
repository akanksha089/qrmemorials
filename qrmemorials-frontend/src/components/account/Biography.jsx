import QuillEditor from '../QuillEditor';
import { useEffect, useState } from 'react';
import {API_BASE_URL} from "../../config";

function Biography({ handleChange, handleFileChange, handleSubmit, formData, files }) {
    const [preview, setPreview] = useState({ profile: null, background: null, biography: null });

    useEffect(() => {
        const objectURLs = [];

        const getImageUrl = (filename) => {
            if (!filename) return null;
            if (filename.startsWith("http")) return filename; // Don't add API_BASE_URL again
            return `${API_BASE_URL}/uploads/packages/${filename}`;
        };

        const getPreviewUrl = (file, fallbackFilename) => {
            if (file instanceof Blob) {
                const url = URL.createObjectURL(file);
                objectURLs.push(url);
                return url;
            } else {
                return getImageUrl(fallbackFilename);
            }
        };

        const newPreview = {
            profile: getPreviewUrl(files.profile_photo, formData.profile_photo),
            background: getPreviewUrl(files.background_photo, formData.background_photo),
            biography: getPreviewUrl(files.biography_photo, formData.biography_photo)
        };

        setPreview(newPreview);

        return () => {
            objectURLs.forEach(url => URL.revokeObjectURL(url));
        };
    }, [files, formData]);




    console.log('formData.biography_text', formData.biography_text)
    return (
        <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="w-full  bg-[#F8F8F9] dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px]">
                <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6 ">Biography</h4>
                <div className="flex items-start flex-col lg:flex-row gap-5 sm:gap-6">
                    <div className=" space-y-5 sm:space-y-6 w-full ">
                        <div>
                            <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Full Name</label>
                            <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="Enter Full Name"
                                name="full_name" value={formData.full_name} onChange={handleChange} />
                        </div>
                        <div className='grid-cols-1 lg:grid-cols-2 grid gap-5 sm:gap-6'>

                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Birth Date*</label>
                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="date" placeholder="Enter your Birth Date*"
                                    name="birth_date" value={formData.birth_date} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Death Date*</label>
                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="date" placeholder="Enter your Death Date*"
                                    name="death_date" value={formData.death_date} onChange={handleChange} />
                            </div>


                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Profile Photo</label>
                                {preview.profile ? (
                                    <img src={preview.profile} alt="Profile Preview" className="max-w-xs max-h-48 rounded" />
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No profile photo uploaded</p>
                                )}
                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="file" name="profile_photo" onChange={handleFileChange} accept="image/*" />
                            </div>
                            {/* Background Photo */}
                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Background Photo</label>
                                {preview.background ? (
                                    <img src={preview.background} alt="background Preview" className="max-w-xs max-h-48 rounded" />
                                ) : (
                                    <p className="text-sm text-gray-400 italic">No background photo uploaded</p>
                                )}

                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="file" name="background_photo" onChange={handleFileChange} accept="image/*" />
                            </div>
                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Cemetery Name</label>
                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300 appearance-none" type="text" placeholder="Cemetery Name" name="cemetery_name" value={formData.cemetery_name} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Cemetery Location</label>
                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300 appearance-none" type="text" placeholder="Cemetery Location"
                                    name="cemetery_location" value={formData.cemetery_location} onChange={handleChange} />
                            </div>
                        </div>

                    </div>

                </div>
                <div className=" items-start flex-col lg:flex-row gap-5 sm:gap-6">
                    <div className='h-11 items-center justify-center flex text-white bg-[#9e8f69] my-5'>
                        <span className='font-semibold text-lg'>
                            Biography Section
                        </span>
                    </div>
                    <div className="space-y-5 w-full ">
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-2 sm:mb-3'>
                            {/* Biography Photo */}
                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Biography Photo</label>

                                {preview.biography && <img src={preview.biography} alt="Biography preview" className="mb-2 max-w-xs max-h-48 rounded" />}
                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="file" name="biography_photo" onChange={handleFileChange} accept="image/*" />
                            </div>
                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                    Photo Position
                                </label>
                                <select
                                    className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                                    name="photo_position" value={formData.photo_position} onChange={handleChange}
                                >
                                    <option value="" disabled>Select Photo Position</option>
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                    <option value="center">Center</option>
                                </select>
                            </div>
                        </div>

                        <div >
                            <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Biography Text</label>
                            {/* <ReactQuill
                                                theme="snow"
                                                value={bio}
                                                onChange={setBio}
                                                placeholder="Write your bio . . ."
                                                className="bg-white dark:bg-dark-secondary text-title dark:text-white border border-[#E3E5E6] focus:border-primary p-2 rounded-md"
                                                modules={{
                                                    toolbar: [
                                                        ['bold', 'italic', 'underline'],
                                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                                        ['clean'],
                                                    ],
                                                }}
                                            /> */}
                            {formData && (
                                <QuillEditor formData={formData} handleChange={handleChange} />
                            )}
                        </div>
                        <div>
                            <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Grave location</label>
                            <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder=""
                                name="grave_location" value={formData.grave_location} onChange={handleChange} />
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-2 sm:mb-3'>
                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Link Text #1</label>
                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="Link Text #1"
                                    name="link_text_1" value={formData.link_text_1} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                    Link URL #1
                                </label>
                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="url" placeholder="Link URL #1"
                                    name="link_url_1" value={formData.link_url_1} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-2 sm:mb-3'>
                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Link Text #2</label>
                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="Link Text #2"
                                    name="link_text_2" value={formData.link_text_2} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                    Link URL #2
                                </label>
                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="url" placeholder="Link URL #2" name="link_url_2" value={formData.link_url_2} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-2 sm:mb-3'>
                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Link Text #3</label>
                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="Link Text #3"
                                    name="link_text_3" value={formData.link_text_3} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                    Link URL #3
                                </label>
                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="url" placeholder="Link URL #3"
                                    name="link_url_3" value={formData.link_url_3} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-2 sm:mb-3'>
                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Link Text #4</label>
                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="Link Text #4"
                                    name="link_text_4" value={formData.link_text_4} onChange={handleChange} />
                            </div>
                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                    Link URL #4
                                </label>
                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="url" placeholder="Link URL #4"
                                    name="link_url_4" value={formData.link_url_4} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-2 sm:mb-3'>

                            <div>
                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                    Account Type
                                </label>
                                <select
                                    className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                                    name="account_type" value={formData.account_type} onChange={handleChange}
                                >
                                    <option value="public">Public</option>
                                    <option value="private">Private</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-8 md:mt-12">
                    <button className="btn btn-solid" data-text="Submit" type="submit">
                        <span>Submit</span>
                    </button>
                </div>
            </div>
        </form>
    )
}

export default Biography