import { useEffect, useState } from 'react'
import axios from 'axios'
import { Users } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { gql, useQuery } from '@apollo/client'
import { useNiceQuery } from '../utility/Utils'

const GET_CALLOUT_COUNT_TODAY = gql`
query CalloutsToday($date: timestamptz!) {
    callout_aggregate(where: {request_time: {_eq: $date}}) {
      aggregate {
        count
      }
    }
  }
`

const SubscribersGained = ({ kFormatter }) => {
  const addHours = (date, hours) => {
    return new Date(new Date(date).setHours(new Date(date).getHours() + hours)).toISOString()
  }

  const { loading, data, error } = useNiceQuery(GET_CALLOUT_COUNT_TODAY, {variables: {date: Date()}})
  if (!loading) {
    const modifiedData = data?.callout_aggregate.aggregate.count
    console.log(modifiedData)
  } 
  const [data2, setData] = useState({
    series: [
      {
        name: 'Callouts',
        data: [28, 40, 36, 52, 38, 60, 55]
      }
    ],
    analyticsData: {
      subscribers: 92600
    }
})

  return data2 !== null ? (
    <StatsWithAreaChart
      icon={<Users size={21} />}
      color='primary'
      stats={kFormatter(data2.analyticsData.subscribers)}
      statTitle='New Callouts'
      series={data2.series}
      type='area'
    />
  ) : null
}

export default SubscribersGained
