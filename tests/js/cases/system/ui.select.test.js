import { assert } from 'chai'
import fakeDom from 'helpers/fakeDom'

describe('modules/system/assets/ui/js/select.js', function () {
    describe('AJAX processResults function', function () {
        let dom,
            window,
            processResults,
            keyValResultFormat = {
                value1: 'text1',
                value2: 'text2'
            },
            select2ResultFormat = [
                {
                    id: 'value1',
                    text: 'text1',
                    disabled: true
                },
                {
                    id: 'value2',
                    text: 'text2',
                    selected: false
                }
            ]

        this.timeout(1000)

        beforeEach((done) => {
            // Load framework.js and select.js in the fake DOM
            dom = fakeDom(`
                    <select class="custom-select" data-handler="onSearch"></select>
                    <script src="file://./node_modules/jquery/dist/jquery.js" id="jqueryScript"></script>
                    <script src="file://./modules/system/assets/js/framework.js" id="frameworkScript"></script>
                    <script src="file://./modules/system/assets/ui/js/select.js" id="selectScript"></script>
            `)

            window = dom.window

            window.selectScript.onload = () => {
                window.jQuery.fn.select2 = function(options) {
                    processResults = options.ajax.processResults
                    done()
                }
            }
        })

        afterEach(() => {
            window.close()
        })

        it('supports a key-value mapping on the "result" key', function () {
            let result = processResults({ result: keyValResultFormat })
            assert.deepEqual(result, { results: [
                {
                    id: 'value1',
                    text: 'text1'
                },
                {
                    id: 'value2',
                    text: 'text2'
                }
            ]})
        })

        it('supports a key-value mapping on the "results" key', function() {
            let result = processResults({ results: keyValResultFormat })
            assert.deepEqual(result, { results: [
                {
                    id: 'value1',
                    text: 'text1'
                },
                {
                    id: 'value2',
                    text: 'text2'
                }
            ]})
        })

        it('passes through other data provided with key-value mapping', function() {
            let result = processResults({ result: keyValResultFormat, other1: 1, other2: '2' })
            assert.include(result, { other1: 1, other2: '2'})
        })

        it('supports the Select2 result format on the "result" key', function() {
            let result = processResults({ result: select2ResultFormat })
            assert.deepEqual(result, { results: select2ResultFormat })
        })

        it('passes through the Select2 result format on the "results" key', function() {
            let result = processResults({ results: select2ResultFormat })
            assert.deepEqual(result, { results: select2ResultFormat })
        })

        it('passes through other data provided with Select2 results format', function() {
            let result = processResults({ results: select2ResultFormat, pagination: { more: true }, other: 'value' })
            assert.deepInclude(result, { pagination: { more: true }, other: 'value' })
        })

        it('passes through the Select2 format with a group as the first entry', function() {
            let data = [
                {
                    text: 'Label',
                    children: select2ResultFormat
                }
            ]

            let result = processResults({ results: data })
            assert.deepEqual(result, { results: data })
        })
    })
})
