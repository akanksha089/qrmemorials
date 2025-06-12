import { Link } from 'react-router-dom';
import { blogTwoData } from '../../data/data'
import OwlCarousel from 'react-owl-carousel';

export default function BlogTwo() {
    const options = {
        autoplay :true,
        loop: true,
        autoplayTimeout:4000,
        autoplaySpeed:500,
        items:1,
        margin:30
    }

  return (
    <OwlCarousel {...options} className="owl-carousel owl-carousel portfolio-v1-slider max-w-md md:max-w-[750px] px-[15px] mx-auto owl-loaded owl-drag">
        {blogTwoData.map((item,index)=>{
            return(
                <div className="relative group" key={index}>
                    <Link to="/blog-details-v1" className="overflow-hidden block">
                        <img className="duration-300 transform scale-100 group-hover:scale-110 w-full" src={item.image} alt="blog-card"/>
                    </Link>
                    <div className="sm:bg-white sm:bg-opacity-90 sm:dark:bg-title sm:dark:bg-opacity-90 mt-4 sm:p-5 md:p-6 sm:absolute z-10 bottom-0 left-0 sm:w-11/12 max-w-md px-5 sm:px-0 ">
                        <ul className="flex items-center gap-[10px] flex-wrap">
                            <li className="text-[15px] leading-none dark:text-white">{item.date}</li>
                            <li><Link to="/blog-tag" className="inline-block text-title font-medium text-[15px] leading-none py-[10px] px-5 rounded-md bg-primary-midum ">{item.tag}</Link></li>
                        </ul>
                        <h5 className="mt-3 font-medium dark:text-white leading-[1.5] text-xl"><Link to="/blog-details-v1" className="text-underline">{item.title}</Link></h5>
                    </div>
                </div>
            )
        })}
    </OwlCarousel>
  )
}
