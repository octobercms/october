import { assert } from 'chai'
import fakeDom from 'helpers/fakeDom'
import sinon from 'sinon'

describe('framework.js', function () {
    describe('ajaxRequests through JS', function () {
        let dom,
            window,
            xhr,
            requests = []

        this.timeout(3000)

        beforeEach(() => {
            // Load framework.js in the fake DOM
            dom = fakeDom(
                '<script src="file://./node_modules/jquery/dist/jquery.js" id="jqueryScript"></script>' +
                '<script src="file://./modules/system/assets/js/framework.js" id="frameworkScript"></script>',
                {
                    beforeParse: (window) => {
                        // Mock XHR for tests below
                        xhr = sinon.useFakeXMLHttpRequest()
                        xhr.onCreate = (request) => {
                            requests.push(request)
                        }
                        window.XMLHttpRequest = xhr
                    }
                }
            )
            window = dom.window

            // Enable CORS on jQuery
            window.jqueryScript.onload = () => {
                window.jQuery.support.cors = true
            }
        })

        afterEach(() => {
            // Close window and restore XHR functionality to default
            window.XMLHttpRequest = sinon.xhr.XMLHttpRequest
            window.close()
            requests = []
        })

        it('can make a successful AJAX request', function (done) {
            window.frameworkScript.onload = () => {
                window.$.request('test::onTest', {
                    success: function () {
                        done()
                    },
                    error: function () {
                        done(new Error('AJAX call failed'))
                    }
                })

                assert(
                    requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                    'Incorrect October request handler'
                )

                // Mock a successful response from the server
                requests[1].respond(
                    200,
                    {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify({
                        'successful': true
                    })
                )
            }
        })

        it('can make a unsuccessful AJAX request', function (done) {
            window.frameworkScript.onload = () => {
                window.$.request('test::onTest', {
                    success: function () {
                        done(new Error('AJAX call succeeded'))
                    },
                    error: function () {
                        done()
                    }
                })

                assert(
                    requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                    'Incorrect October request handler'
                )

                // Mock a 404 Not Found response from the server
                requests[1].respond(
                    404,
                    {
                        'Content-Type': 'text/html'
                    },
                    ''
                )
            }
        })
    })

    describe('ajaxRequests through HTML attributes', function () {
        let dom,
            window,
            xhr,
            alertPromise,
            requests = []

        this.timeout(3000)

        beforeEach(() => {
            // Load framework.js in the fake DOM
            dom = fakeDom(
                '<a href="javascript:;" data-request="test::onTest"></a>' +
                '<script src="file://./node_modules/jquery/dist/jquery.js" id="jqueryScript"></script>' +
                '<script src="file://./modules/system/assets/js/framework.js" id="frameworkScript"></script>',
                {
                    beforeParse: (window) => {
                        // Mock XHR for tests below
                        xhr = sinon.useFakeXMLHttpRequest()
                        xhr.onCreate = (request) => {
                            requests.push(request)
                        }
                        window.XMLHttpRequest = xhr

                        // Mock alert
                        alertPromise = new Promise(function (resolve) {
                            sinon.stub(window, 'alert').callsFake((text) => {
                                console.log('Hi')
                                resolve(text)
                            })
                        })

                    }
                }
            )
            window = dom.window

            // Enable CORS on jQuery
            window.jqueryScript.onload = () => {
                window.jQuery.support.cors = true
            }
        })

        afterEach(() => {
            // Close window and restore XHR functionality to default
            window.XMLHttpRequest = sinon.xhr.XMLHttpRequest
            window.close()
            requests = []
        })

        it('can make a successful AJAX request', function (done) {
            console.log(alertPromise)

            alertPromise.then((text) => {
                console.log(text)
            })

            window.frameworkScript.onload = () => {
                window.$('a').click()

                // Mock a successful response from the server
                requests[1].respond(
                    200,
                    {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify({
                        'successful': true
                    })
                )
            }
        })

        it('can make a unsuccessful AJAX request', function (done) {
            window.frameworkScript.onload = () => {
                window.$('a').click()

                // Mock a 404 Not Found response from the server
                requests[1].respond(
                    404,
                    {
                        'Content-Type': 'text/html'
                    },
                    ''
                )
            }
        })
    })
})
