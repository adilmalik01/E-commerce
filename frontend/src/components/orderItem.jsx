import React from 'react';

const OrderCard = ({ order }) => {

  const totalPrice = order.orderProduct?.reduce(
    (total, item) => total + parseFloat(item.productPrice),
    0
  );

  return (
    <div className="bg-white rounded shadow-lg p-4">
      <h3 className="text-lg font-semibold">{order.orderNumber}</h3>
      <p className="text-gray-800 p-4"> Purchase Date: {order.createdAt}</p>
      <ul className="mt-2">
        {order.orderProduct?.map(item => (
          <li key={item._id} className="flex px-3 items-center border-b mt-3 border-red-500 justify-between">
            <img src={item.CandinateAvatar} width={80} alt="" />
            <span className=' font-black'>{item.productName}</span>
            <span>{item.productPrice} $</span>
          </li>
        ))}
      </ul>
      <p className="text-gray-600 font-extrabold text-2xl mt-5">Total: {totalPrice}</p>
    </div>
  );
};

export default OrderCard;
