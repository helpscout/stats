import * as React from 'react'
import createStats from './createStats'
import { defaultOptions as defaultProps } from './utils'

export class StatsGraph extends React.PureComponent {
  static defaultProps = defaultProps
  stats: any

  componentDidMount() {
    this.stats = createStats({ ...this.props })
  }

  componentWillUnmount() {
    if (this.stats) {
      this.stats.destroy()
    }
  }

  render() {
    return null
  }
}

export default StatsGraph
