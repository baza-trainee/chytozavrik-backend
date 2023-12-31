"use strict";
exports.id = 5083;
exports.ids = [5083];
exports.modules = {

/***/ 55083:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  L: () => (/* reexport */ authOptions)
});

// EXTERNAL MODULE: ./node_modules/next-auth/providers/credentials.js
var credentials = __webpack_require__(38198);
// EXTERNAL MODULE: ./node_modules/jwt-decode/build/jwt-decode.cjs.js
var jwt_decode_cjs = __webpack_require__(18341);
var jwt_decode_cjs_default = /*#__PURE__*/__webpack_require__.n(jwt_decode_cjs);
// EXTERNAL MODULE: ./src/services/api.ts
var api = __webpack_require__(53735);
// EXTERNAL MODULE: ./src/constants/index.ts + 2 modules
var constants = __webpack_require__(65702);
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

/***/ 65702:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  yn: () => (/* reexport */ IS_REVERSED),
  IV: () => (/* reexport */ PAGE_SIZE),
  AW: () => (/* reexport */ Route)
});

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

/***/ 53735:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   E4: () => (/* binding */ getContactsService),
/* harmony export */   Kj: () => (/* binding */ getUsersService),
/* harmony export */   Mq: () => (/* binding */ getQuizzesService),
/* harmony export */   Qc: () => (/* binding */ getActiveChildsService),
/* harmony export */   Um: () => (/* binding */ getDocumentsService),
/* harmony export */   Uv: () => (/* binding */ getUsersQuizzesService),
/* harmony export */   XE: () => (/* binding */ getMonstersService),
/* harmony export */   Xo: () => (/* binding */ getBooksService),
/* harmony export */   e4: () => (/* binding */ signInService),
/* harmony export */   g7: () => (/* binding */ getChildBooksService),
/* harmony export */   hX: () => (/* binding */ getUserInfoService),
/* harmony export */   iq: () => (/* binding */ getRecommendationBooksService),
/* harmony export */   r: () => (/* binding */ token),
/* harmony export */   u2: () => (/* binding */ getChildsService),
/* harmony export */   ur: () => (/* binding */ refreshTokenService),
/* harmony export */   yJ: () => (/* binding */ getWigwamQuizService)
/* harmony export */ });
/* unused harmony exports privateFetch, signUpService, getQuizInfoByIdService, sendSelectedAnswerService, sendPasswordResetEmailService, newPasswordService, changePasswordService, getChildrenService */
/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24279);
/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(55083);
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(81723);
/* harmony import */ var _services_axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(70199);




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
    const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_0__.getServerSession)(_config__WEBPACK_IMPORTED_MODULE_1__/* .authOptions */ .L);
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
const getUsersQuizzesService = async (childId, search = "", page = "1", category = _types__WEBPACK_IMPORTED_MODULE_2__/* .QuizCategory */ .t.All, IS_REVERSED = true, PAGE_SIZE = 12)=>{
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
    const result = await (0,_services_axios__WEBPACK_IMPORTED_MODULE_3__/* .fetch */ .h)(`${baseUrl}/books?page=1&page_size=7&search=${search}`);
    return result.data;
};
const getMonstersService = async (childId)=>{
    const { data } = await (0,_services_axios__WEBPACK_IMPORTED_MODULE_3__/* .fetch */ .h)(`${baseUrl}/users/me/children/${childId}/rewards`);
    if ("results" in data) {
        return data.results;
    }
    throw new Error(data.message);
};
const getChildBooksService = async (childId)=>{
    const { data } = await (0,_services_axios__WEBPACK_IMPORTED_MODULE_3__/* .fetch */ .h)(`${baseUrl}/users/me/children/${childId}/quizzes`);
    return data;
};
const getRecommendationBooksService = async ()=>{
    const { data } = await (0,_services_axios__WEBPACK_IMPORTED_MODULE_3__/* .fetch */ .h)(`${baseUrl}/recommendation-books`);
    return data;
};
const getWigwamQuizService = async (childId)=>{
    const { data } = await (0,_services_axios__WEBPACK_IMPORTED_MODULE_3__/* .fetch */ .h)(`${baseUrl}/users/me/children/${childId}`);
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
    const result = await (0,_services_axios__WEBPACK_IMPORTED_MODULE_3__/* .fetch */ .h)(`${baseUrl}/contact-info/`);
    return result.data;
};
const getUsersService = async ()=>{
    const { data } = await (0,_services_axios__WEBPACK_IMPORTED_MODULE_3__/* .fetch */ .h)(`${baseUrl}/statistics/users/`);
    return data;
};
const getChildsService = async ()=>{
    const { data } = await (0,_services_axios__WEBPACK_IMPORTED_MODULE_3__/* .fetch */ .h)(`${baseUrl}/statistics/child/`);
    return data;
};
const getActiveChildsService = async ()=>{
    const { data } = await (0,_services_axios__WEBPACK_IMPORTED_MODULE_3__/* .fetch */ .h)(`${baseUrl}/statistics/active-child/`);
    return data;
};
const getQuizzesService = async ()=>{
    const { data } = await (0,_services_axios__WEBPACK_IMPORTED_MODULE_3__/* .fetch */ .h)(`${baseUrl}/statistics/quizzes/`);
    return data;
};


/***/ }),

/***/ 70199:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   h: () => (/* binding */ fetch)
/* harmony export */ });
/* unused harmony export axiosClient */
/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(24279);
/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(22878);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8138);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(55083);



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
                message: error instanceof axios__WEBPACK_IMPORTED_MODULE_3__/* .AxiosError */ .d7 && error.response?.status !== 404 ? error.response?.data.data.message : error.message
            }
        };
    }
};


/***/ }),

/***/ 81723:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  t: () => (/* reexport */ QuizCategory)
});

;// CONCATENATED MODULE: ./src/types/Quiz.ts
var QuizCategory;
(function(QuizCategory) {
    QuizCategory["All"] = "";
    QuizCategory["Started"] = "is_started=true";
    QuizCategory["Completed"] = "is_completed=true";
})(QuizCategory || (QuizCategory = {}));

;// CONCATENATED MODULE: ./src/types/index.ts















/***/ })

};
;