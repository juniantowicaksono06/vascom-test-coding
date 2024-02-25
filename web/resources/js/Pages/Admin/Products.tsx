import AdminPage from "../../Components/AdminPage";
import Loading from "../../Components/Loading";
import { useEffect, useState, useRef } from "react";
import { getApiBaseUrl, getClientBaseURL } from "../../Utils/helper";
import Modal from 'react-bootstrap/Modal'
import * as formik from 'formik';
import * as yup from 'yup';
import { Form, Button } from 'react-bootstrap'
import Col from 'react-bootstrap/Col';
import SweetAlert2, {SweetAlert2Props} from 'react-sweetalert2'

const Products = () => {
    interface ListProduct {
        product_id: number,
        nama: string,
        harga: number | string,
        product_status: string,
        gambar: string
    }

    interface ProductForm {
        product_id?: number,
        nama: string,
        harga: string,
        gambar: string,
    }

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [productIdDelete, setProductIdDelete] = useState<number>(0)
    const [productNameDelete, setProductNameDelete] = useState<string>("")
    const [listProduct, setListProduct] = useState<ListProduct[]>([] as ListProduct[])

    const [showProductCreateModal, setShowProductCreateModal] = useState<boolean>(false)
    const [showProductUpdateModal, setShowProductUpdateModal] = useState<boolean>(false)
    const [showDeleteUpdateModal, setShowDeleteUpdateModal] = useState<boolean>(false)

    const { Formik } = formik;
    const schemaCreate = yup.object().shape({
        nama: yup.string().required('Nama wajib diisi').max(200),
        harga: yup.string().matches(/^[0-9]*$/, 'Harga harus berupa angka').required('Harga wajib diisi').max(200),
        // gambar: yup.string().required('Gambar wajib diisi').max(100),
    })

    const schemaUpdate = yup.object().shape({
        nama: yup.string().required('Nama wajib diisi').max(200),
        harga: yup.string().matches(/^[0-9]*$/, 'Harga harus berupa angka').required('Harga wajib diisi').max(200),
        // gambar: yup.string().required('Gambar wajib diisi').max(100),
    })

    const [swalProps, setSwalProps] = useState<SweetAlert2Props>({})
    const [formikCreateInitialValues, setFormikCreateInitialValues] = useState<ProductForm>({
        nama: "",
        harga: "",
        gambar: ""
    })

    const [formikUpdateInitialValues, setFormikUpdateInitialValues] = useState<ProductForm>({
        nama: "",
        harga: "",
        gambar: ""
    })

    const actionGetListProduct = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${getApiBaseUrl()}/product?take=1000&skip=1`, {
                method: "GET",
                credentials: 'include',
                mode: 'cors',
            })
            if(response.status == 200) {
                let result = await response.json()
                const data = [...result['data']] as ListProduct[]

                data.forEach((value: ListProduct, index: number) => {
                    const number = value['harga'];
                    const formattedNumber = number.toLocaleString('en-US', {minimumFractionDigits: 0, useGrouping: true,}).replace(/,/g, '.');
                    data[index]['harga'] = formattedNumber
                })

                setListProduct(prevState => ([
                    ...data
                ]))
            }
        }
        catch(error) {
        }
        setIsLoading(false)
    }

    const actionUpdate = async (values: ProductForm) => {
        setIsLoading(true)
        try {
            const data: ProductForm = {
                ...values
            }
            data['gambar'] = formikUpdateInitialValues['gambar']
            delete data['product_id']
            const response = await fetch(`${getApiBaseUrl()}/product/${values['product_id']}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(data)
            })
            if(response.status == 200) {
                let result = await response.json()
                setShowProductUpdateModal(false)
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

    const actionCreate = async (values: ProductForm) => {
        setIsLoading(true)
        try {
            const data: ProductForm = {
                ...values
            }
            data['gambar'] = formikCreateInitialValues['gambar']
            const response = await fetch(`${getApiBaseUrl()}/product`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(data)
            })
            if(response.status == 201) {
                let result = await response.json()
                setShowProductCreateModal(false)
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
            const response = await fetch(`${getApiBaseUrl()}/product/${productIdDelete}`, {
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

    const actionUploadImage = async (e: React.ChangeEvent<HTMLInputElement>, update: boolean = false) => {
        e.preventDefault()
        try {
            let formData = new FormData()
            let file: File | null = null
            if(e.target.files) {
                file = e.target.files[0] as File
            }
            else {
                return
            }
            formData.append('image', file as File, (file as File).name)

            const response = await fetch(`${getApiBaseUrl()}/upload-image`, {
                method: 'POST',
                credentials: 'include',
                mode: 'cors',
                body: formData
            })
            if(response.status == 200) {
                let result = await response.json()
                let data = result['data']
                if(update) {
                    setFormikUpdateInitialValues(prevState => ({
                        ...prevState,
                        'gambar': data['filename'] as string
                    }))
                }
                else {
                    setFormikCreateInitialValues(prevState => ({
                        ...prevState,
                        'gambar': data['filename'] as string
                    }))
                }
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
        actionGetListProduct()
    }, [])
    return (
        <AdminPage>
            <Loading isLoading={isLoading} />
            <SweetAlert2 {...swalProps} />
            {/* CREATE */}
            <Modal className="rounded-0" show={showProductCreateModal} fullscreen={"lg-down"} backdrop="static">
                {/* Header */}
                <div className="px-3 py-3 position-relative">
                    <h3 className="poppins-regular text-center">Tambah Produk</h3>
                    <Button variant="link" style={{
                        position: 'absolute',
                        top: '10px',
                        right: '5px'
                    }} onClick={() => {
                        setShowProductCreateModal(false)
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
                                <Form.Group as={Col} md="12" className="mb-2" controlId="nama">
                                    <Form.Label><span className='poppins-extralight'>Nama Produk</span></Form.Label>
                                    <Form.Control
                                        className='rounded-0 border-dark poppins-extralight'
                                        type="text"
                                        name="nama"
                                        value={values.nama}
                                        onChange={handleChange}
                                        isValid={touched.nama && !errors.nama}
                                        isInvalid={!!errors.nama}
                                        maxLength={200}
                                        placeholder='Masukkan anama produk'
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.nama}
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="12" className="mb-2" controlId="harga">
                                    <Form.Label><span className='poppins-extralight'>Harga</span></Form.Label>
                                    <Form.Control
                                        className='rounded-0 border-dark poppins-extralight'
                                        type="number"
                                        name="harga"
                                        value={values.harga}
                                        onChange={handleChange}
                                        isValid={touched.harga && !errors.harga}
                                        isInvalid={!!errors.harga}
                                        maxLength={200}
                                        placeholder='Masukkan Harga'
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.harga}
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><span className='poppins-extralight'>Gambar Produk</span></Form.Label>
                                    <div className="input-file-container">
                                        <div className="d-flex justify-content-center input-file-overlay">
                                            <div className="text-center">
                                            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path opacity="0.2" d="M6.25 32.8125L16.0826 22.9798C16.2277 22.8348 16.4 22.7197 16.5895 22.6411C16.7791 22.5626 16.9823 22.5222 17.1875 22.5222C17.3927 22.5222 17.5958 22.5626 17.7854 22.6411C17.975 22.7197 18.1472 22.8348 18.2923 22.9798L27.0201 31.7076C27.1652 31.8527 27.3375 31.9678 27.527 32.0463C27.7166 32.1249 27.9198 32.1653 28.125 32.1653C28.3302 32.1653 28.5333 32.1249 28.7229 32.0463C28.9125 31.9678 29.0847 31.8527 29.2298 31.7076L33.2701 27.6673C33.4152 27.5223 33.5875 27.4072 33.777 27.3286C33.9666 27.2501 34.1698 27.2097 34.375 27.2097C34.5802 27.2097 34.7833 27.2501 34.9729 27.3286C35.1625 27.4072 35.3347 27.5223 35.4798 27.6673L43.75 35.9375L43.75 10.9375C43.75 10.5231 43.5854 10.1257 43.2924 9.83265C42.9993 9.53962 42.6019 9.375 42.1875 9.375H7.8125C7.3981 9.375 7.00067 9.53962 6.70765 9.83265C6.41462 10.1257 6.25 10.5231 6.25 10.9375V32.8125Z" fill="#41A0E4"/>
                                                <path d="M42.1875 9.375H7.8125C6.94956 9.375 6.25 10.0746 6.25 10.9375V39.0625C6.25 39.9254 6.94956 40.625 7.8125 40.625H42.1875C43.0504 40.625 43.75 39.9254 43.75 39.0625V10.9375C43.75 10.0746 43.0504 9.375 42.1875 9.375Z" stroke="#41A0E4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M6.25 32.8124L16.0826 22.9798C16.2277 22.8347 16.4 22.7196 16.5895 22.6411C16.7791 22.5625 16.9823 22.5221 17.1875 22.5221C17.3927 22.5221 17.5958 22.5625 17.7854 22.6411C17.975 22.7196 18.1472 22.8347 18.2923 22.9798L27.0201 31.7076C27.1652 31.8527 27.3375 31.9677 27.527 32.0463C27.7166 32.1248 27.9198 32.1652 28.125 32.1652C28.3302 32.1652 28.5333 32.1248 28.7229 32.0463C28.9125 31.9677 29.0847 31.8527 29.2298 31.7076L33.2701 27.6673C33.4152 27.5222 33.5875 27.4071 33.777 27.3286C33.9666 27.25 34.1698 27.2096 34.375 27.2096C34.5802 27.2096 34.7833 27.25 34.9729 27.3286C35.1625 27.4071 35.3347 27.5222 35.4798 27.6673L43.75 35.9374" stroke="#41A0E4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M30.4688 21.875C31.7632 21.875 32.8125 20.8257 32.8125 19.5312C32.8125 18.2368 31.7632 17.1875 30.4688 17.1875C29.1743 17.1875 28.125 18.2368 28.125 19.5312C28.125 20.8257 29.1743 21.875 30.4688 21.875Z" fill="#41A0E4"/>
                                                <circle cx="41" cy="41" r="9" fill="#BDBDBD"/>
                                                <g clipPath="url(#clip0_1_441)">
                                                    <path d="M37.3993 41.6655L36.9512 41.2244C36.7614 41.0376 36.7614 40.7356 36.9512 40.5508L40.8734 36.6879C41.0631 36.5011 41.3699 36.5011 41.5577 36.6879L45.4799 40.5488C45.6696 40.7356 45.6696 41.0376 45.4799 41.2224L45.0317 41.6636C44.84 41.8523 44.5271 41.8484 44.3394 41.6556L42.024 39.2632V44.9741C42.024 45.2383 41.808 45.451 41.5395 45.451H40.8935C40.6251 45.451 40.4091 45.2383 40.4091 44.9741V39.2632L38.0917 41.6576C37.9039 41.8523 37.5911 41.8563 37.3993 41.6655Z" fill="#E8F7EE" fillOpacity="0.8"/>
                                                </g>
                                            </svg>

                                                <h5 className="poppins-regular color-gray">Pilih gambar dengan ratio 9:16</h5>
                                            </div>
                                        </div>
                                        <Form.Control
                                            type="file"
                                            name="gambar"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                actionUploadImage(e)
                                            }}
                                            accept="image/png, image/webp, image/jpg, image/jpeg"
                                        />
                                    </div>
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
            <Modal className="rounded-0" show={showProductUpdateModal} fullscreen={"lg-down"} backdrop="static">
                {/* Header */}
                <div className="px-3 py-3 position-relative">
                    <h3 className="poppins-regular text-center">Ubah Data Produk</h3>
                    <Button variant="link" style={{
                        position: 'absolute',
                        top: '10px',
                        right: '5px'
                    }} onClick={() => {
                        setShowProductUpdateModal(false)
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
                                <Form.Group as={Col} md="12" className="mb-2" controlId="nama">
                                    <Form.Label><span className='poppins-extralight'>Nama Produk</span></Form.Label>
                                    <Form.Control
                                        className='rounded-0 border-dark poppins-extralight'
                                        type="text"
                                        name="nama"
                                        value={values.nama}
                                        onChange={handleChange}
                                        isValid={touched.nama && !errors.nama}
                                        isInvalid={!!errors.nama}
                                        maxLength={200}
                                        placeholder='Masukkan anama produk'
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.nama}
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} md="12" className="mb-2" controlId="harga">
                                    <Form.Label><span className='poppins-extralight'>Harga</span></Form.Label>
                                    <Form.Control
                                        className='rounded-0 border-dark poppins-extralight'
                                        type="number"
                                        name="harga"
                                        value={values.harga}
                                        onChange={handleChange}
                                        isValid={touched.harga && !errors.harga}
                                        isInvalid={!!errors.harga}
                                        maxLength={200}
                                        placeholder='Masukkan Harga'
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.harga}
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback>Looks good</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label><span className='poppins-extralight'>Gambar Produk</span></Form.Label>
                                    <div className="input-file-container">
                                        <div className="d-flex justify-content-center input-file-overlay">
                                            <div className="text-center">
                                            <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path opacity="0.2" d="M6.25 32.8125L16.0826 22.9798C16.2277 22.8348 16.4 22.7197 16.5895 22.6411C16.7791 22.5626 16.9823 22.5222 17.1875 22.5222C17.3927 22.5222 17.5958 22.5626 17.7854 22.6411C17.975 22.7197 18.1472 22.8348 18.2923 22.9798L27.0201 31.7076C27.1652 31.8527 27.3375 31.9678 27.527 32.0463C27.7166 32.1249 27.9198 32.1653 28.125 32.1653C28.3302 32.1653 28.5333 32.1249 28.7229 32.0463C28.9125 31.9678 29.0847 31.8527 29.2298 31.7076L33.2701 27.6673C33.4152 27.5223 33.5875 27.4072 33.777 27.3286C33.9666 27.2501 34.1698 27.2097 34.375 27.2097C34.5802 27.2097 34.7833 27.2501 34.9729 27.3286C35.1625 27.4072 35.3347 27.5223 35.4798 27.6673L43.75 35.9375L43.75 10.9375C43.75 10.5231 43.5854 10.1257 43.2924 9.83265C42.9993 9.53962 42.6019 9.375 42.1875 9.375H7.8125C7.3981 9.375 7.00067 9.53962 6.70765 9.83265C6.41462 10.1257 6.25 10.5231 6.25 10.9375V32.8125Z" fill="#41A0E4"/>
                                                <path d="M42.1875 9.375H7.8125C6.94956 9.375 6.25 10.0746 6.25 10.9375V39.0625C6.25 39.9254 6.94956 40.625 7.8125 40.625H42.1875C43.0504 40.625 43.75 39.9254 43.75 39.0625V10.9375C43.75 10.0746 43.0504 9.375 42.1875 9.375Z" stroke="#41A0E4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M6.25 32.8124L16.0826 22.9798C16.2277 22.8347 16.4 22.7196 16.5895 22.6411C16.7791 22.5625 16.9823 22.5221 17.1875 22.5221C17.3927 22.5221 17.5958 22.5625 17.7854 22.6411C17.975 22.7196 18.1472 22.8347 18.2923 22.9798L27.0201 31.7076C27.1652 31.8527 27.3375 31.9677 27.527 32.0463C27.7166 32.1248 27.9198 32.1652 28.125 32.1652C28.3302 32.1652 28.5333 32.1248 28.7229 32.0463C28.9125 31.9677 29.0847 31.8527 29.2298 31.7076L33.2701 27.6673C33.4152 27.5222 33.5875 27.4071 33.777 27.3286C33.9666 27.25 34.1698 27.2096 34.375 27.2096C34.5802 27.2096 34.7833 27.25 34.9729 27.3286C35.1625 27.4071 35.3347 27.5222 35.4798 27.6673L43.75 35.9374" stroke="#41A0E4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M30.4688 21.875C31.7632 21.875 32.8125 20.8257 32.8125 19.5312C32.8125 18.2368 31.7632 17.1875 30.4688 17.1875C29.1743 17.1875 28.125 18.2368 28.125 19.5312C28.125 20.8257 29.1743 21.875 30.4688 21.875Z" fill="#41A0E4"/>
                                                <circle cx="41" cy="41" r="9" fill="#BDBDBD"/>
                                                <g clipPath="url(#clip0_1_441)">
                                                    <path d="M37.3993 41.6655L36.9512 41.2244C36.7614 41.0376 36.7614 40.7356 36.9512 40.5508L40.8734 36.6879C41.0631 36.5011 41.3699 36.5011 41.5577 36.6879L45.4799 40.5488C45.6696 40.7356 45.6696 41.0376 45.4799 41.2224L45.0317 41.6636C44.84 41.8523 44.5271 41.8484 44.3394 41.6556L42.024 39.2632V44.9741C42.024 45.2383 41.808 45.451 41.5395 45.451H40.8935C40.6251 45.451 40.4091 45.2383 40.4091 44.9741V39.2632L38.0917 41.6576C37.9039 41.8523 37.5911 41.8563 37.3993 41.6655Z" fill="#E8F7EE" fillOpacity="0.8"/>
                                                </g>
                                            </svg>

                                                <h5 className="poppins-regular color-gray">Pilih gambar dengan ratio 9:16</h5>
                                            </div>
                                        </div>
                                        <Form.Control
                                            type="file"
                                            name="gambar"
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                actionUploadImage(e, true)
                                            }}
                                            accept="image/png, image/webp, image/jpg, image/jpeg"
                                        />
                                    </div>
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
                    <h6 className="poppins-regular text-secondary text-center">Apakah kamu yakin akan menghapus <span className="text-dark poppins-semi-bold">"{productNameDelete}"</span>?</h6>
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
                    <h3 className="poppins-regular">Manajemen Produk</h3>
                    <Button className="bg-color-lightblue rounded-0 px-5" onClick={() => {
                        setFormikCreateInitialValues({
                            nama: "",
                            harga: "",
                            gambar: ""
                        })
                        setShowProductCreateModal(!showProductCreateModal)
                    }}>
                        <span className="poppins-regular">TAMBAH PRODUK</span>
                    </Button>
                </div>
                <div className="mt-3">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="border-0 poppins-regular">No</th>
                                <th className="border-0 poppins-regular">Nama Produk 
                                    <span className="ms-2"><svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3 0L5.59808 4.5H0.401924L3 0Z" fill="#BEBEBE"/>
                                        <path d="M3 12L0.401924 7.5L5.59808 7.5L3 12Z" fill="#BEBEBE"/>
                                        </svg>
                                    </span>
                                </th>
                                <th className="border-0 poppins-regular">
                                    Harga
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
                                listProduct.length > 0 ?
                                    listProduct.map((value: ListProduct, index: number) => {
                                        return (
                                            <tr key={index}>
                                                <td className="border-0 poppins-regular">{index + 1}</td>
                                                <td className="border-0 poppins-regular">{value['nama']}</td>
                                                <td className="border-0 poppins-regular">Rp. {value['harga']}</td>
                                                <td className="border-0 poppins-regular">
                                                    <span className={value['product_status'] == "ACTIVE" ? "badge badge-user bg-color-green px-1 py-2 rounded-pill" : "badge badge-user bg-color-red px-1 py-2 rounded-pill"}>{value['product_status'] == 'ACTIVE' ? "Aktif" : "Tidak Aktif"}</span>
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
                                                                var convertedNumber = parseInt((value['harga'] as string).replace(/\./g, ''));
                                                                setFormikUpdateInitialValues({
                                                                    product_id: value['product_id'],
                                                                    nama: value['nama'],
                                                                    harga: convertedNumber.toString(),
                                                                    gambar: value['gambar']
                                                                })
                                                                setShowProductUpdateModal(true)
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
                                                                setProductIdDelete(value['product_id'])
                                                                setShowDeleteUpdateModal(true)
                                                                setProductNameDelete(value['nama'])
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

export default Products