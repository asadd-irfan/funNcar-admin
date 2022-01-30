import * as React from "react";
import Paper from "@material-ui/core/Paper";
import {
  Chart,
  ArgumentAxis,
  ValueAxis,
  BarSeries,
  Title,
  Legend,
} from "@devexpress/dx-react-chart-material-ui";
import { withStyles } from "@material-ui/core/styles";
import { Stack, Animation } from "@devexpress/dx-react-chart";

const legendStyles = () => ({
  root: {
    display: "flex",
    margin: "auto",
    flexDirection: "row",
  },
});
const legendRootBase = ({ classes, ...restProps }) => (
  <Legend.Root {...restProps} className={classes.root} />
);
const Root = withStyles(legendStyles, { name: "LegendRoot" })(legendRootBase);
const legendLabelStyles = () => ({
  label: {
    whiteSpace: "nowrap",
  },
});
const legendLabelBase = ({ classes, ...restProps }) => (
  <Legend.Label className={classes.label} {...restProps} />
);
const Label = withStyles(legendLabelStyles, { name: "LegendLabel" })(
  legendLabelBase
);

export default class BarsChart extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {
          country: "USA",
          gold: 36,
          silver: 38,
          bronze: 36,
        },
        {
          country: "China",
          gold: 51,
          silver: 21,
          bronze: 28,
        },
        {
          country: "Russia",
          gold: 23,
          silver: 21,
          bronze: 28,
        },
        {
          country: "Britain",
          gold: 19,
          silver: 13,
          bronze: 15,
        },
        {
          country: "Australia",
          gold: 14,
          silver: 15,
          bronze: 17,
        },
        {
          country: "Germany",
          gold: 16,
          silver: 10,
          bronze: 15,
        },
      ],
    };
  }

  render() {
    const { data: chartData } = this.state;

    return (
      <Paper>
        <Chart data={chartData}>
          <ArgumentAxis />
          <ValueAxis />

          <BarSeries
            name="Gold Medals"
            valueField="gold"
            argumentField="country"
            color="#ffd700"
          />
          <BarSeries
            name="Silver Medals"
            valueField="silver"
            argumentField="country"
            color="#c0c0c0"
          />
          <BarSeries
            name="Bronze Medals"
            valueField="bronze"
            argumentField="country"
            color="#cd7f32"
          />
          <Animation />
          <Legend
            position="bottom"
            rootComponent={Root}
            labelComponent={Label}
          />
          <Title text="Olimpic Medals in 2008" />
          <Stack />
        </Chart>
      </Paper>
    );
  }
}
