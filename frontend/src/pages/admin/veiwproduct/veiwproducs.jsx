import { useContext, useEffect, useState } from "react"
import baseUrl from "../../../core"
import axios from "axios"
import * as Icon from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { GlobalContext } from "../../../context/context";
import AdminProdut from "../adminProduct/AdminProduct";



const VeiwProducts = () => {
    const [productss, setProcuts] = useState([])
    useEffect(() => {
        const fetchProducts = async (e) => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/allproducts`, { withCredentials: true })
                setProcuts(response.data);
            } catch (error) {
                console.log(error);
            }
        }
        fetchProducts()
    }, [])
    // CandinateAvatar  productName productPrice 


    return (<>
        <div className="min-h-screen   w-4/5 absolute py-10 right-0 overflow-hidden  float-right">

            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {productss.map((product, i) => (
                        <AdminProdut key={i} product={product} />
                    ))}
                </div>
            </div>
        </div>

    </>);
}

export default VeiwProducts;