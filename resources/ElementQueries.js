! function(e) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = e();
    else if ("function" == typeof define && define.amd) define("elementQueries", ["resizeSensor"], e);
    else { var f; "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), f.elementQueries = e() }
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
            var elementQueries = (function(global) {
                'use strict';

                var resizeSensor = null;

                try {
                    resizeSensor = ('resizeSensor' in global) ? global['resizeSensor'] : global.require('resizeSensor');
                } catch (e) {}

                if (resizeSensor === null) {
                    var logMissingResizeDetectorError = function() {
                        console && console.error("EQ's depend on a resize detector. Provide a detector and try again.");
                    };

                    return {
                        initializeSingle: logMissingResizeDetectorError,
                        initializeMultiple: logMissingResizeDetectorError,
                        destroySingle: logMissingResizeDetectorError,
                        destroyMultiple: logMissingResizeDetectorError
                    }
                }

                /** @var {string} */
                var dataAttrName = 'data-element-queries';
                /** @var {object} */
                var registry = require('./registry');

                /**
                 * @param {string} targetElementId
                 */
                function initializeSingle(targetElementId) {
                    var targetElement = global.document.querySelector(getCssSelector(targetElementId));

                    if (!targetElement) {
                        console && console.info('No valid element found for given selector. Exiting.', getCssSelector(targetElementId));
                        return;
                    }

                    initializeElementQueries([targetElement]);
                }

                /**
                 * @param {string} parentElementId
                 */
                function initializeMultiple(parentElementId) {
                    var targetElements = global.document.querySelectorAll(getCssSelector(parentElementId, true));

                    if (targetElements.length === 0) {
                        console && console.info('No valid elements found for given selector. Exiting.', getCssSelector(parentElementId, true));
                        return;
                    }

                    initializeElementQueries(targetElements);
                }

                /**
                 * @param {NodeList|[]} targetElements
                 */
                function initializeElementQueries(targetElements) {
                    var i;
                    var elementCount = targetElements.length;

                    for (i = 0; i < elementCount; i++) {
                        var targetElement = targetElements[i];
                        var elementId = targetElement.id;

                        if (elementId && registry.get(elementId) !== null) {
                            console && console.info('A `ElementQueryElement` for given elementId already exists. If you need to reset it, destroy existing one first.', elementId);
                            continue;
                        }

                        var elementQueryElement = registry.add(targetElement);
                        resizeSensor.create(targetElement, getResizeCallback(elementQueryElement));
                        elementQueryElement.initialize();
                    }
                }

                /**
                 * @param {string} parentElementId
                 */
                function destroyMultiple(parentElementId) {
                    var targetElements = global.document.querySelectorAll(getCssSelector(parentElementId, true));
                    var elementCount = targetElements.length;

                    if (elementCount === 0) {
                        console && console.info('No elements found for given selector. Exiting.', parentElementId, selector);
                    }

                    destroyElementQueries(targetElements);
                }

                /**
                 * @param {string} targetElementId
                 */
                function destroySingle(targetElementId) {
                    var targetElement = global.document.querySelector(getCssSelector(targetElementId));

                    if (!targetElement) {
                        console && console.info('No valid element found for given selector. Exiting.');
                        return;
                    }

                    destroyElementQueries([targetElement]);
                }

                /**
                 * @param {NodeList|[]} targetElements
                 */
                function destroyElementQueries(targetElements) {
                    var i;
                    var elementCount = targetElements.length;

                    for (i = 0; i < elementCount; i++) {
                        var targetElement = targetElements[i];

                        var targetElementId = targetElement.id;
                        var elementQueryElement = registry.get(targetElementId);

                        if (!elementQueryElement) {
                            console && console.info("Can't destroy `ElementQueryElement` (404 not found).", targetElement);
                            continue;
                        }

                        registry.remove(elementQueryElement);
                        elementQueryElement.destroy();
                        resizeSensor.destroy(targetElement);
                    }
                }

                /**
                 * @param {elementQueryElement} elementQueryElement
                 * @returns {Function}
                 */
                function getResizeCallback(elementQueryElement) {
                    return function(dimensions) {
                        if (elementQueryElement.queryCount === 0) {
                            return;
                        }

                        elementQueryElement.doQueries(dimensions);
                    };
                }

                /**
                 * @param {string} elementId
                 * @param {boolean} [findChildren]
                 * @returns {string}
                 */
                function getCssSelector(elementId, findChildren) {
                    if (findChildren) {
                        return '#' + elementId + ' [' + dataAttrName + ']';
                    }

                    return '#' + elementId + '[' + dataAttrName + ']';
                }

                return {
                    initializeSingle: initializeSingle,
                    initializeMultiple: initializeMultiple,
                    destroySingle: destroySingle,
                    destroyMultiple: destroyMultiple
                }
            })(typeof window !== 'undefined' ? window : this);

            module.exports = elementQueries;
        }, { "./registry": 4 }],
        2: [function(require, module, exports) {
            var elementQueryElementFactory = (function() {
                'use strict';

                /** @var {Object} */
                var elementQueryFactory = require('./elementQueryFactory');

                /**
                 * @param {Element} targetElement
                 * @constructor
                 */
                var elementQueryElement = function(targetElement) {
                    /** @var {Element} */
                    this.targetElement = targetElement;
                    /** @var {ElementQuery[]} */
                    this.allQueries = [];
                    /** @var {int} */
                    this.queryCount = 0;
                    /** @var {boolean} */
                    this.addClassNameAfterInit = false;
                    /** @var {string} */
                    this.classNameToAdd = '';
                };

                elementQueryElement.prototype.initialize = function() {
                    /** @var {{queries: [], config: {classNameToToggleAfterInit: string}}} */
                    var attributeData = this.getValueOfDataAttribute();

                    if (!attributeData.queries || !('length' in attributeData['queries'])) {
                        console && console.log('error', 'No element queries found. Exiting.');
                        return;
                    }

                    if (attributeData.config) {
                        this.setConfig(attributeData.config);
                    }

                    this.addElementQueries(attributeData.queries);
                    this.doQueries({ width: this.targetElement.offsetWidth, height: this.targetElement.offsetHeight });

                    if (this.addClassNameAfterInit) {
                        this.targetElement.className += ' ' + this.classNameToAdd;
                    }
                };

                /**
                 * @param {{classNameToToggleAfterInit: string}} config
                 */
                elementQueryElement.prototype.setConfig = function(config) {
                    if ('classNameToAddAfterInit' in config && config['classNameToAddAfterInit'] !== '') {
                        this.addClassNameAfterInit = true;
                        this.classNameToAdd = config['classNameToAddAfterInit'];
                    }
                };

                /**
                 * @param {[]} elementQueries
                 */
                elementQueryElement.prototype.addElementQueries = function(elementQueries) {
                    var j;
                    var queryCount = elementQueries.length;

                    for (j = 0; j < queryCount; j++) {
                        var elementQuery = elementQueries[j];
                        var queryProperties = getElementQueryProperties(elementQuery);

                        if (!queryProperties) {
                            console && console.error('Skipped element query as the query seems to be malformed.', elementQuery);
                            continue;
                        }

                        var ElementQuery = elementQueryFactory.create(queryProperties.mode, queryProperties.property, queryProperties.value);
                        this.allQueries.push(ElementQuery);
                        this.queryCount++;
                    }
                };

                /**
                 * @param {{width: int, height: int}} dimensions
                 */
                elementQueryElement.prototype.doQueries = function(dimensions) {
                    var attributeValues = this.getAttributeValues(dimensions);
                    this.writeAttributes(attributeValues);
                };

                /**
                 * @param {{width: int, height: int}} dimensions
                 * @returns {{}}
                 */
                elementQueryElement.prototype.getAttributeValues = function(dimensions) {
                    var attributeValues = {};
                    var i;

                    for (i = 0; i < this.queryCount; i++) {
                        /** @var {ElementQuery} */
                        var ElementQuery = this.allQueries[i];

                        if (!ElementQuery.isMatchFor(dimensions)) {
                            continue;
                        }

                        var attrName = ElementQuery.getAttributeName();
                        var attrValue = ElementQuery.getPxValue();

                        if (!attributeValues[attrName]) {
                            attributeValues[attrName] = attrValue;
                        } else if (attributeValues[attrName].indexOf(attrValue) === -1) {
                            attributeValues[attrName] += ' ' + attrValue;
                        }
                    }

                    return attributeValues;
                };

                /**
                 * @param {{}} attributeValues
                 */
                elementQueryElement.prototype.writeAttributes = function(attributeValues) {
                    var allAttributes = ['min-width', 'min-height', 'max-width', 'max-height'];
                    var i;
                    var l = allAttributes.length;

                    for (i = 0; i < l; i++) {
                        if (attributeValues[allAttributes[i]]) {
                            this.targetElement.setAttribute(allAttributes[i], attributeValues[allAttributes[i]]);
                            continue;
                        }

                        this.targetElement.removeAttribute(allAttributes[i]);
                    }
                };

                elementQueryElement.prototype.destroy = function() {
                    delete this.targetElement;
                    delete this.allQueries;
                    delete this.queryCount;
                };

                /**
                 * @return {null|{queries: [], config: {classNameToToggleAfterInit: string}}}
                 */
                elementQueryElement.prototype.getValueOfDataAttribute = function() {
                    var queryData = JSON.parse(this.targetElement.getAttribute('data-element-queries'));

                    if (!queryData) {
                        console && console.error('No configuration found for given element. Config is passed via the `data-element-queries` attribute. Exiting.', this.targetElement);
                        return null;
                    }

                    return queryData;
                };

                /**
                 * @returns {string}
                 */
                elementQueryElement.prototype.getId = function() {
                    return this.targetElement.id;
                };

                /**
                 * @param {string} elementQuery
                 * @returns {{mode: string, property: string, value: string}}
                 */
                function getElementQueryProperties(elementQuery) {
                    var regex = /(min|max)-(width|height)\s*:\s*(\d+px)/mgi;
                    var match = regex.exec(elementQuery);

                    if (!match) {
                        return false;
                    }

                    return {
                        mode: match[1],
                        property: match[2],
                        value: match[3].toLowerCase()
                    };
                }

                return {
                    /**
                     * @param {Element} targetElement
                     * @returns {elementQueryElement}
                     */
                    create: function(targetElement) {
                        return new elementQueryElement(targetElement);
                    }
                }
            })();

            module.exports = elementQueryElementFactory;

        }, { "./elementQueryFactory": 3 }],
        3: [function(require, module, exports) {
            var elementQueryFactory = (function() {
                'use strict';

                /**
                 * @param {string} mode
                 * @param {string} property
                 * @param {string} value
                 * @constructor
                 */
                var elementQuery = function(mode, property, value) {
                    if (mode !== 'min' && mode !== 'max') {
                        throw new Error('Invalid mode (should be either `min` or `max`. Exiting.');
                    }

                    if (property !== 'width' && property !== 'height') {
                        throw new Error('Invalid property (should be either `width` or `height`). Exiting.');
                    }

                    if (isNaN(parseFloat(value))) {
                        throw new Error('Invalid value (should be numeric). Exiting.');
                    }

                    /** @var {string} */
                    this.mode = mode;
                    /** @var {string} */
                    this.property = property;
                    /** @var {number} */
                    this.value = parseFloat(value);
                    /** @var {string} */
                    this.pxValue = value;
                };

                /**
                 * @returns {string}
                 */
                elementQuery.prototype.getMode = function() {
                    return this.mode;
                };

                /**
                 * @returns {string}
                 */
                elementQuery.prototype.getProperty = function() {
                    return this.property;
                };

                /**
                 * @returns {number}
                 */
                elementQuery.prototype.getValue = function() {
                    return this.value;
                };

                /**
                 * @returns {string}
                 */
                elementQuery.prototype.getPxValue = function() {
                    return this.pxValue;
                };

                /**
                 * @param {{width: number, height: number}} dimensions
                 * @returns {boolean}
                 */
                elementQuery.prototype.isMatchFor = function(dimensions) {
                    if (this.mode === 'min' && dimensions[this.property] >= this.value) {
                        return true;
                    }

                    if (this.mode === 'max' && dimensions[this.property] <= this.value) {
                        return true;
                    }

                    return false;
                };

                /**
                 * @returns {string}
                 */
                elementQuery.prototype.getAttributeName = function() {
                    return this.mode + '-' + this.property;
                };

                return {
                    /**
                     * @param {string} mode
                     * @param {string} property
                     * @param {string} value
                     * @returns {elementQuery}
                     */
                    create: function(mode, property, value) {
                        return new elementQuery(mode, property, value);
                    }
                };
            })();

            module.exports = elementQueryFactory;

        }, {}],
        4: [function(require, module, exports) {
            var registry = (function() {
                'use strict';

                /** @var {string} */
                var idPrefix = 'element-query-element-';
                /** @var {{elementId: elementQueryElement}} */
                var allElementQueryElements = {};
                /** @var int */
                var uniqueIdSuffix = 0;
                /** @var {object} */
                var elementQueryElementFactory = require('./elementQueryElementFactory');

                /**
                 * @param {HTMLElement} targetElement
                 */
                function identifyElement(targetElement) {
                    var elementId = targetElement.id;

                    if (elementId) {
                        return;
                    }

                    elementId = idPrefix + (++uniqueIdSuffix);
                    targetElement.id = elementId;
                }

                /**
                 * @param {string} elementId
                 * @returns {elementQueryElement}
                 */
                function get(elementId) {
                    if (!allElementQueryElements[elementId]) {
                        return null;
                    }

                    return allElementQueryElements[elementId];
                }

                /**
                 * @param {Element} targetElement
                 * @returns {elementQueryElement}
                 */
                function add(targetElement) {
                    if (get(targetElement.id) !== null) {
                        return;
                    }

                    identifyElement(targetElement);

                    var elementQueryElement = elementQueryElementFactory.create(targetElement);
                    allElementQueryElements[elementQueryElement.getId()] = elementQueryElement;

                    return elementQueryElement;
                }

                /**
                 * @param {elementQueryElement} elementQueryElement
                 */
                function remove(elementQueryElement) {
                    delete allElementQueryElements[elementQueryElement.getId()];
                }

                return {
                    get: get,
                    add: add,
                    remove: remove
                };
            })();

            module.exports = registry;

        }, { "./elementQueryElementFactory": 2 }]
    }, {}, [1])(1)
});