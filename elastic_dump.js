import { Client } from '@elastic/elasticsearch'
import fg from 'fast-glob'
import fs from 'fs'

async function dumb_to_elastic(export_dir, keybase_user, export_team_name, elastic_node, elastic_user, elastic_pass, elastic_index){
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
dumb_to_elastic(
    "./exports", 
    "dentropy",
    "dentropydaemon",
    "http://localhost:9200",
    "elastic",
    "7e4NFtqcuR3c9WGk5j1YMxlsGyqjxaC",
    "test420")
export {
    dumb_to_elastic
}