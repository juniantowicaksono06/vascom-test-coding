import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default ({mode}) => {
    process.env = {...process.env, ...loadEnv(mode, process.cwd())};
    return defineConfig({
        server: {
            port: 5175,
            host: true,
            hmr: {
                host: process.env.VITE_HMR_HOST || "localhost",
            },
        },
        plugins: [
            react(), // React plugin that we installed for vite.js
            laravel({
                input: ['resources/css/app.css', 'resources/js/app.js'],
                refresh: true,
            }),
        ],
    });
}