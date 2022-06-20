import React, { useContext, useEffect, useState } from 'react'
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardHeader,
    Avatar,
    IconButton
} from "@mui/material";
import { GunContext } from '../../../gun/GunProvider';
import IpfsService from '../../../services/ipfsService';
import FileUploader from '../../../shared/FileUploader';
import DotsMobileStepper from '../../../shared/DotsMobileStepper';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import DeleteIcon from '@mui/icons-material/Delete';

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const NewPost = ({cancelPost, handleSavePost}) => {

    const gunContext = useContext(GunContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('')
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [audios, setAudios] = useState([]);
    const [files, setFiles] = useState([]);
    const [activeStep, setActiveStep] = useState(0);
    const [imageIdx, setImageIdx] = useState(0);
    const [videoIdx, setVideoIdx] = useState(0);
    const [audioIdx, setAudioIdx] = useState(0);
    const [fileIdx, setFileIdx] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [count, setCount] = useState(0);

    const handleImageChange = async (data) => {
        try {
            const uploaded = await IpfsService.uploadFile(data);
            const pic = IpfsService.getFilePath(uploaded.path);
            setImages((prev)=>([...prev, pic]))
        } catch (error) {
            console.log(error);
        }
    }

    const deleteImage = () => {
        const imgs = [...images]
        imgs.splice(imageIdx,1);
        setImages(imgs);
        setImageIdx(0);
    }

    const handleVideoChange = async (data) => {
        try {
            const uploaded = await IpfsService.uploadFile(data);
            const pic = IpfsService.getFilePath(uploaded.path);
            setVideos((prev)=>([...prev, pic]))
        } catch (error) {
            console.log(error);
        }
    }

    const deleteVideo = () => {
        const vdos = [...videos]
        vdos.splice(videoIdx,1);
        setVideos(vdos);
        setVideoIdx(0);
    }

    const handleAudioChange = async (data) => {
        try {
            const uploaded = await IpfsService.uploadFile(data);
            const pic = IpfsService.getFilePath(uploaded.path);
            setAudios((prev)=>([...prev, pic]))
        } catch (error) {
            console.log(error);
        }
    }

    const deleteAudio = () => {
        const ados = [...audios]
        ados.splice(audioIdx,1);
        setAudios(ados);
        setAudioIdx(0);
    }

    const handleFileChange = async (data) => {
        try {
            const uploaded = await IpfsService.uploadFile(data);
            const pic = IpfsService.getFilePath(uploaded.path);
            setFiles((prev)=>([...prev, pic]))
        } catch (error) {
            console.log(error);
        }
    }

    const deleteFile = (idx) => {
        const fls = [...files]
        fls.splice(idx,1);
        setFiles(fls);
        setFileIdx(0);
    }

    const savePost = () => {
        const pub = gunContext.gun.user().pair().pub
        gunContext.gun.user(pub).once(ack => {
            const alias = ack.alias;
            gunContext.user.get('profile').once((data, key) => {
                if (data) {
                    const post = {
                        pkey:pub,
                        alias,
                        pic:data.pic,
                        timeStamp:Date.now(),
                        title,
                        description,
                        images:JSON.stringify(images),
                        audios:JSON.stringify(audios),
                        videos:JSON.stringify(videos),
                        files:JSON.stringify(files)
                    }
                    gunContext.gun.get('posts').set(post);
                }
            })
        })
        handleSavePost();
    }

    return (
        <Box >
            <Typography>
                New Post
            </Typography>
            {activeStep === 0 && (
                <Box>
                    <TextField 
                        label='Title'
                        size='small'
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        sx={{marginY:'10px', width:'100%'}}
                    />
                    <TextField 
                        label='Description'
                        size='small'
                        value={description}
                        multiline
                        rows={5}
                        onChange={(e)=>setDescription(e.target.value)}
                        sx={{marginY:'10px', width:'100%'}}
                    />
                </Box>
            )}
            {activeStep === 1 &&(
                <Box>
                    <Typography>
                        Images
                    </Typography>
                    <Box sx={{marginBottom:'10px',display:'flex', justifyContent:'space-between'}}>
                        <Typography>
                            {imageIdx+1}/{images.length}
                        </Typography>
                        <Box>
                            {images.length > 0 && (
                            <Button color='error' size="small" variant="contained" onClick={deleteImage}>Delete</Button>
                            )}
                            <FileUploader onFileChange={handleImageChange} fileType="image/*">
                                <Button component="span" size="small" variant="contained">Add Image</Button>
                            </FileUploader>
                        </Box>
                    </Box>
                    {images.length > 0 && (
                        <Box>
                            <SwipeableViews
                                index={imageIdx}
                                onChangeIndex={(i)=>setImageIdx(i)}
                            >
                                {images.map((i,idx)=>(
                                    <Box key={`image-${idx}`}>
                                        <img 
                                            style={{width:'100%'}}
                                            alt={i}
                                            src={i}
                                        />
                                    </Box>
                                ))}
                            </SwipeableViews>
                        </Box>
                    )}
                </Box>
            )}
            {activeStep === 2&&(
                <Box>
                    <Typography>
                        Videos
                    </Typography>
                    <Box sx={{marginBottom:'10px',display:'flex', justifyContent:'space-between'}}>
                        <Typography>
                            {videoIdx+1}/{videos.length}
                        </Typography>
                        <Box>
                            {videos.length > 0 && (
                            <Button color='error' size="small" variant="contained" onClick={deleteVideo}>Delete</Button>
                            )}
                            <FileUploader onFileChange={handleVideoChange} fileType="video/*">
                                <Button component="span" size="small" variant="contained">Add Video</Button>
                            </FileUploader>
                        </Box>
                    </Box>
                    {videos.length > 0 && (
                        <Box>
                            <SwipeableViews
                                index={videoIdx}
                                onChangeIndex={(i)=>setVideoIdx(i)}
                            >
                                {videos.map((i,idx)=>(
                                    <Box key={`image-${idx}`}>
                                        <video 
                                            style={{width:'100%'}}
                                            controls
                                        >   
                                            <source src={i}></source>
                                        </video>
                                    </Box>
                                ))}
                            </SwipeableViews>
                        </Box>
                    )}
                </Box>
            )}
            {activeStep === 3&&(
                <Box>
                    <Typography>
                        Audios
                    </Typography>
                    <Box sx={{marginBottom:'10px',display:'flex', justifyContent:'space-between'}}>
                        <Typography>
                            {audioIdx+1}/{audios.length}
                        </Typography>
                        <Box>
                            {audios.length > 0 && (
                            <Button color='error' size="small" variant="contained" onClick={deleteAudio}>Delete</Button>
                            )}
                            <FileUploader onFileChange={handleAudioChange} fileType="audio/*">
                                <Button component="span" size="small" variant="contained">Add Audio</Button>
                            </FileUploader>
                        </Box>
                    </Box>
                    {audios.length > 0 && (
                        <Box>
                            <SwipeableViews
                                index={audioIdx}
                                onChangeIndex={(i)=>setAudioIdx(i)}
                            >
                                {audios.map((i,idx)=>(
                                    <Box key={`audio-${idx}`}>
                                        <audio 
                                            style={{width:'100%'}}
                                            controls
                                        >   
                                            <source src={i}></source>
                                        </audio>
                                    </Box>
                                ))}
                            </SwipeableViews>
                        </Box>
                    )}
                </Box>
            )}
            {activeStep === 4&&(
                <Box>
                    <Typography>
                        Files
                    </Typography>
                    <Box sx={{marginBottom:'10px',display:'flex', justifyContent:'space-between'}}>
                        <Typography>
                            files: {files.length}
                        </Typography>
                        <Box>
                            <FileUploader onFileChange={handleFileChange} >
                                <Button component="span" size="small" variant="contained">Add File</Button>
                            </FileUploader>
                        </Box>
                    </Box>
                    {files.length > 0 && (
                        <Box sx={{display:'flex', flexDirection:'column'}}>
                            {files.map((i,idx)=>(
                                <Card key={`file-${idx}`} sx={{marginBottom:'5px'}}>
                                    <CardHeader 
                                        avatar={
                                            <Avatar>
                                                <FilePresentIcon />
                                            </Avatar>
                                        }
                                        title={`File-${idx}`}
                                        action={
                                            <IconButton onClick={()=>deleteFile(idx)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    /> 
                                </Card>
                            ))}
                        </Box>
                    )}
                </Box>
            )}
            <DotsMobileStepper steps={5} activeStep={activeStep} setActiveStep={setActiveStep} />
            <Box sx={{display:'flex', justifyContent:'end', mt:'10px'}}>
                <Button variant="contained" sx={{mr:1}} onClick={savePost}>Save</Button>
                <Button variant='outlined' onClick={cancelPost}>Cancel</Button>
            </Box>
        </Box>
    )
}

export default NewPost