import React, { useState } from 'react'

function photoGallery() {
    const [image, setImage] = useState(null);
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };
    return (
        <div className="w-full   dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px]">
            <h4 className="font-medium leading-none text-xl sm:text-2xl mb-5 sm:mb-6 ">Photo Gallery
            </h4>
            <div className="mb-4">
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    className="w-full h-40 md:h-52 flex flex-col items-center justify-center bg-white dark:bg-dark-secondary border-2 border-dashed border-[#E3E5E6] text-title dark:text-white cursor-pointer p-4 text-center"
                    onClick={() => document.getElementById('bio-photo-input').click()}
                >
                    {image ? (
                        <img src={image} alt="Preview" className="max-h-full max-w-full object-contain" />
                    ) : (
                        <p className="text-sm md:text-base  ">
                            <span className='text-sm md:text-3xl text-black font-bold capitalize'>
                                Drag & drop image here
                            </span>

                            <br />
                            or
                            <br />
                            <span className='text-gray-500 dark:text-gray-300'>
                                Browse File
                            </span>

                        </p>
                    )}
                </div>
                <input
                    id="bio-photo-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </div>
            <p className='text-[#ff0400] font-semibold text-lg'>
                You can upload up to 10 images at a time. Please submit the first 10 images before uploading the next batch.
            </p>
            <div className="mt-5 sm:mt-8 md:mt-12">
                <button className="btn btn-solid" data-text="Submit">
                    <span>Submit</span>
                </button>
            </div>
        </div>
    )
}

export default photoGallery