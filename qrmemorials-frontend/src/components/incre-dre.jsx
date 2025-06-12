
import { LuMinus, LuPlus } from 'react-icons/lu'

export default function IncreDre({ quantity, onIncrease, onDecrease }) {
  return (
    <div className="inc-dec flex items-center gap-2">
        <div className="dec w-6 h-6 bg-[#E8E9EA] dark:bg-dark-secondary flex items-center justify-center">
            <LuMinus className="text-title dark:text-white" onClick={onDecrease}/>
        </div>
        <input className="w-6 h-auto outline-none bg-transparent text-base mg:text-lg leading-none text-title dark:text-white text-center" type="text"     value={quantity}/>
        <div className="inc w-6 h-6 bg-[#E8E9EA] dark:bg-dark-secondary flex items-center justify-center">
            <LuPlus className="text-title dark:text-white" onClick={onIncrease}/>
        </div>
    </div>
  )
}
