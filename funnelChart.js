
Funnelchart = function () {

  var hash = {

    width: 200,
    height: 200,
    margin: {
      top: 10,
      right: 10,
      bottom: 10,
      left: 10
    },
    titleAccessor: 'title',
    valueAccessor: 'value',
    colorAccessor: 'color',
    transitionDuration: 500,
    orientation: 'vertical',
    showAxis: true,
    axisSize: 75,

    initialize: function (options) {
      this.setOptions(options)
      this.$el = $('<div></div>').addClass('funnelchart')
        .css({
          position: 'relative',
          width: this.width,
          height: this.height
        })
      this.el = this.$el[0]
      this.setup()
      this.render()
    },

    setup: function () {
      this.setDimensions()
      this.createScales()
      this.data = this.sortData(this.data)
      this.visualization = d3.select(this.el)
        .append('div')
          .attr('class', 'segments')
          .style('position', 'absolute')
          

      this.visualizationAxis = d3.select(this.el)
        .append('div')
          .attr('class', 'axis-container')
          .style('position', 'absolute')

      this.visualizationAxisContainer = d3.select(this.visualizationAxis[0][0])
        .append('div')
          .style('position', 'relative')
    },

    render: function () {
      var that = this
      this.setOrientation()

      var axisWidth, axisHeight, funnelWidth, funnelHeight;
      if(this.showAxis){
        if(this.orientation == 'vertical') {
          funnelWidth = this.width - this.axisSize
          funnelHeight = this.height
          axisWidth = this.axisSize
          axisHeight = this.height
        } else {
          funnelWidth = this.width
          funnelHeight = this.height - this.axisSize
          axisWidth = this.width
          axisHeight = this.axisSize
        }  

        this.visualizationAxis
            .style('width', axisWidth)
            .style('height', axisHeight)
          .transition()
            .style('top', (this.orientation == 'vertical' ? this.margin.top : funnelHeight + this.margin.top))
            .style('left', this.margin.left)

        this.setFunnelSegmentGirth(funnelWidth, funnelHeight)
        this.renderAxis(funnelHeight);

      } else {
        funnelWidth = this.width + this.margin.left + this.margin.right
        funnelHeight = this.height + this.margin.top + this.margin.bottom
      }

      this.setFunnelSegmentGirth(funnelWidth, funnelHeight)

      this.funnelSegmentLengthScale
        .range([(that.orientation == 'vertical' ? funnelWidth : funnelHeight), 0])
        .domain(this.getFunnelLengthDomain())

      this.visualization.transition()
        .style('width', funnelWidth)
        .style('height', funnelHeight)
        .style('top', this.margin.top)
        .style('left', (this.orientation == 'vertical' ? this.axisSize + this.margin.left : this.margin.left))

      this.chart = this.visualization.selectAll('.segment')
        .data(this.data, function(d){
          return d[that.titleAccessor]
        })

      this.chart
        .enter().append('div')
        .attr('class', function (d) {
          return 'segment ' + d[that.titleAccessor].split(' ').join('-').toLowerCase()
        })
        .style('position', 'absolute')
        .style('top', 0)
        .style('left', function(d, index) {
          if(that.orientation == 'vertical'){
            var totalWidth = (funnelWidth / 2)
            var segmentWidth = (that.funnelSegmentLengthScale(d[that.valueAccessor]) / 2)
            return totalWidth - segmentWidth
          } else {
            return index * that.funnelSegmentGirth
          }
        })

      this.chart.transition().duration(this.transitionDuration)
        .style('position', 'absolute')
        .each(function(d, index){
          var sideWidth = 0; width = that.funnelSegmentLengthScale(d[that.valueAccessor]);
          if(that.data[index + 1]){
            sideWidth = (that.funnelSegmentLengthScale(d[that.valueAccessor]) - that.funnelSegmentLengthScale(that.data[index + 1][that.valueAccessor])) / 2
            width = that.funnelSegmentLengthScale(that.data[index + 1][that.valueAccessor])
          }
          if(that.orientation == 'vertical'){
            $(this).animate({
              borderTop: that.funnelSegmentGirth + 'px solid ' + d[that.colorAccessor],
              borderLeft: sideWidth + 'px solid transparent',
              borderRight: sideWidth + 'px solid transparent',
              height: 0,
              width: width,
              zIndex: index
            })  
          } else {
            $(this).animate({
              borderLeft: that.funnelSegmentGirth + 'px solid ' + d[that.colorAccessor],
              borderTop: sideWidth + 'px solid transparent',
              borderBottom: sideWidth + 'px solid transparent',
              width: 0,
              height: width,
              zIndex: index
            })
          }
        })
        .style('top', function(d, index) {
          if(that.orientation == 'vertical'){
            return index * that.funnelSegmentGirth
          } else {
            var totalHeight = (funnelHeight / 2)
            var segmentHeight = (that.funnelSegmentLengthScale(d[that.valueAccessor]) / 2)
            return totalHeight - segmentHeight
          }
          
        })
        .style('left', function(d, index) {
          if(that.orientation == 'vertical'){
            var totalWidth = (funnelWidth / 2)
            var segmentWidth = (that.funnelSegmentLengthScale(d[that.valueAccessor]) / 2)
            return totalWidth - segmentWidth
          } else {
            return index * that.funnelSegmentGirth
          }
        })

      this.chart
        .exit().transition().duration(this.transitionDuration)
          .style('top', 0)
          .style('left', 0)
          .style('opacity', 0)
          .remove()
    },

    renderAxis: function (funnelHeight) {
      var that = this

      this.axis = this.visualizationAxisContainer.selectAll('.axis')
        .data(this.data, function(d){
          return d[that.titleAccessor]
        })

      this.axis
        .enter().append('div')
        .attr('class', 'axis')
        .each(function (d) {
          $(this).html('<div class="title">' + d[that.titleAccessor] + '</div><div class="value">' + d[that.valueAccessor] + '</div>');
          $(this).animate({
            height: (that.orientation == 'vertical' ? that.funnelSegmentGirth + 'px' : that.axisSize + 'px'),
            width: (that.orientation == 'vertical' ? that.axisSize + 'px' : that.funnelSegmentGirth + 'px'),
            position: 'absolute'
          })
        })
        .style('top', function (d, index) {
          if(that.orientation == 'vertical'){
            return index * that.funnelSegmentGirth
          } else {
            return funnelHeight
          }
        })
        .style('left', function (d, index) {
          if(that.orientation == 'vertical'){ 
            return 0
          } else {
            return that.funnelSegmentGirth * index
          }
        })
        .style('opacity', 0)

      this.axis.transition().duration(this.transitionDuration)
        .each(function (d) {
          $(this).html('<div class="title">' + d[that.titleAccessor] + '</div><div class="value">' + d[that.valueAccessor] + '</div>');
          $(this).animate({
            height: (that.orientation == 'vertical' ? that.funnelSegmentGirth + 'px' : that.axisSize + 'px'),
            width: (that.orientation == 'vertical' ? that.axisSize + 'px' : that.funnelSegmentGirth + 'px'),
            position: 'absolute'
          })
        })
        .style('top', function (d, index) {
          if(that.orientation == 'vertical'){
            return index * that.funnelSegmentGirth
          } else {
            return 0
          }
        })
        .style('left', function (d, index) {
          if(that.orientation == 'vertical'){ 
            return 0
          } else {
            return that.funnelSegmentGirth * index
          }
        })
        .style('opacity', 1)

      this.axis.exit().transition()
        .style('opacity',0)
        .remove()        
    },

    setOrientation: function () {
      if(this.orientation == 'vertical'){
        this.funnelSegmentMaxLength = this.width
      } else {
        this.funnelSegmentMaxLength = this.height
      }
    },

    createScales: function () {
      this.funnelSegmentLengthScale = d3.scale.linear()
    },

    setFunnelSegmentGirth: function (funnelWidth, funnelHeight) {
      if(this.orientation == 'vertical'){
        this.funnelSegmentGirth = funnelHeight / this.data.length
      } else {
        this.funnelSegmentGirth = funnelWidth / this.data.length
      }
      
    },

    setDimensions: function () {
      this.width = this.width - this.margin.left - this.margin.right
      this.height = this.height - this.margin.top - this.margin.bottom
    },

    getFunnelLengthDomain: function () {
      var max = 0, min = 0, i = 0
      for(i; i < this.data.length; i++){
        if(this.data[i][this.valueAccessor] > max){
          max = this.data[i][this.valueAccessor]
        } else if(this.data[i][this.valueAccessor] < min){
          min = this.data[i][this.valueAccessor]
        }
      }
      return [max, min]
    },

    setData: function (data) {
      this.data = this.sortData(data);
    },

    sortData: function (data) {
      var that = this;
      return data.sort(function(a,b){ 
        return (a[that.valueAccessor] > b[that.valueAccessor] ? 0 : 1)
      })
    },

    setOptions: function (options) {
      for(prop in options){
        this[prop] = options[prop]
      }
    }
  }

  var Funnelchart = function (options) {
    this.initialize.apply(this, arguments)
  }

  for(prop in hash){
    Funnelchart.prototype[prop] = hash[prop]
  }

  return Funnelchart

}()