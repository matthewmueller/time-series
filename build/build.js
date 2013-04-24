

/**
 * hasOwnProperty.
 */

var has = Object.prototype.hasOwnProperty;

/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);
  var index = path + '/index.js';

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (has.call(require.modules, path)) return path;
  }

  if (has.call(require.aliases, index)) {
    return require.aliases[index];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!has.call(require.modules, from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return has.call(require.modules, localRequire.resolve(path));
  };

  return localRequire;
};
require.register("component-domify/index.js", function(exports, require, module){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  option: [1, '<select multiple="multiple">', '</select>'],
  optgroup: [1, '<select multiple="multiple">', '</select>'],
  legend: [1, '<fieldset>', '</fieldset>'],
  thead: [1, '<table>', '</table>'],
  tbody: [1, '<table>', '</table>'],
  tfoot: [1, '<table>', '</table>'],
  colgroup: [1, '<table>', '</table>'],
  caption: [1, '<table>', '</table>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  td: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  th: [3, '<table><tbody><tr>', '</tr></tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');
  
  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) throw new Error('No elements were generated.');
  var tag = m[1];
  
  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return [el.removeChild(el.lastChild)];
  }
  
  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  return orphan(el.children);
}

/**
 * Orphan `els` and return an array.
 *
 * @param {NodeList} els
 * @return {Array}
 * @api private
 */

