const $ = require('jquery'); // eslint-disable-line import/no-unresolved
const throttle = require('./throttle');

const PLUGIN_NAME = 'stickyTableHeader';

class StickyTableHeader {

  static getTableSizes($table) {
    const offset = $table.offset();
    const height = $table.outerHeight();
    return {
      bottomPos: offset.top + height,
      height,
      topPos: offset.top,
      width: $table.outerWidth(),
    };
  }

  static constructHeader($tableChildren, origTableClassName, {width}, {css: {header}, zIndex}) {
    const $clone = $tableChildren.clone(true);
    return $('<table/>', {
      'aria-hidden': true,
      class: header,
    })
      .addClass(origTableClassName)
      .css({
        position: 'absolute',
        boxSizing: 'border-box',
        zIndex,
        width,
      })
      .append($clone);
  }

  static logError(message) {
    console.error(`${PLUGIN_NAME}: ${message}`); // eslint-disable-line no-console
  }

  static getOriginalCellWidths($thead) {
    return $thead.find('tr').map(function() {
      return $(this).find('td, th').map(function() {
        return this.getBoundingClientRect().width;
      });
    });
  }

  static setCloneCellWidths($header, widths) {
    $header.find('tr').each(function(trIndex) {
      $(this).find('th, td').each(function(cellIndex) {
        const width = widths[trIndex][cellIndex];
        $(this).css({
          boxSizing: 'border-box',
          width,
        });
      });
    });
  }

  constructor($container, options) {
    this.$container = $container;
    this.options = $.extend(true, {}, $.fn.stickyTableHeader.defaults, options);

    this.$table = this.$container.find('> table');

    if (!this.$table.length) {
      StickyTableHeader.logError('No table element found within container element');
      return;
    }

    this.$win = $(window);
    this.tableSizes = StickyTableHeader.getTableSizes(this.$table);

    if (this.options.outsideViewportOnly && this.tableSizes.height < this.$win.height()) {
      return;
    }

    this.$tableChildren = this.$table.children(':not(tbody)');
    const $thead = this.$tableChildren.filter('thead');

    this.$header = StickyTableHeader.constructHeader(
      this.$tableChildren,
      this.$table.attr('class'),
      this.tableSizes,
      this.options
    );

    const cellWidths = StickyTableHeader.getOriginalCellWidths($thead);
    StickyTableHeader.setCloneCellWidths(this.$header, cellWidths);

    this.$header.prependTo(this.$container);
    this.$container.css('position', 'relative');
    this.$table.addClass(this.options.css.active);
    this.attachScrollEvent();
  }

  attachScrollEvent() {
    const {
      $win,
      $header,
      options: {css: {scrolling: scrollingClass}, scrollThrottle},
    } = this;
    const headerHeight = $header.outerHeight();
    const {
      topPos: tableTopPos,
      bottomPos: tableBottomPos,
      width,
    } = this.tableSizes;
    let isScrollingTable = true;

    const handler = () => {
      const scrollPos = $win.scrollTop();
      const scrollInsideTable = scrollPos > tableTopPos && scrollPos < (tableBottomPos - headerHeight);
      const scrollAboveTable = scrollPos < tableTopPos;
      const scrollBelowTable = scrollPos > (tableBottomPos - headerHeight);

      if (scrollInsideTable && isScrollingTable) {
        $header.css({
          position: 'fixed',
          top: 0,
          width,
        });
        $header.addClass(scrollingClass);
        isScrollingTable = false;
      }
      if (scrollAboveTable && !isScrollingTable) {
        $header.css({
          position: 'absolute',
          top: 0,
          bottom: 0,
          width,
        });
        $header.removeClass(scrollingClass);
        isScrollingTable = true;
      }
      if (scrollBelowTable && !isScrollingTable) {
        $header.css({
          position: 'absolute',
          top: 'auto',
          bottom: 0,
          width,
        });
        $header.removeClass(scrollingClass);
        isScrollingTable = true;
      }
    };

    $win.on(`scroll.${PLUGIN_NAME}`, throttle(handler, scrollThrottle));
  }

  detachScrollEvent() {
    this.$win.off(`scroll.${PLUGIN_NAME}`);
  }

  destroy() {
    this.$header.remove();
    this.$tableChildren.css('visibility', 'visible');
    this.detachScrollEvent();
  }

}

$.fn.stickyTableHeader = function(options) {
  return this.each(function() {
    const $this = $(this);
    if (!$this.data(PLUGIN_NAME)) {
      $this.data(PLUGIN_NAME, new StickyTableHeader($this, options));
    }
  });
};

$.fn.stickyTableHeader.StickyTableHeader = StickyTableHeader;
$.fn.stickyTableHeader.defaults = {
  outsideViewportOnly: true,
  scrollThrottle: 50,
  css: {
    header: 'StickyTableHeader',
    scrolling: 'is-scrolling',
    active: 'is-stickyTableHeaderActive',
  },
  zIndex: 2,
};
