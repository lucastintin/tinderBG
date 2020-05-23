const express = require('express');
const router = express.Router();
const config  = require('./../config/config');

const { Boardgame } = require('../models/boardgame.model');