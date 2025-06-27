import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {API_BASE_URL} from "../../config";
import { getUserData } from '../../utility/auth'
import bg from '../../assets/img/shortcode/breadcumb.jpg'
import NavbarOne from '../../components/navbar/navbar-one'
import AccountTab from '../../components/account/account-tab'
import FooterOne from '../../components/footer/footer-one'
import ScrollToTop from '../../components/scroll-to-top'
import Aos from 'aos'
const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userToken = getUserData();
  const token = userToken.token;
      useEffect(() => {
          Aos.init()
      })
  useEffect(() => {
    const fetchOrdersDetails = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/api-order/${id}`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }

        const data = await response.json();
        setOrder(data.order);
      } catch (error) {
        console.error("Fetch error:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id && token) fetchOrdersDetails();
  }, [id, token]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!order) return <p className="text-center mt-10">Order not found.</p>;
  return (

    <>
      <NavbarOne />

      <div className="flex items-center gap-4 flex-wrap bg-overlay p-14 sm:p-16 before:bg-title before:bg-opacity-70" style={{ backgroundImage: `url(${bg})` }}>
        <div className="text-center w-full">
          <h2 className="text-white text-8 md:text-[40px] font-normal leading-none text-center">Package Details</h2>
          <ul className="flex items-center justify-center gap-[10px] text-base md:text-lg leading-none font-normal text-white mt-3 md:mt-4">
            <li><Link to="/">Home</Link></li>
            <li>/</li>
            <li className="text-primary">Package Details</li>
          </ul>
        </div>
      </div>
      <div className="s-py-100">
        <div className="container-fluid">
          <div className="max-w-[1720px] mx-auto flex items-start gap-8 md:gap-12 2xl:gap-24 flex-col md:flex-row my-profile-navtab">
            <div className="w-full md:w-[200px] lg:w-[300px] flex-none" data-aos="fade-up" data-aos-delay="100">
              <AccountTab />
            </div>
            <div className="max-w-5xl mx-auto p-6 bg-white shadow rounded-lg mt-10">
              <h1 className="text-2xl font-semibold mb-4">Order #{order.order_id}</h1>

              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
                <div>
                  <h2 className="text-lg font-medium mb-2">Order Summary</h2>
                  <p><span className="font-semibold">Status:</span> {order.order_status}</p>
                  <p><span className="font-semibold">Payment:</span> {order.payment_status}</p>
                  <p><span className="font-semibold">Payment Method:</span> {order.payment_method}</p>
                  <p><span className="font-semibold">Transaction ID:</span> {order.payment_transaction_id}</p>
                  <p><span className="font-semibold">Total:</span> ${order.total_amount}</p>
                  <p><span className="font-semibold">Ordered On:</span> {new Date(order.order_created_at).toLocaleDateString()}</p>
                </div>

                {/* Billing Info */}
                <div>
                  <h2 className="text-lg font-medium mb-2">Billing Information</h2>
                  <p>{order.billing_first_name} {order.billing_last_name}</p>
                  <p>{order.billing_email}</p>
                  <p>{order.billing_phone}</p>
                  <p>{order.billing_address}</p>
                  <p>{order.billing_city}, {order.billing_state} {order.billing_postal_code}</p>
                  <p>{order.billing_country}</p>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="mt-6 border-b pb-6">
                <h2 className="text-lg font-medium mb-2">Shipping Information</h2>
                <p>{order.shipping_first_name} {order.shipping_last_name}</p>
                <p>{order.shipping_address}</p>
                <p>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
                <p>{order.shipping_country}</p>
              </div>

              {/* Product List */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Ordered Packages</h2>
                {order.products.map((product, index) => (
                  <div key={index} className="flex flex-col md:flex-row gap-6 p-4 border rounded-lg mb-4 bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full md:w-40 h-40 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">Quantity: {product.quantity} × ${product.price}</p>

                      <h4 className="font-semibold">Features:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-700">
                        {product.features.map((feature, i) => (
                          <li key={i}><strong>{feature.title}</strong>: {feature.description}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
 <FooterOne />

            <ScrollToTop />
    </>

  );
};

export default OrderDetails;
