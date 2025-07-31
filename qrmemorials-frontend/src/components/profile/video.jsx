import { useState } from 'react';

function Video({videos}) {
      const [selectedVideo, setSelectedVideo] = useState(null);
  
  return (
    <div>
        <div className="p-5">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {videos.map((video) => (
                        <div
                            key={video.id}
                            onClick={() => setSelectedVideo(video)}
                            className="relative group cursor-pointer border rounded overflow-hidden bg-gray-100 hover:shadow-lg transition aspect-video"
                        >
                            {/* Show video preview frame (as thumbnail) */}
                            <video
                                src={video.vimeo_url || video.media_url}
                                preload="metadata"
                                muted
                                className="w-full h-full object-cover pointer-events-none"
                            />

                            {/* Play button overlay */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition">
                                <div className="bg-white rounded-full p-3 shadow-lg">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="w-8 h-8 text-black"
                                        fill="currentColor"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M6.79 5.093A.5.5 0 0 1 7.5 5.5v5a.5.5 0 0 1-.79.407L4.21 8.5a.5.5 0 0 1 0-.814l2.58-2.593z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>



                {/* Modal */}
                {selectedVideo && (
                    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
                        <div className="relative bg-white rounded-lg shadow-lg w-[90%] max-w-3xl p-5 overflow-hidden">

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedVideo(null)}
                                className="absolute top-4 right-4 rounded-full h-7 w-7 bg-gray-500 text-gray-200 hover:text-white text-sm font-bold z-50 cursor-pointer"
                                aria-label="Close video"
                                title="Close"
                            >
                                &#x2715;
                            </button>

                            {/* Video */}
                            <video
                                src={selectedVideo.vimeo_url || selectedVideo.media_url}
                                controls
                                autoPlay
                                className="w-full h-auto rounded"
                            />

                            {/* Optional Info */}
                            <p className="mt-2 text-sm break-all text-center text-gray-600">
                                <strong>Source:</strong> {selectedVideo.vimeo_url ? 'Vimeo' : 'Local Upload'}
                            </p>
                        </div>
                    </div>
                )}

            </div>
    </div>
  )
}

export default Video