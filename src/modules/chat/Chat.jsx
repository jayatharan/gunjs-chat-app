import React, { useEffect, useState, useContext } from 'react';
import {
    Box,
    Card,
    CardHeader,
    Avatar,
    TextField,
    Button,
    Paper,
    Typography,
    IconButton
} from "@mui/material";
import { useParams, useNavigate } from 'react-router-dom'
import {GunContext} from '../../gun/GunProvider';
import SendIcon from '@mui/icons-material/Send';
import moment from 'moment';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import IpfsService from '../../services/ipfsService';
import FileUploader from '../../shared/FileUploader';
import FileViewer from "react-file-viewer";
import Message from './components/Message';
import DeleteIcon from '@mui/icons-material/Delete';
import Popup from '../../shared/Popup';

const Chat = () => {
    const gunContext = useContext(GunContext);
    const urlParams = useParams()
    const navigate = useNavigate();
    const [chatId, setChatId] = useState('');
    const [message, setMessage] = useState('');
    const [file, setFile] = useState('');
    const [fileType, setFileType] = useState('');
    const [chat, setChat] = useState(null);
    const [pair, setPair] = useState(null);
    const [messages, setMessages] = useState([]);
    const [alias, setAlias] = useState('');
    const [pkey, setpkey] = useState('');
    const [viewFile, setViewFile] = useState(null)
    let messageIds = [];

    useEffect(()=>{
        const { id } = urlParams
        if(id){
            setChatId(id)
        }else{
            navigate('/chats');
        }
        const pub = gunContext.gun.user().pair().pub
        gunContext.gun.user(pub).once(ack => {
            setAlias(ack.alias);
        })
        setpkey(pub);
    },[])

    useEffect(()=>{
        if(chatId){
            gunContext.user.get('my-chats').get(chatId).once(data=>{
                setChat(data);
                gunContext.gun.get(data.pair).once(d=>{
                    setPair(d)
                })
            })
        }
    },[chatId])

    useEffect(()=>{
        if(pair) getMessages();
    },[pair])

    const getMessages = ()=>{
        messageIds=[]
        gunContext.gun.get('chats').get(chatId).get('messages').map().on(decryptMessage);
    }

    const decryptMessage = async (data, id) => {
        if(data && !messageIds.includes(id.toString())){
            messageIds.push(id.toString());
            const dec = await gunContext.SEA.decrypt(data.emessage, pair)
            setMessages((prev)=>([...prev, {...dec, id:id.toString()}]));
        }
    }

    const handleFileChange = async (data, t) => {
        try {
            let type = t.split('/')[1]
            const uploaded = await IpfsService.uploadFile(data);
            const url = IpfsService.getFilePath(uploaded.path);
            setFile(url);
            setFileType(type);
        } catch (error) {
            console.log(error);
        }
    }

    const sendMessage = async()=>{
        var enc = await gunContext.SEA.encrypt({
            alias,
            pkey,
            message,
            file,
            fileType,
            timeStamp:Date.now()
        }, pair);
        gunContext.gun.get('chats').get(chatId).get('messages').set({emessage:enc})
        setMessage('');
        setFile('');
        setFileType('');
    } 

    const removeFile = ()=>{
        setFile('');
        setFileType('');
    }

    const handleViewFile = (data)=>{
        setViewFile(data);
    }

    return (
        <>
            <Popup
                open={viewFile?true:false}
                onClose={()=>{setViewFile(null)}}
            >
                <Box sx={{maxHeight:'80vh', overflowY:'auto'}}>
                    {viewFile&&(
                        <FileViewer 
                            fileType={viewFile.fileType}
                            filePath={viewFile.file}
                        />
                    )}
                </Box>
            </Popup>
            <Box sx={{height:'90vh', display:'flex', flexDirection: 'column',justifyContent: 'space-between'}}>
                {chat&&(
                    <Card>
                    <CardHeader
                        avatar={
                        <Avatar 
                            alt="Chat Image"
                            src={chat.pic}
                        />
                        }
                        title={chat.name}
                        subheader={chat.description}
                    />
                    </Card>
                )}
                <Box>
                    <Box sx={{display:'flex', flexDirection: 'column', maxHeight:'70vh', overflowY:'auto'}}>
                        {messages.map((m,i)=>(
                            <Message key={`${m.id}-${i}`} message={m} pkey={pkey} handleViewFile={handleViewFile} />
                        ))}
                    </Box>
                    <Box>
                        {file&&(
                            <Card>
                                <CardHeader 
                                    action={
                                        <IconButton onClick={removeFile}>
                                            <DeleteIcon />
                                        </IconButton>
                                    }
                                    title={fileType}
                                />
                                <Typography>
                                    {file}
                                </Typography>
                            </Card>
                        )}
                        <Box sx={{display:'flex', justifyContent:'space-between'}}>
                            <Box sx={{display:'flex', alignItems:'center', paddingX:1, backgroundColor:'grey.100', borderRadius:'5px 0px 0px 5px', border:'1px solid'}}>
                                <FileUploader onFileChange={handleFileChange}>
                                    <AttachFileIcon />
                                </FileUploader>
                            </Box>
                            <TextField 
                                value={message}
                                onChange={(e)=>setMessage(e.target.value)}
                                size='small'
                                sx={{width:'100%'}}
                                placeholder='Message'
                            />
                            <Box sx={{display:'flex', alignItems:'center', paddingX:1, backgroundColor:'primary.main', color:'common.white', borderRadius:'0px 5px 5px 0px'}} onClick={sendMessage}>
                                <SendIcon />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Chat