import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getUserData } from '../../utility/auth';
import API_BASE_URL from "../../config";

export default function AccountTab() {
    const [current, setCurrent] = useState('')
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const userToken = getUserData();
    const token = userToken.token;
    useEffect(() => {
        setCurrent(window.location.pathname)
    }, [])
    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/purchased-packages`,
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
                const packages= data.packages
                setPackages(packages);

            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        fetchPackages();
    }, [])
    console.log('packages', packages)
    return (
        <ul className="divide-y dark:divide-paragraph text-title dark:text-white text-base sm:text-lg lg:text-xl flex flex-col justify-center leading-none">
            <li className={` py-3 lg:py-6 pl-6 lg:pl-12 ${current === '/my-profile' ? 'active text-primary' : ''}`}>
                <Link className="duration-300 hover:text-primary" to="/my-profile">My Profile</Link>
            </li>
            <li className={`py-3 lg:py-6 pl-6 lg:pl-12 ${current === '/my-account' ? 'active text-primary' : ''}`}>
                <Link className="duration-300 hover:text-primary" to="/my-account">My Account</Link>
            </li>
            <li className={`py-3 lg:py-6 pl-6 lg:pl-12 ${current === '/edit-account' ? 'active text-primary' : ''}`}>
                <Link className="duration-300 hover:text-primary" to="/edit-account">Edit Account</Link>
            </li>
            <li className={`py-3 lg:py-6 pl-6 lg:pl-12 ${current === '/order-history' ? 'active text-primary' : ''}`}>
                <Link className="duration-300 hover:text-primary" to="/order-history">Order History</Link>
            </li>
            <li className={`py-3 lg:py-6 pl-6 lg:pl-12 ${current === '/wishlist' ? 'active text-primary' : ''}`}>
                <Link className="duration-300 hover:text-primary" to="/wishlist">Wishlist</Link>
            </li>
            {packages?.map(pkg => (
                <Link
                    key={pkg.id}
                    to={`/my-packages/${pkg.id}`}
                    className={`py-3 lg:py-6 pl-6 lg:pl-12 ${current.includes(`/my-packages/${pkg.id}`) ? 'active text-primary' : ''
                        } duration-300 hover:text-primary`}>
                    {pkg.title}
                </Link>
            ))}

            <li className={`py-3 lg:py-6 pl-6 lg:pl-12 ${current === '/login' ? 'active text-primary' : ''}`}>
                <Link className="duration-300 hover:text-primary" to="/login">Logout</Link>
            </li>
        </ul>
    )
}
