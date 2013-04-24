
# time-series

  simple streaming time series graphs

  ![graph](http://i.cloudup.com/ieUMBoog5qL.png)

## Installation

    $ component install matthewmueller/time-series

## Example

```js
var graph = document.getElementById('graph');
var series = Series(graph).scale('60s')
var line = series.line();

line.color('#00BEFF')
    .strokeWidth(3);

setInterval(function() {
  line.add(rand());
}, 500);

var line2 = series.line();
line2.color('#CF3E2A').strokeWidth(3);

setInterval(function() {
  line2.add(rand());
}, 1000);

function rand() {
  return Math.random() * 100 | 0
}
```

## API

### TimeSeries()

  Initialize `TimeSeries`

### TimeSeries.scale(s:String|Number)

  Set the scale

### TimeSeries.line(opts:Object)

  Create a new line

### Line.color(color:String)

  Set the color of the line

### Line.strokeWidth(w:Number|String)

  Set the width of the stroke

### Line.add(y:Mixed, time:Date)

  Add a point to the time series

## License

  MIT
