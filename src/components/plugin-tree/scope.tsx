import { StoryText } from './primitives'
import { Storyboard } from './storyboard'

export const scopeBeats = [
	{
		at: 0,
		caption: (
			<>
				<code>child</code> sits inside <code>current</code>, which sits
				inside <code>parent</code>, which sits inside <code>main</code>.{' '}
				<code>current</code> has a <code>beforeHandle</code> hook, and
				its scope decides which routes run it.
			</>
		)
	},
	{
		at: 4000,
		act: 'Local',
		caption: (
			<>
				<code>local</code> is the default: the current instance and its
				descendants. <code>/current</code> and <code>/child</code> run
				the hook.
			</>
		)
	},
	{
		at: 8000,
		act: 'Plugin',
		caption: (
			<>
				<code>plugin</code> adds the immediate parent.{' '}
				<code>/parent</code> runs the hook too.
			</>
		)
	},
	{
		at: 12000,
		act: 'Global',
		caption: (
			<>
				<code>global</code> reaches every parent that uses it.{' '}
				<code>/main</code> runs the hook as well.
			</>
		)
	}
]

export function scopeSceneAt(beat: number) {
	return {
		act: scopeBeats[beat].act,
		caption: scopeBeats[beat].caption,
		scope: ['local', 'local', 'plugin', 'global'][beat],
		reached: {
			child: beat >= 1,
			current: beat >= 1,
			parent: beat >= 2,
			main: beat >= 3
		}
	}
}

export function ScopeStory() {
	return (
		<Storyboard label="How hook scope reaches the tree" beats={scopeBeats}>
			{(beat, instant) => {
				const scene = scopeSceneAt(beat)
				return (
					<div>
						<div className="plugin-story__scope-label">
							<h3>Scope level</h3>
							<StoryText instant={instant}
								className="plugin-story__scope-value"
							>
								{scene.act ?? 'Overview'}
							</StoryText>
						</div>
						<ol className="plugin-story__hierarchy">
							{(
								['main', 'parent', 'current', 'child'] as const
							).map((name, depth) => (
								<li
									key={name}
									style={{
										marginInlineStart: `calc(${depth} * var(--scope-indent))`
									}}
									data-active={scene.reached[name]}
								>
									{depth > 0 && (
										<span
											className="plugin-story__scope-arrow"
											aria-hidden="true"
										/>
									)}
									<code>{name}</code>
									<code>/{name}</code>
									<StoryText instant={instant}
									>
										{beat === 0
											? 'Not shown yet'
											: scene.reached[name]
												? 'Runs'
												: 'Not reached'}
									</StoryText>
								</li>
							))}
						</ol>
					</div>
				)
			}}
		</Storyboard>
	)
}
