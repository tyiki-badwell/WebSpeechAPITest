const { app } = require('@azure/functions');

app.http('translate', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const api = 'https://api-free.deepl.com/v2/translate';
        try {
                const params = new URLSearchParams();
                params.append('text', req.value);
                params.append('source_lang', 'JA');
                params.append('target_lang', 'EN');
        
                const response = await fetch(api, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Authorization': `DeepL-Auth-Key ${process.env["DEEPL_API_KEY"]}`
                },
                body: params
            });
    
            if (response.ok) {
                const json = await response.json();
                context.log(`${json}`);
    
                context.res.json(json);
            } else {
                const json = await response.json();
                context.log(`${json}`);
    
                context.res.json(json);
            }
        } catch(e) {
            context.log(`${e}`);
     
            context.res.json({
                error: e
            });
        }
    }
});
