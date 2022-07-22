/* eslint-disable brace-style */
import classnames from 'classnames'
import Avatar from '@components/avatar'
import { TrendingUp, User, Box, DollarSign } from 'react-feather'
import { Card, CardHeader, CardTitle, CardBody, CardText, Row, Col, Media, Spinner } from 'reactstrap'
import { gql, useMutation, useQuery } from '@apollo/client'
import { useNiceQuery } from '../../../../utility/Utils'

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
  const { loading, data: apiData, error } = useNiceQuery(STATS)
  if (error) {
    console.log(error)
  }
  
  const notifyMe = () => {


    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification")
    }
    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          // const notification = new Notification("Hi there!")
      // alert(notification.title)
          navigator.serviceWorker.ready.then(function(registration) {
            const title = "Job Closed"
            const options = {
              actions: [{action: 'archive', title: "Archive"}, {action: "open", title: "View Job"}],
              body: "Hellow from queens man",
              data: "why queens man and not queenswoman",
              renotify: true,
              requireInteraction: true,
              silent: false,
              tag: "queensman"
            }

            registration.showNotification(title, options)
          })
        }
      })
    }
  
    // At last, if the user has denied notifications, and you
    // want to be respectful there is no need to bother them any more.
  }

  const data = [
    {
      title: apiData?.callout?.aggregate?.count,
      subtitle: 'Callouts',
      color: 'light-primary',
      icon: <TrendingUp size={24} />
    },
    {
      title: apiData?.closed?.aggregate?.count,
      subtitle: 'Tickets Closed',
      color: 'light-info',
      icon: <User size={24} />
    },
    {
      title: apiData?.client?.aggregate?.count,
      subtitle: 'Clients',
      color: 'light-danger',
      icon: <Box size={24} />
    },
    {
      title: apiData?.property?.aggregate?.count,
      subtitle: 'Properties Registered',
      color: 'light-success',
      icon: <DollarSign size={24} />
    }
  ]

  const loadingData = [
    {
      title: "",
      subtitle: 'Callouts',
      color: 'light-primary',
      icon: <TrendingUp size={24} />
    },
    {
      title: "",
      subtitle: 'Tickets Closed',
      color: 'light-info',
      icon: <User size={24} />
    },
    {
      title: "",
      subtitle: 'Clients',
      color: 'light-danger',
      icon: <Box size={24} />
    },
    {
      title: "",
      subtitle: 'Properties Registered',
      color: 'light-success',
      icon: <DollarSign size={24} />
    }
  ]

  const renderLoadingData = () => {
    return loadingData?.map((item, index) => {
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
              <h4 className='font-weight-bolder mb-0'><Spinner color="primary" size="sm" /></h4>
              <CardText className='font-small-3 mb-0'>{item.subtitle}</CardText>
            </Media>
          </Media>
        </Col>
      )
    })
  }

  const renderData = () => {
    return data?.map((item, index) => {
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
              <h4 className='mb-0'>{item.title}</h4>
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
      <button onClick={() => notifyMe()}>Notify me!</button>
        <CardTitle tag='h4'>Statistics</CardTitle>
      </CardHeader>
      <CardBody className='statistics-body'>
        {error ? <Row className="justify-content-center"><p className="text-danger">Unable to load stats</p></Row> : <Row className="justify-content-center">{loading ? renderLoadingData() : renderData()}</Row>}
      </CardBody>
    </Card>
  )
}

export default StatsCard
