import { Fragment, useContext } from 'react'
import { Row, Col, FormGroup } from 'reactstrap'
import { kFormatter } from '@utils'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import OrdersReceived from './OrdersReceived'
import SupportTracker from './SupportTracker'
import SubscribersGained from './SubscribersGained'
import BarChart from './BarChart'
import StatsCard from '@src/views/ui-elements/cards/statistics/StatsCard'
import { useRTL } from '@hooks/useRTL'
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'
import '@styles/react/libs/flatpickr/flatpickr.scss'


const Home = () => {
  const { colors } = useContext(ThemeColors)
  const [isRtl, setIsRtl] = useRTL()
  return (
    <Fragment>
      <Row className='match-height'>
        <Col xl='12' md='12' xs='12'>
          {/* <StatsCard cols={{ xl: '3', sm: '6' }} /> */}
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='12' sm='6'>
          <BarChart direction={isRtl ? 'rtl' : 'ltr'} info={colors.info.main} />
        </Col>
        {/* <Col lg='3' sm='6'>
          <OrdersReceived kFormatter={kFormatter} warning={colors.warning.main} />
        </Col> */}
      </Row>
      <Row>
        <Col lg='12' sm="6">
          <SupportTracker primary={colors.primary.main} danger={colors.danger.main} />
        </Col>
      </Row>
    </Fragment>
  )
}

export default Home
