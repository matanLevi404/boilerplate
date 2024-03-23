import _ from 'lodash';

const parseVariableName = (name) => _.startCase(_.camelCase(name)).toLowerCase();

export default { parseVariableName };
