import { createContext, useState } from "react";

export const reFetchContext = createContext()

const reFetchState = ({children})=>{
    const [refetch, setRefetch] = useState(false)
    const handleRefetch = ()=>{
        setRefetch(!refetch)
    }

    return (
        <reFetchContext.Provider value={{refetch, handleRefetch}}>
            {children}
        </reFetchContext.Provider>
    )


}


export default reFetchState