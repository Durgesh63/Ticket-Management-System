import axios from 'axios';
import { useFormik } from 'formik';
import { Button, FileUpload, InputNumber, InputText, Password, classNames } from 'primereact';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { useRef, useState } from 'react';
import "../Login/login.css"

export const Register = () => {
    const navigate = useNavigate()
    const image = useRef(null);

    const toast = useRef(null);
    const [loading, setLoading] = useState(false)
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
            phoneNo: "",
            userType: '',
            picture: ''
        },
        validate: (data) => {
            let errors = {};
            if (!data.name) {
                errors.name = 'Name is required.';
            }
            if (!data.email) {
                errors.email = 'Email is required.';
            }
            else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
                errors.email = 'Invalid email address. E.g. example@email.com';
            }
            if (!data.password) {
                errors.password = 'Password is required.';
            }
            if (!data.phoneNo) {
                errors.phoneNo = 'PhoneNo is required.';
            }
            return errors;
        },
        onSubmit: (data) => {
            Register(data)
        }
    });

    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);
    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };


    function Register(data) {
        setLoading(true);
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('password', data.password)
        formData.append('mobileNo', data.phoneNo)
        formData.append('userType', data.userType)
        formData.append('picture', image.current.getFiles()[0])
        axios.post('http://localhost:8080/api/v1/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then((res) => {
            setLoading(false);

            toast.current.show({ severity: 'success', summary: 'Register successfully', detail: res.data.message, life: 3000 });
            image.current.clear()
            formik.resetForm();
            navigate("/")

        }).catch((err) => {
            setLoading(false);

            console.log(err)
        })
    }



    return (
        <>
            <Toast ref={toast} />
            <div className="form-demo margin-custom mt-5" >
                <div className="flex justify-content-center">
                    <div className="card">
                        <h5 className="text-center">Register</h5>
                        <form onSubmit={formik.handleSubmit} className="p-fluid">
                            <div className="field">
                                <span className="p-float-label">
                                    <InputText id="name" name="name" value={formik.values.name} onChange={formik.handleChange} autoFocus className={classNames({ 'p-invalid': isFormFieldValid('name') })} />
                                    <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid('name') })}>Name*</label>
                                </span>
                                {getFormErrorMessage('name')}
                            </div>
                            <div className="field mt-2">
                                <span className="p-float-label p-input-icon-right">
                                    <i className="pi pi-envelope" />
                                    <InputText id="email" name="email" value={formik.values.email} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('email') })} />
                                    <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid('email') })}>Email*</label>
                                </span>
                                {getFormErrorMessage('email')}
                            </div>
                            <div className="field mt-3">
                                <span className="p-float-label">
                                    <Password id="password" name="password" value={formik.values.password} onChange={formik.handleChange} toggleMask
                                        className={classNames({ 'p-invalid': isFormFieldValid('password') })} feedback={false} />
                                    <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid('password') })}>Password*</label>
                                </span>
                                {getFormErrorMessage('password')}
                            </div>
                            <div className="field mt-3">
                                <span className="p-float-label">
                                    <InputNumber inputId="integeronly" id='phoneNo' name='phoneNo' value={formik.values.phoneNo} onValueChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('phoneNo') })} useGrouping={false} />

                                    <label htmlFor="phoneNo" className={classNames({ 'p-error': isFormFieldValid('phoneNo') })}>Phone Number*</label>
                                </span>
                                {getFormErrorMessage('phoneNo')}
                            </div>
                            <div className="field mt-2">
                                <span className="p-float-label">
                                    <InputText id="userType" name="userType" value={formik.values.userType} onChange={formik.handleChange} className={classNames({ 'p-invalid': isFormFieldValid('userType') })} />
                                    <label htmlFor="userType" className={classNames({ 'p-error': isFormFieldValid('userType') })}>User Type*</label>
                                </span>
                                {getFormErrorMessage('userType')}
                            </div>
                            <div className="field mt-2">
                                <FileUpload
                                    inputId="image"
                                    ref={image}
                                    name="image"
                                    mode="basic"
                                    accept="image/*"
                                    maxFileSize={1000000}

                                // auto
                                />
                            </div>

                            <Button type="submit" label="Submit" loading={loading} className="my-2" />
                            <div className='text-primary text-start' style={{ cursor: "pointer" }} onClick={() => {
                                navigate("/")
                            }}>
                                Login
                            </div>
                        </form>
                    </div>
                </div >
            </div ></>
    )
}
