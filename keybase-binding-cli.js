// index.ts
import { Command } from 'commander';
const program = new Command();

program
  .option('-t, --teams', true)
  .option('-g, --groups', true)
  .option('-tc --teamchats <type>', true)
  .option('-gc --groupchat <type>', true)
  .option('-a --attachments <type>', 'Chose weather to export attachments', false)
  .option('-p --path <type>', 'Export Location', './exports');

program.parse(process.argv);

const options = program.opts();
if (options.debug) console.log(options);
console.log('pizza details:');
console.log("options.teams", options.teams)
console.log("options.team-chats", options.teamchats)
console.log("options.group-chat", options.groupchat)
console.log("options.attachments", options.attachments)
console.log("options.path", (options.path))
