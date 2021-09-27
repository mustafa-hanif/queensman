import { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Row,
  Col,
  Spinner
} from 'reactstrap'
import Chart from 'react-apexcharts'
import moment from "moment"
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { useNiceQuery } from '../utility/Utils'

const GET_TICKETS = gql`
query GetTickets($endDate: timestamptz!, $startDate: timestamptz!) {
  job_tickets(where: {created_at: {_lte: $endDate, _gte: $startDate}}) {
    id
    type
    status
  }
}
`
const SupportTracker = props => {
  const dropDownLabels = [
    {label: 'Last 7 Days', value: 7},  
    {label: 'Last Month', value: 30}, 
    {label: 'Last Year', value: 365}
  ]

  const [selectedValue, setSelectedValue] = useState(dropDownLabels[0])
  const [startEndDate, setStartEndDate] = useState([moment().subtract(selectedValue.value, 'days').toDate(), moment().toDate()]) //last 7 days defualt
  const { loading, data, error } = useNiceQuery(GET_TICKETS, {variables: {startDate: startEndDate[0], endDate: startEndDate[1] }})
  const job_tickets = data?.job_tickets
  const totalTicket = job_tickets?.length
  const closedTicket = job_tickets?.filter(element => element.status === "Closed").length
  const openTicket = job_tickets?.filter(element => element.status === "Open").length
  const deferredTicket = job_tickets?.filter(element => element.type === "Deferred").length
  const additionalRequest = job_tickets?.filter(element => element.type === "Additional Request").length
  const materialRequestTicket = job_tickets?.filter(element => element.type === "Material Request").length
  const requestForQuotaionTicket = job_tickets?.filter(element => element.type === "Request for Quotation").length
  const title = 'Support Tracker'
  const options = {
      plotOptions: {
        radialBar: {
          size: 150,
          offsetY: 20,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: '65%'
          },
          track: {
            background: '#fff',
            strokeWidth: '100%'
          },
          dataLabels: {
            name: {
              offsetY: -5,
              fontFamily: 'Montserrat',
              fontSize: '1rem'
            },
            value: {
              offsetY: 15,
              fontFamily: 'Montserrat',
              fontSize: '1.714rem'
            }
          }
        }
      },
      colors: [props.danger],
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          type: 'horizontal',
          shadeIntensity: 0.5,
          gradientToColors: [props.primary],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100]
        }
      },
      stroke: {
        dashArray: 8
      },
      labels: ['Completed Tickets']
    },
    series = totalTicket === 0 ? [0] : [Math.ceil((closedTicket / totalTicket) * 100)]

  return (
    <Card>
      <CardHeader className='pb-0'>
        <CardTitle tag='h4'>{title}</CardTitle>
      </CardHeader>
      <CardBody>
        <Row>
          <Col sm='2' className='d-flex flex-column flex-wrap text-center'>
            <h1 className='font-large-2 font-weight-bolder mt-2 mb-0'>{totalTicket}</h1>
            <CardText>Tickets</CardText>
          </Col>
          <Col sm='8' className='d-flex justify-content-center'>
            {loading ? <div style={{height: 270, display: "flex", flexDirection: "column", alignItems:"center", alignContent: "center", justifyContent: "center"}}>
      <div className="mb-2"><Spinner color='primary' /></div>
      <div><h6>Loading</h6></div>
      </div> : <Chart options={options} series={series} type='radialBar' height={270} id='support-tracker-card' />}
          </Col>
          <Col sm="2" className='d-flex justify-content-center'>
          <UncontrolledDropdown className='chart-dropdown'>
          <DropdownToggle color='' className='bg-transparent btn-sm border-0 p-50'>
            {selectedValue.label}
          </DropdownToggle>
          <DropdownMenu right>
            {dropDownLabels.map(item => (
              <DropdownItem className='w-100' key={item.value} active={item.value === selectedValue.value} onClick={(e) => { setSelectedValue({label: item.label, value: item.value}); setStartEndDate([moment().subtract(item.value, 'days').toDate(), moment().toDate()]) }}>
                {item.label}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
          </Col>
        </Row>
        <div className='d-flex justify-content-between mt-1'>
          <div className='text-center'>
            <CardText className='mb-50'>Deferred Tickets</CardText>
            <span className='font-large-1 font-weight-bold'>{deferredTicket}</span>
          </div>
          <div className='text-center'>
            <CardText className='mb-50'>Open Tickets</CardText>
            <span className='font-large-1 font-weight-bold'>{openTicket}</span>
          </div>
          <div className='text-center'>
            <CardText className='mb-50'>Material Request Ticket</CardText>
            <span className='font-large-1 font-weight-bold'>{materialRequestTicket}</span>
          </div>
          <div className='text-center'>
            <CardText className='mb-50'>Additional Request Ticket</CardText>
            <span className='font-large-1 font-weight-bold'>{additionalRequest}</span>
          </div>
          <div className='text-center'>
            <CardText className='mb-50'>Request for Quotation Ticket</CardText>
            <span className='font-large-1 font-weight-bold'>{requestForQuotaionTicket}</span>
          </div>
        </div>
      </CardBody>
    </Card>
  ) 
}
export default SupportTracker
