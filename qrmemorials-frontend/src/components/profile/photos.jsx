import { useState } from 'react'

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



    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
            {photos?.map((photo, index) => (
                <div key={index} className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden group">
                    {/* Image */}
                    <a
                        href={photo?.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                    >
                        <img
                            src={photo?.url}
                            alt="Memorial"
                            className="w-full object-cover h-auto transition-transform duration-300 group-hover:scale-105"
                        />
                    </a>

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
    )
}

export default Photos