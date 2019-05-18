const $ = require('jquery'); // eslint-disable-line import/no-unresolved
const throttle = require('lodash.throttle');

const PLUGIN_NAME = 'stickyTableHeader';
let instanceCount = 1;

class StickyTableHeader {
  static logError(message) {
    console.error(`${PLUGIN_NAME}: ${message}`); // eslint-disable-line no-console
  }

  constructor($container, options) {
    this.$container = $container;
    this.options = $.extend(true, {}, $.fn.stickyTableHeader.defaults, options);
    this.id = instanceCount++;

    this.$table = this.$container.find('> table');

    if (!this.$table.length) {
      StickyTableHeader.logError(
        'No table element found within container element'
      );
      return;
    }

    this.$win = $(window);
    this.tableSizes = this.getTableSizes();

    if (
      this.options.outsideViewportOnly &&
      this.tableSizes.height < this.$win.height()
    ) {
      return;
    }

    this.$thead = this.$table.children('thead');
    this.$header = this.constructHeader();

    const cellWidths = this.getOriginalCellWidths();
    this.setCloneCellWidths(cellWidths);

    this.$header.prependTo(this.$container);
    this.$container.css('position', 'relative');
    this.$table.addClass(this.options.css.active);
    this.attachScrollEvent();
  }

  getTableSizes() {
    const offset = this.$table.offset();
    const height = this.$table.outerHeight();
    return {
      bottomPos: offset.top + height,
      height,
      topPos: offset.top,
      width: this.$table.outerWidth(),
    };
  }

  constructHeader() {
    const {
      css: {header},
      offset: {top},
      zIndex,
    } = this.options;
    const {width} = this.tableSizes;
    const $clone = this.$thead.clone(true);

    return $('<table/>', {
      'aria-hidden': true,
      class: header,
    })
      .addClass(this.$table.attr('class'))
      .css({
        top,
        position: 'absolute',
        boxSizing: 'border-box',
        zIndex,
        width,
      })
      .append($clone);
  }

  getOriginalCellWidths() {
    return this.$thead.find('tr').map(function() {
      return $(this)
        .find('td, th')
        .map(function() {
          return this.getBoundingClientRect().width;
        });
    });
  }

  setCloneCellWidths(cellWidths) {
    this.$header.find('tr').each(function(trIndex) {
      $(this)
        .find('th, td')
        .each(function(cellIndex) {
          const width = cellWidths[trIndex][cellIndex];
          $(this).css({
            boxSizing: 'border-box',
            width,
          });
        });
    });
  }

  attachScrollEvent() {
    const {
      $win,
      $header,
      options: {
        css: {scrolling: scrollingClass},
        scrollThrottle,
        offset: {top, topScrolling},
      },
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
      const scrollInsideTable =
        scrollPos > tableTopPos && scrollPos < tableBottomPos - headerHeight;
      const scrollAboveTable = scrollPos < tableTopPos;
      const scrollBelowTable = scrollPos > tableBottomPos - headerHeight;

      if (scrollInsideTable && isScrollingTable) {
        $header.css({
          position: 'fixed',
          top: topScrolling,
          width,
        });
        $header.addClass(scrollingClass);
        isScrollingTable = false;
      }
      if (scrollAboveTable && !isScrollingTable) {
        $header.css({
          position: 'absolute',
          top,
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

    $win.on(
      `scroll.${PLUGIN_NAME}-${this.id}`,
      throttle(handler, scrollThrottle, {leading: true})
    );
  }

  detachScrollEvent() {
    this.$win.off(`scroll.${PLUGIN_NAME}-${this.id}`);
  }

  destroy() {
    this.$container.css('position', '');
    this.$table.removeClass(this.options.css.active);
    this.$header.remove();
    this.detachScrollEvent();
    this.$container.removeData(PLUGIN_NAME);
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
  offset: {
    top: 0,
    topScrolling: 0,
  },
  css: {
    header: 'StickyTableHeader',
    scrolling: 'is-scrolling',
    active: 'is-stickyTableHeaderActive',
  },
  zIndex: 2,
};
