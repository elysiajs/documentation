// ![INFO] add types because view-transitions-api is experimental - https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition
/// <reference types="view-transitions-api-types" />

// [INFO] allow to import vue components - https://stackoverflow.com/questions/42002394/importing-vue-components-in-typescript-file
declare module '*.vue' {
    import { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}
