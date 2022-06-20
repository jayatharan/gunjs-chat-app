import React, { useContext, useState, useEffect } from 'react';
import {
    Typography,
    Box,
    TextField,
    Pagination
} from "@mui/material";
import { GunContext } from '../../gun/GunProvider';
import UserCard from './components/UserCard';

const Users = () => {
    const gunContext = useContext(GunContext);
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);
    let userIds = [];

    const getUsers = () => {
        userIds = [];
        setUsers([]);
        let index = 0;
        let cnt = 0;
        gunContext.gun.get('public-profile').map((user,id)=>{
            let data = null
            if(!search){ 
                if(user) {
                    cnt+=1;
                    data = user;
                }
            }
            else {
                const s = search.toLocaleLowerCase();
                if(user.username.toLocaleLowerCase().indexOf(s) !== -1
                || user?.firstname.toLocaleLowerCase().indexOf(s) !== -1
                || user?.lastname.toLocaleLowerCase().indexOf(s) !== -1
                || user?.mobile.toLocaleLowerCase().indexOf(s) !== -1
                || user?.email.toLocaleLowerCase().indexOf(s) !== -1) 
                {
                    cnt+=1;
                    data = user;
                }
            }
            if(index >= (page-1)*limit && index<(page*limit)){
                if (data && !userIds.includes(id.toString())) {
                    userIds.push(id.toString());
                    setUsers((prev) => ([...prev, data]));
                }
            }
            if(user) index += 1;
        })
        setCount(cnt);
    }

    useEffect(() => {
        getUsers();
    }, [page, limit, search])

    useEffect(()=>{
        setPage(1);
    },[search])

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

    const handleChangePage = (event, newPage)=>{
        setPage(newPage);
    }

    return (
        <Box sx={{ width: '100%', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom component="div" color="primary">
                Public Users
            </Typography>
            <TextField 
                size='small'
                fullWidth={true}
                placeholder="Search User"
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
            />
            <Box sx={{marginTop:'10px'}}>
                {users.map((user, idx) => (
                    <UserCard user={user} key={`user-${idx}`} sendFriendRequest={sendFriendRequest} />
                ))}
            </Box>
            <Box sx={{display:'flex', justifyContent:'end'}}>
                <Pagination
                    count={Math.ceil(count/limit)}
                    page={page}
                    onChange={handleChangePage}
                />
            </Box>
        </Box>
    )
}

export default Users