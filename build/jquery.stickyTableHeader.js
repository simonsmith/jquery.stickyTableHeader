/*!
 * jquery-sticky-table-header
 * 1.0.0
 * Requires jQuery 1.12.0+
 * https://github.com/simonsmith/jquery.stickyTableHeader/
 * License: MIT
 */
!function(root, factory) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = factory(require("jquery")); else if ("function" == typeof define && define.amd) define([ "jquery" ], factory); else {
        var a = factory("object" == typeof exports ? require("jquery") : root.jQuery);
        for (var i in a) ("object" == typeof exports ? exports : root)[i] = a[i];
    }
}("undefined" != typeof self ? self : this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
    return function(modules) {
        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) return installedModules[moduleId].exports;
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: !1,
                exports: {}
            };
            return modules[moduleId].call(module.exports, module, module.exports, __webpack_require__), 
            module.l = !0, module.exports;
        }
        var installedModules = {};
        return __webpack_require__.m = modules, __webpack_require__.c = installedModules, 
        __webpack_require__.d = function(exports, name, getter) {
            __webpack_require__.o(exports, name) || Object.defineProperty(exports, name, {
                configurable: !1,
                enumerable: !0,
                get: getter
            });
        }, __webpack_require__.n = function(module) {
            var getter = module && module.__esModule ? function() {
                return module.default;
            } : function() {
                return module;
            };
            return __webpack_require__.d(getter, "a", getter), getter;
        }, __webpack_require__.o = function(object, property) {
            return Object.prototype.hasOwnProperty.call(object, property);
        }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = 0);
    }([ function(module, exports, __webpack_require__) {
        "use strict";
        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) throw new TypeError("Cannot call a class as a function");
        }
        var _createClass = function() {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || !1, descriptor.configurable = !0, 
                    "value" in descriptor && (descriptor.writable = !0), Object.defineProperty(target, descriptor.key, descriptor);
                }
            }
            return function(Constructor, protoProps, staticProps) {
                return protoProps && defineProperties(Constructor.prototype, protoProps), staticProps && defineProperties(Constructor, staticProps), 
                Constructor;
            };
        }(), $ = __webpack_require__(1), throttle = __webpack_require__(2), PLUGIN_NAME = "stickyTableHeader", StickyTableHeader = function() {
            function StickyTableHeader($container, options) {
                if (_classCallCheck(this, StickyTableHeader), this.$container = $container, this.options = $.extend(!0, {}, $.fn.stickyTableHeader.defaults, options), 
                this.$table = this.$container.find("> table"), !this.$table.length) return void StickyTableHeader.logError("No table element found within container element");
                if (this.$win = $(window), this.tableSizes = StickyTableHeader.getTableSizes(this.$table), 
                !(this.options.outsideViewportOnly && this.tableSizes.height < this.$win.height())) {
                    this.$tableChildren = this.$table.children(":not(tbody)");
                    var $thead = this.$tableChildren.filter("thead");
                    this.$header = StickyTableHeader.constructHeader(this.$tableChildren, this.$table.attr("class"), this.tableSizes, this.options);
                    var cellWidths = StickyTableHeader.getOriginalCellWidths($thead);
                    StickyTableHeader.setCloneCellWidths(this.$header, cellWidths), this.$header.prependTo(this.$container), 
                    this.$container.css("position", "relative"), this.$table.addClass(this.options.css.active), 
                    this.attachScrollEvent();
                }
            }
            return _createClass(StickyTableHeader, null, [ {
                key: "getTableSizes",
                value: function($table) {
                    var offset = $table.offset(), height = $table.outerHeight();
                    return {
                        bottomPos: offset.top + height,
                        height: height,
                        topPos: offset.top,
                        width: $table.outerWidth()
                    };
                }
            }, {
                key: "constructHeader",
                value: function($tableChildren, origTableClassName, _ref, _ref2) {
                    var width = _ref.width, header = _ref2.css.header, zIndex = _ref2.zIndex, $clone = $tableChildren.clone(!0);
                    return $("<table/>", {
                        "aria-hidden": !0,
                        class: header
                    }).addClass(origTableClassName).css({
                        position: "absolute",
                        boxSizing: "border-box",
                        zIndex: zIndex,
                        width: width
                    }).append($clone);
                }
            }, {
                key: "logError",
                value: function(message) {
                    console.error(PLUGIN_NAME + ": " + message);
                }
            }, {
                key: "getOriginalCellWidths",
                value: function($thead) {
                    return $thead.find("tr").map(function() {
                        return $(this).find("td, th").map(function() {
                            return this.getBoundingClientRect().width;
                        });
                    });
                }
            }, {
                key: "setCloneCellWidths",
                value: function($header, widths) {
                    $header.find("tr").each(function(trIndex) {
                        $(this).find("th, td").each(function(cellIndex) {
                            var width = widths[trIndex][cellIndex];
                            $(this).css({
                                boxSizing: "border-box",
                                width: width
                            });
                        });
                    });
                }
            } ]), _createClass(StickyTableHeader, [ {
                key: "attachScrollEvent",
                value: function() {
                    var $win = this.$win, $header = this.$header, _options = this.options, scrollingClass = _options.css.scrolling, scrollThrottle = _options.scrollThrottle, headerHeight = $header.outerHeight(), _tableSizes = this.tableSizes, tableTopPos = _tableSizes.topPos, tableBottomPos = _tableSizes.bottomPos, width = _tableSizes.width, isScrollingTable = !0, handler = function() {
                        var scrollPos = $win.scrollTop(), scrollInsideTable = scrollPos > tableTopPos && scrollPos < tableBottomPos - headerHeight, scrollAboveTable = scrollPos < tableTopPos, scrollBelowTable = scrollPos > tableBottomPos - headerHeight;
                        scrollInsideTable && isScrollingTable && ($header.css({
                            position: "fixed",
                            top: 0,
                            width: width
                        }), $header.addClass(scrollingClass), isScrollingTable = !1), scrollAboveTable && !isScrollingTable && ($header.css({
                            position: "absolute",
                            top: 0,
                            bottom: 0,
                            width: width
                        }), $header.removeClass(scrollingClass), isScrollingTable = !0), scrollBelowTable && !isScrollingTable && ($header.css({
                            position: "absolute",
                            top: "auto",
                            bottom: 0,
                            width: width
                        }), $header.removeClass(scrollingClass), isScrollingTable = !0);
                    };
                    $win.on("scroll." + PLUGIN_NAME, throttle(handler, scrollThrottle, {
                        leading: !0
                    }));
                }
            }, {
                key: "detachScrollEvent",
                value: function() {
                    this.$win.off("scroll." + PLUGIN_NAME);
                }
            }, {
                key: "destroy",
                value: function() {
                    this.$header.remove(), this.$tableChildren.css("visibility", "visible"), this.detachScrollEvent(), 
                    this.$container.removeData(PLUGIN_NAME);
                }
            } ]), StickyTableHeader;
        }();
        $.fn.stickyTableHeader = function(options) {
            return this.each(function() {
                var $this = $(this);
                $this.data(PLUGIN_NAME) || $this.data(PLUGIN_NAME, new StickyTableHeader($this, options));
            });
        }, $.fn.stickyTableHeader.StickyTableHeader = StickyTableHeader, $.fn.stickyTableHeader.defaults = {
            outsideViewportOnly: !0,
            scrollThrottle: 50,
            css: {
                header: "StickyTableHeader",
                scrolling: "is-scrolling",
                active: "is-stickyTableHeaderActive"
            },
            zIndex: 2
        };
    }, function(module, exports) {
        module.exports = __WEBPACK_EXTERNAL_MODULE_1__;
    }, function(module, exports, __webpack_require__) {
        (function(global) {
            function debounce(func, wait, options) {
                function invokeFunc(time) {
                    var args = lastArgs, thisArg = lastThis;
                    return lastArgs = lastThis = void 0, lastInvokeTime = time, result = func.apply(thisArg, args);
                }
                function leadingEdge(time) {
                    return lastInvokeTime = time, timerId = setTimeout(timerExpired, wait), leading ? invokeFunc(time) : result;
                }
                function remainingWait(time) {
                    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result = wait - timeSinceLastCall;
                    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
                }
                function shouldInvoke(time) {
                    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
                    return void 0 === lastCallTime || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
                }
                function timerExpired() {
                    var time = now();
                    if (shouldInvoke(time)) return trailingEdge(time);
                    timerId = setTimeout(timerExpired, remainingWait(time));
                }
                function trailingEdge(time) {
                    return timerId = void 0, trailing && lastArgs ? invokeFunc(time) : (lastArgs = lastThis = void 0, 
                    result);
                }
                function cancel() {
                    void 0 !== timerId && clearTimeout(timerId), lastInvokeTime = 0, lastArgs = lastCallTime = lastThis = timerId = void 0;
                }
                function flush() {
                    return void 0 === timerId ? result : trailingEdge(now());
                }
                function debounced() {
                    var time = now(), isInvoking = shouldInvoke(time);
                    if (lastArgs = arguments, lastThis = this, lastCallTime = time, isInvoking) {
                        if (void 0 === timerId) return leadingEdge(lastCallTime);
                        if (maxing) return timerId = setTimeout(timerExpired, wait), invokeFunc(lastCallTime);
                    }
                    return void 0 === timerId && (timerId = setTimeout(timerExpired, wait)), result;
                }
                var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = !1, maxing = !1, trailing = !0;
                if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                return wait = toNumber(wait) || 0, isObject(options) && (leading = !!options.leading, 
                maxing = "maxWait" in options, maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait, 
                trailing = "trailing" in options ? !!options.trailing : trailing), debounced.cancel = cancel, 
                debounced.flush = flush, debounced;
            }
            function throttle(func, wait, options) {
                var leading = !0, trailing = !0;
                if ("function" != typeof func) throw new TypeError(FUNC_ERROR_TEXT);
                return isObject(options) && (leading = "leading" in options ? !!options.leading : leading, 
                trailing = "trailing" in options ? !!options.trailing : trailing), debounce(func, wait, {
                    leading: leading,
                    maxWait: wait,
                    trailing: trailing
                });
            }
            function isObject(value) {
                var type = typeof value;
                return !!value && ("object" == type || "function" == type);
            }
            function isObjectLike(value) {
                return !!value && "object" == typeof value;
            }
            function isSymbol(value) {
                return "symbol" == typeof value || isObjectLike(value) && objectToString.call(value) == symbolTag;
            }
            function toNumber(value) {
                if ("number" == typeof value) return value;
                if (isSymbol(value)) return NAN;
                if (isObject(value)) {
                    var other = "function" == typeof value.valueOf ? value.valueOf() : value;
                    value = isObject(other) ? other + "" : other;
                }
                if ("string" != typeof value) return 0 === value ? value : +value;
                value = value.replace(reTrim, "");
                var isBinary = reIsBinary.test(value);
                return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
            }
            var FUNC_ERROR_TEXT = "Expected a function", NAN = NaN, symbolTag = "[object Symbol]", reTrim = /^\s+|\s+$/g, reIsBadHex = /^[-+]0x[0-9a-f]+$/i, reIsBinary = /^0b[01]+$/i, reIsOctal = /^0o[0-7]+$/i, freeParseInt = parseInt, freeGlobal = "object" == typeof global && global && global.Object === Object && global, freeSelf = "object" == typeof self && self && self.Object === Object && self, root = freeGlobal || freeSelf || Function("return this")(), objectProto = Object.prototype, objectToString = objectProto.toString, nativeMax = Math.max, nativeMin = Math.min, now = function() {
                return root.Date.now();
            };
            module.exports = throttle;
        }).call(exports, __webpack_require__(3));
    }, function(module, exports) {
        var g;
        g = function() {
            return this;
        }();
        try {
            g = g || Function("return this")() || (0, eval)("this");
        } catch (e) {
            "object" == typeof window && (g = window);
        }
        module.exports = g;
    } ]);
});