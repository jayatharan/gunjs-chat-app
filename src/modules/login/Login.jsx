import React, { useState, useContext, useEffect } from 'react'
import {
    Container,
    Box,
    Typography,
    TextField,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    IconButton,
    Button,
    Alert
} from "@mui/material"
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { GunContext } from '../../gun/GunProvider';
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const gunContext = useContext(GunContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (gunContext.user.is) {
            navigate('/');
        }
    }, [gunContext])

    const signUp = () => {
        gunContext.user.create(username, password, (ack) => {
            if (ack.err) setError(ack.err);
            else {
                signIn();
                setError('');
            }
        })
    }

    const signIn = () => {
        gunContext.user.auth(username, password, (ack) => {
            if (ack.err) setError(ack.err);
            else {
                setError('');
                navigate('/');
            }
        })
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom component="div" color="primary">
                Login / Signup
            </Typography>
            {error && (
                <Alert severity="warning">{error}</Alert>
            )}
            <TextField id="userName" label="Username" variant="standard" required sx={{ marginY: '10px' }} value={username} onChange={(e) => setUsername(e.target.value)} />
            <FormControl variant="standard">
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    required
                    endAdornment={
                        <InputAdornment position='end'>
                            <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                />
            </FormControl>
            <Box sx={{ marginTop: '20px' }}>
                <Button variant="contained" sx={{ width: '50%' }} onClick={signIn}>SignIn</Button>
                <Button variant="outlined" sx={{ width: '50%' }} onClick={signUp}>SignUp</Button>
            </Box>
        </Box>
    )
}

export default Login