import Chart from 'react-apexcharts'
import Flatpickr from 'react-flatpickr'
import { Calendar } from 'react-feather'
import { Fragment, useState } from 'react'
import { Card, CardHeader, CardTitle, CardBody, CardSubtitle, Label, Spinner } from 'reactstrap'
import moment from "moment"
import { gql, useQuery } from '@apollo/client'

const GET_CALLOUT_COUNT_TODAY = gql`
query CalloutsToday($endDate: timestamptz!, $startDate: timestamptz!) {
  callout(where: {request_time: {_lte: $endDate, _gte: $startDate}}) {
    id
    request_time
  }
}
`

const ApexBarChart = ({ info, direction }) => {
  const getDaysArray = (dateArray) => {
    const start = dateArray[0]
    const end = dateArray[1]
    const arr = []
    for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
        arr.push(moment(new Date(dt)).format("ddd, DD"))
    }
    return arr
  }
  const [picker, setPicker] = useState([moment().subtract(7, 'days').toDate(), moment().toDate()]) //last 7 days defualt
  const [dateArray, setDateArray] = useState(getDaysArray(picker))
  const { loading, data, error } = useQuery(GET_CALLOUT_COUNT_TODAY, {variables: {endDate: picker[1], startDate: picker[0]}})
  console.log(picker)
  let countArray  = []
  if (!loading) {
    const modifiedData = data?.callout
    countArray = dateArray.map(date => {      
      return modifiedData.filter(element => moment(element.request_time).format("ddd, DD") === date).length
      })
  } 
console.log(countArray)
  const options = {
    chart: {
      parentHeightOffset: 0,
      toolbar: {
        show: false
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
      categories: dateArray
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
  )
}

export default ApexBarChart
