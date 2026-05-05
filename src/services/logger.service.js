const config = require('../config')

const sendSlackAlert = async (err, req) => {
    if (!config.slackWebhookUrl) return

    const payload = {
        text: 'Error 5XX en BildyApp',
        attachments: [
            {
                color: 'danger',
                fields: [
                    { title: 'Timestamp', value: new Date().toISOString(), short: true },
                    { title: 'Método', value: req.method, short: true },
                    { title: 'Ruta', value: req.originalUrl, short: true },
                    { title: 'Error', value: err.message, short: false },
                    { title: 'Stack', value: err.stack || '-', short: false },
                ],
            },
        ],
    }

    await fetch(config.slackWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
}

module.exports = { sendSlackAlert }