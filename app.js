/**
 * Video: Node.js API Authentication With JWT
 * Link: https://www.youtube.com/watch?v=7nafaH9SddU
 */

'use strict';
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');

const app = express();
const constants = {
    port: 5000,
    password: 'password',
    datetimeFormat: {
        mysql: 'YYY-MM-DD hh:ii:ss'
    },
    secretKey: 'secretkey'
};

app.get('/api', (req, res) => {
    res.json({
        message: 'Hello World'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, constants.secretKey, (err, authData) => {
        if(err) {
            console.log(err);
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created',
                authData
            });
        }
    });
});

app.post('/api/login', (req, res) => {
    //mock user
    const user = {
        id: 1,
        username: 'davina',
        email: 'davina@gmail.com',
        password: bcrypt.hashSync(constants.password, 1),
        createdAt: moment().format(constants.datetimeFormat.mysql),
        updatedAt: moment().format(constants.datetimeFormat.mysql)
    };
    
    jwt.sign({user}, constants.secretKey, { expiresIn: '30s' }, (err, token) => {
        res.json({
            token
        });
    });
});

//format of token
// Authorization: Bearer <access_token>

//verify token
function verifyToken(req, res, next) {
    //get auth header value
    const bearerHeader = req.headers['authorization'];
    //check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
        //split at the space
        const bearer = bearerHeader.split(' ');
        //get token from array
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        //next middleware
        next();
    } else {
        //forbidden
        res.sendStatus(403);
    }
}

app.listen(constants.port, () => console.log(`Server started on port: ${constants.port}.`));