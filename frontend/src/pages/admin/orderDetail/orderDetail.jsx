import { Link, useParams } from "react-router-dom";
import baseUrl from "../../../core";
import { useEffect, useState } from "react";
import axios from "axios";

const OrderDetail = () => {
    let { id } = useParams();
    const [orderDetail, setOrderDetail] = useState([]);
    orderDetail.map((order) => (
        console.log(order)
    ));
    const fetchOrderDetail = async () => {
        try {
            let response = await axios.get(`${baseUrl}/api/v1/admin-order/${id}`);
            setOrderDetail(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    if (!orderDetail) {
        return (
            <div className="h-screen w-full flex justify-center items-center">
                <h1 className="text-5xl font-bold">Loading...</h1>
            </div>
        );
    }


    return (
        <div className="min-h-screen w-4/5  absolute right-0 bg-gray-100 p-4">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Order Management</h1>
                {orderDetail.map((order) => (
                    <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                        <h2 className="text-2xl font-semibold mb-4">Order Details</h2>
                        <div className="border-b pb-4 mb-4">
                            <h3 className="text-xl font-medium">User Information</h3>
                            <p><strong>Name:</strong> {order.userInfo.Name}</p>
                            <p><strong>Email:</strong> {order.userInfo.Email}</p>
                            <p><strong>Phone Number:</strong> {order.userInfo.Phonenumber}</p>
                            <p><strong>Address:</strong> {order.userInfo.Address}</p>
                        </div>
                        <div>
                            <h3 className="text-xl font-medium">Order Products</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {order.orderProduct.map((product, index) => {
                                    return <Link to={'product/:id'}>
                                        <div key={index} className="bg-white border rounded-lg shadow-md p-4">
                                            <img src={product.CandinateAvatar} alt={product.productName} className="w-full h-40 object-cover mb-4 rounded" />
                                            <h4 className="text-lg font-semibold">{product.productName}</h4>
                                            <p className="text-gray-600">Price: ${product.productPrice}</p>
                                        </div>
                                    </Link>
                                })}
                            </div>
                        </div>
                        <div className="mt-4">
                            <p><strong>Order Created At:</strong> {order.createdAt}</p>
                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
};

export default OrderDetail;
