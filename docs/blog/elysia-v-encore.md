---
title: Elysia 1.4 - Supersymmetry
sidebar: false
editLink: false
search: false
comment: false
head:
    - - meta
      - property: 'og:title'
        content: 2x faster than Encore - 1 year later

    - - meta
      - name: 'description'
        content: After 1.5 year of development, Elysia is now 2x faster than Encore. Updated from the original benchmark, and deep dive into how we achieved this performance.

    - - meta
      - property: 'og:description'
        content: After 1.5 year of development, Elysia is now 2x faster than Encore. Updated from the original benchmark, and deep dive into how we achieved this performance.

    - - meta
      - property: 'og:image'
        content: https://elysiajs.com/blog/elysia-v-encore/elysia-v-encore.webp

    - - meta
      - property: 'twitter:image'
        content: https://elysiajs.com/blog/elysia-v-encore/elysia-v-encore.webp
---

<script setup>
    import Blog from '../components/blog/Layout.vue'
</script>

<Blog
    title="2x faster than Encore - 1 year later"
    src="/blog/elysia-v-encore/elysia-v-encore.webp"
    alt="2x faster than Encore. 1.5 year later after Encore vs Elysia performance comparison"
    author="saltyaom"
    date="11 Nov 2025"
    shadow
>

On Jun 17 2024, Encore published a blog post, [9x faster than Express.js, 3x faster than ElysiaJS & Hono](https://encore.dev/blog/event-loops) claiming that Encore was faster than Elysia & Hono by 3x.

Today, after 1.5 year of development, Elysia is now 2x faster than Encore in the same benchmark.

## A little introduction

EncoreTS is a framework powered by *multi-threaded Rust runtime* with binding for Node.js. It leverages Rust's performance and safety features to build high-performance web applications.

Encore claims to be faster than Elysia & Hono by utilizing Rust for performance-critical tasks, while still providing a familiar JavaScript/TypeScript interface for developers.

![Encore benchmark on EncoreTS homepage](/blog/elysia-v-encore/encore-benchmark.webp)
> Benchmark on EncoreTS homepage

After 1.5 year later, we revisited the benchmark to see how Elysia performs against Encore.

## Revisiting the benchmark

The benchmark is publicly available on [Encore's GitHub](https://github.com/encoredev/ts-benchmarks), [we fork the repository](https://github.com/saltyaom/encore-ts-benchmarks) to run the benchmark with the latest version of Elysia.

After some inspection, we noticed that the original benchmark for Elysia was not optimized for production. We made the following changes to ensure a fair comparison.

Here are some of the changes we made:
1. Add `bun compile` to Elysia script to optimize for production
2. Update Elysia bare request to use static resources
3. Due to machine specification, we update oha concurrency from `150` to `450` to scale upper limit

Lastly, we update all the necessary dependencies to their latest versions.
- Encore: 1.5.17
- Rust: 1.91.1
- Elysia: 1.4.16
- Bun: 1.3.2

Here's the machine specification we used for the benchmark:
- Benchmark Date: 14 Nov 2025
- Machine specification: Intel i7-13700K, DDR5 32GB 5600MHz
- OS: Debian 11 (bullseye) on WSL - 5.15.167.4-microsoft-standard-WSL2

## Benchmark results
After running the benchmark, we obtained the following results

![Benchmark result](/blog/elysia-v-encore/benchmark-result.webp)
> Benchmark result: Elysia is 2x faster than Encore

| Framework | With Validation | Without Validation |
| --- | --- | --- |
| Encore | 139,033 | 95854 |
| Elysia | 293,991 | 223,924 |

Using the original benchmark, Elysia outperforms Encore in all categories, acheiving double the requests per second in all tests.

Here's a [video-proof step-by-step](https://x.com/saltyAom/status/1989218344969580838) on how to run the benchmark.

## How did we achieve this?
In the original benchmark, Elysia version was 1.1.16. Since then, we have made significant improvements to Elysia's performance through various optimizations and enhancements.

But to summarize, in a single year, both Elysia and Bun have made significant performance improvements.

### Exact Mirror
In the original Encore benchmark, Elysia perform a data normalization on every request, which adds significant overhead to the request processing time.

The bottleneck is not in a data validation itself, but due to the normalization process that involves dynamic data mutation.

In [Elysia 1.3](/blog/elysia-13.html#exact-mirror), we introduce [Exact Mirror](https://github.com/elysiajs/exact-mirror) to accelerate data normalization using JIT compilation instead of dynamic data mutation.

This improves the performance of data normalization significantly, up to **~30x faster for medium size payloads**.

![Exact Mirror run on medium size payload in 29.46x and 31.6x in order](/blog/elysia-13/exact-mirror-large.webp)
> Exact Mirror run on medium size payload resulting in 30x faster

This significantly improve validation performance in Elysia.

### General JIT optimizations
Between Elysia 1.1 (upstream) and 1.4 (current), we have made several JIT optimizations to improve the overall performance of Elysia especially with Sucrose, our *JIT compiler* for Elysia.

These optimizations include:
- Constant folding, inlining lifecycle events
- Reducing validation, and coercion overhead
- Minimizing the overhead of middleware and plugins
- Improving the efficiency of internal data structures
- Reducing memory allocations during request processing
- Various other micro-optimizations

In Bun 1.2.3, Bun also offers a built-in routing in native code for better performance.

In Elysia 1.3, we leverages Bun's native routing when possible to improve routing performance.

### Bun compile
In the original benchmark, Elysia was not compiled for production.

Using `bun compile` optimizes the Elysia application for production, resulting in significant performance improvements, and reduced memory usage.

## Conclusion

Through constant improvement, Elysia has optimize its performance significantly over the past 1.5 years, resulting in a framework that is now 2x faster than Encore in the same benchmark.

Benchmarks are not the only factor to consider when choosing a framework. Developer experience, ecosystem, and community support are also important factors to consider.

While the benchmark is hard to, we have detail our steps on how to run the benchmark, and recommended you to run [the benchmark](https://github.com/saltyaom/encore-ts-benchmarks) on your own machine for the most accurate results for your use case.

</Blog>
