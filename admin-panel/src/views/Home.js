import { Row, Col } from 'reactstrap'

import StatsCard from '@src/views/ui-elements/cards/statistics/StatsCard'
import '@styles/react/libs/charts/apex-charts.scss'
import '@styles/base/pages/dashboard-ecommerce.scss'
const Home = () => {
  return (
    <div id='dashboard-ecommerce'>
      <Row className='match-height'>
        <Col xl='12' md='12' xs='12'>
          <StatsCard cols={{ xl: '3', sm: '6' }} />
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='4' md='12'>
          <Row className='match-height'>
            <Col lg='6' md='3' xs='6'>
              {/* <OrdersBarChart warning={colors.warning.main} /> */}
            </Col>
            <Col lg='6' md='3' xs='6'>
              {/* <ProfitLineChart info={colors.info.main} /> */}
            </Col>
            <Col lg='12' md='6' xs='12'>
              {/* <Earnings success={colors.success.main} /> */}
            </Col>
          </Row>
        </Col>
        <Col lg='8' md='12'>
          {/* <RevenueReport primary={colors.primary.main} warning={colors.warning.main} /> */}
        </Col>
      </Row>
      <Row className='match-height'>
        <Col lg='8' xs='12'>
          {/* <CompanyTable /> */}
        </Col>
        <Col lg='4' md='6' xs='12'>
          {/* <CardMeetup /> */}
        </Col>
        <Col lg='4' md='6' xs='12'>
          {/* <CardBrowserStates colors={colors} trackBgColor={trackBgColor} /> */}
        </Col>
        <Col lg='4' md='6' xs='12'>
          {/* <GoalOverview success={colors.success.main} /> */}
        </Col>
        <Col lg='4' md='6' xs='12'>
          {/* <CardTransactions /> */}
        </Col>
      </Row>
    </div>
  )
}

export default Home
