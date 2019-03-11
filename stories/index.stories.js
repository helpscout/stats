import React from 'react'
import { storiesOf } from '@storybook/react'
import { linkTo } from '@storybook/addon-links'

import { Welcome } from '@storybook/react/demo'
import StatsGraph from '../src/StatsGraph'

storiesOf('Welcome', module).add('to Storybook', () => (
  <div>
    <StatsGraph />
    <Welcome showApp={linkTo('Button')} />
  </div>
))
