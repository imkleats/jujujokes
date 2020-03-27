import React, { useState } from 'react';
import { Button, Card, CardContent, CardActions, makeStyles, Typography } from '@material-ui/core'
import Typist from 'react-typist';

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

const IntroCard = (props) => {
    const [introDone, setIntroDone] = useState(false);
    const [firstLine, setFirstLine] = useState(false);
    const classes = useStyles();

    return (
        <Card className={classes.jokeSetup}>
            <CardContent>
                <Typography component="div">
                <Typist avgTypingDelay={100} cursor={{hideWhenDone: true, hideWhenDoneDelay: 0}} 
                    onTypingDone={() => setFirstLine(true)} >
                    <span>Hi there! </span> 
                    <Typist.Delay ms={1000} />
                    <span>My name is Juju.</span>
                </Typist>
                { !firstLine ? (<br />): (
                    <Typist avgTypingDelay={100} cursor={{hideWhenDone: true, hideWhenDoneDelay: 0}} 
                        onTypingDone={() => setIntroDone(true)} >
                    <Typist.Delay ms={1000} />
                    <span>Do you want to hear a joke?</span>
                    </Typist>
                ) }
                { !introDone ? <br /> : "" }
                </Typography>
            </CardContent>
            <CardActions className={classes.jokeActions}>
                {
                    introDone ? (
                        <Button variant="contained" color="primary" onClick={props.hearJoke}>Yes, please!</Button>
                    ) : (
                        <br />
                    )
                }
            </CardActions>
        </Card>
    )
};

export default IntroCard;