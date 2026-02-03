const Mailjet = require('node-mailjet');

const mailjet = Mailjet.apiConnect(
    '1760a74adeae307c8c320fc74e7840b6',
    'a204b3aee337ab3866303536ceadda4a'
);

exports.handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ success: false, error: 'Method not allowed' })
        };
    }

    try {
        const { storeName, clientEmail } = JSON.parse(event.body);

        const result = await mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [{
                From: {
                    Email: 'integra@rhd-distribution.com',
                    Name: 'Integra Monaco'
                },
                To: [{
                    Email: clientEmail,
                    Name: storeName
                }],
                Cc: [{
                    Email: 's.fernandes@integra-hpl.com',
                    Name: 'Integra Copy'
                }],
                Subject: 'Information Integra Monaco - ' + storeName,
                HTMLPart: '<h2>Bonjour ' + storeName + ',</h2><p>Merci pour votre intérêt pour nos produits Integra Monaco.</p><p>Cordialement,<br>L\'équipe Integra</p>'
            }]
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ success: true, data: result.body })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ success: false, error: error.message })
        };
    }
};
