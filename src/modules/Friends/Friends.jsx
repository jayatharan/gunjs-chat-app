import React, { useContext, useState, useEffect } from 'react';
import {
    Typography,
    Box
} from "@mui/material";
import { GunContext } from '../../gun/GunProvider';
import { useNavigate } from "react-router-dom";
import FriendCard from './components/FriendCard';

const Friends = () => {
    const gunContext = useContext(GunContext);
    const navigate = useNavigate();
    let userIds = [];
    const [friends, setFriends] = useState([]);

    useEffect(()=>{
        getFriends();
    },[])

    const getFriends = () => {
        userIds = []
        gunContext.user.get('friends').map().once((data, id) => {
            if (data && !userIds.includes(id.toString())){
                userIds.push(id.toString());
                setFriends((prev) => ([...prev, data]));
            }
        })
    }

    return (
        <Box sx={{ width: '100%', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom component="div" color="primary">
                My Friends
            </Typography>
            <Box>
                {friends.map((user, idx) => (
                    <FriendCard user={user}  key={`user-${idx}`} />
                ))}
            </Box>
        </Box>
    )
}

export default Friends