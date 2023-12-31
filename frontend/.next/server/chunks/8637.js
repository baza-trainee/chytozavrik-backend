exports.id = 8637;
exports.ids = [8637];
exports.modules = {

/***/ 59387:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.t.bind(__webpack_require__, 27977, 23));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 13189));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 58929))

/***/ }),

/***/ 30105:
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 79454));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 14699));
Promise.resolve(/* import() eager */).then(__webpack_require__.bind(__webpack_require__, 27431))

/***/ }),

/***/ 27431:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Header_Header)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(48421);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(31621);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./src/components/common/index.ts + 3 modules
var common = __webpack_require__(78957);
// EXTERNAL MODULE: ./node_modules/next-auth/react/index.js
var react = __webpack_require__(63370);
// EXTERNAL MODULE: ./src/hooks/index.ts + 4 modules
var hooks = __webpack_require__(55971);
// EXTERNAL MODULE: ./src/app/(main)/components/Header/Header.module.scss
var Header_module = __webpack_require__(27634);
var Header_module_default = /*#__PURE__*/__webpack_require__.n(Header_module);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(59483);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/cjs/lucide-react.js
var lucide_react = __webpack_require__(64660);
// EXTERNAL MODULE: ./src/constants/index.ts + 2 modules
var constants = __webpack_require__(64927);
;// CONCATENATED MODULE: ./src/app/(main)/components/Header/HeaderButton.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 







const HeaderButton = ()=>{
    const session = (0,react.useSession)();
    const path = (0,navigation.usePathname)();
    const { signOut } = (0,hooks/* useSignOut */.QJ)();
    const isPartners = path.includes(constants/* Route */.AW.PARENTS);
    const isLobby = path.includes(constants/* Route */.AW.WIGWAM_LOBBY);
    if (session.status === "loading") return null;
    if (session.status === "authenticated") {
        if (isLobby) {
            return /*#__PURE__*/ jsx_runtime_.jsx(common/* Button */.zx, {
                className: (Header_module_default()).buttonOut,
                variant: "outline",
                component: "link",
                href: constants/* Route */.AW.PARENTS,
                children: "Вихід"
            });
        }
        if (isPartners) {
            return /*#__PURE__*/ jsx_runtime_.jsx(common/* Button */.zx, {
                className: (Header_module_default()).buttonOut,
                variant: "outline",
                onClick: ()=>signOut({
                        callbackUrl: constants/* Route */.AW.HOME
                    }),
                children: "Вийти"
            });
        }
        return /*#__PURE__*/ jsx_runtime_.jsx(common/* Button */.zx, {
            component: "link",
            href: constants/* Route */.AW.PARENTS,
            className: (Header_module_default()).button,
            variant: "outline",
            startIcon: /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* User2 */.mI$, {
                className: (Header_module_default()).userLogo
            }),
            children: "Кабінет"
        });
    }
    return /*#__PURE__*/ jsx_runtime_.jsx(common/* Button */.zx, {
        component: "link",
        href: constants/* Route */.AW.SIGN_IN,
        className: (Header_module_default()).buttonIn,
        variant: "outline",
        children: "Вхід"
    });
};
/* harmony default export */ const Header_HeaderButton = (HeaderButton);

;// CONCATENATED MODULE: ./src/app/(main)/components/Header/Header.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 







const Header = ()=>{
    const { data: session } = (0,react.useSession)();
    const { deviceType } = (0,hooks/* useMedia */.GS)();
    return /*#__PURE__*/ jsx_runtime_.jsx("header", {
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(common/* Container */.W2, {
            className: (Header_module_default()).header,
            children: [
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                    href: "/",
                    className: (Header_module_default()).headerContainer,
                    children: [
                        /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                            src: "/images/logo/header-logo.svg",
                            width: 64,
                            height: 54,
                            alt: "Logo",
                            className: (Header_module_default()).logo
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                            src: "/images/logo/chytozavryk.svg",
                            width: 105,
                            height: 14,
                            alt: "Logo",
                            className: (Header_module_default()).logoText
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: (Header_module_default()).buttonContainer,
                    children: [
                        deviceType !== "mobile" && session?.user?.is_superuser && /*#__PURE__*/ jsx_runtime_.jsx(common/* Button */.zx, {
                            className: (Header_module_default()).buttonAdmin,
                            component: "link",
                            href: "/admin",
                            variant: "filled",
                            color: "primary",
                            children: "Адміністрування"
                        }),
                        /*#__PURE__*/ jsx_runtime_.jsx(Header_HeaderButton, {})
                    ]
                })
            ]
        })
    });
};
/* harmony default export */ const Header_Header = (Header);


