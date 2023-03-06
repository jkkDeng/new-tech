const themeConfig = {
    logo: '/logo.png',
    nav: [
        { text: 'Guide', link: '/guide' },
        { text: 'index', link: '/index' },
        {
            text: 'Dropdown Menu',
            items: [
                { text: 'index', link: '/index' },
                { text: 'darkerin', link: '/darkerin' },
            ]
        }
    ],
    sidebar: [
        {
            text: 'Guide',
            items: [
                { text: 'index', link: '/index' },
                { text: 'darkerin', link: '/darkerin' },
            ]
        }
    ],
    lastUpdatedText: 'Updated Date',
    docFooter: {
        prev: 'Pagina prior',
        next: 'Proxima pagina'
    },
    outlineTitle: 'In hac pagina',
    socialLinks: [
        { icon: 'github', link: 'https://github.com/jkkDeng' },
        { icon: 'twitter', link: '...' },
        // You can also add custom icons by passing SVG as string:
        {
            icon: {
                svg: '<svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Dribbble</title><path d="M12...6.38z"/></svg>'
            },
            link: '...'
        }
    ], footer: {
        message: 'Released under the MIT License.',
        copyright: 'Copyright © 2019-present Evan You'
    }, carbonAds: {
        code: 'your-carbon-code',
        placement: 'your-carbon-placement'
    }
}

export { themeConfig }