import Chart from 'react-apexcharts'
import Avatar from '@components/avatar'
import { MoreVertical } from 'react-feather'
import moment from 'moment'
import { Card, CardHeader, CardTitle, CardBody, Media } from 'reactstrap'

const CalloutPicture = ({picture}) => {
  console.log(picture.picture_location)
  return <div style={{width: "100px", margin:4}}>
   <a href={picture.picture_location} target="_blank"><img src={picture.picture_location} style={{width: "100%", height: "100px", objectFit: "cover",  borderWidth: 2, borderColor: "#ccc", borderStyle: "solid", borderRadius: 10, marginBottom: 2}}/></a>
   <p className="text-muted" style={{fontSize: 10, textAlign: "center", lineHeight: 1.5}}>{moment(picture?.upload_time).format('MMMM Do YYYY, h:mm:ss a')}</p>
   </div>
}

const Rooms = ({ inventory_articles, inventory_pictures, title, index }) => {
  const renderTasks = () => {
    if (inventory_articles.length === 0) {
      return <h6>No articles</h6>
    } else {
    return inventory_articles.map((article, i) => {
      return (
        <div key={i} className='employee-task d-flex justify-content-between align-items-center'>
          <Media>
            <Media className='my-auto' body>
              <h6 className='mb-0'>{`${(i + 1)}) `}Type: {article.type}</h6>
              <small>Description: {article.description}</small>
            </Media>
          </Media>
          <div className='d-flex align-items-center'>
            <small className='text-muted mr-75'>ID: {article.inventory_room_id}</small>
          </div>
        </div>
      )
    })
  }
}

  return (
    <Card className='card-employee-task'>
      <CardHeader>
        <div className="d-flex">
        <CardTitle tag='h4'>{`${index}) `} Name: {title}</CardTitle>
        </div>
        
        {/* <MoreVertical size={18} className='cursor-pointer' /> */}
      </CardHeader>
      <CardBody>{renderTasks()}</CardBody>
      <div className='divider'>
      <div className='divider-text'>Images</div>
    </div>
    {inventory_pictures.length > 0 ? <div className="d-flex flex-wrap justify-content-center">
      {inventory_pictures.map(pic => (
        <CalloutPicture picture={pic} />
      ))}
      </div> : <div className="text-center pb-2">No images</div>}
    
    </Card>
  )
}

export default Rooms
