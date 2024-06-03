// import React, { useEffect, useState } from 'react';
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import { classNames } from "primereact/utils";
import { BlockUI, FileUpload, InputNumber } from "primereact";
import { useRef, useState } from "react";
import axios from "axios";


const UserForm = () => {
  const image = useRef(null);
  const [loading, setLoading] = useState(false)
  const formik = useFormik({
    initialValues: {
      title: "",
      toolCategory: "",
      quantity: null,
      file: null
    },
    validate: (data) => {
      let errors = {};

      if (!data.title) {
        errors.title = "Title is required.";
      }
      if (!data.toolCategory) {
        errors.toolCategory = "Tool Category is required.";
      }
      if (!data.quantity) {
        errors.quantity = "Quantity is required.";
      }

      return errors;
    },
    onSubmit: (data) => {
      CreateTools(data);
    },
  });

  const isFormFieldValid = (name) =>
    !!(formik.touched[name] && formik.errors[name]);
  const getFormErrorMessage = (name) => {
    return (
      isFormFieldValid(name) && (
        <small className="p-error">{formik.errors[name]}</small>
      )
    );
  };

  function CreateTools(data) {
    setLoading(true);
    const formData = new FormData()
    formData.append('title', data.title)
    formData.append('toolsCategory', data.toolCategory)
    formData.append('quantity', data.quantity)
    formData.append('picture', image.current.getFiles()[0])
    axios.post('http://localhost:8080/api/v1/users/add/tools', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('auth'))?.accessToken

      }
    }).then(() => {
      setLoading(false);
      image.current.clear()
      formik.resetForm();

    }).catch((err) => {
      setLoading(false);

      console.log(err)
    })
  }

  return (


    <div className="form-demo mt-3" style={{ width: "600px", marginLeft: "350px", marginRight: "30px" }} >
      <BlockUI blocked={loading} fullScreen template={<i className="pi pi-spin pi-spinner" style={{ 'fontSize': '3rem' }} />} />

      <div className="flex justify-content-center">
        <div className="card">
          <h5 className="text-center">Add Tools</h5>
          <form onSubmit={formik.handleSubmit} className="p-fluid">
            <div className="field">
              <span className="p-float-label">
                <InputText
                  id="title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  autoFocus
                  className={classNames({
                    "p-invalid": isFormFieldValid("title"),
                  })}
                />
                <label
                  htmlFor="title"
                  className={classNames({
                    "p-error": isFormFieldValid("title"),
                  })}
                >
                  Title*
                </label>
              </span>
              {getFormErrorMessage("title")}
            </div>
            <div className="field">
              <span className="p-float-label">
                <InputText
                  id="toolCategory"
                  name="toolCategory"
                  value={formik.values.toolCategory}
                  onChange={formik.handleChange}
                  autoFocus
                  className={classNames({
                    "p-invalid": isFormFieldValid("toolCategory"),
                  })}
                />
                <label
                  htmlFor="toolCategory"
                  className={classNames({
                    "p-error": isFormFieldValid("toolCategory"),
                  })}
                >
                  Tool Category*
                </label>
              </span>
              {getFormErrorMessage("toolCategory")}
            </div>

            <div className="field">
              <span className="p-float-label">
                <InputNumber
                  inputId="quantity"
                  name="quantity"
                  value={formik.values.quantity}
                  onValueChange={formik.handleChange}
                  className={classNames({
                    "p-invalid": isFormFieldValid("quantity"),
                  })}
                />
                <label
                  htmlFor="quantity"
                  className={classNames({
                    "p-error": isFormFieldValid("quantity"),
                  })}
                >
                  Quantity*
                </label>
              </span>
              {getFormErrorMessage("quantity")}
            </div>

            <div className="field">
              <span className="p-float-label">
                <FileUpload
                  inputId="image"
                  ref={image}
                  name="image"
                  mode="basic"
                  accept="image/*"
                  maxFileSize={1000000}

                // auto
                />

              </span>
              {/* {getFormErrorMessage("image")} */}
            </div>

            <Button
              type="submit"
              label="Submit"
              className="mt-2"
              style={{ width: "68%" }}
              loading={loading}
            />
          </form>
        </div>
      </div>
    </div>
  );
};
export default UserForm;
