// ** React Imports
import { useState, Fragment, forwardRef } from "react"
import { Link, useHistory } from 'react-router-dom'
import { DOMAIN } from '../../_config'

import { auth } from "../../utility/nhost"
const fetch = require("node-fetch")
const FormData = require("form-data")

// ** Custom Components
import Avatar from "@components/avatar"

// ** Third Party Components
import ReactPaginate from "react-paginate"
import DataTable from "react-data-table-component"
import { toast } from "react-toastify"
import {
  MoreVertical,
  Edit,
  ChevronDown,
  Plus,
  Trash,
  Eye,
  EyeOff,
  Edit3,
  Upload,
  Loader,
  Check,
  XCircle
} from "react-feather"
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Input,
  Label,
  FormGroup,
  Row,
  Col,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner
} from "reactstrap"

// ** Toast Component
const ToastComponent = ({ title, icon, color }) => (
  <Fragment>
    <div className="toastify-header pb-0">
      <div className="title-wrapper">
        <Avatar size="sm" color={color} icon={icon} />
        <h6 className="toast-title">{title}</h6>
      </div>
    </div>
  </Fragment>
)

// ** Bootstrap Checkbox Component
// const BootstrapCheckbox = forwardRef(({ onClick, ...rest }, ref) => {
//     return (
// <div className='custom-control custom-checkbox'>
//     <input type='checkbox' className='custom-control-input' ref={ref} {...rest} />
//     <label className='custom-control-label' onClick={onClick} />
//   </div>
//     )
// })

// ** Styles
import "@styles/react/libs/flatpickr/flatpickr.scss"
import { gql, useMutation, useQuery } from "@apollo/client"
import AddNewModal from "./AddNewModal"
import ButtonGroup from "reactstrap/lib/ButtonGroup"
import { months } from "moment"
import axios from "axios"
import TabsVerticalLeft from "./TabsVerticalLeft"
import { useNiceMutation, useNiceQuery } from "../../utility/Utils"

const GET_CLIENT = gql`
  query GetClient {
    client(order_by: { id: desc }) {
      id
      email
      full_name
      gender
      occupation
      organization
      phone
      active
      hasPlan
      sec_email
      sec_phone
      account_type
      age_range
      family_size
      ages_of_children
      earning_bracket
      nationality
      years_expatriate
      years_native
      referred_by
      other_properties
      contract_start_date
      contract_end_date
      sign_up_time
      documents {
        document_name
      }
      property_owneds {
        property {
          address
          community
          city
          country
          id
        }
      }
      leases {
        property {
          address
          community
          city
          country
          id
        }
      }
    }
  }
`

const UPDATE_CLIENT = gql`
  mutation UpdateClient(
    $id: Int!
    $email: String
    $full_name: String
    $phone: String
    $active: smallint
    $sec_email: String
    $sec_phone: String
    $account_type: String
    $referred_by: Int
    $contract_start_date: date
    $contract_end_date: date
    $sign_up_time: timestamptz
  ) {
    update_client_by_pk(
      pk_columns: { id: $id }
      _set: {
        id: $id
        email: $email
        full_name: $full_name
        phone: $phone
        active: $active
        sec_email: $sec_email
        sec_phone: $sec_phone
        account_type: $account_type
        referred_by: $referred_by
        contract_start_date: $contract_start_date
        contract_end_date: $contract_end_date
        sign_up_time: $sign_up_time
      }
    ) {
      id
    }
  }
`
const ADD_CLIENT = gql`
  mutation AddClient(
    $email: String
    $full_name: String
    $phone: String
    $active: smallint
    $sec_email: String
    $sec_phone: String
    $account_type: String
    $referred_by: Int
    $contract_start_date: date
    $contract_end_date: date
  ) {
    insert_client_one(
      object: {
        email: $email
        full_name: $full_name
        phone: $phone
        active: $active
        sec_email: $sec_email
        sec_phone: $sec_phone
        account_type: $account_type
        referred_by: $referred_by
        contract_start_date: $contract_start_date
        contract_end_date: $contract_end_date
      }
    ) {
      id
    }
  }
`

