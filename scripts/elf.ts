import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)
openai.createEmbedding({
    input: [''],
    model: 'text-embedding-ada-002'
})
