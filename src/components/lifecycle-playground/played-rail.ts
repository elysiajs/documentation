import type { RailPoint } from '../interactive-code/curved-rail'
import type { TraceStep } from './model'

type Point = RailPoint & { index: number }
type Run = { branch: number | null; points: Point[] }

export function playedRailRuns(trace: readonly TraceStep[], points: readonly Point[]) {
	const markers = new Map(points.map((point) => [point.index, point]))
	const runs: Run[] = []
	let run: Run | undefined
	for (const step of trace) {
		if (step.inactive) continue
		if (step.skippedBy !== null) {
			run = undefined
			continue
		}
		const branch = step.stage === 'error' ? step.visit : null
		if (!run || run.branch !== branch) {
			run = { branch, points: [] }
			runs.push(run)
		}
		const point = markers.get(step.index)
		if (point) run.points.push(point)
	}
	return runs.filter((run) => run.points.length)
}
