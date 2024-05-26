import React, { createContext, useEffect, useReducer } from "react"
import { reducer } from "./reducer";
export const GlobalContext = createContext("Initial Value");




let data = {
    user: {},
    cart: [],
    isLogin: false,
}



export default function ContextProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, data)
    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    )
}