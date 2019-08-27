import { assert } from 'chai'
import fakeDom from 'helpers/fakeDom'
import sinon from 'sinon'

describe('framework.js', () => {
    describe('ajaxRequests through JS', () => {
        let dom,
            window,
            xhr

        beforeEach(() => {
            // Load framework.js in the fake DOM
            dom = fakeDom(
                '<script src="file://./node_modules/jquery/dist/jquery.js" id="jqueryScript"></script>' +
                '<script src="file://./modules/system/assets/js/framework.js" id="frameworkScript"></script>'
            )
            window = dom.window

            // Mock XHR for tests below
            xhr = sinon.useFakeXMLHttpRequest()
            console.log(window.XMLHttpRequest)
        })

        afterEach(() => {
            // Close window and restore XHR functionality to default
            window.XMLHttpRequest = sinon.xhr.XMLHttpRequest
            window.close()
            xhr.restore()
        })

        it('can make a successful AJAX request', function (done) {
            this.timeout(8000)

            // Mock a successful response from the server
            xhr.onCreate = (request) => {
                request.respond(
                    200,
                    {
                        'Content-Type': 'application/json'
                    },
                    '{"success": true}'
                )
            }

            window.frameworkScript.onload = () => {
                window.$.request('onTest', {
                    success: function () {
                        done()
                    },
                    error: function () {
                        done(new Error('AJAX call failed'))
                    }
                })
            }
        })

        // it('can make a unsuccessful AJAX request', function (done) {
        //     this.timeout(4000)

        //     window.frameworkScript.onload = () => {
        //         sinon.stub(window.$, 'ajax').callsFake((options) => {
        //             const ajaxMock = window.$.Deferred()

        //             ajaxMock.resolve({success: false})
        //             options.error()
        //             return ajaxMock.promise()
        //         })

        //         window.$.request('onTest', {
        //             success: function () {
        //                 assert(true, 'AJAX call succeeded')
        //                 done()
        //             },
        //             error: function () {
        //                 assert(true)
        //                 done()
        //             }
        //         })
        //     }
        // })
    })

    // describe('ajaxRequests through HTML attributes', () => {
    //     let dom, window

    //     beforeEach(() => {
    //         dom = fakeDom(
    //             '<a href="javascript:;" data-request="test::onTest"></a>' +
    //             '<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>' +
    //             '<script src="file://./modules/system/assets/js/framework.js" id="frameworkScript"></script>'
    //         )
    //         window = dom.window
    //     })

    //     afterEach(() => {
    //         window.close()
    //     })

    //     it('can make a successful AJAX request', function (done) {
    //         this.timeout(4000)

    //         window.frameworkScript.onload = () => {
    //             const xhr =

    //             window.$('a').click()
    //         }
    //     })

    //     it('can make a unsuccessful AJAX request', function (done) {
    //         this.timeout(4000)

    //         window.frameworkScript.onload = () => {
    //             sinon.stub(window.$, 'ajax').callsFake((options) => {
    //                 const ajaxMock = window.$.Deferred()

    //                 ajaxMock.resolve({success: false})
    //                 options.error()
    //                 done()
    //             })

    //             window.$('a').click()
    //         }
    //     })
    // })
})
