import { Link } from 'react-router-dom'
import OwlCarousel from 'react-owl-carousel';
import { blogData } from '../../data/index-five';

export default function BlogFive() {
    const options = {
        autoplay : true,
        loop: true,
        autoplayTimeout:4000,
        autoplaySpeed:500,
        items:1,
    }
  return (
        <OwlCarousel {...options} className="home-v5-blog-slider owl-carousel sm:max-w-[500px] lg:max-w-[750px] mx-auto  sm:mb-8" >
            {blogData.map((item,index)=>{
                return(
                    <div className="relative group mx-[15px] sm:mx-0" key={index}>
                        <Link to="/blog-details-v1" className="overflow-hidden block">
                            <img className="duration-300 transform scale-100 group-hover:scale-110 w-full" src={item.image} alt="blog-card"/>
                        </Link>
                        <div className="bg-white bg-opacity-90 dark:bg-title dark:bg-opacity-90 p-5 md:p-6 absolute z-10 w-11/12 max-w-md transform left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <ul className="flex items-center gap-[10px] flex-wrap">
                                <li className="text-[15px] leading-none dark:text-white">{item.date}</li>
                                <li><Link to="/blog-tag" className="inline-block text-title font-medium text-[15px] leading-none py-[10px] px-5 rounded-md bg-primary-midum">{item.tag}</Link></li>
                            </ul>
                            <h5 className="mt-3 font-medium dark:text-white leading-[1.5]"><Link to="/blog-details-v1" className="text-underline">{item.title}</Link></h5>
                        </div>
                    </div>
                )
            })}
        </OwlCarousel>
  )
}
