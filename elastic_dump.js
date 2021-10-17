import { Client } from '@elastic/elasticsearch'
import fg from 'fast-glob'
import fs from 'fs'

async function dumb_to_elastic_single(export_dir, keybase_user, export_team_name, elastic_node, elastic_user, elastic_pass, elastic_index){
    const client = new Client({ 
        node: elastic_node,
        auth: {
            username: elastic_user,
            password: elastic_pass
        },
        ssl: {
            rejectUnauthorized: false
        }
    })
    export_dir = export_dir.split("/")[export_dir.split("/").length - 1]
    let glob_path = `**/${export_dir}/${keybase_user}/teams/${export_team_name}/*.json`
    let files_to_index = await fg.sync([glob_path])
    for(let j = 0; j < files_to_index.length; j++){
        let file_content = fs.readFileSync(files_to_index[j], 'utf8')
        let dataset = JSON.parse(file_content)
        //console.log(dataset)]
        for(let i = 0; i < dataset.length; i++){
            //console.log(tmp_message)
            //console.log(dataset[i])
            let result = await client.index({
                index: elastic_index,
                body: dataset[i]
            })
            console.log(result)
        }
    }
    // files_to_index.forEach((topic_messages) => {

    //     // dataset.forEach((tmp_message) => {
    //     //     //console.log(tmp_message)
    //     //     let result = client.index({
    //     //         index: elastic_index,
    //     //         body: tmp_message
    //     //     })
    //     //     console.log(result)
    //     // })
    // })
}

async function dumb_to_elastic(
    export_dir,
    keybase_user,
    export_team_name,
    elastic_node,
    elastic_user,
    elastic_pass,
    elastic_index)
    {
    const client = new Client({ 
        node: elastic_node,
        auth: {
            username: elastic_user,
            password: elastic_pass
        },
        ssl: {
            rejectUnauthorized: false
        }
    })
    export_dir = export_dir.split("/")[export_dir.split("/").length - 1]
    let glob_path = `**/${export_dir}/${keybase_user}/teams/${export_team_name}/*.json`
    let files_to_index = await fg.sync([glob_path])
    let create_index_cmd = await client.create({
        id: "PaulWasHerePlaceholder",
        index: elastic_index,
        body: {
            hello:"world"
        }
    })
    console.log(create_index_cmd)
    var response = await client.indices.putSettings({
        index: elastic_index,
        body:{
            "index.mapping.total_fields.limit": 2000
        }
    }
    )
    response = await client.indices.putMapping({
        index: elastic_index,
        body: {
          "properties": {
            "msg.channel.topic_name": { 
              "type":     "text",
              "fielddata": true
            },
            "msg.content.type": { 
              "type":     "text",
              "fielddata": true
            },
            "msg.sender.username": { 
              "type":     "text",
              "fielddata": true
            },
            "msg.content.reaction.b": { 
              "type":     "text",
              "fielddata": true
            },
            "msg.channel.name": { 
              "type":     "text",
              "fielddata": true
            }
          }
        }
      })
    for(let j = 0; j < files_to_index.length; j++){
        let file_content = fs.readFileSync(files_to_index[j], 'utf8')
        let dataset = JSON.parse(file_content)
        const body = dataset.flatMap(doc => [{ index: { _index: elastic_index } }, doc])

        const { body: bulkResponse } = await client.bulk({ refresh: true, body })
    
        if (bulkResponse.errors) {
        const erroredDocuments = []
        // The items array has the same order of the dataset we just indexed.
        // The presence of the `error` key indicates that the operation
        // that we did for the document has failed.
        bulkResponse.items.forEach((action, i) => {
            const operation = Object.keys(action)[0]
            if (action[operation].error) {
            erroredDocuments.push({
                // If the status is 429 it means that you can retry the document,
                // otherwise it's very likely a mapping error, and you should
                // fix the document before to try it again.
                status: action[operation].status,
                error: action[operation].error,
                operation: body[i * 2],
                document: body[i * 2 + 1]
            })
            }
        })
        console.log(erroredDocuments)
        }
    
        const { body: count } = await client.count({ index: elastic_index })
        console.log(count)
    }
}

// dumb_to_elastic_bulk(
//     "./exports", 
//     "dentropy",
//     "dentropydaemon",
//     "http://localhost:9200",
//     "elastic",
//     "7e4NFtqcuR3c9WGk5j1YMxlsGyqjxaC",
//     "test423")

export {
    dumb_to_elastic
}