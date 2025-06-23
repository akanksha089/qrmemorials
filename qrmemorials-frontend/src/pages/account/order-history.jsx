import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom'

import NavbarOne from '../../components/navbar/navbar-one'
import bg from '../../assets/img/shortcode/breadcumb.jpg'
import AccountTab from '../../components/account/account-tab'
import FooterOne from '../../components/footer/footer-one'
import ScrollToTop from '../../components/scroll-to-top'

import { cartData } from '../../data/data'
import API_BASE_URL from '../../config'; // adjust path if needed
import { getUserData } from '../../utility/auth'

import Aos from 'aos'

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userToken = getUserData();
    const token = userToken.token;
    useEffect(() => {
        Aos.init()
    })
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/api-order`,
                    {
                        headers: {
                            accept: 'application/json',
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (!response.ok) {
                    throw new Error("Failed to fetch orders")
                }
                const data = await response.json();
                setOrders(data);

            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchOrders();
    }, [])
    return (
        <>
            <NavbarOne />

            <div className="flex items-center gap-4 flex-wrap bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70" style={{ backgroundImage: `url(${bg})` }}>
                <div className="text-center w-full">
                    <h2 className="text-white text-8 md:text-[40px] font-normal leading-none text-center">Order History</h2>
                    <ul className="flex items-center justify-center gap-[10px] text-base md:text-lg leading-none font-normal text-white mt-3 md:mt-4">
                        <li><Link to="/">Home</Link></li>
                        <li>/</li>
                        <li className="text-primary">History</li>
                    </ul>
                </div>
            </div>

            <div className="s-py-100">
                <div className="container-fluid">
                    <div className="max-w-[1720px] mx-auto flex items-start gap-8 md:gap-12 2xl:gap-24 flex-col md:flex-row my-profile-navtab">
                        <div className="w-full md:w-[200px] lg:w-[300px] flex-none" data-aos="fade-up" data-aos-delay="100">
                            <AccountTab />
                        </div>
                        <div className="w-full md:w-auto md:flex-1 overflow-auto" data-aos="fade-up" data-aos-delay="300">
                            <div className="bg-[#F8F8F9] dark:bg-dark-secondary p-5 sm:p-8 lg:p-[50px] order-history-table">
                                <ul className="order-history">
                                    <li className="title flex items-center justify-between gap-5 pb-[10px] sm:pb-5 border-b border-bdr-clr dark:border-bdr-clr-drk">
                                        <span className="cart-product-title text-lg md:text-xl font-semibold leading-none text-title dark:text-white block w-[270px] sm:w-[310px] xl:w-[330px]">Product</span>
                                        <span className="text-lg md:text-xl font-semibold leading-none text-title dark:text-white w-[60px]">Price</span>
                                        <span className="text-lg md:text-xl font-semibold leading-none text-title dark:text-white w-[100px]">Actions</span>
                                    </li>
                                    {orders?.orders?.map((order, orderIndex) => (
                                        <div key={order.order_id} className="mb-8">
                                            {/* <h3 className="text-lg font-bold mb-4">Order #{order.order_id}</h3> */}

                                            {order.products.map((product, productIndex) => (
                                                <li
                                                    key={`${order.order_id}-${product.product_id}`}
                                                    className="flex items-center justify-between gap-5 py-[15px] sm:py-[15px] border-b border-bdr-clr dark:border-bdr-clr-drk"
                                                >
                                                    {/* Product Info */}
                                                    <div className="flex items-center gap-3 md:gap-4 lg:gap-6 ordered-product w-[270px] sm:w-[310px] xl:w-[330px]">
                                                        <div className="w-16 sm:w-[90px] flex-none">
                                                            <img
                                                                src={product.image}
                                                                alt={product.name}
                                                                className="w-full h-auto rounded-md object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h5 className="font-semibold leading-none mt-2 md:mt-4">
                                                                <Link to={`/order-details/${order.order_id}`} className="hover:underline">
                                                                    {product.name}
                                                                </Link>
                                                            </h5>
                                                        </div>
                                                    </div>

                                                    {/* Price */}
                                                    <span className="text-base md:text-lg leading-none text-title dark:text-white font-semibold text-left w-[60px]">
                                                        ${product.price}
                                                    </span>

                                                    {/* View Order */}
                                                    <div className="w-[100px]">
                                                        <Link
                                                            to={`/order-details/${order.order_id}`}
                                                            state={{ orders }}
                                                            className="bg-black py-[7px] px-[10px] font-semibold leading-none text-white text-sm rounded"
                                                        >
                                                            View
                                                        </Link>
                                                    </div>
                                                </li>
                                            ))}
                                        </div>
                                    ))}

                                </ul>
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
