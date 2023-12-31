exports.id = 3256;
exports.ids = [3256];
exports.modules = {

/***/ 63138:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 7649, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 27977, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 13189));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 58929));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 65250))

/***/ }),

/***/ 3656:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 13123))

/***/ }),

/***/ 44798:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ QuizzesForm_QuizzesForm)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./src/components/common/index.ts + 3 modules
var common = __webpack_require__(78957);
// EXTERNAL MODULE: ./node_modules/react-hook-form/dist/index.esm.mjs
var index_esm = __webpack_require__(71031);
// EXTERNAL MODULE: ./node_modules/@hookform/resolvers/yup/dist/yup.mjs + 1 modules
var yup = __webpack_require__(89780);
;// CONCATENATED MODULE: ./src/app/(admin)/admin/quizzes/constants/defaultValues.ts
const defaultValuesForm = {
    ...[
        ...Array(5)
    ].reduce((acc, _, index)=>{
        acc[`question_${index}`] = "";
        acc[`question_${index}_isTrue`] = "";
        for(let j = 0; j < 3; j++){
            acc[`question_${index}_answer_${j}`] = "";
        }
        return acc;
    }, {})
};

;// CONCATENATED MODULE: ./src/app/(admin)/admin/quizzes/hooks/useDefaultValues.ts
/* __next_internal_client_entry_do_not_use__ useDefaultValues auto */ 

const useDefaultValues = (quizById)=>{
    const [defaultValues, setDefaultValues] = (0,react_.useState)(defaultValuesForm);
    const findTrueAnswer = (questionIndex)=>{
        const { questions } = quizById ?? {};
        const { answers } = questions?.[questionIndex] ?? {};
        if (!quizById || !quizById.questions || !quizById.questions[questionIndex]) {
            return null;
        }
        if (answers) {
            for(let i = 0; i < answers.length; i++){
                if (answers[i].is_true) {
                    return `answer_${i}`;
                }
            }
        }
        return null;
    };
    (0,react_.useEffect)(()=>{
        if (quizById && quizById.questions) {
            const newDefaultValues = {};
            quizById.questions.forEach((question, i)=>{
                newDefaultValues[`question_${i}`] = question.text;
                newDefaultValues[`question_${i}_isTrue`] = findTrueAnswer(i);
                question.answers.forEach((answer, j)=>{
                    newDefaultValues[`question_${i}_answer_${j}`] = answer.text;
                    newDefaultValues[`question_${i}_answer_${j}_isTrue`] = answer.is_true;
                });
            });
            setDefaultValues(newDefaultValues);
        }
    }, [
        quizById
    ]);
    return defaultValues;
};

// EXTERNAL MODULE: ./src/hooks/index.ts + 4 modules
var hooks = __webpack_require__(55971);
;// CONCATENATED MODULE: ./src/app/(admin)/admin/quizzes/utils/transformData.ts
const transformData = (formData)=>{
    const transformedData = [];
    for(let i = 0; i < 5; i++){
        const questionData = {
            text: formData[`question_${i}`],
            answers: []
        };
        for(let j = 0; j < 3; j++){
            questionData.answers.push({
                is_true: formData[`question_${i}_isTrue`] === `answer_${j}`,
                text: formData[`question_${i}_answer_${j}`]
            });
        }
        transformedData.push(questionData);
    }
    return transformedData;
};

// EXTERNAL MODULE: ./src/app/(admin)/components/index.ts + 12 modules
var components = __webpack_require__(23397);
// EXTERNAL MODULE: ./node_modules/use-debounce/dist/index.module.js
var index_module = __webpack_require__(20238);
// EXTERNAL MODULE: ./node_modules/yup/index.js
var node_modules_yup = __webpack_require__(58952);
;// CONCATENATED MODULE: ./src/app/(admin)/admin/quizzes/utils/validation/validationSchema.ts

const validationSchema = node_modules_yup/* object */.Ry().shape({
    ...[
        ...Array(5)
    ].reduce((acc, _, index)=>{
        acc[`question_${index}_isTrue`] = node_modules_yup/* string */.Z_().required(`Введіть відповідь`);
        for(let j = 0; j < 3; j++){
            acc[`question_${index}_answer_${j}`] = node_modules_yup/* string */.Z_().required(`Введіть відповідь`);
        }
        acc[`question_${index}`] = node_modules_yup/* string */.Z_().required(`Питання ${index + 1} є обов'язковим`).test("question-answers-check", `Оберіть правильний варіант відповіді для цього питання`, (value, { parent })=>Boolean(parent[`question_${index}_isTrue`]));
        return acc;
    }, {})
});

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/cjs/lucide-react.js
var lucide_react = __webpack_require__(64660);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js
var QueryClientProvider = __webpack_require__(32770);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/useMutation.js + 1 modules
var useMutation = __webpack_require__(41068);
;// CONCATENATED MODULE: ./src/hooks/Books/useAddQuizz.ts
/* __next_internal_client_entry_do_not_use__ useAddQuiz auto */ 


const useAddQuiz = ()=>{
    const axios = (0,hooks/* useAuthAxiosInstance */.Qd)();
    const queryClient = (0,QueryClientProvider.useQueryClient)();
    const [isAddSuccess, setIsAddSuccess] = (0,react_.useState)(false);
    const { mutate: addQuiz, isPending: isPendingAdd, error: addQuizError } = (0,useMutation.useMutation)({
        mutationFn: async ({ questionData, selectedFile })=>{
            const response = await axios.post("quizzes/", questionData);
            const quizID = response.data.data.id;
            const formDataReward = new FormData();
            formDataReward.append("reward", selectedFile);
            formDataReward.append("quiz", quizID);
            await axios.post("quizzes-rewards/", formDataReward, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    "books"
                ]
            });
            setIsAddSuccess(true);
        }
    });
    return {
        addQuiz,
        isAddSuccess,
        isPendingAdd,
        setIsAddSuccess,
        addQuizError
    };
};

// EXTERNAL MODULE: ./src/components/common/ModalActions/Modal.tsx
var Modal = __webpack_require__(13189);
;// CONCATENATED MODULE: ./src/hooks/Books/useEditQuiz.ts
/* __next_internal_client_entry_do_not_use__ useEditQuiz auto */ 


const useEditQuiz = ()=>{
    const axios = (0,hooks/* useAuthAxiosInstance */.Qd)();
    const queryClient = (0,QueryClientProvider.useQueryClient)();
    const [isEditSuccess, setIsEditSuccess] = (0,react_.useState)(false);
    const { mutate: editQuiz, isPending: isPendingEdit, error: editQuizError } = (0,useMutation.useMutation)({
        mutationFn: async ({ quizId, rewardId, questionData, selectedFile })=>{
            await axios.patch(`quizzes/${quizId}`, questionData);
            if (selectedFile) {
                const formDataReward = new FormData();
                formDataReward.append("reward", selectedFile);
                formDataReward.append("quiz", quizId.toString());
                await axios.patch(`quizzes-rewards/${rewardId}`, formDataReward, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            }
        },
        onSuccess: ()=>{
            queryClient.invalidateQueries({
                queryKey: [
                    "books"
                ]
            });
            setIsEditSuccess(true);
        }
    });
    return {
        editQuiz,
        isEditSuccess,
        isPendingEdit,
        setIsEditSuccess,
        editQuizError
    };
};

// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(59483);
// EXTERNAL MODULE: ./src/app/(admin)/admin/quizzes/components/QuizzesForm/QuizForm.module.scss
var QuizForm_module = __webpack_require__(91937);
var QuizForm_module_default = /*#__PURE__*/__webpack_require__.n(QuizForm_module);
;// CONCATENATED MODULE: ./src/app/(admin)/admin/quizzes/components/QuizzesForm/QuizzesForm.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 
















const QuizzesForm = ({ id })=>{
    const { quizById, quizLoading, fetchError: fetchErrorQuiz } = (0,hooks/* useQueryQuizById */.Mm)(id);
    const { books, fetchError: fetchErrorBooks } = (0,hooks/* useQueryQuizBooksAdmin */.Ye)(id);
    const defaultValues = useDefaultValues(quizById);
    const { addQuiz, addQuizError, isAddSuccess, setIsAddSuccess, isPendingAdd } = useAddQuiz();
    const { editQuiz, isEditSuccess, isPendingEdit, setIsEditSuccess, editQuizError } = useEditQuiz();
    const [selectedFile, setSelectedFile] = (0,react_.useState)(null);
    const [selectedValue, setSelectedValue] = (0,react_.useState)("");
    const [searchValue, setSearchValue] = (0,react_.useState)("");
    const [initialImg, setInitialImg] = (0,react_.useState)("");
    const [error, setError] = (0,react_.useState)("");
    const [fileError, setFileError] = (0,react_.useState)("");
    const router = (0,navigation.useRouter)();
    (0,react_.useEffect)(()=>{
        if (quizById) {
            setInitialImg(quizById.reward_as_url);
        }
    }, [
        quizById
    ]);
    const methods = (0,index_esm/* useForm */.cI)({
        defaultValues,
        resolver: (0,yup/* yupResolver */.X)(validationSchema)
    });
    (0,react_.useEffect)(()=>{
        if (quizById) methods.reset(defaultValues);
    }, [
        quizById,
        defaultValues
    ]);
    const onFileChange = (file)=>{
        setSelectedFile(file);
        setFileError("");
    };
    const submit = (data)=>{
        const transformedData = transformData(data);
        if (id && quizById) {
            const questionData = {
                questions: transformedData,
                book: quizById.book_info.id
            };
            editQuiz({
                quizId: id,
                rewardId: quizById.reward_id,
                questionData,
                selectedFile
            });
        } else {
            if (selectedFile && selectedValue && typeof selectedValue === "object" && "value" in selectedValue) {
                const book = selectedValue;
                const questionData = {
                    questions: transformedData,
                    book: book.value
                };
                addQuiz({
                    questionData,
                    selectedFile
                });
            } else {
                setError("Оберіть книгу");
                setFileError("Це поле об'язкове для заповнення");
            }
        }
    };
    const clearInput = ()=>{
        setSearchValue("");
        setSelectedValue("");
    };
    const handleInputChange = (value)=>{
        setSearchValue(value);
    };
    const debouncedHandleInputChange = (0,index_module/* useDebouncedCallback */.y1)(handleInputChange, 500);
    const handleChange = (selectedOption)=>{
        setSelectedValue(selectedOption);
        setError("");
    };
    const setActiveHandler = ()=>{
        if (isAddSuccess) {
            setIsAddSuccess(false);
        } else {
            setIsEditSuccess(false);
        }
        router.back();
    };
    if (fetchErrorQuiz || fetchErrorBooks) {
        return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
            className: (QuizForm_module_default()).error,
            children: [
                "Упс...Щось пішло не так:",
                " ",
                fetchErrorQuiz ? fetchErrorQuiz.message : fetchErrorBooks.message
            ]
        });
    }
    if (quizLoading) {
        return /*#__PURE__*/ jsx_runtime_.jsx(common/* Spinner */.$j, {
            className: (QuizForm_module_default()).spinner
        });
    }
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(index_esm/* FormProvider */.RV, {
        ...methods,
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("form", {
                className: (QuizForm_module_default()).form,
                onSubmit: methods.handleSubmit(submit),
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(components/* QuizBookInput */.mo, {
                        id: id,
                        options: books || [],
                        onChange: handleChange,
                        clearInput: clearInput,
                        selected: selectedValue,
                        label: "Назва книги",
                        onInputChange: debouncedHandleInputChange,
                        inputValue: searchValue,
                        error: error,
                        value: quizById && quizById.book_info.name
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: (QuizForm_module_default()).questions,
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(common/* Typography */.ZT, {
                                component: "h2",
                                variant: "h5",
                                children: "Запитання"
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx(components/* QuestionsList */._u, {})
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx(components/* UploadImage */.zv, {
                                onFileChange: onFileChange,
                                file: selectedFile,
                                initialImg: initialImg,
                                setInitialImg: setInitialImg,
                                page: "quizzes"
                            }),
                            (fileError || addQuizError || editQuizError) && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: (QuizForm_module_default()).errorMessage,
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* AlertCircle */.bG7, {
                                        width: 14,
                                        height: 14
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("span", {
                                        children: fileError || addQuizError?.message || editQuizError?.message
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(components/* FormButtons */.Au, {
                        isPendingAdd: isPendingAdd,
                        isPendingEdit: isPendingEdit
                    })
                ]
            }),
            (isAddSuccess || isEditSuccess) && /*#__PURE__*/ jsx_runtime_.jsx(Modal["default"], {
                type: "success",
                message: isAddSuccess ? "Вікторину додано" : "Ваші зміни успішно збережено",
                title: isAddSuccess ? "Успіх!" : "Збережено!",
                active: isAddSuccess || isEditSuccess,
                setActive: setActiveHandler
            })
        ]
    });
};
/* harmony default export */ const QuizzesForm_QuizzesForm = (QuizzesForm);


/***/ }),

/***/ 31761:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var components_common_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(26560);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(71031);
/* harmony import */ var _QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(91937);
/* harmony import */ var _QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_4__);
/* __next_internal_client_entry_do_not_use__ default auto */ 
/* eslint-disable jsx-a11y/label-has-associated-control */ 



const AnswerInput = ({ answerIndex, questionIndex })=>{
    const { control, resetField, register, trigger, setValue } = (0,react_hook_form__WEBPACK_IMPORTED_MODULE_3__/* .useFormContext */ .Gc)();
    const handleOnChange = async (event)=>{
        const selectedValue = event.target.value;
        setValue(`question_${questionIndex}_isTrue`, selectedValue);
        await trigger(`question_${questionIndex}`);
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_4___default().checkbox),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                        ...register(`question_${questionIndex}_isTrue`),
                        type: "radio",
                        id: `question_${questionIndex}_isTrue_${answerIndex}`,
                        value: `answer_${answerIndex}`,
                        onChange: handleOnChange
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                        htmlFor: `question_${questionIndex}_isTrue_${answerIndex}`
                    })
                ]
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common_form__WEBPACK_IMPORTED_MODULE_2__/* .Input */ .II, {
                name: `question_${questionIndex}_answer_${answerIndex}`,
                control: control,
                placeholder: "Введіть відповідь",
                label: `Варіант відповіді ${answerIndex + 1}`,
                resetField: ()=>resetField(`question_${questionIndex}_answer_${answerIndex}`),
                usage: "admin"
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AnswerInput);


/***/ }),

/***/ 72291:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var components_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(78957);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(59483);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _app_admin_admin_quizzes_components_QuizzesForm_QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(91937);
/* harmony import */ var _app_admin_admin_quizzes_components_QuizzesForm_QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_app_admin_admin_quizzes_components_QuizzesForm_QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_4__);
/* __next_internal_client_entry_do_not_use__ default auto */ 




const FormButtons = ({ isPendingAdd, isPendingEdit })=>{
    const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_3__.useRouter)();
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_app_admin_admin_quizzes_components_QuizzesForm_QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_4___default().actions),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common__WEBPACK_IMPORTED_MODULE_2__/* .Button */ .zx, {
                        variant: "outline",
                        color: "primary",
                        size: "small",
                        onClick: ()=>setIsOpen(true),
                        disabled: isPendingAdd || isPendingEdit,
                        children: "Скасувати"
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common__WEBPACK_IMPORTED_MODULE_2__/* .Button */ .zx, {
                        type: "submit",
                        variant: "filled",
                        color: "secondary",
                        size: "small",
                        isLoading: isPendingAdd || isPendingEdit,
                        disabled: isPendingAdd || isPendingEdit,
                        children: "Додати"
                    })
                ]
            }),
            isOpen && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common__WEBPACK_IMPORTED_MODULE_2__/* .Modal */ .u_, {
                type: "question",
                message: "Ви точно хочете скасувати зміни? Вони не будуть збережені",
                title: "Скасувати зміни",
                active: isOpen,
                setActive: ()=>setIsOpen(false),
                successFnc: ()=>router.back(),
                cancelButtonText: "Повернутись"
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormButtons);


/***/ }),

/***/ 5320:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var components_common_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(26560);
/* harmony import */ var _app_admin_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(23397);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(71031);
/* harmony import */ var _QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(91937);
/* harmony import */ var _QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_5__);
/* __next_internal_client_entry_do_not_use__ default auto */ 





const QuestionsList = ()=>{
    const { control, resetField } = (0,react_hook_form__WEBPACK_IMPORTED_MODULE_4__/* .useFormContext */ .Gc)();
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: (_QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_5___default()["questions-form"]),
        children: [
            ...Array(5)
        ].map((_, questionIndex)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_5___default().questionBlock),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: (_QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_5___default().question),
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common_form__WEBPACK_IMPORTED_MODULE_2__/* .Input */ .II, {
                            name: `question_${questionIndex}`,
                            control: control,
                            label: `Питання ${questionIndex + 1}`,
                            placeholder: "Введіть питання для вікторини",
                            resetField: ()=>resetField(`question_${questionIndex}`),
                            usage: "admin"
                        })
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: (_QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_5___default().answers),
                        children: [
                            ...Array(3)
                        ].map((_, answerIndex)=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                                className: (_QuizForm_module_scss__WEBPACK_IMPORTED_MODULE_5___default().answerBlock),
                                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_3__/* .AnswerInput */ .$d, {
                                    questionIndex: questionIndex,
                                    answerIndex: answerIndex
                                })
                            }, answerIndex))
                    })
                ]
            }, questionIndex))
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QuestionsList);


/***/ }),

/***/ 9891:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ BooksComponent_Books)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js
var QueryClientProvider = __webpack_require__(32770);
// EXTERNAL MODULE: ./src/app/(admin)/components/index.ts + 12 modules
var components = __webpack_require__(23397);
// EXTERNAL MODULE: ./node_modules/next-auth/react/index.js
var react = __webpack_require__(63370);
// EXTERNAL MODULE: ./src/hooks/index.ts + 4 modules
var hooks = __webpack_require__(55971);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/useQuery.js
var useQuery = __webpack_require__(88546);
// EXTERNAL MODULE: ./src/constants/api.ts
var api = __webpack_require__(30425);
;// CONCATENATED MODULE: ./src/hooks/Books/useQueryBooks.tsx




const useQueryBooks = ({ currentPage, searchValue, page, ...rest })=>{
    const { status } = (0,react.useSession)();
    const axios = (0,hooks/* useAuthAxiosInstance */.Qd)();
    const { data: books, isLoading: booksLoading, error: fetchError } = (0,useQuery.useQuery)({
        queryKey: [
            "books",
            page,
            currentPage,
            searchValue
        ],
        queryFn: async ()=>{
            const query = searchValue ? `search=${encodeURIComponent(searchValue)}` : "";
            const endpoint = page === "recommended" ? "recommendation-books" : page;
            const res = await axios(`${api/* BASE_URL */._}/${endpoint}?${query}&page=${currentPage}&page_size=7`);
            return res.data.data;
        },
        enabled: status === "authenticated",
        ...rest
    });
    return {
        books,
        booksLoading,
        fetchError
    };
};

// EXTERNAL MODULE: ./src/components/common/index.ts + 3 modules
var common = __webpack_require__(78957);
// EXTERNAL MODULE: ./src/components/Pagination/Pagination.tsx
var Pagination = __webpack_require__(99691);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/useMutation.js + 1 modules
var useMutation = __webpack_require__(41068);
;// CONCATENATED MODULE: ./src/hooks/Books/useDeleteChosenBooks.ts
/* __next_internal_client_entry_do_not_use__ useDeleteChosenBooks auto */ 


