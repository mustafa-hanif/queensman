import classnames from 'classnames'
import Avatar from '@components/avatar'
import { TrendingUp, User, Box, DollarSign } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media } from 'reactstrap'
import { gql, useMutation, useQuery } from '@apollo/client'

const STATS = gql`query MyQuery {
  callout: callout_aggregate {
    aggregate {
      count
    }
  }
  closed: job_tickets_aggregate(where: {status: {_eq: "Closed"}}) {
    aggregate {
      count
    }
  }
  client: client_aggregate {
    aggregate {
      count
    }
  }
  property: property_aggregate {
    aggregate {
      count
    }
  }
}

`
const StatsCard = ({ cols }) => {
  const { loading, data: apiData, error } = useQuery(STATS)
  if (loading || error) return null
  console.log(apiData)
  const data = [
    {
      title: apiData.callout.aggregate.count,
      subtitle: 'Callouts',
      color: 'light-primary',
      icon: <TrendingUp size={24} />
    },
    {
      title: apiData.closed.aggregate.count,
      subtitle: 'Tickets Closed',
      color: 'light-info',
      icon: <User size={24} />
    },
    {
      title: apiData.client.aggregate.count,
      subtitle: 'Clients',
      color: 'light-danger',
      icon: <Box size={24} />
    },
    {
      title: apiData.property.aggregate.count,
      subtitle: 'Properties Registered',
      color: 'light-success',
      icon: <DollarSign size={24} />
    }
  ]

  const renderData = () => {
    return data.map((item, index) => {
      const margin = Object.keys(cols)
      return (
        <Col
          key={index}
          {...cols}
          className={classnames({
            [`mb-2 mb-${margin[0]}-0`]: index !== data.length - 1
          })}
        >
          <Media>
            <Avatar color={item.color} icon={item.icon} className='mr-2' />
            <Media className='my-auto' body>
              <h4 className='font-weight-bolder mb-0'>{item.title}</h4>
              <CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
            </Media>
          </Media>
        </Col>
      )
    })
  }

  return (
    <Card className='card-statistics'>
      <CardHeader>
        <CardTitle tag='h4'>Statistics</CardTitle>
        <CardText className='card-text font-small-2 mr-25 mb-0'>Updated 1 month ago</CardText>
      </CardHeader>
      <CardBody className='statistics-body'>
        <Row>{renderData()}</Row>
      </CardBody>
    </Card>
  )
}

export default StatsCard
