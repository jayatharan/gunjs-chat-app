import React, { useState, useEffect, useContext } from 'react'
import {
  Typography,
  Box,
  Tabs,
  Tab,
  Modal,
  Card,
  CardHeader,
  Avatar,
  IconButton
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import NewChat from './components/NewChat';
import Popup from '../../shared/Popup';
import {GunContext} from '../../gun/GunProvider';
import CheckCircleOutline from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from "react-router-dom";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const gunContext = useContext(GunContext);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{paddingY:'7px'}}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Chats = () => {
  const gunContext = useContext(GunContext);
  const [tab, setTab] = useState(0);
  const [addNew, setAddNew] = useState(false);
  const [chats, setChats] = useState([]);
  const [chatRequests, setChatRequests] = useState([]);
  let chatRequestIds = [];
  let chatIds = [];
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  useEffect(()=>{
    getMyChatRequests();
    getMyChats();
  },[])

  const getMyChatRequests = () => {
    chatRequestIds=[];
    const pub = gunContext.gun.user().pair().pub;
    // gunContext.gun.get('chat-requests').get(pub).map().once((data,id)=>{
    //   gunContext.gun.get('chat-requests').get(pub).get(id.toString()).put(null);
    // })
    gunContext.gun.get('chat-requests').get(pub).map().once(decryptChat);
  }

  const getMyChats = ()=>{
    gunContext.user.get('my-chats').map().once((data, id)=>{
      //gunContext.user.get('my-chats').get(id.toString()).put(null);
      if(data && !chatIds.includes(id.toString())){
        chatIds.push(id.toString());
        setChats((prev)=>([...prev, {...data, id}]))
      }
    })
  }

  const acceptChat = (chat) => {
    let cData = {...chat}
    delete cData.id;
    const pub = gunContext.gun.user().pair().pub;
    gunContext.user.get('my-chats').get(chat.pair.pub).put(cData);
    gunContext.gun.get('chats').get(chat.pair.pub).get('users').get(pub).put({pkey:pub});
    gunContext.gun.get('chat-requests').get(pub).get(chat.id).put(null);
    getMyChatRequests();
  }

  const decryptChat = async (data, id)=>{
    if(data && !chatRequestIds.includes(id.toString())){
      chatRequestIds.push(id.toString());
      const ownerPair = gunContext.gun.user().pair();
      const passphrase = await gunContext.SEA.secret(data.epub, ownerPair);
      const chatRequest = await gunContext.SEA.decrypt(data.encChat,passphrase);
      setChatRequests((prev)=>([...prev, {...chatRequest,id:id.toString()}]));
    }
  }

  return (
    <Box>
      <Popup
        open={addNew}
        onClose={()=>{setAddNew(false)}}
      >
          <NewChat />
      </Popup>
      <Box sx={{display:'flex', justifyContent:'space-between'}}>
        <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Chats"  />
          <Tab label="Requests" />
        </Tabs>
        <IconButton onClick={()=>setAddNew(true)}>
          <AddIcon />
        </IconButton>
      </Box>
      <TabPanel value={tab} index={0}>
        {chats.map((chat, idx)=>(
          <Box key={idx} sx={{ marginBottom: '10px' }}>
            <Card onClick={()=>navigate(`/chat/${chat.id}`)}>
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
          </Box>
        ))}
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {chatRequests.map((chat, idx)=>(
          <Box key={idx} sx={{ marginBottom: '10px' }}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar 
                    alt="Chat Image"
                    src={chat.pic}
                  />
                }
                action={
                  <IconButton onClick={()=>acceptChat(chat)}>
                    <CheckCircleOutline />
                  </IconButton>
                }
                title={chat.name}
                subheader={chat.description}
              />
            </Card>
          </Box>
        ))}
      </TabPanel>
    </Box>
  )
}

export default Chats