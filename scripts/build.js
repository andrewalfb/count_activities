process.noDeprecation = true;
process.traceDeprecation = false;
process.throwDeprecation = false;
process.env.NODE_NO_WARNINGS = '1';

process.argv[2] = 'build';

require('../node_modules/react-scripts/bin/react-scripts.js');