const useDeleteChosenBooks = (page)=>{
    const axios = (0,hooks/* useAuthAxiosInstance */.Qd)();
    const queryClient = (0,QueryClientProvider.useQueryClient)();
    const [deletingBooks, setDeletingBooks] = (0,react_.useState)([]);
    const [isDeleted, setIsDeleted] = (0,react_.useState)(false);
    const { mutate: deleteChosenBooks } = (0,useMutation.useMutation)({
        mutationFn: async (selected)=>{
            setDeletingBooks(selected);
            const endpoint = page === "quizzes" ? "quizzes" : "books";
            await Promise.all(selected.map(async (id)=>{
                await axios.delete(`${endpoint}/${id}/`);
            }));
        },
        onSettled: ()=>setDeletingBooks([]),
        onSuccess: ()=>{
            setIsDeleted(true);
            queryClient.invalidateQueries({
                queryKey: [
                    "books"
                ]
            });
        }
    });
    const handleDeleteBooks = (selectedBooks)=>{
        setDeletingBooks(selectedBooks);
        deleteChosenBooks(selectedBooks);
    };
    return {
        handleDeleteBooks,
        deletingBooks,
        isDeleted,
        setIsDeleted
    };
};

// EXTERNAL MODULE: ./src/app/(admin)/components/NoResults/NoSearchResults.tsx
var NoSearchResults = __webpack_require__(83864);
// EXTERNAL MODULE: ./src/components/common/ModalActions/Modal.tsx
var Modal = __webpack_require__(13189);
// EXTERNAL MODULE: ./src/app/(admin)/admin/books/Books.module.scss
var Books_module = __webpack_require__(78171);
var Books_module_default = /*#__PURE__*/__webpack_require__.n(Books_module);
;// CONCATENATED MODULE: ./src/app/(admin)/components/BooksComponent/Books.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 










const Books = ({ searchValue = "", page })=>{
    const [currentPage, setCurrentPage] = (0,react_.useState)(1);
    const [selected, setSelected] = (0,react_.useState)([]);
    const { books, booksLoading, fetchError } = useQueryBooks({
        page,
        currentPage,
        searchValue
    });
    const { handleDeleteBooks, deletingBooks, isDeleted, setIsDeleted } = useDeleteChosenBooks(page);
    const queryClient = (0,QueryClientProvider.useQueryClient)();
    const count = books?.count ? Math.ceil(books.count / 7) : 0;
    const [isOpen, setIsOpen] = (0,react_.useState)(false);
    const noResultsText = {
        books: "У вас ще немає доданих книг",
        quizzes: "У вас ще немає доданих вікторин",
        recommended: "У вас ще немає доданих рекомендованих книжок"
    };
    const handleCheckboxChange = (checked, bookId)=>{
        if (checked) {
            setSelected((prev)=>[
                    ...prev,
                    bookId
                ]);
        } else {
            setSelected((prev)=>prev.filter((id)=>id !== bookId));
        }
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: (Books_module_default()).wrapper,
        children: [
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(components/* TableHeader */.xD, {
                        handleDelete: ()=>setIsOpen(true),
                        variant: "books",
                        colNames: [
                            "Назва книги",
                            "Стан",
                            "Дата  додавання"
                        ]
                    }),
                    booksLoading && /*#__PURE__*/ jsx_runtime_.jsx(common/* Spinner */.$j, {
                        className: (Books_module_default()).spinner
                    }),
                    fetchError && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: (Books_module_default()).error,
                        children: [
                            "Упс... Щось пішло не так: ",
                            fetchError.message
                        ]
                    }),
                    books && books.count === 0 && (searchValue ? /*#__PURE__*/ jsx_runtime_.jsx(NoSearchResults/* default */.Z, {}) : /*#__PURE__*/ jsx_runtime_.jsx(components/* NoResults */.X6, {
                        text: noResultsText[page],
                        image: "/images/admin/books-no-results.svg"
                    })),
                    /*#__PURE__*/ jsx_runtime_.jsx("div", {
                        children: books?.results?.map((book)=>{
                            const bookId = page === "quizzes" ? book.quizz_id : book.id || book.book_id;
                            return /*#__PURE__*/ jsx_runtime_.jsx(react_.Fragment, {
                                children: /*#__PURE__*/ jsx_runtime_.jsx(components/* BookItem */.yw, {
                                    book: book,
                                    page: page,
                                    onCheckboxChange: handleCheckboxChange,
                                    isDeleting: deletingBooks?.includes(bookId)
                                })
                            }, bookId);
                        })
                    })
                ]
            }),
            books && !booksLoading && books.count > 7 && /*#__PURE__*/ jsx_runtime_.jsx(Pagination/* default */.Z, {
                currentPage: currentPage,
                onPageChange: (page)=>setCurrentPage(page),
                count: count
            }),
            isDeleted && /*#__PURE__*/ jsx_runtime_.jsx(Modal["default"], {
                type: "success",
                message: "Обрані книги видалено",
                title: "Успіх!",
                active: isDeleted,
                setActive: ()=>{
                    setIsDeleted(false);
                    queryClient.invalidateQueries({
                        queryKey: [
                            "books"
                        ]
                    });
                }
            }),
            isOpen && /*#__PURE__*/ jsx_runtime_.jsx(Modal["default"], {
                type: "question",
                message: "Ви точно бажаєте видалити обрані книги?",
                title: "Видалити книги",
                active: isOpen,
                setActive: ()=>setIsOpen(false),
                successFnc: ()=>handleDeleteBooks(selected)
            })
        ]
    });
};
/* harmony default export */ const BooksComponent_Books = (Books);


/***/ }),

/***/ 38851:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var components_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(78957);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(71031);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(64660);
/* harmony import */ var _app_admin_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(23397);
/* harmony import */ var _Header_module_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(60631);
/* harmony import */ var _Header_module_scss__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_Header_module_scss__WEBPACK_IMPORTED_MODULE_5__);
/* __next_internal_client_entry_do_not_use__ default auto */ 






const AdminHeader = ({ withSearch = false, withButton = false, withClose = false, heading = "", buttonText = "", subHeading, setSearchWord, href, closeFunc })=>{
    const { control, setValue, watch } = (0,react_hook_form__WEBPACK_IMPORTED_MODULE_4__/* .useForm */ .cI)({
        defaultValues: {
            search: ""
        }
    });
    const resetField = ()=>{
        setValue("search", "");
        if (setSearchWord) {
            setSearchWord("");
        }
    };
    const searchValue = watch("search");
    const handleKeyDown = (event)=>{
        if (event.key === "Enter" && setSearchWord) {
            setSearchWord(searchValue);
        }
    };
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_Header_module_scss__WEBPACK_IMPORTED_MODULE_5___default().header),
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("h4", {
                        className: (_Header_module_scss__WEBPACK_IMPORTED_MODULE_5___default().header__heading),
                        children: heading
                    }),
                    subHeading && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                        className: (_Header_module_scss__WEBPACK_IMPORTED_MODULE_5___default().header__subheading),
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                style: {
                                    color: "#1E1E1E"
                                },
                                children: subHeading[0]
                            }),
                            " / ",
                            subHeading[1]
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_Header_module_scss__WEBPACK_IMPORTED_MODULE_5___default().header__content),
                children: [
                    withSearch ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        className: (_Header_module_scss__WEBPACK_IMPORTED_MODULE_5___default().search),
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_3__/* .AdminSearch */ .dl, {
                            name: "search",
                            control: control,
                            icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_6__/* .SearchIcon */ .W1M, {
                                style: {
                                    cursor: "pointer"
                                },
                                onClick: ()=>{
                                    if (setSearchWord) {
                                        setSearchWord(searchValue);
                                    }
                                }
                            }),
                            resetField: resetField,
                            placeholder: "Введіть ключове слово для пошуку",
                            handleKeyDown: handleKeyDown
                        })
                    }) : null,
                    withButton ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common__WEBPACK_IMPORTED_MODULE_2__/* .Button */ .zx, {
                        variant: "filled",
                        color: "secondary",
                        startIcon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_3__/* .AddIcon */ .dt, {}),
                        href: href || "",
                        component: "link",
                        children: buttonText
                    }) : null,
                    withClose ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                        onClick: closeFunc,
                        onKeyDown: closeFunc,
                        style: {
                            cursor: "pointer"
                        },
                        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_3__/* .CloseIcon */ .Tw, {})
                    }) : null
                ]
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AdminHeader);


/***/ }),

/***/ 83864:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(48421);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var components_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(78957);
/* harmony import */ var _app_admin_components_NoResults_NoResults_module_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(54704);
/* harmony import */ var _app_admin_components_NoResults_NoResults_module_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_app_admin_components_NoResults_NoResults_module_scss__WEBPACK_IMPORTED_MODULE_4__);





const NoSearchResults = ()=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: (_app_admin_components_NoResults_NoResults_module_scss__WEBPACK_IMPORTED_MODULE_4___default().container),
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_2___default()), {
                    src: "/images/admin/search-no-res.svg",
                    alt: "немає результатів пошуку",
                    width: 199,
                    height: 199
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_app_admin_components_NoResults_NoResults_module_scss__WEBPACK_IMPORTED_MODULE_4___default().message),
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(components_common__WEBPACK_IMPORTED_MODULE_3__/* .Typography */ .ZT, {
                        variant: "h5",
                        component: "h2",
                        children: [
                            "По вашому запиту нічого не знайдено.",
                            " "
                        ]
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(components_common__WEBPACK_IMPORTED_MODULE_3__/* .Typography */ .ZT, {
                        variant: "body",
                        component: "p",
                        children: [
                            "Спробуйте сформулювати запит інакше або скористайтеся іншими ключовими словами",
                            " "
                        ]
                    })
                ]
            })
        ]
    });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NoSearchResults);


/***/ }),

/***/ 74397:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(71031);
/* harmony import */ var components_common_IconButton_IconButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(26384);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(64660);
/* harmony import */ var _AdminSearch_module_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(28352);
/* harmony import */ var _AdminSearch_module_scss__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_AdminSearch_module_scss__WEBPACK_IMPORTED_MODULE_5__);
/* __next_internal_client_entry_do_not_use__ default auto */ 





const AdminSearch = ({ name, control, icon, resetField, className, handleKeyDown, ...props })=>{
    const { field } = (0,react_hook_form__WEBPACK_IMPORTED_MODULE_3__/* .useController */ .bc)({
        name,
        control
    });
    const status = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>{
        if (field.value) {
            return "filled";
        }
        return "normal";
    }, [
        field.value
    ]);
    const renderIcon = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>{
        if (field.value?.length > 0) {
            return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common_IconButton_IconButton__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z, {
                onClick: resetField,
                icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* .XCircle */ .a2, {
                    width: 24
                })
            });
        }
        return null;
    }, [
        field.value?.length,
        icon,
        resetField,
        status,
        props.type
    ]);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: `${(_AdminSearch_module_scss__WEBPACK_IMPORTED_MODULE_5___default().group)} ${className || ""}`,
        "data-status": status,
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
            className: (_AdminSearch_module_scss__WEBPACK_IMPORTED_MODULE_5___default().label),
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                className: (_AdminSearch_module_scss__WEBPACK_IMPORTED_MODULE_5___default()["input-group"]),
                children: [
                    icon && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: (_AdminSearch_module_scss__WEBPACK_IMPORTED_MODULE_5___default().icon),
                        children: icon
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                        className: (_AdminSearch_module_scss__WEBPACK_IMPORTED_MODULE_5___default().input),
                        ...field,
                        onKeyDown: handleKeyDown && handleKeyDown,
                        ...props
                    }),
                    renderIcon && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: (_AdminSearch_module_scss__WEBPACK_IMPORTED_MODULE_5___default().icon),
                        children: renderIcon
                    })
                ]
            })
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AdminSearch);


/***/ }),

/***/ 18446:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(78471);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(64261);
/* harmony import */ var _components_common_IconButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(54647);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(64660);
/* harmony import */ var _SearchableSelect_module_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(46077);
/* harmony import */ var _SearchableSelect_module_scss__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_SearchableSelect_module_scss__WEBPACK_IMPORTED_MODULE_5__);
/* __next_internal_client_entry_do_not_use__ default auto */ 





const DropdownIndicator = (props)=>{
    const { clearInput, selected, inputValue, isOpen, handleMenuIsOpen } = props;
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_select__WEBPACK_IMPORTED_MODULE_3__.c.DropdownIndicator, {
        ...props,
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
            children: [
                !inputValue && !selected && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_common_IconButton__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z, {
                    icon: isOpen ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* .ChevronUp */ .Kh3, {}) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* .ChevronDown */ ._ME, {}),
                    onClick: ()=>handleMenuIsOpen(false)
                }),
                inputValue && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* .XCircle */ .a2, {
                    className: (_SearchableSelect_module_scss__WEBPACK_IMPORTED_MODULE_5___default().xCircle),
                    onClick: clearInput
                })
            ]
        })
    });
};
const ClearIndicator = (props)=>{
    const { clearInput } = props;
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_select__WEBPACK_IMPORTED_MODULE_3__.c.ClearIndicator, {
        ...props,
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* .XCircle */ .a2, {
            className: (_SearchableSelect_module_scss__WEBPACK_IMPORTED_MODULE_5___default().xCircle),
            onClick: clearInput
        })
    });
};
const Option = (props)=>{
    const { label, author } = props.data;
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_select__WEBPACK_IMPORTED_MODULE_3__.c.Option, {
        ...props,
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: (_SearchableSelect_module_scss__WEBPACK_IMPORTED_MODULE_5___default().option),
            children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("p", {
                children: [
                    label,
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                        children: [
                            " | ",
                            author
                        ]
                    })
                ]
            })
        })
    });
};
const SearchableSelect = ({ onChange, onInputChange, clearInput, loading, options, selected, inputValue, label, error })=>{
    const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const handleMenuIsOpen = (isOpen)=>{
        setIsOpen(isOpen);
    };
    const customStyles = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>({
            input: (provided)=>({
                    ...provided,
                    color: isOpen ? "#7791fa" : "#000"
                }),
            control: (provided)=>({
                    ...provided,
                    color: isOpen ? "#7791fa" : "#727272",
                    border: "1px solid #e3f0ff",
                    minWidth: "722px",
                    borderRadius: "8px",
                    backgroundColor: "#FDFDFD"
                }),
            placeholder: (provided)=>({
                    ...provided,
                    color: isOpen ? "#7791fa" : "#727272"
                }),
            singleValue: (provided)=>({
                    ...provided,
                    color: isOpen ? "#7791fa" : "#000"
                }),
            valueContainer: (provided)=>({
                    ...provided,
                    color: isOpen ? "#7791fa" : "#000"
                }),
            menuList: (provided)=>({
                    ...provided,
                    paddingTop: "0px",
                    maxHeight: "227px",
                    "::-webkit-scrollbar": {
                        width: "8px",
                        height: "0px"
                    },
                    "::-webkit-scrollbar-track": {
                        background: "#ffffff"
                    },
                    "::-webkit-scrollbar-thumb": {
                        background: "#e3f0ff"
                    },
                    "::-webkit-scrollbar-thumb:hover": {
                        background: "#e3f0ff"
                    }
                }),
            menu: (provided)=>({
                    ...provided,
                    marginTop: "0px",
                    border: "none"
                }),
            option: (provided, state)=>({
                    ...provided,
                    padding: "12px 16px",
                    border: "1px solid #e3f0ff",
                    backgroundColor: state.isSelected ? "#e3f0ff" : provided.backgroundColor
                }),
            dropdownIndicator: (provided)=>({
                    ...provided,
                    padding: !inputValue && !selected ? "8px" : inputValue ? "8px" : "0px"
                }),
            indicatorSeparator: ()=>({
                    display: "none"
                })
        }), [
        inputValue,
        selected,
        isOpen
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: isOpen ? `${(_SearchableSelect_module_scss__WEBPACK_IMPORTED_MODULE_5___default().searchableSelectContainer)} ${(_SearchableSelect_module_scss__WEBPACK_IMPORTED_MODULE_5___default().active)}` : (_SearchableSelect_module_scss__WEBPACK_IMPORTED_MODULE_5___default().searchableSelectContainer),
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("label", {
                className: (_SearchableSelect_module_scss__WEBPACK_IMPORTED_MODULE_5___default().label),
                children: label
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(react_select__WEBPACK_IMPORTED_MODULE_6__/* ["default"] */ .ZP, {
                className: (_SearchableSelect_module_scss__WEBPACK_IMPORTED_MODULE_5___default().searchableSelect),
                styles: customStyles,
                options: options,
                onChange: onChange,
                onInputChange: onInputChange,
                isSearchable: true,
                placeholder: "Оберіть назву книги",
                value: selected,
                components: {
                    DropdownIndicator: (props)=>DropdownIndicator({
                            ...props,
                            clearInput,
                            selected,
                            inputValue,
                            isOpen,
                            handleMenuIsOpen
                        }),
                    ClearIndicator: (props)=>ClearIndicator({
                            ...props,
                            clearInput
                        }),
                    Option
                },
                isClearable: true,
                menuIsOpen: isOpen,
                onMenuOpen: ()=>handleMenuIsOpen(true),
                onMenuClose: ()=>handleMenuIsOpen(false),
                classNamePrefix: "select"
            }),
            error && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_SearchableSelect_module_scss__WEBPACK_IMPORTED_MODULE_5___default().error),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* .AlertCircle */ .bG7, {
                        size: 14
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        children: error
                    })
                ]
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SearchableSelect);


/***/ }),

/***/ 39440:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(64927);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(64660);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(59483);
/* harmony import */ var next_navigation__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_navigation__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _app_admin_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(23397);
/* harmony import */ var _NavBar_module_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(40148);
/* harmony import */ var _NavBar_module_scss__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_NavBar_module_scss__WEBPACK_IMPORTED_MODULE_6__);
/* __next_internal_client_entry_do_not_use__ default auto */ 






