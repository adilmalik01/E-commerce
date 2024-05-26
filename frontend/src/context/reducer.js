import { useEffect } from "react"


export const reducer = (state, action) => {

    switch (action.type) {
        case "USER_LOGIN": {
            let role = action.payload.isAdmin ? "Admin" : "user"
            return { ...state, isLogin: true, user: action.payload, role: role }
        }
        case "USER_LOGOUT": {
            return { ...state, isLogin: false }
        }
        case "CART": {
            // let check = action.payload.some((it) => it._id == state._id)
            // if (check) {
            //     alert("ruk ja")
            //     return;
            // }
            return { ...state, cart: action.payload }
        }
        default: {
            return state
        }
    }
}