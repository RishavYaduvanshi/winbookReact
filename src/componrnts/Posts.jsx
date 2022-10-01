import React, { useState } from 'react'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { Divider, InputAdornment, ListItemIcon } from '@mui/material';
import { Menu, MenuItem, styled } from '@mui/material';
import { alert } from 'react-custom-alert';
import 'react-custom-alert/dist/index.css';
import { useNavigate } from 'react-router-dom';
import CommentIcon from '@mui/icons-material/Comment';
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import Comments from './Comments/Comments';
import { Box } from '@mui/system';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import MobileScreenShareIcon from '@mui/icons-material/MobileScreenShare';
import ChatIcon from '@mui/icons-material/Chat';
import FileCopyIcon from '@mui/icons-material/FileCopy';

const StyledTextField = styled(TextField)({
  fullWidth: true,
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderRadius: 50,
    },
  },

});


const Posts = (props) => {
  //console.log("POST DATA: ",props);
  const [like, setlike] = useState(props.ob.liked_cnt);
  const [status, setstatus] = useState(props.ob.likedStatus);
  const history = useNavigate();
  const [state, setstate] = useState(false);
  const [com, setcom] = useState("");

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0');
  var yyyy = today.getFullYear();
  today = dd + '/' + mm + '/' + yyyy;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);


  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };




  const deletePost = () => {
    setAnchorEl(false);
    fetch('https://winbookbackend.d3m0n1k.engineer/post/'+props.ob.pk+'/', {
      method: 'DELETE',
      headers: {
        "Accept": "application/json",
        "Authorization": "Token " + localStorage.getItem('authtoken')
      },
    }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        window.location.reload(false);
        alert({message:'Post deleted',type:'warning'});
      }
    })
  }

  const likePost = () => {
    fetch('https://winbookbackend.d3m0n1k.engineer/post/' + props.ob.pk + '/like/', {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Authorization": "Token " + localStorage.getItem('authtoken')
      },
    }).then((response) => {
      //console.log(response);
      if (response.status >= 200 && response.status < 300) {
        response.json().then((data) => {
         // console.log(data);
          setlike(data.likes_count);
          setstatus(data.hasOwnProperty('liked_status') ? data.liked_status : true);
        })
      }
    })
  }

  const viewprofile = () => {
    //console.log(props.ob.user);
    history('/'+props.ob.userName+'/');
  }

  const copyFunction = (text) => {
    navigator.clipboard.writeText(text);
    setAnchorEl(false);
    alert({message:'Link copied to clipboard',type:'success'});
  }
  var datetime = new Date(props.ob.created_at);
  // console.log(like);
  
  const changestate = () => {
    if(state === true){
      setstate(false);
    }
    else{
      setstate(true);
    }
  }
  
  const commentget = (e) => {
    //console.log(e.target.value);
    setcom(e.target.value)
  }

  const postcomment = (e) => {
    e.preventDefault();
    const comm = JSON.stringify({
      comment: com
    });
    fetch('https://winbookbackend.d3m0n1k.engineer/post/'+props.ob.pk+'/comment/', {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Authorization": "Token " + localStorage.getItem('authtoken'),
        "Content-Type": "application/json"
      },
      body: comm,
    }).then((response) => {
      if (response.status >= 200 && response.status < 300) {
        setcom("");
        setstate(false);
        props.func(true);
        alert({message:'Comment posted',type:'success'});
      }
      else{
        alert({message:'The comment ws not posted due to some error OR You are not Logged In!',type:'error'});
      }
    })
  }

  const pull_data1 = (data) => {
    props.func(false);
  }



  

  return (
    <Card sx={{ margin: 0.5 }}>
      <CardHeader
      avatar={
        <img src={props.ob.userDp} alt="profile pic" style={{ width: 40, height: 40, borderRadius: 20 }} onClick={viewprofile}/>
      }
      action={
        <IconButton aria-label="settings">
          <MoreVertIcon onClick={handleClick} />
        </IconButton>
      }
      title={<Typography onClick={viewprofile}>{props.ob.userName}</Typography>
      }
      subheader={datetime.toLocaleString()}
    />
      <CardMedia
        component="img"
        height="20%"
        image={props.ob.url}
        alt={props.ob.userName}
        onClick={() => history('/post/'+props.ob.pk+'/')}
      />
      <CardContent>
        <Typography variant="body1" fontWeight={500} color="text.secondary">
          {props.ob.caption}
        </Typography>
        <br/>
        <Divider />
        <Typography variant="body2" color="text.secondary" marginTop={1} marginBottom={0}>
          Liked By <strong>{like}</strong> People in total
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          {status === true ? <><Favorite sx={{ color: "red" }} onClick={likePost} /></> : <><FavoriteBorder color="primary" onClick={likePost} /></>}
          {/* <Checkbox icon={<FavoriteBorder />}  checkedIcon={<Favorite sx={{color:"red"}}/>} onClick={likePost}/> */}
          <h6>{like}</h6>
        </IconButton>
        <IconButton aria-label="comment">
          <CommentIcon color="primary" onClick={changestate}/>
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon color="primary" onClick={()=> copyFunction(window.location.origin+"/post/"+props.ob.pk+"/")} />
        </IconButton>
      </CardActions>
      <Divider/>
      {props.ob.comments.length!==0 ? <Box sx={{display:"flex", width:"100%", justifyContent:"flex-end", alignItems:"flex-end"}}><IconButton onClick={() => history('/post/'+props.ob.pk+'/')} sx={{fontSize:16}}>View all {props.ob.comments.length} Comments</IconButton></Box>:<Box sx={{display:"flex", width:"100%", justifyContent:"flex-end", alignItems:"flex-end"}}><Typography fontWeight={300}>No Comments Yet !</Typography></Box>}
      {state===true?<CardContent>
        <StyledTextField id="filled-basic" component='form' onSubmit={postcomment} noValidate fullWidth placeholder="Add your comment" color='primary'  variant="outlined" onChange={commentget}
        InputProps={{
          endAdornment: (
              <InputAdornment position="end">
                 <IconButton type='submit' ><SendIcon color='primary'/></IconButton>
                  </InputAdornment>
          )
        }}
        />
      </CardContent>:<></>}

      {
        props.st?
        <Typography variant="body2" color="text.secondary">
          {props.ob.comments.map((ob) => {
            return (
              <>
                <Comments user={ob.user} comment={ob.comment} funcn={pull_data1} pk={ob.pk} id={props.ob.user}/>
              </>
            )
          })}
        </Typography>:
        <>
        {props.ob.comments.length===0?<></>: 
        <Comments user={props.ob.comments[(props.ob.comments.length)-1].user} id={props.ob.user} comment={props.ob.comments[(props.ob.comments.length)-1].comment} funcn={pull_data1} pk={props.ob.comments[(props.ob.comments.length)-1].pk}/>
      }</>
      }

{/*Menu Item of post*/}
      <Menu
        id="-enu"
        aria-labelledby="demo-positioned-button"
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'left',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {props.ob.userName === localStorage.getItem('user') ? <div>
          <MenuItem ><ListItemIcon><EditIcon/></ListItemIcon>Edit Post</MenuItem>
          <Divider />
          <MenuItem onClick={deletePost}><ListItemIcon><DeleteForeverIcon/></ListItemIcon>Delete Post</MenuItem>
          <Divider />
        </div> : <div></div>}
        <MenuItem ><ListItemIcon><MobileScreenShareIcon/></ListItemIcon>Quick Share</MenuItem>
        <Divider />
        <MenuItem ><ListItemIcon><ChatIcon/></ListItemIcon>Send via chats</MenuItem>
        <Divider />
        <MenuItem onClick={()=> copyFunction(window.location.origin+"/post/"+props.ob.pk+"/")} ><ListItemIcon><FileCopyIcon/></ListItemIcon>Copy Link</MenuItem>
      </Menu>
{/*Menu Item of post*/}


    </Card>
  );
}

export default Posts