/***/ }),

/***/ 79454:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Footer_Footer)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(31621);
var link_default = /*#__PURE__*/__webpack_require__.n(next_link);
// EXTERNAL MODULE: ./src/constants/index.ts + 2 modules
var constants = __webpack_require__(64927);
// EXTERNAL MODULE: ./node_modules/classnames/index.js
var classnames = __webpack_require__(71198);
var classnames_default = /*#__PURE__*/__webpack_require__.n(classnames);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(48421);
var image_default = /*#__PURE__*/__webpack_require__.n(next_image);
// EXTERNAL MODULE: ./node_modules/next/navigation.js
var navigation = __webpack_require__(59483);
// EXTERNAL MODULE: ./node_modules/lucide-react/dist/cjs/lucide-react.js
var lucide_react = __webpack_require__(64660);
// EXTERNAL MODULE: ./node_modules/next-auth/react/index.js
var react = __webpack_require__(63370);
// EXTERNAL MODULE: ./src/hooks/useAuthAxiosInstance.ts + 1 modules
var useAuthAxiosInstance = __webpack_require__(10345);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/useQuery.js
var useQuery = __webpack_require__(88546);
// EXTERNAL MODULE: ./src/constants/api.ts
var api = __webpack_require__(30425);
;// CONCATENATED MODULE: ./src/hooks/useQueryContactInfo.ts




const useQueryContactInfo = ()=>{
    const { status } = (0,react.useSession)();
    const axios = (0,useAuthAxiosInstance.useAuthAxiosInstance)();
    const { data: contacts, isLoading: contactsLoading, error: fetchError } = (0,useQuery.useQuery)({
        queryKey: [
            "contacts"
        ],
        queryFn: async ()=>{
            const res = await axios(`${api/* BASE_URL */._}/contact-info/`);
            return res.data.data;
        },
        enabled: status === "authenticated"
    });
    return {
        contacts,
        contactsLoading,
        fetchError
    };
};

