import axios from "axios"
import { useNavigate } from "react-router-dom";

export const Header = () => {
    const navigator = useNavigate()
    function logout() {
        try {
            axios.post('http://localhost:8080/api/v1/logout', "", {
                headers: {
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('auth'))?.accessToken
                }
            }).then(() => {
                localStorage.removeItem("auth")
                navigator("/")
            })
        } catch (error) {
            console.log(error);
        }

    }
    return (
        <><nav className="navbar navbar-light bg-light">
            <div className="container-fluid flex">
                <div className="navbar-brand">
                    Navbar
                </div>

                {localStorage.getItem("auth") &&

                    <div className="flex " style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>

                        <div style={{ cursor: "pointer" }} className="mx-4" onClick={() => {
                            navigator("/add-tool")
                        }}>
                            Add Tools
                        </div>
                        <div style={{ cursor: "pointer" }} className="mx-4" onClick={() => {
                            navigator("/dashboard")
                        }}>
                            Tools
                        </div>
                        <div style={{ cursor: "pointer" }} className="mx-4" onClick={() => {
                            navigator("/user")
                        }}>
                            Assigned Tools
                        </div>
                        <div style={{ cursor: "pointer" }} onClick={() => {
                            logout()
                        }}>
                            Logout
                        </div>

                    </div>
                }

            </div>
        </nav>
        </>
    )
}
