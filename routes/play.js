var express = require('express');
var util = require('../config/util.js');
const { ethers } = require('ethers');
const { LLG } = require('../abis/llg.js');
var router = express.Router();

router.get('/', function(req, res) {
    res.render('partials/play', {
        title: 'Chess Hub - Game',
        user: req.user,
        isPlayPage: true
    });
});

router.post('/', function(req, res) {
    var side = req.body.side;
    //var opponent = req.body.opponent; // playing against the machine in not implemented
    var token = util.randomString(20);
    res.redirect('/game/' + token + '/' + side);
});

let contract = getContract();

router.get('/test', async function(req, res) {
    if (!contract) {
        contract = getContract();
    }
    const decimals = await contract.decimals();
    res.send(decimals)
});

function getContract() {
    if (!process.env.RPC_URL || !process.env.CONTRACT) {
        throw new Error('RPC_URL and CONTRACT must be set in the environment variables');
    }
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    if (!provider) {
        throw new Error('Provider not found');
    }
    if (!process.env.CONTRACT) {
        throw new Error('Contract not found');
    }
    const contract = new ethers.Contract(process.env.CONTRACT, LLG, provider);
    return contract;
}

module.exports = router;