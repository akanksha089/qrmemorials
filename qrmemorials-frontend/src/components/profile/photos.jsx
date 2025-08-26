import { useState , useEffect } from 'react'

function Photos({ photos }) {
    const [likedPhotos, setLikedPhotos] = useState(() =>
        photos.reduce((acc, photo) => {
            acc[photo.url] = {
                liked: false,
                count: photo.likes || ""
            };
            return acc;
        }, {})
    );
    const toggleLike = (url) => {
        setLikedPhotos((prev) => {
            const photo = prev[url];
            const isLiked = photo.liked;

            return {
                ...prev,
                [url]: {
                    liked: !isLiked,
                    count: isLiked ? photo.count - 1 : photo.count + 1
                }
            };
        });
    };
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openModal = (index) => {
        setCurrentIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const showPrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? photos.length - 1 : prevIndex - 1));
    };

    const showNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === photos.length - 1 ? 0 : prevIndex + 1));
    };
    useEffect(() => {
        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        }

        if (isModalOpen) {
            window.addEventListener('keydown', handleKeyDown);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
        }

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen]);
    function handleModalClick(e) {
        // If click target is outside the image container, close modal
        if (e.target.id === 'modalOverlay') {
            closeModal();
        }
    }

    return (
        <>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
                {photos?.map((photo, index) => (
                    <div key={index} className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden group">
                        {/* Image */}
                        <div
                            onClick={() => openModal(index)}
                            className="cursor-zoom-in"
                        >
                            <img
                                src={photo?.url}
                                alt="Memorial"
                                className="w-full object-cover h-auto transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>

                        {/* Like Button */}
                        <button
                            onClick={() => toggleLike(photo.url)}
                            className="mt-3 border border-1 px-5 flex space-x-4 text-center bg-white/80 backdrop-blur-sm py-1 rounded-full shadow hover:bg-white transition duration-300"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`w-4 h-4 transition-colors duration-300 ${likedPhotos[photo.url]?.liked ? "text-red-500" : "text-gray-500"}`}
                                fill={likedPhotos[photo.url]?.liked ? "currentColor" : "none"}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 
              8.5 2 6.01 4.01 4 6.5 4c1.74 0 3.41 1.01 
              4.13 2.44h1.75C14.09 5.01 15.76 4 17.5 4 
              19.99 4 22 6.01 22 8.5c0 3.78-3.4 6.86-8.55 
              11.54L12 21.35z"
                                />
                            </svg>
                            <span className='text-sm'>{likedPhotos[photo.url]?.count}</span>

                        </button>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div
                    id="modalOverlay"
                    onClick={handleModalClick}
                    className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex items-center justify-center">
                    {/* Container to hold image and close button */}
                    <div className="relative flex flex-col items-center z-[9999]">
                        {/* Close Button: just above the image */}
                        <button
                            onClick={closeModal}
                            className="mb-4 text-white text-4xl font-bold hover:text-red-500"
                            aria-label="Close"
                            style={{ alignSelf: 'center' }}
                        >
                            &times;
                        </button>

                        {/* Image */}
                        <img
                            src={photos[currentIndex]?.url}
                            alt="Large view"
                            className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-2xl object-contain"
                        />
                    </div>

                    {/* Prev Button */}
                    <button
                        onClick={showPrev}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold z-[10000] hover:text-gray-400"
                        aria-label="Previous"
                    >
                        &#8592;
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={showNext}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl font-bold z-[10000] hover:text-gray-400"
                        aria-label="Next"
                    >
                        &#8594;
                    </button>
                </div>
            )}


        </>

    )
}

export default Photos