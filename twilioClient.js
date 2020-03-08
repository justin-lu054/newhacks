const TWILIO_USER_SID = "ACe06cff5e6ae59a9e0311556e95a91ce4"
const TWILIO_NUMBER_SID = "SK4479d9aec8b67ee4c4e8f515d1dcdf37"
const TWILIO_API_KEY = "GKtLSZc47Rs8e3G9wXP8GbvdB7Z4Rzar"
const TWILIO_API_URL = "https://api.twilio.com/2010-04-01"

import fetch from 'node-fetch'

export default function sendMessage(message, to) {
    fetch(`${TWILIO_API_URL}/Accounts/${TWILIO_USER_SID}/Messages.json`, {
        method: 'POST',
        body: `From=+12262402314To=${to}Body=${message}`,
        user: {TWILIO_NUMBER_SID: TWILIO_API_KEY},
    }).then((res) => console.log(res))
    .catch((err) => console.log(err)); 
}

sendMessage("yo", "+16477014523");