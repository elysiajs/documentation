import { expect, test } from 'bun:test'
import { curvedRail } from '../interactive-code/curved-rail'
import { buildTrace, type TraceStep } from './model'
import { playedRailRuns } from './played-rail'

function runsFor(trace: TraceStep[]) {
	return playedRailRuns(trace, trace.map((step) => ({
		index: step.index, x: step.stage === 'error' ? 30 : 10, y: step.index * 30
	})))
}

test('an inactive error branch leaves the normal played rail continuous', () => {
	const trace = buildTrace([])
	const runs = runsFor(trace)
	expect(runs).toHaveLength(1)
	expect(runs[0].branch).toBeNull()
	expect(runs[0].points.map((point) => trace[point.index].stage)).not.toContain('error')
})

test('a beforeHandle error ends the main played line before skipped route work', () => {
	const trace = buildTrace([
		{ id: 'before', stage: 'beforeHandle', action: 'error' },
		{ id: 'error', stage: 'error', action: 'continue' }
	])
	const runs = runsFor(trace)
	expect(runs.map((run) => run.branch)).toEqual([null, 1, null])
	expect(trace[runs[0].points.at(-1)!.index].id).toBe('before')
	expect(trace[runs[2].points[0].index].stage).toBe('sent')
	expect(runs.flatMap((run) => run.points).every((point) => trace[point.index].skippedBy === null)).toBe(true)
	expect(runs.map((run) => curvedRail(run.points)).join(' ').match(/M /g)).toHaveLength(3)
})

test('a normal short circuit breaks the played line across its skipped handler', () => {
	const trace = buildTrace([{ id: 'before', stage: 'beforeHandle', action: 'return' }])
	const runs = runsFor(trace)
	expect(runs.map((run) => run.branch)).toEqual([null, null])
	expect(trace[runs[0].points.at(-1)!.index].id).toBe('before')
	expect(trace[runs[1].points[0].index].stage).toBe('afterHandle')
})

test('mapper retries keep separate main runs and separate error visits', () => {
	const trace = buildTrace([
		{ id: 'mapper', stage: 'mapResponse', action: 'error' },
		{ id: 'recover', stage: 'error', action: 'return' }
	])
	const runs = runsFor(trace)
	expect(runs.map((run) => run.branch)).toEqual([null, 1, null, 2, null, null])
	for (const run of runs) {
		expect(new Set(run.points.map((point) => {
			const step = trace[point.index]
			return step.stage === 'error' ? step.visit : null
		}))).toEqual(new Set([run.branch]))
	}
})
