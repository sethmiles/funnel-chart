Funnel Chart
=========

This funnel chart contains the essential code to build a reusable data driven bar chart that can be updated. The chart is built on d3.js and follows some backbone.js naming conventions.

###Dependencies

Barchart.js requires d3.js and jQuery, zepto, or some other jquery flavor. If you do not use jQuery, the code can be slightly altered to accommodate. (Search for "$" in the code)

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

There are several options that can be passed into the funnelchart constructor. They are listed at the top of barchart.js. Any method named the same as in the Barchart will overwrite the Barchart's method. Here is a list of the options currently in place.

Option | Type | Description
--- | --- | ---
data | Array of Objects | This is required. Each object should represent one bar, and the data accessors are options as well
width | Number | Defines width of bar chart
height | Number | Defines height of bar chart
margin | Hash including top, right, bottom, and left properties | Defines the margins of the bar chart
barPadding | Number | The padding inbetween each bar
titleAccessor | String | The name of the value in the data used for the bar title (and unique identifier)
valueAccessor | String | The name of the value in the data for the number
transitionDuration | Number | Length of animation durations in milliseconds

##Update

To update an existing graph, reset the data and call the graph's render method. Continuing with the example above, follow the code below.

```javascript
myBarchart.setData(data);
myBarchart.render();
```

The current implementation uniquely identifies each bar by the bars title property. When updating the bar chart, d3 will map the updated data values to the corresponding bars and change those bars. D3 will also introduce new bars that previously did not exist as well as remove bars that the new data does not include. Check out the demo on index.html to better see how this works.

##Data Structure

Currently, the data structure needs to be an array of objects. The objects can contain whatever properties they need, but there are two required values. They are title, and value. These value names can be changed so long as the title and value accessor options are passed in, otherwise it defaults to title and value. Below is an example of a valid data structure.

```javascript
[
  {
    title: 'bar1',
    value: 60
    // Any other property can be included here, might be handy for an onclick
    // or hover event since the entire object will be returned (when I get 
    // around to implementing it)
  },
  {
    title: 'bar2',
    value: 35
  },
  {
    title: 'bar3',
    value: 15
  }
]
```

##Questions & Comments

If you have any questions, comments or feature requests email me. Feel free to send pull requests as well. This code is part of a series on data visualizations that hopefully will culminate into a visualization library.