const menuItems = {
    books: {
        href: _constants__WEBPACK_IMPORTED_MODULE_2__/* .Route */ .AW.BOOKS,
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_5__/* .Book */ .fy8, {
            color: "white"
        }),
        anchor: "Книги"
    },
    quizzes: {
        href: _constants__WEBPACK_IMPORTED_MODULE_2__/* .Route */ .AW.QUIZZES,
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_4__/* .Neurology */ .Ue, {}),
        anchor: "Вікторини"
    },
    recommended: {
        href: _constants__WEBPACK_IMPORTED_MODULE_2__/* .Route */ .AW.RECOMMENDED,
        icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_5__/* .BookMarked */ .HjN, {
            color: "white"
        }),
        anchor: "Рекомендовані"
    }
};
const NavBar = ()=>{
    const [isOpen, setIsOpen] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);
    const router = (0,next_navigation__WEBPACK_IMPORTED_MODULE_3__.useRouter)();
    const [activeMenuItem, setActiveMenuItem] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)("books");
    const toggleDropdown = (e)=>{
        e.stopPropagation();
        setIsOpen(!isOpen);
    };
    const openLinkHandler = (menuItemName)=>{
        setActiveMenuItem(menuItemName);
        router.push(menuItems[menuItemName].href);
        setIsOpen(false);
    };
    const arrow = isOpen ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_5__/* .ChevronUp */ .Kh3, {
        color: "white",
        onClick: toggleDropdown
    }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_5__/* .ChevronDown */ ._ME, {
        color: "white",
        onClick: toggleDropdown
    });
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("nav", {
        className: (_NavBar_module_scss__WEBPACK_IMPORTED_MODULE_6___default().navigation),
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_4__/* .LinkButton */ .Qj, {
                prefetch: false,
                href: "/admin",
                anchor: "Користувачі",
                icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_5__/* .UsersIcon */ .oyc, {
                    color: "white"
                }),
                component: "link"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_4__/* .LinkButton */ .Qj, {
                component: "button",
                href: menuItems[activeMenuItem].href,
                anchor: menuItems[activeMenuItem].anchor,
                icon: menuItems[activeMenuItem].icon,
                iconOpen: arrow,
                onClick: ()=>openLinkHandler(activeMenuItem)
            }),
            isOpen && Object.keys(menuItems).map((itemName)=>itemName !== activeMenuItem && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_4__/* .LinkButton */ .Qj, {
                    component: "button",
                    href: menuItems[itemName].href,
                    anchor: menuItems[itemName].anchor,
                    icon: menuItems[itemName].icon,
                    onClick: ()=>openLinkHandler(itemName)
                }, itemName)),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_4__/* .LinkButton */ .Qj, {
                prefetch: false,
                component: "link",
                href: _constants__WEBPACK_IMPORTED_MODULE_2__/* .Route */ .AW.DOCUMENTS,
                anchor: "Документи",
                icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_5__/* .File */ .$BE, {
                    color: "white"
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_4__/* .LinkButton */ .Qj, {
                prefetch: false,
                component: "link",
                href: _constants__WEBPACK_IMPORTED_MODULE_2__/* .Route */ .AW.PARTNERS,
                anchor: "Партнери",
                icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_5__/* .Briefcase */ .a7h, {
                    color: "white"
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_4__/* .LinkButton */ .Qj, {
                prefetch: false,
                component: "link",
                href: _constants__WEBPACK_IMPORTED_MODULE_2__/* .Route */ .AW.CONTACTS,
                anchor: "Контакти",
                icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_5__/* .UserSquare */ .DvV, {
                    color: "white"
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_4__/* .LinkButton */ .Qj, {
                prefetch: false,
                component: "link",
                href: _constants__WEBPACK_IMPORTED_MODULE_2__/* .Route */ .AW.STATS,
                anchor: "Статистика",
                icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_5__/* .PieChart */ .ucW, {
                    color: "white"
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_4__/* .LinkButton */ .Qj, {
                prefetch: false,
                component: "link",
                href: _constants__WEBPACK_IMPORTED_MODULE_2__/* .Route */ .AW.CHANGE_PASS,
                anchor: "Змінити пароль",
                icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_4__/* .LockIcon */ .mB, {
                    stroke: "white"
                })
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NavBar);


/***/ }),

/***/ 68979:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(48421);
/* harmony import */ var next_image__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_image__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _app_admin_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(23397);
/* harmony import */ var components_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(78957);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(64660);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(64927);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(63370);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(31621);
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _SideBar_module_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(56656);
/* harmony import */ var _SideBar_module_scss__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_SideBar_module_scss__WEBPACK_IMPORTED_MODULE_8__);
/* __next_internal_client_entry_do_not_use__ default auto */ 









const SideBar = ()=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("section", {
        className: (_SideBar_module_scss__WEBPACK_IMPORTED_MODULE_8___default().sidebar),
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: (_SideBar_module_scss__WEBPACK_IMPORTED_MODULE_8___default().logo),
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_link__WEBPACK_IMPORTED_MODULE_7___default()), {
                    href: `${_constants__WEBPACK_IMPORTED_MODULE_5__/* .Route */ .AW.HOME}`,
                    children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((next_image__WEBPACK_IMPORTED_MODULE_2___default()), {
                        src: "/images/logo/logo-footer.svg",
                        alt: "logo",
                        width: 72,
                        height: 60
                    })
                })
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_3__/* .NavBar */ .l2, {}),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common__WEBPACK_IMPORTED_MODULE_4__/* .Button */ .zx, {
                onClick: ()=>(0,next_auth_react__WEBPACK_IMPORTED_MODULE_6__.signOut)({
                        callbackUrl: _constants__WEBPACK_IMPORTED_MODULE_5__/* .Route */ .AW.HOME
                    }),
                size: "small",
                variant: "outline",
                component: "button",
                color: "primary",
                startIcon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_9__/* .LogIn */ .uX4, {
                    size: 24
                }),
                children: "Вийти"
            })
        ]
    });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SideBar);


/***/ }),

/***/ 12920:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ BookItem_BookItem)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(48421);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/cjs/lucide-react.js
var lucide_react = __webpack_require__(64660);
// EXTERNAL MODULE: ./src/app/(admin)/components/index.ts + 12 modules
var components = __webpack_require__(23397);
// EXTERNAL MODULE: ./src/utils/formatDate.ts
var formatDate = __webpack_require__(72636);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(31621);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./src/constants/index.ts + 2 modules
var constants = __webpack_require__(64927);
// EXTERNAL MODULE: ./src/components/common/index.ts + 3 modules
var common = __webpack_require__(78957);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/useMutation.js + 1 modules
var useMutation = __webpack_require__(41068);
// EXTERNAL MODULE: ./src/hooks/index.ts + 4 modules
var hooks = __webpack_require__(55971);
;// CONCATENATED MODULE: ./src/hooks/Books/useDeleteBooks.ts



const useDeleteBooks = (page)=>{
    const axios = (0,hooks/* useAuthAxiosInstance */.Qd)();
    const [isDeleted, setIsDeleted] = (0,react_.useState)(false);
    const { mutate: deleteBook, isPending } = (0,useMutation.useMutation)({
        mutationFn: async (id)=>{
            const endpoint = page === "quizzes" ? "quizzes" : "books";
            await axios.delete(`${endpoint}/${id}/`);
        },
        onSuccess: (data)=>{
            setIsDeleted(true);
        }
    });
    return {
        deleteBook,
        isPending,
        isDeleted,
        setIsDeleted
    };
};

// EXTERNAL MODULE: ./src/components/common/ModalActions/Modal.tsx
var Modal = __webpack_require__(13189);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js
var QueryClientProvider = __webpack_require__(32770);
// EXTERNAL MODULE: ./src/app/(admin)/components/TableItems/BookItem/BookItem.module.scss
var BookItem_module = __webpack_require__(50544);
var BookItem_module_default = /*#__PURE__*/__webpack_require__.n(BookItem_module);
;// CONCATENATED MODULE: ./src/app/(admin)/components/TableItems/BookItem/BookItem.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 












const BookItem = ({ book, page, onCheckboxChange, isDeleting })=>{
    const { deleteBook, isPending, setIsDeleted, isDeleted } = useDeleteBooks(page);
    const [isOpen, setIsOpen] = (0,react_.useState)(false);
    const queryClient = (0,QueryClientProvider.useQueryClient)();
    let stateToRender;
    if (Array.isArray(book.state)) {
        if (book.state.length > 1) {
            stateToRender = /*#__PURE__*/ (0,jsx_runtime_.jsxs)("p", {
                className: (BookItem_module_default()).blue,
                children: [
                    book.state[0],
                    "/",
                    book.state[1]
                ]
            });
        } else {
            stateToRender = null;
        }
    } else {
        if (book.state === "Рекомендована") {
            stateToRender = /*#__PURE__*/ jsx_runtime_.jsx("p", {
                className: (BookItem_module_default()).blue,
                children: book.state
            });
        } else {
            stateToRender = /*#__PURE__*/ jsx_runtime_.jsx("p", {
                className: (BookItem_module_default()).green,
                children: book.state
            });
        }
    }
    const state = {
        books: stateToRender,
        quizzes: /*#__PURE__*/ jsx_runtime_.jsx("p", {
            className: (BookItem_module_default()).green,
            children: "Вікторина"
        }),
        recommended: /*#__PURE__*/ jsx_runtime_.jsx("p", {
            className: (BookItem_module_default()).blue,
            children: "Рекомендована"
        })
    };
    const redirectRoute = {
        books: constants/* Route */.AW.BOOKS_EDIT,
        recommended: constants/* Route */.AW.BOOKS_EDIT,
        quizzes: constants/* Route */.AW.QUIZZES_EDIT
    };
    const editorLinkProps = page === "quizzes" ? book.quizz_id : book.id || book.book_id;
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: (BookItem_module_default()).bookItem,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: (BookItem_module_default()).checkbox,
                children: /*#__PURE__*/ jsx_runtime_.jsx(components/* AdminCheckBox */.SH, {
                    id: editorLinkProps,
                    onChange: (e)=>onCheckboxChange(e.target.checked, editorLinkProps)
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: (BookItem_module_default()).info,
                children: [
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: (BookItem_module_default()).title,
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: (BookItem_module_default()).image,
                                children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                    src: book.cover_image,
                                    width: 40,
                                    height: 60,
                                    alt: book.title
                                })
                            }),
                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                className: (BookItem_module_default()).bookInfo,
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx("h2", {
                                        className: (BookItem_module_default()).name,
                                        children: book.title
                                    }),
                                    /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                        className: (BookItem_module_default()).author,
                                        children: book.author
                                    })
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                        className: (BookItem_module_default()).infoBlock,
                        children: [
                            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                className: (BookItem_module_default()).state,
                                children: state[page]
                            }),
                            /*#__PURE__*/ jsx_runtime_.jsx("p", {
                                className: (BookItem_module_default()).date,
                                children: (0,formatDate/* formattedDate */.B)(book.updated_at)
                            })
                        ]
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: (BookItem_module_default()).actions,
                children: isPending || isDeleting ? /*#__PURE__*/ jsx_runtime_.jsx(common/* Spinner */.$j, {}) : /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                href: `${redirectRoute[page]}/${editorLinkProps}`,
                                children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* PenLine */.VkW, {})
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            onClick: ()=>setIsOpen(true),
                            children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Trash2 */.VhS, {})
                        })
                    ]
                })
            }),
            isOpen && /*#__PURE__*/ jsx_runtime_.jsx(Modal["default"], {
                type: "question",
                message: "Ви точно хочете видалити книгу?",
                title: `Видалити “${book.title}”`,
                active: isOpen,
                setActive: ()=>setIsOpen(false),
                successFnc: ()=>{
                    deleteBook(editorLinkProps);
                }
            }),
            isDeleted && /*#__PURE__*/ jsx_runtime_.jsx(Modal["default"], {
                type: "success",
                message: page === "quizzes" ? `Вікторину “${book.title}” видалено` : `Книгу “${book.title}” видалено`,
                title: "Успіх!",
                active: isDeleted,
                setActive: ()=>{
                    setIsDeleted(false);
                    queryClient.invalidateQueries({
                        queryKey: [
                            "books"
                        ]
                    });
                }
            })
        ]
    });
};
/* harmony default export */ const BookItem_BookItem = (BookItem);


/***/ }),

/***/ 8479:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ PartnerItem_PartnerItem)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/cjs/lucide-react.js
var lucide_react = __webpack_require__(64660);
// EXTERNAL MODULE: ./src/app/(admin)/components/index.ts + 12 modules
var components = __webpack_require__(23397);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/useMutation.js + 1 modules
var useMutation = __webpack_require__(41068);
// EXTERNAL MODULE: ./src/hooks/index.ts + 4 modules
var hooks = __webpack_require__(55971);
;// CONCATENATED MODULE: ./src/hooks/Partners/useDeletePartners.ts



const useDeletePartners = ()=>{
    const axios = (0,hooks/* useAuthAxiosInstance */.Qd)();
    const [isDeleted, setIsDeleted] = (0,react_.useState)(false);
    const { mutate: deletePartner, isPending } = (0,useMutation.useMutation)({
        mutationFn: async (id)=>{
            await axios.delete(`partners/${id}/`);
        },
        onSuccess: (data)=>{
            setIsDeleted(true);
        }
    });
    return {
        deletePartner,
        isPending,
        isDeleted,
        setIsDeleted
    };
};

// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js
var QueryClientProvider = __webpack_require__(32770);
// EXTERNAL MODULE: ./src/components/common/index.ts + 3 modules
var common = __webpack_require__(78957);
// EXTERNAL MODULE: ./src/utils/formatDate.ts
var formatDate = __webpack_require__(72636);
// EXTERNAL MODULE: ./src/components/common/ModalActions/Modal.tsx
var Modal = __webpack_require__(13189);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(31621);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./src/constants/index.ts + 2 modules
var constants = __webpack_require__(64927);
// EXTERNAL MODULE: ./src/app/(admin)/components/TableItems/PartnerItem/PartnerItem.module.scss
var PartnerItem_module = __webpack_require__(66245);
var PartnerItem_module_default = /*#__PURE__*/__webpack_require__.n(PartnerItem_module);
;// CONCATENATED MODULE: ./src/app/(admin)/components/TableItems/PartnerItem/PartnerItem.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 











const PartnerItem = ({ partner, onCheckboxChange, isDeleting })=>{
    const { deletePartner, isPending, setIsDeleted, isDeleted } = useDeletePartners();
    const [isOpen, setIsOpen] = (0,react_.useState)(false);
    const queryClient = (0,QueryClientProvider.useQueryClient)();
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: (PartnerItem_module_default()).partner,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(components/* AdminCheckBox */.SH, {
                id: partner.id,
                onChange: (e)=>onCheckboxChange(e.target.checked, partner.id)
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: (PartnerItem_module_default()).info,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("p", {
                        className: (PartnerItem_module_default()).title,
                        children: partner.name
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("p", {
                        className: (PartnerItem_module_default()).date,
                        children: (0,formatDate/* formattedDate */.B)(partner.created_at)
                    })
                ]
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: (PartnerItem_module_default()).actions,
                children: isPending || isDeleting ? /*#__PURE__*/ jsx_runtime_.jsx(common/* Spinner */.$j, {
                    className: (PartnerItem_module_default()).spinner
                }) : /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: (PartnerItem_module_default()).actionItem,
                            children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                href: `${constants/* Route */.AW.PARTNERS_EDIT}/${partner.id}`,
                                children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* PenLine */.VkW, {})
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: (PartnerItem_module_default()).actionItem,
                            onClick: ()=>setIsOpen(true),
                            children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Trash2 */.VhS, {})
                        })
                    ]
                })
            }),
            isOpen && /*#__PURE__*/ jsx_runtime_.jsx(Modal["default"], {
                type: "question",
                message: "Ви точно хочете видалити партнера?",
                title: `Видалити “${partner.name}”`,
                active: isOpen,
                setActive: ()=>setIsOpen(false),
                successFnc: ()=>{
                    deletePartner(partner.id);
                }
            }),
            isDeleted && /*#__PURE__*/ jsx_runtime_.jsx(Modal["default"], {
                type: "success",
                message: `Партнера “${partner.name}” видалено`,
                title: "Успіх!",
                active: isDeleted,
                setActive: ()=>{
                    setIsDeleted(false);
                    queryClient.invalidateQueries({
                        queryKey: [
                            "partners"
                        ]
                    });
                }
            })
        ]
    });
};
/* harmony default export */ const PartnerItem_PartnerItem = (PartnerItem);


/***/ }),

/***/ 36829:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ UploadImageComponent_UploadImage)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/react-drag-drop-files/dist/react-drag-drop-files.cjs.js
var react_drag_drop_files_cjs = __webpack_require__(93302);
// EXTERNAL MODULE: ./src/app/(admin)/components/UploadImageComponent/UploadImage.module.scss
var UploadImage_module = __webpack_require__(15438);
var UploadImage_module_default = /*#__PURE__*/__webpack_require__.n(UploadImage_module);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(48421);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
;// CONCATENATED MODULE: ./src/app/(admin)/components/UploadImageComponent/components/FileInput.tsx




const FileInput = ({ onFileChange, file, initialImg, setInitialImg })=>{
    const src = file ? URL.createObjectURL(file) : initialImg;
    const deleteImgHandler = ()=>{
        onFileChange(null);
        if (setInitialImg) setInitialImg("");
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: (UploadImage_module_default()).uploadedImageContainer,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                className: (UploadImage_module_default()).uploadedImage,
                src: src,
                alt: "Uploaded Image",
                width: 120,
                height: 175
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("button", {
                className: (UploadImage_module_default()).closeButton,
                onClick: deleteImgHandler,
                children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                    src: "/images/admin/x.svg",
                    alt: "close icon",
                    height: 16,
                    width: 16
                })
            })
        ]
    });
};
/* harmony default export */ const components_FileInput = (FileInput);

// EXTERNAL MODULE: ./src/components/common/index.ts + 3 modules
var common = __webpack_require__(78957);
;// CONCATENATED MODULE: ./src/app/(admin)/components/UploadImageComponent/components/EmptyInput.tsx





const EmptyInput = ({ sizeErrorMessage, formatErrorMessage })=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: (UploadImage_module_default()).uploadInfoContainer,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                src: "/images/admin/Image-icon.svg",
                alt: "image icon",
                width: 51,
                height: 43
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(common/* Typography */.ZT, {
                component: "span",
                variant: "body",
                children: "Перетягніть свій файл сюди або"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(common/* Typography */.ZT, {
                component: "span",
                variant: "body",
                className: (UploadImage_module_default()).blueText,
                children: "натисніть щоб завантажити"
            }),
            (sizeErrorMessage || formatErrorMessage) && /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: (UploadImage_module_default()).errorMessageContainer,
                children: [
                    sizeErrorMessage && /*#__PURE__*/ jsx_runtime_.jsx(common/* Typography */.ZT, {
                        component: "span",
                        variant: "body",
                        className: (UploadImage_module_default()).errorMessage,
                        children: sizeErrorMessage
                    }),
                    formatErrorMessage && /*#__PURE__*/ jsx_runtime_.jsx(common/* Typography */.ZT, {
                        component: "span",
                        variant: "body",
                        className: (UploadImage_module_default()).errorMessage,
                        children: formatErrorMessage
                    })
                ]
            }),
            sizeErrorMessage && formatErrorMessage || !sizeErrorMessage && !formatErrorMessage ? /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: (UploadImage_module_default()).formatAndSizeWarning,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(common/* Typography */.ZT, {
                        component: "span",
                        variant: "body",
                        children: "Формат зображення: JPG, PNG, SVG"
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(common/* Typography */.ZT, {
                        component: "span",
                        variant: "body",
                        children: "Максимальний розмір: 2 MB"
                    })
                ]
            }) : null,
            sizeErrorMessage && !formatErrorMessage && /*#__PURE__*/ jsx_runtime_.jsx(common/* Typography */.ZT, {
                component: "span",
                variant: "body",
                children: "Максимальний розмір: 2 MB"
            }),
            !sizeErrorMessage && formatErrorMessage && /*#__PURE__*/ jsx_runtime_.jsx(common/* Typography */.ZT, {
                component: "span",
                variant: "body",
                children: "Формат зображення: JPG, PNG, SVG"
            })
        ]
    });
/* harmony default export */ const components_EmptyInput = (EmptyInput);

;// CONCATENATED MODULE: ./src/app/(admin)/components/UploadImageComponent/UploadImage.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 





const twoMB = 2 * 1024 * 1024;
const fileTypes = [
    "image/png",
    "image/jpeg",
    "image/svg+xml",
    "image/jpg",
    "image/webp"
];
const UploadImage = ({ onFileChange, maxSize = twoMB, allowedTypes = fileTypes, file, initialImg, setInitialImg, page })=>{
    const [sizeErrorMessage, setSizeErrorMessage] = (0,react_.useState)("");
    const [formatErrorMessage, setFormatErrorMessage] = (0,react_.useState)("");
    const validateSizeError = (file)=>{
        const isTooBig = file.size > maxSize;
        if (isTooBig) {
            setSizeErrorMessage(`${file.name} перевищує максимальний ліміт розміру файлу для цього сайту.`);
            return false;
        }
        return true;
    };
    const validateFormatError = (file)=>{
        const isCorrectFormat = allowedTypes.includes(file.type);
        if (!isCorrectFormat) {
            setFormatErrorMessage(`${file.name} не відповідний формат завантаженого файлу.`);
            return false;
        }
        return true;
    };
    const validateImage = (file)=>{
        const isValidSize = validateSizeError(file);
        const isValidFormat = validateFormatError(file);
        return isValidFormat && isValidSize;
    };
    const handleChange = (file)=>{
        setSizeErrorMessage("");
        setFormatErrorMessage("");
        onFileChange(null);
        if (validateImage(file)) {
            onFileChange(file);
        }
    };
    const pageClass = {
        books: (UploadImage_module_default()).books,
        partners: (UploadImage_module_default()).partners,
        quizzes: (UploadImage_module_default()).quizzes
    };
    return /*#__PURE__*/ jsx_runtime_.jsx(react_drag_drop_files_cjs/* FileUploader */.b, {
        classes: `${(UploadImage_module_default()).imageInput} ${pageClass[page]}`,
        name: "file",
        handleChange: handleChange,
        fileOrFiles: file,
        children: file || initialImg ? /*#__PURE__*/ jsx_runtime_.jsx(components_FileInput, {
            initialImg: initialImg,
            file: file,
            onFileChange: onFileChange,
            setInitialImg: setInitialImg
        }) : /*#__PURE__*/ jsx_runtime_.jsx(components_EmptyInput, {
            sizeErrorMessage: sizeErrorMessage,
            formatErrorMessage: formatErrorMessage
        })
    });
};
/* harmony default export */ const UploadImageComponent_UploadImage = (UploadImage);


