import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import '../../Styles/app.scss'
import '../../Styles/admin.scss'
import ScrollContainer from './ScrollContainer'
import { usePage } from '@inertiajs/inertia-react'
import { PageProps } from '@inertiajs/inertia'
import { Page } from '@inertiajs/inertia'

const AdminPage = (props: {
    children: React.ReactNode
}) => {
    const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false)
    interface ProfileData extends PageProps {
        id: number,
        fullname: string,
        role: string
        email: string, 
        user_status: string
    }
    const profileDataPage = usePage<Page<ProfileData>>()
    const profileData = profileDataPage.props


    const actionToggleProfile = () => {
        setIsProfileOpen(!isProfileOpen)
    }

    return (
        <>
            {/* TOP BAR SECTION */}
            <div id="topbar" style={{
                height: '100px'
            }}>
                <div className="w-100 d-flex justify-content-between align-items-center h-100 px-5">
                    <div>
                        <h4 className="poppins-regular">LOGO</h4>
                    </div>
                    <div>
                        <div className="me-3 d-inline-block">
                            <p className="color-lightblue mb-0 poppins-regular text-end">Hallo Admin,</p>
                            <h5 className="mb-0 poppins-regular">{ profileData['fullname'] }</h5>
                        </div>
                        <div className='bg-color-gray rounded-circle position-relative' id="profilePic" style={{
                            height: '60px',
                            width: '60px',
                            float: 'right'
                        }} onClick={actionToggleProfile}>
                            {
                                isProfileOpen ? 
                            
                                <div id="profilePopup">
                                    <div className="d-flex justify-content-center">
                                        <div className='bg-color-gray rounded-circle' style={{
                                            height: '64px',
                                            width: '64px'
                                        }}>
                                        </div>
                                    </div>
                                    <h4 className="mb-0 poppins-regular text-center mt-4">{profileData['fullname']}</h4>
                                    <p className="poppins-regular text-center">{profileData['email']}</p>
                                    <hr />
                                    <div>
                                        <h4 className='text-danger text-center mb-5 mt-2'>
                                            <a href="/admin/logout" className='text-danger'><span><i className="fa-solid fa-power-off text-danger"></i> KELUAR</span></a>
                                        </h4>
                                    </div>
                                </div> : <></>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* WRAPPER */}
            <div className="d-flex">
                {/* SIDEBAR SECTION */}
                <div id="sidebar">
                    <ScrollContainer>
                        <a href="/admin/">
                            <div className={window.location.pathname == '/admin' || window.location.pathname == '/admin/'  ? "d-flex px-3 py-2 align-items-center menu-item active" : "d-flex px-3 py-2 align-items-center menu-item"}>
                                <svg width="24" height="24" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.2495 17.4993V12.9992C12.2495 12.8003 12.1704 12.6095 12.0298 12.4689C11.8891 12.3282 11.6984 12.2492 11.4995 12.2492H8.49945C8.30054 12.2492 8.10977 12.3282 7.96912 12.4689C7.82847 12.6095 7.74945 12.8003 7.74945 12.9992V17.4993C7.74945 17.6982 7.67045 17.8889 7.52981 18.0296C7.38918 18.1702 7.19844 18.2492 6.99954 18.2493L2.50009 18.2499C2.40159 18.2499 2.30406 18.2305 2.21305 18.1928C2.12205 18.1551 2.03936 18.0999 1.9697 18.0302C1.90005 17.9606 1.8448 17.8779 1.8071 17.7869C1.7694 17.6959 1.75 17.5984 1.75 17.4999V8.8317C1.75 8.72721 1.77183 8.62388 1.8141 8.52832C1.85637 8.43276 1.91814 8.34709 1.99545 8.27679L9.49493 1.45791C9.63299 1.33238 9.81287 1.26282 9.99946 1.26282C10.186 1.26281 10.3659 1.33236 10.504 1.45787L18.0045 8.27679C18.0818 8.34708 18.1436 8.43276 18.1859 8.52833C18.2282 8.62389 18.25 8.72724 18.25 8.83173V17.4999C18.25 17.5984 18.2306 17.6959 18.1929 17.7869C18.1552 17.8779 18.1 17.9606 18.0303 18.0302C17.9606 18.0999 17.878 18.1551 17.7869 18.1928C17.6959 18.2305 17.5984 18.2499 17.4999 18.2499L12.9994 18.2493C12.8005 18.2493 12.6097 18.1702 12.4691 18.0296C12.3285 17.8889 12.2494 17.6982 12.2495 17.4993Z" stroke={window.location.pathname == '/admin/' || window.location.pathname == '/admin' ? "white" : "black"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <h5 className='ms-2 mt-2 poppins-regular'> Dashboard</h5>
                            </div>
                        </a>
                        <a href="/admin/user">
                            <div className={window.location.pathname.startsWith('/admin/user') ? "d-flex px-3 py-2 align-items-center menu-item active" : "d-flex px-3 py-2 align-items-center menu-item"}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.2" d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" fill={window.location.pathname.startsWith('/admin/user') ? "#FFFFFF" : "#1A1111"} />
                                    <path d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z" stroke={window.location.pathname.startsWith('/admin/user') ? "#FFFFFF" : "#1A1111"} strokeWidth="2" strokeMiterlimit="10"/>
                                    <path d="M2.90515 20.2491C3.82724 18.6531 5.1531 17.3278 6.74954 16.4064C8.34598 15.485 10.1568 15 12 15C13.8433 15 15.6541 15.4851 17.2505 16.4065C18.8469 17.3279 20.1728 18.6533 21.0948 20.2493" stroke={window.location.pathname.startsWith('/admin/user') ? "#FFFFFF" : "#1A1111"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <h5 className='ms-2 mt-2 poppins-regular'> Manajemen User</h5>
                            </div>
                        </a>
                        <a href="/admin/produk">
                            <div className={window.location.pathname.startsWith('/admin/produk') ? "d-flex px-3 py-2 align-items-center menu-item active" : "d-flex px-3 py-2 align-items-center menu-item"}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path opacity="0.2" d="M7.5 20.25H4.5C4.30109 20.25 4.11032 20.171 3.96967 20.0303C3.82902 19.8897 3.75 19.6989 3.75 19.5V4.5C3.75 4.30109 3.82902 4.11032 3.96967 3.96967C4.11032 3.82902 4.30109 3.75 4.5 3.75H7.5V20.25Z" fill={window.location.pathname.startsWith('/admin/produk') ? "#FFFFFF" : "#1A1111"} />
                                    <path d="M10.5 10.5H16.5" stroke={window.location.pathname.startsWith('/admin/produk') ? "#FFFFFF" : "#1A1111"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10.5 13.5H16.5" stroke={window.location.pathname.startsWith('/admin/produk') ? "#FFFFFF" : "#1A1111"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M19.5 3.75H4.5C4.08579 3.75 3.75 4.08579 3.75 4.5V19.5C3.75 19.9142 4.08579 20.25 4.5 20.25H19.5C19.9142 20.25 20.25 19.9142 20.25 19.5V4.5C20.25 4.08579 19.9142 3.75 19.5 3.75Z" stroke={window.location.pathname.startsWith('/admin/produk') ? "#FFFFFF" : "#1A1111"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M7.5 3.75V20.25" stroke={window.location.pathname.startsWith('/admin/produk') ? "#FFFFFF" : "#1A1111"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <h5 className='ms-2 mt-2 poppins-regular'> Manajemen Produk</h5>
                            </div>
                        </a>
                    </ScrollContainer>
                </div>
                {/* MAIN CONTENT SECTION */}
                <div id="mainContent">
                    <ScrollContainer>
                        {props.children}
                    </ScrollContainer>
                </div>
            </div>
        </>
    )
}

export default AdminPage