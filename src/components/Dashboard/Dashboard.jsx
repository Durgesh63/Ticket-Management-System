import axios from "axios"
import { BlockUI } from "primereact"
import { useEffect, useState } from "react"

export const Dashboard = () => {
    const [tools, setTools] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        toolListApiCall()
    }, [])

    function toolListApiCall() {
        try {
            setLoading(true)
            axios.get('http://localhost:8080/api/v1/users/tools/list', {
                headers: {
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('auth'))?.accessToken
                }
            }).then((res) => {
                setLoading(false)
                setTools(res.data.data.docs)
            }).catch(() => {
                setLoading(false)
            })
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }

    function IssueTool(id) {
        try {
            setLoading(true);
            // eslint-disable-next-line no-inner-declarations
            function encodeFormData(data) {

                return Object.keys(data)
                    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
                    .join('&');
            }
            const postData = {
                toolID: id,
            }

            axios.post('http://localhost:8080/api/v1/users/tools/Issue', encodeFormData(postData),

                {
                    headers: {
                        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('auth'))?.accessToken
                    }
                }

            ).then(() => {
                setLoading(false)
                toolListApiCall()
            }).catch(() => {
                setLoading(false)
            })
        } catch (error) {
            setLoading(false)

            console.log(error);
        }
    }

    return (
        <><div>
            <BlockUI blocked={loading} fullScreen template={<i className="pi pi-spin pi-spinner" style={{ 'fontSize': '3rem' }} />} />

            <div className="row mt-3 mx-3">
                {tools && Array.isArray(tools) && tools.map((item) => {
                    console.log(item);
                    return <>
                        <div className="col-3">
                            <div className="card" style={{ width: "18rem" }}>
                                <img src={item.image} className="card-img-top" alt={item.title} />
                                <div className="card-body">
                                    <h5 className="card-title">{item.title}</h5>
                                    <p className="card-text">
                                        Quantity Available: <b>{item.quantityCount}</b>  <br />
                                        Category:  <b>{item.toolsCategory}</b>
                                    </p>
                                    <div className="btn btn-primary" onClick={() => {
                                        IssueTool(item._id)
                                    }}>
                                        Issue Tool
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                })}

            </div>


        </div></>
    )
}
