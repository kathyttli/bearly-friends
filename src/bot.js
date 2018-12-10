import { Client } from 'discord.js';
import { CronJob } from 'cron';
import { token } from '../auth.json';
import { dndChannelId } from './constants';
import request from 'request';

function createPoll() {
    var options = {
        method: 'POST',
        url: 'https://www.when2meet.com/SaveNewEvent.php',
        headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-cache'
        },
        body: 'NewEventName=DnD&DateTypes=SpecificDates&PossibleDates=2018-12-21%7C2018-12-22%7C2018-12-23&NoEarlierThan=9&NoLaterThan=0&TimeZone=America%2FNew_York'
    };

    request(options, function (error, response, body) {
        console.log(error);
        console.log(body);
    });
}

function postPoll() {
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
            client.channels.get(dndChannelId);
        })
        .then(() => client.destroy())
        .catch(error => console.log(error));
}

createPoll();
postPoll();
// new CronJob('0 0 * * 1', postSchedule, null, true, 'America/New_York');
