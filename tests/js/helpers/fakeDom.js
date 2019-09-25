import { JSDOM } from 'jsdom'

const defaults = {
    url: 'https://october.example.org/',
    referer: null,
    contentType: 'text/html',
    head: '<!DOCTYPE html><html><head><title>Fake document</title></head>',
    bodyStart: '<body>',
    bodyEnd: '</body>',
    foot: '</html>',
    beforeParse: null
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
            pretendToBeVisual: true,
            beforeParse: (typeof settings.beforeParse === 'function')
                ? settings.beforeParse
                : undefined
        }
    )

    return dom
}

export default fakeDom
