import React, { useState, useEffect, useRef } from 'react'
import './../../assets/css/react-paginate.css'
import Swal from 'sweetalert2'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CSpinner,
} from '@coreui/react'
import MaterialReactTable from 'material-react-table'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { useFormik } from 'formik'
import { ToastContainer, toast } from 'react-toastify'
import { Box, IconButton, Tooltip } from '@mui/material'
import { DeleteOutline, EditSharp } from '@mui/icons-material'
import {
  DefaultLoading,
  RequiredFieldNote,
  api,
  handleError,
  requiredField,
  toSentenceCase,
  validationPrompt,
} from 'src/components/SystemConfiguration'
import Select from 'react-select'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const ExternalDocument = ({ cardTitle }) => {
  const selectExternalDocumentIputRef = useRef()
  const selectInternalDocumentIputRef = useRef()
  const [data, setData] = useState([])
  const [externalDocument, setExternalDocument] = useState([])
  const [internalDocument, setInternalDocument] = useState([])
  const [validated, setValidated] = useState(true)
  const [fetchDataLoading, setFetchDataLoading] = useState(true)
  const [operationLoading, setOperationLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [isEnableEdit, setIsEnableEdit] = useState(false)
  const [editId, setEditId] = useState('')
  const [user, setUser] = useState([])
  const navigate = useNavigate()
  const [fetchInternalLoading, setFetchInternalLoading] = useState(true)
  const [fetchExternalLoading, setFetchExternalLoading] = useState(true)
  const [selectRequired, setSelectRequired] = useState('')

  useEffect(() => {
    const isTokenExist = localStorage.getItem('documentDisseminationToken') !== null

    if (!isTokenExist) {
      // If the token is set, navigate to the login
      navigate('/login', { replace: true })
    } else {
      setUser(jwtDecode(localStorage.getItem('documentDisseminationToken')))
    }

    fetchData()
    fetchExternalReceivedDocument()
    fetchInternalReceivedDocument()
  }, [])

  const fetchData = () => {
    api
      .get('internal_dissemination')
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchDataLoading(false)
      })
  }

  const fetchExternalReceivedDocument = () => {
    api
      .get('external_document')
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.ID
          const label = `${item.LogNo}-${item.LetterSubject}`
          return { value, label }
        })

        setExternalDocument(formattedData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchExternalLoading(false)
      })
  }

  const fetchInternalReceivedDocument = () => {
    api
      .get('internal_document')
      .then((response) => {
        const formattedData = response.data.map((item) => {
          const value = item.ID
          const label = `${item.LogNo}-${item.DocuSubject}`
          return { value, label }
        })

        setInternalDocument(formattedData)
      })
      .catch((error) => {
        toast.error(handleError(error))
      })
      .finally(() => {
        setFetchInternalLoading(false)
      })
  }
  const formik = useFormik({
    initialValues: {
      internal_document: '',
      endorsed_to: '',
      note: '',
      messenger_name: '',
      external_document: '',
    },
    onSubmit: async (values) => {
      const nonOptionalFields = ['endorsed_to', 'note', 'messenger_name', 'external_document']

      const allNonOptionalFieldsNotEmpty = Object.keys(values).every((key) => {
        // Check if the field is non-optional and not empty
        return nonOptionalFields.includes(key) || !!values[key]
      })
      if (allNonOptionalFieldsNotEmpty) {
        setOperationLoading(true)
        values.encoded_by = user.id
        !isEnableEdit
          ? // add new data
            await api
              .post('internal_dissemination/insert', values)
              .then((response) => {
                toast.success(response.data.message)
                fetchData()
                formik.resetForm()
                setValidated(false)
              })
              .catch((error) => {
                toast.error(handleError(error))
              })
              .finally(() => {
                setOperationLoading(false)
              })
          : // update data
            await api
              .put('internal_dissemination/update/' + editId, values)
              .then((response) => {
                toast.success(response.data.message)
                fetchData()
                setValidated(false)
                setModalVisible(false)
              })
              .catch((error) => {
                toast.error(handleError(error))
              })
              .finally(() => {
                setOperationLoading(false)
              })

        selectExternalDocumentIputRef.current.clearValue()
        selectInternalDocumentIputRef.current.clearValue()
        setSelectRequired('')
      } else {
        setSelectRequired('Internal Document is required')
        setValidated(true)
      }
    },
  })

  const handleInputChange = (e) => {
    const { name, value, type } = e.target
    if (type === 'text') {
      formik.setFieldValue(name, toSentenceCase(value))
    } else {
      formik.setFieldValue(name, value)
    }
  }
  const column = [
    {
      accessorKey: 'internal_log_number',
      header: 'Log #',
    },
    {
      accessorKey: 'letter_subject',
      header: 'Subject',
      // size: 500,
    },
    {
      accessorKey: 'date_received',
      header: 'Date Received',
      accessorFn: (row) => {
        if (row.date_received) {
          const originalDate = new Date(row.date_received + ' ' + row.time_received)
          const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
          }

          return originalDate.toLocaleString('en-US', options)
        }
      },
    },
    {
      accessorKey: 'endorsed_to',
      header: 'Endorsed To',
    },
    {
      accessorKey: 'note',
      header: 'Note',
    },
    {
      accessorKey: 'external_log_number',
      header: 'External Log #',
    },
    {
      accessorKey: 'messenger_name',
      header: 'Messenger Name',
    },
    {
      accessorKey: 'encoded_by',
      header: 'Encoded By',
    },
  ]

  const handleSelectInternalDocument = (selectedOption) => {
    setSelectRequired('')
    formik.setFieldValue('internal_document', selectedOption ? selectedOption.value : '')
  }
  const handleSelectExternalDocument = (selectedOption) => {
    formik.setFieldValue('external_document', selectedOption ? selectedOption.value : '')
  }
  return (
    <>
      <ToastContainer />
      <CCard className="mb-4">
        <CCardHeader>
          {cardTitle}
          <div className="float-end">
            <CButton
              size="sm"
              color="primary"
              onClick={() => {
                formik.resetForm()
                setIsEnableEdit(false)
                setValidated(false)
                setModalVisible(!modalVisible)
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Document
            </CButton>
          </div>
        </CCardHeader>
        <CCardBody>
          <MaterialReactTable
            columns={column}
            data={data}
            state={{
              isLoading: fetchDataLoading,
              isSaving: fetchDataLoading,
              showLoadingOverlay: fetchDataLoading,
              showProgressBars: fetchDataLoading,
              showSkeletons: fetchDataLoading,
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
            enableSelectAll={true}
            columnFilterDisplayMode="popover"
            paginationDisplayMode="pages"
            positionToolbarAlertBanner="bottom"
            enableStickyHeader
            enableStickyFooter
            enableRowActions
            initialState={{
              density: 'compact',
              columnPinning: { left: ['mrt-row-actions', 'internal_log_number'] },
            }}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: 'flex', flexWrap: 'nowrap', gap: '8px' }}>
                <Tooltip title="Edit">
                  <IconButton
                    color="warning"
                    onClick={() => {
                      setEditId(row.original.id)
                      formik.setValues({
                        external_document: row.original.external_document,
                        endorsed_to: row.original.endorsed_to,
                        note: row.original.note,
                        messenger_name: row.original.messenger_name,
                        internal_document: row.original.internal_document,
                      })
                      setIsEnableEdit(true)
                      setModalVisible(true)
                    }}
                  >
                    <EditSharp />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => {
                      Swal.fire({
                        title: 'Are you sure?',
                        text: "You won't be able to revert this!",
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Yes, delete it!',
                      }).then(async (result) => {
                        if (result.isConfirmed) {
                          validationPrompt(() => {
                            let id = row.original.id
                            setFetchDataLoading(true)

                            api
                              .delete('internal_dissemination/delete/' + id)
                              .then((response) => {
                                fetchData()
                                toast.success(response.data.message)
                              })
                              .catch((error) => {
                                toast.error(handleError(error))
                              })
                              .finally(() => {
                                setFetchDataLoading(false)
                              })
                          })
                        }
                      })
                    }}
                  >
                    <DeleteOutline />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
          />

          {fetchDataLoading && <DefaultLoading />}
        </CCardBody>
      </CCard>

      <CModal
        alignment="center"
        backdrop="static"
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle> {isEnableEdit ? `Edit Document` : `Add New Document`}</CModalTitle>
        </CModalHeader>
        <CForm
          id="form"
          className="row g-3 needs-validation"
          noValidate
          validated={validated}
          onSubmit={formik.handleSubmit}
        >
          <CModalBody>
            <RequiredFieldNote />

            <CRow className="my-2">
              <CCol className="my-1" md={12}>
                <CFormLabel>
                  {
                    <>
                      {fetchInternalLoading && <CSpinner size="sm" />}
                      {' Internal Document'}
                    </>
                  }
                </CFormLabel>
                <Select
                  ref={selectInternalDocumentIputRef}
                  value={internalDocument.find(
                    (option) => option.value === formik.values.internal_document,
                  )}
                  onChange={handleSelectInternalDocument}
                  options={internalDocument}
                  name="internal_document"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                  required
                />
                {selectRequired && (
                  <span style={{ color: 'red', fontSize: 12 }}>{selectRequired}</span>
                )}
              </CCol>
              <CCol className="my-1" md={12}>
                <CFormTextarea
                  placeholder="Endorsed to ..."
                  label="Endorsed To"
                  name="endorsed_to"
                  onChange={handleInputChange}
                  style={{ height: '100px' }}
                  value={formik.values.endorsed_to}
                ></CFormTextarea>
              </CCol>
              <CCol className="my-1" md={12}>
                <CFormSelect
                  label="Note"
                  name="note"
                  onChange={handleInputChange}
                  value={formik.values.note}
                >
                  <option value="">Select</option>
                  <option value="Dissemination Completed">Dissemination Completed</option>
                </CFormSelect>
              </CCol>
              <CCol className="my-1" md={12}>
                <CFormInput
                  type="text"
                  label="Messenger Name"
                  name="messenger_name"
                  onChange={handleInputChange}
                  value={formik.values.messenger_name}
                />
              </CCol>
              <CCol className="my-1" md={12}>
                <hr />

                <CFormLabel>
                  {
                    <>
                      {fetchExternalLoading && <CSpinner size="sm" />}
                      {' Attach Communication'}
                    </>
                  }
                </CFormLabel>
                <Select
                  ref={selectExternalDocumentIputRef}
                  value={externalDocument.find(
                    (option) => option.value === formik.values.external_document,
                  )}
                  onChange={handleSelectExternalDocument}
                  options={externalDocument}
                  name="external_document"
                  isSearchable
                  placeholder="Search..."
                  isClearable
                />
              </CCol>
            </CRow>
          </CModalBody>

          {operationLoading && <DefaultLoading />}

          <CModalFooter>
            <CButton color="secondary" onClick={() => setModalVisible(false)}>
              Close
            </CButton>
            <CButton color="primary" type="submit">
              {!isEnableEdit ? 'Save' : 'Update'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </>
  )
}

export default ExternalDocument
