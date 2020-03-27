import React, { useState, useEffect } from 'react';
import { CardHeader, CardActions, Button, Card, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    jokeSetup: {
        width: '75%',
        margin: 'auto',
        textAlign: 'center'
    },
    jokePunchline: {
        width: '50%',
        margin: 'auto'
    },
    jokeActions: {
        justifyContent: 'center'
    }
}));

const RandomJoke = ({setup, punchline, nextJoke}) => {
    const [giveUp, setGiveUp] = useState(false);

    useEffect(() => {
        setGiveUp(false);
    }, [setup]);

    const classes = useStyles();

    return (
        <Card className={classes.jokeSetup}>
            <CardHeader title={setup}>
                { setup }
            </CardHeader>
            <CardHeader title={                
                    giveUp ? punchline : ""
                } >
                <span> </span>
            </CardHeader>
            <CardActions className={classes.jokeActions} >
                {
                    giveUp ? (
                        <Button variant="contained" color="primary" onClick={nextJoke}>Hit me with another!</Button>
                    ) : (
                        <Button variant="contained" color="primary" onClick={()=>setGiveUp(true)}>Do you give up?</Button>
                    )
                }
            </CardActions>
        </Card>
    );
}

export default RandomJoke;