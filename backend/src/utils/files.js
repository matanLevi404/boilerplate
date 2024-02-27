import path from 'path';
import { globSync } from 'glob';
import _ from 'lodash';

const __dirname = path.resolve();

const getFilePath = (filePath) => path.join(__dirname, filePath);

const globFiles = (globPath) => _.map(globSync(globPath), (relativePath) => getFilePath(relativePath));

export default { globFiles, getFilePath };
