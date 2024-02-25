import { useEffect, useState } from "react";
import AdminPage from "../../Components/AdminPage";
import Loading from "../../Components/Loading";
import { getApiBaseUrl, getClientBaseURL } from "../../Utils/helper";

const Dashboard = () => {
    interface SummaryData {
        total_user: number,
        total_user_active: number,
        total_product: number,
        total_product_active: number
    }
    interface ProductTerbaru {
        gambar: string,
        nama: string,
        created_at: string,
        harga: number | string
    }
    const [summaryData, setSummaryData] = useState<SummaryData>({} as SummaryData)
    const [productTerbaru, setProductTerbaru] = useState<ProductTerbaru[]>([] as ProductTerbaru[])

    const actionGetDataSummary = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${getApiBaseUrl()}/dashboard`, {
                method: "GET",
                credentials: 'include',
                mode: 'cors',
            })
            if(response.status == 200) {
                let result = await response.json()
                setSummaryData(prevState => ({
                    ...result['data']
                }))
            }
        }
        catch(error) {
        }
        setIsLoading(false)
    }

    // {{BASE_URL}}/product?latest=TRUE
    const actionGetDataLatestProduct = async () => {
        setIsLoading(true)
        try {
            const response = await fetch(`${getApiBaseUrl()}/product?latest=TRUE&take=10&skip=1`, {
                method: "GET",
                credentials: 'include',
                mode: 'cors',
            })
            if(response.status == 200) {
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
                    const formattedNumber = number.toLocaleString('en-US', {minimumFractionDigits: 0, useGrouping: true,}).replace(/,/g, '.');
                    data[index]['harga'] = formattedNumber
                })

                setProductTerbaru(data as ProductTerbaru[])
            }
        }
        catch(error) {
        }
        setIsLoading(false)
    }

    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        actionGetDataSummary()
        actionGetDataLatestProduct()
    }, [])
    return (
        <AdminPage>
            <Loading isLoading={isLoading} />
            <div className="container-fluid">
                <div className="px-2 py-3">
                    <h3 className="poppins-regular">Dashboard</h3>
                </div>
                <div className="mt-3">
                    <div className="row w-100">
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3 mb-3">
                            <div className="summary-card">
                                <div>
                                    <h5 className="poppins-regular color-dark-gray">Jumlah User</h5>
                                    <h1 className="poppins-regular">{summaryData['total_user']} User</h1>
                                </div>
                                <div className="summary-ellipsis first"></div>
                                <div className="summary-ellipsis second"></div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3 mb-3">
                            <div className="summary-card">
                                <div>
                                    <h5 className="poppins-regular color-dark-gray">Jumlah User Aktif</h5>
                                    <h1 className="poppins-regular">{summaryData['total_user_active']} User</h1>
                                </div>
                                <div className="summary-ellipsis first"></div>
                                <div className="summary-ellipsis second"></div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3 mb-3">
                            <div className="summary-card">
                                <div>
                                    <h5 className="poppins-regular color-dark-gray">Jumlah Produk</h5>
                                    <h1 className="poppins-regular">{summaryData['total_product']} Produk</h1>
                                </div>
                                <div className="summary-ellipsis first"></div>
                                <div className="summary-ellipsis second"></div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3 mb-3">
                            <div className="summary-card">
                                <div>
                                    <h5 className="poppins-regular color-dark-gray">Jumlah Produk Aktif</h5>
                                    <h1 className="poppins-regular">{summaryData['total_product_active']} Produk</h1>
                                </div>
                                <div className="summary-ellipsis first"></div>
                                <div className="summary-ellipsis second"></div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-5 w-100 mb-4">
                        <div className="col-12 col-lg-9">
                            <div className="card rounded-3 border-0">
                                <div className="card-body rounded-3">
                                    <h4>Produk Terbaru</h4>
                                    <div className="w-100 mt-4 px-2">
                                        <div className="row bg-color-lightblue px-2 py-2 rounded">
                                            <div className="col-4">
                                                <h6 className="poppins-regular text-white mb-0">Produk</h6>
                                            </div>
                                            <div className="col-4">
                                                <h6 className="poppins-regular text-center text-white mb-0">Tanggal Dibuat</h6>
                                            </div>
                                            <div className="col-4">
                                                <h6 className="poppins-regular text-center text-white mb-0">Harga (Rp)</h6>
                                            </div>
                                        </div>
                                        {
                                            productTerbaru.map((value: ProductTerbaru, index: number) => {
                                                return (
                                                    <div className="row mt-3 px-2 py-2 rounded" key={index}>
                                                        <div className="col-4">
                                                            <div className="d-flex align-items-center">
                                                                <div className="me-4">
                                                                    <img src={`${getClientBaseURL()}/images/${value['gambar']}`} width="32" alt="" />
                                                                </div>
                                                                <h6 className="poppins-regular mb-0">{value['nama']}</h6>
                                                            </div>
                                                        </div>
                                                        <div className="col-4">
                                                            <h6 className="poppins-regular color-light-gray text-center mb-0">{value['created_at']}</h6>
                                                        </div>
                                                        <div className="col-4">
                                                            <h6 className="poppins-regular text-center mb-0">Rp. {value['harga']}</h6>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminPage>
    )
}

export default Dashboard