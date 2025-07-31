import DOMPurify from 'dompurify';

function Eulogy({eulogy}) {

    const safeHTML = DOMPurify.sanitize(eulogy?.eulogy_text);
  return (
    <div>
           <div className="sm:col-span-8 col-span-12">
                    {/* <img
                        className="w-full max-w-[800px] h-auto object-cover rounded-md mx-auto"
                        src={eulogy?.eulogy_photo}
                        alt="Biography"
                    /> */}
                    <div className="prose max-w-full">
                        <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
                    </div>
                </div>
    </div>
  )
}

export default Eulogy