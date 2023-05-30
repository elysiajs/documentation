require('@testing-library/jest-dom')

/* Mock jest dynamic */
jest.mock('next/dynamic', () => () => {
    const LoadableComponent = () => null
    LoadableComponent.displayName = 'LoadableComponent'
    LoadableComponent.preload = jest.fn()
    return LoadableComponent;
});