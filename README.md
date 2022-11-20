# Keybase Binding Nodejs

The nodejs keybase binding is simple. Export everything to the file system via JSON and include a script to dump data to elasticsearch.

## Requirements

* nodejs with npm
  * For Mac and Linux users you can use [Node Version Manager](https://github.com/nvm-sh/nvm)
* keybase installed and logged in on your computer

## Example commands

**Help Command**
`npm exec  keybase-binding -- --help`

**Export a list of teams you are logged into**
`npm exec  keybase-binding -- -t`

**Export a team chats**
`npm exec  keybase-binding -- -tc dentropydaemon`

**Export a team chats WITH attachments**
`npm exec  keybase-binding -- -tc dentropydaemon -a`

**Change export path**
`npm exec  keybase-binding -- -t -p ~/Downloads/keybase-exports`

**Import chat logs to another team channel**

``` bash
npm exec  keybase-binding -- \
    -i ./exports/TEAM_NAME/teams/homer_cw/CHANNEL_NAME.json \
    -it dentropydaemon \
    -ic bot-testing`
```

**Export to elasticsearch**

``` bash
# -en Elastic node URL
# -eu Elastic user
# -ep Elastic password
# -ei Elastic index
npm exec  keybase-binding -- -tc dentropydaemon \
  -en http://localhost:9200 -eu elastic -ep yourpass -ei keybase-dentropydaemon

curl -XGET  -iL -u $ELASTIC_USER:$ELASTIC_PASS $ELASTIC_NODE/keybase-*/_settings --insecure my_index/_settings
{
  "index.mapping.total_fields.limit": 2000
}
```
## Development setup

* Join the `@dentropydaemon` team on keybase
* Clone this repo `git clone keybase://team/dentropydaemon/keybase-binding-nodejs`
* `cd keybase-binding-nodejs && npm install && npm link`

## Features to be added (Ordered by priority)

* Elasticsearch dump option
* Export multiple teams with single command
* Export every team or group chat
  * blacklist
* Group chat list and export
* Clone all git repos
* Export team and user drive
