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
