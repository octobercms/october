import { assert } from 'chai'
import fakeDom from 'helpers/fakeDom'
import sinon from 'sinon'

describe('framework.js', () => {
    describe('ajaxRequests through JS', () => {
        let dom, window

        beforeEach(() => {
            dom = fakeDom(
                '<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>' +
                '<script src="file://./modules/system/assets/js/framework.js" id="frameworkScript"></script>'
            )
            window = dom.window
        })

        afterEach(() => {
            window.close()
        })

        it('can make a successful AJAX request', function (done) {
            this.timeout(4000)

            window.frameworkScript.onload = () => {
                sinon.stub(window.$, 'ajax').callsFake((options) => {
                    const ajaxMock = window.$.Deferred()

                    ajaxMock.resolve({success: true})
                    options.success()
                    return ajaxMock.promise()
                })

                window.$.request('onTest', {
                    success: function () {
                        assert(true)
                        done()
                    },
                    error: function () {
                        assert(false, 'AJAX call failed')
                        done()
                    }
                })
            }
        })



        it('can make a unsuccessful AJAX request', function (done) {
            this.timeout(4000)

            window.frameworkScript.onload = () => {
                sinon.stub(window.$, 'ajax').callsFake((options) => {
                    const ajaxMock = window.$.Deferred()

                    ajaxMock.resolve({success: false})
                    options.error()
                    return ajaxMock.promise()
                })

                window.$.request('onTest', {
                    success: function () {
                        assert(true, 'AJAX call succeeded')
                        done()
                    },
                    error: function () {
                        assert(true)
                        done()
                    }
                })
            }
        })
    })


    describe('ajaxRequests through HTML attributes', () => {
        let dom, window

        beforeEach(() => {
            dom = fakeDom(
                '<a href="javascript:;" data-request="test::onTest"></a>' +
                '<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>' +
                '<script src="file://./modules/system/assets/js/framework.js" id="frameworkScript"></script>'
            )
            window = dom.window
        })

        afterEach(() => {
            window.close()
        })

        it('can make a successful AJAX request', function (done) {
            this.timeout(4000)

            window.frameworkScript.onload = () => {
                sinon.stub(window.$, 'ajax').callsFake((options) => {
                    const ajaxMock = window.$.Deferred()

                    ajaxMock.resolve({success: true})
                    options.success()
                    done()
                })

                window.$('a').click()
            }
        })



        it('can make a unsuccessful AJAX request', function (done) {
            this.timeout(4000)

            window.frameworkScript.onload = () => {
                sinon.stub(window.$, 'ajax').callsFake((options) => {
                    const ajaxMock = window.$.Deferred()

                    ajaxMock.resolve({success: false})
                    options.error()
                    done()
                })

                window.$('a').click()
            }
        })
    })
})