/***/ }),

/***/ 23397:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  dt: () => (/* reexport */ Icons_AddIcon),
  SH: () => (/* reexport */ AdminCheckBox_AdminCheckBox),
  Pm: () => (/* reexport */ AdminHeader["default"]),
  dl: () => (/* reexport */ AdminSearch["default"]),
  $d: () => (/* reexport */ AnswerInput["default"]),
  yw: () => (/* reexport */ BookItem["default"]),
  VN: () => (/* reexport */ Books["default"]),
  Tw: () => (/* reexport */ Icons_CloseIcon),
  Au: () => (/* reexport */ FormButtons["default"]),
  Qj: () => (/* reexport */ SideBarLinks_LinkButton),
  mB: () => (/* reexport */ NavIcons_LockIcon),
  l2: () => (/* reexport */ NavBar["default"]),
  Ue: () => (/* reexport */ NavIcons_Neurology),
  X6: () => (/* reexport */ NoResults_NoResults),
  U_: () => (/* reexport */ PartnerItem["default"]),
  HN: () => (/* reexport */ ModalActions_Question),
  _u: () => (/* reexport */ QuestionsList["default"]),
  mo: () => (/* reexport */ components_QuizBookInput),
  xd: () => (/* reexport */ QuizzesForm["default"]),
  fB: () => (/* reexport */ ModalActions_Success),
  xD: () => (/* reexport */ TableHeader_TableHeader),
  zv: () => (/* reexport */ UploadImage["default"])
});

// UNUSED EXPORTS: Modal, SideBar

// EXTERNAL MODULE: ./src/app/(admin)/components/Header/AdminHeader.tsx
var AdminHeader = __webpack_require__(38851);
// EXTERNAL MODULE: ./src/components/common/ModalActions/Modal.tsx
var Modal = __webpack_require__(13189);
// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./src/components/common/index.ts + 3 modules
var common = __webpack_require__(78957);
// EXTERNAL MODULE: ./src/components/common/ModalActions/Modal.module.scss
var Modal_module = __webpack_require__(95661);
var Modal_module_default = /*#__PURE__*/__webpack_require__.n(Modal_module);
;// CONCATENATED MODULE: ./src/components/common/ModalActions/Question.tsx




const Question = ({ title, message, closeModal, successFnc, cancelButtonText = "Скасувати" })=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: (Modal_module_default()).question,
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
            className: (Modal_module_default()).content,
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx("h5", {
                    className: (Modal_module_default()).title,
                    children: title
                }),
                /*#__PURE__*/ jsx_runtime_.jsx("p", {
                    className: (Modal_module_default()).message,
                    children: message
                }),
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: (Modal_module_default()).buttons,
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx(common/* Button */.zx, {
                            variant: "outline",
                            onClick: ()=>closeModal(),
                            children: cancelButtonText
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(common/* Button */.zx, {
                            variant: "filled",
                            color: "secondary",
                            onClick: ()=>{
                                closeModal();
                                if (successFnc) successFnc();
                            },
                            children: "Підтвердити"
                        })
                    ]
                })
            ]
        })
    });
/* harmony default export */ const ModalActions_Question = (Question);

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/cjs/lucide-react.js
var lucide_react = __webpack_require__(64660);
;// CONCATENATED MODULE: ./src/components/common/ModalActions/Success.tsx




const Success = ({ title, message, closeModal })=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: (Modal_module_default()).success,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: (Modal_module_default()).closeBtn,
                onClick: closeModal,
                children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react.X, {})
            }),
            /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: (Modal_module_default()).content,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("h5", {
                        className: (Modal_module_default()).title,
                        children: title
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx("p", {
                        className: (Modal_module_default()).message,
                        children: message
                    })
                ]
            })
        ]
    });
/* harmony default export */ const ModalActions_Success = (Success);

// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(71198);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./src/app/(admin)/components/TableHeader/TableHeader.module.scss
var TableHeader_module = __webpack_require__(82429);
var TableHeader_module_default = /*#__PURE__*/__webpack_require__.n(TableHeader_module);
;// CONCATENATED MODULE: ./src/app/(admin)/components/TableHeader/TableHeader.tsx





const TableHeader = ({ colNames, variant, handleDelete })=>{
    const styleNames = {
        users: (TableHeader_module_default()).users,
        books: (TableHeader_module_default()).books,
        documents: (TableHeader_module_default()).documents,
        partners: (TableHeader_module_default()).partners,
        contacts: null
    };
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: (TableHeader_module_default()).header,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: classnames_default()(styleNames[variant], (TableHeader_module_default()).names),
                children: colNames.map((item, index)=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
                        children: item
                    }, index))
            }),
            variant === "users" || variant === "books" || variant === "partners" ? /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: (TableHeader_module_default()).icon,
                onClick: handleDelete,
                children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Trash2 */.VhS, {
                    width: 16,
                    height: 16
                })
            }) : null
        ]
    });
};
/* harmony default export */ const TableHeader_TableHeader = (TableHeader);

// EXTERNAL MODULE: ./src/app/(admin)/components/TableItems/PartnerItem/PartnerItem.tsx + 1 modules
var PartnerItem = __webpack_require__(8479);
// EXTERNAL MODULE: ./src/app/(admin)/components/TableItems/BookItem/BookItem.tsx + 1 modules
var BookItem = __webpack_require__(12920);
// EXTERNAL MODULE: ./src/components/common/form/Checkbox/Checkbox.module.scss
var Checkbox_module = __webpack_require__(31796);
var Checkbox_module_default = /*#__PURE__*/__webpack_require__.n(Checkbox_module);
;// CONCATENATED MODULE: ./src/app/(admin)/components/UI/AdminCheckBox/AdminCheckBox.tsx
/* eslint-disable jsx-a11y/label-has-associated-control */ 




const AdminCheckBox = ({ color = "primary", className, onChange, id })=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: classnames_default()(className),
        children: /*#__PURE__*/ jsx_runtime_.jsx("label", {
            className: (Checkbox_module_default()).label,
            htmlFor: id.toString(),
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("span", {
                className: classnames_default()((Checkbox_module_default())["input-group"], (Checkbox_module_default())[`input-group--${color}`]),
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx("input", {
                        id: id.toString(),
                        className: (Checkbox_module_default()).input,
                        type: "checkbox",
                        onChange: onChange
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Check */.JrY, {
                        className: (Checkbox_module_default())["input-checked-icon"],
                        strokeWidth: 4
                    })
                ]
            })
        })
    });
/* harmony default export */ const AdminCheckBox_AdminCheckBox = (AdminCheckBox);

// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(31621);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(59483);
// EXTERNAL MODULE: ./src/app/(admin)/components/UI/SideBarLinks/LinkButton.module.scss
var LinkButton_module = __webpack_require__(47871);
var LinkButton_module_default = /*#__PURE__*/__webpack_require__.n(LinkButton_module);
;// CONCATENATED MODULE: ./src/app/(admin)/components/UI/SideBarLinks/LinkButton.tsx





const LinkButton = ({ icon, iconOpen, anchor, ...props })=>{
    const pathname = (0,navigation.usePathname)();
    const children = /*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                children: icon
            }),
            anchor,
            iconOpen && /*#__PURE__*/ jsx_runtime_.jsx("div", {
                className: (LinkButton_module_default()).arrow,
                children: iconOpen
            })
        ]
    });
    if (props.component === "link") {
        const { href, ...otherProps } = props;
        return /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
            href: href,
            className: `${(LinkButton_module_default()).link} ${pathname === href && (LinkButton_module_default()).active}`,
            ...otherProps,
            children: children
        });
    }
    const { href, ...otherProps } = props;
    return /*#__PURE__*/ jsx_runtime_.jsx("button", {
        type: "button",
        className: `${(LinkButton_module_default()).link} ${pathname === href && (LinkButton_module_default()).active}`,
        ...otherProps,
        children: children
    });
};
/* harmony default export */ const SideBarLinks_LinkButton = (LinkButton);

;// CONCATENATED MODULE: ./src/app/(admin)/components/Header/Icons/AddIcon.tsx


const AddIcon = ()=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M5 12L19 12",
                stroke: "#1E1E1E",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M12 5L12 19",
                stroke: "#1E1E1E",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            })
        ]
    });
/* harmony default export */ const Icons_AddIcon = (AddIcon);

;// CONCATENATED MODULE: ./src/app/(admin)/components/Header/Icons/CloseIcon.tsx


const CloseIcon = ()=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
        width: "56",
        height: "56",
        viewBox: "0 0 56 56",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("rect", {
                x: "1",
                y: "1",
                width: "54",
                height: "54",
                rx: "7",
                fill: "#FDFDFD"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("rect", {
                x: "1",
                y: "1",
                width: "54",
                height: "54",
                rx: "7",
                stroke: "#7791FA",
                strokeWidth: "2"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M34 22L22 34",
                stroke: "#7791FA",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M22 22L34 34",
                stroke: "#7791FA",
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            })
        ]
    });
/* harmony default export */ const Icons_CloseIcon = (CloseIcon);

// EXTERNAL MODULE: ./src/app/(admin)/components/SideBar/SideBar.tsx
var SideBar = __webpack_require__(68979);
;// CONCATENATED MODULE: ./src/app/(admin)/components/SideBar/NavIcons/LockIcon.tsx


const LockIcon = ({ stroke = "#7791fa" })=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "25",
        viewBox: "0 0 24 25",
        fill: "none",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M12 17.75C12.5523 17.75 13 17.3023 13 16.75C13 16.1977 12.5523 15.75 12 15.75C11.4477 15.75 11 16.1977 11 16.75C11 17.3023 11.4477 17.75 12 17.75Z",
                stroke: stroke,
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M19 10.75H5C3.89543 10.75 3 11.6454 3 12.75V20.75C3 21.8546 3.89543 22.75 5 22.75H19C20.1046 22.75 21 21.8546 21 20.75V12.75C21 11.6454 20.1046 10.75 19 10.75Z",
                stroke: stroke,
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("path", {
                d: "M7 10.75V7.75C7 6.42392 7.52678 5.15215 8.46447 4.21447C9.40215 3.27678 10.6739 2.75 12 2.75C13.3261 2.75 14.5979 3.27678 15.5355 4.21447C16.4732 5.15215 17 6.42392 17 7.75V10.75",
                stroke: stroke,
                strokeWidth: "2",
                strokeLinecap: "round",
                strokeLinejoin: "round"
            })
        ]
    });
/* harmony default export */ const NavIcons_LockIcon = (LockIcon);

;// CONCATENATED MODULE: ./src/app/(admin)/components/SideBar/NavIcons/Neurology.tsx


const Neurology = ()=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        width: "24",
        height: "24",
        viewBox: "0 0 24 24",
        fill: "none",
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("mask", {
                id: "mask0_9531_51921",
                maskUnits: "userSpaceOnUse",
                x: "0",
                y: "0",
                width: "24",
                height: "24",
                children: /*#__PURE__*/ jsx_runtime_.jsx("rect", {
                    width: "24",
                    height: "24",
                    fill: "#D9D9D9"
                })
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("g", {
                mask: "url(#mask0_9531_51921)",
                children: /*#__PURE__*/ jsx_runtime_.jsx("path", {
                    d: "M9.25 23C8.21111 23 7.31482 22.6384 6.56111 21.9153C5.80741 21.1921 5.37963 20.3213 5.27778 19.3028C4.05556 19.1398 3.03704 18.6 2.22222 17.6833C1.40741 16.7667 1 15.687 1 14.4444C1 14.0167 1.05602 13.594 1.16806 13.1764C1.28009 12.7588 1.44815 12.3667 1.67222 12C1.44815 11.6333 1.28009 11.2463 1.16806 10.8389C1.05602 10.4315 1 10.0037 1 9.55556C1 8.31296 1.40741 7.23843 2.22222 6.33194C3.03704 5.42546 4.04537 4.89074 5.24722 4.72778C5.30833 3.68889 5.72593 2.80787 6.5 2.08472C7.27407 1.36157 8.19074 1 9.25 1C9.77963 1 10.2736 1.10185 10.7319 1.30556C11.1903 1.50926 11.613 1.78426 12 2.13056C12.3667 1.78426 12.7843 1.50926 13.2528 1.30556C13.7213 1.10185 14.2204 1 14.75 1C15.8093 1 16.7208 1.35648 17.4847 2.06944C18.2486 2.78241 18.6611 3.65833 18.7222 4.69722C19.9241 4.86019 20.9375 5.4 21.7625 6.31667C22.5875 7.23333 23 8.31296 23 9.55556C23 10.0037 22.944 10.4315 22.8319 10.8389C22.7199 11.2463 22.5519 11.6333 22.3278 12C22.5519 12.3667 22.7199 12.7588 22.8319 13.1764C22.944 13.594 23 14.0167 23 14.4444C23 15.7074 22.5875 16.7921 21.7625 17.6986C20.9375 18.6051 19.9139 19.1398 18.6917 19.3028C18.5898 20.3213 18.1671 21.1921 17.4236 21.9153C16.6801 22.6384 15.7889 23 14.75 23C14.2407 23 13.7468 22.9032 13.2681 22.7097C12.7894 22.5162 12.3667 22.2463 12 21.9C11.613 22.2463 11.1852 22.5162 10.7167 22.7097C10.2481 22.9032 9.75926 23 9.25 23ZM13.2222 4.97222V19.0278C13.2222 19.4556 13.3699 19.8171 13.6653 20.1125C13.9606 20.4079 14.3222 20.5556 14.75 20.5556C15.1574 20.5556 15.5088 20.3926 15.8042 20.0667C16.0995 19.7407 16.2574 19.3741 16.2778 18.9667C15.85 18.8037 15.4579 18.5847 15.1014 18.3097C14.7449 18.0347 14.4241 17.7037 14.1389 17.3167C13.9352 17.0315 13.8588 16.7259 13.9097 16.4C13.9606 16.0741 14.1287 15.8093 14.4139 15.6056C14.6991 15.4019 15.0046 15.3255 15.3306 15.3764C15.6565 15.4273 15.9213 15.5954 16.125 15.8806C16.3491 16.2065 16.6343 16.456 16.9806 16.6292C17.3269 16.8023 17.7037 16.8889 18.1111 16.8889C18.7833 16.8889 19.3588 16.6495 19.8375 16.1708C20.3162 15.6921 20.5556 15.1167 20.5556 14.4444C20.5556 14.3426 20.5505 14.2407 20.5403 14.1389C20.5301 14.037 20.5046 13.9352 20.4639 13.8333C20.1176 14.037 19.7458 14.1898 19.3486 14.2917C18.9514 14.3935 18.5389 14.4444 18.1111 14.4444C17.7648 14.4444 17.4745 14.3273 17.2403 14.0931C17.006 13.8588 16.8889 13.5685 16.8889 13.2222C16.8889 12.8759 17.006 12.5856 17.2403 12.3514C17.4745 12.1171 17.7648 12 18.1111 12C18.7833 12 19.3588 11.7606 19.8375 11.2819C20.3162 10.8032 20.5556 10.2278 20.5556 9.55556C20.5556 8.88333 20.3162 8.31296 19.8375 7.84444C19.3588 7.37593 18.7833 7.13148 18.1111 7.11111C17.887 7.47778 17.5968 7.79861 17.2403 8.07361C16.8838 8.34861 16.4917 8.56759 16.0639 8.73056C15.738 8.85278 15.4222 8.84259 15.1167 8.7C14.8111 8.55741 14.6074 8.32315 14.5056 7.99722C14.4037 7.6713 14.419 7.35556 14.5514 7.05C14.6838 6.74444 14.913 6.54074 15.2389 6.43889C15.5444 6.33704 15.794 6.1537 15.9875 5.88889C16.181 5.62407 16.2778 5.31852 16.2778 4.97222C16.2778 4.54444 16.1301 4.18287 15.8347 3.8875C15.5394 3.59213 15.1778 3.44444 14.75 3.44444C14.3222 3.44444 13.9606 3.59213 13.6653 3.8875C13.3699 4.18287 13.2222 4.54444 13.2222 4.97222ZM10.7778 19.0278V4.97222C10.7778 4.54444 10.6301 4.18287 10.3347 3.8875C10.0394 3.59213 9.67778 3.44444 9.25 3.44444C8.82222 3.44444 8.46065 3.59213 8.16528 3.8875C7.86991 4.18287 7.72222 4.54444 7.72222 4.97222C7.72222 5.29815 7.81389 5.59861 7.99722 5.87361C8.18056 6.14861 8.425 6.33704 8.73056 6.43889C9.05648 6.54074 9.29074 6.74444 9.43333 7.05C9.57593 7.35556 9.5963 7.6713 9.49444 7.99722C9.37222 8.32315 9.15833 8.55741 8.85278 8.7C8.54722 8.84259 8.23148 8.85278 7.90556 8.73056C7.47778 8.56759 7.08565 8.34861 6.72917 8.07361C6.37268 7.79861 6.08241 7.47778 5.85833 7.11111C5.20648 7.13148 4.6412 7.38102 4.1625 7.85972C3.6838 8.33843 3.44444 8.9037 3.44444 9.55556C3.44444 10.2278 3.6838 10.8032 4.1625 11.2819C4.6412 11.7606 5.21667 12 5.88889 12C6.23519 12 6.52546 12.1171 6.75972 12.3514C6.99398 12.5856 7.11111 12.8759 7.11111 13.2222C7.11111 13.5685 6.99398 13.8588 6.75972 14.0931C6.52546 14.3273 6.23519 14.4444 5.88889 14.4444C5.46111 14.4444 5.04861 14.3935 4.65139 14.2917C4.25417 14.1898 3.88241 14.037 3.53611 13.8333C3.49537 13.9352 3.46991 14.037 3.45972 14.1389C3.44954 14.2407 3.44444 14.3426 3.44444 14.4444C3.44444 15.1167 3.6838 15.6921 4.1625 16.1708C4.6412 16.6495 5.21667 16.8889 5.88889 16.8889C6.2963 16.8889 6.67315 16.8023 7.01944 16.6292C7.36574 16.456 7.65093 16.2065 7.875 15.8806C8.0787 15.5954 8.34352 15.4273 8.66944 15.3764C8.99537 15.3255 9.30093 15.4019 9.58611 15.6056C9.8713 15.8093 10.0394 16.0741 10.0903 16.4C10.1412 16.7259 10.0648 17.0315 9.86111 17.3167C9.57593 17.7037 9.25 18.0398 8.88333 18.325C8.51667 18.6102 8.11944 18.8343 7.69167 18.9972C7.71204 19.4046 7.875 19.7662 8.18056 20.0819C8.48611 20.3977 8.84259 20.5556 9.25 20.5556C9.67778 20.5556 10.0394 20.4079 10.3347 20.1125C10.6301 19.8171 10.7778 19.4556 10.7778 19.0278Z",
                    fill: "#FDFDFD"
                })
            })
        ]
    });
/* harmony default export */ const NavIcons_Neurology = (Neurology);

// EXTERNAL MODULE: ./src/app/(admin)/components/SideBar/Navigation/NavBar.tsx
var NavBar = __webpack_require__(39440);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(48421);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./src/app/(admin)/components/NoResults/NoResults.module.scss
var NoResults_module = __webpack_require__(54704);
var NoResults_module_default = /*#__PURE__*/__webpack_require__.n(NoResults_module);
;// CONCATENATED MODULE: ./src/app/(admin)/components/NoResults/NoResults.tsx




const NoResults = ({ text, image })=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: (NoResults_module_default()).wrapper,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx("div", {
                children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                    src: image,
                    alt: "немає результатів",
                    width: 199,
                    height: 199
                })
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("p", {
                className: (NoResults_module_default()).text,
                children: text
            })
        ]
    });
/* harmony default export */ const NoResults_NoResults = (NoResults);

