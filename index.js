/**
 * Module dependencies
 */

var domify = require('domify'),
    svg = require('svg'),
    ms = require('ms'),
    html = domify(require('./template'))[0];

/**
 * Default path
 */

var defaults = {
  fill : 'none',
  stroke : 'black',
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
  this.element = svg(parent);

  // dimensions
  this.width = parent.clientWidth;
  this.height = parent.clientHeight;

  // set autoscaling to true by default
  this._autoscale = true;

  // set the default min & max
  this.min = 0;
  this.max = this.height;
  this.ratio = 1/1;
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
 * Enable or disable autoscaling
 *
 * @param {Boolean} autoscale
 * @return {TimeSeries}
 * @api public
 */

TimeSeries.prototype.autoscale = function(autoscale) {
  this._autoscale = autoscale;
  return this;
};

/**
 * Rescale the y-axis
 *
 * @param {Array} points
 * @param {Mixed} y
 * @return {Array} points
 * @api private
 */

TimeSeries.prototype.rescale = function(points, y) {
  if(!this._autoscale) return points;
  this.max = (y > this.max) ? y : this.max;
  this.min = (y < this.min) ? y : this.min;
  var out = [];
  var range = this.max - this.min;
  var scale = this.height / range;

  for (var i = 0, len = points.length; i < len; i++) {
    out[i] = [];
    out[i][0] = points[i][0];
    out[i][1] = (points[i][1] - this.min) * scale | 0;
  };

  return out;
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
  this.points = [];
  this.path = series.element('path').attr(defaults);
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
  var path = this.path;
  var series = this.series;

  if (!this.start) this.start = time;
  var elapsed = time - this.start;
  var x = elapsed * series._scale | 0;

  // rescale and shift the line if needed
  this.points.push([x, y]);
  var points = this.points;
  points = series.rescale(points, y);
  points = this.shift(points, x);

  var d = points_to_svg(points);
  path.attr('d', d);
};

/**
 * Shift the points on the x axis
 *
 * @param {Array} points
 * @return {Array} points
 * @api private
 */

Line.prototype.shift = function(points, x) {
  if (x <= this.series.width) return points;
  var out = [];
  var prev = [];
  var offset = x - this.series.width;

  for (var i = 0, len = points.length; i < len; i++) {
    var py = points[i][1];
    var px = points[i][0];
    var ox = px - offset;
    if (ox >= 0) {
      // Push the first previous negative point to complete graph
      if (!out.length) out.push(prev);
      out.push([ ox, py ]);
    }
    prev = [ ox, py ]
  };

  return out;
}

/**
 * Points to SVG
 *
 * `points` takes the following form:
 *
 *   [ [x0, y0], [x1, y1], ... ]
 *
 * @param {Array} points
 * @return {String} svg path
 */

function points_to_svg(points) {
  if (!points || !points.length) return '';

  var path = [],
      str = 'M',
      p;

  for (var i = 0, len = points.length; i < len; i++) {
    p = points[i];
    if(!p) continue;
    path[path.length] = str + p[0] + ',' + p[1];
    str = 'L';
  };

  return path.join('');
}