const DELETE_CLIENT = gql`
  mutation DeleteClient($id: Int!) {
    delete_client_by_pk(id: $id) {
      id
    }
  }
`
const UPDATE_CLIENT_HASPLAN = gql`
  mutation UpdateHasPLan($id: Int!, $hasPlan: Boolean!) {
    update_client_by_pk(pk_columns: { id: $id }, _set: { hasPlan: $hasPlan }) {
      hasPlan
    }
  }
`
const UPLOAD_PLAN = gql`
  mutation AddCallout(
    $date_on_calendar: date
    $callout_by: Int
    $notes: String
    $time_on_calendar: time
    $end_time_on_calendar: time
    $end_date_on_calendar: date
    $email: String
    $property_id: Int
    $blocked: Boolean
    $worker_id: Int
  ) {
    insert_scheduler_one(
      object: {
        callout: {
          data: {
            callout_by_email: $email
            callout_by: $callout_by
            property_id: $property_id
            category: "Uncategorized"
            job_type: $notes
            status: "Planned"
            urgency_level: "Scheduled"
            active: 1,
            description: $notes
          }
        }
        date_on_calendar: $date_on_calendar
        time_on_calendar: $time_on_calendar
        end_time_on_calendar: $end_time_on_calendar
        end_date_on_calendar: $end_date_on_calendar
        notes: $notes
        blocked: $blocked
        worker_id: $worker_id
      }
    ) {
      date_on_calendar
    }
  }
`

const DELETE_PLAN = gql`
  mutation MyMutation($email: String, $callout_id: Int!) {
    delete_callout(
      where: {
        _or: { callout_by_email: { _eq: $email } }
        callout_by: { _eq: $callout_id }
      }
    ) {
      affected_rows
    }
  }
`

const UPDATE_ACTIVE = gql`
mutation MyMutation($active: Boolean!, $email: citext!) {
  update_auth_accounts(where: {email: {_eq: $email}}, _set: {active: $active}) {
    affected_rows
  }
}
`
const GET_WORKER = gql`
query GetWorker($_eq: String!) {
  worker(where: {email: {_eq: $_eq}}) {
    full_name
    id
    email
  }
}
`


