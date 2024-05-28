import { useEffect, useState } from "react";
import axios from "axios";
import AOS from 'aos';
import 'aos/dist/aos.css';
import io from 'socket.io-client';
import { Link } from "react-router-dom"
import baseUrl from "../../../core";

// Initialize socket connection
const socket = io('http://localhost:5001'); // Ensure this URL matches your server's address and port

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [notifications, setNotifications] = useState([]);

    console.log(notifications);

    useEffect(() => {
        // Setup socket listener for new orders
        socket.on('newOrder', (order) => {
            setNotifications((prevNotifications) => [...prevNotifications, order]);
            console.log(order._id);
        });

        // Cleanup socket listener on component unmount
        return () => {
            socket.off('newOrder');
        };
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/v1/allproducts`, { withCredentials: true });
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/v1/all-orders`, { withCredentials: true });
            setOrders(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${baseUrl}/api/v1/allusers`, { withCredentials: true });
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchProducts();
        fetchOrders();

        AOS.init({
            duration: 1000,
        });
    }, []);



    const removeNotification = (NId) => {
        notifications.splice(NId, 1)
        console.log(NId);
    }

    const style = {
        container: "w-4/5 absolute right-0 flex justify-center min-h-screen",
        statsContainer: "flex justify-between gap-3 p-5 w-4/5 h-52 mt-10",
        center: "flex justify-center mt-5 items-center flex-col w-72 min-h-16 bg-[#F5C01D] rounded-xl text-center text-white font-bold",
        statBox: "bg-green-700 px-5 flex flex-col gap-3 justify-center w-1/3 h-full",
        statTitle: "font-semibold text-3xl",
        statValue: "font-medium text-2xl",
    };

    return (
        <div className={`${style.container} `}>
            <div className={` ${style.statsContainer}`} >
                <div className={style.statBox}>
                    <h1 className={style.statTitle}>Total Products</h1>
                    <h1 className={style.statValue}>{products.length}</h1>
                </div>
                <div className={style.statBox}>
                    <h1 className={style.statTitle}>Total Users</h1>
                    <h1 className={style.statValue}>{users.length}</h1>
                </div>
                <div className={style.statBox}>
                    <h1 className={style.statTitle}>Total Orders</h1>
                    <h1 className={style.statValue}>{orders.length}</h1>
                </div>
            </div>
            {notifications.length > 0 && (
                <div className="notifications flex flex-col  min-h-52   absolute right-4">
                    {notifications.map((notification, index) => (
                        <div data-aos="fade-down" className={style.center} key={index}>
                            <button
                                onClick={(notification) => { removeNotification(index) }}
                                className="w-[100px] h-9 bg-yellow-700">close</button>
                            <Link to={`/order/${notification._id}`}>
                                <div>
                                    <p>New order from {notification.userName}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            )
            }
        </div >
    );
};

export default AdminDashboard;
