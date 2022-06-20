import React, { useContext, useState, useEffect } from 'react';
import {
    Typography,
    Box,
    Card,
    CardHeader,
    Avatar,
    CardContent,
    Button,
    Pagination
} from "@mui/material";
import { GunContext } from '../../gun/GunProvider';
import { useNavigate } from "react-router-dom";
import Popup from '../../shared/Popup';
import NewPost from './components/NewPost';
import moment from 'moment';

const Dashboard = () => {
    const gunContext = useContext(GunContext);
    const [isPublic, setIsPublic] = useState(false);
    const [addNewPost, setAddNewPost] = useState(false);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);
    const [search, setSearch] = useState('');
    let postIds = [];

    const getPosts = () => {
        postIds=[]
        const ps = []
        setPosts([])
        let index = 0;
        let cnt = 0;
        gunContext.gun.get('posts').map((post, id) => {
            let data = null
            if(!search){
                if(post) {
                    cnt+=1
                    data=post
                }
            }else{
                const s = search.toLocaleLowerCase();
                if(post.title.toLocaleLowerCase().indexOf(s) !== -1
                || post.alias.toLocaleLowerCase().indexOf(s) !== -1)
                {
                    cnt+=1;
                    data = post;
                }
            }
            if(index >= (page-1)*limit && index<(page*limit)){
                if(data && !postIds.includes(id.toString())){
                    postIds.push(id.toString());
                    setPosts((prev) => ([...prev, {...data, id:id.toString()}]));
                }
            }
            if(post) index += 1;
        })
        setCount(cnt);
    }

    useEffect(()=>{
        gunContext.user.get('profile').once((data, key) => {
            if (data) {
                if(data.public) setIsPublic(true);
            }
        })
    },[])

    useEffect(() => {
        getPosts();
    }, [page, limit, search])

    const handleCancelPost = ()=>{
        setAddNewPost(false)
    }

    const handleSavePost = () => {
        setAddNewPost(false)
        setPage(1)
        getPosts();
    }

    const handleChangePage = (event, newPage)=>{
        setPage(newPage);
    }

    return (
        <Box sx={{ width: '100%', flexDirection: 'column' }}>
            <Popup
                open={addNewPost}
                onClose={()=>{setAddNewPost(false)}}
            >
                <NewPost cancelPost={handleCancelPost} handleSavePost={handleSavePost} />
            </Popup>
            {isPublic&&(
                <Box sx={{display:'flex', justifyContent:'end', marginBottom:'10px'}}>
                    <Button variant="contained" onClick={()=>setAddNewPost(true)} >Add New Post</Button>
                </Box>
            )}
            <Box sx={{display:'flex', justifyContent:'end', marginBottom:'10px'}}>
                <Pagination
                    count={Math.ceil(count/limit)}
                    page={page}
                    onChange={handleChangePage}
                />
            </Box>
            <Box sx={{display:'flex', flexDirection:'column'}}>
                {posts.map((post)=>(
                    <Box key={`post-${post.id}`}>
                        <Card sx={{marginBottom:'10px'}}>
                            <CardHeader 
                                avatar={
                                    <Avatar 
                                    alt="Chat Image"
                                    src={post.pic??"/profile.jpg"}
                                    />
                                }
                                title={post.alias}
                                subheader={moment(new Date(post.timeStamp).toISOString()).format('DD/MM/YYYY HH:mm')}
                                sx={{paddingBottom:'5px'}}
                            />
                            <Box sx={{padding:'5px'}}>
                                <Typography variant="subtitle2" display="block">{post.title}</Typography>
                                <Typography variant="caption" display="block" gutterBottom>
                                    {post.description}
                                </Typography>
                            </Box>
                        </Card>
                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default Dashboard