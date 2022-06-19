import React, { useState, createContext } from "react";
import Gun from 'gun';

export const GunContext = createContext(null);

const GunProvider = ({children}) => {
    const [login, setLogin] = useState(false);

    const gun = Gun({
        peers: ['http://152.67.164.75:8000/gun']
    })

    const SEA = Gun.SEA;
    const user = gun.user().recall({sessionStorage: true})

    return(
        <GunContext.Provider 
            value={{
                gun,
                SEA,
                user,
                login, 
                setLogin
            }}
        >
            {children}
        </GunContext.Provider>
    )
}

export default GunProvider;