import React, { useState, useEffect } from 'react'

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormSelect,
  CNav,
  CNavItem,
  CNavLink,
  CRow,
  CTabContent,
  CTabPane,
  CWidgetStatsF,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilChartLine } from '@coreui/icons'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCancel, faEye, faFilter } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { CChart } from '@coreui/react-chartjs'
import { jwtDecode } from 'jwt-decode'
import {
  SchoolYear,
  Semester,
  api,
  decrypted,
  DefaultLoading,
  WidgetLoading,
  handleError,
  requiredField,
  RequiredFieldNote,
} from 'src/components/SystemConfiguration'
import CountUp from 'react-countup'
import { useNavigate } from 'react-router-dom'

const Dashboard = ({ cardTitle }) => {
  const [loadingTotal, setLoadingTotal] = useState(true)
  const [loading, setLoading] = useState(false)
  const [loadingChart, setLoadingChart] = useState(false)
  const [totalStatusData, setTotalStatusData] = useState([])
  const [totalData, setTotalData] = useState([])
  const [validated, setValidated] = useState(false)
  const [loadingOperation, setLoadingOperation] = useState(true)
  const [statusAddressChartData, setStatusAddressChartData] = useState([])
  const [activeKey, setActiveKey] = useState(1)
  const [user, setUser] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    fetchTotalStatus()
    fetchTotal()
    fetchStatusAddress()
    const isTokenExist = localStorage.getItem('documentDisseminationToken') !== null

    if (!isTokenExist) {
      // If the token is set, navigate to the login
      navigate('/login', { replace: true })
    } else {
      setUser(jwtDecode(localStorage.getItem('documentDisseminationToken')))
    }
  }, [])

  const fetchStatusAddress = () => {
    setLoadingChart(true)
    Promise.all([
      api.get('senior_high/get_status_by_barangay'),
      api.get('college/get_status_by_barangay'),
      api.get('tvet/get_status_by_barangay'),
    ])
      .then((responses) => {
        const response = responses.map((response) => response.data)
        const newData = {
          senior_high: decrypted(response[0]),
          college: decrypted(response[1]),
          tvet: decrypted(response[2]),
        }
        setStatusAddressChartData(newData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoadingChart(false)
        setLoadingOperation(false)
      })
  }

  const fetchTotalStatus = () => {
    setLoading(true)
    Promise.all([
      api.get('senior_high/total_status'),
      api.get('college/total_status'),
      api.get('tvet/total_status'),
    ])
      .then((responses) => {
        const newData = responses.map((response) => decrypted(response.data))
        setTotalStatusData(newData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
      })
  }

  const fetchTotal = () => {
    setLoadingTotal(true)
    Promise.all([api.get('senior_high/total'), api.get('college/total'), api.get('tvet/total')])
      .then((responses) => {
        const response = responses.map((response) => response.data)
        const newData = {
          senior_high: decrypted(response[0]),
          college: decrypted(response[1]),
          tvet: decrypted(response[2]),
        }
        setTotalData(newData)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
      .finally(() => {
        setLoadingTotal(false)
        setLoadingOperation(false)
      })
  }

  const handleRemoveFilter = () => {
    setLoading(true)
    setLoadingOperation(true)
    setLoadingChart(true)
    filterForm.resetForm()
    fetchTotal()
    fetchStatusAddress()
    fetchTotalStatus()
  }

  const handleViewAllData = () => {
    setLoadingTotal(true)
    setLoadingOperation(true)
    setLoadingChart(true)

    filterForm.resetForm()
    setValidated(false)

    // Widget
    Promise.all([
      api.get('senior_high/all_total_status'),
      api.get('college/all_total_status'),
      api.get('tvet/all_total_status'),
    ])
      .then((responses) => {
        const newData = responses.map((response) => decrypted(response.data))
        setTotalStatusData(newData)
      })
      .catch((error) => {
        console.error('Error fetching total status data:', error)
      })
      .finally(() => {
        setLoadingTotal(false)
        setLoadingOperation(false)
      })

    // Fetch total data
    Promise.all([
      api.get('senior_high/all_total'),
      api.get('college/all_total'),
      api.get('tvet/all_total'),
    ])
      .then((responses) => {
        const [responseSeniorHigh, responseCollege, responseTvet] = responses.map(
          (response) => response.data,
        )
        const newData = {
          senior_high: decrypted(responseSeniorHigh),
          college: decrypted(responseCollege),
          tvet: decrypted(responseTvet),
        }
        setTotalData(newData)
      })
      .catch((error) => {
        console.error('Error fetching total data:', error)
      })
      .finally(() => {
        setLoadingTotal(false)
        setLoadingOperation(false)
      })

    // chart status in every barangay
    Promise.all([
      api.get('senior_high/all_status_by_barangay'),
      api.get('college/all_status_by_barangay'),
      api.get('tvet/all_status_by_barangay'),
    ])
      .then((responses) => {
        const response = responses.map((response) => response.data)
        const newData = {
          senior_high: decrypted(response[0]),
          college: decrypted(response[1]),
          tvet: decrypted(response[2]),
        }
        setStatusAddressChartData(newData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setLoading(false)
        setLoadingOperation(false)
        setLoadingChart(false)
      })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    filterForm.setFieldValue(name, value)
  }

  const filterForm = useFormik({
    initialValues: {
      semester: '',
      school_year: '',
    },
    onSubmit: async (values) => {
      const areAllFieldsFilled = Object.keys(values).every((key) => !!values[key])

      if (areAllFieldsFilled) {
        setLoadingTotal(true)
        setLoadingOperation(true)
        setLoadingChart(true)
        // Fetch total status data
        Promise.all([
          api.post('senior_high/filter_total_status', values),
          api.post('college/filter_total_status', values),
          api.post('tvet/filter_total_status', values),
        ])
          .then((responses) => {
            const newData = responses.map((response) => decrypted(response.data))
            setTotalStatusData(newData)
          })
          .catch((error) => {
            console.error('Error fetching total status data:', error)
          })
          .finally(() => {
            setLoadingTotal(false)
            setLoadingOperation(false)
          })

        // Fetch total data
        Promise.all([
          api.post('senior_high/filter_total', values),
          api.post('college/filter_total', values),
          api.post('tvet/filter_total', values),
        ])
          .then((responses) => {
            const [responseSeniorHigh, responseCollege, responseTvet] = responses.map(
              (response) => response.data,
            )
            const newData = {
              senior_high: decrypted(responseSeniorHigh),
              college: decrypted(responseCollege),
              tvet: decrypted(responseTvet),
            }
            setTotalData(newData)
          })
          .catch((error) => {
            console.error('Error fetching total data:', error)
          })
          .finally(() => {
            setLoadingTotal(false)
            setLoadingOperation(false)
          })

        // chart status in every barangay
        Promise.all([
          api.post('senior_high/filter_status_by_barangay', values),
          api.post('college/filter_status_by_barangay', values),
          api.post('tvet/filter_status_by_barangay', values),
        ])
          .then((responses) => {
            const [responseSeniorHigh, responseCollege, responseTvet] = responses.map(
              (response) => response.data,
            )
            const newData = {
              senior_high: decrypted(responseSeniorHigh),
              college: decrypted(responseCollege),
              tvet: decrypted(responseTvet),
            }
            setStatusAddressChartData(newData)
          })
          .catch((error) => {
            console.error('Error fetching total data:', error)
          })
          .finally(() => {
            setLoadingTotal(false)
            setLoadingOperation(false)
            setLoadingChart(false)
          })
      } else {
        console.warn('Please fill in all required fields.')
        setValidated(true)
      }
    },
  })

  const column = [
    {
      accessorKey: 'type',
      header: 'Scholarship Type',
    },
    {
      accessorKey: 'approved',
      header: 'Approved',
    },
    {
      accessorKey: 'pending',
      header: 'Pending',
    },
    {
      accessorKey: 'disapproved',
      header: 'Dispproved',
    },
    {
      accessorKey: 'archived',
      header: 'Archived',
    },
    {
      accessorKey: 'void',
      header: 'Void',
    },
  ]
  return (
    <>
      <ToastContainer />
      <h5>Welcome {user.firstname},</h5>
      <CRow className="justify-content-center mt-2">
        <CCol md={12}>
          <CCard className="mb-4">
            <CCardHeader>{cardTitle}</CCardHeader>
            <CCardBody>
              <h5>
                <FontAwesomeIcon icon={faFilter} /> Filter
              </h5>
              <CForm
                id="filterForm"
                className="row g-3 needs-validation mb-4"
                noValidate
                validated={validated}
                onSubmit={filterForm.handleSubmit}
              >
                <RequiredFieldNote />

                <CRow className="my-1">
                  <CCol md={6}>
                    <CFormSelect
                      feedbackInvalid="Semester is required."
                      label={requiredField('Semester')}
                      name="semester"
                      onChange={handleInputChange}
                      value={filterForm.values.semester}
                      required
                    >
                      <option value="">Select</option>
                      {Semester.map((semester, index) => (
                        <option key={index} value={semester}>
                          {semester}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>

                  <CCol md={6}>
                    <CFormSelect
                      feedbackInvalid="School Year is required."
                      label={requiredField('School Year')}
                      name="school_year"
                      onChange={handleInputChange}
                      value={filterForm.values.school_year}
                      required
                    >
                      <option value="">Select</option>
                      {SchoolYear.map((school_year, index) => (
                        <option key={index} value={school_year}>
                          {school_year}
                        </option>
                      ))}
                    </CFormSelect>
                  </CCol>
                </CRow>

                <CRow className="justify-content-between mt-1">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <CButton
                      color="danger"
                      size="sm"
                      variant="outline"
                      onClick={handleRemoveFilter}
                    >
                      <FontAwesomeIcon icon={faCancel} /> Remove Filter
                    </CButton>
                    <CButton
                      size="sm"
                      variant="outline"
                      color="primary"
                      onClick={handleViewAllData}
                    >
                      <FontAwesomeIcon icon={faEye} /> View All Data
                    </CButton>
                    <CButton color="primary" size="sm" type="submit">
                      <FontAwesomeIcon icon={faFilter} /> Filter
                    </CButton>
                  </div>
                </CRow>
              </CForm>

              {loadingOperation && <DefaultLoading />}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow>
        <CCol style={{ position: 'relative' }}>
          <CWidgetStatsF
            className="mb-3  "
            variant="outline"
            color="primary"
            icon={<CIcon icon={cilChartLine} height={24} />}
            title="Senior High"
            value=<CountUp end={totalData.senior_high} />
          />
          {loadingTotal && <WidgetLoading />}
        </CCol>
        <CCol style={{ position: 'relative' }}>
          <CWidgetStatsF
            className="mb-3"
            color="success"
            icon={<CIcon icon={cilChartLine} height={24} />}
            title="College"
            value=<CountUp end={totalData.college} />
          />
          {loadingTotal && <WidgetLoading />}
        </CCol>
        <CCol style={{ position: 'relative' }}>
          <CWidgetStatsF
            className="mb-3"
            color="danger"
            icon={<CIcon icon={cilChartLine} height={24} />}
            title="TVET"
            value=<CountUp end={totalData.tvet} />
          />
          {loadingTotal && <WidgetLoading />}
        </CCol>
      </CRow>
      <CRow>
        <CCol style={{ position: 'relative' }}>
          <MaterialReactTable
            columns={column}
            data={totalStatusData}
            enableRowVirtualization
            enableColumnVirtualization
            state={{
              isLoading: loading,
              isSaving: loading,
              showLoadingOverlay: loading,
              showProgressBars: loading,
              showSkeletons: loading,
            }}
            muiCircularProgressProps={{
              color: 'secondary',
              thickness: 5,
              size: 55,
            }}
            muiSkeletonProps={{
              animation: 'pulse',
              height: 28,
            }}
            enableColumnResizing
            enableFullScreenToggle={false}
            enableHiding={false}
            enableTopToolbar={false}
            enableBottomToolbar={false}
            enableDensityToggle={false}
            enableColumnActions={false}
            enableColumnFilters={false}
            enablePagination={false}
            enableSorting={false}
            enableGrouping={false}
            enableSelectAll={true}
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            selectAllMode="all"
            initialState={{ density: 'compact' }}
          />
          {loadingTotal && <DefaultLoading />}
        </CCol>
      </CRow>

      <CRow className="justify-content-center mt-4">
        <CCol md={12}>
          <CCard className="mb-4">
            <CCardBody>
              <p className="text-medium-emphasis small">
                A chart that shows the application status for each address.
              </p>

              <CNav variant="pills" layout="justified">
                <CNavItem role="presentation">
                  <CNavLink
                    active={activeKey === 1}
                    component="button"
                    role="tab"
                    aria-controls="senior-high-tab-pane"
                    aria-selected={activeKey === 1}
                    onClick={() => {
                      setActiveKey(1)
                      toast.dismiss()
                    }}
                  >
                    Senior High
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation">
                  <CNavLink
                    active={activeKey === 2}
                    component="button"
                    role="tab"
                    aria-controls="college-tab-pane"
                    aria-selected={activeKey === 2}
                    onClick={() => {
                      setActiveKey(2)
                      toast.dismiss()
                    }}
                  >
                    College
                  </CNavLink>
                </CNavItem>
                <CNavItem role="presentation">
                  <CNavLink
                    active={activeKey === 3}
                    component="button"
                    role="tab"
                    aria-controls="tvet-tab-pane"
                    aria-selected={activeKey === 3}
                    onClick={() => {
                      setActiveKey(3)
                      toast.dismiss()
                    }}
                  >
                    Tvet
                  </CNavLink>
                </CNavItem>
              </CNav>
              <CTabContent>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="senior-high-tab-pane"
                  visible={activeKey === 1}
                  style={{ position: 'relative' }}
                >
                  <CChart
                    type="bar"
                    data={
                      statusAddressChartData.senior_high === undefined
                        ? []
                        : statusAddressChartData.senior_high
                    }
                  />
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="college-tab-pane"
                  visible={activeKey === 2}
                  style={{ position: 'relative' }}
                >
                  <CChart
                    type="bar"
                    data={
                      statusAddressChartData.college === undefined
                        ? []
                        : statusAddressChartData.college
                    }
                  />
                </CTabPane>
                <CTabPane
                  role="tabpanel"
                  aria-labelledby="tvet-tab-pane"
                  visible={activeKey === 3}
                  style={{ position: 'relative' }}
                >
                  <CChart
                    type="bar"
                    data={
                      statusAddressChartData.tvet === undefined ? [] : statusAddressChartData.tvet
                    }
                  />
                </CTabPane>
                {loadingChart && <DefaultLoading />}
              </CTabContent>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
