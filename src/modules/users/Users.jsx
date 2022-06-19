import React, { useContext, useState, useEffect } from 'react';
import {
    Typography,
    Box
} from "@mui/material";
import { GunContext } from '../../gun/GunProvider';
import UserCard from './components/UserCard';

const Users = () => {
    const gunContext = useContext(GunContext);
    const [users, setUsers] = useState([])
    let userIds = [];

    useEffect(() => {
        userIds = []
        gunContext.gun.get('public-profile').map().once((data, id) => {
            if (data && !userIds.includes(id.toString())) {
                userIds.push(id.toString());
                setUsers((prev) => ([...prev, data]));
            }
        })
        
    }, [])

    const sendFriendRequest = (user)=>{
        const pub = gunContext.gun.user().pair().pub;
        gunContext.user.get('profile').once((data, key) => {
            let myProfile;
            myProfile = {firstname:data.firstname, lastname:data.lastname, email:data.email, mobile:data.mobile, pic:data.pic??'', pkey:pub}
            gunContext.gun.user(pub).once(ack => {
                myProfile = {...myProfile, username:ack.alias}
                gunContext.gun.get('friend-requests').get(user.pkey).get(pub).put(myProfile);
                const friend = {firstname:user.firstname, lastname:user.lastname, email:user.email, mobile:user.mobile, pic:user.pic??'', pkey:user.pkey};
                gunContext.gun.get('my-requests').get(pub).get(user.pkey).put(friend);
            })
        })
    }

    return (
        <Box sx={{ width: '100%', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom component="div" color="primary">
                Public Users
            </Typography>
            <Box>
                {users.map((user, idx) => (
                    <UserCard user={user}  key={`user-${idx}`} sendFriendRequest={sendFriendRequest} />
                ))}
            </Box>
        </Box>
    )
}

export default Users