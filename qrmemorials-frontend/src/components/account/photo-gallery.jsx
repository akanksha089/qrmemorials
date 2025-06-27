import React, { useState } from 'react'
import { toast } from 'react-toastify';

function photoGallery({ handleUpload, handleFileChangeGallery }) {
    const [image, setImage] = useState(null);
    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));

        if (files.length > 10) {
            toast.warn('You can upload up to 10 images at a time.');
            return;
        }

        const previews = files.map(file => URL.createObjectURL(file));
        setImage(previews);
        handleFileChangeGallery({ target: { files } });
    };

    const handleFileInput = (e) => {
        const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));

        if (files.length > 10) {
            toast.warn('You can upload up to 10 images at a time.');
            return;
        }

        const previews = files.map(file => URL.createObjectURL(file));
        setImage(previews);
        handleFileChangeGallery(e);
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
                    onClick={() => document.getElementById('gallery-photo-input').click()}
                >    {image?.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 w-full">
                        {image.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Preview ${index}`}
                                className="object-cover h-24 w-full rounded"
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-sm md:text-base">
                        <span className="text-3xl text-black font-bold capitalize">
                            Drag & drop images here
                        </span>
                        <br />
                        or
                        <br />
                        <span className="text-gray-500 dark:text-gray-300">Browse Files</span>
                    </p>
                )}
                </div>
                <input
                     id="gallery-photo-input"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileInput}
                />
            </div>
            <p className='text-[#ff0400] font-semibold text-lg'>
                You can upload up to 10 images at a time. Please submit the first 10 images before uploading the next batch.
            </p>
            <div className="mt-5 sm:mt-8 md:mt-12">
                <button onClick={handleUpload} className="btn btn-solid" data-text="Submit">
                    <span>Submit</span>
                </button>
            </div>
        </div>
    )
}

export default photoGallery