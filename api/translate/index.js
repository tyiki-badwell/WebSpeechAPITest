const util = require ('util');
const request  = require ('request');
const requestPromise = util.promisify(request);

module.exports = async function (context, req) {
    context.log(`Http function processed request for url "${request.url}"`);

    const api = 'https://api-free.deepl.com/v2/translate';
    try {
        const params = new URLSearchParams();
        params.append('text', req.value);
        params.append('source_lang', 'JA');
        params.append('target_lang', 'EN');
        context.log(`param: ${params.toString()}`);

        const response = await requestPromise({
            method: 'POST',
            url: api,
            headers: {
                'Authorization': `DeepL-Auth-Key ${process.env["DEEPL_API_KEY"]}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params.toString()
        });

        context.log(`${response.body}`);
        context.res.json(response.body);
    } catch(e) {
        context.log(`${e}`);
        context.res.json({
            error: e
        });
    }
}