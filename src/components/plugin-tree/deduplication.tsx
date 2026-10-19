import { Fragment } from 'react'
import { Storyboard } from './storyboard'
import { FlowConnector, StoryText } from './primitives'

export const dedupBeats = [
	{
		at: 0,
		caption: <><code>ip</code> is a named plugin with a global <code>derive</code> hook. <code>router1</code>, <code>router2</code> and <code>server</code> are plain instances.</>
	},
	{
		at: 4000,
		act: 'Dependency',
		caption: <><code>router1.use(ip)</code> and <code>router2.use(ip)</code> declare the dependency. Each router now has <code>ip</code> in its tree.</>
	},
	{
		at: 8000,
		act: 'Deduplication',
		caption: <><code>server.use(router1)</code> brings <code>ip</code> along. <code>ip</code> isn't registered on server yet, so its hook is registered.</>
	},
	{
		at: 12000,
		act: 'Deduplication',
		caption: <><code>server.use(router2)</code> brings <code>ip</code> again.</>
	},
	{
		at: 16000,
		act: 'Deduplication',
		caption: <>server finds <code>ip</code> already registered by name, so the hook isn't registered twice. It runs once per request.</>
	},
	{
		at: 20000,
		act: 'Scope',
		caption: <>The hook is <code>global</code>, so it reaches every instance that uses <code>ip</code>: both routers and server. See <a href="#scope">Scope</a> below for <code>local</code> and <code>plugin</code>.</>
	}
]

export function dedupSceneAt(beat: number) {
	return {
		act: dedupBeats[beat].act,
		caption: dedupBeats[beat].caption,
		docked: beat >= 1,
		merged1: beat >= 2,
		merged2: beat >= 3,
		skipped: beat >= 4,
		scoped: beat >= 5,
		registry: beat >= 2 ? ['ip'] : []
	}
}

export function DeduplicationStory() {
	return <Storyboard label="How plugins deduplicate" beats={dedupBeats}>
		{(beat, instant) => {
			const scene = dedupSceneAt(beat)
			return <div className="plugin-story__flow plugin-story__flow--dedup">
				{[1, 2].map((router) => <Fragment key={router}>
					<section style={{ gridArea: `source${router}` }} className="plugin-story__node" aria-label={`router${router} instance`}>
						<div className="plugin-story__node-heading"><code>router{router}</code><code>/ip-{router}</code></div>
						<p className="plugin-story__detail"><code className="plugin-story__reveal" data-visible={scene.docked} aria-hidden={!scene.docked}>.use(ip)</code><StoryText instant={instant}>{scene.docked ? 'Dependency added' : ''}</StoryText></p>
						<p className="plugin-story__reveal plugin-story__detail" data-visible={router === 1 ? scene.merged1 : scene.merged2} aria-hidden={!(router === 1 ? scene.merged1 : scene.merged2)}><StoryText instant={instant}>{router === 2 && scene.skipped ? 'Reuse ip · skip duplicate hook' : 'Route merged into server'}</StoryText></p>
					</section>
					<div style={{ gridArea: `connector${router}` }}>
						<FlowConnector label={`.use(router${router})`} active={router === 1 ? scene.merged1 : scene.merged2} />
					</div>
				</Fragment>)}
				<section style={{ gridArea: 'server' }} className="plugin-story__node" aria-label="server instance" data-active={scene.scoped}>
					<div className="plugin-story__node-heading"><code>server</code><span>Named hooks</span></div>
					<div className="plugin-story__registry"><code className="plugin-story__reveal" data-visible={scene.registry.length > 0} aria-hidden={!scene.registry.length}>ip</code><StoryText instant={instant}>{scene.registry.length ? 'Registered once' : ''}</StoryText></div>
					<p className="plugin-story__detail"><code>derive</code><span>Global scope</span></p>
					<div className="plugin-story__routes">
						{[1, 2].map((router) => <p key={router} className="plugin-story__reveal" data-visible={router === 1 ? scene.merged1 : scene.merged2} aria-hidden={!(router === 1 ? scene.merged1 : scene.merged2)}><code>/ip-{router}</code><StoryText instant={instant}>{scene.scoped ? 'Hook runs once' : 'Route available'}</StoryText></p>)}
					</div>
				</section>
			</div>
		}}
	</Storyboard>
}
