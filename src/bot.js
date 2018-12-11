import { Client } from 'discord.js';
import { CronJob } from 'cron';
import { token } from '../auth.json';
import { dndChannelId, dndRoleId, schedulingServiceUrl, createEventEndpoint } from './constants';
import { getNextDate } from './utils';
import request from 'request';

function postPoll(pollUrl) {
    const client = new Client();
    /**
     * The ready event is vital, it means that only _after_ this will your bot start reacting to information
     * received from Discord
     */
    client.on('ready', () => {
        console.log('Bearly Friends is ready to rumble!');
    });

    client.login(token)
        .then(() => {
            const channel = client.channels.get(dndChannelId);
            channel.send(`Hi <@&${dndRoleId}>! Please fill out the When2Meet at ${pollUrl} for next weekend's session by Thursday. I can **bear**ly wait!`);
        })
        .catch(error => console.log(error))
        .finally(() => client.destroy()); // Logout and clean up client resources
}

function createPoll() {
    const options = {
        method: 'POST',
        url: `${schedulingServiceUrl}/${createEventEndpoint}`,
        headers: { 'content-type': 'multipart/form-data' },
        formData: {
            NewEventName: 'DnD',
            DateTypes: 'SpecificDates',
            PossibleDates: `${getNextDate(5)}|${getNextDate(6)}|${getNextDate(0)}`,
            NoEarlierThan: '9',
            NoLaterThan: '0',
            TimeZone: 'America/New_York'
        }
    };

    request(options, (error, response, body) => {
        if (error) {
            console.log(error);
            return;
        }
        const pattern = /window\.location='.+'/g;
        const path = pattern.exec(body)[0].split('\'')[1];
        postPoll(`${schedulingServiceUrl}${path}`);
    });
}

new CronJob('0 0 * * 1', createPoll, null, true, 'America/New_York');
