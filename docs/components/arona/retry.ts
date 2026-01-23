type MaybePromise<T> = T | Promise<T>

export const retry = <T>(
    fn: () => MaybePromise<T>,
    retries = 3,
    delay = 1000
) =>
    new Promise<Awaited<T>>((resolve, reject) => {
        async function attempt(n: number) {
            try {
                let temp = fn()
                if (temp instanceof Promise) temp = await temp

                resolve(temp as Awaited<T>)
            } catch (err) {
                if (n > 0) setTimeout(() => attempt(n - 1), delay)
                else reject(err)
            }
        }

        attempt(retries)
    })
