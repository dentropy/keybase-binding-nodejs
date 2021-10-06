const testFolder = './exports/dentropy/teams/dentropydaemon';
import fs from 'fs';

fs.readdirSync(testFolder).forEach(file => {
  console.log(file);
});