// EXTERNAL MODULE: ./src/app/(admin)/components/Search/AdminSearch.tsx
var AdminSearch = __webpack_require__(74397);
// EXTERNAL MODULE: ./src/app/(admin)/components/BooksComponent/Books.tsx + 2 modules
var Books = __webpack_require__(9891);
// EXTERNAL MODULE: ./src/app/(admin)/admin/quizzes/components/QuizzesForm/QuizzesForm.tsx + 6 modules
var QuizzesForm = __webpack_require__(44798);
// EXTERNAL MODULE: ./src/app/(admin)/admin/quizzes/components/QuizzesForm/components/AnswerInput.tsx
var AnswerInput = __webpack_require__(31761);
// EXTERNAL MODULE: ./src/app/(admin)/components/UploadImageComponent/UploadImage.tsx + 2 modules
var UploadImage = __webpack_require__(36829);
// EXTERNAL MODULE: ./src/app/(admin)/admin/quizzes/components/QuizzesForm/components/QuestionsList.tsx
var QuestionsList = __webpack_require__(5320);
// EXTERNAL MODULE: ./src/app/(admin)/admin/quizzes/components/QuizzesForm/components/FormButtons.tsx
var FormButtons = __webpack_require__(72291);
// EXTERNAL MODULE: ./src/app/(admin)/components/SearchableSelect/SearchableSelect.tsx
var SearchableSelect = __webpack_require__(18446);
// EXTERNAL MODULE: ./src/app/(admin)/admin/quizzes/components/QuizzesForm/QuizForm.module.scss
var QuizForm_module = __webpack_require__(91937);
var QuizForm_module_default = /*#__PURE__*/__webpack_require__.n(QuizForm_module);
;// CONCATENATED MODULE: ./src/app/(admin)/admin/quizzes/components/QuizzesForm/components/BookSearchEdit.tsx




const BookSearchEdit = ({ value })=>/*#__PURE__*/ jsx_runtime_.jsx("div", {
        className: (QuizForm_module_default()).bookSearch,
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("label", {
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx("span", {
                    children: "Назва книги"
                }),
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: (QuizForm_module_default()).input,
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx("input", {
                            type: "text",
                            value: value,
                            disabled: true
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* ChevronDown */._ME, {})
                    ]
                })
            ]
        })
    });
/* harmony default export */ const components_BookSearchEdit = (BookSearchEdit);

;// CONCATENATED MODULE: ./src/app/(admin)/admin/quizzes/components/QuizzesForm/components/QuizBookInput.tsx






const QuizBookInput = ({ onChange, onInputChange, clearInput, options, selected, inputValue, label, error, id, value })=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
        className: (QuizForm_module_default()).book,
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(common/* Typography */.ZT, {
                component: "h2",
                variant: "h5",
                children: "Книга"
            }),
            id ? /*#__PURE__*/ jsx_runtime_.jsx(components_BookSearchEdit, {
                value: value && value
            }) : /*#__PURE__*/ jsx_runtime_.jsx(SearchableSelect["default"], {
                options: options,
                onChange: onChange,
                clearInput: clearInput,
                onInputChange: onInputChange,
                selected: selected,
                inputValue: inputValue,
                label: label,
                error: error,
                loading: true
            })
        ]
    });
/* harmony default export */ const components_QuizBookInput = (QuizBookInput);

;// CONCATENATED MODULE: ./src/app/(admin)/components/index.ts


























/***/ }),

/***/ 13123:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(46494);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(32770);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(63370);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_2__);
/* __next_internal_client_entry_do_not_use__ default auto */ 



const Providers = ({ children })=>{
    const [queryClient] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(()=>new _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__/* .QueryClient */ .S({
            defaultOptions: {
                queries: {
                    refetchOnWindowFocus: false
                }
            }
        }));
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_auth_react__WEBPACK_IMPORTED_MODULE_2__.SessionProvider, {
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_tanstack_react_query__WEBPACK_IMPORTED_MODULE_4__.QueryClientProvider, {
            client: queryClient,
            children: children
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Providers);


/***/ }),

/***/ 99691:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(64660);
/* harmony import */ var react_paginate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(23587);
/* harmony import */ var react_paginate__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_paginate__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(71198);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(29571);
/* harmony import */ var _Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4__);
/* __next_internal_client_entry_do_not_use__ default auto */ 





const Pagination = ({ size = "small", count, onPageChange, currentPage })=>{
    const paginationLink = {
        extraSmall: (_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().extraSmall),
        small: (_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().small),
        large: (_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().large)
    };
    const labelClassName = {
        extraSmall: (_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().labelExtraSmall),
        small: (_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().labelSmall),
        large: (_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().labelLarge)
    };
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: (_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().wrapper),
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx((react_paginate__WEBPACK_IMPORTED_MODULE_2___default()), {
            forcePage: currentPage - 1,
            previousLabel: size === "extraSmall" ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_5__/* .ChevronLeft */ .s$$, {}) : "Назад",
            previousClassName: classnames__WEBPACK_IMPORTED_MODULE_3___default()(labelClassName[size], (_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().label)),
            nextLabel: size === "extraSmall" ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_5__/* .ChevronRight */ ._Qn, {}) : "Вперед",
            nextClassName: classnames__WEBPACK_IMPORTED_MODULE_3___default()(labelClassName[size], (_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().label), {
                [(_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().disabled)]: currentPage >= count
            }),
            disabledClassName: (_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().disabled),
            breakClassName: classnames__WEBPACK_IMPORTED_MODULE_3___default()((_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().breakClass)),
            breakLabel: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                width: "16",
                height: "5",
                viewBox: "0 0 16 5",
                fill: "none",
                children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                    d: "M2.13894 4.168C1.59494 4.168 1.13094 3.984 0.746938 3.616C0.362938 3.232 0.170938 2.752 0.170938 2.176C0.170938 1.584 0.354938 1.104 0.722938 0.736C1.10694 0.368 1.57894 0.184 2.13894 0.184C2.69894 0.184 3.16294 0.368 3.53094 0.736C3.91494 1.104 4.10694 1.584 4.10694 2.176C4.10694 2.752 3.91494 3.232 3.53094 3.616C3.14694 3.984 2.68294 4.168 2.13894 4.168ZM7.99831 4.168C7.45431 4.168 6.99031 3.984 6.60631 3.616C6.22231 3.232 6.03031 2.752 6.03031 2.176C6.03031 1.584 6.21431 1.104 6.58231 0.736C6.96631 0.368 7.43831 0.184 7.99831 0.184C8.55831 0.184 9.02231 0.368 9.39031 0.736C9.77431 1.104 9.96631 1.584 9.96631 2.176C9.96631 2.752 9.77431 3.232 9.39031 3.616C9.00631 3.984 8.54231 4.168 7.99831 4.168ZM13.8577 4.168C13.3137 4.168 12.8497 3.984 12.4657 3.616C12.0817 3.232 11.8897 2.752 11.8897 2.176C11.8897 1.584 12.0737 1.104 12.4417 0.736C12.8257 0.368 13.2977 0.184 13.8577 0.184C14.4177 0.184 14.8817 0.368 15.2497 0.736C15.6337 1.104 15.8257 1.584 15.8257 2.176C15.8257 2.752 15.6337 3.232 15.2497 3.616C14.8657 3.984 14.4017 4.168 13.8577 4.168Z",
                    fill: "#7791FA"
                })
            }),
            pageCount: count,
            marginPagesDisplayed: 1,
            pageRangeDisplayed: 4,
            pageLinkClassName: classnames__WEBPACK_IMPORTED_MODULE_3___default()(paginationLink[size], (_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().link)),
            onPageChange: (event)=>onPageChange(event.selected + 1),
            containerClassName: (_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().pagination),
            activeLinkClassName: (_Pagination_module_scss__WEBPACK_IMPORTED_MODULE_4___default().active),
            renderOnZeroPageCount: null
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Pagination);


/***/ }),

/***/ 93682:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(71198);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Container_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9206);
/* harmony import */ var _Container_module_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Container_module_scss__WEBPACK_IMPORTED_MODULE_2__);



const Container = ({ children, className })=>{
    const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()((_Container_module_scss__WEBPACK_IMPORTED_MODULE_2___default().container), className);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: classes,
        children: children
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Container);


/***/ }),

/***/ 26384:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _IconButton_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(96078);
/* harmony import */ var _IconButton_module_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_IconButton_module_scss__WEBPACK_IMPORTED_MODULE_2__);



const ClearButtonIcon = ({ icon, ...props })=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("button", {
        className: (_IconButton_module_scss__WEBPACK_IMPORTED_MODULE_2___default().button),
        type: "button",
        ...props,
        children: icon
    });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ClearButtonIcon);


/***/ }),

/***/ 54647:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* reexport safe */ _IconButton__WEBPACK_IMPORTED_MODULE_0__.Z)
/* harmony export */ });
/* harmony import */ var _IconButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(26384);



/***/ }),

/***/ 13189:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _app_admin_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(23397);
/* harmony import */ var _Modal_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(95661);
/* harmony import */ var _Modal_module_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Modal_module_scss__WEBPACK_IMPORTED_MODULE_3__);
/* __next_internal_client_entry_do_not_use__ default auto */ 



const Modal = ({ type, message, title, active, setActive, successFnc, cancelButtonText })=>{
    const closeModal = ()=>{
        setActive(false);
    };
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (active) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
    }, [
        active
    ]);
    let content;
    if (type === "success") {
        content = /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_2__/* .Success */ .fB, {
            closeModal: closeModal,
            title: title,
            message: message
        });
    } else {
        content = /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_app_admin_components__WEBPACK_IMPORTED_MODULE_2__/* .Question */ .HN, {
            closeModal: closeModal,
            title: title,
            message: message,
            successFnc: successFnc,
            cancelButtonText: cancelButtonText
        });
    }
    return active && /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: (_Modal_module_scss__WEBPACK_IMPORTED_MODULE_3___default().backdrop),
                onClick: closeModal
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
                className: (_Modal_module_scss__WEBPACK_IMPORTED_MODULE_3___default().modal),
                children: content
            })
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Modal);


/***/ }),

/***/ 59476:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(71198);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Typography_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4789);
/* harmony import */ var _Typography_module_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Typography_module_scss__WEBPACK_IMPORTED_MODULE_2__);



const Typography = ({ children, variant, component, className })=>/*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(component, {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, (_Typography_module_scss__WEBPACK_IMPORTED_MODULE_2___default())[`text-${variant}`])
    }, children);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Typography);


/***/ }),

/***/ 58929:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(71031);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(64660);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(71198);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Checkbox_module_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(31796);
/* harmony import */ var _Checkbox_module_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_Checkbox_module_scss__WEBPACK_IMPORTED_MODULE_3__);
/* __next_internal_client_entry_do_not_use__ default auto */ 




const Checkbox = ({ name, control, color = "primary", className, children, ...props })=>{
    const { field } = (0,react_hook_form__WEBPACK_IMPORTED_MODULE_2__/* .useController */ .bc)({
        name,
        control
    });
    const id = `checkbox-${name}`;
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className),
        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", {
            className: (_Checkbox_module_scss__WEBPACK_IMPORTED_MODULE_3___default().label),
            htmlFor: id,
            children: [
                /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()((_Checkbox_module_scss__WEBPACK_IMPORTED_MODULE_3___default()["input-group"]), (_Checkbox_module_scss__WEBPACK_IMPORTED_MODULE_3___default())[`input-group--${color}`]),
                    children: [
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                            id: id,
                            type: "checkbox",
                            className: (_Checkbox_module_scss__WEBPACK_IMPORTED_MODULE_3___default().input),
                            ...field,
                            checked: field.value,
                            ...props
                        }),
                        /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* .Check */ .JrY, {
                            className: (_Checkbox_module_scss__WEBPACK_IMPORTED_MODULE_3___default()["input-checked-icon"]),
                            strokeWidth: 4
                        })
                    ]
                }),
                children && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                    className: (_Checkbox_module_scss__WEBPACK_IMPORTED_MODULE_3___default()["label-text"]),
                    children: children
                })
            ]
        })
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Checkbox);


/***/ }),

/***/ 95966:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (/* reexport safe */ _Checkbox__WEBPACK_IMPORTED_MODULE_0__["default"])
/* harmony export */ });
/* harmony import */ var _Checkbox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(58929);



/***/ }),

/***/ 38346:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(71031);
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(64660);
/* harmony import */ var _components_common_IconButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(54647);
/* harmony import */ var _Input_module_scss__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(36361);
/* harmony import */ var _Input_module_scss__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_Input_module_scss__WEBPACK_IMPORTED_MODULE_5__);
/* __next_internal_client_entry_do_not_use__ default auto */ 





const Input = ({ label, name, control, icon, resetField, className, handleKeyDown, additionalIcon, usage, ...props })=>{
    const { field, fieldState: { error } } = (0,react_hook_form__WEBPACK_IMPORTED_MODULE_3__/* .useController */ .bc)({
        name,
        control
    });
    const status = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>{
        if (error) {
            return "error";
        }
        if (field.value) {
            return "filled";
        }
        return "normal";
    }, [
        error,
        field.value
    ]);
    const renderIcon = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>{
        if (status === "error") {
            return field.value?.length > 0 ? /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_common_IconButton__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z, {
                onClick: resetField,
                icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* .XCircle */ .a2, {})
            }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* .AlertCircle */ .bG7, {});
        }
        if (icon) {
            return icon;
        }
        if (field.value.length > 0 && props.type === "email") {
            return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(_components_common_IconButton__WEBPACK_IMPORTED_MODULE_2__/* ["default"] */ .Z, {
                onClick: resetField,
                icon: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* .XCircle */ .a2, {})
            });
        }
        return null;
    }, [
        field.value?.length,
        icon,
        resetField,
        status,
        props.type
    ]);
    const renderAdditionalIcon = (0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)(()=>{
        if (additionalIcon && field.value.length > 0) {
            return additionalIcon;
        }
        return null;
    }, [
        additionalIcon,
        field.value
    ]);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: `${(_Input_module_scss__WEBPACK_IMPORTED_MODULE_5___default().group)} ${className || ""}`,
        "data-status": status,
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("label", {
                className: (_Input_module_scss__WEBPACK_IMPORTED_MODULE_5___default().label),
                children: [
                    label && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        className: (_Input_module_scss__WEBPACK_IMPORTED_MODULE_5___default()["label-text"]),
                        children: label
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("span", {
                        className: (_Input_module_scss__WEBPACK_IMPORTED_MODULE_5___default()["input-group"]),
                        children: [
                            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("input", {
                                className: (_Input_module_scss__WEBPACK_IMPORTED_MODULE_5___default().input),
                                ...field,
                                onKeyDown: handleKeyDown && handleKeyDown,
                                ...props
                            }),
                            renderIcon && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                className: (_Input_module_scss__WEBPACK_IMPORTED_MODULE_5___default().icon),
                                children: renderIcon
                            }),
                            renderAdditionalIcon && /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                                className: `${(_Input_module_scss__WEBPACK_IMPORTED_MODULE_5___default().icon)} ${(_Input_module_scss__WEBPACK_IMPORTED_MODULE_5___default().additionalIcon)}`,
                                children: renderAdditionalIcon
                            })
                        ]
                    })
                ]
            }),
            error && (usage === "admin" ? /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                className: (_Input_module_scss__WEBPACK_IMPORTED_MODULE_5___default().errorMessage),
                children: [
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(lucide_react__WEBPACK_IMPORTED_MODULE_4__/* .AlertCircle */ .bG7, {
                        width: 14,
                        height: 14
                    }),
                    /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                        children: error.message
                    })
                ]
            }) : /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("span", {
                className: (_Input_module_scss__WEBPACK_IMPORTED_MODULE_5___default().message),
                children: error.message
            }))
        ]
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Input);


/***/ }),

/***/ 26560:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  XZ: () => (/* reexport */ Checkbox/* default */.Z),
  II: () => (/* reexport */ Input/* default */.Z),
  Y2: () => (/* reexport */ NumberInput_NumberInput),
  WU: () => (/* reexport */ PasswordInput_PasswordInput),
  Uf: () => (/* reexport */ validation)
});

// UNUSED EXPORTS: notEmailMatch

// EXTERNAL MODULE: ./src/components/common/form/Input/Input.tsx
var Input = __webpack_require__(38346);
;// CONCATENATED MODULE: ./src/components/common/form/Input/index.ts



// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/cjs/lucide-react.js
var lucide_react = __webpack_require__(64660);
// EXTERNAL MODULE: ./src/components/common/IconButton/index.ts
var IconButton = __webpack_require__(54647);
;// CONCATENATED MODULE: ./src/components/common/form/PasswordInput/PasswordInput.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 




const PasswordInput = (props)=>{
    const [isShowPassword, setIsShowPassword] = (0,react_.useState)(false);
    const clickIconHandler = ()=>{
        setIsShowPassword((prev)=>!prev);
    };
    return /*#__PURE__*/ jsx_runtime_.jsx(Input/* default */.Z, {
        type: isShowPassword ? "text" : "password",
        ...props,
        icon: /*#__PURE__*/ jsx_runtime_.jsx(IconButton/* default */.Z, {
            icon: isShowPassword ? /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* EyeOff */._jl, {}) : /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Eye */.bAj, {}),
            onClick: clickIconHandler
        })
    });
};
/* harmony default export */ const PasswordInput_PasswordInput = (PasswordInput);

;// CONCATENATED MODULE: ./src/components/common/form/PasswordInput/index.ts


// EXTERNAL MODULE: ./src/components/common/form/Checkbox/index.ts
var Checkbox = __webpack_require__(95966);
// EXTERNAL MODULE: ./node_modules/react-hook-form/dist/index.esm.mjs
var index_esm = __webpack_require__(71031);
;// CONCATENATED MODULE: ./src/components/common/form/NumberInput/NumberInput.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 


const NumberInput = (props)=>{
    const { name, control } = props;
    const { field } = (0,index_esm/* useController */.bc)({
        name,
        control
    });
    const changeHandler = (evt)=>{
        field.onChange(evt.target.value.toString().replace(/((\D+)|(^(?:0+(?=[1-9])|0+(?=0$))))/g, ""));
    };
    return /*#__PURE__*/ jsx_runtime_.jsx(Input/* default */.Z, {
        ...props,
        inputMode: "numeric",
        onChange: changeHandler,
        autoComplete: "off"
    });
};
/* harmony default export */ const NumberInput_NumberInput = (NumberInput);

;// CONCATENATED MODULE: ./src/components/common/form/NumberInput/index.ts


// EXTERNAL MODULE: ./node_modules/yup/index.js
var yup = __webpack_require__(58952);
;// CONCATENATED MODULE: ./src/components/common/form/validation.ts

