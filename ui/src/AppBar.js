import React from 'react';
import { makeStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    appbar: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        flexGrow: 1,
        textAlign: 'center',
        justifyContent: 'center'
    }
}));

export default function JujuAppBar() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position="static" className="classes.appbar">
                <Toolbar>
                    <Typography variant="h5" className={classes.title}>
                        Juju Jokes
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}