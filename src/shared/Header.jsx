import React, { useContext, useState, useEffect } from 'react'
import {
    AppBar,
    Container,
    Toolbar,
    Typography,
    Box
} from "@mui/material"
import AdbIcon from '@mui/icons-material/Adb';
import { GunContext } from '../gun/GunProvider';
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from './Menu';


const Header = () => {
    const gunContext = useContext(GunContext);
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const logout = () => {
        gunContext.user.leave();
        gunContext.setLogin(false);
        navigate('/login')
    }

    useEffect(() => {
        gunContext.gun.on('auth', ack => {
            if (gunContext.user.is) gunContext.setLogin(true);
            else gunContext.setLogin(false);
        });
    }, [gunContext])

    return (
        <>
            <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
            <AppBar position='static'>
                <Container maxWidth="sm" sx={{}}>
                    <Toolbar disableGutters>
                        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AdbIcon sx={{ display: { md: 'flex' }, mr: 1 }} />
                                <Typography
                                    variant="h5"
                                    noWrap
                                    component="a"
                                    href="/"
                                    sx={{
                                        mr: 2,
                                        display: { md: 'flex' },
                                        fontFamily: 'monospace',
                                        fontWeight: 700,
                                        letterSpacing: '.3rem',
                                        color: 'inherit',
                                        textDecoration: 'none'
                                    }}
                                >
                                    Watch
                                </Typography>
                            </Box>
                            {gunContext.login && (
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <AccountCircleIcon sx={{ marginRight: '10px' }} onClick={() => navigate('/profile')} />
                                    <MenuIcon onClick={() => setShowMenu(true)} />
                                </Box>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    )
}

export default Header