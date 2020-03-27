import React, {useState, useEffect} from 'react';
import './App.scss';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { purple, pink } from '@material-ui/core/colors';
import CssBaseline from '@material-ui/core/CssBaseline';
import JujuAppBar from './AppBar';
import RandomJoke from './RandomJoke';
import IntroCard from './MainCard';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: purple,
    secondary: pink
  }
});

function App() {
  
  const [hearJoke, setHearJoke] = useState(false);
  const [randomSetup, setRandomSetup] = useState('Knock knock');
  const [randomPunchline, setRandomPunchline] = useState('Who is there?');

  useEffect(() => {
    getRandomJoke();
  }, [])

  const getRandomJoke = () => {
    fetch('/.netlify/functions/fetchjoke')
    .then(response => response.json())
    .then(result => {
      console.log('Logging the fetch: ', result)
      setRandomSetup(result.data.setup);
      setRandomPunchline(result.data.punchline);
    });
  };

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <JujuAppBar />
    <main className="App">
      { hearJoke ? (
        <RandomJoke setup={randomSetup} punchline={randomPunchline} nextJoke={()=>getRandomJoke()} />
      ) : (
        <IntroCard hearJoke={()=>setHearJoke(true)} />
      ) }
    </main>
    </MuiThemeProvider>
  );
};

export default App;
