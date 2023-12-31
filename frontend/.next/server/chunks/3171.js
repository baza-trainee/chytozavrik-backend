exports.id = 3171;
exports.ids = [3171];
exports.modules = {

/***/ 46720:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 3280, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 69274, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 90701, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 3349, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 14699));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 136));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 25906));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 77042))

/***/ }),

/***/ 136:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(63370);
/* harmony import */ var next_auth_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_auth_react__WEBPACK_IMPORTED_MODULE_1__);
/* __next_internal_client_entry_do_not_use__ default auto */ 

const WigwamProvider = ({ children })=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(next_auth_react__WEBPACK_IMPORTED_MODULE_1__.SessionProvider, {
        children: children
    });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (WigwamProvider);


/***/ }),

/***/ 77042:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ footer_WigwamFooter)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./src/hooks/index.ts + 4 modules
var hooks = __webpack_require__(55971);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(31621);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(71198);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./src/components/common/Container/Container.tsx
var Container = __webpack_require__(93682);
// EXTERNAL MODULE: ./src/components/common/Typography/Typography.tsx
var Typography = __webpack_require__(59476);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/cjs/lucide-react.js
var lucide_react = __webpack_require__(64660);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(59483);
// EXTERNAL MODULE: ./src/app/(wigwam)/components/header/Chytozavr/Chytozavr.tsx
var Chytozavr = __webpack_require__(92900);
// EXTERNAL MODULE: ./src/app/(wigwam)/components/NavbarMobFooter/NavbarMobFooter.module.scss
var NavbarMobFooter_module = __webpack_require__(96505);
var NavbarMobFooter_module_default = /*#__PURE__*/__webpack_require__.n(NavbarMobFooter_module);
;// CONCATENATED MODULE: ./src/app/(wigwam)/components/NavbarMobFooter/NavbarMobFooter.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 








const NavbarMobFooter = ({ childId })=>{
    const currentRoute = (0,navigation.usePathname)();
    return /*#__PURE__*/ jsx_runtime_.jsx("footer", {
        className: (NavbarMobFooter_module_default()).footer,
        children: /*#__PURE__*/ jsx_runtime_.jsx(Container/* default */.Z, {
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: (NavbarMobFooter_module_default()).wrapper,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx(Typography/* default */.Z, {
                        component: "p",
                        variant: "navbar",
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                            className: (NavbarMobFooter_module_default()).link,
                            href: `/wigwam/${childId}`,
                            style: currentRoute === `/wigwam/${childId}` ? {
                                color: "#F2B441"
                            } : undefined,
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Tent */.hrb, {
                                    width: 24,
                                    height: 24,
                                    className: classnames_default()((NavbarMobFooter_module_default()).logo),
                                    color: currentRoute === `/wigwam/${childId}` ? "#F2B441" : "#7791fa"
                                }),
                                "Вігвам"
                            ]
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(Typography/* default */.Z, {
                        component: "p",
                        variant: "navbar",
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                            className: (NavbarMobFooter_module_default()).link,
                            href: `/wigwam/${childId}/quizzes`,
                            style: currentRoute === `/wigwam/${childId}/quizzes` ? {
                                color: "#F2B441"
                            } : undefined,
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Brain */.amH, {
                                    width: 24,
                                    height: 24,
                                    className: classnames_default()((NavbarMobFooter_module_default()).logo),
                                    color: currentRoute === `/wigwam/${childId}/quizzes` ? "#F2B441" : "#7791fa"
                                }),
                                "Вікторини"
                            ]
                        })
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx(Typography/* default */.Z, {
                        component: "p",
                        variant: "navbar",
                        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                            className: (NavbarMobFooter_module_default()).link,
                            href: `/wigwam/${childId}/awards`,
                            style: currentRoute === `/wigwam/${childId}/awards` ? {
                                color: "#F2B441"
                            } : undefined,
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx(Chytozavr/* default */.Z, {
                                    stroke: currentRoute === `/wigwam/${childId}/awards` ? "#F2B441" : "#7791FA"
                                }),
                                "Читозаврики"
                            ]
                        })
                    })
                ]
            })
        })
    });
};
/* harmony default export */ const NavbarMobFooter_NavbarMobFooter = (NavbarMobFooter);

