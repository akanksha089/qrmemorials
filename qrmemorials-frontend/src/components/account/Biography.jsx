import QuillEditor from '../QuillEditor';

function Biography() {
  return (
         <div className="w-full  bg-[#F8F8F9] dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px]">
                                <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6 ">Biography</h4>
                                <div className="flex items-start flex-col lg:flex-row gap-5 sm:gap-6">
                                    <div className="grid gap-5 sm:gap-6 w-full grid-cols-1 lg:grid-cols-2">
                                        <div>
                                            <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Full Name</label>
                                            <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="Enter your full name" />
                                        </div>
                                        <div>
                                            <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Cemetery Name</label>
                                            <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300 appearance-none" type="text" placeholder="Cemetery Name" />
                                        </div>
                                        <div>
                                            <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Birth Date*</label>
                                            <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="date" placeholder="Enter your Birth Date*" />
                                        </div>
                                        <div>
                                            <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Death Date*</label>
                                            <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="date" placeholder="Enter your Death Date*" />
                                        </div>


                                        <div>
                                            <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Profile Photo</label>
                                            <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="file" placeholder="Profile Photo" />
                                        </div>
                                        <div>
                                            <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Background Photo</label>
                                            <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="file" placeholder="Background Photo" />
                                        </div>
                                        <div>
                                            <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Cemetery Location</label>
                                            <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300 appearance-none" type="text" placeholder="Cemetery Location" />
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
                                            <div>
                                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Biography Photo</label>
                                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="file" placeholder="Biography Photo" />
                                            </div>
                                            <div>
                                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                                    Photo Position
                                                </label>
                                                <select
                                                    className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                                                    defaultValue=""
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
                                            <QuillEditor />
                                        </div>
                                        <div>
                                            <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Grave location</label>
                                            <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="" />
                                        </div>
                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-2 sm:mb-3'>
                                            <div>
                                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Link Text #1</label>
                                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="Link Text #1" />
                                            </div>
                                            <div>
                                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                                    Link URL #1
                                                </label>
                                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="Link URL #1" />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-2 sm:mb-3'>
                                            <div>
                                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Link Text #2</label>
                                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="Link Text #2" />
                                            </div>
                                            <div>
                                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                                    Link URL #2
                                                </label>
                                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="Link URL #2" />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-2 sm:mb-3'>
                                            <div>
                                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Link Text #3</label>
                                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="Link Text #3" />
                                            </div>
                                            <div>
                                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                                    Link URL #3
                                                </label>
                                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="Link URL #3" />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-2 sm:mb-3'>
                                            <div>
                                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">Link Text #4</label>
                                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="Link Text #4" />
                                            </div>
                                            <div>
                                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                                    Link URL #4
                                                </label>
                                                <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="text" placeholder="Link URL #4" />
                                            </div>
                                        </div>
                                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 mb-2 sm:mb-3'>

                                            <div>
                                                <label className="text-base md:text-lg text-title dark:text-white leading-none mb-2 sm:mb-3 block">
                                                    Account Type
                                                </label>
                                                <select
                                                    className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300"
                                                    defaultValue=""
                                                >
                                                    <option value="Public">Public</option>
                                                    <option value="Private">Private</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-8 md:mt-12">
                                    <button className="btn btn-solid" data-text="Submit">
                                        <span>Submit</span>
                                    </button>
                                </div>
                            </div>
  )
}

export default Biography