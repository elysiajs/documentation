import { useSyncExternalStore } from 'react';

export interface TutorialState {
	testcasesResult: boolean[];
	asideTab: 'task' | 'docs' | null;
	doc: string;
}

const initialState: TutorialState = { testcasesResult: [], asideTab: 'task', doc: '/' };
let state = initialState;
const listeners = new Set<() => void>();
const getServerSnapshot = () => initialState;

export const tutorialStore = {
	get: (): TutorialState => state,
	set(patch: Partial<TutorialState>): void {
		state = { ...state, ...patch };
		for (const listener of listeners) listener();
	},
	subscribe(fn: () => void): () => void {
		listeners.add(fn);
		return () => { listeners.delete(fn); };
	}
};

export function useTutorialStore<T>(select: (s: TutorialState) => T): T {
	return select(useSyncExternalStore(tutorialStore.subscribe, tutorialStore.get, getServerSnapshot));
}