;// CONCATENATED MODULE: ./src/utils/formatPhoneNumber.ts
const formatPhoneNumber = (phoneNumber)=>phoneNumber.replace(/(\+?\d{3})(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4");

// EXTERNAL MODULE: ./src/components/common/Container/Container.tsx
var Container = __webpack_require__(93682);
// EXTERNAL MODULE: ./src/components/common/Typography/Typography.tsx
var Typography = __webpack_require__(59476);
// EXTERNAL MODULE: ./src/components/Footer/Footer.module.scss
var Footer_module = __webpack_require__(4888);
var Footer_module_default = /*#__PURE__*/__webpack_require__.n(Footer_module);
;// CONCATENATED MODULE: ./src/components/Footer/Footer.tsx
/* __next_internal_client_entry_do_not_use__ default auto */ 











const Footer = ()=>{
    const pathName = (0,navigation.usePathname)();
    const isShowFooter = !pathName.includes(constants/* Route */.AW.WIGWAM);
    const { contacts } = useQueryContactInfo();
    return isShowFooter && /*#__PURE__*/ jsx_runtime_.jsx("footer", {
        className: (Footer_module_default()).footer,
        children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(Container/* default */.Z, {
            className: (Footer_module_default()).container,
            children: [
                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                    className: (Footer_module_default()).footerContainer,
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)((link_default()), {
                            href: "/",
                            className: (Footer_module_default()).logoContainer,
                            children: [
                                /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                    src: "/images/logo/logo-footer.svg",
                                    width: 58,
                                    height: 50,
                                    alt: "Logo",
                                    className: (Footer_module_default()).logo
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx((image_default()), {
                                    src: "/images/logo/chytozavryk-footer.svg",
                                    width: 120,
                                    height: 16,
                                    alt: "Logo",
                                    className: (Footer_module_default()).logoText
                                })
                            ]
                        }),
                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                            className: (Footer_module_default()).wrapper,
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime_.jsxs)("div", {
                                    className: classnames_default()((Footer_module_default()).list, (Footer_module_default()).informationText, (Footer_module_default()).footerList),
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("ul", {
                                            className: (Footer_module_default()).class4,
                                            children: [
                                                /*#__PURE__*/ jsx_runtime_.jsx(Typography/* default */.Z, {
                                                    className: (Footer_module_default()).informationText,
                                                    component: "p",
                                                    variant: "footer",
                                                    children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                        href: "https://baza-trainee.tech",
                                                        children: "Про проєкт"
                                                    })
                                                }),
                                                /*#__PURE__*/ jsx_runtime_.jsx(Typography/* default */.Z, {
                                                    className: (Footer_module_default()).informationText,
                                                    component: "p",
                                                    variant: "footer",
                                                    children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                        href: constants/* Route */.AW.WIGWAM_LOBBY,
                                                        children: "До вігваму"
                                                    })
                                                })
                                            ]
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime_.jsxs)("ul", {
                                            className: (Footer_module_default()).class1,
                                            children: [
                                                /*#__PURE__*/ jsx_runtime_.jsx(Typography/* default */.Z, {
                                                    className: (Footer_module_default()).informationText,
                                                    component: "p",
                                                    variant: "footer",
                                                    children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                        href: "/pdf/privacy policy.pdf#toolbar=0",
                                                        target: "_blank",
                                                        className: (Footer_module_default()).linkText,
                                                        children: "Політика конфіденційності"
                                                    })
                                                }),
                                                /*#__PURE__*/ jsx_runtime_.jsx(Typography/* default */.Z, {
                                                    className: (Footer_module_default()).informationText,
                                                    component: "p",
                                                    variant: "footer",
                                                    children: /*#__PURE__*/ jsx_runtime_.jsx((link_default()), {
                                                        href: "/pdf/site-rules.pdf#toolbar=0",
                                                        target: "_blank",
                                                        className: (Footer_module_default()).linkText,
                                                        children: "Правила користування сайтом"
                                                    })
                                                })
                                            ]
                                        })
                                    ]
                                }),
                                /*#__PURE__*/ jsx_runtime_.jsx("div", {
                                    className: classnames_default()((Footer_module_default()).list, (Footer_module_default()).contacts),
                                    children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)("ul", {
                                        children: [
                                            /*#__PURE__*/ (0,jsx_runtime_.jsxs)(Typography/* default */.Z, {
                                                className: (Footer_module_default()).informationContact,
                                                component: "p",
                                                variant: "h6",
                                                children: [
                                                    /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Phone */.LPZ, {
                                                        width: 18,
                                                        height: 18,
                                                        className: (Footer_module_default()).image
                                                    }),
                                                    contacts && formatPhoneNumber(contacts.first_phone)
                                                ]
                                            }),
                                            contacts && contacts.second_phone && /*#__PURE__*/ (0,jsx_runtime_.jsxs)(Typography/* default */.Z, {
                                                className: (Footer_module_default()).informationContactSecond,
                                                component: "p",
                                                variant: "h6",
                                                children: [
                                                    /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Phone */.LPZ, {
                                                        width: 18,
                                                        height: 18,
                                                        className: (Footer_module_default()).image
                                                    }),
                                                    contacts && formatPhoneNumber(contacts.second_phone)
                                                ]
                                            }),
                                            /*#__PURE__*/ jsx_runtime_.jsx("a", {
                                                href: `mailto:${contacts && contacts.email}`,
                                                children: /*#__PURE__*/ (0,jsx_runtime_.jsxs)(Typography/* default */.Z, {
                                                    className: (Footer_module_default()).informationMail,
                                                    component: "p",
                                                    variant: "footer-mail",
                                                    children: [
                                                        /*#__PURE__*/ jsx_runtime_.jsx(lucide_react/* Mail */.Mh9, {
                                                            width: 18,
                                                            height: 18,
                                                            className: (Footer_module_default()).image
                                                        }),
                                                        contacts && contacts.email
                                                    ]
                                                })
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                }),
                /*#__PURE__*/ jsx_runtime_.jsx(Typography/* default */.Z, {
                    className: (Footer_module_default()).footerText,
                    component: "p",
                    variant: "footer-end",
                    children: "Розробка Baza Trainee Ukraine 2023 Усі права захищені"
                })
            ]
        })
    });
};
/* harmony default export */ const Footer_Footer = (Footer);


/***/ }),

