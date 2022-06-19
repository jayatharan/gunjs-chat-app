import React, { useContext, useState, useEffect } from 'react';
import {
    Typography,
    Box
} from "@mui/material";
import { GunContext } from '../../gun/GunProvider';
import { useNavigate } from "react-router-dom";
import MyRequestCard from './components/MyRequestCard';

const MyRequests = () => {
    const gunContext = useContext(GunContext);
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    let userIds = [];

    useEffect(()=>{
        getMyRequests();
    },[])

    const getMyRequests = ()=>{
        userIds = []
        const pub = gunContext.gun.user().pair().pub
        gunContext.gun.get('my-requests').get(pub).map().once((data, id) => {
            if (data && !userIds.includes(id.toString())){
                userIds.push(id.toString());
                setRequests((prev) => ([...prev, data]));
            }
        })
    }

    const cancelFriendRequest = (user)=>{
        const pub = gunContext.gun.user().pair().pub;
        gunContext.gun.get('friend-requests').get(user.pkey).get(pub).put(null);
        gunContext.gun.get('my-requests').get(pub).get(user.pkey).put(null);
        setRequests([]);
        getMyRequests();
    }

    return (
        <Box sx={{ width: '100%', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom component="div" color="primary">
                My Requests
            </Typography>
            <Box>
                {requests.map((user, idx) => (
                    <MyRequestCard user={user}  key={`user-${idx}`} cancelFriendRequest={cancelFriendRequest} />
                ))}
            </Box>
        </Box>
    )
}

export default MyRequests