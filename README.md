# Keybase Binding Nodejs

The nodejs keybase binding is simple. Export everything to the file system via JSON and include a script to dump data to elasticsearch.

## Requirements

* nodejs
* npm

## Setup

* Clone this repo
* `npm install`
* `node get_everything.js`
  * Have to change in line variables to download

## CLI Brainstorming

This git repo should result in a npm package that can function as a CLI to export whatever a user wants.

* Export Options
  * List teams
  * List group chats
  * List git repos
  * Chat logs from team chats
  * Chat logs from groups chat
  * Attachments from team chats 
  * Attachments from team chat
