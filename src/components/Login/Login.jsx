import axios from 'axios';
import { useFormik } from 'formik';
import { Button, InputText, Password, classNames } from 'primereact';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.css"
export const Login = () => {
    const navigate = useNavigate()
    const [laoding, setLaoding] = useState(false)
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validate: (data) => {
            let errors = {};

            if (!data.email) {
                errors.email = 'Email is required.';
            }
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
                errors.email = 'Invalid email address. E.g. example@email.com';
            }

            if (!data.password) {
                errors.password = 'Password is required.';
            }
            return errors;
        },
        onSubmit: (data) => {

            Login(data);

        }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };


    function Login(data) {
        function encodeFormData(data) {
            return Object.keys(data)
                .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
                .join('&');
        }
        setLaoding(true)
        const postData = {
            email: data.email,
            password: data.password
        }
        axios.post('http://localhost:8080/api/v1/login', encodeFormData(postData), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
            .then((res) => {
                setLaoding(false)

                localStorage.setItem("auth", JSON.stringify(res.data.data))
                navigate("/dashboard")
                formik.resetForm();
            }).catch((err) => {
                setLaoding(false)

                console.log(err);
            })
    }



    return (
        <>
            <div className="form-demo margin-custom mt-5" >
                <div className="flex justify-content-center">
                    <div className="card p-3">
                        <h5 className="text-center">Login</h5>
                        <form onSubmit={formik.handleSubmit} className="p-fluid">
                            <div className="field mt-2">
                                <span className="p-float-label p-input-icon-right">
                                    <i className="pi pi-envelope" />
                                    <InputText id="email" name="email" value={formik.values.email} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('email') })} />
                                    <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid('email') })}>Email*</label>
                                </span>
                                {getFormErrorMessage('email')}
                            </div>
                            <div className="field mt-4">
                                <span className="p-float-label">
                                    <Password id="password" name="password" value={formik.values.password} onChange={formik.handleChange} toggleMask
                                        className={classNames({ 'p-invalid': isFormFieldValid('password') })} feedback={false} />
                                    <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid('password') })}>Password*</label>
                                </span>
                                {getFormErrorMessage('password')}
                            </div>

                            <Button type="submit" label="Submit" loading={laoding} className="my-2" />
                            <div className='text-primary text-start' style={{ cursor: "pointer" }} onClick={() => {
                                navigate("/register")
                            }}>
                                Register User
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}
