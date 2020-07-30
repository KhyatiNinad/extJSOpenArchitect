! function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define("resizeSensor", [], e);
    else { var f; "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), f.resizeSensor = e() }
}(function() {
    var define, module, exports;
    return (function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) { var a = typeof require == "function" && require; if (!u && a) return a(o, !0); if (i) return i(o, !0); var f = new Error("Cannot find module '" + o + "'"); throw f.code = "MODULE_NOT_FOUND", f }
                var l = n[o] = { exports: {} };
                t[o][0].call(l.exports, function(e) { var n = t[o][1][e]; return s(n ? n : e) }, l, l.exports, e, t, n, r)
            }
            return n[o].exports
        }
        var i = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) s(r[o]);
        return s
    })({
        1: [function(require, module, exports) {
            var css = (function(global) {
                'use strict';

                /** @var {null|Object} */
                var animationPropertiesForBrowser = null;
                /** @var {null|boolean} */
                var isCssAnimationSupported = null;

                /**
                 * Determines which style convention (properties) to follow
                 * @see https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Using_CSS_animations/Detecting_CSS_animation_support
                 * @returns {{keyframesRule: string, styleDeclaration: string, animationStartEvent: string, animationName: string}}
                 */
                function getAnimationPropertiesForBrowser() {
                    if (animationPropertiesForBrowser !== null) {
                        return animationPropertiesForBrowser;
                    }

                    var testElement = global.document.createElement('div');
                    var supportsUnprefixedAnimationProperties = ('animationName' in testElement.style);

                    // Unprefixed animation properties
                    var animationStartEvent = 'animationstart';
                    var animationName = 'resizeanim';

                    if (supportsUnprefixedAnimationProperties) {
                        return {
                            keyframesRule: '@keyframes ' + animationName + ' {from { opacity: 0; } to { opacity: 0; }}',
                            styleDeclaration: 'animation: 1ms ' + animationName + ';',
                            animationStartEvent: animationStartEvent,
                            animationName: animationName
                        };
                    }

                    // Browser specific animation properties
                    var keyframePrefix = '';
                    var browserPrefixes = ['Webkit', 'Moz', 'O', 'ms'];
                    var startEvents = ['webkitAnimationStart', 'animationstart', 'oAnimationStart', 'MSAnimationStart'];

                    var i;
                    var l = browserPrefixes.length;

                    for (i = 0; i < l; i++) {
                        if ((browserPrefixes[i] + 'AnimationName') in testElement.style) {
                            keyframePrefix = '-' + browserPrefixes[i].toLowerCase() + '-';
                            animationStartEvent = startEvents[i];
                            break;
                        }
                    }

                    animationPropertiesForBrowser = {
                        keyframesRule: '@' + keyframePrefix + 'keyframes ' + animationName + ' {from { opacity: 0; } to { opacity: 0; }}',
                        styleDeclaration: keyframePrefix + 'animation: 1ms ' + animationName + ';',
                        animationStartEvent: animationStartEvent,
                        animationName: animationName
                    };

                    return animationPropertiesForBrowser;
                }

                /**
                 * @returns {boolean}
                 */
                function isCSSAnimationSupported() {
                    if (isCssAnimationSupported !== null) {
                        return isCssAnimationSupported;
                    }

                    var testElement = global.document.createElement('div');
                    var isAnimationSupported = ('animationName' in testElement.style);

                    if (isAnimationSupported) {
                        isCssAnimationSupported = true;
                        return isCssAnimationSupported;
                    }

                    var browserPrefixes = 'Webkit Moz O ms'.split(' ');
                    var i = 0;
                    var l = browserPrefixes.length;

                    for (; i < l; i++) {
                        if ((browserPrefixes[i] + 'AnimationName') in testElement.style) {
                            isCssAnimationSupported = true;
                            return isCssAnimationSupported;
                        }
                    }

                    isCssAnimationSupported = false;
                    return isCssAnimationSupported;
                }

                /**
                 * Adds a style block that contains CSS essential for detecting resize events
                 */
                function insertResizeSensorStyles() {
                    var cssRules = [
                        (getAnimationPropertiesForBrowser().keyframesRule) ? getAnimationPropertiesForBrowser().keyframesRule : '',
                        '.ResizeSensor__resizeTriggers { ' + ((getAnimationPropertiesForBrowser().styleDeclaration) ? getAnimationPropertiesForBrowser().styleDeclaration : '') + ' visibility: hidden; opacity: 0; }',
                        '.ResizeSensor__resizeTriggers, .ResizeSensor__resizeTriggers > div, .ResizeSensor__contractTrigger:before { content: \' \'; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } .ResizeSensor__resizeTriggers > div { background: #eee; overflow: auto; } .ResizeSensor__contractTrigger:before { width: 200%; height: 200%; }'
                    ];

                    cssRules = cssRules.join(' ');

                    var headElem = global.document.head || global.document.getElementsByTagName('head')[0];

                    var styleElem = global.document.createElement('style');
                    styleElem.type = 'text/css';

                    if (styleElem.styleSheet) {
                        styleElem.styleSheet.cssText = cssRules;
                    } else {
                        styleElem.appendChild(global.document.createTextNode(cssRules));
                    }

                    headElem.appendChild(styleElem);
                }

                return {
                    insertResizeSensorStyles: insertResizeSensorStyles,
                    isAnimationSupported: isCSSAnimationSupported,
                    getAnimationPropertiesForBrowser: getAnimationPropertiesForBrowser
                };
            })(typeof window !== 'undefined' ? window : this);

            module.exports = css;

        }, {}],
        2: [function(require, module, exports) {
            var getStyle = (function(global) {
                'use strict';

                /**
                 * @param {HTMLElement} element
                 * @param {string} property
                 * @returns {null|string}
                 */
                return function(element, property) {
                    if (!('currentStyle' in element) && !('getComputedStyle' in global)) {
                        return null;
                    }

                    if (element.currentStyle) {
                        return element.currentStyle[property];
                    }

                    return global.document.defaultView.getComputedStyle(element, null).getPropertyValue(property);
                };
            })(typeof window !== 'undefined' ? window : this);

            module.exports = getStyle;

        }, {}],
        3: [function(require, module, exports) {
            var polyfill = (function(global) {
                'use strict';

                /**
                 * @see https://gist.github.com/mrdoob/838785
                 */
                function polyfillRequestAnimationFrame() {
                    if (!global.requestAnimationFrame) {
                        global.requestAnimationFrame = (function() {
                            return global.webkitRequestAnimationFrame ||
                                global.mozRequestAnimationFrame ||
                                global.oRequestAnimationFrame ||
                                global.msRequestAnimationFrame ||
                                function(callback) {
                                    global.setTimeout(callback, 1000 / 60);
                                };
                        })();
                    }

                    if (!global.cancelAnimationFrame) {
                        global.cancelAnimationFrame = (function() {
                            return global.webkitCancelAnimationFrame ||
                                global.mozCancelAnimationFrame ||
                                global.oCancelAnimationFrame ||
                                global.msCancelAnimationFrame ||
                                global.clearTimeout;
                        })();
                    }
                }

                return {
                    requestAnimationFrame: polyfillRequestAnimationFrame
                };
            })(typeof window !== 'undefined' ? window : this);

            module.exports = polyfill;

        }, {}],
        4: [function(require, module, exports) {
            var resizeSensorFactory = (function(global) {
                'use strict';

                /** @var {Function} */
                var getStyle = require('./getStyle');
                /** @var {Object} */
                var css = require('./css');

                /**
                 * @param {HTMLElement} targetElement
                 * @param {Function} callback
                 * @constructor
                 */
                var resizeSensor = function(targetElement, callback) {
                    /** @var {HTMLElement} */
                    this.targetElement = targetElement;
                    /** @var {Function} */
                    this.callback = callback;
                    /** @var {{width: int, height: int}} */
                    this.dimensions = {
                        width: 0,
                        height: 0
                    };

                    if ('attachEvent' in global.document) {
                        this.boundOnResizeHandler = this.onElementResize.bind(this);
                        this.targetElement.attachEvent('onresize', this.boundOnResizeHandler);
                        return;
                    }

                    /** @var {{container: HTMLElement, expand: HTMLElement, expandChild: HTMLElement, contract: HTMLElement}} */
                    this.triggerElements = {};
                    /** @var {int} */
                    this.resizeRAF = 0;

                    this.setup();
                };

                resizeSensor.prototype.setup = function() {
                    // Make sure the target element is "positioned"
                    if (getStyle(this.targetElement, 'position') === 'static') {
                        this.targetElement.style.position = 'relative';
                    }

                    // Create and append resize trigger elements
                    this.insertResizeTriggerElements();

                    // Start listening to events
                    this.boundScrollListener = this.handleElementScroll.bind(this);
                    this.targetElement.addEventListener('scroll', this.boundScrollListener, true);

                    if (css.isAnimationSupported()) {
                        this.boundAnimationStartListener = this.resetTriggersOnAnimationStart.bind(this);
                        this.triggerElements.container.addEventListener(
                            css.getAnimationPropertiesForBrowser().animationStartEvent,
                            this.boundAnimationStartListener
                        );
                    }

                    // Initial value reset of all triggers
                    this.resetTriggers();
                };

                resizeSensor.prototype.insertResizeTriggerElements = function() {
                    var resizeTrigger = global.document.createElement('div');
                    var expandTrigger = global.document.createElement('div');
                    var expandTriggerChild = global.document.createElement('div');
                    var contractTrigger = global.document.createElement('div');

                    resizeTrigger.className = 'ResizeSensor ResizeSensor__resizeTriggers';
                    expandTrigger.className = 'ResizeSensor__expandTrigger';
                    contractTrigger.className = 'ResizeSensor__contractTrigger';

                    expandTrigger.appendChild(expandTriggerChild);
                    resizeTrigger.appendChild(expandTrigger);
                    resizeTrigger.appendChild(contractTrigger);

                    this.triggerElements.container = resizeTrigger;
                    this.triggerElements.expand = expandTrigger;
                    this.triggerElements.expandChild = expandTriggerChild;
                    this.triggerElements.contract = contractTrigger;

                    this.targetElement.appendChild(resizeTrigger);
                };

                resizeSensor.prototype.onElementResize = function() {
                    var currentDimensions = this.getDimensions();

                    if (this.isResized(currentDimensions)) {
                        this.dimensions.width = currentDimensions.width;
                        this.dimensions.height = currentDimensions.height;
                        this.elementResized();
                    }
                };

                resizeSensor.prototype.handleElementScroll = function() {
                    var _this = this;

                    this.resetTriggers();

                    if (this.resizeRAF) {
                        global.cancelAnimationFrame(this.resizeRAF);
                    }

                    this.resizeRAF = global.requestAnimationFrame(function() {
                        var currentDimensions = _this.getDimensions();
                        if (_this.isResized(currentDimensions)) {
                            _this.dimensions.width = currentDimensions.width;
                            _this.dimensions.height = currentDimensions.height;
                            _this.elementResized();
                        }
                    });
                };

                /**
                 * @param {{width: number, height: number}} currentDimensions
                 * @returns {boolean}
                 */
                resizeSensor.prototype.isResized = function(currentDimensions) {
                    return (currentDimensions.width !== this.dimensions.width || currentDimensions.height !== this.dimensions.height);
                };

                /**
                 * @returns {{width: number, height: number}}
                 */
                resizeSensor.prototype.getDimensions = function() {
                    return {
                        width: this.targetElement.offsetWidth,
                        height: this.targetElement.offsetHeight
                    };
                };

                /**
                 * @param {Event} event
                 */
                resizeSensor.prototype.resetTriggersOnAnimationStart = function(event) {
                    if (event.animationName === css.getAnimationPropertiesForBrowser().animationName) {
                        this.resetTriggers();
                    }
                };

                resizeSensor.prototype.resetTriggers = function() {
                    this.triggerElements.contract.scrollLeft = this.triggerElements.contract.scrollWidth;
                    this.triggerElements.contract.scrollTop = this.triggerElements.contract.scrollHeight;
                    this.triggerElements.expandChild.style.width = this.triggerElements.expand.offsetWidth + 1 + 'px';
                    this.triggerElements.expandChild.style.height = this.triggerElements.expand.offsetHeight + 1 + 'px';
                    this.triggerElements.expand.scrollLeft = this.triggerElements.expand.scrollWidth;
                    this.triggerElements.expand.scrollTop = this.triggerElements.expand.scrollHeight;
                };

                resizeSensor.prototype.elementResized = function() {
                    this.callback(this.dimensions);
                };

                resizeSensor.prototype.destroy = function() {
                    this.removeEventListeners();
                    this.targetElement.removeChild(this.triggerElements.container);
                    delete this.boundAnimationStartListener;
                    delete this.boundScrollListener;
                    delete this.callback;
                    delete this.targetElement;
                };

                resizeSensor.prototype.removeEventListeners = function() {
                    if ('attachEvent' in global.document) {
                        this.targetElement.detachEvent('onresize', this.boundOnResizeHandler);
                        return;
                    }

                    this.triggerElements.container.removeEventListener(
                        css.getAnimationPropertiesForBrowser().animationStartEvent,
                        this.boundAnimationStartListener
                    );
                    this.targetElement.removeEventListener('scroll', this.boundScrollListener, true);
                };

                return {
                    /**
                     * @param {Element} targetElement
                     * @param {Function} callback
                     * @returns {resizeSensor}
                     */
                    create: function(targetElement, callback) {
                        return new resizeSensor(targetElement, callback);
                    }
                };
            })(typeof window !== 'undefined' ? window : this);

            module.exports = resizeSensorFactory;

        }, { "./css": 1, "./getStyle": 2 }],
        5: [function(require, module, exports) {
            var sensors = (function(global) {
                'use strict';

                /** @var {Object} */
                var css = require('./css');
                /** @var {Object} */
                var polyfill = require('./polyfill');
                /** @var {Object} */
                var resizeSensorFactory = require('./resizeSensor');

                /** {array} */
                var unsuitableElements = ['IMG', 'COL', 'TR', 'THEAD', 'TFOOT'];
                /** {boolean} */
                var supportsAttachEvent = ('attachEvent' in global.document);

                /** {{}} Map of all resize sensors (id => ResizeSensor) */
                var allResizeSensors = {};

                if (!supportsAttachEvent) {
                    css.insertResizeSensorStyles();

                    if (!('requestAnimationFrame' in global) || !('cancelAnimationFrame' in global)) {
                        polyfill.requestAnimationFrame();
                    }
                }

                /**
                 * @param {Element} targetElement
                 * @param {Function} callback
                 * @returns {resizeSensor}
                 */
                function create(targetElement, callback) {
                    if (isUnsuitableElement(targetElement)) {
                        console && console.error("Given element isn't suitable to act as a resize sensor. Try wrapping it with one that is. Unsuitable elements are:", unsuitableElements);
                        return null;
                    }

                    var sensorId = getSensorId(targetElement);

                    if (allResizeSensors[sensorId]) {
                        return allResizeSensors[sensorId];
                    }

                    var sensor = resizeSensorFactory.create(targetElement, callback);
                    allResizeSensors[sensorId] = sensor;
                    return sensor;
                }

                /**
                 * @param {Element} targetElement
                 */
                function destroy(targetElement) {
                    var sensorId = getSensorId(targetElement);
                    var sensor = allResizeSensors[sensorId];

                    if (!sensor) {
                        console && console.error("Can't destroy ResizeSensor (404 not found).", targetElement);
                    }

                    sensor.destroy();
                    delete allResizeSensors[sensorId];
                }

                /**
                 * @param {Element} targetElement
                 * @returns {string}
                 */
                function getSensorId(targetElement) {
                    return targetElement.id;
                }

                /**
                 * @param {HTMLElement} targetElement
                 * @returns {boolean}
                 */
                function isUnsuitableElement(targetElement) {
                    var tagName = targetElement.tagName.toUpperCase();
                    return (unsuitableElements.indexOf(tagName) > -1);
                }

                return {
                    create: create,
                    destroy: destroy
                };
            })(typeof window !== 'undefined' ? window : this);

            module.exports = sensors;
        }, { "./css": 1, "./polyfill": 3, "./resizeSensor": 4 }]
    }, {}, [5])(5)
});