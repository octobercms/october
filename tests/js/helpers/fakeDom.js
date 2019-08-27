import { JSDOM } from 'jsdom'

const defaults = {
    url: 'https://october.example.org/',
    referer: null,
    contentType: 'text/html',
    head: '<!DOCTYPE html><html><head><title>Fake document</title></head>',
    bodyStart: '<body>',
    bodyEnd: '</body>',
    foot: '</html>'
}

const fakeDom = (content, options) => {
    const settings = Object.assign({}, defaults, options)

    const dom = new JSDOM(
        settings.head +
        settings.bodyStart +
        (content + '') +
        settings.bodyEnd +
        settings.foot,
        {
            url: settings.url,
            referrer: settings.referer || undefined,
            contentType: settings.contenType,
            includeNodeLocations: true,
            runScripts: 'dangerously',
            resources: 'usable',
            pretendToBeVisual: true
        }
    )

    return dom
}

export default fakeDom
