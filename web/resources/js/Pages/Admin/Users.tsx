import AdminPage from "../../Components/AdminPage";
import Loading from "../../Components/Loading";
import { useEffect, useState } from "react";
import { getApiBaseUrl, getClientBaseURL } from "../../Utils/helper";
import Modal from 'react-bootstrap/Modal'
import * as formik from 'formik';
import * as yup from 'yup';
import { Form, Button } from 'react-bootstrap'
import Col from 'react-bootstrap/Col';
import SweetAlert2, {SweetAlert2Props} from 'react-sweetalert2'

const Users = () => {
    interface ListUser {
        user_id: number,
        fullname: string,
        email: string,
        telpon: string,
        user_status: string
    }

    interface UserForm {
        user_id?: number,
        password?: string,
        fullname: string,
        email: string,
        telpon: string,
        role?: 'ADMIN'
    }

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [userIdDelete, setUserIdDelete] = useState<number>(0)
    const [fullnameDelete, setFullnameDelete] = useState<string>("")
    const [listUser, setListUser] = useState<ListUser[]>([] as ListUser[])

    const [showUserCreateModal, setShowUserCreateModal] = useState<boolean>(false)
    const [showUserUpdateModal, setShowUserUpdateModal] = useState<boolean>(false)
    const [showDeleteUpdateModal, setShowDeleteUpdateModal] = useState<boolean>(false)

    const { Formik } = formik;
    const schemaCreate = yup.object().shape({
        fullname: yup.string().required('Nama wajib diisi').max(200),
        email: yup.string().email('Email tidak valid').required('Email wajib diisi').max(200),
        telpon: yup.string().required('Nomor Telepon wajib diisi').max(13),
    })

    const schemaUpdate = yup.object().shape({
        fullname: yup.string().required('Nama wajib diisi').max(200),
        email: yup.string().email('Email tidak valid').required('Email wajib diisi').max(200),
        telpon: yup.string().required('Nomor Telepon wajib diisi').max(13),
        password: yup.string().required('Password wajib diisi').max(200),
    })

    const [swalProps, setSwalProps] = useState<SweetAlert2Props>({})

    const formikCreateInitialValues: UserForm = {
        fullname: "",
        email: "",
        telpon: "",
        role: 'ADMIN'
    }

    const [formikUpdateInitialValues, setFormikUpdateInitialValues] = useState<UserForm>({
        user_id: 0,
        fullname: "",
        email: "",
        telpon: "",
        password: "",
        role: 'ADMIN'
    })

    const actionGetListUser = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${getApiBaseUrl()}/user?take=1000&skip=1`, {
                method: "GET",
                credentials: 'include',
                mode: 'cors',
            })
            if(response.status == 200) {
                let result = await response.json()
                setListUser(prevState => ([
                    ...result['data']
                ]))
            }
        }
        catch(error) {
        }
        setIsLoading(false)
    }

    const actionUpdate = async (values: UserForm) => {
        setIsLoading(true)
        try {
            const newData = {...values}
            delete newData['user_id']
            delete newData['role']
            const response = await fetch(`${getApiBaseUrl()}/user/${values['user_id']}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(newData)
            })
            if(response.status == 200) {
                let result = await response.json()
                setShowUserCreateModal(false)
                setSwalProps({
                    show: true,
                    position: 'top-end',
                    timer: 2500,
                    title: result['message'],
                    showConfirmButton: false,
                    toast: true,
                    icon: "success",
                    didClose: () => {
                        setSwalProps({})
                    }
                })
            }
        }
        catch(error) {
            setSwalProps({
                show: true,
                position: 'top-end',
                timer: 2500,
                title: 'Error',
                showConfirmButton: false,
                toast: true,
                icon: "error",
                didClose: () => {
                    setSwalProps({})
                }
            })
        }
        setIsLoading(false)
    }

    const actionCreate = async (values: UserForm) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${getApiBaseUrl()}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(values)
            })
            if(response.status == 201) {
                let result = await response.json()
                setShowUserCreateModal(false)
                setSwalProps({
                    show: true,
                    position: 'top-end',
                    timer: 2500,
                    title: result['message'],
                    showConfirmButton: false,
                    toast: true,
                    icon: "success",
                    didClose: () => {
                        setSwalProps({})
                    }
                })
            }
        }
        catch(error) {
            setSwalProps({
                show: true,
                position: 'top-end',
                timer: 2500,
                title: 'Error',
                showConfirmButton: false,
                toast: true,
                icon: "error",
                didClose: () => {
                    setSwalProps({})
                }
            })
        }
        setIsLoading(false)
    }

    const actionDelete = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${getApiBaseUrl()}/user/${userIdDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors',
            })
            if(response.status == 200) {
                let result = await response.json()
                setShowDeleteUpdateModal(false)
                setSwalProps({
                    show: true,
                    position: 'top-end',
                    timer: 2500,
                    title: result['message'],
                    showConfirmButton: false,
                    toast: true,
                    icon: "success",
                    didClose: () => {
                        setSwalProps({})
                    }
                })
            }
        }
        catch(error) {
            setSwalProps({
                show: true,
                position: 'top-end',
                timer: 2500,
                title: 'Error',
                showConfirmButton: false,
                toast: true,
                icon: "error",
                didClose: () => {
                    setSwalProps({})
                }
            })
        }
        setIsLoading(false)
    }

    useEffect(() => {
        actionGetListUser()
    }, [])
    return (
        <AdminPage>
            <Loading isLoading={isLoading} />
            <SweetAlert2 {...swalProps} />
            {/* CREATE */}
            <Modal className="rounded-0" show={showUserCreateModal} fullscreen={"lg-down"} backdrop="static">
                {/* Header */}
                <div className="px-3 py-3 position-relative">
                    <h3 className="poppins-regular text-center">Tambah User</h3>
                    <Button variant="link" style={{
                        position: 'absolute',
                        top: '10px',
                        right: '5px'
                    }} onClick={() => {
                        setShowUserCreateModal(false)
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.75 5.25L5.25 18.75" stroke="#3E3E3E" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.75 18.75L5.25 5.25" stroke="#3E3E3E" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Button>
                </div>
                {/* Body */}
                <Modal.Body>
                    <div className="d-flex justify-content-center">
                    <Formik validationSchema={schemaCreate} initialValues={formikCreateInitialValues} onSubmit={actionCreate}>
                        {({ handleChange,
                                handleSubmit,
                                values,
                                touched,
                                errors }) => (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group as={Col} md="12" className="mb-2" controlId="fullname">
                                    <Form.Label><span className='poppins-extralight'>Nama</span></Form.Label>
                                    <Form.Control
                                        className='rounded-0 border-dark poppins-extralight'
                                        type="text"
                                        name="fullname"
                                        value={values.fullname}
                                        onChange={handleChange}
                                        isValid={touched.fullname && !errors.fullname}
                                        isInvalid={!!errors.fullname}
                                        maxLength={200}
                                        placeholder='Masukkan Nama User'
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.fullname}
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="12" className="mb-2" controlId="telpon">
                                    <Form.Label><span className='poppins-extralight'>Telpon</span></Form.Label>
                                    <Form.Control
                                        className='rounded-0 border-dark poppins-extralight'
                                        type="text"
                                        name="telpon"
                                        value={values.telpon}
                                        onChange={handleChange}
                                        isValid={touched.telpon && !errors.telpon}
                                        isInvalid={!!errors.telpon}
                                        maxLength={13}
                                        placeholder='Masukkan telpon'
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.telpon}
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="12" className="mb-2" controlId="email">
                                    <Form.Label><span className='poppins-extralight'>Email</span></Form.Label>
                                    <Form.Control
                                        className='rounded-0 border-dark poppins-extralight'
                                        type="text"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        isValid={touched.email && !errors.email}
                                        isInvalid={!!errors.email}
                                        maxLength={200}
                                        placeholder='Masukkan email'
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good</Form.Control.Feedback>
                                </Form.Group>
                                <div className="d-grid gap-2 mt-4">
                                    <Button type="submit" variant="primary" size="lg" className='rounded-0 bg-color-lightblue'>
                                        Masuk
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    </div>
                </Modal.Body>
            </Modal>
            {/* UPDATE */}
            <Modal className="rounded-0" show={showUserUpdateModal} fullscreen={"lg-down"} backdrop="static">
                {/* Header */}
                <div className="px-3 py-3 position-relative">
                    <h3 className="poppins-regular text-center">Ubah Data User</h3>
                    <Button variant="link" style={{
                        position: 'absolute',
                        top: '10px',
                        right: '5px'
                    }} onClick={() => {
                        setShowUserUpdateModal(false)
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.75 5.25L5.25 18.75" stroke="#3E3E3E" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M18.75 18.75L5.25 5.25" stroke="#3E3E3E" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Button>
                </div>
                {/* Body */}
                <Modal.Body>
                    <div className="d-flex justify-content-center">
                    <Formik validationSchema={schemaUpdate} initialValues={formikUpdateInitialValues} onSubmit={actionUpdate}>
                        {({ handleChange,
                                handleSubmit,
                                values,
                                touched,
                                errors }) => (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group as={Col} md="12" className="mb-2" controlId="fullname">
                                    <Form.Label><span className='poppins-extralight'>Nama</span></Form.Label>
                                    <Form.Control
                                        className='rounded-0 border-dark poppins-extralight'
                                        type="text"
                                        name="fullname"
                                        value={values.fullname}
                                        onChange={handleChange}
                                        isValid={touched.fullname && !errors.fullname}
                                        isInvalid={!!errors.fullname}
                                        maxLength={200}
                                        placeholder='Contoh: admin@gmail.com'
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.fullname}
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="12" className="mb-2" controlId="telpon">
                                    <Form.Label><span className='poppins-extralight'>Telpon</span></Form.Label>
                                    <Form.Control
                                        className='rounded-0 border-dark poppins-extralight'
                                        type="text"
                                        name="telpon"
                                        value={values.telpon}
                                        onChange={handleChange}
                                        isValid={touched.telpon && !errors.telpon}
                                        isInvalid={!!errors.telpon}
                                        maxLength={13}
                                        placeholder='Masukkan telpon'
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.telpon}
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="12" className="mb-2" controlId="email">
                                    <Form.Label><span className='poppins-extralight'>Email</span></Form.Label>
                                    <Form.Control
                                        className='rounded-0 border-dark poppins-extralight'
                                        type="text"
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        isValid={touched.email && !errors.email}
                                        isInvalid={!!errors.email}
                                        maxLength={200}
                                        placeholder='Masukkan email'
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="12" className="mb-2" controlId="password">
                                    <Form.Label><span className='poppins-extralight'>Password</span></Form.Label>
                                    <Form.Control
                                        className='rounded-0 border-dark poppins-extralight'
                                        type="password"
                                        name="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        isValid={touched.password && !errors.password}
                                        isInvalid={!!errors.password}
                                        maxLength={200}
                                        placeholder='Masukkan password'
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good</Form.Control.Feedback>
                                </Form.Group>
                                <div className="d-grid gap-2 mt-4">
                                    <Button type="submit" variant="primary" size="lg" className='rounded-0 bg-color-lightblue'>
                                        Masuk
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                    </div>
                </Modal.Body>
            </Modal>
            {/* DELETE */}
            <Modal className="rounded-0" show={showDeleteUpdateModal} backdrop="static">
                <div className="custom-modal-header">
                </div>
                <div className="d-flex justify-content-center">
                    <div className="custom-modal-icon">
                        <svg width="45" height="31" viewBox="0 0 45 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15.332 28.041H29.6654C36.5919 28.041 42.207 22.4259 42.207 15.4994C42.207 8.57278 36.5919 2.95769 29.6654 2.95769H15.332C8.40546 2.95769 2.79037 8.57278 2.79037 15.4994C2.79037 22.4259 8.40546 28.041 15.332 28.041Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M29.668 10.125C26.6994 10.125 24.293 12.5315 24.293 15.5C24.293 18.4685 26.6994 20.875 29.668 20.875C32.6365 20.875 35.043 18.4685 35.043 15.5C35.043 12.5315 32.6365 10.125 29.668 10.125Z" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
                <div className="mt-5">
                    <h4 className="poppins-bold text-center">Konfirmasi Hapus</h4>
                    <h6 className="poppins-regular text-secondary text-center">Apakah kamu yakin akan menghapus <span className="text-dark poppins-semi-bold">"{fullnameDelete}"</span>?</h6>
                </div>
                <hr />
                <div className="d-flex justify-content-end px-3 py-3">
                    <Button variant="light" className="text-dark" onClick={() => setShowDeleteUpdateModal(false)}>
                        Batal
                    </Button>

                    <Button variant="primary" className="ms-3 bg-color-lightblue" onClick={actionDelete}>
                        Simpan
                    </Button>
                </div>
            </Modal>

            <div className="container-fluid">
                <div className="px-2 py-3 d-flex justify-content-between">
                    <h3 className="poppins-regular">Manajemen User</h3>
                    <Button className="bg-color-lightblue rounded-0 px-5" onClick={() => setShowUserCreateModal(!showUserCreateModal)}>
                        <span className="poppins-regular">TAMBAH USER</span>
                    </Button>
                </div>
                <div className="mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="border-0 poppins-regular">No</th>
                                <th className="border-0 poppins-regular">Nama Lengkap 
                                    <span className="ms-2"><svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 0L5.59808 4.5H0.401924L3 0Z" fill="#BEBEBE"/>
                                        <path d="M3 12L0.401924 7.5L5.59808 7.5L3 12Z" fill="#BEBEBE"/>
                                        </svg>
                                    </span>
                                </th>
                                <th className="border-0 poppins-regular">
                                    Email
                                    <span className="ms-2"><svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 0L5.59808 4.5H0.401924L3 0Z" fill="#BEBEBE"/>
                                        <path d="M3 12L0.401924 7.5L5.59808 7.5L3 12Z" fill="#BEBEBE"/>
                                        </svg>
                                    </span>
                                </th>
                                <th className="border-0 poppins-regular">
                                    No. Telepon
                                    <span className="ms-2"><svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 0L5.59808 4.5H0.401924L3 0Z" fill="#BEBEBE"/>
                                        <path d="M3 12L0.401924 7.5L5.59808 7.5L3 12Z" fill="#BEBEBE"/>
                                        </svg>
                                    </span>
                                </th>
                                <th className="border-0 poppins-regular">Status
                                    <span className="ms-2"><svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 0L5.59808 4.5H0.401924L3 0Z" fill="#BEBEBE"/>
                                        <path d="M3 12L0.401924 7.5L5.59808 7.5L3 12Z" fill="#BEBEBE"/>
                                        </svg>
                                    </span>
                                </th>
                                <th className="border-0 poppins-regular"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                listUser.length > 0 ?
                                    listUser.map((value: ListUser, index: number) => {
                                        return (
                                            <tr key={index}>
                                                <td className="border-0 poppins-regular">{index + 1}</td>
                                                <td className="border-0 poppins-regular">{value['fullname']}</td>
                                                <td className="border-0 poppins-regular">{value['email']}</td>
                                                <td className="border-0 poppins-regular">{value['telpon']}</td>
                                                <td className="border-0 poppins-regular">
                                                    <span className={value['user_status'] == "ACTIVE" ? "badge badge-user bg-color-green px-1 py-2 rounded-pill" : "badge badge-user bg-color-red px-1 py-2 rounded-pill"}>{value['user_status'] == 'ACTIVE' ? "Aktif" : "Tidak Aktif"}</span>
                                                </td>
                                                <td className="border-0 poppins-regular">
                                                    <div className="d-flex">
                                                        <Button className="rounded-circle bg-color-green border-0">
                                                            <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M7 3.06201C2.625 3.06201 0.875 6.99994 0.875 6.99994C0.875 6.99994 2.625 10.937 7 10.937C11.375 10.937 13.125 6.99994 13.125 6.99994C13.125 6.99994 11.375 3.06201 7 3.06201Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                                                <path d="M7 9.18758C8.20812 9.18758 9.1875 8.2082 9.1875 7.00008C9.1875 5.79195 8.20812 4.81258 7 4.81258C5.79188 4.81258 4.8125 5.79195 4.8125 7.00008C4.8125 8.2082 5.79188 9.18758 7 9.18758Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </Button>
                                                        <Button className="rounded-circle bg-color-orange ms-2 border-0" onClick={
                                                            () => {
                                                                setFormikUpdateInitialValues({
                                                                    user_id: value['user_id'],
                                                                    fullname: value['fullname'],
                                                                    email: value['email'],
                                                                    telpon: value['telpon'],
                                                                    role: "ADMIN"
                                                                })
                                                                setShowUserUpdateModal(true)
                                                            }
                                                        }>
                                                            <svg width="20" height="20" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <path d="M7 8.75H5.25V7L10.5 1.75L12.25 3.5L7 8.75Z" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                                                <path d="M9.1875 3.0625L10.9375 4.8125" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                                                <path d="M11.8125 6.5625V11.375C11.8125 11.491 11.7664 11.6023 11.6844 11.6844C11.6023 11.7664 11.491 11.8125 11.375 11.8125H2.625C2.50897 11.8125 2.39769 11.7664 2.31564 11.6844C2.23359 11.6023 2.1875 11.491 2.1875 11.375V2.625C2.1875 2.50897 2.23359 2.39769 2.31564 2.31564C2.39769 2.23359 2.50897 2.1875 2.625 2.1875H7.4375" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                                            </svg>
                                                        </Button>
                                                        <Button className='rounded-circle ms-2 bg-color-red' variant="danger" onClick={
                                                            () => {
                                                                setUserIdDelete(value['user_id'])
                                                                setShowDeleteUpdateModal(true)
                                                                setFullnameDelete(value['fullname'])
                                                            }
                                                        }>
                                                            <span><i className="fa-solid fa-trash"></i></span>
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }) : <></>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminPage>
    )
}

export default Users