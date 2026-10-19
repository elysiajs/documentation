import { Storyboard } from './storyboard'
import { FlowConnector, StoryText } from './primitives'

export const dependencyBeats = [
	{
		at: 0,
		caption: <><code>main</code> handles <code>/profile</code> and reads <code>Auth</code> from its context. Nothing provides <code>Auth</code> yet.</>
	},
	{
		at: 4000,
		act: 'Decorate',
		caption: <><code>auth.decorate('Auth', Auth)</code> attaches the class to the <code>auth</code> instance, and <code>.model(Auth.models)</code> registers its <code>user</code> model.</>
	},
	{
		at: 8000,
		act: 'Dependency',
		caption: <><code>main.use(auth)</code> declares the dependency. <code>main</code> now has <code>auth</code> in its tree.</>
	},
	{
		at: 12000,
		act: 'Dependency',
		caption: <>That's all it takes: <code>Auth</code> is in <code>main</code>'s context and its <code>user</code> model is registered on <code>main</code>, so <code>/profile</code> can call <code>Auth.getProfile()</code>. Without <code>.use(auth)</code>, it stays missing.</>
	}
]

export function dependencySceneAt(beat: number) {
	return {
		act: dependencyBeats[beat].act,
		caption: dependencyBeats[beat].caption,
		decorated: beat >= 1,
		used: beat >= 2,
		available: beat >= 3
	}
}

export function DependencyStory() {
	return <Storyboard label="How dependencies become available" beats={dependencyBeats}>
		{(beat, instant) => {
			const scene = dependencySceneAt(beat)
			return <div className="plugin-story__flow">
				<section className="plugin-story__node" aria-label="auth instance">
					<div className="plugin-story__node-heading"><code>auth</code><span>Provides</span></div>
					<div className="plugin-story__reveal" data-visible={scene.decorated} aria-hidden={!scene.decorated}>
						<p><code>Auth</code><span>Class</span></p>
						<p><code>user</code><span>Model</span></p>
					</div>
				</section>
				<FlowConnector label=".use(auth)" active={scene.used} />
				<section className="plugin-story__node" aria-label="main instance" data-active={scene.available}>
					<div className="plugin-story__node-heading"><code>main</code><StoryText instant={instant}>{scene.used ? 'Dependency imported' : 'No dependency'}</StoryText></div>
					<div className="plugin-story__route" data-missing={!scene.used}><code>/profile</code><StoryText instant={instant}>{scene.used ? 'Auth available' : 'Auth missing'}</StoryText></div>
					<p className="plugin-story__reveal plugin-story__detail" data-visible={scene.available} aria-hidden={!scene.available}><code>Auth.getProfile()</code></p>
				</section>
			</div>
		}}
	</Storyboard>
}
