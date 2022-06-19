import React, { useState } from 'react'
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse
} from "@mui/material"
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MessageIcon from '@mui/icons-material/Message';

const Menu = ({showMenu, setShowMenu}) => {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);

    const navigateTo = (path)=>{
        setShowMenu(false);
        navigate(path);
    }

    return (
        <Drawer
            anchor='right'
            open={showMenu}
            onClose={() => setShowMenu(false)}
        >
            <Box sx={{ minWidth: '250px' }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton onClick={()=>navigateTo('/')}>
                            <ListItemIcon>
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={()=>setProfileOpen(!profileOpen)} >
                            <ListItemIcon>
                                <AccountCircleIcon />
                            </ListItemIcon>
                            <ListItemText primary="User" />
                            {profileOpen ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                    </ListItem>
                    <Collapse in={profileOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4, paddingY:'2px' }} onClick={()=>navigateTo('/profile')}>
                                <ListItemText primary="Profile" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4, paddingY:'2px' }} onClick={()=>navigateTo('/my-requests')}>
                                <ListItemText primary="My Requests" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4, paddingY:'2px' }} onClick={()=>navigateTo('/friend-requests')}>
                                <ListItemText primary="Friend Requests" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4, paddingY:'2px' }} onClick={()=>navigateTo('/users')}>
                                <ListItemText primary="Public Users" />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4, paddingY:'2px' }} onClick={()=>navigateTo('/friends')}>
                                <ListItemText primary="My Friends" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <ListItem disablePadding>
                        <ListItemButton onClick={()=>navigateTo('/chats')}>
                            <ListItemIcon>
                                <MessageIcon />
                            </ListItemIcon>
                            <ListItemText primary="Chats" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    )
}

export default Menu