const phoneRegExp = /^\+\d{1,12}$/;
const notEmailMatch = (value, context)=>{
    const emailPart = context?.options?.context?.user?.email?.split("@")[0];
    return !value || value.toLowerCase() !== emailPart?.toLowerCase();
};
const emailRegex = // eslint-disable-next-line no-control-regex
/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const passworsRegex = /^(?=.*[0-9])(?=.*[a-zA-Z]).{6,30}$/;
const validation = {
    email: yup/* string */.Z_().lowercase().matches(emailRegex, "Не вірна email адреса.").required(),
    signUpPassword: yup/* string */.Z_().required("Пароль не може бути порожнім."),
    password: yup/* string */.Z_().min(8, ({ min })=>`Пароль має бути не менше ${min} символів.`).max(64, ({ max })=>`Пароль має бути не більше ніж ${max} символів.`).matches(passworsRegex, "Пароль повинен бути латиницею та містити хоча б 1 цифру.").matches(/[A-Z]/, "Пароль повинен містити хоча б одну велику літеру.").matches(/[a-z]/, "Пароль повинен містити хоча б одну маленьку літеру.").matches(/[@#$%^&+=!]/, 'Пароль повинен містити хоча б один символ з перелічених: "@#$%^&+=!".').test("notEmailMatch", "Пароль надто схожий на email", notEmailMatch).required("Пароль не може бути порожнім."),
    confirmPassword: yup/* string */.Z_().oneOf([
        yup/* ref */.iH("password")
    ], "Пароль не співпадає.").required("Будь ласка, підтвердіть пароль."),
    rememberMe: yup/* boolean */.O7().required(),
    acceptedRules: yup/* boolean */.O7().oneOf([
        true
    ], "Ви повинні прийняти правила користування сайтом.").required(),
    donate: yup/* number */.Rx().typeError("Сума донату повинна бути більша за 0.").positive("Сума донату повинна бути більша за 0.").required(),
    bookInput: yup/* string */.Z_().min(2, "Мінімальна кількість символів 2").required("Будь ласка, заповніть поле"),
    recommended: yup/* boolean */.O7().required(),
    first_phone: yup/* string */.Z_().max(13, "Введіть коректний номер телефону").test("starts-with-plus", "Номер телефону має починатися з +", (value)=>{
        if (!value) return false;
        if (!value.startsWith("+38")) throw new yup/* ValidationError */.p8("Номер телефону має починатися з +38");
        return true;
    }).test("format-plus380", "Номер телефону в форматі +380XXXXXXXXX", (value)=>{
        if (!value) return false;
        if (value === "+") return true;
        return phoneRegExp.test(value);
    }).required("Введіть номер телефону "),
    second_phone: yup/* string */.Z_().max(13, "Введіть коректний номер телефону").test("starts-with-plus", "Номер телефону має починатися з +", (value)=>{
        if (!value) return false;
        if (!value.startsWith("+38")) throw new yup/* ValidationError */.p8("Номер телефону має починатися з +38");
        return true;
    }).test("format-plus380", "Номер телефону в форматі +380XXXXXXXXX", (value)=>{
        if (!value) return false;
        if (value === "+") return true;
        return phoneRegExp.test(value);
    }),
    id: yup/* string */.Z_(),
    partnerInput: yup/* string */.Z_().required("Будь ласка, заповніть поле"),
    url: yup/* string */.Z_().required().matches(/^https:\/\//, "URL повинен починатися з https://")
};

;// CONCATENATED MODULE: ./src/components/common/form/index.ts








/***/ }),

/***/ 78957:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  zx: () => (/* reexport */ Button_Button),
  XZ: () => (/* reexport */ Checkbox/* default */.Z),
  W2: () => (/* reexport */ Container/* default */.Z),
  u_: () => (/* reexport */ Modal["default"]),
  $j: () => (/* reexport */ Spinner_Spinner),
  ZT: () => (/* reexport */ Typography/* default */.Z),
  Rb: () => (/* reexport */ XButton_XButton)
});

// EXTERNAL MODULE: ./src/components/common/Container/Container.tsx
var Container = __webpack_require__(93682);
// EXTERNAL MODULE: ./src/components/common/Typography/Typography.tsx
var Typography = __webpack_require__(59476);
// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(31621);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(71198);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./src/components/common/Spinner/Spinner.module.scss
var Spinner_module = __webpack_require__(1381);
var Spinner_module_default = /*#__PURE__*/__webpack_require__.n(Spinner_module);
;// CONCATENATED MODULE: ./src/components/common/Spinner/Spinner.tsx



const Spinner = ({ className, ...props })=>/*#__PURE__*/ jsx_runtime_.jsx("span", {
        className: classnames_default()((Spinner_module_default()).loader, className),
        ...props
    });
/* harmony default export */ const Spinner_Spinner = (Spinner);

// EXTERNAL MODULE: ./src/components/common/Button/Button.module.scss
var Button_module = __webpack_require__(91906);
var Button_module_default = /*#__PURE__*/__webpack_require__.n(Button_module);
;// CONCATENATED MODULE: ./src/components/common/Button/Button.tsx






const Button = (props)=>{
    const { children, className, variant = "filled", color = "primary", size = "default", isLoading, selected, startIcon, endIcon, component = "button", ...otherProps } = props;
    const buttonClassNames = classnames_default()(className, (Button_module_default()).button, (Button_module_default())[`button--${variant}`], (Button_module_default())[`button--${color}`], (Button_module_default())[`button--${size}`], {
        [(Button_module_default()).loading]: isLoading
    });
    const renderButtonContent = ()=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
            children: [
                startIcon && /*#__PURE__*/ jsx_runtime_.jsx("span", {
                    className: (Button_module_default())["button-icon"],
                    children: startIcon
                }),
                children,
                endIcon && /*#__PURE__*/ jsx_runtime_.jsx("span", {
                    className: (Button_module_default())["button-icon"],
                    children: endIcon
                }),
                isLoading && /*#__PURE__*/ jsx_runtime_.jsx(Spinner_Spinner, {})
            ]
        });
    if (component === "link") {
        const { href, ...linkProps } = otherProps;
        return /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
            href: href,
            ...linkProps,
            className: buttonClassNames,
            "data-selected": selected,
            children: renderButtonContent()
        });
    }
    const buttonProps = otherProps;
    return /*#__PURE__*/ jsx_runtime_.jsx("button", {
        type: "button",
        className: buttonClassNames,
        "data-selected": selected,
        ...buttonProps,
        children: renderButtonContent()
    });
};
/* harmony default export */ const Button_Button = (Button);

// EXTERNAL MODULE: ./node_modules/lucide-react/dist/cjs/lucide-react.js
var lucide_react = __webpack_require__(64660);
// EXTERNAL MODULE: ./src/components/common/XButton/XButton.module.scss
var XButton_module = __webpack_require__(32660);
var XButton_module_default = /*#__PURE__*/__webpack_require__.n(XButton_module);
;// CONCATENATED MODULE: ./src/components/common/XButton/XButton.tsx




const XButton = ({ className, ...props })=>/*#__PURE__*/ jsx_runtime_.jsx("button", {
        className: classnames_default()((XButton_module_default()).button, className),
        type: "button",
        ...props,
        children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react.X, {
            size: 24
        })
    });
/* harmony default export */ const XButton_XButton = (XButton);

// EXTERNAL MODULE: ./src/components/common/form/Checkbox/index.ts
var Checkbox = __webpack_require__(95966);
// EXTERNAL MODULE: ./src/components/common/ModalActions/Modal.tsx
var Modal = __webpack_require__(13189);
;// CONCATENATED MODULE: ./src/components/common/index.ts









/***/ }),

/***/ 31817:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  L: () => (/* reexport */ authOptions)
});

// EXTERNAL MODULE: ./node_modules/next-auth/providers/credentials.js
var credentials = __webpack_require__(85792);
// EXTERNAL MODULE: ./node_modules/jwt-decode/build/jwt-decode.cjs.js
var jwt_decode_cjs = __webpack_require__(33802);
var jwt_decode_cjs_default = /*#__PURE__*/__webpack_require__.n(jwt_decode_cjs);
// EXTERNAL MODULE: ./src/services/api.ts + 2 modules
var api = __webpack_require__(12474);
// EXTERNAL MODULE: ./src/constants/index.ts + 2 modules
var constants = __webpack_require__(64927);
;// CONCATENATED MODULE: ./src/config/nextAuth.ts




/* eslint-disable prefer-arrow/prefer-arrow-functions */ /* eslint-disable no-param-reassign */ const getMaxAge = (isRememberMe = true)=>isRememberMe ? 30 * 24 * 60 * 60 : 2 * 60 * 60; // 30 days : 2 hours
const authOptions = {
    providers: [
        (0,credentials/* default */.Z)({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "email"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize (credentials) {
                try {
                    // Get token
                    const serverToken = await (0,api/* signInService */.e4)(credentials?.email, credentials?.password);
                    // Check for errors
                    if (serverToken.status === "fail") {
                        const errorMessage = serverToken.data.message;
                        throw new Error(typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage));
                    }
                    api/* token */.r.access = serverToken.data.access;
                    api/* token */.r.refresh = serverToken.data.refresh;
                    // Get user info
                    const userInfo = await (0,api/* getUserInfoService */.hX)();
                    // Check for errors
                    if (userInfo.status === "fail") {
                        const errorMessage = userInfo.data.message;
                        throw new Error(typeof errorMessage === "string" ? errorMessage : JSON.stringify(errorMessage));
                    }
                    const user = {
                        ...userInfo.data,
                        token: serverToken.data,
                        id: userInfo.data.id.toString(),
                        rememberMe: true
                    };
                    if (user) {
                        return user;
                    }
                    return null;
                } catch (error) {
                    throw new Error(error.message);
                }
            }
        })
    ],
    callbacks: {
        async session ({ session, token }) {
            // eslint-disable-next-line no-param-reassign
            if (token.user) {
                session.user = {
                    ...token.user
                };
            }
            return session;
        },
        async jwt ({ token, user, account }) {
            if (account && user) {
                token.user = {
                    ...user
                };
            }
            if (token.user?.token.access) {
                const decoded = jwt_decode_cjs_default()(token.user?.token.access);
                const exp = decoded.exp * 1000;
                if (Date.now() > exp) {
                    try {
                        const refreshedToken = await (0,api/* refreshTokenService */.ur)(token.user.token.refresh);
                        if (refreshedToken.access) {
                            token.user.token.access = refreshedToken.access;
                            api/* token */.r.access = refreshedToken.access;
                        }
                    } catch (error) {
                        console.error("Error refreshing token:", error);
                        token.user.token.error = "Failed to refresh session.";
                    }
                }
            }
            return token;
        }
    },
    session: {
        maxAge: getMaxAge()
    },
    pages: {
        signIn: constants/* Route */.AW.SIGN_IN
    }
};

;// CONCATENATED MODULE: ./src/config/index.ts



/***/ }),

/***/ 30425:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _: () => (/* binding */ BASE_URL)
/* harmony export */ });
const BASE_URL = "http://ec2-15-236-206-53.eu-west-3.compute.amazonaws.com/api/v1";


/***/ }),

/***/ 64927:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  IV: () => (/* reexport */ PAGE_SIZE),
  AW: () => (/* reexport */ Route)
});

// UNUSED EXPORTS: IS_REVERSED

;// CONCATENATED MODULE: ./src/constants/routes.ts
var Route;
(function(Route) {
    Route["HOME"] = "/";
    Route["SIGN_UP"] = "/?auth=signup";
    Route["SIGN_UP_SUCCESS"] = "/?auth=signup-success";
    Route["SIGN_IN"] = "/?auth=signin";
    Route["FORGOT_PASSWORD"] = "/auth=forgot-password";
    Route["RESET_PASSWORD"] = "/?auth=reset-password";
    Route["NEW_PASSWORD"] = "/?auth=new-password";
    Route["WIGWAM"] = "/wigwam";
    Route["WIGWAM_LOBBY"] = "/parents/lobby";
    Route["PARENTS"] = "/parents";
    Route["USERS"] = "/admin";
    Route["BOOKS"] = "/admin/books";
    Route["BOOKS_ADD"] = "/admin/books/add";
    Route["BOOKS_EDIT"] = "/admin/books/edit";
    Route["QUIZZES"] = "/admin/quizzes";
    Route["QUIZZES_ADD"] = "/admin/quizzes/add";
    Route["QUIZZES_EDIT"] = "/admin/quizzes/edit";
    Route["RECOMMENDED"] = "/admin/recommended";
    Route["DOCUMENTS"] = "/admin/documents";
    Route["PARTNERS"] = "/admin/partners";
    Route["PARTNERS_ADD"] = "/admin/partners/add";
    Route["PARTNERS_EDIT"] = "/admin/partners/edit";
    Route["CONTACTS"] = "/admin/contacts";
    Route["STATS"] = "/admin/statistics";
    Route["CHANGE_PASS"] = "/admin/password";
})(Route || (Route = {}));

;// CONCATENATED MODULE: ./src/constants/quizzes.ts
const PAGE_SIZE = 12;
const IS_REVERSED = true;

;// CONCATENATED MODULE: ./src/constants/index.ts




/***/ }),

/***/ 67127:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useAddBook: () => (/* binding */ useAddBook)
/* harmony export */ });
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(55971);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(32770);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(41068);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* __next_internal_client_entry_do_not_use__ useAddBook auto */ 


const useAddBook = ()=>{
    const axios = (0,_hooks__WEBPACK_IMPORTED_MODULE_0__/* .useAuthAxiosInstance */ .Qd)();
    const queryClient = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__.useQueryClient)();
    const [isAddSuccess, setIsAddSuccess] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { mutate: addBook, isPending: isPendingAdd } = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.useMutation)({
        mutationFn: async (formData)=>{
            await axios.post("books/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        },
        onSuccess: ()=>{
            setIsAddSuccess(true);
            queryClient.invalidateQueries({
                queryKey: [
                    "books"
                ]
            });
        }
    });
    return {
        addBook,
        isPendingAdd,
        isAddSuccess,
        setIsAddSuccess
    };
};


/***/ }),

/***/ 38219:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useEditBook: () => (/* binding */ useEditBook)
/* harmony export */ });
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(55971);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(32770);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(41068);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* __next_internal_client_entry_do_not_use__ useEditBook auto */ 


const useEditBook = ()=>{
    const axios = (0,_hooks__WEBPACK_IMPORTED_MODULE_0__/* .useAuthAxiosInstance */ .Qd)();
    const queryClient = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__.useQueryClient)();
    const [isEditSuccess, setIsEditSuccess] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { mutate: editBook, isPending: isPendingEdit } = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.useMutation)({
        mutationFn: async ({ id, formData })=>{
            await axios.patch(`books/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        },
        onSuccess: ()=>{
            setIsEditSuccess(true);
            queryClient.invalidateQueries({
                queryKey: [
                    "books"
                ]
            });
        }
    });
    return {
        editBook,
        isPendingEdit,
        isEditSuccess,
        setIsEditSuccess
    };
};


/***/ }),

/***/ 80569:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useFetchMonsters: () => (/* binding */ useFetchMonsters)
/* harmony export */ });
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63370);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(55971);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(88546);
/* harmony import */ var _constants_api__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(30425);
/* __next_internal_client_entry_do_not_use__ useFetchMonsters auto */ 



const useFetchMonsters = (childId)=>{
    const { status } = (0,next_auth_react__WEBPACK_IMPORTED_MODULE_0__.useSession)();
    const axios = (0,_hooks__WEBPACK_IMPORTED_MODULE_1__/* .useAuthAxiosInstance */ .Qd)();
    const { data: monsters, isLoading, error } = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__.useQuery)({
        queryKey: [
            "monsters",
            childId
        ],
        queryFn: async ()=>{
            const { data } = await axios(`${_constants_api__WEBPACK_IMPORTED_MODULE_3__/* .BASE_URL */ ._}/users/me/children/${childId}/rewards`);
            return data.data.results;
        },
        enabled: status === "authenticated"
    });
    return {
        monsters,
        isLoading,
        error
    };
};


/***/ }),

/***/ 34416:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useAddPartner: () => (/* binding */ useAddPartner)
/* harmony export */ });
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(55971);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(32770);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(41068);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* __next_internal_client_entry_do_not_use__ useAddPartner auto */ 


const useAddPartner = ()=>{
    const axios = (0,_hooks__WEBPACK_IMPORTED_MODULE_0__/* .useAuthAxiosInstance */ .Qd)();
    const queryClient = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__.useQueryClient)();
    const [isAddSuccess, setIsAddSuccess] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { mutate: addPartner, isPending: isPendingAdd } = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.useMutation)({
        mutationFn: async (formData)=>{
            await axios.post("partners/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        },
        onSuccess: ()=>{
            setIsAddSuccess(true);
            queryClient.invalidateQueries({
                queryKey: [
                    "partners"
                ]
            });
        }
    });
    return {
        addPartner,
        isPendingAdd,
        isAddSuccess,
        setIsAddSuccess
    };
};


/***/ }),

/***/ 78567:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useEditPartner: () => (/* binding */ useEditPartner)
/* harmony export */ });
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(55971);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(32770);
/* harmony import */ var _tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(41068);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* __next_internal_client_entry_do_not_use__ useEditPartner auto */ 


const useEditPartner = ()=>{
    const axios = (0,_hooks__WEBPACK_IMPORTED_MODULE_0__/* .useAuthAxiosInstance */ .Qd)();
    const queryClient = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_2__.useQueryClient)();
    const [isEditSuccess, setIsEditSuccess] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
    const { mutate: editPartner, isPending: isPendingEdit } = (0,_tanstack_react_query__WEBPACK_IMPORTED_MODULE_3__.useMutation)({
        mutationFn: async ({ id, formData })=>{
            await axios.patch(`partners/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
        },
        onSuccess: ()=>{
            setIsEditSuccess(true);
            queryClient.invalidateQueries({
                queryKey: [
                    "partners"
                ]
            });
        }
    });
    return {
        editPartner,
        isPendingEdit,
        isEditSuccess,
        setIsEditSuccess
    };
};


/***/ }),

/***/ 55971:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  mi: () => (/* reexport */ useAddBook.useAddBook),
  Kr: () => (/* reexport */ useAddPartner.useAddPartner),
  Qd: () => (/* reexport */ useAuthAxiosInstance.useAuthAxiosInstance),
  $0: () => (/* reexport */ useConfetti["default"]),
  VW: () => (/* reexport */ useEditBook.useEditBook),
  $p: () => (/* reexport */ useEditPartner.useEditPartner),
  ib: () => (/* reexport */ useFetch.useFetch),
  nD: () => (/* reexport */ useFetchMonsters.useFetchMonsters),
  GS: () => (/* reexport */ useMedia.useMedia),
  LA: () => (/* reexport */ useQueryBookById),
  g8: () => (/* reexport */ useQueryPartnerById),
  Ye: () => (/* reexport */ useQueryQuizBooksAdmin),
  Mm: () => (/* reexport */ useQueryQuizById),
  QJ: () => (/* reexport */ useSignOut.useSignOut)
});

// EXTERNAL MODULE: ./src/hooks/useConfetti.tsx
var useConfetti = __webpack_require__(51372);
// EXTERNAL MODULE: ./src/hooks/useFetch.ts
var useFetch = __webpack_require__(28451);
// EXTERNAL MODULE: ./src/hooks/useAuthAxiosInstance.ts + 1 modules
var useAuthAxiosInstance = __webpack_require__(10345);
// EXTERNAL MODULE: ./src/hooks/useSignOut.tsx
var useSignOut = __webpack_require__(33169);
// EXTERNAL MODULE: ./src/hooks/useMedia.ts
var useMedia = __webpack_require__(48098);
// EXTERNAL MODULE: ./src/hooks/Monsters/useFetchMonsters.ts
var useFetchMonsters = __webpack_require__(80569);
// EXTERNAL MODULE: ./src/hooks/Books/useAddBook.ts
var useAddBook = __webpack_require__(67127);
// EXTERNAL MODULE: ./src/hooks/Books/useEditBook.ts
var useEditBook = __webpack_require__(38219);
// EXTERNAL MODULE: ./node_modules/next-auth/react/index.js
var react = __webpack_require__(63370);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/useQuery.js
var useQuery = __webpack_require__(88546);
// EXTERNAL MODULE: ./src/constants/api.ts
var api = __webpack_require__(30425);
;// CONCATENATED MODULE: ./src/hooks/Books/useQueryBookById.ts




const useQueryBookById = (id)=>{
    const { status } = (0,react.useSession)();
    const axios = (0,useAuthAxiosInstance.useAuthAxiosInstance)();
    const { data: bookById, isLoading: bookLoading, error: fetchError } = (0,useQuery.useQuery)({
        queryKey: [
            "bookById",
            id
        ],
        queryFn: async ()=>{
            const res = await axios(`${api/* BASE_URL */._}/books/${id}`);
            return res.data.data;
        },
        enabled: status === "authenticated" && !!id
    });
    return {
        bookById,
        bookLoading,
        fetchError
    };
};

;// CONCATENATED MODULE: ./src/hooks/Books/useQueryQuizById.ts




const useQueryQuizById = (id)=>{
    const { status } = (0,react.useSession)();
    const axios = (0,useAuthAxiosInstance.useAuthAxiosInstance)();
    const { data: quizById, isLoading: quizLoading, error: fetchError } = (0,useQuery.useQuery)({
        queryKey: [
            "quizById",
            id
        ],
        queryFn: async ()=>{
            const res = await axios(`${api/* BASE_URL */._}/quizzes/${id}/`);
            return res.data.data;
        },
        enabled: status === "authenticated" && !!id
    });
    return {
        quizById,
        quizLoading,
        fetchError
    };
};

