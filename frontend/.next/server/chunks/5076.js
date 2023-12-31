exports.id = 5076;
exports.ids = [5076];
exports.modules = {

/***/ 90450:
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
/* harmony import */ var _BooksFrom_module_scss__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(32727);
/* harmony import */ var _BooksFrom_module_scss__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(_BooksFrom_module_scss__WEBPACK_IMPORTED_MODULE_11__);
/* __next_internal_client_entry_do_not_use__ default auto */ 











const schema = yup__WEBPACK_IMPORTED_MODULE_2__/* .object */ .Ry({
    title: components_common_form__WEBPACK_IMPORTED_MODULE_3__/* .validation */ .Uf.bookInput,
    author: components_common_form__WEBPACK_IMPORTED_MODULE_3__/* .validation */ .Uf.bookInput,
    is_recommended: components_common_form__WEBPACK_IMPORTED_MODULE_3__/* .validation */ .Uf.recommended
});
const BooksForm = ({ id })=>{
    const { bookById, bookLoading, fetchError } = (0,_hooks__WEBPACK_IMPORTED_MODULE_8__/* .useQueryBookById */ .LA)(id);
    const [selectedFile, setSelectedFile] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);
    const [initialImg, setInitialImg] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("");
    const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { addBook, isPendingAdd, isAddSuccess, setIsAddSuccess } = (0,_hooks__WEBPACK_IMPORTED_MODULE_8__/* .useAddBook */ .mi)();
    const { editBook, isEditSuccess, setIsEditSuccess, isPendingEdit } = (0,_hooks__WEBPACK_IMPORTED_MODULE_8__/* .useEditBook */ .VW)();
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (bookById) {
            setInitialImg(bookById.cover_image);
        }
    }, [
        bookById
    ]);
    const handleFileChange = (file)=>{
        setSelectedFile(file);
    };
    const defaultValues = {
        title: "",
        author: "",
        is_recommended: false
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
        if (bookById) {
            reset({
                title: bookById.title,
                author: bookById.author,
                is_recommended: bookById.is_recommended
            });
        }
    }, [
        bookById,
        reset
    ]);
    const submit = (data)=>{
        const formData = new FormData();
        if (id) {
            formData.append("id", id.toString());
            if (dirtyFields.title) {
                formData.append("title", data.title);
            }
            if (dirtyFields.author) {
                formData.append("author", data.author);
            }
            if (dirtyFields.is_recommended) {
                formData.append("is_recommended", data.is_recommended.toString());
            }
            if (selectedFile) {
                formData.append("cover_image", selectedFile);
            }
            editBook({
                id,
                formData
            });
        } else {
            formData.append("title", data.title);
            formData.append("author", data.author);
            formData.append("is_recommended", data.is_recommended.toString());
            if (selectedFile) formData.append("cover_image", selectedFile);
            addBook(formData);
        }
    };
    return bookLoading ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common__WEBPACK_IMPORTED_MODULE_4__/* .Spinner */ .$j, {
        className: (_BooksFrom_module_scss__WEBPACK_IMPORTED_MODULE_11___default().spinner)
    }) : /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("form", {
        className: (_BooksFrom_module_scss__WEBPACK_IMPORTED_MODULE_11___default().form),
        onSubmit: handleSubmit(submit),
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_BooksFrom_module_scss__WEBPACK_IMPORTED_MODULE_11___default().inputs),
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                        className: (_BooksFrom_module_scss__WEBPACK_IMPORTED_MODULE_11___default().textInputs),
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common_form_Input_Input__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {
                                name: "title",
                                control: control,
                                label: "Назва книги",
                                placeholder: "Введіть назву книги",
                                resetField: ()=>resetField("title")
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common_form_Input_Input__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .Z, {
                                name: "author",
                                control: control,
                                label: "Автор книги",
                                placeholder: "Введіть автора книги",
                                resetField: ()=>resetField("author")
                            }),
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common__WEBPACK_IMPORTED_MODULE_4__/* .Checkbox */ .XZ, {
                                name: "is_recommended",
                                control: control,
                                children: "Рекомендовані книжки"
                            })
                        ]
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components_UploadImageComponent_UploadImage__WEBPACK_IMPORTED_MODULE_7__["default"], {
                        onFileChange: handleFileChange,
                        file: selectedFile,
                        initialImg: initialImg,
                        setInitialImg: setInitialImg,
                        page: "books"
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_BooksFrom_module_scss__WEBPACK_IMPORTED_MODULE_11___default().actions),
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
                message: isAddSuccess ? "Книгу додано" : "Ваші зміни успішно збережено",
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
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (BooksForm);


/***/ }),

/***/ 19247:
/***/ ((module) => {

// Exports
module.exports = {
	"wrapper": "AddBooks_wrapper__4CddH"
};


/***/ }),

/***/ 32727:
/***/ ((module) => {

// Exports
module.exports = {
	"form": "BooksFrom_form__Z8dP4",
	"inputs": "BooksFrom_inputs__WECa9",
	"textInputs": "BooksFrom_textInputs__Hd1Tg",
	"actions": "BooksFrom_actions__R4xnX",
	"spinner": "BooksFrom_spinner__o7YFg"
};


/***/ })

};
;