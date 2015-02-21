/*
 * Updates class
 *
 * Dependences:
 * - Waterfall plugin (waterfall.js)
 */

+function ($) { "use strict";

    var UpdateProcess = function () {

        // Init
        this.init()
    }

    UpdateProcess.prototype.init = function() {
        var self = this
        this.activeStep = null
        this.updateSteps = null
    }

    UpdateProcess.prototype.execute = function(steps) {
        this.updateSteps = steps
        this.runUpdate()
    }

    UpdateProcess.prototype.runUpdate = function(fromStep) {
        $.waterfall.apply(this, this.buildEventChain(this.updateSteps, fromStep))
            .fail(function(reason){
                var
                    template = $('#executeFailed').html(),
                    html = Mustache.to_html(template, { reason: reason })

                $('#executeActivity').hide()
                $('#executeStatus').html(html)
            })
    }

    UpdateProcess.prototype.retryUpdate = function() {
        $('#executeActivity').show()
        $('#executeStatus').html('')

        this.runUpdate(this.activeStep)
    }

    UpdateProcess.prototype.buildEventChain = function(steps, fromStep) {
        var self = this,
            eventChain = [],
            skipStep = fromStep ? true : false

        $.each(steps, function(index, step){

            if (step == fromStep)
                skipStep = false

            if (skipStep)
                return true // Continue

            eventChain.push(function(){
                var deferred = $.Deferred()

                self.activeStep = step
                self.setLoadingBar(true, step.label)

                $.request('onExecuteStep', {
                    data: step,
                    success: function(data){
                        setTimeout(function() { deferred.resolve() }, 600)

                        if (step.code == 'completeUpdate' || step.code == 'completeInstall')
                            this.success(data)
                        else
                            self.setLoadingBar(false)
                    },
                    error: function(data){
                        self.setLoadingBar(false)
                        deferred.reject(data.responseText)
                    }
                })

                return deferred
            })
        })

        return eventChain
    }

    UpdateProcess.prototype.setLoadingBar = function(state, message) {
        var loadingBar = $('#executeLoadingBar'),
            messageDiv = $('#executeMessage')

        if (state)
            loadingBar.removeClass('bar-loaded')
        else
            loadingBar.addClass('bar-loaded')

        if (message)
            messageDiv.text(message)
    }

    if ($.oc === undefined)
        $.oc = {}

    $.oc.updateProcess = new UpdateProcess;

    // $(document).ready(function(){
    //     new $oc.updateProcess
    // })

}(window.jQuery);