import { useContext } from "react"
import * as Icon from 'react-bootstrap-icons';
import { GlobalContext } from "../context/context";
import Alert from "../components/alert";





const CartButton = ({ item }) => {
    const { state, dispatch } = useContext(GlobalContext)


    const cotextToCart = (item) => {
        localStorage.setItem("cart", JSON.stringify([...state.cart, item]))
        dispatch({
            type: "CART",
            payload: [...state.cart, item]
        })
        Alert("Added")
    }

    return (<>
        <button className="bg-blue-400 h-12 flex justify-center items-center rounded-md w-24 text-white" onClick={() => {
            cotextToCart({
                productName: item.productName,
                CandinateAvatar: item.CandinateAvatar,
                productPrice: item.productPrice
            })

        }}>
            <Icon.Cart3 color="white" size={25} />
        </button>
    </>);
}

export default CartButton;