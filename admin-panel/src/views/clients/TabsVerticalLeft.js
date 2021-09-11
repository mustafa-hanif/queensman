/* eslint-disable no-use-before-define */
import { useState } from "react"
import moment from "moment"
import AppCollapse from "@components/app-collapse"
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  ListGroup,
  ListGroupItem,
  Button,
  Spinner,
  Card
} from "reactstrap"

const TabsVerticalLeft = ({ item }) => {
  const [active, setActive] = useState("1")

  const toggle = (tab) => {
    if (active !== tab) {
      setActive(tab)
    }
  }

  const RowContent = ({ data: prop, lease }) => (
    <div>
      <div className="meetup-header d-flex align-items-center">
        <h5 className="mb-1">Address: </h5>
        <h6 className="mb-1 ml-1">{prop.property.address}</h6>
      </div>
      <div className="meetup-header d-flex align-items-center">
        <h5 className="mb-1">Country: </h5>
        <h6 className="mb-1 ml-1">{prop.property.country}</h6>
      </div>
      <div className="meetup-header d-flex align-items-center">
        <h5 className="mb-1">City: </h5>
        <h6 className="mb-1 ml-1">{prop.property.city}</h6>
      </div>
      {lease &&  <div><div className="meetup-header d-flex align-items-center">
        <h5 className="mb-1">Start Date: </h5>
        <h6 className="mb-1 ml-1">{moment(prop.lease_start).format('MMMM Do YYYY, h:mm:ss a')}</h6>
      </div>
      <div className="meetup-header d-flex align-items-center">
      <h5 className="mb-1">End Date: </h5>
      <h6 className="mb-1 ml-1">{moment(prop.lease_end).format('MMMM Do YYYY, h:mm:ss a')}</h6>
    </div></div>}
    </div>
  )

  const CollapseDefault = ({ data }) => (
    <AppCollapse data={data} type="border" />
  )

  const property_owneds = item.property_owneds
  const prop_count = property_owneds.length
  const property_owneds_modified =
    prop_count !== 0 ? property_owneds.map((prop, i) => ({
      title: `Property id: ${prop.property.id} Adddress: ${prop.property.address}`,
      content: <RowContent data={prop} count={property_owneds.length} />
    })) : [
      {
        title: `No data Available`,
        content: <div></div>
      }
    ]

    const lease = item.leases
    const lease_count = lease.length
    const lease_modified =
      lease_count !== 0 ? lease.map((prop, i) => ({
        title: `Property id: ${prop.property.id} Adddress: ${prop.property.address}`,
        content: <RowContent data={prop} count={lease.length} lease={true} />
      })) : [
        {
          title: `No data Available`,
          content: <div></div>
        }
      ]
      console.log(lease_modified)
  const ItemValue = ({ item, itemKey }) => (
    <ListGroupItem>
      <span style={{ fontWeight: "bold" }}>
        {itemKey.split("_").map(value => value.charAt(0).toUpperCase() + value.slice(1)).join(" ")}: </span>
      {itemKey === "sign_up_time" ? moment(item[itemKey]).format('MMMM Do YYYY, h:mm:ss a') : item[itemKey] ? item[itemKey] : "N/A"}
    </ListGroupItem>
  )

  return (
    <div className="nav-vertical">
      <Nav tabs className="nav-left">
        <NavItem>
          <NavLink
            active={active === "1"}
            onClick={() => {
              toggle("1")
            }}
          >
            Client Details
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === "2"}
            onClick={() => {
              toggle("2")
            }}
          >
            Owned Properties
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={active === "3"}
            onClick={() => {
              toggle("3")
            }}
          >
            Leased Properties
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active}>
        <TabPane tabId="1">
          <h1>Details</h1>
          <h5>Client Details</h5>
          <ListGroup flush>
            {item && Object.keys(item).map((itemKey) => {
              if (!["documents", "property_owneds", "hasPlan", "leases", "__typename"].includes(itemKey)) {
                return (
                  <ItemValue item={item} itemKey={itemKey} />
                )
              }
            })}
            {item?.documents?.[item?.documents.length - 1]?.document_name && <Document row={item} />}

          </ListGroup>
        </TabPane>
        <TabPane tabId="2">
          <h1>Owned Properties</h1>
            <CollapseDefault data={property_owneds_modified} />
        </TabPane>
        <TabPane tabId="3">
          <h1>Leased Properties</h1>
          <CollapseDefault data={lease_modified} />
        </TabPane>
      </TabContent>
    </div>
  )
}


const Document = ({ row }) => {
  const [loading, setloading] = useState(false)
  const documentId = (row?.documents?.[row?.documents.length - 1].document_name ?? '').split(', ')[1]
  const name = row?.full_name
  const downloadContract = () => {
    setloading(true)
    // const myHeaders = new Headers()
    // myHeaders.append("Content-Type", "application/x-www-form-urlencoded")

    // const urlencoded = new URLSearchParams()
    // urlencoded.append("document_id", documentId)

    // const requestOptions = {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: urlencoded,
    //   redirect: 'follow'
    // }

    fetch("https://y8sr1kom3g.execute-api.us-east-1.amazonaws.com/dev/downloadDocument", requestOptions)
      .then(response => response.text())
      .then(result => {
        // console.log(result)
        const file = b64toBlob(result, "application/pdf")
        const fileUrl = window.URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = fileUrl
        link.setAttribute('download', `${name} contract.pdf`)
        document.body.appendChild(link)
        link.click()
        setloading(false)
      })
      .catch(error => console.log('error', error))
  }

  if (loading) {
    return <Spinner />
  }
  return <Button.Ripple target="_blank" href={`https://api-cf57bf4d.nhost.app/?document_id=${documentId}`} color='primary' style={{ width: 300 }}>Download Contract</Button.Ripple>
}

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || ""
  sliceSize = sliceSize || 512

  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }


  return new File(byteArrays, "pot", { type: contentType })
}

export default TabsVerticalLeft
