// index.ts
import { Command } from 'commander';
import { get_team_topics, create_folder_if_not_exist, get_keybase_user, export_team_memberships, export_team_topics } from './get_everything.js';

const program = new Command();

program
  .option('-t, --teams', true)
  .option('-g, --groups', true)
  .option('-tc --teamchats <type>', true)
  .option('-gc --groupchat <type>', true)
  .option('-a --attachments <type>', 'Chose weather to export attachments', false)
  .option('-p --path <type>', 'Export Location', './exports');

async function main() {
  program.parse(process.argv);
  const options = program.opts();
  let keybase_user = await get_keybase_user();
  // console.log('CLI Variables:');
  // console.log("options.teams", options.teams)
  // console.log("options.teams", options.groups)
  // console.log("options.team-chats", options.teamchats)
  // console.log("options.group-chat", options.groupchat)
  // console.log("options.attachments", options.attachments)
  // console.log("options.path", options.path)
  create_folder_if_not_exist(options.path)
  create_folder_if_not_exist(`${options.path}/${keybase_user}`)
  create_folder_if_not_exist(`${options.path}/${keybase_user}/teams`)
  let team_memberships = await export_team_memberships(
    `${options.path}/${keybase_user}/team_memberships.json`
  )
  // Saves in options.path, user / teams / team_name
  // TODO CREATE DIRECTORIES IF NOT THERE
  if (options.teamchats){
    console.log("IT RAN")
    let team_list = [];
    team_memberships.forEach((team) => {
      team_list.push(team.Team)
    })
    if (team_list.indexOf(options.teamchats) > 1 ){
      console.log(`Exporting ${options.teamchats}`)
      // let team_topics = await get_team_topics(options.path, keybase_user, options.teamchats)
      // export_team_topics
      // console.log(team_topics)
      await export_team_topics(options.path, keybase_user, options.teamchats)
    } else {
      console.log(`You do not appear to be on team ${options.teamchats}`)
    }
  }
  
  // let team_topics = await export_team_topic(
  //   options.path,
  //   keybase_user,
  //   "dentropydaemon"
  // )
  process.exit(1)
}
main()