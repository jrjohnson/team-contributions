import Ember from 'ember';

import { select } from 'd3-selection';
import { scaleBand, scaleLinear, scaleOrdinal, schemeCategory20 } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { max } from 'd3-array';

const { Component, run, get } = Ember;

export default Component.extend({
  tagName: 'svg',
  attributeBindings: ['width', 'height'],
  didReceiveAttrs() {
    // Anytime we get an update schedule a draw
    run.scheduleOnce('render', this, this.draw);
  },
  contributions: null,
  width: 960,
  height: 500,
  draw(){
    const contributions = get(this, 'contributions');
    const dataOrArray = contributions?contributions:[];
    const svg = select(this.element);
    const width = get(this, 'width');
    const height = get(this, 'height');
    const chartWidth = width - 60;
    const chartHeight = height - 50;
    const color = scaleOrdinal(schemeCategory20);

    // set the ranges
    const x = scaleBand().range([0, chartWidth]).padding(0.1);
    const y = scaleLinear().range([chartHeight, 0]);

    svg.append("g").attr("transform", "translate(" + 40 + "," + 20 + ")");

    x.domain(dataOrArray.map(d => d.username));
    y.domain([0, max(dataOrArray, d => d.repositoryNames.length)]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar").data(dataOrArray)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.username))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.repositoryNames.length))
        .attr("height", d => chartHeight - y(d.repositoryNames.length))
        .attr('fill', d =>  color(d.username));

    svg.append("g").attr("transform", "translate(0," + chartHeight + ")").call(axisBottom(x));
    svg.append("g").call(axisLeft(y));
  },
});