;// CONCATENATED MODULE: ./src/hooks/Books/useQueryQuizBooksAdmin.ts




const useQueryQuizBooksAdmin = (id)=>{
    const { status } = (0,react.useSession)();
    const axios = (0,useAuthAxiosInstance.useAuthAxiosInstance)();
    const { data: books, error: fetchError } = (0,useQuery.useQuery)({
        queryKey: [
            "books-quiz-admin"
        ],
        queryFn: async ()=>{
            const res = await axios(`${api/* BASE_URL */._}/books?&page=1&page_size=100&is_not_quiz=true`);
            return res.data.data;
        },
        enabled: status === "authenticated" && id === undefined,
        select: (data)=>data.results.map((book)=>({
                    value: book.id,
                    label: book.title,
                    author: book.author
                }))
    });
    return {
        books,
        fetchError
    };
};

// EXTERNAL MODULE: ./src/hooks/Partners/useAddPartner.ts
var useAddPartner = __webpack_require__(34416);
// EXTERNAL MODULE: ./src/hooks/Partners/useEditPartner.ts
var useEditPartner = __webpack_require__(78567);
;// CONCATENATED MODULE: ./src/hooks/Partners/useQueryPartnerById.ts




const useQueryPartnerById = (id)=>{
    const { status } = (0,react.useSession)();
    const axios = (0,useAuthAxiosInstance.useAuthAxiosInstance)();
    const { data: partnerById, isLoading: partnerLoading, error: fetchError } = (0,useQuery.useQuery)({
        queryKey: [
            "partnerById",
            id
        ],
        queryFn: async ()=>{
            const res = await axios(`${api/* BASE_URL */._}/partners/${id}`);
            return res.data.data;
        },
        enabled: status === "authenticated" && !!id
    });
    return {
        partnerById,
        partnerLoading,
        fetchError
    };
};

;// CONCATENATED MODULE: ./src/hooks/index.ts
















/***/ }),

/***/ 10345:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  useAuthAxiosInstance: () => (/* binding */ useAuthAxiosInstance)
});

// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/next-auth/react/index.js
var react = __webpack_require__(63370);
// EXTERNAL MODULE: ./src/services/axios.ts
var axios = __webpack_require__(42750);
;// CONCATENATED MODULE: ./src/hooks/useRefreshToken.ts


const useRefreshToken = ()=>{
    const { data: session } = (0,react.useSession)();
    const refreshToken = async ()=>{
        if (session?.user?.token?.refresh) {
            try {
                const res = await axios/* axiosClient */.U.post("/auth/token/refresh/", {
                    refresh: session.user.token.refresh,
                    rememberMe: session.user.rememberMe
                });
                const newAccessToken = res.data.access;
                if (newAccessToken) {
                    await (0,react.signIn)("credentials", {
                        ...session.user,
                        token: {
                            ...session.user.token,
                            access: newAccessToken
                        }
                    }, {
                        redirect: false
                    });
                }
            } catch (error) {
                console.error("Error refreshing token:", error);
            // Additional error handling as needed
            }
        }
    };
    return refreshToken;
};

;// CONCATENATED MODULE: ./src/hooks/useAuthAxiosInstance.ts
/* __next_internal_client_entry_do_not_use__ useAuthAxiosInstance auto */ /* eslint-disable dot-notation */ /* eslint-disable no-param-reassign */ 



const useAuthAxiosInstance = ()=>{
    const { data: session } = (0,react.useSession)();
    const refreshToken = useRefreshToken();
    (0,react_.useEffect)(()=>{
        const requestIntercept = axios/* axiosClient */.U.interceptors.request.use((config)=>{
            if (!config.headers["Authorization"]) {
                config.headers["Authorization"] = `Bearer ${session?.user?.token.access}`;
            }
            return config;
        }, (error)=>Promise.reject(error));
        const responseIntercept = axios/* axiosClient */.U.interceptors.response.use((response)=>response, async (error)=>{
            const prevRequest = error.config;
            if (error.response.status === 401 && !prevRequest.sent) {
                prevRequest.sent = true;
                await refreshToken();
                prevRequest.headers["Authorization"] = `Bearer ${session?.user?.token.access}`;
                return (0,axios/* axiosClient */.U)(prevRequest);
            }
            return Promise.reject(error);
        });
        return ()=>{
            axios/* axiosClient */.U.interceptors.request.eject(requestIntercept);
            axios/* axiosClient */.U.interceptors.response.eject(responseIntercept);
        };
    }, [
        session,
        refreshToken
    ]);
    return axios/* axiosClient */.U;
};


/***/ }),

/***/ 51372:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var js_confetti__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(90088);
/* harmony import */ var js_confetti__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(js_confetti__WEBPACK_IMPORTED_MODULE_2__);
/* __next_internal_client_entry_do_not_use__ default auto */ 


const useConfetti = ({ className })=>{
    const ref = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);
    const canvas = /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("canvas", {
        className: className,
        style: {
            pointerEvents: "none"
        },
        ref: ref
    });
    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{
        if (!ref.current) return;
        const confetti = new (js_confetti__WEBPACK_IMPORTED_MODULE_2___default())({
            canvas: ref.current
        });
        confetti.addConfetti({
            confettiColors: [
                "#EA5858",
                "#F2B441",
                "#52C974",
                "#7791FA"
            ]
        });
        return ()=>confetti.clearCanvas();
    }, [
        ref
    ]);
    return canvas;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (useConfetti);


/***/ }),

/***/ 28451:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useFetch: () => (/* binding */ useFetch)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(64421);
/* harmony import */ var _useAuthAxiosInstance__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10345);
/* __next_internal_client_entry_do_not_use__ useFetch auto */ 


const useFetch = ()=>{
    const axios = (0,_useAuthAxiosInstance__WEBPACK_IMPORTED_MODULE_1__.useAuthAxiosInstance)();
    const [data, setData] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    return {
        data,
        isLoading,
        error,
        fetch: async (url, data, method = "GET")=>{
            setIsLoading(true);
            setError(null);
            try {
                const { data: result } = await axios.request({
                    url,
                    method,
                    data
                });
                if (result.status === "fail") {
                    throw new Error(result.data.message);
                }
                setData(result.data);
                return result;
            } catch (error) {
                if (error instanceof axios__WEBPACK_IMPORTED_MODULE_2__/* .AxiosError */ .d7) {
                    if (error.response?.status === 404) {
                        setError(error.message);
                    } else {
                        setError(error.response?.data.data.message);
                    }
                } else {
                    setError(error.message);
                }
            } finally{
                setIsLoading(false);
            }
        }
    };
};


/***/ }),

/***/ 48098:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useMedia: () => (/* binding */ useMedia)
/* harmony export */ });
/* harmony import */ var react_responsive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(61003);
/* harmony import */ var react_responsive__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react_responsive__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* __next_internal_client_entry_do_not_use__ useMedia auto */ 

const useMedia = ()=>{
    const isDesktop = (0,react_responsive__WEBPACK_IMPORTED_MODULE_1__.useMediaQuery)({
        query: "(min-width: 1440px)"
    });
    const isLaptop = (0,react_responsive__WEBPACK_IMPORTED_MODULE_1__.useMediaQuery)({
        query: "(min-width: 1024px) and (max-width: 1439px)"
    });
    const isTablet = (0,react_responsive__WEBPACK_IMPORTED_MODULE_1__.useMediaQuery)({
        query: "(min-width: 768px) and (max-width: 1023px)"
    });
    const isMobile = (0,react_responsive__WEBPACK_IMPORTED_MODULE_1__.useMediaQuery)({
        query: "(max-width: 767px)"
    });
    const [deviceType, setDeviceType] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)("");
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(()=>{
        if (isDesktop) setDeviceType("desktop");
        else if (isLaptop) setDeviceType("laptop");
        else if (isTablet) setDeviceType("tablet");
        else setDeviceType("mobile");
    }, [
        isDesktop,
        isTablet,
        isLaptop,
        isMobile
    ]);
    return {
        deviceType
    };
};


/***/ }),

/***/ 33169:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useSignOut: () => (/* binding */ useSignOut)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(63370);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_1__);
/* __next_internal_client_entry_do_not_use__ useSignOut auto */ 

const useSignOut = ()=>{
    const [isLoading, setIsLoading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    const signOut = async (options)=>{
        setIsLoading(true);
        try {
            await (0,next_auth_react__WEBPACK_IMPORTED_MODULE_1__.signOut)(options);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error);
        } finally{
            setIsLoading(false);
        }
    };
    return {
        isLoading,
        signOut
    };
};


/***/ }),

/***/ 12474:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  NG: () => (/* binding */ changePasswordService),
  hX: () => (/* binding */ getUserInfoService),
  n0: () => (/* binding */ newPasswordService),
  ur: () => (/* binding */ refreshTokenService),
  Hy: () => (/* binding */ sendPasswordResetEmailService),
  e4: () => (/* binding */ signInService),
  Hi: () => (/* binding */ signUpService),
  r: () => (/* binding */ token)
});

// UNUSED EXPORTS: getActiveChildsService, getBooksService, getChildBooksService, getChildrenService, getChildsService, getContactsService, getDocumentsService, getMonstersService, getQuizInfoByIdService, getQuizzesService, getRecommendationBooksService, getUsersQuizzesService, getUsersService, getWigwamQuizService, privateFetch, sendSelectedAnswerService

// EXTERNAL MODULE: ./node_modules/next-auth/index.js
var next_auth = __webpack_require__(60990);
// EXTERNAL MODULE: ./src/config/index.ts + 1 modules
var config = __webpack_require__(31817);
;// CONCATENATED MODULE: ./src/types/Quiz.ts
var Quiz_QuizCategory;
(function(QuizCategory) {
    QuizCategory["All"] = "";
    QuizCategory["Started"] = "is_started=true";
    QuizCategory["Completed"] = "is_completed=true";
})(Quiz_QuizCategory || (Quiz_QuizCategory = {}));

;// CONCATENATED MODULE: ./src/types/index.ts














// EXTERNAL MODULE: ./src/services/axios.ts
var axios = __webpack_require__(42750);
;// CONCATENATED MODULE: ./src/services/api.ts




const baseUrl = "http://ec2-15-236-206-53.eu-west-3.compute.amazonaws.com/api/v1" || 0;
const token = {
    access: null,
    refresh: null
};
const refreshTokenService = async (refreshToken)=>{
    try {
        const response = await fetch(`${baseUrl}/auth/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                refresh: refreshToken
            })
        });
        if (!response.ok) {
            throw new Error(`Refresh token error: ${response.status}`);
        }
        const data = await response.json();
        token.access = data.access;
        token.refresh = refreshToken; // assuming the refresh token remains the same
        return data;
    } catch (error) {
        console.error("Error in refreshTokenService:", error);
        throw error;
    }
};
const privateFetch = async (input, options = undefined)=>{
    const session = await getServerSession(authOptions);
    return fetch(input, {
        headers: {
            Authorization: `Bearer ${session?.user.token.access}`
        },
        ...options
    });
};
const signInService = async (email, password)=>{
    const result = await fetch(`${baseUrl}/auth/token/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password
        })
    });
    return result.json();
};
const signUpService = async (email, password, confirmPassword)=>{
    const result = await fetch(`${baseUrl}/users/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            password,
            password2: confirmPassword
        })
    });
    return result.json();
};
const getUserInfoService = async ()=>{
    const result = await fetch(`${baseUrl}/users/me/`, {
        headers: {
            Authorization: `Bearer ${token.access}`
        }
    });
    return result.json();
};
const getQuizInfoByIdService = async (id)=>{
    const result = await privateFetch(`${baseUrl}/quizzes/${id}`);
    return result.json();
};
const getUsersQuizzesService = async (childId, search = "", page = "1", category = QuizCategory.All, IS_REVERSED = true, PAGE_SIZE = 12)=>{
    const selectedCategory = category ? `&${category}` : "";
    const result = await privateFetch(`${baseUrl}/users/me/children/${childId}/quizzes/?page=${page}&page_size=${PAGE_SIZE}&reverse=${IS_REVERSED}&search=${search}${selectedCategory}`);
    return result.json();
};
const sendSelectedAnswerService = async (childId, questionId, answerId)=>{
    const result = await fetch(`${baseUrl}/questions/${questionId}/submit-answer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.access}`
        },
        body: JSON.stringify({
            child_id: childId,
            answer_id: answerId
        })
    });
    return result.json();
};
const sendPasswordResetEmailService = async (email)=>{
    const result = await fetch(`${baseUrl}/users/password/reset/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email
        })
    });
    return result.json();
};
const newPasswordService = async (newPassword1, newPassword2, uid, token)=>{
    const result = await fetch(`${baseUrl}/users/password/reset/confirm/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            new_password1: newPassword1,
            new_password2: newPassword2,
            uid,
            token
        })
    });
    return result.json();
};
const getDocumentsService = async ()=>{
    const result = await privateFetch(`${baseUrl}/documents/`);
    return result.json();
};
const getBooksService = async (search = "")=>{
    const result = await axiosServerFetch(`${baseUrl}/books?page=1&page_size=7&search=${search}`);
    return result.data;
};
const getMonstersService = async (childId)=>{
    const { data } = await axiosServerFetch(`${baseUrl}/users/me/children/${childId}/rewards`);
    if ("results" in data) {
        return data.results;
    }
    throw new Error(data.message);
};
const getChildBooksService = async (childId)=>{
    const { data } = await axiosServerFetch(`${baseUrl}/users/me/children/${childId}/quizzes`);
    return data;
};
const getRecommendationBooksService = async ()=>{
    const { data } = await axiosServerFetch(`${baseUrl}/recommendation-books`);
    return data;
};
const getWigwamQuizService = async (childId)=>{
    const { data } = await axiosServerFetch(`${baseUrl}/users/me/children/${childId}`);
    return data;
};
const changePasswordService = async (oldPassword, password, confirmPassword, access)=>{
    const result = await fetch(`${baseUrl}/users/password/change/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`
        },
        body: JSON.stringify({
            old_password: oldPassword,
            new_password1: password,
            new_password2: confirmPassword
        })
    });
    return result.json();
};
const getChildrenService = async ()=>{
    const response = await axiosServerFetch(`${baseUrl}/users/me/children/`);
    return response.data;
};
const getContactsService = async ()=>{
    const result = await axiosServerFetch(`${baseUrl}/contact-info/`);
    return result.data;
};
const getUsersService = async ()=>{
    const { data } = await axiosServerFetch(`${baseUrl}/statistics/users/`);
    return data;
};
const getChildsService = async ()=>{
    const { data } = await axiosServerFetch(`${baseUrl}/statistics/child/`);
    return data;
};
const getActiveChildsService = async ()=>{
    const { data } = await axiosServerFetch(`${baseUrl}/statistics/active-child/`);
    return data;
};
const getQuizzesService = async ()=>{
    const { data } = await axiosServerFetch(`${baseUrl}/statistics/quizzes/`);
    return data;
};


/***/ }),

/***/ 42750:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   U: () => (/* binding */ axiosClient)
/* harmony export */ });
/* unused harmony export fetch */
/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(60990);
/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(53071);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(31817);



/* eslint-disable no-param-reassign */ const baseUrl = "http://ec2-15-236-206-53.eu-west-3.compute.amazonaws.com/api/v1" || 0;
// Axios instance for client components
const axiosClient = axios__WEBPACK_IMPORTED_MODULE_2__["default"].create({
    baseURL: baseUrl
});
// Axios instance for server components
const axiosServer = axios__WEBPACK_IMPORTED_MODULE_2__["default"].create({
    baseURL: baseUrl
});
axiosServer.interceptors.request.use(async (config)=>{
    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_0__.getServerSession)(_config__WEBPACK_IMPORTED_MODULE_1__/* .authOptions */ .L);
    if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${session?.user?.token.access}`;
    }
    return config;
}, (error)=>Promise.reject(error));
const fetch = async (url, data, method = "GET")=>{
    try {
        const { data: result } = await axiosServer.request({
            url,
            method,
            data
        });
        return result;
    } catch (error) {
        return {
            status: "fail",
            data: {
                message: error instanceof AxiosError && error.response?.status !== 404 ? error.response?.data.data.message : error.message
            }
        };
    }
};


/***/ }),

/***/ 72636:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   B: () => (/* binding */ formattedDate)
/* harmony export */ });
const formattedDate = (dateString)=>{
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};


/***/ }),

/***/ 78171:
/***/ ((module) => {

// Exports
module.exports = {
	"books": "Books_books__zt4ez",
	"wrapper": "Books_wrapper__cmVM9",
	"spinner": "Books_spinner__i__KV",
	"error": "Books_error__M0eWa"
};


/***/ }),

/***/ 91937:
/***/ ((module) => {

// Exports
module.exports = {
	"form": "QuizForm_form__qoFN9",
	"book": "QuizForm_book__dg2GP",
	"questions": "QuizForm_questions__X6mfQ",
	"questions-form": "QuizForm_questions-form__QeKcv",
	"questionBlock": "QuizForm_questionBlock__ODdpr",
	"question": "QuizForm_question__kpgeu",
	"answers": "QuizForm_answers___MPj9",
	"answerBlock": "QuizForm_answerBlock__Rhb_K",
	"checkbox": "QuizForm_checkbox__JPPXY",
	"actions": "QuizForm_actions__XhEA7",
	"spinner": "QuizForm_spinner__FrEVl",
	"error": "QuizForm_error__Zhb5c",
	"errorMessage": "QuizForm_errorMessage__pwjpC",
	"bookSearch": "QuizForm_bookSearch__eZ2Fk",
	"input": "QuizForm_input__ONv0e"
};


/***/ }),

/***/ 60631:
/***/ ((module) => {

// Exports
module.exports = {
	"header": "Header_header__AgE4v",
	"header__heading": "Header_header__heading__Mn2tI",
	"header__subheading": "Header_header__subheading__vx8iJ",
	"header__content": "Header_header__content__UFzdj",
	"search": "Header_search__VEkbE"
};


/***/ }),

/***/ 54704:
/***/ ((module) => {

// Exports
module.exports = {
	"wrapper": "NoResults_wrapper__MD_hJ",
	"text": "NoResults_text__vAaly",
	"container": "NoResults_container__Wdoum",
	"message": "NoResults_message__vovq9"
};


/***/ }),

/***/ 28352:
/***/ ((module) => {

// Exports
module.exports = {
	"group": "AdminSearch_group__0_0sf",
	"label": "AdminSearch_label__Z7Ljq",
	"input-group": "AdminSearch_input-group__JfYyN",
	"input": "AdminSearch_input__gZjPY",
	"icon": "AdminSearch_icon__fXi_W",
	"message": "AdminSearch_message__RaRVc"
};


/***/ }),

/***/ 46077:
/***/ ((module) => {

// Exports
module.exports = {
	"searchableSelectContainer": "SearchableSelect_searchableSelectContainer__hU6zo",
	"searchableSelect": "SearchableSelect_searchableSelect__bxqhX",
	"xCircle": "SearchableSelect_xCircle__84j17",
	"option": "SearchableSelect_option__SuV_p",
	"active": "SearchableSelect_active__ChPLw",
	"label": "SearchableSelect_label__6rBct",
	"error": "SearchableSelect_error__YZOk7"
};


/***/ }),

/***/ 40148:
/***/ ((module) => {

// Exports
module.exports = {
	"navigation": "NavBar_navigation__KfkGo"
};


/***/ }),

/***/ 56656:
/***/ ((module) => {

// Exports
module.exports = {
	"sidebar": "SideBar_sidebar__NvDyo",
	"logo": "SideBar_logo__SYBi1"
};


/***/ }),

