Funnel Chart
=========

Check out the [demo](http://sethhoward1988.github.io/workspace/funnel-chart-demo/).

This funnel chart contains the essential code to build a reusable data driven bar chart that can be updated. The chart is built on d3.js and follows some backbone.js naming conventions.

###Dependencies

Funnelchart.js requires d3.js and jQuery, zepto, or some other jquery flavor. If you do not use jQuery, the code can be slightly altered to accommodate. (Search for "$" in the code)

#How to Use It

Running Funnelchart.js attaches the Funnelchart class to the window. The code below shows how easy it us to get a funnelchart built and appended to the DOM.

```javascript
var myFunnelchart = new Funnelchart({
	width: 300,
	height: 300,
	data: data1
});

$('body').append(myFunnelchart.$el);
```

###Options

There are several options that can be passed into the funnelchart constructor. They are listed at the top of funnelchart.js. Any method named the same as in the funnelchart will overwrite the funnel chart's method. Here is a list of the options currently in place.

Option | Type | Description
--- | --- | ---
data | Array of Objects | This is required. Each object should represent one bar, and the data accessors are options as well
orientation | String | Accepts `vertical` or `horizontal` and creates the chart accordingly
width | Number | Defines width of bar chart
height | Number | Defines height of bar chart
margin | Hash including top, right, bottom, and left properties | Defines the margins of the bar chart
titleAccessor | String | The name of the value in the data used for the bar title (and unique identifier)
valueAccessor | String | The name of the value in the data for the number
colorAccessor | String | The name of the value in the data for the color
transitionDuration | Number | Length of animation durations in milliseconds

##Update

To update an existing graph, reset the data and call the graph's render method. Continuing with the example above, follow the code below.

```javascript
myFunnelchart.setData(data);
myFunnelchart.render();
```

The current implementation uniquely identifies each funnel segment by the segments title property. When updating the funnel chart, d3 will map the updated data values to the corresponding segments and change those segments. D3 will also introduce new segments that previously did not exist as well as remove segments that the new data does not include. Check out the demo on index.html to better see how this works.

##Data Structure

Currently, the data structure needs to be an array of objects. The objects can contain whatever properties they need, but there are three required values. They are title, value, and color. These value names can be changed so long as the title and value accessor options are passed in, otherwise it defaults to title and value. Below is an example of a valid data structure.

```javascript
[
  {
    title: 'Website Visits',
    value: 60,
    color: green
    // Any other property can be included here, might be handy for an onclick
    // or hover event since the entire object will be returned (when I get 
    // around to implementing it)
  },
  {
    title: 'Downloads',
    value: 35
  },
  {
    title: 'Sales',
    value: 15
  }
]
```

Note, in order for the funnel to be built properly, the data does NOT need to be in descending order, the code checks and sorts through the values.

##Questions & Comments

If you have any questions, comments or feature requests email me. Feel free to send pull requests as well. This code is part of a series on data visualizations that hopefully will culminate into a visualization library.
