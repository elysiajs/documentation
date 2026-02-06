---
title: What's Next - Elysia Tutorial
layout: false
search: false
authors: []
head:
    - - meta
      - property: 'og:title'
        content: What's Next - Elysia Tutorial

    - - meta
      - name: 'description'
        content: Congratulations! You have completed the tutorial. Now you're ready to build your own application with Elysia! We highly recommended you to check out these 2 pages first before getting started with Elysia. Key Concept and Best Practice. Alternatively, you can download llms.txt or llms-full.txt and feed it to your favorite LLMs like ChatGPT, Claude or Gemini to get a more interactive experience. If you are stuck, feel free to ask our community on GitHub Discussions, Discord, and Twitter. If you have used other popular frameworks like Express, Fastify, or Hono, you will find Elysia right at home with just a few differences. We also have essential chapters, more patterns, integration with Meta Framework and your favorite tool.

    - - meta
      - property: 'og:description'
        content: Congratulations! You have completed the tutorial. Now you're ready to build your own application with Elysia! We highly recommended you to check out these 2 pages first before getting started with Elysia. Key Concept and Best Practice. Alternatively, you can download llms.txt or llms-full.txt and feed it to your favorite LLMs like ChatGPT, Claude or Gemini to get a more interactive experience. If you are stuck, feel free to ask our community on GitHub Discussions, Discord, and Twitter. If you have used other popular frameworks like Express, Fastify, or Hono, you will find Elysia right at home with just a few differences. We also have essential chapters, more patterns, integration with Meta Framework and your favorite tool.
---

<script setup lang="ts">
import Editor from '../components/xiao/playground/playground.vue'

import Card from '../components/nearl/card.vue'
import Deck from '../components/nearl/card-deck.vue'

import { code } from './data'
</script>

<Editor :code="code">

# Congratulations!

You have completed the tutorial.

Now you're ready to build your own application with Elysia!

## First up
We highly recommended you to check out these 2 pages first before getting started with Elysia:

<Deck>
	<Card title="Key Concepts" href="/key-concepts">
		Core concepts of Elysia and how to use them
    </Card>
    <Card title="Best Practice" href="/essential/best-practice">
        Understand best practice to write Elysia code
    </Card>
</Deck>

### llms.txt

Alternatively, you can download <a href="/llms.txt" download>llms.txt</a> or <a href="/llms-full.txt" download>llms-full.txt</a> and feed it to your favorite LLMs like ChatGPT, Claude or Gemini to get a more interactive experience.

<Deck>
    <Card title="llms.txt" href="/llms.txt" download>
   		Download summarized Elysia docs in Markdown format with reference for prompting LLMs
    </Card>
    <Card title="llms-full.txt" href="/llms-full.txt" download>
  		Download full Elysia docs in Markdown format in a single file for prompting LLMs
    </Card>
</Deck>

### If you are stuck

Feel free to ask our community on GitHub Discussions, Discord, and Twitter.

<Deck>
    <Card title="Discord" href="https://discord.gg/eaFJ2KDJck">
        Official ElysiaJS discord community server
    </Card>
    <Card title="Twitter" href="https://twitter.com/elysiajs">
        Track updates and status of Elysia
    </Card>
    <Card title="GitHub" href="https://github.com/elysiajs">
        Source code and development
    </Card>
</Deck>

## From other Framework?

If you have used other popular frameworks like Express, Fastify, or Hono, you will find Elysia right at home with just a few differences.

<Deck>
	<Card title="From Express" href="/migrate/from-express">
		Comparison between Express and Elysia
	</Card>
    <Card title="From Fastify" href="/migrate/from-fastify">
  		Comparison between Fastify and Elysia
    </Card>
    <Card title="From Hono" href="/migrate/from-hono">
  		Comparison between Hono and Elysia
    </Card>
    <Card title="From tRPC" href="/migrate/from-trpc">
  		Comparison between tRPC and Elysia
    </Card>
</Deck>

## Essential Chapter

Here are the foundation of Elysia, we highly recommended you to go through these pages before jumping to other topics:

<Deck>
	<Card title="Route" href="/essential/route">
  Understand how routing works in Elysia
	</Card>
	<Card title="Handler" href="/essential/handler">
  		Learn about how to handle request
	</Card>
	<Card title="Validation" href="/essential/validation">
		How to enforce type safety with Elysia
	</Card>
	<Card title="Lifecycle" href="/essential/life-cycle">
		Learn different type of lifecycle
	</Card>
	<Card title="Plugin" href="/essential/plugin">
	  	Learn how to extend Elysia with Plugin
	</Card>
</Deck>

## More Patterns

If you feels like exploring more Elysia feature, check out:

<Deck>
    <Card title="Handler" href="/essential/handler">
    	More patterns on how to send a file, Server Sent Events, etc.
    </Card>
    <Card title="Web Socket" href="/patterns/websocket">
   		See how to create Real Time application with Elysia
    </Card>
    <Card title="Eden" href="/eden/overview">
    	Learn more about Eden, Elysia's RPC-like client
    </Card>
    <Card title="Open Telemetry" href="/patterns/opentelemetry">
   		Learn how to monitor your application with Open Telemetry
    </Card>
    <Card title="Deploy to Production" href="/patterns/deploys">
    	Learn how to deploy Elysia to production
    </Card>
</Deck>

## Integration with Meta Framework

We can also use Elysia with Meta Framework like Nextjs, Nuxt, Astro, etc.

<Deck>
	<Card title="Astro" href="/integrations/astro">
		Elysia in Astro Endpoint
	</Card>
	<Card title="Expo" href="/integrations/expo">
		Elysia in Expo API Route
	</Card>
	<Card title="Nextjs" href="/integrations/nextjs">
		Elysia in Route Handler
	</Card>
	<Card title="Nuxt" href="/integrations/nuxt">
		Elysia in Nuxt Server Route
	</Card>
	<Card title="SvelteKit" href="/integrations/sveltekit">
		Elysia in SvelteKit Endpoint
	</Card>
</Deck>

## Integration with your favorite tool

We have some integration with popular tools:

<Deck>
	<Card title="AI SDK" href="/integrations/ai-sdk">
   		Learn how to use Vercel AI SDK with Elysia
    </Card>
    <Card title="Better Auth" href="/integrations/better-auth">
   		Learn how to use Better Auth with Elysia
    </Card>
    <Card title="Drizzle" href="/integrations/drizzle">
  		Elysia provides a type safe utility with Drizzle
    </Card>
    <Card title="Prisma" href="/integrations/prisma">
  		Learn how to use Prisma with Elysia
    </Card>
    <Card title="React Email" href="/integrations/react-email">
  		We can use JSX to create email template
    </Card>
</Deck>

<br>

---

We hope you will love Elysia as much as we do!

</Editor>