function orphan(els) {
  var ret = [];

  while (els.length) {
    ret.push(els[0].parentNode.removeChild(els[0]));
  }

  return ret;
}

});
require.register("guille-ms.js/index.js", function(exports, require, module){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 's':
      return n * s;
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  if (ms == d) return Math.round(ms / d) + ' day';
  if (ms > d) return Math.round(ms / d) + ' days';
  if (ms == h) return Math.round(ms / h) + ' hour';
  if (ms > h) return Math.round(ms / h) + ' hours';
  if (ms == m) return Math.round(ms / m) + ' minute';
  if (ms > m) return Math.round(ms / m) + ' minutes';
  if (ms == s) return Math.round(ms / s) + ' second';
  if (ms > s) return Math.round(ms / s) + ' seconds';
  return ms + ' ms';
}

});
require.register("matthewmueller-svg-element/index.js", function(exports, require, module){
/**
 * Export `Element`
 */

module.exports = Element;

/**
 * Initialize `Element`
 *
 * @param {String} type
 * @return {Element}
 * @api public
 */

function Element(type) {
  if (!(this instanceof Element)) return new Element(type);
  this.el = document.createElementNS('http://www.w3.org/2000/svg', type);
  this.transforms = { x: 0, y: 0, scaleX: 1, scaleY: 1, rotation: 0, skewX: 0, skewY: 0 };
}

/**
 * Get and set attributes
 *
 * @param {String|Object} key
 * @param {String} val
 * @return {Element}
 * @api public
 */

Element.prototype.attr = function(key, val, el) {
  if (typeof key == 'object') for (val in key) this.attr(val, key[val]);
  else if (val === undefined) return this.el.getAttribute(key);
  else if (el) this.el.setAttributeNS(el, key, val);
  else this.el.setAttribute(key, val);
  return this;
};

/**
 * Set the width and height
 *
 * @param {String} width
 * @param {String} height
 * @return {Element}
 * @api public
 */

Element.prototype.size = function(width, height) {
  if (!height) height = width;
  this.attr({
    width: width,
    height: height
  });

  return this;
};

/**
 * Move
 *
 * @param {String} left
 * @param {String} top
 * @return {Element}
 * @api public
 */

Element.prototype.move = function(x, y) {
  this.attr({
    x : x || 0,
    y : y || 0
  });

  return this;
};

/**
 * Add a transform
 *
 * TODO: refactor, optimize
 *
 * @param {Object} obj
 * @return {Element}
 * @api private
 */

Element.prototype.transform = function(obj) {
  // getter
  if('string' === typeof obj) return this.transforms[obj];

  var transform = [];

  for(key in obj) {
    if(obj[key]) this.transforms[key] = obj[key];
  }

  var t = this.transforms;

  /* add rotation */
  if (t.rotation !== 0) {
    var box = this.bbox();
    transform.push('rotate(' + t.rotation + ',' + (t.cx != null ? t.cx : box.cx) + ',' + (t.cy != null ? t.cy : box.cy) + ')');
  }

  /* add scale */
  transform.push('scale(' + t.scaleX + ',' + t.scaleY + ')');

  /* add skew on x axis */
  if (t.skewX !== 0)
    transform.push('skewX(' + t.skewX + ')');

  /* add skew on y axis */
  if (t.skewY !== 0)
    transform.push('skewY(' + t.skewY + ')');

  /* add translation */
  transform.push('translate(' + t.x + ',' + t.y + ')');

  /* add only te required transformations */
  this.attr('transform', transform.join(' '));
  return this;
};

/**
 * Get the bounding box
 *
 * @return {Object}
 * @api public
 */

Element.prototype.bbox = function() {
  /* actual, native bounding box */
  var box = this.el.getBBox();

  return {
    /* include translations on x an y */
    x:      box.x + this.transforms.x,
    y:      box.y + this.transforms.y,

    /* add the center */
    cx:     box.x + this.transforms.x + box.width  / 2,
    cy:     box.y + this.transforms.y + box.height / 2,

    /* plain width and height */
    width:  box.width,
    height: box.height
  };
};

/**
 * Rotate the element
 *
 * @param {Number} deg
 * @return {Element}
 * @api public
 */

Element.prototype.rotate = function(deg) {
  deg = deg || 0;
  this.transform({ rotation : deg });
  return this;
};


/**
 * Scale the element
 *
 * @param {String} x
 * @param {String} y
 * @return {Element}
 * @api public
 */

Element.prototype.scale = function(x, y) {
  if(!y) y = x;
  this.transform({
    scaleX : x,
    scaleY : y
  });

  return this;
};

});
require.register("time-series/index.js", function(exports, require, module){
/**
 * Module dependencies
 */

var domify = require('domify'),
    element = require('svg-element'),
    ms = require('ms'),
    html = domify(require('./template'))[0];

/**
 * Default path
 */

var defaults = {
  fill : 'none',
  stroke : 'black',
  d : 'M0,0',
  'stroke-width' : 2,
  'stroke-linecap' : 'round',
  'stroke-linejoin' : 'round'
};

/**
 * Export `TimeSeries`
 */

module.exports = TimeSeries;

/**
 * Initialize `TimeSeries`
 *
 * @param {Node} parent
 * @param {String} data
 * @return {TimeSeries}
 * @api public
 */

function TimeSeries(parent, data) {
  if (!(this instanceof TimeSeries)) return new TimeSeries(parent, data);
  this.el = html.cloneNode(true);

  parent.appendChild(this.el);

  // dimensions
  this.width = this.el.clientWidth;
  this.height = this.el.clientHeight;
}

/**
 * Set the scale
 *
 * @param {String|Number} s
 * @return {TimeSeries}
 * @api public
 */

TimeSeries.prototype.scale = function(s) {
  this._scale = this.width / ms(s);
  return this;
};

/**
 * Create a new line
 *
 * @param {Object} opts
 * @return {Line}
 * @api public
 */

TimeSeries.prototype.line = function(opts) {
  return new Line(opts, this);
};

/**
 * Initialize a `Line`
 *
 * @param {Object} opts
 * @param {TimeSeries} series
 * @return {Line}
 * @api private
 */

function Line(opts, series) {
  if(!(this instanceof Line)) return new Line(opts, series);
  this.opts = opts || {};
  this.series = series;
  this.path = element('path').attr(defaults);
  this.series.el.appendChild(this.path.el);
};

/**
 * Set the color of the line
 *
 * @param {String} color
 * @return {TimeSeries}
 * @api public
 */

Line.prototype.color = function(c) {
  this.path.attr('stroke', c);
  return this;
};

/**
 * Set the width of the stroke
 *
 * @param {Number|String} w
 * @return {TimeSeries}
 * @api public
 */

Line.prototype.strokeWidth = function(w) {
  this.path.attr('stroke-width', w);
  return this;
};

/**
 * Add a point to the time series
 *
 * TODO: remove points as the leave the screen
 *
 * @param {Mixed} y
 * @param {Date} time
 * @return {TimeSeries}
 * @api public
 */

Line.prototype.add = function(y, time) {
  if (!y) return this;
  time = time || new Date;
  var type = 'L';
  var path = this.path;
  var series = this.series;

  if (!this.start) {
    this.start = time;
    type = 'M';
  }

  var elapsed = time - this.start;
  var x = elapsed * series._scale | 0;
  var point = type + x + ',' + y;
  var d = path.attr('d');

  if (x > series.width) {
    var offset = -(x - series.width);
    path.transform({ x : offset });
  }

  path.attr('d', d + point);
};

});
require.register("time-series/template.js", function(exports, require, module){
module.exports = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="100%" xlink="http://www.w3.org/1999/xlink" style="position:relative;">\n  <defs></defs>\n</svg>\n';
});
require.alias("component-domify/index.js", "time-series/deps/domify/index.js");

require.alias("guille-ms.js/index.js", "time-series/deps/ms/index.js");

require.alias("matthewmueller-svg-element/index.js", "time-series/deps/svg-element/index.js");

