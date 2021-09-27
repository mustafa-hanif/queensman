import Chart from 'react-apexcharts'
import Flatpickr from 'react-flatpickr'
import { Calendar, Info } from 'react-feather'
import { useHistory } from 'react-router-dom'
import AppCollapse from '@components/app-collapse'
import { Fragment, useState } from 'react'
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle, Label, Spinner, Modal, ModalHeader, ModalBody, Button } from 'reactstrap'
import moment from "moment"
import CalloutModal from "./CalloutModal" 
import { gql, useQuery } from '@apollo/client'
import { useNiceQuery } from '../utility/Utils'

const GET_CALLOUT_COUNT_TODAY = gql`
query CalloutsToday($endDate: timestamptz!, $startDate: timestamptz!) {
  callout(where: {request_time: {_lte: $endDate, _gte: $startDate}, status: {_neq: "Closed"}}, order_by: {id: desc}) {
    id
    callout_by_email
    property_id
    job_type
    urgency_level
    category
    active
    request_time
    status
    description
    picture1
    picture2
    picture3
    picture4
    video
    property {
      id
      city
      country
      community
      address
      comments
      type
    }
    client_callout_email {
      id
      full_name
      email
    }
    pre_pics {
      picture_location
      id
    }
    postpics {
      id
      picture_location
    }
    job_history {
      id
      updated_by
      status_update
      time
      location
    }
    job_worker {
      worker {
        id
        full_name
        email
        team_id
      }
    }
    callout_job {
      feedback
      instructions
      rating
      signature
      solution
    }
    schedulers {
      id
      date_on_calendar
      time_on_calendar
    }
  }
}
`

