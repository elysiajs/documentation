---
title: Elysia 1.4 - Supersymmetry
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: Elysia 1.4 - Supersymmetry

    - - meta
      - name: 'description'
        content: Support for Standard Validator. Macro with schema, extension, and OpenAPI detail. Lifecycle type soundness. Improve type inference performance by 10%.

    - - meta
      - property: 'og:description'
        content: Support for Standard Validator. Macro with schema, extension, and OpenAPI detail. Lifecycle type soundness. Improve type inference performance by 10%.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-14/elysia-14.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-14/elysia-14.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="Elysia 1.4 - Supersymmetry"
    src="/blog/elysia-14/elysia-14.webp"
    alt="'Elysia 1.4' as title with the word 'Supersymmetry' on the left with ElysiaJS chan on the right."
    author="saltyaom"
    date="13 Sep 2025"
    shadow
>

Named after the song [Supersymmetry](https://youtu.be/NYyjQjtbteA) by Sta, a Tone Sphere ending theme.

Elysia 1.4 highlight is on Standard Schema, and **"Type Soundness"**.

- [Standard Schema](#standard-schema)
- [Macro](#macro)
- [Lifecycle Type Soundness](#lifecycle-type-soundness)
- [Group standalone schema](#group-standalone-schema)

## Standard Schema
For 3 years, Elysia use TypeBox as the only validator, and it is one of the most loved feature of Elysia due to its performance, and type inference.

But one of the most requested feature from our community is to support more validator other than TypeBox since the very early day ([elysia#20](https://github.com/elysiajs/elysia/issues/20)).

As Elysia is deeply tied with TypeBox, it required a lot of effort to add support for each validators individually, and a lot of maintenance to keep up with the changes of each one.

Luckily, there is a new proposal called [Standard Schema](https://github.com/standard-schema/standard-schema) to define a standard way to use a different schema with the same API allowing us to support multiple validators without having to write custom integration for each of them.

Elysia now support Standard Schema, allowing you to use your favorite validators like:
- Zod
- Valibot
- Effect Schema
- ArkType
- Joi
- and more!

You can provide the schema similar to TypeBox, and it will just work out of the box:
```ts twoslash
import { Elysia, t } from 'elysia'
import { z } from 'zod'
import * as v from 'valibot'

const app = new Elysia()
  	.post(
   		'/user/:id',
     	({ body, params }) => {
      		body
      		// ^?




         	params
      		// ^?


     	},
      	{
       		params: z.object({
         		id: z.coerce.number()
         	}),
         	body: v.object({
		 		name: v.literal('lilith')
		 	})
      	})
```

You can use multiple validators in a single route, and it will work together seamlessly, and it will have a correct type inference as well.

### OpenAPI
There is a request to support JSON Schema for OpenAPI generation for Standard Schema but it is not implemented yet.

However, we provide a custom `mapJsonSchema` to `openapi` allow you to provide a custom function to map schema to Json Schema as a workaround.

Allowing you to have a beautiful OpenAPI documentation with your favorite validator.

![Zod with OpenAPI support](/blog/elysia-14/openapi-zod.webp)
> Using Zod native OpenAPI schema support with **describe** to add description to the schema

But if your validator does not support JSON Schema, we provide our unique [OpenAPI type gen](/blog/openapi-type-gen.html) to generate OpenAPI schema directly from TypeScript type from your validator.

This means that Elysia support OpenAPI generation for all validators that support Standard Schema even if it doesn't directly support JSON Schema.

![Valibot with OpenAPI support](/blog/elysia-14/openapi-valibot.webp)
> Valibot doesn't directly support JSON Schema, but we OpenAPI type gen to handle it

Not only that it will input type correctly, but OpenAPI type gen will also generate all possible output type as well, including error response.

This is truly a unique feature for Elysia, that we are truly proud to offer.

### Standalone Validator
You can also use multiple schema to validate a single input using standalone validator:

```ts twoslash
import { Elysia, t } from 'elysia'
import { z } from 'zod'
import * as v from 'valibot'

const app = new Elysia()
	.guard({
		schema: 'standalone',
		body: z.object({
			id: z.coerce.number()
		})
	})
  	.post(
   		'/user/:id',
     	({ body }) => body,
//          ^?



      	{
         	body: v.object({
		 		name: v.literal('lilith')
		 	})
      	})
```
> This example use both Zod, and Valibot to validate the body. Allowing you to use already existing schema in your codebase from a different validator together.

This works using each validator to parse a part of an input, then store each result as a snapshot that merge together to form a single output to ensure type integrity.

![Using multiple validators to validate part of a body](/blog/elysia-14/standard-schema.webp)
> Using TypeBox, Zod, Valibot, Joi, Yup, ArkType, Effect Schema, TypeMap, Rescript Schema to validate different part of the body

We test 8 validators at the same time, validating each part of the input, and it just works flawlessly.

We are proud to support Standard Schema out of the box, it is a big step for Elysia to not be tied to a single validator, and we are excited to see what you will build with it.

## Macro
Macro is one of the most powerful, and flexible feature of Elysia.

Allowing you to a define custom property that can modify, and extend the functionality of Elysia allowing you to create your own "sub framework" to your liking.

The versatility of Macro is truly amazing, allowing you to do things that are hardly possible with other frameworks effortlessly.

And with Elysia 1.4, we bring several improvement to make macro even more versatile.

### Macro Schema
You can now define a schema for your macro, allowing you to define custom validation directly from your macro.

![Macro with schema](/blog/elysia-14/macro-schema.webp)
> Macro with schema support

Macro with schema will automatically validate and infer type to ensure type safety, and it can co-exist with existing schema as well.

You can also stack multiple schema from different macro, or even from Standard Validator and it will work together seamlessly.

Macro schema also support type inference for **lifecycle within the same macro** **BUT** only with named single macro due to TypeScript limitation.

![Macro with extension](/blog/elysia-14/macro-schema-lifecycle.webp)
> Using a named single macro to infer type into lifecycle within the same macro

If you want to use lifecycle type inference within the same macro, you might want to use a named single macro instead of multiple stacked macro

> Not to confused with using macro schema to infer type into route's lifecycle event. That works just fine this limitation only apply to using lifecycle within the same macro.

### Macro Extension
You can now extend existing macro, allowing you to build upon existing functionality.

![Macro with extension](/blog/elysia-14/macro-extension.webp)
> Macro with extension support

This allow you to build upon existing macro, and add more functionality to it.

It also works recursively with automatic deduplication, allowing you to extends existing macro that already extends another macro without any issue.

However, if you evert accidentally create a circular dependency, Elysia have a limit stack of 16 to prevent infinite loop in both runtime and type inference.

### Macro Detail
You can now define OpenAPI detail for your macro, allowing you to add more detail to your OpenAPI documentation directly from your macro.

If the route already has OpenAPI detail, it will merge the detail together but prefers the route detail over macro detail.

## Lifecycle Type Soundness
Since the introduction of [OpenAPI Type Gen](/blog/openapi-type-gen) which generate OpenAPI schema directly from type, we found that it would be great to have a type soundness for every lifecycle event.

That way we can accurately document the return type for each lifecycle event, and macro to accurately represent all of the possibility of what a single route can return.

By refactoring over 3,000+ lines of pure type, response status type reconcilation, including unit tests in type-level for all lifecycle API to ensure type integrity, and a lot of type performance optimization to make sure that type inference doesn't get slower.

All of these complex acheivement allow us to create document all of possibility of what a single route can return.

![Type Soundness](/blog/elysia-14/type-soundness.webp)
> Documenting all of the possibility of what a single route can return


Not only this improve the developer experience, but it also improve the reliability of your codebase by ensuring that all of the possibility are accounted for both in the API documentation, and client with Eden Treaty.

> Type Soundness covers all lifecycle event, and macro, allowing you to have a complete documentation of your API. The only exception is an inline lifecycle event due to slowness.

We also managed to improve type inference performance by ~9-11%, and decrease type instantiation by 11.5% despite the massive increase in type complexity.

![Type inference](/blog/elysia-14/type-inference.webp)
> Type instantiation is reduced by 11.57% from our internal benchmark

## Group standalone schema
Previously `group` with schema will use an overwrite strategy, meaning that if you define a schema in `group` it will overwrite the existing schema in the route.

If you want to define a new schema, you have to include the existing schema manually. This is not very ergonomic, and it can lead to errors if you forget to include the existing schema.

Starting from 1.4, `group` with schema will use a standalone strategy, meaning that if you define a schema in `group` it will not overwrite but co-exists the route schema.

![group standalone](/blog/elysia-14/group-standalone.webp)
> `group` with schema will co-exists with route schema

This allow you to define a new schema in `group` without having to include the existing schema manually.

## Notable changes
We have closed around 300 issues on 1.3.9 so we don't really have much bug fixes to make for 1.4 as solved most of the problems we know.

### Improvement
- [#861](https://github.com/elysiajs/elysia/issues/861) automatically add HEAD method when defining GET route
- [#1389](https://github.com/elysiajs/elysia/pull/1389) NoValidate in refernce model

### Change
- ObjectString/ArrayString no longer produce default value by default due to security reasons
- Cookie now dynamically parse when format is likely JSON
- export `fileType` for external file type validation for accurate response
- ObjectString/ArrayString no longer produce default value by default due to security reasons
- Cookie now dynamically parse when format is likely JSON

### Breaking Change
- remove macro v1 due to non type soundness
- remove `error` function, use `status` instead
- deprecation notice for `response` in `mapResponse`, `afterResponse`, use `responseValue` instead

## Afterword

This is the first time that we featured our mascot, Elysia chan as part of release note cover image! This will become a tradition for later release notes as well!

Our cover art mirror the theme with Supersymmetry (music) cover art where ElysiaJS chan is mirroring Weirs with a similar pose

![Elysia chan mirroring Supersymmetry](/blog/elysia-14/elysia-supersymmetry.webp)
> Elysia chan mirroring same pose as Weirs from Supersymmetry cover art [(pixiv)](https://www.pixiv.net/en/artworks/134997229)

Isn't she so cute? I really love how she turn out! I personally work hard to improve my art skill to be able to draw, hope you like it!

Anyway, hope you like this release! We are excited to see what you will build with it!

Have a nice day!

> I am all
>
> In this tiny micro universe
>
> Every morsel of your bittersweet heart
>
> I loved all
>
> <br />
>
> You know
>
> This game of life is our "riverrun,"
>
> You were my lucky friend for this journey
>
> <br />
>
> There is not much time left
>
> The sky is showing its fade
>
> Stars parade
>
> Time to change our fate
>

</Blog>
