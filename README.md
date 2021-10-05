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
  * List teams `-t --teams` or list group chats `-g --groups`
  * Chat logs from team chats `-tc --team-chats` or logs from group chat`-gc --group-chat`
  * Attachments from team chats `-a --attachments` (defaults to no)
  * Export path `-p --path` (defaults to ./exports)
