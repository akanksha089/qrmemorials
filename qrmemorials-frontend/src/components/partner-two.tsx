import { Link } from "react-router-dom";
import { partnerData } from "../data/data";
import OwlCarousel from 'react-owl-carousel';

const options = {
    loop: true,
    items:5,
    margin:80,
    autoplay: true,
    autoplayTimeout:4000,
    autoplaySpeed:2000,
    responsive:{
        0:{items:2}, 768:{items:3}, 991:{items:4}, 1024:{items:5}
    }
}

export default function PartnerTwo() {
  return (
    <OwlCarousel {...options} className="max-w-[1720px] mx-auto home-v1-partner-slider partner">
        {partnerData.map((item,index)=>{
            return(
                <Link to="#" className="flex items-center justify-center w-full" aria-label="partner logo" key={index}>
                    <img src={item.image2} alt="" />
                </Link>
            )
        })}
    </OwlCarousel>
  )
}
