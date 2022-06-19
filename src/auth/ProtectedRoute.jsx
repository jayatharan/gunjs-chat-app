import React, { useContext } from 'react'
import { GunContext } from '../gun/GunProvider';
import NotAuthorized from '../modules/errors/NotAuthorized';

const ProtectedRoute = ({children}) => {
    const gunContext = useContext(GunContext);

    if(!gunContext.user.is) return NotAuthorized; 

    return <>{children}</>;
}

export default ProtectedRoute