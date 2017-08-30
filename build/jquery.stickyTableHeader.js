/*!
 * jquery-sticky-table-header
 * 0.2.0
 * Requires jQuery 1.12.0+
 * https://github.com/simonsmith/jquery.stickyTableHeader/
 * License: MIT
 */
!function(root, factory) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = factory(require("jquery")); else if ("function" == typeof define && define.amd) define([ "jquery" ], factory); else {
        var a = factory("object" == typeof exports ? require("jquery") : root.jQuery);
        for (var i in a) ("object" == typeof exports ? exports : root)[i] = a[i];
    }
}(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
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
        }(), $ = __webpack_require__(1), throttle = __webpack_require__(2), StickyTableHeader = function() {
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
                    console.error("StickyTableHeader: " + message);
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
                    $win.on("scroll.StickyTableHeader", throttle(handler, scrollThrottle));
                }
            }, {
                key: "detachScrollEvent",
                value: function() {
                    this.$win.off("scroll.StickyTableHeader");
                }
            }, {
                key: "destroy",
                value: function() {
                    this.$header.remove(), this.$tableChildren.css("visibility", "visible"), this.detachScrollEvent();
                }
            } ]), StickyTableHeader;
        }();
        $.fn.stickyTableHeader = function(options) {
            return this.each(function() {
                var $this = $(this);
                $this.data("stickyTableHeader") || $this.data("stickyTableHeader", new StickyTableHeader($this, options));
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
        "use strict";
        function throttle(callback, wait) {
            var context = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : this, timeout = null, callbackArgs = null, later = function() {
                callback.apply(context, callbackArgs), timeout = null;
            };
            return function() {
                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) args[_key] = arguments[_key];
                timeout || (callbackArgs = args, timeout = setTimeout(later, wait));
            };
        }
        module.exports = throttle;
    } ]);
});