const DataTableAdvSearch = () => {
  // ** States
  const history = useHistory()
  const [noEmailError, setNoEmailError] = useState(false)
  const [queryLoading, setQueryLoading] = useState(false)
  const [loaderButton, setLoaderButton] = useState(false)
  const { loading, data, error, refetch: refetchClient } = useNiceQuery(GET_CLIENT)
  const [updateClient, { loading: clientLoading }] = useNiceMutation(
    UPDATE_CLIENT,
    { refetchQueries: [{ query: GET_CLIENT }] }
  )
  const { workerLoading, data: allWorkers, workerError } = useNiceQuery(GET_WORKER, {
    variables: {_eq: "opscord@queensman.com"}
  })
  const [addClient, { loading: addClientLoading }] = useNiceMutation(ADD_CLIENT, {
    refetchQueries: [{ query: GET_CLIENT }]
  })
  const [deleteClient, { loading: deleteClientLoading }] = useNiceMutation(
    DELETE_CLIENT,
    { refetchQueries: [{ query: GET_CLIENT }] }
  )
  const [addPlan, { loading: addPlanLoading }] = useNiceMutation(UPLOAD_PLAN)
  const [updateClientActive] = useNiceMutation(UPDATE_ACTIVE)
  const [deletePlan, { loading: deletePlanLoading }] = useNiceMutation(DELETE_PLAN)
  const [updateClientPlan] = useNiceMutation(UPDATE_CLIENT_HASPLAN, { refetchQueries: [{ query: GET_CLIENT }] })
  const [modal, setModal] = useState(false)
  const [searchName, setSearchName] = useState("")
  const [searchOccupation, setSearchOccupation] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [searchEmail, setSearchEmail] = useState("")
  const [searchOrganization, setSearchOrganization] = useState("")
  const [searchPhone, setSearchPhone] = useState("")
  const [searchGender, setSearchGender] = useState("")
  const [filteredData, setFilteredData] = useState([])
  const [toAddNewRecord, setToAddNewRecord] = useState(false)
  const [row, setRow] = useState(null)
  const [rowId, setRowId] = useState(null)

  const [modalAlert, setModalAlert] = useState(null)
  const [detailsModal, setDetailsModal] = useState(false)
  const [modalDetails, setModalDetails] = useState(null)

  const toggleModal = () => {
    setModalAlert(!modalAlert)
  }

  const SuccessToast = ({ data }) => {
    return (
      <Fragment>
        <div className='toastify-header'>
          <div className='title-wrapper'>
            <Avatar size='sm' color='success' icon={<Check size={12} />} />
            <h6 className='toast-title'>Form Submitted!</h6>
          </div>
        </div>
        <div className='toastify-body'>
          <ul className='list-unstyled mb-0'>
            <li>
              <strong>Full name</strong>: {data.full_name}
            </li>
            <li>
              <strong>email</strong>: {data.email}
            </li>
          </ul>
        </div>
      </Fragment>
    )
  }

  //Overlay component
  const Overlay = ({ setLoaderButton, loaderButton, setLoading }) => {
    return (
      <div style={{
        position: "fixed",
        display: "block",
        width: "100%",
        height: "100%",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 2
      }}>
        <div style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)"
        }}>
          <Spinner color='primary' />
          {loaderButton && <div className="d-flex flex-column align-items-center mt-2">
            <h6 className="text-primary">Hmmm it is taking longer than expected</h6>
            <Button color='secondary' className="mt-2" onClick={() => { setLoaderButton(false); setLoading(false) }}>Go back</Button>
          </div>}
        </div>
      </div>
    )
  }

  const openModalAlert = (id) => {
    setRowId(id)
    setModalAlert(true)
  }

  const closeModal = () => {
    setModal(!modal)
  }

  //** Function to open details modal */
  const openDetailsModal = (item) => {
    setDetailsModal(true)
    setModalDetails(item) //set row value
  }

  // ** Function to handle Modal toggle
  const handleModal = (row) => {
    setRow(row)
    setTimeout(() => {
      setModal(!modal)
    }, 200)
    setToAddNewRecord(false)
  }

  const addHours = (date, hours) => {
    return new Date(new Date(date).setHours(new Date(date).getHours() + hours))
  }

  const handleAddPlan = async (row) => {
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + 1
    let day = new Date().getDate()
    const propertyid = row.property_owneds[0]?.property?.id ? row.property_owneds[0]?.property?.id : row.leases[0]?.property?.id
    const notesArray =  [
      "AC & Plumbing PPM",
      "Electrical & Carpentry PPM",
      "2nd AC & Plumbing PPM",
      "2nd Elec, Carp & Water Tank"
    ]
    console.log(row)
    console.log(row.property_owneds[0]?.property?.id)
    const planArray = []
    setQueryLoading(true)
    setTimeout(() => {
      setLoaderButton(true)
      if (!queryLoading) {
        setLoaderButton(false)
      }
    }, 10000)
    try {
      for (let i = 0; i < 4; i++) {
        if (month >= 13) {
          month = 1
          year++
        }
        let date_on_calendar = `${year}-${month < 10 ? `0${month}` : month
          }-${day}` //new Date().getMonth()+1
        if (i === 0) {
          date_on_calendar = `${year}-${month < 10 ? `0${month}` : month
            }-${day + 7}` //new Date().getMonth()+1
        }
        const time_on_calendar = "10:00:00" //10:00:00
        console.log({ date_on_calendar })
        console.log({ time_on_calendar })
        const end_time_on_calendar = addHours(
          `${date_on_calendar} ${time_on_calendar}`,
          4
        )
          .toTimeString()
          .substr(0, 8)
        const end_date_on_calendar = addHours(
          `${date_on_calendar} ${time_on_calendar}`,
          4
        )
          .toISOString()
          .substr(0, 10)
        console.log({
          property_id: propertyid,
          callout_by: row.id,
          email: row.email,
          date_on_calendar,
          time_on_calendar,
          end_time_on_calendar,
          end_date_on_calendar,
          blocked: true,
          notes: notesArray[i],
          worker_id: allWorkers.worker[0].id
        })
        planArray.push(
          {
            property_id: propertyid,
            callout_by: row.id,
            email: row.email,
            date_on_calendar,
            time_on_calendar,
            end_time_on_calendar,
            end_date_on_calendar,
            blocked: true
          }
        )
        await addPlan({
          variables: {
            property_id: propertyid,
            callout_by: row.id,
            email: row.email,
            date_on_calendar,
            time_on_calendar,
            end_time_on_calendar,
            end_date_on_calendar,
            blocked: true,
            notes: notesArray[i],
            worker_id: allWorkers.worker[0].id
          }
        })
        month += 3
        day = "01"
      }
      toast.success(
        <ToastComponent title="Plan Added" color="success" icon={<Check />} />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false
        }
      )
      if (!queryLoading || !addPlanLoading) {
        await updateClientPlan({
          variables: {
            id: row.id,
            hasPlan: true
          }
        })
        const res = await axios.post(
          `${DOMAIN}/sendPlanEmail`,
          {
            planArray,
            email: row.email,
            name: row.full_name
          }
        )
        console.log(res.data.message)
      }

      const currentDate = new Date().toLocaleDateString().split("/") // "7/11/2021"
      year = parseInt(currentDate[2])
      month = parseInt(currentDate[0])
      day = parseInt(currentDate[1])
      for (let i = 0; i < 4; i++) {
        if (month >= 13) {
          month = 1
          year++
        }
        const date = new Date(`${month}/${day}/${year}`)
          .toDateString()
          .split(" ")
        let dateString = ""
        if (i > 0) {
          dateString = `${date[1]} 01, ${date[3]}`
        } else {
          dateString = `${date[1]} ${date[2]}, ${date[3]}`
        }
        /*eslint-disable*/
        console.log({
          Subject: `Task Client ${date[1]}`,
          Description: `Task Client ${date[1]}`,
          Status: `Open`,
          Due_Date: `${dateString}`,
          email: `${row.email}`,
        });

        const res = await axios.post(
          `${DOMAIN}/quarterlyTasks`,
          {
            Subject: `Task Client ${date[1]}`,
            Description: `Task Client ${date[1]}`,
            Status: `Open`,
            Due_Date: `${dateString}`,
            email: `${row.email}`,
          }
        );
        if (res.data.message === "No email found") {
          setNoEmailError(true)
          break;
        }
        month += 3;
      }
      refetchClient()
      clearRecord()
      setQueryLoading(false)
      setLoaderButton(false)
    } catch (e) {
      console.log(e)
      setQueryLoading(false)
      setLoaderButton(false)
    }
  };
  if (noEmailError) {
    toast.error(
      <ToastComponent title="Error! Client email does not exist on ZOHO. Consider adding client email to zoho api" color="danger" icon={<XCircle />} />,
      {
        autoClose: 50000,
        hideProgressBar: true,
        closeButton: true
      }
    )
    setNoEmailError(false)
  }
     
  const handleDeletePlan = async (row) => {
    setQueryLoading(true)
    setTimeout(() => {
      setLoaderButton(true)
      if (!queryLoading) {
        setLoaderButton(false)
      }
    }, 10000)
    console.log({
      email: row.email,
      callout_id: row.id,
    });
    await deletePlan({
      variables: {
        email: row.email,
        callout_id: row.id,
      },
    });
    if (!deletePlanLoading) {
      console.log("delete");
      try {
        await updateClientPlan({
          variables: {
            id: row.id,
            hasPlan: false,
          },
        });
        toast.error(
          <ToastComponent title="Plan Removed" color="danger" icon={<Trash />} />,
          {
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false,
          }
        );
        refetchClient()
        clearRecord()
        setQueryLoading(false)
        setLoaderButton(false)
      } catch (e) {
        console.log(e)
        toast.error(
          <ToastComponent title="Error" color="danger" icon={<XCircle />} />,
          {
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false,
          }
        );
      }
    }
  };

  // ** Function to handle Pagination
  const handlePagination = (page) => setCurrentPage(page.selected);

  // ** Table Columns
  const advSearchColumns = [
    {
      name: "Id",
      selector: "id",
      sortable: true,
      minWidth: "5px",
    },
    {
      name: "Full Name",
      selector: "full_name",
      sortable: true,
      minWidth: "200px",
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
      minWidth: "230px",
    },
    /*{
      name: "Password",
      minWidth: "150px",
      cell: (row) => {
        const [eye, setEye] = useState(true);
        if (row?.password && row?.password !== "null") {
          return (
            <div className="d-flex w-100 justify-content-between">
              {eye ? (
                <span>{row?.password.split("").map((value) => "*")}</span>
              ) : (
                <span>{row.password}</span>
              )}
              {eye ? (
                <Eye
                  size={15}
                  onClick={() => {
                    setEye(!eye);
                  }}
                />
              ) : (
                <EyeOff
                  size={15}
                  onClick={() => {
                    setEye(!eye);
                  }}
                />
              )}
            </div>
          );
        } else {
          return (
            <div className="d-flex w-100 justify-content-between">
              No password
            </div>
          );
        }
      },
    },*/
    {
      name: "Phone",
      selector: "phone",
      sortable: true,
      minWidth: "150px",
    },
    {
      name: "Account Type",
      selector: "account_type",
      sortable: true,
      minWidth: "160px",
      cell: (row) => {
        const [eye, setEye] = useState(true);
        if (row?.account_type && row?.account_type !== "null") {
          return <div>{row?.account_type}</div>;
        } else {
          return <div>Null</div>;
        }
      },
    },
    {
      name: "Active/Inactive",
      selector: "active",
      sortable: true,
      minWidth: "150px",
      cell: row => {
        return (
          <Badge color={row?.active == 1 ? 'light-success' : 'light-danger'} pill>
            {row?.active == 1 ? "Active" : "Inactive"}
          </Badge>
        )
      }
    },
    {
      name: "Actions",
      minWidth: "200px",
      allowOverflow: true,
      cell: (row) => {
        return (
          <div className="d-flex w-100 align-items-center">
            <ButtonGroup size="sm">
              {/* <Button color='danger' className="btn-icon" size="sm" onClick={() => { openModalAlert(row.id) }}>
                  <Trash size={15} />
                  </Button> */}
              <Button color="primary" className="btn-icon" size="sm">
                <Edit size={15} onClick={() => handleModal(row)} />
              </Button>
              {!row.hasPlan ? (
                <Button
                  color="secondary"
                  outline
                  className="btn"
                  size="sm"
                  onClick={() => {
                    handleAddPlan(row);
                  }}
                >
                  <Edit3 size={15} />
                  <span className="align-middle ml-25">Upload Plan</span>
                </Button>
              ) : (
                <Button
                  color="danger"
                  outline
                  className="btn"
                  size="sm"
                  onClick={() => {
                    handleDeletePlan(row);
                  }}
                >
                  <span className="align-middle ml-25">Delete Plan</span>
                </Button>
              )}
            </ButtonGroup>
          </div>
        );
      },
    },
  ];

  const clearRecord = () => {
    setSearchName("")
    setSearchEmail("")
    setSearchOccupation("")
    setSearchOrganization("")
    setSearchPhone("")
    setSearchGender("")
  }

  // ** Table data to render
  const dataToRender = () => {
    if (
      searchName.length ||
      searchOccupation.length ||
      searchEmail.length ||
      searchPhone.length ||
      searchGender.length ||
      searchOrganization.length
    ) {
      return filteredData;
    } else {
      return data?.client;
    }
  };

  const handleUpdate = async (updatedRow, newPassword, oldPassword) => {
    // auth.requestPasswordChange(updatedRow.email)
    if (newPassword) {
      console.log(oldPassword, newPassword)
      return;
      try {
        const res = await auth.changePassword(oldPassword, newPassword)
      } catch (error) {
        console.log(error)
        toast.error(
          <ToastComponent
            title="Error Changing Password"
            color="danger"
            icon={<XCircle />}
          />,
          {
            autoClose: 2000,
            hideProgressBar: true,
            closeButton: false,
          }
        );
        updatedRow.password = oldPassword
      }
    }
    updateClient({
      variables: {
        id: updatedRow.id,
        email: updatedRow.email,
        full_name: updatedRow.full_name,
        phone: updatedRow.phone,
        active: updatedRow.active,
        sec_email: updatedRow.sec_email,
        sec_phone: updatedRow.sec_phone,
        account_type: updatedRow.account_type,
        referred_by: updatedRow.referred_by,
        contract_start_date: updatedRow.contract_start_date,
        contract_end_date: updatedRow.contract_end_date,
        sign_up_time: updatedRow.sign_up_time,
      },
    }).then(() => {
      toast.success(
        <ToastComponent
          title="Client Updated"
          color="success"
          icon={<Check />}
        />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
        }
      );
      refetchClient()
    }).catch(err => {
      console.log(err)
      toast.error(
        <ToastComponent
          title="Error"
          color="danger"
          icon={<XCircle />}
        />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
        }
      );
    });
    dataToRender();
    if (!clientLoading) {
      setModal(!modal);
    }
  };

  const addClientRecord = () => {
    setToAddNewRecord(true);
    setRow({ active: 1 });
    setTimeout(() => {
      setModal(!modal);
    }, 200);
  };

  const updateActive = async (active, row) => {
    try {
      await updateClientActive({
        variables: {
          email: row?.email,
          active
        }
      })
    } catch (e) {
      console.log(e)
      toast.error(
        <ToastComponent
          title="No admin rights"
          color="danger"
          icon={<XCircle />}
        />,
        {
          autoClose: 2000,
          hideProgressBar: true,
          closeButton: false,
        }
      );
    }
  }
  const handleAddRecord = async (newRow, redirect = false) => {
    console.log(redirect)
    setQueryLoading(true)
    setTimeout(() => {
      setLoaderButton(true)
      if (!queryLoading) {
        setLoaderButton(false)
      }
    }, 10000)
    try {
      await addClient({
        variables: {
          email: newRow?.email.toLowerCase(),
          full_name: newRow?.full_name,
          phone: newRow?.phone,
          active: newRow?.active,
          sec_email: newRow?.sec_email?.toLowerCase(),
          sec_phone: newRow?.sec_phone,
          account_type: newRow?.account_type,
          referred_by: newRow?.referred_by,
          contract_start_date: newRow?.contract_start_date,
          contract_end_date: newRow?.contract_end_date
        },
      })
      console.log("client added")
      await auth.register({
        email: newRow.email,
        password: "0000", // newRow.password,
        options: { userData: { display_name: newRow.full_name } },
      });
      console.log("client registerd")
      toast.success(<SuccessToast data={newRow} />, { hideProgressBar: true })

      const url = `${DOMAIN}/sendWelcomeEmail`;
      const data = new URLSearchParams()
      data.set('clientName', newRow.full_name)
      data.set('clientEmail', newRow.email)
      data.set('clientPassword', '0000')

      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: data.toString()
      });
      console.log("email sent")
      setRow(null)
      if (redirect) {
        console.log("pushing")
        history.push({ pathname: '/property', state: { active: "4" } })
      }
      setQueryLoading(false)
      setLoaderButton(false)
    } catch (e) {
      console.log(e.message)
      if (e.message.substr(0, 20) === "Uniqueness violation") {
        return toast.error(
          <ToastComponent title="Client already exists with same email" color="danger" icon={<XCircle />} />,
          {
            autoClose: 6000,
            hideProgressBar: true,
            closeButton: false
          }
        )
      }
      setQueryLoading(false)
      setLoaderButton(false)
    }
    dataToRender();
    if (!addClientLoading) {
      setModal(!modal);
    }
  };

  const handleDeleteRecord = (id) => {
    deleteClient({
      variables: {
        id,
      },
    });
    dataToRender();
    if (!deleteClientLoading) {
      toggleModal();
    }
  };

  // ** Custom Pagination
  const CustomPagination = () => (
    <ReactPaginate
      previousLabel={""}
      nextLabel={""}
      forcePage={currentPage}
      onPageChange={(page) => handlePagination(page)}
      pageCount={dataToRender().length / 7 || 1}
      breakLabel={"..."}
      pageRangeDisplayed={2}
      marginPagesDisplayed={2}
      activeClassName={"active"}
      pageClassName={"page-item"}
      nextLinkClassName={"page-link"}
      nextClassName={"page-item next"}
      previousClassName={"page-item prev"}
      previousLinkClassName={"page-link"}
      pageLinkClassName={"page-link"}
      breakClassName="page-item"
      breakLinkClassName="page-link"
      containerClassName={
        "pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
      }
    />
  );

  // ** Function to handle name filter
  const handleNameFilter = (e) => {
    const value = e.target.value;
    let updatedData = [];
    const dataToFilter = () => {
      if (
        searchEmail.length ||
        searchOccupation.length ||
        searchOrganization.length ||
        searchPhone.length ||
        searchGender.length
      ) {
        return filteredData;
      } else {
        return data?.client;
      }
    };

    setSearchName(value);
    if (value.length) {
      updatedData = dataToFilter().filter((item) => {
        const startsWith = item.full_name
          ?.toLowerCase()
          .startsWith(value.toLowerCase());

        const includes = item.full_name
          ?.toLowerCase()
          .includes(value.toLowerCase());

        if (startsWith) {
          return startsWith;
        } else if (!startsWith && includes) {
          return includes;
        } else return null;
      });
      setFilteredData([...updatedData]);
      setSearchName(value);
    }
  };

  // ** Function to handle email filter
  const handleEmailFilter = (e) => {
    const value = e.target.value;
    let updatedData = [];
    const dataToFilter = () => {
      if (
        searchName.length ||
        searchOccupation.length ||
        searchOrganization.length ||
        searchPhone.length ||
        searchGender.length
      ) {
        return filteredData;
      } else {
        return data?.client;
      }
    };

    setSearchEmail(value);
    if (value.length) {
      updatedData = dataToFilter().filter((item) => {
        const startsWith = item.email
          ?.toLowerCase()
          .startsWith(value.toLowerCase());

        const includes = item.email
          ?.toLowerCase()
          .includes(value.toLowerCase());

        if (startsWith) {
          return startsWith;
        } else if (!startsWith && includes) {
          return includes;
        } else return null;
      });
      setFilteredData([...updatedData]);
      setSearchEmail(value);
    }
  };

  // ** Function to handle Occupation filter
  const handleOccupationFilter = (e) => {
    const value = e.target.value;
    let updatedData = [];
    const dataToFilter = () => {
      if (
        searchEmail.length ||
        searchName.length ||
        searchOrganization.length ||
        searchPhone.length ||
        searchGender.length
      ) {
        return filteredData;
      } else {
        return data?.client;
      }
    };

    setSearchOccupation(value);
    if (value.length) {
      updatedData = dataToFilter().filter((item) => {
        const startsWith = item.occupation
          ?.toLowerCase()
          .startsWith(value.toLowerCase());

        const includes = item.occupation
          ?.toLowerCase()
          .includes(value.toLowerCase());

        if (startsWith) {
          return startsWith;
        } else if (!startsWith && includes) {
          return includes;
        } else return null;
      });
      setFilteredData([...updatedData]);
      setSearchOccupation(value);
    }
  };

  // ** Function to handle organization filter
  const handleOrganizationFilter = (e) => {
    const value = e.target.value;
    let updatedData = [];
    const dataToFilter = () => {
      if (
        searchEmail.length ||
        searchName.length ||
        searchOccupation.length ||
        searchPhone.length ||
        searchGender.length
      ) {
        return filteredData;
      } else {
        return data?.client;
      }
    };

    setSearchOrganization(value);
    if (value.length) {
      updatedData = dataToFilter().filter((item) => {
        const startsWith = item?.organization
          ?.toLowerCase()
          .startsWith(value.toLowerCase());

        const includes = item?.organization
          ?.toLowerCase()
          .includes(value.toLowerCase());

        if (startsWith) {
          return startsWith;
        } else if (!startsWith && includes) {
          return includes;
        } else return null;
      });
      setFilteredData([...updatedData]);
      setSearchOrganization(value);
    }
  };

  // ** Function to handle phone filter
  const handlePhoneFilter = (e) => {
    const value = e.target.value;
    let updatedData = [];
    const dataToFilter = () => {
      if (
        searchEmail.length ||
        searchName.length ||
        searchOccupation.length ||
        searchOrganization.length ||
        searchGender.length
      ) {
        return filteredData;
      } else {
        return data?.client;
      }
    };

    setSearchPhone(value);
    if (value.length) {
      updatedData = dataToFilter().filter((item) => {
        const startsWith = item.phone
          ?.toLowerCase()
          .startsWith(value.toLowerCase());

        const includes = item.phone
          ?.toLowerCase()
          .includes(value.toLowerCase());

        if (startsWith) {
          return startsWith;
        } else if (!startsWith && includes) {
          return includes;
        } else return null;
      });
      setFilteredData([...updatedData]);
      setSearchPhone(value);
    }
  };

  // ** Function to handle gender filter
  const handleGenderFilter = (e) => {
    const value = e.target.value;
    let updatedData = [];
    const dataToFilter = () => {
      if (
        searchEmail.length ||
        searchName.length ||
        searchOccupation.length ||
        searchOrganization.length ||
        searchPhone.length
      ) {
        return filteredData;
      } else {
        return data?.client;
      }
    };

    setSearchGender(value);
    if (value.length) {
      updatedData = dataToFilter().filter((item) => {
        const startsWith = item.gender
          ?.toLowerCase()
          .startsWith(value.toLowerCase());

        const includes = item.gender
          ?.toLowerCase()
          .includes(value.toLowerCase());

        if (startsWith) {
          return startsWith;
        } else if (!startsWith && includes) {
          return includes;
        } else return null;
      });
      setFilteredData([...updatedData]);
      setSearchGender(value);
    }
  };

  return (
    <Fragment>
      {queryLoading && <Overlay setLoaderButton={setLoaderButton} loaderButton={loaderButton} setLoading={setQueryLoading} />}
      <Card>
        <CardHeader className="border-bottom">
          <CardTitle tag="h4">Advance Search</CardTitle>
          <div className="d-flex mt-md-0 mt-1">
            {(searchName || searchEmail || searchOrganization || searchOccupation || searchPhone || searchGender) && <Button className='ml-2' color='danger' outline onClick={() => clearRecord()}>
              <XCircle size={15} />
              <span className='align-middle ml-50'>Clear filter</span>
            </Button>}
            <Button className="ml-2" color="primary" onClick={addClientRecord}>
              <Plus size={15} />
              <span className="align-middle ml-50">Add Record</span>
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          <Row form className="mt-1 mb-50">
            <Col lg="4" md="6">
              <FormGroup>
                <Label for="name">Name:</Label>
                <Input
                  id="name"
                  placeholder="Search Client Name"
                  value={searchName}
                  onChange={handleNameFilter}
                />
              </FormGroup>
            </Col>
            <Col lg="4" md="6">
              <FormGroup>
                <Label for="email">Email:</Label>
                <Input
                  type="email"
                  id="email"
                  placeholder="Search Client Email"
                  value={searchEmail}
                  onChange={handleEmailFilter}
                />
              </FormGroup>
            </Col>
            <Col lg="4" md="6">
              <FormGroup>
                <Label for="occupation">Occupation:</Label>
                <Input
                  id="occupation"
                  placeholder="Search Client Occupation"
                  value={searchOccupation}
                  onChange={handleOccupationFilter}
                />
              </FormGroup>
            </Col>
            <Col lg="4" md="6">
              <FormGroup>
                <Label for="organization">Organization:</Label>
                <Input
                  id="organization"
                  placeholder="Search Client Organization"
                  value={searchOrganization}
                  onChange={handleOrganizationFilter}
                />
              </FormGroup>
            </Col>
            <Col lg="4" md="6">
              <FormGroup>
                <Label for="phone">Phone:</Label>
                <Input
                  id="phone"
                  placeholder="Search Client Phone"
                  value={searchPhone}
                  onChange={handlePhoneFilter}
                />
              </FormGroup>
            </Col>
            <Col lg="4" md="6">
              <FormGroup>
                <Label for="gender">Gender:</Label>
                <Input
                  id="gender"
                  placeholder="Search Client Gender"
                  value={searchGender}
                  onChange={handleGenderFilter}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
        {!loading ? (
          <DataTable
            noHeader
            pagination
            // selectableRows
            columns={advSearchColumns}
            paginationPerPage={7}
            className="react-dataTable"
            sortIcon={<ChevronDown size={10} />}
            paginationDefaultPage={currentPage + 1}
            paginationComponent={CustomPagination}
            data={dataToRender()}
            onRowClicked={(row) => openDetailsModal(row)}
            highlightOnHover={true}
            pointerOnHover={true}
          // selectableRowsComponent={BootstrapCheckbox}
          />
        ) : (
          <h4 className="d-flex text-center align-items-center justify-content-center mb-5">
            Loading Client information
          </h4>
        )}
      </Card>
      <AddNewModal
        open={modal}
        handleModal={handleModal}
        handleAddRecord={handleAddRecord}
        toAddNewRecord={toAddNewRecord}
        closeModal={closeModal}
        row={row}
        setRow={setRow}
        handleUpdate={handleUpdate}
        updateActive={updateActive}
      />
      <div className="theme-modal-danger">
        <Modal
          isOpen={modalAlert}
          toggle={toggleModal}
          className="modal-dialog-centered"
          modalClassName="modal-danger"
        >
          <ModalHeader toggle={toggleModal}>Delete Record</ModalHeader>
          <ModalBody>Are you sure you want to delete?</ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              onClick={() => {
                handleDeleteRecord(rowId);
              }}
            >
              Delete
            </Button>
            <Button color="secondary" onClick={toggleModal} outline>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
      <div className="vertically-centered-modal">
        <Modal
          isOpen={detailsModal}
          toggle={() => setDetailsModal(!detailsModal)}
          className="modal-dialog-centered modal-xl modal-primary"
        >
          <ModalHeader className="d-flex justify-content-center" toggle={() => setDetailsModal(!detailsModal)}>
            Client Details
          </ModalHeader>
          <ModalBody>
            <TabsVerticalLeft item={modalDetails} />
          </ModalBody>
        </Modal>
      </div>
    </Fragment>
  );
};

export default DataTableAdvSearch;
