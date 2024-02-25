import 'bootstrap/dist/css/bootstrap.min.css'
import '../../../Styles/app.scss'
import * as formik from 'formik';
import * as yup from 'yup';
import Col from 'react-bootstrap/Col';
import { Form, Button } from 'react-bootstrap'
import '../../../Styles/login.scss'
import Loading from '../../Components/Loading';
import { useState } from 'react';
import { getApiBaseUrl, getClientBaseURL } from '../../Utils/helper';
import SweetAlert2, {SweetAlert2Props} from 'react-sweetalert2'


const Login = () => {
    interface LoginFormType {
        searchBy: string,
        password: string
    }

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [swalProps, setSwalProps] = useState<SweetAlert2Props>({})

    const { Formik } = formik;
    const schema = yup.object().shape({
        searchBy: yup.string().required('Email / Nomor Telepon wajib diisi').max(200),
        password: yup.string().required('Password wajib diisi').max(200)
    })
    const formikInitialValues: LoginFormType = {
        searchBy: "",
        password: ""
    }

    const actionSubmit = async (values: LoginFormType) => {
        setIsLoading(true)
        try {
            const response = await fetch(`${getApiBaseUrl()}/login-admin`, {
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
                        window.location.href = '/admin'
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

    return (
        <div className="contaienr-fluid h-100">

            <SweetAlert2 {...swalProps} />
            <Loading isLoading={isLoading} />
            <div className="row h-100 w-100">
                <div className="d-none d-lg-block col-lg-6 position-relative" id="coverLogin">
                    <div className="d-flex align-items-center justify-content-center h-100 text-center">
                        <div>
                            <h1 className='mb-0 poppins-extrabold'>NAMA APLIKASI</h1>
                            <p className="mb-0 text-dark poppins-regular" style={{
                                maxWidth: "450px"
                            }}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.</p>
                        </div>
                    </div>
                    <div className="ellipsis-left"></div>
                    <div className="ellipsis-bottom"></div>
                </div>
                <div className="col-12 col-lg-6">
                    <div className="d-flex align-items-center justify-content-center h-100">
                        <div>
                            <h3 className="mb-0 poppins-bold">Selamat Datang Admin</h3>
                            <p className="mb-0 text-secondary poppins-extralight">Silahkan masukkan nomor telepon dan password</p>
                            <p className="mb-0 text-secondary poppins-extralight">Anda untuk mulai menggunakan aplikasi</p>
                            <div className='mt-3'>
                                <Formik validationSchema={schema} initialValues={formikInitialValues} onSubmit={actionSubmit}>
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
                                                    placeholder='Contoh: admin@gmail.com'
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
                                                    placeholder='Masukkan Password'
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login