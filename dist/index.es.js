import { disposeWith } from '@most/disposable';


var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
};

var createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

var nextAnimationFrame = function nextAnimationFrame(afp) {
    return new AnimationFrame(afp);
};

var animationFrames = function animationFrames(afp) {
    // return continueWith(function () {
    //   return animationFrames(afp);
    // }, nextAnimationFrame(afp));
    return {
        f: function () {
            return animationFrames(afp);
        },
        source: nextAnimationFrame(afp)
    }
};

var AnimationFrame = function () {
    function AnimationFrame(afp) {
        classCallCheck(this, AnimationFrame);

        this.afp = afp;
    }

    var _originTime = null;

    function _getCurrentTime() {
        if (_originTime === null) {
            _originTime = window.performance.now();
            return 0;
        }

        var currentTime = window.performance.now() - _originTime;

        _originTime = window.performance.now();

        return currentTime;
    }


    function _runRequest(sink, scheduler$$1) {
        var propagate = function propagate(timestamp) {
            // edit by wonder
            // return eventThenEnd(currentTime(scheduler$$1), timestamp, sink);
            // return eventThenEnd(currentTime(newDefaultScheduler() ), timestamp, sink);
            eventThenEnd(_getCurrentTime, timestamp, sink);

            _runRequest(sink, null);
        };
        // var request = this.afp.requestAnimationFrame(propagate);
        var request = window.requestAnimationFrame(propagate);


        // edit by wonder
        // return disposeWith(this.afp.cancelAnimationFrame, request);

        return disposeWith(function (requestId) {
            window.cancelAnimationFrame(requestId);
        }, request)
    }


    createClass(AnimationFrame, [{
        key: 'run',
        value: _runRequest
    }]);
    return AnimationFrame;
}();

var eventThenEnd = function eventThenEnd(t, x, sink) {
    sink.event(t, x);
    sink.end(t);
};

export { nextAnimationFrame, animationFrames };