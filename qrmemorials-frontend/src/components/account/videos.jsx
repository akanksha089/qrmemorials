

function Videos() {
    return (
        <div className="w-full   dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px]">
            <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6 ">Videos
            </h4>
            <div className="mb-4">

                <div>
                    <label className="text-base  text-title dark:text-white leading-none  block">Upload Video File*</label>
                    <input className="w-full h-12 md:h-14 bg-white dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300" type="file" accept="video/*"
                        placeholder="Video" />
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

export default Videos