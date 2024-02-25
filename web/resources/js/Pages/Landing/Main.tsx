import 'bootstrap/dist/css/bootstrap.min.css'
import '../../../Styles/app.scss'
import '../../../Styles/landing.scss'
import { Button, Carousel, Form } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { getClientBaseURL, getApiBaseUrl } from '../../Utils/helper'
import Loading from "../../Components/Loading";
import Modal from 'react-bootstrap/Modal'
import * as formik from 'formik';
import * as yup from 'yup';
import Col from 'react-bootstrap/Col';
import SweetAlert2, {SweetAlert2Props} from 'react-sweetalert2'
import { usePage } from '@inertiajs/inertia-react'
import { PageProps } from '@inertiajs/inertia'
import { Page } from '@inertiajs/inertia'

const Main = () => {

    interface ProductTerbaru {
        gambar: string,
        nama: string,
        created_at: string,
        harga: number | string,
        product_id?: number
    }

    interface LoginFormType {
        searchBy: string,
        password: string
    }

    interface UserForm {
        user_id?: number,
        password?: string,
        fullname: string,
        email: string,
        telpon: string,
        role?: 'USER'
    }

    interface ProfileData extends PageProps {
        id?: number,
        fullname?: string,
        role?: string
        email?: string, 
        user_status?: string
    }

    const [carouselIndex, setCarouselIndex] = useState<number>(0);
    const [carouselIndex2, setCarouselIndex2] = useState<number>(0);
    const profileDataPage = usePage<Page<ProfileData>>()
    
    const profileData = profileDataPage.props
    const [isLogin, setIsLogin] = useState<boolean>("email" in profileData ? true : false);

    const [carouselImage, setCarouselImage] = useState([
        'default-carousel.jpeg',
        'default-carousel.jpeg',
        'default-carousel.jpeg',
    ])

    const [swalProps, setSwalProps] = useState<SweetAlert2Props>({})

    const handleSelect = (selectedIndex: number) => {
        setCarouselIndex(selectedIndex)
    }

    const handleSelect2 = (selectedIndex: number) => {
        setCarouselIndex2(selectedIndex)
    }

    const [productTerbaru, setProductTerbaru] = useState<Array<ProductTerbaru[]>>([] as Array<ProductTerbaru[]>)
    const [allProduct, setAllProduct] = useState<ProductTerbaru[]>([] as ProductTerbaru[])
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
    const [showUserCreateModal, setShowUserCreateModal] = useState<boolean>(false)

    const { Formik } = formik;


    const formikLoginInitialValues: LoginFormType = {
        searchBy: "",
        password: ""
    }

    const LoginSchema = yup.object().shape({
        searchBy: yup.string().required('Email / Nomor Telepon wajib diisi').max(200),
        password: yup.string().required('Password wajib diisi').max(200)
    })

    const schemaCreate = yup.object().shape({
        fullname: yup.string().required('Nama wajib diisi').max(200),
        email: yup.string().email('Email tidak valid').required('Email wajib diisi').max(200),
        telpon: yup.string().required('Nomor Telepon wajib diisi').max(13),
    })

    const formikCreateInitialValues: UserForm = {
        fullname: "",
        email: "",
        telpon: "",
        role: 'USER'
    }

    const handlePrev = () => {
        setCarouselIndex(carouselIndex === 0 ? carouselImage.length - 1 : carouselIndex - 1);
    };

    const handleNext = () => {
        setCarouselIndex(carouselIndex === carouselImage.length - 1 ? 0 : carouselIndex + 1);
    };
    const [isLoading, setIsLoading] = useState<boolean>(false)


    const splitArray = (array: Array<object>) => {
        const newArray = [];
        for (let i = 0; i < array.length; i += 5) {
            newArray.push(array.slice(i, i + 5));
        }
        return newArray;
    }

    const generateRandomString = (length: number = 10) => {
        const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let randomString = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charset.length);
            randomString += charset[randomIndex];
        }
        return randomString;
    }
    
    const actionGetAllProduct = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${getApiBaseUrl()}/product?latest=TRUE&take=10000&skip=1`, {
                method: "GET",
                credentials: 'include',
                mode: 'cors',
            })
            if (response.status == 200) {
                let result = await response.json()
                let data = [...result['data']] as ProductTerbaru[]
                const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                ];

                data.forEach((value: ProductTerbaru, index: number) => {
                    const date = new Date(value['created_at']);
                    const day = date.getUTCDate();
                    const month = monthNames[date.getUTCMonth()];
                    const year = date.getUTCFullYear();
                    data[index]['created_at'] = day + ' ' + month + ' ' + year;
                    const number = value['harga'];
                    const formattedNumber = number.toLocaleString('en-US', { minimumFractionDigits: 0, useGrouping: true, }).replace(/,/g, '.');
                    data[index]['harga'] = formattedNumber
                })

                setAllProduct(data as ProductTerbaru[])
            }
        }
        catch (error) {

        }
        setIsLoading(false)
    }
    

    const actionGetNewProduct = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${getApiBaseUrl()}/product?latest=TRUE&take=10&skip=1`, {
                method: "GET",
                credentials: 'include',
                mode: 'cors',
            })
            if (response.status == 200) {
                let result = await response.json()
                let data = [...result['data']] as ProductTerbaru[]
                const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
                ];

                data.forEach((value: ProductTerbaru, index: number) => {
                    const date = new Date(value['created_at']);
                    const day = date.getUTCDate();
                    const month = monthNames[date.getUTCMonth()];
                    const year = date.getUTCFullYear();
                    data[index]['created_at'] = day + ' ' + month + ' ' + year;
                    const number = value['harga'];
                    const formattedNumber = number.toLocaleString('en-US', { minimumFractionDigits: 0, useGrouping: true, }).replace(/,/g, '.');
                    data[index]['harga'] = formattedNumber
                })

                const newData = splitArray(data)

                setProductTerbaru(newData as Array<ProductTerbaru[]>)
            }
        }
        catch (error) {

        }
        setIsLoading(false)
    }

    const actionLogin = async(values: LoginFormType) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${getApiBaseUrl()}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors',
                body: JSON.stringify(values)
            })
            if(response.status == 200) {
                let result = await response.json()
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
                        setShowLoginModal(false)
                        setIsLogin(true)
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
            const response = await fetch(`${getApiBaseUrl()}/customer`, {
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

    useEffect(() => {
        actionGetNewProduct()
        actionGetAllProduct()
    }, [])

    return (
        <>
            <Loading isLoading={isLoading} />
            <SweetAlert2 {...swalProps} />
            {/* LOGIN MODAL */}
            <Modal className="rounded-0" show={showLoginModal} fullscreen={"lg-down"} backdrop="static">
                {/* Header */}
                <div className="px-3 py-3 position-relative">
                    <h3 className="poppins-regular text-center">Login</h3>
                    <Button variant="link" style={{
                        position: 'absolute',
                        top: '10px',
                        right: '5px'
                    }} onClick={() => {
                        setShowLoginModal(false)
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
                    <Formik validationSchema={LoginSchema} initialValues={formikLoginInitialValues} onSubmit={actionLogin}>
                        {({ handleChange,
                                handleSubmit,
                                values,
                                touched,
                                errors }) => (
                            <Form onSubmit={handleSubmit}>
                                <Form.Group as={Col} md="12" className="mb-2" controlId="searchBy">
                                    <Form.Label><span className='poppins-extralight'>Email / Nomor Telepon</span></Form.Label>
                                    <Form.Control
                                        className='rounded-0 border-dark poppins-extralight'
                                        type="text"
                                        name="searchBy"
                                        value={values.searchBy}
                                        onChange={handleChange}
                                        isValid={touched.searchBy && !errors.searchBy}
                                        isInvalid={!!errors.searchBy}
                                        maxLength={200}
                                        placeholder='Masukkan asearchBy produk'
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.searchBy}
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
                                        placeholder='Masukkan apassword produk'
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
            <div className="container-fluid">
                {/* HEADER */}
                <div className="row mt-3" id="header">
                    <div className="col-2">
                        <img src="/images/vascomm.jpg" width="128" alt="" className="img-fluid" />
                    </div>
                    <div className="col-8">
                        <div className="input-group mb-3">
                            <input type="text" className='form-control sf-pro-display-regular' id="searchBar" placeholder='Cari parfum kesukaanmu' />
                            <span className="input-group-text rounded-0" id="basic-addon2">
                                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#1F1C17" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M17.5 17.5L13.875 13.875" stroke="#1F1C17" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </span>
                        </div>
                    </div>
                    <div className="col-2">
                        {
                            isLogin ? 
                            <div className="d-flex justify-content-end">
                                <Button variant="danger" className='sf-pro-display-regular rounded-0 me-2' onClick={() => {
                                    window.location.href = '/logout'
                                }}>
                                    LOGOUT
                                </Button>
                            </div> :
                            <div className="d-flex justify-content-end">
                                <Button className='sf-pro-display-regular rounded-0 btn-outline-blue me-2' onClick={() => {
                                    setShowLoginModal(true)
                                }}>
                                    MASUK
                                </Button>
                                <Button className='sf-pro-display-regular rounded-0' onClick={() => {
                                    setShowUserCreateModal(true)
                                }}>
                                    DAFTAR
                                </Button>
                            </div>
                        }
                    </div>
                </div>
                {/* CONTENT */}
                <div className="container" id="content">
                    <div className="row mt-3">
                        <div className="col-12">
                            <Carousel activeIndex={carouselIndex} onSelect={handleSelect} className="no-controls">
                                {carouselImage.map((value: string, index: number) => {
                                    return (
                                        <Carousel.Item key={generateRandomString()}>
                                            <img
                                                className="d-block w-100"
                                                src={`/images/${value}`}
                                            />
                                        </Carousel.Item>
                                    )
                                })}
                            </Carousel>
                            <div>
                                <Button variant='link' onClick={handlePrev}>
                                    <svg width="10" height="19" viewBox="0 0 10 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 18L1 9.5L9 1" stroke="#A29B91" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Button>
                                {
                                    carouselImage.map((value: string, index: number) => {
                                        return (
                                            carouselIndex == index ?
                                                <div className="me-2 d-inline" key={generateRandomString()}>
                                                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="4.5" cy="5" r="4.5" fill="#A29B91" />
                                                    </svg>
                                                </div>
                                                : <div className="me-2 d-inline" key={generateRandomString()}>
                                                    <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="4.5" cy="5" r="4.5" fill="#F9F9F9" />
                                                    </svg>
                                                </div>
                                        )
                                    })
                                }
                                <Button variant='link' onClick={handleNext}>
                                    <svg width="10" height="19" viewBox="0 0 10 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 18L9 9.5L1 1" stroke="#1F1C17" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </Button>
                            </div>
                            <div className="mt-3 mb-3">
                                <h2 className="playfair-display-bold">Terbaru</h2>
                            </div>
                            <Carousel id="carouselNewProduct" activeIndex={carouselIndex2} onSelect={handleSelect2}>
                                {
                                    productTerbaru.map((value: ProductTerbaru[], index: number) => {
                                        const key = generateRandomString()
                                        return <Carousel.Item key={key}>
                                            <div className="grid-product" key={generateRandomString()}>
                                                {
                                                    value.map((v: ProductTerbaru, i: number) => {
                                                        return (
                                                            <div className="product-item" key={v['product_id']}>
                                                                <div>
                                                                    <img src={`${getClientBaseURL()}/images/${v['gambar']}`} alt="" className='img-fluid' />
                                                                </div>
                                                                <div>
                                                                    <h5 className="playfair-display-bold">{v['nama']}</h5>
                                                                    <h5 className="sf-pro-display-regular color-lightblue"><b>IDR {v['harga']}</b></h5>
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </Carousel.Item>
                                    })
                                }
                            </Carousel>
                            <div className="mt-3 mb-3">
                                <h2 className="playfair-display-bold">Produk Tersedia</h2>
                            </div>
                            <div className="grid-product">
                                {
                                    allProduct.map((value: ProductTerbaru, index: number) => {
                                        return (
                                            <div className="product-item" key={value['product_id']}>
                                                <div>
                                                    <img src={`${getClientBaseURL()}/images/${value['gambar']}`} alt="" className='img-fluid' />
                                                </div>
                                                <div>   
                                                    <h5 className="playfair-display-bold">{value['nama']}</h5>
                                                    <h5 className="sf-pro-display-regular color-lightblue"><b>IDR {value['harga']}</b></h5>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                        <div className="d-flex justify-content-center mb-2 mt-2">
                            <Button className="rounded-0 btn-outline-blue">
                                Lihat lebih banyak
                            </Button>
                        </div>
                    </div>
                </div>
                {/* FOOTER */}
                <div className="mt-4" id="footer">
                    <div className="container-fluid mt-5 pt-4">
                        <div className="row">
                            <div className="col-6">
                                <div className="container">
                                    <div className="col-12">
                                        <div className="d-flex justify-content-center">
                                            <div>
                                                <img src="/images/vascomm.jpg" className='img-fluid' alt="" />
                                            </div>
                                        </div>
                                        <div className='d-flex justify-content-center mt-5 mb-3'>
                                            <p style={{
                                            maxWidth: "340px"
                                        }} className='sf-pro-display-regular text-center color-gray'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut commodo in vestibulum, sed dapibus tristique nullam.</p>
                                        </div>
                                        <div className="d-flex justify-content-center mb-3">
                                            <div>
                                                <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M14.9999 1.66666H12.4999C11.3948 1.66666 10.335 2.10564 9.55364 2.88704C8.77224 3.66845 8.33325 4.72825 8.33325 5.83332V8.33332H5.83325V11.6667H8.33325V18.3333H11.6666V11.6667H14.1666L14.9999 8.33332H11.6666V5.83332C11.6666 5.61231 11.7544 5.40035 11.9107 5.24407C12.0669 5.08779 12.2789 4.99999 12.4999 4.99999H14.9999V1.66666Z" fill="#41A0E4" stroke="#41A0E4" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <div className='ms-2'>
                                                <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M19.1666 2.49999C18.3686 3.06289 17.485 3.49341 16.5499 3.77499C16.048 3.19791 15.381 2.7889 14.6391 2.60326C13.8972 2.41762 13.1162 2.46432 12.4017 2.73703C11.6871 3.00975 11.0736 3.49532 10.6441 4.12808C10.2145 4.76085 9.98967 5.51027 9.99992 6.27499V7.10832C8.53545 7.14629 7.08431 6.8215 5.77576 6.16286C4.4672 5.50422 3.34185 4.53218 2.49992 3.33332C2.49992 3.33332 -0.833415 10.8333 6.66658 14.1667C4.95036 15.3316 2.90588 15.9158 0.833252 15.8333C8.33325 20 17.4999 15.8333 17.4999 6.24999C17.4991 6.01787 17.4768 5.78632 17.4333 5.55832C18.2838 4.71957 18.8839 3.66058 19.1666 2.49999Z" fill="#41A0E4" stroke="#41A0E4" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </div>
                                            <div className="ms-2">
                                            <svg width="30" height="30" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14.1667 1.66666H5.83341C3.53223 1.66666 1.66675 3.53214 1.66675 5.83332V14.1667C1.66675 16.4678 3.53223 18.3333 5.83341 18.3333H14.1667C16.4679 18.3333 18.3334 16.4678 18.3334 14.1667V5.83332C18.3334 3.53214 16.4679 1.66666 14.1667 1.66666Z" fill="#41A0E4" stroke="#41A0E4" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M13.3333 9.47501C13.4361 10.1685 13.3176 10.8769 12.9947 11.4992C12.6718 12.1215 12.1609 12.6262 11.5346 12.9414C10.9083 13.2566 10.1986 13.3663 9.50641 13.255C8.81419 13.1436 8.17472 12.8167 7.67895 12.321C7.18318 11.8252 6.85636 11.1857 6.74497 10.4935C6.63359 9.8013 6.74331 9.09159 7.05852 8.46532C7.37374 7.83905 7.87841 7.32812 8.50074 7.00521C9.12307 6.68229 9.83138 6.56383 10.5249 6.66667C11.2324 6.77158 11.8873 7.10123 12.393 7.60693C12.8987 8.11263 13.2283 8.76757 13.3333 9.47501Z" fill="white" stroke="#41A0E4" strokeLinecap="round" strokeLinejoin="round"/>
                                                <path d="M14.5833 5.41666H14.5916" stroke="white" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 playfair-display-regular">
                                <div className="row">
                                    <div className="col-4">
                                        <h3 className="">Layanan</h3>
                                        <div className="mt-5 sf-pro-display-regular">
                                            <h5 className='mb-3'>BANTUAN</h5>
                                            <h5 className='mb-3'>TANYA JAWAB</h5>
                                            <h5 className='mb-3'>HUBUNGI KAMI</h5>
                                            <h5 className='mb-3'>CARA BERJUALAN</h5>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <h3 className="">TENTANG KAMI</h3>
                                        <div className="mt-5 sf-pro-display-regular">
                                            <h5 className='mb-3'>ABOUT US</h5>
                                            <h5 className='mb-3'>KARIR</h5>
                                            <h5 className='mb-3'>KEBIJAKAN PRIVASI</h5>
                                            <h5 className='mb-3'>SYARAT DAN KETENTUAN</h5>
                                        </div>
                                    </div>
                                    <div className="col-4">

                                        <h3 className="">MITRA</h3>
                                        <div className="mt-5 sf-pro-display-regular">
                                            <h5 className='mb-3'>SUPPLIER</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-100" id="pageRectangle"></div>
        </>
    )
}

export default Main