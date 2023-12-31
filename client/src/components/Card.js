import React, { useState, useEffect } from 'react';
import store from "store";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';

import Share from "./Share"

import DataService from "../services/service";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function SpaceCard(props) {
  const { entryId, caption, date, mediaType, url } = props

  const [liked, setLiked] = useState(false)
  const [expanded, setExpanded] = useState(false);

  // explanation expand handler
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  // handler that triggers when like button clicked
  function handleLike() {
    const entry = { entryId, caption, date, mediaType, url }
    liked ? store.remove(`${entryId}`) : store.set(`${entryId}`, entry)
    setLiked(!liked)
  }

  async function handleDelete(entryId) {
    try {
      await DataService.deleteEntry(entryId);

      window.location.reload()
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  }

  // set liked value to true on mount if in localStorage
  useEffect(() => {
    if (store.get(`${entryId}`)) {
      console.log(entryId)
      setLiked(true);
    }
  }, []);

  return (
    <Card sx={{ width: 560, opacity: 0.75 }}>
      <CardHeader
        style={{ textAlign: 'center' }}
        titleTypographyProps={{variant:'h7' }}
        title={caption}
      />
      {mediaType === "image" && (
        <CardMedia
            component="img"
            image={url}
            alt="Space Image"
        />
      )}
      {mediaType === "video" && (
        <CardMedia
            sx={{ height: 1000 }}
            component="iframe"
            src={url}
            alt="Space Video"
        />
      )}
      <CardActions disableSpacing >
        <IconButton aria-label="add to favorites" onClick={handleLike}>
          {liked ? (
              <FavoriteIcon />
          ) : (
              <FavoriteBorderIcon />
          )}
        </IconButton>
        <Share url={url} />
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="body2" color="text.secondary" style={{ margin: "10px 0 20px 20px" }}>
            {"Uploaded on " + date}
          </Typography>
          <IconButton aria-label="add to favorites" onClick={() => handleDelete(entryId)} style={{ margin: "0 10px 10px 0px" }}>
            <DeleteOutlinedIcon style={{ fontSize: "20px" }} />
          </IconButton>
        </div>
      </Collapse>
    </Card>
  );
}