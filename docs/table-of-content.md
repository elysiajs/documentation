---
title: Table of Content - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Table of Content - ElysiaJS

  - - meta
    - name: 'description'
      content: There's no correct or organized way to learn Elysia, however, we recommended completing the essential chapter first as the chapter briefly covers most of Elysia's features and foundation before jumping to other topics that interest you. Once you've completed the essential chapter, you may jump to any topic that interests you. However, we recommended following the order of the chapter as it may reference to previous chapter.

  - - meta
    - property: 'og:description'
      content: There's no correct or organized way to learn Elysia, however, we recommended completing the essential chapter first as the chapter briefly covers most of Elysia's features and foundation before jumping to other topics that interest you. Once you've completed the essential chapter, you may jump to any topic that interests you. However, we recommended following the order of the chapter as it may reference to previous chapter.
---

<script setup>
    import Card from './components/nearl/card.vue'
    import Deck from './components/nearl/card-deck.vue'

	import TutorialLink from './components/xiao/tutorial-link.vue'
</script>

# Table of Content

There's no correct way to learn Elysia, but we **highly recommended** you checkout the an **Interactive Tutorial** first to get familiar with Elysia:

<TutorialLink />

<!--### Prerequisite Knowledge
Although Elysia's documentation is designed to be beginner-friendly, we need to establish a baseline so that the docs can stay focused on Elysia's functionality. We will provide links to relevant documentation whenever we introduce a new concept.

To get the most out of our documentation, it's recommended that you have a basic understanding of Node.js and basic HTTP.-->

## First up
We highly recommended you to check out these 2 pages first before getting started with Elysia:

<Deck>
	<Card title="Key Concept" href="/key-concept">
		Core concept of Elysia and how to effectively
    </Card>
    <Card title="Best Practice" href="/essential/best-practice">
        Understand best practice to write Elysia code
    </Card>
</Deck>

### llms.txt

Alternatively, you can download <a href="/llms.txt" download>llms.txt</a> or <a href="/llms-full.txt" download>llms-full.txt</a> and feed it to your favorite LLMs like ChatGPT, Claude or Gemini to get a more interactive experience.

<Deck>
    <Card title="llms.txt" href="/llms.txt" download>
   		Download summarized Elysia doc in Markdown format with reference for prompting LLMs
    </Card>
    <Card title="llms-full.txt" href="/llms-full.txt" download>
  		Download full Elysia doc in Markdown format in a single file for prompting LLMs
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
		Comparison between tRPC and Elysia
	</Card>
    <Card title="From Fastify" href="/migrate/from-fastify">
  		Comparison between Fastify and Elysia
    </Card>
    <Card title="From Hono" href="/migrate/from-hono">
  		Comparison between tRPC and Elysia
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
  		Learn about how to handle request and response
	</Card>
	<Card title="Validation" href="/essential/plugin">
		How to enforce type safety with Elysia
	</Card>
	<Card title="Lifecycle" href="/essential/plugin">
		Learn different type of lifecycle and how to use it effectively
	</Card>
	<Card title="Plugin" href="/essential/plugin">
	  	Learn how to extend Elysia with Plugin
	</Card>
</Deck>

## More Patterns

If you feels like exploring more Elysia feature, check out:

<Deck>
    <Card title="Handler" href="/eden/overview">
    	More pattern on how to send a file, Server Sent Event, etc.
    </Card>
    <Card title="Web Socket" href="/patterns/websocket">
   		See how to create Real Time application with Elysia
    </Card>
    <Card title="Eden" href="/eden/overview">
    	Learn more about Eden, and how to use it effectively
    </Card>
    <Card title="Open Telemetry" href="/eden/opentelemetry">
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
  		Elysia provides some type safe integration with Drizzle
    </Card>
    <Card title="Prisma" href="/integrations/prisma">
  		Learn how to use Prisma with Elysia
    </Card>
    <Card title="React Email" href="/integrations/react-email">
  		We can use JSX to create email template
    </Card>
</Deck>

---

We hope you will love Elysia as much as we do!
