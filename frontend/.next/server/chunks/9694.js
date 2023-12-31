exports.id = 9694;
exports.ids = [9694];
exports.modules = {

/***/ 11017:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(71031);
/* harmony import */ var _hookform_resolvers_yup__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(89780);
/* harmony import */ var yup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(58952);
/* harmony import */ var components_common_form__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(26560);
/* harmony import */ var components_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(78957);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(59483);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var components_common_form_Input_Input__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(38346);
/* harmony import */ var _app_admin_components_UploadImageComponent_UploadImage__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(36829);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(55971);
/* harmony import */ var _PartnersForm_module_scss__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(10065);
/* harmony import */ var _PartnersForm_module_scss__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_PartnersForm_module_scss__WEBPACK_IMPORTED_MODULE_11__);
/* __next_internal_client_entry_do_not_use__ default auto */ 











const schema = yup__WEBPACK_IMPORTED_MODULE_2__/* .object */ .Ry({
    name: components_common_form__WEBPACK_IMPORTED_MODULE_3__/* .validation */ .Uf.partnerInput,
    link: components_common_form__WEBPACK_IMPORTED_MODULE_3__/* .validation */ .Uf.url
});
const PartnersForm = ({ id })=>{
    const { partnerById, partnerLoading, fetchError } = (0,_hooks__WEBPACK_IMPORTED_MODULE_8__/* .useQueryPartnerById */ .g8)(id);
    const [selectedFile, setSelectedFile] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [initialImg, setInitialImg] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { addPartner, isPendingAdd, isAddSuccess, setIsAddSuccess } = (0,_hooks__WEBPACK_IMPORTED_MODULE_8__/* .useAddPartner */ .Kr)();
    const { editPartner, isEditSuccess, setIsEditSuccess, isPendingEdit } = (0,_hooks__WEBPACK_IMPORTED_MODULE_8__/* .useEditPartner */ .$p)();
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (partnerById) {
            setInitialImg(partnerById.img);
        }
    }, [
        partnerById
    ]);
    const handleFileChange = (file)=>{
        setSelectedFile(file);
    };
    const defaultValues = {
        name: "",
        link: "https://"
    };
    const { control, reset, handleSubmit, resetField, setValue } = (0,react_hook_form__WEBPACK_IMPORTED_MODULE_9__/* .useForm */ .cI)({
        defaultValues,
        resolver: (0,_hookform_resolvers_yup__WEBPACK_IMPORTED_MODULE_10__/* .yupResolver */ .X)(schema),
        mode: "onChange"
    });
    const { errors, isDirty, isValid, dirtyFields } = (0,react_hook_form__WEBPACK_IMPORTED_MODULE_9__/* .useFormState */ .cl)({
        control
    });
    const isImage = initialImg || selectedFile;
    const isDisabled = Object.keys(errors).length > 0 || !isValid || !isImage;
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_5__.useRouter)();
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (partnerById) {
            reset({
                name: partnerById.name,
                link: partnerById.link
            });
        }
    }, [
        partnerById,
        reset
    ]);
    const submit = (data)=>{
        const formData = new FormData();
        if (id) {
            if (dirtyFields.name) formData.append("name", data.name);
            if (dirtyFields.link) formData.append("link", data.link);
            if (selectedFile) formData.append("img", selectedFile);
            editPartner({
                id,
                formData
            });
        } else {
            formData.append("name", data.name);
            formData.append("link", data.link);
            if (selectedFile) formData.append("img", selectedFile);
            addPartner(formData);
        }
    };
    return partnerLoading ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common__WEBPACK_IMPORTED_MODULE_4__/* .Spinner */ .$j, {
        className: (_PartnersForm_module_scss__WEBPACK_IMPORTED_MODULE_11___default().spinner)
    }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", {
        className: (_PartnersForm_module_scss__WEBPACK_IMPORTED_MODULE_11___default().form),
        onSubmit: handleSubmit(submit),
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_PartnersForm_module_scss__WEBPACK_IMPORTED_MODULE_11___default().inputs),
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: (_PartnersForm_module_scss__WEBPACK_IMPORTED_MODULE_11___default().textInputs),
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common_form_Input_Input__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {
                                name: "name",
                                control: control,
                                label: "Назва",
                                placeholder: "Введіть назву",
                                resetField: ()=>resetField("name")
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common_form_Input_Input__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {
                                name: "link",
                                control: control,
                                label: "Посилання",
                                placeholder: "Введіть посилання",
                                resetField: ()=>resetField("link")
                            })
                        ]
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components_UploadImageComponent_UploadImage__WEBPACK_IMPORTED_MODULE_7__["default"], {
                        onFileChange: handleFileChange,
                        file: selectedFile,
                        initialImg: initialImg,
                        setInitialImg: setInitialImg,
                        page: "partners"
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_PartnersForm_module_scss__WEBPACK_IMPORTED_MODULE_11___default().actions),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common__WEBPACK_IMPORTED_MODULE_4__/* .Button */ .zx, {
                        variant: "outline",
                        color: "primary",
                        size: "small",
                        onClick: ()=>setIsOpen(true),
                        disabled: isDisabled || isPendingAdd || isPendingEdit,
                        children: "Скасувати"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common__WEBPACK_IMPORTED_MODULE_4__/* .Button */ .zx, {
                        type: "submit",
                        variant: "filled",
                        color: "secondary",
                        size: "small",
                        disabled: isDisabled || isPendingAdd || isPendingEdit,
                        isLoading: isPendingAdd || isPendingEdit,
                        children: id ? "Зберегти" : "Додати"
                    })
                ]
            }),
            isOpen && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common__WEBPACK_IMPORTED_MODULE_4__/* .Modal */ .u_, {
                type: "question",
                message: "Ви точно хочете скасувати зміни? Вони не будуть збережені",
                title: "Скасувати зміни",
                active: isOpen,
                setActive: ()=>setIsOpen(false),
                successFnc: ()=>router.back()
            }),
            (isAddSuccess || isEditSuccess) && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common__WEBPACK_IMPORTED_MODULE_4__/* .Modal */ .u_, {
                type: "success",
                message: isAddSuccess ? "Партнера додано" : "Ваші зміни успішно збережено",
                title: isAddSuccess ? "Успіх!" : "Збережено!",
                active: isAddSuccess || isEditSuccess,
                setActive: ()=>{
                    if (isAddSuccess) {
                        setIsAddSuccess(false);
                    } else {
                        setIsEditSuccess(false);
                    }
                    router.back();
                }
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PartnersForm);


/***/ }),

/***/ 56391:
/***/ ((module) => {

// Exports
module.exports = {
	"wrapper": "AddPartner_wrapper__fVI6O"
};


/***/ }),

/***/ 10065:
/***/ ((module) => {

// Exports
module.exports = {
	"form": "PartnersForm_form__4nKtA",
	"inputs": "PartnersForm_inputs__V3Zs6",
	"textInputs": "PartnersForm_textInputs__RSRhr",
	"actions": "PartnersForm_actions__sXX0d",
	"spinner": "PartnersForm_spinner__cE67U"
};


/***/ })

};
;