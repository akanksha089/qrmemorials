
function graveLocation({ biography }) {
  // const embedUrl = biography?.grave_location;
const embedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.3977567561316!2d-73.91105918459237!3d40.73541797932832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25f9a0e75af6f%3A0xa71822769a9c5bb7!2s49-02%20Laurel%20Hill%20Blvd%2C%20Woodside%2C%20NY%2011377%2C%20USA!5e0!3m2!1sen!2sus!4v1721904738234!5m2!1sen!2sus';
  return (
    <div className="s-pb-100" data-aos="fade-up">
      <div className="container-fluid">
        {embedUrl ? (
          <div className="max-w-[1720px] mx-auto">
            <iframe
              className="w-full h-[400px] md:h-[600px]"
              src={embedUrl}
              style={{ border: '0' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        ) : (
          <p className="text-center text-gray-500">Grave location not available.</p>
        )}
      </div>
    </div>
  )
}

export default graveLocation