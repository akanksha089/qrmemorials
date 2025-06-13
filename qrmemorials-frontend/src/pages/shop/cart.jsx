import { Link, useNavigate } from "react-router-dom";

import NavbarOne from "../../components/navbar/nav-menu.jsx";
import IncreDre from "../../components/incre-dre";
import FooterOne from "../../components/footer/footer-one";
import ScrollToTop from "../../components/scroll-to-top";

import bg from '../../assets/img/shortcode/breadcumb.jpg'
import { useEffect, useState } from "react";
import Aos from "aos";
import API_BASE_URL from '../../config'; // adjust path if needed
import { getUserData } from '../../utility/auth'
import { toast } from 'react-toastify';

export default function Cart() {
    const [cartItem, setCartItem] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const userToken = getUserData();
    const token = userToken.token;
    const navigate = useNavigate();
    useEffect(() => {
        Aos.init()
    })

    useEffect(() => {
        const fetchCartItem = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/cart`, {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch package");
                }

                const result = await response.json();
                setCartItem(result); // because it's a single object
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCartItem();
    }, []);

    const handleRemoveItem = async (id) => {
        const cartItemId = id; // adjust if needed
        try {
            const response = await fetch(`${API_BASE_URL}/api/v1/cart/delete/${cartItemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.message || 'Failed to remove item');
                return;
            }
            setCartItem((prevItems) => prevItems.filter(item => item.id !== cartItemId));

            // ✅ Find index of removed item
            const index = cartItem.findIndex(item => item.id === cartItemId);
            if (index !== -1) {
                const updatedCart = [...cartItem];
                updatedCart.splice(index, 1);
                setCartItem(updatedCart);
            }

            toast.success('Item removed from cart successfully');

        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Something went wrong while removing the item');
        }
    };
    const handleIncrease = (index) => {
        const updatedCart = [...cartItem];
        updatedCart[index].quantity = (updatedCart[index].quantity || 1) + 1;
        setCartItem(updatedCart);
    };

    const handleDecrease = (index) => {
        const updatedCart = [...cartItem];
        if ((updatedCart[index].quantity || 1) > 1) {
            updatedCart[index].quantity -= 1;
            setCartItem(updatedCart);
        }
    };

    const subtotal = cartItem.reduce((acc, item) => {
        // Support both item.value (string like "$25") and item.price (number)
        const price = item.value
            ? parseFloat(item.value.replace('$', ''))
            : (item.price || 0);
        return acc + price * (item.quantity || 1);
    }, 0);
    const handleCheckout = () => {
    localStorage.setItem("checkoutItems", JSON.stringify(cartItem));
    localStorage.setItem("checkoutSubtotal", JSON.stringify(subtotal));
    navigate("/checkout");
  };

