import React, {useState} from 'react'
import {
    Box,
    Card,
    CardHeader,
    Avatar,
    CardContent,
    Typography,
    Grid,
    Collapse,
    CardActions,
    IconButton
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandMore from '../../../shared/ExpandButton';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const UserCard = ({user, sendFriendRequest, isFriend}) => {
    const [expand, setExpand] = useState(false);

    return (
        <Box sx={{ marginBottom: '10px' }} >
            <Card>
                <CardHeader
                    avatar={
                        <Avatar
                            alt="User Avatar"
                            src={user.pic ? user.pic : "/profile.jpg"}
                        />
                    }
                    action={
                        <ExpandMore expand={expand} onClick={()=>setExpand(!expand)}>
                            <ExpandMoreIcon />
                        </ExpandMore>
                    }
                    title={`${user.firstname} ${user.lastname}`}
                    subheader={user.username}
                />
                <Collapse in={expand} timeout="auto" unmountOnExit>
                    <CardContent sx={{paddingY:'0px'}}>
                        <Grid container spacing={1}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" component="div">FirstName: {user.firstname}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" component="div">LastName: {user.lastname}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" component="div">Email: {user.email}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="subtitle2" component="div">Mobile: {user.mobile}</Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions sx={{display:'flex', justifyContent:'end', paddingY:'0px'}}>
                        <IconButton onClick={()=>sendFriendRequest(user)}>
                            <PersonAddIcon />
                        </IconButton>
                    </CardActions>
                </Collapse>
            </Card>
        </Box>
    )
}

export default UserCard