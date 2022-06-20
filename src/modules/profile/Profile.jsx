import React, { useContext, useState, useEffect } from 'react';
import {
    Typography,
    Box,
    TextField,
    Avatar,
    Button,
    FormControlLabel,
    Switch
} from "@mui/material";
import { GunContext } from '../../gun/GunProvider';
import { useNavigate } from "react-router-dom";
import FileUploader from '../../shared/FileUploader';
import IpfsService from '../../services/ipfsService';

const Profile = () => {
    const gunContext = useContext(GunContext);
    const navigate = useNavigate();
    const [alias, setAlias] = useState('');
    const [publicProfile, setPublicProfile] = useState(false);
    const [profile, setProfile] = useState({
        firstname: '',
        lastname: '',
        email: '',
        mobile: '',
        pic: '',
        public:false
    })

    const logout = () => {
        gunContext.user.leave();
        gunContext.setLogin(false);
        navigate('/login')
    }

    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setProfile({ ...profile, [name]: value })
    }

    useEffect(() => {
        const pub = gunContext.gun.user().pair().pub
        gunContext.gun.user(pub).once(ack => {
            setAlias(ack.alias);
        })
        getProfileData();
    }, [])

    const getProfileData = () => {
        gunContext.user.get('profile').once((data, key) => {
            if (data) setProfile(data);
        })
    }

    const saveProfileData = () => {
        gunContext.user.get('profile').put({ firstname: profile.firstname, lastname: profile.lastname, email: profile.email, mobile: profile.mobile, pic: profile.pic??'', public:profile.public??false });
        handleProfilePublic();
    }

    const handleFileChange = async (data) => {
        try {
            const uploaded = await IpfsService.uploadFile(data);
            const pic = IpfsService.getFilePath(uploaded.path);
            setProfile({ ...profile, pic });
        } catch (error) {
            console.log(error);
        }
    }

    const handleProfilePublic = () => {
        const pub = gunContext.gun.user().pair().pub;
        const pNode = gunContext.gun.get('public-profile').get(pub);
        if(profile.public){
            pNode.put(
                {
                    username:alias, 
                    firstname: profile.firstname, 
                    lastname: profile.lastname, 
                    email: profile.email, 
                    mobile: profile.mobile, 
                    pic: profile.pic??'', 
                    public:profile.public??false,
                    pkey:pub
                }
            );
        }else{
            pNode.put(null);
        }
        pNode.once(data => console.log(data));
    }

    return (
        <Box sx={{ width: '100%', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom component="div" color="primary">
                Profile
            </Typography>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <Avatar
                    alt="Remy Sharp"
                    src={profile.pic ? profile.pic : "/profile.jpg"}
                    sx={{ width: 140, height: 140 }}
                />
            </Box>
            <Typography textAlign='center' variant='h6' >Username</Typography>
            <Typography textAlign='center' variant='h6' fontWeight={700} >{alias}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <TextField
                    id='firstname'
                    name='firstname'
                    label='FirstName'
                    value={profile.firstname}
                    onChange={handleChange}
                    size='small'
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <TextField
                    id='lastname'
                    name='lastname'
                    label='LastName'
                    value={profile.lastname}
                    onChange={handleChange}
                    size='small'
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <TextField
                    id='email'
                    name='email'
                    label='Email'
                    value={profile.email}
                    onChange={handleChange}
                    size='small'
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <TextField
                    id='mobile'
                    name='mobile'
                    label='Mobile'
                    value={profile.mobile}
                    onChange={handleChange}
                    size='small'
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <FormControlLabel
                    control={<Switch color="primary" checked={profile.public} onClick={(e)=>setProfile({...profile, public:e.target.checked})} />}
                    label="Public Profile"
                    labelPlacement="start"
                />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <FileUploader onFileChange={handleFileChange} fileType="image/*">
                    <Button component="span">Change Profile Pic</Button>
                </FileUploader>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <Button variant="contained" sx={{ width: '50%' }} onClick={saveProfileData}>Update</Button>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '15px' }}>
                <Button variant="outlined" sx={{ width: '50%' }} onClick={logout}>Logout</Button>
            </Box>
            {/* <Box sx={{display:'flex', justifyContent:'center', marginTop:'15px'}}>
                    <Button variant="outlined" color='error' sx={{width:'50%'}} onClick={saveProfileData}>Delete</Button>
                </Box> */}
        </Box>

    )
}

export default Profile