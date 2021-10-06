import { create_folder_if_not_exist, get_keybase_user, export_team_memberships, export_team_topic } from './get_everything.js';

async function main(export_path){
    let keybase_user = await get_keybase_user();
    create_folder_if_not_exist(`${export_dir}/${keybase_user}`)
    create_folder_if_not_exist(`${export_dir}/${keybase_user}/teams`)
    console.log(my_user)
    let team_memberships = await export_team_memberships(
        `${export_dir}/${keybase_user}/team_memberships.json`
    )
    // Saves in export_dir, user / teams / team_name
    // TODO CREATE DIRECTORIES IF NOT THERE
    let team_topics = await export_team_topic(
        export_path,
        keybase_user,
        "dentropydaemon"
    )
    // get_keybase_topic(tmp_channel_name, tmp_members_type, tmp_topic_name)
    for(var i = 0; i < team_topics.result.conversations.length; i++){
        let tmp_topic_messages = await get_keybase_topic(
            team_topics.result.conversations[i].channel.name,
            team_topics.result.conversations[i].channel.members_type,
            team_topics.result.conversations[i].channel.topic_name
        )
        tmp_topic_messages.forEach((element) => {
            if (element.msg.content.type == "text"){
                var urls = extractUrls(element.msg.content.text.body, true);
                if (urls != undefined){
                    console.log(urls)
                    element.msg.urls = urls
                    element.msg.url_num = urls.length
                    element.msg.domains = [ ...new Set(extractDomain(urls))]
                    element.msg.domains_num = element.msg.domains.length
                }
            }
        })
        fs.writeFileSync(`${export_dir}/${keybase_user}/teams/${export_team_name}/${team_topics.result.conversations[i].channel.topic_name}.json`, JSON.stringify(tmp_topic_messages), (err) => {
            if (err) {
                throw err;
            }
            console.log(`export of topic ${team_topics.result.conversations[i].channel.topic_name} for team ${export_team_name} is saved in ${tmp_file_output}.`);
        });
    }
    process.exit(1)
}

main()
