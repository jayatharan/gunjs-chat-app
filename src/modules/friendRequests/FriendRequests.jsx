import React, { useContext, useState, useEffect } from 'react';
import {
    Typography,
    Box
} from "@mui/material";
import { GunContext } from '../../gun/GunProvider';
import { useNavigate } from "react-router-dom";
import FriendRequestCard from './components/FriendRequestCard';

const FriendRequests = () => {
    const gunContext = useContext(GunContext);
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    let userIds = [];

    useEffect(()=>{
        getFriendRequests();
    },[])

    const getFriendRequests = () => {
        userIds = []
        const pub = gunContext.gun.user().pair().pub
        gunContext.gun.get('friend-requests').get(pub).map().once((data, id) => {
            if (data && !userIds.includes(id.toString())){
                userIds.push(id.toString());
                setRequests((prev) => ([...prev, data]));
            }
        })
    }

    const cancelFriendRequest = (user) => {
        const pub = gunContext.gun.user().pair().pub;
        gunContext.gun.get('friend-requests').get(pub).get(user.pkey).put(null);
        gunContext.gun.get('my-requests').get(user.pkey).get(pub).put(null);
        setRequests([]);
        getFriendRequests();
    }

    const acceptFriendRequest = (user) => {
        const friend = {firstname:user.firstname, lastname:user.lastname, email:user.email, mobile:user.mobile, pic:user.pic??'', pkey:user.pkey};
        gunContext.user.get('friends').get(user.pkey).put(friend);
        cancelFriendRequest(user);
    }

    return (
        <Box sx={{ width: '100%', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom component="div" color="primary">
                Friend Requests
            </Typography>
            <Box>
                {requests.map((user, idx) => (
                    <FriendRequestCard user={user}  key={`user-${idx}`} cancelFriendRequest={cancelFriendRequest} acceptFriendRequest={acceptFriendRequest} />
                ))}
            </Box>
        </Box>
    )
}

export default FriendRequests