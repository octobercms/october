import { assert } from 'chai'
import fakeDom from 'helpers/fakeDom'
import sinon from 'sinon'

describe('modules/system/assets/js/framework.js', function () {
    describe('ajaxRequests through JS', function () {
        let dom,
            window,
            xhr,
            requests = []

        this.timeout(1000)

        beforeEach(() => {
            // Load framework.js in the fake DOM
            dom = fakeDom(
                '<div id="partialId" class="partialClass">Initial content</div>' +
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

                        // Allow window.location.assign() to be stubbed
                        delete window.location
                        window.location = {
                            href: 'https://october.example.org/',
                            assign: sinon.stub()
                        }
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

                try {
                    assert(
                        requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                        'Incorrect October request handler'
                    )
                } catch (e) {
                    done(e)
                }

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

        it('can make an unsuccessful AJAX request', function (done) {
            window.frameworkScript.onload = () => {
                window.$.request('test::onTest', {
                    success: function () {
                        done(new Error('AJAX call succeeded'))
                    },
                    error: function () {
                        done()
                    }
                })

                try {
                    assert(
                        requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                        'Incorrect October request handler'
                    )
                } catch (e) {
                    done(e)
                }

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

        it('can update a partial via an ID selector', function (done) {
            window.frameworkScript.onload = () => {
                window.$.request('test::onTest', {
                    complete: function () {
                        let partialContent = dom.window.document.getElementById('partialId').textContent
                        try {
                            assert(
                                partialContent === 'Content passed through AJAX',
                                'Partial content incorrect - ' +
                                'expected "Content passed through AJAX", ' +
                                'found "' + partialContent + '"'
                            )
                            done()
                        } catch (e) {
                            done(e)
                        }
                    }
                })

                try {
                    assert(
                        requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                        'Incorrect October request handler'
                    )
                } catch (e) {
                    done(e)
                }

                // Mock a response from the server that includes a partial change via ID
                requests[1].respond(
                    200,
                    {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify({
                        '#partialId': 'Content passed through AJAX'
                    })
                )
            }
        })

        it('can update a partial via a class selector', function (done) {
            window.frameworkScript.onload = () => {
                window.$.request('test::onTest', {
                    complete: function () {
                        let partialContent = dom.window.document.getElementById('partialId').textContent
                        try {
                            assert(
                                partialContent === 'Content passed through AJAX',
                                'Partial content incorrect - ' +
                                'expected "Content passed through AJAX", ' +
                                'found "' + partialContent + '"'
                            )
                            done()
                        } catch (e) {
                            done(e)
                        }
                    }
                })

                try {
                    assert(
                        requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                        'Incorrect October request handler'
                    )
                } catch (e) {
                    done(e)
                }

                // Mock a response from the server that includes a partial change via a class
                requests[1].respond(
                    200,
                    {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify({
                        '.partialClass': 'Content passed through AJAX'
                    })
                )
            }
        })

        it('can redirect after a successful AJAX request', function (done) {
            this.timeout(1000)

            // Detect a redirect
            window.location.assign.callsFake((url) => {
                try {
                    assert(
                        url === '/test/success',
                        'Non-matching redirect URL'
                    )
                    done()
                } catch (e) {
                    done(e)
                }
            })

            window.frameworkScript.onload = () => {
                window.$.request('test::onTest', {
                    redirect: '/test/success',
                })

                try {
                    assert(
                        requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                        'Incorrect October request handler'
                    )
                } catch (e) {
                    done(e)
                }

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

        it('can send extra data with the AJAX request', function (done) {
            this.timeout(1000)

            window.frameworkScript.onload = () => {
                window.$.request('test::onTest', {
                    data: {
                        test1: 'First',
                        test2: 'Second'
                    },
                    success: function () {
                        done()
                    }
                })

                try {
                    assert(
                        requests[1].requestBody === 'test1=First&test2=Second',
                        'Data incorrect or not included in request'
                    )
                    assert(
                        requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                        'Incorrect October request handler'
                    )
                } catch (e) {
                    done(e)
                }

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

        it('can call a beforeUpdate handler', function (done) {
            const beforeUpdate = function (data, status, jqXHR) {
            }
            const beforeUpdateSpy = sinon.spy(beforeUpdate)

            window.frameworkScript.onload = () => {
                window.$.request('test::onTest', {
                    beforeUpdate: beforeUpdateSpy
                })

                try {
                    assert(
                        requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                        'Incorrect October request handler'
                    )
                } catch (e) {
                    done(e)
                }

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

                try {
                    assert(
                        beforeUpdateSpy.withArgs(
                            {
                                'successful': true
                            },
                            'success'
                        ).calledOnce
                    )
                    done()
                } catch (e) {
                    done(e)
                }
            }
        })
    })

    describe('ajaxRequests through HTML attributes', function () {
        let dom,
            window,
            xhr,
            requests = []

        this.timeout(1000)

        beforeEach(() => {
            // Load framework.js in the fake DOM
            dom = fakeDom(
                '<a ' +
                    'id="standard" ' +
                    'href="javascript:;" ' +
                    'data-request="test::onTest" ' +
                    'data-request-success="test(\'success\')" ' +
                    'data-request-error="test(\'failure\')"' +
                '></a>' +
                '<a ' +
                    'id="redirect" ' +
                    'href="javascript:;" ' +
                    'data-request="test::onTest" ' +
                    'data-request-redirect="/test/success"' +
                '></a>' +
                '<a ' +
                    'id="dataLink" ' +
                    'href="javascript:;" ' +
                    'data-request="test::onTest" ' +
                    'data-request-data="test1: \'First\', test2: \'Second\'" ' +
                    'data-request-success="test(\'success\')" ' +
                    'data-request-before-update="beforeUpdateSpy($el.get(), data, textStatus)"' +
                '></a>' +
                '<div id="partialId" class="partialClass">Initial content</div>' +
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

                        // Add a stub for the request handlers
                        window.test = sinon.stub()

                        // Add a spy for the beforeUpdate handler
                        window.beforeUpdate = function (element, data, status) {
                        }
                        window.beforeUpdateSpy = sinon.spy(window.beforeUpdate)

                        // Stub out window.alert
                        window.alert = sinon.stub()

                        // Allow window.location.assign() to be stubbed
                        delete window.location
                        window.location = {
                            href: 'https://october.example.org/',
                            assign: sinon.stub()
                        }
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
                window.test.callsFake((response) => {
                    assert(response === 'success', 'Response handler was not "success"')
                    done()
                })

                window.$('a#standard').click()

                try {
                    assert(
                        requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                        'Incorrect October request handler'
                    )
                } catch (e) {
                    done(e)
                }

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

        it('can make an unsuccessful AJAX request', function (done) {
            window.frameworkScript.onload = () => {
                window.test.callsFake((response) => {
                    assert(response === 'failure', 'Response handler was not "failure"')
                    done()
                })

                window.$('a#standard').click()

                try {
                    assert(
                        requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                        'Incorrect October request handler'
                    )
                } catch (e) {
                    done(e)
                }

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


        it('can update a partial via an ID selector', function (done) {
            window.frameworkScript.onload = () => {
                window.test.callsFake(() => {
                    let partialContent = dom.window.document.getElementById('partialId').textContent
                    try {
                        assert(
                            partialContent === 'Content passed through AJAX',
                            'Partial content incorrect - ' +
                            'expected "Content passed through AJAX", ' +
                            'found "' + partialContent + '"'
                        )
                        done()
                    } catch (e) {
                        done(e)
                    }
                })

                window.$('a#standard').click()

                try {
                    assert(
                        requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                        'Incorrect October request handler'
                    )
                } catch (e) {
                    done(e)
                }

                // Mock a response from the server that includes a partial change via ID
                requests[1].respond(
                    200,
                    {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify({
                        '#partialId': 'Content passed through AJAX'
                    })
                )
            }
        })

        it('can update a partial via a class selector', function (done) {
            window.frameworkScript.onload = () => {
                window.test.callsFake(() => {
                    let partialContent = dom.window.document.getElementById('partialId').textContent
                    try {
                        assert(
                            partialContent === 'Content passed through AJAX',
                            'Partial content incorrect - ' +
                            'expected "Content passed through AJAX", ' +
                            'found "' + partialContent + '"'
                        )
                        done()
                    } catch (e) {
                        done(e)
                    }
                })

                window.$('a#standard').click()

                try {
                    assert(
                        requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                        'Incorrect October request handler'
                    )
                } catch (e) {
                    done(e)
                }

                // Mock a response from the server that includes a partial change via a class
                requests[1].respond(
                    200,
                    {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify({
                        '.partialClass': 'Content passed through AJAX'
                    })
                )
            }
        })

        it('can redirect after a successful AJAX request', function (done) {
            this.timeout(1000)

            // Detect a redirect
            window.location.assign.callsFake((url) => {
                try {
                    assert(
                        url === '/test/success',
                        'Non-matching redirect URL'
                    )
                    done()
                } catch (e) {
                    done(e)
                }
            })

            window.frameworkScript.onload = () => {
                window.$('a#redirect').click()

                try {
                    assert(
                        requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                        'Incorrect October request handler'
                    )
                } catch (e) {
                    done(e)
                }

                // Mock a successful response from the server
                requests[1].respond(
                    200,
                    {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify({
                        'succesful': true
                    })
                )
            }
        })

        it('can send extra data with the AJAX request', function (done) {
            this.timeout(1000)

            window.frameworkScript.onload = () => {
                window.test.callsFake((response) => {
                    assert(response === 'success', 'Response handler was not "success"')
                    done()
                })

                window.$('a#dataLink').click()

                try {
                    assert(
                        requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                        'Incorrect October request handler'
                    )
                } catch (e) {
                    done(e)
                }

                // Mock a successful response from the server
                requests[1].respond(
                    200,
                    {
                        'Content-Type': 'application/json'
                    },
                    JSON.stringify({
                        'succesful': true
                    })
                )
            }
        })

        it('can call a beforeUpdate handler', function (done) {
            this.timeout(1000)

            window.frameworkScript.onload = () => {
                window.test.callsFake((response) => {
                    assert(response === 'success', 'Response handler was not "success"')
                })

                window.$('a#dataLink').click()

                try {
                    assert(
                        requests[1].requestHeaders['X-OCTOBER-REQUEST-HANDLER'] === 'test::onTest',
                        'Incorrect October request handler'
                    )
                } catch (e) {
                    done(e)
                }

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

                try {
                    assert(
                        window.beforeUpdateSpy.withArgs(
                            window.$('a#dataLink').get(),
                            {
                                'successful': true
                            },
                            'success'
                        ).calledOnce,
                        'beforeUpdate handler never called, or incorrect arguments provided'
                    )
                    done()
                } catch (e) {
                    done(e)
                }
            }
        })
    })
})