/***/ 82429:
/***/ ((module) => {

// Exports
module.exports = {
	"header": "TableHeader_header__6fNK_",
	"names": "TableHeader_names__48fCU",
	"users": "TableHeader_users__935yZ",
	"books": "TableHeader_books__G3GK_",
	"partners": "TableHeader_partners__84SqI",
	"documents": "TableHeader_documents__8gD6_",
	"icon": "TableHeader_icon__wQGZ6"
};


/***/ }),

/***/ 50544:
/***/ ((module) => {

// Exports
module.exports = {
	"bookItem": "BookItem_bookItem__T0YlT",
	"checkbox": "BookItem_checkbox__ckf_X",
	"info": "BookItem_info__pg2qN",
	"title": "BookItem_title__Qg4Qg",
	"image": "BookItem_image__exIMd",
	"bookInfo": "BookItem_bookInfo__gMzIy",
	"name": "BookItem_name__M14dO",
	"author": "BookItem_author__rJPVx",
	"infoBlock": "BookItem_infoBlock__3zxO3",
	"state": "BookItem_state__7Q66z",
	"date": "BookItem_date__lKrV0",
	"blue": "BookItem_blue__onWJ2",
	"green": "BookItem_green__tudde",
	"actions": "BookItem_actions__o3Qzc"
};


/***/ }),

/***/ 66245:
/***/ ((module) => {

// Exports
module.exports = {
	"partner": "PartnerItem_partner__L00tA",
	"info": "PartnerItem_info__yjNlP",
	"title": "PartnerItem_title__VcLeg",
	"date": "PartnerItem_date__rfyqH",
	"actions": "PartnerItem_actions__iHPye",
	"spinner": "PartnerItem_spinner__88vsM",
	"actionItem": "PartnerItem_actionItem__nXuCD"
};


/***/ }),

/***/ 47871:
/***/ ((module) => {

// Exports
module.exports = {
	"link": "LinkButton_link__j6o8d",
	"arrow": "LinkButton_arrow__MoUud",
	"active": "LinkButton_active__gRsOu"
};


/***/ }),

/***/ 15438:
/***/ ((module) => {

// Exports
module.exports = {
	"imageInput": "UploadImage_imageInput__f5c07",
	"books": "UploadImage_books__5UeA9",
	"uploadedImageContainer": "UploadImage_uploadedImageContainer___nMnq",
	"uploadedImage": "UploadImage_uploadedImage__V4268",
	"partners": "UploadImage_partners__d7CTH",
	"quizzes": "UploadImage_quizzes__kDveb",
	"closeButton": "UploadImage_closeButton__L9f5S",
	"uploadInfoContainer": "UploadImage_uploadInfoContainer__YHko7",
	"formatAndSizeWarning": "UploadImage_formatAndSizeWarning__FhmbF",
	"blueText": "UploadImage_blueText__t1mhQ",
	"errorMessage": "UploadImage_errorMessage__KtKJB"
};


/***/ }),

/***/ 82722:
/***/ ((module) => {

// Exports
module.exports = {
	"section": "NotFound_section__JCxb0",
	"container": "NotFound_container__Dgzqb",
	"image": "NotFound_image____END",
	"text": "NotFound_text__1unC6",
	"button": "NotFound_button__ujDSM"
};


/***/ }),

/***/ 29571:
/***/ ((module) => {

// Exports
module.exports = {
	"wrapper": "Pagination_wrapper__c8gnm",
	"pagination": "Pagination_pagination__i3GX9",
	"link": "Pagination_link__ev7iv",
	"label": "Pagination_label__8Se9k",
	"large": "Pagination_large__vzVQW",
	"small": "Pagination_small__PntLe",
	"extraSmall": "Pagination_extraSmall__5rdmG",
	"active": "Pagination_active__zxT4y",
	"labelExtraSmall": "Pagination_labelExtraSmall__a_4zv",
	"labelSmall": "Pagination_labelSmall__8LPzz",
	"labelLarge": "Pagination_labelLarge__m5TjW",
	"disabled": "Pagination_disabled__8pwh4",
	"breakClass": "Pagination_breakClass__6WPEr"
};


/***/ }),

/***/ 91906:
/***/ ((module) => {

// Exports
module.exports = {
	"button": "Button_button__zflwE",
	"button--primary": "Button_button--primary__sYa8t",
	"button--secondary": "Button_button--secondary__EMngq",
	"button--tertiary": "Button_button--tertiary__l4r_T",
	"button--success": "Button_button--success__u3vOk",
	"button--quaternary": "Button_button--quaternary__P9gni",
	"button--error": "Button_button--error__qEnIT",
	"button--small": "Button_button--small__FTX6Z",
	"button--default": "Button_button--default__XQwGR",
	"button--filled": "Button_button--filled__tc7ep",
	"button--outline": "Button_button--outline__eXXtj",
	"button--text": "Button_button--text__LDDZD",
	"button-icon": "Button_button-icon__rB0uE",
	"spinner": "Button_spinner__ENwOD"
};


/***/ }),

/***/ 28538:
/***/ ((module) => {

// Exports
module.exports = {
	"button": "Button_button__zflwE",
	"button--primary": "Button_button--primary__sYa8t",
	"button--secondary": "Button_button--secondary__EMngq",
	"button--tertiary": "Button_button--tertiary__l4r_T",
	"button--success": "Button_button--success__u3vOk",
	"button--quaternary": "Button_button--quaternary__P9gni",
	"button--error": "Button_button--error__qEnIT",
	"button--small": "Button_button--small__FTX6Z",
	"button--default": "Button_button--default__XQwGR",
	"button--filled": "Button_button--filled__tc7ep",
	"button--outline": "Button_button--outline__eXXtj",
	"button--text": "Button_button--text__LDDZD",
	"button-icon": "Button_button-icon__rB0uE",
	"spinner": "Button_spinner__ENwOD"
};


/***/ }),

/***/ 9206:
/***/ ((module) => {

// Exports
module.exports = {
	"container": "Container_container__UZjn2"
};


/***/ }),

/***/ 30615:
/***/ ((module) => {

// Exports
module.exports = {
	"container": "Container_container__UZjn2"
};


/***/ }),

/***/ 96078:
/***/ ((module) => {

// Exports
module.exports = {
	"button": "IconButton_button__xwbA2"
};


/***/ }),

/***/ 95661:
/***/ ((module) => {

// Exports
module.exports = {
	"backdrop": "Modal_backdrop__3Q1Mb",
	"modal": "Modal_modal__cGxfp",
	"success": "Modal_success__iVurp",
	"closeBtn": "Modal_closeBtn__u6YSt",
	"question": "Modal_question__swTWy",
	"content": "Modal_content__y6Clz",
	"title": "Modal_title__kKvCL",
	"message": "Modal_message__85bHj",
	"buttons": "Modal_buttons__yto4P"
};


/***/ }),

/***/ 1381:
/***/ ((module) => {

// Exports
module.exports = {
	"loader": "Spinner_loader__B05mb",
	"animation": "Spinner_animation__GlFTF"
};


/***/ }),

/***/ 97126:
/***/ ((module) => {

// Exports
module.exports = {
	"loader": "Spinner_loader__B05mb",
	"animation": "Spinner_animation__GlFTF"
};


/***/ }),

/***/ 4789:
/***/ ((module) => {

// Exports
module.exports = {
	"text-h6": "Typography_text-h6__oAZVb",
	"text-h5": "Typography_text-h5__p4L6E",
	"text-h3": "Typography_text-h3__RGdzR",
	"text-h2": "Typography_text-h2__IeEl3",
	"text-h1": "Typography_text-h1__kdMOm",
	"text-navbar": "Typography_text-navbar__eoOIS",
	"text-footer-end": "Typography_text-footer-end__XGys6",
	"text-footer-mail": "Typography_text-footer-mail__SnQBB",
	"text-body": "Typography_text-body__bJ4r_"
};


/***/ }),

/***/ 43222:
/***/ ((module) => {

// Exports
module.exports = {
	"text-h6": "Typography_text-h6__oAZVb",
	"text-h5": "Typography_text-h5__p4L6E",
	"text-h3": "Typography_text-h3__RGdzR",
	"text-h2": "Typography_text-h2__IeEl3",
	"text-h1": "Typography_text-h1__kdMOm",
	"text-navbar": "Typography_text-navbar__eoOIS",
	"text-footer-end": "Typography_text-footer-end__XGys6",
	"text-footer-mail": "Typography_text-footer-mail__SnQBB",
	"text-body": "Typography_text-body__bJ4r_"
};


/***/ }),

/***/ 32660:
/***/ ((module) => {

// Exports
module.exports = {
	"button": "XButton_button___GXcr"
};


/***/ }),

/***/ 31796:
/***/ ((module) => {

// Exports
module.exports = {
	"label": "Checkbox_label__j7TbK",
	"input-group": "Checkbox_input-group__aa_bL",
	"input-checked-icon": "Checkbox_input-checked-icon__HbsHD",
	"input": "Checkbox_input__sSQyb",
	"input-group--primary": "Checkbox_input-group--primary__r0WSG",
	"input-group--secondary": "Checkbox_input-group--secondary__wPTMV"
};


/***/ }),

/***/ 36361:
/***/ ((module) => {

// Exports
module.exports = {
	"group": "Input_group__5kqfP",
	"label": "Input_label__7HhHR",
	"input-group": "Input_input-group__T9yYN",
	"input": "Input_input__y_UNR",
	"icon": "Input_icon__RXzGR",
	"message": "Input_message__Zk3tI",
	"additionalIcon": "Input_additionalIcon__GLM6y",
	"errorMessage": "Input_errorMessage__f1rTj"
};


/***/ }),

/***/ 31025:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ layout)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"src/app/layout.tsx","import":"Raleway","arguments":[{"variable":"--raleway-font","weight":["300","400","500","800"],"style":"normal","subsets":["cyrillic"],"display":"swap"}],"variableName":"raleway"}
var layout_tsx_import_Raleway_arguments_variable_raleway_font_weight_300_400_500_800_style_normal_subsets_cyrillic_display_swap_variableName_raleway_ = __webpack_require__(20745);
var layout_tsx_import_Raleway_arguments_variable_raleway_font_weight_300_400_500_800_style_normal_subsets_cyrillic_display_swap_variableName_raleway_default = /*#__PURE__*/__webpack_require__.n(layout_tsx_import_Raleway_arguments_variable_raleway_font_weight_300_400_500_800_style_normal_subsets_cyrillic_display_swap_variableName_raleway_);
// EXTERNAL MODULE: ./node_modules/next/font/google/target.css?{"path":"src/app/layout.tsx","import":"Montserrat_Alternates","arguments":[{"variable":"--montserrat-alternates-font","weight":["300","400","600"],"style":"normal","subsets":["cyrillic"],"display":"swap"}],"variableName":"montserratAlternates"}
var layout_tsx_import_Montserrat_Alternates_arguments_variable_montserrat_alternates_font_weight_300_400_600_style_normal_subsets_cyrillic_display_swap_variableName_montserratAlternates_ = __webpack_require__(6592);
var layout_tsx_import_Montserrat_Alternates_arguments_variable_montserrat_alternates_font_weight_300_400_600_style_normal_subsets_cyrillic_display_swap_variableName_montserratAlternates_default = /*#__PURE__*/__webpack_require__.n(layout_tsx_import_Montserrat_Alternates_arguments_variable_montserrat_alternates_font_weight_300_400_600_style_normal_subsets_cyrillic_display_swap_variableName_montserratAlternates_);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(21313);
;// CONCATENATED MODULE: ./src/app/providers.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`/frontend_app/src/app/providers.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;


/* harmony default export */ const providers = (__default__);
;// CONCATENATED MODULE: ./src/app/layout.tsx




const RootLayout = ({ children })=>/*#__PURE__*/ jsx_runtime_.jsx("html", {
        lang: "uk",
        className: `${(layout_tsx_import_Raleway_arguments_variable_raleway_font_weight_300_400_500_800_style_normal_subsets_cyrillic_display_swap_variableName_raleway_default()).variable} ${(layout_tsx_import_Montserrat_Alternates_arguments_variable_montserrat_alternates_font_weight_300_400_600_style_normal_subsets_cyrillic_display_swap_variableName_montserratAlternates_default()).variable}`,
        children: /*#__PURE__*/ jsx_runtime_.jsx("body", {
            children: /*#__PURE__*/ jsx_runtime_.jsx(providers, {
                children: children
            })
        })
    });
/* harmony default export */ const layout = (RootLayout);


/***/ }),

/***/ 95654:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var components_NotFound_NotFound__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(63868);


const NotFoundPage = ()=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_NotFound_NotFound__WEBPACK_IMPORTED_MODULE_1__/* ["default"] */ .Z, {});
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (NotFoundPage);


/***/ }),

/***/ 63868:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  Z: () => (/* binding */ NotFound_NotFound)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/react.shared-subset.js
var react_shared_subset = __webpack_require__(7887);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(10993);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(34834);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./src/components/common/index.ts + 5 modules
var common = __webpack_require__(26427);
;// CONCATENATED MODULE: ./public/images/page404.svg
/* harmony default export */ const page404 = ({"src":"/_next/static/media/page404.8e60c3b1.svg","height":212,"width":339,"blurWidth":0,"blurHeight":0});
// EXTERNAL MODULE: ./src/components/NotFound/NotFound.module.scss
var NotFound_module = __webpack_require__(82722);
var NotFound_module_default = /*#__PURE__*/__webpack_require__.n(NotFound_module);
;// CONCATENATED MODULE: ./src/components/NotFound/NotFound.tsx







const NotFound = ()=>/*#__PURE__*/ jsx_runtime_.jsx("section", {
        className: (NotFound_module_default()).section,
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
            className: (NotFound_module_default()).container,
            children: [
                /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                    className: (NotFound_module_default()).image,
                    src: page404,
                    alt: "404"
                }),
                /*#__PURE__*/ jsx_runtime_.jsx("p", {
                    className: (NotFound_module_default()).text,
                    children: "Сторінка, яку Ви шукаєте, переміщена або її не існує"
                }),
                /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                    href: "/",
                    children: /*#__PURE__*/ jsx_runtime_.jsx(common/* Button */.zx, {
                        color: "secondary",
                        className: (NotFound_module_default()).button,
                        children: "На головну"
                    })
                })
            ]
        })
    });
/* harmony default export */ const NotFound_NotFound = (NotFound);


/***/ }),

/***/ 69484:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(48346);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Container_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(30615);
/* harmony import */ var _Container_module_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Container_module_scss__WEBPACK_IMPORTED_MODULE_2__);



const Container = ({ children, className })=>{
    const classes = classnames__WEBPACK_IMPORTED_MODULE_1___default()((_Container_module_scss__WEBPACK_IMPORTED_MODULE_2___default().container), className);
    return /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: classes,
        children: children
    });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Container);


/***/ }),

/***/ 82508:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* unused harmony exports __esModule, $$typeof */
/* harmony import */ var next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21313);

const proxy = (0,next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__.createProxy)(String.raw`/frontend_app/src/components/common/ModalActions/Modal.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;


/* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (__default__)));

/***/ }),

/***/ 15813:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7887);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(48346);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _Typography_module_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43222);
/* harmony import */ var _Typography_module_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_Typography_module_scss__WEBPACK_IMPORTED_MODULE_2__);



const Typography = ({ children, variant, component, className })=>/*#__PURE__*/ (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(component, {
        className: classnames__WEBPACK_IMPORTED_MODULE_1___default()(className, (_Typography_module_scss__WEBPACK_IMPORTED_MODULE_2___default())[`text-${variant}`])
    }, children);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Typography);


/***/ }),

/***/ 26427:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  zx: () => (/* reexport */ Button_Button),
  W2: () => (/* reexport */ Container/* default */.Z),
  $j: () => (/* reexport */ Spinner_Spinner),
  ZT: () => (/* reexport */ Typography/* default */.Z)
});

// UNUSED EXPORTS: Checkbox, Modal, XButton

// EXTERNAL MODULE: ./src/components/common/Container/Container.tsx
var Container = __webpack_require__(69484);
// EXTERNAL MODULE: ./src/components/common/Typography/Typography.tsx
var Typography = __webpack_require__(15813);
// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/dist/compiled/react/react.shared-subset.js
var react_shared_subset = __webpack_require__(7887);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(34834);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(48346);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./src/components/common/Spinner/Spinner.module.scss
var Spinner_module = __webpack_require__(97126);
var Spinner_module_default = /*#__PURE__*/__webpack_require__.n(Spinner_module);
;// CONCATENATED MODULE: ./src/components/common/Spinner/Spinner.tsx



const Spinner = ({ className, ...props })=>/*#__PURE__*/ jsx_runtime_.jsx("span", {
        className: classnames_default()((Spinner_module_default()).loader, className),
        ...props
    });
/* harmony default export */ const Spinner_Spinner = (Spinner);

// EXTERNAL MODULE: ./src/components/common/Button/Button.module.scss
var Button_module = __webpack_require__(28538);
var Button_module_default = /*#__PURE__*/__webpack_require__.n(Button_module);
;// CONCATENATED MODULE: ./src/components/common/Button/Button.tsx






const Button = (props)=>{
    const { children, className, variant = "filled", color = "primary", size = "default", isLoading, selected, startIcon, endIcon, component = "button", ...otherProps } = props;
    const buttonClassNames = classnames_default()(className, (Button_module_default()).button, (Button_module_default())[`button--${variant}`], (Button_module_default())[`button--${color}`], (Button_module_default())[`button--${size}`], {
        [(Button_module_default()).loading]: isLoading
    });
    const renderButtonContent = ()=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
            children: [
                startIcon && /*#__PURE__*/ jsx_runtime_.jsx("span", {
                    className: (Button_module_default())["button-icon"],
                    children: startIcon
                }),
                children,
                endIcon && /*#__PURE__*/ jsx_runtime_.jsx("span", {
                    className: (Button_module_default())["button-icon"],
                    children: endIcon
                }),
                isLoading && /*#__PURE__*/ jsx_runtime_.jsx(Spinner_Spinner, {})
            ]
        });
    if (component === "link") {
        const { href, ...linkProps } = otherProps;
        return /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
            href: href,
            ...linkProps,
            className: buttonClassNames,
            "data-selected": selected,
            children: renderButtonContent()
        });
    }
    const buttonProps = otherProps;
    return /*#__PURE__*/ jsx_runtime_.jsx("button", {
        type: "button",
        className: buttonClassNames,
        "data-selected": selected,
        ...buttonProps,
        children: renderButtonContent()
    });
};
/* harmony default export */ const Button_Button = (Button);

;// CONCATENATED MODULE: ./src/components/common/XButton/XButton.tsx




const XButton = ({ className, ...props })=>/*#__PURE__*/ _jsx("button", {
        className: classNames(styles.button, className),
        type: "button",
        ...props,
        children: /*#__PURE__*/ _jsx(X, {
            size: 24
        })
    });
/* harmony default export */ const XButton_XButton = ((/* unused pure expression or super */ null && (XButton)));

// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(21313);
;// CONCATENATED MODULE: ./src/components/common/form/Checkbox/Checkbox.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`/frontend_app/src/components/common/form/Checkbox/Checkbox.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;


/* harmony default export */ const Checkbox = ((/* unused pure expression or super */ null && (__default__)));
;// CONCATENATED MODULE: ./src/components/common/form/Checkbox/index.ts


// EXTERNAL MODULE: ./src/components/common/ModalActions/Modal.tsx
var Modal = __webpack_require__(82508);
;// CONCATENATED MODULE: ./src/components/common/index.ts









/***/ }),

/***/ 65250:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"src":"/_next/static/media/page404.8e60c3b1.svg","height":212,"width":339,"blurWidth":0,"blurHeight":0});

/***/ }),

/***/ 82819:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(93180);
/* harmony import */ var next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__);
  

  /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((props) => {
    const imageData = {"type":"image/x-icon","sizes":"any"}
    const imageUrl = (0,next_dist_lib_metadata_get_metadata_route__WEBPACK_IMPORTED_MODULE_0__.fillMetadataSegment)(".", props.params, "favicon.ico")

    return [{
      ...imageData,
      url: imageUrl + "",
    }]
  });

/***/ })

};
;