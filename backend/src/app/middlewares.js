import express from 'express';
import cors from 'cors';
import _ from 'lodash';
import { enums } from '../utils/index.js';

const corsPolicy = cors({ origin: '*', methods: _.map(enums.methods, (value, key) => _.upperCase(value)), credentials: true });

const jsonBodyParser = express.json({ limit: '50mb' });

export { jsonBodyParser, corsPolicy };
