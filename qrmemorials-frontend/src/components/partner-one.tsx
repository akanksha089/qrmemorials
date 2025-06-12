import { Link } from 'react-router-dom'
import { partnerData } from '../data/data'
import OwlCarousel from 'react-owl-carousel';

export default function PartnerOne() {
  return (
    <>
    <div className='block dark:hidden'>
        <OwlCarousel autoplay={true} loop={true} margin={50} autoplayTimeout={5000} autoplaySpeed={2000} items={6} responsive={{0:{items:2}, 768:{items:3}, 991:{items:4}, 1024:{items:6} }} className="max-w-[1720px] mx-auto home-v1-partner-slider partner">
            {partnerData.map((item,index)=>{
                return(
                    <Link to="#" className="flex items-center justify-center w-full"  key={index}>
                        <img src={item.image} alt="" className='mx-auto'/>
                    </Link>
                )
            })}
        </OwlCarousel>
    </div>
    <div className='hidden dark:block'>
        <OwlCarousel autoplay={true} loop={true} margin={50} autoplayTimeout={5000} autoplaySpeed={2000} items={6} responsive={{0:{items:2}, 768:{items:3}, 991:{items:4}, 1024:{items:6} }} className="max-w-[1720px] mx-auto home-v1-partner-slider partner">
            {partnerData.map((item,index)=>{
                return(
                    <Link to="#" className="flex items-center justify-center w-full"  key={index}>
                        <img src={item.image2} alt="" className='mx-auto'/>
                    </Link>
                )
            })}
        </OwlCarousel>
    </div>
    </>
  )
}
