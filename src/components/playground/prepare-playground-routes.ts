import type { AnyElysia } from 'elysia';
import type { PlaygroundExample } from './route-runner';

export type PlaygroundProps = {
	elysia: AnyElysia;
	mock?: Record<string, Record<string, string>>;
	alias?: Record<string, string>;
	examples?: never;
} | {
	examples: PlaygroundExample[];
	elysia?: never;
	mock?: never;
	alias?: never;
};

export async function resolvePlaygroundRoutes(props: PlaygroundProps): Promise<PlaygroundExample[]> {
	const routes = props.examples !== undefined
		? props.examples
		: await preparePlaygroundRoutes(props.elysia, props.mock, props.alias);
	if (!routes.length) throw new Error('Playground requires at least one route.');
	return routes;
}

interface PreparedPlaygroundRoute extends PlaygroundExample {
	path: string;
};

export async function preparePlaygroundRoutes(
	elysia: AnyElysia,
	mock: Record<string, Record<string, string>> = {},
	alias: Record<string, string> = {}
): Promise<PreparedPlaygroundRoute[]> {
	const routes: PreparedPlaygroundRoute[] = [];

	for (const { method, path } of elysia.routes) {
		const displayPath = Object.hasOwn(alias, path) ? alias[path] : path;
		const routeMock = mock[path];
		const response =
			routeMock && Object.hasOwn(routeMock, method)
				? routeMock[method]
				: await (
						await elysia.handle(
							new Request(`http://elysiajs.com${path}`, {
								method,
							})
						)
					).text();

		routes.push({ method, path, displayPath, response });
	}

	return routes;
}