const ApexBarChart = ({ info, direction }) => {
  const history = useHistory()
  const [calloutModal, setCalloutModal] = useState(false)
  const [calloutModal2, setCalloutModal2] = useState(false)
  const [modalDetails, setModalDetails] = useState(null)
  const [calloutModifiedData, setCalloutModifiedData] = useState(null)
    //** Function to open details modal */
    const openModal = () => {
      setCalloutModal(true)
    }
    const openCalloutModal = (item) => {
      setCalloutModal2(true)
      setModalDetails(item) //set row value 
    }
    const CollapseDefault = ({ data }) => (
      <AppCollapse data={data} type="border" />
    )

    const RowContent = ({data: callout}) => (
      <div>
      <div className='meetup-header d-flex align-items-center'>
        <h5 className='mb-1'>Email: </h5> 
        <h6 className='mb-1 ml-1'>{callout?.callout_by_email}</h6>
      </div>
      <div className='meetup-header d-flex align-items-center'>
        <h5 className='mb-1'>Request Time: </h5>
        <h6 className='mb-1 ml-1'>{moment(callout?.request_time).format('MMMM Do YYYY, h:mm:ss a')}</h6>
      </div>
      <div className='meetup-header d-flex align-items-center'>
      <Button color='info' className="mx-2" onClick={() => { openCalloutModal(callout) }} size="sm">
  <span className='align-middle mr-50'>View Details</span>
    <Info size={15} />
  </Button>
  <Button color='primary' className="mx-2" onClick={() => { history.push({ pathname: '/schedule', state: { changeToDayView: true, date: callout?.schedulers?.[0]?.date_on_calendar } }) }} size="sm">
  <span className='align-middle mr-50'>View on Calendar</span>
    <Info size={15} />
  </Button>
      </div>
    </div>
    )

    
  const getDaysArray = (dateArray) => {
    const start = dateArray[0]
    const end = dateArray[1]
    const arr = []
    const arr2 = []
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        arr.push(moment(new Date(dt)).format("ddd, DD"))
        arr2.push(moment(new Date(dt)).format("YYYY-MM-DD"))
    }
    return { arr, arr2 }
  }
  const [picker, setPicker] = useState([moment().subtract(7, 'days').toDate(), moment().toDate()]) //last 7 days defualt
  const [dateArray, setDateArray] = useState(getDaysArray(picker))
  const { loading, data, error } = useNiceQuery(GET_CALLOUT_COUNT_TODAY, {variables: {endDate: picker[1], startDate: picker[0]}})
  let countArray  = []
  if (!loading) {
    const modifiedData = data?.callout
    countArray = dateArray.arr.map(date => {      
      return modifiedData.filter(element => moment(element.request_time).format("ddd, DD") === date).length
      })
  } 
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: {
        show: false
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          console.log(data) //this returns undefined fro some reason
          const date = moment(dateArray.arr2[config.dataPointIndex]).format("YYYY-MM-DD")
          const newData = data.callout.filter((data) => moment(data.request_time).format("YYYY-MM-DD") === date)
          const callout_count = newData?.length
          setCalloutModifiedData(
          callout_count !== 0 ? newData?.map((data, i) => ({
            title: `Callout id: ${data.id}  Callout by: ${data.callout_by_email}`,
            content: <RowContent data={data} count={callout_count} />
          })) : [
            {
              title: `No data Available`,
              content: <div></div>
            }
          ]
          )
          openModal()
          // openDetailsModal(data.callout.filter((data) => moment(data.request_time).format("YYYY-MM-DD") === date))
          
          
        }
      }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '30%',
        endingShape: 'rounded'
      }
    },
    grid: {
      xaxis: {
        lines: {
          show: false
        }
      }
    },
    colors: info,
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: dateArray.arr
    },
    yaxis: {
      opposite: direction === 'rtl'
    }
  }

  const series = [
    {
      data: countArray
    }
  ]
  let sum = 0
  if (countArray.length > 0) {
    sum = countArray.reduce((accumulator, current) => {
      return accumulator + current 
    })
  }

  return (
    <>
    <Card>
      <CardHeader className='d-flex flex-sm-row flex-column justify-content-md-between align-items-start justify-content-start'>
        <div>
          <CardSubtitle className='text-muted mb-25'>Callouts in the set range</CardSubtitle>
          {picker[1] ? <CardTitle className='font-weight-bolder' tag='h4'>
            {sum}
          </CardTitle> : <Spinner color="primary" className="mt-1" />}
        </div>
        <div className='d-flex align-items-center mt-md-0 mt-1'>
        <Calendar size={17} />
            <Flatpickr
            options={{
              mode: 'range'
            }}
            onChange={date => { setPicker(date); setDateArray(getDaysArray(date)) }}
            value={picker}
            className='form-control flat-picker bg-transparent border-0 shadow-none'
          />
          </div>
      </CardHeader>
      <CardBody>
      {picker[1] ? <Chart options={options} series={series} type='bar' height={400} />  :  <div style={{height: 400, display: "flex", flexDirection: "column", alignItems:"center", alignContent: "center", justifyContent: "center"}}>
      <div className="mb-2"><Spinner color='primary' /></div>
      <div><h6>Select End date</h6></div>
      </div>}
      </CardBody> 
    </Card>
    <div className='vertically-centered-modal'>
        <Modal isOpen={calloutModal} toggle={() => setCalloutModal(!calloutModal)} className='modal-dialog-centered modal-xl'>
          <ModalHeader className="d-flex justify-content-center" toggle={() => setCalloutModal(!calloutModal)}>Callout Details</ModalHeader>
          <ModalBody>
          <h1>Callout Details</h1>
            <CollapseDefault data={calloutModifiedData} />
              <Modal isOpen={calloutModal2} toggle={() => setCalloutModal2(!calloutModal2)} className='modal-dialog-centered modal-xl'>
                <ModalHeader className="d-flex justify-content-center" toggle={() => setCalloutModal2(!calloutModal2)}>Callout Details</ModalHeader>
                  <ModalBody>
                    <CalloutModal item={modalDetails} />
                  </ModalBody>
              </Modal>
          </ModalBody>
        </Modal>
      </div>
    </>
  )
}

export default ApexBarChart
