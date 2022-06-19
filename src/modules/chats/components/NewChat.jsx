import React, { useContext, useEffect, useState } from 'react'
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardHeader,
    Avatar
} from "@mui/material";
import { GunContext } from '../../../gun/GunProvider';
import MultipleCheckBox from '../../../shared/MultipleCheckBox';
import IpfsService from '../../../services/ipfsService';
import FileUploader from '../../../shared/FileUploader';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const NewChat = () => {
    const [chatName, setChatName] = useState('');
    const [chatDescription, setChatDescription] = useState('')
    const [chatPic, setChatPic] = useState("/profile.jpg");
    const [userPKeys, setUserpKeys] = useState([])
    const gunContext = useContext(GunContext);
    let userIds = [];
    const [friends, setFriends] = useState([]);

    useEffect(() => {
        getFriends();
    }, [])

    const getFriends = () => {
        userIds = []
        gunContext.user.get('friends').map().once((data, id) => {
            if (data && !userIds.includes(id.toString())) {
                userIds.push(id.toString());
                setFriends((prev) => ([...prev, data]));
            }
        })
    }

    const createChat = async () => {
        const ownerPair = gunContext.gun.user().pair();
        const pair = await gunContext.SEA.pair();
        const chat = {
            name:chatName,
            description:chatDescription,
            pic:chatPic,
            pair:pair
        }
        userPKeys.map(k=>{
            gunContext.gun.user(k).once(ack => {
                sendChatRequest(k, ack.epub, ownerPair, chat);
            })
        })
        const message = gunContext.gun.get('chats').get(pair.pub);
        message.put({
            name:chatName,
            description:chatDescription,
            pic:chatPic
        })
        gunContext.user.get('my-chats').get(pair.pub).put(chat);
        message.get('users').get(ownerPair.pub).put({pkey:ownerPair.pub});
    }

    const sendChatRequest = async (pub, epub, ownerPair, chat) => {
        const passphrase = await gunContext.SEA.secret(epub, ownerPair);
        const encChat = await gunContext.SEA.encrypt(chat, passphrase);
        gunContext.gun.get('chat-requests').get(pub).set({encChat, epub:ownerPair.epub});
    }

    const handleChange = (event, value) =>{
        setUserpKeys(value.map(u => u.pkey));
    }

    const handleFileChange = async (data) => {
        try {
            const uploaded = await IpfsService.uploadFile(data);
            const pic = IpfsService.getFilePath(uploaded.path);
            setChatPic(pic)
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Box >
            <Typography>
                New Chat
            </Typography>
            <Card sx={{mt:'5px'}}>
                <CardHeader
                avatar={
                    <Avatar 
                    alt="Chat Image"
                    src={chatPic}
                    />
                }
                title={chatName}
                subheader={chatDescription}
                />
            </Card>
            <Box sx={{marginTop:'10px'}}>
                <TextField 
                    label='Chat Name'
                    size='small'
                    value={chatName}
                    onChange={(e)=>setChatName(e.target.value)}
                    sx={{marginY:'10px', width:'100%'}}
                />
                <TextField 
                    label='Description'
                    size='small'
                    value={chatDescription}
                    onChange={(e)=>setChatDescription(e.target.value)}
                    sx={{marginY:'10px', width:'100%'}}
                />
                <MultipleCheckBox onChange={handleChange} options={friends.map(u => ({title:`${u.firstname} ${u.lastname}`, pkey:u.pkey}))} label={"Friends"} placeholder={"Select Users"} />
                <FileUploader onFileChange={handleFileChange}>
                    <Button component="span" sx={{mt:'10px'}}>Chat Image</Button>
                </FileUploader>
            </Box>
            <Button variant="contained" sx={{width:'100%', marginY:'10px'}} onClick={createChat}>
                Create
            </Button>
        </Box>
    )
}

export default NewChat