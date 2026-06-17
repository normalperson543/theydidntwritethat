# They Didn't Write That!

Can you guess AI versus philosopher? Some quotes are said by real people, and some are rephrased by AI to seem like someone actually said it. Answer if a quote is real or fake and see if you can beat the global stats!

This project generates 10 rephrased quotes with an LLM and 10 real quotes based on a public dataset of quotes (https://huggingface.co/datasets/Abirate/english_quotes). It randomly chooses from these quotes, and you get to choose if a quote is real or fake. All stats and results are saved and is used for a global accuracy estimate.

## Development

You'll need Node.js and a Postgres database.

First, rename the env.example file to .env and complete the environment variables.

Install dependencies:

```
npm install
```

You may also need to generate the Prisma schema:

```
npx prisma generate
```

Then run the development server:

```
npm run dev
```

Open http://localhost:3000 to see the result.

### Building

Run the following:

```
npm run build
```

Test the build:

```
npm run start
```

Open http://localhost:3000 to see the result.
