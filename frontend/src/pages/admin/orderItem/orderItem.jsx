import { Link } from 'react-router-dom'
import axios from "axios"
import baseUrl from "../../../core";
import { useState } from 'react';


const OrderItem = ({ order }) => {
    const [toggleRefresh, setToggleRefresh] = useState(false);
    const DeleteHandler = async (id) => {
        try {
            let response = await axios.delete(`${baseUrl}/api/v1/delete/order/${id}`)
            setToggleRefresh(!toggleRefresh);
        } catch (error) {
            console.log(error);
        }
    }





    return (
        <div className="bg-white rounded-lg shadow-md my-5 p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order ID: {order._id}</h2>
            <p className="text-base text-gray-600 mb-4">Costumar Name: {order.userName}</p>
            <ul>
                {order.orderProduct?.map(product => (
                    <li key={product.productId} className="flex justify-between items-center py-2 border-b border-gray-200">
                        <span className="text-lg text-gray-800">{product.productName}</span>
                        <span className="text-lg text-gray-700">Price:{product.productPrice}</span>
                    </li>
                ))
                }
            </ul>
            <div className="mt-4 flex  justify-between  ">
                <div className='flex gap-5'>
                    <button className=" w-28 h-11 rounded-md text-white bg-blue-600  font-semibold">
                        <Link to={`/order/${order._id}`}>Order Detail</Link>
                    </button>
                    <button onClick={(e) => { DeleteHandler(order._id) }} className=' w-28 h-11 rounded-md text-white bg-red-600 font-semibold'>
                        Delete Order
                    </button>

                </div>
                <span className="text-lg font-semibold text-gray-800">Total Price: $ {order.totalPrice} </span>
            </div>
        </div>
    );
};

export default OrderItem;
