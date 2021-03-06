// SPDX-License-Identifier: AGPL-3.0-or-later
// SPDX-FileCopyrightText: 2020 grammm GmbH

import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  XAxis,
  YAxis,
  Line,
} from 'recharts';
import red from '../colors/red';
import green from '../colors/green';
import blue from '../colors/blue';
import orange from '../colors/orange';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import DefaultTooltipContent from 'recharts/lib/component/DefaultTooltipContent';
import { Typography } from '@material-ui/core';

const styles = theme => ({
  chartTitle: {
    margin: theme.spacing(2, 3),
  },
});

class CPULineChart extends Component {

  CPUTooltip = props => {
    if (props.active && props.content && props.content._self) {
      const lastIndex =  props.content._self.props.cpuPercent.length - 1;
      const newPayload = [
        { name: 'Idle', value: props.content._self.props.cpuPercent[lastIndex].idle + '%' },
        { name: 'User', value: props.content._self.props.cpuPercent[lastIndex].user + '%' },
        { name: 'System', value: props.content._self.props.cpuPercent[lastIndex].system + '%' },
        { name: 'IO', value: props.content._self.props.cpuPercent[lastIndex].io + '%' },
        { name: 'Steal', value: props.content._self.props.cpuPercent[lastIndex].steal + '%' },
        { name: 'Interrupt', value: props.content._self.props.cpuPercent[lastIndex].interrupt + '%' },
      ];
      return <DefaultTooltipContent
        {...props}
        payload={newPayload}
      />;
    }
    return <DefaultTooltipContent {...props} />;
  };

  render() {
    const { classes, cpuPercent } = this.props;

    return (
      <div>
        <Typography className={classes.chartTitle} variant="h5">
          {cpuPercent.length > 0 && `CPU: ${(100 - cpuPercent[cpuPercent.length - 1].idle).toFixed(1)}%`}
        </Typography>
        <ResponsiveContainer width="100%" height={250} >
          <LineChart
            data={cpuPercent}
            margin={{ top: 0, right: 32, left: 10, bottom: 16 }}
          >
            <XAxis dataKey="usage" />
            <YAxis domain={[0, 100]}/>
            <Tooltip 
              isAnimationActive={false}
            />
            <Legend />
            <Line
              strokeWidth={4}
              type="monotone"
              dataKey="user"
              stroke={green['500']}
              isAnimationActive={false}
            />
            <Line
              strokeWidth={4}
              type="monotone"
              dataKey="system"
              stroke={red['500']}
              isAnimationActive={false}
            />
            <Line
              strokeWidth={4}
              type="monotone"
              dataKey="io"
              stroke={blue['800']}
              isAnimationActive={false}
            />
            <Line
              strokeWidth={4}
              type="monotone"
              dataKey="steal"
              stroke={blue['500']}
              isAnimationActive={false}
            />
            <Line
              strokeWidth={4}
              type="monotone"
              dataKey="interupt"
              stroke={orange['500']}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

CPULineChart.propTypes = {
  classes: PropTypes.object.isRequired,
  cpuPercent: PropTypes.array.isRequired,
};

export default connect(null, null)(
  withTranslation()(withStyles(styles)(CPULineChart)));
