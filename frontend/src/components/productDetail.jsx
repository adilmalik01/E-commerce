import { useParams } from "react-router-dom"
import baseUrl from "../core"
import { useEffect, useState } from "react"
import axios from "axios"
import CartButton from "../components/CartButton"


const ProductDetail = () => {
    let { id } = useParams()
    const [product, setProduct] = useState([])




    const fetchProduct = async (e) => {
        try {
            let response = await axios.get(`${baseUrl}/api/v1/product/${id}`)
            setProduct(response.data)
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
        fetchProduct()
    }, [setProduct])


    return (
        <div className="flex flex-col items-center py-8 mt-20">
            <img src={product[0]?.CandinateAvatar} alt={product[0]?.productName} className="w-64 h-64 object-cover mb-4" />
            <h2 className="text-2xl font-bold mb-2"> {product[0]?.productName}</h2>
            <p className="text-gray-600 mb-2"> <span className="text-black font-medium">Brand</span> : {product[0]?.productBrand}</p>
            <div className=" w-2/4 flex flex-wrap text-center break-words overflow-hidden">
                <p className="text-lg text-gray-800 mb-4">{product[0]?.productDetail}</p>
            </div>
            <p className="text-xl font-bold mb-4">{product[0]?.productPrice}$</p>
            < CartButton item={{
                productName: product[0]?.productName,
                CandinateAvatar: product[0]?.CandinateAvatar,
                productPrice: product[0]?.productPrice
            }} />

        </div>
    );
}

export default ProductDetail;