return (
    <>
        <NavbarOne />
        <div className="flex items-center gap-4 flex-wrap bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70" style={{ backgroundImage: `url(${bg})` }}>
            <div className="text-center w-full">
                <h2 className="text-white text-8 md:text-[40px] font-normal leading-none text-center">Cart</h2>
                <ul className="flex items-center justify-center gap-[10px] text-base md:text-lg leading-none font-normal text-white mt-3 md:mt-4">
                    <li><Link to="/">Home</Link></li>
                    <li>/</li>
                    <li className="text-primary">Cart</li>
                </ul>
            </div>
        </div>
        <div className="s-py-100">
            <div className="container ">
                <div className="flex xl:flex-row flex-col gap-[30px] lg:gap-[30px] xl:gap-[70px]">
                    <div className="flex-1 overflow-x-auto" data-aos="fade-up" data-aos-delay="100">
                        <table id="cart-table" className="responsive nowrap table-wrapper" style={{ width: '100%' }}>
                            <thead className="table-header">
                                <tr>
                                    <th className="text-lg md:text-xl font-semibold leading-none text-title dark:text-white">Product Info</th>
                                    <th className="text-lg md:text-xl font-semibold leading-none text-title dark:text-white">Price</th>
                                    <th className="text-lg md:text-xl font-semibold leading-none text-title dark:text-white">Quantity</th>
                                    <th className="text-lg md:text-xl font-semibold leading-none text-title dark:text-white">Total</th>
                                    <th className="text-lg md:text-xl font-semibold leading-none text-title dark:text-white">Remove</th>
                                </tr>
                            </thead>
                            <tbody className="table-body">
                                {cartItem.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-10">No items in cart.</td></tr>
                                ) : (

                                    cartItem.map((item, index) => {
                                        return (
                                            <tr className="">
                                                <td className="md:w-[42%]">
                                                    <div className="flex items-center gap-3 md:gap-4 lg:gap-6 cart-product my-4">
                                                        <div className="w-14 sm:w-20 flex-none">
                                                            <img src={item.image_url} alt="product" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h6 className="leading-none font-medium">Package</h6>
                                                            <h5 className="font-semibold leading-none mt-2"><Link to="#">{item.package_name}</Link></h5>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <h6 className="text-base md:text-lg leading-none text-title dark:text-white font-semibold">${item.price}</h6>
                                                </td>
                                                <td>
                                                    <IncreDre quantity={item.quantity}
                                                        onIncrease={() => handleIncrease(index)}
                                                        onDecrease={() => handleDecrease(index)} />
                                                </td>
                                                <td>
                                                    <h6 className="text-base md:text-lg leading-none text-title dark:text-white font-semibold">   ${item.price * (item.quantity || 1)}</h6>
                                                </td>
                                                <td>
                                                    <button onClick={() => handleRemoveItem(item?.id)} className="w-8 h-8 bg-[#E8E9EA] dark:bg-dark-secondary flex items-center justify-center ml-auto duration-300 text-title dark:text-white">
                                                        <svg className="fill-current " width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M0.546875 1.70822L1.70481 0.550293L5.98646 4.83195L10.2681 0.550293L11.3991 1.6813L7.11746 5.96295L11.453 10.2985L10.295 11.4564L5.95953 7.12088L1.67788 11.4025L0.546875 10.2715L4.82853 5.98988L0.546875 1.70822Z" />
                                                        </svg>
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })


                                )}
                            </tbody>
                        </table>
                    </div>

                    <div data-aos="fade-up" data-aos-delay="300">
                        <div className="mb-[30px]">
                            <h4 className="text-lg md:text-xl font-semibold leading-none text-title dark:text-white mb-[15px]">
                                Promo Code
                            </h4>
                            <div className="flex xs:flex-row flex-col gap-3">
                                <input className="h-12 md:h-14 bg-snow dark:bg-dark-secondary border border-[#E3E5E6] text-title dark:text-white focus:border-primary p-4 outline-none duration-300 placeholder:text-title dark:placeholder:text-white flex-1" type="text" placeholder="Coupon Code" />
                                <button className="btn btn-solid" data-text="Apply">
                                    <span>Apply</span>
                                </button>
                            </div>
                        </div>
                        <div className="bg-[#FAFAFA] dark:bg-dark-secondary pt-[30px] md:pt-[40px] px-[30px] md:px-[40px] pb-[30px] border border-[#17243026] border-opacity-15 rounded-xl">
                            <div className="text-right flex justify-end flex-col w-full ml-auto mr-0">
                                <div className="flex justify-between flex-wrap text-base sm:text-lg text-title dark:text-white font-medium">
                                    <span>Sub Total:</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between flex-wrap text-base sm:text-lg text-title dark:text-white font-medium mt-3">
                                    <span>Coupon Discount:</span>
                                    <span>-$20</span>
                                </div>
                                <div className="flex justify-between flex-wrap text-base sm:text-lg text-title dark:text-white font-medium mt-3">
                                    <span>VAT:</span>
                                    <span> $5</span>
                                </div>

                            </div>
                            <div className="mt-6 pt-6 border-t border-bdr-clr dark:border-bdr-clr-drk">
                                <div className="flex justify-between flex-wrap text-base sm:text-lg text-title dark:text-white font-medium mt-3">
                                    <div>
                                        <label className="flex items-center gap-[10px] categoryies-iteem">
                                            <input className="appearance-none hidden" type="radio" name="item-type" />
                                            <span className="w-4 h-4 rounded-full border border-title dark:border-white flex items-center justify-center duration-300">
                                                <svg className="duration-300 opacity-0" width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="10" height="10" rx="5" fill="#BB976D" />
                                                </svg>
                                            </span>
                                            <span className="sm:text-lg text-title dark:text-white block sm:leading-none transform translate-y-[3px] select-none">Free Shipping:</span>
                                        </label>
                                    </div>
                                    <span> $0</span>
                                </div>
                                <div className="flex justify-between flex-wrap text-base sm:text-lg text-title dark:text-white font-medium mt-3">
                                    <div>
                                        <label className="flex items-center gap-[10px] categoryies-iteem">
                                            <input className="appearance-none hidden" type="radio" name="item-type" />
                                            <span className="w-4 h-4 rounded-full border border-title dark:border-white flex items-center justify-center duration-300">
                                                <svg className="duration-300 opacity-0" width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="10" height="10" rx="5" fill="#BB976D" />
                                                </svg>
                                            </span>
                                            <span className="sm:text-lg text-title dark:text-white block sm:leading-none transform translate-y-[3px] select-none"> Fast Shipping:</span>
                                        </label>
                                    </div>
                                    <span>$10</span>
                                </div>
                                <div className="flex justify-between flex-wrap text-base sm:text-lg text-title dark:text-white font-medium mt-3">
                                    <div>
                                        <label className="flex items-center gap-[10px] categoryies-iteem">
                                            <input className="appearance-none hidden" type="radio" name="item-type" />
                                            <span className="w-4 h-4 rounded-full border border-title dark:border-white flex items-center justify-center duration-300">
                                                <svg className="duration-300 opacity-0" width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="10" height="10" rx="5" fill="#BB976D" />
                                                </svg>
                                            </span>
                                            <span className="sm:text-lg text-title dark:text-white block sm:leading-none transform translate-y-[3px] select-none"> Local Pickup:</span>
                                        </label>
                                    </div>
                                    <span>$15</span>
                                </div>
                            </div>
                            <div className="mt-6 pt-6 border-t border-bdr-clr dark:border-bdr-clr-drk">
                                <div className="flex justify-between flex-wrap font-semibold leading-none text-2xl">
                                    <span>Total:</span>
                                    <span>&nbsp;${subtotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="sm:mt-[10px] py-5 flex items-end gap-3 flex-wrap justify-end">
                            <Link to="/shop-v1" className="btn btn-sm btn-outline !text-title hover:!text-white before:!z-[-1] dark:!text-white dark:hover:!text-title">
                                Continue Shopping
                            </Link>
                            <button
                                // to="/checkout"
                                className="btn btn-sm btn-theme-solid !text-white hover:!text-primary before:!z-[-1]"
                                onClick={handleCheckout}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <FooterOne />
        <ScrollToTop />
    </>
)
}
