import React from 'react'
import {
    Box,
    Card,
    IconButton,
    Typography
} from "@mui/material";
import moment from 'moment';
import { Link } from 'react-router-dom';
import FileViewer from "react-file-viewer";
import PreviewIcon from '@mui/icons-material/Preview';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

const Message = ({ message, pkey, handleViewFile }) => {
    
    const downloadFile = (file)=>{
        window.open(message.file);
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: (pkey === message.pkey ? 'end' : 'start'), marginBottom: '5px' }}>
            <Card sx={{ padding: '3px' }}>
                {/* <Box>
                    {message.file && (
                        <FileViewer
                            fileType={message.fileType}
                            filePath={message.file}
                        />
                    )}
                </Box> */}
                {message.file&&(
                    <Box sx={{display:'flex', justifyContent:'end'}}>
                        <IconButton onClick={()=>handleViewFile({fileType:message.fileType, file:message.file})}>
                            <PreviewIcon />
                        </IconButton>
                        <IconButton onClick={downloadFile}>
                            <SystemUpdateAltIcon />
                            {/* <a href={message.file} download target='_blank'>
                            </a> */}
                        </IconButton>
                    </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent:'space-between' }} >
                    <Typography sx={{ paddingY: '0px' }}>
                        {message.message}
                    </Typography>
                    <Typography fontSize={'0.8rem'} sx={{ marginLeft: '2px' }}>
                        {moment(new Date(message.timeStamp).toISOString()).format('HH:mm')}
                    </Typography>
                </Box>
            </Card>
        </Box>
    )
}

export default Message