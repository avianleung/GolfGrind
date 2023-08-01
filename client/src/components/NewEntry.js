import React, { Fragment, useState } from 'react';

import DataService from "../services/service";

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { TextField, Typography } from "@mui/material";

export default function NewEntry (props) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [caption, setCaption] = useState("")
  const [open, setOpen] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleCaptionChange = (event) => {
    setCaption(event.target.value);
  };

  const handleUpload = async (e) => {
    if (caption.length && selectedFile) {
      e.preventDefault();

      const today = new Date();

      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed, so add 1 to get the correct month
      const day = String(today.getDate()).padStart(2, '0');

      const date = `${year}-${month}-${day}`;

      const formData = new FormData();
      formData.append('file', selectedFile);    
      formData.append('caption', caption);
      formData.append('date', date);

      try {
        await DataService.createEntry(formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        window.location.reload()
      } catch (error) {
        console.error('Error saving entry:', error);
      }
    } else {
      setOpen(true)
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </Fragment>
  );

  return (
    <>
      <Card sx={{ width: 560, opacity: 0.75  }}>
        <CardHeader
          titleTypographyProps={{variant:'h7' }}
          title="Create New Entry"
          style={{ textAlign: "center" }}
        />
            <CardContent>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <Stack width={400} alignItems="center" spacing={3}>
                  <Button
                    variant="contained"
                    component="label"
                    size='sm'
                  >
                    Choose File
                    <input
                      id="upload-content"
                      hidden
                      accept="image/*, video/*"
                      type="file"
                      onChange={handleFileChange}
                    />
                  </Button>
                  { selectedFile && (
                    <Typography variant="subtitle1" gutterBottom>
                      {selectedFile.name}
                  </Typography>
                  )}
                      <TextField
                        id="filled-multiline-static"
                        fullWidth
                        label="Caption"
                        multiline
                        rows={2}
                        value={caption}
                        onChange={handleCaptionChange}
                        variant="filled"
                      />
                    <Button variant="contained" component="span" onClick={handleUpload}>
                      Upload
                    </Button>
                </Stack>
              </div>
            </CardContent>
          </Card>
          <Snackbar
            open={open}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            onClose={handleClose}
            message="Caption and file both required for upload."
            action={action}
          />
        </>
  );
}