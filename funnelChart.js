
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

    initialize: function (options) {
      this.setOptions(options)
      this.$el = $('<div></div>').addClass('funnelchart')
      this.el = this.$el[0]
      this.setup()
      this.render()
    },

    setup: function () {
      this.setDimensions()
      this.createScales()
      this.data = this.sortData(this.data)
      this.visualization = d3.select(this.el)
        .style('width', this.width + this.margin.left + this.margin.right)
        .style('height', this.height + this.margin.top + this.margin.bottom)

      this.$el.css({
        position: 'relative'
      })
    },

    render: function () {
      var that = this
      this.setOrientation()
      this.setFunnelSegmentGirth()
      this.funnelSegmentLengthScale
        .range([this.funnelSegmentMaxLength, 0])
        .domain(this.getFunnelLengthDomain())

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
        .style('top', that.margin.top)
        .style('left', function(d, index) {
          if(that.orientation == 'vertical'){
            var totalWidth = ((that.width - that.margin.left - that.margin.right) / 2)
            var segmentWidth = (that.funnelSegmentLengthScale(d[that.valueAccessor]) / 2)
            return totalWidth - segmentWidth + that.margin.left
          } else {
            return that.margin.left + (index * that.funnelSegmentGirth)
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
              width: width
            })  
          } else {
            $(this).animate({
              borderLeft: that.funnelSegmentGirth + 'px solid ' + d[that.colorAccessor],
              borderTop: sideWidth + 'px solid transparent',
              borderBottom: sideWidth + 'px solid transparent',
              width: 0,
              height: width
            })
          }
        })
        .style('top', function(d, index) {
          if(that.orientation == 'vertical'){
            return that.margin.bottom + (index * that.funnelSegmentGirth)
          } else {
            var totalHeight = ((that.height - that.margin.top - that.margin.bottom) / 2)
            var segmentHeight = (that.funnelSegmentLengthScale(d[that.valueAccessor]) / 2)
            return totalHeight - segmentHeight + that.margin.top
          }
          
        })
        .style('left', function(d, index) {
          if(that.orientation == 'vertical'){
            var totalWidth = ((that.width - that.margin.left - that.margin.right) / 2)
            var segmentWidth = (that.funnelSegmentLengthScale(d[that.valueAccessor]) / 2)
            return totalWidth - segmentWidth + that.margin.left
          } else {
            return that.margin.left + (index * that.funnelSegmentGirth)
          }
        })

      this.chart
        .exit().transition().duration(this.transitionDuration)
          .style('top', 0)
          .style('left', 0)
          .style('opacity', 0)
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

    setFunnelSegmentGirth: function () {
      this.funnelSegmentGirth = this.height/this.data.length
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
