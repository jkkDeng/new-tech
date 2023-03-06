import { themeConfig } from './themeConfig'

export default {
    // These are app level configs.
    lang: 'zh-CN',
    title: 'My VitePress',
    titleTemplate: 'hello world',
    description: 'Vite & Vue powered static site generator.',
    appearance: true,
    markdown: {
        config: (md) => {
            // const { button } = require('../../example/components/button.vue')
            // md.use(button)
        },

        lineNumbers: true
    },
    NotFound: () => "custom 404", 
    outDir: 'public',
    themeConfig
}