import DOMPurify from 'dompurify';

function About({ biography }) {
    const safeHTML = DOMPurify.sanitize(biography?.biography_text);
    const links = [
        {
            text: biography?.link_text_1,
            url: biography?.link_url_1,
        },
        {
            text: biography?.link_text_2,
            url: biography?.link_url_2,
        },
        {
            text: biography?.link_text_3,
            url: biography?.link_url_3,
        },
        {
            text: biography?.link_text_4,
            url: biography?.link_url_4,
        },
    ];

    return (
        <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 ">
                {/* Image Section */}
                <div className="sm:col-span-8 col-span-12">
                    <img
                        className="w-full max-w-[800px] h-auto object-cover rounded-md mx-auto"
                        src={biography?.biography_photo}
                        alt="Biography"
                    />
                    <div className="prose max-w-full">
                        <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
                    </div>
                </div>

                {/* Text or Content Section */}
                <div className="sm:col-span-4 col-span-12 text-black space-y-6">
                    <h4 className="font-normal text-lg">Cemetery information</h4>
                    <p>
                        <span className="font-semibold">Cemetery Name:</span>
                        <span className="pl-1">{biography?.cemetery_name}</span>
                    </p>

                    <h4 className="font-normal text-lg">Links</h4>
                    <ul className=" space-y-2">
                        {links
                            .filter(link => link.text && link.url)
                            .map((link, index) => (
                                <li key={index}>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className=" hover:text-[#BB976D] underline"
                                    >
                                        {link.text}
                                    </a>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </div>

    )
}

export default About