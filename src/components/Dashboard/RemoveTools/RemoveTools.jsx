import axios from "axios"
import { BlockUI } from "primereact"
import { useEffect, useState } from "react"

export const RemoveTools = () => {
    const [tools, setTools] = useState(null)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        callTools()
    }, [])



    function callTools() {
        try {
            setLoading(true)
            axios.get('http://localhost:8080/api/v1/users/tools/Issue/list', {
                headers: {

                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('auth'))?.accessToken
                }
            }).then((res) => {
                setLoading(false)
                setTools(res.data.data)
                console.log(res.data.data);
            }).catch(() => {
                setLoading(false)
            })
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }


    function ReturnIssueTool(id) {
        try {
            setLoading(true)

            // eslint-disable-next-line no-inner-declarations
            function encodeFormData(data) {

                return Object.keys(data)
                    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
                    .join('&');
            }
            const postData = {
                id: id,
            }
            axios.post('http://localhost:8080/api/v1/users/tools/return-tool', encodeFormData(postData),

                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('auth'))?.accessToken
                    }
                }

            ).then(() => {
                setLoading(false)
                callTools()
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
                    return <>
                        <div className="col-3">
                            <div className="card" style={{ width: "18rem" }}>
                                <img src={item.tools?.images?.imageurl} className="card-img-top" alt={item?.tools?.title} />
                                <div className="card-body">
                                    <h5 className="card-title">{item?.tools?.title}</h5>
                                    <p className="card-text">
                                        Quantity: <b>{item?.available}</b>  <br />
                                        Category:  <b>{item?.tools?.toolsCategory}</b>
                                    </p>
                                    <div className="btn btn-primary" onClick={() => {
                                        ReturnIssueTool(item.transectionId[0])
                                    }}>
                                        Return Tool
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