;// CONCATENATED MODULE: ./src/app/(wigwam)/components/footer/WigwamFooter.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 



const WigwamFooter = ({ childId })=>{
    const { deviceType } = (0,hooks/* useMedia */.GS)();
    return deviceType === "mobile" && /*#__PURE__*/ jsx_runtime_.jsx(NavbarMobFooter_NavbarMobFooter, {
        childId: childId
    });
};
/* harmony default export */ const footer_WigwamFooter = (WigwamFooter);


/***/ }),

/***/ 92900:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Z: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18038);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);


const Chytozavr = ({ stroke })=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("svg", {
        width: "19",
        height: "24",
        viewBox: "0 0 19 24",
        fill: "none",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                d: "M4.22623 22.089H6.149C6.57199 22.089 6.91382 22.2331 7.12804 22.4117C7.3394 22.5878 7.39281 22.759 7.39281 22.8758V23.5008H2.98242V22.8758C2.98242 22.759 3.03583 22.5878 3.24719 22.4117C3.46141 22.2331 3.80323 22.089 4.22623 22.089Z",
                fill: "#7791FA",
                stroke: stroke,
                strokeWidth: "3"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                d: "M13.1208 22.089H15.0435C15.4665 22.089 15.8084 22.2331 16.0226 22.4117C16.2339 22.5878 16.2873 22.759 16.2873 22.8758V23.5008H11.877V22.8758C11.877 22.759 11.9304 22.5878 12.1417 22.4117C12.3559 22.2331 12.6978 22.089 13.1208 22.089Z",
                fill: "#7791FA",
                stroke: stroke,
                strokeWidth: "3"
            }),
            /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("path", {
                d: "M2.31195 7.55317C2.38332 7.13501 2.47685 6.64395 2.5733 6.1592L2.98572 6.45592L3.86175 5.23832L2.98572 6.45592C3.83265 7.06526 5.00093 6.94781 5.70961 6.18206L9.35785 2.24006L12.7914 6.15061C13.4708 6.92445 14.6163 7.08004 15.4775 6.51548L16.2446 6.01263C16.3685 6.55015 16.4894 7.10668 16.5741 7.57038C16.8467 9.06247 16.9746 10.8576 17.013 12.6781C17.0967 16.6524 13.704 19.8237 9.49286 19.8237C5.01722 19.8237 1.47597 16.2392 1.80383 11.9555C1.92357 10.391 2.08818 8.86426 2.31195 7.55317Z",
                stroke: stroke,
                strokeWidth: "3"
            })
        ]
    });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Chytozavr);


/***/ }),

/***/ 25906:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ header_WigwamHeader)
});

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
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(48421);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/cjs/lucide-react.js
var lucide_react = __webpack_require__(64660);
// EXTERNAL MODULE: ./src/components/common/Container/Container.tsx
var Container = __webpack_require__(93682);
// EXTERNAL MODULE: ./src/components/common/index.ts + 3 modules
var common = __webpack_require__(78957);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(59483);
// EXTERNAL MODULE: ./src/app/(wigwam)/components/header/Chytozavr/Chytozavr.tsx
var Chytozavr = __webpack_require__(92900);
// EXTERNAL MODULE: ./src/app/(wigwam)/components/header/Navbar/Navbar.module.scss
var Navbar_module = __webpack_require__(2139);
var Navbar_module_default = /*#__PURE__*/__webpack_require__.n(Navbar_module);
;// CONCATENATED MODULE: ./src/app/(wigwam)/components/header/Navbar/Navbar.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 









