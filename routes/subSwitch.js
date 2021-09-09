var express = require('express');
const { render } = require('../app');
var router = express.Router();

const fs=require('fs');


/* GET currentTime of audio and response subtitle. */
router.post('/', function(req, res, next) {
    
    const currentTime=req.body;

   // fs.readFile('')
   // const subtitle;
    res.send("字11幕");
});

module.exports = router;
