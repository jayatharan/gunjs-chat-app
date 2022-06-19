import React from 'react'
import {
    Typography,
    Container,
    Box,
    Modal
} from "@mui/material";

const Popup = ({ children, open, onClose }) => {
    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
            <Container maxWidth='xs'>
                <Box sx={{ backgroundColor:"grey.100", padding:1 }}>
                    {children}
                </Box>
            </Container>
        </Modal>
    )
}

export default Popup