const Navbar = ({ childId, name, avatar })=>{
    const currentRoute = (0,navigation.usePathname)();
    return /*#__PURE__*/ jsx_runtime_.jsx("header", {
        className: (Navbar_module_default()).section,
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(Container/* default */.Z, {
            className: (Navbar_module_default()).container,
            children: [
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: (Navbar_module_default()).wrapper,
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx("div", {
                            className: (Navbar_module_default()).generalLogo,
                            children: /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                src: "/images/logo/header-logo.svg",
                                width: 40,
                                height: 40,
                                alt: "Logo",
                                className: classnames_default()((Navbar_module_default()).mainLogo)
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(common/* Typography */.ZT, {
                            component: "p",
                            variant: "navbar",
                            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                                className: (Navbar_module_default()).link,
                                href: `/wigwam/${childId}`,
                                style: currentRoute === `/wigwam/${childId}` ? {
                                    pointerEvents: "none",
                                    color: "#F2B441"
                                } : {},
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Tent */.hrb, {
                                        width: 24,
                                        height: 24,
                                        className: classnames_default()((Navbar_module_default()).logo),
                                        color: currentRoute === `/wigwam/${childId}` ? "#F2B441" : "#7791fa"
                                    }),
                                    "Вігвам"
                                ]
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(common/* Typography */.ZT, {
                            component: "p",
                            variant: "navbar",
                            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                                className: (Navbar_module_default()).link,
                                href: `/wigwam/${childId}/quizzes`,
                                style: currentRoute === `/wigwam/${childId}/quizzes` ? {
                                    pointerEvents: "none",
                                    color: "#F2B441"
                                } : {},
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Brain */.amH, {
                                        width: 24,
                                        height: 24,
                                        className: classnames_default()((Navbar_module_default()).logo),
                                        color: currentRoute === `/wigwam/${childId}/quizzes` ? "#F2B441" : "#7791fa"
                                    }),
                                    "Вікторини"
                                ]
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(common/* Typography */.ZT, {
                            component: "p",
                            variant: "navbar",
                            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                                className: (Navbar_module_default()).link,
                                href: `/wigwam/${childId}/awards`,
                                style: currentRoute === `/wigwam/${childId}/awards` ? {
                                    pointerEvents: "none",
                                    color: "#F2B441"
                                } : {},
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(Chytozavr/* default */.Z, {
                                        stroke: currentRoute === `/wigwam/${childId}/awards` ? "#F2B441" : "#7791FA"
                                    }),
                                    "Читозаврики"
                                ]
                            })
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(common/* Typography */.ZT, {
                            component: "p",
                            variant: "navbar",
                            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                                className: (Navbar_module_default()).link,
                                href: "/parents/lobby",
                                children: [
                                    /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* LogOut */.d6Z, {
                                        width: 32,
                                        height: 32,
                                        className: classnames_default()((Navbar_module_default()).logo)
                                    }),
                                    "Вихід"
                                ]
                            })
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: classnames_default()((Navbar_module_default()).user),
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx("p", {
                            children: name
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                            src: avatar,
                            width: 32,
                            height: 32,
                            alt: "Logo",
                            className: classnames_default()((Navbar_module_default()).avatar)
                        })
                    ]
                })
            ]
        })
    });
};
/* harmony default export */ const Navbar_Navbar = (Navbar);

// EXTERNAL MODULE: ./src/hooks/index.ts + 4 modules
var hooks = __webpack_require__(55971);
// EXTERNAL MODULE: ./src/app/(wigwam)/components/header/NavbarMob/NavbarMob.module.scss
var NavbarMob_module = __webpack_require__(55106);
var NavbarMob_module_default = /*#__PURE__*/__webpack_require__.n(NavbarMob_module);
;// CONCATENATED MODULE: ./src/app/(wigwam)/components/header/NavbarMob/NavbarMob.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 






const NavbarMob = ({ avatar })=>/*#__PURE__*/ jsx_runtime_.jsx("header", {
        className: (NavbarMob_module_default()).header,
        children: /*#__PURE__*/ jsx_runtime_.jsx(Container/* default */.Z, {
            children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                className: (NavbarMob_module_default()).wrapper,
                children: [
                    /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                        src: "/images/logo/header-logo.svg",
                        width: 29,
                        height: 24,
                        alt: "Logo",
                        className: classnames_default()((NavbarMob_module_default()).log)
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                        src: avatar,
                        width: 32,
                        height: 32,
                        alt: "Logo",
                        className: classnames_default()((NavbarMob_module_default()).log)
                    }),
                    /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                        href: "/parents/lobby",
                        children: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* LogOut */.d6Z, {
                            width: 32,
                            height: 32,
                            className: classnames_default()((NavbarMob_module_default()).logo)
                        })
                    })
                ]
            })
        })
    });
/* harmony default export */ const NavbarMob_NavbarMob = (NavbarMob);

;// CONCATENATED MODULE: ./src/app/(wigwam)/components/header/WigwamHeader.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 




