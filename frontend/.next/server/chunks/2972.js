"use strict";
exports.id = 2972;
exports.ids = [2972];
exports.modules = {

/***/ 56378:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  q: () => (/* binding */ useIconAndColor)
});

;// CONCATENATED MODULE: ./public/images/brain/brain.svg
/* harmony default export */ const brain = ({"src":"/_next/static/media/brain.3def2ad5.svg","height":18,"width":19,"blurWidth":0,"blurHeight":0});
;// CONCATENATED MODULE: ./public/images/brain/brain_yellow.svg
/* harmony default export */ const brain_yellow = ({"src":"/_next/static/media/brain_yellow.ee561089.svg","height":18,"width":19,"blurWidth":0,"blurHeight":0});
;// CONCATENATED MODULE: ./public/images/brain/brain_green.svg
/* harmony default export */ const brain_green = ({"src":"/_next/static/media/brain_green.fe96cef8.svg","height":18,"width":18,"blurWidth":0,"blurHeight":0});
;// CONCATENATED MODULE: ./src/app/(wigwam)/wigwam/hooks/useIconAndColor.tsx



const useIconAndColor = (firstCharInt)=>{
    let colorText;
    let icon;
    if (firstCharInt > 0 && firstCharInt < 5) {
        colorText = "#7791FA";
        icon = brain_yellow;
    } else if (firstCharInt === 5) {
        colorText = "#52C974";
        icon = brain_green;
    } else {
        colorText = "#B3CDFF";
        icon = brain;
    }
    return {
        colorText,
        icon
    };
};


/***/ }),

/***/ 50502:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"src":"/_next/static/media/brain.3def2ad5.svg","height":18,"width":19,"blurWidth":0,"blurHeight":0});

/***/ }),

/***/ 86156:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"src":"/_next/static/media/brain_green.fe96cef8.svg","height":18,"width":18,"blurWidth":0,"blurHeight":0});

/***/ }),

/***/ 68962:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({"src":"/_next/static/media/brain_yellow.ee561089.svg","height":18,"width":19,"blurWidth":0,"blurHeight":0});

/***/ })

};
;