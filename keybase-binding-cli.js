#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

import { Command } from 'commander';
import { get_team_topics, export_attachments_for_topic, create_folder_if_not_exist, get_keybase_user, export_team_memberships, export_team_topics } from './get_everything.js';
import { dumb_to_elastic } from './elastic_dump.js';

const program = new Command();

program
  .option('-t, --teams', 'export list team to a file print to console')
  .option('-g, --groups', '*TODO* export group chats to a a file and print to console')
  .option('-tc --teamchats <type>', 'export specified team chat')
  .option('-gc --groupchat <type>', '*TODO* export specified group chat')
  .option('-a --attachments', 'Chose weather to export attachments', false)
  .option('-p --path <type>', 'Export Location', './exports')
  .option('-i --import <type>', 'specify filepath of chat logs you want to import')
  .option('-it --importteam <type>', 'specify team you want to import your chat logs to')
  .option('-ic --importchannel <type>', 'specify the channel on a team to import your logs to')
  .option('-en --elasticnode <type>', 'Elasticsearch node')
  .option('-eu --elasticuser <type>', 'Elasticsearch username')
  .option('-ep --elasticpass <type>', 'Elasticsearch password')
  .option('-ei --elasticindex <type>', 'Elasticsearch index')



function import_chat_logs(file_path, keybase_team, keybase_channel){
  let msg_count = 0
  let rawdata = JSON.parse(fs.readFileSync(file_path));
  // for(var i = rawdata.length - 1; i >= 0; i--){ // Prod
  for(var i = rawdata.length - 1; i >= rawdata.length - 20; i--){ // Test
    if (rawdata[i].msg.content.type == 'text'){
      var msg_body = rawdata[i].msg.content.text.body
      var msg_from = rawdata[i].msg.sender.username
      var msg_date = Date(rawdata[i].sent_at_ms)
      var msg_content = `${msg_body}\n\nFrom @${msg_from} on ${msg_date}\n`
      msg_content = msg_content.replace(/['"]+/g, '')
      msg_content = msg_content.replace(/[\n]+/g, '\\n')
      console.log(msg_content)
      let keybase_json = `'{"method": "send", "params": {"options": {"channel": {"name": "${keybase_team}", "members_type": "team", "topic_name": "${keybase_channel}"}, "message": {"body": "${msg_content}"}}}}'`
      let cmd_string = `keybase chat api -m ${keybase_json}`
      console.log(cmd_string)
      let cmd_output = execSync(cmd_string).toString("utf8")
      msg_count++
    }
  }
  console.log("You just imported " + msg_count + " messages")
}

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
  if (options.teams) {
    team_memberships.forEach((team) => {
      console.log(team.Team)
    })
  }
  // Saves in options.path, user / teams / team_name
  // TODO CREATE DIRECTORIES IF NOT THERE
  if (options.teamchats) {
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
  if (options.attachments) {
    await export_attachments_for_topic(options.path, keybase_user, options.teamchats)
  }
  if (options.path && options.teamchats && options.elasticnode && options.elasticuser && options.elasticpass && options.elasticindex) {
    console.log("Indexing to elasticsearch")
    await dumb_to_elastic(
      options.path, 
      keybase_user, 
      options.teamchats,
      options.elasticnode,
      options.elasticuser,
      options.elasticpass,
      options.elasticindex )
    console.log("Done indexing everything to elasticsearch")
  } else {
    console.log("Not indexing anything to elasticsearch")
  }

  if (options.import && options.importteam && options.importchannel) {
    console.log("Importing Messages")
    await import_chat_logs(
      options.import, 
      options.importteam, 
      options.importchannel
    )
    console.log("Done Importing Messages")
  }
  
  
  // let team_topics = await export_team_topic(
  //   options.path,
  //   keybase_user,
  //   "dentropydaemon"
  // )
  process.exit(1)
}

main()