const WigwamHeader = ({ childId, name, avatar })=>{
    const { deviceType } = (0,hooks/* useMedia */.GS)();
    return deviceType === "mobile" ? /*#__PURE__*/ jsx_runtime_.jsx(NavbarMob_NavbarMob, {
        avatar: avatar
    }) : /*#__PURE__*/ jsx_runtime_.jsx(Navbar_Navbar, {
        childId: childId,
        name: name,
        avatar: avatar
    });
};
/* harmony default export */ const header_WigwamHeader = (WigwamHeader);


/***/ }),

/***/ 96505:
/***/ ((module) => {

// Exports
module.exports = {
	"footer": "NavbarMobFooter_footer__34G90",
	"link": "NavbarMobFooter_link__qrFQP",
	"wrapper": "NavbarMobFooter_wrapper__xJZuX"
};


/***/ }),

/***/ 2139:
/***/ ((module) => {

// Exports
module.exports = {
	"section": "Navbar_section__LbzuS",
	"container": "Navbar_container__HDS7X",
	"link": "Navbar_link__v8Dyh",
	"wrapper": "Navbar_wrapper___2kMZ",
	"user": "Navbar_user__zozl9",
	"avatar": "Navbar_avatar__hYRLX",
	"generalLogo": "Navbar_generalLogo__cQ0u8"
};


/***/ }),

/***/ 55106:
/***/ ((module) => {

// Exports
module.exports = {
	"header": "NavbarMob_header__lJkwJ",
	"logo": "NavbarMob_logo__YiIPX",
	"wrapper": "NavbarMob_wrapper__ts0VC"
};


/***/ }),

/***/ 8137:
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
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(21313);
;// CONCATENATED MODULE: ./src/app/(wigwam)/components/Provider/WigmawProvider.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`/frontend_app/src/app/(wigwam)/components/Provider/WigmawProvider.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;


/* harmony default export */ const WigmawProvider = (__default__);
;// CONCATENATED MODULE: ./src/app/(wigwam)/components/header/WigwamHeader.tsx

const WigwamHeader_proxy = (0,module_proxy.createProxy)(String.raw`/frontend_app/src/app/(wigwam)/components/header/WigwamHeader.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: WigwamHeader_esModule, $$typeof: WigwamHeader_$$typeof } = WigwamHeader_proxy;
const WigwamHeader_default_ = WigwamHeader_proxy.default;


/* harmony default export */ const WigwamHeader = (WigwamHeader_default_);
;// CONCATENATED MODULE: ./src/app/(wigwam)/components/footer/WigwamFooter.tsx

const WigwamFooter_proxy = (0,module_proxy.createProxy)(String.raw`/frontend_app/src/app/(wigwam)/components/footer/WigwamFooter.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: WigwamFooter_esModule, $$typeof: WigwamFooter_$$typeof } = WigwamFooter_proxy;
const WigwamFooter_default_ = WigwamFooter_proxy.default;


/* harmony default export */ const WigwamFooter = (WigwamFooter_default_);
// EXTERNAL MODULE: ./src/components/Cookies/CookiesPanel.tsx
var CookiesPanel = __webpack_require__(81235);
// EXTERNAL MODULE: ./src/services/axios.ts
var axios = __webpack_require__(70199);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(78875);
// EXTERNAL MODULE: ./src/app/globals.scss
var globals = __webpack_require__(39675);
;// CONCATENATED MODULE: ./src/app/(wigwam)/wigwam/[childId]/layout.tsx








const Layout = async ({ children, params: { childId } })=>{
    const childReq = await (0,axios/* fetch */.h)(`/users/me/children/${childId}/`);
    if (childReq.status === "fail") (0,navigation.notFound)();
    return /*#__PURE__*/ (0,jsx_runtime_.jsxs)(WigmawProvider, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(WigwamHeader, {
                childId: childId,
                name: childReq.data.name,
                avatar: childReq.data.avatar_as_url
            }),
            /*#__PURE__*/ jsx_runtime_.jsx("main", {
                children: children
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(WigwamFooter, {
                childId: childId
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(CookiesPanel/* default */.ZP, {})
        ]
    });
};
/* harmony default export */ const layout = (Layout);


/***/ }),

/***/ 9122:
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


/***/ })

};
;