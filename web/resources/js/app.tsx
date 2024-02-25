import React, { ReactNode } from 'react'
import {createInertiaApp } from '@inertiajs/inertia-react'
import {resolvePageComponent} from 'laravel-vite-plugin/inertia-helpers'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'

createInertiaApp({
    // Below you can see that we are going to get all React components from resources/js/Pages folder
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`,import.meta.glob('./Pages/**/*.tsx')) as Promise<ReactNode>,
    setup({ el, App, props }) {
        createRoot(el).render(
            // <Provider>
            //     <App {...props} />
            // </Provider>
            <App {...props} />
        )
    },
})