/***/ 27634:
/***/ ((module) => {

// Exports
module.exports = {
	"header": "Header_header__omDML",
	"headerContainer": "Header_headerContainer__L6osu",
	"logo": "Header_logo__2j4S2",
	"logoText": "Header_logoText__NGjqq",
	"buttonContainer": "Header_buttonContainer__spLiJ",
	"button": "Header_button__TGutH",
	"userLogo": "Header_userLogo__dVZBl",
	"buttonIn": "Header_buttonIn__233bB",
	"buttonOut": "Header_buttonOut__ruGz9"
};


/***/ }),

/***/ 4888:
/***/ ((module) => {

// Exports
module.exports = {
	"footer": "Footer_footer__Q5T55",
	"container": "Footer_container__Vebor",
	"footerContainer": "Footer_footerContainer__Lux0m",
	"list": "Footer_list__VCwsb",
	"informationText": "Footer_informationText__7haWS",
	"informationMail": "Footer_informationMail__dwd9a",
	"decoration": "Footer_decoration__dmG0_",
	"social": "Footer_social__2_oMI",
	"socialImage": "Footer_socialImage__Phvll",
	"text": "Footer_text__iYL5X",
	"image": "Footer_image__SYVSe",
	"logo": "Footer_logo__EaWBg",
	"logoText": "Footer_logoText__A5g2M",
	"logoContainer": "Footer_logoContainer__A0uaV",
	"contacts": "Footer_contacts__fkexU",
	"informationContact": "Footer_informationContact__FHmEG",
	"informationContactSecond": "Footer_informationContactSecond__G9lUq",
	"text1": "Footer_text1__3uDO2",
	"footerText": "Footer_footerText__Ox5vR",
	"footerList": "Footer_footerList__RPeCX",
	"wrapper": "Footer_wrapper__fRar6",
	"class1": "Footer_class1__Bhp6u",
	"linkText": "Footer_linkText__aCTkZ",
	"informationTextLink": "Footer_informationTextLink__Z7vOc",
	"linkText1": "Footer_linkText1__mDs1j"
};


/***/ }),

/***/ 92663:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ layout),
  metadata: () => (/* binding */ metadata)
});

// EXTERNAL MODULE: external "next/dist/compiled/react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(56786);
// EXTERNAL MODULE: ./src/app/globals.scss
var globals = __webpack_require__(39675);
// EXTERNAL MODULE: ./node_modules/next/dist/build/webpack/loaders/next-flight-loader/module-proxy.js
var module_proxy = __webpack_require__(21313);
;// CONCATENATED MODULE: ./src/app/(main)/components/Header/Header.tsx

const proxy = (0,module_proxy.createProxy)(String.raw`/frontend_app/src/app/(main)/components/Header/Header.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;


/* harmony default export */ const Header = (__default__);
;// CONCATENATED MODULE: ./src/components/Footer/Footer.tsx

const Footer_proxy = (0,module_proxy.createProxy)(String.raw`/frontend_app/src/components/Footer/Footer.tsx`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule: Footer_esModule, $$typeof: Footer_$$typeof } = Footer_proxy;
const Footer_default_ = Footer_proxy.default;


/* harmony default export */ const Footer = (Footer_default_);
// EXTERNAL MODULE: ./src/components/Cookies/CookiesPanel.tsx
var CookiesPanel = __webpack_require__(81235);
;// CONCATENATED MODULE: ./src/app/(main)/layout.tsx





const metadata = {
    title: "Читозаврик",
    description: "Generated by create next app"
};
const RootLayout = ({ children })=>/*#__PURE__*/ (0,jsx_runtime_.jsxs)(jsx_runtime_.Fragment, {
        children: [
            /*#__PURE__*/ jsx_runtime_.jsx(Header, {}),
            /*#__PURE__*/ jsx_runtime_.jsx("main", {
                children: children
            }),
            /*#__PURE__*/ jsx_runtime_.jsx(Footer, {}),
            /*#__PURE__*/ jsx_runtime_.jsx(CookiesPanel/* default */.ZP, {})
        ]
    });
/* harmony default export */ const layout = (RootLayout);


/***/ }),

/***/ 40166:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(56786);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var components_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(26427);
/* harmony import */ var _globals_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(39675);
/* harmony import */ var _globals_scss__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_globals_scss__WEBPACK_IMPORTED_MODULE_2__);



const Loading = ()=>/*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
        className: "initialLoading",
        children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx("div", {
            className: "loader",
            children: /*#__PURE__*/ react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx(components_common__WEBPACK_IMPORTED_MODULE_1__/* .Spinner */ .$j, {})
        })
    });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Loading);


/***/ }),

/***/ 70778:
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