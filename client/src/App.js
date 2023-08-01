import "./App.css";
import React, { useState, useEffect } from "react";
import store from "store2";

import DataService from "./services/service";

// MUI imports
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Components
import AppBar from "./components/AppBar"
import NewEntry from "./components/NewEntry"
import Card from "./components/Card";

// MUI dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  const [likedPage, setLikedPage] = useState(false)
  const [entries, setEntries] = useState(null)

  // get all entries on mount
  useEffect(() => {
    DataService.getAllEntries()
      .then((response) => {
        if (response.data) {
          setEntries(response.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);


  return (
    <ThemeProvider theme={darkTheme}>
        <AppBar setLikedPage={setLikedPage} />
        {!entries && (
          <Box sx={{ display: 'flex' }} className="loading">
            <CircularProgress />
          </Box>
        )}
        {entries && likedPage && (
          <>
            {Object.keys(store()).length === 0 && (
              <Typography
                sx={{ mr: 2, display: { xs: 'none', md: 'flex' }, color: "white" }}
                className="none-liked"
                style={{ cursor: "pointer" }}
                variant="body"
                component="div"
              >
                0 liked content.
              </Typography>
            )}
            {Object.values(store())?.map((obj, index) => (
              <div className="center-cards">
                <Card
                  key={obj.entryId}
                  entryId={obj.entryId}
                  caption={obj.caption}
                  date={obj.date}
                  mediaType={obj.mediaType}
                  url={obj.url}
                />
              </div>
            ))}
          </>
        )}
        {!likedPage && (
          <>
            <div className="center">
              <NewEntry
              />
            </div>
            {entries?.toReversed().map((obj, index) => (
              <div className="center-cards">
                <Card
                  key={obj._id}
                  entryId={obj._id}
                  caption={obj.caption}
                  date={obj.date}
                  mediaType={obj.mediaType}
                  url={obj.url}
                />
              </div>
            ))}
          </>
        )}
    </ThemeProvider>
  );
}

export default App;