exports.id = 3012;
exports.ids = [3012];
exports.modules = {

/***/ 211:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = exports.hkdf = void 0;
const hkdf_js_1 = __webpack_require__(69262);
function normalizeDigest(digest) {
    switch(digest){
        case "sha256":
        case "sha384":
        case "sha512":
        case "sha1":
            return digest;
        default:
            throw new TypeError('unsupported "digest" value');
    }
}
function normalizeUint8Array(input, label) {
    if (typeof input === "string") return new TextEncoder().encode(input);
    if (!(input instanceof Uint8Array)) throw new TypeError(`"${label}"" must be an instance of Uint8Array or a string`);
    return input;
}
function normalizeIkm(input) {
    const ikm = normalizeUint8Array(input, "ikm");
    if (!ikm.byteLength) throw new TypeError(`"ikm" must be at least one byte in length`);
    return ikm;
}
function normalizeInfo(input) {
    const info = normalizeUint8Array(input, "info");
    if (info.byteLength > 1024) {
        throw TypeError('"info" must not contain more than 1024 bytes');
    }
    return info;
}
function normalizeKeylen(input, digest) {
    if (typeof input !== "number" || !Number.isInteger(input) || input < 1) {
        throw new TypeError('"keylen" must be a positive integer');
    }
    const hashlen = parseInt(digest.substr(3), 10) >> 3 || 20;
    if (input > 255 * hashlen) {
        throw new TypeError('"keylen" too large');
    }
    return input;
}
async function hkdf(digest, ikm, salt, info, keylen) {
    return (0, hkdf_js_1.default)(normalizeDigest(digest), normalizeIkm(ikm), normalizeUint8Array(salt, "salt"), normalizeInfo(info), normalizeKeylen(keylen, digest));
}
exports.hkdf = hkdf;
exports["default"] = hkdf;


/***/ }),

/***/ 18476:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const crypto_1 = __webpack_require__(6113);
exports["default"] = (digest, ikm, salt, info, keylen)=>{
    const hashlen = parseInt(digest.substr(3), 10) >> 3 || 20;
    const prk = (0, crypto_1.createHmac)(digest, salt.byteLength ? salt : new Uint8Array(hashlen)).update(ikm).digest();
    const N = Math.ceil(keylen / hashlen);
    const T = new Uint8Array(hashlen * N + info.byteLength + 1);
    let prev = 0;
    let start = 0;
    for(let c = 1; c <= N; c++){
        T.set(info, start);
        T[start + info.byteLength] = c;
        T.set((0, crypto_1.createHmac)(digest, prk).update(T.subarray(prev, start + info.byteLength + 1)).digest(), start);
        prev = start;
        start += hashlen;
    }
    return T.slice(0, keylen);
};


/***/ }),

/***/ 69262:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const crypto = __webpack_require__(6113);
const fallback_js_1 = __webpack_require__(18476);
let hkdf;
if (typeof crypto.hkdf === "function" && !process.versions.electron) {
    hkdf = async (...args)=>new Promise((resolve, reject)=>{
            crypto.hkdf(...args, (err, arrayBuffer)=>{
                if (err) reject(err);
                else resolve(new Uint8Array(arrayBuffer));
            });
        });
}
exports["default"] = async (digest, ikm, salt, info, keylen)=>(hkdf || fallback_js_1.default)(digest, ikm, salt, info, keylen);


/***/ }),

/***/ 63852:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = {
    parallel: __webpack_require__(63642),
    serial: __webpack_require__(10296),
    serialOrdered: __webpack_require__(24103)
};


/***/ }),

/***/ 93243:
/***/ ((module) => {

"use strict";
// API

module.exports = abort;
/**
 * Aborts leftover active jobs
 *
 * @param {object} state - current state object
 */ function abort(state) {
    Object.keys(state.jobs).forEach(clean.bind(state));
    // reset leftover jobs
    state.jobs = {};
}
/**
 * Cleans up leftover job by invoking abort function for the provided job id
 *
 * @this  state
 * @param {string|number} key - job id to abort
 */ function clean(key) {
    if (typeof this.jobs[key] == "function") {
        this.jobs[key]();
    }
}


/***/ }),

/***/ 96186:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var defer = __webpack_require__(62889);
// API
module.exports = async;
/**
 * Runs provided callback asynchronously
 * even if callback itself is not
 *
 * @param   {function} callback - callback to invoke
 * @returns {function} - augmented callback
 */ function async(callback) {
    var isAsync = false;
    // check if async happened
    defer(function() {
        isAsync = true;
    });
    return function async_callback(err, result) {
        if (isAsync) {
            callback(err, result);
        } else {
            defer(function nextTick_callback() {
                callback(err, result);
            });
        }
    };
}


/***/ }),

/***/ 62889:
/***/ ((module) => {

"use strict";

module.exports = defer;
/**
 * Runs provided function on next iteration of the event loop
 *
 * @param {function} fn - function to run
 */ function defer(fn) {
    var nextTick = typeof setImmediate == "function" ? setImmediate : typeof process == "object" && typeof process.nextTick == "function" ? process.nextTick : null;
    if (nextTick) {
        nextTick(fn);
    } else {
        setTimeout(fn, 0);
    }
}


/***/ }),

/***/ 31333:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var async = __webpack_require__(96186), abort = __webpack_require__(93243);
// API
module.exports = iterate;
/**
 * Iterates over each job object
 *
 * @param {array|object} list - array or object (named list) to iterate over
 * @param {function} iterator - iterator to run
 * @param {object} state - current job status
 * @param {function} callback - invoked when all elements processed
 */ function iterate(list, iterator, state, callback) {
    // store current index
    var key = state["keyedList"] ? state["keyedList"][state.index] : state.index;
    state.jobs[key] = runJob(iterator, key, list[key], function(error, output) {
        // don't repeat yourself
        // skip secondary callbacks
        if (!(key in state.jobs)) {
            return;
        }
        // clean up jobs
        delete state.jobs[key];
        if (error) {
            // don't process rest of the results
            // stop still active jobs
            // and reset the list
            abort(state);
        } else {
            state.results[key] = output;
        }
        // return salvaged results
        callback(error, state.results);
    });
}
/**
 * Runs iterator over provided job element
 *
 * @param   {function} iterator - iterator to invoke
 * @param   {string|number} key - key/index of the element in the list of jobs
 * @param   {mixed} item - job description
 * @param   {function} callback - invoked after iterator is done with the job
 * @returns {function|mixed} - job abort function or something else
 */ function runJob(iterator, key, item, callback) {
    var aborter;
    // allow shortcut if iterator expects only two arguments
    if (iterator.length == 2) {
        aborter = iterator(item, async(callback));
    } else {
        aborter = iterator(item, key, async(callback));
    }
    return aborter;
}


/***/ }),

/***/ 12816:
/***/ ((module) => {

"use strict";
// API

module.exports = state;
/**
 * Creates initial state object
 * for iteration over list
 *
 * @param   {array|object} list - list to iterate over
 * @param   {function|null} sortMethod - function to use for keys sort,
 *                                     or `null` to keep them as is
 * @returns {object} - initial state object
 */ function state(list, sortMethod) {
    var isNamedList = !Array.isArray(list), initState = {
        index: 0,
        keyedList: isNamedList || sortMethod ? Object.keys(list) : null,
        jobs: {},
        results: isNamedList ? {} : [],
        size: isNamedList ? Object.keys(list).length : list.length
    };
    if (sortMethod) {
        // sort array keys based on it's values
        // sort object's keys just on own merit
        initState.keyedList.sort(isNamedList ? sortMethod : function(a, b) {
            return sortMethod(list[a], list[b]);
        });
    }
    return initState;
}


/***/ }),

/***/ 33265:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var abort = __webpack_require__(93243), async = __webpack_require__(96186);
// API
module.exports = terminator;
/**
 * Terminates jobs in the attached state context
 *
 * @this  AsyncKitState#
 * @param {function} callback - final callback to invoke after termination
 */ function terminator(callback) {
    if (!Object.keys(this.jobs).length) {
        return;
    }
    // fast forward iteration index
    this.index = this.size;
    // abort jobs
    abort(this);
    // send back results we have so far
    async(callback)(null, this.results);
}


/***/ }),

/***/ 63642:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var iterate = __webpack_require__(31333), initState = __webpack_require__(12816), terminator = __webpack_require__(33265);
// Public API
module.exports = parallel;
/**
 * Runs iterator over provided array elements in parallel
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */ function parallel(list, iterator, callback) {
    var state = initState(list);
    while(state.index < (state["keyedList"] || list).length){
        iterate(list, iterator, state, function(error, result) {
            if (error) {
                callback(error, result);
                return;
            }
            // looks like it's the last one
            if (Object.keys(state.jobs).length === 0) {
                callback(null, state.results);
                return;
            }
        });
        state.index++;
    }
    return terminator.bind(state, callback);
}


/***/ }),

/***/ 10296:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var serialOrdered = __webpack_require__(24103);
// Public API
module.exports = serial;
/**
 * Runs iterator over provided array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */ function serial(list, iterator, callback) {
    return serialOrdered(list, iterator, null, callback);
}


/***/ }),

/***/ 24103:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var iterate = __webpack_require__(31333), initState = __webpack_require__(12816), terminator = __webpack_require__(33265);
// Public API
module.exports = serialOrdered;
// sorting helpers
module.exports.ascending = ascending;
module.exports.descending = descending;
/**
 * Runs iterator over provided sorted array elements in series
 *
 * @param   {array|object} list - array or object (named list) to iterate over
 * @param   {function} iterator - iterator to run
 * @param   {function} sortMethod - custom sort function
 * @param   {function} callback - invoked when all elements processed
 * @returns {function} - jobs terminator
 */ function serialOrdered(list, iterator, sortMethod, callback) {
    var state = initState(list, sortMethod);
    iterate(list, iterator, state, function iteratorHandler(error, result) {
        if (error) {
            callback(error, result);
            return;
        }
        state.index++;
        // are we there yet?
        if (state.index < (state["keyedList"] || list).length) {
            iterate(list, iterator, state, iteratorHandler);
            return;
        }
        // done here
        callback(null, state.results);
    });
    return terminator.bind(state, callback);
}
/*
 * -- Sort methods
 */ /**
 * sort helper to sort array elements in ascending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */ function ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}
/**
 * sort helper to sort array elements in descending order
 *
 * @param   {mixed} a - an item to compare
 * @param   {mixed} b - an item to compare
 * @returns {number} - comparison result
 */ function descending(a, b) {
    return -1 * ascending(a, b);
}


/***/ }),

/***/ 66086:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var util = __webpack_require__(73837);
var Stream = (__webpack_require__(12781).Stream);
var DelayedStream = __webpack_require__(75810);
module.exports = CombinedStream;
function CombinedStream() {
    this.writable = false;
    this.readable = true;
    this.dataSize = 0;
    this.maxDataSize = 2 * 1024 * 1024;
    this.pauseStreams = true;
    this._released = false;
    this._streams = [];
    this._currentStream = null;
    this._insideLoop = false;
    this._pendingNext = false;
}
util.inherits(CombinedStream, Stream);
CombinedStream.create = function(options) {
    var combinedStream = new this();
    options = options || {};
    for(var option in options){
        combinedStream[option] = options[option];
    }
    return combinedStream;
};
CombinedStream.isStreamLike = function(stream) {
    return typeof stream !== "function" && typeof stream !== "string" && typeof stream !== "boolean" && typeof stream !== "number" && !Buffer.isBuffer(stream);
};
CombinedStream.prototype.append = function(stream) {
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
        if (!(stream instanceof DelayedStream)) {
            var newStream = DelayedStream.create(stream, {
                maxDataSize: Infinity,
                pauseStream: this.pauseStreams
            });
            stream.on("data", this._checkDataSize.bind(this));
            stream = newStream;
        }
        this._handleErrors(stream);
        if (this.pauseStreams) {
            stream.pause();
        }
    }
    this._streams.push(stream);
    return this;
};
CombinedStream.prototype.pipe = function(dest, options) {
    Stream.prototype.pipe.call(this, dest, options);
    this.resume();
    return dest;
};
CombinedStream.prototype._getNext = function() {
    this._currentStream = null;
    if (this._insideLoop) {
        this._pendingNext = true;
        return; // defer call
    }
    this._insideLoop = true;
    try {
        do {
            this._pendingNext = false;
            this._realGetNext();
        }while (this._pendingNext);
    } finally{
        this._insideLoop = false;
    }
};
CombinedStream.prototype._realGetNext = function() {
    var stream = this._streams.shift();
    if (typeof stream == "undefined") {
        this.end();
        return;
    }
    if (typeof stream !== "function") {
        this._pipeNext(stream);
        return;
    }
    var getStream = stream;
    getStream((function(stream) {
        var isStreamLike = CombinedStream.isStreamLike(stream);
        if (isStreamLike) {
            stream.on("data", this._checkDataSize.bind(this));
            this._handleErrors(stream);
        }
        this._pipeNext(stream);
    }).bind(this));
};
CombinedStream.prototype._pipeNext = function(stream) {
    this._currentStream = stream;
    var isStreamLike = CombinedStream.isStreamLike(stream);
    if (isStreamLike) {
        stream.on("end", this._getNext.bind(this));
        stream.pipe(this, {
            end: false
        });
        return;
    }
    var value = stream;
    this.write(value);
    this._getNext();
};
CombinedStream.prototype._handleErrors = function(stream) {
    var self = this;
    stream.on("error", function(err) {
        self._emitError(err);
    });
};
CombinedStream.prototype.write = function(data) {
    this.emit("data", data);
};
CombinedStream.prototype.pause = function() {
    if (!this.pauseStreams) {
        return;
    }
    if (this.pauseStreams && this._currentStream && typeof this._currentStream.pause == "function") this._currentStream.pause();
    this.emit("pause");
};
CombinedStream.prototype.resume = function() {
    if (!this._released) {
        this._released = true;
        this.writable = true;
        this._getNext();
    }
    if (this.pauseStreams && this._currentStream && typeof this._currentStream.resume == "function") this._currentStream.resume();
    this.emit("resume");
};
CombinedStream.prototype.end = function() {
    this._reset();
    this.emit("end");
};
CombinedStream.prototype.destroy = function() {
    this._reset();
    this.emit("close");
};
CombinedStream.prototype._reset = function() {
    this.writable = false;
    this._streams = [];
    this._currentStream = null;
};
CombinedStream.prototype._checkDataSize = function() {
    this._updateDataSize();
    if (this.dataSize <= this.maxDataSize) {
        return;
    }
    var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this._emitError(new Error(message));
};
CombinedStream.prototype._updateDataSize = function() {
    this.dataSize = 0;
    var self = this;
    this._streams.forEach(function(stream) {
        if (!stream.dataSize) {
            return;
        }
        self.dataSize += stream.dataSize;
    });
    if (this._currentStream && this._currentStream.dataSize) {
        this.dataSize += this._currentStream.dataSize;
    }
};
CombinedStream.prototype._emitError = function(err) {
    this._reset();
    this.emit("error", err);
};


/***/ }),

/***/ 21024:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*!
 * cookie
 * Copyright(c) 2012-2014 Roman Shtylman
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */ 
/**
 * Module exports.
 * @public
 */ exports.parse = parse;
exports.serialize = serialize;
/**
 * Module variables.
 * @private
 */ var __toString = Object.prototype.toString;
/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */ var fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/;
/**
 * Parse a cookie header.
 *
 * Parse the given cookie header string into an object
 * The object has the various cookies as keys(names) => values
 *
 * @param {string} str
 * @param {object} [options]
 * @return {object}
 * @public
 */ function parse(str, options) {
    if (typeof str !== "string") {
        throw new TypeError("argument str must be a string");
    }
    var obj = {};
    var opt = options || {};
    var dec = opt.decode || decode;
    var index = 0;
    while(index < str.length){
        var eqIdx = str.indexOf("=", index);
        // no more cookie pairs
        if (eqIdx === -1) {
            break;
        }
        var endIdx = str.indexOf(";", index);
        if (endIdx === -1) {
            endIdx = str.length;
        } else if (endIdx < eqIdx) {
            // backtrack on prior semicolon
            index = str.lastIndexOf(";", eqIdx - 1) + 1;
            continue;
        }
        var key = str.slice(index, eqIdx).trim();
        // only assign once
        if (undefined === obj[key]) {
            var val = str.slice(eqIdx + 1, endIdx).trim();
            // quoted values
            if (val.charCodeAt(0) === 0x22) {
                val = val.slice(1, -1);
            }
            obj[key] = tryDecode(val, dec);
        }
        index = endIdx + 1;
    }
    return obj;
}
/**
 * Serialize data into a cookie header.
 *
 * Serialize the a name value pair into a cookie string suitable for
 * http headers. An optional options object specified cookie parameters.
 *
 * serialize('foo', 'bar', { httpOnly: true })
 *   => "foo=bar; httpOnly"
 *
 * @param {string} name
 * @param {string} val
 * @param {object} [options]
 * @return {string}
 * @public
 */ function serialize(name, val, options) {
    var opt = options || {};
    var enc = opt.encode || encode;
    if (typeof enc !== "function") {
        throw new TypeError("option encode is invalid");
    }
    if (!fieldContentRegExp.test(name)) {
        throw new TypeError("argument name is invalid");
    }
    var value = enc(val);
    if (value && !fieldContentRegExp.test(value)) {
        throw new TypeError("argument val is invalid");
    }
    var str = name + "=" + value;
    if (null != opt.maxAge) {
        var maxAge = opt.maxAge - 0;
        if (isNaN(maxAge) || !isFinite(maxAge)) {
            throw new TypeError("option maxAge is invalid");
        }
        str += "; Max-Age=" + Math.floor(maxAge);
    }
    if (opt.domain) {
        if (!fieldContentRegExp.test(opt.domain)) {
            throw new TypeError("option domain is invalid");
        }
        str += "; Domain=" + opt.domain;
    }
    if (opt.path) {
        if (!fieldContentRegExp.test(opt.path)) {
            throw new TypeError("option path is invalid");
        }
        str += "; Path=" + opt.path;
    }
    if (opt.expires) {
        var expires = opt.expires;
        if (!isDate(expires) || isNaN(expires.valueOf())) {
            throw new TypeError("option expires is invalid");
        }
        str += "; Expires=" + expires.toUTCString();
    }
    if (opt.httpOnly) {
        str += "; HttpOnly";
    }
    if (opt.secure) {
        str += "; Secure";
    }
    if (opt.priority) {
        var priority = typeof opt.priority === "string" ? opt.priority.toLowerCase() : opt.priority;
        switch(priority){
            case "low":
                str += "; Priority=Low";
                break;
            case "medium":
                str += "; Priority=Medium";
                break;
            case "high":
                str += "; Priority=High";
                break;
            default:
                throw new TypeError("option priority is invalid");
        }
    }
    if (opt.sameSite) {
        var sameSite = typeof opt.sameSite === "string" ? opt.sameSite.toLowerCase() : opt.sameSite;
        switch(sameSite){
            case true:
                str += "; SameSite=Strict";
                break;
            case "lax":
                str += "; SameSite=Lax";
                break;
            case "strict":
                str += "; SameSite=Strict";
                break;
            case "none":
                str += "; SameSite=None";
                break;
            default:
                throw new TypeError("option sameSite is invalid");
        }
    }
    return str;
}
/**
 * URL-decode string value. Optimized to skip native call when no %.
 *
 * @param {string} str
 * @returns {string}
 */ function decode(str) {
    return str.indexOf("%") !== -1 ? decodeURIComponent(str) : str;
}
/**
 * URL-encode value.
 *
 * @param {string} str
 * @returns {string}
 */ function encode(val) {
    return encodeURIComponent(val);
}
/**
 * Determine if value is a Date.
 *
 * @param {*} val
 * @private
 */ function isDate(val) {
    return __toString.call(val) === "[object Date]" || val instanceof Date;
}
/**
 * Try decoding a string using a decoding function.
 *
 * @param {string} str
 * @param {function} decode
 * @private
 */ function tryDecode(str, decode) {
    try {
        return decode(str);
    } catch (e) {
        return str;
    }
}


/***/ }),

/***/ 31104:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* eslint-env browser */ /**
 * This is the web browser implementation of `debug()`.
 */ 
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = localstorage();
exports.destroy = (()=>{
    let warned = false;
    return ()=>{
        if (!warned) {
            warned = true;
            console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
    };
})();
/**
 * Colors.
 */ exports.colors = [
    "#0000CC",
    "#0000FF",
    "#0033CC",
    "#0033FF",
    "#0066CC",
    "#0066FF",
    "#0099CC",
    "#0099FF",
    "#00CC00",
    "#00CC33",
    "#00CC66",
    "#00CC99",
    "#00CCCC",
    "#00CCFF",
    "#3300CC",
    "#3300FF",
    "#3333CC",
    "#3333FF",
    "#3366CC",
    "#3366FF",
    "#3399CC",
    "#3399FF",
    "#33CC00",
    "#33CC33",
    "#33CC66",
    "#33CC99",
    "#33CCCC",
    "#33CCFF",
    "#6600CC",
    "#6600FF",
    "#6633CC",
    "#6633FF",
    "#66CC00",
    "#66CC33",
    "#9900CC",
    "#9900FF",
    "#9933CC",
    "#9933FF",
    "#99CC00",
    "#99CC33",
    "#CC0000",
    "#CC0033",
    "#CC0066",
    "#CC0099",
    "#CC00CC",
    "#CC00FF",
    "#CC3300",
    "#CC3333",
    "#CC3366",
    "#CC3399",
    "#CC33CC",
    "#CC33FF",
    "#CC6600",
    "#CC6633",
    "#CC9900",
    "#CC9933",
    "#CCCC00",
    "#CCCC33",
    "#FF0000",
    "#FF0033",
    "#FF0066",
    "#FF0099",
    "#FF00CC",
    "#FF00FF",
    "#FF3300",
    "#FF3333",
    "#FF3366",
    "#FF3399",
    "#FF33CC",
    "#FF33FF",
    "#FF6600",
    "#FF6633",
    "#FF9900",
    "#FF9933",
    "#FFCC00",
    "#FFCC33"
];
/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */ // eslint-disable-next-line complexity
function useColors() {
    // NB: In an Electron preload script, document will be defined but not fully
    // initialized. Since we know we're in Chrome, we'll just detect this case
    // explicitly
    if (false) {}
    // Internet Explorer and Edge do not support colors.
    if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
    }
    // Is webkit? http://stackoverflow.com/a/16459606/376773
    // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
    return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
     false && (0) || // Is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
    typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
}
/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */ function formatArgs(args) {
    args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
    if (!this.useColors) {
        return;
    }
    const c = "color: " + this.color;
    args.splice(1, 0, c, "color: inherit");
    // The final "%c" is somewhat tricky, because there could be other
    // arguments passed either before or after the %c, so we need to
    // figure out the correct index to insert the CSS into
    let index = 0;
    let lastC = 0;
    args[0].replace(/%[a-zA-Z%]/g, (match)=>{
        if (match === "%%") {
            return;
        }
        index++;
        if (match === "%c") {
            // We only are interested in the *last* %c
            // (the user may have provided their own)
            lastC = index;
        }
    });
    args.splice(lastC, 0, c);
}
/**
 * Invokes `console.debug()` when available.
 * No-op when `console.debug` is not a "function".
 * If `console.debug` is not available, falls back
 * to `console.log`.
 *
 * @api public
 */ exports.log = console.debug || console.log || (()=>{});
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */ function save(namespaces) {
    try {
        if (namespaces) {
            exports.storage.setItem("debug", namespaces);
        } else {
            exports.storage.removeItem("debug");
        }
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */ function load() {
    let r;
    try {
        r = exports.storage.getItem("debug");
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
    // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
    if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
    }
    return r;
}
/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */ function localstorage() {
    try {
        // TVMLKit (Apple TV JS Runtime) does not have a window object, just localStorage in the global context
        // The Browser also has localStorage in the global context.
        return localStorage;
    } catch (error) {
    // Swallow
    // XXX (@Qix-) should we be logging these?
    }
}
module.exports = __webpack_require__(60726)(exports);
const { formatters } = module.exports;
/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */ formatters.j = function(v) {
    try {
        return JSON.stringify(v);
    } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
    }
};


/***/ }),

/***/ 60726:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 */ 
function setup(env) {
    createDebug.debug = createDebug;
    createDebug.default = createDebug;
    createDebug.coerce = coerce;
    createDebug.disable = disable;
    createDebug.enable = enable;
    createDebug.enabled = enabled;
    createDebug.humanize = __webpack_require__(81769);
    createDebug.destroy = destroy;
    Object.keys(env).forEach((key)=>{
        createDebug[key] = env[key];
    });
    /**
	* The currently active debug mode names, and names to skip.
	*/ createDebug.names = [];
    createDebug.skips = [];
    /**
	* Map of special "%n" handling functions, for the debug "format" argument.
	*
	* Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
	*/ createDebug.formatters = {};
    /**
	* Selects a color for a debug namespace
	* @param {String} namespace The namespace string for the debug instance to be colored
	* @return {Number|String} An ANSI color code for the given namespace
	* @api private
	*/ function selectColor(namespace) {
        let hash = 0;
        for(let i = 0; i < namespace.length; i++){
            hash = (hash << 5) - hash + namespace.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
    }
    createDebug.selectColor = selectColor;
    /**
	* Create a debugger with the given `namespace`.
	*
	* @param {String} namespace
	* @return {Function}
	* @api public
	*/ function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug(...args) {
            // Disabled?
            if (!debug.enabled) {
                return;
            }
            const self = debug;
            // Set `diff` timestamp
            const curr = Number(new Date());
            const ms = curr - (prevTime || curr);
            self.diff = ms;
            self.prev = prevTime;
            self.curr = curr;
            prevTime = curr;
            args[0] = createDebug.coerce(args[0]);
            if (typeof args[0] !== "string") {
                // Anything else let's inspect with %O
                args.unshift("%O");
            }
            // Apply any `formatters` transformations
            let index = 0;
            args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format)=>{
                // If we encounter an escaped % then don't increase the array index
                if (match === "%%") {
                    return "%";
                }
                index++;
                const formatter = createDebug.formatters[format];
                if (typeof formatter === "function") {
                    const val = args[index];
                    match = formatter.call(self, val);
                    // Now we need to remove `args[index]` since it's inlined in the `format`
                    args.splice(index, 1);
                    index--;
                }
                return match;
            });
            // Apply env-specific formatting (colors, etc.)
            createDebug.formatArgs.call(self, args);
            const logFn = self.log || createDebug.log;
            logFn.apply(self, args);
        }
        debug.namespace = namespace;
        debug.useColors = createDebug.useColors();
        debug.color = createDebug.selectColor(namespace);
        debug.extend = extend;
        debug.destroy = createDebug.destroy; // XXX Temporary. Will be removed in the next major release.
        Object.defineProperty(debug, "enabled", {
            enumerable: true,
            configurable: false,
            get: ()=>{
                if (enableOverride !== null) {
                    return enableOverride;
                }
                if (namespacesCache !== createDebug.namespaces) {
                    namespacesCache = createDebug.namespaces;
                    enabledCache = createDebug.enabled(namespace);
                }
                return enabledCache;
            },
            set: (v)=>{
                enableOverride = v;
            }
        });
        // Env-specific initialization logic for debug instances
        if (typeof createDebug.init === "function") {
            createDebug.init(debug);
        }
        return debug;
    }
    function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
    }
    /**
	* Enables a debug mode by namespaces. This can include modes
	* separated by a colon and wildcards.
	*
	* @param {String} namespaces
	* @api public
	*/ function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        let i;
        const split = (typeof namespaces === "string" ? namespaces : "").split(/[\s,]+/);
        const len = split.length;
        for(i = 0; i < len; i++){
            if (!split[i]) {
                continue;
            }
            namespaces = split[i].replace(/\*/g, ".*?");
            if (namespaces[0] === "-") {
                createDebug.skips.push(new RegExp("^" + namespaces.slice(1) + "$"));
            } else {
                createDebug.names.push(new RegExp("^" + namespaces + "$"));
            }
        }
    }
    /**
	* Disable debug output.
	*
	* @return {String} namespaces
	* @api public
	*/ function disable() {
        const namespaces = [
            ...createDebug.names.map(toNamespace),
            ...createDebug.skips.map(toNamespace).map((namespace)=>"-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
    }
    /**
	* Returns true if the given mode name is enabled, false otherwise.
	*
	* @param {String} name
	* @return {Boolean}
	* @api public
	*/ function enabled(name) {
        if (name[name.length - 1] === "*") {
            return true;
        }
        let i;
        let len;
        for(i = 0, len = createDebug.skips.length; i < len; i++){
            if (createDebug.skips[i].test(name)) {
                return false;
            }
        }
        for(i = 0, len = createDebug.names.length; i < len; i++){
            if (createDebug.names[i].test(name)) {
                return true;
            }
        }
        return false;
    }
    /**
	* Convert regexp to namespace
	*
	* @param {RegExp} regxep
	* @return {String} namespace
	* @api private
	*/ function toNamespace(regexp) {
        return regexp.toString().substring(2, regexp.toString().length - 2).replace(/\.\*\?$/, "*");
    }
    /**
	* Coerce `val`.
	*
	* @param {Mixed} val
	* @return {Mixed}
	* @api private
	*/ function coerce(val) {
        if (val instanceof Error) {
            return val.stack || val.message;
        }
        return val;
    }
    /**
	* XXX DO NOT USE. This is a temporary stub function.
	* XXX It WILL be removed in the next major release.
	*/ function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    createDebug.enable(createDebug.load());
    return createDebug;
}
module.exports = setup;


/***/ }),

/***/ 6060:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * Detect Electron renderer / nwjs process, which is node, but we should
 * treat as a browser.
 */ 
if (typeof process === "undefined" || process.type === "renderer" || false === true || process.__nwjs) {
    module.exports = __webpack_require__(31104);
} else {
    module.exports = __webpack_require__(93859);
}


/***/ }),

/***/ 93859:
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/**
 * Module dependencies.
 */ 
const tty = __webpack_require__(76224);
const util = __webpack_require__(73837);
/**
 * This is the Node.js implementation of `debug()`.
 */ exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.destroy = util.deprecate(()=>{}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
/**
 * Colors.
 */ exports.colors = [
    6,
    2,
    3,
    4,
    5,
    1
];
try {
    // Optional dependency (as in, doesn't need to be installed, NOT like optionalDependencies in package.json)
    // eslint-disable-next-line import/no-extraneous-dependencies
    const supportsColor = __webpack_require__(31367);
    if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports.colors = [
            20,
            21,
            26,
            27,
            32,
            33,
            38,
            39,
            40,
            41,
            42,
            43,
            44,
            45,
            56,
            57,
            62,
            63,
            68,
            69,
            74,
            75,
            76,
            77,
            78,
            79,
            80,
            81,
            92,
            93,
            98,
            99,
            112,
            113,
            128,
            129,
            134,
            135,
            148,
            149,
            160,
            161,
            162,
            163,
            164,
            165,
            166,
            167,
            168,
            169,
            170,
            171,
            172,
            173,
            178,
            179,
            184,
            185,
            196,
            197,
            198,
            199,
            200,
            201,
            202,
            203,
            204,
            205,
            206,
            207,
            208,
            209,
            214,
            215,
            220,
            221
        ];
    }
} catch (error) {
// Swallow - we only care if `supports-color` is available; it doesn't have to be.
}
/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */ exports.inspectOpts = Object.keys(process.env).filter((key)=>{
    return /^debug_/i.test(key);
}).reduce((obj, key)=>{
    // Camel-case
    const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k)=>{
        return k.toUpperCase();
    });
    // Coerce string value into JS value
    let val = process.env[key];
    if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
    } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
    } else if (val === "null") {
        val = null;
    } else {
        val = Number(val);
    }
    obj[prop] = val;
    return obj;
}, {});
/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */ function useColors() {
    return "colors" in exports.inspectOpts ? Boolean(exports.inspectOpts.colors) : tty.isatty(process.stderr.fd);
}
/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */ function formatArgs(args) {
    const { namespace: name, useColors } = this;
    if (useColors) {
        const c = this.color;
        const colorCode = "\x1b[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \u001B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module.exports.humanize(this.diff) + "\x1b[0m");
    } else {
        args[0] = getDate() + name + " " + args[0];
    }
}
function getDate() {
    if (exports.inspectOpts.hideDate) {
        return "";
    }
    return new Date().toISOString() + " ";
}
/**
 * Invokes `util.format()` with the specified arguments and writes to stderr.
 */ function log(...args) {
    return process.stderr.write(util.format(...args) + "\n");
}
/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */ function save(namespaces) {
    if (namespaces) {
        process.env.DEBUG = namespaces;
    } else {
        // If you set a process.env field to null or undefined, it gets cast to the
        // string 'null' or 'undefined'. Just delete instead.
        delete process.env.DEBUG;
    }
}
/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */ function load() {
    return process.env.DEBUG;
}
/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */ function init(debug) {
    debug.inspectOpts = {};
    const keys = Object.keys(exports.inspectOpts);
    for(let i = 0; i < keys.length; i++){
        debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
    }
}
module.exports = __webpack_require__(60726)(exports);
const { formatters } = module.exports;
/**
 * Map %o to `util.inspect()`, all on a single line.
 */ formatters.o = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts).split("\n").map((str)=>str.trim()).join(" ");
};
/**
 * Map %O to `util.inspect()`, allowing multiple lines if needed.
 */ formatters.O = function(v) {
    this.inspectOpts.colors = this.useColors;
    return util.inspect(v, this.inspectOpts);
};


/***/ }),

/***/ 75810:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var Stream = (__webpack_require__(12781).Stream);
var util = __webpack_require__(73837);
module.exports = DelayedStream;
function DelayedStream() {
    this.source = null;
    this.dataSize = 0;
    this.maxDataSize = 1024 * 1024;
    this.pauseStream = true;
    this._maxDataSizeExceeded = false;
    this._released = false;
    this._bufferedEvents = [];
}
util.inherits(DelayedStream, Stream);
DelayedStream.create = function(source, options) {
    var delayedStream = new this();
    options = options || {};
    for(var option in options){
        delayedStream[option] = options[option];
    }
    delayedStream.source = source;
    var realEmit = source.emit;
    source.emit = function() {
        delayedStream._handleEmit(arguments);
        return realEmit.apply(source, arguments);
    };
    source.on("error", function() {});
    if (delayedStream.pauseStream) {
        source.pause();
    }
    return delayedStream;
};
Object.defineProperty(DelayedStream.prototype, "readable", {
    configurable: true,
    enumerable: true,
    get: function() {
        return this.source.readable;
    }
});
DelayedStream.prototype.setEncoding = function() {
    return this.source.setEncoding.apply(this.source, arguments);
};
DelayedStream.prototype.resume = function() {
    if (!this._released) {
        this.release();
    }
    this.source.resume();
};
DelayedStream.prototype.pause = function() {
    this.source.pause();
};
DelayedStream.prototype.release = function() {
    this._released = true;
    this._bufferedEvents.forEach((function(args) {
        this.emit.apply(this, args);
    }).bind(this));
    this._bufferedEvents = [];
};
DelayedStream.prototype.pipe = function() {
    var r = Stream.prototype.pipe.apply(this, arguments);
    this.resume();
    return r;
};
DelayedStream.prototype._handleEmit = function(args) {
    if (this._released) {
        this.emit.apply(this, args);
        return;
    }
    if (args[0] === "data") {
        this.dataSize += args[1].length;
        this._checkIfMaxDataSizeExceeded();
    }
    this._bufferedEvents.push(args);
};
DelayedStream.prototype._checkIfMaxDataSizeExceeded = function() {
    if (this._maxDataSizeExceeded) {
        return;
    }
    if (this.dataSize <= this.maxDataSize) {
        return;
    }
    this._maxDataSizeExceeded = true;
    var message = "DelayedStream#maxDataSize of " + this.maxDataSize + " bytes exceeded.";
    this.emit("error", new Error(message));
};


/***/ }),

/***/ 88684:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var debug;
module.exports = function() {
    if (!debug) {
        try {
            /* eslint global-require: off */ debug = __webpack_require__(6060)("follow-redirects");
        } catch (error) {}
        if (typeof debug !== "function") {
            debug = function() {};
        }
    }
    debug.apply(null, arguments);
};


/***/ }),

/***/ 89698:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var url = __webpack_require__(57310);
var URL = url.URL;
var http = __webpack_require__(13685);
var https = __webpack_require__(95687);
var Writable = (__webpack_require__(12781).Writable);
var assert = __webpack_require__(39491);
var debug = __webpack_require__(88684);
// Create handlers that pass events from native requests
var events = [
    "abort",
    "aborted",
    "connect",
    "error",
    "socket",
    "timeout"
];
var eventHandlers = Object.create(null);
events.forEach(function(event) {
    eventHandlers[event] = function(arg1, arg2, arg3) {
        this._redirectable.emit(event, arg1, arg2, arg3);
    };
});
var InvalidUrlError = createErrorType("ERR_INVALID_URL", "Invalid URL", TypeError);
// Error types with codes
var RedirectionError = createErrorType("ERR_FR_REDIRECTION_FAILURE", "Redirected request failed");
var TooManyRedirectsError = createErrorType("ERR_FR_TOO_MANY_REDIRECTS", "Maximum number of redirects exceeded");
var MaxBodyLengthExceededError = createErrorType("ERR_FR_MAX_BODY_LENGTH_EXCEEDED", "Request body larger than maxBodyLength limit");
var WriteAfterEndError = createErrorType("ERR_STREAM_WRITE_AFTER_END", "write after end");
// istanbul ignore next
var destroy = Writable.prototype.destroy || noop;
// An HTTP(S) request that can be redirected
function RedirectableRequest(options, responseCallback) {
    // Initialize the request
    Writable.call(this);
    this._sanitizeOptions(options);
    this._options = options;
    this._ended = false;
    this._ending = false;
    this._redirectCount = 0;
    this._redirects = [];
    this._requestBodyLength = 0;
    this._requestBodyBuffers = [];
    // Attach a callback if passed
    if (responseCallback) {
        this.on("response", responseCallback);
    }
    // React to responses of native requests
    var self = this;
    this._onNativeResponse = function(response) {
        self._processResponse(response);
    };
    // Perform the first request
    this._performRequest();
}
RedirectableRequest.prototype = Object.create(Writable.prototype);
RedirectableRequest.prototype.abort = function() {
    destroyRequest(this._currentRequest);
    this._currentRequest.abort();
    this.emit("abort");
};
RedirectableRequest.prototype.destroy = function(error) {
    destroyRequest(this._currentRequest, error);
    destroy.call(this, error);
    return this;
};
// Writes buffered data to the current native request
RedirectableRequest.prototype.write = function(data, encoding, callback) {
    // Writing is not allowed if end has been called
    if (this._ending) {
        throw new WriteAfterEndError();
    }
    // Validate input and shift parameters if necessary
    if (!isString(data) && !isBuffer(data)) {
        throw new TypeError("data should be a string, Buffer or Uint8Array");
    }
    if (isFunction(encoding)) {
        callback = encoding;
        encoding = null;
    }
    // Ignore empty buffers, since writing them doesn't invoke the callback
    // https://github.com/nodejs/node/issues/22066
    if (data.length === 0) {
        if (callback) {
            callback();
        }
        return;
    }
    // Only write when we don't exceed the maximum body length
    if (this._requestBodyLength + data.length <= this._options.maxBodyLength) {
        this._requestBodyLength += data.length;
        this._requestBodyBuffers.push({
            data: data,
            encoding: encoding
        });
        this._currentRequest.write(data, encoding, callback);
    } else {
        this.emit("error", new MaxBodyLengthExceededError());
        this.abort();
    }
};
// Ends the current native request
RedirectableRequest.prototype.end = function(data, encoding, callback) {
    // Shift parameters if necessary
    if (isFunction(data)) {
        callback = data;
        data = encoding = null;
    } else if (isFunction(encoding)) {
        callback = encoding;
        encoding = null;
    }
    // Write data if needed and end
    if (!data) {
        this._ended = this._ending = true;
        this._currentRequest.end(null, null, callback);
    } else {
        var self = this;
        var currentRequest = this._currentRequest;
        this.write(data, encoding, function() {
            self._ended = true;
            currentRequest.end(null, null, callback);
        });
        this._ending = true;
    }
};
// Sets a header value on the current native request
RedirectableRequest.prototype.setHeader = function(name, value) {
    this._options.headers[name] = value;
    this._currentRequest.setHeader(name, value);
};
// Clears a header value on the current native request
RedirectableRequest.prototype.removeHeader = function(name) {
    delete this._options.headers[name];
    this._currentRequest.removeHeader(name);
};
// Global timeout for all underlying requests
RedirectableRequest.prototype.setTimeout = function(msecs, callback) {
    var self = this;
    // Destroys the socket on timeout
    function destroyOnTimeout(socket) {
        socket.setTimeout(msecs);
        socket.removeListener("timeout", socket.destroy);
        socket.addListener("timeout", socket.destroy);
    }
    // Sets up a timer to trigger a timeout event
    function startTimer(socket) {
        if (self._timeout) {
            clearTimeout(self._timeout);
        }
        self._timeout = setTimeout(function() {
            self.emit("timeout");
            clearTimer();
        }, msecs);
        destroyOnTimeout(socket);
    }
    // Stops a timeout from triggering
    function clearTimer() {
        // Clear the timeout
        if (self._timeout) {
            clearTimeout(self._timeout);
            self._timeout = null;
        }
        // Clean up all attached listeners
        self.removeListener("abort", clearTimer);
        self.removeListener("error", clearTimer);
        self.removeListener("response", clearTimer);
        self.removeListener("close", clearTimer);
        if (callback) {
            self.removeListener("timeout", callback);
        }
        if (!self.socket) {
            self._currentRequest.removeListener("socket", startTimer);
        }
    }
    // Attach callback if passed
    if (callback) {
        this.on("timeout", callback);
    }
    // Start the timer if or when the socket is opened
    if (this.socket) {
        startTimer(this.socket);
    } else {
        this._currentRequest.once("socket", startTimer);
    }
    // Clean up on events
    this.on("socket", destroyOnTimeout);
    this.on("abort", clearTimer);
    this.on("error", clearTimer);
    this.on("response", clearTimer);
    this.on("close", clearTimer);
    return this;
};
// Proxy all other public ClientRequest methods
[
    "flushHeaders",
    "getHeader",
    "setNoDelay",
    "setSocketKeepAlive"
].forEach(function(method) {
    RedirectableRequest.prototype[method] = function(a, b) {
        return this._currentRequest[method](a, b);
    };
});
// Proxy all public ClientRequest properties
[
    "aborted",
    "connection",
    "socket"
].forEach(function(property) {
    Object.defineProperty(RedirectableRequest.prototype, property, {
        get: function() {
            return this._currentRequest[property];
        }
    });
});
RedirectableRequest.prototype._sanitizeOptions = function(options) {
    // Ensure headers are always present
    if (!options.headers) {
        options.headers = {};
    }
    // Since http.request treats host as an alias of hostname,
    // but the url module interprets host as hostname plus port,
    // eliminate the host property to avoid confusion.
    if (options.host) {
        // Use hostname if set, because it has precedence
        if (!options.hostname) {
            options.hostname = options.host;
        }
        delete options.host;
    }
    // Complete the URL object when necessary
    if (!options.pathname && options.path) {
        var searchPos = options.path.indexOf("?");
        if (searchPos < 0) {
            options.pathname = options.path;
        } else {
            options.pathname = options.path.substring(0, searchPos);
            options.search = options.path.substring(searchPos);
        }
    }
};
// Executes the next native request (initial or redirect)
RedirectableRequest.prototype._performRequest = function() {
    // Load the native protocol
    var protocol = this._options.protocol;
    var nativeProtocol = this._options.nativeProtocols[protocol];
    if (!nativeProtocol) {
        this.emit("error", new TypeError("Unsupported protocol " + protocol));
        return;
    }
    // If specified, use the agent corresponding to the protocol
    // (HTTP and HTTPS use different types of agents)
    if (this._options.agents) {
        var scheme = protocol.slice(0, -1);
        this._options.agent = this._options.agents[scheme];
    }
    // Create the native request and set up its event handlers
    var request = this._currentRequest = nativeProtocol.request(this._options, this._onNativeResponse);
    request._redirectable = this;
    for (var event of events){
        request.on(event, eventHandlers[event]);
    }
    // RFC7230§5.3.1: When making a request directly to an origin server, […]
    // a client MUST send only the absolute path […] as the request-target.
    this._currentUrl = /^\//.test(this._options.path) ? url.format(this._options) : // When making a request to a proxy, […]
    // a client MUST send the target URI in absolute-form […].
    this._options.path;
    // End a redirected request
    // (The first request must be ended explicitly with RedirectableRequest#end)
    if (this._isRedirect) {
        // Write the request entity and end
        var i = 0;
        var self = this;
        var buffers = this._requestBodyBuffers;
        (function writeNext(error) {
            // Only write if this request has not been redirected yet
            /* istanbul ignore else */ if (request === self._currentRequest) {
                // Report any write errors
                /* istanbul ignore if */ if (error) {
                    self.emit("error", error);
                } else if (i < buffers.length) {
                    var buffer = buffers[i++];
                    /* istanbul ignore else */ if (!request.finished) {
                        request.write(buffer.data, buffer.encoding, writeNext);
                    }
                } else if (self._ended) {
                    request.end();
                }
            }
        })();
    }
};
// Processes a response from the current native request
RedirectableRequest.prototype._processResponse = function(response) {
    // Store the redirected response
    var statusCode = response.statusCode;
    if (this._options.trackRedirects) {
        this._redirects.push({
            url: this._currentUrl,
            headers: response.headers,
            statusCode: statusCode
        });
    }
    // RFC7231§6.4: The 3xx (Redirection) class of status code indicates
    // that further action needs to be taken by the user agent in order to
    // fulfill the request. If a Location header field is provided,
    // the user agent MAY automatically redirect its request to the URI
    // referenced by the Location field value,
    // even if the specific status code is not understood.
    // If the response is not a redirect; return it as-is
    var location = response.headers.location;
    if (!location || this._options.followRedirects === false || statusCode < 300 || statusCode >= 400) {
        response.responseUrl = this._currentUrl;
        response.redirects = this._redirects;
        this.emit("response", response);
        // Clean up
        this._requestBodyBuffers = [];
        return;
    }
    // The response is a redirect, so abort the current request
    destroyRequest(this._currentRequest);
    // Discard the remainder of the response to avoid waiting for data
    response.destroy();
    // RFC7231§6.4: A client SHOULD detect and intervene
    // in cyclical redirections (i.e., "infinite" redirection loops).
    if (++this._redirectCount > this._options.maxRedirects) {
        this.emit("error", new TooManyRedirectsError());
        return;
    }
    // Store the request headers if applicable
    var requestHeaders;
    var beforeRedirect = this._options.beforeRedirect;
    if (beforeRedirect) {
        requestHeaders = Object.assign({
            // The Host header was set by nativeProtocol.request
            Host: response.req.getHeader("host")
        }, this._options.headers);
    }
    // RFC7231§6.4: Automatic redirection needs to done with
    // care for methods not known to be safe, […]
    // RFC7231§6.4.2–3: For historical reasons, a user agent MAY change
    // the request method from POST to GET for the subsequent request.
    var method = this._options.method;
    if ((statusCode === 301 || statusCode === 302) && this._options.method === "POST" || // RFC7231§6.4.4: The 303 (See Other) status code indicates that
    // the server is redirecting the user agent to a different resource […]
    // A user agent can perform a retrieval request targeting that URI
    // (a GET or HEAD request if using HTTP) […]
    statusCode === 303 && !/^(?:GET|HEAD)$/.test(this._options.method)) {
        this._options.method = "GET";
        // Drop a possible entity and headers related to it
        this._requestBodyBuffers = [];
        removeMatchingHeaders(/^content-/i, this._options.headers);
    }
    // Drop the Host header, as the redirect might lead to a different host
    var currentHostHeader = removeMatchingHeaders(/^host$/i, this._options.headers);
    // If the redirect is relative, carry over the host of the last request
    var currentUrlParts = url.parse(this._currentUrl);
    var currentHost = currentHostHeader || currentUrlParts.host;
    var currentUrl = /^\w+:/.test(location) ? this._currentUrl : url.format(Object.assign(currentUrlParts, {
        host: currentHost
    }));
    // Determine the URL of the redirection
    var redirectUrl;
    try {
        redirectUrl = url.resolve(currentUrl, location);
    } catch (cause) {
        this.emit("error", new RedirectionError({
            cause: cause
        }));
        return;
    }
    // Create the redirected request
    debug("redirecting to", redirectUrl);
    this._isRedirect = true;
    var redirectUrlParts = url.parse(redirectUrl);
    Object.assign(this._options, redirectUrlParts);
    // Drop confidential headers when redirecting to a less secure protocol
    // or to a different domain that is not a superdomain
    if (redirectUrlParts.protocol !== currentUrlParts.protocol && redirectUrlParts.protocol !== "https:" || redirectUrlParts.host !== currentHost && !isSubdomain(redirectUrlParts.host, currentHost)) {
        removeMatchingHeaders(/^(?:authorization|cookie)$/i, this._options.headers);
    }
    // Evaluate the beforeRedirect callback
    if (isFunction(beforeRedirect)) {
        var responseDetails = {
            headers: response.headers,
            statusCode: statusCode
        };
        var requestDetails = {
            url: currentUrl,
            method: method,
            headers: requestHeaders
        };
        try {
            beforeRedirect(this._options, responseDetails, requestDetails);
        } catch (err) {
            this.emit("error", err);
            return;
        }
        this._sanitizeOptions(this._options);
    }
    // Perform the redirected request
    try {
        this._performRequest();
    } catch (cause) {
        this.emit("error", new RedirectionError({
            cause: cause
        }));
    }
};
// Wraps the key/value object of protocols with redirect functionality
function wrap(protocols) {
    // Default settings
    var exports = {
        maxRedirects: 21,
        maxBodyLength: 10 * 1024 * 1024
    };
    // Wrap each protocol
    var nativeProtocols = {};
    Object.keys(protocols).forEach(function(scheme) {
        var protocol = scheme + ":";
        var nativeProtocol = nativeProtocols[protocol] = protocols[scheme];
        var wrappedProtocol = exports[scheme] = Object.create(nativeProtocol);
        // Executes a request, following redirects
        function request(input, options, callback) {
            // Parse parameters
            if (isString(input)) {
                var parsed;
                try {
                    parsed = urlToOptions(new URL(input));
                } catch (err) {
                    /* istanbul ignore next */ parsed = url.parse(input);
                }
                if (!isString(parsed.protocol)) {
                    throw new InvalidUrlError({
                        input
                    });
                }
                input = parsed;
            } else if (URL && input instanceof URL) {
                input = urlToOptions(input);
            } else {
                callback = options;
                options = input;
                input = {
                    protocol: protocol
                };
            }
            if (isFunction(options)) {
                callback = options;
                options = null;
            }
            // Set defaults
            options = Object.assign({
                maxRedirects: exports.maxRedirects,
                maxBodyLength: exports.maxBodyLength
            }, input, options);
            options.nativeProtocols = nativeProtocols;
            if (!isString(options.host) && !isString(options.hostname)) {
                options.hostname = "::1";
            }
            assert.equal(options.protocol, protocol, "protocol mismatch");
            debug("options", options);
            return new RedirectableRequest(options, callback);
        }
        // Executes a GET request, following redirects
        function get(input, options, callback) {
            var wrappedRequest = wrappedProtocol.request(input, options, callback);
            wrappedRequest.end();
            return wrappedRequest;
        }
        // Expose the properties on the wrapped protocol
        Object.defineProperties(wrappedProtocol, {
            request: {
                value: request,
                configurable: true,
                enumerable: true,
                writable: true
            },
            get: {
                value: get,
                configurable: true,
                enumerable: true,
                writable: true
            }
        });
    });
    return exports;
}
/* istanbul ignore next */ function noop() {}
// from https://github.com/nodejs/node/blob/master/lib/internal/url.js
function urlToOptions(urlObject) {
    var options = {
        protocol: urlObject.protocol,
        hostname: urlObject.hostname.startsWith("[") ? /* istanbul ignore next */ urlObject.hostname.slice(1, -1) : urlObject.hostname,
        hash: urlObject.hash,
        search: urlObject.search,
        pathname: urlObject.pathname,
        path: urlObject.pathname + urlObject.search,
        href: urlObject.href
    };
    if (urlObject.port !== "") {
        options.port = Number(urlObject.port);
    }
    return options;
}
function removeMatchingHeaders(regex, headers) {
    var lastValue;
    for(var header in headers){
        if (regex.test(header)) {
            lastValue = headers[header];
            delete headers[header];
        }
    }
    return lastValue === null || typeof lastValue === "undefined" ? undefined : String(lastValue).trim();
}
function createErrorType(code, message, baseClass) {
    // Create constructor
    function CustomError(properties) {
        Error.captureStackTrace(this, this.constructor);
        Object.assign(this, properties || {});
        this.code = code;
        this.message = this.cause ? message + ": " + this.cause.message : message;
    }
    // Attach constructor and set default properties
    CustomError.prototype = new (baseClass || Error)();
    CustomError.prototype.constructor = CustomError;
    CustomError.prototype.name = "Error [" + code + "]";
    return CustomError;
}
function destroyRequest(request, error) {
    for (var event of events){
        request.removeListener(event, eventHandlers[event]);
    }
    request.on("error", noop);
    request.destroy(error);
}
function isSubdomain(subdomain, domain) {
    assert(isString(subdomain) && isString(domain));
    var dot = subdomain.length - domain.length - 1;
    return dot > 0 && subdomain[dot] === "." && subdomain.endsWith(domain);
}
function isString(value) {
    return typeof value === "string" || value instanceof String;
}
function isFunction(value) {
    return typeof value === "function";
}
function isBuffer(value) {
    return typeof value === "object" && "length" in value;
}
// Exports
module.exports = wrap({
    http: http,
    https: https
});
module.exports.wrap = wrap;


/***/ }),

/***/ 28532:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var CombinedStream = __webpack_require__(66086);
var util = __webpack_require__(73837);
var path = __webpack_require__(71017);
var http = __webpack_require__(13685);
var https = __webpack_require__(95687);
var parseUrl = (__webpack_require__(57310).parse);
var fs = __webpack_require__(57147);
var Stream = (__webpack_require__(12781).Stream);
var mime = __webpack_require__(45453);
var asynckit = __webpack_require__(63852);
var populate = __webpack_require__(87135);
// Public API
module.exports = FormData;
// make it a Stream
util.inherits(FormData, CombinedStream);
/**
 * Create readable "multipart/form-data" streams.
 * Can be used to submit forms
 * and file uploads to other web applications.
 *
 * @constructor
 * @param {Object} options - Properties to be added/overriden for FormData and CombinedStream
 */ function FormData(options) {
    if (!(this instanceof FormData)) {
        return new FormData(options);
    }
    this._overheadLength = 0;
    this._valueLength = 0;
    this._valuesToMeasure = [];
    CombinedStream.call(this);
    options = options || {};
    for(var option in options){
        this[option] = options[option];
    }
}
FormData.LINE_BREAK = "\r\n";
FormData.DEFAULT_CONTENT_TYPE = "application/octet-stream";
FormData.prototype.append = function(field, value, options) {
    options = options || {};
    // allow filename as single option
    if (typeof options == "string") {
        options = {
            filename: options
        };
    }
    var append = CombinedStream.prototype.append.bind(this);
    // all that streamy business can't handle numbers
    if (typeof value == "number") {
        value = "" + value;
    }
    // https://github.com/felixge/node-form-data/issues/38
    if (util.isArray(value)) {
        // Please convert your array into string
        // the way web server expects it
        this._error(new Error("Arrays are not supported."));
        return;
    }
    var header = this._multiPartHeader(field, value, options);
    var footer = this._multiPartFooter();
    append(header);
    append(value);
    append(footer);
    // pass along options.knownLength
    this._trackLength(header, value, options);
};
FormData.prototype._trackLength = function(header, value, options) {
    var valueLength = 0;
    // used w/ getLengthSync(), when length is known.
    // e.g. for streaming directly from a remote server,
    // w/ a known file a size, and not wanting to wait for
    // incoming file to finish to get its size.
    if (options.knownLength != null) {
        valueLength += +options.knownLength;
    } else if (Buffer.isBuffer(value)) {
        valueLength = value.length;
    } else if (typeof value === "string") {
        valueLength = Buffer.byteLength(value);
    }
    this._valueLength += valueLength;
    // @check why add CRLF? does this account for custom/multiple CRLFs?
    this._overheadLength += Buffer.byteLength(header) + FormData.LINE_BREAK.length;
    // empty or either doesn't have path or not an http response or not a stream
    if (!value || !value.path && !(value.readable && value.hasOwnProperty("httpVersion")) && !(value instanceof Stream)) {
        return;
    }
    // no need to bother with the length
    if (!options.knownLength) {
        this._valuesToMeasure.push(value);
    }
};
FormData.prototype._lengthRetriever = function(value, callback) {
    if (value.hasOwnProperty("fd")) {
        // take read range into a account
        // `end` = Infinity –> read file till the end
        //
        // TODO: Looks like there is bug in Node fs.createReadStream
        // it doesn't respect `end` options without `start` options
        // Fix it when node fixes it.
        // https://github.com/joyent/node/issues/7819
        if (value.end != undefined && value.end != Infinity && value.start != undefined) {
            // when end specified
            // no need to calculate range
            // inclusive, starts with 0
            callback(null, value.end + 1 - (value.start ? value.start : 0));
        // not that fast snoopy
        } else {
            // still need to fetch file size from fs
            fs.stat(value.path, function(err, stat) {
                var fileSize;
                if (err) {
                    callback(err);
                    return;
                }
                // update final size based on the range options
                fileSize = stat.size - (value.start ? value.start : 0);
                callback(null, fileSize);
            });
        }
    // or http response
    } else if (value.hasOwnProperty("httpVersion")) {
        callback(null, +value.headers["content-length"]);
    // or request stream http://github.com/mikeal/request
    } else if (value.hasOwnProperty("httpModule")) {
        // wait till response come back
        value.on("response", function(response) {
            value.pause();
            callback(null, +response.headers["content-length"]);
        });
        value.resume();
    // something else
    } else {
        callback("Unknown stream");
    }
};
FormData.prototype._multiPartHeader = function(field, value, options) {
    // custom header specified (as string)?
    // it becomes responsible for boundary
    // (e.g. to handle extra CRLFs on .NET servers)
    if (typeof options.header == "string") {
        return options.header;
    }
    var contentDisposition = this._getContentDisposition(value, options);
    var contentType = this._getContentType(value, options);
    var contents = "";
    var headers = {
        // add custom disposition as third element or keep it two elements if not
        "Content-Disposition": [
            "form-data",
            'name="' + field + '"'
        ].concat(contentDisposition || []),
        // if no content type. allow it to be empty array
        "Content-Type": [].concat(contentType || [])
    };
    // allow custom headers.
    if (typeof options.header == "object") {
        populate(headers, options.header);
    }
    var header;
    for(var prop in headers){
        if (!headers.hasOwnProperty(prop)) continue;
        header = headers[prop];
        // skip nullish headers.
        if (header == null) {
            continue;
        }
        // convert all headers to arrays.
        if (!Array.isArray(header)) {
            header = [
                header
            ];
        }
        // add non-empty headers.
        if (header.length) {
            contents += prop + ": " + header.join("; ") + FormData.LINE_BREAK;
        }
    }
    return "--" + this.getBoundary() + FormData.LINE_BREAK + contents + FormData.LINE_BREAK;
};
FormData.prototype._getContentDisposition = function(value, options) {
    var filename, contentDisposition;
    if (typeof options.filepath === "string") {
        // custom filepath for relative paths
        filename = path.normalize(options.filepath).replace(/\\/g, "/");
    } else if (options.filename || value.name || value.path) {
        // custom filename take precedence
        // formidable and the browser add a name property
        // fs- and request- streams have path property
        filename = path.basename(options.filename || value.name || value.path);
    } else if (value.readable && value.hasOwnProperty("httpVersion")) {
        // or try http response
        filename = path.basename(value.client._httpMessage.path || "");
    }
    if (filename) {
        contentDisposition = 'filename="' + filename + '"';
    }
    return contentDisposition;
};
FormData.prototype._getContentType = function(value, options) {
    // use custom content-type above all
    var contentType = options.contentType;
    // or try `name` from formidable, browser
    if (!contentType && value.name) {
        contentType = mime.lookup(value.name);
    }
    // or try `path` from fs-, request- streams
    if (!contentType && value.path) {
        contentType = mime.lookup(value.path);
    }
    // or if it's http-reponse
    if (!contentType && value.readable && value.hasOwnProperty("httpVersion")) {
        contentType = value.headers["content-type"];
    }
    // or guess it from the filepath or filename
    if (!contentType && (options.filepath || options.filename)) {
        contentType = mime.lookup(options.filepath || options.filename);
    }
    // fallback to the default content type if `value` is not simple value
    if (!contentType && typeof value == "object") {
        contentType = FormData.DEFAULT_CONTENT_TYPE;
    }
    return contentType;
};
FormData.prototype._multiPartFooter = function() {
    return (function(next) {
        var footer = FormData.LINE_BREAK;
        var lastPart = this._streams.length === 0;
        if (lastPart) {
            footer += this._lastBoundary();
        }
        next(footer);
    }).bind(this);
};
FormData.prototype._lastBoundary = function() {
    return "--" + this.getBoundary() + "--" + FormData.LINE_BREAK;
};
FormData.prototype.getHeaders = function(userHeaders) {
    var header;
    var formHeaders = {
        "content-type": "multipart/form-data; boundary=" + this.getBoundary()
    };
    for(header in userHeaders){
        if (userHeaders.hasOwnProperty(header)) {
            formHeaders[header.toLowerCase()] = userHeaders[header];
        }
    }
    return formHeaders;
};
FormData.prototype.setBoundary = function(boundary) {
    this._boundary = boundary;
};
FormData.prototype.getBoundary = function() {
    if (!this._boundary) {
        this._generateBoundary();
    }
    return this._boundary;
};
FormData.prototype.getBuffer = function() {
    var dataBuffer = new Buffer.alloc(0);
    var boundary = this.getBoundary();
    // Create the form content. Add Line breaks to the end of data.
    for(var i = 0, len = this._streams.length; i < len; i++){
        if (typeof this._streams[i] !== "function") {
            // Add content to the buffer.
            if (Buffer.isBuffer(this._streams[i])) {
                dataBuffer = Buffer.concat([
                    dataBuffer,
                    this._streams[i]
                ]);
            } else {
                dataBuffer = Buffer.concat([
                    dataBuffer,
                    Buffer.from(this._streams[i])
                ]);
            }
            // Add break after content.
            if (typeof this._streams[i] !== "string" || this._streams[i].substring(2, boundary.length + 2) !== boundary) {
                dataBuffer = Buffer.concat([
                    dataBuffer,
                    Buffer.from(FormData.LINE_BREAK)
                ]);
            }
        }
    }
    // Add the footer and return the Buffer object.
    return Buffer.concat([
        dataBuffer,
        Buffer.from(this._lastBoundary())
    ]);
};
FormData.prototype._generateBoundary = function() {
    // This generates a 50 character boundary similar to those used by Firefox.
    // They are optimized for boyer-moore parsing.
    var boundary = "--------------------------";
    for(var i = 0; i < 24; i++){
        boundary += Math.floor(Math.random() * 10).toString(16);
    }
    this._boundary = boundary;
};
// Note: getLengthSync DOESN'T calculate streams length
// As workaround one can calculate file size manually
// and add it as knownLength option
FormData.prototype.getLengthSync = function() {
    var knownLength = this._overheadLength + this._valueLength;
    // Don't get confused, there are 3 "internal" streams for each keyval pair
    // so it basically checks if there is any value added to the form
    if (this._streams.length) {
        knownLength += this._lastBoundary().length;
    }
    // https://github.com/form-data/form-data/issues/40
    if (!this.hasKnownLength()) {
        // Some async length retrievers are present
        // therefore synchronous length calculation is false.
        // Please use getLength(callback) to get proper length
        this._error(new Error("Cannot calculate proper length in synchronous way."));
    }
    return knownLength;
};
// Public API to check if length of added values is known
// https://github.com/form-data/form-data/issues/196
// https://github.com/form-data/form-data/issues/262
FormData.prototype.hasKnownLength = function() {
    var hasKnownLength = true;
    if (this._valuesToMeasure.length) {
        hasKnownLength = false;
    }
    return hasKnownLength;
};
FormData.prototype.getLength = function(cb) {
    var knownLength = this._overheadLength + this._valueLength;
    if (this._streams.length) {
        knownLength += this._lastBoundary().length;
    }
    if (!this._valuesToMeasure.length) {
        process.nextTick(cb.bind(this, null, knownLength));
        return;
    }
    asynckit.parallel(this._valuesToMeasure, this._lengthRetriever, function(err, values) {
        if (err) {
            cb(err);
            return;
        }
        values.forEach(function(length) {
            knownLength += length;
        });
        cb(null, knownLength);
    });
};
FormData.prototype.submit = function(params, cb) {
    var request, options, defaults = {
        method: "post"
    };
    // parse provided url if it's string
    // or treat it as options object
    if (typeof params == "string") {
        params = parseUrl(params);
        options = populate({
            port: params.port,
            path: params.pathname,
            host: params.hostname,
            protocol: params.protocol
        }, defaults);
    // use custom params
    } else {
        options = populate(params, defaults);
        // if no port provided use default one
        if (!options.port) {
            options.port = options.protocol == "https:" ? 443 : 80;
        }
    }
    // put that good code in getHeaders to some use
    options.headers = this.getHeaders(params.headers);
    // https if specified, fallback to http in any other case
    if (options.protocol == "https:") {
        request = https.request(options);
    } else {
        request = http.request(options);
    }
    // get content length and fire away
    this.getLength((function(err, length) {
        if (err && err !== "Unknown stream") {
            this._error(err);
            return;
        }
        // add content length
        if (length) {
            request.setHeader("Content-Length", length);
        }
        this.pipe(request);
        if (cb) {
            var onResponse;
            var callback = function(error, responce) {
                request.removeListener("error", callback);
                request.removeListener("response", onResponse);
                return cb.call(this, error, responce);
            };
            onResponse = callback.bind(this, null);
            request.on("error", callback);
            request.on("response", onResponse);
        }
    }).bind(this));
    return request;
};
FormData.prototype._error = function(err) {
    if (!this.error) {
        this.error = err;
        this.pause();
        this.emit("error", err);
    }
};
FormData.prototype.toString = function() {
    return "[object FormData]";
};


/***/ }),

/***/ 87135:
/***/ ((module) => {

"use strict";
// populates missing values

module.exports = function(dst, src) {
    Object.keys(src).forEach(function(prop) {
        dst[prop] = dst[prop] || src[prop];
    });
    return dst;
};


/***/ }),

/***/ 69561:
/***/ ((module) => {

"use strict";

module.exports = (flag, argv = process.argv)=>{
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
    const position = argv.indexOf(prefix + flag);
    const terminatorPosition = argv.indexOf("--");
    return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
};


/***/ }),

/***/ 23464:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.cryptoRuntime = exports.base64url = exports.generateSecret = exports.generateKeyPair = exports.errors = exports.decodeJwt = exports.decodeProtectedHeader = exports.importJWK = exports.importX509 = exports.importPKCS8 = exports.importSPKI = exports.exportJWK = exports.exportSPKI = exports.exportPKCS8 = exports.UnsecuredJWT = exports.createRemoteJWKSet = exports.createLocalJWKSet = exports.EmbeddedJWK = exports.calculateJwkThumbprintUri = exports.calculateJwkThumbprint = exports.EncryptJWT = exports.SignJWT = exports.GeneralSign = exports.FlattenedSign = exports.CompactSign = exports.FlattenedEncrypt = exports.CompactEncrypt = exports.jwtDecrypt = exports.jwtVerify = exports.generalVerify = exports.flattenedVerify = exports.compactVerify = exports.GeneralEncrypt = exports.generalDecrypt = exports.flattenedDecrypt = exports.compactDecrypt = void 0;
var decrypt_js_1 = __webpack_require__(16709);
Object.defineProperty(exports, "compactDecrypt", ({
    enumerable: true,
    get: function() {
        return decrypt_js_1.compactDecrypt;
    }
}));
var decrypt_js_2 = __webpack_require__(5065);
Object.defineProperty(exports, "flattenedDecrypt", ({
    enumerable: true,
    get: function() {
        return decrypt_js_2.flattenedDecrypt;
    }
}));
var decrypt_js_3 = __webpack_require__(11619);
Object.defineProperty(exports, "generalDecrypt", ({
    enumerable: true,
    get: function() {
        return decrypt_js_3.generalDecrypt;
    }
}));
var encrypt_js_1 = __webpack_require__(36540);
Object.defineProperty(exports, "GeneralEncrypt", ({
    enumerable: true,
    get: function() {
        return encrypt_js_1.GeneralEncrypt;
    }
}));
var verify_js_1 = __webpack_require__(72432);
Object.defineProperty(exports, "compactVerify", ({
    enumerable: true,
    get: function() {
        return verify_js_1.compactVerify;
    }
}));
var verify_js_2 = __webpack_require__(7549);
Object.defineProperty(exports, "flattenedVerify", ({
    enumerable: true,
    get: function() {
        return verify_js_2.flattenedVerify;
    }
}));
var verify_js_3 = __webpack_require__(3493);
Object.defineProperty(exports, "generalVerify", ({
    enumerable: true,
    get: function() {
        return verify_js_3.generalVerify;
    }
}));
var verify_js_4 = __webpack_require__(51296);
Object.defineProperty(exports, "jwtVerify", ({
    enumerable: true,
    get: function() {
        return verify_js_4.jwtVerify;
    }
}));
var decrypt_js_4 = __webpack_require__(74761);
Object.defineProperty(exports, "jwtDecrypt", ({
    enumerable: true,
    get: function() {
        return decrypt_js_4.jwtDecrypt;
    }
}));
var encrypt_js_2 = __webpack_require__(26869);
Object.defineProperty(exports, "CompactEncrypt", ({
    enumerable: true,
    get: function() {
        return encrypt_js_2.CompactEncrypt;
    }
}));
var encrypt_js_3 = __webpack_require__(10636);
Object.defineProperty(exports, "FlattenedEncrypt", ({
    enumerable: true,
    get: function() {
        return encrypt_js_3.FlattenedEncrypt;
    }
}));
var sign_js_1 = __webpack_require__(39656);
Object.defineProperty(exports, "CompactSign", ({
    enumerable: true,
    get: function() {
        return sign_js_1.CompactSign;
    }
}));
var sign_js_2 = __webpack_require__(56459);
Object.defineProperty(exports, "FlattenedSign", ({
    enumerable: true,
    get: function() {
        return sign_js_2.FlattenedSign;
    }
}));
var sign_js_3 = __webpack_require__(70024);
Object.defineProperty(exports, "GeneralSign", ({
    enumerable: true,
    get: function() {
        return sign_js_3.GeneralSign;
    }
}));
var sign_js_4 = __webpack_require__(80342);
Object.defineProperty(exports, "SignJWT", ({
    enumerable: true,
    get: function() {
        return sign_js_4.SignJWT;
    }
}));
var encrypt_js_4 = __webpack_require__(67046);
Object.defineProperty(exports, "EncryptJWT", ({
    enumerable: true,
    get: function() {
        return encrypt_js_4.EncryptJWT;
    }
}));
var thumbprint_js_1 = __webpack_require__(55770);
Object.defineProperty(exports, "calculateJwkThumbprint", ({
    enumerable: true,
    get: function() {
        return thumbprint_js_1.calculateJwkThumbprint;
    }
}));
Object.defineProperty(exports, "calculateJwkThumbprintUri", ({
    enumerable: true,
    get: function() {
        return thumbprint_js_1.calculateJwkThumbprintUri;
    }
}));
var embedded_js_1 = __webpack_require__(23798);
Object.defineProperty(exports, "EmbeddedJWK", ({
    enumerable: true,
    get: function() {
        return embedded_js_1.EmbeddedJWK;
    }
}));
var local_js_1 = __webpack_require__(69063);
Object.defineProperty(exports, "createLocalJWKSet", ({
    enumerable: true,
    get: function() {
        return local_js_1.createLocalJWKSet;
    }
}));
var remote_js_1 = __webpack_require__(17514);
Object.defineProperty(exports, "createRemoteJWKSet", ({
    enumerable: true,
    get: function() {
        return remote_js_1.createRemoteJWKSet;
    }
}));
var unsecured_js_1 = __webpack_require__(59134);
Object.defineProperty(exports, "UnsecuredJWT", ({
    enumerable: true,
    get: function() {
        return unsecured_js_1.UnsecuredJWT;
    }
}));
var export_js_1 = __webpack_require__(30107);
Object.defineProperty(exports, "exportPKCS8", ({
    enumerable: true,
    get: function() {
        return export_js_1.exportPKCS8;
    }
}));
Object.defineProperty(exports, "exportSPKI", ({
    enumerable: true,
    get: function() {
        return export_js_1.exportSPKI;
    }
}));
Object.defineProperty(exports, "exportJWK", ({
    enumerable: true,
    get: function() {
        return export_js_1.exportJWK;
    }
}));
var import_js_1 = __webpack_require__(53844);
Object.defineProperty(exports, "importSPKI", ({
    enumerable: true,
    get: function() {
        return import_js_1.importSPKI;
    }
}));
Object.defineProperty(exports, "importPKCS8", ({
    enumerable: true,
    get: function() {
        return import_js_1.importPKCS8;
    }
}));
Object.defineProperty(exports, "importX509", ({
    enumerable: true,
    get: function() {
        return import_js_1.importX509;
    }
}));
Object.defineProperty(exports, "importJWK", ({
    enumerable: true,
    get: function() {
        return import_js_1.importJWK;
    }
}));
var decode_protected_header_js_1 = __webpack_require__(67412);
Object.defineProperty(exports, "decodeProtectedHeader", ({
    enumerable: true,
    get: function() {
        return decode_protected_header_js_1.decodeProtectedHeader;
    }
}));
var decode_jwt_js_1 = __webpack_require__(34316);
Object.defineProperty(exports, "decodeJwt", ({
    enumerable: true,
    get: function() {
        return decode_jwt_js_1.decodeJwt;
    }
}));
exports.errors = __webpack_require__(79927);
var generate_key_pair_js_1 = __webpack_require__(81570);
Object.defineProperty(exports, "generateKeyPair", ({
    enumerable: true,
    get: function() {
        return generate_key_pair_js_1.generateKeyPair;
    }
}));
var generate_secret_js_1 = __webpack_require__(15845);
Object.defineProperty(exports, "generateSecret", ({
    enumerable: true,
    get: function() {
        return generate_secret_js_1.generateSecret;
    }
}));
exports.base64url = __webpack_require__(68686);
var runtime_js_1 = __webpack_require__(36796);
Object.defineProperty(exports, "cryptoRuntime", ({
    enumerable: true,
    get: function() {
        return runtime_js_1.default;
    }
}));


/***/ }),

/***/ 16709:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.compactDecrypt = void 0;
const decrypt_js_1 = __webpack_require__(5065);
const errors_js_1 = __webpack_require__(79927);
const buffer_utils_js_1 = __webpack_require__(43807);
async function compactDecrypt(jwe, key, options) {
    if (jwe instanceof Uint8Array) {
        jwe = buffer_utils_js_1.decoder.decode(jwe);
    }
    if (typeof jwe !== "string") {
        throw new errors_js_1.JWEInvalid("Compact JWE must be a string or Uint8Array");
    }
    const { 0: protectedHeader, 1: encryptedKey, 2: iv, 3: ciphertext, 4: tag, length } = jwe.split(".");
    if (length !== 5) {
        throw new errors_js_1.JWEInvalid("Invalid Compact JWE");
    }
    const decrypted = await (0, decrypt_js_1.flattenedDecrypt)({
        ciphertext,
        iv: iv || undefined,
        protected: protectedHeader || undefined,
        tag: tag || undefined,
        encrypted_key: encryptedKey || undefined
    }, key, options);
    const result = {
        plaintext: decrypted.plaintext,
        protectedHeader: decrypted.protectedHeader
    };
    if (typeof key === "function") {
        return {
            ...result,
            key: decrypted.key
        };
    }
    return result;
}
exports.compactDecrypt = compactDecrypt;


/***/ }),

/***/ 26869:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.CompactEncrypt = void 0;
const encrypt_js_1 = __webpack_require__(10636);
class CompactEncrypt {
    constructor(plaintext){
        this._flattened = new encrypt_js_1.FlattenedEncrypt(plaintext);
    }
    setContentEncryptionKey(cek) {
        this._flattened.setContentEncryptionKey(cek);
        return this;
    }
    setInitializationVector(iv) {
        this._flattened.setInitializationVector(iv);
        return this;
    }
    setProtectedHeader(protectedHeader) {
        this._flattened.setProtectedHeader(protectedHeader);
        return this;
    }
    setKeyManagementParameters(parameters) {
        this._flattened.setKeyManagementParameters(parameters);
        return this;
    }
    async encrypt(key, options) {
        const jwe = await this._flattened.encrypt(key, options);
        return [
            jwe.protected,
            jwe.encrypted_key,
            jwe.iv,
            jwe.ciphertext,
            jwe.tag
        ].join(".");
    }
}
exports.CompactEncrypt = CompactEncrypt;


/***/ }),

/***/ 5065:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.flattenedDecrypt = void 0;
const base64url_js_1 = __webpack_require__(37244);
const decrypt_js_1 = __webpack_require__(44225);
const zlib_js_1 = __webpack_require__(49786);
const errors_js_1 = __webpack_require__(79927);
const is_disjoint_js_1 = __webpack_require__(1223);
const is_object_js_1 = __webpack_require__(50281);
const decrypt_key_management_js_1 = __webpack_require__(92078);
const buffer_utils_js_1 = __webpack_require__(43807);
const cek_js_1 = __webpack_require__(87744);
const validate_crit_js_1 = __webpack_require__(51534);
const validate_algorithms_js_1 = __webpack_require__(1524);
async function flattenedDecrypt(jwe, key, options) {
    var _a;
    if (!(0, is_object_js_1.default)(jwe)) {
        throw new errors_js_1.JWEInvalid("Flattened JWE must be an object");
    }
    if (jwe.protected === undefined && jwe.header === undefined && jwe.unprotected === undefined) {
        throw new errors_js_1.JWEInvalid("JOSE Header missing");
    }
    if (typeof jwe.iv !== "string") {
        throw new errors_js_1.JWEInvalid("JWE Initialization Vector missing or incorrect type");
    }
    if (typeof jwe.ciphertext !== "string") {
        throw new errors_js_1.JWEInvalid("JWE Ciphertext missing or incorrect type");
    }
    if (typeof jwe.tag !== "string") {
        throw new errors_js_1.JWEInvalid("JWE Authentication Tag missing or incorrect type");
    }
    if (jwe.protected !== undefined && typeof jwe.protected !== "string") {
        throw new errors_js_1.JWEInvalid("JWE Protected Header incorrect type");
    }
    if (jwe.encrypted_key !== undefined && typeof jwe.encrypted_key !== "string") {
        throw new errors_js_1.JWEInvalid("JWE Encrypted Key incorrect type");
    }
    if (jwe.aad !== undefined && typeof jwe.aad !== "string") {
        throw new errors_js_1.JWEInvalid("JWE AAD incorrect type");
    }
    if (jwe.header !== undefined && !(0, is_object_js_1.default)(jwe.header)) {
        throw new errors_js_1.JWEInvalid("JWE Shared Unprotected Header incorrect type");
    }
    if (jwe.unprotected !== undefined && !(0, is_object_js_1.default)(jwe.unprotected)) {
        throw new errors_js_1.JWEInvalid("JWE Per-Recipient Unprotected Header incorrect type");
    }
    let parsedProt;
    if (jwe.protected) {
        try {
            const protectedHeader = (0, base64url_js_1.decode)(jwe.protected);
            parsedProt = JSON.parse(buffer_utils_js_1.decoder.decode(protectedHeader));
        } catch  {
            throw new errors_js_1.JWEInvalid("JWE Protected Header is invalid");
        }
    }
    if (!(0, is_disjoint_js_1.default)(parsedProt, jwe.header, jwe.unprotected)) {
        throw new errors_js_1.JWEInvalid("JWE Protected, JWE Unprotected Header, and JWE Per-Recipient Unprotected Header Parameter names must be disjoint");
    }
    const joseHeader = {
        ...parsedProt,
        ...jwe.header,
        ...jwe.unprotected
    };
    (0, validate_crit_js_1.default)(errors_js_1.JWEInvalid, new Map(), options === null || options === void 0 ? void 0 : options.crit, parsedProt, joseHeader);
    if (joseHeader.zip !== undefined) {
        if (!parsedProt || !parsedProt.zip) {
            throw new errors_js_1.JWEInvalid('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');
        }
        if (joseHeader.zip !== "DEF") {
            throw new errors_js_1.JOSENotSupported('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value');
        }
    }
    const { alg, enc } = joseHeader;
    if (typeof alg !== "string" || !alg) {
        throw new errors_js_1.JWEInvalid("missing JWE Algorithm (alg) in JWE Header");
    }
    if (typeof enc !== "string" || !enc) {
        throw new errors_js_1.JWEInvalid("missing JWE Encryption Algorithm (enc) in JWE Header");
    }
    const keyManagementAlgorithms = options && (0, validate_algorithms_js_1.default)("keyManagementAlgorithms", options.keyManagementAlgorithms);
    const contentEncryptionAlgorithms = options && (0, validate_algorithms_js_1.default)("contentEncryptionAlgorithms", options.contentEncryptionAlgorithms);
    if (keyManagementAlgorithms && !keyManagementAlgorithms.has(alg)) {
        throw new errors_js_1.JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter not allowed');
    }
    if (contentEncryptionAlgorithms && !contentEncryptionAlgorithms.has(enc)) {
        throw new errors_js_1.JOSEAlgNotAllowed('"enc" (Encryption Algorithm) Header Parameter not allowed');
    }
    let encryptedKey;
    if (jwe.encrypted_key !== undefined) {
        try {
            encryptedKey = (0, base64url_js_1.decode)(jwe.encrypted_key);
        } catch  {
            throw new errors_js_1.JWEInvalid("Failed to base64url decode the encrypted_key");
        }
    }
    let resolvedKey = false;
    if (typeof key === "function") {
        key = await key(parsedProt, jwe);
        resolvedKey = true;
    }
    let cek;
    try {
        cek = await (0, decrypt_key_management_js_1.default)(alg, key, encryptedKey, joseHeader, options);
    } catch (err) {
        if (err instanceof TypeError || err instanceof errors_js_1.JWEInvalid || err instanceof errors_js_1.JOSENotSupported) {
            throw err;
        }
        cek = (0, cek_js_1.default)(enc);
    }
    let iv;
    let tag;
    try {
        iv = (0, base64url_js_1.decode)(jwe.iv);
    } catch  {
        throw new errors_js_1.JWEInvalid("Failed to base64url decode the iv");
    }
    try {
        tag = (0, base64url_js_1.decode)(jwe.tag);
    } catch  {
        throw new errors_js_1.JWEInvalid("Failed to base64url decode the tag");
    }
    const protectedHeader = buffer_utils_js_1.encoder.encode((_a = jwe.protected) !== null && _a !== void 0 ? _a : "");
    let additionalData;
    if (jwe.aad !== undefined) {
        additionalData = (0, buffer_utils_js_1.concat)(protectedHeader, buffer_utils_js_1.encoder.encode("."), buffer_utils_js_1.encoder.encode(jwe.aad));
    } else {
        additionalData = protectedHeader;
    }
    let ciphertext;
    try {
        ciphertext = (0, base64url_js_1.decode)(jwe.ciphertext);
    } catch  {
        throw new errors_js_1.JWEInvalid("Failed to base64url decode the ciphertext");
    }
    let plaintext = await (0, decrypt_js_1.default)(enc, cek, ciphertext, iv, tag, additionalData);
    if (joseHeader.zip === "DEF") {
        plaintext = await ((options === null || options === void 0 ? void 0 : options.inflateRaw) || zlib_js_1.inflate)(plaintext);
    }
    const result = {
        plaintext
    };
    if (jwe.protected !== undefined) {
        result.protectedHeader = parsedProt;
    }
    if (jwe.aad !== undefined) {
        try {
            result.additionalAuthenticatedData = (0, base64url_js_1.decode)(jwe.aad);
        } catch  {
            throw new errors_js_1.JWEInvalid("Failed to base64url decode the aad");
        }
    }
    if (jwe.unprotected !== undefined) {
        result.sharedUnprotectedHeader = jwe.unprotected;
    }
    if (jwe.header !== undefined) {
        result.unprotectedHeader = jwe.header;
    }
    if (resolvedKey) {
        return {
            ...result,
            key
        };
    }
    return result;
}
exports.flattenedDecrypt = flattenedDecrypt;


/***/ }),

/***/ 10636:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FlattenedEncrypt = exports.unprotected = void 0;
const base64url_js_1 = __webpack_require__(37244);
const encrypt_js_1 = __webpack_require__(30734);
const zlib_js_1 = __webpack_require__(49786);
const iv_js_1 = __webpack_require__(1093);
const encrypt_key_management_js_1 = __webpack_require__(35255);
const errors_js_1 = __webpack_require__(79927);
const is_disjoint_js_1 = __webpack_require__(1223);
const buffer_utils_js_1 = __webpack_require__(43807);
const validate_crit_js_1 = __webpack_require__(51534);
exports.unprotected = Symbol();
class FlattenedEncrypt {
    constructor(plaintext){
        if (!(plaintext instanceof Uint8Array)) {
            throw new TypeError("plaintext must be an instance of Uint8Array");
        }
        this._plaintext = plaintext;
    }
    setKeyManagementParameters(parameters) {
        if (this._keyManagementParameters) {
            throw new TypeError("setKeyManagementParameters can only be called once");
        }
        this._keyManagementParameters = parameters;
        return this;
    }
    setProtectedHeader(protectedHeader) {
        if (this._protectedHeader) {
            throw new TypeError("setProtectedHeader can only be called once");
        }
        this._protectedHeader = protectedHeader;
        return this;
    }
    setSharedUnprotectedHeader(sharedUnprotectedHeader) {
        if (this._sharedUnprotectedHeader) {
            throw new TypeError("setSharedUnprotectedHeader can only be called once");
        }
        this._sharedUnprotectedHeader = sharedUnprotectedHeader;
        return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
        if (this._unprotectedHeader) {
            throw new TypeError("setUnprotectedHeader can only be called once");
        }
        this._unprotectedHeader = unprotectedHeader;
        return this;
    }
    setAdditionalAuthenticatedData(aad) {
        this._aad = aad;
        return this;
    }
    setContentEncryptionKey(cek) {
        if (this._cek) {
            throw new TypeError("setContentEncryptionKey can only be called once");
        }
        this._cek = cek;
        return this;
    }
    setInitializationVector(iv) {
        if (this._iv) {
            throw new TypeError("setInitializationVector can only be called once");
        }
        this._iv = iv;
        return this;
    }
    async encrypt(key, options) {
        if (!this._protectedHeader && !this._unprotectedHeader && !this._sharedUnprotectedHeader) {
            throw new errors_js_1.JWEInvalid("either setProtectedHeader, setUnprotectedHeader, or sharedUnprotectedHeader must be called before #encrypt()");
        }
        if (!(0, is_disjoint_js_1.default)(this._protectedHeader, this._unprotectedHeader, this._sharedUnprotectedHeader)) {
            throw new errors_js_1.JWEInvalid("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
        }
        const joseHeader = {
            ...this._protectedHeader,
            ...this._unprotectedHeader,
            ...this._sharedUnprotectedHeader
        };
        (0, validate_crit_js_1.default)(errors_js_1.JWEInvalid, new Map(), options === null || options === void 0 ? void 0 : options.crit, this._protectedHeader, joseHeader);
        if (joseHeader.zip !== undefined) {
            if (!this._protectedHeader || !this._protectedHeader.zip) {
                throw new errors_js_1.JWEInvalid('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');
            }
            if (joseHeader.zip !== "DEF") {
                throw new errors_js_1.JOSENotSupported('Unsupported JWE "zip" (Compression Algorithm) Header Parameter value');
            }
        }
        const { alg, enc } = joseHeader;
        if (typeof alg !== "string" || !alg) {
            throw new errors_js_1.JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid');
        }
        if (typeof enc !== "string" || !enc) {
            throw new errors_js_1.JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
        }
        let encryptedKey;
        if (alg === "dir") {
            if (this._cek) {
                throw new TypeError("setContentEncryptionKey cannot be called when using Direct Encryption");
            }
        } else if (alg === "ECDH-ES") {
            if (this._cek) {
                throw new TypeError("setContentEncryptionKey cannot be called when using Direct Key Agreement");
            }
        }
        let cek;
        {
            let parameters;
            ({ cek, encryptedKey, parameters } = await (0, encrypt_key_management_js_1.default)(alg, enc, key, this._cek, this._keyManagementParameters));
            if (parameters) {
                if (options && exports.unprotected in options) {
                    if (!this._unprotectedHeader) {
                        this.setUnprotectedHeader(parameters);
                    } else {
                        this._unprotectedHeader = {
                            ...this._unprotectedHeader,
                            ...parameters
                        };
                    }
                } else {
                    if (!this._protectedHeader) {
                        this.setProtectedHeader(parameters);
                    } else {
                        this._protectedHeader = {
                            ...this._protectedHeader,
                            ...parameters
                        };
                    }
                }
            }
        }
        this._iv || (this._iv = (0, iv_js_1.default)(enc));
        let additionalData;
        let protectedHeader;
        let aadMember;
        if (this._protectedHeader) {
            protectedHeader = buffer_utils_js_1.encoder.encode((0, base64url_js_1.encode)(JSON.stringify(this._protectedHeader)));
        } else {
            protectedHeader = buffer_utils_js_1.encoder.encode("");
        }
        if (this._aad) {
            aadMember = (0, base64url_js_1.encode)(this._aad);
            additionalData = (0, buffer_utils_js_1.concat)(protectedHeader, buffer_utils_js_1.encoder.encode("."), buffer_utils_js_1.encoder.encode(aadMember));
        } else {
            additionalData = protectedHeader;
        }
        let ciphertext;
        let tag;
        if (joseHeader.zip === "DEF") {
            const deflated = await ((options === null || options === void 0 ? void 0 : options.deflateRaw) || zlib_js_1.deflate)(this._plaintext);
            ({ ciphertext, tag } = await (0, encrypt_js_1.default)(enc, deflated, cek, this._iv, additionalData));
        } else {
            ;
            ({ ciphertext, tag } = await (0, encrypt_js_1.default)(enc, this._plaintext, cek, this._iv, additionalData));
        }
        const jwe = {
            ciphertext: (0, base64url_js_1.encode)(ciphertext),
            iv: (0, base64url_js_1.encode)(this._iv),
            tag: (0, base64url_js_1.encode)(tag)
        };
        if (encryptedKey) {
            jwe.encrypted_key = (0, base64url_js_1.encode)(encryptedKey);
        }
        if (aadMember) {
            jwe.aad = aadMember;
        }
        if (this._protectedHeader) {
            jwe.protected = buffer_utils_js_1.decoder.decode(protectedHeader);
        }
        if (this._sharedUnprotectedHeader) {
            jwe.unprotected = this._sharedUnprotectedHeader;
        }
        if (this._unprotectedHeader) {
            jwe.header = this._unprotectedHeader;
        }
        return jwe;
    }
}
exports.FlattenedEncrypt = FlattenedEncrypt;


/***/ }),

/***/ 11619:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.generalDecrypt = void 0;
const decrypt_js_1 = __webpack_require__(5065);
const errors_js_1 = __webpack_require__(79927);
const is_object_js_1 = __webpack_require__(50281);
async function generalDecrypt(jwe, key, options) {
    if (!(0, is_object_js_1.default)(jwe)) {
        throw new errors_js_1.JWEInvalid("General JWE must be an object");
    }
    if (!Array.isArray(jwe.recipients) || !jwe.recipients.every(is_object_js_1.default)) {
        throw new errors_js_1.JWEInvalid("JWE Recipients missing or incorrect type");
    }
    if (!jwe.recipients.length) {
        throw new errors_js_1.JWEInvalid("JWE Recipients has no members");
    }
    for (const recipient of jwe.recipients){
        try {
            return await (0, decrypt_js_1.flattenedDecrypt)({
                aad: jwe.aad,
                ciphertext: jwe.ciphertext,
                encrypted_key: recipient.encrypted_key,
                header: recipient.header,
                iv: jwe.iv,
                protected: jwe.protected,
                tag: jwe.tag,
                unprotected: jwe.unprotected
            }, key, options);
        } catch  {}
    }
    throw new errors_js_1.JWEDecryptionFailed();
}
exports.generalDecrypt = generalDecrypt;


/***/ }),

/***/ 36540:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.GeneralEncrypt = void 0;
const encrypt_js_1 = __webpack_require__(10636);
const errors_js_1 = __webpack_require__(79927);
const cek_js_1 = __webpack_require__(87744);
const is_disjoint_js_1 = __webpack_require__(1223);
const encrypt_key_management_js_1 = __webpack_require__(35255);
const base64url_js_1 = __webpack_require__(37244);
const validate_crit_js_1 = __webpack_require__(51534);
class IndividualRecipient {
    constructor(enc, key, options){
        this.parent = enc;
        this.key = key;
        this.options = options;
    }
    setUnprotectedHeader(unprotectedHeader) {
        if (this.unprotectedHeader) {
            throw new TypeError("setUnprotectedHeader can only be called once");
        }
        this.unprotectedHeader = unprotectedHeader;
        return this;
    }
    addRecipient(...args) {
        return this.parent.addRecipient(...args);
    }
    encrypt(...args) {
        return this.parent.encrypt(...args);
    }
    done() {
        return this.parent;
    }
}
class GeneralEncrypt {
    constructor(plaintext){
        this._recipients = [];
        this._plaintext = plaintext;
    }
    addRecipient(key, options) {
        const recipient = new IndividualRecipient(this, key, {
            crit: options === null || options === void 0 ? void 0 : options.crit
        });
        this._recipients.push(recipient);
        return recipient;
    }
    setProtectedHeader(protectedHeader) {
        if (this._protectedHeader) {
            throw new TypeError("setProtectedHeader can only be called once");
        }
        this._protectedHeader = protectedHeader;
        return this;
    }
    setSharedUnprotectedHeader(sharedUnprotectedHeader) {
        if (this._unprotectedHeader) {
            throw new TypeError("setSharedUnprotectedHeader can only be called once");
        }
        this._unprotectedHeader = sharedUnprotectedHeader;
        return this;
    }
    setAdditionalAuthenticatedData(aad) {
        this._aad = aad;
        return this;
    }
    async encrypt(options) {
        var _a, _b, _c;
        if (!this._recipients.length) {
            throw new errors_js_1.JWEInvalid("at least one recipient must be added");
        }
        options = {
            deflateRaw: options === null || options === void 0 ? void 0 : options.deflateRaw
        };
        if (this._recipients.length === 1) {
            const [recipient] = this._recipients;
            const flattened = await new encrypt_js_1.FlattenedEncrypt(this._plaintext).setAdditionalAuthenticatedData(this._aad).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(recipient.unprotectedHeader).encrypt(recipient.key, {
                ...recipient.options,
                ...options
            });
            let jwe = {
                ciphertext: flattened.ciphertext,
                iv: flattened.iv,
                recipients: [
                    {}
                ],
                tag: flattened.tag
            };
            if (flattened.aad) jwe.aad = flattened.aad;
            if (flattened.protected) jwe.protected = flattened.protected;
            if (flattened.unprotected) jwe.unprotected = flattened.unprotected;
            if (flattened.encrypted_key) jwe.recipients[0].encrypted_key = flattened.encrypted_key;
            if (flattened.header) jwe.recipients[0].header = flattened.header;
            return jwe;
        }
        let enc;
        for(let i = 0; i < this._recipients.length; i++){
            const recipient = this._recipients[i];
            if (!(0, is_disjoint_js_1.default)(this._protectedHeader, this._unprotectedHeader, recipient.unprotectedHeader)) {
                throw new errors_js_1.JWEInvalid("JWE Protected, JWE Shared Unprotected and JWE Per-Recipient Header Parameter names must be disjoint");
            }
            const joseHeader = {
                ...this._protectedHeader,
                ...this._unprotectedHeader,
                ...recipient.unprotectedHeader
            };
            const { alg } = joseHeader;
            if (typeof alg !== "string" || !alg) {
                throw new errors_js_1.JWEInvalid('JWE "alg" (Algorithm) Header Parameter missing or invalid');
            }
            if (alg === "dir" || alg === "ECDH-ES") {
                throw new errors_js_1.JWEInvalid('"dir" and "ECDH-ES" alg may only be used with a single recipient');
            }
            if (typeof joseHeader.enc !== "string" || !joseHeader.enc) {
                throw new errors_js_1.JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter missing or invalid');
            }
            if (!enc) {
                enc = joseHeader.enc;
            } else if (enc !== joseHeader.enc) {
                throw new errors_js_1.JWEInvalid('JWE "enc" (Encryption Algorithm) Header Parameter must be the same for all recipients');
            }
            (0, validate_crit_js_1.default)(errors_js_1.JWEInvalid, new Map(), recipient.options.crit, this._protectedHeader, joseHeader);
            if (joseHeader.zip !== undefined) {
                if (!this._protectedHeader || !this._protectedHeader.zip) {
                    throw new errors_js_1.JWEInvalid('JWE "zip" (Compression Algorithm) Header MUST be integrity protected');
                }
            }
        }
        const cek = (0, cek_js_1.default)(enc);
        let jwe = {
            ciphertext: "",
            iv: "",
            recipients: [],
            tag: ""
        };
        for(let i = 0; i < this._recipients.length; i++){
            const recipient = this._recipients[i];
            const target = {};
            jwe.recipients.push(target);
            const joseHeader = {
                ...this._protectedHeader,
                ...this._unprotectedHeader,
                ...recipient.unprotectedHeader
            };
            const p2c = joseHeader.alg.startsWith("PBES2") ? 2048 + i : undefined;
            if (i === 0) {
                const flattened = await new encrypt_js_1.FlattenedEncrypt(this._plaintext).setAdditionalAuthenticatedData(this._aad).setContentEncryptionKey(cek).setProtectedHeader(this._protectedHeader).setSharedUnprotectedHeader(this._unprotectedHeader).setUnprotectedHeader(recipient.unprotectedHeader).setKeyManagementParameters({
                    p2c
                }).encrypt(recipient.key, {
                    ...recipient.options,
                    ...options,
                    [encrypt_js_1.unprotected]: true
                });
                jwe.ciphertext = flattened.ciphertext;
                jwe.iv = flattened.iv;
                jwe.tag = flattened.tag;
                if (flattened.aad) jwe.aad = flattened.aad;
                if (flattened.protected) jwe.protected = flattened.protected;
                if (flattened.unprotected) jwe.unprotected = flattened.unprotected;
                target.encrypted_key = flattened.encrypted_key;
                if (flattened.header) target.header = flattened.header;
                continue;
            }
            const { encryptedKey, parameters } = await (0, encrypt_key_management_js_1.default)(((_a = recipient.unprotectedHeader) === null || _a === void 0 ? void 0 : _a.alg) || ((_b = this._protectedHeader) === null || _b === void 0 ? void 0 : _b.alg) || ((_c = this._unprotectedHeader) === null || _c === void 0 ? void 0 : _c.alg), enc, recipient.key, cek, {
                p2c
            });
            target.encrypted_key = (0, base64url_js_1.encode)(encryptedKey);
            if (recipient.unprotectedHeader || parameters) target.header = {
                ...recipient.unprotectedHeader,
                ...parameters
            };
        }
        return jwe;
    }
}
exports.GeneralEncrypt = GeneralEncrypt;


/***/ }),

/***/ 23798:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EmbeddedJWK = void 0;
const import_js_1 = __webpack_require__(53844);
const is_object_js_1 = __webpack_require__(50281);
const errors_js_1 = __webpack_require__(79927);
async function EmbeddedJWK(protectedHeader, token) {
    const joseHeader = {
        ...protectedHeader,
        ...token === null || token === void 0 ? void 0 : token.header
    };
    if (!(0, is_object_js_1.default)(joseHeader.jwk)) {
        throw new errors_js_1.JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a JSON object');
    }
    const key = await (0, import_js_1.importJWK)({
        ...joseHeader.jwk,
        ext: true
    }, joseHeader.alg, true);
    if (key instanceof Uint8Array || key.type !== "public") {
        throw new errors_js_1.JWSInvalid('"jwk" (JSON Web Key) Header Parameter must be a public key');
    }
    return key;
}
exports.EmbeddedJWK = EmbeddedJWK;


/***/ }),

/***/ 55770:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.calculateJwkThumbprintUri = exports.calculateJwkThumbprint = void 0;
const digest_js_1 = __webpack_require__(68096);
const base64url_js_1 = __webpack_require__(37244);
const errors_js_1 = __webpack_require__(79927);
const buffer_utils_js_1 = __webpack_require__(43807);
const is_object_js_1 = __webpack_require__(50281);
const check = (value, description)=>{
    if (typeof value !== "string" || !value) {
        throw new errors_js_1.JWKInvalid(`${description} missing or invalid`);
    }
};
async function calculateJwkThumbprint(jwk, digestAlgorithm) {
    if (!(0, is_object_js_1.default)(jwk)) {
        throw new TypeError("JWK must be an object");
    }
    digestAlgorithm !== null && digestAlgorithm !== void 0 ? digestAlgorithm : digestAlgorithm = "sha256";
    if (digestAlgorithm !== "sha256" && digestAlgorithm !== "sha384" && digestAlgorithm !== "sha512") {
        throw new TypeError('digestAlgorithm must one of "sha256", "sha384", or "sha512"');
    }
    let components;
    switch(jwk.kty){
        case "EC":
            check(jwk.crv, '"crv" (Curve) Parameter');
            check(jwk.x, '"x" (X Coordinate) Parameter');
            check(jwk.y, '"y" (Y Coordinate) Parameter');
            components = {
                crv: jwk.crv,
                kty: jwk.kty,
                x: jwk.x,
                y: jwk.y
            };
            break;
        case "OKP":
            check(jwk.crv, '"crv" (Subtype of Key Pair) Parameter');
            check(jwk.x, '"x" (Public Key) Parameter');
            components = {
                crv: jwk.crv,
                kty: jwk.kty,
                x: jwk.x
            };
            break;
        case "RSA":
            check(jwk.e, '"e" (Exponent) Parameter');
            check(jwk.n, '"n" (Modulus) Parameter');
            components = {
                e: jwk.e,
                kty: jwk.kty,
                n: jwk.n
            };
            break;
        case "oct":
            check(jwk.k, '"k" (Key Value) Parameter');
            components = {
                k: jwk.k,
                kty: jwk.kty
            };
            break;
        default:
            throw new errors_js_1.JOSENotSupported('"kty" (Key Type) Parameter missing or unsupported');
    }
    const data = buffer_utils_js_1.encoder.encode(JSON.stringify(components));
    return (0, base64url_js_1.encode)(await (0, digest_js_1.default)(digestAlgorithm, data));
}
exports.calculateJwkThumbprint = calculateJwkThumbprint;
async function calculateJwkThumbprintUri(jwk, digestAlgorithm) {
    digestAlgorithm !== null && digestAlgorithm !== void 0 ? digestAlgorithm : digestAlgorithm = "sha256";
    const thumbprint = await calculateJwkThumbprint(jwk, digestAlgorithm);
    return `urn:ietf:params:oauth:jwk-thumbprint:sha-${digestAlgorithm.slice(-3)}:${thumbprint}`;
}
exports.calculateJwkThumbprintUri = calculateJwkThumbprintUri;


/***/ }),

/***/ 69063:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createLocalJWKSet = exports.LocalJWKSet = exports.isJWKSLike = void 0;
const import_js_1 = __webpack_require__(53844);
const errors_js_1 = __webpack_require__(79927);
const is_object_js_1 = __webpack_require__(50281);
function getKtyFromAlg(alg) {
    switch(typeof alg === "string" && alg.slice(0, 2)){
        case "RS":
        case "PS":
            return "RSA";
        case "ES":
            return "EC";
        case "Ed":
            return "OKP";
        default:
            throw new errors_js_1.JOSENotSupported('Unsupported "alg" value for a JSON Web Key Set');
    }
}
function isJWKSLike(jwks) {
    return jwks && typeof jwks === "object" && Array.isArray(jwks.keys) && jwks.keys.every(isJWKLike);
}
exports.isJWKSLike = isJWKSLike;
function isJWKLike(key) {
    return (0, is_object_js_1.default)(key);
}
function clone(obj) {
    if (typeof structuredClone === "function") {
        return structuredClone(obj);
    }
    return JSON.parse(JSON.stringify(obj));
}
class LocalJWKSet {
    constructor(jwks){
        this._cached = new WeakMap();
        if (!isJWKSLike(jwks)) {
            throw new errors_js_1.JWKSInvalid("JSON Web Key Set malformed");
        }
        this._jwks = clone(jwks);
    }
    async getKey(protectedHeader, token) {
        const { alg, kid } = {
            ...protectedHeader,
            ...token === null || token === void 0 ? void 0 : token.header
        };
        const kty = getKtyFromAlg(alg);
        const candidates = this._jwks.keys.filter((jwk)=>{
            let candidate = kty === jwk.kty;
            if (candidate && typeof kid === "string") {
                candidate = kid === jwk.kid;
            }
            if (candidate && typeof jwk.alg === "string") {
                candidate = alg === jwk.alg;
            }
            if (candidate && typeof jwk.use === "string") {
                candidate = jwk.use === "sig";
            }
            if (candidate && Array.isArray(jwk.key_ops)) {
                candidate = jwk.key_ops.includes("verify");
            }
            if (candidate && alg === "EdDSA") {
                candidate = jwk.crv === "Ed25519" || jwk.crv === "Ed448";
            }
            if (candidate) {
                switch(alg){
                    case "ES256":
                        candidate = jwk.crv === "P-256";
                        break;
                    case "ES256K":
                        candidate = jwk.crv === "secp256k1";
                        break;
                    case "ES384":
                        candidate = jwk.crv === "P-384";
                        break;
                    case "ES512":
                        candidate = jwk.crv === "P-521";
                        break;
                }
            }
            return candidate;
        });
        const { 0: jwk, length } = candidates;
        if (length === 0) {
            throw new errors_js_1.JWKSNoMatchingKey();
        } else if (length !== 1) {
            const error = new errors_js_1.JWKSMultipleMatchingKeys();
            const { _cached } = this;
            error[Symbol.asyncIterator] = async function*() {
                for (const jwk of candidates){
                    try {
                        yield await importWithAlgCache(_cached, jwk, alg);
                    } catch  {
                        continue;
                    }
                }
            };
            throw error;
        }
        return importWithAlgCache(this._cached, jwk, alg);
    }
}
exports.LocalJWKSet = LocalJWKSet;
async function importWithAlgCache(cache, jwk, alg) {
    const cached = cache.get(jwk) || cache.set(jwk, {}).get(jwk);
    if (cached[alg] === undefined) {
        const key = await (0, import_js_1.importJWK)({
            ...jwk,
            ext: true
        }, alg);
        if (key instanceof Uint8Array || key.type !== "public") {
            throw new errors_js_1.JWKSInvalid("JSON Web Key Set members must be public keys");
        }
        cached[alg] = key;
    }
    return cached[alg];
}
function createLocalJWKSet(jwks) {
    const set = new LocalJWKSet(jwks);
    return async function(protectedHeader, token) {
        return set.getKey(protectedHeader, token);
    };
}
exports.createLocalJWKSet = createLocalJWKSet;


/***/ }),

/***/ 17514:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createRemoteJWKSet = void 0;
const fetch_jwks_js_1 = __webpack_require__(86581);
const errors_js_1 = __webpack_require__(79927);
const local_js_1 = __webpack_require__(69063);
function isCloudflareWorkers() {
    return typeof WebSocketPair !== "undefined" || typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers" || typeof EdgeRuntime !== "undefined" && EdgeRuntime === "vercel";
}
class RemoteJWKSet extends local_js_1.LocalJWKSet {
    constructor(url, options){
        super({
            keys: []
        });
        this._jwks = undefined;
        if (!(url instanceof URL)) {
            throw new TypeError("url must be an instance of URL");
        }
        this._url = new URL(url.href);
        this._options = {
            agent: options === null || options === void 0 ? void 0 : options.agent,
            headers: options === null || options === void 0 ? void 0 : options.headers
        };
        this._timeoutDuration = typeof (options === null || options === void 0 ? void 0 : options.timeoutDuration) === "number" ? options === null || options === void 0 ? void 0 : options.timeoutDuration : 5000;
        this._cooldownDuration = typeof (options === null || options === void 0 ? void 0 : options.cooldownDuration) === "number" ? options === null || options === void 0 ? void 0 : options.cooldownDuration : 30000;
        this._cacheMaxAge = typeof (options === null || options === void 0 ? void 0 : options.cacheMaxAge) === "number" ? options === null || options === void 0 ? void 0 : options.cacheMaxAge : 600000;
    }
    coolingDown() {
        return typeof this._jwksTimestamp === "number" ? Date.now() < this._jwksTimestamp + this._cooldownDuration : false;
    }
    fresh() {
        return typeof this._jwksTimestamp === "number" ? Date.now() < this._jwksTimestamp + this._cacheMaxAge : false;
    }
    async getKey(protectedHeader, token) {
        if (!this._jwks || !this.fresh()) {
            await this.reload();
        }
        try {
            return await super.getKey(protectedHeader, token);
        } catch (err) {
            if (err instanceof errors_js_1.JWKSNoMatchingKey) {
                if (this.coolingDown() === false) {
                    await this.reload();
                    return super.getKey(protectedHeader, token);
                }
            }
            throw err;
        }
    }
    async reload() {
        if (this._pendingFetch && isCloudflareWorkers()) {
            this._pendingFetch = undefined;
        }
        this._pendingFetch || (this._pendingFetch = (0, fetch_jwks_js_1.default)(this._url, this._timeoutDuration, this._options).then((json)=>{
            if (!(0, local_js_1.isJWKSLike)(json)) {
                throw new errors_js_1.JWKSInvalid("JSON Web Key Set malformed");
            }
            this._jwks = {
                keys: json.keys
            };
            this._jwksTimestamp = Date.now();
            this._pendingFetch = undefined;
        }).catch((err)=>{
            this._pendingFetch = undefined;
            throw err;
        }));
        await this._pendingFetch;
    }
}
function createRemoteJWKSet(url, options) {
    const set = new RemoteJWKSet(url, options);
    return async function(protectedHeader, token) {
        return set.getKey(protectedHeader, token);
    };
}
exports.createRemoteJWKSet = createRemoteJWKSet;


/***/ }),

/***/ 39656:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.CompactSign = void 0;
const sign_js_1 = __webpack_require__(56459);
class CompactSign {
    constructor(payload){
        this._flattened = new sign_js_1.FlattenedSign(payload);
    }
    setProtectedHeader(protectedHeader) {
        this._flattened.setProtectedHeader(protectedHeader);
        return this;
    }
    async sign(key, options) {
        const jws = await this._flattened.sign(key, options);
        if (jws.payload === undefined) {
            throw new TypeError("use the flattened module for creating JWS with b64: false");
        }
        return `${jws.protected}.${jws.payload}.${jws.signature}`;
    }
}
exports.CompactSign = CompactSign;


/***/ }),

/***/ 72432:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.compactVerify = void 0;
const verify_js_1 = __webpack_require__(7549);
const errors_js_1 = __webpack_require__(79927);
const buffer_utils_js_1 = __webpack_require__(43807);
async function compactVerify(jws, key, options) {
    if (jws instanceof Uint8Array) {
        jws = buffer_utils_js_1.decoder.decode(jws);
    }
    if (typeof jws !== "string") {
        throw new errors_js_1.JWSInvalid("Compact JWS must be a string or Uint8Array");
    }
    const { 0: protectedHeader, 1: payload, 2: signature, length } = jws.split(".");
    if (length !== 3) {
        throw new errors_js_1.JWSInvalid("Invalid Compact JWS");
    }
    const verified = await (0, verify_js_1.flattenedVerify)({
        payload,
        protected: protectedHeader,
        signature
    }, key, options);
    const result = {
        payload: verified.payload,
        protectedHeader: verified.protectedHeader
    };
    if (typeof key === "function") {
        return {
            ...result,
            key: verified.key
        };
    }
    return result;
}
exports.compactVerify = compactVerify;


/***/ }),

/***/ 56459:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.FlattenedSign = void 0;
const base64url_js_1 = __webpack_require__(37244);
const sign_js_1 = __webpack_require__(98242);
const is_disjoint_js_1 = __webpack_require__(1223);
const errors_js_1 = __webpack_require__(79927);
const buffer_utils_js_1 = __webpack_require__(43807);
const check_key_type_js_1 = __webpack_require__(47234);
const validate_crit_js_1 = __webpack_require__(51534);
class FlattenedSign {
    constructor(payload){
        if (!(payload instanceof Uint8Array)) {
            throw new TypeError("payload must be an instance of Uint8Array");
        }
        this._payload = payload;
    }
    setProtectedHeader(protectedHeader) {
        if (this._protectedHeader) {
            throw new TypeError("setProtectedHeader can only be called once");
        }
        this._protectedHeader = protectedHeader;
        return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
        if (this._unprotectedHeader) {
            throw new TypeError("setUnprotectedHeader can only be called once");
        }
        this._unprotectedHeader = unprotectedHeader;
        return this;
    }
    async sign(key, options) {
        if (!this._protectedHeader && !this._unprotectedHeader) {
            throw new errors_js_1.JWSInvalid("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");
        }
        if (!(0, is_disjoint_js_1.default)(this._protectedHeader, this._unprotectedHeader)) {
            throw new errors_js_1.JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
        }
        const joseHeader = {
            ...this._protectedHeader,
            ...this._unprotectedHeader
        };
        const extensions = (0, validate_crit_js_1.default)(errors_js_1.JWSInvalid, new Map([
            [
                "b64",
                true
            ]
        ]), options === null || options === void 0 ? void 0 : options.crit, this._protectedHeader, joseHeader);
        let b64 = true;
        if (extensions.has("b64")) {
            b64 = this._protectedHeader.b64;
            if (typeof b64 !== "boolean") {
                throw new errors_js_1.JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
            }
        }
        const { alg } = joseHeader;
        if (typeof alg !== "string" || !alg) {
            throw new errors_js_1.JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
        }
        (0, check_key_type_js_1.default)(alg, key, "sign");
        let payload = this._payload;
        if (b64) {
            payload = buffer_utils_js_1.encoder.encode((0, base64url_js_1.encode)(payload));
        }
        let protectedHeader;
        if (this._protectedHeader) {
            protectedHeader = buffer_utils_js_1.encoder.encode((0, base64url_js_1.encode)(JSON.stringify(this._protectedHeader)));
        } else {
            protectedHeader = buffer_utils_js_1.encoder.encode("");
        }
        const data = (0, buffer_utils_js_1.concat)(protectedHeader, buffer_utils_js_1.encoder.encode("."), payload);
        const signature = await (0, sign_js_1.default)(alg, key, data);
        const jws = {
            signature: (0, base64url_js_1.encode)(signature),
            payload: ""
        };
        if (b64) {
            jws.payload = buffer_utils_js_1.decoder.decode(payload);
        }
        if (this._unprotectedHeader) {
            jws.header = this._unprotectedHeader;
        }
        if (this._protectedHeader) {
            jws.protected = buffer_utils_js_1.decoder.decode(protectedHeader);
        }
        return jws;
    }
}
exports.FlattenedSign = FlattenedSign;


/***/ }),

/***/ 7549:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.flattenedVerify = void 0;
const base64url_js_1 = __webpack_require__(37244);
const verify_js_1 = __webpack_require__(17872);
const errors_js_1 = __webpack_require__(79927);
const buffer_utils_js_1 = __webpack_require__(43807);
const is_disjoint_js_1 = __webpack_require__(1223);
const is_object_js_1 = __webpack_require__(50281);
const check_key_type_js_1 = __webpack_require__(47234);
const validate_crit_js_1 = __webpack_require__(51534);
const validate_algorithms_js_1 = __webpack_require__(1524);
async function flattenedVerify(jws, key, options) {
    var _a;
    if (!(0, is_object_js_1.default)(jws)) {
        throw new errors_js_1.JWSInvalid("Flattened JWS must be an object");
    }
    if (jws.protected === undefined && jws.header === undefined) {
        throw new errors_js_1.JWSInvalid('Flattened JWS must have either of the "protected" or "header" members');
    }
    if (jws.protected !== undefined && typeof jws.protected !== "string") {
        throw new errors_js_1.JWSInvalid("JWS Protected Header incorrect type");
    }
    if (jws.payload === undefined) {
        throw new errors_js_1.JWSInvalid("JWS Payload missing");
    }
    if (typeof jws.signature !== "string") {
        throw new errors_js_1.JWSInvalid("JWS Signature missing or incorrect type");
    }
    if (jws.header !== undefined && !(0, is_object_js_1.default)(jws.header)) {
        throw new errors_js_1.JWSInvalid("JWS Unprotected Header incorrect type");
    }
    let parsedProt = {};
    if (jws.protected) {
        try {
            const protectedHeader = (0, base64url_js_1.decode)(jws.protected);
            parsedProt = JSON.parse(buffer_utils_js_1.decoder.decode(protectedHeader));
        } catch  {
            throw new errors_js_1.JWSInvalid("JWS Protected Header is invalid");
        }
    }
    if (!(0, is_disjoint_js_1.default)(parsedProt, jws.header)) {
        throw new errors_js_1.JWSInvalid("JWS Protected and JWS Unprotected Header Parameter names must be disjoint");
    }
    const joseHeader = {
        ...parsedProt,
        ...jws.header
    };
    const extensions = (0, validate_crit_js_1.default)(errors_js_1.JWSInvalid, new Map([
        [
            "b64",
            true
        ]
    ]), options === null || options === void 0 ? void 0 : options.crit, parsedProt, joseHeader);
    let b64 = true;
    if (extensions.has("b64")) {
        b64 = parsedProt.b64;
        if (typeof b64 !== "boolean") {
            throw new errors_js_1.JWSInvalid('The "b64" (base64url-encode payload) Header Parameter must be a boolean');
        }
    }
    const { alg } = joseHeader;
    if (typeof alg !== "string" || !alg) {
        throw new errors_js_1.JWSInvalid('JWS "alg" (Algorithm) Header Parameter missing or invalid');
    }
    const algorithms = options && (0, validate_algorithms_js_1.default)("algorithms", options.algorithms);
    if (algorithms && !algorithms.has(alg)) {
        throw new errors_js_1.JOSEAlgNotAllowed('"alg" (Algorithm) Header Parameter not allowed');
    }
    if (b64) {
        if (typeof jws.payload !== "string") {
            throw new errors_js_1.JWSInvalid("JWS Payload must be a string");
        }
    } else if (typeof jws.payload !== "string" && !(jws.payload instanceof Uint8Array)) {
        throw new errors_js_1.JWSInvalid("JWS Payload must be a string or an Uint8Array instance");
    }
    let resolvedKey = false;
    if (typeof key === "function") {
        key = await key(parsedProt, jws);
        resolvedKey = true;
    }
    (0, check_key_type_js_1.default)(alg, key, "verify");
    const data = (0, buffer_utils_js_1.concat)(buffer_utils_js_1.encoder.encode((_a = jws.protected) !== null && _a !== void 0 ? _a : ""), buffer_utils_js_1.encoder.encode("."), typeof jws.payload === "string" ? buffer_utils_js_1.encoder.encode(jws.payload) : jws.payload);
    let signature;
    try {
        signature = (0, base64url_js_1.decode)(jws.signature);
    } catch  {
        throw new errors_js_1.JWSInvalid("Failed to base64url decode the signature");
    }
    const verified = await (0, verify_js_1.default)(alg, key, signature, data);
    if (!verified) {
        throw new errors_js_1.JWSSignatureVerificationFailed();
    }
    let payload;
    if (b64) {
        try {
            payload = (0, base64url_js_1.decode)(jws.payload);
        } catch  {
            throw new errors_js_1.JWSInvalid("Failed to base64url decode the payload");
        }
    } else if (typeof jws.payload === "string") {
        payload = buffer_utils_js_1.encoder.encode(jws.payload);
    } else {
        payload = jws.payload;
    }
    const result = {
        payload
    };
    if (jws.protected !== undefined) {
        result.protectedHeader = parsedProt;
    }
    if (jws.header !== undefined) {
        result.unprotectedHeader = jws.header;
    }
    if (resolvedKey) {
        return {
            ...result,
            key
        };
    }
    return result;
}
exports.flattenedVerify = flattenedVerify;


/***/ }),

/***/ 70024:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.GeneralSign = void 0;
const sign_js_1 = __webpack_require__(56459);
const errors_js_1 = __webpack_require__(79927);
class IndividualSignature {
    constructor(sig, key, options){
        this.parent = sig;
        this.key = key;
        this.options = options;
    }
    setProtectedHeader(protectedHeader) {
        if (this.protectedHeader) {
            throw new TypeError("setProtectedHeader can only be called once");
        }
        this.protectedHeader = protectedHeader;
        return this;
    }
    setUnprotectedHeader(unprotectedHeader) {
        if (this.unprotectedHeader) {
            throw new TypeError("setUnprotectedHeader can only be called once");
        }
        this.unprotectedHeader = unprotectedHeader;
        return this;
    }
    addSignature(...args) {
        return this.parent.addSignature(...args);
    }
    sign(...args) {
        return this.parent.sign(...args);
    }
    done() {
        return this.parent;
    }
}
class GeneralSign {
    constructor(payload){
        this._signatures = [];
        this._payload = payload;
    }
    addSignature(key, options) {
        const signature = new IndividualSignature(this, key, options);
        this._signatures.push(signature);
        return signature;
    }
    async sign() {
        if (!this._signatures.length) {
            throw new errors_js_1.JWSInvalid("at least one signature must be added");
        }
        const jws = {
            signatures: [],
            payload: ""
        };
        for(let i = 0; i < this._signatures.length; i++){
            const signature = this._signatures[i];
            const flattened = new sign_js_1.FlattenedSign(this._payload);
            flattened.setProtectedHeader(signature.protectedHeader);
            flattened.setUnprotectedHeader(signature.unprotectedHeader);
            const { payload, ...rest } = await flattened.sign(signature.key, signature.options);
            if (i === 0) {
                jws.payload = payload;
            } else if (jws.payload !== payload) {
                throw new errors_js_1.JWSInvalid("inconsistent use of JWS Unencoded Payload (RFC7797)");
            }
            jws.signatures.push(rest);
        }
        return jws;
    }
}
exports.GeneralSign = GeneralSign;


/***/ }),

/***/ 3493:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.generalVerify = void 0;
const verify_js_1 = __webpack_require__(7549);
const errors_js_1 = __webpack_require__(79927);
const is_object_js_1 = __webpack_require__(50281);
async function generalVerify(jws, key, options) {
    if (!(0, is_object_js_1.default)(jws)) {
        throw new errors_js_1.JWSInvalid("General JWS must be an object");
    }
    if (!Array.isArray(jws.signatures) || !jws.signatures.every(is_object_js_1.default)) {
        throw new errors_js_1.JWSInvalid("JWS Signatures missing or incorrect type");
    }
    for (const signature of jws.signatures){
        try {
            return await (0, verify_js_1.flattenedVerify)({
                header: signature.header,
                payload: jws.payload,
                protected: signature.protected,
                signature: signature.signature
            }, key, options);
        } catch  {}
    }
    throw new errors_js_1.JWSSignatureVerificationFailed();
}
exports.generalVerify = generalVerify;


/***/ }),

/***/ 74761:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.jwtDecrypt = void 0;
const decrypt_js_1 = __webpack_require__(16709);
const jwt_claims_set_js_1 = __webpack_require__(65455);
const errors_js_1 = __webpack_require__(79927);
async function jwtDecrypt(jwt, key, options) {
    const decrypted = await (0, decrypt_js_1.compactDecrypt)(jwt, key, options);
    const payload = (0, jwt_claims_set_js_1.default)(decrypted.protectedHeader, decrypted.plaintext, options);
    const { protectedHeader } = decrypted;
    if (protectedHeader.iss !== undefined && protectedHeader.iss !== payload.iss) {
        throw new errors_js_1.JWTClaimValidationFailed('replicated "iss" claim header parameter mismatch', "iss", "mismatch");
    }
    if (protectedHeader.sub !== undefined && protectedHeader.sub !== payload.sub) {
        throw new errors_js_1.JWTClaimValidationFailed('replicated "sub" claim header parameter mismatch', "sub", "mismatch");
    }
    if (protectedHeader.aud !== undefined && JSON.stringify(protectedHeader.aud) !== JSON.stringify(payload.aud)) {
        throw new errors_js_1.JWTClaimValidationFailed('replicated "aud" claim header parameter mismatch', "aud", "mismatch");
    }
    const result = {
        payload,
        protectedHeader
    };
    if (typeof key === "function") {
        return {
            ...result,
            key: decrypted.key
        };
    }
    return result;
}
exports.jwtDecrypt = jwtDecrypt;


/***/ }),

/***/ 67046:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.EncryptJWT = void 0;
const encrypt_js_1 = __webpack_require__(26869);
const buffer_utils_js_1 = __webpack_require__(43807);
const produce_js_1 = __webpack_require__(21637);
class EncryptJWT extends produce_js_1.ProduceJWT {
    setProtectedHeader(protectedHeader) {
        if (this._protectedHeader) {
            throw new TypeError("setProtectedHeader can only be called once");
        }
        this._protectedHeader = protectedHeader;
        return this;
    }
    setKeyManagementParameters(parameters) {
        if (this._keyManagementParameters) {
            throw new TypeError("setKeyManagementParameters can only be called once");
        }
        this._keyManagementParameters = parameters;
        return this;
    }
    setContentEncryptionKey(cek) {
        if (this._cek) {
            throw new TypeError("setContentEncryptionKey can only be called once");
        }
        this._cek = cek;
        return this;
    }
    setInitializationVector(iv) {
        if (this._iv) {
            throw new TypeError("setInitializationVector can only be called once");
        }
        this._iv = iv;
        return this;
    }
    replicateIssuerAsHeader() {
        this._replicateIssuerAsHeader = true;
        return this;
    }
    replicateSubjectAsHeader() {
        this._replicateSubjectAsHeader = true;
        return this;
    }
    replicateAudienceAsHeader() {
        this._replicateAudienceAsHeader = true;
        return this;
    }
    async encrypt(key, options) {
        const enc = new encrypt_js_1.CompactEncrypt(buffer_utils_js_1.encoder.encode(JSON.stringify(this._payload)));
        if (this._replicateIssuerAsHeader) {
            this._protectedHeader = {
                ...this._protectedHeader,
                iss: this._payload.iss
            };
        }
        if (this._replicateSubjectAsHeader) {
            this._protectedHeader = {
                ...this._protectedHeader,
                sub: this._payload.sub
            };
        }
        if (this._replicateAudienceAsHeader) {
            this._protectedHeader = {
                ...this._protectedHeader,
                aud: this._payload.aud
            };
        }
        enc.setProtectedHeader(this._protectedHeader);
        if (this._iv) {
            enc.setInitializationVector(this._iv);
        }
        if (this._cek) {
            enc.setContentEncryptionKey(this._cek);
        }
        if (this._keyManagementParameters) {
            enc.setKeyManagementParameters(this._keyManagementParameters);
        }
        return enc.encrypt(key, options);
    }
}
exports.EncryptJWT = EncryptJWT;


/***/ }),

/***/ 21637:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ProduceJWT = void 0;
const epoch_js_1 = __webpack_require__(92155);
const is_object_js_1 = __webpack_require__(50281);
const secs_js_1 = __webpack_require__(91540);
class ProduceJWT {
    constructor(payload){
        if (!(0, is_object_js_1.default)(payload)) {
            throw new TypeError("JWT Claims Set MUST be an object");
        }
        this._payload = payload;
    }
    setIssuer(issuer) {
        this._payload = {
            ...this._payload,
            iss: issuer
        };
        return this;
    }
    setSubject(subject) {
        this._payload = {
            ...this._payload,
            sub: subject
        };
        return this;
    }
    setAudience(audience) {
        this._payload = {
            ...this._payload,
            aud: audience
        };
        return this;
    }
    setJti(jwtId) {
        this._payload = {
            ...this._payload,
            jti: jwtId
        };
        return this;
    }
    setNotBefore(input) {
        if (typeof input === "number") {
            this._payload = {
                ...this._payload,
                nbf: input
            };
        } else {
            this._payload = {
                ...this._payload,
                nbf: (0, epoch_js_1.default)(new Date()) + (0, secs_js_1.default)(input)
            };
        }
        return this;
    }
    setExpirationTime(input) {
        if (typeof input === "number") {
            this._payload = {
                ...this._payload,
                exp: input
            };
        } else {
            this._payload = {
                ...this._payload,
                exp: (0, epoch_js_1.default)(new Date()) + (0, secs_js_1.default)(input)
            };
        }
        return this;
    }
    setIssuedAt(input) {
        if (typeof input === "undefined") {
            this._payload = {
                ...this._payload,
                iat: (0, epoch_js_1.default)(new Date())
            };
        } else {
            this._payload = {
                ...this._payload,
                iat: input
            };
        }
        return this;
    }
}
exports.ProduceJWT = ProduceJWT;


/***/ }),

/***/ 80342:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.SignJWT = void 0;
const sign_js_1 = __webpack_require__(39656);
const errors_js_1 = __webpack_require__(79927);
const buffer_utils_js_1 = __webpack_require__(43807);
const produce_js_1 = __webpack_require__(21637);
class SignJWT extends produce_js_1.ProduceJWT {
    setProtectedHeader(protectedHeader) {
        this._protectedHeader = protectedHeader;
        return this;
    }
    async sign(key, options) {
        var _a;
        const sig = new sign_js_1.CompactSign(buffer_utils_js_1.encoder.encode(JSON.stringify(this._payload)));
        sig.setProtectedHeader(this._protectedHeader);
        if (Array.isArray((_a = this._protectedHeader) === null || _a === void 0 ? void 0 : _a.crit) && this._protectedHeader.crit.includes("b64") && this._protectedHeader.b64 === false) {
            throw new errors_js_1.JWTInvalid("JWTs MUST NOT use unencoded payload");
        }
        return sig.sign(key, options);
    }
}
exports.SignJWT = SignJWT;


/***/ }),

/***/ 59134:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.UnsecuredJWT = void 0;
const base64url = __webpack_require__(37244);
const buffer_utils_js_1 = __webpack_require__(43807);
const errors_js_1 = __webpack_require__(79927);
const jwt_claims_set_js_1 = __webpack_require__(65455);
const produce_js_1 = __webpack_require__(21637);
class UnsecuredJWT extends produce_js_1.ProduceJWT {
    encode() {
        const header = base64url.encode(JSON.stringify({
            alg: "none"
        }));
        const payload = base64url.encode(JSON.stringify(this._payload));
        return `${header}.${payload}.`;
    }
    static decode(jwt, options) {
        if (typeof jwt !== "string") {
            throw new errors_js_1.JWTInvalid("Unsecured JWT must be a string");
        }
        const { 0: encodedHeader, 1: encodedPayload, 2: signature, length } = jwt.split(".");
        if (length !== 3 || signature !== "") {
            throw new errors_js_1.JWTInvalid("Invalid Unsecured JWT");
        }
        let header;
        try {
            header = JSON.parse(buffer_utils_js_1.decoder.decode(base64url.decode(encodedHeader)));
            if (header.alg !== "none") throw new Error();
        } catch  {
            throw new errors_js_1.JWTInvalid("Invalid Unsecured JWT");
        }
        const payload = (0, jwt_claims_set_js_1.default)(header, base64url.decode(encodedPayload), options);
        return {
            payload,
            header
        };
    }
}
exports.UnsecuredJWT = UnsecuredJWT;


/***/ }),

/***/ 51296:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.jwtVerify = void 0;
const verify_js_1 = __webpack_require__(72432);
const jwt_claims_set_js_1 = __webpack_require__(65455);
const errors_js_1 = __webpack_require__(79927);
async function jwtVerify(jwt, key, options) {
    var _a;
    const verified = await (0, verify_js_1.compactVerify)(jwt, key, options);
    if (((_a = verified.protectedHeader.crit) === null || _a === void 0 ? void 0 : _a.includes("b64")) && verified.protectedHeader.b64 === false) {
        throw new errors_js_1.JWTInvalid("JWTs MUST NOT use unencoded payload");
    }
    const payload = (0, jwt_claims_set_js_1.default)(verified.protectedHeader, verified.payload, options);
    const result = {
        payload,
        protectedHeader: verified.protectedHeader
    };
    if (typeof key === "function") {
        return {
            ...result,
            key: verified.key
        };
    }
    return result;
}
exports.jwtVerify = jwtVerify;


/***/ }),

/***/ 30107:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.exportJWK = exports.exportPKCS8 = exports.exportSPKI = void 0;
const asn1_js_1 = __webpack_require__(23794);
const asn1_js_2 = __webpack_require__(23794);
const key_to_jwk_js_1 = __webpack_require__(12177);
async function exportSPKI(key) {
    return (0, asn1_js_1.toSPKI)(key);
}
exports.exportSPKI = exportSPKI;
async function exportPKCS8(key) {
    return (0, asn1_js_2.toPKCS8)(key);
}
exports.exportPKCS8 = exportPKCS8;
async function exportJWK(key) {
    return (0, key_to_jwk_js_1.default)(key);
}
exports.exportJWK = exportJWK;


/***/ }),

/***/ 81570:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.generateKeyPair = void 0;
const generate_js_1 = __webpack_require__(37072);
async function generateKeyPair(alg, options) {
    return (0, generate_js_1.generateKeyPair)(alg, options);
}
exports.generateKeyPair = generateKeyPair;


/***/ }),

/***/ 15845:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.generateSecret = void 0;
const generate_js_1 = __webpack_require__(37072);
async function generateSecret(alg, options) {
    return (0, generate_js_1.generateSecret)(alg, options);
}
exports.generateSecret = generateSecret;


/***/ }),

/***/ 53844:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.importJWK = exports.importPKCS8 = exports.importX509 = exports.importSPKI = void 0;
const base64url_js_1 = __webpack_require__(37244);
const asn1_js_1 = __webpack_require__(23794);
const jwk_to_key_js_1 = __webpack_require__(98544);
const errors_js_1 = __webpack_require__(79927);
const is_object_js_1 = __webpack_require__(50281);
async function importSPKI(spki, alg, options) {
    if (typeof spki !== "string" || spki.indexOf("-----BEGIN PUBLIC KEY-----") !== 0) {
        throw new TypeError('"spki" must be SPKI formatted string');
    }
    return (0, asn1_js_1.fromSPKI)(spki, alg, options);
}
exports.importSPKI = importSPKI;
async function importX509(x509, alg, options) {
    if (typeof x509 !== "string" || x509.indexOf("-----BEGIN CERTIFICATE-----") !== 0) {
        throw new TypeError('"x509" must be X.509 formatted string');
    }
    return (0, asn1_js_1.fromX509)(x509, alg, options);
}
exports.importX509 = importX509;
async function importPKCS8(pkcs8, alg, options) {
    if (typeof pkcs8 !== "string" || pkcs8.indexOf("-----BEGIN PRIVATE KEY-----") !== 0) {
        throw new TypeError('"pkcs8" must be PKCS#8 formatted string');
    }
    return (0, asn1_js_1.fromPKCS8)(pkcs8, alg, options);
}
exports.importPKCS8 = importPKCS8;
async function importJWK(jwk, alg, octAsKeyObject) {
    var _a;
    if (!(0, is_object_js_1.default)(jwk)) {
        throw new TypeError("JWK must be an object");
    }
    alg || (alg = jwk.alg);
    switch(jwk.kty){
        case "oct":
            if (typeof jwk.k !== "string" || !jwk.k) {
                throw new TypeError('missing "k" (Key Value) Parameter value');
            }
            octAsKeyObject !== null && octAsKeyObject !== void 0 ? octAsKeyObject : octAsKeyObject = jwk.ext !== true;
            if (octAsKeyObject) {
                return (0, jwk_to_key_js_1.default)({
                    ...jwk,
                    alg,
                    ext: (_a = jwk.ext) !== null && _a !== void 0 ? _a : false
                });
            }
            return (0, base64url_js_1.decode)(jwk.k);
        case "RSA":
            if (jwk.oth !== undefined) {
                throw new errors_js_1.JOSENotSupported('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');
            }
        case "EC":
        case "OKP":
            return (0, jwk_to_key_js_1.default)({
                ...jwk,
                alg
            });
        default:
            throw new errors_js_1.JOSENotSupported('Unsupported "kty" (Key Type) Parameter value');
    }
}
exports.importJWK = importJWK;


/***/ }),

/***/ 50751:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.unwrap = exports.wrap = void 0;
const encrypt_js_1 = __webpack_require__(30734);
const decrypt_js_1 = __webpack_require__(44225);
const iv_js_1 = __webpack_require__(1093);
const base64url_js_1 = __webpack_require__(37244);
async function wrap(alg, key, cek, iv) {
    const jweAlgorithm = alg.slice(0, 7);
    iv || (iv = (0, iv_js_1.default)(jweAlgorithm));
    const { ciphertext: encryptedKey, tag } = await (0, encrypt_js_1.default)(jweAlgorithm, cek, key, iv, new Uint8Array(0));
    return {
        encryptedKey,
        iv: (0, base64url_js_1.encode)(iv),
        tag: (0, base64url_js_1.encode)(tag)
    };
}
exports.wrap = wrap;
async function unwrap(alg, key, encryptedKey, iv, tag) {
    const jweAlgorithm = alg.slice(0, 7);
    return (0, decrypt_js_1.default)(jweAlgorithm, key, encryptedKey, iv, tag, new Uint8Array(0));
}
exports.unwrap = unwrap;


/***/ }),

/***/ 43807:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.concatKdf = exports.lengthAndInput = exports.uint32be = exports.uint64be = exports.p2s = exports.concat = exports.decoder = exports.encoder = void 0;
const digest_js_1 = __webpack_require__(68096);
exports.encoder = new TextEncoder();
exports.decoder = new TextDecoder();
const MAX_INT32 = 2 ** 32;
function concat(...buffers) {
    const size = buffers.reduce((acc, { length })=>acc + length, 0);
    const buf = new Uint8Array(size);
    let i = 0;
    buffers.forEach((buffer)=>{
        buf.set(buffer, i);
        i += buffer.length;
    });
    return buf;
}
exports.concat = concat;
function p2s(alg, p2sInput) {
    return concat(exports.encoder.encode(alg), new Uint8Array([
        0
    ]), p2sInput);
}
exports.p2s = p2s;
function writeUInt32BE(buf, value, offset) {
    if (value < 0 || value >= MAX_INT32) {
        throw new RangeError(`value must be >= 0 and <= ${MAX_INT32 - 1}. Received ${value}`);
    }
    buf.set([
        value >>> 24,
        value >>> 16,
        value >>> 8,
        value & 0xff
    ], offset);
}
function uint64be(value) {
    const high = Math.floor(value / MAX_INT32);
    const low = value % MAX_INT32;
    const buf = new Uint8Array(8);
    writeUInt32BE(buf, high, 0);
    writeUInt32BE(buf, low, 4);
    return buf;
}
exports.uint64be = uint64be;
function uint32be(value) {
    const buf = new Uint8Array(4);
    writeUInt32BE(buf, value);
    return buf;
}
exports.uint32be = uint32be;
function lengthAndInput(input) {
    return concat(uint32be(input.length), input);
}
exports.lengthAndInput = lengthAndInput;
async function concatKdf(secret, bits, value) {
    const iterations = Math.ceil((bits >> 3) / 32);
    const res = new Uint8Array(iterations * 32);
    for(let iter = 0; iter < iterations; iter++){
        const buf = new Uint8Array(4 + secret.length + value.length);
        buf.set(uint32be(iter + 1));
        buf.set(secret, 4);
        buf.set(value, 4 + secret.length);
        res.set(await (0, digest_js_1.default)("sha256", buf), iter * 32);
    }
    return res.slice(0, bits >> 3);
}
exports.concatKdf = concatKdf;


/***/ }),

/***/ 87744:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.bitLength = void 0;
const errors_js_1 = __webpack_require__(79927);
const random_js_1 = __webpack_require__(58595);
function bitLength(alg) {
    switch(alg){
        case "A128GCM":
            return 128;
        case "A192GCM":
            return 192;
        case "A256GCM":
        case "A128CBC-HS256":
            return 256;
        case "A192CBC-HS384":
            return 384;
        case "A256CBC-HS512":
            return 512;
        default:
            throw new errors_js_1.JOSENotSupported(`Unsupported JWE Algorithm: ${alg}`);
    }
}
exports.bitLength = bitLength;
exports["default"] = (alg)=>(0, random_js_1.default)(new Uint8Array(bitLength(alg) >> 3));


/***/ }),

/***/ 40798:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const errors_js_1 = __webpack_require__(79927);
const iv_js_1 = __webpack_require__(1093);
const checkIvLength = (enc, iv)=>{
    if (iv.length << 3 !== (0, iv_js_1.bitLength)(enc)) {
        throw new errors_js_1.JWEInvalid("Invalid Initialization Vector length");
    }
};
exports["default"] = checkIvLength;


/***/ }),

/***/ 47234:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const invalid_key_input_js_1 = __webpack_require__(77909);
const is_key_like_js_1 = __webpack_require__(74283);
const symmetricTypeCheck = (alg, key)=>{
    if (key instanceof Uint8Array) return;
    if (!(0, is_key_like_js_1.default)(key)) {
        throw new TypeError((0, invalid_key_input_js_1.withAlg)(alg, key, ...is_key_like_js_1.types, "Uint8Array"));
    }
    if (key.type !== "secret") {
        throw new TypeError(`${is_key_like_js_1.types.join(" or ")} instances for symmetric algorithms must be of type "secret"`);
    }
};
const asymmetricTypeCheck = (alg, key, usage)=>{
    if (!(0, is_key_like_js_1.default)(key)) {
        throw new TypeError((0, invalid_key_input_js_1.withAlg)(alg, key, ...is_key_like_js_1.types));
    }
    if (key.type === "secret") {
        throw new TypeError(`${is_key_like_js_1.types.join(" or ")} instances for asymmetric algorithms must not be of type "secret"`);
    }
    if (usage === "sign" && key.type === "public") {
        throw new TypeError(`${is_key_like_js_1.types.join(" or ")} instances for asymmetric algorithm signing must be of type "private"`);
    }
    if (usage === "decrypt" && key.type === "public") {
        throw new TypeError(`${is_key_like_js_1.types.join(" or ")} instances for asymmetric algorithm decryption must be of type "private"`);
    }
    if (key.algorithm && usage === "verify" && key.type === "private") {
        throw new TypeError(`${is_key_like_js_1.types.join(" or ")} instances for asymmetric algorithm verifying must be of type "public"`);
    }
    if (key.algorithm && usage === "encrypt" && key.type === "private") {
        throw new TypeError(`${is_key_like_js_1.types.join(" or ")} instances for asymmetric algorithm encryption must be of type "public"`);
    }
};
const checkKeyType = (alg, key, usage)=>{
    const symmetric = alg.startsWith("HS") || alg === "dir" || alg.startsWith("PBES2") || /^A\d{3}(?:GCM)?KW$/.test(alg);
    if (symmetric) {
        symmetricTypeCheck(alg, key);
    } else {
        asymmetricTypeCheck(alg, key, usage);
    }
};
exports["default"] = checkKeyType;


/***/ }),

/***/ 31643:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const errors_js_1 = __webpack_require__(79927);
function checkP2s(p2s) {
    if (!(p2s instanceof Uint8Array) || p2s.length < 8) {
        throw new errors_js_1.JWEInvalid("PBES2 Salt Input must be 8 or more octets");
    }
}
exports["default"] = checkP2s;


/***/ }),

/***/ 54004:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.checkEncCryptoKey = exports.checkSigCryptoKey = void 0;
function unusable(name, prop = "algorithm.name") {
    return new TypeError(`CryptoKey does not support this operation, its ${prop} must be ${name}`);
}
function isAlgorithm(algorithm, name) {
    return algorithm.name === name;
}
function getHashLength(hash) {
    return parseInt(hash.name.slice(4), 10);
}
function getNamedCurve(alg) {
    switch(alg){
        case "ES256":
            return "P-256";
        case "ES384":
            return "P-384";
        case "ES512":
            return "P-521";
        default:
            throw new Error("unreachable");
    }
}
function checkUsage(key, usages) {
    if (usages.length && !usages.some((expected)=>key.usages.includes(expected))) {
        let msg = "CryptoKey does not support this operation, its usages must include ";
        if (usages.length > 2) {
            const last = usages.pop();
            msg += `one of ${usages.join(", ")}, or ${last}.`;
        } else if (usages.length === 2) {
            msg += `one of ${usages[0]} or ${usages[1]}.`;
        } else {
            msg += `${usages[0]}.`;
        }
        throw new TypeError(msg);
    }
}
function checkSigCryptoKey(key, alg, ...usages) {
    switch(alg){
        case "HS256":
        case "HS384":
        case "HS512":
            {
                if (!isAlgorithm(key.algorithm, "HMAC")) throw unusable("HMAC");
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, "algorithm.hash");
                break;
            }
        case "RS256":
        case "RS384":
        case "RS512":
            {
                if (!isAlgorithm(key.algorithm, "RSASSA-PKCS1-v1_5")) throw unusable("RSASSA-PKCS1-v1_5");
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, "algorithm.hash");
                break;
            }
        case "PS256":
        case "PS384":
        case "PS512":
            {
                if (!isAlgorithm(key.algorithm, "RSA-PSS")) throw unusable("RSA-PSS");
                const expected = parseInt(alg.slice(2), 10);
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, "algorithm.hash");
                break;
            }
        case "EdDSA":
            {
                if (key.algorithm.name !== "Ed25519" && key.algorithm.name !== "Ed448") {
                    throw unusable("Ed25519 or Ed448");
                }
                break;
            }
        case "ES256":
        case "ES384":
        case "ES512":
            {
                if (!isAlgorithm(key.algorithm, "ECDSA")) throw unusable("ECDSA");
                const expected = getNamedCurve(alg);
                const actual = key.algorithm.namedCurve;
                if (actual !== expected) throw unusable(expected, "algorithm.namedCurve");
                break;
            }
        default:
            throw new TypeError("CryptoKey does not support this operation");
    }
    checkUsage(key, usages);
}
exports.checkSigCryptoKey = checkSigCryptoKey;
function checkEncCryptoKey(key, alg, ...usages) {
    switch(alg){
        case "A128GCM":
        case "A192GCM":
        case "A256GCM":
            {
                if (!isAlgorithm(key.algorithm, "AES-GCM")) throw unusable("AES-GCM");
                const expected = parseInt(alg.slice(1, 4), 10);
                const actual = key.algorithm.length;
                if (actual !== expected) throw unusable(expected, "algorithm.length");
                break;
            }
        case "A128KW":
        case "A192KW":
        case "A256KW":
            {
                if (!isAlgorithm(key.algorithm, "AES-KW")) throw unusable("AES-KW");
                const expected = parseInt(alg.slice(1, 4), 10);
                const actual = key.algorithm.length;
                if (actual !== expected) throw unusable(expected, "algorithm.length");
                break;
            }
        case "ECDH":
            {
                switch(key.algorithm.name){
                    case "ECDH":
                    case "X25519":
                    case "X448":
                        break;
                    default:
                        throw unusable("ECDH, X25519, or X448");
                }
                break;
            }
        case "PBES2-HS256+A128KW":
        case "PBES2-HS384+A192KW":
        case "PBES2-HS512+A256KW":
            if (!isAlgorithm(key.algorithm, "PBKDF2")) throw unusable("PBKDF2");
            break;
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
            {
                if (!isAlgorithm(key.algorithm, "RSA-OAEP")) throw unusable("RSA-OAEP");
                const expected = parseInt(alg.slice(9), 10) || 1;
                const actual = getHashLength(key.algorithm.hash);
                if (actual !== expected) throw unusable(`SHA-${expected}`, "algorithm.hash");
                break;
            }
        default:
            throw new TypeError("CryptoKey does not support this operation");
    }
    checkUsage(key, usages);
}
exports.checkEncCryptoKey = checkEncCryptoKey;


/***/ }),

/***/ 92078:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const aeskw_js_1 = __webpack_require__(81132);
const ECDH = __webpack_require__(2183);
const pbes2kw_js_1 = __webpack_require__(32121);
const rsaes_js_1 = __webpack_require__(98745);
const base64url_js_1 = __webpack_require__(37244);
const errors_js_1 = __webpack_require__(79927);
const cek_js_1 = __webpack_require__(87744);
const import_js_1 = __webpack_require__(53844);
const check_key_type_js_1 = __webpack_require__(47234);
const is_object_js_1 = __webpack_require__(50281);
const aesgcmkw_js_1 = __webpack_require__(50751);
async function decryptKeyManagement(alg, key, encryptedKey, joseHeader, options) {
    (0, check_key_type_js_1.default)(alg, key, "decrypt");
    switch(alg){
        case "dir":
            {
                if (encryptedKey !== undefined) throw new errors_js_1.JWEInvalid("Encountered unexpected JWE Encrypted Key");
                return key;
            }
        case "ECDH-ES":
            if (encryptedKey !== undefined) throw new errors_js_1.JWEInvalid("Encountered unexpected JWE Encrypted Key");
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
            {
                if (!(0, is_object_js_1.default)(joseHeader.epk)) throw new errors_js_1.JWEInvalid(`JOSE Header "epk" (Ephemeral Public Key) missing or invalid`);
                if (!ECDH.ecdhAllowed(key)) throw new errors_js_1.JOSENotSupported("ECDH with the provided key is not allowed or not supported by your javascript runtime");
                const epk = await (0, import_js_1.importJWK)(joseHeader.epk, alg);
                let partyUInfo;
                let partyVInfo;
                if (joseHeader.apu !== undefined) {
                    if (typeof joseHeader.apu !== "string") throw new errors_js_1.JWEInvalid(`JOSE Header "apu" (Agreement PartyUInfo) invalid`);
                    try {
                        partyUInfo = (0, base64url_js_1.decode)(joseHeader.apu);
                    } catch  {
                        throw new errors_js_1.JWEInvalid("Failed to base64url decode the apu");
                    }
                }
                if (joseHeader.apv !== undefined) {
                    if (typeof joseHeader.apv !== "string") throw new errors_js_1.JWEInvalid(`JOSE Header "apv" (Agreement PartyVInfo) invalid`);
                    try {
                        partyVInfo = (0, base64url_js_1.decode)(joseHeader.apv);
                    } catch  {
                        throw new errors_js_1.JWEInvalid("Failed to base64url decode the apv");
                    }
                }
                const sharedSecret = await ECDH.deriveKey(epk, key, alg === "ECDH-ES" ? joseHeader.enc : alg, alg === "ECDH-ES" ? (0, cek_js_1.bitLength)(joseHeader.enc) : parseInt(alg.slice(-5, -2), 10), partyUInfo, partyVInfo);
                if (alg === "ECDH-ES") return sharedSecret;
                if (encryptedKey === undefined) throw new errors_js_1.JWEInvalid("JWE Encrypted Key missing");
                return (0, aeskw_js_1.unwrap)(alg.slice(-6), sharedSecret, encryptedKey);
            }
        case "RSA1_5":
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
            {
                if (encryptedKey === undefined) throw new errors_js_1.JWEInvalid("JWE Encrypted Key missing");
                return (0, rsaes_js_1.decrypt)(alg, key, encryptedKey);
            }
        case "PBES2-HS256+A128KW":
        case "PBES2-HS384+A192KW":
        case "PBES2-HS512+A256KW":
            {
                if (encryptedKey === undefined) throw new errors_js_1.JWEInvalid("JWE Encrypted Key missing");
                if (typeof joseHeader.p2c !== "number") throw new errors_js_1.JWEInvalid(`JOSE Header "p2c" (PBES2 Count) missing or invalid`);
                const p2cLimit = (options === null || options === void 0 ? void 0 : options.maxPBES2Count) || 10000;
                if (joseHeader.p2c > p2cLimit) throw new errors_js_1.JWEInvalid(`JOSE Header "p2c" (PBES2 Count) out is of acceptable bounds`);
                if (typeof joseHeader.p2s !== "string") throw new errors_js_1.JWEInvalid(`JOSE Header "p2s" (PBES2 Salt) missing or invalid`);
                let p2s;
                try {
                    p2s = (0, base64url_js_1.decode)(joseHeader.p2s);
                } catch  {
                    throw new errors_js_1.JWEInvalid("Failed to base64url decode the p2s");
                }
                return (0, pbes2kw_js_1.decrypt)(alg, key, encryptedKey, joseHeader.p2c, p2s);
            }
        case "A128KW":
        case "A192KW":
        case "A256KW":
            {
                if (encryptedKey === undefined) throw new errors_js_1.JWEInvalid("JWE Encrypted Key missing");
                return (0, aeskw_js_1.unwrap)(alg, key, encryptedKey);
            }
        case "A128GCMKW":
        case "A192GCMKW":
        case "A256GCMKW":
            {
                if (encryptedKey === undefined) throw new errors_js_1.JWEInvalid("JWE Encrypted Key missing");
                if (typeof joseHeader.iv !== "string") throw new errors_js_1.JWEInvalid(`JOSE Header "iv" (Initialization Vector) missing or invalid`);
                if (typeof joseHeader.tag !== "string") throw new errors_js_1.JWEInvalid(`JOSE Header "tag" (Authentication Tag) missing or invalid`);
                let iv;
                try {
                    iv = (0, base64url_js_1.decode)(joseHeader.iv);
                } catch  {
                    throw new errors_js_1.JWEInvalid("Failed to base64url decode the iv");
                }
                let tag;
                try {
                    tag = (0, base64url_js_1.decode)(joseHeader.tag);
                } catch  {
                    throw new errors_js_1.JWEInvalid("Failed to base64url decode the tag");
                }
                return (0, aesgcmkw_js_1.unwrap)(alg, key, encryptedKey, iv, tag);
            }
        default:
            {
                throw new errors_js_1.JOSENotSupported('Invalid or unsupported "alg" (JWE Algorithm) header value');
            }
    }
}
exports["default"] = decryptKeyManagement;


/***/ }),

/***/ 35255:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const aeskw_js_1 = __webpack_require__(81132);
const ECDH = __webpack_require__(2183);
const pbes2kw_js_1 = __webpack_require__(32121);
const rsaes_js_1 = __webpack_require__(98745);
const base64url_js_1 = __webpack_require__(37244);
const cek_js_1 = __webpack_require__(87744);
const errors_js_1 = __webpack_require__(79927);
const export_js_1 = __webpack_require__(30107);
const check_key_type_js_1 = __webpack_require__(47234);
const aesgcmkw_js_1 = __webpack_require__(50751);
async function encryptKeyManagement(alg, enc, key, providedCek, providedParameters = {}) {
    let encryptedKey;
    let parameters;
    let cek;
    (0, check_key_type_js_1.default)(alg, key, "encrypt");
    switch(alg){
        case "dir":
            {
                cek = key;
                break;
            }
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
            {
                if (!ECDH.ecdhAllowed(key)) {
                    throw new errors_js_1.JOSENotSupported("ECDH with the provided key is not allowed or not supported by your javascript runtime");
                }
                const { apu, apv } = providedParameters;
                let { epk: ephemeralKey } = providedParameters;
                ephemeralKey || (ephemeralKey = (await ECDH.generateEpk(key)).privateKey);
                const { x, y, crv, kty } = await (0, export_js_1.exportJWK)(ephemeralKey);
                const sharedSecret = await ECDH.deriveKey(key, ephemeralKey, alg === "ECDH-ES" ? enc : alg, alg === "ECDH-ES" ? (0, cek_js_1.bitLength)(enc) : parseInt(alg.slice(-5, -2), 10), apu, apv);
                parameters = {
                    epk: {
                        x,
                        crv,
                        kty
                    }
                };
                if (kty === "EC") parameters.epk.y = y;
                if (apu) parameters.apu = (0, base64url_js_1.encode)(apu);
                if (apv) parameters.apv = (0, base64url_js_1.encode)(apv);
                if (alg === "ECDH-ES") {
                    cek = sharedSecret;
                    break;
                }
                cek = providedCek || (0, cek_js_1.default)(enc);
                const kwAlg = alg.slice(-6);
                encryptedKey = await (0, aeskw_js_1.wrap)(kwAlg, sharedSecret, cek);
                break;
            }
        case "RSA1_5":
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
            {
                cek = providedCek || (0, cek_js_1.default)(enc);
                encryptedKey = await (0, rsaes_js_1.encrypt)(alg, key, cek);
                break;
            }
        case "PBES2-HS256+A128KW":
        case "PBES2-HS384+A192KW":
        case "PBES2-HS512+A256KW":
            {
                cek = providedCek || (0, cek_js_1.default)(enc);
                const { p2c, p2s } = providedParameters;
                ({ encryptedKey, ...parameters } = await (0, pbes2kw_js_1.encrypt)(alg, key, cek, p2c, p2s));
                break;
            }
        case "A128KW":
        case "A192KW":
        case "A256KW":
            {
                cek = providedCek || (0, cek_js_1.default)(enc);
                encryptedKey = await (0, aeskw_js_1.wrap)(alg, key, cek);
                break;
            }
        case "A128GCMKW":
        case "A192GCMKW":
        case "A256GCMKW":
            {
                cek = providedCek || (0, cek_js_1.default)(enc);
                const { iv } = providedParameters;
                ({ encryptedKey, ...parameters } = await (0, aesgcmkw_js_1.wrap)(alg, key, cek, iv));
                break;
            }
        default:
            {
                throw new errors_js_1.JOSENotSupported('Invalid or unsupported "alg" (JWE Algorithm) header value');
            }
    }
    return {
        cek,
        encryptedKey,
        parameters
    };
}
exports["default"] = encryptKeyManagement;


/***/ }),

/***/ 92155:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = (date)=>Math.floor(date.getTime() / 1000);


/***/ }),

/***/ 77909:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.withAlg = void 0;
function message(msg, actual, ...types) {
    if (types.length > 2) {
        const last = types.pop();
        msg += `one of type ${types.join(", ")}, or ${last}.`;
    } else if (types.length === 2) {
        msg += `one of type ${types[0]} or ${types[1]}.`;
    } else {
        msg += `of type ${types[0]}.`;
    }
    if (actual == null) {
        msg += ` Received ${actual}`;
    } else if (typeof actual === "function" && actual.name) {
        msg += ` Received function ${actual.name}`;
    } else if (typeof actual === "object" && actual != null) {
        if (actual.constructor && actual.constructor.name) {
            msg += ` Received an instance of ${actual.constructor.name}`;
        }
    }
    return msg;
}
exports["default"] = (actual, ...types)=>{
    return message("Key must be ", actual, ...types);
};
function withAlg(alg, actual, ...types) {
    return message(`Key for the ${alg} algorithm must be `, actual, ...types);
}
exports.withAlg = withAlg;


/***/ }),

/***/ 1223:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const isDisjoint = (...headers)=>{
    const sources = headers.filter(Boolean);
    if (sources.length === 0 || sources.length === 1) {
        return true;
    }
    let acc;
    for (const header of sources){
        const parameters = Object.keys(header);
        if (!acc || acc.size === 0) {
            acc = new Set(parameters);
            continue;
        }
        for (const parameter of parameters){
            if (acc.has(parameter)) {
                return false;
            }
            acc.add(parameter);
        }
    }
    return true;
};
exports["default"] = isDisjoint;


/***/ }),

/***/ 50281:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
function isObjectLike(value) {
    return typeof value === "object" && value !== null;
}
function isObject(input) {
    if (!isObjectLike(input) || Object.prototype.toString.call(input) !== "[object Object]") {
        return false;
    }
    if (Object.getPrototypeOf(input) === null) {
        return true;
    }
    let proto = input;
    while(Object.getPrototypeOf(proto) !== null){
        proto = Object.getPrototypeOf(proto);
    }
    return Object.getPrototypeOf(input) === proto;
}
exports["default"] = isObject;


/***/ }),

/***/ 1093:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.bitLength = void 0;
const errors_js_1 = __webpack_require__(79927);
const random_js_1 = __webpack_require__(58595);
function bitLength(alg) {
    switch(alg){
        case "A128GCM":
        case "A128GCMKW":
        case "A192GCM":
        case "A192GCMKW":
        case "A256GCM":
        case "A256GCMKW":
            return 96;
        case "A128CBC-HS256":
        case "A192CBC-HS384":
        case "A256CBC-HS512":
            return 128;
        default:
            throw new errors_js_1.JOSENotSupported(`Unsupported JWE Algorithm: ${alg}`);
    }
}
exports.bitLength = bitLength;
exports["default"] = (alg)=>(0, random_js_1.default)(new Uint8Array(bitLength(alg) >> 3));


/***/ }),

/***/ 65455:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const errors_js_1 = __webpack_require__(79927);
const buffer_utils_js_1 = __webpack_require__(43807);
const epoch_js_1 = __webpack_require__(92155);
const secs_js_1 = __webpack_require__(91540);
const is_object_js_1 = __webpack_require__(50281);
const normalizeTyp = (value)=>value.toLowerCase().replace(/^application\//, "");
const checkAudiencePresence = (audPayload, audOption)=>{
    if (typeof audPayload === "string") {
        return audOption.includes(audPayload);
    }
    if (Array.isArray(audPayload)) {
        return audOption.some(Set.prototype.has.bind(new Set(audPayload)));
    }
    return false;
};
exports["default"] = (protectedHeader, encodedPayload, options = {})=>{
    const { typ } = options;
    if (typ && (typeof protectedHeader.typ !== "string" || normalizeTyp(protectedHeader.typ) !== normalizeTyp(typ))) {
        throw new errors_js_1.JWTClaimValidationFailed('unexpected "typ" JWT header value', "typ", "check_failed");
    }
    let payload;
    try {
        payload = JSON.parse(buffer_utils_js_1.decoder.decode(encodedPayload));
    } catch  {}
    if (!(0, is_object_js_1.default)(payload)) {
        throw new errors_js_1.JWTInvalid("JWT Claims Set must be a top-level JSON object");
    }
    const { requiredClaims = [], issuer, subject, audience, maxTokenAge } = options;
    if (maxTokenAge !== undefined) requiredClaims.push("iat");
    if (audience !== undefined) requiredClaims.push("aud");
    if (subject !== undefined) requiredClaims.push("sub");
    if (issuer !== undefined) requiredClaims.push("iss");
    for (const claim of new Set(requiredClaims.reverse())){
        if (!(claim in payload)) {
            throw new errors_js_1.JWTClaimValidationFailed(`missing required "${claim}" claim`, claim, "missing");
        }
    }
    if (issuer && !(Array.isArray(issuer) ? issuer : [
        issuer
    ]).includes(payload.iss)) {
        throw new errors_js_1.JWTClaimValidationFailed('unexpected "iss" claim value', "iss", "check_failed");
    }
    if (subject && payload.sub !== subject) {
        throw new errors_js_1.JWTClaimValidationFailed('unexpected "sub" claim value', "sub", "check_failed");
    }
    if (audience && !checkAudiencePresence(payload.aud, typeof audience === "string" ? [
        audience
    ] : audience)) {
        throw new errors_js_1.JWTClaimValidationFailed('unexpected "aud" claim value', "aud", "check_failed");
    }
    let tolerance;
    switch(typeof options.clockTolerance){
        case "string":
            tolerance = (0, secs_js_1.default)(options.clockTolerance);
            break;
        case "number":
            tolerance = options.clockTolerance;
            break;
        case "undefined":
            tolerance = 0;
            break;
        default:
            throw new TypeError("Invalid clockTolerance option type");
    }
    const { currentDate } = options;
    const now = (0, epoch_js_1.default)(currentDate || new Date());
    if ((payload.iat !== undefined || maxTokenAge) && typeof payload.iat !== "number") {
        throw new errors_js_1.JWTClaimValidationFailed('"iat" claim must be a number', "iat", "invalid");
    }
    if (payload.nbf !== undefined) {
        if (typeof payload.nbf !== "number") {
            throw new errors_js_1.JWTClaimValidationFailed('"nbf" claim must be a number', "nbf", "invalid");
        }
        if (payload.nbf > now + tolerance) {
            throw new errors_js_1.JWTClaimValidationFailed('"nbf" claim timestamp check failed', "nbf", "check_failed");
        }
    }
    if (payload.exp !== undefined) {
        if (typeof payload.exp !== "number") {
            throw new errors_js_1.JWTClaimValidationFailed('"exp" claim must be a number', "exp", "invalid");
        }
        if (payload.exp <= now - tolerance) {
            throw new errors_js_1.JWTExpired('"exp" claim timestamp check failed', "exp", "check_failed");
        }
    }
    if (maxTokenAge) {
        const age = now - payload.iat;
        const max = typeof maxTokenAge === "number" ? maxTokenAge : (0, secs_js_1.default)(maxTokenAge);
        if (age - tolerance > max) {
            throw new errors_js_1.JWTExpired('"iat" claim timestamp check failed (too far in the past)', "iat", "check_failed");
        }
        if (age < 0 - tolerance) {
            throw new errors_js_1.JWTClaimValidationFailed('"iat" claim timestamp check failed (it should be in the past)', "iat", "check_failed");
        }
    }
    return payload;
};


/***/ }),

/***/ 91540:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const minute = 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
const year = day * 365.25;
const REGEX = /^(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)$/i;
exports["default"] = (str)=>{
    const matched = REGEX.exec(str);
    if (!matched) {
        throw new TypeError("Invalid time period format");
    }
    const value = parseFloat(matched[1]);
    const unit = matched[2].toLowerCase();
    switch(unit){
        case "sec":
        case "secs":
        case "second":
        case "seconds":
        case "s":
            return Math.round(value);
        case "minute":
        case "minutes":
        case "min":
        case "mins":
        case "m":
            return Math.round(value * minute);
        case "hour":
        case "hours":
        case "hr":
        case "hrs":
        case "h":
            return Math.round(value * hour);
        case "day":
        case "days":
        case "d":
            return Math.round(value * day);
        case "week":
        case "weeks":
        case "w":
            return Math.round(value * week);
        default:
            return Math.round(value * year);
    }
};


/***/ }),

/***/ 1524:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const validateAlgorithms = (option, algorithms)=>{
    if (algorithms !== undefined && (!Array.isArray(algorithms) || algorithms.some((s)=>typeof s !== "string"))) {
        throw new TypeError(`"${option}" option must be an array of strings`);
    }
    if (!algorithms) {
        return undefined;
    }
    return new Set(algorithms);
};
exports["default"] = validateAlgorithms;


/***/ }),

/***/ 51534:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const errors_js_1 = __webpack_require__(79927);
function validateCrit(Err, recognizedDefault, recognizedOption, protectedHeader, joseHeader) {
    if (joseHeader.crit !== undefined && protectedHeader.crit === undefined) {
        throw new Err('"crit" (Critical) Header Parameter MUST be integrity protected');
    }
    if (!protectedHeader || protectedHeader.crit === undefined) {
        return new Set();
    }
    if (!Array.isArray(protectedHeader.crit) || protectedHeader.crit.length === 0 || protectedHeader.crit.some((input)=>typeof input !== "string" || input.length === 0)) {
        throw new Err('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');
    }
    let recognized;
    if (recognizedOption !== undefined) {
        recognized = new Map([
            ...Object.entries(recognizedOption),
            ...recognizedDefault.entries()
        ]);
    } else {
        recognized = recognizedDefault;
    }
    for (const parameter of protectedHeader.crit){
        if (!recognized.has(parameter)) {
            throw new errors_js_1.JOSENotSupported(`Extension Header Parameter "${parameter}" is not recognized`);
        }
        if (joseHeader[parameter] === undefined) {
            throw new Err(`Extension Header Parameter "${parameter}" is missing`);
        } else if (recognized.get(parameter) && protectedHeader[parameter] === undefined) {
            throw new Err(`Extension Header Parameter "${parameter}" MUST be integrity protected`);
        }
    }
    return new Set(protectedHeader.crit);
}
exports["default"] = validateCrit;


/***/ }),

/***/ 81132:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.unwrap = exports.wrap = void 0;
const buffer_1 = __webpack_require__(14300);
const crypto_1 = __webpack_require__(6113);
const errors_js_1 = __webpack_require__(79927);
const buffer_utils_js_1 = __webpack_require__(43807);
const webcrypto_js_1 = __webpack_require__(10557);
const crypto_key_js_1 = __webpack_require__(54004);
const is_key_object_js_1 = __webpack_require__(19205);
const invalid_key_input_js_1 = __webpack_require__(77909);
const ciphers_js_1 = __webpack_require__(88419);
const is_key_like_js_1 = __webpack_require__(74283);
function checkKeySize(key, alg) {
    if (key.symmetricKeySize << 3 !== parseInt(alg.slice(1, 4), 10)) {
        throw new TypeError(`Invalid key size for alg: ${alg}`);
    }
}
function ensureKeyObject(key, alg, usage) {
    if ((0, is_key_object_js_1.default)(key)) {
        return key;
    }
    if (key instanceof Uint8Array) {
        return (0, crypto_1.createSecretKey)(key);
    }
    if ((0, webcrypto_js_1.isCryptoKey)(key)) {
        (0, crypto_key_js_1.checkEncCryptoKey)(key, alg, usage);
        return crypto_1.KeyObject.from(key);
    }
    throw new TypeError((0, invalid_key_input_js_1.default)(key, ...is_key_like_js_1.types, "Uint8Array"));
}
const wrap = (alg, key, cek)=>{
    const size = parseInt(alg.slice(1, 4), 10);
    const algorithm = `aes${size}-wrap`;
    if (!(0, ciphers_js_1.default)(algorithm)) {
        throw new errors_js_1.JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
    const keyObject = ensureKeyObject(key, alg, "wrapKey");
    checkKeySize(keyObject, alg);
    const cipher = (0, crypto_1.createCipheriv)(algorithm, keyObject, buffer_1.Buffer.alloc(8, 0xa6));
    return (0, buffer_utils_js_1.concat)(cipher.update(cek), cipher.final());
};
exports.wrap = wrap;
const unwrap = (alg, key, encryptedKey)=>{
    const size = parseInt(alg.slice(1, 4), 10);
    const algorithm = `aes${size}-wrap`;
    if (!(0, ciphers_js_1.default)(algorithm)) {
        throw new errors_js_1.JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
    const keyObject = ensureKeyObject(key, alg, "unwrapKey");
    checkKeySize(keyObject, alg);
    const cipher = (0, crypto_1.createDecipheriv)(algorithm, keyObject, buffer_1.Buffer.alloc(8, 0xa6));
    return (0, buffer_utils_js_1.concat)(cipher.update(encryptedKey), cipher.final());
};
exports.unwrap = unwrap;


/***/ }),

/***/ 23794:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.fromX509 = exports.fromSPKI = exports.fromPKCS8 = exports.toPKCS8 = exports.toSPKI = void 0;
const crypto_1 = __webpack_require__(6113);
const buffer_1 = __webpack_require__(14300);
const webcrypto_js_1 = __webpack_require__(10557);
const is_key_object_js_1 = __webpack_require__(19205);
const invalid_key_input_js_1 = __webpack_require__(77909);
const is_key_like_js_1 = __webpack_require__(74283);
const genericExport = (keyType, keyFormat, key)=>{
    let keyObject;
    if ((0, webcrypto_js_1.isCryptoKey)(key)) {
        if (!key.extractable) {
            throw new TypeError("CryptoKey is not extractable");
        }
        keyObject = crypto_1.KeyObject.from(key);
    } else if ((0, is_key_object_js_1.default)(key)) {
        keyObject = key;
    } else {
        throw new TypeError((0, invalid_key_input_js_1.default)(key, ...is_key_like_js_1.types));
    }
    if (keyObject.type !== keyType) {
        throw new TypeError(`key is not a ${keyType} key`);
    }
    return keyObject.export({
        format: "pem",
        type: keyFormat
    });
};
const toSPKI = (key)=>{
    return genericExport("public", "spki", key);
};
exports.toSPKI = toSPKI;
const toPKCS8 = (key)=>{
    return genericExport("private", "pkcs8", key);
};
exports.toPKCS8 = toPKCS8;
const fromPKCS8 = (pem)=>(0, crypto_1.createPrivateKey)({
        key: buffer_1.Buffer.from(pem.replace(/(?:-----(?:BEGIN|END) PRIVATE KEY-----|\s)/g, ""), "base64"),
        type: "pkcs8",
        format: "der"
    });
exports.fromPKCS8 = fromPKCS8;
const fromSPKI = (pem)=>(0, crypto_1.createPublicKey)({
        key: buffer_1.Buffer.from(pem.replace(/(?:-----(?:BEGIN|END) PUBLIC KEY-----|\s)/g, ""), "base64"),
        type: "spki",
        format: "der"
    });
exports.fromSPKI = fromSPKI;
const fromX509 = (pem)=>(0, crypto_1.createPublicKey)({
        key: pem,
        type: "spki",
        format: "pem"
    });
exports.fromX509 = fromX509;


/***/ }),

/***/ 25812:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const tagInteger = 0x02;
const tagSequence = 0x30;
class Asn1SequenceDecoder {
    constructor(buffer){
        if (buffer[0] !== tagSequence) {
            throw new TypeError();
        }
        this.buffer = buffer;
        this.offset = 1;
        const len = this.decodeLength();
        if (len !== buffer.length - this.offset) {
            throw new TypeError();
        }
    }
    decodeLength() {
        let length = this.buffer[this.offset++];
        if (length & 0x80) {
            const nBytes = length & ~0x80;
            length = 0;
            for(let i = 0; i < nBytes; i++)length = length << 8 | this.buffer[this.offset + i];
            this.offset += nBytes;
        }
        return length;
    }
    unsignedInteger() {
        if (this.buffer[this.offset++] !== tagInteger) {
            throw new TypeError();
        }
        let length = this.decodeLength();
        if (this.buffer[this.offset] === 0) {
            this.offset++;
            length--;
        }
        const result = this.buffer.slice(this.offset, this.offset + length);
        this.offset += length;
        return result;
    }
    end() {
        if (this.offset !== this.buffer.length) {
            throw new TypeError();
        }
    }
}
exports["default"] = Asn1SequenceDecoder;


/***/ }),

/***/ 56879:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const buffer_1 = __webpack_require__(14300);
const errors_js_1 = __webpack_require__(79927);
const tagInteger = 0x02;
const tagBitStr = 0x03;
const tagOctStr = 0x04;
const tagSequence = 0x30;
const bZero = buffer_1.Buffer.from([
    0x00
]);
const bTagInteger = buffer_1.Buffer.from([
    tagInteger
]);
const bTagBitStr = buffer_1.Buffer.from([
    tagBitStr
]);
const bTagSequence = buffer_1.Buffer.from([
    tagSequence
]);
const bTagOctStr = buffer_1.Buffer.from([
    tagOctStr
]);
const encodeLength = (len)=>{
    if (len < 128) return buffer_1.Buffer.from([
        len
    ]);
    const buffer = buffer_1.Buffer.alloc(5);
    buffer.writeUInt32BE(len, 1);
    let offset = 1;
    while(buffer[offset] === 0)offset++;
    buffer[offset - 1] = 0x80 | 5 - offset;
    return buffer.slice(offset - 1);
};
const oids = new Map([
    [
        "P-256",
        buffer_1.Buffer.from("06 08 2A 86 48 CE 3D 03 01 07".replace(/ /g, ""), "hex")
    ],
    [
        "secp256k1",
        buffer_1.Buffer.from("06 05 2B 81 04 00 0A".replace(/ /g, ""), "hex")
    ],
    [
        "P-384",
        buffer_1.Buffer.from("06 05 2B 81 04 00 22".replace(/ /g, ""), "hex")
    ],
    [
        "P-521",
        buffer_1.Buffer.from("06 05 2B 81 04 00 23".replace(/ /g, ""), "hex")
    ],
    [
        "ecPublicKey",
        buffer_1.Buffer.from("06 07 2A 86 48 CE 3D 02 01".replace(/ /g, ""), "hex")
    ],
    [
        "X25519",
        buffer_1.Buffer.from("06 03 2B 65 6E".replace(/ /g, ""), "hex")
    ],
    [
        "X448",
        buffer_1.Buffer.from("06 03 2B 65 6F".replace(/ /g, ""), "hex")
    ],
    [
        "Ed25519",
        buffer_1.Buffer.from("06 03 2B 65 70".replace(/ /g, ""), "hex")
    ],
    [
        "Ed448",
        buffer_1.Buffer.from("06 03 2B 65 71".replace(/ /g, ""), "hex")
    ]
]);
class DumbAsn1Encoder {
    constructor(){
        this.length = 0;
        this.elements = [];
    }
    oidFor(oid) {
        const bOid = oids.get(oid);
        if (!bOid) {
            throw new errors_js_1.JOSENotSupported("Invalid or unsupported OID");
        }
        this.elements.push(bOid);
        this.length += bOid.length;
    }
    zero() {
        this.elements.push(bTagInteger, buffer_1.Buffer.from([
            0x01
        ]), bZero);
        this.length += 3;
    }
    one() {
        this.elements.push(bTagInteger, buffer_1.Buffer.from([
            0x01
        ]), buffer_1.Buffer.from([
            0x01
        ]));
        this.length += 3;
    }
    unsignedInteger(integer) {
        if (integer[0] & 0x80) {
            const len = encodeLength(integer.length + 1);
            this.elements.push(bTagInteger, len, bZero, integer);
            this.length += 2 + len.length + integer.length;
        } else {
            let i = 0;
            while(integer[i] === 0 && (integer[i + 1] & 0x80) === 0)i++;
            const len = encodeLength(integer.length - i);
            this.elements.push(bTagInteger, encodeLength(integer.length - i), integer.slice(i));
            this.length += 1 + len.length + integer.length - i;
        }
    }
    octStr(octStr) {
        const len = encodeLength(octStr.length);
        this.elements.push(bTagOctStr, encodeLength(octStr.length), octStr);
        this.length += 1 + len.length + octStr.length;
    }
    bitStr(bitS) {
        const len = encodeLength(bitS.length + 1);
        this.elements.push(bTagBitStr, encodeLength(bitS.length + 1), bZero, bitS);
        this.length += 1 + len.length + bitS.length + 1;
    }
    add(seq) {
        this.elements.push(seq);
        this.length += seq.length;
    }
    end(tag = bTagSequence) {
        const len = encodeLength(this.length);
        return buffer_1.Buffer.concat([
            tag,
            len,
            ...this.elements
        ], 1 + len.length + this.length);
    }
}
exports["default"] = DumbAsn1Encoder;


/***/ }),

/***/ 37244:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.decode = exports.encode = exports.encodeBase64 = exports.decodeBase64 = void 0;
const buffer_1 = __webpack_require__(14300);
const buffer_utils_js_1 = __webpack_require__(43807);
let encode;
function normalize(input) {
    let encoded = input;
    if (encoded instanceof Uint8Array) {
        encoded = buffer_utils_js_1.decoder.decode(encoded);
    }
    return encoded;
}
if (buffer_1.Buffer.isEncoding("base64url")) {
    exports.encode = encode = (input)=>buffer_1.Buffer.from(input).toString("base64url");
} else {
    exports.encode = encode = (input)=>buffer_1.Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}
const decodeBase64 = (input)=>buffer_1.Buffer.from(input, "base64");
exports.decodeBase64 = decodeBase64;
const encodeBase64 = (input)=>buffer_1.Buffer.from(input).toString("base64");
exports.encodeBase64 = encodeBase64;
const decode = (input)=>buffer_1.Buffer.from(normalize(input), "base64");
exports.decode = decode;


/***/ }),

/***/ 16872:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const crypto_1 = __webpack_require__(6113);
const buffer_utils_js_1 = __webpack_require__(43807);
function cbcTag(aad, iv, ciphertext, macSize, macKey, keySize) {
    const macData = (0, buffer_utils_js_1.concat)(aad, iv, ciphertext, (0, buffer_utils_js_1.uint64be)(aad.length << 3));
    const hmac = (0, crypto_1.createHmac)(`sha${macSize}`, macKey);
    hmac.update(macData);
    return hmac.digest().slice(0, keySize >> 3);
}
exports["default"] = cbcTag;


/***/ }),

/***/ 54901:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const errors_js_1 = __webpack_require__(79927);
const is_key_object_js_1 = __webpack_require__(19205);
const checkCekLength = (enc, cek)=>{
    let expected;
    switch(enc){
        case "A128CBC-HS256":
        case "A192CBC-HS384":
        case "A256CBC-HS512":
            expected = parseInt(enc.slice(-3), 10);
            break;
        case "A128GCM":
        case "A192GCM":
        case "A256GCM":
            expected = parseInt(enc.slice(1, 4), 10);
            break;
        default:
            throw new errors_js_1.JOSENotSupported(`Content Encryption Algorithm ${enc} is not supported either by JOSE or your javascript runtime`);
    }
    if (cek instanceof Uint8Array) {
        const actual = cek.byteLength << 3;
        if (actual !== expected) {
            throw new errors_js_1.JWEInvalid(`Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`);
        }
        return;
    }
    if ((0, is_key_object_js_1.default)(cek) && cek.type === "secret") {
        const actual = cek.symmetricKeySize << 3;
        if (actual !== expected) {
            throw new errors_js_1.JWEInvalid(`Invalid Content Encryption Key length. Expected ${expected} bits, got ${actual} bits`);
        }
        return;
    }
    throw new TypeError("Invalid Content Encryption Key type");
};
exports["default"] = checkCekLength;


/***/ }),

/***/ 80409:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.setModulusLength = exports.weakMap = void 0;
exports.weakMap = new WeakMap();
const getLength = (buf, index)=>{
    let len = buf.readUInt8(1);
    if ((len & 0x80) === 0) {
        if (index === 0) {
            return len;
        }
        return getLength(buf.subarray(2 + len), index - 1);
    }
    const num = len & 0x7f;
    len = 0;
    for(let i = 0; i < num; i++){
        len <<= 8;
        const j = buf.readUInt8(2 + i);
        len |= j;
    }
    if (index === 0) {
        return len;
    }
    return getLength(buf.subarray(2 + len), index - 1);
};
const getLengthOfSeqIndex = (sequence, index)=>{
    const len = sequence.readUInt8(1);
    if ((len & 0x80) === 0) {
        return getLength(sequence.subarray(2), index);
    }
    const num = len & 0x7f;
    return getLength(sequence.subarray(2 + num), index);
};
const getModulusLength = (key)=>{
    var _a, _b;
    if (exports.weakMap.has(key)) {
        return exports.weakMap.get(key);
    }
    const modulusLength = (_b = (_a = key.asymmetricKeyDetails) === null || _a === void 0 ? void 0 : _a.modulusLength) !== null && _b !== void 0 ? _b : getLengthOfSeqIndex(key.export({
        format: "der",
        type: "pkcs1"
    }), key.type === "private" ? 1 : 0) - 1 << 3;
    exports.weakMap.set(key, modulusLength);
    return modulusLength;
};
const setModulusLength = (keyObject, modulusLength)=>{
    exports.weakMap.set(keyObject, modulusLength);
};
exports.setModulusLength = setModulusLength;
exports["default"] = (key, alg)=>{
    if (getModulusLength(key) < 2048) {
        throw new TypeError(`${alg} requires key modulusLength to be 2048 bits or larger`);
    }
};


/***/ }),

/***/ 88419:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const crypto_1 = __webpack_require__(6113);
let ciphers;
exports["default"] = (algorithm)=>{
    ciphers || (ciphers = new Set((0, crypto_1.getCiphers)()));
    return ciphers.has(algorithm);
};


/***/ }),

/***/ 44225:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const crypto_1 = __webpack_require__(6113);
const check_iv_length_js_1 = __webpack_require__(40798);
const check_cek_length_js_1 = __webpack_require__(54901);
const buffer_utils_js_1 = __webpack_require__(43807);
const errors_js_1 = __webpack_require__(79927);
const timing_safe_equal_js_1 = __webpack_require__(80601);
const cbc_tag_js_1 = __webpack_require__(16872);
const webcrypto_js_1 = __webpack_require__(10557);
const crypto_key_js_1 = __webpack_require__(54004);
const is_key_object_js_1 = __webpack_require__(19205);
const invalid_key_input_js_1 = __webpack_require__(77909);
const ciphers_js_1 = __webpack_require__(88419);
const is_key_like_js_1 = __webpack_require__(74283);
function cbcDecrypt(enc, cek, ciphertext, iv, tag, aad) {
    const keySize = parseInt(enc.slice(1, 4), 10);
    if ((0, is_key_object_js_1.default)(cek)) {
        cek = cek.export();
    }
    const encKey = cek.subarray(keySize >> 3);
    const macKey = cek.subarray(0, keySize >> 3);
    const macSize = parseInt(enc.slice(-3), 10);
    const algorithm = `aes-${keySize}-cbc`;
    if (!(0, ciphers_js_1.default)(algorithm)) {
        throw new errors_js_1.JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    const expectedTag = (0, cbc_tag_js_1.default)(aad, iv, ciphertext, macSize, macKey, keySize);
    let macCheckPassed;
    try {
        macCheckPassed = (0, timing_safe_equal_js_1.default)(tag, expectedTag);
    } catch  {}
    if (!macCheckPassed) {
        throw new errors_js_1.JWEDecryptionFailed();
    }
    let plaintext;
    try {
        const decipher = (0, crypto_1.createDecipheriv)(algorithm, encKey, iv);
        plaintext = (0, buffer_utils_js_1.concat)(decipher.update(ciphertext), decipher.final());
    } catch  {}
    if (!plaintext) {
        throw new errors_js_1.JWEDecryptionFailed();
    }
    return plaintext;
}
function gcmDecrypt(enc, cek, ciphertext, iv, tag, aad) {
    const keySize = parseInt(enc.slice(1, 4), 10);
    const algorithm = `aes-${keySize}-gcm`;
    if (!(0, ciphers_js_1.default)(algorithm)) {
        throw new errors_js_1.JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    try {
        const decipher = (0, crypto_1.createDecipheriv)(algorithm, cek, iv, {
            authTagLength: 16
        });
        decipher.setAuthTag(tag);
        if (aad.byteLength) {
            decipher.setAAD(aad, {
                plaintextLength: ciphertext.length
            });
        }
        const plaintext = decipher.update(ciphertext);
        decipher.final();
        return plaintext;
    } catch  {
        throw new errors_js_1.JWEDecryptionFailed();
    }
}
const decrypt = (enc, cek, ciphertext, iv, tag, aad)=>{
    let key;
    if ((0, webcrypto_js_1.isCryptoKey)(cek)) {
        (0, crypto_key_js_1.checkEncCryptoKey)(cek, enc, "decrypt");
        key = crypto_1.KeyObject.from(cek);
    } else if (cek instanceof Uint8Array || (0, is_key_object_js_1.default)(cek)) {
        key = cek;
    } else {
        throw new TypeError((0, invalid_key_input_js_1.default)(cek, ...is_key_like_js_1.types, "Uint8Array"));
    }
    (0, check_cek_length_js_1.default)(enc, key);
    (0, check_iv_length_js_1.default)(enc, iv);
    switch(enc){
        case "A128CBC-HS256":
        case "A192CBC-HS384":
        case "A256CBC-HS512":
            return cbcDecrypt(enc, key, ciphertext, iv, tag, aad);
        case "A128GCM":
        case "A192GCM":
        case "A256GCM":
            return gcmDecrypt(enc, key, ciphertext, iv, tag, aad);
        default:
            throw new errors_js_1.JOSENotSupported("Unsupported JWE Content Encryption Algorithm");
    }
};
exports["default"] = decrypt;


/***/ }),

/***/ 68096:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const crypto_1 = __webpack_require__(6113);
const digest = (algorithm, data)=>(0, crypto_1.createHash)(algorithm).update(data).digest();
exports["default"] = digest;


/***/ }),

/***/ 52150:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const errors_js_1 = __webpack_require__(79927);
function dsaDigest(alg) {
    switch(alg){
        case "PS256":
        case "RS256":
        case "ES256":
        case "ES256K":
            return "sha256";
        case "PS384":
        case "RS384":
        case "ES384":
            return "sha384";
        case "PS512":
        case "RS512":
        case "ES512":
            return "sha512";
        case "EdDSA":
            return undefined;
        default:
            throw new errors_js_1.JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
}
exports["default"] = dsaDigest;


/***/ }),

/***/ 2183:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.ecdhAllowed = exports.generateEpk = exports.deriveKey = void 0;
const crypto_1 = __webpack_require__(6113);
const util_1 = __webpack_require__(73837);
const get_named_curve_js_1 = __webpack_require__(23520);
const buffer_utils_js_1 = __webpack_require__(43807);
const errors_js_1 = __webpack_require__(79927);
const webcrypto_js_1 = __webpack_require__(10557);
const crypto_key_js_1 = __webpack_require__(54004);
const is_key_object_js_1 = __webpack_require__(19205);
const invalid_key_input_js_1 = __webpack_require__(77909);
const is_key_like_js_1 = __webpack_require__(74283);
const generateKeyPair = (0, util_1.promisify)(crypto_1.generateKeyPair);
async function deriveKey(publicKee, privateKee, algorithm, keyLength, apu = new Uint8Array(0), apv = new Uint8Array(0)) {
    let publicKey;
    if ((0, webcrypto_js_1.isCryptoKey)(publicKee)) {
        (0, crypto_key_js_1.checkEncCryptoKey)(publicKee, "ECDH");
        publicKey = crypto_1.KeyObject.from(publicKee);
    } else if ((0, is_key_object_js_1.default)(publicKee)) {
        publicKey = publicKee;
    } else {
        throw new TypeError((0, invalid_key_input_js_1.default)(publicKee, ...is_key_like_js_1.types));
    }
    let privateKey;
    if ((0, webcrypto_js_1.isCryptoKey)(privateKee)) {
        (0, crypto_key_js_1.checkEncCryptoKey)(privateKee, "ECDH", "deriveBits");
        privateKey = crypto_1.KeyObject.from(privateKee);
    } else if ((0, is_key_object_js_1.default)(privateKee)) {
        privateKey = privateKee;
    } else {
        throw new TypeError((0, invalid_key_input_js_1.default)(privateKee, ...is_key_like_js_1.types));
    }
    const value = (0, buffer_utils_js_1.concat)((0, buffer_utils_js_1.lengthAndInput)(buffer_utils_js_1.encoder.encode(algorithm)), (0, buffer_utils_js_1.lengthAndInput)(apu), (0, buffer_utils_js_1.lengthAndInput)(apv), (0, buffer_utils_js_1.uint32be)(keyLength));
    const sharedSecret = (0, crypto_1.diffieHellman)({
        privateKey,
        publicKey
    });
    return (0, buffer_utils_js_1.concatKdf)(sharedSecret, keyLength, value);
}
exports.deriveKey = deriveKey;
async function generateEpk(kee) {
    let key;
    if ((0, webcrypto_js_1.isCryptoKey)(kee)) {
        key = crypto_1.KeyObject.from(kee);
    } else if ((0, is_key_object_js_1.default)(kee)) {
        key = kee;
    } else {
        throw new TypeError((0, invalid_key_input_js_1.default)(kee, ...is_key_like_js_1.types));
    }
    switch(key.asymmetricKeyType){
        case "x25519":
            return generateKeyPair("x25519");
        case "x448":
            {
                return generateKeyPair("x448");
            }
        case "ec":
            {
                const namedCurve = (0, get_named_curve_js_1.default)(key);
                return generateKeyPair("ec", {
                    namedCurve
                });
            }
        default:
            throw new errors_js_1.JOSENotSupported("Invalid or unsupported EPK");
    }
}
exports.generateEpk = generateEpk;
const ecdhAllowed = (key)=>[
        "P-256",
        "P-384",
        "P-521",
        "X25519",
        "X448"
    ].includes((0, get_named_curve_js_1.default)(key));
exports.ecdhAllowed = ecdhAllowed;


/***/ }),

/***/ 30734:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const crypto_1 = __webpack_require__(6113);
const check_iv_length_js_1 = __webpack_require__(40798);
const check_cek_length_js_1 = __webpack_require__(54901);
const buffer_utils_js_1 = __webpack_require__(43807);
const cbc_tag_js_1 = __webpack_require__(16872);
const webcrypto_js_1 = __webpack_require__(10557);
const crypto_key_js_1 = __webpack_require__(54004);
const is_key_object_js_1 = __webpack_require__(19205);
const invalid_key_input_js_1 = __webpack_require__(77909);
const errors_js_1 = __webpack_require__(79927);
const ciphers_js_1 = __webpack_require__(88419);
const is_key_like_js_1 = __webpack_require__(74283);
function cbcEncrypt(enc, plaintext, cek, iv, aad) {
    const keySize = parseInt(enc.slice(1, 4), 10);
    if ((0, is_key_object_js_1.default)(cek)) {
        cek = cek.export();
    }
    const encKey = cek.subarray(keySize >> 3);
    const macKey = cek.subarray(0, keySize >> 3);
    const algorithm = `aes-${keySize}-cbc`;
    if (!(0, ciphers_js_1.default)(algorithm)) {
        throw new errors_js_1.JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    const cipher = (0, crypto_1.createCipheriv)(algorithm, encKey, iv);
    const ciphertext = (0, buffer_utils_js_1.concat)(cipher.update(plaintext), cipher.final());
    const macSize = parseInt(enc.slice(-3), 10);
    const tag = (0, cbc_tag_js_1.default)(aad, iv, ciphertext, macSize, macKey, keySize);
    return {
        ciphertext,
        tag
    };
}
function gcmEncrypt(enc, plaintext, cek, iv, aad) {
    const keySize = parseInt(enc.slice(1, 4), 10);
    const algorithm = `aes-${keySize}-gcm`;
    if (!(0, ciphers_js_1.default)(algorithm)) {
        throw new errors_js_1.JOSENotSupported(`alg ${enc} is not supported by your javascript runtime`);
    }
    const cipher = (0, crypto_1.createCipheriv)(algorithm, cek, iv, {
        authTagLength: 16
    });
    if (aad.byteLength) {
        cipher.setAAD(aad, {
            plaintextLength: plaintext.length
        });
    }
    const ciphertext = cipher.update(plaintext);
    cipher.final();
    const tag = cipher.getAuthTag();
    return {
        ciphertext,
        tag
    };
}
const encrypt = (enc, plaintext, cek, iv, aad)=>{
    let key;
    if ((0, webcrypto_js_1.isCryptoKey)(cek)) {
        (0, crypto_key_js_1.checkEncCryptoKey)(cek, enc, "encrypt");
        key = crypto_1.KeyObject.from(cek);
    } else if (cek instanceof Uint8Array || (0, is_key_object_js_1.default)(cek)) {
        key = cek;
    } else {
        throw new TypeError((0, invalid_key_input_js_1.default)(cek, ...is_key_like_js_1.types, "Uint8Array"));
    }
    (0, check_cek_length_js_1.default)(enc, key);
    (0, check_iv_length_js_1.default)(enc, iv);
    switch(enc){
        case "A128CBC-HS256":
        case "A192CBC-HS384":
        case "A256CBC-HS512":
            return cbcEncrypt(enc, plaintext, key, iv, aad);
        case "A128GCM":
        case "A192GCM":
        case "A256GCM":
            return gcmEncrypt(enc, plaintext, key, iv, aad);
        default:
            throw new errors_js_1.JOSENotSupported("Unsupported JWE Content Encryption Algorithm");
    }
};
exports["default"] = encrypt;


/***/ }),

/***/ 86581:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const http = __webpack_require__(13685);
const https = __webpack_require__(95687);
const events_1 = __webpack_require__(82361);
const errors_js_1 = __webpack_require__(79927);
const buffer_utils_js_1 = __webpack_require__(43807);
const fetchJwks = async (url, timeout, options)=>{
    let get;
    switch(url.protocol){
        case "https:":
            get = https.get;
            break;
        case "http:":
            get = http.get;
            break;
        default:
            throw new TypeError("Unsupported URL protocol.");
    }
    const { agent, headers } = options;
    const req = get(url.href, {
        agent,
        timeout,
        headers
    });
    const [response] = await Promise.race([
        (0, events_1.once)(req, "response"),
        (0, events_1.once)(req, "timeout")
    ]);
    if (!response) {
        req.destroy();
        throw new errors_js_1.JWKSTimeout();
    }
    if (response.statusCode !== 200) {
        throw new errors_js_1.JOSEError("Expected 200 OK from the JSON Web Key Set HTTP response");
    }
    const parts = [];
    for await (const part of response){
        parts.push(part);
    }
    try {
        return JSON.parse(buffer_utils_js_1.decoder.decode((0, buffer_utils_js_1.concat)(...parts)));
    } catch  {
        throw new errors_js_1.JOSEError("Failed to parse the JSON Web Key Set HTTP response as JSON");
    }
};
exports["default"] = fetchJwks;


/***/ }),

/***/ 16943:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.jwkImport = exports.jwkExport = exports.rsaPssParams = exports.oneShotCallback = void 0;
const [major, minor] = process.versions.node.split(".").map((str)=>parseInt(str, 10));
exports.oneShotCallback = major >= 16 || major === 15 && minor >= 13;
exports.rsaPssParams = !("electron" in process.versions) && (major >= 17 || major === 16 && minor >= 9);
exports.jwkExport = major >= 16 || major === 15 && minor >= 9;
exports.jwkImport = major >= 16 || major === 15 && minor >= 12;


/***/ }),

/***/ 37072:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.generateKeyPair = exports.generateSecret = void 0;
const crypto_1 = __webpack_require__(6113);
const util_1 = __webpack_require__(73837);
const random_js_1 = __webpack_require__(58595);
const check_modulus_length_js_1 = __webpack_require__(80409);
const errors_js_1 = __webpack_require__(79927);
const generate = (0, util_1.promisify)(crypto_1.generateKeyPair);
async function generateSecret(alg, options) {
    let length;
    switch(alg){
        case "HS256":
        case "HS384":
        case "HS512":
        case "A128CBC-HS256":
        case "A192CBC-HS384":
        case "A256CBC-HS512":
            length = parseInt(alg.slice(-3), 10);
            break;
        case "A128KW":
        case "A192KW":
        case "A256KW":
        case "A128GCMKW":
        case "A192GCMKW":
        case "A256GCMKW":
        case "A128GCM":
        case "A192GCM":
        case "A256GCM":
            length = parseInt(alg.slice(1, 4), 10);
            break;
        default:
            throw new errors_js_1.JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
    }
    return (0, crypto_1.createSecretKey)((0, random_js_1.default)(new Uint8Array(length >> 3)));
}
exports.generateSecret = generateSecret;
async function generateKeyPair(alg, options) {
    var _a, _b;
    switch(alg){
        case "RS256":
        case "RS384":
        case "RS512":
        case "PS256":
        case "PS384":
        case "PS512":
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
        case "RSA1_5":
            {
                const modulusLength = (_a = options === null || options === void 0 ? void 0 : options.modulusLength) !== null && _a !== void 0 ? _a : 2048;
                if (typeof modulusLength !== "number" || modulusLength < 2048) {
                    throw new errors_js_1.JOSENotSupported("Invalid or unsupported modulusLength option provided, 2048 bits or larger keys must be used");
                }
                const keypair = await generate("rsa", {
                    modulusLength,
                    publicExponent: 0x10001
                });
                (0, check_modulus_length_js_1.setModulusLength)(keypair.privateKey, modulusLength);
                (0, check_modulus_length_js_1.setModulusLength)(keypair.publicKey, modulusLength);
                return keypair;
            }
        case "ES256":
            return generate("ec", {
                namedCurve: "P-256"
            });
        case "ES256K":
            return generate("ec", {
                namedCurve: "secp256k1"
            });
        case "ES384":
            return generate("ec", {
                namedCurve: "P-384"
            });
        case "ES512":
            return generate("ec", {
                namedCurve: "P-521"
            });
        case "EdDSA":
            {
                switch(options === null || options === void 0 ? void 0 : options.crv){
                    case undefined:
                    case "Ed25519":
                        return generate("ed25519");
                    case "Ed448":
                        return generate("ed448");
                    default:
                        throw new errors_js_1.JOSENotSupported("Invalid or unsupported crv option provided, supported values are Ed25519 and Ed448");
                }
            }
        case "ECDH-ES":
        case "ECDH-ES+A128KW":
        case "ECDH-ES+A192KW":
        case "ECDH-ES+A256KW":
            const crv = (_b = options === null || options === void 0 ? void 0 : options.crv) !== null && _b !== void 0 ? _b : "P-256";
            switch(crv){
                case undefined:
                case "P-256":
                case "P-384":
                case "P-521":
                    return generate("ec", {
                        namedCurve: crv
                    });
                case "X25519":
                    return generate("x25519");
                case "X448":
                    return generate("x448");
                default:
                    throw new errors_js_1.JOSENotSupported("Invalid or unsupported crv option provided, supported values are P-256, P-384, P-521, X25519, and X448");
            }
        default:
            throw new errors_js_1.JOSENotSupported('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');
    }
}
exports.generateKeyPair = generateKeyPair;


/***/ }),

/***/ 23520:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.setCurve = exports.weakMap = void 0;
const buffer_1 = __webpack_require__(14300);
const crypto_1 = __webpack_require__(6113);
const errors_js_1 = __webpack_require__(79927);
const webcrypto_js_1 = __webpack_require__(10557);
const is_key_object_js_1 = __webpack_require__(19205);
const invalid_key_input_js_1 = __webpack_require__(77909);
const is_key_like_js_1 = __webpack_require__(74283);
const p256 = buffer_1.Buffer.from([
    42,
    134,
    72,
    206,
    61,
    3,
    1,
    7
]);
const p384 = buffer_1.Buffer.from([
    43,
    129,
    4,
    0,
    34
]);
const p521 = buffer_1.Buffer.from([
    43,
    129,
    4,
    0,
    35
]);
const secp256k1 = buffer_1.Buffer.from([
    43,
    129,
    4,
    0,
    10
]);
exports.weakMap = new WeakMap();
const namedCurveToJOSE = (namedCurve)=>{
    switch(namedCurve){
        case "prime256v1":
            return "P-256";
        case "secp384r1":
            return "P-384";
        case "secp521r1":
            return "P-521";
        case "secp256k1":
            return "secp256k1";
        default:
            throw new errors_js_1.JOSENotSupported("Unsupported key curve for this operation");
    }
};
const getNamedCurve = (kee, raw)=>{
    var _a;
    let key;
    if ((0, webcrypto_js_1.isCryptoKey)(kee)) {
        key = crypto_1.KeyObject.from(kee);
    } else if ((0, is_key_object_js_1.default)(kee)) {
        key = kee;
    } else {
        throw new TypeError((0, invalid_key_input_js_1.default)(kee, ...is_key_like_js_1.types));
    }
    if (key.type === "secret") {
        throw new TypeError('only "private" or "public" type keys can be used for this operation');
    }
    switch(key.asymmetricKeyType){
        case "ed25519":
        case "ed448":
            return `Ed${key.asymmetricKeyType.slice(2)}`;
        case "x25519":
        case "x448":
            return `X${key.asymmetricKeyType.slice(1)}`;
        case "ec":
            {
                if (exports.weakMap.has(key)) {
                    return exports.weakMap.get(key);
                }
                let namedCurve = (_a = key.asymmetricKeyDetails) === null || _a === void 0 ? void 0 : _a.namedCurve;
                if (!namedCurve && key.type === "private") {
                    namedCurve = getNamedCurve((0, crypto_1.createPublicKey)(key), true);
                } else if (!namedCurve) {
                    const buf = key.export({
                        format: "der",
                        type: "spki"
                    });
                    const i = buf[1] < 128 ? 14 : 15;
                    const len = buf[i];
                    const curveOid = buf.slice(i + 1, i + 1 + len);
                    if (curveOid.equals(p256)) {
                        namedCurve = "prime256v1";
                    } else if (curveOid.equals(p384)) {
                        namedCurve = "secp384r1";
                    } else if (curveOid.equals(p521)) {
                        namedCurve = "secp521r1";
                    } else if (curveOid.equals(secp256k1)) {
                        namedCurve = "secp256k1";
                    } else {
                        throw new errors_js_1.JOSENotSupported("Unsupported key curve for this operation");
                    }
                }
                if (raw) return namedCurve;
                const curve = namedCurveToJOSE(namedCurve);
                exports.weakMap.set(key, curve);
                return curve;
            }
        default:
            throw new TypeError("Invalid asymmetric key type for this operation");
    }
};
function setCurve(keyObject, curve) {
    exports.weakMap.set(keyObject, curve);
}
exports.setCurve = setCurve;
exports["default"] = getNamedCurve;


/***/ }),

/***/ 77640:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const crypto_1 = __webpack_require__(6113);
const webcrypto_js_1 = __webpack_require__(10557);
const crypto_key_js_1 = __webpack_require__(54004);
const invalid_key_input_js_1 = __webpack_require__(77909);
const is_key_like_js_1 = __webpack_require__(74283);
function getSignVerifyKey(alg, key, usage) {
    if (key instanceof Uint8Array) {
        if (!alg.startsWith("HS")) {
            throw new TypeError((0, invalid_key_input_js_1.default)(key, ...is_key_like_js_1.types));
        }
        return (0, crypto_1.createSecretKey)(key);
    }
    if (key instanceof crypto_1.KeyObject) {
        return key;
    }
    if ((0, webcrypto_js_1.isCryptoKey)(key)) {
        (0, crypto_key_js_1.checkSigCryptoKey)(key, alg, usage);
        return crypto_1.KeyObject.from(key);
    }
    throw new TypeError((0, invalid_key_input_js_1.default)(key, ...is_key_like_js_1.types, "Uint8Array"));
}
exports["default"] = getSignVerifyKey;


/***/ }),

/***/ 90389:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const errors_js_1 = __webpack_require__(79927);
function hmacDigest(alg) {
    switch(alg){
        case "HS256":
            return "sha256";
        case "HS384":
            return "sha384";
        case "HS512":
            return "sha512";
        default:
            throw new errors_js_1.JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
}
exports["default"] = hmacDigest;


/***/ }),

/***/ 74283:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.types = void 0;
const webcrypto_js_1 = __webpack_require__(10557);
const is_key_object_js_1 = __webpack_require__(19205);
exports["default"] = (key)=>(0, is_key_object_js_1.default)(key) || (0, webcrypto_js_1.isCryptoKey)(key);
const types = [
    "KeyObject"
];
exports.types = types;
if (globalThis.CryptoKey || (webcrypto_js_1.default === null || webcrypto_js_1.default === void 0 ? void 0 : webcrypto_js_1.default.CryptoKey)) {
    types.push("CryptoKey");
}


/***/ }),

/***/ 19205:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const crypto_1 = __webpack_require__(6113);
const util = __webpack_require__(73837);
exports["default"] = util.types.isKeyObject ? (obj)=>util.types.isKeyObject(obj) : (obj)=>obj != null && obj instanceof crypto_1.KeyObject;


/***/ }),

/***/ 98544:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const buffer_1 = __webpack_require__(14300);
const crypto_1 = __webpack_require__(6113);
const base64url_js_1 = __webpack_require__(37244);
const errors_js_1 = __webpack_require__(79927);
const get_named_curve_js_1 = __webpack_require__(23520);
const check_modulus_length_js_1 = __webpack_require__(80409);
const asn1_sequence_encoder_js_1 = __webpack_require__(56879);
const flags_js_1 = __webpack_require__(16943);
const parse = (jwk)=>{
    if (flags_js_1.jwkImport && jwk.kty !== "oct") {
        return jwk.d ? (0, crypto_1.createPrivateKey)({
            format: "jwk",
            key: jwk
        }) : (0, crypto_1.createPublicKey)({
            format: "jwk",
            key: jwk
        });
    }
    switch(jwk.kty){
        case "oct":
            {
                return (0, crypto_1.createSecretKey)((0, base64url_js_1.decode)(jwk.k));
            }
        case "RSA":
            {
                const enc = new asn1_sequence_encoder_js_1.default();
                const isPrivate = jwk.d !== undefined;
                const modulus = buffer_1.Buffer.from(jwk.n, "base64");
                const exponent = buffer_1.Buffer.from(jwk.e, "base64");
                if (isPrivate) {
                    enc.zero();
                    enc.unsignedInteger(modulus);
                    enc.unsignedInteger(exponent);
                    enc.unsignedInteger(buffer_1.Buffer.from(jwk.d, "base64"));
                    enc.unsignedInteger(buffer_1.Buffer.from(jwk.p, "base64"));
                    enc.unsignedInteger(buffer_1.Buffer.from(jwk.q, "base64"));
                    enc.unsignedInteger(buffer_1.Buffer.from(jwk.dp, "base64"));
                    enc.unsignedInteger(buffer_1.Buffer.from(jwk.dq, "base64"));
                    enc.unsignedInteger(buffer_1.Buffer.from(jwk.qi, "base64"));
                } else {
                    enc.unsignedInteger(modulus);
                    enc.unsignedInteger(exponent);
                }
                const der = enc.end();
                const createInput = {
                    key: der,
                    format: "der",
                    type: "pkcs1"
                };
                const keyObject = isPrivate ? (0, crypto_1.createPrivateKey)(createInput) : (0, crypto_1.createPublicKey)(createInput);
                (0, check_modulus_length_js_1.setModulusLength)(keyObject, modulus.length << 3);
                return keyObject;
            }
        case "EC":
            {
                const enc = new asn1_sequence_encoder_js_1.default();
                const isPrivate = jwk.d !== undefined;
                const pub = buffer_1.Buffer.concat([
                    buffer_1.Buffer.alloc(1, 4),
                    buffer_1.Buffer.from(jwk.x, "base64"),
                    buffer_1.Buffer.from(jwk.y, "base64")
                ]);
                if (isPrivate) {
                    enc.zero();
                    const enc$1 = new asn1_sequence_encoder_js_1.default();
                    enc$1.oidFor("ecPublicKey");
                    enc$1.oidFor(jwk.crv);
                    enc.add(enc$1.end());
                    const enc$2 = new asn1_sequence_encoder_js_1.default();
                    enc$2.one();
                    enc$2.octStr(buffer_1.Buffer.from(jwk.d, "base64"));
                    const enc$3 = new asn1_sequence_encoder_js_1.default();
                    enc$3.bitStr(pub);
                    const f2 = enc$3.end(buffer_1.Buffer.from([
                        0xa1
                    ]));
                    enc$2.add(f2);
                    const f = enc$2.end();
                    const enc$4 = new asn1_sequence_encoder_js_1.default();
                    enc$4.add(f);
                    const f3 = enc$4.end(buffer_1.Buffer.from([
                        0x04
                    ]));
                    enc.add(f3);
                    const der = enc.end();
                    const keyObject = (0, crypto_1.createPrivateKey)({
                        key: der,
                        format: "der",
                        type: "pkcs8"
                    });
                    (0, get_named_curve_js_1.setCurve)(keyObject, jwk.crv);
                    return keyObject;
                }
                const enc$1 = new asn1_sequence_encoder_js_1.default();
                enc$1.oidFor("ecPublicKey");
                enc$1.oidFor(jwk.crv);
                enc.add(enc$1.end());
                enc.bitStr(pub);
                const der = enc.end();
                const keyObject = (0, crypto_1.createPublicKey)({
                    key: der,
                    format: "der",
                    type: "spki"
                });
                (0, get_named_curve_js_1.setCurve)(keyObject, jwk.crv);
                return keyObject;
            }
        case "OKP":
            {
                const enc = new asn1_sequence_encoder_js_1.default();
                const isPrivate = jwk.d !== undefined;
                if (isPrivate) {
                    enc.zero();
                    const enc$1 = new asn1_sequence_encoder_js_1.default();
                    enc$1.oidFor(jwk.crv);
                    enc.add(enc$1.end());
                    const enc$2 = new asn1_sequence_encoder_js_1.default();
                    enc$2.octStr(buffer_1.Buffer.from(jwk.d, "base64"));
                    const f = enc$2.end(buffer_1.Buffer.from([
                        0x04
                    ]));
                    enc.add(f);
                    const der = enc.end();
                    return (0, crypto_1.createPrivateKey)({
                        key: der,
                        format: "der",
                        type: "pkcs8"
                    });
                }
                const enc$1 = new asn1_sequence_encoder_js_1.default();
                enc$1.oidFor(jwk.crv);
                enc.add(enc$1.end());
                enc.bitStr(buffer_1.Buffer.from(jwk.x, "base64"));
                const der = enc.end();
                return (0, crypto_1.createPublicKey)({
                    key: der,
                    format: "der",
                    type: "spki"
                });
            }
        default:
            throw new errors_js_1.JOSENotSupported('Invalid or unsupported JWK "kty" (Key Type) Parameter value');
    }
};
exports["default"] = parse;


/***/ }),

/***/ 12177:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const crypto_1 = __webpack_require__(6113);
const base64url_js_1 = __webpack_require__(37244);
const asn1_sequence_decoder_js_1 = __webpack_require__(25812);
const errors_js_1 = __webpack_require__(79927);
const get_named_curve_js_1 = __webpack_require__(23520);
const webcrypto_js_1 = __webpack_require__(10557);
const is_key_object_js_1 = __webpack_require__(19205);
const invalid_key_input_js_1 = __webpack_require__(77909);
const is_key_like_js_1 = __webpack_require__(74283);
const flags_js_1 = __webpack_require__(16943);
const keyToJWK = (key)=>{
    let keyObject;
    if ((0, webcrypto_js_1.isCryptoKey)(key)) {
        if (!key.extractable) {
            throw new TypeError("CryptoKey is not extractable");
        }
        keyObject = crypto_1.KeyObject.from(key);
    } else if ((0, is_key_object_js_1.default)(key)) {
        keyObject = key;
    } else if (key instanceof Uint8Array) {
        return {
            kty: "oct",
            k: (0, base64url_js_1.encode)(key)
        };
    } else {
        throw new TypeError((0, invalid_key_input_js_1.default)(key, ...is_key_like_js_1.types, "Uint8Array"));
    }
    if (flags_js_1.jwkExport) {
        if (keyObject.type !== "secret" && ![
            "rsa",
            "ec",
            "ed25519",
            "x25519",
            "ed448",
            "x448"
        ].includes(keyObject.asymmetricKeyType)) {
            throw new errors_js_1.JOSENotSupported("Unsupported key asymmetricKeyType");
        }
        return keyObject.export({
            format: "jwk"
        });
    }
    switch(keyObject.type){
        case "secret":
            return {
                kty: "oct",
                k: (0, base64url_js_1.encode)(keyObject.export())
            };
        case "private":
        case "public":
            {
                switch(keyObject.asymmetricKeyType){
                    case "rsa":
                        {
                            const der = keyObject.export({
                                format: "der",
                                type: "pkcs1"
                            });
                            const dec = new asn1_sequence_decoder_js_1.default(der);
                            if (keyObject.type === "private") {
                                dec.unsignedInteger();
                            }
                            const n = (0, base64url_js_1.encode)(dec.unsignedInteger());
                            const e = (0, base64url_js_1.encode)(dec.unsignedInteger());
                            let jwk;
                            if (keyObject.type === "private") {
                                jwk = {
                                    d: (0, base64url_js_1.encode)(dec.unsignedInteger()),
                                    p: (0, base64url_js_1.encode)(dec.unsignedInteger()),
                                    q: (0, base64url_js_1.encode)(dec.unsignedInteger()),
                                    dp: (0, base64url_js_1.encode)(dec.unsignedInteger()),
                                    dq: (0, base64url_js_1.encode)(dec.unsignedInteger()),
                                    qi: (0, base64url_js_1.encode)(dec.unsignedInteger())
                                };
                            }
                            dec.end();
                            return {
                                kty: "RSA",
                                n,
                                e,
                                ...jwk
                            };
                        }
                    case "ec":
                        {
                            const crv = (0, get_named_curve_js_1.default)(keyObject);
                            let len;
                            let offset;
                            let correction;
                            switch(crv){
                                case "secp256k1":
                                    len = 64;
                                    offset = 31 + 2;
                                    correction = -1;
                                    break;
                                case "P-256":
                                    len = 64;
                                    offset = 34 + 2;
                                    correction = -1;
                                    break;
                                case "P-384":
                                    len = 96;
                                    offset = 33 + 2;
                                    correction = -3;
                                    break;
                                case "P-521":
                                    len = 132;
                                    offset = 33 + 2;
                                    correction = -3;
                                    break;
                                default:
                                    throw new errors_js_1.JOSENotSupported("Unsupported curve");
                            }
                            if (keyObject.type === "public") {
                                const der = keyObject.export({
                                    type: "spki",
                                    format: "der"
                                });
                                return {
                                    kty: "EC",
                                    crv,
                                    x: (0, base64url_js_1.encode)(der.subarray(-len, -len / 2)),
                                    y: (0, base64url_js_1.encode)(der.subarray(-len / 2))
                                };
                            }
                            const der = keyObject.export({
                                type: "pkcs8",
                                format: "der"
                            });
                            if (der.length < 100) {
                                offset += correction;
                            }
                            return {
                                ...keyToJWK((0, crypto_1.createPublicKey)(keyObject)),
                                d: (0, base64url_js_1.encode)(der.subarray(offset, offset + len / 2))
                            };
                        }
                    case "ed25519":
                    case "x25519":
                        {
                            const crv = (0, get_named_curve_js_1.default)(keyObject);
                            if (keyObject.type === "public") {
                                const der = keyObject.export({
                                    type: "spki",
                                    format: "der"
                                });
                                return {
                                    kty: "OKP",
                                    crv,
                                    x: (0, base64url_js_1.encode)(der.subarray(-32))
                                };
                            }
                            const der = keyObject.export({
                                type: "pkcs8",
                                format: "der"
                            });
                            return {
                                ...keyToJWK((0, crypto_1.createPublicKey)(keyObject)),
                                d: (0, base64url_js_1.encode)(der.subarray(-32))
                            };
                        }
                    case "ed448":
                    case "x448":
                        {
                            const crv = (0, get_named_curve_js_1.default)(keyObject);
                            if (keyObject.type === "public") {
                                const der = keyObject.export({
                                    type: "spki",
                                    format: "der"
                                });
                                return {
                                    kty: "OKP",
                                    crv,
                                    x: (0, base64url_js_1.encode)(der.subarray(crv === "Ed448" ? -57 : -56))
                                };
                            }
                            const der = keyObject.export({
                                type: "pkcs8",
                                format: "der"
                            });
                            return {
                                ...keyToJWK((0, crypto_1.createPublicKey)(keyObject)),
                                d: (0, base64url_js_1.encode)(der.subarray(crv === "Ed448" ? -57 : -56))
                            };
                        }
                    default:
                        throw new errors_js_1.JOSENotSupported("Unsupported key asymmetricKeyType");
                }
            }
        default:
            throw new errors_js_1.JOSENotSupported("Unsupported key type");
    }
};
exports["default"] = keyToJWK;


/***/ }),

/***/ 96281:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const crypto_1 = __webpack_require__(6113);
const get_named_curve_js_1 = __webpack_require__(23520);
const errors_js_1 = __webpack_require__(79927);
const check_modulus_length_js_1 = __webpack_require__(80409);
const flags_js_1 = __webpack_require__(16943);
const PSS = {
    padding: crypto_1.constants.RSA_PKCS1_PSS_PADDING,
    saltLength: crypto_1.constants.RSA_PSS_SALTLEN_DIGEST
};
const ecCurveAlgMap = new Map([
    [
        "ES256",
        "P-256"
    ],
    [
        "ES256K",
        "secp256k1"
    ],
    [
        "ES384",
        "P-384"
    ],
    [
        "ES512",
        "P-521"
    ]
]);
function keyForCrypto(alg, key) {
    switch(alg){
        case "EdDSA":
            if (![
                "ed25519",
                "ed448"
            ].includes(key.asymmetricKeyType)) {
                throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be ed25519 or ed448");
            }
            return key;
        case "RS256":
        case "RS384":
        case "RS512":
            if (key.asymmetricKeyType !== "rsa") {
                throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa");
            }
            (0, check_modulus_length_js_1.default)(key, alg);
            return key;
        case flags_js_1.rsaPssParams && "PS256":
        case flags_js_1.rsaPssParams && "PS384":
        case flags_js_1.rsaPssParams && "PS512":
            if (key.asymmetricKeyType === "rsa-pss") {
                const { hashAlgorithm, mgf1HashAlgorithm, saltLength } = key.asymmetricKeyDetails;
                const length = parseInt(alg.slice(-3), 10);
                if (hashAlgorithm !== undefined && (hashAlgorithm !== `sha${length}` || mgf1HashAlgorithm !== hashAlgorithm)) {
                    throw new TypeError(`Invalid key for this operation, its RSA-PSS parameters do not meet the requirements of "alg" ${alg}`);
                }
                if (saltLength !== undefined && saltLength > length >> 3) {
                    throw new TypeError(`Invalid key for this operation, its RSA-PSS parameter saltLength does not meet the requirements of "alg" ${alg}`);
                }
            } else if (key.asymmetricKeyType !== "rsa") {
                throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa or rsa-pss");
            }
            (0, check_modulus_length_js_1.default)(key, alg);
            return {
                key,
                ...PSS
            };
        case !flags_js_1.rsaPssParams && "PS256":
        case !flags_js_1.rsaPssParams && "PS384":
        case !flags_js_1.rsaPssParams && "PS512":
            if (key.asymmetricKeyType !== "rsa") {
                throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa");
            }
            (0, check_modulus_length_js_1.default)(key, alg);
            return {
                key,
                ...PSS
            };
        case "ES256":
        case "ES256K":
        case "ES384":
        case "ES512":
            {
                if (key.asymmetricKeyType !== "ec") {
                    throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be ec");
                }
                const actual = (0, get_named_curve_js_1.default)(key);
                const expected = ecCurveAlgMap.get(alg);
                if (actual !== expected) {
                    throw new TypeError(`Invalid key curve for the algorithm, its curve must be ${expected}, got ${actual}`);
                }
                return {
                    dsaEncoding: "ieee-p1363",
                    key
                };
            }
        default:
            throw new errors_js_1.JOSENotSupported(`alg ${alg} is not supported either by JOSE or your javascript runtime`);
    }
}
exports["default"] = keyForCrypto;


/***/ }),

/***/ 32121:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.decrypt = exports.encrypt = void 0;
const util_1 = __webpack_require__(73837);
const crypto_1 = __webpack_require__(6113);
const random_js_1 = __webpack_require__(58595);
const buffer_utils_js_1 = __webpack_require__(43807);
const base64url_js_1 = __webpack_require__(37244);
const aeskw_js_1 = __webpack_require__(81132);
const check_p2s_js_1 = __webpack_require__(31643);
const webcrypto_js_1 = __webpack_require__(10557);
const crypto_key_js_1 = __webpack_require__(54004);
const is_key_object_js_1 = __webpack_require__(19205);
const invalid_key_input_js_1 = __webpack_require__(77909);
const is_key_like_js_1 = __webpack_require__(74283);
const pbkdf2 = (0, util_1.promisify)(crypto_1.pbkdf2);
function getPassword(key, alg) {
    if ((0, is_key_object_js_1.default)(key)) {
        return key.export();
    }
    if (key instanceof Uint8Array) {
        return key;
    }
    if ((0, webcrypto_js_1.isCryptoKey)(key)) {
        (0, crypto_key_js_1.checkEncCryptoKey)(key, alg, "deriveBits", "deriveKey");
        return crypto_1.KeyObject.from(key).export();
    }
    throw new TypeError((0, invalid_key_input_js_1.default)(key, ...is_key_like_js_1.types, "Uint8Array"));
}
const encrypt = async (alg, key, cek, p2c = 2048, p2s = (0, random_js_1.default)(new Uint8Array(16)))=>{
    (0, check_p2s_js_1.default)(p2s);
    const salt = (0, buffer_utils_js_1.p2s)(alg, p2s);
    const keylen = parseInt(alg.slice(13, 16), 10) >> 3;
    const password = getPassword(key, alg);
    const derivedKey = await pbkdf2(password, salt, p2c, keylen, `sha${alg.slice(8, 11)}`);
    const encryptedKey = await (0, aeskw_js_1.wrap)(alg.slice(-6), derivedKey, cek);
    return {
        encryptedKey,
        p2c,
        p2s: (0, base64url_js_1.encode)(p2s)
    };
};
exports.encrypt = encrypt;
const decrypt = async (alg, key, encryptedKey, p2c, p2s)=>{
    (0, check_p2s_js_1.default)(p2s);
    const salt = (0, buffer_utils_js_1.p2s)(alg, p2s);
    const keylen = parseInt(alg.slice(13, 16), 10) >> 3;
    const password = getPassword(key, alg);
    const derivedKey = await pbkdf2(password, salt, p2c, keylen, `sha${alg.slice(8, 11)}`);
    return (0, aeskw_js_1.unwrap)(alg.slice(-6), derivedKey, encryptedKey);
};
exports.decrypt = decrypt;


/***/ }),

/***/ 58595:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
var crypto_1 = __webpack_require__(6113);
Object.defineProperty(exports, "default", ({
    enumerable: true,
    get: function() {
        return crypto_1.randomFillSync;
    }
}));


/***/ }),

/***/ 98745:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __webpack_require__(6113);
const check_modulus_length_js_1 = __webpack_require__(80409);
const webcrypto_js_1 = __webpack_require__(10557);
const crypto_key_js_1 = __webpack_require__(54004);
const is_key_object_js_1 = __webpack_require__(19205);
const invalid_key_input_js_1 = __webpack_require__(77909);
const is_key_like_js_1 = __webpack_require__(74283);
const checkKey = (key, alg)=>{
    if (key.asymmetricKeyType !== "rsa") {
        throw new TypeError("Invalid key for this operation, its asymmetricKeyType must be rsa");
    }
    (0, check_modulus_length_js_1.default)(key, alg);
};
const resolvePadding = (alg)=>{
    switch(alg){
        case "RSA-OAEP":
        case "RSA-OAEP-256":
        case "RSA-OAEP-384":
        case "RSA-OAEP-512":
            return crypto_1.constants.RSA_PKCS1_OAEP_PADDING;
        case "RSA1_5":
            return crypto_1.constants.RSA_PKCS1_PADDING;
        default:
            return undefined;
    }
};
const resolveOaepHash = (alg)=>{
    switch(alg){
        case "RSA-OAEP":
            return "sha1";
        case "RSA-OAEP-256":
            return "sha256";
        case "RSA-OAEP-384":
            return "sha384";
        case "RSA-OAEP-512":
            return "sha512";
        default:
            return undefined;
    }
};
function ensureKeyObject(key, alg, ...usages) {
    if ((0, is_key_object_js_1.default)(key)) {
        return key;
    }
    if ((0, webcrypto_js_1.isCryptoKey)(key)) {
        (0, crypto_key_js_1.checkEncCryptoKey)(key, alg, ...usages);
        return crypto_1.KeyObject.from(key);
    }
    throw new TypeError((0, invalid_key_input_js_1.default)(key, ...is_key_like_js_1.types));
}
const encrypt = (alg, key, cek)=>{
    const padding = resolvePadding(alg);
    const oaepHash = resolveOaepHash(alg);
    const keyObject = ensureKeyObject(key, alg, "wrapKey", "encrypt");
    checkKey(keyObject, alg);
    return (0, crypto_1.publicEncrypt)({
        key: keyObject,
        oaepHash,
        padding
    }, cek);
};
exports.encrypt = encrypt;
const decrypt = (alg, key, encryptedKey)=>{
    const padding = resolvePadding(alg);
    const oaepHash = resolveOaepHash(alg);
    const keyObject = ensureKeyObject(key, alg, "unwrapKey", "decrypt");
    checkKey(keyObject, alg);
    return (0, crypto_1.privateDecrypt)({
        key: keyObject,
        oaepHash,
        padding
    }, encryptedKey);
};
exports.decrypt = decrypt;


/***/ }),

/***/ 29758:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = "node:crypto";


/***/ }),

/***/ 98242:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const crypto = __webpack_require__(6113);
const util_1 = __webpack_require__(73837);
const dsa_digest_js_1 = __webpack_require__(52150);
const hmac_digest_js_1 = __webpack_require__(90389);
const node_key_js_1 = __webpack_require__(96281);
const get_sign_verify_key_js_1 = __webpack_require__(77640);
let oneShotSign;
if (crypto.sign.length > 3) {
    oneShotSign = (0, util_1.promisify)(crypto.sign);
} else {
    oneShotSign = crypto.sign;
}
const sign = async (alg, key, data)=>{
    const keyObject = (0, get_sign_verify_key_js_1.default)(alg, key, "sign");
    if (alg.startsWith("HS")) {
        const hmac = crypto.createHmac((0, hmac_digest_js_1.default)(alg), keyObject);
        hmac.update(data);
        return hmac.digest();
    }
    return oneShotSign((0, dsa_digest_js_1.default)(alg), data, (0, node_key_js_1.default)(alg, keyObject));
};
exports["default"] = sign;


/***/ }),

/***/ 80601:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const crypto_1 = __webpack_require__(6113);
const timingSafeEqual = crypto_1.timingSafeEqual;
exports["default"] = timingSafeEqual;


/***/ }),

/***/ 17872:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const crypto = __webpack_require__(6113);
const util_1 = __webpack_require__(73837);
const dsa_digest_js_1 = __webpack_require__(52150);
const node_key_js_1 = __webpack_require__(96281);
const sign_js_1 = __webpack_require__(98242);
const get_sign_verify_key_js_1 = __webpack_require__(77640);
const flags_js_1 = __webpack_require__(16943);
let oneShotVerify;
if (crypto.verify.length > 4 && flags_js_1.oneShotCallback) {
    oneShotVerify = (0, util_1.promisify)(crypto.verify);
} else {
    oneShotVerify = crypto.verify;
}
const verify = async (alg, key, signature, data)=>{
    const keyObject = (0, get_sign_verify_key_js_1.default)(alg, key, "verify");
    if (alg.startsWith("HS")) {
        const expected = await (0, sign_js_1.default)(alg, keyObject, data);
        const actual = signature;
        try {
            return crypto.timingSafeEqual(actual, expected);
        } catch  {
            return false;
        }
    }
    const algorithm = (0, dsa_digest_js_1.default)(alg);
    const keyInput = (0, node_key_js_1.default)(alg, keyObject);
    try {
        return await oneShotVerify(algorithm, data, keyInput, signature);
    } catch  {
        return false;
    }
};
exports["default"] = verify;


/***/ }),

/***/ 10557:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.isCryptoKey = void 0;
const crypto = __webpack_require__(6113);
const util = __webpack_require__(73837);
const webcrypto = crypto.webcrypto;
exports["default"] = webcrypto;
exports.isCryptoKey = util.types.isCryptoKey ? (key)=>util.types.isCryptoKey(key) : (key)=>false;


/***/ }),

/***/ 49786:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.deflate = exports.inflate = void 0;
const util_1 = __webpack_require__(73837);
const zlib_1 = __webpack_require__(59796);
const inflateRaw = (0, util_1.promisify)(zlib_1.inflateRaw);
const deflateRaw = (0, util_1.promisify)(zlib_1.deflateRaw);
const inflate = (input)=>inflateRaw(input);
exports.inflate = inflate;
const deflate = (input)=>deflateRaw(input);
exports.deflate = deflate;


/***/ }),

/***/ 68686:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.decode = exports.encode = void 0;
const base64url = __webpack_require__(37244);
exports.encode = base64url.encode;
exports.decode = base64url.decode;


/***/ }),

/***/ 34316:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.decodeJwt = void 0;
const base64url_js_1 = __webpack_require__(68686);
const buffer_utils_js_1 = __webpack_require__(43807);
const is_object_js_1 = __webpack_require__(50281);
const errors_js_1 = __webpack_require__(79927);
function decodeJwt(jwt) {
    if (typeof jwt !== "string") throw new errors_js_1.JWTInvalid("JWTs must use Compact JWS serialization, JWT must be a string");
    const { 1: payload, length } = jwt.split(".");
    if (length === 5) throw new errors_js_1.JWTInvalid("Only JWTs using Compact JWS serialization can be decoded");
    if (length !== 3) throw new errors_js_1.JWTInvalid("Invalid JWT");
    if (!payload) throw new errors_js_1.JWTInvalid("JWTs must contain a payload");
    let decoded;
    try {
        decoded = (0, base64url_js_1.decode)(payload);
    } catch  {
        throw new errors_js_1.JWTInvalid("Failed to base64url decode the payload");
    }
    let result;
    try {
        result = JSON.parse(buffer_utils_js_1.decoder.decode(decoded));
    } catch  {
        throw new errors_js_1.JWTInvalid("Failed to parse the decoded payload as JSON");
    }
    if (!(0, is_object_js_1.default)(result)) throw new errors_js_1.JWTInvalid("Invalid JWT Claims Set");
    return result;
}
exports.decodeJwt = decodeJwt;


/***/ }),

/***/ 67412:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.decodeProtectedHeader = void 0;
const base64url_js_1 = __webpack_require__(68686);
const buffer_utils_js_1 = __webpack_require__(43807);
const is_object_js_1 = __webpack_require__(50281);
function decodeProtectedHeader(token) {
    let protectedB64u;
    if (typeof token === "string") {
        const parts = token.split(".");
        if (parts.length === 3 || parts.length === 5) {
            ;
            [protectedB64u] = parts;
        }
    } else if (typeof token === "object" && token) {
        if ("protected" in token) {
            protectedB64u = token.protected;
        } else {
            throw new TypeError("Token does not contain a Protected Header");
        }
    }
    try {
        if (typeof protectedB64u !== "string" || !protectedB64u) {
            throw new Error();
        }
        const result = JSON.parse(buffer_utils_js_1.decoder.decode((0, base64url_js_1.decode)(protectedB64u)));
        if (!(0, is_object_js_1.default)(result)) {
            throw new Error();
        }
        return result;
    } catch  {
        throw new TypeError("Invalid Token or Protected Header formatting");
    }
}
exports.decodeProtectedHeader = decodeProtectedHeader;


/***/ }),

/***/ 79927:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.JWSSignatureVerificationFailed = exports.JWKSTimeout = exports.JWKSMultipleMatchingKeys = exports.JWKSNoMatchingKey = exports.JWKSInvalid = exports.JWKInvalid = exports.JWTInvalid = exports.JWSInvalid = exports.JWEInvalid = exports.JWEDecryptionFailed = exports.JOSENotSupported = exports.JOSEAlgNotAllowed = exports.JWTExpired = exports.JWTClaimValidationFailed = exports.JOSEError = void 0;
class JOSEError extends Error {
    static get code() {
        return "ERR_JOSE_GENERIC";
    }
    constructor(message){
        var _a;
        super(message);
        this.code = "ERR_JOSE_GENERIC";
        this.name = this.constructor.name;
        (_a = Error.captureStackTrace) === null || _a === void 0 ? void 0 : _a.call(Error, this, this.constructor);
    }
}
exports.JOSEError = JOSEError;
class JWTClaimValidationFailed extends JOSEError {
    static get code() {
        return "ERR_JWT_CLAIM_VALIDATION_FAILED";
    }
    constructor(message, claim = "unspecified", reason = "unspecified"){
        super(message);
        this.code = "ERR_JWT_CLAIM_VALIDATION_FAILED";
        this.claim = claim;
        this.reason = reason;
    }
}
exports.JWTClaimValidationFailed = JWTClaimValidationFailed;
class JWTExpired extends JOSEError {
    static get code() {
        return "ERR_JWT_EXPIRED";
    }
    constructor(message, claim = "unspecified", reason = "unspecified"){
        super(message);
        this.code = "ERR_JWT_EXPIRED";
        this.claim = claim;
        this.reason = reason;
    }
}
exports.JWTExpired = JWTExpired;
class JOSEAlgNotAllowed extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JOSE_ALG_NOT_ALLOWED";
    }
    static get code() {
        return "ERR_JOSE_ALG_NOT_ALLOWED";
    }
}
exports.JOSEAlgNotAllowed = JOSEAlgNotAllowed;
class JOSENotSupported extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JOSE_NOT_SUPPORTED";
    }
    static get code() {
        return "ERR_JOSE_NOT_SUPPORTED";
    }
}
exports.JOSENotSupported = JOSENotSupported;
class JWEDecryptionFailed extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWE_DECRYPTION_FAILED";
        this.message = "decryption operation failed";
    }
    static get code() {
        return "ERR_JWE_DECRYPTION_FAILED";
    }
}
exports.JWEDecryptionFailed = JWEDecryptionFailed;
class JWEInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWE_INVALID";
    }
    static get code() {
        return "ERR_JWE_INVALID";
    }
}
exports.JWEInvalid = JWEInvalid;
class JWSInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWS_INVALID";
    }
    static get code() {
        return "ERR_JWS_INVALID";
    }
}
exports.JWSInvalid = JWSInvalid;
class JWTInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWT_INVALID";
    }
    static get code() {
        return "ERR_JWT_INVALID";
    }
}
exports.JWTInvalid = JWTInvalid;
class JWKInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWK_INVALID";
    }
    static get code() {
        return "ERR_JWK_INVALID";
    }
}
exports.JWKInvalid = JWKInvalid;
class JWKSInvalid extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWKS_INVALID";
    }
    static get code() {
        return "ERR_JWKS_INVALID";
    }
}
exports.JWKSInvalid = JWKSInvalid;
class JWKSNoMatchingKey extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWKS_NO_MATCHING_KEY";
        this.message = "no applicable key found in the JSON Web Key Set";
    }
    static get code() {
        return "ERR_JWKS_NO_MATCHING_KEY";
    }
}
exports.JWKSNoMatchingKey = JWKSNoMatchingKey;
class JWKSMultipleMatchingKeys extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
        this.message = "multiple matching keys found in the JSON Web Key Set";
    }
    static get code() {
        return "ERR_JWKS_MULTIPLE_MATCHING_KEYS";
    }
}
exports.JWKSMultipleMatchingKeys = JWKSMultipleMatchingKeys;
Symbol.asyncIterator;
class JWKSTimeout extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWKS_TIMEOUT";
        this.message = "request timed out";
    }
    static get code() {
        return "ERR_JWKS_TIMEOUT";
    }
}
exports.JWKSTimeout = JWKSTimeout;
class JWSSignatureVerificationFailed extends JOSEError {
    constructor(){
        super(...arguments);
        this.code = "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
        this.message = "signature verification failed";
    }
    static get code() {
        return "ERR_JWS_SIGNATURE_VERIFICATION_FAILED";
    }
}
exports.JWSSignatureVerificationFailed = JWSSignatureVerificationFailed;


/***/ }),

/***/ 36796:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
const runtime_js_1 = __webpack_require__(29758);
exports["default"] = runtime_js_1.default;


/***/ }),

/***/ 18341:
/***/ ((module) => {

"use strict";

function e(e) {
    this.message = e;
}
e.prototype = new Error, e.prototype.name = "InvalidCharacterError";
var r =  false || function(r) {
    var t = String(r).replace(/=+$/, "");
    if (t.length % 4 == 1) throw new e("'atob' failed: The string to be decoded is not correctly encoded.");
    for(var n, o, a = 0, i = 0, c = ""; o = t.charAt(i++); ~o && (n = a % 4 ? 64 * n + o : o, a++ % 4) ? c += String.fromCharCode(255 & n >> (-2 * a & 6)) : 0)o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);
    return c;
};
function t(e) {
    var t = e.replace(/-/g, "+").replace(/_/g, "/");
    switch(t.length % 4){
        case 0:
            break;
        case 2:
            t += "==";
            break;
        case 3:
            t += "=";
            break;
        default:
            throw "Illegal base64url string!";
    }
    try {
        return function(e) {
            return decodeURIComponent(r(e).replace(/(.)/g, function(e, r) {
                var t = r.charCodeAt(0).toString(16).toUpperCase();
                return t.length < 2 && (t = "0" + t), "%" + t;
            }));
        }(t);
    } catch (e) {
        return r(t);
    }
}
function n(e) {
    this.message = e;
}
function o(e, r) {
    if ("string" != typeof e) throw new n("Invalid token specified");
    var o = !0 === (r = r || {}).header ? 0 : 1;
    try {
        return JSON.parse(t(e.split(".")[o]));
    } catch (e) {
        throw new n("Invalid token specified: " + e.message);
    }
}
n.prototype = new Error, n.prototype.name = "InvalidTokenError";
const a = o;
a.default = o, a.InvalidTokenError = n, module.exports = a; //# sourceMappingURL=jwt-decode.cjs.js.map


/***/ }),

/***/ 94710:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

// A linked list to keep track of recently-used-ness
const Yallist = __webpack_require__(66349);
const MAX = Symbol("max");
const LENGTH = Symbol("length");
const LENGTH_CALCULATOR = Symbol("lengthCalculator");
const ALLOW_STALE = Symbol("allowStale");
const MAX_AGE = Symbol("maxAge");
const DISPOSE = Symbol("dispose");
const NO_DISPOSE_ON_SET = Symbol("noDisposeOnSet");
const LRU_LIST = Symbol("lruList");
const CACHE = Symbol("cache");
const UPDATE_AGE_ON_GET = Symbol("updateAgeOnGet");
const naiveLength = ()=>1;
// lruList is a yallist where the head is the youngest
// item, and the tail is the oldest.  the list contains the Hit
// objects as the entries.
// Each Hit object has a reference to its Yallist.Node.  This
// never changes.
//
// cache is a Map (or PseudoMap) that matches the keys to
// the Yallist.Node object.
class LRUCache {
    constructor(options){
        if (typeof options === "number") options = {
            max: options
        };
        if (!options) options = {};
        if (options.max && (typeof options.max !== "number" || options.max < 0)) throw new TypeError("max must be a non-negative number");
        // Kind of weird to have a default max of Infinity, but oh well.
        const max = this[MAX] = options.max || Infinity;
        const lc = options.length || naiveLength;
        this[LENGTH_CALCULATOR] = typeof lc !== "function" ? naiveLength : lc;
        this[ALLOW_STALE] = options.stale || false;
        if (options.maxAge && typeof options.maxAge !== "number") throw new TypeError("maxAge must be a number");
        this[MAX_AGE] = options.maxAge || 0;
        this[DISPOSE] = options.dispose;
        this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
        this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
        this.reset();
    }
    // resize the cache when the max changes.
    set max(mL) {
        if (typeof mL !== "number" || mL < 0) throw new TypeError("max must be a non-negative number");
        this[MAX] = mL || Infinity;
        trim(this);
    }
    get max() {
        return this[MAX];
    }
    set allowStale(allowStale) {
        this[ALLOW_STALE] = !!allowStale;
    }
    get allowStale() {
        return this[ALLOW_STALE];
    }
    set maxAge(mA) {
        if (typeof mA !== "number") throw new TypeError("maxAge must be a non-negative number");
        this[MAX_AGE] = mA;
        trim(this);
    }
    get maxAge() {
        return this[MAX_AGE];
    }
    // resize the cache when the lengthCalculator changes.
    set lengthCalculator(lC) {
        if (typeof lC !== "function") lC = naiveLength;
        if (lC !== this[LENGTH_CALCULATOR]) {
            this[LENGTH_CALCULATOR] = lC;
            this[LENGTH] = 0;
            this[LRU_LIST].forEach((hit)=>{
                hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
                this[LENGTH] += hit.length;
            });
        }
        trim(this);
    }
    get lengthCalculator() {
        return this[LENGTH_CALCULATOR];
    }
    get length() {
        return this[LENGTH];
    }
    get itemCount() {
        return this[LRU_LIST].length;
    }
    rforEach(fn, thisp) {
        thisp = thisp || this;
        for(let walker = this[LRU_LIST].tail; walker !== null;){
            const prev = walker.prev;
            forEachStep(this, fn, walker, thisp);
            walker = prev;
        }
    }
    forEach(fn, thisp) {
        thisp = thisp || this;
        for(let walker = this[LRU_LIST].head; walker !== null;){
            const next = walker.next;
            forEachStep(this, fn, walker, thisp);
            walker = next;
        }
    }
    keys() {
        return this[LRU_LIST].toArray().map((k)=>k.key);
    }
    values() {
        return this[LRU_LIST].toArray().map((k)=>k.value);
    }
    reset() {
        if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
            this[LRU_LIST].forEach((hit)=>this[DISPOSE](hit.key, hit.value));
        }
        this[CACHE] = new Map() // hash of items by key
        ;
        this[LRU_LIST] = new Yallist() // list of items in order of use recency
        ;
        this[LENGTH] = 0 // length of items in the list
        ;
    }
    dump() {
        return this[LRU_LIST].map((hit)=>isStale(this, hit) ? false : {
                k: hit.key,
                v: hit.value,
                e: hit.now + (hit.maxAge || 0)
            }).toArray().filter((h)=>h);
    }
    dumpLru() {
        return this[LRU_LIST];
    }
    set(key, value, maxAge) {
        maxAge = maxAge || this[MAX_AGE];
        if (maxAge && typeof maxAge !== "number") throw new TypeError("maxAge must be a number");
        const now = maxAge ? Date.now() : 0;
        const len = this[LENGTH_CALCULATOR](value, key);
        if (this[CACHE].has(key)) {
            if (len > this[MAX]) {
                del(this, this[CACHE].get(key));
                return false;
            }
            const node = this[CACHE].get(key);
            const item = node.value;
            // dispose of the old one before overwriting
            // split out into 2 ifs for better coverage tracking
            if (this[DISPOSE]) {
                if (!this[NO_DISPOSE_ON_SET]) this[DISPOSE](key, item.value);
            }
            item.now = now;
            item.maxAge = maxAge;
            item.value = value;
            this[LENGTH] += len - item.length;
            item.length = len;
            this.get(key);
            trim(this);
            return true;
        }
        const hit = new Entry(key, value, len, now, maxAge);
        // oversized objects fall out of cache automatically.
        if (hit.length > this[MAX]) {
            if (this[DISPOSE]) this[DISPOSE](key, value);
            return false;
        }
        this[LENGTH] += hit.length;
        this[LRU_LIST].unshift(hit);
        this[CACHE].set(key, this[LRU_LIST].head);
        trim(this);
        return true;
    }
    has(key) {
        if (!this[CACHE].has(key)) return false;
        const hit = this[CACHE].get(key).value;
        return !isStale(this, hit);
    }
    get(key) {
        return get(this, key, true);
    }
    peek(key) {
        return get(this, key, false);
    }
    pop() {
        const node = this[LRU_LIST].tail;
        if (!node) return null;
        del(this, node);
        return node.value;
    }
    del(key) {
        del(this, this[CACHE].get(key));
    }
    load(arr) {
        // reset the cache
        this.reset();
        const now = Date.now();
        // A previous serialized cache has the most recent items first
        for(let l = arr.length - 1; l >= 0; l--){
            const hit = arr[l];
            const expiresAt = hit.e || 0;
            if (expiresAt === 0) // the item was created without expiration in a non aged cache
            this.set(hit.k, hit.v);
            else {
                const maxAge = expiresAt - now;
                // dont add already expired items
                if (maxAge > 0) {
                    this.set(hit.k, hit.v, maxAge);
                }
            }
        }
    }
    prune() {
        this[CACHE].forEach((value, key)=>get(this, key, false));
    }
}
const get = (self, key, doUse)=>{
    const node = self[CACHE].get(key);
    if (node) {
        const hit = node.value;
        if (isStale(self, hit)) {
            del(self, node);
            if (!self[ALLOW_STALE]) return undefined;
        } else {
            if (doUse) {
                if (self[UPDATE_AGE_ON_GET]) node.value.now = Date.now();
                self[LRU_LIST].unshiftNode(node);
            }
        }
        return hit.value;
    }
};
const isStale = (self, hit)=>{
    if (!hit || !hit.maxAge && !self[MAX_AGE]) return false;
    const diff = Date.now() - hit.now;
    return hit.maxAge ? diff > hit.maxAge : self[MAX_AGE] && diff > self[MAX_AGE];
};
const trim = (self)=>{
    if (self[LENGTH] > self[MAX]) {
        for(let walker = self[LRU_LIST].tail; self[LENGTH] > self[MAX] && walker !== null;){
            // We know that we're about to delete this one, and also
            // what the next least recently used key will be, so just
            // go ahead and set it now.
            const prev = walker.prev;
            del(self, walker);
            walker = prev;
        }
    }
};
const del = (self, node)=>{
    if (node) {
        const hit = node.value;
        if (self[DISPOSE]) self[DISPOSE](hit.key, hit.value);
        self[LENGTH] -= hit.length;
        self[CACHE].delete(hit.key);
        self[LRU_LIST].removeNode(node);
    }
};
class Entry {
    constructor(key, value, length, now, maxAge){
        this.key = key;
        this.value = value;
        this.length = length;
        this.now = now;
        this.maxAge = maxAge || 0;
    }
}
const forEachStep = (self, fn, node, thisp)=>{
    let hit = node.value;
    if (isStale(self, hit)) {
        del(self, node);
        if (!self[ALLOW_STALE]) hit = undefined;
    }
    if (hit) fn.call(thisp, hit.value, hit.key, self);
};
module.exports = LRUCache;


/***/ }),

/***/ 16253:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*!
 * mime-db
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015-2022 Douglas Christopher Wilson
 * MIT Licensed
 */ /**
 * Module exports.
 */ 
module.exports = __webpack_require__(91670);


/***/ }),

/***/ 45453:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * mime-types
 * Copyright(c) 2014 Jonathan Ong
 * Copyright(c) 2015 Douglas Christopher Wilson
 * MIT Licensed
 */ 
/**
 * Module dependencies.
 * @private
 */ var db = __webpack_require__(16253);
var extname = (__webpack_require__(71017).extname);
/**
 * Module variables.
 * @private
 */ var EXTRACT_TYPE_REGEXP = /^\s*([^;\s]*)(?:;|\s|$)/;
var TEXT_TYPE_REGEXP = /^text\//i;
/**
 * Module exports.
 * @public
 */ exports.charset = charset;
exports.charsets = {
    lookup: charset
};
exports.contentType = contentType;
exports.extension = extension;
exports.extensions = Object.create(null);
exports.lookup = lookup;
exports.types = Object.create(null);
// Populate the extensions/types maps
populateMaps(exports.extensions, exports.types);
/**
 * Get the default charset for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */ function charset(type) {
    if (!type || typeof type !== "string") {
        return false;
    }
    // TODO: use media-typer
    var match = EXTRACT_TYPE_REGEXP.exec(type);
    var mime = match && db[match[1].toLowerCase()];
    if (mime && mime.charset) {
        return mime.charset;
    }
    // default text/* to utf-8
    if (match && TEXT_TYPE_REGEXP.test(match[1])) {
        return "UTF-8";
    }
    return false;
}
/**
 * Create a full Content-Type header given a MIME type or extension.
 *
 * @param {string} str
 * @return {boolean|string}
 */ function contentType(str) {
    // TODO: should this even be in this module?
    if (!str || typeof str !== "string") {
        return false;
    }
    var mime = str.indexOf("/") === -1 ? exports.lookup(str) : str;
    if (!mime) {
        return false;
    }
    // TODO: use content-type or other module
    if (mime.indexOf("charset") === -1) {
        var charset = exports.charset(mime);
        if (charset) mime += "; charset=" + charset.toLowerCase();
    }
    return mime;
}
/**
 * Get the default extension for a MIME type.
 *
 * @param {string} type
 * @return {boolean|string}
 */ function extension(type) {
    if (!type || typeof type !== "string") {
        return false;
    }
    // TODO: use media-typer
    var match = EXTRACT_TYPE_REGEXP.exec(type);
    // get extensions
    var exts = match && exports.extensions[match[1].toLowerCase()];
    if (!exts || !exts.length) {
        return false;
    }
    return exts[0];
}
/**
 * Lookup the MIME type for a file path/extension.
 *
 * @param {string} path
 * @return {boolean|string}
 */ function lookup(path) {
    if (!path || typeof path !== "string") {
        return false;
    }
    // get the extension ("ext" or ".ext" or full path)
    var extension = extname("x." + path).toLowerCase().substr(1);
    if (!extension) {
        return false;
    }
    return exports.types[extension] || false;
}
/**
 * Populate the extensions and types maps.
 * @private
 */ function populateMaps(extensions, types) {
    // source preference (least -> most)
    var preference = [
        "nginx",
        "apache",
        undefined,
        "iana"
    ];
    Object.keys(db).forEach(function forEachMimeType(type) {
        var mime = db[type];
        var exts = mime.extensions;
        if (!exts || !exts.length) {
            return;
        }
        // mime -> extensions
        extensions[type] = exts;
        // extension -> mime
        for(var i = 0; i < exts.length; i++){
            var extension = exts[i];
            if (types[extension]) {
                var from = preference.indexOf(db[types[extension]].source);
                var to = preference.indexOf(mime.source);
                if (types[extension] !== "application/octet-stream" && (from > to || from === to && types[extension].substr(0, 12) === "application/")) {
                    continue;
                }
            }
            // set the extension -> mime
            types[extension] = type;
        }
    });
}


/***/ }),

/***/ 81769:
/***/ ((module) => {

"use strict";
/**
 * Helpers.
 */ 
var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var w = d * 7;
var y = d * 365.25;
/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */ module.exports = function(val, options) {
    options = options || {};
    var type = typeof val;
    if (type === "string" && val.length > 0) {
        return parse(val);
    } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
    }
    throw new Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(val));
};
/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */ function parse(str) {
    str = String(str);
    if (str.length > 100) {
        return;
    }
    var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(str);
    if (!match) {
        return;
    }
    var n = parseFloat(match[1]);
    var type = (match[2] || "ms").toLowerCase();
    switch(type){
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
            return n * y;
        case "weeks":
        case "week":
        case "w":
            return n * w;
        case "days":
        case "day":
        case "d":
            return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
            return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
            return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
            return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
            return n;
        default:
            return undefined;
    }
}
/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtShort(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return Math.round(ms / d) + "d";
    }
    if (msAbs >= h) {
        return Math.round(ms / h) + "h";
    }
    if (msAbs >= m) {
        return Math.round(ms / m) + "m";
    }
    if (msAbs >= s) {
        return Math.round(ms / s) + "s";
    }
    return ms + "ms";
}
/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */ function fmtLong(ms) {
    var msAbs = Math.abs(ms);
    if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
    }
    if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
    }
    if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
    }
    if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
    }
    return ms + " ms";
}
/**
 * Pluralization helper.
 */ function plural(ms, msAbs, n, name) {
    var isPlural = msAbs >= n * 1.5;
    return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
}


/***/ }),

/***/ 36827:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(94483);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.UnsupportedStrategy = exports.UnknownError = exports.OAuthCallbackError = exports.MissingSecret = exports.MissingAuthorize = exports.MissingAdapterMethods = exports.MissingAdapter = exports.MissingAPIRoute = exports.InvalidCallbackUrl = exports.AccountNotLinkedError = void 0;
exports.adapterErrorHandler = adapterErrorHandler;
exports.capitalize = capitalize;
exports.eventsErrorHandler = eventsErrorHandler;
exports.upperSnake = upperSnake;
var _regenerator = _interopRequireDefault(__webpack_require__(88150));
var _asyncToGenerator2 = _interopRequireDefault(__webpack_require__(22657));
var _assertThisInitialized2 = _interopRequireDefault(__webpack_require__(63431));
var _defineProperty2 = _interopRequireDefault(__webpack_require__(78256));
var _classCallCheck2 = _interopRequireDefault(__webpack_require__(38446));
var _createClass2 = _interopRequireDefault(__webpack_require__(88805));
var _inherits2 = _interopRequireDefault(__webpack_require__(88457));
var _possibleConstructorReturn2 = _interopRequireDefault(__webpack_require__(56874));
var _getPrototypeOf2 = _interopRequireDefault(__webpack_require__(73838));
var _wrapNativeSuper2 = _interopRequireDefault(__webpack_require__(37774));
function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
        var Super = (0, _getPrototypeOf2.default)(Derived), result;
        if (hasNativeReflectConstruct) {
            var NewTarget = (0, _getPrototypeOf2.default)(this).constructor;
            result = Reflect.construct(Super, arguments, NewTarget);
        } else {
            result = Super.apply(this, arguments);
        }
        return (0, _possibleConstructorReturn2.default)(this, result);
    };
}
function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
var UnknownError = function(_Error) {
    (0, _inherits2.default)(UnknownError, _Error);
    var _super = _createSuper(UnknownError);
    function UnknownError(error) {
        var _message;
        var _this;
        (0, _classCallCheck2.default)(this, UnknownError);
        _this = _super.call(this, (_message = error === null || error === void 0 ? void 0 : error.message) !== null && _message !== void 0 ? _message : error);
        _this.name = "UnknownError";
        _this.code = error.code;
        if (error instanceof Error) {
            _this.stack = error.stack;
        }
        return _this;
    }
    (0, _createClass2.default)(UnknownError, [
        {
            key: "toJSON",
            value: function toJSON() {
                return {
                    name: this.name,
                    message: this.message,
                    stack: this.stack
                };
            }
        }
    ]);
    return UnknownError;
}((0, _wrapNativeSuper2.default)(Error));
exports.UnknownError = UnknownError;
var OAuthCallbackError = function(_UnknownError) {
    (0, _inherits2.default)(OAuthCallbackError, _UnknownError);
    var _super2 = _createSuper(OAuthCallbackError);
    function OAuthCallbackError() {
        var _this2;
        (0, _classCallCheck2.default)(this, OAuthCallbackError);
        for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
            args[_key] = arguments[_key];
        }
        _this2 = _super2.call.apply(_super2, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this2), "name", "OAuthCallbackError");
        return _this2;
    }
    return (0, _createClass2.default)(OAuthCallbackError);
}(UnknownError);
exports.OAuthCallbackError = OAuthCallbackError;
var AccountNotLinkedError = function(_UnknownError2) {
    (0, _inherits2.default)(AccountNotLinkedError, _UnknownError2);
    var _super3 = _createSuper(AccountNotLinkedError);
    function AccountNotLinkedError() {
        var _this3;
        (0, _classCallCheck2.default)(this, AccountNotLinkedError);
        for(var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++){
            args[_key2] = arguments[_key2];
        }
        _this3 = _super3.call.apply(_super3, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this3), "name", "AccountNotLinkedError");
        return _this3;
    }
    return (0, _createClass2.default)(AccountNotLinkedError);
}(UnknownError);
exports.AccountNotLinkedError = AccountNotLinkedError;
var MissingAPIRoute = function(_UnknownError3) {
    (0, _inherits2.default)(MissingAPIRoute, _UnknownError3);
    var _super4 = _createSuper(MissingAPIRoute);
    function MissingAPIRoute() {
        var _this4;
        (0, _classCallCheck2.default)(this, MissingAPIRoute);
        for(var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++){
            args[_key3] = arguments[_key3];
        }
        _this4 = _super4.call.apply(_super4, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "name", "MissingAPIRouteError");
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this4), "code", "MISSING_NEXTAUTH_API_ROUTE_ERROR");
        return _this4;
    }
    return (0, _createClass2.default)(MissingAPIRoute);
}(UnknownError);
exports.MissingAPIRoute = MissingAPIRoute;
var MissingSecret = function(_UnknownError4) {
    (0, _inherits2.default)(MissingSecret, _UnknownError4);
    var _super5 = _createSuper(MissingSecret);
    function MissingSecret() {
        var _this5;
        (0, _classCallCheck2.default)(this, MissingSecret);
        for(var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++){
            args[_key4] = arguments[_key4];
        }
        _this5 = _super5.call.apply(_super5, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this5), "name", "MissingSecretError");
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this5), "code", "NO_SECRET");
        return _this5;
    }
    return (0, _createClass2.default)(MissingSecret);
}(UnknownError);
exports.MissingSecret = MissingSecret;
var MissingAuthorize = function(_UnknownError5) {
    (0, _inherits2.default)(MissingAuthorize, _UnknownError5);
    var _super6 = _createSuper(MissingAuthorize);
    function MissingAuthorize() {
        var _this6;
        (0, _classCallCheck2.default)(this, MissingAuthorize);
        for(var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++){
            args[_key5] = arguments[_key5];
        }
        _this6 = _super6.call.apply(_super6, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this6), "name", "MissingAuthorizeError");
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this6), "code", "CALLBACK_CREDENTIALS_HANDLER_ERROR");
        return _this6;
    }
    return (0, _createClass2.default)(MissingAuthorize);
}(UnknownError);
exports.MissingAuthorize = MissingAuthorize;
var MissingAdapter = function(_UnknownError6) {
    (0, _inherits2.default)(MissingAdapter, _UnknownError6);
    var _super7 = _createSuper(MissingAdapter);
    function MissingAdapter() {
        var _this7;
        (0, _classCallCheck2.default)(this, MissingAdapter);
        for(var _len6 = arguments.length, args = new Array(_len6), _key6 = 0; _key6 < _len6; _key6++){
            args[_key6] = arguments[_key6];
        }
        _this7 = _super7.call.apply(_super7, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this7), "name", "MissingAdapterError");
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this7), "code", "EMAIL_REQUIRES_ADAPTER_ERROR");
        return _this7;
    }
    return (0, _createClass2.default)(MissingAdapter);
}(UnknownError);
exports.MissingAdapter = MissingAdapter;
var MissingAdapterMethods = function(_UnknownError7) {
    (0, _inherits2.default)(MissingAdapterMethods, _UnknownError7);
    var _super8 = _createSuper(MissingAdapterMethods);
    function MissingAdapterMethods() {
        var _this8;
        (0, _classCallCheck2.default)(this, MissingAdapterMethods);
        for(var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++){
            args[_key7] = arguments[_key7];
        }
        _this8 = _super8.call.apply(_super8, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this8), "name", "MissingAdapterMethodsError");
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this8), "code", "MISSING_ADAPTER_METHODS_ERROR");
        return _this8;
    }
    return (0, _createClass2.default)(MissingAdapterMethods);
}(UnknownError);
exports.MissingAdapterMethods = MissingAdapterMethods;
var UnsupportedStrategy = function(_UnknownError8) {
    (0, _inherits2.default)(UnsupportedStrategy, _UnknownError8);
    var _super9 = _createSuper(UnsupportedStrategy);
    function UnsupportedStrategy() {
        var _this9;
        (0, _classCallCheck2.default)(this, UnsupportedStrategy);
        for(var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++){
            args[_key8] = arguments[_key8];
        }
        _this9 = _super9.call.apply(_super9, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this9), "name", "UnsupportedStrategyError");
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this9), "code", "CALLBACK_CREDENTIALS_JWT_ERROR");
        return _this9;
    }
    return (0, _createClass2.default)(UnsupportedStrategy);
}(UnknownError);
exports.UnsupportedStrategy = UnsupportedStrategy;
var InvalidCallbackUrl = function(_UnknownError9) {
    (0, _inherits2.default)(InvalidCallbackUrl, _UnknownError9);
    var _super10 = _createSuper(InvalidCallbackUrl);
    function InvalidCallbackUrl() {
        var _this10;
        (0, _classCallCheck2.default)(this, InvalidCallbackUrl);
        for(var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++){
            args[_key9] = arguments[_key9];
        }
        _this10 = _super10.call.apply(_super10, [
            this
        ].concat(args));
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this10), "name", "InvalidCallbackUrl");
        (0, _defineProperty2.default)((0, _assertThisInitialized2.default)(_this10), "code", "INVALID_CALLBACK_URL_ERROR");
        return _this10;
    }
    return (0, _createClass2.default)(InvalidCallbackUrl);
}(UnknownError);
exports.InvalidCallbackUrl = InvalidCallbackUrl;
function upperSnake(s) {
    return s.replace(/([A-Z])/g, "_$1").toUpperCase();
}
function capitalize(s) {
    return "".concat(s[0].toUpperCase()).concat(s.slice(1));
}
function eventsErrorHandler(methods, logger) {
    return Object.keys(methods).reduce(function(acc, name) {
        acc[name] = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee() {
            var method, _args = arguments;
            return _regenerator.default.wrap(function _callee$(_context) {
                while(1){
                    switch(_context.prev = _context.next){
                        case 0:
                            _context.prev = 0;
                            method = methods[name];
                            _context.next = 4;
                            return method.apply(void 0, _args);
                        case 4:
                            return _context.abrupt("return", _context.sent);
                        case 7:
                            _context.prev = 7;
                            _context.t0 = _context["catch"](0);
                            logger.error("".concat(upperSnake(name), "_EVENT_ERROR"), _context.t0);
                        case 10:
                        case "end":
                            return _context.stop();
                    }
                }
            }, _callee, null, [
                [
                    0,
                    7
                ]
            ]);
        }));
        return acc;
    }, {});
}
function adapterErrorHandler(adapter, logger) {
    if (!adapter) return;
    return Object.keys(adapter).reduce(function(acc, name) {
        acc[name] = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2() {
            var _len10, args, _key10, method, e, _args2 = arguments;
            return _regenerator.default.wrap(function _callee2$(_context2) {
                while(1){
                    switch(_context2.prev = _context2.next){
                        case 0:
                            _context2.prev = 0;
                            for(_len10 = _args2.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++){
                                args[_key10] = _args2[_key10];
                            }
                            logger.debug("adapter_".concat(name), {
                                args: args
                            });
                            method = adapter[name];
                            _context2.next = 6;
                            return method.apply(void 0, args);
                        case 6:
                            return _context2.abrupt("return", _context2.sent);
                        case 9:
                            _context2.prev = 9;
                            _context2.t0 = _context2["catch"](0);
                            logger.error("adapter_error_".concat(name), _context2.t0);
                            e = new UnknownError(_context2.t0);
                            e.name = "".concat(capitalize(name), "Error");
                            throw e;
                        case 15:
                        case "end":
                            return _context2.stop();
                    }
                }
            }, _callee2, null, [
                [
                    0,
                    9
                ]
            ]);
        }));
        return acc;
    }, {});
}


/***/ }),

/***/ 84377:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(94483);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.AuthHandler = AuthHandler;
var _logger = _interopRequireWildcard(__webpack_require__(50124));
var _detectOrigin = __webpack_require__(26656);
var routes = _interopRequireWildcard(__webpack_require__(94788));
var _pages = _interopRequireDefault(__webpack_require__(4424));
var _init = __webpack_require__(72914);
var _assert = __webpack_require__(55648);
var _cookie = __webpack_require__(18689);
var _cookie2 = __webpack_require__(21024);
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function getBody(req) {
    try {
        return await req.json();
    } catch (_unused) {}
}
async function toInternalRequest(req) {
    var _headers$xForwarded2;
    if (req instanceof Request) {
        var _req$headers$get, _url$searchParams$get, _headers$xForwarded;
        const url = new URL(req.url);
        const nextauth = url.pathname.split("/").slice(3);
        const headers = Object.fromEntries(req.headers);
        const query = Object.fromEntries(url.searchParams);
        query.nextauth = nextauth;
        return {
            action: nextauth[0],
            method: req.method,
            headers,
            body: await getBody(req),
            cookies: (0, _cookie2.parse)((_req$headers$get = req.headers.get("cookie")) !== null && _req$headers$get !== void 0 ? _req$headers$get : ""),
            providerId: nextauth[1],
            error: (_url$searchParams$get = url.searchParams.get("error")) !== null && _url$searchParams$get !== void 0 ? _url$searchParams$get : nextauth[1],
            origin: (0, _detectOrigin.detectOrigin)((_headers$xForwarded = headers["x-forwarded-host"]) !== null && _headers$xForwarded !== void 0 ? _headers$xForwarded : headers.host, headers["x-forwarded-proto"]),
            query
        };
    }
    const { headers } = req;
    const host = (_headers$xForwarded2 = headers === null || headers === void 0 ? void 0 : headers["x-forwarded-host"]) !== null && _headers$xForwarded2 !== void 0 ? _headers$xForwarded2 : headers === null || headers === void 0 ? void 0 : headers.host;
    req.origin = (0, _detectOrigin.detectOrigin)(host, headers === null || headers === void 0 ? void 0 : headers["x-forwarded-proto"]);
    return req;
}
async function AuthHandler(params) {
    var _req$body$callbackUrl, _req$body, _req$query2, _req$body2;
    const { options: authOptions, req: incomingRequest } = params;
    const req = await toInternalRequest(incomingRequest);
    (0, _logger.setLogger)(authOptions.logger, authOptions.debug);
    const assertionResult = (0, _assert.assertConfig)({
        options: authOptions,
        req
    });
    if (Array.isArray(assertionResult)) {
        assertionResult.forEach(_logger.default.warn);
    } else if (assertionResult instanceof Error) {
        var _req$query, _req$query$callbackUr;
        _logger.default.error(assertionResult.code, assertionResult);
        const htmlPages = [
            "signin",
            "signout",
            "error",
            "verify-request"
        ];
        if (!htmlPages.includes(req.action) || req.method !== "GET") {
            const message = `There is a problem with the server configuration. Check the server logs for more information.`;
            return {
                status: 500,
                headers: [
                    {
                        key: "Content-Type",
                        value: "application/json"
                    }
                ],
                body: {
                    message
                }
            };
        }
        const { pages, theme } = authOptions;
        const authOnErrorPage = (pages === null || pages === void 0 ? void 0 : pages.error) && ((_req$query = req.query) === null || _req$query === void 0 ? void 0 : (_req$query$callbackUr = _req$query.callbackUrl) === null || _req$query$callbackUr === void 0 ? void 0 : _req$query$callbackUr.startsWith(pages.error));
        if (!(pages !== null && pages !== void 0 && pages.error) || authOnErrorPage) {
            if (authOnErrorPage) {
                _logger.default.error("AUTH_ON_ERROR_PAGE_ERROR", new Error(`The error page ${pages === null || pages === void 0 ? void 0 : pages.error} should not require authentication`));
            }
            const render = (0, _pages.default)({
                theme
            });
            return render.error({
                error: "configuration"
            });
        }
        return {
            redirect: `${pages.error}?error=Configuration`
        };
    }
    const { action, providerId, error, method = "GET" } = req;
    const { options, cookies } = await (0, _init.init)({
        authOptions,
        action,
        providerId,
        origin: req.origin,
        callbackUrl: (_req$body$callbackUrl = (_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.callbackUrl) !== null && _req$body$callbackUrl !== void 0 ? _req$body$callbackUrl : (_req$query2 = req.query) === null || _req$query2 === void 0 ? void 0 : _req$query2.callbackUrl,
        csrfToken: (_req$body2 = req.body) === null || _req$body2 === void 0 ? void 0 : _req$body2.csrfToken,
        cookies: req.cookies,
        isPost: method === "POST"
    });
    const sessionStore = new _cookie.SessionStore(options.cookies.sessionToken, req, options.logger);
    if (method === "GET") {
        const render = (0, _pages.default)({
            ...options,
            query: req.query,
            cookies
        });
        const { pages } = options;
        switch(action){
            case "providers":
                return await routes.providers(options.providers);
            case "session":
                {
                    const session = await routes.session({
                        options,
                        sessionStore
                    });
                    if (session.cookies) cookies.push(...session.cookies);
                    return {
                        ...session,
                        cookies
                    };
                }
            case "csrf":
                return {
                    headers: [
                        {
                            key: "Content-Type",
                            value: "application/json"
                        }
                    ],
                    body: {
                        csrfToken: options.csrfToken
                    },
                    cookies
                };
            case "signin":
                if (pages.signIn) {
                    let signinUrl = `${pages.signIn}${pages.signIn.includes("?") ? "&" : "?"}callbackUrl=${encodeURIComponent(options.callbackUrl)}`;
                    if (error) signinUrl = `${signinUrl}&error=${encodeURIComponent(error)}`;
                    return {
                        redirect: signinUrl,
                        cookies
                    };
                }
                return render.signin();
            case "signout":
                if (pages.signOut) return {
                    redirect: pages.signOut,
                    cookies
                };
                return render.signout();
            case "callback":
                if (options.provider) {
                    const callback = await routes.callback({
                        body: req.body,
                        query: req.query,
                        headers: req.headers,
                        cookies: req.cookies,
                        method,
                        options,
                        sessionStore
                    });
                    if (callback.cookies) cookies.push(...callback.cookies);
                    return {
                        ...callback,
                        cookies
                    };
                }
                break;
            case "verify-request":
                if (pages.verifyRequest) {
                    return {
                        redirect: pages.verifyRequest,
                        cookies
                    };
                }
                return render.verifyRequest();
            case "error":
                if ([
                    "Signin",
                    "OAuthSignin",
                    "OAuthCallback",
                    "OAuthCreateAccount",
                    "EmailCreateAccount",
                    "Callback",
                    "OAuthAccountNotLinked",
                    "EmailSignin",
                    "CredentialsSignin",
                    "SessionRequired"
                ].includes(error)) {
                    return {
                        redirect: `${options.url}/signin?error=${error}`,
                        cookies
                    };
                }
                if (pages.error) {
                    return {
                        redirect: `${pages.error}${pages.error.includes("?") ? "&" : "?"}error=${error}`,
                        cookies
                    };
                }
                return render.error({
                    error: error
                });
            default:
        }
    } else if (method === "POST") {
        switch(action){
            case "signin":
                if (options.csrfTokenVerified && options.provider) {
                    const signin = await routes.signin({
                        query: req.query,
                        body: req.body,
                        options
                    });
                    if (signin.cookies) cookies.push(...signin.cookies);
                    return {
                        ...signin,
                        cookies
                    };
                }
                return {
                    redirect: `${options.url}/signin?csrf=true`,
                    cookies
                };
            case "signout":
                if (options.csrfTokenVerified) {
                    const signout = await routes.signout({
                        options,
                        sessionStore
                    });
                    if (signout.cookies) cookies.push(...signout.cookies);
                    return {
                        ...signout,
                        cookies
                    };
                }
                return {
                    redirect: `${options.url}/signout?csrf=true`,
                    cookies
                };
            case "callback":
                if (options.provider) {
                    if (options.provider.type === "credentials" && !options.csrfTokenVerified) {
                        return {
                            redirect: `${options.url}/signin?csrf=true`,
                            cookies
                        };
                    }
                    const callback = await routes.callback({
                        body: req.body,
                        query: req.query,
                        headers: req.headers,
                        cookies: req.cookies,
                        method,
                        options,
                        sessionStore
                    });
                    if (callback.cookies) cookies.push(...callback.cookies);
                    return {
                        ...callback,
                        cookies
                    };
                }
                break;
            case "_log":
                {
                    if (authOptions.logger) {
                        try {
                            var _req$body3;
                            const { code, level, ...metadata } = (_req$body3 = req.body) !== null && _req$body3 !== void 0 ? _req$body3 : {};
                            _logger.default[level](code, metadata);
                        } catch (error) {
                            _logger.default.error("LOGGER_ERROR", error);
                        }
                    }
                    return {};
                }
            case "session":
                {
                    if (options.csrfTokenVerified) {
                        var _req$body4;
                        const session = await routes.session({
                            options,
                            sessionStore,
                            newSession: (_req$body4 = req.body) === null || _req$body4 === void 0 ? void 0 : _req$body4.data,
                            isUpdate: true
                        });
                        if (session.cookies) cookies.push(...session.cookies);
                        return {
                            ...session,
                            cookies
                        };
                    }
                    return {
                        status: 400,
                        body: {},
                        cookies
                    };
                }
            default:
        }
    }
    return {
        status: 400,
        body: `Error: This action with HTTP ${method} is not supported by NextAuth.js`
    };
}


/***/ }),

/***/ 72914:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(94483);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.init = init;
var _crypto = __webpack_require__(6113);
var _logger = _interopRequireDefault(__webpack_require__(50124));
var _errors = __webpack_require__(36827);
var _providers = _interopRequireDefault(__webpack_require__(75898));
var _utils = __webpack_require__(42086);
var cookie = _interopRequireWildcard(__webpack_require__(18689));
var jwt = _interopRequireWildcard(__webpack_require__(83517));
var _defaultCallbacks = __webpack_require__(21601);
var _csrfToken = __webpack_require__(48079);
var _callbackUrl = __webpack_require__(81764);
var _parseUrl = _interopRequireDefault(__webpack_require__(86912));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function init({ authOptions, providerId, action, origin, cookies: reqCookies, callbackUrl: reqCallbackUrl, csrfToken: reqCsrfToken, isPost }) {
    var _authOptions$useSecur, _authOptions$events;
    const url = (0, _parseUrl.default)(origin);
    const secret = (0, _utils.createSecret)({
        authOptions,
        url
    });
    const { providers, provider } = (0, _providers.default)({
        providers: authOptions.providers,
        url,
        providerId
    });
    const maxAge = 30 * 24 * 60 * 60;
    const options = {
        debug: false,
        pages: {},
        theme: {
            colorScheme: "auto",
            logo: "",
            brandColor: "",
            buttonText: ""
        },
        ...authOptions,
        url,
        action,
        provider,
        cookies: {
            ...cookie.defaultCookies((_authOptions$useSecur = authOptions.useSecureCookies) !== null && _authOptions$useSecur !== void 0 ? _authOptions$useSecur : url.base.startsWith("https://")),
            ...authOptions.cookies
        },
        secret,
        providers,
        session: {
            strategy: authOptions.adapter ? "database" : "jwt",
            maxAge,
            updateAge: 24 * 60 * 60,
            generateSessionToken: ()=>{
                var _randomUUID;
                return (_randomUUID = _crypto.randomUUID === null || _crypto.randomUUID === void 0 ? void 0 : (0, _crypto.randomUUID)()) !== null && _randomUUID !== void 0 ? _randomUUID : (0, _crypto.randomBytes)(32).toString("hex");
            },
            ...authOptions.session
        },
        jwt: {
            secret,
            maxAge,
            encode: jwt.encode,
            decode: jwt.decode,
            ...authOptions.jwt
        },
        events: (0, _errors.eventsErrorHandler)((_authOptions$events = authOptions.events) !== null && _authOptions$events !== void 0 ? _authOptions$events : {}, _logger.default),
        adapter: (0, _errors.adapterErrorHandler)(authOptions.adapter, _logger.default),
        callbacks: {
            ..._defaultCallbacks.defaultCallbacks,
            ...authOptions.callbacks
        },
        logger: _logger.default,
        callbackUrl: url.origin
    };
    const cookies = [];
    const { csrfToken, cookie: csrfCookie, csrfTokenVerified } = (0, _csrfToken.createCSRFToken)({
        options,
        cookieValue: reqCookies === null || reqCookies === void 0 ? void 0 : reqCookies[options.cookies.csrfToken.name],
        isPost,
        bodyValue: reqCsrfToken
    });
    options.csrfToken = csrfToken;
    options.csrfTokenVerified = csrfTokenVerified;
    if (csrfCookie) {
        cookies.push({
            name: options.cookies.csrfToken.name,
            value: csrfCookie,
            options: options.cookies.csrfToken.options
        });
    }
    const { callbackUrl, callbackUrlCookie } = await (0, _callbackUrl.createCallbackUrl)({
        options,
        cookieValue: reqCookies === null || reqCookies === void 0 ? void 0 : reqCookies[options.cookies.callbackUrl.name],
        paramValue: reqCallbackUrl
    });
    options.callbackUrl = callbackUrl;
    if (callbackUrlCookie) {
        cookies.push({
            name: options.cookies.callbackUrl.name,
            value: callbackUrlCookie,
            options: options.cookies.callbackUrl.options
        });
    }
    return {
        options,
        cookies
    };
}


/***/ }),

/***/ 55648:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(94483);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.assertConfig = assertConfig;
var _errors = __webpack_require__(36827);
var _parseUrl = _interopRequireDefault(__webpack_require__(86912));
var _cookie = __webpack_require__(18689);
let warned = false;
function isValidHttpUrl(url, baseUrl) {
    try {
        return /^https?:/.test(new URL(url, url.startsWith("/") ? baseUrl : undefined).protocol);
    } catch (_unused) {
        return false;
    }
}
function assertConfig(params) {
    var _req$query, _req$query2, _options$useSecureCoo, _req$cookies, _options$cookies$call, _options$cookies, _options$cookies$call2;
    const { options, req } = params;
    const warnings = [];
    if (!warned) {
        if (!req.origin) warnings.push("NEXTAUTH_URL");
        if (!options.secret && "production" !== "production") {}
        if (options.debug) warnings.push("DEBUG_ENABLED");
    }
    if (!options.secret && "production" === "production") {
        return new _errors.MissingSecret("Please define a `secret` in production.");
    }
    if (!((_req$query = req.query) !== null && _req$query !== void 0 && _req$query.nextauth) && !req.action) {
        return new _errors.MissingAPIRoute("Cannot find [...nextauth].{js,ts} in `/pages/api/auth`. Make sure the filename is written correctly.");
    }
    const callbackUrlParam = (_req$query2 = req.query) === null || _req$query2 === void 0 ? void 0 : _req$query2.callbackUrl;
    const url = (0, _parseUrl.default)(req.origin);
    if (callbackUrlParam && !isValidHttpUrl(callbackUrlParam, url.base)) {
        return new _errors.InvalidCallbackUrl(`Invalid callback URL. Received: ${callbackUrlParam}`);
    }
    const { callbackUrl: defaultCallbackUrl } = (0, _cookie.defaultCookies)((_options$useSecureCoo = options.useSecureCookies) !== null && _options$useSecureCoo !== void 0 ? _options$useSecureCoo : url.base.startsWith("https://"));
    const callbackUrlCookie = (_req$cookies = req.cookies) === null || _req$cookies === void 0 ? void 0 : _req$cookies[(_options$cookies$call = (_options$cookies = options.cookies) === null || _options$cookies === void 0 ? void 0 : (_options$cookies$call2 = _options$cookies.callbackUrl) === null || _options$cookies$call2 === void 0 ? void 0 : _options$cookies$call2.name) !== null && _options$cookies$call !== void 0 ? _options$cookies$call : defaultCallbackUrl.name];
    if (callbackUrlCookie && !isValidHttpUrl(callbackUrlCookie, url.base)) {
        return new _errors.InvalidCallbackUrl(`Invalid callback URL. Received: ${callbackUrlCookie}`);
    }
    let hasCredentials, hasEmail;
    let hasTwitterOAuth2;
    for (const provider of options.providers){
        if (provider.type === "credentials") hasCredentials = true;
        else if (provider.type === "email") hasEmail = true;
        else if (provider.id === "twitter" && provider.version === "2.0") hasTwitterOAuth2 = true;
    }
    if (hasCredentials) {
        var _options$session;
        const dbStrategy = ((_options$session = options.session) === null || _options$session === void 0 ? void 0 : _options$session.strategy) === "database";
        const onlyCredentials = !options.providers.some((p)=>p.type !== "credentials");
        if (dbStrategy && onlyCredentials) {
            return new _errors.UnsupportedStrategy("Signin in with credentials only supported if JWT strategy is enabled");
        }
        const credentialsNoAuthorize = options.providers.some((p)=>p.type === "credentials" && !p.authorize);
        if (credentialsNoAuthorize) {
            return new _errors.MissingAuthorize("Must define an authorize() handler to use credentials authentication provider");
        }
    }
    if (hasEmail) {
        const { adapter } = options;
        if (!adapter) {
            return new _errors.MissingAdapter("E-mail login requires an adapter.");
        }
        const missingMethods = [
            "createVerificationToken",
            "useVerificationToken",
            "getUserByEmail"
        ].filter((method)=>!adapter[method]);
        if (missingMethods.length) {
            return new _errors.MissingAdapterMethods(`Required adapter methods were missing: ${missingMethods.join(", ")}`);
        }
    }
    if (!warned) {
        if (hasTwitterOAuth2) warnings.push("TWITTER_OAUTH_2_BETA");
        warned = true;
    }
    return warnings;
}


/***/ }),

/***/ 461:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = callbackHandler;
var _errors = __webpack_require__(36827);
var _utils = __webpack_require__(42086);
async function callbackHandler(params) {
    const { sessionToken, profile: _profile, account, options } = params;
    if (!(account !== null && account !== void 0 && account.providerAccountId) || !account.type) throw new Error("Missing or invalid provider account");
    if (![
        "email",
        "oauth"
    ].includes(account.type)) throw new Error("Provider not supported");
    const { adapter, jwt, events, session: { strategy: sessionStrategy, generateSessionToken } } = options;
    if (!adapter) {
        return {
            user: _profile,
            account
        };
    }
    const profile = _profile;
    const { createUser, updateUser, getUser, getUserByAccount, getUserByEmail, linkAccount, createSession, getSessionAndUser, deleteSession } = adapter;
    let session = null;
    let user = null;
    let isNewUser = false;
    const useJwtSession = sessionStrategy === "jwt";
    if (sessionToken) {
        if (useJwtSession) {
            try {
                session = await jwt.decode({
                    ...jwt,
                    token: sessionToken
                });
                if (session && "sub" in session && session.sub) {
                    user = await getUser(session.sub);
                }
            } catch (_unused) {}
        } else {
            const userAndSession = await getSessionAndUser(sessionToken);
            if (userAndSession) {
                session = userAndSession.session;
                user = userAndSession.user;
            }
        }
    }
    if (account.type === "email") {
        const userByEmail = await getUserByEmail(profile.email);
        if (userByEmail) {
            var _user, _events$updateUser;
            if (((_user = user) === null || _user === void 0 ? void 0 : _user.id) !== userByEmail.id && !useJwtSession && sessionToken) {
                await deleteSession(sessionToken);
            }
            user = await updateUser({
                id: userByEmail.id,
                emailVerified: new Date()
            });
            await ((_events$updateUser = events.updateUser) === null || _events$updateUser === void 0 ? void 0 : _events$updateUser.call(events, {
                user
            }));
        } else {
            var _events$createUser;
            const { id: _, ...newUser } = {
                ...profile,
                emailVerified: new Date()
            };
            user = await createUser(newUser);
            await ((_events$createUser = events.createUser) === null || _events$createUser === void 0 ? void 0 : _events$createUser.call(events, {
                user
            }));
            isNewUser = true;
        }
        session = useJwtSession ? {} : await createSession({
            sessionToken: await generateSessionToken(),
            userId: user.id,
            expires: (0, _utils.fromDate)(options.session.maxAge)
        });
        return {
            session,
            user,
            isNewUser
        };
    } else if (account.type === "oauth") {
        const userByAccount = await getUserByAccount({
            providerAccountId: account.providerAccountId,
            provider: account.provider
        });
        if (userByAccount) {
            if (user) {
                if (userByAccount.id === user.id) {
                    return {
                        session,
                        user,
                        isNewUser
                    };
                }
                throw new _errors.AccountNotLinkedError("The account is already associated with another user");
            }
            session = useJwtSession ? {} : await createSession({
                sessionToken: await generateSessionToken(),
                userId: userByAccount.id,
                expires: (0, _utils.fromDate)(options.session.maxAge)
            });
            return {
                session,
                user: userByAccount,
                isNewUser
            };
        } else {
            var _events$createUser2, _events$linkAccount2;
            if (user) {
                var _events$linkAccount;
                await linkAccount({
                    ...account,
                    userId: user.id
                });
                await ((_events$linkAccount = events.linkAccount) === null || _events$linkAccount === void 0 ? void 0 : _events$linkAccount.call(events, {
                    user,
                    account,
                    profile
                }));
                return {
                    session,
                    user,
                    isNewUser
                };
            }
            const userByEmail = profile.email ? await getUserByEmail(profile.email) : null;
            if (userByEmail) {
                const provider = options.provider;
                if (provider !== null && provider !== void 0 && provider.allowDangerousEmailAccountLinking) {
                    user = userByEmail;
                } else {
                    throw new _errors.AccountNotLinkedError("Another account already exists with the same e-mail address");
                }
            } else {
                const { id: _, ...newUser } = {
                    ...profile,
                    emailVerified: null
                };
                user = await createUser(newUser);
            }
            await ((_events$createUser2 = events.createUser) === null || _events$createUser2 === void 0 ? void 0 : _events$createUser2.call(events, {
                user
            }));
            await linkAccount({
                ...account,
                userId: user.id
            });
            await ((_events$linkAccount2 = events.linkAccount) === null || _events$linkAccount2 === void 0 ? void 0 : _events$linkAccount2.call(events, {
                user,
                account,
                profile
            }));
            session = useJwtSession ? {} : await createSession({
                sessionToken: await generateSessionToken(),
                userId: user.id,
                expires: (0, _utils.fromDate)(options.session.maxAge)
            });
            return {
                session,
                user,
                isNewUser: true
            };
        }
    }
    throw new Error("Unsupported account type");
}


/***/ }),

/***/ 81764:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createCallbackUrl = createCallbackUrl;
async function createCallbackUrl({ options, paramValue, cookieValue }) {
    const { url, callbacks } = options;
    let callbackUrl = url.origin;
    if (paramValue) {
        callbackUrl = await callbacks.redirect({
            url: paramValue,
            baseUrl: url.origin
        });
    } else if (cookieValue) {
        callbackUrl = await callbacks.redirect({
            url: cookieValue,
            baseUrl: url.origin
        });
    }
    return {
        callbackUrl,
        callbackUrlCookie: callbackUrl !== cookieValue ? callbackUrl : undefined
    };
}


/***/ }),

/***/ 18689:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(94483);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.SessionStore = void 0;
exports.defaultCookies = defaultCookies;
var _classPrivateFieldGet3 = _interopRequireDefault(__webpack_require__(81444));
var _classPrivateFieldSet2 = _interopRequireDefault(__webpack_require__(88471));
function _classPrivateMethodInitSpec(obj, privateSet) {
    _checkPrivateRedeclaration(obj, privateSet);
    privateSet.add(obj);
}
function _classPrivateFieldInitSpec(obj, privateMap, value) {
    _checkPrivateRedeclaration(obj, privateMap);
    privateMap.set(obj, value);
}
function _checkPrivateRedeclaration(obj, privateCollection) {
    if (privateCollection.has(obj)) {
        throw new TypeError("Cannot initialize the same private elements twice on an object");
    }
}
function _classPrivateMethodGet(receiver, privateSet, fn) {
    if (!privateSet.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return fn;
}
const ALLOWED_COOKIE_SIZE = 4096;
const ESTIMATED_EMPTY_COOKIE_SIZE = 163;
const CHUNK_SIZE = ALLOWED_COOKIE_SIZE - ESTIMATED_EMPTY_COOKIE_SIZE;
function defaultCookies(useSecureCookies) {
    const cookiePrefix = useSecureCookies ? "__Secure-" : "";
    return {
        sessionToken: {
            name: `${cookiePrefix}next-auth.session-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies
            }
        },
        callbackUrl: {
            name: `${cookiePrefix}next-auth.callback-url`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies
            }
        },
        csrfToken: {
            name: `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies
            }
        },
        pkceCodeVerifier: {
            name: `${cookiePrefix}next-auth.pkce.code_verifier`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
                maxAge: 60 * 15
            }
        },
        state: {
            name: `${cookiePrefix}next-auth.state`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies,
                maxAge: 60 * 15
            }
        },
        nonce: {
            name: `${cookiePrefix}next-auth.nonce`,
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: useSecureCookies
            }
        }
    };
}
var _chunks = new WeakMap();
var _option = new WeakMap();
var _logger = new WeakMap();
var _chunk = new WeakSet();
var _clean = new WeakSet();
class SessionStore {
    constructor(option, req, logger){
        _classPrivateMethodInitSpec(this, _clean);
        _classPrivateMethodInitSpec(this, _chunk);
        _classPrivateFieldInitSpec(this, _chunks, {
            writable: true,
            value: {}
        });
        _classPrivateFieldInitSpec(this, _option, {
            writable: true,
            value: void 0
        });
        _classPrivateFieldInitSpec(this, _logger, {
            writable: true,
            value: void 0
        });
        (0, _classPrivateFieldSet2.default)(this, _logger, logger);
        (0, _classPrivateFieldSet2.default)(this, _option, option);
        const { cookies: _cookies } = req;
        const { name: cookieName } = option;
        if (typeof (_cookies === null || _cookies === void 0 ? void 0 : _cookies.getAll) === "function") {
            for (const { name, value } of _cookies.getAll()){
                if (name.startsWith(cookieName)) {
                    (0, _classPrivateFieldGet3.default)(this, _chunks)[name] = value;
                }
            }
        } else if (_cookies instanceof Map) {
            for (const name of _cookies.keys()){
                if (name.startsWith(cookieName)) (0, _classPrivateFieldGet3.default)(this, _chunks)[name] = _cookies.get(name);
            }
        } else {
            for(const name in _cookies){
                if (name.startsWith(cookieName)) (0, _classPrivateFieldGet3.default)(this, _chunks)[name] = _cookies[name];
            }
        }
    }
    get value() {
        const sortedKeys = Object.keys((0, _classPrivateFieldGet3.default)(this, _chunks)).sort((a, b)=>{
            var _a$split$pop, _b$split$pop;
            const aSuffix = parseInt((_a$split$pop = a.split(".").pop()) !== null && _a$split$pop !== void 0 ? _a$split$pop : "0");
            const bSuffix = parseInt((_b$split$pop = b.split(".").pop()) !== null && _b$split$pop !== void 0 ? _b$split$pop : "0");
            return aSuffix - bSuffix;
        });
        return sortedKeys.map((key)=>(0, _classPrivateFieldGet3.default)(this, _chunks)[key]).join("");
    }
    chunk(value, options) {
        const cookies = _classPrivateMethodGet(this, _clean, _clean2).call(this);
        const chunked = _classPrivateMethodGet(this, _chunk, _chunk2).call(this, {
            name: (0, _classPrivateFieldGet3.default)(this, _option).name,
            value,
            options: {
                ...(0, _classPrivateFieldGet3.default)(this, _option).options,
                ...options
            }
        });
        for (const chunk of chunked){
            cookies[chunk.name] = chunk;
        }
        return Object.values(cookies);
    }
    clean() {
        return Object.values(_classPrivateMethodGet(this, _clean, _clean2).call(this));
    }
}
exports.SessionStore = SessionStore;
function _chunk2(cookie) {
    const chunkCount = Math.ceil(cookie.value.length / CHUNK_SIZE);
    if (chunkCount === 1) {
        (0, _classPrivateFieldGet3.default)(this, _chunks)[cookie.name] = cookie.value;
        return [
            cookie
        ];
    }
    const cookies = [];
    for(let i = 0; i < chunkCount; i++){
        const name = `${cookie.name}.${i}`;
        const value = cookie.value.substr(i * CHUNK_SIZE, CHUNK_SIZE);
        cookies.push({
            ...cookie,
            name,
            value
        });
        (0, _classPrivateFieldGet3.default)(this, _chunks)[name] = value;
    }
    (0, _classPrivateFieldGet3.default)(this, _logger).debug("CHUNKING_SESSION_COOKIE", {
        message: `Session cookie exceeds allowed ${ALLOWED_COOKIE_SIZE} bytes.`,
        emptyCookieSize: ESTIMATED_EMPTY_COOKIE_SIZE,
        valueSize: cookie.value.length,
        chunks: cookies.map((c)=>c.value.length + ESTIMATED_EMPTY_COOKIE_SIZE)
    });
    return cookies;
}
function _clean2() {
    const cleanedChunks = {};
    for(const name in (0, _classPrivateFieldGet3.default)(this, _chunks)){
        var _classPrivateFieldGet2;
        (_classPrivateFieldGet2 = (0, _classPrivateFieldGet3.default)(this, _chunks)) === null || _classPrivateFieldGet2 === void 0 ? true : delete _classPrivateFieldGet2[name];
        cleanedChunks[name] = {
            name,
            value: "",
            options: {
                ...(0, _classPrivateFieldGet3.default)(this, _option).options,
                maxAge: 0
            }
        };
    }
    return cleanedChunks;
}


/***/ }),

/***/ 48079:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createCSRFToken = createCSRFToken;
var _crypto = __webpack_require__(6113);
function createCSRFToken({ options, cookieValue, isPost, bodyValue }) {
    if (cookieValue) {
        const [csrfToken, csrfTokenHash] = cookieValue.split("|");
        const expectedCsrfTokenHash = (0, _crypto.createHash)("sha256").update(`${csrfToken}${options.secret}`).digest("hex");
        if (csrfTokenHash === expectedCsrfTokenHash) {
            const csrfTokenVerified = isPost && csrfToken === bodyValue;
            return {
                csrfTokenVerified,
                csrfToken
            };
        }
    }
    const csrfToken = (0, _crypto.randomBytes)(32).toString("hex");
    const csrfTokenHash = (0, _crypto.createHash)("sha256").update(`${csrfToken}${options.secret}`).digest("hex");
    const cookie = `${csrfToken}|${csrfTokenHash}`;
    return {
        cookie,
        csrfToken
    };
}


/***/ }),

/***/ 21601:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.defaultCallbacks = void 0;
const defaultCallbacks = {
    signIn () {
        return true;
    },
    redirect ({ url, baseUrl }) {
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        else if (new URL(url).origin === baseUrl) return url;
        return baseUrl;
    },
    session ({ session }) {
        return session;
    },
    jwt ({ token }) {
        return token;
    }
};
exports.defaultCallbacks = defaultCallbacks;


/***/ }),

/***/ 40262:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = getAdapterUserFromEmail;
async function getAdapterUserFromEmail({ email, adapter }) {
    const { getUserByEmail } = adapter;
    const adapterUser = email ? await getUserByEmail(email) : null;
    if (adapterUser) return adapterUser;
    return {
        id: email,
        email,
        emailVerified: null
    };
}


/***/ }),

/***/ 85969:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = email;
var _crypto = __webpack_require__(6113);
var _utils = __webpack_require__(42086);
async function email(identifier, options) {
    var _await$provider$gener, _provider$generateVer, _provider$maxAge, _adapter$createVerifi;
    const { url, adapter, provider, callbackUrl, theme } = options;
    const token = (_await$provider$gener = await ((_provider$generateVer = provider.generateVerificationToken) === null || _provider$generateVer === void 0 ? void 0 : _provider$generateVer.call(provider))) !== null && _await$provider$gener !== void 0 ? _await$provider$gener : (0, _crypto.randomBytes)(32).toString("hex");
    const ONE_DAY_IN_SECONDS = 86400;
    const expires = new Date(Date.now() + ((_provider$maxAge = provider.maxAge) !== null && _provider$maxAge !== void 0 ? _provider$maxAge : ONE_DAY_IN_SECONDS) * 1000);
    const params = new URLSearchParams({
        callbackUrl,
        token,
        email: identifier
    });
    const _url = `${url}/callback/${provider.id}?${params}`;
    await Promise.all([
        provider.sendVerificationRequest({
            identifier,
            token,
            expires,
            url: _url,
            provider,
            theme
        }),
        (_adapter$createVerifi = adapter.createVerificationToken) === null || _adapter$createVerifi === void 0 ? void 0 : _adapter$createVerifi.call(adapter, {
            identifier,
            token: (0, _utils.hashToken)(token, options),
            expires
        })
    ]);
    return `${url}/verify-request?${new URLSearchParams({
        provider: provider.id,
        type: provider.type
    })}`;
}


/***/ }),

/***/ 63799:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = getAuthorizationUrl;
var _client = __webpack_require__(79883);
var _clientLegacy = __webpack_require__(93422);
var checks = _interopRequireWildcard(__webpack_require__(76234));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function getAuthorizationUrl({ options, query }) {
    var _provider$version;
    const { logger, provider } = options;
    let params = {};
    if (typeof provider.authorization === "string") {
        const parsedUrl = new URL(provider.authorization);
        const parsedParams = Object.fromEntries(parsedUrl.searchParams);
        params = {
            ...params,
            ...parsedParams
        };
    } else {
        var _provider$authorizati;
        params = {
            ...params,
            ...(_provider$authorizati = provider.authorization) === null || _provider$authorizati === void 0 ? void 0 : _provider$authorizati.params
        };
    }
    params = {
        ...params,
        ...query
    };
    if ((_provider$version = provider.version) !== null && _provider$version !== void 0 && _provider$version.startsWith("1.")) {
        var _provider$authorizati2;
        const client = (0, _clientLegacy.oAuth1Client)(options);
        const tokens = await client.getOAuthRequestToken(params);
        const url = `${(_provider$authorizati2 = provider.authorization) === null || _provider$authorizati2 === void 0 ? void 0 : _provider$authorizati2.url}?${new URLSearchParams({
            oauth_token: tokens.oauth_token,
            oauth_token_secret: tokens.oauth_token_secret,
            ...tokens.params
        })}`;
        _clientLegacy.oAuth1TokenStore.set(tokens.oauth_token, tokens.oauth_token_secret);
        logger.debug("GET_AUTHORIZATION_URL", {
            url,
            provider
        });
        return {
            redirect: url
        };
    }
    const client = await (0, _client.openidClient)(options);
    const authorizationParams = params;
    const cookies = [];
    await checks.state.create(options, cookies, authorizationParams);
    await checks.pkce.create(options, cookies, authorizationParams);
    await checks.nonce.create(options, cookies, authorizationParams);
    const url = client.authorizationUrl(authorizationParams);
    logger.debug("GET_AUTHORIZATION_URL", {
        url,
        cookies,
        provider
    });
    return {
        redirect: url,
        cookies
    };
}


/***/ }),

/***/ 76766:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = oAuthCallback;
var _openidClient = __webpack_require__(87519);
var _client = __webpack_require__(79883);
var _clientLegacy = __webpack_require__(93422);
var _checks = _interopRequireWildcard(__webpack_require__(76234));
var _errors = __webpack_require__(36827);
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function oAuthCallback(params) {
    var _body$error, _provider$version;
    const { options, query, body, method, cookies } = params;
    const { logger, provider } = options;
    const errorMessage = (_body$error = body === null || body === void 0 ? void 0 : body.error) !== null && _body$error !== void 0 ? _body$error : query === null || query === void 0 ? void 0 : query.error;
    if (errorMessage) {
        const error = new Error(errorMessage);
        logger.error("OAUTH_CALLBACK_HANDLER_ERROR", {
            error,
            error_description: query === null || query === void 0 ? void 0 : query.error_description,
            providerId: provider.id
        });
        logger.debug("OAUTH_CALLBACK_HANDLER_ERROR", {
            body
        });
        throw error;
    }
    if ((_provider$version = provider.version) !== null && _provider$version !== void 0 && _provider$version.startsWith("1.")) {
        try {
            const client = await (0, _clientLegacy.oAuth1Client)(options);
            const { oauth_token, oauth_verifier } = query !== null && query !== void 0 ? query : {};
            const tokens = await client.getOAuthAccessToken(oauth_token, _clientLegacy.oAuth1TokenStore.get(oauth_token), oauth_verifier);
            let profile = await client.get(provider.profileUrl, tokens.oauth_token, tokens.oauth_token_secret);
            if (typeof profile === "string") {
                profile = JSON.parse(profile);
            }
            const newProfile = await getProfile({
                profile,
                tokens,
                provider,
                logger
            });
            return {
                ...newProfile,
                cookies: []
            };
        } catch (error) {
            logger.error("OAUTH_V1_GET_ACCESS_TOKEN_ERROR", error);
            throw error;
        }
    }
    if (query !== null && query !== void 0 && query.oauth_token) _clientLegacy.oAuth1TokenStore.delete(query.oauth_token);
    try {
        var _provider$token, _provider$token2, _provider$userinfo;
        const client = await (0, _client.openidClient)(options);
        let tokens;
        const checks = {};
        const resCookies = [];
        await _checks.state.use(cookies, resCookies, options, checks);
        await _checks.pkce.use(cookies, resCookies, options, checks);
        await _checks.nonce.use(cookies, resCookies, options, checks);
        const params = {
            ...client.callbackParams({
                url: `http://n?${new URLSearchParams(query)}`,
                body,
                method
            }),
            ...(_provider$token = provider.token) === null || _provider$token === void 0 ? void 0 : _provider$token.params
        };
        if ((_provider$token2 = provider.token) !== null && _provider$token2 !== void 0 && _provider$token2.request) {
            const response = await provider.token.request({
                provider,
                params,
                checks,
                client
            });
            tokens = new _openidClient.TokenSet(response.tokens);
        } else if (provider.idToken) {
            tokens = await client.callback(provider.callbackUrl, params, checks);
        } else {
            tokens = await client.oauthCallback(provider.callbackUrl, params, checks);
        }
        if (Array.isArray(tokens.scope)) {
            tokens.scope = tokens.scope.join(" ");
        }
        let profile;
        if ((_provider$userinfo = provider.userinfo) !== null && _provider$userinfo !== void 0 && _provider$userinfo.request) {
            profile = await provider.userinfo.request({
                provider,
                tokens,
                client
            });
        } else if (provider.idToken) {
            profile = tokens.claims();
        } else {
            var _provider$userinfo2;
            profile = await client.userinfo(tokens, {
                params: (_provider$userinfo2 = provider.userinfo) === null || _provider$userinfo2 === void 0 ? void 0 : _provider$userinfo2.params
            });
        }
        const profileResult = await getProfile({
            profile,
            provider,
            tokens,
            logger
        });
        return {
            ...profileResult,
            cookies: resCookies
        };
    } catch (error) {
        throw new _errors.OAuthCallbackError(error);
    }
}
async function getProfile({ profile: OAuthProfile, tokens, provider, logger }) {
    try {
        var _profile$email;
        logger.debug("PROFILE_DATA", {
            OAuthProfile
        });
        const profile = await provider.profile(OAuthProfile, tokens);
        profile.email = (_profile$email = profile.email) === null || _profile$email === void 0 ? void 0 : _profile$email.toLowerCase();
        if (!profile.id) throw new TypeError(`Profile id is missing in ${provider.name} OAuth profile response`);
        return {
            profile,
            account: {
                provider: provider.id,
                type: provider.type,
                providerAccountId: profile.id.toString(),
                ...tokens
            },
            OAuthProfile
        };
    } catch (error) {
        logger.error("OAUTH_PARSE_PROFILE_ERROR", {
            error: error,
            OAuthProfile
        });
    }
}


/***/ }),

/***/ 76234:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.pkce = exports.nonce = exports.PKCE_CODE_CHALLENGE_METHOD = void 0;
exports.signCookie = signCookie;
exports.state = void 0;
var _openidClient = __webpack_require__(87519);
var jwt = _interopRequireWildcard(__webpack_require__(83517));
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}
async function signCookie(type, value, maxAge, options) {
    const { cookies, logger } = options;
    logger.debug(`CREATE_${type.toUpperCase()}`, {
        value,
        maxAge
    });
    const { name } = cookies[type];
    const expires = new Date();
    expires.setTime(expires.getTime() + maxAge * 1000);
    return {
        name,
        value: await jwt.encode({
            ...options.jwt,
            maxAge,
            token: {
                value
            },
            salt: name
        }),
        options: {
            ...cookies[type].options,
            expires
        }
    };
}
const PKCE_MAX_AGE = 60 * 15;
const PKCE_CODE_CHALLENGE_METHOD = "S256";
exports.PKCE_CODE_CHALLENGE_METHOD = PKCE_CODE_CHALLENGE_METHOD;
const pkce = {
    async create (options, cookies, resParams) {
        var _options$provider, _options$provider$che, _options$cookies$pkce;
        if (!((_options$provider = options.provider) !== null && _options$provider !== void 0 && (_options$provider$che = _options$provider.checks) !== null && _options$provider$che !== void 0 && _options$provider$che.includes("pkce"))) return;
        const code_verifier = _openidClient.generators.codeVerifier();
        const value = _openidClient.generators.codeChallenge(code_verifier);
        resParams.code_challenge = value;
        resParams.code_challenge_method = PKCE_CODE_CHALLENGE_METHOD;
        const maxAge = (_options$cookies$pkce = options.cookies.pkceCodeVerifier.options.maxAge) !== null && _options$cookies$pkce !== void 0 ? _options$cookies$pkce : PKCE_MAX_AGE;
        cookies.push(await signCookie("pkceCodeVerifier", code_verifier, maxAge, options));
    },
    async use (cookies, resCookies, options, checks) {
        var _options$provider2, _options$provider2$ch;
        if (!((_options$provider2 = options.provider) !== null && _options$provider2 !== void 0 && (_options$provider2$ch = _options$provider2.checks) !== null && _options$provider2$ch !== void 0 && _options$provider2$ch.includes("pkce"))) return;
        const codeVerifier = cookies === null || cookies === void 0 ? void 0 : cookies[options.cookies.pkceCodeVerifier.name];
        if (!codeVerifier) throw new TypeError("PKCE code_verifier cookie was missing.");
        const { name } = options.cookies.pkceCodeVerifier;
        const value = await jwt.decode({
            ...options.jwt,
            token: codeVerifier,
            salt: name
        });
        if (!(value !== null && value !== void 0 && value.value)) throw new TypeError("PKCE code_verifier value could not be parsed.");
        resCookies.push({
            name,
            value: "",
            options: {
                ...options.cookies.pkceCodeVerifier.options,
                maxAge: 0
            }
        });
        checks.code_verifier = value.value;
    }
};
exports.pkce = pkce;
const STATE_MAX_AGE = 60 * 15;
const state = {
    async create (options, cookies, resParams) {
        var _options$provider$che2, _options$cookies$stat;
        if (!((_options$provider$che2 = options.provider.checks) !== null && _options$provider$che2 !== void 0 && _options$provider$che2.includes("state"))) return;
        const value = _openidClient.generators.state();
        resParams.state = value;
        const maxAge = (_options$cookies$stat = options.cookies.state.options.maxAge) !== null && _options$cookies$stat !== void 0 ? _options$cookies$stat : STATE_MAX_AGE;
        cookies.push(await signCookie("state", value, maxAge, options));
    },
    async use (cookies, resCookies, options, checks) {
        var _options$provider$che3;
        if (!((_options$provider$che3 = options.provider.checks) !== null && _options$provider$che3 !== void 0 && _options$provider$che3.includes("state"))) return;
        const state = cookies === null || cookies === void 0 ? void 0 : cookies[options.cookies.state.name];
        if (!state) throw new TypeError("State cookie was missing.");
        const { name } = options.cookies.state;
        const value = await jwt.decode({
            ...options.jwt,
            token: state,
            salt: name
        });
        if (!(value !== null && value !== void 0 && value.value)) throw new TypeError("State value could not be parsed.");
        resCookies.push({
            name,
            value: "",
            options: {
                ...options.cookies.state.options,
                maxAge: 0
            }
        });
        checks.state = value.value;
    }
};
exports.state = state;
const NONCE_MAX_AGE = 60 * 15;
const nonce = {
    async create (options, cookies, resParams) {
        var _options$provider$che4, _options$cookies$nonc;
        if (!((_options$provider$che4 = options.provider.checks) !== null && _options$provider$che4 !== void 0 && _options$provider$che4.includes("nonce"))) return;
        const value = _openidClient.generators.nonce();
        resParams.nonce = value;
        const maxAge = (_options$cookies$nonc = options.cookies.nonce.options.maxAge) !== null && _options$cookies$nonc !== void 0 ? _options$cookies$nonc : NONCE_MAX_AGE;
        cookies.push(await signCookie("nonce", value, maxAge, options));
    },
    async use (cookies, resCookies, options, checks) {
        var _options$provider3, _options$provider3$ch;
        if (!((_options$provider3 = options.provider) !== null && _options$provider3 !== void 0 && (_options$provider3$ch = _options$provider3.checks) !== null && _options$provider3$ch !== void 0 && _options$provider3$ch.includes("nonce"))) return;
        const nonce = cookies === null || cookies === void 0 ? void 0 : cookies[options.cookies.nonce.name];
        if (!nonce) throw new TypeError("Nonce cookie was missing.");
        const { name } = options.cookies.nonce;
        const value = await jwt.decode({
            ...options.jwt,
            token: nonce,
            salt: name
        });
        if (!(value !== null && value !== void 0 && value.value)) throw new TypeError("Nonce value could not be parsed.");
        resCookies.push({
            name,
            value: "",
            options: {
                ...options.cookies.nonce.options,
                maxAge: 0
            }
        });
        checks.nonce = value.value;
    }
};
exports.nonce = nonce;


/***/ }),

/***/ 93422:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.oAuth1Client = oAuth1Client;
exports.oAuth1TokenStore = void 0;
var _oauth = __webpack_require__(75643);
function oAuth1Client(options) {
    var _provider$version, _provider$encoding;
    const provider = options.provider;
    const oauth1Client = new _oauth.OAuth(provider.requestTokenUrl, provider.accessTokenUrl, provider.clientId, provider.clientSecret, (_provider$version = provider.version) !== null && _provider$version !== void 0 ? _provider$version : "1.0", provider.callbackUrl, (_provider$encoding = provider.encoding) !== null && _provider$encoding !== void 0 ? _provider$encoding : "HMAC-SHA1");
    const originalGet = oauth1Client.get.bind(oauth1Client);
    oauth1Client.get = async (...args)=>{
        return await new Promise((resolve, reject)=>{
            originalGet(...args, (error, result)=>{
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    };
    const originalGetOAuth1AccessToken = oauth1Client.getOAuthAccessToken.bind(oauth1Client);
    oauth1Client.getOAuthAccessToken = async (...args)=>{
        return await new Promise((resolve, reject)=>{
            originalGetOAuth1AccessToken(...args, (error, oauth_token, oauth_token_secret)=>{
                if (error) {
                    return reject(error);
                }
                resolve({
                    oauth_token,
                    oauth_token_secret
                });
            });
        });
    };
    const originalGetOAuthRequestToken = oauth1Client.getOAuthRequestToken.bind(oauth1Client);
    oauth1Client.getOAuthRequestToken = async (params = {})=>{
        return await new Promise((resolve, reject)=>{
            originalGetOAuthRequestToken(params, (error, oauth_token, oauth_token_secret, params)=>{
                if (error) {
                    return reject(error);
                }
                resolve({
                    oauth_token,
                    oauth_token_secret,
                    params
                });
            });
        });
    };
    return oauth1Client;
}
const oAuth1TokenStore = new Map();
exports.oAuth1TokenStore = oAuth1TokenStore;


/***/ }),

/***/ 79883:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.openidClient = openidClient;
var _openidClient = __webpack_require__(87519);
async function openidClient(options) {
    const provider = options.provider;
    if (provider.httpOptions) _openidClient.custom.setHttpOptionsDefaults(provider.httpOptions);
    let issuer;
    if (provider.wellKnown) {
        issuer = await _openidClient.Issuer.discover(provider.wellKnown);
    } else {
        var _provider$authorizati, _provider$token, _provider$userinfo;
        issuer = new _openidClient.Issuer({
            issuer: provider.issuer,
            authorization_endpoint: (_provider$authorizati = provider.authorization) === null || _provider$authorizati === void 0 ? void 0 : _provider$authorizati.url,
            token_endpoint: (_provider$token = provider.token) === null || _provider$token === void 0 ? void 0 : _provider$token.url,
            userinfo_endpoint: (_provider$userinfo = provider.userinfo) === null || _provider$userinfo === void 0 ? void 0 : _provider$userinfo.url,
            jwks_uri: provider.jwks_endpoint
        });
    }
    const client = new issuer.Client({
        client_id: provider.clientId,
        client_secret: provider.clientSecret,
        redirect_uris: [
            provider.callbackUrl
        ],
        ...provider.client
    }, provider.jwks);
    client[_openidClient.custom.clock_tolerance] = 10;
    return client;
}


/***/ }),

/***/ 75898:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = parseProviders;
var _merge = __webpack_require__(31576);
function parseProviders(params) {
    const { url, providerId } = params;
    const providers = params.providers.map(({ options: userOptions, ...rest })=>{
        var _ref;
        if (rest.type === "oauth") {
            var _normalizedUserOption;
            const normalizedOptions = normalizeOAuthOptions(rest);
            const normalizedUserOptions = normalizeOAuthOptions(userOptions, true);
            const id = (_normalizedUserOption = normalizedUserOptions === null || normalizedUserOptions === void 0 ? void 0 : normalizedUserOptions.id) !== null && _normalizedUserOption !== void 0 ? _normalizedUserOption : rest.id;
            return (0, _merge.merge)(normalizedOptions, {
                ...normalizedUserOptions,
                signinUrl: `${url}/signin/${id}`,
                callbackUrl: `${url}/callback/${id}`
            });
        }
        const id = (_ref = userOptions === null || userOptions === void 0 ? void 0 : userOptions.id) !== null && _ref !== void 0 ? _ref : rest.id;
        return (0, _merge.merge)(rest, {
            ...userOptions,
            signinUrl: `${url}/signin/${id}`,
            callbackUrl: `${url}/callback/${id}`
        });
    });
    return {
        providers,
        provider: providers.find(({ id })=>id === providerId)
    };
}
function normalizeOAuthOptions(oauthOptions, isUserOptions = false) {
    var _normalized$version;
    if (!oauthOptions) return;
    const normalized = Object.entries(oauthOptions).reduce((acc, [key, value])=>{
        if ([
            "authorization",
            "token",
            "userinfo"
        ].includes(key) && typeof value === "string") {
            var _url$searchParams;
            const url = new URL(value);
            acc[key] = {
                url: `${url.origin}${url.pathname}`,
                params: Object.fromEntries((_url$searchParams = url.searchParams) !== null && _url$searchParams !== void 0 ? _url$searchParams : [])
            };
        } else {
            acc[key] = value;
        }
        return acc;
    }, {});
    if (!isUserOptions && !((_normalized$version = normalized.version) !== null && _normalized$version !== void 0 && _normalized$version.startsWith("1."))) {
        var _ref2, _normalized$idToken, _normalized$wellKnown, _normalized$authoriza, _normalized$authoriza2, _normalized$authoriza3;
        normalized.idToken = Boolean((_ref2 = (_normalized$idToken = normalized.idToken) !== null && _normalized$idToken !== void 0 ? _normalized$idToken : (_normalized$wellKnown = normalized.wellKnown) === null || _normalized$wellKnown === void 0 ? void 0 : _normalized$wellKnown.includes("openid-configuration")) !== null && _ref2 !== void 0 ? _ref2 : (_normalized$authoriza = normalized.authorization) === null || _normalized$authoriza === void 0 ? void 0 : (_normalized$authoriza2 = _normalized$authoriza.params) === null || _normalized$authoriza2 === void 0 ? void 0 : (_normalized$authoriza3 = _normalized$authoriza2.scope) === null || _normalized$authoriza3 === void 0 ? void 0 : _normalized$authoriza3.includes("openid"));
        if (!normalized.checks) normalized.checks = [
            "state"
        ];
    }
    return normalized;
}


/***/ }),

/***/ 42086:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.createSecret = createSecret;
exports.fromDate = fromDate;
exports.hashToken = hashToken;
var _crypto = __webpack_require__(6113);
function fromDate(time, date = Date.now()) {
    return new Date(date + time * 1000);
}
function hashToken(token, options) {
    var _provider$secret;
    const { provider, secret } = options;
    return (0, _crypto.createHash)("sha256").update(`${token}${(_provider$secret = provider.secret) !== null && _provider$secret !== void 0 ? _provider$secret : secret}`).digest("hex");
}
function createSecret(params) {
    var _authOptions$secret;
    const { authOptions, url } = params;
    return (_authOptions$secret = authOptions.secret) !== null && _authOptions$secret !== void 0 ? _authOptions$secret : (0, _crypto.createHash)("sha256").update(JSON.stringify({
        ...url,
        ...authOptions
    })).digest("hex");
}


/***/ }),

/***/ 70806:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = ErrorPage;
var _preact = __webpack_require__(97804);
function ErrorPage(props) {
    var _errors$error$toLower;
    const { url, error = "default", theme } = props;
    const signinPageUrl = `${url}/signin`;
    const errors = {
        default: {
            status: 200,
            heading: "Error",
            message: (0, _preact.h)("p", null, (0, _preact.h)("a", {
                className: "site",
                href: url === null || url === void 0 ? void 0 : url.origin
            }, url === null || url === void 0 ? void 0 : url.host))
        },
        configuration: {
            status: 500,
            heading: "Server error",
            message: (0, _preact.h)("div", null, (0, _preact.h)("p", null, "There is a problem with the server configuration."), (0, _preact.h)("p", null, "Check the server logs for more information."))
        },
        accessdenied: {
            status: 403,
            heading: "Access Denied",
            message: (0, _preact.h)("div", null, (0, _preact.h)("p", null, "You do not have permission to sign in."), (0, _preact.h)("p", null, (0, _preact.h)("a", {
                className: "button",
                href: signinPageUrl
            }, "Sign in")))
        },
        verification: {
            status: 403,
            heading: "Unable to sign in",
            message: (0, _preact.h)("div", null, (0, _preact.h)("p", null, "The sign in link is no longer valid."), (0, _preact.h)("p", null, "It may have been used already or it may have expired.")),
            signin: (0, _preact.h)("a", {
                className: "button",
                href: signinPageUrl
            }, "Sign in")
        }
    };
    const { status, heading, message, signin } = (_errors$error$toLower = errors[error.toLowerCase()]) !== null && _errors$error$toLower !== void 0 ? _errors$error$toLower : errors.default;
    return {
        status,
        html: (0, _preact.h)("div", {
            className: "error"
        }, (theme === null || theme === void 0 ? void 0 : theme.brandColor) && (0, _preact.h)("style", {
            dangerouslySetInnerHTML: {
                __html: `
        :root {
          --brand-color: ${theme === null || theme === void 0 ? void 0 : theme.brandColor}
        }
      `
            }
        }), (0, _preact.h)("div", {
            className: "card"
        }, (theme === null || theme === void 0 ? void 0 : theme.logo) && (0, _preact.h)("img", {
            src: theme.logo,
            alt: "Logo",
            className: "logo"
        }), (0, _preact.h)("h1", null, heading), (0, _preact.h)("div", {
            className: "message"
        }, message), signin))
    };
}


/***/ }),

/***/ 4424:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(94483);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = renderPage;
var _preactRenderToString = _interopRequireDefault(__webpack_require__(16829));
var _signin = _interopRequireDefault(__webpack_require__(54101));
var _signout = _interopRequireDefault(__webpack_require__(25247));
var _verifyRequest = _interopRequireDefault(__webpack_require__(6792));
var _error = _interopRequireDefault(__webpack_require__(70806));
var _css = _interopRequireDefault(__webpack_require__(41310));
function renderPage(params) {
    const { url, theme, query, cookies } = params;
    function send({ html, title, status }) {
        var _theme$colorScheme;
        return {
            cookies,
            status,
            headers: [
                {
                    key: "Content-Type",
                    value: "text/html"
                }
            ],
            body: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><style>${(0, _css.default)()}</style><title>${title}</title></head><body class="__next-auth-theme-${(_theme$colorScheme = theme === null || theme === void 0 ? void 0 : theme.colorScheme) !== null && _theme$colorScheme !== void 0 ? _theme$colorScheme : "auto"}"><div class="page">${(0, _preactRenderToString.default)(html)}</div></body></html>`
        };
    }
    return {
        signin (props) {
            return send({
                html: (0, _signin.default)({
                    csrfToken: params.csrfToken,
                    providers: params.providers,
                    callbackUrl: params.callbackUrl,
                    theme,
                    ...query,
                    ...props
                }),
                title: "Sign In"
            });
        },
        signout (props) {
            return send({
                html: (0, _signout.default)({
                    csrfToken: params.csrfToken,
                    url,
                    theme,
                    ...props
                }),
                title: "Sign Out"
            });
        },
        verifyRequest (props) {
            return send({
                html: (0, _verifyRequest.default)({
                    url,
                    theme,
                    ...props
                }),
                title: "Verify Request"
            });
        },
        error (props) {
            return send({
                ...(0, _error.default)({
                    url,
                    theme,
                    ...props
                }),
                title: "Error"
            });
        }
    };
}


/***/ }),

/***/ 54101:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(94483);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = SigninPage;
var _preact = __webpack_require__(97804);
var _extends2 = _interopRequireDefault(__webpack_require__(67842));
function hexToRgba(hex, alpha = 1) {
    if (!hex) {
        return;
    }
    hex = hex.replace(/^#/, "");
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    const bigint = parseInt(hex, 16);
    const r = bigint >> 16 & 255;
    const g = bigint >> 8 & 255;
    const b = bigint & 255;
    alpha = Math.min(Math.max(alpha, 0), 1);
    const rgba = `rgba(${r}, ${g}, ${b}, ${alpha})`;
    return rgba;
}
function SigninPage(props) {
    var _errors$errorType;
    const { csrfToken, providers, callbackUrl, theme, email, error: errorType } = props;
    const providersToRender = providers.filter((provider)=>{
        if (provider.type === "oauth" || provider.type === "email") {
            return true;
        } else if (provider.type === "credentials" && provider.credentials) {
            return true;
        }
        return false;
    });
    if (typeof document !== "undefined" && theme.buttonText) {
        document.documentElement.style.setProperty("--button-text-color", theme.buttonText);
    }
    if (typeof document !== "undefined" && theme.brandColor) {
        document.documentElement.style.setProperty("--brand-color", theme.brandColor);
    }
    const errors = {
        Signin: "Try signing in with a different account.",
        OAuthSignin: "Try signing in with a different account.",
        OAuthCallback: "Try signing in with a different account.",
        OAuthCreateAccount: "Try signing in with a different account.",
        EmailCreateAccount: "Try signing in with a different account.",
        Callback: "Try signing in with a different account.",
        OAuthAccountNotLinked: "To confirm your identity, sign in with the same account you used originally.",
        EmailSignin: "The e-mail could not be sent.",
        CredentialsSignin: "Sign in failed. Check the details you provided are correct.",
        SessionRequired: "Please sign in to access this page.",
        default: "Unable to sign in."
    };
    const error = errorType && ((_errors$errorType = errors[errorType]) !== null && _errors$errorType !== void 0 ? _errors$errorType : errors.default);
    const providerLogoPath = "https://authjs.dev/img/providers";
    return (0, _preact.h)("div", {
        className: "signin"
    }, theme.brandColor && (0, _preact.h)("style", {
        dangerouslySetInnerHTML: {
            __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `
        }
    }), theme.buttonText && (0, _preact.h)("style", {
        dangerouslySetInnerHTML: {
            __html: `
        :root {
          --button-text-color: ${theme.buttonText}
        }
      `
        }
    }), (0, _preact.h)("div", {
        className: "card"
    }, theme.logo && (0, _preact.h)("img", {
        src: theme.logo,
        alt: "Logo",
        className: "logo"
    }), error && (0, _preact.h)("div", {
        className: "error"
    }, (0, _preact.h)("p", null, error)), providersToRender.map((provider, i)=>{
        let bg, text, logo, logoDark, bgDark, textDark;
        if (provider.type === "oauth") {
            var _provider$style;
            ;
            ({ bg = "", text = "", logo = "", bgDark = bg, textDark = text, logoDark = "" } = (_provider$style = provider.style) !== null && _provider$style !== void 0 ? _provider$style : {});
            logo = logo.startsWith("/") ? `${providerLogoPath}${logo}` : logo;
            logoDark = logoDark.startsWith("/") ? `${providerLogoPath}${logoDark}` : logoDark || logo;
            logoDark || (logoDark = logo);
        }
        return (0, _preact.h)("div", {
            key: provider.id,
            className: "provider"
        }, provider.type === "oauth" && (0, _preact.h)("form", {
            action: provider.signinUrl,
            method: "POST"
        }, (0, _preact.h)("input", {
            type: "hidden",
            name: "csrfToken",
            value: csrfToken
        }), callbackUrl && (0, _preact.h)("input", {
            type: "hidden",
            name: "callbackUrl",
            value: callbackUrl
        }), (0, _preact.h)("button", {
            type: "submit",
            className: "button",
            style: {
                "--provider-bg": bg,
                "--provider-dark-bg": bgDark,
                "--provider-color": text,
                "--provider-dark-color": textDark,
                "--provider-bg-hover": hexToRgba(bg, 0.8),
                "--provider-dark-bg-hover": hexToRgba(bgDark, 0.8)
            }
        }, logo && (0, _preact.h)("img", {
            loading: "lazy",
            height: 24,
            width: 24,
            id: "provider-logo",
            src: `${logo.startsWith("/") ? providerLogoPath : ""}${logo}`
        }), logoDark && (0, _preact.h)("img", {
            loading: "lazy",
            height: 24,
            width: 24,
            id: "provider-logo-dark",
            src: `${logo.startsWith("/") ? providerLogoPath : ""}${logoDark}`
        }), (0, _preact.h)("span", null, "Sign in with ", provider.name))), (provider.type === "email" || provider.type === "credentials") && i > 0 && providersToRender[i - 1].type !== "email" && providersToRender[i - 1].type !== "credentials" && (0, _preact.h)("hr", null), provider.type === "email" && (0, _preact.h)("form", {
            action: provider.signinUrl,
            method: "POST"
        }, (0, _preact.h)("input", {
            type: "hidden",
            name: "csrfToken",
            value: csrfToken
        }), (0, _preact.h)("label", {
            className: "section-header",
            htmlFor: `input-email-for-${provider.id}-provider`
        }, "Email"), (0, _preact.h)("input", {
            id: `input-email-for-${provider.id}-provider`,
            autoFocus: true,
            type: "email",
            name: "email",
            value: email,
            placeholder: "email@example.com",
            required: true
        }), (0, _preact.h)("button", {
            id: "submitButton",
            type: "submit"
        }, "Sign in with ", provider.name)), provider.type === "credentials" && (0, _preact.h)("form", {
            action: provider.callbackUrl,
            method: "POST"
        }, (0, _preact.h)("input", {
            type: "hidden",
            name: "csrfToken",
            value: csrfToken
        }), Object.keys(provider.credentials).map((credential)=>{
            var _provider$credentials, _provider$credentials2, _provider$credentials3;
            return (0, _preact.h)("div", {
                key: `input-group-${provider.id}`
            }, (0, _preact.h)("label", {
                className: "section-header",
                htmlFor: `input-${credential}-for-${provider.id}-provider`
            }, (_provider$credentials = provider.credentials[credential].label) !== null && _provider$credentials !== void 0 ? _provider$credentials : credential), (0, _preact.h)("input", (0, _extends2.default)({
                name: credential,
                id: `input-${credential}-for-${provider.id}-provider`,
                type: (_provider$credentials2 = provider.credentials[credential].type) !== null && _provider$credentials2 !== void 0 ? _provider$credentials2 : "text",
                placeholder: (_provider$credentials3 = provider.credentials[credential].placeholder) !== null && _provider$credentials3 !== void 0 ? _provider$credentials3 : ""
            }, provider.credentials[credential])));
        }), (0, _preact.h)("button", {
            type: "submit"
        }, "Sign in with ", provider.name)), (provider.type === "email" || provider.type === "credentials") && i + 1 < providersToRender.length && (0, _preact.h)("hr", null));
    })));
}


/***/ }),

/***/ 25247:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = SignoutPage;
var _preact = __webpack_require__(97804);
function SignoutPage(props) {
    const { url, csrfToken, theme } = props;
    return (0, _preact.h)("div", {
        className: "signout"
    }, theme.brandColor && (0, _preact.h)("style", {
        dangerouslySetInnerHTML: {
            __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `
        }
    }), theme.buttonText && (0, _preact.h)("style", {
        dangerouslySetInnerHTML: {
            __html: `
        :root {
          --button-text-color: ${theme.buttonText}
        }
      `
        }
    }), (0, _preact.h)("div", {
        className: "card"
    }, theme.logo && (0, _preact.h)("img", {
        src: theme.logo,
        alt: "Logo",
        className: "logo"
    }), (0, _preact.h)("h1", null, "Signout"), (0, _preact.h)("p", null, "Are you sure you want to sign out?"), (0, _preact.h)("form", {
        action: `${url}/signout`,
        method: "POST"
    }, (0, _preact.h)("input", {
        type: "hidden",
        name: "csrfToken",
        value: csrfToken
    }), (0, _preact.h)("button", {
        id: "submitButton",
        type: "submit"
    }, "Sign out"))));
}


/***/ }),

/***/ 6792:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = VerifyRequestPage;
var _preact = __webpack_require__(97804);
function VerifyRequestPage(props) {
    const { url, theme } = props;
    return (0, _preact.h)("div", {
        className: "verify-request"
    }, theme.brandColor && (0, _preact.h)("style", {
        dangerouslySetInnerHTML: {
            __html: `
        :root {
          --brand-color: ${theme.brandColor}
        }
      `
        }
    }), (0, _preact.h)("div", {
        className: "card"
    }, theme.logo && (0, _preact.h)("img", {
        src: theme.logo,
        alt: "Logo",
        className: "logo"
    }), (0, _preact.h)("h1", null, "Check your email"), (0, _preact.h)("p", null, "A sign in link has been sent to your email address."), (0, _preact.h)("p", null, (0, _preact.h)("a", {
        className: "site",
        href: url.origin
    }, url.host))));
}


/***/ }),

/***/ 60610:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(94483);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = callback;
var _callback = _interopRequireDefault(__webpack_require__(76766));
var _callbackHandler = _interopRequireDefault(__webpack_require__(461));
var _utils = __webpack_require__(42086);
var _getUserFromEmail = _interopRequireDefault(__webpack_require__(40262));
async function callback(params) {
    const { options, query, body, method, headers, sessionStore } = params;
    const { provider, adapter, url, callbackUrl, pages, jwt, events, callbacks, session: { strategy: sessionStrategy, maxAge: sessionMaxAge }, logger } = options;
    const cookies = [];
    const useJwtSession = sessionStrategy === "jwt";
    if (provider.type === "oauth") {
        try {
            const { profile, account, OAuthProfile, cookies: oauthCookies } = await (0, _callback.default)({
                query,
                body,
                method,
                options,
                cookies: params.cookies
            });
            if (oauthCookies.length) cookies.push(...oauthCookies);
            try {
                var _events$signIn;
                logger.debug("OAUTH_CALLBACK_RESPONSE", {
                    profile,
                    account,
                    OAuthProfile
                });
                if (!profile || !account || !OAuthProfile) {
                    return {
                        redirect: `${url}/signin`,
                        cookies
                    };
                }
                let userOrProfile = profile;
                if (adapter) {
                    const { getUserByAccount } = adapter;
                    const userByAccount = await getUserByAccount({
                        providerAccountId: account.providerAccountId,
                        provider: provider.id
                    });
                    if (userByAccount) userOrProfile = userByAccount;
                }
                try {
                    const isAllowed = await callbacks.signIn({
                        user: userOrProfile,
                        account,
                        profile: OAuthProfile
                    });
                    if (!isAllowed) {
                        return {
                            redirect: `${url}/error?error=AccessDenied`,
                            cookies
                        };
                    } else if (typeof isAllowed === "string") {
                        return {
                            redirect: isAllowed,
                            cookies
                        };
                    }
                } catch (error) {
                    return {
                        redirect: `${url}/error?error=${encodeURIComponent(error.message)}`,
                        cookies
                    };
                }
                const { user, session, isNewUser } = await (0, _callbackHandler.default)({
                    sessionToken: sessionStore.value,
                    profile,
                    account,
                    options
                });
                if (useJwtSession) {
                    var _user$id;
                    const defaultToken = {
                        name: user.name,
                        email: user.email,
                        picture: user.image,
                        sub: (_user$id = user.id) === null || _user$id === void 0 ? void 0 : _user$id.toString()
                    };
                    const token = await callbacks.jwt({
                        token: defaultToken,
                        user,
                        account,
                        profile: OAuthProfile,
                        isNewUser,
                        trigger: isNewUser ? "signUp" : "signIn"
                    });
                    const newToken = await jwt.encode({
                        ...jwt,
                        token
                    });
                    const cookieExpires = new Date();
                    cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);
                    const sessionCookies = sessionStore.chunk(newToken, {
                        expires: cookieExpires
                    });
                    cookies.push(...sessionCookies);
                } else {
                    cookies.push({
                        name: options.cookies.sessionToken.name,
                        value: session.sessionToken,
                        options: {
                            ...options.cookies.sessionToken.options,
                            expires: session.expires
                        }
                    });
                }
                await ((_events$signIn = events.signIn) === null || _events$signIn === void 0 ? void 0 : _events$signIn.call(events, {
                    user,
                    account,
                    profile,
                    isNewUser
                }));
                if (isNewUser && pages.newUser) {
                    return {
                        redirect: `${pages.newUser}${pages.newUser.includes("?") ? "&" : "?"}callbackUrl=${encodeURIComponent(callbackUrl)}`,
                        cookies
                    };
                }
                return {
                    redirect: callbackUrl,
                    cookies
                };
            } catch (error) {
                if (error.name === "AccountNotLinkedError") {
                    return {
                        redirect: `${url}/error?error=OAuthAccountNotLinked`,
                        cookies
                    };
                } else if (error.name === "CreateUserError") {
                    return {
                        redirect: `${url}/error?error=OAuthCreateAccount`,
                        cookies
                    };
                }
                logger.error("OAUTH_CALLBACK_HANDLER_ERROR", error);
                return {
                    redirect: `${url}/error?error=Callback`,
                    cookies
                };
            }
        } catch (error) {
            if (error.name === "OAuthCallbackError") {
                logger.error("OAUTH_CALLBACK_ERROR", {
                    error: error,
                    providerId: provider.id
                });
                return {
                    redirect: `${url}/error?error=OAuthCallback`,
                    cookies
                };
            }
            logger.error("OAUTH_CALLBACK_ERROR", error);
            return {
                redirect: `${url}/error?error=Callback`,
                cookies
            };
        }
    } else if (provider.type === "email") {
        try {
            var _events$signIn2;
            const token = query === null || query === void 0 ? void 0 : query.token;
            const identifier = query === null || query === void 0 ? void 0 : query.email;
            if (!token || !identifier) {
                return {
                    redirect: `${url}/error?error=configuration`,
                    cookies
                };
            }
            const invite = await adapter.useVerificationToken({
                identifier,
                token: (0, _utils.hashToken)(token, options)
            });
            const invalidInvite = !invite || invite.expires.valueOf() < Date.now();
            if (invalidInvite) {
                return {
                    redirect: `${url}/error?error=Verification`,
                    cookies
                };
            }
            const profile = await (0, _getUserFromEmail.default)({
                email: identifier,
                adapter
            });
            const account = {
                providerAccountId: profile.email,
                type: "email",
                provider: provider.id
            };
            try {
                const signInCallbackResponse = await callbacks.signIn({
                    user: profile,
                    account
                });
                if (!signInCallbackResponse) {
                    return {
                        redirect: `${url}/error?error=AccessDenied`,
                        cookies
                    };
                } else if (typeof signInCallbackResponse === "string") {
                    return {
                        redirect: signInCallbackResponse,
                        cookies
                    };
                }
            } catch (error) {
                return {
                    redirect: `${url}/error?error=${encodeURIComponent(error.message)}`,
                    cookies
                };
            }
            const { user, session, isNewUser } = await (0, _callbackHandler.default)({
                sessionToken: sessionStore.value,
                profile,
                account,
                options
            });
            if (useJwtSession) {
                var _user$id2;
                const defaultToken = {
                    name: user.name,
                    email: user.email,
                    picture: user.image,
                    sub: (_user$id2 = user.id) === null || _user$id2 === void 0 ? void 0 : _user$id2.toString()
                };
                const token = await callbacks.jwt({
                    token: defaultToken,
                    user,
                    account,
                    isNewUser,
                    trigger: isNewUser ? "signUp" : "signIn"
                });
                const newToken = await jwt.encode({
                    ...jwt,
                    token
                });
                const cookieExpires = new Date();
                cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);
                const sessionCookies = sessionStore.chunk(newToken, {
                    expires: cookieExpires
                });
                cookies.push(...sessionCookies);
            } else {
                cookies.push({
                    name: options.cookies.sessionToken.name,
                    value: session.sessionToken,
                    options: {
                        ...options.cookies.sessionToken.options,
                        expires: session.expires
                    }
                });
            }
            await ((_events$signIn2 = events.signIn) === null || _events$signIn2 === void 0 ? void 0 : _events$signIn2.call(events, {
                user,
                account,
                isNewUser
            }));
            if (isNewUser && pages.newUser) {
                return {
                    redirect: `${pages.newUser}${pages.newUser.includes("?") ? "&" : "?"}callbackUrl=${encodeURIComponent(callbackUrl)}`,
                    cookies
                };
            }
            return {
                redirect: callbackUrl,
                cookies
            };
        } catch (error) {
            if (error.name === "CreateUserError") {
                return {
                    redirect: `${url}/error?error=EmailCreateAccount`,
                    cookies
                };
            }
            logger.error("CALLBACK_EMAIL_ERROR", error);
            return {
                redirect: `${url}/error?error=Callback`,
                cookies
            };
        }
    } else if (provider.type === "credentials" && method === "POST") {
        var _user$id3, _events$signIn3;
        const credentials = body;
        let user;
        try {
            user = await provider.authorize(credentials, {
                query,
                body,
                headers,
                method
            });
            if (!user) {
                return {
                    status: 401,
                    redirect: `${url}/error?${new URLSearchParams({
                        error: "CredentialsSignin",
                        provider: provider.id
                    })}`,
                    cookies
                };
            }
        } catch (error) {
            return {
                status: 401,
                redirect: `${url}/error?error=${encodeURIComponent(error.message)}`,
                cookies
            };
        }
        const account = {
            providerAccountId: user.id,
            type: "credentials",
            provider: provider.id
        };
        try {
            const isAllowed = await callbacks.signIn({
                user,
                account,
                credentials
            });
            if (!isAllowed) {
                return {
                    status: 403,
                    redirect: `${url}/error?error=AccessDenied`,
                    cookies
                };
            } else if (typeof isAllowed === "string") {
                return {
                    redirect: isAllowed,
                    cookies
                };
            }
        } catch (error) {
            return {
                redirect: `${url}/error?error=${encodeURIComponent(error.message)}`,
                cookies
            };
        }
        const defaultToken = {
            name: user.name,
            email: user.email,
            picture: user.image,
            sub: (_user$id3 = user.id) === null || _user$id3 === void 0 ? void 0 : _user$id3.toString()
        };
        const token = await callbacks.jwt({
            token: defaultToken,
            user,
            account,
            isNewUser: false,
            trigger: "signIn"
        });
        const newToken = await jwt.encode({
            ...jwt,
            token
        });
        const cookieExpires = new Date();
        cookieExpires.setTime(cookieExpires.getTime() + sessionMaxAge * 1000);
        const sessionCookies = sessionStore.chunk(newToken, {
            expires: cookieExpires
        });
        cookies.push(...sessionCookies);
        await ((_events$signIn3 = events.signIn) === null || _events$signIn3 === void 0 ? void 0 : _events$signIn3.call(events, {
            user,
            account
        }));
        return {
            redirect: callbackUrl,
            cookies
        };
    }
    return {
        status: 500,
        body: `Error: Callback for provider type ${provider.type} not supported`,
        cookies
    };
}


/***/ }),

/***/ 94788:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(94483);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
Object.defineProperty(exports, "callback", ({
    enumerable: true,
    get: function() {
        return _callback.default;
    }
}));
Object.defineProperty(exports, "providers", ({
    enumerable: true,
    get: function() {
        return _providers.default;
    }
}));
Object.defineProperty(exports, "session", ({
    enumerable: true,
    get: function() {
        return _session.default;
    }
}));
Object.defineProperty(exports, "signin", ({
    enumerable: true,
    get: function() {
        return _signin.default;
    }
}));
Object.defineProperty(exports, "signout", ({
    enumerable: true,
    get: function() {
        return _signout.default;
    }
}));
var _callback = _interopRequireDefault(__webpack_require__(60610));
var _signin = _interopRequireDefault(__webpack_require__(52367));
var _signout = _interopRequireDefault(__webpack_require__(68060));
var _session = _interopRequireDefault(__webpack_require__(73070));
var _providers = _interopRequireDefault(__webpack_require__(38181));


/***/ }),

/***/ 38181:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = providers;
function providers(providers) {
    return {
        headers: [
            {
                key: "Content-Type",
                value: "application/json"
            }
        ],
        body: providers.reduce((acc, { id, name, type, signinUrl, callbackUrl })=>{
            acc[id] = {
                id,
                name,
                type,
                signinUrl,
                callbackUrl
            };
            return acc;
        }, {})
    };
}


/***/ }),

/***/ 73070:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = session;
var _utils = __webpack_require__(42086);
async function session(params) {
    const { options, sessionStore, newSession, isUpdate } = params;
    const { adapter, jwt, events, callbacks, logger, session: { strategy: sessionStrategy, maxAge: sessionMaxAge } } = options;
    const response = {
        body: {},
        headers: [
            {
                key: "Content-Type",
                value: "application/json"
            }
        ],
        cookies: []
    };
    const sessionToken = sessionStore.value;
    if (!sessionToken) return response;
    if (sessionStrategy === "jwt") {
        try {
            var _response$cookies, _events$session;
            const decodedToken = await jwt.decode({
                ...jwt,
                token: sessionToken
            });
            if (!decodedToken) throw new Error("JWT invalid");
            const token = await callbacks.jwt({
                token: decodedToken,
                ...isUpdate && {
                    trigger: "update"
                },
                session: newSession
            });
            const newExpires = (0, _utils.fromDate)(sessionMaxAge);
            const updatedSession = await callbacks.session({
                session: {
                    user: {
                        name: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.name,
                        email: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.email,
                        image: decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.picture
                    },
                    expires: newExpires.toISOString()
                },
                token
            });
            response.body = updatedSession;
            const newToken = await jwt.encode({
                ...jwt,
                token,
                maxAge: options.session.maxAge
            });
            const sessionCookies = sessionStore.chunk(newToken, {
                expires: newExpires
            });
            (_response$cookies = response.cookies) === null || _response$cookies === void 0 ? void 0 : _response$cookies.push(...sessionCookies);
            await ((_events$session = events.session) === null || _events$session === void 0 ? void 0 : _events$session.call(events, {
                session: updatedSession,
                token
            }));
        } catch (error) {
            var _response$cookies2;
            logger.error("JWT_SESSION_ERROR", error);
            (_response$cookies2 = response.cookies) === null || _response$cookies2 === void 0 ? void 0 : _response$cookies2.push(...sessionStore.clean());
        }
    } else {
        try {
            const { getSessionAndUser, deleteSession, updateSession } = adapter;
            let userAndSession = await getSessionAndUser(sessionToken);
            if (userAndSession && userAndSession.session.expires.valueOf() < Date.now()) {
                await deleteSession(sessionToken);
                userAndSession = null;
            }
            if (userAndSession) {
                var _response$cookies3, _events$session2;
                const { user, session } = userAndSession;
                const sessionUpdateAge = options.session.updateAge;
                const sessionIsDueToBeUpdatedDate = session.expires.valueOf() - sessionMaxAge * 1000 + sessionUpdateAge * 1000;
                const newExpires = (0, _utils.fromDate)(sessionMaxAge);
                if (sessionIsDueToBeUpdatedDate <= Date.now()) {
                    await updateSession({
                        sessionToken,
                        expires: newExpires
                    });
                }
                const sessionPayload = await callbacks.session({
                    session: {
                        user: {
                            name: user.name,
                            email: user.email,
                            image: user.image
                        },
                        expires: session.expires.toISOString()
                    },
                    user,
                    newSession,
                    ...isUpdate ? {
                        trigger: "update"
                    } : {}
                });
                response.body = sessionPayload;
                (_response$cookies3 = response.cookies) === null || _response$cookies3 === void 0 ? void 0 : _response$cookies3.push({
                    name: options.cookies.sessionToken.name,
                    value: sessionToken,
                    options: {
                        ...options.cookies.sessionToken.options,
                        expires: newExpires
                    }
                });
                await ((_events$session2 = events.session) === null || _events$session2 === void 0 ? void 0 : _events$session2.call(events, {
                    session: sessionPayload
                }));
            } else if (sessionToken) {
                var _response$cookies4;
                (_response$cookies4 = response.cookies) === null || _response$cookies4 === void 0 ? void 0 : _response$cookies4.push(...sessionStore.clean());
            }
        } catch (error) {
            logger.error("SESSION_ERROR", error);
        }
    }
    return response;
}


/***/ }),

/***/ 52367:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(94483);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = signin;
var _authorizationUrl = _interopRequireDefault(__webpack_require__(63799));
var _signin = _interopRequireDefault(__webpack_require__(85969));
var _getUserFromEmail = _interopRequireDefault(__webpack_require__(40262));
async function signin(params) {
    const { options, query, body } = params;
    const { url, callbacks, logger, provider } = options;
    if (!provider.type) {
        return {
            status: 500,
            text: `Error: Type not specified for ${provider.name}`
        };
    }
    if (provider.type === "oauth") {
        try {
            const response = await (0, _authorizationUrl.default)({
                options,
                query
            });
            return response;
        } catch (error) {
            logger.error("SIGNIN_OAUTH_ERROR", {
                error: error,
                providerId: provider.id
            });
            return {
                redirect: `${url}/error?error=OAuthSignin`
            };
        }
    } else if (provider.type === "email") {
        var _provider$normalizeId;
        let email = body === null || body === void 0 ? void 0 : body.email;
        if (!email) return {
            redirect: `${url}/error?error=EmailSignin`
        };
        const normalizer = (_provider$normalizeId = provider.normalizeIdentifier) !== null && _provider$normalizeId !== void 0 ? _provider$normalizeId : (identifier)=>{
            let [local, domain] = identifier.toLowerCase().trim().split("@");
            domain = domain.split(",")[0];
            return `${local}@${domain}`;
        };
        try {
            email = normalizer(body === null || body === void 0 ? void 0 : body.email);
        } catch (error) {
            logger.error("SIGNIN_EMAIL_ERROR", {
                error,
                providerId: provider.id
            });
            return {
                redirect: `${url}/error?error=EmailSignin`
            };
        }
        const user = await (0, _getUserFromEmail.default)({
            email,
            adapter: options.adapter
        });
        const account = {
            providerAccountId: email,
            userId: email,
            type: "email",
            provider: provider.id
        };
        try {
            const signInCallbackResponse = await callbacks.signIn({
                user,
                account,
                email: {
                    verificationRequest: true
                }
            });
            if (!signInCallbackResponse) {
                return {
                    redirect: `${url}/error?error=AccessDenied`
                };
            } else if (typeof signInCallbackResponse === "string") {
                return {
                    redirect: signInCallbackResponse
                };
            }
        } catch (error) {
            return {
                redirect: `${url}/error?${new URLSearchParams({
                    error: error
                })}`
            };
        }
        try {
            const redirect = await (0, _signin.default)(email, options);
            return {
                redirect
            };
        } catch (error) {
            logger.error("SIGNIN_EMAIL_ERROR", {
                error,
                providerId: provider.id
            });
            return {
                redirect: `${url}/error?error=EmailSignin`
            };
        }
    }
    return {
        redirect: `${url}/signin`
    };
}


/***/ }),

/***/ 68060:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = signout;
async function signout(params) {
    const { options, sessionStore } = params;
    const { adapter, events, jwt, callbackUrl, logger, session } = options;
    const sessionToken = sessionStore === null || sessionStore === void 0 ? void 0 : sessionStore.value;
    if (!sessionToken) {
        return {
            redirect: callbackUrl
        };
    }
    if (session.strategy === "jwt") {
        try {
            var _events$signOut;
            const decodedJwt = await jwt.decode({
                ...jwt,
                token: sessionToken
            });
            await ((_events$signOut = events.signOut) === null || _events$signOut === void 0 ? void 0 : _events$signOut.call(events, {
                token: decodedJwt
            }));
        } catch (error) {
            logger.error("SIGNOUT_ERROR", error);
        }
    } else {
        try {
            var _events$signOut2;
            const session = await adapter.deleteSession(sessionToken);
            await ((_events$signOut2 = events.signOut) === null || _events$signOut2 === void 0 ? void 0 : _events$signOut2.call(events, {
                session
            }));
        } catch (error) {
            logger.error("SIGNOUT_ERROR", error);
        }
    }
    const sessionCookies = sessionStore.clean();
    return {
        redirect: callbackUrl,
        cookies: sessionCookies
    };
}


/***/ }),

/***/ 37249:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));


/***/ }),

/***/ 41310:
/***/ ((module) => {

"use strict";

module.exports = function() {
    return ':root{--border-width:1px;--border-radius:0.5rem;--color-error:#c94b4b;--color-info:#157efb;--color-info-hover:#0f6ddb;--color-info-text:#fff}.__next-auth-theme-auto,.__next-auth-theme-light{--color-background:#ececec;--color-background-hover:hsla(0,0%,93%,.8);--color-background-card:#fff;--color-text:#000;--color-primary:#444;--color-control-border:#bbb;--color-button-active-background:#f9f9f9;--color-button-active-border:#aaa;--color-separator:#ccc}.__next-auth-theme-dark{--color-background:#161b22;--color-background-hover:rgba(22,27,34,.8);--color-background-card:#0d1117;--color-text:#fff;--color-primary:#ccc;--color-control-border:#555;--color-button-active-background:#060606;--color-button-active-border:#666;--color-separator:#444}@media (prefers-color-scheme:dark){.__next-auth-theme-auto{--color-background:#161b22;--color-background-hover:rgba(22,27,34,.8);--color-background-card:#0d1117;--color-text:#fff;--color-primary:#ccc;--color-control-border:#555;--color-button-active-background:#060606;--color-button-active-border:#666;--color-separator:#444}a.button,button{background-color:var(--provider-dark-bg,var(--color-background));color:var(--provider-dark-color,var(--color-primary))}a.button:hover,button:hover{background-color:var(--provider-dark-bg-hover,var(--color-background-hover))!important}#provider-logo{display:none!important}#provider-logo-dark{display:block!important;width:25px}}html{box-sizing:border-box}*,:after,:before{box-sizing:inherit;margin:0;padding:0}body{background-color:var(--color-background);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;margin:0;padding:0}h1{font-weight:400}h1,p{color:var(--color-text);margin-bottom:1.5rem;padding:0 1rem}form{margin:0;padding:0}label{font-weight:500;margin-bottom:.25rem;text-align:left}input[type],label{color:var(--color-text);display:block}input[type]{background:var(--color-background-card);border:var(--border-width) solid var(--color-control-border);border-radius:var(--border-radius);box-sizing:border-box;font-size:1rem;padding:.5rem 1rem;width:100%}input[type]:focus{box-shadow:none}p{font-size:1.1rem;line-height:2rem}a.button{line-height:1rem;text-decoration:none}a.button:link,a.button:visited{background-color:var(--color-background);color:var(--color-primary)}button span{flex-grow:1}a.button,button{align-items:center;background-color:var(--provider-bg);border-color:rgba(0,0,0,.1);border-radius:var(--border-radius);color:var(--provider-color,var(--color-primary));display:flex;font-size:1.1rem;font-weight:500;justify-content:center;min-height:62px;padding:.75rem 1rem;position:relative;transition:all .1s ease-in-out}a.button:hover,button:hover{background-color:var(--provider-bg-hover,var(--color-background-hover));cursor:pointer}a.button:active,button:active{cursor:pointer}a.button #provider-logo,button #provider-logo{display:block;width:25px}a.button #provider-logo-dark,button #provider-logo-dark{display:none}#submitButton{background-color:var(--brand-color,var(--color-info));color:var(--button-text-color,var(--color-info-text));width:100%}#submitButton:hover{background-color:var(--button-hover-bg,var(--color-info-hover))!important}a.site{color:var(--color-primary);font-size:1rem;line-height:2rem;text-decoration:none}a.site:hover{text-decoration:underline}.page{box-sizing:border-box;display:grid;height:100%;margin:0;padding:0;place-items:center;position:absolute;width:100%}.page>div{text-align:center}.error a.button{margin-top:.5rem;padding-left:2rem;padding-right:2rem}.error .message{margin-bottom:1.5rem}.signin input[type=text]{display:block;margin-left:auto;margin-right:auto}.signin hr{border:0;border-top:1px solid var(--color-separator);display:block;margin:2rem auto 1rem;overflow:visible}.signin hr:before{background:var(--color-background-card);color:#888;content:"or";padding:0 .4rem;position:relative;top:-.7rem}.signin .error{background:#f5f5f5;background:var(--color-error);border-radius:.3rem;font-weight:500}.signin .error p{color:var(--color-info-text);font-size:.9rem;line-height:1.2rem;padding:.5rem 1rem;text-align:left}.signin form,.signin>div{display:block}.signin form input[type],.signin>div input[type]{margin-bottom:.5rem}.signin form button,.signin>div button{width:100%}.signin .provider+.provider{margin-top:1rem}.logo{display:inline-block;margin:1.25rem 0;max-height:70px;max-width:150px}.card{background-color:var(--color-background-card);border-radius:2rem;padding:1.25rem 2rem}.card .header{color:var(--color-primary)}.section-header{color:var(--color-text)}@media screen and (min-width:450px){.card{margin:2rem 0;width:368px}}@media screen and (max-width:450px){.card{margin:1rem 0;width:343px}}';
};


/***/ }),

/***/ 24279:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _exportNames = {};
Object.defineProperty(exports, "default", ({
    enumerable: true,
    get: function() {
        return _next.default;
    }
}));
var _types = __webpack_require__(37249);
Object.keys(_types).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _types[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _types[key];
        }
    });
});
var _next = _interopRequireWildcard(__webpack_require__(48388));
Object.keys(_next).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _next[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _next[key];
        }
    });
});
function _getRequireWildcardCache(nodeInterop) {
    if (typeof WeakMap !== "function") return null;
    var cacheBabelInterop = new WeakMap();
    var cacheNodeInterop = new WeakMap();
    return (_getRequireWildcardCache = function(nodeInterop) {
        return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
    })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
    if (!nodeInterop && obj && obj.__esModule) {
        return obj;
    }
    if (obj === null || typeof obj !== "object" && typeof obj !== "function") {
        return {
            default: obj
        };
    }
    var cache = _getRequireWildcardCache(nodeInterop);
    if (cache && cache.has(obj)) {
        return cache.get(obj);
    }
    var newObj = {};
    var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor;
    for(var key in obj){
        if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
            var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null;
            if (desc && (desc.get || desc.set)) {
                Object.defineProperty(newObj, key, desc);
            } else {
                newObj[key] = obj[key];
            }
        }
    }
    newObj.default = obj;
    if (cache) {
        cache.set(obj, newObj);
    }
    return newObj;
}


/***/ }),

/***/ 83517:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(94483);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
var _exportNames = {
    encode: true,
    decode: true,
    getToken: true
};
exports.decode = decode;
exports.encode = encode;
exports.getToken = getToken;
var _jose = __webpack_require__(23464);
var _hkdf = _interopRequireDefault(__webpack_require__(211));
var _uuid = __webpack_require__(32629);
var _cookie = __webpack_require__(18689);
var _types = __webpack_require__(62031);
Object.keys(_types).forEach(function(key) {
    if (key === "default" || key === "__esModule") return;
    if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
    if (key in exports && exports[key] === _types[key]) return;
    Object.defineProperty(exports, key, {
        enumerable: true,
        get: function() {
            return _types[key];
        }
    });
});
const DEFAULT_MAX_AGE = 30 * 24 * 60 * 60;
const now = ()=>Date.now() / 1000 | 0;
async function encode(params) {
    const { token = {}, secret, maxAge = DEFAULT_MAX_AGE, salt = "" } = params;
    const encryptionSecret = await getDerivedEncryptionKey(secret, salt);
    return await new _jose.EncryptJWT(token).setProtectedHeader({
        alg: "dir",
        enc: "A256GCM"
    }).setIssuedAt().setExpirationTime(now() + maxAge).setJti((0, _uuid.v4)()).encrypt(encryptionSecret);
}
async function decode(params) {
    const { token, secret, salt = "" } = params;
    if (!token) return null;
    const encryptionSecret = await getDerivedEncryptionKey(secret, salt);
    const { payload } = await (0, _jose.jwtDecrypt)(token, encryptionSecret, {
        clockTolerance: 15
    });
    return payload;
}
async function getToken(params) {
    var _process$env$NEXTAUTH, _process$env$NEXTAUTH2, _req$headers;
    const { req, secureCookie = (_process$env$NEXTAUTH = (_process$env$NEXTAUTH2 = process.env.NEXTAUTH_URL) === null || _process$env$NEXTAUTH2 === void 0 ? void 0 : _process$env$NEXTAUTH2.startsWith("https://")) !== null && _process$env$NEXTAUTH !== void 0 ? _process$env$NEXTAUTH : !!process.env.VERCEL, cookieName = secureCookie ? "__Secure-next-auth.session-token" : "next-auth.session-token", raw, decode: _decode = decode, logger = console, secret = process.env.NEXTAUTH_SECRET } = params;
    if (!req) throw new Error("Must pass `req` to JWT getToken()");
    const sessionStore = new _cookie.SessionStore({
        name: cookieName,
        options: {
            secure: secureCookie
        }
    }, {
        cookies: req.cookies,
        headers: req.headers
    }, logger);
    let token = sessionStore.value;
    const authorizationHeader = req.headers instanceof Headers ? req.headers.get("authorization") : (_req$headers = req.headers) === null || _req$headers === void 0 ? void 0 : _req$headers.authorization;
    if (!token && (authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.split(" ")[0]) === "Bearer") {
        const urlEncodedToken = authorizationHeader.split(" ")[1];
        token = decodeURIComponent(urlEncodedToken);
    }
    if (!token) return null;
    if (raw) return token;
    try {
        return await _decode({
            token,
            secret
        });
    } catch (_unused) {
        return null;
    }
}
async function getDerivedEncryptionKey(keyMaterial, salt) {
    return await (0, _hkdf.default)("sha256", keyMaterial, salt, `NextAuth.js Generated Encryption Key${salt ? ` (${salt})` : ""}`, 32);
}


/***/ }),

/***/ 62031:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));


/***/ }),

/***/ 48388:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
exports.getServerSession = getServerSession;
exports.unstable_getServerSession = unstable_getServerSession;
var _core = __webpack_require__(84377);
var _utils = __webpack_require__(65347);
async function NextAuthApiHandler(req, res, options) {
    var _options$secret, _options$jwt$secret, _options$jwt, _ref, _handler$status, _handler$cookies, _handler$headers;
    const { nextauth, ...query } = req.query;
    (_options$secret = options.secret) !== null && _options$secret !== void 0 ? _options$secret : options.secret = (_options$jwt$secret = (_options$jwt = options.jwt) === null || _options$jwt === void 0 ? void 0 : _options$jwt.secret) !== null && _options$jwt$secret !== void 0 ? _options$jwt$secret : process.env.NEXTAUTH_SECRET;
    const handler = await (0, _core.AuthHandler)({
        req: {
            body: req.body,
            query,
            cookies: req.cookies,
            headers: req.headers,
            method: req.method,
            action: nextauth === null || nextauth === void 0 ? void 0 : nextauth[0],
            providerId: nextauth === null || nextauth === void 0 ? void 0 : nextauth[1],
            error: (_ref = req.query.error) !== null && _ref !== void 0 ? _ref : nextauth === null || nextauth === void 0 ? void 0 : nextauth[1]
        },
        options
    });
    res.status((_handler$status = handler.status) !== null && _handler$status !== void 0 ? _handler$status : 200);
    (_handler$cookies = handler.cookies) === null || _handler$cookies === void 0 ? void 0 : _handler$cookies.forEach((cookie)=>(0, _utils.setCookie)(res, cookie));
    (_handler$headers = handler.headers) === null || _handler$headers === void 0 ? void 0 : _handler$headers.forEach((h)=>res.setHeader(h.key, h.value));
    if (handler.redirect) {
        var _req$body;
        if (((_req$body = req.body) === null || _req$body === void 0 ? void 0 : _req$body.json) !== "true") {
            res.status(302).setHeader("Location", handler.redirect);
            res.end();
            return;
        }
        return res.json({
            url: handler.redirect
        });
    }
    return res.send(handler.body);
}
async function NextAuthRouteHandler(req, context, options) {
    var _options$secret2, _context$params, _query$error;
    (_options$secret2 = options.secret) !== null && _options$secret2 !== void 0 ? _options$secret2 : options.secret = process.env.NEXTAUTH_SECRET;
    const { headers, cookies } = __webpack_require__(63919);
    const nextauth = (_context$params = context.params) === null || _context$params === void 0 ? void 0 : _context$params.nextauth;
    const query = Object.fromEntries(req.nextUrl.searchParams);
    const body = await (0, _utils.getBody)(req);
    const internalResponse = await (0, _core.AuthHandler)({
        req: {
            body,
            query,
            cookies: Object.fromEntries(cookies().getAll().map((c)=>[
                    c.name,
                    c.value
                ])),
            headers: Object.fromEntries(headers()),
            method: req.method,
            action: nextauth === null || nextauth === void 0 ? void 0 : nextauth[0],
            providerId: nextauth === null || nextauth === void 0 ? void 0 : nextauth[1],
            error: (_query$error = query.error) !== null && _query$error !== void 0 ? _query$error : nextauth === null || nextauth === void 0 ? void 0 : nextauth[1]
        },
        options
    });
    const response = (0, _utils.toResponse)(internalResponse);
    const redirect = response.headers.get("Location");
    if ((body === null || body === void 0 ? void 0 : body.json) === "true" && redirect) {
        response.headers.delete("Location");
        response.headers.set("Content-Type", "application/json");
        return new Response(JSON.stringify({
            url: redirect
        }), {
            status: internalResponse.status,
            headers: response.headers
        });
    }
    return response;
}
function NextAuth(...args) {
    var _args$;
    if (args.length === 1) {
        return async (req, res)=>{
            if (res !== null && res !== void 0 && res.params) {
                return await NextAuthRouteHandler(req, res, args[0]);
            }
            return await NextAuthApiHandler(req, res, args[0]);
        };
    }
    if ((_args$ = args[1]) !== null && _args$ !== void 0 && _args$.params) {
        return NextAuthRouteHandler(...args);
    }
    return NextAuthApiHandler(...args);
}
var _default = NextAuth;
exports["default"] = _default;
async function getServerSession(...args) {
    var _options, _options$secret3;
    const isRSC = args.length === 0 || args.length === 1;
    let req, res, options;
    if (isRSC) {
        options = Object.assign({}, args[0], {
            providers: []
        });
        const { headers, cookies } = __webpack_require__(63919);
        req = {
            headers: Object.fromEntries(headers()),
            cookies: Object.fromEntries(cookies().getAll().map((c)=>[
                    c.name,
                    c.value
                ]))
        };
        res = {
            getHeader () {},
            setCookie () {},
            setHeader () {}
        };
    } else {
        req = args[0];
        res = args[1];
        options = Object.assign({}, args[2], {
            providers: []
        });
    }
    (_options$secret3 = (_options = options).secret) !== null && _options$secret3 !== void 0 ? _options$secret3 : _options.secret = process.env.NEXTAUTH_SECRET;
    const session = await (0, _core.AuthHandler)({
        options,
        req: {
            action: "session",
            method: "GET",
            cookies: req.cookies,
            headers: req.headers
        }
    });
    const { body, cookies, status = 200 } = session;
    cookies === null || cookies === void 0 ? void 0 : cookies.forEach((cookie)=>(0, _utils.setCookie)(res, cookie));
    if (body && typeof body !== "string" && Object.keys(body).length) {
        if (status === 200) {
            if (isRSC) delete body.expires;
            return body;
        }
        throw new Error(body.message);
    }
    return null;
}
let deprecatedWarningShown = false;
async function unstable_getServerSession(...args) {
    if (!deprecatedWarningShown && "production" !== "production") {}
    return await getServerSession(...args);
}


/***/ }),

/***/ 65347:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.getBody = getBody;
exports.setCookie = setCookie;
exports.toResponse = toResponse;
var _cookie = __webpack_require__(21024);
function setCookie(res, cookie) {
    var _res$getHeader;
    let setCookieHeader = (_res$getHeader = res.getHeader("Set-Cookie")) !== null && _res$getHeader !== void 0 ? _res$getHeader : [];
    if (!Array.isArray(setCookieHeader)) {
        setCookieHeader = [
            setCookieHeader
        ];
    }
    const { name, value, options } = cookie;
    const cookieHeader = (0, _cookie.serialize)(name, value, options);
    setCookieHeader.push(cookieHeader);
    res.setHeader("Set-Cookie", setCookieHeader);
}
async function getBody(req) {
    if (!("body" in req) || !req.body || req.method !== "POST") return;
    const contentType = req.headers.get("content-type");
    if (contentType !== null && contentType !== void 0 && contentType.includes("application/json")) {
        return await req.json();
    } else if (contentType !== null && contentType !== void 0 && contentType.includes("application/x-www-form-urlencoded")) {
        const params = new URLSearchParams(await req.text());
        return Object.fromEntries(params);
    }
}
function toResponse(res) {
    var _res$headers, _res$cookies, _res$status;
    const headers = new Headers((_res$headers = res.headers) === null || _res$headers === void 0 ? void 0 : _res$headers.reduce((acc, { key, value })=>{
        acc[key] = value;
        return acc;
    }, {}));
    (_res$cookies = res.cookies) === null || _res$cookies === void 0 ? void 0 : _res$cookies.forEach((cookie)=>{
        const { name, value, options } = cookie;
        const cookieHeader = (0, _cookie.serialize)(name, value, options);
        if (headers.has("Set-Cookie")) headers.append("Set-Cookie", cookieHeader);
        else headers.set("Set-Cookie", cookieHeader);
    });
    let body = res.body;
    if (headers.get("content-type") === "application/json") body = JSON.stringify(res.body);
    else if (headers.get("content-type") === "application/x-www-form-urlencoded") body = new URLSearchParams(res.body).toString();
    const status = res.redirect ? 302 : (_res$status = res.status) !== null && _res$status !== void 0 ? _res$status : 200;
    const response = new Response(body, {
        headers,
        status
    });
    if (res.redirect) response.headers.set("Location", res.redirect);
    return response;
}


/***/ }),

/***/ 38198:
/***/ ((__unused_webpack_module, exports) => {

"use strict";
var __webpack_unused_export__;

__webpack_unused_export__ = ({
    value: true
});
exports.Z = Credentials;
function Credentials(options) {
    return {
        id: "credentials",
        name: "Credentials",
        type: "credentials",
        credentials: {},
        authorize: ()=>null,
        options
    };
}


/***/ }),

/***/ 26656:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.detectOrigin = detectOrigin;
function detectOrigin(forwardedHost, protocol) {
    var _process$env$VERCEL;
    if ((_process$env$VERCEL = process.env.VERCEL) !== null && _process$env$VERCEL !== void 0 ? _process$env$VERCEL : process.env.AUTH_TRUST_HOST) return `${protocol === "http" ? "http" : "https"}://${forwardedHost}`;
    return process.env.NEXTAUTH_URL;
}


/***/ }),

/***/ 50124:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var _interopRequireDefault = __webpack_require__(94483);
Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = void 0;
exports.proxyLogger = proxyLogger;
exports.setLogger = setLogger;
var _defineProperty2 = _interopRequireDefault(__webpack_require__(78256));
var _errors = __webpack_require__(36827);
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        enumerableOnly && (symbols = symbols.filter(function(sym) {
            return Object.getOwnPropertyDescriptor(object, sym).enumerable;
        })), keys.push.apply(keys, symbols);
    }
    return keys;
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = null != arguments[i] ? arguments[i] : {};
        i % 2 ? ownKeys(Object(source), !0).forEach(function(key) {
            (0, _defineProperty2.default)(target, key, source[key]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function formatError(o) {
    if (o instanceof Error && !(o instanceof _errors.UnknownError)) {
        return {
            message: o.message,
            stack: o.stack,
            name: o.name
        };
    }
    if (hasErrorProperty(o)) {
        var _o$message;
        o.error = formatError(o.error);
        o.message = (_o$message = o.message) !== null && _o$message !== void 0 ? _o$message : o.error.message;
    }
    return o;
}
function hasErrorProperty(x) {
    return !!(x !== null && x !== void 0 && x.error);
}
var _logger = {
    error: function error(code, metadata) {
        metadata = formatError(metadata);
        console.error("[next-auth][error][".concat(code, "]"), "\nhttps://next-auth.js.org/errors#".concat(code.toLowerCase()), metadata.message, metadata);
    },
    warn: function warn(code) {
        console.warn("[next-auth][warn][".concat(code, "]"), "\nhttps://next-auth.js.org/warnings#".concat(code.toLowerCase()));
    },
    debug: function debug(code, metadata) {
        console.log("[next-auth][debug][".concat(code, "]"), metadata);
    }
};
function setLogger() {
    var newLogger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var debug = arguments.length > 1 ? arguments[1] : undefined;
    if (!debug) _logger.debug = function() {};
    if (newLogger.error) _logger.error = newLogger.error;
    if (newLogger.warn) _logger.warn = newLogger.warn;
    if (newLogger.debug) _logger.debug = newLogger.debug;
}
var _default = _logger;
exports["default"] = _default;
function proxyLogger() {
    var logger = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _logger;
    var basePath = arguments.length > 1 ? arguments[1] : undefined;
    try {
        if (true) {
            return logger;
        }
        var clientLogger = {};
        var _loop = function _loop(level) {
            clientLogger[level] = function(code, metadata) {
                _logger[level](code, metadata);
                if (level === "error") {
                    metadata = formatError(metadata);
                }
                ;
                metadata.client = true;
                var url = "".concat(basePath, "/_log");
                var body = new URLSearchParams(_objectSpread({
                    level: level,
                    code: code
                }, metadata));
                if (navigator.sendBeacon) {
                    return navigator.sendBeacon(url, body);
                }
                return fetch(url, {
                    method: "POST",
                    body: body,
                    keepalive: true
                });
            };
        };
        for(var level in logger){
            _loop(level);
        }
        return clientLogger;
    } catch (_unused) {
        return _logger;
    }
}


/***/ }),

/***/ 31576:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports.merge = merge;
function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item);
}
function merge(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();
    if (isObject(target) && isObject(source)) {
        for(const key in source){
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, {
                    [key]: {}
                });
                merge(target[key], source[key]);
            } else {
                Object.assign(target, {
                    [key]: source[key]
                });
            }
        }
    }
    return merge(target, ...sources);
}


/***/ }),

/***/ 86912:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({
    value: true
}));
exports["default"] = parseUrl;
function parseUrl(url) {
    var _url2;
    const defaultUrl = new URL("http://localhost:3000/api/auth");
    if (url && !url.startsWith("http")) {
        url = `https://${url}`;
    }
    const _url = new URL((_url2 = url) !== null && _url2 !== void 0 ? _url2 : defaultUrl);
    const path = (_url.pathname === "/" ? defaultUrl.pathname : _url.pathname).replace(/\/$/, "");
    const base = `${_url.origin}${path}`;
    return {
        origin: _url.origin,
        host: _url.host,
        path,
        base,
        toString: ()=>base
    };
}


/***/ }),

/***/ 63919:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = __webpack_require__(83851);


/***/ }),

/***/ 75643:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

exports.OAuth = __webpack_require__(4309).OAuth;
exports.OAuthEcho = __webpack_require__(4309).OAuthEcho;
exports.OAuth2 = __webpack_require__(25538).OAuth2;


/***/ }),

/***/ 16604:
/***/ ((module) => {

"use strict";
// Returns true if this is a host that closes *before* it ends?!?!

module.exports.isAnEarlyCloseHost = function(hostName) {
    return hostName && hostName.match(".*google(apis)?.com$");
};


/***/ }),

/***/ 4309:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var crypto = __webpack_require__(6113), sha1 = __webpack_require__(72771), http = __webpack_require__(13685), https = __webpack_require__(95687), URL = __webpack_require__(57310), querystring = __webpack_require__(63477), OAuthUtils = __webpack_require__(16604);
exports.OAuth = function(requestUrl, accessUrl, consumerKey, consumerSecret, version, authorize_callback, signatureMethod, nonceSize, customHeaders) {
    this._isEcho = false;
    this._requestUrl = requestUrl;
    this._accessUrl = accessUrl;
    this._consumerKey = consumerKey;
    this._consumerSecret = this._encodeData(consumerSecret);
    if (signatureMethod == "RSA-SHA1") {
        this._privateKey = consumerSecret;
    }
    this._version = version;
    if (authorize_callback === undefined) {
        this._authorize_callback = "oob";
    } else {
        this._authorize_callback = authorize_callback;
    }
    if (signatureMethod != "PLAINTEXT" && signatureMethod != "HMAC-SHA1" && signatureMethod != "RSA-SHA1") throw new Error("Un-supported signature method: " + signatureMethod);
    this._signatureMethod = signatureMethod;
    this._nonceSize = nonceSize || 32;
    this._headers = customHeaders || {
        "Accept": "*/*",
        "Connection": "close",
        "User-Agent": "Node authentication"
    };
    this._clientOptions = this._defaultClientOptions = {
        "requestTokenHttpMethod": "POST",
        "accessTokenHttpMethod": "POST",
        "followRedirects": true
    };
    this._oauthParameterSeperator = ",";
};
exports.OAuthEcho = function(realm, verify_credentials, consumerKey, consumerSecret, version, signatureMethod, nonceSize, customHeaders) {
    this._isEcho = true;
    this._realm = realm;
    this._verifyCredentials = verify_credentials;
    this._consumerKey = consumerKey;
    this._consumerSecret = this._encodeData(consumerSecret);
    if (signatureMethod == "RSA-SHA1") {
        this._privateKey = consumerSecret;
    }
    this._version = version;
    if (signatureMethod != "PLAINTEXT" && signatureMethod != "HMAC-SHA1" && signatureMethod != "RSA-SHA1") throw new Error("Un-supported signature method: " + signatureMethod);
    this._signatureMethod = signatureMethod;
    this._nonceSize = nonceSize || 32;
    this._headers = customHeaders || {
        "Accept": "*/*",
        "Connection": "close",
        "User-Agent": "Node authentication"
    };
    this._oauthParameterSeperator = ",";
};
exports.OAuthEcho.prototype = exports.OAuth.prototype;
exports.OAuth.prototype._getTimestamp = function() {
    return Math.floor(new Date().getTime() / 1000);
};
exports.OAuth.prototype._encodeData = function(toEncode) {
    if (toEncode == null || toEncode == "") return "";
    else {
        var result = encodeURIComponent(toEncode);
        // Fix the mismatch between OAuth's  RFC3986's and Javascript's beliefs in what is right and wrong ;)
        return result.replace(/\!/g, "%21").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
    }
};
exports.OAuth.prototype._decodeData = function(toDecode) {
    if (toDecode != null) {
        toDecode = toDecode.replace(/\+/g, " ");
    }
    return decodeURIComponent(toDecode);
};
exports.OAuth.prototype._getSignature = function(method, url, parameters, tokenSecret) {
    var signatureBase = this._createSignatureBase(method, url, parameters);
    return this._createSignature(signatureBase, tokenSecret);
};
exports.OAuth.prototype._normalizeUrl = function(url) {
    var parsedUrl = URL.parse(url, true);
    var port = "";
    if (parsedUrl.port) {
        if (parsedUrl.protocol == "http:" && parsedUrl.port != "80" || parsedUrl.protocol == "https:" && parsedUrl.port != "443") {
            port = ":" + parsedUrl.port;
        }
    }
    if (!parsedUrl.pathname || parsedUrl.pathname == "") parsedUrl.pathname = "/";
    return parsedUrl.protocol + "//" + parsedUrl.hostname + port + parsedUrl.pathname;
};
// Is the parameter considered an OAuth parameter
exports.OAuth.prototype._isParameterNameAnOAuthParameter = function(parameter) {
    var m = parameter.match("^oauth_");
    if (m && m[0] === "oauth_") {
        return true;
    } else {
        return false;
    }
};
// build the OAuth request authorization header
exports.OAuth.prototype._buildAuthorizationHeaders = function(orderedParameters) {
    var authHeader = "OAuth ";
    if (this._isEcho) {
        authHeader += 'realm="' + this._realm + '",';
    }
    for(var i = 0; i < orderedParameters.length; i++){
        // Whilst the all the parameters should be included within the signature, only the oauth_ arguments
        // should appear within the authorization header.
        if (this._isParameterNameAnOAuthParameter(orderedParameters[i][0])) {
            authHeader += "" + this._encodeData(orderedParameters[i][0]) + '="' + this._encodeData(orderedParameters[i][1]) + '"' + this._oauthParameterSeperator;
        }
    }
    authHeader = authHeader.substring(0, authHeader.length - this._oauthParameterSeperator.length);
    return authHeader;
};
// Takes an object literal that represents the arguments, and returns an array
// of argument/value pairs.
exports.OAuth.prototype._makeArrayOfArgumentsHash = function(argumentsHash) {
    var argument_pairs = [];
    for(var key in argumentsHash){
        if (argumentsHash.hasOwnProperty(key)) {
            var value = argumentsHash[key];
            if (Array.isArray(value)) {
                for(var i = 0; i < value.length; i++){
                    argument_pairs[argument_pairs.length] = [
                        key,
                        value[i]
                    ];
                }
            } else {
                argument_pairs[argument_pairs.length] = [
                    key,
                    value
                ];
            }
        }
    }
    return argument_pairs;
};
// Sorts the encoded key value pairs by encoded name, then encoded value
exports.OAuth.prototype._sortRequestParams = function(argument_pairs) {
    // Sort by name, then value.
    argument_pairs.sort(function(a, b) {
        if (a[0] == b[0]) {
            return a[1] < b[1] ? -1 : 1;
        } else return a[0] < b[0] ? -1 : 1;
    });
    return argument_pairs;
};
exports.OAuth.prototype._normaliseRequestParams = function(args) {
    var argument_pairs = this._makeArrayOfArgumentsHash(args);
    // First encode them #3.4.1.3.2 .1
    for(var i = 0; i < argument_pairs.length; i++){
        argument_pairs[i][0] = this._encodeData(argument_pairs[i][0]);
        argument_pairs[i][1] = this._encodeData(argument_pairs[i][1]);
    }
    // Then sort them #3.4.1.3.2 .2
    argument_pairs = this._sortRequestParams(argument_pairs);
    // Then concatenate together #3.4.1.3.2 .3 & .4
    var args = "";
    for(var i = 0; i < argument_pairs.length; i++){
        args += argument_pairs[i][0];
        args += "=";
        args += argument_pairs[i][1];
        if (i < argument_pairs.length - 1) args += "&";
    }
    return args;
};
exports.OAuth.prototype._createSignatureBase = function(method, url, parameters) {
    url = this._encodeData(this._normalizeUrl(url));
    parameters = this._encodeData(parameters);
    return method.toUpperCase() + "&" + url + "&" + parameters;
};
exports.OAuth.prototype._createSignature = function(signatureBase, tokenSecret) {
    if (tokenSecret === undefined) var tokenSecret = "";
    else tokenSecret = this._encodeData(tokenSecret);
    // consumerSecret is already encoded
    var key = this._consumerSecret + "&" + tokenSecret;
    var hash = "";
    if (this._signatureMethod == "PLAINTEXT") {
        hash = key;
    } else if (this._signatureMethod == "RSA-SHA1") {
        key = this._privateKey || "";
        hash = crypto.createSign("RSA-SHA1").update(signatureBase).sign(key, "base64");
    } else {
        if (crypto.Hmac) {
            hash = crypto.createHmac("sha1", key).update(signatureBase).digest("base64");
        } else {
            hash = sha1.HMACSHA1(key, signatureBase);
        }
    }
    return hash;
};
exports.OAuth.prototype.NONCE_CHARS = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9"
];
exports.OAuth.prototype._getNonce = function(nonceSize) {
    var result = [];
    var chars = this.NONCE_CHARS;
    var char_pos;
    var nonce_chars_length = chars.length;
    for(var i = 0; i < nonceSize; i++){
        char_pos = Math.floor(Math.random() * nonce_chars_length);
        result[i] = chars[char_pos];
    }
    return result.join("");
};
exports.OAuth.prototype._createClient = function(port, hostname, method, path, headers, sslEnabled) {
    var options = {
        host: hostname,
        port: port,
        path: path,
        method: method,
        headers: headers
    };
    var httpModel;
    if (sslEnabled) {
        httpModel = https;
    } else {
        httpModel = http;
    }
    return httpModel.request(options);
};
exports.OAuth.prototype._prepareParameters = function(oauth_token, oauth_token_secret, method, url, extra_params) {
    var oauthParameters = {
        "oauth_timestamp": this._getTimestamp(),
        "oauth_nonce": this._getNonce(this._nonceSize),
        "oauth_version": this._version,
        "oauth_signature_method": this._signatureMethod,
        "oauth_consumer_key": this._consumerKey
    };
    if (oauth_token) {
        oauthParameters["oauth_token"] = oauth_token;
    }
    var sig;
    if (this._isEcho) {
        sig = this._getSignature("GET", this._verifyCredentials, this._normaliseRequestParams(oauthParameters), oauth_token_secret);
    } else {
        if (extra_params) {
            for(var key in extra_params){
                if (extra_params.hasOwnProperty(key)) oauthParameters[key] = extra_params[key];
            }
        }
        var parsedUrl = URL.parse(url, false);
        if (parsedUrl.query) {
            var key2;
            var extraParameters = querystring.parse(parsedUrl.query);
            for(var key in extraParameters){
                var value = extraParameters[key];
                if (typeof value == "object") {
                    // TODO: This probably should be recursive
                    for(key2 in value){
                        oauthParameters[key + "[" + key2 + "]"] = value[key2];
                    }
                } else {
                    oauthParameters[key] = value;
                }
            }
        }
        sig = this._getSignature(method, url, this._normaliseRequestParams(oauthParameters), oauth_token_secret);
    }
    var orderedParameters = this._sortRequestParams(this._makeArrayOfArgumentsHash(oauthParameters));
    orderedParameters[orderedParameters.length] = [
        "oauth_signature",
        sig
    ];
    return orderedParameters;
};
exports.OAuth.prototype._performSecureRequest = function(oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type, callback) {
    var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, extra_params);
    if (!post_content_type) {
        post_content_type = "application/x-www-form-urlencoded";
    }
    var parsedUrl = URL.parse(url, false);
    if (parsedUrl.protocol == "http:" && !parsedUrl.port) parsedUrl.port = 80;
    if (parsedUrl.protocol == "https:" && !parsedUrl.port) parsedUrl.port = 443;
    var headers = {};
    var authorization = this._buildAuthorizationHeaders(orderedParameters);
    if (this._isEcho) {
        headers["X-Verify-Credentials-Authorization"] = authorization;
    } else {
        headers["Authorization"] = authorization;
    }
    headers["Host"] = parsedUrl.host;
    for(var key in this._headers){
        if (this._headers.hasOwnProperty(key)) {
            headers[key] = this._headers[key];
        }
    }
    // Filter out any passed extra_params that are really to do with OAuth
    for(var key in extra_params){
        if (this._isParameterNameAnOAuthParameter(key)) {
            delete extra_params[key];
        }
    }
    if ((method == "POST" || method == "PUT") && post_body == null && extra_params != null) {
        // Fix the mismatch between the output of querystring.stringify() and this._encodeData()
        post_body = querystring.stringify(extra_params).replace(/\!/g, "%21").replace(/\'/g, "%27").replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\*/g, "%2A");
    }
    if (post_body) {
        if (Buffer.isBuffer(post_body)) {
            headers["Content-length"] = post_body.length;
        } else {
            headers["Content-length"] = Buffer.byteLength(post_body);
        }
    } else {
        headers["Content-length"] = 0;
    }
    headers["Content-Type"] = post_content_type;
    var path;
    if (!parsedUrl.pathname || parsedUrl.pathname == "") parsedUrl.pathname = "/";
    if (parsedUrl.query) path = parsedUrl.pathname + "?" + parsedUrl.query;
    else path = parsedUrl.pathname;
    var request;
    if (parsedUrl.protocol == "https:") {
        request = this._createClient(parsedUrl.port, parsedUrl.hostname, method, path, headers, true);
    } else {
        request = this._createClient(parsedUrl.port, parsedUrl.hostname, method, path, headers);
    }
    var clientOptions = this._clientOptions;
    if (callback) {
        var data = "";
        var self = this;
        // Some hosts *cough* google appear to close the connection early / send no content-length header
        // allow this behaviour.
        var allowEarlyClose = OAuthUtils.isAnEarlyCloseHost(parsedUrl.hostname);
        var callbackCalled = false;
        var passBackControl = function(response) {
            if (!callbackCalled) {
                callbackCalled = true;
                if (response.statusCode >= 200 && response.statusCode <= 299) {
                    callback(null, data, response);
                } else {
                    // Follow 301 or 302 redirects with Location HTTP header
                    if ((response.statusCode == 301 || response.statusCode == 302) && clientOptions.followRedirects && response.headers && response.headers.location) {
                        self._performSecureRequest(oauth_token, oauth_token_secret, method, response.headers.location, extra_params, post_body, post_content_type, callback);
                    } else {
                        callback({
                            statusCode: response.statusCode,
                            data: data
                        }, data, response);
                    }
                }
            }
        };
        request.on("response", function(response) {
            response.setEncoding("utf8");
            response.on("data", function(chunk) {
                data += chunk;
            });
            response.on("end", function() {
                passBackControl(response);
            });
            response.on("close", function() {
                if (allowEarlyClose) {
                    passBackControl(response);
                }
            });
        });
        request.on("error", function(err) {
            if (!callbackCalled) {
                callbackCalled = true;
                callback(err);
            }
        });
        if ((method == "POST" || method == "PUT") && post_body != null && post_body != "") {
            request.write(post_body);
        }
        request.end();
    } else {
        if ((method == "POST" || method == "PUT") && post_body != null && post_body != "") {
            request.write(post_body);
        }
        return request;
    }
    return;
};
exports.OAuth.prototype.setClientOptions = function(options) {
    var key, mergedOptions = {}, hasOwnProperty = Object.prototype.hasOwnProperty;
    for(key in this._defaultClientOptions){
        if (!hasOwnProperty.call(options, key)) {
            mergedOptions[key] = this._defaultClientOptions[key];
        } else {
            mergedOptions[key] = options[key];
        }
    }
    this._clientOptions = mergedOptions;
};
exports.OAuth.prototype.getOAuthAccessToken = function(oauth_token, oauth_token_secret, oauth_verifier, callback) {
    var extraParams = {};
    if (typeof oauth_verifier == "function") {
        callback = oauth_verifier;
    } else {
        extraParams.oauth_verifier = oauth_verifier;
    }
    this._performSecureRequest(oauth_token, oauth_token_secret, this._clientOptions.accessTokenHttpMethod, this._accessUrl, extraParams, null, null, function(error, data, response) {
        if (error) callback(error);
        else {
            var results = querystring.parse(data);
            var oauth_access_token = results["oauth_token"];
            delete results["oauth_token"];
            var oauth_access_token_secret = results["oauth_token_secret"];
            delete results["oauth_token_secret"];
            callback(null, oauth_access_token, oauth_access_token_secret, results);
        }
    });
};
// Deprecated
exports.OAuth.prototype.getProtectedResource = function(url, method, oauth_token, oauth_token_secret, callback) {
    this._performSecureRequest(oauth_token, oauth_token_secret, method, url, null, "", null, callback);
};
exports.OAuth.prototype["delete"] = function(url, oauth_token, oauth_token_secret, callback) {
    return this._performSecureRequest(oauth_token, oauth_token_secret, "DELETE", url, null, "", null, callback);
};
exports.OAuth.prototype.get = function(url, oauth_token, oauth_token_secret, callback) {
    return this._performSecureRequest(oauth_token, oauth_token_secret, "GET", url, null, "", null, callback);
};
exports.OAuth.prototype._putOrPost = function(method, url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
    var extra_params = null;
    if (typeof post_content_type == "function") {
        callback = post_content_type;
        post_content_type = null;
    }
    if (typeof post_body != "string" && !Buffer.isBuffer(post_body)) {
        post_content_type = "application/x-www-form-urlencoded";
        extra_params = post_body;
        post_body = null;
    }
    return this._performSecureRequest(oauth_token, oauth_token_secret, method, url, extra_params, post_body, post_content_type, callback);
};
exports.OAuth.prototype.put = function(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
    return this._putOrPost("PUT", url, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
};
exports.OAuth.prototype.post = function(url, oauth_token, oauth_token_secret, post_body, post_content_type, callback) {
    return this._putOrPost("POST", url, oauth_token, oauth_token_secret, post_body, post_content_type, callback);
};
/**
 * Gets a request token from the OAuth provider and passes that information back
 * to the calling code.
 *
 * The callback should expect a function of the following form:
 *
 * function(err, token, token_secret, parsedQueryString) {}
 *
 * This method has optional parameters so can be called in the following 2 ways:
 *
 * 1) Primary use case: Does a basic request with no extra parameters
 *  getOAuthRequestToken( callbackFunction )
 *
 * 2) As above but allows for provision of extra parameters to be sent as part of the query to the server.
 *  getOAuthRequestToken( extraParams, callbackFunction )
 *
 * N.B. This method will HTTP POST verbs by default, if you wish to override this behaviour you will
 * need to provide a requestTokenHttpMethod option when creating the client.
 *
 **/ exports.OAuth.prototype.getOAuthRequestToken = function(extraParams, callback) {
    if (typeof extraParams == "function") {
        callback = extraParams;
        extraParams = {};
    }
    // Callbacks are 1.0A related
    if (this._authorize_callback) {
        extraParams["oauth_callback"] = this._authorize_callback;
    }
    this._performSecureRequest(null, null, this._clientOptions.requestTokenHttpMethod, this._requestUrl, extraParams, null, null, function(error, data, response) {
        if (error) callback(error);
        else {
            var results = querystring.parse(data);
            var oauth_token = results["oauth_token"];
            var oauth_token_secret = results["oauth_token_secret"];
            delete results["oauth_token"];
            delete results["oauth_token_secret"];
            callback(null, oauth_token, oauth_token_secret, results);
        }
    });
};
exports.OAuth.prototype.signUrl = function(url, oauth_token, oauth_token_secret, method) {
    if (method === undefined) {
        var method = "GET";
    }
    var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, {});
    var parsedUrl = URL.parse(url, false);
    var query = "";
    for(var i = 0; i < orderedParameters.length; i++){
        query += orderedParameters[i][0] + "=" + this._encodeData(orderedParameters[i][1]) + "&";
    }
    query = query.substring(0, query.length - 1);
    return parsedUrl.protocol + "//" + parsedUrl.host + parsedUrl.pathname + "?" + query;
};
exports.OAuth.prototype.authHeader = function(url, oauth_token, oauth_token_secret, method) {
    if (method === undefined) {
        var method = "GET";
    }
    var orderedParameters = this._prepareParameters(oauth_token, oauth_token_secret, method, url, {});
    return this._buildAuthorizationHeaders(orderedParameters);
};


/***/ }),

/***/ 25538:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

var querystring = __webpack_require__(63477), crypto = __webpack_require__(6113), https = __webpack_require__(95687), http = __webpack_require__(13685), URL = __webpack_require__(57310), OAuthUtils = __webpack_require__(16604);
exports.OAuth2 = function(clientId, clientSecret, baseSite, authorizePath, accessTokenPath, customHeaders) {
    this._clientId = clientId;
    this._clientSecret = clientSecret;
    this._baseSite = baseSite;
    this._authorizeUrl = authorizePath || "/oauth/authorize";
    this._accessTokenUrl = accessTokenPath || "/oauth/access_token";
    this._accessTokenName = "access_token";
    this._authMethod = "Bearer";
    this._customHeaders = customHeaders || {};
    this._useAuthorizationHeaderForGET = false;
    //our agent
    this._agent = undefined;
};
// Allows you to set an agent to use instead of the default HTTP or
// HTTPS agents. Useful when dealing with your own certificates.
exports.OAuth2.prototype.setAgent = function(agent) {
    this._agent = agent;
};
// This 'hack' method is required for sites that don't use
// 'access_token' as the name of the access token (for requests).
// ( http://tools.ietf.org/html/draft-ietf-oauth-v2-16#section-7 )
// it isn't clear what the correct value should be atm, so allowing
// for specific (temporary?) override for now.
exports.OAuth2.prototype.setAccessTokenName = function(name) {
    this._accessTokenName = name;
};
// Sets the authorization method for Authorization header.
// e.g. Authorization: Bearer <token>  # "Bearer" is the authorization method.
exports.OAuth2.prototype.setAuthMethod = function(authMethod) {
    this._authMethod = authMethod;
};
// If you use the OAuth2 exposed 'get' method (and don't construct your own _request call )
// this will specify whether to use an 'Authorize' header instead of passing the access_token as a query parameter
exports.OAuth2.prototype.useAuthorizationHeaderforGET = function(useIt) {
    this._useAuthorizationHeaderForGET = useIt;
};
exports.OAuth2.prototype._getAccessTokenUrl = function() {
    return this._baseSite + this._accessTokenUrl; /* + "?" + querystring.stringify(params); */ 
};
// Build the authorization header. In particular, build the part after the colon.
// e.g. Authorization: Bearer <token>  # Build "Bearer <token>"
exports.OAuth2.prototype.buildAuthHeader = function(token) {
    return this._authMethod + " " + token;
};
exports.OAuth2.prototype._chooseHttpLibrary = function(parsedUrl) {
    var http_library = https;
    // As this is OAUth2, we *assume* https unless told explicitly otherwise.
    if (parsedUrl.protocol != "https:") {
        http_library = http;
    }
    return http_library;
};
exports.OAuth2.prototype._request = function(method, url, headers, post_body, access_token, callback) {
    var parsedUrl = URL.parse(url, true);
    if (parsedUrl.protocol == "https:" && !parsedUrl.port) {
        parsedUrl.port = 443;
    }
    var http_library = this._chooseHttpLibrary(parsedUrl);
    var realHeaders = {};
    for(var key in this._customHeaders){
        realHeaders[key] = this._customHeaders[key];
    }
    if (headers) {
        for(var key in headers){
            realHeaders[key] = headers[key];
        }
    }
    realHeaders["Host"] = parsedUrl.host;
    if (!realHeaders["User-Agent"]) {
        realHeaders["User-Agent"] = "Node-oauth";
    }
    if (post_body) {
        if (Buffer.isBuffer(post_body)) {
            realHeaders["Content-Length"] = post_body.length;
        } else {
            realHeaders["Content-Length"] = Buffer.byteLength(post_body);
        }
    } else {
        realHeaders["Content-length"] = 0;
    }
    if (access_token && !("Authorization" in realHeaders)) {
        if (!parsedUrl.query) parsedUrl.query = {};
        parsedUrl.query[this._accessTokenName] = access_token;
    }
    var queryStr = querystring.stringify(parsedUrl.query);
    if (queryStr) queryStr = "?" + queryStr;
    var options = {
        host: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.pathname + queryStr,
        method: method,
        headers: realHeaders
    };
    this._executeRequest(http_library, options, post_body, callback);
};
exports.OAuth2.prototype._executeRequest = function(http_library, options, post_body, callback) {
    // Some hosts *cough* google appear to close the connection early / send no content-length header
    // allow this behaviour.
    var allowEarlyClose = OAuthUtils.isAnEarlyCloseHost(options.host);
    var callbackCalled = false;
    function passBackControl(response, result) {
        if (!callbackCalled) {
            callbackCalled = true;
            if (!(response.statusCode >= 200 && response.statusCode <= 299) && response.statusCode != 301 && response.statusCode != 302) {
                callback({
                    statusCode: response.statusCode,
                    data: result
                });
            } else {
                callback(null, result, response);
            }
        }
    }
    var result = "";
    //set the agent on the request options
    if (this._agent) {
        options.agent = this._agent;
    }
    var request = http_library.request(options);
    request.on("response", function(response) {
        response.on("data", function(chunk) {
            result += chunk;
        });
        response.on("close", function(err) {
            if (allowEarlyClose) {
                passBackControl(response, result);
            }
        });
        response.addListener("end", function() {
            passBackControl(response, result);
        });
    });
    request.on("error", function(e) {
        callbackCalled = true;
        callback(e);
    });
    if ((options.method == "POST" || options.method == "PUT") && post_body) {
        request.write(post_body);
    }
    request.end();
};
exports.OAuth2.prototype.getAuthorizeUrl = function(params) {
    var params = params || {};
    params["client_id"] = this._clientId;
    return this._baseSite + this._authorizeUrl + "?" + querystring.stringify(params);
};
exports.OAuth2.prototype.getOAuthAccessToken = function(code, params, callback) {
    var params = params || {};
    params["client_id"] = this._clientId;
    params["client_secret"] = this._clientSecret;
    var codeParam = params.grant_type === "refresh_token" ? "refresh_token" : "code";
    params[codeParam] = code;
    var post_data = querystring.stringify(params);
    var post_headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };
    this._request("POST", this._getAccessTokenUrl(), post_headers, post_data, null, function(error, data, response) {
        if (error) callback(error);
        else {
            var results;
            try {
                // As of http://tools.ietf.org/html/draft-ietf-oauth-v2-07
                // responses should be in JSON
                results = JSON.parse(data);
            } catch (e) {
                // .... However both Facebook + Github currently use rev05 of the spec
                // and neither seem to specify a content-type correctly in their response headers :(
                // clients of these services will suffer a *minor* performance cost of the exception
                // being thrown
                results = querystring.parse(data);
            }
            var access_token = results["access_token"];
            var refresh_token = results["refresh_token"];
            delete results["refresh_token"];
            callback(null, access_token, refresh_token, results); // callback results =-=
        }
    });
};
// Deprecated
exports.OAuth2.prototype.getProtectedResource = function(url, access_token, callback) {
    this._request("GET", url, {}, "", access_token, callback);
};
exports.OAuth2.prototype.get = function(url, access_token, callback) {
    if (this._useAuthorizationHeaderForGET) {
        var headers = {
            "Authorization": this.buildAuthHeader(access_token)
        };
        access_token = null;
    } else {
        headers = {};
    }
    this._request("GET", url, headers, "", access_token, callback);
};


/***/ }),

/***/ 72771:
/***/ ((__unused_webpack_module, exports) => {

/*
 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
 * in FIPS 180-1
 * Version 2.2 Copyright Paul Johnston 2000 - 2009.
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for details.
 */ /*
 * Configurable variables. You may need to tweak these to be compatible with
 * the server-side, but the defaults work in most cases.
 */ var hexcase = 1; /* hex output format. 0 - lowercase; 1 - uppercase        */ 
var b64pad = "="; /* base-64 pad character. "=" for strict RFC compliance   */ 
/*
 * These are the functions you'll usually want to call
 * They take string arguments and return either hex or base-64 encoded strings
 */ function hex_sha1(s) {
    return rstr2hex(rstr_sha1(str2rstr_utf8(s)));
}
function b64_sha1(s) {
    return rstr2b64(rstr_sha1(str2rstr_utf8(s)));
}
function any_sha1(s, e) {
    return rstr2any(rstr_sha1(str2rstr_utf8(s)), e);
}
function hex_hmac_sha1(k, d) {
    return rstr2hex(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
}
function b64_hmac_sha1(k, d) {
    return rstr2b64(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)));
}
function any_hmac_sha1(k, d, e) {
    return rstr2any(rstr_hmac_sha1(str2rstr_utf8(k), str2rstr_utf8(d)), e);
}
/*
 * Perform a simple self-test to see if the VM is working
 */ function sha1_vm_test() {
    return hex_sha1("abc").toLowerCase() == "a9993e364706816aba3e25717850c26c9cd0d89d";
}
/*
 * Calculate the SHA1 of a raw string
 */ function rstr_sha1(s) {
    return binb2rstr(binb_sha1(rstr2binb(s), s.length * 8));
}
/*
 * Calculate the HMAC-SHA1 of a key and some data (raw strings)
 */ function rstr_hmac_sha1(key, data) {
    var bkey = rstr2binb(key);
    if (bkey.length > 16) bkey = binb_sha1(bkey, key.length * 8);
    var ipad = Array(16), opad = Array(16);
    for(var i = 0; i < 16; i++){
        ipad[i] = bkey[i] ^ 0x36363636;
        opad[i] = bkey[i] ^ 0x5C5C5C5C;
    }
    var hash = binb_sha1(ipad.concat(rstr2binb(data)), 512 + data.length * 8);
    return binb2rstr(binb_sha1(opad.concat(hash), 512 + 160));
}
/*
 * Convert a raw string to a hex string
 */ function rstr2hex(input) {
    try {
        hexcase;
    } catch (e) {
        hexcase = 0;
    }
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var output = "";
    var x;
    for(var i = 0; i < input.length; i++){
        x = input.charCodeAt(i);
        output += hex_tab.charAt(x >>> 4 & 0x0F) + hex_tab.charAt(x & 0x0F);
    }
    return output;
}
/*
 * Convert a raw string to a base-64 string
 */ function rstr2b64(input) {
    try {
        b64pad;
    } catch (e) {
        b64pad = "";
    }
    var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var output = "";
    var len = input.length;
    for(var i = 0; i < len; i += 3){
        var triplet = input.charCodeAt(i) << 16 | (i + 1 < len ? input.charCodeAt(i + 1) << 8 : 0) | (i + 2 < len ? input.charCodeAt(i + 2) : 0);
        for(var j = 0; j < 4; j++){
            if (i * 8 + j * 6 > input.length * 8) output += b64pad;
            else output += tab.charAt(triplet >>> 6 * (3 - j) & 0x3F);
        }
    }
    return output;
}
/*
 * Convert a raw string to an arbitrary string encoding
 */ function rstr2any(input, encoding) {
    var divisor = encoding.length;
    var remainders = Array();
    var i, q, x, quotient;
    /* Convert to an array of 16-bit big-endian values, forming the dividend */ var dividend = Array(Math.ceil(input.length / 2));
    for(i = 0; i < dividend.length; i++){
        dividend[i] = input.charCodeAt(i * 2) << 8 | input.charCodeAt(i * 2 + 1);
    }
    /*
   * Repeatedly perform a long division. The binary array forms the dividend,
   * the length of the encoding is the divisor. Once computed, the quotient
   * forms the dividend for the next step. We stop when the dividend is zero.
   * All remainders are stored for later use.
   */ while(dividend.length > 0){
        quotient = Array();
        x = 0;
        for(i = 0; i < dividend.length; i++){
            x = (x << 16) + dividend[i];
            q = Math.floor(x / divisor);
            x -= q * divisor;
            if (quotient.length > 0 || q > 0) quotient[quotient.length] = q;
        }
        remainders[remainders.length] = x;
        dividend = quotient;
    }
    /* Convert the remainders to the output string */ var output = "";
    for(i = remainders.length - 1; i >= 0; i--)output += encoding.charAt(remainders[i]);
    /* Append leading zero equivalents */ var full_length = Math.ceil(input.length * 8 / (Math.log(encoding.length) / Math.log(2)));
    for(i = output.length; i < full_length; i++)output = encoding[0] + output;
    return output;
}
/*
 * Encode a string as utf-8.
 * For efficiency, this assumes the input is valid utf-16.
 */ function str2rstr_utf8(input) {
    var output = "";
    var i = -1;
    var x, y;
    while(++i < input.length){
        /* Decode utf-16 surrogate pairs */ x = input.charCodeAt(i);
        y = i + 1 < input.length ? input.charCodeAt(i + 1) : 0;
        if (0xD800 <= x && x <= 0xDBFF && 0xDC00 <= y && y <= 0xDFFF) {
            x = 0x10000 + ((x & 0x03FF) << 10) + (y & 0x03FF);
            i++;
        }
        /* Encode output as utf-8 */ if (x <= 0x7F) output += String.fromCharCode(x);
        else if (x <= 0x7FF) output += String.fromCharCode(0xC0 | x >>> 6 & 0x1F, 0x80 | x & 0x3F);
        else if (x <= 0xFFFF) output += String.fromCharCode(0xE0 | x >>> 12 & 0x0F, 0x80 | x >>> 6 & 0x3F, 0x80 | x & 0x3F);
        else if (x <= 0x1FFFFF) output += String.fromCharCode(0xF0 | x >>> 18 & 0x07, 0x80 | x >>> 12 & 0x3F, 0x80 | x >>> 6 & 0x3F, 0x80 | x & 0x3F);
    }
    return output;
}
/*
 * Encode a string as utf-16
 */ function str2rstr_utf16le(input) {
    var output = "";
    for(var i = 0; i < input.length; i++)output += String.fromCharCode(input.charCodeAt(i) & 0xFF, input.charCodeAt(i) >>> 8 & 0xFF);
    return output;
}
function str2rstr_utf16be(input) {
    var output = "";
    for(var i = 0; i < input.length; i++)output += String.fromCharCode(input.charCodeAt(i) >>> 8 & 0xFF, input.charCodeAt(i) & 0xFF);
    return output;
}
/*
 * Convert a raw string to an array of big-endian words
 * Characters >255 have their high-byte silently ignored.
 */ function rstr2binb(input) {
    var output = Array(input.length >> 2);
    for(var i = 0; i < output.length; i++)output[i] = 0;
    for(var i = 0; i < input.length * 8; i += 8)output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << 24 - i % 32;
    return output;
}
/*
 * Convert an array of big-endian words to a string
 */ function binb2rstr(input) {
    var output = "";
    for(var i = 0; i < input.length * 32; i += 8)output += String.fromCharCode(input[i >> 5] >>> 24 - i % 32 & 0xFF);
    return output;
}
/*
 * Calculate the SHA-1 of an array of big-endian words, and a bit length
 */ function binb_sha1(x, len) {
    /* append padding */ x[len >> 5] |= 0x80 << 24 - len % 32;
    x[(len + 64 >> 9 << 4) + 15] = len;
    var w = Array(80);
    var a = 1732584193;
    var b = -271733879;
    var c = -1732584194;
    var d = 271733878;
    var e = -1009589776;
    for(var i = 0; i < x.length; i += 16){
        var olda = a;
        var oldb = b;
        var oldc = c;
        var oldd = d;
        var olde = e;
        for(var j = 0; j < 80; j++){
            if (j < 16) w[j] = x[i + j];
            else w[j] = bit_rol(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            var t = safe_add(safe_add(bit_rol(a, 5), sha1_ft(j, b, c, d)), safe_add(safe_add(e, w[j]), sha1_kt(j)));
            e = d;
            d = c;
            c = bit_rol(b, 30);
            b = a;
            a = t;
        }
        a = safe_add(a, olda);
        b = safe_add(b, oldb);
        c = safe_add(c, oldc);
        d = safe_add(d, oldd);
        e = safe_add(e, olde);
    }
    return Array(a, b, c, d, e);
}
/*
 * Perform the appropriate triplet combination function for the current
 * iteration
 */ function sha1_ft(t, b, c, d) {
    if (t < 20) return b & c | ~b & d;
    if (t < 40) return b ^ c ^ d;
    if (t < 60) return b & c | b & d | c & d;
    return b ^ c ^ d;
}
/*
 * Determine the appropriate additive constant for the current iteration
 */ function sha1_kt(t) {
    return t < 20 ? 1518500249 : t < 40 ? 1859775393 : t < 60 ? -1894007588 : -899497514;
}
/*
 * Add integers, wrapping at 2^32. This uses 16-bit operations internally
 * to work around bugs in some JS interpreters.
 */ function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return msw << 16 | lsw & 0xFFFF;
}
/*
 * Bitwise rotate a 32-bit number to the left.
 */ function bit_rol(num, cnt) {
    return num << cnt | num >>> 32 - cnt;
}
exports.HMACSHA1 = function(key, data) {
    return b64_hmac_sha1(key, data);
};


/***/ }),

/***/ 60442:
/***/ ((module, exports, __webpack_require__) => {

"use strict";

var crypto = __webpack_require__(6113);
/**
 * Exported function
 *
 * Options:
 *
 *  - `algorithm` hash algo to be used by this instance: *'sha1', 'md5'
 *  - `excludeValues` {true|*false} hash object keys, values ignored
 *  - `encoding` hash encoding, supports 'buffer', '*hex', 'binary', 'base64'
 *  - `ignoreUnknown` {true|*false} ignore unknown object types
 *  - `replacer` optional function that replaces values before hashing
 *  - `respectFunctionProperties` {*true|false} consider function properties when hashing
 *  - `respectFunctionNames` {*true|false} consider 'name' property of functions for hashing
 *  - `respectType` {*true|false} Respect special properties (prototype, constructor)
 *    when hashing to distinguish between types
 *  - `unorderedArrays` {true|*false} Sort all arrays before hashing
 *  - `unorderedSets` {*true|false} Sort `Set` and `Map` instances before hashing
 *  * = default
 *
 * @param {object} object value to hash
 * @param {object} options hashing options
 * @return {string} hash value
 * @api public
 */ exports = module.exports = objectHash;
function objectHash(object, options) {
    options = applyDefaults(object, options);
    return hash(object, options);
}
/**
 * Exported sugar methods
 *
 * @param {object} object value to hash
 * @return {string} hash value
 * @api public
 */ exports.sha1 = function(object) {
    return objectHash(object);
};
exports.keys = function(object) {
    return objectHash(object, {
        excludeValues: true,
        algorithm: "sha1",
        encoding: "hex"
    });
};
exports.MD5 = function(object) {
    return objectHash(object, {
        algorithm: "md5",
        encoding: "hex"
    });
};
exports.keysMD5 = function(object) {
    return objectHash(object, {
        algorithm: "md5",
        encoding: "hex",
        excludeValues: true
    });
};
// Internals
var hashes = crypto.getHashes ? crypto.getHashes().slice() : [
    "sha1",
    "md5"
];
hashes.push("passthrough");
var encodings = [
    "buffer",
    "hex",
    "binary",
    "base64"
];
function applyDefaults(object, sourceOptions) {
    sourceOptions = sourceOptions || {};
    // create a copy rather than mutating
    var options = {};
    options.algorithm = sourceOptions.algorithm || "sha1";
    options.encoding = sourceOptions.encoding || "hex";
    options.excludeValues = sourceOptions.excludeValues ? true : false;
    options.algorithm = options.algorithm.toLowerCase();
    options.encoding = options.encoding.toLowerCase();
    options.ignoreUnknown = sourceOptions.ignoreUnknown !== true ? false : true; // default to false
    options.respectType = sourceOptions.respectType === false ? false : true; // default to true
    options.respectFunctionNames = sourceOptions.respectFunctionNames === false ? false : true;
    options.respectFunctionProperties = sourceOptions.respectFunctionProperties === false ? false : true;
    options.unorderedArrays = sourceOptions.unorderedArrays !== true ? false : true; // default to false
    options.unorderedSets = sourceOptions.unorderedSets === false ? false : true; // default to false
    options.unorderedObjects = sourceOptions.unorderedObjects === false ? false : true; // default to true
    options.replacer = sourceOptions.replacer || undefined;
    options.excludeKeys = sourceOptions.excludeKeys || undefined;
    if (typeof object === "undefined") {
        throw new Error("Object argument required.");
    }
    // if there is a case-insensitive match in the hashes list, accept it
    // (i.e. SHA256 for sha256)
    for(var i = 0; i < hashes.length; ++i){
        if (hashes[i].toLowerCase() === options.algorithm.toLowerCase()) {
            options.algorithm = hashes[i];
        }
    }
    if (hashes.indexOf(options.algorithm) === -1) {
        throw new Error('Algorithm "' + options.algorithm + '"  not supported. ' + "supported values: " + hashes.join(", "));
    }
    if (encodings.indexOf(options.encoding) === -1 && options.algorithm !== "passthrough") {
        throw new Error('Encoding "' + options.encoding + '"  not supported. ' + "supported values: " + encodings.join(", "));
    }
    return options;
}
/** Check if the given function is a native function */ function isNativeFunction(f) {
    if (typeof f !== "function") {
        return false;
    }
    var exp = /^function\s+\w*\s*\(\s*\)\s*{\s+\[native code\]\s+}$/i;
    return exp.exec(Function.prototype.toString.call(f)) != null;
}
function hash(object, options) {
    var hashingStream;
    if (options.algorithm !== "passthrough") {
        hashingStream = crypto.createHash(options.algorithm);
    } else {
        hashingStream = new PassThrough();
    }
    if (typeof hashingStream.write === "undefined") {
        hashingStream.write = hashingStream.update;
        hashingStream.end = hashingStream.update;
    }
    var hasher = typeHasher(options, hashingStream);
    hasher.dispatch(object);
    if (!hashingStream.update) {
        hashingStream.end("");
    }
    if (hashingStream.digest) {
        return hashingStream.digest(options.encoding === "buffer" ? undefined : options.encoding);
    }
    var buf = hashingStream.read();
    if (options.encoding === "buffer") {
        return buf;
    }
    return buf.toString(options.encoding);
}
/**
 * Expose streaming API
 *
 * @param {object} object  Value to serialize
 * @param {object} options  Options, as for hash()
 * @param {object} stream  A stream to write the serializiation to
 * @api public
 */ exports.writeToStream = function(object, options, stream) {
    if (typeof stream === "undefined") {
        stream = options;
        options = {};
    }
    options = applyDefaults(object, options);
    return typeHasher(options, stream).dispatch(object);
};
function typeHasher(options, writeTo, context) {
    context = context || [];
    var write = function(str) {
        if (writeTo.update) {
            return writeTo.update(str, "utf8");
        } else {
            return writeTo.write(str, "utf8");
        }
    };
    return {
        dispatch: function(value) {
            if (options.replacer) {
                value = options.replacer(value);
            }
            var type = typeof value;
            if (value === null) {
                type = "null";
            }
            //console.log("[DEBUG] Dispatch: ", value, "->", type, " -> ", "_" + type);
            return this["_" + type](value);
        },
        _object: function(object) {
            var pattern = /\[object (.*)\]/i;
            var objString = Object.prototype.toString.call(object);
            var objType = pattern.exec(objString);
            if (!objType) {
                objType = "unknown:[" + objString + "]";
            } else {
                objType = objType[1]; // take only the class name
            }
            objType = objType.toLowerCase();
            var objectNumber = null;
            if ((objectNumber = context.indexOf(object)) >= 0) {
                return this.dispatch("[CIRCULAR:" + objectNumber + "]");
            } else {
                context.push(object);
            }
            if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
                write("buffer:");
                return write(object);
            }
            if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
                if (this["_" + objType]) {
                    this["_" + objType](object);
                } else if (options.ignoreUnknown) {
                    return write("[" + objType + "]");
                } else {
                    throw new Error('Unknown object type "' + objType + '"');
                }
            } else {
                var keys = Object.keys(object);
                if (options.unorderedObjects) {
                    keys = keys.sort();
                }
                // Make sure to incorporate special properties, so
                // Types with different prototypes will produce
                // a different hash and objects derived from
                // different functions (`new Foo`, `new Bar`) will
                // produce different hashes.
                // We never do this for native functions since some
                // seem to break because of that.
                if (options.respectType !== false && !isNativeFunction(object)) {
                    keys.splice(0, 0, "prototype", "__proto__", "constructor");
                }
                if (options.excludeKeys) {
                    keys = keys.filter(function(key) {
                        return !options.excludeKeys(key);
                    });
                }
                write("object:" + keys.length + ":");
                var self = this;
                return keys.forEach(function(key) {
                    self.dispatch(key);
                    write(":");
                    if (!options.excludeValues) {
                        self.dispatch(object[key]);
                    }
                    write(",");
                });
            }
        },
        _array: function(arr, unordered) {
            unordered = typeof unordered !== "undefined" ? unordered : options.unorderedArrays !== false; // default to options.unorderedArrays
            var self = this;
            write("array:" + arr.length + ":");
            if (!unordered || arr.length <= 1) {
                return arr.forEach(function(entry) {
                    return self.dispatch(entry);
                });
            }
            // the unordered case is a little more complicated:
            // since there is no canonical ordering on objects,
            // i.e. {a:1} < {a:2} and {a:1} > {a:2} are both false,
            // we first serialize each entry using a PassThrough stream
            // before sorting.
            // also: we can’t use the same context array for all entries
            // since the order of hashing should *not* matter. instead,
            // we keep track of the additions to a copy of the context array
            // and add all of them to the global context array when we’re done
            var contextAdditions = [];
            var entries = arr.map(function(entry) {
                var strm = new PassThrough();
                var localContext = context.slice(); // make copy
                var hasher = typeHasher(options, strm, localContext);
                hasher.dispatch(entry);
                // take only what was added to localContext and append it to contextAdditions
                contextAdditions = contextAdditions.concat(localContext.slice(context.length));
                return strm.read().toString();
            });
            context = context.concat(contextAdditions);
            entries.sort();
            return this._array(entries, false);
        },
        _date: function(date) {
            return write("date:" + date.toJSON());
        },
        _symbol: function(sym) {
            return write("symbol:" + sym.toString());
        },
        _error: function(err) {
            return write("error:" + err.toString());
        },
        _boolean: function(bool) {
            return write("bool:" + bool.toString());
        },
        _string: function(string) {
            write("string:" + string.length + ":");
            write(string.toString());
        },
        _function: function(fn) {
            write("fn:");
            if (isNativeFunction(fn)) {
                this.dispatch("[native]");
            } else {
                this.dispatch(fn.toString());
            }
            if (options.respectFunctionNames !== false) {
                // Make sure we can still distinguish native functions
                // by their name, otherwise String and Function will
                // have the same hash
                this.dispatch("function-name:" + String(fn.name));
            }
            if (options.respectFunctionProperties) {
                this._object(fn);
            }
        },
        _number: function(number) {
            return write("number:" + number.toString());
        },
        _xml: function(xml) {
            return write("xml:" + xml.toString());
        },
        _null: function() {
            return write("Null");
        },
        _undefined: function() {
            return write("Undefined");
        },
        _regexp: function(regex) {
            return write("regex:" + regex.toString());
        },
        _uint8array: function(arr) {
            write("uint8array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _uint8clampedarray: function(arr) {
            write("uint8clampedarray:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _int8array: function(arr) {
            write("uint8array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _uint16array: function(arr) {
            write("uint16array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _int16array: function(arr) {
            write("uint16array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _uint32array: function(arr) {
            write("uint32array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _int32array: function(arr) {
            write("uint32array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _float32array: function(arr) {
            write("float32array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _float64array: function(arr) {
            write("float64array:");
            return this.dispatch(Array.prototype.slice.call(arr));
        },
        _arraybuffer: function(arr) {
            write("arraybuffer:");
            return this.dispatch(new Uint8Array(arr));
        },
        _url: function(url) {
            return write("url:" + url.toString(), "utf8");
        },
        _map: function(map) {
            write("map:");
            var arr = Array.from(map);
            return this._array(arr, options.unorderedSets !== false);
        },
        _set: function(set) {
            write("set:");
            var arr = Array.from(set);
            return this._array(arr, options.unorderedSets !== false);
        },
        _file: function(file) {
            write("file:");
            return this.dispatch([
                file.name,
                file.size,
                file.type,
                file.lastModfied
            ]);
        },
        _blob: function() {
            if (options.ignoreUnknown) {
                return write("[blob]");
            }
            throw Error("Hashing Blob objects is currently not supported\n" + "(see https://github.com/puleos/object-hash/issues/26)\n" + 'Use "options.replacer" or "options.ignoreUnknown"\n');
        },
        _domwindow: function() {
            return write("domwindow");
        },
        _bigint: function(number) {
            return write("bigint:" + number.toString());
        },
        /* Node.js standard native objects */ _process: function() {
            return write("process");
        },
        _timer: function() {
            return write("timer");
        },
        _pipe: function() {
            return write("pipe");
        },
        _tcp: function() {
            return write("tcp");
        },
        _udp: function() {
            return write("udp");
        },
        _tty: function() {
            return write("tty");
        },
        _statwatcher: function() {
            return write("statwatcher");
        },
        _securecontext: function() {
            return write("securecontext");
        },
        _connection: function() {
            return write("connection");
        },
        _zlib: function() {
            return write("zlib");
        },
        _context: function() {
            return write("context");
        },
        _nodescript: function() {
            return write("nodescript");
        },
        _httpparser: function() {
            return write("httpparser");
        },
        _dataview: function() {
            return write("dataview");
        },
        _signal: function() {
            return write("signal");
        },
        _fsevent: function() {
            return write("fsevent");
        },
        _tlswrap: function() {
            return write("tlswrap");
        }
    };
}
// Mini-implementation of stream.PassThrough
// We are far from having need for the full implementation, and we can
// make assumptions like "many writes, then only one final read"
// and we can ignore encoding specifics
function PassThrough() {
    return {
        buf: "",
        write: function(b) {
            this.buf += b;
        },
        end: function(b) {
            this.buf += b;
        },
        read: function() {
            return this.buf;
        }
    };
}


/***/ }),

/***/ 95531:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { strict: assert } = __webpack_require__(39491);
const { createHash } = __webpack_require__(6113);
const { format } = __webpack_require__(73837);
const shake256 = __webpack_require__(46486);
let encode;
if (Buffer.isEncoding("base64url")) {
    encode = (input)=>input.toString("base64url");
} else {
    const fromBase64 = (base64)=>base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    encode = (input)=>fromBase64(input.toString("base64"));
}
/** SPECIFICATION
 * Its (_hash) value is the base64url encoding of the left-most half of the hash of the octets of
 * the ASCII representation of the token value, where the hash algorithm used is the hash algorithm
 * used in the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is
 * RS256, hash the token value with SHA-256, then take the left-most 128 bits and base64url encode
 * them. The _hash value is a case sensitive string.
 */ /**
 * @name getHash
 * @api private
 *
 * returns the sha length based off the JOSE alg heade value, defaults to sha256
 *
 * @param token {String} token value to generate the hash from
 * @param alg {String} ID Token JOSE header alg value (i.e. RS256, HS384, ES512, PS256)
 * @param [crv] {String} For EdDSA the curve decides what hash algorithm is used. Required for EdDSA
 */ function getHash(alg, crv) {
    switch(alg){
        case "HS256":
        case "RS256":
        case "PS256":
        case "ES256":
        case "ES256K":
            return createHash("sha256");
        case "HS384":
        case "RS384":
        case "PS384":
        case "ES384":
            return createHash("sha384");
        case "HS512":
        case "RS512":
        case "PS512":
        case "ES512":
            return createHash("sha512");
        case "EdDSA":
            switch(crv){
                case "Ed25519":
                    return createHash("sha512");
                case "Ed448":
                    if (!shake256) {
                        throw new TypeError("Ed448 *_hash calculation is not supported in your Node.js runtime version");
                    }
                    return createHash("shake256", {
                        outputLength: 114
                    });
                default:
                    throw new TypeError("unrecognized or invalid EdDSA curve provided");
            }
        default:
            throw new TypeError("unrecognized or invalid JWS algorithm provided");
    }
}
function generate(token, alg, crv) {
    const digest = getHash(alg, crv).update(token).digest();
    return encode(digest.slice(0, digest.length / 2));
}
function validate(names, actual, source, alg, crv) {
    if (typeof names.claim !== "string" || !names.claim) {
        throw new TypeError("names.claim must be a non-empty string");
    }
    if (typeof names.source !== "string" || !names.source) {
        throw new TypeError("names.source must be a non-empty string");
    }
    assert(typeof actual === "string" && actual, `${names.claim} must be a non-empty string`);
    assert(typeof source === "string" && source, `${names.source} must be a non-empty string`);
    let expected;
    let msg;
    try {
        expected = generate(source, alg, crv);
    } catch (err) {
        msg = format("%s could not be validated (%s)", names.claim, err.message);
    }
    msg = msg || format("%s mismatch, expected %s, got: %s", names.claim, expected, actual);
    assert.equal(expected, actual, msg);
}
module.exports = {
    validate,
    generate
};


/***/ }),

/***/ 46486:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const crypto = __webpack_require__(6113);
const [major, minor] = process.version.substring(1).split(".").map((x)=>parseInt(x, 10));
const xofOutputLength = major > 12 || major === 12 && minor >= 8;
const shake256 = xofOutputLength && crypto.getHashes().includes("shake256");
module.exports = shake256;


/***/ }),

/***/ 1695:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { inspect } = __webpack_require__(73837);
const stdhttp = __webpack_require__(13685);
const crypto = __webpack_require__(6113);
const { strict: assert } = __webpack_require__(39491);
const querystring = __webpack_require__(63477);
const url = __webpack_require__(57310);
const { URL, URLSearchParams } = __webpack_require__(57310);
const jose = __webpack_require__(23464);
const tokenHash = __webpack_require__(95531);
const isKeyObject = __webpack_require__(68519);
const decodeJWT = __webpack_require__(22768);
const base64url = __webpack_require__(98723);
const defaults = __webpack_require__(61290);
const parseWwwAuthenticate = __webpack_require__(48662);
const { assertSigningAlgValuesSupport, assertIssuerConfiguration } = __webpack_require__(75486);
const pick = __webpack_require__(10218);
const isPlainObject = __webpack_require__(75915);
const processResponse = __webpack_require__(95841);
const TokenSet = __webpack_require__(53394);
const { OPError, RPError } = __webpack_require__(54180);
const now = __webpack_require__(2218);
const { random } = __webpack_require__(75598);
const request = __webpack_require__(11825);
const { CLOCK_TOLERANCE } = __webpack_require__(59774);
const { keystores } = __webpack_require__(22794);
const KeyStore = __webpack_require__(72270);
const clone = __webpack_require__(34033);
const { authenticatedPost, resolveResponseType, resolveRedirectUri } = __webpack_require__(73414);
const { queryKeyStore } = __webpack_require__(67772);
const DeviceFlowHandle = __webpack_require__(93954);
const [major, minor] = process.version.slice(1).split(".").map((str)=>parseInt(str, 10));
const rsaPssParams = major >= 17 || major === 16 && minor >= 9;
const retryAttempt = Symbol();
const skipNonceCheck = Symbol();
const skipMaxAgeCheck = Symbol();
function pickCb(input) {
    return pick(input, "access_token", "code", "error_description", "error_uri", "error", "expires_in", "id_token", "iss", "response", "session_state", "state", "token_type");
}
function authorizationHeaderValue(token, tokenType = "Bearer") {
    return `${tokenType} ${token}`;
}
function getSearchParams(input) {
    const parsed = url.parse(input);
    if (!parsed.search) return {};
    return querystring.parse(parsed.search.substring(1));
}
function verifyPresence(payload, jwt, prop) {
    if (payload[prop] === undefined) {
        throw new RPError({
            message: `missing required JWT property ${prop}`,
            jwt
        });
    }
}
function authorizationParams(params) {
    const authParams = {
        client_id: this.client_id,
        scope: "openid",
        response_type: resolveResponseType.call(this),
        redirect_uri: resolveRedirectUri.call(this),
        ...params
    };
    Object.entries(authParams).forEach(([key, value])=>{
        if (value === null || value === undefined) {
            delete authParams[key];
        } else if (key === "claims" && typeof value === "object") {
            authParams[key] = JSON.stringify(value);
        } else if (key === "resource" && Array.isArray(value)) {
            authParams[key] = value;
        } else if (typeof value !== "string") {
            authParams[key] = String(value);
        }
    });
    return authParams;
}
function getKeystore(jwks) {
    if (!isPlainObject(jwks) || !Array.isArray(jwks.keys) || jwks.keys.some((k)=>!isPlainObject(k) || !("kty" in k))) {
        throw new TypeError("jwks must be a JSON Web Key Set formatted object");
    }
    return KeyStore.fromJWKS(jwks, {
        onlyPrivate: true
    });
}
// if an OP doesnt support client_secret_basic but supports client_secret_post, use it instead
// this is in place to take care of most common pitfalls when first using discovered Issuers without
// the support for default values defined by Discovery 1.0
function checkBasicSupport(client, properties) {
    try {
        const supported = client.issuer.token_endpoint_auth_methods_supported;
        if (!supported.includes(properties.token_endpoint_auth_method)) {
            if (supported.includes("client_secret_post")) {
                properties.token_endpoint_auth_method = "client_secret_post";
            }
        }
    } catch (err) {}
}
function handleCommonMistakes(client, metadata, properties) {
    if (!metadata.token_endpoint_auth_method) {
        // if no explicit value was provided
        checkBasicSupport(client, properties);
    }
    // :fp: c'mon people... RTFM
    if (metadata.redirect_uri) {
        if (metadata.redirect_uris) {
            throw new TypeError("provide a redirect_uri or redirect_uris, not both");
        }
        properties.redirect_uris = [
            metadata.redirect_uri
        ];
        delete properties.redirect_uri;
    }
    if (metadata.response_type) {
        if (metadata.response_types) {
            throw new TypeError("provide a response_type or response_types, not both");
        }
        properties.response_types = [
            metadata.response_type
        ];
        delete properties.response_type;
    }
}
function getDefaultsForEndpoint(endpoint, issuer, properties) {
    if (!issuer[`${endpoint}_endpoint`]) return;
    const tokenEndpointAuthMethod = properties.token_endpoint_auth_method;
    const tokenEndpointAuthSigningAlg = properties.token_endpoint_auth_signing_alg;
    const eam = `${endpoint}_endpoint_auth_method`;
    const easa = `${endpoint}_endpoint_auth_signing_alg`;
    if (properties[eam] === undefined && properties[easa] === undefined) {
        if (tokenEndpointAuthMethod !== undefined) {
            properties[eam] = tokenEndpointAuthMethod;
        }
        if (tokenEndpointAuthSigningAlg !== undefined) {
            properties[easa] = tokenEndpointAuthSigningAlg;
        }
    }
}
class BaseClient {
    #metadata;
    #issuer;
    #aadIssValidation;
    #additionalAuthorizedParties;
    constructor(issuer, aadIssValidation, metadata = {}, jwks, options){
        this.#metadata = new Map();
        this.#issuer = issuer;
        this.#aadIssValidation = aadIssValidation;
        if (typeof metadata.client_id !== "string" || !metadata.client_id) {
            throw new TypeError("client_id is required");
        }
        const properties = {
            grant_types: [
                "authorization_code"
            ],
            id_token_signed_response_alg: "RS256",
            authorization_signed_response_alg: "RS256",
            response_types: [
                "code"
            ],
            token_endpoint_auth_method: "client_secret_basic",
            ...this.fapi() ? {
                grant_types: [
                    "authorization_code",
                    "implicit"
                ],
                id_token_signed_response_alg: "PS256",
                authorization_signed_response_alg: "PS256",
                response_types: [
                    "code id_token"
                ],
                tls_client_certificate_bound_access_tokens: true,
                token_endpoint_auth_method: undefined
            } : undefined,
            ...metadata
        };
        if (this.fapi()) {
            switch(properties.token_endpoint_auth_method){
                case "self_signed_tls_client_auth":
                case "tls_client_auth":
                    break;
                case "private_key_jwt":
                    if (!jwks) {
                        throw new TypeError("jwks is required");
                    }
                    break;
                case undefined:
                    throw new TypeError("token_endpoint_auth_method is required");
                default:
                    throw new TypeError("invalid or unsupported token_endpoint_auth_method");
            }
        }
        handleCommonMistakes(this, metadata, properties);
        assertSigningAlgValuesSupport("token", this.issuer, properties);
        [
            "introspection",
            "revocation"
        ].forEach((endpoint)=>{
            getDefaultsForEndpoint(endpoint, this.issuer, properties);
            assertSigningAlgValuesSupport(endpoint, this.issuer, properties);
        });
        Object.entries(properties).forEach(([key, value])=>{
            this.#metadata.set(key, value);
            if (!this[key]) {
                Object.defineProperty(this, key, {
                    get () {
                        return this.#metadata.get(key);
                    },
                    enumerable: true
                });
            }
        });
        if (jwks !== undefined) {
            const keystore = getKeystore.call(this, jwks);
            keystores.set(this, keystore);
        }
        if (options != null && options.additionalAuthorizedParties) {
            this.#additionalAuthorizedParties = clone(options.additionalAuthorizedParties);
        }
        this[CLOCK_TOLERANCE] = 0;
    }
    authorizationUrl(params = {}) {
        if (!isPlainObject(params)) {
            throw new TypeError("params must be a plain object");
        }
        assertIssuerConfiguration(this.issuer, "authorization_endpoint");
        const target = new URL(this.issuer.authorization_endpoint);
        for (const [name, value] of Object.entries(authorizationParams.call(this, params))){
            if (Array.isArray(value)) {
                target.searchParams.delete(name);
                for (const member of value){
                    target.searchParams.append(name, member);
                }
            } else {
                target.searchParams.set(name, value);
            }
        }
        // TODO: is the replace needed?
        return target.href.replace(/\+/g, "%20");
    }
    authorizationPost(params = {}) {
        if (!isPlainObject(params)) {
            throw new TypeError("params must be a plain object");
        }
        const inputs = authorizationParams.call(this, params);
        const formInputs = Object.keys(inputs).map((name)=>`<input type="hidden" name="${name}" value="${inputs[name]}"/>`).join("\n");
        return `<!DOCTYPE html>
<head>
<title>Requesting Authorization</title>
</head>
<body onload="javascript:document.forms[0].submit()">
<form method="post" action="${this.issuer.authorization_endpoint}">
  ${formInputs}
</form>
</body>
</html>`;
    }
    endSessionUrl(params = {}) {
        assertIssuerConfiguration(this.issuer, "end_session_endpoint");
        const { 0: postLogout, length } = this.post_logout_redirect_uris || [];
        const { post_logout_redirect_uri = length === 1 ? postLogout : undefined } = params;
        let id_token_hint;
        ({ id_token_hint, ...params } = params);
        if (id_token_hint instanceof TokenSet) {
            if (!id_token_hint.id_token) {
                throw new TypeError("id_token not present in TokenSet");
            }
            id_token_hint = id_token_hint.id_token;
        }
        const target = url.parse(this.issuer.end_session_endpoint);
        const query = defaults(getSearchParams(this.issuer.end_session_endpoint), params, {
            post_logout_redirect_uri,
            client_id: this.client_id
        }, {
            id_token_hint
        });
        Object.entries(query).forEach(([key, value])=>{
            if (value === null || value === undefined) {
                delete query[key];
            }
        });
        target.search = null;
        target.query = query;
        return url.format(target);
    }
    callbackParams(input) {
        const isIncomingMessage = input instanceof stdhttp.IncomingMessage || input && input.method && input.url;
        const isString = typeof input === "string";
        if (!isString && !isIncomingMessage) {
            throw new TypeError("#callbackParams only accepts string urls, http.IncomingMessage or a lookalike");
        }
        if (isIncomingMessage) {
            switch(input.method){
                case "GET":
                    return pickCb(getSearchParams(input.url));
                case "POST":
                    if (input.body === undefined) {
                        throw new TypeError("incoming message body missing, include a body parser prior to this method call");
                    }
                    switch(typeof input.body){
                        case "object":
                        case "string":
                            if (Buffer.isBuffer(input.body)) {
                                return pickCb(querystring.parse(input.body.toString("utf-8")));
                            }
                            if (typeof input.body === "string") {
                                return pickCb(querystring.parse(input.body));
                            }
                            return pickCb(input.body);
                        default:
                            throw new TypeError("invalid IncomingMessage body object");
                    }
                default:
                    throw new TypeError("invalid IncomingMessage method");
            }
        } else {
            return pickCb(getSearchParams(input));
        }
    }
    async callback(redirectUri, parameters, checks = {}, { exchangeBody, clientAssertionPayload, DPoP } = {}) {
        let params = pickCb(parameters);
        if (checks.jarm && !("response" in parameters)) {
            throw new RPError({
                message: "expected a JARM response",
                checks,
                params
            });
        } else if ("response" in parameters) {
            const decrypted = await this.decryptJARM(params.response);
            params = await this.validateJARM(decrypted);
        }
        if (this.default_max_age && !checks.max_age) {
            checks.max_age = this.default_max_age;
        }
        if (params.state && !checks.state) {
            throw new TypeError("checks.state argument is missing");
        }
        if (!params.state && checks.state) {
            throw new RPError({
                message: "state missing from the response",
                checks,
                params
            });
        }
        if (checks.state !== params.state) {
            throw new RPError({
                printf: [
                    "state mismatch, expected %s, got: %s",
                    checks.state,
                    params.state
                ],
                checks,
                params
            });
        }
        if ("iss" in params) {
            assertIssuerConfiguration(this.issuer, "issuer");
            if (params.iss !== this.issuer.issuer) {
                throw new RPError({
                    printf: [
                        "iss mismatch, expected %s, got: %s",
                        this.issuer.issuer,
                        params.iss
                    ],
                    params
                });
            }
        } else if (this.issuer.authorization_response_iss_parameter_supported && !("id_token" in params) && !("response" in parameters)) {
            throw new RPError({
                message: "iss missing from the response",
                params
            });
        }
        if (params.error) {
            throw new OPError(params);
        }
        const RESPONSE_TYPE_REQUIRED_PARAMS = {
            code: [
                "code"
            ],
            id_token: [
                "id_token"
            ],
            token: [
                "access_token",
                "token_type"
            ]
        };
        if (checks.response_type) {
            for (const type of checks.response_type.split(" ")){
                if (type === "none") {
                    if (params.code || params.id_token || params.access_token) {
                        throw new RPError({
                            message: 'unexpected params encountered for "none" response',
                            checks,
                            params
                        });
                    }
                } else {
                    for (const param of RESPONSE_TYPE_REQUIRED_PARAMS[type]){
                        if (!params[param]) {
                            throw new RPError({
                                message: `${param} missing from response`,
                                checks,
                                params
                            });
                        }
                    }
                }
            }
        }
        if (params.id_token) {
            const tokenset = new TokenSet(params);
            await this.decryptIdToken(tokenset);
            await this.validateIdToken(tokenset, checks.nonce, "authorization", checks.max_age, checks.state);
            if (!params.code) {
                return tokenset;
            }
        }
        if (params.code) {
            const tokenset = await this.grant({
                ...exchangeBody,
                grant_type: "authorization_code",
                code: params.code,
                redirect_uri: redirectUri,
                code_verifier: checks.code_verifier
            }, {
                clientAssertionPayload,
                DPoP
            });
            await this.decryptIdToken(tokenset);
            await this.validateIdToken(tokenset, checks.nonce, "token", checks.max_age);
            if (params.session_state) {
                tokenset.session_state = params.session_state;
            }
            return tokenset;
        }
        return new TokenSet(params);
    }
    async oauthCallback(redirectUri, parameters, checks = {}, { exchangeBody, clientAssertionPayload, DPoP } = {}) {
        let params = pickCb(parameters);
        if (checks.jarm && !("response" in parameters)) {
            throw new RPError({
                message: "expected a JARM response",
                checks,
                params
            });
        } else if ("response" in parameters) {
            const decrypted = await this.decryptJARM(params.response);
            params = await this.validateJARM(decrypted);
        }
        if (params.state && !checks.state) {
            throw new TypeError("checks.state argument is missing");
        }
        if (!params.state && checks.state) {
            throw new RPError({
                message: "state missing from the response",
                checks,
                params
            });
        }
        if (checks.state !== params.state) {
            throw new RPError({
                printf: [
                    "state mismatch, expected %s, got: %s",
                    checks.state,
                    params.state
                ],
                checks,
                params
            });
        }
        if ("iss" in params) {
            assertIssuerConfiguration(this.issuer, "issuer");
            if (params.iss !== this.issuer.issuer) {
                throw new RPError({
                    printf: [
                        "iss mismatch, expected %s, got: %s",
                        this.issuer.issuer,
                        params.iss
                    ],
                    params
                });
            }
        } else if (this.issuer.authorization_response_iss_parameter_supported && !("id_token" in params) && !("response" in parameters)) {
            throw new RPError({
                message: "iss missing from the response",
                params
            });
        }
        if (params.error) {
            throw new OPError(params);
        }
        if (typeof params.id_token === "string" && params.id_token.length) {
            throw new RPError({
                message: "id_token detected in the response, you must use client.callback() instead of client.oauthCallback()",
                params
            });
        }
        delete params.id_token;
        const RESPONSE_TYPE_REQUIRED_PARAMS = {
            code: [
                "code"
            ],
            token: [
                "access_token",
                "token_type"
            ]
        };
        if (checks.response_type) {
            for (const type of checks.response_type.split(" ")){
                if (type === "none") {
                    if (params.code || params.id_token || params.access_token) {
                        throw new RPError({
                            message: 'unexpected params encountered for "none" response',
                            checks,
                            params
                        });
                    }
                }
                if (RESPONSE_TYPE_REQUIRED_PARAMS[type]) {
                    for (const param of RESPONSE_TYPE_REQUIRED_PARAMS[type]){
                        if (!params[param]) {
                            throw new RPError({
                                message: `${param} missing from response`,
                                checks,
                                params
                            });
                        }
                    }
                }
            }
        }
        if (params.code) {
            const tokenset = await this.grant({
                ...exchangeBody,
                grant_type: "authorization_code",
                code: params.code,
                redirect_uri: redirectUri,
                code_verifier: checks.code_verifier
            }, {
                clientAssertionPayload,
                DPoP
            });
            if (typeof tokenset.id_token === "string" && tokenset.id_token.length) {
                throw new RPError({
                    message: "id_token detected in the response, you must use client.callback() instead of client.oauthCallback()",
                    params
                });
            }
            delete tokenset.id_token;
            return tokenset;
        }
        return new TokenSet(params);
    }
    async decryptIdToken(token) {
        if (!this.id_token_encrypted_response_alg) {
            return token;
        }
        let idToken = token;
        if (idToken instanceof TokenSet) {
            if (!idToken.id_token) {
                throw new TypeError("id_token not present in TokenSet");
            }
            idToken = idToken.id_token;
        }
        const expectedAlg = this.id_token_encrypted_response_alg;
        const expectedEnc = this.id_token_encrypted_response_enc;
        const result = await this.decryptJWE(idToken, expectedAlg, expectedEnc);
        if (token instanceof TokenSet) {
            token.id_token = result;
            return token;
        }
        return result;
    }
    async validateJWTUserinfo(body) {
        const expectedAlg = this.userinfo_signed_response_alg;
        return this.validateJWT(body, expectedAlg, []);
    }
    async decryptJARM(response) {
        if (!this.authorization_encrypted_response_alg) {
            return response;
        }
        const expectedAlg = this.authorization_encrypted_response_alg;
        const expectedEnc = this.authorization_encrypted_response_enc;
        return this.decryptJWE(response, expectedAlg, expectedEnc);
    }
    async decryptJWTUserinfo(body) {
        if (!this.userinfo_encrypted_response_alg) {
            return body;
        }
        const expectedAlg = this.userinfo_encrypted_response_alg;
        const expectedEnc = this.userinfo_encrypted_response_enc;
        return this.decryptJWE(body, expectedAlg, expectedEnc);
    }
    async decryptJWE(jwe, expectedAlg, expectedEnc = "A128CBC-HS256") {
        const header = JSON.parse(base64url.decode(jwe.split(".")[0]));
        if (header.alg !== expectedAlg) {
            throw new RPError({
                printf: [
                    "unexpected JWE alg received, expected %s, got: %s",
                    expectedAlg,
                    header.alg
                ],
                jwt: jwe
            });
        }
        if (header.enc !== expectedEnc) {
            throw new RPError({
                printf: [
                    "unexpected JWE enc received, expected %s, got: %s",
                    expectedEnc,
                    header.enc
                ],
                jwt: jwe
            });
        }
        const getPlaintext = (result)=>new TextDecoder().decode(result.plaintext);
        let plaintext;
        if (expectedAlg.match(/^(?:RSA|ECDH)/)) {
            const keystore = await keystores.get(this);
            const protectedHeader = jose.decodeProtectedHeader(jwe);
            for (const key of keystore.all({
                ...protectedHeader,
                use: "enc"
            })){
                plaintext = await jose.compactDecrypt(jwe, await key.keyObject(protectedHeader.alg)).then(getPlaintext, ()=>{});
                if (plaintext) break;
            }
        } else {
            plaintext = await jose.compactDecrypt(jwe, this.secretForAlg(expectedAlg === "dir" ? expectedEnc : expectedAlg)).then(getPlaintext, ()=>{});
        }
        if (!plaintext) {
            throw new RPError({
                message: "failed to decrypt JWE",
                jwt: jwe
            });
        }
        return plaintext;
    }
    async validateIdToken(tokenSet, nonce, returnedBy, maxAge, state) {
        let idToken = tokenSet;
        const expectedAlg = this.id_token_signed_response_alg;
        const isTokenSet = idToken instanceof TokenSet;
        if (isTokenSet) {
            if (!idToken.id_token) {
                throw new TypeError("id_token not present in TokenSet");
            }
            idToken = idToken.id_token;
        }
        idToken = String(idToken);
        const timestamp = now();
        const { protected: header, payload, key } = await this.validateJWT(idToken, expectedAlg);
        if (typeof maxAge === "number" || maxAge !== skipMaxAgeCheck && this.require_auth_time) {
            if (!payload.auth_time) {
                throw new RPError({
                    message: "missing required JWT property auth_time",
                    jwt: idToken
                });
            }
            if (typeof payload.auth_time !== "number") {
                throw new RPError({
                    message: "JWT auth_time claim must be a JSON numeric value",
                    jwt: idToken
                });
            }
        }
        if (typeof maxAge === "number" && payload.auth_time + maxAge < timestamp - this[CLOCK_TOLERANCE]) {
            throw new RPError({
                printf: [
                    "too much time has elapsed since the last End-User authentication, max_age %i, auth_time: %i, now %i",
                    maxAge,
                    payload.auth_time,
                    timestamp - this[CLOCK_TOLERANCE]
                ],
                now: timestamp,
                tolerance: this[CLOCK_TOLERANCE],
                auth_time: payload.auth_time,
                jwt: idToken
            });
        }
        if (nonce !== skipNonceCheck && (payload.nonce || nonce !== undefined) && payload.nonce !== nonce) {
            throw new RPError({
                printf: [
                    "nonce mismatch, expected %s, got: %s",
                    nonce,
                    payload.nonce
                ],
                jwt: idToken
            });
        }
        if (returnedBy === "authorization") {
            if (!payload.at_hash && tokenSet.access_token) {
                throw new RPError({
                    message: "missing required property at_hash",
                    jwt: idToken
                });
            }
            if (!payload.c_hash && tokenSet.code) {
                throw new RPError({
                    message: "missing required property c_hash",
                    jwt: idToken
                });
            }
            if (this.fapi()) {
                if (!payload.s_hash && (tokenSet.state || state)) {
                    throw new RPError({
                        message: "missing required property s_hash",
                        jwt: idToken
                    });
                }
            }
            if (payload.s_hash) {
                if (!state) {
                    throw new TypeError('cannot verify s_hash, "checks.state" property not provided');
                }
                try {
                    tokenHash.validate({
                        claim: "s_hash",
                        source: "state"
                    }, payload.s_hash, state, header.alg, key.jwk && key.jwk.crv);
                } catch (err) {
                    throw new RPError({
                        message: err.message,
                        jwt: idToken
                    });
                }
            }
        }
        if (this.fapi() && payload.iat < timestamp - 3600) {
            throw new RPError({
                printf: [
                    "JWT issued too far in the past, now %i, iat %i",
                    timestamp,
                    payload.iat
                ],
                now: timestamp,
                tolerance: this[CLOCK_TOLERANCE],
                iat: payload.iat,
                jwt: idToken
            });
        }
        if (tokenSet.access_token && payload.at_hash !== undefined) {
            try {
                tokenHash.validate({
                    claim: "at_hash",
                    source: "access_token"
                }, payload.at_hash, tokenSet.access_token, header.alg, key.jwk && key.jwk.crv);
            } catch (err) {
                throw new RPError({
                    message: err.message,
                    jwt: idToken
                });
            }
        }
        if (tokenSet.code && payload.c_hash !== undefined) {
            try {
                tokenHash.validate({
                    claim: "c_hash",
                    source: "code"
                }, payload.c_hash, tokenSet.code, header.alg, key.jwk && key.jwk.crv);
            } catch (err) {
                throw new RPError({
                    message: err.message,
                    jwt: idToken
                });
            }
        }
        return tokenSet;
    }
    async validateJWT(jwt, expectedAlg, required = [
        "iss",
        "sub",
        "aud",
        "exp",
        "iat"
    ]) {
        const isSelfIssued = this.issuer.issuer === "https://self-issued.me";
        const timestamp = now();
        let header;
        let payload;
        try {
            ({ header, payload } = decodeJWT(jwt, {
                complete: true
            }));
        } catch (err) {
            throw new RPError({
                printf: [
                    "failed to decode JWT (%s: %s)",
                    err.name,
                    err.message
                ],
                jwt
            });
        }
        if (header.alg !== expectedAlg) {
            throw new RPError({
                printf: [
                    "unexpected JWT alg received, expected %s, got: %s",
                    expectedAlg,
                    header.alg
                ],
                jwt
            });
        }
        if (isSelfIssued) {
            required = [
                ...required,
                "sub_jwk"
            ];
        }
        required.forEach(verifyPresence.bind(undefined, payload, jwt));
        if (payload.iss !== undefined) {
            let expectedIss = this.issuer.issuer;
            if (this.#aadIssValidation) {
                expectedIss = this.issuer.issuer.replace("{tenantid}", payload.tid);
            }
            if (payload.iss !== expectedIss) {
                throw new RPError({
                    printf: [
                        "unexpected iss value, expected %s, got: %s",
                        expectedIss,
                        payload.iss
                    ],
                    jwt
                });
            }
        }
        if (payload.iat !== undefined) {
            if (typeof payload.iat !== "number") {
                throw new RPError({
                    message: "JWT iat claim must be a JSON numeric value",
                    jwt
                });
            }
        }
        if (payload.nbf !== undefined) {
            if (typeof payload.nbf !== "number") {
                throw new RPError({
                    message: "JWT nbf claim must be a JSON numeric value",
                    jwt
                });
            }
            if (payload.nbf > timestamp + this[CLOCK_TOLERANCE]) {
                throw new RPError({
                    printf: [
                        "JWT not active yet, now %i, nbf %i",
                        timestamp + this[CLOCK_TOLERANCE],
                        payload.nbf
                    ],
                    now: timestamp,
                    tolerance: this[CLOCK_TOLERANCE],
                    nbf: payload.nbf,
                    jwt
                });
            }
        }
        if (payload.exp !== undefined) {
            if (typeof payload.exp !== "number") {
                throw new RPError({
                    message: "JWT exp claim must be a JSON numeric value",
                    jwt
                });
            }
            if (timestamp - this[CLOCK_TOLERANCE] >= payload.exp) {
                throw new RPError({
                    printf: [
                        "JWT expired, now %i, exp %i",
                        timestamp - this[CLOCK_TOLERANCE],
                        payload.exp
                    ],
                    now: timestamp,
                    tolerance: this[CLOCK_TOLERANCE],
                    exp: payload.exp,
                    jwt
                });
            }
        }
        if (payload.aud !== undefined) {
            if (Array.isArray(payload.aud)) {
                if (payload.aud.length > 1 && !payload.azp) {
                    throw new RPError({
                        message: "missing required JWT property azp",
                        jwt
                    });
                }
                if (!payload.aud.includes(this.client_id)) {
                    throw new RPError({
                        printf: [
                            "aud is missing the client_id, expected %s to be included in %j",
                            this.client_id,
                            payload.aud
                        ],
                        jwt
                    });
                }
            } else if (payload.aud !== this.client_id) {
                throw new RPError({
                    printf: [
                        "aud mismatch, expected %s, got: %s",
                        this.client_id,
                        payload.aud
                    ],
                    jwt
                });
            }
        }
        if (payload.azp !== undefined) {
            let additionalAuthorizedParties = this.#additionalAuthorizedParties;
            if (typeof additionalAuthorizedParties === "string") {
                additionalAuthorizedParties = [
                    this.client_id,
                    additionalAuthorizedParties
                ];
            } else if (Array.isArray(additionalAuthorizedParties)) {
                additionalAuthorizedParties = [
                    this.client_id,
                    ...additionalAuthorizedParties
                ];
            } else {
                additionalAuthorizedParties = [
                    this.client_id
                ];
            }
            if (!additionalAuthorizedParties.includes(payload.azp)) {
                throw new RPError({
                    printf: [
                        "azp mismatch, got: %s",
                        payload.azp
                    ],
                    jwt
                });
            }
        }
        let keys;
        if (isSelfIssued) {
            try {
                assert(isPlainObject(payload.sub_jwk));
                const key = await jose.importJWK(payload.sub_jwk, header.alg);
                assert.equal(key.type, "public");
                keys = [
                    {
                        keyObject () {
                            return key;
                        }
                    }
                ];
            } catch (err) {
                throw new RPError({
                    message: "failed to use sub_jwk claim as an asymmetric JSON Web Key",
                    jwt
                });
            }
            if (await jose.calculateJwkThumbprint(payload.sub_jwk) !== payload.sub) {
                throw new RPError({
                    message: "failed to match the subject with sub_jwk",
                    jwt
                });
            }
        } else if (header.alg.startsWith("HS")) {
            keys = [
                this.secretForAlg(header.alg)
            ];
        } else if (header.alg !== "none") {
            keys = await queryKeyStore.call(this.issuer, {
                ...header,
                use: "sig"
            });
        }
        if (!keys && header.alg === "none") {
            return {
                protected: header,
                payload
            };
        }
        for (const key of keys){
            const verified = await jose.compactVerify(jwt, key instanceof Uint8Array ? key : await key.keyObject(header.alg)).catch(()=>{});
            if (verified) {
                return {
                    payload,
                    protected: verified.protectedHeader,
                    key
                };
            }
        }
        throw new RPError({
            message: "failed to validate JWT signature",
            jwt
        });
    }
    async refresh(refreshToken, { exchangeBody, clientAssertionPayload, DPoP } = {}) {
        let token = refreshToken;
        if (token instanceof TokenSet) {
            if (!token.refresh_token) {
                throw new TypeError("refresh_token not present in TokenSet");
            }
            token = token.refresh_token;
        }
        const tokenset = await this.grant({
            ...exchangeBody,
            grant_type: "refresh_token",
            refresh_token: String(token)
        }, {
            clientAssertionPayload,
            DPoP
        });
        if (tokenset.id_token) {
            await this.decryptIdToken(tokenset);
            await this.validateIdToken(tokenset, skipNonceCheck, "token", skipMaxAgeCheck);
            if (refreshToken instanceof TokenSet && refreshToken.id_token) {
                const expectedSub = refreshToken.claims().sub;
                const actualSub = tokenset.claims().sub;
                if (actualSub !== expectedSub) {
                    throw new RPError({
                        printf: [
                            "sub mismatch, expected %s, got: %s",
                            expectedSub,
                            actualSub
                        ],
                        jwt: tokenset.id_token
                    });
                }
            }
        }
        return tokenset;
    }
    async requestResource(resourceUrl, accessToken, { method, headers, body, DPoP, tokenType = DPoP ? "DPoP" : accessToken instanceof TokenSet ? accessToken.token_type : "Bearer" } = {}, retry) {
        if (accessToken instanceof TokenSet) {
            if (!accessToken.access_token) {
                throw new TypeError("access_token not present in TokenSet");
            }
            accessToken = accessToken.access_token;
        }
        if (!accessToken) {
            throw new TypeError("no access token provided");
        } else if (typeof accessToken !== "string") {
            throw new TypeError("invalid access token provided");
        }
        const requestOpts = {
            headers: {
                Authorization: authorizationHeaderValue(accessToken, tokenType),
                ...headers
            },
            body
        };
        const mTLS = !!this.tls_client_certificate_bound_access_tokens;
        const response = await request.call(this, {
            ...requestOpts,
            responseType: "buffer",
            method,
            url: resourceUrl
        }, {
            accessToken,
            mTLS,
            DPoP
        });
        const wwwAuthenticate = response.headers["www-authenticate"];
        if (retry !== retryAttempt && wwwAuthenticate && wwwAuthenticate.toLowerCase().startsWith("dpop ") && parseWwwAuthenticate(wwwAuthenticate).error === "use_dpop_nonce") {
            return this.requestResource(resourceUrl, accessToken, {
                method,
                headers,
                body,
                DPoP,
                tokenType
            });
        }
        return response;
    }
    async userinfo(accessToken, { method = "GET", via = "header", tokenType, params, DPoP } = {}) {
        assertIssuerConfiguration(this.issuer, "userinfo_endpoint");
        const options = {
            tokenType,
            method: String(method).toUpperCase(),
            DPoP
        };
        if (options.method !== "GET" && options.method !== "POST") {
            throw new TypeError("#userinfo() method can only be POST or a GET");
        }
        if (via === "body" && options.method !== "POST") {
            throw new TypeError("can only send body on POST");
        }
        const jwt = !!(this.userinfo_signed_response_alg || this.userinfo_encrypted_response_alg);
        if (jwt) {
            options.headers = {
                Accept: "application/jwt"
            };
        } else {
            options.headers = {
                Accept: "application/json"
            };
        }
        const mTLS = !!this.tls_client_certificate_bound_access_tokens;
        let targetUrl;
        if (mTLS && this.issuer.mtls_endpoint_aliases) {
            targetUrl = this.issuer.mtls_endpoint_aliases.userinfo_endpoint;
        }
        targetUrl = new URL(targetUrl || this.issuer.userinfo_endpoint);
        if (via === "body") {
            options.headers.Authorization = undefined;
            options.headers["Content-Type"] = "application/x-www-form-urlencoded";
            options.body = new URLSearchParams();
            options.body.append("access_token", accessToken instanceof TokenSet ? accessToken.access_token : accessToken);
        }
        // handle additional parameters, GET via querystring, POST via urlencoded body
        if (params) {
            if (options.method === "GET") {
                Object.entries(params).forEach(([key, value])=>{
                    targetUrl.searchParams.append(key, value);
                });
            } else if (options.body) {
                // POST && via body
                Object.entries(params).forEach(([key, value])=>{
                    options.body.append(key, value);
                });
            } else {
                // POST && via header
                options.body = new URLSearchParams();
                options.headers["Content-Type"] = "application/x-www-form-urlencoded";
                Object.entries(params).forEach(([key, value])=>{
                    options.body.append(key, value);
                });
            }
        }
        if (options.body) {
            options.body = options.body.toString();
        }
        const response = await this.requestResource(targetUrl, accessToken, options);
        let parsed = processResponse(response, {
            bearer: true
        });
        if (jwt) {
            if (!/^application\/jwt/.test(response.headers["content-type"])) {
                throw new RPError({
                    message: "expected application/jwt response from the userinfo_endpoint",
                    response
                });
            }
            const body = response.body.toString();
            const userinfo = await this.decryptJWTUserinfo(body);
            if (!this.userinfo_signed_response_alg) {
                try {
                    parsed = JSON.parse(userinfo);
                    assert(isPlainObject(parsed));
                } catch (err) {
                    throw new RPError({
                        message: "failed to parse userinfo JWE payload as JSON",
                        jwt: userinfo
                    });
                }
            } else {
                ({ payload: parsed } = await this.validateJWTUserinfo(userinfo));
            }
        } else {
            try {
                parsed = JSON.parse(response.body);
            } catch (err) {
                Object.defineProperty(err, "response", {
                    value: response
                });
                throw err;
            }
        }
        if (accessToken instanceof TokenSet && accessToken.id_token) {
            const expectedSub = accessToken.claims().sub;
            if (parsed.sub !== expectedSub) {
                throw new RPError({
                    printf: [
                        "userinfo sub mismatch, expected %s, got: %s",
                        expectedSub,
                        parsed.sub
                    ],
                    body: parsed,
                    jwt: accessToken.id_token
                });
            }
        }
        return parsed;
    }
    encryptionSecret(len) {
        const hash = len <= 256 ? "sha256" : len <= 384 ? "sha384" : len <= 512 ? "sha512" : false;
        if (!hash) {
            throw new Error("unsupported symmetric encryption key derivation");
        }
        return crypto.createHash(hash).update(this.client_secret).digest().slice(0, len / 8);
    }
    secretForAlg(alg) {
        if (!this.client_secret) {
            throw new TypeError("client_secret is required");
        }
        if (/^A(\d{3})(?:GCM)?KW$/.test(alg)) {
            return this.encryptionSecret(parseInt(RegExp.$1, 10));
        }
        if (/^A(\d{3})(?:GCM|CBC-HS(\d{3}))$/.test(alg)) {
            return this.encryptionSecret(parseInt(RegExp.$2 || RegExp.$1, 10));
        }
        return new TextEncoder().encode(this.client_secret);
    }
    async grant(body, { clientAssertionPayload, DPoP } = {}, retry) {
        assertIssuerConfiguration(this.issuer, "token_endpoint");
        const response = await authenticatedPost.call(this, "token", {
            form: body,
            responseType: "json"
        }, {
            clientAssertionPayload,
            DPoP
        });
        let responseBody;
        try {
            responseBody = processResponse(response);
        } catch (err) {
            if (retry !== retryAttempt && err instanceof OPError && err.error === "use_dpop_nonce") {
                return this.grant(body, {
                    clientAssertionPayload,
                    DPoP
                }, retryAttempt);
            }
            throw err;
        }
        return new TokenSet(responseBody);
    }
    async deviceAuthorization(params = {}, { exchangeBody, clientAssertionPayload, DPoP } = {}) {
        assertIssuerConfiguration(this.issuer, "device_authorization_endpoint");
        assertIssuerConfiguration(this.issuer, "token_endpoint");
        const body = authorizationParams.call(this, {
            client_id: this.client_id,
            redirect_uri: null,
            response_type: null,
            ...params
        });
        const response = await authenticatedPost.call(this, "device_authorization", {
            responseType: "json",
            form: body
        }, {
            clientAssertionPayload,
            endpointAuthMethod: "token"
        });
        const responseBody = processResponse(response);
        return new DeviceFlowHandle({
            client: this,
            exchangeBody,
            clientAssertionPayload,
            response: responseBody,
            maxAge: params.max_age,
            DPoP
        });
    }
    async revoke(token, hint, { revokeBody, clientAssertionPayload } = {}) {
        assertIssuerConfiguration(this.issuer, "revocation_endpoint");
        if (hint !== undefined && typeof hint !== "string") {
            throw new TypeError("hint must be a string");
        }
        const form = {
            ...revokeBody,
            token
        };
        if (hint) {
            form.token_type_hint = hint;
        }
        const response = await authenticatedPost.call(this, "revocation", {
            form
        }, {
            clientAssertionPayload
        });
        processResponse(response, {
            body: false
        });
    }
    async introspect(token, hint, { introspectBody, clientAssertionPayload } = {}) {
        assertIssuerConfiguration(this.issuer, "introspection_endpoint");
        if (hint !== undefined && typeof hint !== "string") {
            throw new TypeError("hint must be a string");
        }
        const form = {
            ...introspectBody,
            token
        };
        if (hint) {
            form.token_type_hint = hint;
        }
        const response = await authenticatedPost.call(this, "introspection", {
            form,
            responseType: "json"
        }, {
            clientAssertionPayload
        });
        const responseBody = processResponse(response);
        return responseBody;
    }
    static async register(metadata, options = {}) {
        const { initialAccessToken, jwks, ...clientOptions } = options;
        assertIssuerConfiguration(this.issuer, "registration_endpoint");
        if (jwks !== undefined && !(metadata.jwks || metadata.jwks_uri)) {
            const keystore = await getKeystore.call(this, jwks);
            metadata.jwks = keystore.toJWKS();
        }
        const response = await request.call(this, {
            headers: {
                Accept: "application/json",
                ...initialAccessToken ? {
                    Authorization: authorizationHeaderValue(initialAccessToken)
                } : undefined
            },
            responseType: "json",
            json: metadata,
            url: this.issuer.registration_endpoint,
            method: "POST"
        });
        const responseBody = processResponse(response, {
            statusCode: 201,
            bearer: true
        });
        return new this(responseBody, jwks, clientOptions);
    }
    get metadata() {
        return clone(Object.fromEntries(this.#metadata.entries()));
    }
    static async fromUri(registrationClientUri, registrationAccessToken, jwks, clientOptions) {
        const response = await request.call(this, {
            method: "GET",
            url: registrationClientUri,
            responseType: "json",
            headers: {
                Authorization: authorizationHeaderValue(registrationAccessToken),
                Accept: "application/json"
            }
        });
        const responseBody = processResponse(response, {
            bearer: true
        });
        return new this(responseBody, jwks, clientOptions);
    }
    async requestObject(requestObject = {}, { sign: signingAlgorithm = this.request_object_signing_alg || "none", encrypt: { alg: eKeyManagement = this.request_object_encryption_alg, enc: eContentEncryption = this.request_object_encryption_enc || "A128CBC-HS256" } = {} } = {}) {
        if (!isPlainObject(requestObject)) {
            throw new TypeError("requestObject must be a plain object");
        }
        let signed;
        let key;
        const unix = now();
        const header = {
            alg: signingAlgorithm,
            typ: "oauth-authz-req+jwt"
        };
        const payload = JSON.stringify(defaults({}, requestObject, {
            iss: this.client_id,
            aud: this.issuer.issuer,
            client_id: this.client_id,
            jti: random(),
            iat: unix,
            exp: unix + 300,
            ...this.fapi() ? {
                nbf: unix
            } : undefined
        }));
        if (signingAlgorithm === "none") {
            signed = [
                base64url.encode(JSON.stringify(header)),
                base64url.encode(payload),
                ""
            ].join(".");
        } else {
            const symmetric = signingAlgorithm.startsWith("HS");
            if (symmetric) {
                key = this.secretForAlg(signingAlgorithm);
            } else {
                const keystore = await keystores.get(this);
                if (!keystore) {
                    throw new TypeError(`no keystore present for client, cannot sign using alg ${signingAlgorithm}`);
                }
                key = keystore.get({
                    alg: signingAlgorithm,
                    use: "sig"
                });
                if (!key) {
                    throw new TypeError(`no key to sign with found for alg ${signingAlgorithm}`);
                }
            }
            signed = await new jose.CompactSign(new TextEncoder().encode(payload)).setProtectedHeader({
                ...header,
                kid: symmetric ? undefined : key.jwk.kid
            }).sign(symmetric ? key : await key.keyObject(signingAlgorithm));
        }
        if (!eKeyManagement) {
            return signed;
        }
        const fields = {
            alg: eKeyManagement,
            enc: eContentEncryption,
            cty: "oauth-authz-req+jwt"
        };
        if (fields.alg.match(/^(RSA|ECDH)/)) {
            [key] = await queryKeyStore.call(this.issuer, {
                alg: fields.alg,
                use: "enc"
            }, {
                allowMulti: true
            });
        } else {
            key = this.secretForAlg(fields.alg === "dir" ? fields.enc : fields.alg);
        }
        return new jose.CompactEncrypt(new TextEncoder().encode(signed)).setProtectedHeader({
            ...fields,
            kid: key instanceof Uint8Array ? undefined : key.jwk.kid
        }).encrypt(key instanceof Uint8Array ? key : await key.keyObject(fields.alg));
    }
    async pushedAuthorizationRequest(params = {}, { clientAssertionPayload } = {}) {
        assertIssuerConfiguration(this.issuer, "pushed_authorization_request_endpoint");
        const body = {
            ..."request" in params ? params : authorizationParams.call(this, params),
            client_id: this.client_id
        };
        const response = await authenticatedPost.call(this, "pushed_authorization_request", {
            responseType: "json",
            form: body
        }, {
            clientAssertionPayload,
            endpointAuthMethod: "token"
        });
        const responseBody = processResponse(response, {
            statusCode: 201
        });
        if (!("expires_in" in responseBody)) {
            throw new RPError({
                message: "expected expires_in in Pushed Authorization Successful Response",
                response
            });
        }
        if (typeof responseBody.expires_in !== "number") {
            throw new RPError({
                message: "invalid expires_in value in Pushed Authorization Successful Response",
                response
            });
        }
        if (!("request_uri" in responseBody)) {
            throw new RPError({
                message: "expected request_uri in Pushed Authorization Successful Response",
                response
            });
        }
        if (typeof responseBody.request_uri !== "string") {
            throw new RPError({
                message: "invalid request_uri value in Pushed Authorization Successful Response",
                response
            });
        }
        return responseBody;
    }
    get issuer() {
        return this.#issuer;
    }
    /* istanbul ignore next */ [inspect.custom]() {
        return `${this.constructor.name} ${inspect(this.metadata, {
            depth: Infinity,
            colors: process.stdout.isTTY,
            compact: false,
            sorted: true
        })}`;
    }
    fapi() {
        return this.constructor.name === "FAPI1Client";
    }
    async validateJARM(response) {
        const expectedAlg = this.authorization_signed_response_alg;
        const { payload } = await this.validateJWT(response, expectedAlg, [
            "iss",
            "exp",
            "aud"
        ]);
        return pickCb(payload);
    }
    /**
   * @name dpopProof
   * @api private
   */ async dpopProof(payload, privateKeyInput, accessToken) {
        if (!isPlainObject(payload)) {
            throw new TypeError("payload must be a plain object");
        }
        let privateKey;
        if (isKeyObject(privateKeyInput)) {
            privateKey = privateKeyInput;
        } else if (privateKeyInput[Symbol.toStringTag] === "CryptoKey") {
            privateKey = privateKeyInput;
        } else if (jose.cryptoRuntime === "node:crypto") {
            privateKey = crypto.createPrivateKey(privateKeyInput);
        } else {
            throw new TypeError("unrecognized crypto runtime");
        }
        if (privateKey.type !== "private") {
            throw new TypeError('"DPoP" option must be a private key');
        }
        let alg = determineDPoPAlgorithm.call(this, privateKey, privateKeyInput);
        if (!alg) {
            throw new TypeError("could not determine DPoP JWS Algorithm");
        }
        return new jose.SignJWT({
            ath: accessToken ? base64url.encode(crypto.createHash("sha256").update(accessToken).digest()) : undefined,
            ...payload
        }).setProtectedHeader({
            alg,
            typ: "dpop+jwt",
            jwk: await getJwk(privateKey, privateKeyInput)
        }).setIssuedAt().setJti(random()).sign(privateKey);
    }
}
function determineDPoPAlgorithmFromCryptoKey(cryptoKey) {
    switch(cryptoKey.algorithm.name){
        case "Ed25519":
        case "Ed448":
            return "EdDSA";
        case "ECDSA":
            {
                switch(cryptoKey.algorithm.namedCurve){
                    case "P-256":
                        return "ES256";
                    case "P-384":
                        return "ES384";
                    case "P-521":
                        return "ES512";
                    default:
                        break;
                }
                break;
            }
        case "RSASSA-PKCS1-v1_5":
            return `RS${cryptoKey.algorithm.hash.name.slice(4)}`;
        case "RSA-PSS":
            return `PS${cryptoKey.algorithm.hash.name.slice(4)}`;
        default:
            throw new TypeError("unsupported DPoP private key");
    }
}
let determineDPoPAlgorithm;
if (jose.cryptoRuntime === "node:crypto") {
    determineDPoPAlgorithm = function(privateKey, privateKeyInput) {
        if (privateKeyInput[Symbol.toStringTag] === "CryptoKey") {
            return determineDPoPAlgorithmFromCryptoKey(privateKey);
        }
        switch(privateKey.asymmetricKeyType){
            case "ed25519":
            case "ed448":
                return "EdDSA";
            case "ec":
                return determineEcAlgorithm(privateKey, privateKeyInput);
            case "rsa":
            case rsaPssParams && "rsa-pss":
                return determineRsaAlgorithm(privateKey, privateKeyInput, this.issuer.dpop_signing_alg_values_supported);
            default:
                throw new TypeError("unsupported DPoP private key");
        }
    };
    const RSPS = /^(?:RS|PS)(?:256|384|512)$/;
    function determineRsaAlgorithm(privateKey, privateKeyInput, valuesSupported) {
        if (typeof privateKeyInput === "object" && privateKeyInput.format === "jwk" && privateKeyInput.key && privateKeyInput.key.alg) {
            return privateKeyInput.key.alg;
        }
        if (Array.isArray(valuesSupported)) {
            let candidates = valuesSupported.filter(RegExp.prototype.test.bind(RSPS));
            if (privateKey.asymmetricKeyType === "rsa-pss") {
                candidates = candidates.filter((value)=>value.startsWith("PS"));
            }
            return [
                "PS256",
                "PS384",
                "PS512",
                "RS256",
                "RS384",
                "RS384"
            ].find((preferred)=>candidates.includes(preferred));
        }
        return "PS256";
    }
    const p256 = Buffer.from([
        42,
        134,
        72,
        206,
        61,
        3,
        1,
        7
    ]);
    const p384 = Buffer.from([
        43,
        129,
        4,
        0,
        34
    ]);
    const p521 = Buffer.from([
        43,
        129,
        4,
        0,
        35
    ]);
    const secp256k1 = Buffer.from([
        43,
        129,
        4,
        0,
        10
    ]);
    function determineEcAlgorithm(privateKey, privateKeyInput) {
        // If input was a JWK
        switch(typeof privateKeyInput === "object" && typeof privateKeyInput.key === "object" && privateKeyInput.key.crv){
            case "P-256":
                return "ES256";
            case "secp256k1":
                return "ES256K";
            case "P-384":
                return "ES384";
            case "P-512":
                return "ES512";
            default:
                break;
        }
        const buf = privateKey.export({
            format: "der",
            type: "pkcs8"
        });
        const i = buf[1] < 128 ? 17 : 18;
        const len = buf[i];
        const curveOid = buf.slice(i + 1, i + 1 + len);
        if (curveOid.equals(p256)) {
            return "ES256";
        }
        if (curveOid.equals(p384)) {
            return "ES384";
        }
        if (curveOid.equals(p521)) {
            return "ES512";
        }
        if (curveOid.equals(secp256k1)) {
            return "ES256K";
        }
        throw new TypeError("unsupported DPoP private key curve");
    }
} else {
    determineDPoPAlgorithm = determineDPoPAlgorithmFromCryptoKey;
}
const jwkCache = new WeakMap();
async function getJwk(keyObject, privateKeyInput) {
    if (jose.cryptoRuntime === "node:crypto" && typeof privateKeyInput === "object" && typeof privateKeyInput.key === "object" && privateKeyInput.format === "jwk") {
        return pick(privateKeyInput.key, "kty", "crv", "x", "y", "e", "n");
    }
    if (jwkCache.has(privateKeyInput)) {
        return jwkCache.get(privateKeyInput);
    }
    const jwk = pick(await jose.exportJWK(keyObject), "kty", "crv", "x", "y", "e", "n");
    if (isKeyObject(privateKeyInput) || jose.cryptoRuntime === "WebCryptoAPI") {
        jwkCache.set(privateKeyInput, jwk);
    }
    return jwk;
}
module.exports = (issuer, aadIssValidation = false)=>class Client extends BaseClient {
        constructor(...args){
            super(issuer, aadIssValidation, ...args);
        }
        static get issuer() {
            return issuer;
        }
    };
module.exports.BaseClient = BaseClient;


/***/ }),

/***/ 93954:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { inspect } = __webpack_require__(73837);
const { RPError, OPError } = __webpack_require__(54180);
const now = __webpack_require__(2218);
class DeviceFlowHandle {
    #aborted;
    #client;
    #clientAssertionPayload;
    #DPoP;
    #exchangeBody;
    #expires_at;
    #interval;
    #maxAge;
    #response;
    constructor({ client, exchangeBody, clientAssertionPayload, response, maxAge, DPoP }){
        [
            "verification_uri",
            "user_code",
            "device_code"
        ].forEach((prop)=>{
            if (typeof response[prop] !== "string" || !response[prop]) {
                throw new RPError(`expected ${prop} string to be returned by Device Authorization Response, got %j`, response[prop]);
            }
        });
        if (!Number.isSafeInteger(response.expires_in)) {
            throw new RPError("expected expires_in number to be returned by Device Authorization Response, got %j", response.expires_in);
        }
        this.#expires_at = now() + response.expires_in;
        this.#client = client;
        this.#DPoP = DPoP;
        this.#maxAge = maxAge;
        this.#exchangeBody = exchangeBody;
        this.#clientAssertionPayload = clientAssertionPayload;
        this.#response = response;
        this.#interval = response.interval * 1000 || 5000;
    }
    abort() {
        this.#aborted = true;
    }
    async poll({ signal } = {}) {
        if (signal && signal.aborted || this.#aborted) {
            throw new RPError("polling aborted");
        }
        if (this.expired()) {
            throw new RPError("the device code %j has expired and the device authorization session has concluded", this.device_code);
        }
        await new Promise((resolve)=>setTimeout(resolve, this.#interval));
        let tokenset;
        try {
            tokenset = await this.#client.grant({
                ...this.#exchangeBody,
                grant_type: "urn:ietf:params:oauth:grant-type:device_code",
                device_code: this.device_code
            }, {
                clientAssertionPayload: this.#clientAssertionPayload,
                DPoP: this.#DPoP
            });
        } catch (err) {
            switch(err instanceof OPError && err.error){
                case "slow_down":
                    this.#interval += 5000;
                case "authorization_pending":
                    return this.poll({
                        signal
                    });
                default:
                    throw err;
            }
        }
        if ("id_token" in tokenset) {
            await this.#client.decryptIdToken(tokenset);
            await this.#client.validateIdToken(tokenset, undefined, "token", this.#maxAge);
        }
        return tokenset;
    }
    get device_code() {
        return this.#response.device_code;
    }
    get user_code() {
        return this.#response.user_code;
    }
    get verification_uri() {
        return this.#response.verification_uri;
    }
    get verification_uri_complete() {
        return this.#response.verification_uri_complete;
    }
    get expires_in() {
        return Math.max.apply(null, [
            this.#expires_at - now(),
            0
        ]);
    }
    expired() {
        return this.expires_in === 0;
    }
    /* istanbul ignore next */ [inspect.custom]() {
        return `${this.constructor.name} ${inspect(this.#response, {
            depth: Infinity,
            colors: process.stdout.isTTY,
            compact: false,
            sorted: true
        })}`;
    }
}
module.exports = DeviceFlowHandle;


/***/ }),

/***/ 54180:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { format } = __webpack_require__(73837);
class OPError extends Error {
    constructor({ error_description, error, error_uri, session_state, state, scope }, response){
        super(!error_description ? error : `${error} (${error_description})`);
        Object.assign(this, {
            error
        }, error_description && {
            error_description
        }, error_uri && {
            error_uri
        }, state && {
            state
        }, scope && {
            scope
        }, session_state && {
            session_state
        });
        if (response) {
            Object.defineProperty(this, "response", {
                value: response
            });
        }
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
class RPError extends Error {
    constructor(...args){
        if (typeof args[0] === "string") {
            super(format(...args));
        } else {
            const { message, printf, response, ...rest } = args[0];
            if (printf) {
                super(format(...printf));
            } else {
                super(message);
            }
            Object.assign(this, rest);
            if (response) {
                Object.defineProperty(this, "response", {
                    value: response
                });
            }
        }
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
module.exports = {
    OPError,
    RPError
};


/***/ }),

/***/ 75486:
/***/ ((module) => {

"use strict";

function assertSigningAlgValuesSupport(endpoint, issuer, properties) {
    if (!issuer[`${endpoint}_endpoint`]) return;
    const eam = `${endpoint}_endpoint_auth_method`;
    const easa = `${endpoint}_endpoint_auth_signing_alg`;
    const easavs = `${endpoint}_endpoint_auth_signing_alg_values_supported`;
    if (properties[eam] && properties[eam].endsWith("_jwt") && !properties[easa] && !issuer[easavs]) {
        throw new TypeError(`${easavs} must be configured on the issuer if ${easa} is not defined on a client`);
    }
}
function assertIssuerConfiguration(issuer, endpoint) {
    if (!issuer[endpoint]) {
        throw new TypeError(`${endpoint} must be configured on the issuer`);
    }
}
module.exports = {
    assertSigningAlgValuesSupport,
    assertIssuerConfiguration
};


/***/ }),

/***/ 98723:
/***/ ((module) => {

"use strict";

let encode;
if (Buffer.isEncoding("base64url")) {
    encode = (input, encoding = "utf8")=>Buffer.from(input, encoding).toString("base64url");
} else {
    const fromBase64 = (base64)=>base64.replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
    encode = (input, encoding = "utf8")=>fromBase64(Buffer.from(input, encoding).toString("base64"));
}
const decode = (input)=>Buffer.from(input, "base64");
module.exports.decode = decode;
module.exports.encode = encode;


/***/ }),

/***/ 73414:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const jose = __webpack_require__(23464);
const { RPError } = __webpack_require__(54180);
const { assertIssuerConfiguration } = __webpack_require__(75486);
const { random } = __webpack_require__(75598);
const now = __webpack_require__(2218);
const request = __webpack_require__(11825);
const { keystores } = __webpack_require__(22794);
const merge = __webpack_require__(10750);
const formUrlEncode = (value)=>encodeURIComponent(value).replace(/%20/g, "+");
async function clientAssertion(endpoint, payload) {
    let alg = this[`${endpoint}_endpoint_auth_signing_alg`];
    if (!alg) {
        assertIssuerConfiguration(this.issuer, `${endpoint}_endpoint_auth_signing_alg_values_supported`);
    }
    if (this[`${endpoint}_endpoint_auth_method`] === "client_secret_jwt") {
        if (!alg) {
            const supported = this.issuer[`${endpoint}_endpoint_auth_signing_alg_values_supported`];
            alg = Array.isArray(supported) && supported.find((signAlg)=>/^HS(?:256|384|512)/.test(signAlg));
        }
        if (!alg) {
            throw new RPError(`failed to determine a JWS Algorithm to use for ${this[`${endpoint}_endpoint_auth_method`]} Client Assertion`);
        }
        return new jose.CompactSign(Buffer.from(JSON.stringify(payload))).setProtectedHeader({
            alg
        }).sign(this.secretForAlg(alg));
    }
    const keystore = await keystores.get(this);
    if (!keystore) {
        throw new TypeError("no client jwks provided for signing a client assertion with");
    }
    if (!alg) {
        const supported = this.issuer[`${endpoint}_endpoint_auth_signing_alg_values_supported`];
        alg = Array.isArray(supported) && supported.find((signAlg)=>keystore.get({
                alg: signAlg,
                use: "sig"
            }));
    }
    if (!alg) {
        throw new RPError(`failed to determine a JWS Algorithm to use for ${this[`${endpoint}_endpoint_auth_method`]} Client Assertion`);
    }
    const key = keystore.get({
        alg,
        use: "sig"
    });
    if (!key) {
        throw new RPError(`no key found in client jwks to sign a client assertion with using alg ${alg}`);
    }
    return new jose.CompactSign(Buffer.from(JSON.stringify(payload))).setProtectedHeader({
        alg,
        kid: key.jwk && key.jwk.kid
    }).sign(await key.keyObject(alg));
}
async function authFor(endpoint, { clientAssertionPayload } = {}) {
    const authMethod = this[`${endpoint}_endpoint_auth_method`];
    switch(authMethod){
        case "self_signed_tls_client_auth":
        case "tls_client_auth":
        case "none":
            return {
                form: {
                    client_id: this.client_id
                }
            };
        case "client_secret_post":
            if (typeof this.client_secret !== "string") {
                throw new TypeError("client_secret_post client authentication method requires a client_secret");
            }
            return {
                form: {
                    client_id: this.client_id,
                    client_secret: this.client_secret
                }
            };
        case "private_key_jwt":
        case "client_secret_jwt":
            {
                const timestamp = now();
                const audience = [
                    ...new Set([
                        this.issuer.issuer,
                        this.issuer.token_endpoint
                    ].filter(Boolean))
                ];
                const assertion = await clientAssertion.call(this, endpoint, {
                    iat: timestamp,
                    exp: timestamp + 60,
                    jti: random(),
                    iss: this.client_id,
                    sub: this.client_id,
                    aud: audience,
                    ...clientAssertionPayload
                });
                return {
                    form: {
                        client_id: this.client_id,
                        client_assertion: assertion,
                        client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
                    }
                };
            }
        case "client_secret_basic":
            {
                // This is correct behaviour, see https://tools.ietf.org/html/rfc6749#section-2.3.1 and the
                // related appendix. (also https://github.com/panva/node-openid-client/pull/91)
                // > The client identifier is encoded using the
                // > "application/x-www-form-urlencoded" encoding algorithm per
                // > Appendix B, and the encoded value is used as the username; the client
                // > password is encoded using the same algorithm and used as the
                // > password.
                if (typeof this.client_secret !== "string") {
                    throw new TypeError("client_secret_basic client authentication method requires a client_secret");
                }
                const encoded = `${formUrlEncode(this.client_id)}:${formUrlEncode(this.client_secret)}`;
                const value = Buffer.from(encoded).toString("base64");
                return {
                    headers: {
                        Authorization: `Basic ${value}`
                    }
                };
            }
        default:
            {
                throw new TypeError(`missing, or unsupported, ${endpoint}_endpoint_auth_method`);
            }
    }
}
function resolveResponseType() {
    const { length, 0: value } = this.response_types;
    if (length === 1) {
        return value;
    }
    return undefined;
}
function resolveRedirectUri() {
    const { length, 0: value } = this.redirect_uris || [];
    if (length === 1) {
        return value;
    }
    return undefined;
}
async function authenticatedPost(endpoint, opts, { clientAssertionPayload, endpointAuthMethod = endpoint, DPoP } = {}) {
    const auth = await authFor.call(this, endpointAuthMethod, {
        clientAssertionPayload
    });
    const requestOpts = merge(opts, auth);
    const mTLS = this[`${endpointAuthMethod}_endpoint_auth_method`].includes("tls_client_auth") || endpoint === "token" && this.tls_client_certificate_bound_access_tokens;
    let targetUrl;
    if (mTLS && this.issuer.mtls_endpoint_aliases) {
        targetUrl = this.issuer.mtls_endpoint_aliases[`${endpoint}_endpoint`];
    }
    targetUrl = targetUrl || this.issuer[`${endpoint}_endpoint`];
    if ("form" in requestOpts) {
        for (const [key, value] of Object.entries(requestOpts.form)){
            if (typeof value === "undefined") {
                delete requestOpts.form[key];
            }
        }
    }
    return request.call(this, {
        ...requestOpts,
        method: "POST",
        url: targetUrl,
        headers: {
            ...endpoint !== "revocation" ? {
                Accept: "application/json"
            } : undefined,
            ...requestOpts.headers
        }
    }, {
        mTLS,
        DPoP
    });
}
module.exports = {
    resolveResponseType,
    resolveRedirectUri,
    authFor,
    authenticatedPost
};


/***/ }),

/***/ 59774:
/***/ ((module) => {

"use strict";

const HTTP_OPTIONS = Symbol();
const CLOCK_TOLERANCE = Symbol();
module.exports = {
    CLOCK_TOLERANCE,
    HTTP_OPTIONS
};


/***/ }),

/***/ 22768:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const base64url = __webpack_require__(98723);
module.exports = (token)=>{
    if (typeof token !== "string" || !token) {
        throw new TypeError("JWT must be a string");
    }
    const { 0: header, 1: payload, 2: signature, length } = token.split(".");
    if (length === 5) {
        throw new TypeError("encrypted JWTs cannot be decoded");
    }
    if (length !== 3) {
        throw new Error("JWTs must have three components");
    }
    try {
        return {
            header: JSON.parse(base64url.decode(header)),
            payload: JSON.parse(base64url.decode(payload)),
            signature
        };
    } catch (err) {
        throw new Error("JWT is malformed");
    }
};


/***/ }),

/***/ 34033:
/***/ ((module) => {

"use strict";

module.exports = globalThis.structuredClone || ((obj)=>JSON.parse(JSON.stringify(obj)));


/***/ }),

/***/ 61290:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const isPlainObject = __webpack_require__(75915);
function defaults(deep, target, ...sources) {
    for (const source of sources){
        if (!isPlainObject(source)) {
            continue;
        }
        for (const [key, value] of Object.entries(source)){
            /* istanbul ignore if */ if (key === "__proto__" || key === "constructor") {
                continue;
            }
            if (typeof target[key] === "undefined" && typeof value !== "undefined") {
                target[key] = value;
            }
            if (deep && isPlainObject(target[key]) && isPlainObject(value)) {
                defaults(true, target[key], value);
            }
        }
    }
    return target;
}
module.exports = defaults.bind(undefined, false);
module.exports.deep = defaults.bind(undefined, true);


/***/ }),

/***/ 75598:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { createHash, randomBytes } = __webpack_require__(6113);
const base64url = __webpack_require__(98723);
const random = (bytes = 32)=>base64url.encode(randomBytes(bytes));
module.exports = {
    random,
    state: random,
    nonce: random,
    codeVerifier: random,
    codeChallenge: (codeVerifier)=>base64url.encode(createHash("sha256").update(codeVerifier).digest())
};


/***/ }),

/***/ 68519:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const util = __webpack_require__(73837);
const crypto = __webpack_require__(6113);
module.exports = util.types.isKeyObject || ((obj)=>obj && obj instanceof crypto.KeyObject);


/***/ }),

/***/ 75915:
/***/ ((module) => {

"use strict";

module.exports = (a)=>!!a && a.constructor === Object;


/***/ }),

/***/ 67772:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const objectHash = __webpack_require__(60442);
const LRU = __webpack_require__(94710);
const { RPError } = __webpack_require__(54180);
const { assertIssuerConfiguration } = __webpack_require__(75486);
const KeyStore = __webpack_require__(72270);
const { keystores } = __webpack_require__(22794);
const processResponse = __webpack_require__(95841);
const request = __webpack_require__(11825);
const inFlight = new WeakMap();
const caches = new WeakMap();
const lrus = (ctx)=>{
    if (!caches.has(ctx)) {
        caches.set(ctx, new LRU({
            max: 100
        }));
    }
    return caches.get(ctx);
};
async function getKeyStore(reload = false) {
    assertIssuerConfiguration(this, "jwks_uri");
    const keystore = keystores.get(this);
    const cache = lrus(this);
    if (reload || !keystore) {
        if (inFlight.has(this)) {
            return inFlight.get(this);
        }
        cache.reset();
        inFlight.set(this, (async ()=>{
            const response = await request.call(this, {
                method: "GET",
                responseType: "json",
                url: this.jwks_uri,
                headers: {
                    Accept: "application/json, application/jwk-set+json"
                }
            }).finally(()=>{
                inFlight.delete(this);
            });
            const jwks = processResponse(response);
            const joseKeyStore = KeyStore.fromJWKS(jwks, {
                onlyPublic: true
            });
            cache.set("throttle", true, 60 * 1000);
            keystores.set(this, joseKeyStore);
            return joseKeyStore;
        })());
        return inFlight.get(this);
    }
    return keystore;
}
async function queryKeyStore({ kid, kty, alg, use }, { allowMulti = false } = {}) {
    const cache = lrus(this);
    const def = {
        kid,
        kty,
        alg,
        use
    };
    const defHash = objectHash(def, {
        algorithm: "sha256",
        ignoreUnknown: true,
        unorderedArrays: true,
        unorderedSets: true
    });
    // refresh keystore on every unknown key but also only upto once every minute
    const freshJwksUri = cache.get(defHash) || cache.get("throttle");
    const keystore = await getKeyStore.call(this, !freshJwksUri);
    const keys = keystore.all(def);
    delete def.use;
    if (keys.length === 0) {
        throw new RPError({
            printf: [
                "no valid key found in issuer's jwks_uri for key parameters %j",
                def
            ],
            jwks: keystore
        });
    }
    if (!allowMulti && keys.length > 1 && !kid) {
        throw new RPError({
            printf: [
                "multiple matching keys found in issuer's jwks_uri for key parameters %j, kid must be provided in this case",
                def
            ],
            jwks: keystore
        });
    }
    cache.set(defHash, true);
    return keys;
}
module.exports.queryKeyStore = queryKeyStore;
module.exports.keystore = getKeyStore;


/***/ }),

/***/ 72270:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const jose = __webpack_require__(23464);
const clone = __webpack_require__(34033);
const isPlainObject = __webpack_require__(75915);
const internal = Symbol();
function fauxAlg(kty) {
    switch(kty){
        case "RSA":
            return "RSA-OAEP";
        case "EC":
            return "ECDH-ES";
        case "OKP":
            return "ECDH-ES";
        case "oct":
            return "HS256";
        default:
            return undefined;
    }
}
const keyscore = (key, { alg, use })=>{
    let score = 0;
    if (alg && key.alg) {
        score++;
    }
    if (use && key.use) {
        score++;
    }
    return score;
};
function getKtyFromAlg(alg) {
    switch(typeof alg === "string" && alg.slice(0, 2)){
        case "RS":
        case "PS":
            return "RSA";
        case "ES":
            return "EC";
        case "Ed":
            return "OKP";
        default:
            return undefined;
    }
}
function getAlgorithms(use, alg, kty, crv) {
    // Ed25519, Ed448, and secp256k1 always have "alg"
    // OKP always has "use"
    if (alg) {
        return new Set([
            alg
        ]);
    }
    switch(kty){
        case "EC":
            {
                let algs = [];
                if (use === "enc" || use === undefined) {
                    algs = algs.concat([
                        "ECDH-ES",
                        "ECDH-ES+A128KW",
                        "ECDH-ES+A192KW",
                        "ECDH-ES+A256KW"
                    ]);
                }
                if (use === "sig" || use === undefined) {
                    switch(crv){
                        case "P-256":
                        case "P-384":
                            algs = algs.concat([
                                `ES${crv.slice(-3)}`.replace("21", "12")
                            ]);
                            break;
                        case "P-521":
                            algs = algs.concat([
                                "ES512"
                            ]);
                            break;
                        case "secp256k1":
                            if (jose.cryptoRuntime === "node:crypto") {
                                algs = algs.concat([
                                    "ES256K"
                                ]);
                            }
                            break;
                    }
                }
                return new Set(algs);
            }
        case "OKP":
            {
                return new Set([
                    "ECDH-ES",
                    "ECDH-ES+A128KW",
                    "ECDH-ES+A192KW",
                    "ECDH-ES+A256KW"
                ]);
            }
        case "RSA":
            {
                let algs = [];
                if (use === "enc" || use === undefined) {
                    algs = algs.concat([
                        "RSA-OAEP",
                        "RSA-OAEP-256",
                        "RSA-OAEP-384",
                        "RSA-OAEP-512"
                    ]);
                    if (jose.cryptoRuntime === "node:crypto") {
                        algs = algs.concat([
                            "RSA1_5"
                        ]);
                    }
                }
                if (use === "sig" || use === undefined) {
                    algs = algs.concat([
                        "PS256",
                        "PS384",
                        "PS512",
                        "RS256",
                        "RS384",
                        "RS512"
                    ]);
                }
                return new Set(algs);
            }
        default:
            throw new Error("unreachable");
    }
}
module.exports = class KeyStore {
    #keys;
    constructor(i, keys){
        if (i !== internal) throw new Error("invalid constructor call");
        this.#keys = keys;
    }
    toJWKS() {
        return {
            keys: this.map(({ jwk: { d, p, q, dp, dq, qi, ...jwk } })=>jwk)
        };
    }
    all({ alg, kid, use } = {}) {
        if (!use || !alg) {
            throw new Error();
        }
        const kty = getKtyFromAlg(alg);
        const search = {
            alg,
            use
        };
        return this.filter((key)=>{
            let candidate = true;
            if (candidate && kty !== undefined && key.jwk.kty !== kty) {
                candidate = false;
            }
            if (candidate && kid !== undefined && key.jwk.kid !== kid) {
                candidate = false;
            }
            if (candidate && use !== undefined && key.jwk.use !== undefined && key.jwk.use !== use) {
                candidate = false;
            }
            if (candidate && key.jwk.alg && key.jwk.alg !== alg) {
                candidate = false;
            } else if (!key.algorithms.has(alg)) {
                candidate = false;
            }
            return candidate;
        }).sort((first, second)=>keyscore(second, search) - keyscore(first, search));
    }
    get(...args) {
        return this.all(...args)[0];
    }
    static async fromJWKS(jwks, { onlyPublic = false, onlyPrivate = false } = {}) {
        if (!isPlainObject(jwks) || !Array.isArray(jwks.keys) || jwks.keys.some((k)=>!isPlainObject(k) || !("kty" in k))) {
            throw new TypeError("jwks must be a JSON Web Key Set formatted object");
        }
        const keys = [];
        for (let jwk of jwks.keys){
            jwk = clone(jwk);
            const { kty, kid, crv } = jwk;
            let { alg, use } = jwk;
            if (typeof kty !== "string" || !kty) {
                continue;
            }
            if (use !== undefined && use !== "sig" && use !== "enc") {
                continue;
            }
            if (typeof alg !== "string" && alg !== undefined) {
                continue;
            }
            if (typeof kid !== "string" && kid !== undefined) {
                continue;
            }
            if (kty === "EC" && use === "sig") {
                switch(crv){
                    case "P-256":
                        alg = "ES256";
                        break;
                    case "P-384":
                        alg = "ES384";
                        break;
                    case "P-521":
                        alg = "ES512";
                        break;
                    default:
                        break;
                }
            }
            if (crv === "secp256k1") {
                use = "sig";
                alg = "ES256K";
            }
            if (kty === "OKP") {
                switch(crv){
                    case "Ed25519":
                    case "Ed448":
                        use = "sig";
                        alg = "EdDSA";
                        break;
                    case "X25519":
                    case "X448":
                        use = "enc";
                        break;
                    default:
                        break;
                }
            }
            if (alg && !use) {
                switch(true){
                    case alg.startsWith("ECDH"):
                        use = "enc";
                        break;
                    case alg.startsWith("RSA"):
                        use = "enc";
                        break;
                    default:
                        break;
                }
            }
            if (onlyPrivate && (jwk.kty === "oct" || !jwk.d)) {
                throw new Error("jwks must only contain private keys");
            }
            if (onlyPublic && (jwk.d || jwk.k)) {
                continue;
            }
            keys.push({
                jwk: {
                    ...jwk,
                    alg,
                    use
                },
                async keyObject (alg) {
                    if (this[alg]) {
                        return this[alg];
                    }
                    const keyObject = await jose.importJWK(this.jwk, alg);
                    this[alg] = keyObject;
                    return keyObject;
                },
                get algorithms () {
                    Object.defineProperty(this, "algorithms", {
                        value: getAlgorithms(this.jwk.use, this.jwk.alg, this.jwk.kty, this.jwk.crv),
                        enumerable: true,
                        configurable: false
                    });
                    return this.algorithms;
                }
            });
        }
        return new this(internal, keys);
    }
    filter(...args) {
        return this.#keys.filter(...args);
    }
    find(...args) {
        return this.#keys.find(...args);
    }
    every(...args) {
        return this.#keys.every(...args);
    }
    some(...args) {
        return this.#keys.some(...args);
    }
    map(...args) {
        return this.#keys.map(...args);
    }
    forEach(...args) {
        return this.#keys.forEach(...args);
    }
    reduce(...args) {
        return this.#keys.reduce(...args);
    }
    sort(...args) {
        return this.#keys.sort(...args);
    }
    *[Symbol.iterator]() {
        for (const key of this.#keys){
            yield key;
        }
    }
};


/***/ }),

/***/ 10750:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const isPlainObject = __webpack_require__(75915);
function merge(target, ...sources) {
    for (const source of sources){
        if (!isPlainObject(source)) {
            continue;
        }
        for (const [key, value] of Object.entries(source)){
            /* istanbul ignore if */ if (key === "__proto__" || key === "constructor") {
                continue;
            }
            if (isPlainObject(target[key]) && isPlainObject(value)) {
                target[key] = merge(target[key], value);
            } else if (typeof value !== "undefined") {
                target[key] = value;
            }
        }
    }
    return target;
}
module.exports = merge;


/***/ }),

/***/ 10218:
/***/ ((module) => {

"use strict";

module.exports = function pick(object, ...paths) {
    const obj = {};
    for (const path of paths){
        if (object[path] !== undefined) {
            obj[path] = object[path];
        }
    }
    return obj;
};


/***/ }),

/***/ 95841:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { STATUS_CODES } = __webpack_require__(13685);
const { format } = __webpack_require__(73837);
const { OPError } = __webpack_require__(54180);
const parseWwwAuthenticate = __webpack_require__(48662);
const throwAuthenticateErrors = (response)=>{
    const params = parseWwwAuthenticate(response.headers["www-authenticate"]);
    if (params.error) {
        throw new OPError(params, response);
    }
};
const isStandardBodyError = (response)=>{
    let result = false;
    try {
        let jsonbody;
        if (typeof response.body !== "object" || Buffer.isBuffer(response.body)) {
            jsonbody = JSON.parse(response.body);
        } else {
            jsonbody = response.body;
        }
        result = typeof jsonbody.error === "string" && jsonbody.error.length;
        if (result) Object.defineProperty(response, "body", {
            value: jsonbody,
            configurable: true
        });
    } catch (err) {}
    return result;
};
function processResponse(response, { statusCode = 200, body = true, bearer = false } = {}) {
    if (response.statusCode !== statusCode) {
        if (bearer) {
            throwAuthenticateErrors(response);
        }
        if (isStandardBodyError(response)) {
            throw new OPError(response.body, response);
        }
        throw new OPError({
            error: format("expected %i %s, got: %i %s", statusCode, STATUS_CODES[statusCode], response.statusCode, STATUS_CODES[response.statusCode])
        }, response);
    }
    if (body && !response.body) {
        throw new OPError({
            error: format("expected %i %s with body but no body was returned", statusCode, STATUS_CODES[statusCode])
        }, response);
    }
    return response.body;
}
module.exports = processResponse;


/***/ }),

/***/ 11825:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const assert = __webpack_require__(39491);
const querystring = __webpack_require__(63477);
const http = __webpack_require__(13685);
const https = __webpack_require__(95687);
const { once } = __webpack_require__(82361);
const { URL } = __webpack_require__(57310);
const LRU = __webpack_require__(94710);
const pkg = __webpack_require__(67891);
const { RPError } = __webpack_require__(54180);
const pick = __webpack_require__(10218);
const { deep: defaultsDeep } = __webpack_require__(61290);
const { HTTP_OPTIONS } = __webpack_require__(59774);
let DEFAULT_HTTP_OPTIONS;
const NQCHAR = /^[\x21\x23-\x5B\x5D-\x7E]+$/;
const allowed = [
    "agent",
    "ca",
    "cert",
    "crl",
    "headers",
    "key",
    "lookup",
    "passphrase",
    "pfx",
    "timeout"
];
const setDefaults = (props, options)=>{
    DEFAULT_HTTP_OPTIONS = defaultsDeep({}, props.length ? pick(options, ...props) : options, DEFAULT_HTTP_OPTIONS);
};
setDefaults([], {
    headers: {
        "User-Agent": `${pkg.name}/${pkg.version} (${pkg.homepage})`
    },
    timeout: 3500
});
function send(req, body, contentType) {
    if (contentType) {
        req.removeHeader("content-type");
        req.setHeader("content-type", contentType);
    }
    if (body) {
        req.removeHeader("content-length");
        req.setHeader("content-length", Buffer.byteLength(body));
        req.write(body);
    }
    req.end();
}
const nonces = new LRU({
    max: 100
});
module.exports = async function request(options, { accessToken, mTLS = false, DPoP } = {}) {
    let url;
    try {
        url = new URL(options.url);
        delete options.url;
        assert(/^(https?:)$/.test(url.protocol));
    } catch (err) {
        throw new TypeError("only valid absolute URLs can be requested");
    }
    const optsFn = this[HTTP_OPTIONS];
    let opts = options;
    const nonceKey = `${url.origin}${url.pathname}`;
    if (DPoP && "dpopProof" in this) {
        opts.headers = opts.headers || {};
        opts.headers.DPoP = await this.dpopProof({
            htu: `${url.origin}${url.pathname}`,
            htm: options.method,
            nonce: nonces.get(nonceKey)
        }, DPoP, accessToken);
    }
    let userOptions;
    if (optsFn) {
        userOptions = pick(optsFn.call(this, url, defaultsDeep({}, opts, DEFAULT_HTTP_OPTIONS)), ...allowed);
    }
    opts = defaultsDeep({}, userOptions, opts, DEFAULT_HTTP_OPTIONS);
    if (mTLS && !opts.pfx && !(opts.key && opts.cert)) {
        throw new TypeError("mutual-TLS certificate and key not set");
    }
    if (opts.searchParams) {
        for (const [key, value] of Object.entries(opts.searchParams)){
            url.searchParams.delete(key);
            url.searchParams.set(key, value);
        }
    }
    let responseType;
    let form;
    let json;
    let body;
    ({ form, responseType, json, body, ...opts } = opts);
    for (const [key, value] of Object.entries(opts.headers || {})){
        if (value === undefined) {
            delete opts.headers[key];
        }
    }
    let response;
    const req = (url.protocol === "https:" ? https.request : http.request)(url.href, opts);
    return (async ()=>{
        if (json) {
            send(req, JSON.stringify(json), "application/json");
        } else if (form) {
            send(req, querystring.stringify(form), "application/x-www-form-urlencoded");
        } else if (body) {
            send(req, body);
        } else {
            send(req);
        }
        [response] = await Promise.race([
            once(req, "response"),
            once(req, "timeout")
        ]);
        // timeout reached
        if (!response) {
            req.destroy();
            throw new RPError(`outgoing request timed out after ${opts.timeout}ms`);
        }
        const parts = [];
        for await (const part of response){
            parts.push(part);
        }
        if (parts.length) {
            switch(responseType){
                case "json":
                    {
                        Object.defineProperty(response, "body", {
                            get () {
                                let value = Buffer.concat(parts);
                                try {
                                    value = JSON.parse(value);
                                } catch (err) {
                                    Object.defineProperty(err, "response", {
                                        value: response
                                    });
                                    throw err;
                                } finally{
                                    Object.defineProperty(response, "body", {
                                        value,
                                        configurable: true
                                    });
                                }
                                return value;
                            },
                            configurable: true
                        });
                        break;
                    }
                case undefined:
                case "buffer":
                    {
                        Object.defineProperty(response, "body", {
                            get () {
                                const value = Buffer.concat(parts);
                                Object.defineProperty(response, "body", {
                                    value,
                                    configurable: true
                                });
                                return value;
                            },
                            configurable: true
                        });
                        break;
                    }
                default:
                    throw new TypeError("unsupported responseType request option");
            }
        }
        return response;
    })().catch((err)=>{
        if (response) Object.defineProperty(err, "response", {
            value: response
        });
        throw err;
    }).finally(()=>{
        const dpopNonce = response && response.headers["dpop-nonce"];
        if (dpopNonce && NQCHAR.test(dpopNonce)) {
            nonces.set(nonceKey, dpopNonce);
        }
    });
};
module.exports.setDefaults = setDefaults.bind(undefined, allowed);


/***/ }),

/***/ 2218:
/***/ ((module) => {

"use strict";

module.exports = ()=>Math.floor(Date.now() / 1000);


/***/ }),

/***/ 22794:
/***/ ((module) => {

"use strict";

module.exports.keystores = new WeakMap();


/***/ }),

/***/ 73996:
/***/ ((module) => {

"use strict";
// Credit: https://github.com/rohe/pyoidc/blob/master/src/oic/utils/webfinger.py
// -- Normalization --
// A string of any other type is interpreted as a URI either the form of scheme
// "://" authority path-abempty [ "?" query ] [ "#" fragment ] or authority
// path-abempty [ "?" query ] [ "#" fragment ] per RFC 3986 [RFC3986] and is
// normalized according to the following rules:
//
// If the user input Identifier does not have an RFC 3986 [RFC3986] scheme
// portion, the string is interpreted as [userinfo "@"] host [":" port]
// path-abempty [ "?" query ] [ "#" fragment ] per RFC 3986 [RFC3986].
// If the userinfo component is present and all of the path component, query
// component, and port component are empty, the acct scheme is assumed. In this
// case, the normalized URI is formed by prefixing acct: to the string as the
// scheme. Per the 'acct' URI Scheme [I‑D.ietf‑appsawg‑acct‑uri], if there is an
// at-sign character ('@') in the userinfo component, it needs to be
// percent-encoded as described in RFC 3986 [RFC3986].
// For all other inputs without a scheme portion, the https scheme is assumed,
// and the normalized URI is formed by prefixing https:// to the string as the
// scheme.
// If the resulting URI contains a fragment portion, it MUST be stripped off
// together with the fragment delimiter character "#".
// The WebFinger [I‑D.ietf‑appsawg‑webfinger] Resource in this case is the
// resulting URI, and the WebFinger Host is the authority component.
//
// Note: Since the definition of authority in RFC 3986 [RFC3986] is
// [ userinfo "@" ] host [ ":" port ], it is legal to have a user input
// identifier like userinfo@host:port, e.g., alice@example.com:8080.

const PORT = /^\d+$/;
function hasScheme(input) {
    if (input.includes("://")) return true;
    const authority = input.replace(/(\/|\?)/g, "#").split("#")[0];
    if (authority.includes(":")) {
        const index = authority.indexOf(":");
        const hostOrPort = authority.slice(index + 1);
        if (!PORT.test(hostOrPort)) {
            return true;
        }
    }
    return false;
}
function acctSchemeAssumed(input) {
    if (!input.includes("@")) return false;
    const parts = input.split("@");
    const host = parts[parts.length - 1];
    return !(host.includes(":") || host.includes("/") || host.includes("?"));
}
function normalize(input) {
    if (typeof input !== "string") {
        throw new TypeError("input must be a string");
    }
    let output;
    if (hasScheme(input)) {
        output = input;
    } else if (acctSchemeAssumed(input)) {
        output = `acct:${input}`;
    } else {
        output = `https://${input}`;
    }
    return output.split("#")[0];
}
module.exports = normalize;


/***/ }),

/***/ 48662:
/***/ ((module) => {

"use strict";

const REGEXP = /(\w+)=("[^"]*")/g;
module.exports = (wwwAuthenticate)=>{
    const params = {};
    try {
        while(REGEXP.exec(wwwAuthenticate) !== null){
            if (RegExp.$1 && RegExp.$2) {
                params[RegExp.$1] = RegExp.$2.slice(1, -1);
            }
        }
    } catch (err) {}
    return params;
};


/***/ }),

/***/ 87519:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const Issuer = __webpack_require__(63109);
const { OPError, RPError } = __webpack_require__(54180);
const Strategy = __webpack_require__(43887);
const TokenSet = __webpack_require__(53394);
const { CLOCK_TOLERANCE, HTTP_OPTIONS } = __webpack_require__(59774);
const generators = __webpack_require__(75598);
const { setDefaults } = __webpack_require__(11825);
module.exports = {
    Issuer,
    Strategy,
    TokenSet,
    errors: {
        OPError,
        RPError
    },
    custom: {
        setHttpOptionsDefaults: setDefaults,
        http_options: HTTP_OPTIONS,
        clock_tolerance: CLOCK_TOLERANCE
    },
    generators
};


/***/ }),

/***/ 63109:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const { inspect } = __webpack_require__(73837);
const url = __webpack_require__(57310);
const { RPError } = __webpack_require__(54180);
const getClient = __webpack_require__(1695);
const registry = __webpack_require__(16535);
const processResponse = __webpack_require__(95841);
const webfingerNormalize = __webpack_require__(73996);
const request = __webpack_require__(11825);
const clone = __webpack_require__(34033);
const { keystore } = __webpack_require__(67772);
const AAD_MULTITENANT_DISCOVERY = [
    "https://login.microsoftonline.com/common/.well-known/openid-configuration",
    "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
    "https://login.microsoftonline.com/organizations/v2.0/.well-known/openid-configuration",
    "https://login.microsoftonline.com/consumers/v2.0/.well-known/openid-configuration"
];
const AAD_MULTITENANT = Symbol();
const ISSUER_DEFAULTS = {
    claim_types_supported: [
        "normal"
    ],
    claims_parameter_supported: false,
    grant_types_supported: [
        "authorization_code",
        "implicit"
    ],
    request_parameter_supported: false,
    request_uri_parameter_supported: true,
    require_request_uri_registration: false,
    response_modes_supported: [
        "query",
        "fragment"
    ],
    token_endpoint_auth_methods_supported: [
        "client_secret_basic"
    ]
};
class Issuer {
    #metadata;
    constructor(meta = {}){
        const aadIssValidation = meta[AAD_MULTITENANT];
        delete meta[AAD_MULTITENANT];
        [
            "introspection",
            "revocation"
        ].forEach((endpoint)=>{
            // if intro/revocation endpoint auth specific meta is missing use the token ones if they
            // are defined
            if (meta[`${endpoint}_endpoint`] && meta[`${endpoint}_endpoint_auth_methods_supported`] === undefined && meta[`${endpoint}_endpoint_auth_signing_alg_values_supported`] === undefined) {
                if (meta.token_endpoint_auth_methods_supported) {
                    meta[`${endpoint}_endpoint_auth_methods_supported`] = meta.token_endpoint_auth_methods_supported;
                }
                if (meta.token_endpoint_auth_signing_alg_values_supported) {
                    meta[`${endpoint}_endpoint_auth_signing_alg_values_supported`] = meta.token_endpoint_auth_signing_alg_values_supported;
                }
            }
        });
        this.#metadata = new Map();
        Object.entries(meta).forEach(([key, value])=>{
            this.#metadata.set(key, value);
            if (!this[key]) {
                Object.defineProperty(this, key, {
                    get () {
                        return this.#metadata.get(key);
                    },
                    enumerable: true
                });
            }
        });
        registry.set(this.issuer, this);
        const Client = getClient(this, aadIssValidation);
        Object.defineProperties(this, {
            Client: {
                value: Client,
                enumerable: true
            },
            FAPI1Client: {
                value: class FAPI1Client extends Client {
                },
                enumerable: true
            }
        });
    }
    get metadata() {
        return clone(Object.fromEntries(this.#metadata.entries()));
    }
    static async webfinger(input) {
        const resource = webfingerNormalize(input);
        const { host } = url.parse(resource);
        const webfingerUrl = `https://${host}/.well-known/webfinger`;
        const response = await request.call(this, {
            method: "GET",
            url: webfingerUrl,
            responseType: "json",
            searchParams: {
                resource,
                rel: "http://openid.net/specs/connect/1.0/issuer"
            },
            headers: {
                Accept: "application/json"
            }
        });
        const body = processResponse(response);
        const location = Array.isArray(body.links) && body.links.find((link)=>typeof link === "object" && link.rel === "http://openid.net/specs/connect/1.0/issuer" && link.href);
        if (!location) {
            throw new RPError({
                message: "no issuer found in webfinger response",
                body
            });
        }
        if (typeof location.href !== "string" || !location.href.startsWith("https://")) {
            throw new RPError({
                printf: [
                    "invalid issuer location %s",
                    location.href
                ],
                body
            });
        }
        const expectedIssuer = location.href;
        if (registry.has(expectedIssuer)) {
            return registry.get(expectedIssuer);
        }
        const issuer = await this.discover(expectedIssuer);
        if (issuer.issuer !== expectedIssuer) {
            registry.del(issuer.issuer);
            throw new RPError("discovered issuer mismatch, expected %s, got: %s", expectedIssuer, issuer.issuer);
        }
        return issuer;
    }
    static async discover(uri) {
        const parsed = url.parse(uri);
        if (parsed.pathname.includes("/.well-known/")) {
            const response = await request.call(this, {
                method: "GET",
                responseType: "json",
                url: uri,
                headers: {
                    Accept: "application/json"
                }
            });
            const body = processResponse(response);
            return new Issuer({
                ...ISSUER_DEFAULTS,
                ...body,
                [AAD_MULTITENANT]: !!AAD_MULTITENANT_DISCOVERY.find((discoveryURL)=>uri.startsWith(discoveryURL))
            });
        }
        let pathname;
        if (parsed.pathname.endsWith("/")) {
            pathname = `${parsed.pathname}.well-known/openid-configuration`;
        } else {
            pathname = `${parsed.pathname}/.well-known/openid-configuration`;
        }
        const wellKnownUri = url.format({
            ...parsed,
            pathname
        });
        const response = await request.call(this, {
            method: "GET",
            responseType: "json",
            url: wellKnownUri,
            headers: {
                Accept: "application/json"
            }
        });
        const body = processResponse(response);
        return new Issuer({
            ...ISSUER_DEFAULTS,
            ...body,
            [AAD_MULTITENANT]: !!AAD_MULTITENANT_DISCOVERY.find((discoveryURL)=>wellKnownUri.startsWith(discoveryURL))
        });
    }
    async reloadJwksUri() {
        await keystore.call(this, true);
    }
    /* istanbul ignore next */ [inspect.custom]() {
        return `${this.constructor.name} ${inspect(this.metadata, {
            depth: Infinity,
            colors: process.stdout.isTTY,
            compact: false,
            sorted: true
        })}`;
    }
}
module.exports = Issuer;


/***/ }),

/***/ 16535:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const LRU = __webpack_require__(94710);
module.exports = new LRU({
    max: 100
});


/***/ }),

/***/ 43887:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const url = __webpack_require__(57310);
const { format } = __webpack_require__(73837);
const cloneDeep = __webpack_require__(34033);
const { RPError, OPError } = __webpack_require__(54180);
const { BaseClient } = __webpack_require__(1695);
const { random, codeChallenge } = __webpack_require__(75598);
const pick = __webpack_require__(10218);
const { resolveResponseType, resolveRedirectUri } = __webpack_require__(73414);
function verified(err, user, info = {}) {
    if (err) {
        this.error(err);
    } else if (!user) {
        this.fail(info);
    } else {
        this.success(user, info);
    }
}
function OpenIDConnectStrategy({ client, params = {}, passReqToCallback = false, sessionKey, usePKCE = true, extras = {} } = {}, verify) {
    if (!(client instanceof BaseClient)) {
        throw new TypeError("client must be an instance of openid-client Client");
    }
    if (typeof verify !== "function") {
        throw new TypeError("verify callback must be a function");
    }
    if (!client.issuer || !client.issuer.issuer) {
        throw new TypeError("client must have an issuer with an identifier");
    }
    this._client = client;
    this._issuer = client.issuer;
    this._verify = verify;
    this._passReqToCallback = passReqToCallback;
    this._usePKCE = usePKCE;
    this._key = sessionKey || `oidc:${url.parse(this._issuer.issuer).hostname}`;
    this._params = cloneDeep(params);
    // state and nonce are handled in authenticate()
    delete this._params.state;
    delete this._params.nonce;
    this._extras = cloneDeep(extras);
    if (!this._params.response_type) this._params.response_type = resolveResponseType.call(client);
    if (!this._params.redirect_uri) this._params.redirect_uri = resolveRedirectUri.call(client);
    if (!this._params.scope) this._params.scope = "openid";
    if (this._usePKCE === true) {
        const supportedMethods = Array.isArray(this._issuer.code_challenge_methods_supported) ? this._issuer.code_challenge_methods_supported : false;
        if (supportedMethods && supportedMethods.includes("S256")) {
            this._usePKCE = "S256";
        } else if (supportedMethods && supportedMethods.includes("plain")) {
            this._usePKCE = "plain";
        } else if (supportedMethods) {
            throw new TypeError("neither code_challenge_method supported by the client is supported by the issuer");
        } else {
            this._usePKCE = "S256";
        }
    } else if (typeof this._usePKCE === "string" && ![
        "plain",
        "S256"
    ].includes(this._usePKCE)) {
        throw new TypeError(`${this._usePKCE} is not valid/implemented PKCE code_challenge_method`);
    }
    this.name = url.parse(client.issuer.issuer).hostname;
}
OpenIDConnectStrategy.prototype.authenticate = function authenticate(req, options) {
    (async ()=>{
        const client = this._client;
        if (!req.session) {
            throw new TypeError("authentication requires session support");
        }
        const reqParams = client.callbackParams(req);
        const sessionKey = this._key;
        const { 0: parameter, length } = Object.keys(reqParams);
        /**
     * Start authentication request if this has no authorization response parameters or
     * this might a login initiated from a third party as per
     * https://openid.net/specs/openid-connect-core-1_0.html#ThirdPartyInitiatedLogin.
     */ if (length === 0 || length === 1 && parameter === "iss") {
            // provide options object with extra authentication parameters
            const params = {
                state: random(),
                ...this._params,
                ...options
            };
            if (!params.nonce && params.response_type.includes("id_token")) {
                params.nonce = random();
            }
            req.session[sessionKey] = pick(params, "nonce", "state", "max_age", "response_type");
            if (this._usePKCE && params.response_type.includes("code")) {
                const verifier = random();
                req.session[sessionKey].code_verifier = verifier;
                switch(this._usePKCE){
                    case "S256":
                        params.code_challenge = codeChallenge(verifier);
                        params.code_challenge_method = "S256";
                        break;
                    case "plain":
                        params.code_challenge = verifier;
                        break;
                }
            }
            this.redirect(client.authorizationUrl(params));
            return;
        }
        /* end authentication request */ /* start authentication response */ const session = req.session[sessionKey];
        if (Object.keys(session || {}).length === 0) {
            throw new Error(format('did not find expected authorization request details in session, req.session["%s"] is %j', sessionKey, session));
        }
        const { state, nonce, max_age: maxAge, code_verifier: codeVerifier, response_type: responseType } = session;
        try {
            delete req.session[sessionKey];
        } catch (err) {}
        const opts = {
            redirect_uri: this._params.redirect_uri,
            ...options
        };
        const checks = {
            state,
            nonce,
            max_age: maxAge,
            code_verifier: codeVerifier,
            response_type: responseType
        };
        const tokenset = await client.callback(opts.redirect_uri, reqParams, checks, this._extras);
        const passReq = this._passReqToCallback;
        const loadUserinfo = this._verify.length > (passReq ? 3 : 2) && client.issuer.userinfo_endpoint;
        const args = [
            tokenset,
            verified.bind(this)
        ];
        if (loadUserinfo) {
            if (!tokenset.access_token) {
                throw new RPError({
                    message: "expected access_token to be returned when asking for userinfo in verify callback",
                    tokenset
                });
            }
            const userinfo = await client.userinfo(tokenset);
            args.splice(1, 0, userinfo);
        }
        if (passReq) {
            args.unshift(req);
        }
        this._verify(...args);
    /* end authentication response */ })().catch((error)=>{
        if (error instanceof OPError && error.error !== "server_error" && !error.error.startsWith("invalid") || error instanceof RPError) {
            this.fail(error);
        } else {
            this.error(error);
        }
    });
};
module.exports = OpenIDConnectStrategy;


/***/ }),

/***/ 53394:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const base64url = __webpack_require__(98723);
const now = __webpack_require__(2218);
class TokenSet {
    constructor(values){
        Object.assign(this, values);
        const { constructor, ...properties } = Object.getOwnPropertyDescriptors(this.constructor.prototype);
        Object.defineProperties(this, properties);
    }
    set expires_in(value) {
        this.expires_at = now() + Number(value);
    }
    get expires_in() {
        return Math.max.apply(null, [
            this.expires_at - now(),
            0
        ]);
    }
    expired() {
        return this.expires_in === 0;
    }
    claims() {
        if (!this.id_token) {
            throw new TypeError("id_token not present in TokenSet");
        }
        return JSON.parse(base64url.decode(this.id_token.split(".")[1]));
    }
}
module.exports = TokenSet;


/***/ }),

/***/ 5688:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

!function(e, t) {
     true ? t(exports, __webpack_require__(97804)) : 0;
}(this, function(e, t) {
    var n = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|^--/i, r = /^(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)$/, o = /[\s\n\\/='"\0<>]/, i = /^xlink:?./, s = /["&<]/;
    function a(e) {
        if (!1 === s.test(e += "")) return e;
        for(var t = 0, n = 0, r = "", o = ""; n < e.length; n++){
            switch(e.charCodeAt(n)){
                case 34:
                    o = "&quot;";
                    break;
                case 38:
                    o = "&amp;";
                    break;
                case 60:
                    o = "&lt;";
                    break;
                default:
                    continue;
            }
            n !== t && (r += e.slice(t, n)), r += o, t = n + 1;
        }
        return n !== t && (r += e.slice(t, n)), r;
    }
    var l = function(e, t) {
        return String(e).replace(/(\n+)/g, "$1" + (t || "	"));
    }, f = function(e, t, n) {
        return String(e).length > (t || 40) || !n && -1 !== String(e).indexOf("\n") || -1 !== String(e).indexOf("<");
    }, u = {}, p = /([A-Z])/g;
    function c(e) {
        var t = "";
        for(var r in e){
            var o = e[r];
            null != o && "" !== o && (t && (t += " "), t += "-" == r[0] ? r : u[r] || (u[r] = r.replace(p, "-$1").toLowerCase()), t = "number" == typeof o && !1 === n.test(r) ? t + ": " + o + "px;" : t + ": " + o + ";");
        }
        return t || void 0;
    }
    function _(e, t) {
        return Array.isArray(t) ? t.reduce(_, e) : null != t && !1 !== t && e.push(t), e;
    }
    function d() {
        this.__d = !0;
    }
    function v(e, t) {
        return {
            __v: e,
            context: t,
            props: e.props,
            setState: d,
            forceUpdate: d,
            __d: !0,
            __h: []
        };
    }
    function g(e, t) {
        var n = e.contextType, r = n && t[n.__c];
        return null != n ? r ? r.props.value : n.__ : t;
    }
    var h = [];
    function y(e, n, s, u, p, d) {
        if (null == e || "boolean" == typeof e) return "";
        if ("object" != typeof e) return "function" == typeof e ? "" : a(e);
        var m = s.pretty, b = m && "string" == typeof m ? m : "	";
        if (Array.isArray(e)) {
            for(var x = "", k = 0; k < e.length; k++)m && k > 0 && (x += "\n"), x += y(e[k], n, s, u, p, d);
            return x;
        }
        if (void 0 !== e.constructor) return "";
        var S, w = e.type, C = e.props, O = !1;
        if ("function" == typeof w) {
            if (O = !0, !s.shallow || !u && !1 !== s.renderRootComponent) {
                if (w === t.Fragment) {
                    var j = [];
                    return _(j, e.props.children), y(j, n, s, !1 !== s.shallowHighOrder, p, d);
                }
                var F, A = e.__c = v(e, n);
                t.options.__b && t.options.__b(e);
                var T = t.options.__r;
                if (w.prototype && "function" == typeof w.prototype.render) {
                    var H = g(w, n);
                    (A = e.__c = new w(C, H)).__v = e, A._dirty = A.__d = !0, A.props = C, null == A.state && (A.state = {}), null == A._nextState && null == A.__s && (A._nextState = A.__s = A.state), A.context = H, w.getDerivedStateFromProps ? A.state = Object.assign({}, A.state, w.getDerivedStateFromProps(A.props, A.state)) : A.componentWillMount && (A.componentWillMount(), A.state = A._nextState !== A.state ? A._nextState : A.__s !== A.state ? A.__s : A.state), T && T(e), F = A.render(A.props, A.state, A.context);
                } else for(var M = g(w, n), L = 0; A.__d && L++ < 25;)A.__d = !1, T && T(e), F = w.call(e.__c, C, M);
                return A.getChildContext && (n = Object.assign({}, n, A.getChildContext())), t.options.diffed && t.options.diffed(e), y(F, n, s, !1 !== s.shallowHighOrder, p, d);
            }
            w = (S = w).displayName || S !== Function && S.name || function(e) {
                var t = (Function.prototype.toString.call(e).match(/^\s*function\s+([^( ]+)/) || "")[1];
                if (!t) {
                    for(var n = -1, r = h.length; r--;)if (h[r] === e) {
                        n = r;
                        break;
                    }
                    n < 0 && (n = h.push(e) - 1), t = "UnnamedComponent" + n;
                }
                return t;
            }(S);
        }
        var E, $, D = "<" + w;
        if (C) {
            var N = Object.keys(C);
            s && !0 === s.sortAttributes && N.sort();
            for(var P = 0; P < N.length; P++){
                var R = N[P], W = C[R];
                if ("children" !== R) {
                    if (!o.test(R) && (s && s.allAttributes || "key" !== R && "ref" !== R && "__self" !== R && "__source" !== R)) {
                        if ("defaultValue" === R) R = "value";
                        else if ("defaultChecked" === R) R = "checked";
                        else if ("defaultSelected" === R) R = "selected";
                        else if ("className" === R) {
                            if (void 0 !== C.class) continue;
                            R = "class";
                        } else p && i.test(R) && (R = R.toLowerCase().replace(/^xlink:?/, "xlink:"));
                        if ("htmlFor" === R) {
                            if (C.for) continue;
                            R = "for";
                        }
                        "style" === R && W && "object" == typeof W && (W = c(W)), "a" === R[0] && "r" === R[1] && "boolean" == typeof W && (W = String(W));
                        var q = s.attributeHook && s.attributeHook(R, W, n, s, O);
                        if (q || "" === q) D += q;
                        else if ("dangerouslySetInnerHTML" === R) $ = W && W.__html;
                        else if ("textarea" === w && "value" === R) E = W;
                        else if ((W || 0 === W || "" === W) && "function" != typeof W) {
                            if (!(!0 !== W && "" !== W || (W = R, s && s.xml))) {
                                D = D + " " + R;
                                continue;
                            }
                            if ("value" === R) {
                                if ("select" === w) {
                                    d = W;
                                    continue;
                                }
                                "option" === w && d == W && void 0 === C.selected && (D += " selected");
                            }
                            D = D + " " + R + '="' + a(W) + '"';
                        }
                    }
                } else E = W;
            }
        }
        if (m) {
            var I = D.replace(/\n\s*/, " ");
            I === D || ~I.indexOf("\n") ? m && ~D.indexOf("\n") && (D += "\n") : D = I;
        }
        if (D += ">", o.test(w)) throw new Error(w + " is not a valid HTML tag name in " + D);
        var U, V = r.test(w) || s.voidElements && s.voidElements.test(w), z = [];
        if ($) m && f($) && ($ = "\n" + b + l($, b)), D += $;
        else if (null != E && _(U = [], E).length) {
            for(var Z = m && ~D.indexOf("\n"), B = !1, G = 0; G < U.length; G++){
                var J = U[G];
                if (null != J && !1 !== J) {
                    var K = y(J, n, s, !0, "svg" === w || "foreignObject" !== w && p, d);
                    if (m && !Z && f(K) && (Z = !0), K) if (m) {
                        var Q = K.length > 0 && "<" != K[0];
                        B && Q ? z[z.length - 1] += K : z.push(K), B = Q;
                    } else z.push(K);
                }
            }
            if (m && Z) for(var X = z.length; X--;)z[X] = "\n" + b + l(z[X], b);
        }
        if (z.length || $) D += z.join("");
        else if (s && s.xml) return D.substring(0, D.length - 1) + " />";
        return !V || U || $ ? (m && ~D.indexOf("\n") && (D += "\n"), D = D + "</" + w + ">") : D = D.replace(/>$/, " />"), D;
    }
    var m = {
        shallow: !0
    };
    k.render = k;
    var b = function(e, t) {
        return k(e, t, m);
    }, x = [];
    function k(e, n, r) {
        n = n || {};
        var o = t.options.__s;
        t.options.__s = !0;
        var i, s = t.h(t.Fragment, null);
        return s.__k = [
            e
        ], i = r && (r.pretty || r.voidElements || r.sortAttributes || r.shallow || r.allAttributes || r.xml || r.attributeHook) ? y(e, n, r) : F(e, n, !1, void 0, s), t.options.__c && t.options.__c(e, x), t.options.__s = o, x.length = 0, i;
    }
    function S(e) {
        return null == e || "boolean" == typeof e ? null : "string" == typeof e || "number" == typeof e || "bigint" == typeof e ? t.h(null, null, e) : e;
    }
    function w(e, t) {
        return "className" === e ? "class" : "htmlFor" === e ? "for" : "defaultValue" === e ? "value" : "defaultChecked" === e ? "checked" : "defaultSelected" === e ? "selected" : t && i.test(e) ? e.toLowerCase().replace(/^xlink:?/, "xlink:") : e;
    }
    function C(e, t) {
        return "style" === e && null != t && "object" == typeof t ? c(t) : "a" === e[0] && "r" === e[1] && "boolean" == typeof t ? String(t) : t;
    }
    var O = Array.isArray, j = Object.assign;
    function F(e, n, i, s, l) {
        if (null == e || !0 === e || !1 === e || "" === e) return "";
        if ("object" != typeof e) return "function" == typeof e ? "" : a(e);
        if (O(e)) {
            var f = "";
            l.__k = e;
            for(var u = 0; u < e.length; u++)f += F(e[u], n, i, s, l), e[u] = S(e[u]);
            return f;
        }
        if (void 0 !== e.constructor) return "";
        e.__ = l, t.options.__b && t.options.__b(e);
        var p = e.type, c = e.props;
        if ("function" == typeof p) {
            var _;
            if (p === t.Fragment) _ = c.children;
            else {
                _ = p.prototype && "function" == typeof p.prototype.render ? function(e, n) {
                    var r = e.type, o = g(r, n), i = new r(e.props, o);
                    e.__c = i, i.__v = e, i.__d = !0, i.props = e.props, null == i.state && (i.state = {}), null == i.__s && (i.__s = i.state), i.context = o, r.getDerivedStateFromProps ? i.state = j({}, i.state, r.getDerivedStateFromProps(i.props, i.state)) : i.componentWillMount && (i.componentWillMount(), i.state = i.__s !== i.state ? i.__s : i.state);
                    var s = t.options.__r;
                    return s && s(e), i.render(i.props, i.state, i.context);
                }(e, n) : function(e, n) {
                    var r, o = v(e, n), i = g(e.type, n);
                    e.__c = o;
                    for(var s = t.options.__r, a = 0; o.__d && a++ < 25;)o.__d = !1, s && s(e), r = e.type.call(o, e.props, i);
                    return r;
                }(e, n);
                var d = e.__c;
                d.getChildContext && (n = j({}, n, d.getChildContext()));
            }
            var h = F(_ = null != _ && _.type === t.Fragment && null == _.key ? _.props.children : _, n, i, s, e);
            return t.options.diffed && t.options.diffed(e), e.__ = void 0, t.options.unmount && t.options.unmount(e), h;
        }
        var y, m, b = "<";
        if (b += p, c) for(var x in y = c.children, c){
            var k = c[x];
            if (!("key" === x || "ref" === x || "__self" === x || "__source" === x || "children" === x || "className" === x && "class" in c || "htmlFor" === x && "for" in c || o.test(x))) {
                if (k = C(x = w(x, i), k), "dangerouslySetInnerHTML" === x) m = k && k.__html;
                else if ("textarea" === p && "value" === x) y = k;
                else if ((k || 0 === k || "" === k) && "function" != typeof k) {
                    if (!0 === k || "" === k) {
                        k = x, b = b + " " + x;
                        continue;
                    }
                    if ("value" === x) {
                        if ("select" === p) {
                            s = k;
                            continue;
                        }
                        "option" !== p || s != k || "selected" in c || (b += " selected");
                    }
                    b = b + " " + x + '="' + a(k) + '"';
                }
            }
        }
        var A = b;
        if (b += ">", o.test(p)) throw new Error(p + " is not a valid HTML tag name in " + b);
        var T = "", H = !1;
        if (m) T += m, H = !0;
        else if ("string" == typeof y) T += a(y), H = !0;
        else if (O(y)) {
            e.__k = y;
            for(var M = 0; M < y.length; M++){
                var L = y[M];
                if (y[M] = S(L), null != L && !1 !== L) {
                    var E = F(L, n, "svg" === p || "foreignObject" !== p && i, s, e);
                    E && (T += E, H = !0);
                }
            }
        } else if (null != y && !1 !== y && !0 !== y) {
            e.__k = [
                S(y)
            ];
            var $ = F(y, n, "svg" === p || "foreignObject" !== p && i, s, e);
            $ && (T += $, H = !0);
        }
        if (t.options.diffed && t.options.diffed(e), e.__ = void 0, t.options.unmount && t.options.unmount(e), H) b += T;
        else if (r.test(p)) return A + " />";
        return b + "</" + p + ">";
    }
    k.shallowRender = b, e.default = k, e.render = k, e.renderToStaticMarkup = k, e.renderToString = k, e.shallowRender = b;
}); //# sourceMappingURL=index.js.map


/***/ }),

/***/ 16829:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = __webpack_require__(5688)["default"];


/***/ }),

/***/ 97804:
/***/ ((__unused_webpack_module, exports) => {

var n, l, t, u, i, o, r, e, f, c = {}, s = [], a = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i, p = Array.isArray;
function h(n, l) {
    for(var t in l)n[t] = l[t];
    return n;
}
function v(n) {
    var l = n.parentNode;
    l && l.removeChild(n);
}
function y(l, t, u) {
    var i, o, r, e = {};
    for(r in t)"key" == r ? i = t[r] : "ref" == r ? o = t[r] : e[r] = t[r];
    if (arguments.length > 2 && (e.children = arguments.length > 3 ? n.call(arguments, 2) : u), "function" == typeof l && null != l.defaultProps) for(r in l.defaultProps)void 0 === e[r] && (e[r] = l.defaultProps[r]);
    return d(l, e, i, o, null);
}
function d(n, u, i, o, r) {
    var e = {
        type: n,
        props: u,
        key: i,
        ref: o,
        __k: null,
        __: null,
        __b: 0,
        __e: null,
        __d: void 0,
        __c: null,
        constructor: void 0,
        __v: null == r ? ++t : r,
        __i: -1,
        __u: 0
    };
    return null == r && null != l.vnode && l.vnode(e), e;
}
function _(n) {
    return n.children;
}
function x(n, l) {
    this.props = n, this.context = l;
}
function g(n, l) {
    if (null == l) return n.__ ? g(n.__, n.__i + 1) : null;
    for(var t; l < n.__k.length; l++)if (null != (t = n.__k[l]) && null != t.__e) return t.__e;
    return "function" == typeof n.type ? g(n) : null;
}
function b(n) {
    var l, t;
    if (null != (n = n.__) && null != n.__c) {
        for(n.__e = n.__c.base = null, l = 0; l < n.__k.length; l++)if (null != (t = n.__k[l]) && null != t.__e) {
            n.__e = n.__c.base = t.__e;
            break;
        }
        return b(n);
    }
}
function k(n) {
    (!n.__d && (n.__d = !0) && i.push(n) && !m.__r++ || o !== l.debounceRendering) && ((o = l.debounceRendering) || r)(m);
}
function m() {
    var n, t, u, o, r, f, c, s, a;
    for(i.sort(e); n = i.shift();)n.__d && (t = i.length, o = void 0, f = (r = (u = n).__v).__e, s = [], a = [], (c = u.__P) && ((o = h({}, r)).__v = r.__v + 1, l.vnode && l.vnode(o), A(c, o, r, u.__n, void 0 !== c.ownerSVGElement, 32 & r.__u ? [
        f
    ] : null, s, null == f ? g(r) : f, !!(32 & r.__u), a), o.__.__k[o.__i] = o, D(s, o, a), o.__e != f && b(o)), i.length > t && i.sort(e));
    m.__r = 0;
}
function w(n, l, t, u, i, o, r, e, f, a, p) {
    var h, v, y, d, _, x = u && u.__k || s, g = l.length;
    for(t.__d = f, P(t, l, x), f = t.__d, h = 0; h < g; h++)null != (y = t.__k[h]) && "boolean" != typeof y && "function" != typeof y && (v = -1 === y.__i ? c : x[y.__i] || c, y.__i = h, A(n, y, v, i, o, r, e, f, a, p), d = y.__e, y.ref && v.ref != y.ref && (v.ref && M(v.ref, null, y), p.push(y.ref, y.__c || d, y)), null == _ && null != d && (_ = d), 65536 & y.__u || v.__k === y.__k ? f = S(y, f, n) : "function" == typeof y.type && void 0 !== y.__d ? f = y.__d : d && (f = d.nextSibling), y.__d = void 0, y.__u &= -196609);
    t.__d = f, t.__e = _;
}
function P(n, l, t) {
    var u, i, o, r, e, f = l.length, c = t.length, s = c, a = 0;
    for(n.__k = [], u = 0; u < f; u++)null != (i = n.__k[u] = null == (i = l[u]) || "boolean" == typeof i || "function" == typeof i ? null : "string" == typeof i || "number" == typeof i || "bigint" == typeof i || i.constructor == String ? d(null, i, null, null, i) : p(i) ? d(_, {
        children: i
    }, null, null, null) : i.__b > 0 ? d(i.type, i.props, i.key, i.ref ? i.ref : null, i.__v) : i) ? (i.__ = n, i.__b = n.__b + 1, e = $(i, t, r = u + a, s), i.__i = e, o = null, -1 !== e && (s--, (o = t[e]) && (o.__u |= 131072)), null == o || null === o.__v ? (-1 == e && a--, "function" != typeof i.type && (i.__u |= 65536)) : e !== r && (e === r + 1 ? a++ : e > r ? s > f - r ? a += e - r : a-- : a = e < r && e == r - 1 ? e - r : 0, e !== u + a && (i.__u |= 65536))) : (o = t[u]) && null == o.key && o.__e && (o.__e == n.__d && (n.__d = g(o)), j(o, o, !1), t[u] = null, s--);
    if (s) for(u = 0; u < c; u++)null != (o = t[u]) && 0 == (131072 & o.__u) && (o.__e == n.__d && (n.__d = g(o)), j(o, o));
}
function S(n, l, t) {
    var u, i;
    if ("function" == typeof n.type) {
        for(u = n.__k, i = 0; u && i < u.length; i++)u[i] && (u[i].__ = n, l = S(u[i], l, t));
        return l;
    }
    return n.__e != l && (t.insertBefore(n.__e, l || null), l = n.__e), l && l.nextSibling;
}
function $(n, l, t, u) {
    var i = n.key, o = n.type, r = t - 1, e = t + 1, f = l[t];
    if (null === f || f && i == f.key && o === f.type) return t;
    if (u > (null != f && 0 == (131072 & f.__u) ? 1 : 0)) for(; r >= 0 || e < l.length;){
        if (r >= 0) {
            if ((f = l[r]) && 0 == (131072 & f.__u) && i == f.key && o === f.type) return r;
            r--;
        }
        if (e < l.length) {
            if ((f = l[e]) && 0 == (131072 & f.__u) && i == f.key && o === f.type) return e;
            e++;
        }
    }
    return -1;
}
function C(n, l, t) {
    "-" === l[0] ? n.setProperty(l, null == t ? "" : t) : n[l] = null == t ? "" : "number" != typeof t || a.test(l) ? t : t + "px";
}
function H(n, l, t, u, i) {
    var o;
    n: if ("style" === l) if ("string" == typeof t) n.style.cssText = t;
    else {
        if ("string" == typeof u && (n.style.cssText = u = ""), u) for(l in u)t && l in t || C(n.style, l, "");
        if (t) for(l in t)u && t[l] === u[l] || C(n.style, l, t[l]);
    }
    else if ("o" === l[0] && "n" === l[1]) o = l !== (l = l.replace(/(PointerCapture)$|Capture$/, "$1")), l = l.toLowerCase() in n ? l.toLowerCase().slice(2) : l.slice(2), n.l || (n.l = {}), n.l[l + o] = t, t ? u ? t.t = u.t : (t.t = Date.now(), n.addEventListener(l, o ? T : I, o)) : n.removeEventListener(l, o ? T : I, o);
    else {
        if (i) l = l.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
        else if ("width" !== l && "height" !== l && "href" !== l && "list" !== l && "form" !== l && "tabIndex" !== l && "download" !== l && "rowSpan" !== l && "colSpan" !== l && "role" !== l && l in n) try {
            n[l] = null == t ? "" : t;
            break n;
        } catch (n) {}
        "function" == typeof t || (null == t || !1 === t && "-" !== l[4] ? n.removeAttribute(l) : n.setAttribute(l, t));
    }
}
function I(n) {
    var t = this.l[n.type + !1];
    if (n.u) {
        if (n.u <= t.t) return;
    } else n.u = Date.now();
    return t(l.event ? l.event(n) : n);
}
function T(n) {
    return this.l[n.type + !0](l.event ? l.event(n) : n);
}
function A(n, t, u, i, o, r, e, f, c, s) {
    var a, v, y, d, g, b, k, m, P, S, $, C, H, I, T, A = t.type;
    if (void 0 !== t.constructor) return null;
    128 & u.__u && (c = !!(32 & u.__u), r = [
        f = t.__e = u.__e
    ]), (a = l.__b) && a(t);
    n: if ("function" == typeof A) try {
        if (m = t.props, P = (a = A.contextType) && i[a.__c], S = a ? P ? P.props.value : a.__ : i, u.__c ? k = (v = t.__c = u.__c).__ = v.__E : ("prototype" in A && A.prototype.render ? t.__c = v = new A(m, S) : (t.__c = v = new x(m, S), v.constructor = A, v.render = z), P && P.sub(v), v.props = m, v.state || (v.state = {}), v.context = S, v.__n = i, y = v.__d = !0, v.__h = [], v._sb = []), null == v.__s && (v.__s = v.state), null != A.getDerivedStateFromProps && (v.__s == v.state && (v.__s = h({}, v.__s)), h(v.__s, A.getDerivedStateFromProps(m, v.__s))), d = v.props, g = v.state, v.__v = t, y) null == A.getDerivedStateFromProps && null != v.componentWillMount && v.componentWillMount(), null != v.componentDidMount && v.__h.push(v.componentDidMount);
        else {
            if (null == A.getDerivedStateFromProps && m !== d && null != v.componentWillReceiveProps && v.componentWillReceiveProps(m, S), !v.__e && (null != v.shouldComponentUpdate && !1 === v.shouldComponentUpdate(m, v.__s, S) || t.__v === u.__v)) {
                for(t.__v !== u.__v && (v.props = m, v.state = v.__s, v.__d = !1), t.__e = u.__e, t.__k = u.__k, t.__k.forEach(function(n) {
                    n && (n.__ = t);
                }), $ = 0; $ < v._sb.length; $++)v.__h.push(v._sb[$]);
                v._sb = [], v.__h.length && e.push(v);
                break n;
            }
            null != v.componentWillUpdate && v.componentWillUpdate(m, v.__s, S), null != v.componentDidUpdate && v.__h.push(function() {
                v.componentDidUpdate(d, g, b);
            });
        }
        if (v.context = S, v.props = m, v.__P = n, v.__e = !1, C = l.__r, H = 0, "prototype" in A && A.prototype.render) {
            for(v.state = v.__s, v.__d = !1, C && C(t), a = v.render(v.props, v.state, v.context), I = 0; I < v._sb.length; I++)v.__h.push(v._sb[I]);
            v._sb = [];
        } else do {
            v.__d = !1, C && C(t), a = v.render(v.props, v.state, v.context), v.state = v.__s;
        }while (v.__d && ++H < 25);
        v.state = v.__s, null != v.getChildContext && (i = h(h({}, i), v.getChildContext())), y || null == v.getSnapshotBeforeUpdate || (b = v.getSnapshotBeforeUpdate(d, g)), w(n, p(T = null != a && a.type === _ && null == a.key ? a.props.children : a) ? T : [
            T
        ], t, u, i, o, r, e, f, c, s), v.base = t.__e, t.__u &= -161, v.__h.length && e.push(v), k && (v.__E = v.__ = null);
    } catch (n) {
        t.__v = null, c || null != r ? (t.__e = f, t.__u |= c ? 160 : 32, r[r.indexOf(f)] = null) : (t.__e = u.__e, t.__k = u.__k), l.__e(n, t, u);
    }
    else null == r && t.__v === u.__v ? (t.__k = u.__k, t.__e = u.__e) : t.__e = L(u.__e, t, u, i, o, r, e, c, s);
    (a = l.diffed) && a(t);
}
function D(n, t, u) {
    t.__d = void 0;
    for(var i = 0; i < u.length; i++)M(u[i], u[++i], u[++i]);
    l.__c && l.__c(t, n), n.some(function(t) {
        try {
            n = t.__h, t.__h = [], n.some(function(n) {
                n.call(t);
            });
        } catch (n) {
            l.__e(n, t.__v);
        }
    });
}
function L(l, t, u, i, o, r, e, f, s) {
    var a, h, y, d, _, x, b, k = u.props, m = t.props, P = t.type;
    if ("svg" === P && (o = !0), null != r) {
        for(a = 0; a < r.length; a++)if ((_ = r[a]) && "setAttribute" in _ == !!P && (P ? _.localName === P : 3 === _.nodeType)) {
            l = _, r[a] = null;
            break;
        }
    }
    if (null == l) {
        if (null === P) return document.createTextNode(m);
        l = o ? document.createElementNS("http://www.w3.org/2000/svg", P) : document.createElement(P, m.is && m), r = null, f = !1;
    }
    if (null === P) k === m || f && l.data === m || (l.data = m);
    else {
        if (r = r && n.call(l.childNodes), k = u.props || c, !f && null != r) for(k = {}, a = 0; a < l.attributes.length; a++)k[(_ = l.attributes[a]).name] = _.value;
        for(a in k)_ = k[a], "children" == a || ("dangerouslySetInnerHTML" == a ? y = _ : "key" === a || a in m || H(l, a, null, _, o));
        for(a in m)_ = m[a], "children" == a ? d = _ : "dangerouslySetInnerHTML" == a ? h = _ : "value" == a ? x = _ : "checked" == a ? b = _ : "key" === a || f && "function" != typeof _ || k[a] === _ || H(l, a, _, k[a], o);
        if (h) f || y && (h.__html === y.__html || h.__html === l.innerHTML) || (l.innerHTML = h.__html), t.__k = [];
        else if (y && (l.innerHTML = ""), w(l, p(d) ? d : [
            d
        ], t, u, i, o && "foreignObject" !== P, r, e, r ? r[0] : u.__k && g(u, 0), f, s), null != r) for(a = r.length; a--;)null != r[a] && v(r[a]);
        f || (a = "value", void 0 !== x && (x !== l[a] || "progress" === P && !x || "option" === P && x !== k[a]) && H(l, a, x, k[a], !1), a = "checked", void 0 !== b && b !== l[a] && H(l, a, b, k[a], !1));
    }
    return l;
}
function M(n, t, u) {
    try {
        "function" == typeof n ? n(t) : n.current = t;
    } catch (n) {
        l.__e(n, u);
    }
}
function j(n, t, u) {
    var i, o;
    if (l.unmount && l.unmount(n), (i = n.ref) && (i.current && i.current !== n.__e || M(i, null, t)), null != (i = n.__c)) {
        if (i.componentWillUnmount) try {
            i.componentWillUnmount();
        } catch (n) {
            l.__e(n, t);
        }
        i.base = i.__P = null, n.__c = void 0;
    }
    if (i = n.__k) for(o = 0; o < i.length; o++)i[o] && j(i[o], t, u || "function" != typeof n.type);
    u || null == n.__e || v(n.__e), n.__ = n.__e = n.__d = void 0;
}
function z(n, l, t) {
    return this.constructor(n, t);
}
function N(t, u, i) {
    var o, r, e, f;
    l.__ && l.__(t, u), r = (o = "function" == typeof i) ? null : i && i.__k || u.__k, e = [], f = [], A(u, t = (!o && i || u).__k = y(_, null, [
        t
    ]), r || c, c, void 0 !== u.ownerSVGElement, !o && i ? [
        i
    ] : r ? null : u.firstChild ? n.call(u.childNodes) : null, e, !o && i ? i : r ? r.__e : u.firstChild, o, f), D(e, t, f);
}
n = s.slice, l = {
    __e: function(n, l, t, u) {
        for(var i, o, r; l = l.__;)if ((i = l.__c) && !i.__) try {
            if ((o = i.constructor) && null != o.getDerivedStateFromError && (i.setState(o.getDerivedStateFromError(n)), r = i.__d), null != i.componentDidCatch && (i.componentDidCatch(n, u || {}), r = i.__d), r) return i.__E = i;
        } catch (l) {
            n = l;
        }
        throw n;
    }
}, t = 0, u = function(n) {
    return null != n && null == n.constructor;
}, x.prototype.setState = function(n, l) {
    var t;
    t = null != this.__s && this.__s !== this.state ? this.__s : this.__s = h({}, this.state), "function" == typeof n && (n = n(h({}, t), this.props)), n && h(t, n), null != n && this.__v && (l && this._sb.push(l), k(this));
}, x.prototype.forceUpdate = function(n) {
    this.__v && (this.__e = !0, n && this.__h.push(n), k(this));
}, x.prototype.render = _, i = [], r = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n, l) {
    return n.__v.__b - l.__v.__b;
}, m.__r = 0, f = 0, exports.Component = x, exports.Fragment = _, exports.cloneElement = function(l, t, u) {
    var i, o, r, e, f = h({}, l.props);
    for(r in l.type && l.type.defaultProps && (e = l.type.defaultProps), t)"key" == r ? i = t[r] : "ref" == r ? o = t[r] : f[r] = void 0 === t[r] && void 0 !== e ? e[r] : t[r];
    return arguments.length > 2 && (f.children = arguments.length > 3 ? n.call(arguments, 2) : u), d(l.type, f, i || l.key, o || l.ref, null);
}, exports.createContext = function(n, l) {
    var t = {
        __c: l = "__cC" + f++,
        __: n,
        Consumer: function(n, l) {
            return n.children(l);
        },
        Provider: function(n) {
            var t, u;
            return this.getChildContext || (t = [], (u = {})[l] = this, this.getChildContext = function() {
                return u;
            }, this.shouldComponentUpdate = function(n) {
                this.props.value !== n.value && t.some(function(n) {
                    n.__e = !0, k(n);
                });
            }, this.sub = function(n) {
                t.push(n);
                var l = n.componentWillUnmount;
                n.componentWillUnmount = function() {
                    t.splice(t.indexOf(n), 1), l && l.call(n);
                };
            }), n.children;
        }
    };
    return t.Provider.__ = t.Consumer.contextType = t;
}, exports.createElement = y, exports.createRef = function() {
    return {
        current: null
    };
}, exports.h = y, exports.hydrate = function n(l, t) {
    N(l, t, n);
}, exports.isValidElement = u, exports.options = l, exports.render = N, exports.toChildArray = function n(l, t) {
    return t = t || [], null == l || "boolean" == typeof l || (p(l) ? l.some(function(l) {
        n(l, t);
    }) : t.push(l)), t;
}; //# sourceMappingURL=preact.js.map


/***/ }),

/***/ 54782:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

var parseUrl = (__webpack_require__(57310).parse);
var DEFAULT_PORTS = {
    ftp: 21,
    gopher: 70,
    http: 80,
    https: 443,
    ws: 80,
    wss: 443
};
var stringEndsWith = String.prototype.endsWith || function(s) {
    return s.length <= this.length && this.indexOf(s, this.length - s.length) !== -1;
};
/**
 * @param {string|object} url - The URL, or the result from url.parse.
 * @return {string} The URL of the proxy that should handle the request to the
 *  given URL. If no proxy is set, this will be an empty string.
 */ function getProxyForUrl(url) {
    var parsedUrl = typeof url === "string" ? parseUrl(url) : url || {};
    var proto = parsedUrl.protocol;
    var hostname = parsedUrl.host;
    var port = parsedUrl.port;
    if (typeof hostname !== "string" || !hostname || typeof proto !== "string") {
        return ""; // Don't proxy URLs without a valid scheme or host.
    }
    proto = proto.split(":", 1)[0];
    // Stripping ports in this way instead of using parsedUrl.hostname to make
    // sure that the brackets around IPv6 addresses are kept.
    hostname = hostname.replace(/:\d*$/, "");
    port = parseInt(port) || DEFAULT_PORTS[proto] || 0;
    if (!shouldProxy(hostname, port)) {
        return ""; // Don't proxy URLs that match NO_PROXY.
    }
    var proxy = getEnv("npm_config_" + proto + "_proxy") || getEnv(proto + "_proxy") || getEnv("npm_config_proxy") || getEnv("all_proxy");
    if (proxy && proxy.indexOf("://") === -1) {
        // Missing scheme in proxy, default to the requested URL's scheme.
        proxy = proto + "://" + proxy;
    }
    return proxy;
}
/**
 * Determines whether a given URL should be proxied.
 *
 * @param {string} hostname - The host name of the URL.
 * @param {number} port - The effective port of the URL.
 * @returns {boolean} Whether the given URL should be proxied.
 * @private
 */ function shouldProxy(hostname, port) {
    var NO_PROXY = (getEnv("npm_config_no_proxy") || getEnv("no_proxy")).toLowerCase();
    if (!NO_PROXY) {
        return true; // Always proxy if NO_PROXY is not set.
    }
    if (NO_PROXY === "*") {
        return false; // Never proxy if wildcard is set.
    }
    return NO_PROXY.split(/[,\s]/).every(function(proxy) {
        if (!proxy) {
            return true; // Skip zero-length hosts.
        }
        var parsedProxy = proxy.match(/^(.+):(\d+)$/);
        var parsedProxyHostname = parsedProxy ? parsedProxy[1] : proxy;
        var parsedProxyPort = parsedProxy ? parseInt(parsedProxy[2]) : 0;
        if (parsedProxyPort && parsedProxyPort !== port) {
            return true; // Skip if ports don't match.
        }
        if (!/^[.*]/.test(parsedProxyHostname)) {
            // No wildcards, so stop proxying if there is an exact match.
            return hostname !== parsedProxyHostname;
        }
        if (parsedProxyHostname.charAt(0) === "*") {
            // Remove leading wildcard.
            parsedProxyHostname = parsedProxyHostname.slice(1);
        }
        // Stop proxying if the hostname ends with the no_proxy host.
        return !stringEndsWith.call(hostname, parsedProxyHostname);
    });
}
/**
 * Get the value for an environment variable.
 *
 * @param {string} key - The name of the environment variable.
 * @return {string} The value of the environment variable.
 * @private
 */ function getEnv(key) {
    return process.env[key.toLowerCase()] || process.env[key.toUpperCase()] || "";
}
exports.j = getProxyForUrl;


/***/ }),

/***/ 31367:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

const os = __webpack_require__(22037);
const tty = __webpack_require__(76224);
const hasFlag = __webpack_require__(69561);
const { env } = process;
let forceColor;
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
    forceColor = 0;
} else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
    forceColor = 1;
}
if ("FORCE_COLOR" in env) {
    if (env.FORCE_COLOR === "true") {
        forceColor = 1;
    } else if (env.FORCE_COLOR === "false") {
        forceColor = 0;
    } else {
        forceColor = env.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(env.FORCE_COLOR, 10), 3);
    }
}
function translateLevel(level) {
    if (level === 0) {
        return false;
    }
    return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
    };
}
function supportsColor(haveStream, streamIsTTY) {
    if (forceColor === 0) {
        return 0;
    }
    if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
        return 3;
    }
    if (hasFlag("color=256")) {
        return 2;
    }
    if (haveStream && !streamIsTTY && forceColor === undefined) {
        return 0;
    }
    const min = forceColor || 0;
    if (env.TERM === "dumb") {
        return min;
    }
    if (process.platform === "win32") {
        // Windows 10 build 10586 is the first Windows release that supports 256 colors.
        // Windows 10 build 14931 is the first release that supports 16m/TrueColor.
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
            return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
    }
    if ("CI" in env) {
        if ([
            "TRAVIS",
            "CIRCLECI",
            "APPVEYOR",
            "GITLAB_CI",
            "GITHUB_ACTIONS",
            "BUILDKITE"
        ].some((sign)=>sign in env) || env.CI_NAME === "codeship") {
            return 1;
        }
        return min;
    }
    if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
    }
    if (env.COLORTERM === "truecolor") {
        return 3;
    }
    if ("TERM_PROGRAM" in env) {
        const version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch(env.TERM_PROGRAM){
            case "iTerm.app":
                return version >= 3 ? 3 : 2;
            case "Apple_Terminal":
                return 2;
        }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
    }
    if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
    }
    if ("COLORTERM" in env) {
        return 1;
    }
    return min;
}
function getSupportLevel(stream) {
    const level = supportsColor(stream, stream && stream.isTTY);
    return translateLevel(level);
}
module.exports = {
    supportsColor: getSupportLevel,
    stdout: translateLevel(supportsColor(true, tty.isatty(1))),
    stderr: translateLevel(supportsColor(true, tty.isatty(2)))
};


/***/ }),

/***/ 32629:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  NIL: () => (/* reexport */ nil),
  parse: () => (/* reexport */ esm_node_parse),
  stringify: () => (/* reexport */ esm_node_stringify),
  v1: () => (/* reexport */ esm_node_v1),
  v3: () => (/* reexport */ esm_node_v3),
  v4: () => (/* reexport */ esm_node_v4),
  v5: () => (/* reexport */ esm_node_v5),
  validate: () => (/* reexport */ esm_node_validate),
  version: () => (/* reexport */ esm_node_version)
});

// EXTERNAL MODULE: external "crypto"
var external_crypto_ = __webpack_require__(6113);
var external_crypto_default = /*#__PURE__*/__webpack_require__.n(external_crypto_);
;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/rng.js

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate
let poolPtr = rnds8Pool.length;
function rng() {
    if (poolPtr > rnds8Pool.length - 16) {
        external_crypto_default().randomFillSync(rnds8Pool);
        poolPtr = 0;
    }
    return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/regex.js
/* harmony default export */ const regex = (/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i);

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/validate.js

function validate(uuid) {
    return typeof uuid === "string" && regex.test(uuid);
}
/* harmony default export */ const esm_node_validate = (validate);

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/stringify.js

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */ const byteToHex = [];
for(let i = 0; i < 256; ++i){
    byteToHex.push((i + 0x100).toString(16).substr(1));
}
function stringify(arr, offset = 0) {
    // Note: Be careful editing this code!  It's been tuned for performance
    // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
    const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + "-" + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + "-" + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + "-" + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + "-" + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
    // of the following:
    // - One or more input array values don't map to a hex octet (leading to
    // "undefined" in the uuid)
    // - Invalid input values for the RFC `version` or `variant` fields
    if (!esm_node_validate(uuid)) {
        throw TypeError("Stringified UUID is invalid");
    }
    return uuid;
}
/* harmony default export */ const esm_node_stringify = (stringify);

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/v1.js

 // **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;
let _clockseq; // Previous uuid creation time
let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details
function v1(options, buf, offset) {
    let i = buf && offset || 0;
    const b = buf || new Array(16);
    options = options || {};
    let node = options.node || _nodeId;
    let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
    // specified.  We do this lazily to minimize issues related to insufficient
    // system entropy.  See #189
    if (node == null || clockseq == null) {
        const seedBytes = options.random || (options.rng || rng)();
        if (node == null) {
            // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
            node = _nodeId = [
                seedBytes[0] | 0x01,
                seedBytes[1],
                seedBytes[2],
                seedBytes[3],
                seedBytes[4],
                seedBytes[5]
            ];
        }
        if (clockseq == null) {
            // Per 4.2.2, randomize (14 bit) clockseq
            clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
        }
    } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
    // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
    // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
    // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.
    let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
    // cycle to simulate higher resolution clock
    let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)
    const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression
    if (dt < 0 && options.clockseq === undefined) {
        clockseq = clockseq + 1 & 0x3fff;
    } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
    // time interval
    if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
        nsecs = 0;
    } // Per 4.2.1.2 Throw error if too many uuids are requested
    if (nsecs >= 10000) {
        throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
    }
    _lastMSecs = msecs;
    _lastNSecs = nsecs;
    _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch
    msecs += 12219292800000; // `time_low`
    const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
    b[i++] = tl >>> 24 & 0xff;
    b[i++] = tl >>> 16 & 0xff;
    b[i++] = tl >>> 8 & 0xff;
    b[i++] = tl & 0xff; // `time_mid`
    const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
    b[i++] = tmh >>> 8 & 0xff;
    b[i++] = tmh & 0xff; // `time_high_and_version`
    b[i++] = tmh >>> 24 & 0xf | 0x10; // include version
    b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)
    b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`
    b[i++] = clockseq & 0xff; // `node`
    for(let n = 0; n < 6; ++n){
        b[i + n] = node[n];
    }
    return buf || esm_node_stringify(b);
}
/* harmony default export */ const esm_node_v1 = (v1);

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/parse.js

function parse(uuid) {
    if (!esm_node_validate(uuid)) {
        throw TypeError("Invalid UUID");
    }
    let v;
    const arr = new Uint8Array(16); // Parse ########-....-....-....-............
    arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
    arr[1] = v >>> 16 & 0xff;
    arr[2] = v >>> 8 & 0xff;
    arr[3] = v & 0xff; // Parse ........-####-....-....-............
    arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
    arr[5] = v & 0xff; // Parse ........-....-####-....-............
    arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
    arr[7] = v & 0xff; // Parse ........-....-....-####-............
    arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
    arr[9] = v & 0xff; // Parse ........-....-....-....-############
    // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)
    arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
    arr[11] = v / 0x100000000 & 0xff;
    arr[12] = v >>> 24 & 0xff;
    arr[13] = v >>> 16 & 0xff;
    arr[14] = v >>> 8 & 0xff;
    arr[15] = v & 0xff;
    return arr;
}
/* harmony default export */ const esm_node_parse = (parse);

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/v35.js


function stringToBytes(str) {
    str = unescape(encodeURIComponent(str)); // UTF8 escape
    const bytes = [];
    for(let i = 0; i < str.length; ++i){
        bytes.push(str.charCodeAt(i));
    }
    return bytes;
}
const DNS = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";
const URL = "6ba7b811-9dad-11d1-80b4-00c04fd430c8";
/* harmony default export */ function v35(name, version, hashfunc) {
    function generateUUID(value, namespace, buf, offset) {
        if (typeof value === "string") {
            value = stringToBytes(value);
        }
        if (typeof namespace === "string") {
            namespace = esm_node_parse(namespace);
        }
        if (namespace.length !== 16) {
            throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
        } // Compute hash of namespace and value, Per 4.3
        // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
        // hashfunc([...namespace, ... value])`
        let bytes = new Uint8Array(16 + value.length);
        bytes.set(namespace);
        bytes.set(value, namespace.length);
        bytes = hashfunc(bytes);
        bytes[6] = bytes[6] & 0x0f | version;
        bytes[8] = bytes[8] & 0x3f | 0x80;
        if (buf) {
            offset = offset || 0;
            for(let i = 0; i < 16; ++i){
                buf[offset + i] = bytes[i];
            }
            return buf;
        }
        return esm_node_stringify(bytes);
    } // Function#name is not settable on some platforms (#270)
    try {
        generateUUID.name = name; // eslint-disable-next-line no-empty
    } catch (err) {} // For CommonJS default export support
    generateUUID.DNS = DNS;
    generateUUID.URL = URL;
    return generateUUID;
}

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/md5.js

function md5(bytes) {
    if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
    } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
    }
    return external_crypto_default().createHash("md5").update(bytes).digest();
}
/* harmony default export */ const esm_node_md5 = (md5);

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/v3.js


const v3 = v35("v3", 0x30, esm_node_md5);
/* harmony default export */ const esm_node_v3 = (v3);

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/v4.js


function v4(options, buf, offset) {
    options = options || {};
    const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
    rnds[6] = rnds[6] & 0x0f | 0x40;
    rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided
    if (buf) {
        offset = offset || 0;
        for(let i = 0; i < 16; ++i){
            buf[offset + i] = rnds[i];
        }
        return buf;
    }
    return esm_node_stringify(rnds);
}
/* harmony default export */ const esm_node_v4 = (v4);

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/sha1.js

function sha1(bytes) {
    if (Array.isArray(bytes)) {
        bytes = Buffer.from(bytes);
    } else if (typeof bytes === "string") {
        bytes = Buffer.from(bytes, "utf8");
    }
    return external_crypto_default().createHash("sha1").update(bytes).digest();
}
/* harmony default export */ const esm_node_sha1 = (sha1);

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/v5.js


const v5 = v35("v5", 0x50, esm_node_sha1);
/* harmony default export */ const esm_node_v5 = (v5);

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/nil.js
/* harmony default export */ const nil = ("00000000-0000-0000-0000-000000000000");

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/version.js

function version(uuid) {
    if (!esm_node_validate(uuid)) {
        throw TypeError("Invalid UUID");
    }
    return parseInt(uuid.substr(14, 1), 16);
}
/* harmony default export */ const esm_node_version = (version);

;// CONCATENATED MODULE: ./node_modules/uuid/dist/esm-node/index.js











/***/ }),

/***/ 11212:
/***/ ((module) => {

"use strict";

module.exports = function(Yallist) {
    Yallist.prototype[Symbol.iterator] = function*() {
        for(let walker = this.head; walker; walker = walker.next){
            yield walker.value;
        }
    };
};


/***/ }),

/***/ 66349:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

module.exports = Yallist;
Yallist.Node = Node;
Yallist.create = Yallist;
function Yallist(list) {
    var self = this;
    if (!(self instanceof Yallist)) {
        self = new Yallist();
    }
    self.tail = null;
    self.head = null;
    self.length = 0;
    if (list && typeof list.forEach === "function") {
        list.forEach(function(item) {
            self.push(item);
        });
    } else if (arguments.length > 0) {
        for(var i = 0, l = arguments.length; i < l; i++){
            self.push(arguments[i]);
        }
    }
    return self;
}
Yallist.prototype.removeNode = function(node) {
    if (node.list !== this) {
        throw new Error("removing node which does not belong to this list");
    }
    var next = node.next;
    var prev = node.prev;
    if (next) {
        next.prev = prev;
    }
    if (prev) {
        prev.next = next;
    }
    if (node === this.head) {
        this.head = next;
    }
    if (node === this.tail) {
        this.tail = prev;
    }
    node.list.length--;
    node.next = null;
    node.prev = null;
    node.list = null;
    return next;
};
Yallist.prototype.unshiftNode = function(node) {
    if (node === this.head) {
        return;
    }
    if (node.list) {
        node.list.removeNode(node);
    }
    var head = this.head;
    node.list = this;
    node.next = head;
    if (head) {
        head.prev = node;
    }
    this.head = node;
    if (!this.tail) {
        this.tail = node;
    }
    this.length++;
};
Yallist.prototype.pushNode = function(node) {
    if (node === this.tail) {
        return;
    }
    if (node.list) {
        node.list.removeNode(node);
    }
    var tail = this.tail;
    node.list = this;
    node.prev = tail;
    if (tail) {
        tail.next = node;
    }
    this.tail = node;
    if (!this.head) {
        this.head = node;
    }
    this.length++;
};
Yallist.prototype.push = function() {
    for(var i = 0, l = arguments.length; i < l; i++){
        push(this, arguments[i]);
    }
    return this.length;
};
Yallist.prototype.unshift = function() {
    for(var i = 0, l = arguments.length; i < l; i++){
        unshift(this, arguments[i]);
    }
    return this.length;
};
Yallist.prototype.pop = function() {
    if (!this.tail) {
        return undefined;
    }
    var res = this.tail.value;
    this.tail = this.tail.prev;
    if (this.tail) {
        this.tail.next = null;
    } else {
        this.head = null;
    }
    this.length--;
    return res;
};
Yallist.prototype.shift = function() {
    if (!this.head) {
        return undefined;
    }
    var res = this.head.value;
    this.head = this.head.next;
    if (this.head) {
        this.head.prev = null;
    } else {
        this.tail = null;
    }
    this.length--;
    return res;
};
Yallist.prototype.forEach = function(fn, thisp) {
    thisp = thisp || this;
    for(var walker = this.head, i = 0; walker !== null; i++){
        fn.call(thisp, walker.value, i, this);
        walker = walker.next;
    }
};
Yallist.prototype.forEachReverse = function(fn, thisp) {
    thisp = thisp || this;
    for(var walker = this.tail, i = this.length - 1; walker !== null; i--){
        fn.call(thisp, walker.value, i, this);
        walker = walker.prev;
    }
};
Yallist.prototype.get = function(n) {
    for(var i = 0, walker = this.head; walker !== null && i < n; i++){
        // abort out of the list early if we hit a cycle
        walker = walker.next;
    }
    if (i === n && walker !== null) {
        return walker.value;
    }
};
Yallist.prototype.getReverse = function(n) {
    for(var i = 0, walker = this.tail; walker !== null && i < n; i++){
        // abort out of the list early if we hit a cycle
        walker = walker.prev;
    }
    if (i === n && walker !== null) {
        return walker.value;
    }
};
Yallist.prototype.map = function(fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist();
    for(var walker = this.head; walker !== null;){
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.next;
    }
    return res;
};
Yallist.prototype.mapReverse = function(fn, thisp) {
    thisp = thisp || this;
    var res = new Yallist();
    for(var walker = this.tail; walker !== null;){
        res.push(fn.call(thisp, walker.value, this));
        walker = walker.prev;
    }
    return res;
};
Yallist.prototype.reduce = function(fn, initial) {
    var acc;
    var walker = this.head;
    if (arguments.length > 1) {
        acc = initial;
    } else if (this.head) {
        walker = this.head.next;
        acc = this.head.value;
    } else {
        throw new TypeError("Reduce of empty list with no initial value");
    }
    for(var i = 0; walker !== null; i++){
        acc = fn(acc, walker.value, i);
        walker = walker.next;
    }
    return acc;
};
Yallist.prototype.reduceReverse = function(fn, initial) {
    var acc;
    var walker = this.tail;
    if (arguments.length > 1) {
        acc = initial;
    } else if (this.tail) {
        walker = this.tail.prev;
        acc = this.tail.value;
    } else {
        throw new TypeError("Reduce of empty list with no initial value");
    }
    for(var i = this.length - 1; walker !== null; i--){
        acc = fn(acc, walker.value, i);
        walker = walker.prev;
    }
    return acc;
};
Yallist.prototype.toArray = function() {
    var arr = new Array(this.length);
    for(var i = 0, walker = this.head; walker !== null; i++){
        arr[i] = walker.value;
        walker = walker.next;
    }
    return arr;
};
Yallist.prototype.toArrayReverse = function() {
    var arr = new Array(this.length);
    for(var i = 0, walker = this.tail; walker !== null; i++){
        arr[i] = walker.value;
        walker = walker.prev;
    }
    return arr;
};
Yallist.prototype.slice = function(from, to) {
    to = to || this.length;
    if (to < 0) {
        to += this.length;
    }
    from = from || 0;
    if (from < 0) {
        from += this.length;
    }
    var ret = new Yallist();
    if (to < from || to < 0) {
        return ret;
    }
    if (from < 0) {
        from = 0;
    }
    if (to > this.length) {
        to = this.length;
    }
    for(var i = 0, walker = this.head; walker !== null && i < from; i++){
        walker = walker.next;
    }
    for(; walker !== null && i < to; i++, walker = walker.next){
        ret.push(walker.value);
    }
    return ret;
};
Yallist.prototype.sliceReverse = function(from, to) {
    to = to || this.length;
    if (to < 0) {
        to += this.length;
    }
    from = from || 0;
    if (from < 0) {
        from += this.length;
    }
    var ret = new Yallist();
    if (to < from || to < 0) {
        return ret;
    }
    if (from < 0) {
        from = 0;
    }
    if (to > this.length) {
        to = this.length;
    }
    for(var i = this.length, walker = this.tail; walker !== null && i > to; i--){
        walker = walker.prev;
    }
    for(; walker !== null && i > from; i--, walker = walker.prev){
        ret.push(walker.value);
    }
    return ret;
};
Yallist.prototype.splice = function(start, deleteCount, ...nodes) {
    if (start > this.length) {
        start = this.length - 1;
    }
    if (start < 0) {
        start = this.length + start;
    }
    for(var i = 0, walker = this.head; walker !== null && i < start; i++){
        walker = walker.next;
    }
    var ret = [];
    for(var i = 0; walker && i < deleteCount; i++){
        ret.push(walker.value);
        walker = this.removeNode(walker);
    }
    if (walker === null) {
        walker = this.tail;
    }
    if (walker !== this.head && walker !== this.tail) {
        walker = walker.prev;
    }
    for(var i = 0; i < nodes.length; i++){
        walker = insert(this, walker, nodes[i]);
    }
    return ret;
};
Yallist.prototype.reverse = function() {
    var head = this.head;
    var tail = this.tail;
    for(var walker = head; walker !== null; walker = walker.prev){
        var p = walker.prev;
        walker.prev = walker.next;
        walker.next = p;
    }
    this.head = tail;
    this.tail = head;
    return this;
};
function insert(self, node, value) {
    var inserted = node === self.head ? new Node(value, null, node, self) : new Node(value, node, node.next, self);
    if (inserted.next === null) {
        self.tail = inserted;
    }
    if (inserted.prev === null) {
        self.head = inserted;
    }
    self.length++;
    return inserted;
}
function push(self, item) {
    self.tail = new Node(item, self.tail, null, self);
    if (!self.head) {
        self.head = self.tail;
    }
    self.length++;
}
function unshift(self, item) {
    self.head = new Node(item, null, self.head, self);
    if (!self.tail) {
        self.tail = self.head;
    }
    self.length++;
}
function Node(value, prev, next, list) {
    if (!(this instanceof Node)) {
        return new Node(value, prev, next, list);
    }
    this.list = list;
    this.value = value;
    if (prev) {
        prev.next = this;
        this.prev = prev;
    } else {
        this.prev = null;
    }
    if (next) {
        next.prev = this;
        this.next = next;
    } else {
        this.next = null;
    }
}
try {
    // add if support for Symbol.iterator is present
    __webpack_require__(11212)(Yallist);
} catch (er) {}


/***/ }),

/***/ 63431:
/***/ ((module) => {

"use strict";

function _assertThisInitialized(self) {
    if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self;
}
module.exports = _assertThisInitialized, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 22657:
/***/ ((module) => {

"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _asyncToGenerator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 83338:
/***/ ((module) => {

"use strict";

function _classApplyDescriptorGet(receiver, descriptor) {
    if (descriptor.get) {
        return descriptor.get.call(receiver);
    }
    return descriptor.value;
}
module.exports = _classApplyDescriptorGet, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 46872:
/***/ ((module) => {

"use strict";

function _classApplyDescriptorSet(receiver, descriptor, value) {
    if (descriptor.set) {
        descriptor.set.call(receiver, value);
    } else {
        if (!descriptor.writable) {
            throw new TypeError("attempted to set read only private field");
        }
        descriptor.value = value;
    }
}
module.exports = _classApplyDescriptorSet, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 38446:
/***/ ((module) => {

"use strict";

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
module.exports = _classCallCheck, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 50009:
/***/ ((module) => {

"use strict";

function _classExtractFieldDescriptor(receiver, privateMap, action) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to " + action + " private field on non-instance");
    }
    return privateMap.get(receiver);
}
module.exports = _classExtractFieldDescriptor, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 81444:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classApplyDescriptorGet = __webpack_require__(83338);
var classExtractFieldDescriptor = __webpack_require__(50009);
function _classPrivateFieldGet(receiver, privateMap) {
    var descriptor = classExtractFieldDescriptor(receiver, privateMap, "get");
    return classApplyDescriptorGet(receiver, descriptor);
}
module.exports = _classPrivateFieldGet, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 88471:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var classApplyDescriptorSet = __webpack_require__(46872);
var classExtractFieldDescriptor = __webpack_require__(50009);
function _classPrivateFieldSet(receiver, privateMap, value) {
    var descriptor = classExtractFieldDescriptor(receiver, privateMap, "set");
    classApplyDescriptorSet(receiver, descriptor, value);
    return value;
}
module.exports = _classPrivateFieldSet, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 62886:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var setPrototypeOf = __webpack_require__(19);
var isNativeReflectConstruct = __webpack_require__(10066);
function _construct(Parent, args, Class) {
    if (isNativeReflectConstruct()) {
        module.exports = _construct = Reflect.construct.bind(), module.exports.__esModule = true, module.exports["default"] = module.exports;
    } else {
        module.exports = _construct = function _construct(Parent, args, Class) {
            var a = [
                null
            ];
            a.push.apply(a, args);
            var Constructor = Function.bind.apply(Parent, a);
            var instance = new Constructor();
            if (Class) setPrototypeOf(instance, Class.prototype);
            return instance;
        }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    }
    return _construct.apply(null, arguments);
}
module.exports = _construct, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 88805:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toPropertyKey = __webpack_require__(29495);
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, toPropertyKey(descriptor.key), descriptor);
    }
}
function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
        writable: false
    });
    return Constructor;
}
module.exports = _createClass, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 78256:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var toPropertyKey = __webpack_require__(29495);
function _defineProperty(obj, key, value) {
    key = toPropertyKey(key);
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
module.exports = _defineProperty, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 67842:
/***/ ((module) => {

"use strict";

function _extends() {
    module.exports = _extends = Object.assign ? Object.assign.bind() : function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    return _extends.apply(this, arguments);
}
module.exports = _extends, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 73838:
/***/ ((module) => {

"use strict";

function _getPrototypeOf(o) {
    module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    return _getPrototypeOf(o);
}
module.exports = _getPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 88457:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var setPrototypeOf = __webpack_require__(19);
function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            writable: true,
            configurable: true
        }
    });
    Object.defineProperty(subClass, "prototype", {
        writable: false
    });
    if (superClass) setPrototypeOf(subClass, superClass);
}
module.exports = _inherits, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 94483:
/***/ ((module) => {

"use strict";

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        "default": obj
    };
}
module.exports = _interopRequireDefault, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 60770:
/***/ ((module) => {

"use strict";

function _isNativeFunction(fn) {
    try {
        return Function.toString.call(fn).indexOf("[native code]") !== -1;
    } catch (e) {
        return typeof fn === "function";
    }
}
module.exports = _isNativeFunction, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 10066:
/***/ ((module) => {

"use strict";

function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct) return false;
    if (Reflect.construct.sham) return false;
    if (typeof Proxy === "function") return true;
    try {
        Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {}));
        return true;
    } catch (e) {
        return false;
    }
}
module.exports = _isNativeReflectConstruct, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 56874:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var _typeof = (__webpack_require__(62074)["default"]);
var assertThisInitialized = __webpack_require__(63431);
function _possibleConstructorReturn(self, call) {
    if (call && (_typeof(call) === "object" || typeof call === "function")) {
        return call;
    } else if (call !== void 0) {
        throw new TypeError("Derived constructors may only return object or undefined");
    }
    return assertThisInitialized(self);
}
module.exports = _possibleConstructorReturn, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 77375:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var _typeof = (__webpack_require__(62074)["default"]);
function _regeneratorRuntime() {
    "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ 
    module.exports = _regeneratorRuntime = function _regeneratorRuntime() {
        return e;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function(t, e, r) {
        t[e] = r.value;
    }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag";
    function define(t, e, r) {
        return Object.defineProperty(t, e, {
            value: r,
            enumerable: !0,
            configurable: !0,
            writable: !0
        }), t[e];
    }
    try {
        define({}, "");
    } catch (t) {
        define = function define(t, e, r) {
            return t[e] = r;
        };
    }
    function wrap(t, e, r, n) {
        var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []);
        return o(a, "_invoke", {
            value: makeInvokeMethod(t, r, c)
        }), a;
    }
    function tryCatch(t, e, r) {
        try {
            return {
                type: "normal",
                arg: t.call(e, r)
            };
        } catch (t) {
            return {
                type: "throw",
                arg: t
            };
        }
    }
    e.wrap = wrap;
    var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var p = {};
    define(p, a, function() {
        return this;
    });
    var d = Object.getPrototypeOf, v = d && d(d(values([])));
    v && v !== r && n.call(v, a) && (p = v);
    var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
    function defineIteratorMethods(t) {
        [
            "next",
            "throw",
            "return"
        ].forEach(function(e) {
            define(t, e, function(t) {
                return this._invoke(e, t);
            });
        });
    }
    function AsyncIterator(t, e) {
        function invoke(r, o, i, a) {
            var c = tryCatch(t[r], t, o);
            if ("throw" !== c.type) {
                var u = c.arg, h = u.value;
                return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function(t) {
                    invoke("next", t, i, a);
                }, function(t) {
                    invoke("throw", t, i, a);
                }) : e.resolve(h).then(function(t) {
                    u.value = t, i(u);
                }, function(t) {
                    return invoke("throw", t, i, a);
                });
            }
            a(c.arg);
        }
        var r;
        o(this, "_invoke", {
            value: function value(t, n) {
                function callInvokeWithMethodAndArg() {
                    return new e(function(e, r) {
                        invoke(t, n, e, r);
                    });
                }
                return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
            }
        });
    }
    function makeInvokeMethod(e, r, n) {
        var o = h;
        return function(i, a) {
            if (o === f) throw new Error("Generator is already running");
            if (o === s) {
                if ("throw" === i) throw a;
                return {
                    value: t,
                    done: !0
                };
            }
            for(n.method = i, n.arg = a;;){
                var c = n.delegate;
                if (c) {
                    var u = maybeInvokeDelegate(c, n);
                    if (u) {
                        if (u === y) continue;
                        return u;
                    }
                }
                if ("next" === n.method) n.sent = n._sent = n.arg;
                else if ("throw" === n.method) {
                    if (o === h) throw o = s, n.arg;
                    n.dispatchException(n.arg);
                } else "return" === n.method && n.abrupt("return", n.arg);
                o = f;
                var p = tryCatch(e, r, n);
                if ("normal" === p.type) {
                    if (o = n.done ? s : l, p.arg === y) continue;
                    return {
                        value: p.arg,
                        done: n.done
                    };
                }
                "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
            }
        };
    }
    function maybeInvokeDelegate(e, r) {
        var n = r.method, o = e.iterator[n];
        if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
        var i = tryCatch(o, e.iterator, r.arg);
        if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
        var a = i.arg;
        return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
    }
    function pushTryEntry(t) {
        var e = {
            tryLoc: t[0]
        };
        1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
    }
    function resetTryEntry(t) {
        var e = t.completion || {};
        e.type = "normal", delete e.arg, t.completion = e;
    }
    function Context(t) {
        this.tryEntries = [
            {
                tryLoc: "root"
            }
        ], t.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(e) {
        if (e || "" === e) {
            var r = e[a];
            if (r) return r.call(e);
            if ("function" == typeof e.next) return e;
            if (!isNaN(e.length)) {
                var o = -1, i = function next() {
                    for(; ++o < e.length;)if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
                    return next.value = t, next.done = !0, next;
                };
                return i.next = i;
            }
        }
        throw new TypeError(_typeof(e) + " is not iterable");
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
        value: GeneratorFunctionPrototype,
        configurable: !0
    }), o(GeneratorFunctionPrototype, "constructor", {
        value: GeneratorFunction,
        configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function(t) {
        var e = "function" == typeof t && t.constructor;
        return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
    }, e.mark = function(t) {
        return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
    }, e.awrap = function(t) {
        return {
            __await: t
        };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function() {
        return this;
    }), e.AsyncIterator = AsyncIterator, e.async = function(t, r, n, o, i) {
        void 0 === i && (i = Promise);
        var a = new AsyncIterator(wrap(t, r, n, o), i);
        return e.isGeneratorFunction(r) ? a : a.next().then(function(t) {
            return t.done ? t.value : a.next();
        });
    }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function() {
        return this;
    }), define(g, "toString", function() {
        return "[object Generator]";
    }), e.keys = function(t) {
        var e = Object(t), r = [];
        for(var n in e)r.push(n);
        return r.reverse(), function next() {
            for(; r.length;){
                var t = r.pop();
                if (t in e) return next.value = t, next.done = !1, next;
            }
            return next.done = !0, next;
        };
    }, e.values = values, Context.prototype = {
        constructor: Context,
        reset: function reset(e) {
            if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for(var r in this)"t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
        },
        stop: function stop() {
            this.done = !0;
            var t = this.tryEntries[0].completion;
            if ("throw" === t.type) throw t.arg;
            return this.rval;
        },
        dispatchException: function dispatchException(e) {
            if (this.done) throw e;
            var r = this;
            function handle(n, o) {
                return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
            }
            for(var o = this.tryEntries.length - 1; o >= 0; --o){
                var i = this.tryEntries[o], a = i.completion;
                if ("root" === i.tryLoc) return handle("end");
                if (i.tryLoc <= this.prev) {
                    var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc");
                    if (c && u) {
                        if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
                        if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
                    } else if (c) {
                        if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
                    } else {
                        if (!u) throw new Error("try statement without catch or finally");
                        if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
                    }
                }
            }
        },
        abrupt: function abrupt(t, e) {
            for(var r = this.tryEntries.length - 1; r >= 0; --r){
                var o = this.tryEntries[r];
                if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
                    var i = o;
                    break;
                }
            }
            i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
            var a = i ? i.completion : {};
            return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
        },
        complete: function complete(t, e) {
            if ("throw" === t.type) throw t.arg;
            return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
        },
        finish: function finish(t) {
            for(var e = this.tryEntries.length - 1; e >= 0; --e){
                var r = this.tryEntries[e];
                if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
            }
        },
        "catch": function _catch(t) {
            for(var e = this.tryEntries.length - 1; e >= 0; --e){
                var r = this.tryEntries[e];
                if (r.tryLoc === t) {
                    var n = r.completion;
                    if ("throw" === n.type) {
                        var o = n.arg;
                        resetTryEntry(r);
                    }
                    return o;
                }
            }
            throw new Error("illegal catch attempt");
        },
        delegateYield: function delegateYield(e, r, n) {
            return this.delegate = {
                iterator: values(e),
                resultName: r,
                nextLoc: n
            }, "next" === this.method && (this.arg = t), y;
        }
    }, e;
}
module.exports = _regeneratorRuntime, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 19:
/***/ ((module) => {

"use strict";

function _setPrototypeOf(o, p) {
    module.exports = _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) {
        o.__proto__ = p;
        return o;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    return _setPrototypeOf(o, p);
}
module.exports = _setPrototypeOf, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 94792:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var _typeof = (__webpack_require__(62074)["default"]);
function _toPrimitive(input, hint) {
    if (_typeof(input) !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
        var res = prim.call(input, hint || "default");
        if (_typeof(res) !== "object") return res;
        throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
}
module.exports = _toPrimitive, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 29495:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var _typeof = (__webpack_require__(62074)["default"]);
var toPrimitive = __webpack_require__(94792);
function _toPropertyKey(arg) {
    var key = toPrimitive(arg, "string");
    return _typeof(key) === "symbol" ? key : String(key);
}
module.exports = _toPropertyKey, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 62074:
/***/ ((module) => {

"use strict";

function _typeof(o) {
    "@babel/helpers - typeof";
    return module.exports = _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
        return typeof o;
    } : function(o) {
        return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, module.exports.__esModule = true, module.exports["default"] = module.exports, _typeof(o);
}
module.exports = _typeof, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 37774:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";

var getPrototypeOf = __webpack_require__(73838);
var setPrototypeOf = __webpack_require__(19);
var isNativeFunction = __webpack_require__(60770);
var construct = __webpack_require__(62886);
function _wrapNativeSuper(Class) {
    var _cache = typeof Map === "function" ? new Map() : undefined;
    module.exports = _wrapNativeSuper = function _wrapNativeSuper(Class) {
        if (Class === null || !isNativeFunction(Class)) return Class;
        if (typeof Class !== "function") {
            throw new TypeError("Super expression must either be null or a function");
        }
        if (typeof _cache !== "undefined") {
            if (_cache.has(Class)) return _cache.get(Class);
            _cache.set(Class, Wrapper);
        }
        function Wrapper() {
            return construct(Class, arguments, getPrototypeOf(this).constructor);
        }
        Wrapper.prototype = Object.create(Class.prototype, {
            constructor: {
                value: Wrapper,
                enumerable: false,
                writable: true,
                configurable: true
            }
        });
        return setPrototypeOf(Wrapper, Class);
    }, module.exports.__esModule = true, module.exports["default"] = module.exports;
    return _wrapNativeSuper(Class);
}
module.exports = _wrapNativeSuper, module.exports.__esModule = true, module.exports["default"] = module.exports;


/***/ }),

/***/ 88150:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
// TODO(Babel 8): Remove this file.

var runtime = __webpack_require__(77375)();
module.exports = runtime;
// Copied from https://github.com/facebook/regenerator/blob/main/packages/runtime/runtime.js#L736=
try {
    regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
    if (typeof globalThis === "object") {
        globalThis.regeneratorRuntime = runtime;
    } else {
        Function("r", "regeneratorRuntime = r")(runtime);
    }
}


/***/ }),

/***/ 8138:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   d7: () => (/* binding */ AxiosError)
/* harmony export */ });
/* unused harmony exports Axios, CanceledError, isCancel, CancelToken, VERSION, all, Cancel, isAxiosError, spread, toFormData, AxiosHeaders, HttpStatusCode, formToJSON, getAdapter, mergeConfig */
/* harmony import */ var _lib_axios_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22878);

// This module is intended to unwrap Axios default export as named.
// Keep top-level export same with static properties
// so that it can keep same with es module or cjs
const { Axios, AxiosError, CanceledError, isCancel, CancelToken, VERSION, all, Cancel, isAxiosError, spread, toFormData, AxiosHeaders, HttpStatusCode, formToJSON, getAdapter, mergeConfig } = _lib_axios_js__WEBPACK_IMPORTED_MODULE_0__["default"];



/***/ }),

/***/ 22878:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ lib_axios)
});

// NAMESPACE OBJECT: ./node_modules/axios/lib/platform/common/utils.js
var common_utils_namespaceObject = {};
__webpack_require__.r(common_utils_namespaceObject);
__webpack_require__.d(common_utils_namespaceObject, {
  hasBrowserEnv: () => (hasBrowserEnv),
  hasStandardBrowserEnv: () => (hasStandardBrowserEnv),
  hasStandardBrowserWebWorkerEnv: () => (hasStandardBrowserWebWorkerEnv)
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/bind.js

function bind(fn, thisArg) {
    return function wrap() {
        return fn.apply(thisArg, arguments);
    };
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/utils.js


// utils is a library of generic helper functions non-specific to axios
const { toString: utils_toString } = Object.prototype;
const { getPrototypeOf } = Object;
const kindOf = ((cache)=>(thing)=>{
        const str = utils_toString.call(thing);
        return cache[str] || (cache[str] = str.slice(8, -1).toLowerCase());
    })(Object.create(null));
const kindOfTest = (type)=>{
    type = type.toLowerCase();
    return (thing)=>kindOf(thing) === type;
};
const typeOfTest = (type)=>(thing)=>typeof thing === type;
/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 *
 * @returns {boolean} True if value is an Array, otherwise false
 */ const { isArray } = Array;
/**
 * Determine if a value is undefined
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if the value is undefined, otherwise false
 */ const isUndefined = typeOfTest("undefined");
/**
 * Determine if a value is a Buffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Buffer, otherwise false
 */ function isBuffer(val) {
    return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */ const isArrayBuffer = kindOfTest("ArrayBuffer");
/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */ function isArrayBufferView(val) {
    let result;
    if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
        result = ArrayBuffer.isView(val);
    } else {
        result = val && val.buffer && isArrayBuffer(val.buffer);
    }
    return result;
}
/**
 * Determine if a value is a String
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a String, otherwise false
 */ const isString = typeOfTest("string");
/**
 * Determine if a value is a Function
 *
 * @param {*} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */ const isFunction = typeOfTest("function");
/**
 * Determine if a value is a Number
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Number, otherwise false
 */ const isNumber = typeOfTest("number");
/**
 * Determine if a value is an Object
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an Object, otherwise false
 */ const isObject = (thing)=>thing !== null && typeof thing === "object";
/**
 * Determine if a value is a Boolean
 *
 * @param {*} thing The value to test
 * @returns {boolean} True if value is a Boolean, otherwise false
 */ const isBoolean = (thing)=>thing === true || thing === false;
/**
 * Determine if a value is a plain Object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a plain Object, otherwise false
 */ const isPlainObject = (val)=>{
    if (kindOf(val) !== "object") {
        return false;
    }
    const prototype = getPrototypeOf(val);
    return (prototype === null || prototype === Object.prototype || Object.getPrototypeOf(prototype) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};
/**
 * Determine if a value is a Date
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Date, otherwise false
 */ const isDate = kindOfTest("Date");
/**
 * Determine if a value is a File
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */ const isFile = kindOfTest("File");
/**
 * Determine if a value is a Blob
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Blob, otherwise false
 */ const isBlob = kindOfTest("Blob");
/**
 * Determine if a value is a FileList
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a File, otherwise false
 */ const isFileList = kindOfTest("FileList");
/**
 * Determine if a value is a Stream
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a Stream, otherwise false
 */ const isStream = (val)=>isObject(val) && isFunction(val.pipe);
/**
 * Determine if a value is a FormData
 *
 * @param {*} thing The value to test
 *
 * @returns {boolean} True if value is an FormData, otherwise false
 */ const isFormData = (thing)=>{
    let kind;
    return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
    kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
};
/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */ const isURLSearchParams = kindOfTest("URLSearchParams");
/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 *
 * @returns {String} The String freed of excess whitespace
 */ const trim = (str)=>str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 *
 * @param {Boolean} [allOwnKeys = false]
 * @returns {any}
 */ function forEach(obj, fn, { allOwnKeys = false } = {}) {
    // Don't bother if no value provided
    if (obj === null || typeof obj === "undefined") {
        return;
    }
    let i;
    let l;
    // Force an array if not already something iterable
    if (typeof obj !== "object") {
        /*eslint no-param-reassign:0*/ obj = [
            obj
        ];
    }
    if (isArray(obj)) {
        // Iterate over array values
        for(i = 0, l = obj.length; i < l; i++){
            fn.call(null, obj[i], i, obj);
        }
    } else {
        // Iterate over object keys
        const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
        const len = keys.length;
        let key;
        for(i = 0; i < len; i++){
            key = keys[i];
            fn.call(null, obj[key], key, obj);
        }
    }
}
function findKey(obj, key) {
    key = key.toLowerCase();
    const keys = Object.keys(obj);
    let i = keys.length;
    let _key;
    while(i-- > 0){
        _key = keys[i];
        if (key === _key.toLowerCase()) {
            return _key;
        }
    }
    return null;
}
const _global = (()=>{
    /*eslint no-undef:0*/ if (typeof globalThis !== "undefined") return globalThis;
    return typeof self !== "undefined" ? self :  false ? 0 : global;
})();
const isContextDefined = (context)=>!isUndefined(context) && context !== _global;
/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 *
 * @returns {Object} Result of all merge properties
 */ function merge() {
    const { caseless } = isContextDefined(this) && this || {};
    const result = {};
    const assignValue = (val, key)=>{
        const targetKey = caseless && findKey(result, key) || key;
        if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
            result[targetKey] = merge(result[targetKey], val);
        } else if (isPlainObject(val)) {
            result[targetKey] = merge({}, val);
        } else if (isArray(val)) {
            result[targetKey] = val.slice();
        } else {
            result[targetKey] = val;
        }
    };
    for(let i = 0, l = arguments.length; i < l; i++){
        arguments[i] && forEach(arguments[i], assignValue);
    }
    return result;
}
/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 *
 * @param {Boolean} [allOwnKeys]
 * @returns {Object} The resulting value of object a
 */ const extend = (a, b, thisArg, { allOwnKeys } = {})=>{
    forEach(b, (val, key)=>{
        if (thisArg && isFunction(val)) {
            a[key] = bind(val, thisArg);
        } else {
            a[key] = val;
        }
    }, {
        allOwnKeys
    });
    return a;
};
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 *
 * @param {string} content with BOM
 *
 * @returns {string} content value without BOM
 */ const stripBOM = (content)=>{
    if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
    }
    return content;
};
/**
 * Inherit the prototype methods from one constructor into another
 * @param {function} constructor
 * @param {function} superConstructor
 * @param {object} [props]
 * @param {object} [descriptors]
 *
 * @returns {void}
 */ const inherits = (constructor, superConstructor, props, descriptors)=>{
    constructor.prototype = Object.create(superConstructor.prototype, descriptors);
    constructor.prototype.constructor = constructor;
    Object.defineProperty(constructor, "super", {
        value: superConstructor.prototype
    });
    props && Object.assign(constructor.prototype, props);
};
/**
 * Resolve object with deep prototype chain to a flat object
 * @param {Object} sourceObj source object
 * @param {Object} [destObj]
 * @param {Function|Boolean} [filter]
 * @param {Function} [propFilter]
 *
 * @returns {Object}
 */ const toFlatObject = (sourceObj, destObj, filter, propFilter)=>{
    let props;
    let i;
    let prop;
    const merged = {};
    destObj = destObj || {};
    // eslint-disable-next-line no-eq-null,eqeqeq
    if (sourceObj == null) return destObj;
    do {
        props = Object.getOwnPropertyNames(sourceObj);
        i = props.length;
        while(i-- > 0){
            prop = props[i];
            if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
                destObj[prop] = sourceObj[prop];
                merged[prop] = true;
            }
        }
        sourceObj = filter !== false && getPrototypeOf(sourceObj);
    }while (sourceObj && (!filter || filter(sourceObj, destObj)) && sourceObj !== Object.prototype);
    return destObj;
};
/**
 * Determines whether a string ends with the characters of a specified string
 *
 * @param {String} str
 * @param {String} searchString
 * @param {Number} [position= 0]
 *
 * @returns {boolean}
 */ const endsWith = (str, searchString, position)=>{
    str = String(str);
    if (position === undefined || position > str.length) {
        position = str.length;
    }
    position -= searchString.length;
    const lastIndex = str.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
};
/**
 * Returns new array from array like object or null if failed
 *
 * @param {*} [thing]
 *
 * @returns {?Array}
 */ const toArray = (thing)=>{
    if (!thing) return null;
    if (isArray(thing)) return thing;
    let i = thing.length;
    if (!isNumber(i)) return null;
    const arr = new Array(i);
    while(i-- > 0){
        arr[i] = thing[i];
    }
    return arr;
};
/**
 * Checking if the Uint8Array exists and if it does, it returns a function that checks if the
 * thing passed in is an instance of Uint8Array
 *
 * @param {TypedArray}
 *
 * @returns {Array}
 */ // eslint-disable-next-line func-names
const isTypedArray = ((TypedArray)=>{
    // eslint-disable-next-line func-names
    return (thing)=>{
        return TypedArray && thing instanceof TypedArray;
    };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
/**
 * For each entry in the object, call the function with the key and value.
 *
 * @param {Object<any, any>} obj - The object to iterate over.
 * @param {Function} fn - The function to call for each entry.
 *
 * @returns {void}
 */ const forEachEntry = (obj, fn)=>{
    const generator = obj && obj[Symbol.iterator];
    const iterator = generator.call(obj);
    let result;
    while((result = iterator.next()) && !result.done){
        const pair = result.value;
        fn.call(obj, pair[0], pair[1]);
    }
};
/**
 * It takes a regular expression and a string, and returns an array of all the matches
 *
 * @param {string} regExp - The regular expression to match against.
 * @param {string} str - The string to search.
 *
 * @returns {Array<boolean>}
 */ const matchAll = (regExp, str)=>{
    let matches;
    const arr = [];
    while((matches = regExp.exec(str)) !== null){
        arr.push(matches);
    }
    return arr;
};
/* Checking if the kindOfTest function returns true when passed an HTMLFormElement. */ const isHTMLForm = kindOfTest("HTMLFormElement");
const toCamelCase = (str)=>{
    return str.toLowerCase().replace(/[-_\s]([a-z\d])(\w*)/g, function replacer(m, p1, p2) {
        return p1.toUpperCase() + p2;
    });
};
/* Creating a function that will check if an object has a property. */ const utils_hasOwnProperty = (({ hasOwnProperty })=>(obj, prop)=>hasOwnProperty.call(obj, prop))(Object.prototype);
/**
 * Determine if a value is a RegExp object
 *
 * @param {*} val The value to test
 *
 * @returns {boolean} True if value is a RegExp object, otherwise false
 */ const isRegExp = kindOfTest("RegExp");
const reduceDescriptors = (obj, reducer)=>{
    const descriptors = Object.getOwnPropertyDescriptors(obj);
    const reducedDescriptors = {};
    forEach(descriptors, (descriptor, name)=>{
        let ret;
        if ((ret = reducer(descriptor, name, obj)) !== false) {
            reducedDescriptors[name] = ret || descriptor;
        }
    });
    Object.defineProperties(obj, reducedDescriptors);
};
/**
 * Makes all methods read-only
 * @param {Object} obj
 */ const freezeMethods = (obj)=>{
    reduceDescriptors(obj, (descriptor, name)=>{
        // skip restricted props in strict mode
        if (isFunction(obj) && [
            "arguments",
            "caller",
            "callee"
        ].indexOf(name) !== -1) {
            return false;
        }
        const value = obj[name];
        if (!isFunction(value)) return;
        descriptor.enumerable = false;
        if ("writable" in descriptor) {
            descriptor.writable = false;
            return;
        }
        if (!descriptor.set) {
            descriptor.set = ()=>{
                throw Error("Can not rewrite read-only method '" + name + "'");
            };
        }
    });
};
const toObjectSet = (arrayOrString, delimiter)=>{
    const obj = {};
    const define = (arr)=>{
        arr.forEach((value)=>{
            obj[value] = true;
        });
    };
    isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
    return obj;
};
const noop = ()=>{};
const toFiniteNumber = (value, defaultValue)=>{
    value = +value;
    return Number.isFinite(value) ? value : defaultValue;
};
const ALPHA = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "0123456789";
const ALPHABET = {
    DIGIT,
    ALPHA,
    ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT)=>{
    let str = "";
    const { length } = alphabet;
    while(size--){
        str += alphabet[Math.random() * length | 0];
    }
    return str;
};
/**
 * If the thing is a FormData object, return true, otherwise return false.
 *
 * @param {unknown} thing - The thing to check.
 *
 * @returns {boolean}
 */ function isSpecCompliantForm(thing) {
    return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
}
const toJSONObject = (obj)=>{
    const stack = new Array(10);
    const visit = (source, i)=>{
        if (isObject(source)) {
            if (stack.indexOf(source) >= 0) {
                return;
            }
            if (!("toJSON" in source)) {
                stack[i] = source;
                const target = isArray(source) ? [] : {};
                forEach(source, (value, key)=>{
                    const reducedValue = visit(value, i + 1);
                    !isUndefined(reducedValue) && (target[key] = reducedValue);
                });
                stack[i] = undefined;
                return target;
            }
        }
        return source;
    };
    return visit(obj, 0);
};
const isAsyncFn = kindOfTest("AsyncFunction");
const isThenable = (thing)=>thing && (isObject(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
/* harmony default export */ const utils = ({
    isArray,
    isArrayBuffer,
    isBuffer,
    isFormData,
    isArrayBufferView,
    isString,
    isNumber,
    isBoolean,
    isObject,
    isPlainObject,
    isUndefined,
    isDate,
    isFile,
    isBlob,
    isRegExp,
    isFunction,
    isStream,
    isURLSearchParams,
    isTypedArray,
    isFileList,
    forEach,
    merge,
    extend,
    trim,
    stripBOM,
    inherits,
    toFlatObject,
    kindOf,
    kindOfTest,
    endsWith,
    toArray,
    forEachEntry,
    matchAll,
    isHTMLForm,
    hasOwnProperty: utils_hasOwnProperty,
    hasOwnProp: utils_hasOwnProperty,
    reduceDescriptors,
    freezeMethods,
    toObjectSet,
    toCamelCase,
    noop,
    toFiniteNumber,
    findKey,
    global: _global,
    isContextDefined,
    ALPHABET,
    generateString,
    isSpecCompliantForm,
    toJSONObject,
    isAsyncFn,
    isThenable
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/AxiosError.js


/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [config] The config.
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 *
 * @returns {Error} The created error.
 */ function AxiosError(message, code, config, request, response) {
    Error.call(this);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
    } else {
        this.stack = new Error().stack;
    }
    this.message = message;
    this.name = "AxiosError";
    code && (this.code = code);
    config && (this.config = config);
    request && (this.request = request);
    response && (this.response = response);
}
utils.inherits(AxiosError, Error, {
    toJSON: function toJSON() {
        return {
            // Standard
            message: this.message,
            name: this.name,
            // Microsoft
            description: this.description,
            number: this.number,
            // Mozilla
            fileName: this.fileName,
            lineNumber: this.lineNumber,
            columnNumber: this.columnNumber,
            stack: this.stack,
            // Axios
            config: utils.toJSONObject(this.config),
            code: this.code,
            status: this.response && this.response.status ? this.response.status : null
        };
    }
});
const AxiosError_prototype = AxiosError.prototype;
const descriptors = {};
[
    "ERR_BAD_OPTION_VALUE",
    "ERR_BAD_OPTION",
    "ECONNABORTED",
    "ETIMEDOUT",
    "ERR_NETWORK",
    "ERR_FR_TOO_MANY_REDIRECTS",
    "ERR_DEPRECATED",
    "ERR_BAD_RESPONSE",
    "ERR_BAD_REQUEST",
    "ERR_CANCELED",
    "ERR_NOT_SUPPORT",
    "ERR_INVALID_URL"
].forEach((code)=>{
    descriptors[code] = {
        value: code
    };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(AxiosError_prototype, "isAxiosError", {
    value: true
});
// eslint-disable-next-line func-names
AxiosError.from = (error, code, config, request, response, customProps)=>{
    const axiosError = Object.create(AxiosError_prototype);
    utils.toFlatObject(error, axiosError, function filter(obj) {
        return obj !== Error.prototype;
    }, (prop)=>{
        return prop !== "isAxiosError";
    });
    AxiosError.call(axiosError, error.message, code, config, request, response);
    axiosError.cause = error;
    axiosError.name = error.name;
    customProps && Object.assign(axiosError, customProps);
    return axiosError;
};
/* harmony default export */ const core_AxiosError = (AxiosError);

// EXTERNAL MODULE: ./node_modules/form-data/lib/form_data.js
var form_data = __webpack_require__(28532);
;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/node/classes/FormData.js

/* harmony default export */ const classes_FormData = (form_data);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/toFormData.js



// temporary hotfix to avoid circular references until AxiosURLSearchParams is refactored

/**
 * Determines if the given thing is a array or js object.
 *
 * @param {string} thing - The object or array to be visited.
 *
 * @returns {boolean}
 */ function isVisitable(thing) {
    return utils.isPlainObject(thing) || utils.isArray(thing);
}
/**
 * It removes the brackets from the end of a string
 *
 * @param {string} key - The key of the parameter.
 *
 * @returns {string} the key without the brackets.
 */ function removeBrackets(key) {
    return utils.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
/**
 * It takes a path, a key, and a boolean, and returns a string
 *
 * @param {string} path - The path to the current key.
 * @param {string} key - The key of the current object being iterated over.
 * @param {string} dots - If true, the key will be rendered with dots instead of brackets.
 *
 * @returns {string} The path to the current key.
 */ function renderKey(path, key, dots) {
    if (!path) return key;
    return path.concat(key).map(function each(token, i) {
        // eslint-disable-next-line no-param-reassign
        token = removeBrackets(token);
        return !dots && i ? "[" + token + "]" : token;
    }).join(dots ? "." : "");
}
/**
 * If the array is an array and none of its elements are visitable, then it's a flat array.
 *
 * @param {Array<any>} arr - The array to check
 *
 * @returns {boolean}
 */ function isFlatArray(arr) {
    return utils.isArray(arr) && !arr.some(isVisitable);
}
const predicates = utils.toFlatObject(utils, {}, null, function filter(prop) {
    return /^is[A-Z]/.test(prop);
});
/**
 * Convert a data object to FormData
 *
 * @param {Object} obj
 * @param {?Object} [formData]
 * @param {?Object} [options]
 * @param {Function} [options.visitor]
 * @param {Boolean} [options.metaTokens = true]
 * @param {Boolean} [options.dots = false]
 * @param {?Boolean} [options.indexes = false]
 *
 * @returns {Object}
 **/ /**
 * It converts an object into a FormData object
 *
 * @param {Object<any, any>} obj - The object to convert to form data.
 * @param {string} formData - The FormData object to append to.
 * @param {Object<string, any>} options
 *
 * @returns
 */ function toFormData(obj, formData, options) {
    if (!utils.isObject(obj)) {
        throw new TypeError("target must be an object");
    }
    // eslint-disable-next-line no-param-reassign
    formData = formData || new (classes_FormData || FormData)();
    // eslint-disable-next-line no-param-reassign
    options = utils.toFlatObject(options, {
        metaTokens: true,
        dots: false,
        indexes: false
    }, false, function defined(option, source) {
        // eslint-disable-next-line no-eq-null,eqeqeq
        return !utils.isUndefined(source[option]);
    });
    const metaTokens = options.metaTokens;
    // eslint-disable-next-line no-use-before-define
    const visitor = options.visitor || defaultVisitor;
    const dots = options.dots;
    const indexes = options.indexes;
    const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
    const useBlob = _Blob && utils.isSpecCompliantForm(formData);
    if (!utils.isFunction(visitor)) {
        throw new TypeError("visitor must be a function");
    }
    function convertValue(value) {
        if (value === null) return "";
        if (utils.isDate(value)) {
            return value.toISOString();
        }
        if (!useBlob && utils.isBlob(value)) {
            throw new core_AxiosError("Blob is not supported. Use a Buffer instead.");
        }
        if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
            return useBlob && typeof Blob === "function" ? new Blob([
                value
            ]) : Buffer.from(value);
        }
        return value;
    }
    /**
   * Default visitor.
   *
   * @param {*} value
   * @param {String|Number} key
   * @param {Array<String|Number>} path
   * @this {FormData}
   *
   * @returns {boolean} return true to visit the each prop of the value recursively
   */ function defaultVisitor(value, key, path) {
        let arr = value;
        if (value && !path && typeof value === "object") {
            if (utils.endsWith(key, "{}")) {
                // eslint-disable-next-line no-param-reassign
                key = metaTokens ? key : key.slice(0, -2);
                // eslint-disable-next-line no-param-reassign
                value = JSON.stringify(value);
            } else if (utils.isArray(value) && isFlatArray(value) || (utils.isFileList(value) || utils.endsWith(key, "[]")) && (arr = utils.toArray(value))) {
                // eslint-disable-next-line no-param-reassign
                key = removeBrackets(key);
                arr.forEach(function each(el, index) {
                    !(utils.isUndefined(el) || el === null) && formData.append(// eslint-disable-next-line no-nested-ternary
                    indexes === true ? renderKey([
                        key
                    ], index, dots) : indexes === null ? key : key + "[]", convertValue(el));
                });
                return false;
            }
        }
        if (isVisitable(value)) {
            return true;
        }
        formData.append(renderKey(path, key, dots), convertValue(value));
        return false;
    }
    const stack = [];
    const exposedHelpers = Object.assign(predicates, {
        defaultVisitor,
        convertValue,
        isVisitable
    });
    function build(value, path) {
        if (utils.isUndefined(value)) return;
        if (stack.indexOf(value) !== -1) {
            throw Error("Circular reference detected in " + path.join("."));
        }
        stack.push(value);
        utils.forEach(value, function each(el, key) {
            const result = !(utils.isUndefined(el) || el === null) && visitor.call(formData, el, utils.isString(key) ? key.trim() : key, path, exposedHelpers);
            if (result === true) {
                build(el, path ? path.concat(key) : [
                    key
                ]);
            }
        });
        stack.pop();
    }
    if (!utils.isObject(obj)) {
        throw new TypeError("data must be an object");
    }
    build(obj);
    return formData;
}
/* harmony default export */ const helpers_toFormData = (toFormData);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/AxiosURLSearchParams.js


/**
 * It encodes a string by replacing all characters that are not in the unreserved set with
 * their percent-encoded equivalents
 *
 * @param {string} str - The string to encode.
 *
 * @returns {string} The encoded string.
 */ function encode(str) {
    const charMap = {
        "!": "%21",
        "'": "%27",
        "(": "%28",
        ")": "%29",
        "~": "%7E",
        "%20": "+",
        "%00": "\x00"
    };
    return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
        return charMap[match];
    });
}
/**
 * It takes a params object and converts it to a FormData object
 *
 * @param {Object<string, any>} params - The parameters to be converted to a FormData object.
 * @param {Object<string, any>} options - The options object passed to the Axios constructor.
 *
 * @returns {void}
 */ function AxiosURLSearchParams(params, options) {
    this._pairs = [];
    params && helpers_toFormData(params, this, options);
}
const AxiosURLSearchParams_prototype = AxiosURLSearchParams.prototype;
AxiosURLSearchParams_prototype.append = function append(name, value) {
    this._pairs.push([
        name,
        value
    ]);
};
AxiosURLSearchParams_prototype.toString = function toString(encoder) {
    const _encode = encoder ? function(value) {
        return encoder.call(this, value, encode);
    } : encode;
    return this._pairs.map(function each(pair) {
        return _encode(pair[0]) + "=" + _encode(pair[1]);
    }, "").join("&");
};
/* harmony default export */ const helpers_AxiosURLSearchParams = (AxiosURLSearchParams);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/buildURL.js



/**
 * It replaces all instances of the characters `:`, `$`, `,`, `+`, `[`, and `]` with their
 * URI encoded counterparts
 *
 * @param {string} val The value to be encoded.
 *
 * @returns {string} The encoded value.
 */ function buildURL_encode(val) {
    return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @param {?object} options
 *
 * @returns {string} The formatted url
 */ function buildURL(url, params, options) {
    /*eslint no-param-reassign:0*/ if (!params) {
        return url;
    }
    const _encode = options && options.encode || buildURL_encode;
    const serializeFn = options && options.serialize;
    let serializedParams;
    if (serializeFn) {
        serializedParams = serializeFn(params, options);
    } else {
        serializedParams = utils.isURLSearchParams(params) ? params.toString() : new helpers_AxiosURLSearchParams(params, options).toString(_encode);
    }
    if (serializedParams) {
        const hashmarkIndex = url.indexOf("#");
        if (hashmarkIndex !== -1) {
            url = url.slice(0, hashmarkIndex);
        }
        url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
    }
    return url;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/InterceptorManager.js


class InterceptorManager {
    constructor(){
        this.handlers = [];
    }
    /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */ use(fulfilled, rejected, options) {
        this.handlers.push({
            fulfilled,
            rejected,
            synchronous: options ? options.synchronous : false,
            runWhen: options ? options.runWhen : null
        });
        return this.handlers.length - 1;
    }
    /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */ eject(id) {
        if (this.handlers[id]) {
            this.handlers[id] = null;
        }
    }
    /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */ clear() {
        if (this.handlers) {
            this.handlers = [];
        }
    }
    /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */ forEach(fn) {
        utils.forEach(this.handlers, function forEachHandler(h) {
            if (h !== null) {
                fn(h);
            }
        });
    }
}
/* harmony default export */ const core_InterceptorManager = (InterceptorManager);

;// CONCATENATED MODULE: ./node_modules/axios/lib/defaults/transitional.js

/* harmony default export */ const defaults_transitional = ({
    silentJSONParsing: true,
    forcedJSONParsing: true,
    clarifyTimeoutError: false
});

// EXTERNAL MODULE: external "url"
var external_url_ = __webpack_require__(57310);
;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/node/classes/URLSearchParams.js


/* harmony default export */ const URLSearchParams = (external_url_.URLSearchParams);

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/node/index.js


/* harmony default export */ const node = ({
    isNode: true,
    classes: {
        URLSearchParams: URLSearchParams,
        FormData: classes_FormData,
        Blob: typeof Blob !== "undefined" && Blob || null
    },
    protocols: [
        "http",
        "https",
        "file",
        "data"
    ]
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/common/utils.js
const hasBrowserEnv =  false && 0;
/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 *
 * @returns {boolean}
 */ const hasStandardBrowserEnv = ((product)=>{
    return hasBrowserEnv && [
        "ReactNative",
        "NativeScript",
        "NS"
    ].indexOf(product) < 0;
})(typeof navigator !== "undefined" && navigator.product);
/**
 * Determine if we're running in a standard browser webWorker environment
 *
 * Although the `isStandardBrowserEnv` method indicates that
 * `allows axios to run in a web worker`, the WebWorker will still be
 * filtered out due to its judgment standard
 * `typeof window !== 'undefined' && typeof document !== 'undefined'`.
 * This leads to a problem when axios post `FormData` in webWorker
 */ const hasStandardBrowserWebWorkerEnv = (()=>{
    return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
    self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();


;// CONCATENATED MODULE: ./node_modules/axios/lib/platform/index.js


/* harmony default export */ const platform = ({
    ...common_utils_namespaceObject,
    ...node
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/toURLEncodedForm.js




function toURLEncodedForm(data, options) {
    return helpers_toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
        visitor: function(value, key, path, helpers) {
            if (platform.isNode && utils.isBuffer(value)) {
                this.append(key, value.toString("base64"));
                return false;
            }
            return helpers.defaultVisitor.apply(this, arguments);
        }
    }, options));
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/formDataToJSON.js


/**
 * It takes a string like `foo[x][y][z]` and returns an array like `['foo', 'x', 'y', 'z']
 *
 * @param {string} name - The name of the property to get.
 *
 * @returns An array of strings.
 */ function parsePropPath(name) {
    // foo[x][y][z]
    // foo.x.y.z
    // foo-x-y-z
    // foo x y z
    return utils.matchAll(/\w+|\[(\w*)]/g, name).map((match)=>{
        return match[0] === "[]" ? "" : match[1] || match[0];
    });
}
/**
 * Convert an array to an object.
 *
 * @param {Array<any>} arr - The array to convert to an object.
 *
 * @returns An object with the same keys and values as the array.
 */ function arrayToObject(arr) {
    const obj = {};
    const keys = Object.keys(arr);
    let i;
    const len = keys.length;
    let key;
    for(i = 0; i < len; i++){
        key = keys[i];
        obj[key] = arr[key];
    }
    return obj;
}
/**
 * It takes a FormData object and returns a JavaScript object
 *
 * @param {string} formData The FormData object to convert to JSON.
 *
 * @returns {Object<string, any> | null} The converted object.
 */ function formDataToJSON(formData) {
    function buildPath(path, value, target, index) {
        let name = path[index++];
        const isNumericKey = Number.isFinite(+name);
        const isLast = index >= path.length;
        name = !name && utils.isArray(target) ? target.length : name;
        if (isLast) {
            if (utils.hasOwnProp(target, name)) {
                target[name] = [
                    target[name],
                    value
                ];
            } else {
                target[name] = value;
            }
            return !isNumericKey;
        }
        if (!target[name] || !utils.isObject(target[name])) {
            target[name] = [];
        }
        const result = buildPath(path, value, target[name], index);
        if (result && utils.isArray(target[name])) {
            target[name] = arrayToObject(target[name]);
        }
        return !isNumericKey;
    }
    if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
        const obj = {};
        utils.forEachEntry(formData, (name, value)=>{
            buildPath(parsePropPath(name), value, obj, 0);
        });
        return obj;
    }
    return null;
}
/* harmony default export */ const helpers_formDataToJSON = (formDataToJSON);

;// CONCATENATED MODULE: ./node_modules/axios/lib/defaults/index.js








/**
 * It takes a string, tries to parse it, and if it fails, it returns the stringified version
 * of the input
 *
 * @param {any} rawValue - The value to be stringified.
 * @param {Function} parser - A function that parses a string into a JavaScript object.
 * @param {Function} encoder - A function that takes a value and returns a string.
 *
 * @returns {string} A stringified version of the rawValue.
 */ function stringifySafely(rawValue, parser, encoder) {
    if (utils.isString(rawValue)) {
        try {
            (parser || JSON.parse)(rawValue);
            return utils.trim(rawValue);
        } catch (e) {
            if (e.name !== "SyntaxError") {
                throw e;
            }
        }
    }
    return (encoder || JSON.stringify)(rawValue);
}
const defaults = {
    transitional: defaults_transitional,
    adapter: [
        "xhr",
        "http"
    ],
    transformRequest: [
        function transformRequest(data, headers) {
            const contentType = headers.getContentType() || "";
            const hasJSONContentType = contentType.indexOf("application/json") > -1;
            const isObjectPayload = utils.isObject(data);
            if (isObjectPayload && utils.isHTMLForm(data)) {
                data = new FormData(data);
            }
            const isFormData = utils.isFormData(data);
            if (isFormData) {
                if (!hasJSONContentType) {
                    return data;
                }
                return hasJSONContentType ? JSON.stringify(helpers_formDataToJSON(data)) : data;
            }
            if (utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
                return data;
            }
            if (utils.isArrayBufferView(data)) {
                return data.buffer;
            }
            if (utils.isURLSearchParams(data)) {
                headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
                return data.toString();
            }
            let isFileList;
            if (isObjectPayload) {
                if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
                    return toURLEncodedForm(data, this.formSerializer).toString();
                }
                if ((isFileList = utils.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
                    const _FormData = this.env && this.env.FormData;
                    return helpers_toFormData(isFileList ? {
                        "files[]": data
                    } : data, _FormData && new _FormData(), this.formSerializer);
                }
            }
            if (isObjectPayload || hasJSONContentType) {
                headers.setContentType("application/json", false);
                return stringifySafely(data);
            }
            return data;
        }
    ],
    transformResponse: [
        function transformResponse(data) {
            const transitional = this.transitional || defaults.transitional;
            const forcedJSONParsing = transitional && transitional.forcedJSONParsing;
            const JSONRequested = this.responseType === "json";
            if (data && utils.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
                const silentJSONParsing = transitional && transitional.silentJSONParsing;
                const strictJSONParsing = !silentJSONParsing && JSONRequested;
                try {
                    return JSON.parse(data);
                } catch (e) {
                    if (strictJSONParsing) {
                        if (e.name === "SyntaxError") {
                            throw core_AxiosError.from(e, core_AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
                        }
                        throw e;
                    }
                }
            }
            return data;
        }
    ],
    /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */ timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    env: {
        FormData: platform.classes.FormData,
        Blob: platform.classes.Blob
    },
    validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
    },
    headers: {
        common: {
            "Accept": "application/json, text/plain, */*",
            "Content-Type": undefined
        }
    }
};
utils.forEach([
    "delete",
    "get",
    "head",
    "post",
    "put",
    "patch"
], (method)=>{
    defaults.headers[method] = {};
});
/* harmony default export */ const lib_defaults = (defaults);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/parseHeaders.js


// RawAxiosHeaders whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
const ignoreDuplicateOf = utils.toObjectSet([
    "age",
    "authorization",
    "content-length",
    "content-type",
    "etag",
    "expires",
    "from",
    "host",
    "if-modified-since",
    "if-unmodified-since",
    "last-modified",
    "location",
    "max-forwards",
    "proxy-authorization",
    "referer",
    "retry-after",
    "user-agent"
]);
/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} rawHeaders Headers needing to be parsed
 *
 * @returns {Object} Headers parsed into an object
 */ /* harmony default export */ const parseHeaders = ((rawHeaders)=>{
    const parsed = {};
    let key;
    let val;
    let i;
    rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
        i = line.indexOf(":");
        key = line.substring(0, i).trim().toLowerCase();
        val = line.substring(i + 1).trim();
        if (!key || parsed[key] && ignoreDuplicateOf[key]) {
            return;
        }
        if (key === "set-cookie") {
            if (parsed[key]) {
                parsed[key].push(val);
            } else {
                parsed[key] = [
                    val
                ];
            }
        } else {
            parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
        }
    });
    return parsed;
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/AxiosHeaders.js



const $internals = Symbol("internals");
function normalizeHeader(header) {
    return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
    if (value === false || value == null) {
        return value;
    }
    return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
    const tokens = Object.create(null);
    const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
    let match;
    while(match = tokensRE.exec(str)){
        tokens[match[1]] = match[2];
    }
    return tokens;
}
const isValidHeaderName = (str)=>/^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context, value, header, filter, isHeaderNameFilter) {
    if (utils.isFunction(filter)) {
        return filter.call(this, value, header);
    }
    if (isHeaderNameFilter) {
        value = header;
    }
    if (!utils.isString(value)) return;
    if (utils.isString(filter)) {
        return value.indexOf(filter) !== -1;
    }
    if (utils.isRegExp(filter)) {
        return filter.test(value);
    }
}
function formatHeader(header) {
    return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str)=>{
        return char.toUpperCase() + str;
    });
}
function buildAccessors(obj, header) {
    const accessorName = utils.toCamelCase(" " + header);
    [
        "get",
        "set",
        "has"
    ].forEach((methodName)=>{
        Object.defineProperty(obj, methodName + accessorName, {
            value: function(arg1, arg2, arg3) {
                return this[methodName].call(this, header, arg1, arg2, arg3);
            },
            configurable: true
        });
    });
}
class AxiosHeaders {
    constructor(headers){
        headers && this.set(headers);
    }
    set(header, valueOrRewrite, rewrite) {
        const self = this;
        function setHeader(_value, _header, _rewrite) {
            const lHeader = normalizeHeader(_header);
            if (!lHeader) {
                throw new Error("header name must be a non-empty string");
            }
            const key = utils.findKey(self, lHeader);
            if (!key || self[key] === undefined || _rewrite === true || _rewrite === undefined && self[key] !== false) {
                self[key || _header] = normalizeValue(_value);
            }
        }
        const setHeaders = (headers, _rewrite)=>utils.forEach(headers, (_value, _header)=>setHeader(_value, _header, _rewrite));
        if (utils.isPlainObject(header) || header instanceof this.constructor) {
            setHeaders(header, valueOrRewrite);
        } else if (utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
            setHeaders(parseHeaders(header), valueOrRewrite);
        } else {
            header != null && setHeader(valueOrRewrite, header, rewrite);
        }
        return this;
    }
    get(header, parser) {
        header = normalizeHeader(header);
        if (header) {
            const key = utils.findKey(this, header);
            if (key) {
                const value = this[key];
                if (!parser) {
                    return value;
                }
                if (parser === true) {
                    return parseTokens(value);
                }
                if (utils.isFunction(parser)) {
                    return parser.call(this, value, key);
                }
                if (utils.isRegExp(parser)) {
                    return parser.exec(value);
                }
                throw new TypeError("parser must be boolean|regexp|function");
            }
        }
    }
    has(header, matcher) {
        header = normalizeHeader(header);
        if (header) {
            const key = utils.findKey(this, header);
            return !!(key && this[key] !== undefined && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
        }
        return false;
    }
    delete(header, matcher) {
        const self = this;
        let deleted = false;
        function deleteHeader(_header) {
            _header = normalizeHeader(_header);
            if (_header) {
                const key = utils.findKey(self, _header);
                if (key && (!matcher || matchHeaderValue(self, self[key], key, matcher))) {
                    delete self[key];
                    deleted = true;
                }
            }
        }
        if (utils.isArray(header)) {
            header.forEach(deleteHeader);
        } else {
            deleteHeader(header);
        }
        return deleted;
    }
    clear(matcher) {
        const keys = Object.keys(this);
        let i = keys.length;
        let deleted = false;
        while(i--){
            const key = keys[i];
            if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
                delete this[key];
                deleted = true;
            }
        }
        return deleted;
    }
    normalize(format) {
        const self = this;
        const headers = {};
        utils.forEach(this, (value, header)=>{
            const key = utils.findKey(headers, header);
            if (key) {
                self[key] = normalizeValue(value);
                delete self[header];
                return;
            }
            const normalized = format ? formatHeader(header) : String(header).trim();
            if (normalized !== header) {
                delete self[header];
            }
            self[normalized] = normalizeValue(value);
            headers[normalized] = true;
        });
        return this;
    }
    concat(...targets) {
        return this.constructor.concat(this, ...targets);
    }
    toJSON(asStrings) {
        const obj = Object.create(null);
        utils.forEach(this, (value, header)=>{
            value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(", ") : value);
        });
        return obj;
    }
    [Symbol.iterator]() {
        return Object.entries(this.toJSON())[Symbol.iterator]();
    }
    toString() {
        return Object.entries(this.toJSON()).map(([header, value])=>header + ": " + value).join("\n");
    }
    get [Symbol.toStringTag]() {
        return "AxiosHeaders";
    }
    static from(thing) {
        return thing instanceof this ? thing : new this(thing);
    }
    static concat(first, ...targets) {
        const computed = new this(first);
        targets.forEach((target)=>computed.set(target));
        return computed;
    }
    static accessor(header) {
        const internals = this[$internals] = this[$internals] = {
            accessors: {}
        };
        const accessors = internals.accessors;
        const prototype = this.prototype;
        function defineAccessor(_header) {
            const lHeader = normalizeHeader(_header);
            if (!accessors[lHeader]) {
                buildAccessors(prototype, _header);
                accessors[lHeader] = true;
            }
        }
        utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
        return this;
    }
}
AxiosHeaders.accessor([
    "Content-Type",
    "Content-Length",
    "Accept",
    "Accept-Encoding",
    "User-Agent",
    "Authorization"
]);
// reserved names hotfix
utils.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key)=>{
    let mapped = key[0].toUpperCase() + key.slice(1); // map `set` => `Set`
    return {
        get: ()=>value,
        set (headerValue) {
            this[mapped] = headerValue;
        }
    };
});
utils.freezeMethods(AxiosHeaders);
/* harmony default export */ const core_AxiosHeaders = (AxiosHeaders);

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/transformData.js




/**
 * Transform the data for a request or a response
 *
 * @param {Array|Function} fns A single function or Array of functions
 * @param {?Object} response The response object
 *
 * @returns {*} The resulting transformed data
 */ function transformData(fns, response) {
    const config = this || lib_defaults;
    const context = response || config;
    const headers = core_AxiosHeaders.from(context.headers);
    let data = context.data;
    utils.forEach(fns, function transform(fn) {
        data = fn.call(config, data, headers.normalize(), response ? response.status : undefined);
    });
    headers.normalize();
    return data;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/isCancel.js

function isCancel(value) {
    return !!(value && value.__CANCEL__);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/CanceledError.js



/**
 * A `CanceledError` is an object that is thrown when an operation is canceled.
 *
 * @param {string=} message The message.
 * @param {Object=} config The config.
 * @param {Object=} request The request.
 *
 * @returns {CanceledError} The created error.
 */ function CanceledError(message, config, request) {
    // eslint-disable-next-line no-eq-null,eqeqeq
    core_AxiosError.call(this, message == null ? "canceled" : message, core_AxiosError.ERR_CANCELED, config, request);
    this.name = "CanceledError";
}
utils.inherits(CanceledError, core_AxiosError, {
    __CANCEL__: true
});
/* harmony default export */ const cancel_CanceledError = (CanceledError);

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/settle.js


/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 *
 * @returns {object} The response.
 */ function settle(resolve, reject, response) {
    const validateStatus = response.config.validateStatus;
    if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
    } else {
        reject(new core_AxiosError("Request failed with status code " + response.status, [
            core_AxiosError.ERR_BAD_REQUEST,
            core_AxiosError.ERR_BAD_RESPONSE
        ][Math.floor(response.status / 100) - 4], response.config, response.request, response));
    }
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isAbsoluteURL.js

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */ function isAbsoluteURL(url) {
    // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
    // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
    // by any combination of letters, digits, plus, period, or hyphen.
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/combineURLs.js

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */ function combineURLs(baseURL, relativeURL) {
    return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/buildFullPath.js



/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 *
 * @returns {string} The combined full path
 */ function buildFullPath(baseURL, requestedURL) {
    if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
    }
    return requestedURL;
}

// EXTERNAL MODULE: ./node_modules/proxy-from-env/index.js
var proxy_from_env = __webpack_require__(54782);
// EXTERNAL MODULE: external "http"
var external_http_ = __webpack_require__(13685);
// EXTERNAL MODULE: external "https"
var external_https_ = __webpack_require__(95687);
// EXTERNAL MODULE: external "util"
var external_util_ = __webpack_require__(73837);
// EXTERNAL MODULE: ./node_modules/follow-redirects/index.js
var follow_redirects = __webpack_require__(89698);
// EXTERNAL MODULE: external "zlib"
var external_zlib_ = __webpack_require__(59796);
;// CONCATENATED MODULE: ./node_modules/axios/lib/env/data.js
const VERSION = "1.6.2";

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/parseProtocol.js

function parseProtocol(url) {
    const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
    return match && match[1] || "";
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/fromDataURI.js




const DATA_URL_PATTERN = /^(?:([^;]+);)?(?:[^;]+;)?(base64|),([\s\S]*)$/;
/**
 * Parse data uri to a Buffer or Blob
 *
 * @param {String} uri
 * @param {?Boolean} asBlob
 * @param {?Object} options
 * @param {?Function} options.Blob
 *
 * @returns {Buffer|Blob}
 */ function fromDataURI(uri, asBlob, options) {
    const _Blob = options && options.Blob || platform.classes.Blob;
    const protocol = parseProtocol(uri);
    if (asBlob === undefined && _Blob) {
        asBlob = true;
    }
    if (protocol === "data") {
        uri = protocol.length ? uri.slice(protocol.length + 1) : uri;
        const match = DATA_URL_PATTERN.exec(uri);
        if (!match) {
            throw new core_AxiosError("Invalid URL", core_AxiosError.ERR_INVALID_URL);
        }
        const mime = match[1];
        const isBase64 = match[2];
        const body = match[3];
        const buffer = Buffer.from(decodeURIComponent(body), isBase64 ? "base64" : "utf8");
        if (asBlob) {
            if (!_Blob) {
                throw new core_AxiosError("Blob is not supported", core_AxiosError.ERR_NOT_SUPPORT);
            }
            return new _Blob([
                buffer
            ], {
                type: mime
            });
        }
        return buffer;
    }
    throw new core_AxiosError("Unsupported protocol " + protocol, core_AxiosError.ERR_NOT_SUPPORT);
}

// EXTERNAL MODULE: external "stream"
var external_stream_ = __webpack_require__(12781);
;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/throttle.js

/**
 * Throttle decorator
 * @param {Function} fn
 * @param {Number} freq
 * @return {Function}
 */ function throttle(fn, freq) {
    let timestamp = 0;
    const threshold = 1000 / freq;
    let timer = null;
    return function throttled(force, args) {
        const now = Date.now();
        if (force || now - timestamp > threshold) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            timestamp = now;
            return fn.apply(null, args);
        }
        if (!timer) {
            timer = setTimeout(()=>{
                timer = null;
                timestamp = Date.now();
                return fn.apply(null, args);
            }, threshold - (now - timestamp));
        }
    };
}
/* harmony default export */ const helpers_throttle = (throttle);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/speedometer.js

/**
 * Calculate data maxRate
 * @param {Number} [samplesCount= 10]
 * @param {Number} [min= 1000]
 * @returns {Function}
 */ function speedometer(samplesCount, min) {
    samplesCount = samplesCount || 10;
    const bytes = new Array(samplesCount);
    const timestamps = new Array(samplesCount);
    let head = 0;
    let tail = 0;
    let firstSampleTS;
    min = min !== undefined ? min : 1000;
    return function push(chunkLength) {
        const now = Date.now();
        const startedAt = timestamps[tail];
        if (!firstSampleTS) {
            firstSampleTS = now;
        }
        bytes[head] = chunkLength;
        timestamps[head] = now;
        let i = tail;
        let bytesCount = 0;
        while(i !== head){
            bytesCount += bytes[i++];
            i = i % samplesCount;
        }
        head = (head + 1) % samplesCount;
        if (head === tail) {
            tail = (tail + 1) % samplesCount;
        }
        if (now - firstSampleTS < min) {
            return;
        }
        const passed = startedAt && now - startedAt;
        return passed ? Math.round(bytesCount * 1000 / passed) : undefined;
    };
}
/* harmony default export */ const helpers_speedometer = (speedometer);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/AxiosTransformStream.js





const kInternals = Symbol("internals");
class AxiosTransformStream extends external_stream_.Transform {
    constructor(options){
        options = utils.toFlatObject(options, {
            maxRate: 0,
            chunkSize: 64 * 1024,
            minChunkSize: 100,
            timeWindow: 500,
            ticksRate: 2,
            samplesCount: 15
        }, null, (prop, source)=>{
            return !utils.isUndefined(source[prop]);
        });
        super({
            readableHighWaterMark: options.chunkSize
        });
        const self = this;
        const internals = this[kInternals] = {
            length: options.length,
            timeWindow: options.timeWindow,
            ticksRate: options.ticksRate,
            chunkSize: options.chunkSize,
            maxRate: options.maxRate,
            minChunkSize: options.minChunkSize,
            bytesSeen: 0,
            isCaptured: false,
            notifiedBytesLoaded: 0,
            ts: Date.now(),
            bytes: 0,
            onReadCallback: null
        };
        const _speedometer = helpers_speedometer(internals.ticksRate * options.samplesCount, internals.timeWindow);
        this.on("newListener", (event)=>{
            if (event === "progress") {
                if (!internals.isCaptured) {
                    internals.isCaptured = true;
                }
            }
        });
        let bytesNotified = 0;
        internals.updateProgress = helpers_throttle(function throttledHandler() {
            const totalBytes = internals.length;
            const bytesTransferred = internals.bytesSeen;
            const progressBytes = bytesTransferred - bytesNotified;
            if (!progressBytes || self.destroyed) return;
            const rate = _speedometer(progressBytes);
            bytesNotified = bytesTransferred;
            process.nextTick(()=>{
                self.emit("progress", {
                    "loaded": bytesTransferred,
                    "total": totalBytes,
                    "progress": totalBytes ? bytesTransferred / totalBytes : undefined,
                    "bytes": progressBytes,
                    "rate": rate ? rate : undefined,
                    "estimated": rate && totalBytes && bytesTransferred <= totalBytes ? (totalBytes - bytesTransferred) / rate : undefined
                });
            });
        }, internals.ticksRate);
        const onFinish = ()=>{
            internals.updateProgress(true);
        };
        this.once("end", onFinish);
        this.once("error", onFinish);
    }
    _read(size) {
        const internals = this[kInternals];
        if (internals.onReadCallback) {
            internals.onReadCallback();
        }
        return super._read(size);
    }
    _transform(chunk, encoding, callback) {
        const self = this;
        const internals = this[kInternals];
        const maxRate = internals.maxRate;
        const readableHighWaterMark = this.readableHighWaterMark;
        const timeWindow = internals.timeWindow;
        const divider = 1000 / timeWindow;
        const bytesThreshold = maxRate / divider;
        const minChunkSize = internals.minChunkSize !== false ? Math.max(internals.minChunkSize, bytesThreshold * 0.01) : 0;
        function pushChunk(_chunk, _callback) {
            const bytes = Buffer.byteLength(_chunk);
            internals.bytesSeen += bytes;
            internals.bytes += bytes;
            if (internals.isCaptured) {
                internals.updateProgress();
            }
            if (self.push(_chunk)) {
                process.nextTick(_callback);
            } else {
                internals.onReadCallback = ()=>{
                    internals.onReadCallback = null;
                    process.nextTick(_callback);
                };
            }
        }
        const transformChunk = (_chunk, _callback)=>{
            const chunkSize = Buffer.byteLength(_chunk);
            let chunkRemainder = null;
            let maxChunkSize = readableHighWaterMark;
            let bytesLeft;
            let passed = 0;
            if (maxRate) {
                const now = Date.now();
                if (!internals.ts || (passed = now - internals.ts) >= timeWindow) {
                    internals.ts = now;
                    bytesLeft = bytesThreshold - internals.bytes;
                    internals.bytes = bytesLeft < 0 ? -bytesLeft : 0;
                    passed = 0;
                }
                bytesLeft = bytesThreshold - internals.bytes;
            }
            if (maxRate) {
                if (bytesLeft <= 0) {
                    // next time window
                    return setTimeout(()=>{
                        _callback(null, _chunk);
                    }, timeWindow - passed);
                }
                if (bytesLeft < maxChunkSize) {
                    maxChunkSize = bytesLeft;
                }
            }
            if (maxChunkSize && chunkSize > maxChunkSize && chunkSize - maxChunkSize > minChunkSize) {
                chunkRemainder = _chunk.subarray(maxChunkSize);
                _chunk = _chunk.subarray(0, maxChunkSize);
            }
            pushChunk(_chunk, chunkRemainder ? ()=>{
                process.nextTick(_callback, null, chunkRemainder);
            } : _callback);
        };
        transformChunk(chunk, function transformNextChunk(err, _chunk) {
            if (err) {
                return callback(err);
            }
            if (_chunk) {
                transformChunk(_chunk, transformNextChunk);
            } else {
                callback(null);
            }
        });
    }
    setLength(length) {
        this[kInternals].length = +length;
        return this;
    }
}
/* harmony default export */ const helpers_AxiosTransformStream = (AxiosTransformStream);

// EXTERNAL MODULE: external "events"
var external_events_ = __webpack_require__(82361);
;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/readBlob.js
const { asyncIterator } = Symbol;
const readBlob = async function*(blob) {
    if (blob.stream) {
        yield* blob.stream();
    } else if (blob.arrayBuffer) {
        yield await blob.arrayBuffer();
    } else if (blob[asyncIterator]) {
        yield* blob[asyncIterator]();
    } else {
        yield blob;
    }
};
/* harmony default export */ const helpers_readBlob = (readBlob);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/formDataToStream.js




const BOUNDARY_ALPHABET = utils.ALPHABET.ALPHA_DIGIT + "-_";
const textEncoder = new external_util_.TextEncoder();
const CRLF = "\r\n";
const CRLF_BYTES = textEncoder.encode(CRLF);
const CRLF_BYTES_COUNT = 2;
class FormDataPart {
    constructor(name, value){
        const { escapeName } = this.constructor;
        const isStringValue = utils.isString(value);
        let headers = `Content-Disposition: form-data; name="${escapeName(name)}"${!isStringValue && value.name ? `; filename="${escapeName(value.name)}"` : ""}${CRLF}`;
        if (isStringValue) {
            value = textEncoder.encode(String(value).replace(/\r?\n|\r\n?/g, CRLF));
        } else {
            headers += `Content-Type: ${value.type || "application/octet-stream"}${CRLF}`;
        }
        this.headers = textEncoder.encode(headers + CRLF);
        this.contentLength = isStringValue ? value.byteLength : value.size;
        this.size = this.headers.byteLength + this.contentLength + CRLF_BYTES_COUNT;
        this.name = name;
        this.value = value;
    }
    async *encode() {
        yield this.headers;
        const { value } = this;
        if (utils.isTypedArray(value)) {
            yield value;
        } else {
            yield* helpers_readBlob(value);
        }
        yield CRLF_BYTES;
    }
    static escapeName(name) {
        return String(name).replace(/[\r\n"]/g, (match)=>({
                "\r": "%0D",
                "\n": "%0A",
                '"': "%22"
            })[match]);
    }
}
const formDataToStream = (form, headersHandler, options)=>{
    const { tag = "form-data-boundary", size = 25, boundary = tag + "-" + utils.generateString(size, BOUNDARY_ALPHABET) } = options || {};
    if (!utils.isFormData(form)) {
        throw TypeError("FormData instance required");
    }
    if (boundary.length < 1 || boundary.length > 70) {
        throw Error("boundary must be 10-70 characters long");
    }
    const boundaryBytes = textEncoder.encode("--" + boundary + CRLF);
    const footerBytes = textEncoder.encode("--" + boundary + "--" + CRLF + CRLF);
    let contentLength = footerBytes.byteLength;
    const parts = Array.from(form.entries()).map(([name, value])=>{
        const part = new FormDataPart(name, value);
        contentLength += part.size;
        return part;
    });
    contentLength += boundaryBytes.byteLength * parts.length;
    contentLength = utils.toFiniteNumber(contentLength);
    const computedHeaders = {
        "Content-Type": `multipart/form-data; boundary=${boundary}`
    };
    if (Number.isFinite(contentLength)) {
        computedHeaders["Content-Length"] = contentLength;
    }
    headersHandler && headersHandler(computedHeaders);
    return external_stream_.Readable.from(async function*() {
        for (const part of parts){
            yield boundaryBytes;
            yield* part.encode();
        }
        yield footerBytes;
    }());
};
/* harmony default export */ const helpers_formDataToStream = (formDataToStream);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/ZlibHeaderTransformStream.js


class ZlibHeaderTransformStream extends external_stream_.Transform {
    __transform(chunk, encoding, callback) {
        this.push(chunk);
        callback();
    }
    _transform(chunk, encoding, callback) {
        if (chunk.length !== 0) {
            this._transform = this.__transform;
            // Add Default Compression headers if no zlib headers are present
            if (chunk[0] !== 120) {
                const header = Buffer.alloc(2);
                header[0] = 120; // Hex: 78
                header[1] = 156; // Hex: 9C 
                this.push(header, encoding);
            }
        }
        this.__transform(chunk, encoding, callback);
    }
}
/* harmony default export */ const helpers_ZlibHeaderTransformStream = (ZlibHeaderTransformStream);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/callbackify.js

const callbackify = (fn, reducer)=>{
    return utils.isAsyncFn(fn) ? function(...args) {
        const cb = args.pop();
        fn.apply(this, args).then((value)=>{
            try {
                reducer ? cb(null, ...reducer(value)) : cb(null, value);
            } catch (err) {
                cb(err);
            }
        }, cb);
    } : fn;
};
/* harmony default export */ const helpers_callbackify = (callbackify);

;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/http.js

























const zlibOptions = {
    flush: external_zlib_.constants.Z_SYNC_FLUSH,
    finishFlush: external_zlib_.constants.Z_SYNC_FLUSH
};
const brotliOptions = {
    flush: external_zlib_.constants.BROTLI_OPERATION_FLUSH,
    finishFlush: external_zlib_.constants.BROTLI_OPERATION_FLUSH
};
const isBrotliSupported = utils.isFunction(external_zlib_.createBrotliDecompress);
const { http: httpFollow, https: httpsFollow } = follow_redirects;
const isHttps = /https:?/;
const supportedProtocols = platform.protocols.map((protocol)=>{
    return protocol + ":";
});
/**
 * If the proxy or config beforeRedirects functions are defined, call them with the options
 * object.
 *
 * @param {Object<string, any>} options - The options object that was passed to the request.
 *
 * @returns {Object<string, any>}
 */ function dispatchBeforeRedirect(options) {
    if (options.beforeRedirects.proxy) {
        options.beforeRedirects.proxy(options);
    }
    if (options.beforeRedirects.config) {
        options.beforeRedirects.config(options);
    }
}
/**
 * If the proxy or config afterRedirects functions are defined, call them with the options
 *
 * @param {http.ClientRequestArgs} options
 * @param {AxiosProxyConfig} configProxy configuration from Axios options object
 * @param {string} location
 *
 * @returns {http.ClientRequestArgs}
 */ function setProxy(options, configProxy, location) {
    let proxy = configProxy;
    if (!proxy && proxy !== false) {
        const proxyUrl = (0,proxy_from_env/* getProxyForUrl */.j)(location);
        if (proxyUrl) {
            proxy = new URL(proxyUrl);
        }
    }
    if (proxy) {
        // Basic proxy authorization
        if (proxy.username) {
            proxy.auth = (proxy.username || "") + ":" + (proxy.password || "");
        }
        if (proxy.auth) {
            // Support proxy auth object form
            if (proxy.auth.username || proxy.auth.password) {
                proxy.auth = (proxy.auth.username || "") + ":" + (proxy.auth.password || "");
            }
            const base64 = Buffer.from(proxy.auth, "utf8").toString("base64");
            options.headers["Proxy-Authorization"] = "Basic " + base64;
        }
        options.headers.host = options.hostname + (options.port ? ":" + options.port : "");
        const proxyHost = proxy.hostname || proxy.host;
        options.hostname = proxyHost;
        // Replace 'host' since options is not a URL object
        options.host = proxyHost;
        options.port = proxy.port;
        options.path = location;
        if (proxy.protocol) {
            options.protocol = proxy.protocol.includes(":") ? proxy.protocol : `${proxy.protocol}:`;
        }
    }
    options.beforeRedirects.proxy = function beforeRedirect(redirectOptions) {
        // Configure proxy for redirected request, passing the original config proxy to apply
        // the exact same logic as if the redirected request was performed by axios directly.
        setProxy(redirectOptions, configProxy, redirectOptions.href);
    };
}
const isHttpAdapterSupported = typeof process !== "undefined" && utils.kindOf(process) === "process";
// temporary hotfix
const wrapAsync = (asyncExecutor)=>{
    return new Promise((resolve, reject)=>{
        let onDone;
        let isDone;
        const done = (value, isRejected)=>{
            if (isDone) return;
            isDone = true;
            onDone && onDone(value, isRejected);
        };
        const _resolve = (value)=>{
            done(value);
            resolve(value);
        };
        const _reject = (reason)=>{
            done(reason, true);
            reject(reason);
        };
        asyncExecutor(_resolve, _reject, (onDoneHandler)=>onDone = onDoneHandler).catch(_reject);
    });
};
const resolveFamily = ({ address, family })=>{
    if (!utils.isString(address)) {
        throw TypeError("address must be a string");
    }
    return {
        address,
        family: family || (address.indexOf(".") < 0 ? 6 : 4)
    };
};
const buildAddressEntry = (address, family)=>resolveFamily(utils.isObject(address) ? address : {
        address,
        family
    });
/*eslint consistent-return:0*/ /* harmony default export */ const http = (isHttpAdapterSupported && function httpAdapter(config) {
    return wrapAsync(async function dispatchHttpRequest(resolve, reject, onDone) {
        let { data, lookup, family } = config;
        const { responseType, responseEncoding } = config;
        const method = config.method.toUpperCase();
        let isDone;
        let rejected = false;
        let req;
        if (lookup) {
            const _lookup = helpers_callbackify(lookup, (value)=>utils.isArray(value) ? value : [
                    value
                ]);
            // hotfix to support opt.all option which is required for node 20.x
            lookup = (hostname, opt, cb)=>{
                _lookup(hostname, opt, (err, arg0, arg1)=>{
                    const addresses = utils.isArray(arg0) ? arg0.map((addr)=>buildAddressEntry(addr)) : [
                        buildAddressEntry(arg0, arg1)
                    ];
                    opt.all ? cb(err, addresses) : cb(err, addresses[0].address, addresses[0].family);
                });
            };
        }
        // temporary internal emitter until the AxiosRequest class will be implemented
        const emitter = new external_events_();
        const onFinished = ()=>{
            if (config.cancelToken) {
                config.cancelToken.unsubscribe(abort);
            }
            if (config.signal) {
                config.signal.removeEventListener("abort", abort);
            }
            emitter.removeAllListeners();
        };
        onDone((value, isRejected)=>{
            isDone = true;
            if (isRejected) {
                rejected = true;
                onFinished();
            }
        });
        function abort(reason) {
            emitter.emit("abort", !reason || reason.type ? new cancel_CanceledError(null, config, req) : reason);
        }
        emitter.once("abort", reject);
        if (config.cancelToken || config.signal) {
            config.cancelToken && config.cancelToken.subscribe(abort);
            if (config.signal) {
                config.signal.aborted ? abort() : config.signal.addEventListener("abort", abort);
            }
        }
        // Parse url
        const fullPath = buildFullPath(config.baseURL, config.url);
        const parsed = new URL(fullPath, "http://localhost");
        const protocol = parsed.protocol || supportedProtocols[0];
        if (protocol === "data:") {
            let convertedData;
            if (method !== "GET") {
                return settle(resolve, reject, {
                    status: 405,
                    statusText: "method not allowed",
                    headers: {},
                    config
                });
            }
            try {
                convertedData = fromDataURI(config.url, responseType === "blob", {
                    Blob: config.env && config.env.Blob
                });
            } catch (err) {
                throw core_AxiosError.from(err, core_AxiosError.ERR_BAD_REQUEST, config);
            }
            if (responseType === "text") {
                convertedData = convertedData.toString(responseEncoding);
                if (!responseEncoding || responseEncoding === "utf8") {
                    convertedData = utils.stripBOM(convertedData);
                }
            } else if (responseType === "stream") {
                convertedData = external_stream_.Readable.from(convertedData);
            }
            return settle(resolve, reject, {
                data: convertedData,
                status: 200,
                statusText: "OK",
                headers: new core_AxiosHeaders(),
                config
            });
        }
        if (supportedProtocols.indexOf(protocol) === -1) {
            return reject(new core_AxiosError("Unsupported protocol " + protocol, core_AxiosError.ERR_BAD_REQUEST, config));
        }
        const headers = core_AxiosHeaders.from(config.headers).normalize();
        // Set User-Agent (required by some servers)
        // See https://github.com/axios/axios/issues/69
        // User-Agent is specified; handle case where no UA header is desired
        // Only set header if it hasn't been set in config
        headers.set("User-Agent", "axios/" + VERSION, false);
        const onDownloadProgress = config.onDownloadProgress;
        const onUploadProgress = config.onUploadProgress;
        const maxRate = config.maxRate;
        let maxUploadRate = undefined;
        let maxDownloadRate = undefined;
        // support for spec compliant FormData objects
        if (utils.isSpecCompliantForm(data)) {
            const userBoundary = headers.getContentType(/boundary=([-_\w\d]{10,70})/i);
            data = helpers_formDataToStream(data, (formHeaders)=>{
                headers.set(formHeaders);
            }, {
                tag: `axios-${VERSION}-boundary`,
                boundary: userBoundary && userBoundary[1] || undefined
            });
        // support for https://www.npmjs.com/package/form-data api
        } else if (utils.isFormData(data) && utils.isFunction(data.getHeaders)) {
            headers.set(data.getHeaders());
            if (!headers.hasContentLength()) {
                try {
                    const knownLength = await external_util_.promisify(data.getLength).call(data);
                    Number.isFinite(knownLength) && knownLength >= 0 && headers.setContentLength(knownLength);
                /*eslint no-empty:0*/ } catch (e) {}
            }
        } else if (utils.isBlob(data)) {
            data.size && headers.setContentType(data.type || "application/octet-stream");
            headers.setContentLength(data.size || 0);
            data = external_stream_.Readable.from(helpers_readBlob(data));
        } else if (data && !utils.isStream(data)) {
            if (Buffer.isBuffer(data)) {
            // Nothing to do...
            } else if (utils.isArrayBuffer(data)) {
                data = Buffer.from(new Uint8Array(data));
            } else if (utils.isString(data)) {
                data = Buffer.from(data, "utf-8");
            } else {
                return reject(new core_AxiosError("Data after transformation must be a string, an ArrayBuffer, a Buffer, or a Stream", core_AxiosError.ERR_BAD_REQUEST, config));
            }
            // Add Content-Length header if data exists
            headers.setContentLength(data.length, false);
            if (config.maxBodyLength > -1 && data.length > config.maxBodyLength) {
                return reject(new core_AxiosError("Request body larger than maxBodyLength limit", core_AxiosError.ERR_BAD_REQUEST, config));
            }
        }
        const contentLength = utils.toFiniteNumber(headers.getContentLength());
        if (utils.isArray(maxRate)) {
            maxUploadRate = maxRate[0];
            maxDownloadRate = maxRate[1];
        } else {
            maxUploadRate = maxDownloadRate = maxRate;
        }
        if (data && (onUploadProgress || maxUploadRate)) {
            if (!utils.isStream(data)) {
                data = external_stream_.Readable.from(data, {
                    objectMode: false
                });
            }
            data = external_stream_.pipeline([
                data,
                new helpers_AxiosTransformStream({
                    length: contentLength,
                    maxRate: utils.toFiniteNumber(maxUploadRate)
                })
            ], utils.noop);
            onUploadProgress && data.on("progress", (progress)=>{
                onUploadProgress(Object.assign(progress, {
                    upload: true
                }));
            });
        }
        // HTTP basic authentication
        let auth = undefined;
        if (config.auth) {
            const username = config.auth.username || "";
            const password = config.auth.password || "";
            auth = username + ":" + password;
        }
        if (!auth && parsed.username) {
            const urlUsername = parsed.username;
            const urlPassword = parsed.password;
            auth = urlUsername + ":" + urlPassword;
        }
        auth && headers.delete("authorization");
        let path;
        try {
            path = buildURL(parsed.pathname + parsed.search, config.params, config.paramsSerializer).replace(/^\?/, "");
        } catch (err) {
            const customErr = new Error(err.message);
            customErr.config = config;
            customErr.url = config.url;
            customErr.exists = true;
            return reject(customErr);
        }
        headers.set("Accept-Encoding", "gzip, compress, deflate" + (isBrotliSupported ? ", br" : ""), false);
        const options = {
            path,
            method: method,
            headers: headers.toJSON(),
            agents: {
                http: config.httpAgent,
                https: config.httpsAgent
            },
            auth,
            protocol,
            family,
            beforeRedirect: dispatchBeforeRedirect,
            beforeRedirects: {}
        };
        // cacheable-lookup integration hotfix
        !utils.isUndefined(lookup) && (options.lookup = lookup);
        if (config.socketPath) {
            options.socketPath = config.socketPath;
        } else {
            options.hostname = parsed.hostname;
            options.port = parsed.port;
            setProxy(options, config.proxy, protocol + "//" + parsed.hostname + (parsed.port ? ":" + parsed.port : "") + options.path);
        }
        let transport;
        const isHttpsRequest = isHttps.test(options.protocol);
        options.agent = isHttpsRequest ? config.httpsAgent : config.httpAgent;
        if (config.transport) {
            transport = config.transport;
        } else if (config.maxRedirects === 0) {
            transport = isHttpsRequest ? external_https_ : external_http_;
        } else {
            if (config.maxRedirects) {
                options.maxRedirects = config.maxRedirects;
            }
            if (config.beforeRedirect) {
                options.beforeRedirects.config = config.beforeRedirect;
            }
            transport = isHttpsRequest ? httpsFollow : httpFollow;
        }
        if (config.maxBodyLength > -1) {
            options.maxBodyLength = config.maxBodyLength;
        } else {
            // follow-redirects does not skip comparison, so it should always succeed for axios -1 unlimited
            options.maxBodyLength = Infinity;
        }
        if (config.insecureHTTPParser) {
            options.insecureHTTPParser = config.insecureHTTPParser;
        }
        // Create the request
        req = transport.request(options, function handleResponse(res) {
            if (req.destroyed) return;
            const streams = [
                res
            ];
            const responseLength = +res.headers["content-length"];
            if (onDownloadProgress) {
                const transformStream = new helpers_AxiosTransformStream({
                    length: utils.toFiniteNumber(responseLength),
                    maxRate: utils.toFiniteNumber(maxDownloadRate)
                });
                onDownloadProgress && transformStream.on("progress", (progress)=>{
                    onDownloadProgress(Object.assign(progress, {
                        download: true
                    }));
                });
                streams.push(transformStream);
            }
            // decompress the response body transparently if required
            let responseStream = res;
            // return the last request in case of redirects
            const lastRequest = res.req || req;
            // if decompress disabled we should not decompress
            if (config.decompress !== false && res.headers["content-encoding"]) {
                // if no content, but headers still say that it is encoded,
                // remove the header not confuse downstream operations
                if (method === "HEAD" || res.statusCode === 204) {
                    delete res.headers["content-encoding"];
                }
                switch((res.headers["content-encoding"] || "").toLowerCase()){
                    /*eslint default-case:0*/ case "gzip":
                    case "x-gzip":
                    case "compress":
                    case "x-compress":
                        // add the unzipper to the body stream processing pipeline
                        streams.push(external_zlib_.createUnzip(zlibOptions));
                        // remove the content-encoding in order to not confuse downstream operations
                        delete res.headers["content-encoding"];
                        break;
                    case "deflate":
                        streams.push(new helpers_ZlibHeaderTransformStream());
                        // add the unzipper to the body stream processing pipeline
                        streams.push(external_zlib_.createUnzip(zlibOptions));
                        // remove the content-encoding in order to not confuse downstream operations
                        delete res.headers["content-encoding"];
                        break;
                    case "br":
                        if (isBrotliSupported) {
                            streams.push(external_zlib_.createBrotliDecompress(brotliOptions));
                            delete res.headers["content-encoding"];
                        }
                }
            }
            responseStream = streams.length > 1 ? external_stream_.pipeline(streams, utils.noop) : streams[0];
            const offListeners = external_stream_.finished(responseStream, ()=>{
                offListeners();
                onFinished();
            });
            const response = {
                status: res.statusCode,
                statusText: res.statusMessage,
                headers: new core_AxiosHeaders(res.headers),
                config,
                request: lastRequest
            };
            if (responseType === "stream") {
                response.data = responseStream;
                settle(resolve, reject, response);
            } else {
                const responseBuffer = [];
                let totalResponseBytes = 0;
                responseStream.on("data", function handleStreamData(chunk) {
                    responseBuffer.push(chunk);
                    totalResponseBytes += chunk.length;
                    // make sure the content length is not over the maxContentLength if specified
                    if (config.maxContentLength > -1 && totalResponseBytes > config.maxContentLength) {
                        // stream.destroy() emit aborted event before calling reject() on Node.js v16
                        rejected = true;
                        responseStream.destroy();
                        reject(new core_AxiosError("maxContentLength size of " + config.maxContentLength + " exceeded", core_AxiosError.ERR_BAD_RESPONSE, config, lastRequest));
                    }
                });
                responseStream.on("aborted", function handlerStreamAborted() {
                    if (rejected) {
                        return;
                    }
                    const err = new core_AxiosError("maxContentLength size of " + config.maxContentLength + " exceeded", core_AxiosError.ERR_BAD_RESPONSE, config, lastRequest);
                    responseStream.destroy(err);
                    reject(err);
                });
                responseStream.on("error", function handleStreamError(err) {
                    if (req.destroyed) return;
                    reject(core_AxiosError.from(err, null, config, lastRequest));
                });
                responseStream.on("end", function handleStreamEnd() {
                    try {
                        let responseData = responseBuffer.length === 1 ? responseBuffer[0] : Buffer.concat(responseBuffer);
                        if (responseType !== "arraybuffer") {
                            responseData = responseData.toString(responseEncoding);
                            if (!responseEncoding || responseEncoding === "utf8") {
                                responseData = utils.stripBOM(responseData);
                            }
                        }
                        response.data = responseData;
                    } catch (err) {
                        return reject(core_AxiosError.from(err, null, config, response.request, response));
                    }
                    settle(resolve, reject, response);
                });
            }
            emitter.once("abort", (err)=>{
                if (!responseStream.destroyed) {
                    responseStream.emit("error", err);
                    responseStream.destroy();
                }
            });
        });
        emitter.once("abort", (err)=>{
            reject(err);
            req.destroy(err);
        });
        // Handle errors
        req.on("error", function handleRequestError(err) {
            // @todo remove
            // if (req.aborted && err.code !== AxiosError.ERR_FR_TOO_MANY_REDIRECTS) return;
            reject(core_AxiosError.from(err, null, config, req));
        });
        // set tcp keep alive to prevent drop connection by peer
        req.on("socket", function handleRequestSocket(socket) {
            // default interval of sending ack packet is 1 minute
            socket.setKeepAlive(true, 1000 * 60);
        });
        // Handle request timeout
        if (config.timeout) {
            // This is forcing a int timeout to avoid problems if the `req` interface doesn't handle other types.
            const timeout = parseInt(config.timeout, 10);
            if (Number.isNaN(timeout)) {
                reject(new core_AxiosError("error trying to parse `config.timeout` to int", core_AxiosError.ERR_BAD_OPTION_VALUE, config, req));
                return;
            }
            // Sometime, the response will be very slow, and does not respond, the connect event will be block by event loop system.
            // And timer callback will be fired, and abort() will be invoked before connection, then get "socket hang up" and code ECONNRESET.
            // At this time, if we have a large number of request, nodejs will hang up some socket on background. and the number will up and up.
            // And then these socket which be hang up will devouring CPU little by little.
            // ClientRequest.setTimeout will be fired on the specify milliseconds, and can make sure that abort() will be fired after connect.
            req.setTimeout(timeout, function handleRequestTimeout() {
                if (isDone) return;
                let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
                const transitional = config.transitional || defaults_transitional;
                if (config.timeoutErrorMessage) {
                    timeoutErrorMessage = config.timeoutErrorMessage;
                }
                reject(new core_AxiosError(timeoutErrorMessage, transitional.clarifyTimeoutError ? core_AxiosError.ETIMEDOUT : core_AxiosError.ECONNABORTED, config, req));
                abort();
            });
        }
        // Send the request
        if (utils.isStream(data)) {
            let ended = false;
            let errored = false;
            data.on("end", ()=>{
                ended = true;
            });
            data.once("error", (err)=>{
                errored = true;
                req.destroy(err);
            });
            data.on("close", ()=>{
                if (!ended && !errored) {
                    abort(new cancel_CanceledError("Request stream has been aborted", config, req));
                }
            });
            data.pipe(req);
        } else {
            req.end(data);
        }
    });
});
const __setProxy = (/* unused pure expression or super */ null && (setProxy));

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/cookies.js


/* harmony default export */ const cookies = (platform.hasStandardBrowserEnv ? // Standard browser envs support document.cookie
{
    write (name, value, expires, path, domain, secure) {
        const cookie = [
            name + "=" + encodeURIComponent(value)
        ];
        utils.isNumber(expires) && cookie.push("expires=" + new Date(expires).toGMTString());
        utils.isString(path) && cookie.push("path=" + path);
        utils.isString(domain) && cookie.push("domain=" + domain);
        secure === true && cookie.push("secure");
        document.cookie = cookie.join("; ");
    },
    read (name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
    },
    remove (name) {
        this.write(name, "", Date.now() - 86400000);
    }
} : // Non-standard browser env (web workers, react-native) lack needed support.
{
    write () {},
    read () {
        return null;
    },
    remove () {}
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isURLSameOrigin.js



/* harmony default export */ const isURLSameOrigin = (platform.hasStandardBrowserEnv ? // Standard browser envs have full support of the APIs needed to test
// whether the request URL is of the same origin as current location.
function standardBrowserEnv() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement("a");
    let originURL;
    /**
    * Parse a URL to discover its components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */ function resolveURL(url) {
        let href = url;
        if (msie) {
            // IE needs attribute set twice to normalize properties
            urlParsingNode.setAttribute("href", href);
            href = urlParsingNode.href;
        }
        urlParsingNode.setAttribute("href", href);
        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
            href: urlParsingNode.href,
            protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
            host: urlParsingNode.host,
            search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
            hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
            hostname: urlParsingNode.hostname,
            port: urlParsingNode.port,
            pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
        };
    }
    originURL = resolveURL(window.location.href);
    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */ return function isURLSameOrigin(requestURL) {
        const parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
        return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
}() : // Non standard browser envs (web workers, react-native) lack needed support.
function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
        return true;
    };
}());

;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/xhr.js














function progressEventReducer(listener, isDownloadStream) {
    let bytesNotified = 0;
    const _speedometer = helpers_speedometer(50, 250);
    return (e)=>{
        const loaded = e.loaded;
        const total = e.lengthComputable ? e.total : undefined;
        const progressBytes = loaded - bytesNotified;
        const rate = _speedometer(progressBytes);
        const inRange = loaded <= total;
        bytesNotified = loaded;
        const data = {
            loaded,
            total,
            progress: total ? loaded / total : undefined,
            bytes: progressBytes,
            rate: rate ? rate : undefined,
            estimated: rate && total && inRange ? (total - loaded) / rate : undefined,
            event: e
        };
        data[isDownloadStream ? "download" : "upload"] = true;
        listener(data);
    };
}
const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
/* harmony default export */ const xhr = (isXHRAdapterSupported && function(config) {
    return new Promise(function dispatchXhrRequest(resolve, reject) {
        let requestData = config.data;
        const requestHeaders = core_AxiosHeaders.from(config.headers).normalize();
        let { responseType, withXSRFToken } = config;
        let onCanceled;
        function done() {
            if (config.cancelToken) {
                config.cancelToken.unsubscribe(onCanceled);
            }
            if (config.signal) {
                config.signal.removeEventListener("abort", onCanceled);
            }
        }
        let contentType;
        if (utils.isFormData(requestData)) {
            if (platform.hasStandardBrowserEnv || platform.hasStandardBrowserWebWorkerEnv) {
                requestHeaders.setContentType(false); // Let the browser set it
            } else if ((contentType = requestHeaders.getContentType()) !== false) {
                // fix semicolon duplication issue for ReactNative FormData implementation
                const [type, ...tokens] = contentType ? contentType.split(";").map((token)=>token.trim()).filter(Boolean) : [];
                requestHeaders.setContentType([
                    type || "multipart/form-data",
                    ...tokens
                ].join("; "));
            }
        }
        let request = new XMLHttpRequest();
        // HTTP basic authentication
        if (config.auth) {
            const username = config.auth.username || "";
            const password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : "";
            requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));
        }
        const fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);
        // Set the request timeout in MS
        request.timeout = config.timeout;
        function onloadend() {
            if (!request) {
                return;
            }
            // Prepare the response
            const responseHeaders = core_AxiosHeaders.from("getAllResponseHeaders" in request && request.getAllResponseHeaders());
            const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
            const response = {
                data: responseData,
                status: request.status,
                statusText: request.statusText,
                headers: responseHeaders,
                config,
                request
            };
            settle(function _resolve(value) {
                resolve(value);
                done();
            }, function _reject(err) {
                reject(err);
                done();
            }, response);
            // Clean up request
            request = null;
        }
        if ("onloadend" in request) {
            // Use onloadend if available
            request.onloadend = onloadend;
        } else {
            // Listen for ready state to emulate onloadend
            request.onreadystatechange = function handleLoad() {
                if (!request || request.readyState !== 4) {
                    return;
                }
                // The request errored out and we didn't get a response, this will be
                // handled by onerror instead
                // With one exception: request that using file: protocol, most browsers
                // will return status as 0 even though it's a successful request
                if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
                    return;
                }
                // readystate handler is calling before onerror or ontimeout handlers,
                // so we should call onloadend on the next 'tick'
                setTimeout(onloadend);
            };
        }
        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
            if (!request) {
                return;
            }
            reject(new core_AxiosError("Request aborted", core_AxiosError.ECONNABORTED, config, request));
            // Clean up request
            request = null;
        };
        // Handle low level network errors
        request.onerror = function handleError() {
            // Real errors are hidden from us by the browser
            // onerror should only fire if it's a network error
            reject(new core_AxiosError("Network Error", core_AxiosError.ERR_NETWORK, config, request));
            // Clean up request
            request = null;
        };
        // Handle timeout
        request.ontimeout = function handleTimeout() {
            let timeoutErrorMessage = config.timeout ? "timeout of " + config.timeout + "ms exceeded" : "timeout exceeded";
            const transitional = config.transitional || defaults_transitional;
            if (config.timeoutErrorMessage) {
                timeoutErrorMessage = config.timeoutErrorMessage;
            }
            reject(new core_AxiosError(timeoutErrorMessage, transitional.clarifyTimeoutError ? core_AxiosError.ETIMEDOUT : core_AxiosError.ECONNABORTED, config, request));
            // Clean up request
            request = null;
        };
        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (platform.hasStandardBrowserEnv) {
            withXSRFToken && utils.isFunction(withXSRFToken) && (withXSRFToken = withXSRFToken(config));
            if (withXSRFToken || withXSRFToken !== false && isURLSameOrigin(fullPath)) {
                // Add xsrf header
                const xsrfValue = config.xsrfHeaderName && config.xsrfCookieName && cookies.read(config.xsrfCookieName);
                if (xsrfValue) {
                    requestHeaders.set(config.xsrfHeaderName, xsrfValue);
                }
            }
        }
        // Remove Content-Type if data is undefined
        requestData === undefined && requestHeaders.setContentType(null);
        // Add headers to the request
        if ("setRequestHeader" in request) {
            utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
                request.setRequestHeader(key, val);
            });
        }
        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
            request.withCredentials = !!config.withCredentials;
        }
        // Add responseType to request if needed
        if (responseType && responseType !== "json") {
            request.responseType = config.responseType;
        }
        // Handle progress if needed
        if (typeof config.onDownloadProgress === "function") {
            request.addEventListener("progress", progressEventReducer(config.onDownloadProgress, true));
        }
        // Not all browsers support upload events
        if (typeof config.onUploadProgress === "function" && request.upload) {
            request.upload.addEventListener("progress", progressEventReducer(config.onUploadProgress));
        }
        if (config.cancelToken || config.signal) {
            // Handle cancellation
            // eslint-disable-next-line func-names
            onCanceled = (cancel)=>{
                if (!request) {
                    return;
                }
                reject(!cancel || cancel.type ? new cancel_CanceledError(null, config, request) : cancel);
                request.abort();
                request = null;
            };
            config.cancelToken && config.cancelToken.subscribe(onCanceled);
            if (config.signal) {
                config.signal.aborted ? onCanceled() : config.signal.addEventListener("abort", onCanceled);
            }
        }
        const protocol = parseProtocol(fullPath);
        if (protocol && platform.protocols.indexOf(protocol) === -1) {
            reject(new core_AxiosError("Unsupported protocol " + protocol + ":", core_AxiosError.ERR_BAD_REQUEST, config));
            return;
        }
        // Send the request
        request.send(requestData || null);
    });
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/adapters/adapters.js




const knownAdapters = {
    http: http,
    xhr: xhr
};
utils.forEach(knownAdapters, (fn, value)=>{
    if (fn) {
        try {
            Object.defineProperty(fn, "name", {
                value
            });
        } catch (e) {
        // eslint-disable-next-line no-empty
        }
        Object.defineProperty(fn, "adapterName", {
            value
        });
    }
});
const renderReason = (reason)=>`- ${reason}`;
const isResolvedHandle = (adapter)=>utils.isFunction(adapter) || adapter === null || adapter === false;
/* harmony default export */ const adapters = ({
    getAdapter: (adapters)=>{
        adapters = utils.isArray(adapters) ? adapters : [
            adapters
        ];
        const { length } = adapters;
        let nameOrAdapter;
        let adapter;
        const rejectedReasons = {};
        for(let i = 0; i < length; i++){
            nameOrAdapter = adapters[i];
            let id;
            adapter = nameOrAdapter;
            if (!isResolvedHandle(nameOrAdapter)) {
                adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
                if (adapter === undefined) {
                    throw new core_AxiosError(`Unknown adapter '${id}'`);
                }
            }
            if (adapter) {
                break;
            }
            rejectedReasons[id || "#" + i] = adapter;
        }
        if (!adapter) {
            const reasons = Object.entries(rejectedReasons).map(([id, state])=>`adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build"));
            let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
            throw new core_AxiosError(`There is no suitable adapter to dispatch the request ` + s, "ERR_NOT_SUPPORT");
        }
        return adapter;
    },
    adapters: knownAdapters
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/dispatchRequest.js







/**
 * Throws a `CanceledError` if cancellation has been requested.
 *
 * @param {Object} config The config that is to be used for the request
 *
 * @returns {void}
 */ function throwIfCancellationRequested(config) {
    if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
    }
    if (config.signal && config.signal.aborted) {
        throw new cancel_CanceledError(null, config);
    }
}
/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 *
 * @returns {Promise} The Promise to be fulfilled
 */ function dispatchRequest(config) {
    throwIfCancellationRequested(config);
    config.headers = core_AxiosHeaders.from(config.headers);
    // Transform request data
    config.data = transformData.call(config, config.transformRequest);
    if ([
        "post",
        "put",
        "patch"
    ].indexOf(config.method) !== -1) {
        config.headers.setContentType("application/x-www-form-urlencoded", false);
    }
    const adapter = adapters.getAdapter(config.adapter || lib_defaults.adapter);
    return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);
        // Transform response data
        response.data = transformData.call(config, config.transformResponse, response);
        response.headers = core_AxiosHeaders.from(response.headers);
        return response;
    }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
            throwIfCancellationRequested(config);
            // Transform response data
            if (reason && reason.response) {
                reason.response.data = transformData.call(config, config.transformResponse, reason.response);
                reason.response.headers = core_AxiosHeaders.from(reason.response.headers);
            }
        }
        return Promise.reject(reason);
    });
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/mergeConfig.js



const headersToObject = (thing)=>thing instanceof core_AxiosHeaders ? thing.toJSON() : thing;
/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 *
 * @returns {Object} New object resulting from merging config2 to config1
 */ function mergeConfig(config1, config2) {
    // eslint-disable-next-line no-param-reassign
    config2 = config2 || {};
    const config = {};
    function getMergedValue(target, source, caseless) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
            return utils.merge.call({
                caseless
            }, target, source);
        } else if (utils.isPlainObject(source)) {
            return utils.merge({}, source);
        } else if (utils.isArray(source)) {
            return source.slice();
        }
        return source;
    }
    // eslint-disable-next-line consistent-return
    function mergeDeepProperties(a, b, caseless) {
        if (!utils.isUndefined(b)) {
            return getMergedValue(a, b, caseless);
        } else if (!utils.isUndefined(a)) {
            return getMergedValue(undefined, a, caseless);
        }
    }
    // eslint-disable-next-line consistent-return
    function valueFromConfig2(a, b) {
        if (!utils.isUndefined(b)) {
            return getMergedValue(undefined, b);
        }
    }
    // eslint-disable-next-line consistent-return
    function defaultToConfig2(a, b) {
        if (!utils.isUndefined(b)) {
            return getMergedValue(undefined, b);
        } else if (!utils.isUndefined(a)) {
            return getMergedValue(undefined, a);
        }
    }
    // eslint-disable-next-line consistent-return
    function mergeDirectKeys(a, b, prop) {
        if (prop in config2) {
            return getMergedValue(a, b);
        } else if (prop in config1) {
            return getMergedValue(undefined, a);
        }
    }
    const mergeMap = {
        url: valueFromConfig2,
        method: valueFromConfig2,
        data: valueFromConfig2,
        baseURL: defaultToConfig2,
        transformRequest: defaultToConfig2,
        transformResponse: defaultToConfig2,
        paramsSerializer: defaultToConfig2,
        timeout: defaultToConfig2,
        timeoutMessage: defaultToConfig2,
        withCredentials: defaultToConfig2,
        withXSRFToken: defaultToConfig2,
        adapter: defaultToConfig2,
        responseType: defaultToConfig2,
        xsrfCookieName: defaultToConfig2,
        xsrfHeaderName: defaultToConfig2,
        onUploadProgress: defaultToConfig2,
        onDownloadProgress: defaultToConfig2,
        decompress: defaultToConfig2,
        maxContentLength: defaultToConfig2,
        maxBodyLength: defaultToConfig2,
        beforeRedirect: defaultToConfig2,
        transport: defaultToConfig2,
        httpAgent: defaultToConfig2,
        httpsAgent: defaultToConfig2,
        cancelToken: defaultToConfig2,
        socketPath: defaultToConfig2,
        responseEncoding: defaultToConfig2,
        validateStatus: mergeDirectKeys,
        headers: (a, b)=>mergeDeepProperties(headersToObject(a), headersToObject(b), true)
    };
    utils.forEach(Object.keys(Object.assign({}, config1, config2)), function computeConfigValue(prop) {
        const merge = mergeMap[prop] || mergeDeepProperties;
        const configValue = merge(config1[prop], config2[prop], prop);
        utils.isUndefined(configValue) && merge !== mergeDirectKeys || (config[prop] = configValue);
    });
    return config;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/validator.js



const validators = {};
// eslint-disable-next-line func-names
[
    "object",
    "boolean",
    "number",
    "function",
    "string",
    "symbol"
].forEach((type, i)=>{
    validators[type] = function validator(thing) {
        return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
    };
});
const deprecatedWarnings = {};
/**
 * Transitional option validator
 *
 * @param {function|boolean?} validator - set to false if the transitional option has been removed
 * @param {string?} version - deprecated version / removed since version
 * @param {string?} message - some message with additional info
 *
 * @returns {function}
 */ validators.transitional = function transitional(validator, version, message) {
    function formatMessage(opt, desc) {
        return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
    }
    // eslint-disable-next-line func-names
    return (value, opt, opts)=>{
        if (validator === false) {
            throw new core_AxiosError(formatMessage(opt, " has been removed" + (version ? " in " + version : "")), core_AxiosError.ERR_DEPRECATED);
        }
        if (version && !deprecatedWarnings[opt]) {
            deprecatedWarnings[opt] = true;
            // eslint-disable-next-line no-console
            console.warn(formatMessage(opt, " has been deprecated since v" + version + " and will be removed in the near future"));
        }
        return validator ? validator(value, opt, opts) : true;
    };
};
/**
 * Assert object's properties type
 *
 * @param {object} options
 * @param {object} schema
 * @param {boolean?} allowUnknown
 *
 * @returns {object}
 */ function assertOptions(options, schema, allowUnknown) {
    if (typeof options !== "object") {
        throw new core_AxiosError("options must be an object", core_AxiosError.ERR_BAD_OPTION_VALUE);
    }
    const keys = Object.keys(options);
    let i = keys.length;
    while(i-- > 0){
        const opt = keys[i];
        const validator = schema[opt];
        if (validator) {
            const value = options[opt];
            const result = value === undefined || validator(value, opt, options);
            if (result !== true) {
                throw new core_AxiosError("option " + opt + " must be " + result, core_AxiosError.ERR_BAD_OPTION_VALUE);
            }
            continue;
        }
        if (allowUnknown !== true) {
            throw new core_AxiosError("Unknown option " + opt, core_AxiosError.ERR_BAD_OPTION);
        }
    }
}
/* harmony default export */ const validator = ({
    assertOptions,
    validators
});

;// CONCATENATED MODULE: ./node_modules/axios/lib/core/Axios.js









const Axios_validators = validator.validators;
/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 *
 * @return {Axios} A new instance of Axios
 */ class Axios {
    constructor(instanceConfig){
        this.defaults = instanceConfig;
        this.interceptors = {
            request: new core_InterceptorManager(),
            response: new core_InterceptorManager()
        };
    }
    /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */ request(configOrUrl, config) {
        /*eslint no-param-reassign:0*/ // Allow for axios('example/url'[, config]) a la fetch API
        if (typeof configOrUrl === "string") {
            config = config || {};
            config.url = configOrUrl;
        } else {
            config = configOrUrl || {};
        }
        config = mergeConfig(this.defaults, config);
        const { transitional, paramsSerializer, headers } = config;
        if (transitional !== undefined) {
            validator.assertOptions(transitional, {
                silentJSONParsing: Axios_validators.transitional(Axios_validators.boolean),
                forcedJSONParsing: Axios_validators.transitional(Axios_validators.boolean),
                clarifyTimeoutError: Axios_validators.transitional(Axios_validators.boolean)
            }, false);
        }
        if (paramsSerializer != null) {
            if (utils.isFunction(paramsSerializer)) {
                config.paramsSerializer = {
                    serialize: paramsSerializer
                };
            } else {
                validator.assertOptions(paramsSerializer, {
                    encode: Axios_validators.function,
                    serialize: Axios_validators.function
                }, true);
            }
        }
        // Set config.method
        config.method = (config.method || this.defaults.method || "get").toLowerCase();
        // Flatten headers
        let contextHeaders = headers && utils.merge(headers.common, headers[config.method]);
        headers && utils.forEach([
            "delete",
            "get",
            "head",
            "post",
            "put",
            "patch",
            "common"
        ], (method)=>{
            delete headers[method];
        });
        config.headers = core_AxiosHeaders.concat(contextHeaders, headers);
        // filter out skipped interceptors
        const requestInterceptorChain = [];
        let synchronousRequestInterceptors = true;
        this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
            if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config) === false) {
                return;
            }
            synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
            requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
        });
        const responseInterceptorChain = [];
        this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
            responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
        });
        let promise;
        let i = 0;
        let len;
        if (!synchronousRequestInterceptors) {
            const chain = [
                dispatchRequest.bind(this),
                undefined
            ];
            chain.unshift.apply(chain, requestInterceptorChain);
            chain.push.apply(chain, responseInterceptorChain);
            len = chain.length;
            promise = Promise.resolve(config);
            while(i < len){
                promise = promise.then(chain[i++], chain[i++]);
            }
            return promise;
        }
        len = requestInterceptorChain.length;
        let newConfig = config;
        i = 0;
        while(i < len){
            const onFulfilled = requestInterceptorChain[i++];
            const onRejected = requestInterceptorChain[i++];
            try {
                newConfig = onFulfilled(newConfig);
            } catch (error) {
                onRejected.call(this, error);
                break;
            }
        }
        try {
            promise = dispatchRequest.call(this, newConfig);
        } catch (error) {
            return Promise.reject(error);
        }
        i = 0;
        len = responseInterceptorChain.length;
        while(i < len){
            promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
        }
        return promise;
    }
    getUri(config) {
        config = mergeConfig(this.defaults, config);
        const fullPath = buildFullPath(config.baseURL, config.url);
        return buildURL(fullPath, config.params, config.paramsSerializer);
    }
}
// Provide aliases for supported request methods
utils.forEach([
    "delete",
    "get",
    "head",
    "options"
], function forEachMethodNoData(method) {
    /*eslint func-names:0*/ Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
            method,
            url,
            data: (config || {}).data
        }));
    };
});
utils.forEach([
    "post",
    "put",
    "patch"
], function forEachMethodWithData(method) {
    /*eslint func-names:0*/ function generateHTTPMethod(isForm) {
        return function httpMethod(url, data, config) {
            return this.request(mergeConfig(config || {}, {
                method,
                headers: isForm ? {
                    "Content-Type": "multipart/form-data"
                } : {},
                url,
                data
            }));
        };
    }
    Axios.prototype[method] = generateHTTPMethod();
    Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
/* harmony default export */ const core_Axios = (Axios);

;// CONCATENATED MODULE: ./node_modules/axios/lib/cancel/CancelToken.js


/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @param {Function} executor The executor function.
 *
 * @returns {CancelToken}
 */ class CancelToken {
    constructor(executor){
        if (typeof executor !== "function") {
            throw new TypeError("executor must be a function.");
        }
        let resolvePromise;
        this.promise = new Promise(function promiseExecutor(resolve) {
            resolvePromise = resolve;
        });
        const token = this;
        // eslint-disable-next-line func-names
        this.promise.then((cancel)=>{
            if (!token._listeners) return;
            let i = token._listeners.length;
            while(i-- > 0){
                token._listeners[i](cancel);
            }
            token._listeners = null;
        });
        // eslint-disable-next-line func-names
        this.promise.then = (onfulfilled)=>{
            let _resolve;
            // eslint-disable-next-line func-names
            const promise = new Promise((resolve)=>{
                token.subscribe(resolve);
                _resolve = resolve;
            }).then(onfulfilled);
            promise.cancel = function reject() {
                token.unsubscribe(_resolve);
            };
            return promise;
        };
        executor(function cancel(message, config, request) {
            if (token.reason) {
                // Cancellation has already been requested
                return;
            }
            token.reason = new cancel_CanceledError(message, config, request);
            resolvePromise(token.reason);
        });
    }
    /**
   * Throws a `CanceledError` if cancellation has been requested.
   */ throwIfRequested() {
        if (this.reason) {
            throw this.reason;
        }
    }
    /**
   * Subscribe to the cancel signal
   */ subscribe(listener) {
        if (this.reason) {
            listener(this.reason);
            return;
        }
        if (this._listeners) {
            this._listeners.push(listener);
        } else {
            this._listeners = [
                listener
            ];
        }
    }
    /**
   * Unsubscribe from the cancel signal
   */ unsubscribe(listener) {
        if (!this._listeners) {
            return;
        }
        const index = this._listeners.indexOf(listener);
        if (index !== -1) {
            this._listeners.splice(index, 1);
        }
    }
    /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */ static source() {
        let cancel;
        const token = new CancelToken(function executor(c) {
            cancel = c;
        });
        return {
            token,
            cancel
        };
    }
}
/* harmony default export */ const cancel_CancelToken = (CancelToken);

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/spread.js

/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 *
 * @returns {Function}
 */ function spread(callback) {
    return function wrap(arr) {
        return callback.apply(null, arr);
    };
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/isAxiosError.js


/**
 * Determines whether the payload is an error thrown by Axios
 *
 * @param {*} payload The value to test
 *
 * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
 */ function isAxiosError(payload) {
    return utils.isObject(payload) && payload.isAxiosError === true;
}

;// CONCATENATED MODULE: ./node_modules/axios/lib/helpers/HttpStatusCode.js
const HttpStatusCode = {
    Continue: 100,
    SwitchingProtocols: 101,
    Processing: 102,
    EarlyHints: 103,
    Ok: 200,
    Created: 201,
    Accepted: 202,
    NonAuthoritativeInformation: 203,
    NoContent: 204,
    ResetContent: 205,
    PartialContent: 206,
    MultiStatus: 207,
    AlreadyReported: 208,
    ImUsed: 226,
    MultipleChoices: 300,
    MovedPermanently: 301,
    Found: 302,
    SeeOther: 303,
    NotModified: 304,
    UseProxy: 305,
    Unused: 306,
    TemporaryRedirect: 307,
    PermanentRedirect: 308,
    BadRequest: 400,
    Unauthorized: 401,
    PaymentRequired: 402,
    Forbidden: 403,
    NotFound: 404,
    MethodNotAllowed: 405,
    NotAcceptable: 406,
    ProxyAuthenticationRequired: 407,
    RequestTimeout: 408,
    Conflict: 409,
    Gone: 410,
    LengthRequired: 411,
    PreconditionFailed: 412,
    PayloadTooLarge: 413,
    UriTooLong: 414,
    UnsupportedMediaType: 415,
    RangeNotSatisfiable: 416,
    ExpectationFailed: 417,
    ImATeapot: 418,
    MisdirectedRequest: 421,
    UnprocessableEntity: 422,
    Locked: 423,
    FailedDependency: 424,
    TooEarly: 425,
    UpgradeRequired: 426,
    PreconditionRequired: 428,
    TooManyRequests: 429,
    RequestHeaderFieldsTooLarge: 431,
    UnavailableForLegalReasons: 451,
    InternalServerError: 500,
    NotImplemented: 501,
    BadGateway: 502,
    ServiceUnavailable: 503,
    GatewayTimeout: 504,
    HttpVersionNotSupported: 505,
    VariantAlsoNegotiates: 506,
    InsufficientStorage: 507,
    LoopDetected: 508,
    NotExtended: 510,
    NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode).forEach(([key, value])=>{
    HttpStatusCode[value] = key;
});
/* harmony default export */ const helpers_HttpStatusCode = (HttpStatusCode);

;// CONCATENATED MODULE: ./node_modules/axios/lib/axios.js


















/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 *
 * @returns {Axios} A new instance of Axios
 */ function createInstance(defaultConfig) {
    const context = new core_Axios(defaultConfig);
    const instance = bind(core_Axios.prototype.request, context);
    // Copy axios.prototype to instance
    utils.extend(instance, core_Axios.prototype, context, {
        allOwnKeys: true
    });
    // Copy context to instance
    utils.extend(instance, context, null, {
        allOwnKeys: true
    });
    // Factory for creating new instances
    instance.create = function create(instanceConfig) {
        return createInstance(mergeConfig(defaultConfig, instanceConfig));
    };
    return instance;
}
// Create the default instance to be exported
const axios = createInstance(lib_defaults);
// Expose Axios class to allow class inheritance
axios.Axios = core_Axios;
// Expose Cancel & CancelToken
axios.CanceledError = cancel_CanceledError;
axios.CancelToken = cancel_CancelToken;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = helpers_toFormData;
// Expose AxiosError class
axios.AxiosError = core_AxiosError;
// alias for CanceledError for backward compatibility
axios.Cancel = axios.CanceledError;
// Expose all/spread
axios.all = function all(promises) {
    return Promise.all(promises);
};
axios.spread = spread;
// Expose isAxiosError
axios.isAxiosError = isAxiosError;
// Expose mergeConfig
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = core_AxiosHeaders;
axios.formToJSON = (thing)=>helpers_formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters.getAdapter;
axios.HttpStatusCode = helpers_HttpStatusCode;
axios.default = axios;
// this module should only have a default export
/* harmony default export */ const lib_axios = (axios);


/***/ }),

/***/ 91670:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"application/1d-interleaved-parityfec":{"source":"iana"},"application/3gpdash-qoe-report+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/3gpp-ims+xml":{"source":"iana","compressible":true},"application/3gpphal+json":{"source":"iana","compressible":true},"application/3gpphalforms+json":{"source":"iana","compressible":true},"application/a2l":{"source":"iana"},"application/ace+cbor":{"source":"iana"},"application/activemessage":{"source":"iana"},"application/activity+json":{"source":"iana","compressible":true},"application/alto-costmap+json":{"source":"iana","compressible":true},"application/alto-costmapfilter+json":{"source":"iana","compressible":true},"application/alto-directory+json":{"source":"iana","compressible":true},"application/alto-endpointcost+json":{"source":"iana","compressible":true},"application/alto-endpointcostparams+json":{"source":"iana","compressible":true},"application/alto-endpointprop+json":{"source":"iana","compressible":true},"application/alto-endpointpropparams+json":{"source":"iana","compressible":true},"application/alto-error+json":{"source":"iana","compressible":true},"application/alto-networkmap+json":{"source":"iana","compressible":true},"application/alto-networkmapfilter+json":{"source":"iana","compressible":true},"application/alto-updatestreamcontrol+json":{"source":"iana","compressible":true},"application/alto-updatestreamparams+json":{"source":"iana","compressible":true},"application/aml":{"source":"iana"},"application/andrew-inset":{"source":"iana","extensions":["ez"]},"application/applefile":{"source":"iana"},"application/applixware":{"source":"apache","extensions":["aw"]},"application/at+jwt":{"source":"iana"},"application/atf":{"source":"iana"},"application/atfx":{"source":"iana"},"application/atom+xml":{"source":"iana","compressible":true,"extensions":["atom"]},"application/atomcat+xml":{"source":"iana","compressible":true,"extensions":["atomcat"]},"application/atomdeleted+xml":{"source":"iana","compressible":true,"extensions":["atomdeleted"]},"application/atomicmail":{"source":"iana"},"application/atomsvc+xml":{"source":"iana","compressible":true,"extensions":["atomsvc"]},"application/atsc-dwd+xml":{"source":"iana","compressible":true,"extensions":["dwd"]},"application/atsc-dynamic-event-message":{"source":"iana"},"application/atsc-held+xml":{"source":"iana","compressible":true,"extensions":["held"]},"application/atsc-rdt+json":{"source":"iana","compressible":true},"application/atsc-rsat+xml":{"source":"iana","compressible":true,"extensions":["rsat"]},"application/atxml":{"source":"iana"},"application/auth-policy+xml":{"source":"iana","compressible":true},"application/bacnet-xdd+zip":{"source":"iana","compressible":false},"application/batch-smtp":{"source":"iana"},"application/bdoc":{"compressible":false,"extensions":["bdoc"]},"application/beep+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/calendar+json":{"source":"iana","compressible":true},"application/calendar+xml":{"source":"iana","compressible":true,"extensions":["xcs"]},"application/call-completion":{"source":"iana"},"application/cals-1840":{"source":"iana"},"application/captive+json":{"source":"iana","compressible":true},"application/cbor":{"source":"iana"},"application/cbor-seq":{"source":"iana"},"application/cccex":{"source":"iana"},"application/ccmp+xml":{"source":"iana","compressible":true},"application/ccxml+xml":{"source":"iana","compressible":true,"extensions":["ccxml"]},"application/cdfx+xml":{"source":"iana","compressible":true,"extensions":["cdfx"]},"application/cdmi-capability":{"source":"iana","extensions":["cdmia"]},"application/cdmi-container":{"source":"iana","extensions":["cdmic"]},"application/cdmi-domain":{"source":"iana","extensions":["cdmid"]},"application/cdmi-object":{"source":"iana","extensions":["cdmio"]},"application/cdmi-queue":{"source":"iana","extensions":["cdmiq"]},"application/cdni":{"source":"iana"},"application/cea":{"source":"iana"},"application/cea-2018+xml":{"source":"iana","compressible":true},"application/cellml+xml":{"source":"iana","compressible":true},"application/cfw":{"source":"iana"},"application/city+json":{"source":"iana","compressible":true},"application/clr":{"source":"iana"},"application/clue+xml":{"source":"iana","compressible":true},"application/clue_info+xml":{"source":"iana","compressible":true},"application/cms":{"source":"iana"},"application/cnrp+xml":{"source":"iana","compressible":true},"application/coap-group+json":{"source":"iana","compressible":true},"application/coap-payload":{"source":"iana"},"application/commonground":{"source":"iana"},"application/conference-info+xml":{"source":"iana","compressible":true},"application/cose":{"source":"iana"},"application/cose-key":{"source":"iana"},"application/cose-key-set":{"source":"iana"},"application/cpl+xml":{"source":"iana","compressible":true,"extensions":["cpl"]},"application/csrattrs":{"source":"iana"},"application/csta+xml":{"source":"iana","compressible":true},"application/cstadata+xml":{"source":"iana","compressible":true},"application/csvm+json":{"source":"iana","compressible":true},"application/cu-seeme":{"source":"apache","extensions":["cu"]},"application/cwt":{"source":"iana"},"application/cybercash":{"source":"iana"},"application/dart":{"compressible":true},"application/dash+xml":{"source":"iana","compressible":true,"extensions":["mpd"]},"application/dash-patch+xml":{"source":"iana","compressible":true,"extensions":["mpp"]},"application/dashdelta":{"source":"iana"},"application/davmount+xml":{"source":"iana","compressible":true,"extensions":["davmount"]},"application/dca-rft":{"source":"iana"},"application/dcd":{"source":"iana"},"application/dec-dx":{"source":"iana"},"application/dialog-info+xml":{"source":"iana","compressible":true},"application/dicom":{"source":"iana"},"application/dicom+json":{"source":"iana","compressible":true},"application/dicom+xml":{"source":"iana","compressible":true},"application/dii":{"source":"iana"},"application/dit":{"source":"iana"},"application/dns":{"source":"iana"},"application/dns+json":{"source":"iana","compressible":true},"application/dns-message":{"source":"iana"},"application/docbook+xml":{"source":"apache","compressible":true,"extensions":["dbk"]},"application/dots+cbor":{"source":"iana"},"application/dskpp+xml":{"source":"iana","compressible":true},"application/dssc+der":{"source":"iana","extensions":["dssc"]},"application/dssc+xml":{"source":"iana","compressible":true,"extensions":["xdssc"]},"application/dvcs":{"source":"iana"},"application/ecmascript":{"source":"iana","compressible":true,"extensions":["es","ecma"]},"application/edi-consent":{"source":"iana"},"application/edi-x12":{"source":"iana","compressible":false},"application/edifact":{"source":"iana","compressible":false},"application/efi":{"source":"iana"},"application/elm+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/elm+xml":{"source":"iana","compressible":true},"application/emergencycalldata.cap+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/emergencycalldata.comment+xml":{"source":"iana","compressible":true},"application/emergencycalldata.control+xml":{"source":"iana","compressible":true},"application/emergencycalldata.deviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.ecall.msd":{"source":"iana"},"application/emergencycalldata.providerinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.serviceinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.subscriberinfo+xml":{"source":"iana","compressible":true},"application/emergencycalldata.veds+xml":{"source":"iana","compressible":true},"application/emma+xml":{"source":"iana","compressible":true,"extensions":["emma"]},"application/emotionml+xml":{"source":"iana","compressible":true,"extensions":["emotionml"]},"application/encaprtp":{"source":"iana"},"application/epp+xml":{"source":"iana","compressible":true},"application/epub+zip":{"source":"iana","compressible":false,"extensions":["epub"]},"application/eshop":{"source":"iana"},"application/exi":{"source":"iana","extensions":["exi"]},"application/expect-ct-report+json":{"source":"iana","compressible":true},"application/express":{"source":"iana","extensions":["exp"]},"application/fastinfoset":{"source":"iana"},"application/fastsoap":{"source":"iana"},"application/fdt+xml":{"source":"iana","compressible":true,"extensions":["fdt"]},"application/fhir+json":{"source":"iana","charset":"UTF-8","compressible":true},"application/fhir+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/fido.trusted-apps+json":{"compressible":true},"application/fits":{"source":"iana"},"application/flexfec":{"source":"iana"},"application/font-sfnt":{"source":"iana"},"application/font-tdpfr":{"source":"iana","extensions":["pfr"]},"application/font-woff":{"source":"iana","compressible":false},"application/framework-attributes+xml":{"source":"iana","compressible":true},"application/geo+json":{"source":"iana","compressible":true,"extensions":["geojson"]},"application/geo+json-seq":{"source":"iana"},"application/geopackage+sqlite3":{"source":"iana"},"application/geoxacml+xml":{"source":"iana","compressible":true},"application/gltf-buffer":{"source":"iana"},"application/gml+xml":{"source":"iana","compressible":true,"extensions":["gml"]},"application/gpx+xml":{"source":"apache","compressible":true,"extensions":["gpx"]},"application/gxf":{"source":"apache","extensions":["gxf"]},"application/gzip":{"source":"iana","compressible":false,"extensions":["gz"]},"application/h224":{"source":"iana"},"application/held+xml":{"source":"iana","compressible":true},"application/hjson":{"extensions":["hjson"]},"application/http":{"source":"iana"},"application/hyperstudio":{"source":"iana","extensions":["stk"]},"application/ibe-key-request+xml":{"source":"iana","compressible":true},"application/ibe-pkg-reply+xml":{"source":"iana","compressible":true},"application/ibe-pp-data":{"source":"iana"},"application/iges":{"source":"iana"},"application/im-iscomposing+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/index":{"source":"iana"},"application/index.cmd":{"source":"iana"},"application/index.obj":{"source":"iana"},"application/index.response":{"source":"iana"},"application/index.vnd":{"source":"iana"},"application/inkml+xml":{"source":"iana","compressible":true,"extensions":["ink","inkml"]},"application/iotp":{"source":"iana"},"application/ipfix":{"source":"iana","extensions":["ipfix"]},"application/ipp":{"source":"iana"},"application/isup":{"source":"iana"},"application/its+xml":{"source":"iana","compressible":true,"extensions":["its"]},"application/java-archive":{"source":"apache","compressible":false,"extensions":["jar","war","ear"]},"application/java-serialized-object":{"source":"apache","compressible":false,"extensions":["ser"]},"application/java-vm":{"source":"apache","compressible":false,"extensions":["class"]},"application/javascript":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["js","mjs"]},"application/jf2feed+json":{"source":"iana","compressible":true},"application/jose":{"source":"iana"},"application/jose+json":{"source":"iana","compressible":true},"application/jrd+json":{"source":"iana","compressible":true},"application/jscalendar+json":{"source":"iana","compressible":true},"application/json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["json","map"]},"application/json-patch+json":{"source":"iana","compressible":true},"application/json-seq":{"source":"iana"},"application/json5":{"extensions":["json5"]},"application/jsonml+json":{"source":"apache","compressible":true,"extensions":["jsonml"]},"application/jwk+json":{"source":"iana","compressible":true},"application/jwk-set+json":{"source":"iana","compressible":true},"application/jwt":{"source":"iana"},"application/kpml-request+xml":{"source":"iana","compressible":true},"application/kpml-response+xml":{"source":"iana","compressible":true},"application/ld+json":{"source":"iana","compressible":true,"extensions":["jsonld"]},"application/lgr+xml":{"source":"iana","compressible":true,"extensions":["lgr"]},"application/link-format":{"source":"iana"},"application/load-control+xml":{"source":"iana","compressible":true},"application/lost+xml":{"source":"iana","compressible":true,"extensions":["lostxml"]},"application/lostsync+xml":{"source":"iana","compressible":true},"application/lpf+zip":{"source":"iana","compressible":false},"application/lxf":{"source":"iana"},"application/mac-binhex40":{"source":"iana","extensions":["hqx"]},"application/mac-compactpro":{"source":"apache","extensions":["cpt"]},"application/macwriteii":{"source":"iana"},"application/mads+xml":{"source":"iana","compressible":true,"extensions":["mads"]},"application/manifest+json":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["webmanifest"]},"application/marc":{"source":"iana","extensions":["mrc"]},"application/marcxml+xml":{"source":"iana","compressible":true,"extensions":["mrcx"]},"application/mathematica":{"source":"iana","extensions":["ma","nb","mb"]},"application/mathml+xml":{"source":"iana","compressible":true,"extensions":["mathml"]},"application/mathml-content+xml":{"source":"iana","compressible":true},"application/mathml-presentation+xml":{"source":"iana","compressible":true},"application/mbms-associated-procedure-description+xml":{"source":"iana","compressible":true},"application/mbms-deregister+xml":{"source":"iana","compressible":true},"application/mbms-envelope+xml":{"source":"iana","compressible":true},"application/mbms-msk+xml":{"source":"iana","compressible":true},"application/mbms-msk-response+xml":{"source":"iana","compressible":true},"application/mbms-protection-description+xml":{"source":"iana","compressible":true},"application/mbms-reception-report+xml":{"source":"iana","compressible":true},"application/mbms-register+xml":{"source":"iana","compressible":true},"application/mbms-register-response+xml":{"source":"iana","compressible":true},"application/mbms-schedule+xml":{"source":"iana","compressible":true},"application/mbms-user-service-description+xml":{"source":"iana","compressible":true},"application/mbox":{"source":"iana","extensions":["mbox"]},"application/media-policy-dataset+xml":{"source":"iana","compressible":true,"extensions":["mpf"]},"application/media_control+xml":{"source":"iana","compressible":true},"application/mediaservercontrol+xml":{"source":"iana","compressible":true,"extensions":["mscml"]},"application/merge-patch+json":{"source":"iana","compressible":true},"application/metalink+xml":{"source":"apache","compressible":true,"extensions":["metalink"]},"application/metalink4+xml":{"source":"iana","compressible":true,"extensions":["meta4"]},"application/mets+xml":{"source":"iana","compressible":true,"extensions":["mets"]},"application/mf4":{"source":"iana"},"application/mikey":{"source":"iana"},"application/mipc":{"source":"iana"},"application/missing-blocks+cbor-seq":{"source":"iana"},"application/mmt-aei+xml":{"source":"iana","compressible":true,"extensions":["maei"]},"application/mmt-usd+xml":{"source":"iana","compressible":true,"extensions":["musd"]},"application/mods+xml":{"source":"iana","compressible":true,"extensions":["mods"]},"application/moss-keys":{"source":"iana"},"application/moss-signature":{"source":"iana"},"application/mosskey-data":{"source":"iana"},"application/mosskey-request":{"source":"iana"},"application/mp21":{"source":"iana","extensions":["m21","mp21"]},"application/mp4":{"source":"iana","extensions":["mp4s","m4p"]},"application/mpeg4-generic":{"source":"iana"},"application/mpeg4-iod":{"source":"iana"},"application/mpeg4-iod-xmt":{"source":"iana"},"application/mrb-consumer+xml":{"source":"iana","compressible":true},"application/mrb-publish+xml":{"source":"iana","compressible":true},"application/msc-ivr+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msc-mixer+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/msword":{"source":"iana","compressible":false,"extensions":["doc","dot"]},"application/mud+json":{"source":"iana","compressible":true},"application/multipart-core":{"source":"iana"},"application/mxf":{"source":"iana","extensions":["mxf"]},"application/n-quads":{"source":"iana","extensions":["nq"]},"application/n-triples":{"source":"iana","extensions":["nt"]},"application/nasdata":{"source":"iana"},"application/news-checkgroups":{"source":"iana","charset":"US-ASCII"},"application/news-groupinfo":{"source":"iana","charset":"US-ASCII"},"application/news-transmission":{"source":"iana"},"application/nlsml+xml":{"source":"iana","compressible":true},"application/node":{"source":"iana","extensions":["cjs"]},"application/nss":{"source":"iana"},"application/oauth-authz-req+jwt":{"source":"iana"},"application/oblivious-dns-message":{"source":"iana"},"application/ocsp-request":{"source":"iana"},"application/ocsp-response":{"source":"iana"},"application/octet-stream":{"source":"iana","compressible":false,"extensions":["bin","dms","lrf","mar","so","dist","distz","pkg","bpk","dump","elc","deploy","exe","dll","deb","dmg","iso","img","msi","msp","msm","buffer"]},"application/oda":{"source":"iana","extensions":["oda"]},"application/odm+xml":{"source":"iana","compressible":true},"application/odx":{"source":"iana"},"application/oebps-package+xml":{"source":"iana","compressible":true,"extensions":["opf"]},"application/ogg":{"source":"iana","compressible":false,"extensions":["ogx"]},"application/omdoc+xml":{"source":"apache","compressible":true,"extensions":["omdoc"]},"application/onenote":{"source":"apache","extensions":["onetoc","onetoc2","onetmp","onepkg"]},"application/opc-nodeset+xml":{"source":"iana","compressible":true},"application/oscore":{"source":"iana"},"application/oxps":{"source":"iana","extensions":["oxps"]},"application/p21":{"source":"iana"},"application/p21+zip":{"source":"iana","compressible":false},"application/p2p-overlay+xml":{"source":"iana","compressible":true,"extensions":["relo"]},"application/parityfec":{"source":"iana"},"application/passport":{"source":"iana"},"application/patch-ops-error+xml":{"source":"iana","compressible":true,"extensions":["xer"]},"application/pdf":{"source":"iana","compressible":false,"extensions":["pdf"]},"application/pdx":{"source":"iana"},"application/pem-certificate-chain":{"source":"iana"},"application/pgp-encrypted":{"source":"iana","compressible":false,"extensions":["pgp"]},"application/pgp-keys":{"source":"iana","extensions":["asc"]},"application/pgp-signature":{"source":"iana","extensions":["asc","sig"]},"application/pics-rules":{"source":"apache","extensions":["prf"]},"application/pidf+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pidf-diff+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/pkcs10":{"source":"iana","extensions":["p10"]},"application/pkcs12":{"source":"iana"},"application/pkcs7-mime":{"source":"iana","extensions":["p7m","p7c"]},"application/pkcs7-signature":{"source":"iana","extensions":["p7s"]},"application/pkcs8":{"source":"iana","extensions":["p8"]},"application/pkcs8-encrypted":{"source":"iana"},"application/pkix-attr-cert":{"source":"iana","extensions":["ac"]},"application/pkix-cert":{"source":"iana","extensions":["cer"]},"application/pkix-crl":{"source":"iana","extensions":["crl"]},"application/pkix-pkipath":{"source":"iana","extensions":["pkipath"]},"application/pkixcmp":{"source":"iana","extensions":["pki"]},"application/pls+xml":{"source":"iana","compressible":true,"extensions":["pls"]},"application/poc-settings+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/postscript":{"source":"iana","compressible":true,"extensions":["ai","eps","ps"]},"application/ppsp-tracker+json":{"source":"iana","compressible":true},"application/problem+json":{"source":"iana","compressible":true},"application/problem+xml":{"source":"iana","compressible":true},"application/provenance+xml":{"source":"iana","compressible":true,"extensions":["provx"]},"application/prs.alvestrand.titrax-sheet":{"source":"iana"},"application/prs.cww":{"source":"iana","extensions":["cww"]},"application/prs.cyn":{"source":"iana","charset":"7-BIT"},"application/prs.hpub+zip":{"source":"iana","compressible":false},"application/prs.nprend":{"source":"iana"},"application/prs.plucker":{"source":"iana"},"application/prs.rdf-xml-crypt":{"source":"iana"},"application/prs.xsf+xml":{"source":"iana","compressible":true},"application/pskc+xml":{"source":"iana","compressible":true,"extensions":["pskcxml"]},"application/pvd+json":{"source":"iana","compressible":true},"application/qsig":{"source":"iana"},"application/raml+yaml":{"compressible":true,"extensions":["raml"]},"application/raptorfec":{"source":"iana"},"application/rdap+json":{"source":"iana","compressible":true},"application/rdf+xml":{"source":"iana","compressible":true,"extensions":["rdf","owl"]},"application/reginfo+xml":{"source":"iana","compressible":true,"extensions":["rif"]},"application/relax-ng-compact-syntax":{"source":"iana","extensions":["rnc"]},"application/remote-printing":{"source":"iana"},"application/reputon+json":{"source":"iana","compressible":true},"application/resource-lists+xml":{"source":"iana","compressible":true,"extensions":["rl"]},"application/resource-lists-diff+xml":{"source":"iana","compressible":true,"extensions":["rld"]},"application/rfc+xml":{"source":"iana","compressible":true},"application/riscos":{"source":"iana"},"application/rlmi+xml":{"source":"iana","compressible":true},"application/rls-services+xml":{"source":"iana","compressible":true,"extensions":["rs"]},"application/route-apd+xml":{"source":"iana","compressible":true,"extensions":["rapd"]},"application/route-s-tsid+xml":{"source":"iana","compressible":true,"extensions":["sls"]},"application/route-usd+xml":{"source":"iana","compressible":true,"extensions":["rusd"]},"application/rpki-ghostbusters":{"source":"iana","extensions":["gbr"]},"application/rpki-manifest":{"source":"iana","extensions":["mft"]},"application/rpki-publication":{"source":"iana"},"application/rpki-roa":{"source":"iana","extensions":["roa"]},"application/rpki-updown":{"source":"iana"},"application/rsd+xml":{"source":"apache","compressible":true,"extensions":["rsd"]},"application/rss+xml":{"source":"apache","compressible":true,"extensions":["rss"]},"application/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"application/rtploopback":{"source":"iana"},"application/rtx":{"source":"iana"},"application/samlassertion+xml":{"source":"iana","compressible":true},"application/samlmetadata+xml":{"source":"iana","compressible":true},"application/sarif+json":{"source":"iana","compressible":true},"application/sarif-external-properties+json":{"source":"iana","compressible":true},"application/sbe":{"source":"iana"},"application/sbml+xml":{"source":"iana","compressible":true,"extensions":["sbml"]},"application/scaip+xml":{"source":"iana","compressible":true},"application/scim+json":{"source":"iana","compressible":true},"application/scvp-cv-request":{"source":"iana","extensions":["scq"]},"application/scvp-cv-response":{"source":"iana","extensions":["scs"]},"application/scvp-vp-request":{"source":"iana","extensions":["spq"]},"application/scvp-vp-response":{"source":"iana","extensions":["spp"]},"application/sdp":{"source":"iana","extensions":["sdp"]},"application/secevent+jwt":{"source":"iana"},"application/senml+cbor":{"source":"iana"},"application/senml+json":{"source":"iana","compressible":true},"application/senml+xml":{"source":"iana","compressible":true,"extensions":["senmlx"]},"application/senml-etch+cbor":{"source":"iana"},"application/senml-etch+json":{"source":"iana","compressible":true},"application/senml-exi":{"source":"iana"},"application/sensml+cbor":{"source":"iana"},"application/sensml+json":{"source":"iana","compressible":true},"application/sensml+xml":{"source":"iana","compressible":true,"extensions":["sensmlx"]},"application/sensml-exi":{"source":"iana"},"application/sep+xml":{"source":"iana","compressible":true},"application/sep-exi":{"source":"iana"},"application/session-info":{"source":"iana"},"application/set-payment":{"source":"iana"},"application/set-payment-initiation":{"source":"iana","extensions":["setpay"]},"application/set-registration":{"source":"iana"},"application/set-registration-initiation":{"source":"iana","extensions":["setreg"]},"application/sgml":{"source":"iana"},"application/sgml-open-catalog":{"source":"iana"},"application/shf+xml":{"source":"iana","compressible":true,"extensions":["shf"]},"application/sieve":{"source":"iana","extensions":["siv","sieve"]},"application/simple-filter+xml":{"source":"iana","compressible":true},"application/simple-message-summary":{"source":"iana"},"application/simplesymbolcontainer":{"source":"iana"},"application/sipc":{"source":"iana"},"application/slate":{"source":"iana"},"application/smil":{"source":"iana"},"application/smil+xml":{"source":"iana","compressible":true,"extensions":["smi","smil"]},"application/smpte336m":{"source":"iana"},"application/soap+fastinfoset":{"source":"iana"},"application/soap+xml":{"source":"iana","compressible":true},"application/sparql-query":{"source":"iana","extensions":["rq"]},"application/sparql-results+xml":{"source":"iana","compressible":true,"extensions":["srx"]},"application/spdx+json":{"source":"iana","compressible":true},"application/spirits-event+xml":{"source":"iana","compressible":true},"application/sql":{"source":"iana"},"application/srgs":{"source":"iana","extensions":["gram"]},"application/srgs+xml":{"source":"iana","compressible":true,"extensions":["grxml"]},"application/sru+xml":{"source":"iana","compressible":true,"extensions":["sru"]},"application/ssdl+xml":{"source":"apache","compressible":true,"extensions":["ssdl"]},"application/ssml+xml":{"source":"iana","compressible":true,"extensions":["ssml"]},"application/stix+json":{"source":"iana","compressible":true},"application/swid+xml":{"source":"iana","compressible":true,"extensions":["swidtag"]},"application/tamp-apex-update":{"source":"iana"},"application/tamp-apex-update-confirm":{"source":"iana"},"application/tamp-community-update":{"source":"iana"},"application/tamp-community-update-confirm":{"source":"iana"},"application/tamp-error":{"source":"iana"},"application/tamp-sequence-adjust":{"source":"iana"},"application/tamp-sequence-adjust-confirm":{"source":"iana"},"application/tamp-status-query":{"source":"iana"},"application/tamp-status-response":{"source":"iana"},"application/tamp-update":{"source":"iana"},"application/tamp-update-confirm":{"source":"iana"},"application/tar":{"compressible":true},"application/taxii+json":{"source":"iana","compressible":true},"application/td+json":{"source":"iana","compressible":true},"application/tei+xml":{"source":"iana","compressible":true,"extensions":["tei","teicorpus"]},"application/tetra_isi":{"source":"iana"},"application/thraud+xml":{"source":"iana","compressible":true,"extensions":["tfi"]},"application/timestamp-query":{"source":"iana"},"application/timestamp-reply":{"source":"iana"},"application/timestamped-data":{"source":"iana","extensions":["tsd"]},"application/tlsrpt+gzip":{"source":"iana"},"application/tlsrpt+json":{"source":"iana","compressible":true},"application/tnauthlist":{"source":"iana"},"application/token-introspection+jwt":{"source":"iana"},"application/toml":{"compressible":true,"extensions":["toml"]},"application/trickle-ice-sdpfrag":{"source":"iana"},"application/trig":{"source":"iana","extensions":["trig"]},"application/ttml+xml":{"source":"iana","compressible":true,"extensions":["ttml"]},"application/tve-trigger":{"source":"iana"},"application/tzif":{"source":"iana"},"application/tzif-leap":{"source":"iana"},"application/ubjson":{"compressible":false,"extensions":["ubj"]},"application/ulpfec":{"source":"iana"},"application/urc-grpsheet+xml":{"source":"iana","compressible":true},"application/urc-ressheet+xml":{"source":"iana","compressible":true,"extensions":["rsheet"]},"application/urc-targetdesc+xml":{"source":"iana","compressible":true,"extensions":["td"]},"application/urc-uisocketdesc+xml":{"source":"iana","compressible":true},"application/vcard+json":{"source":"iana","compressible":true},"application/vcard+xml":{"source":"iana","compressible":true},"application/vemmi":{"source":"iana"},"application/vividence.scriptfile":{"source":"apache"},"application/vnd.1000minds.decision-model+xml":{"source":"iana","compressible":true,"extensions":["1km"]},"application/vnd.3gpp-prose+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-prose-pc3ch+xml":{"source":"iana","compressible":true},"application/vnd.3gpp-v2x-local-service-information":{"source":"iana"},"application/vnd.3gpp.5gnas":{"source":"iana"},"application/vnd.3gpp.access-transfer-events+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.bsf+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gmop+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.gtpc":{"source":"iana"},"application/vnd.3gpp.interworking-data":{"source":"iana"},"application/vnd.3gpp.lpp":{"source":"iana"},"application/vnd.3gpp.mc-signalling-ear":{"source":"iana"},"application/vnd.3gpp.mcdata-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-payload":{"source":"iana"},"application/vnd.3gpp.mcdata-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-signalling":{"source":"iana"},"application/vnd.3gpp.mcdata-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcdata-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-floor-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-signed+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-ue-init-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcptt-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-command+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-affiliation-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-location-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-mbms-usage-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-service-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-transmission-request+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-ue-config+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mcvideo-user-profile+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.mid-call+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ngap":{"source":"iana"},"application/vnd.3gpp.pfcp":{"source":"iana"},"application/vnd.3gpp.pic-bw-large":{"source":"iana","extensions":["plb"]},"application/vnd.3gpp.pic-bw-small":{"source":"iana","extensions":["psb"]},"application/vnd.3gpp.pic-bw-var":{"source":"iana","extensions":["pvb"]},"application/vnd.3gpp.s1ap":{"source":"iana"},"application/vnd.3gpp.sms":{"source":"iana"},"application/vnd.3gpp.sms+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-ext+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.srvcc-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.state-and-event-info+xml":{"source":"iana","compressible":true},"application/vnd.3gpp.ussd+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.bcmcsinfo+xml":{"source":"iana","compressible":true},"application/vnd.3gpp2.sms":{"source":"iana"},"application/vnd.3gpp2.tcap":{"source":"iana","extensions":["tcap"]},"application/vnd.3lightssoftware.imagescal":{"source":"iana"},"application/vnd.3m.post-it-notes":{"source":"iana","extensions":["pwn"]},"application/vnd.accpac.simply.aso":{"source":"iana","extensions":["aso"]},"application/vnd.accpac.simply.imp":{"source":"iana","extensions":["imp"]},"application/vnd.acucobol":{"source":"iana","extensions":["acu"]},"application/vnd.acucorp":{"source":"iana","extensions":["atc","acutc"]},"application/vnd.adobe.air-application-installer-package+zip":{"source":"apache","compressible":false,"extensions":["air"]},"application/vnd.adobe.flash.movie":{"source":"iana"},"application/vnd.adobe.formscentral.fcdt":{"source":"iana","extensions":["fcdt"]},"application/vnd.adobe.fxp":{"source":"iana","extensions":["fxp","fxpl"]},"application/vnd.adobe.partial-upload":{"source":"iana"},"application/vnd.adobe.xdp+xml":{"source":"iana","compressible":true,"extensions":["xdp"]},"application/vnd.adobe.xfdf":{"source":"iana","extensions":["xfdf"]},"application/vnd.aether.imp":{"source":"iana"},"application/vnd.afpc.afplinedata":{"source":"iana"},"application/vnd.afpc.afplinedata-pagedef":{"source":"iana"},"application/vnd.afpc.cmoca-cmresource":{"source":"iana"},"application/vnd.afpc.foca-charset":{"source":"iana"},"application/vnd.afpc.foca-codedfont":{"source":"iana"},"application/vnd.afpc.foca-codepage":{"source":"iana"},"application/vnd.afpc.modca":{"source":"iana"},"application/vnd.afpc.modca-cmtable":{"source":"iana"},"application/vnd.afpc.modca-formdef":{"source":"iana"},"application/vnd.afpc.modca-mediummap":{"source":"iana"},"application/vnd.afpc.modca-objectcontainer":{"source":"iana"},"application/vnd.afpc.modca-overlay":{"source":"iana"},"application/vnd.afpc.modca-pagesegment":{"source":"iana"},"application/vnd.age":{"source":"iana","extensions":["age"]},"application/vnd.ah-barcode":{"source":"iana"},"application/vnd.ahead.space":{"source":"iana","extensions":["ahead"]},"application/vnd.airzip.filesecure.azf":{"source":"iana","extensions":["azf"]},"application/vnd.airzip.filesecure.azs":{"source":"iana","extensions":["azs"]},"application/vnd.amadeus+json":{"source":"iana","compressible":true},"application/vnd.amazon.ebook":{"source":"apache","extensions":["azw"]},"application/vnd.amazon.mobi8-ebook":{"source":"iana"},"application/vnd.americandynamics.acc":{"source":"iana","extensions":["acc"]},"application/vnd.amiga.ami":{"source":"iana","extensions":["ami"]},"application/vnd.amundsen.maze+xml":{"source":"iana","compressible":true},"application/vnd.android.ota":{"source":"iana"},"application/vnd.android.package-archive":{"source":"apache","compressible":false,"extensions":["apk"]},"application/vnd.anki":{"source":"iana"},"application/vnd.anser-web-certificate-issue-initiation":{"source":"iana","extensions":["cii"]},"application/vnd.anser-web-funds-transfer-initiation":{"source":"apache","extensions":["fti"]},"application/vnd.antix.game-component":{"source":"iana","extensions":["atx"]},"application/vnd.apache.arrow.file":{"source":"iana"},"application/vnd.apache.arrow.stream":{"source":"iana"},"application/vnd.apache.thrift.binary":{"source":"iana"},"application/vnd.apache.thrift.compact":{"source":"iana"},"application/vnd.apache.thrift.json":{"source":"iana"},"application/vnd.api+json":{"source":"iana","compressible":true},"application/vnd.aplextor.warrp+json":{"source":"iana","compressible":true},"application/vnd.apothekende.reservation+json":{"source":"iana","compressible":true},"application/vnd.apple.installer+xml":{"source":"iana","compressible":true,"extensions":["mpkg"]},"application/vnd.apple.keynote":{"source":"iana","extensions":["key"]},"application/vnd.apple.mpegurl":{"source":"iana","extensions":["m3u8"]},"application/vnd.apple.numbers":{"source":"iana","extensions":["numbers"]},"application/vnd.apple.pages":{"source":"iana","extensions":["pages"]},"application/vnd.apple.pkpass":{"compressible":false,"extensions":["pkpass"]},"application/vnd.arastra.swi":{"source":"iana"},"application/vnd.aristanetworks.swi":{"source":"iana","extensions":["swi"]},"application/vnd.artisan+json":{"source":"iana","compressible":true},"application/vnd.artsquare":{"source":"iana"},"application/vnd.astraea-software.iota":{"source":"iana","extensions":["iota"]},"application/vnd.audiograph":{"source":"iana","extensions":["aep"]},"application/vnd.autopackage":{"source":"iana"},"application/vnd.avalon+json":{"source":"iana","compressible":true},"application/vnd.avistar+xml":{"source":"iana","compressible":true},"application/vnd.balsamiq.bmml+xml":{"source":"iana","compressible":true,"extensions":["bmml"]},"application/vnd.balsamiq.bmpr":{"source":"iana"},"application/vnd.banana-accounting":{"source":"iana"},"application/vnd.bbf.usp.error":{"source":"iana"},"application/vnd.bbf.usp.msg":{"source":"iana"},"application/vnd.bbf.usp.msg+json":{"source":"iana","compressible":true},"application/vnd.bekitzur-stech+json":{"source":"iana","compressible":true},"application/vnd.bint.med-content":{"source":"iana"},"application/vnd.biopax.rdf+xml":{"source":"iana","compressible":true},"application/vnd.blink-idb-value-wrapper":{"source":"iana"},"application/vnd.blueice.multipass":{"source":"iana","extensions":["mpm"]},"application/vnd.bluetooth.ep.oob":{"source":"iana"},"application/vnd.bluetooth.le.oob":{"source":"iana"},"application/vnd.bmi":{"source":"iana","extensions":["bmi"]},"application/vnd.bpf":{"source":"iana"},"application/vnd.bpf3":{"source":"iana"},"application/vnd.businessobjects":{"source":"iana","extensions":["rep"]},"application/vnd.byu.uapi+json":{"source":"iana","compressible":true},"application/vnd.cab-jscript":{"source":"iana"},"application/vnd.canon-cpdl":{"source":"iana"},"application/vnd.canon-lips":{"source":"iana"},"application/vnd.capasystems-pg+json":{"source":"iana","compressible":true},"application/vnd.cendio.thinlinc.clientconf":{"source":"iana"},"application/vnd.century-systems.tcp_stream":{"source":"iana"},"application/vnd.chemdraw+xml":{"source":"iana","compressible":true,"extensions":["cdxml"]},"application/vnd.chess-pgn":{"source":"iana"},"application/vnd.chipnuts.karaoke-mmd":{"source":"iana","extensions":["mmd"]},"application/vnd.ciedi":{"source":"iana"},"application/vnd.cinderella":{"source":"iana","extensions":["cdy"]},"application/vnd.cirpack.isdn-ext":{"source":"iana"},"application/vnd.citationstyles.style+xml":{"source":"iana","compressible":true,"extensions":["csl"]},"application/vnd.claymore":{"source":"iana","extensions":["cla"]},"application/vnd.cloanto.rp9":{"source":"iana","extensions":["rp9"]},"application/vnd.clonk.c4group":{"source":"iana","extensions":["c4g","c4d","c4f","c4p","c4u"]},"application/vnd.cluetrust.cartomobile-config":{"source":"iana","extensions":["c11amc"]},"application/vnd.cluetrust.cartomobile-config-pkg":{"source":"iana","extensions":["c11amz"]},"application/vnd.coffeescript":{"source":"iana"},"application/vnd.collabio.xodocuments.document":{"source":"iana"},"application/vnd.collabio.xodocuments.document-template":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation":{"source":"iana"},"application/vnd.collabio.xodocuments.presentation-template":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet":{"source":"iana"},"application/vnd.collabio.xodocuments.spreadsheet-template":{"source":"iana"},"application/vnd.collection+json":{"source":"iana","compressible":true},"application/vnd.collection.doc+json":{"source":"iana","compressible":true},"application/vnd.collection.next+json":{"source":"iana","compressible":true},"application/vnd.comicbook+zip":{"source":"iana","compressible":false},"application/vnd.comicbook-rar":{"source":"iana"},"application/vnd.commerce-battelle":{"source":"iana"},"application/vnd.commonspace":{"source":"iana","extensions":["csp"]},"application/vnd.contact.cmsg":{"source":"iana","extensions":["cdbcmsg"]},"application/vnd.coreos.ignition+json":{"source":"iana","compressible":true},"application/vnd.cosmocaller":{"source":"iana","extensions":["cmc"]},"application/vnd.crick.clicker":{"source":"iana","extensions":["clkx"]},"application/vnd.crick.clicker.keyboard":{"source":"iana","extensions":["clkk"]},"application/vnd.crick.clicker.palette":{"source":"iana","extensions":["clkp"]},"application/vnd.crick.clicker.template":{"source":"iana","extensions":["clkt"]},"application/vnd.crick.clicker.wordbank":{"source":"iana","extensions":["clkw"]},"application/vnd.criticaltools.wbs+xml":{"source":"iana","compressible":true,"extensions":["wbs"]},"application/vnd.cryptii.pipe+json":{"source":"iana","compressible":true},"application/vnd.crypto-shade-file":{"source":"iana"},"application/vnd.cryptomator.encrypted":{"source":"iana"},"application/vnd.cryptomator.vault":{"source":"iana"},"application/vnd.ctc-posml":{"source":"iana","extensions":["pml"]},"application/vnd.ctct.ws+xml":{"source":"iana","compressible":true},"application/vnd.cups-pdf":{"source":"iana"},"application/vnd.cups-postscript":{"source":"iana"},"application/vnd.cups-ppd":{"source":"iana","extensions":["ppd"]},"application/vnd.cups-raster":{"source":"iana"},"application/vnd.cups-raw":{"source":"iana"},"application/vnd.curl":{"source":"iana"},"application/vnd.curl.car":{"source":"apache","extensions":["car"]},"application/vnd.curl.pcurl":{"source":"apache","extensions":["pcurl"]},"application/vnd.cyan.dean.root+xml":{"source":"iana","compressible":true},"application/vnd.cybank":{"source":"iana"},"application/vnd.cyclonedx+json":{"source":"iana","compressible":true},"application/vnd.cyclonedx+xml":{"source":"iana","compressible":true},"application/vnd.d2l.coursepackage1p0+zip":{"source":"iana","compressible":false},"application/vnd.d3m-dataset":{"source":"iana"},"application/vnd.d3m-problem":{"source":"iana"},"application/vnd.dart":{"source":"iana","compressible":true,"extensions":["dart"]},"application/vnd.data-vision.rdz":{"source":"iana","extensions":["rdz"]},"application/vnd.datapackage+json":{"source":"iana","compressible":true},"application/vnd.dataresource+json":{"source":"iana","compressible":true},"application/vnd.dbf":{"source":"iana","extensions":["dbf"]},"application/vnd.debian.binary-package":{"source":"iana"},"application/vnd.dece.data":{"source":"iana","extensions":["uvf","uvvf","uvd","uvvd"]},"application/vnd.dece.ttml+xml":{"source":"iana","compressible":true,"extensions":["uvt","uvvt"]},"application/vnd.dece.unspecified":{"source":"iana","extensions":["uvx","uvvx"]},"application/vnd.dece.zip":{"source":"iana","extensions":["uvz","uvvz"]},"application/vnd.denovo.fcselayout-link":{"source":"iana","extensions":["fe_launch"]},"application/vnd.desmume.movie":{"source":"iana"},"application/vnd.dir-bi.plate-dl-nosuffix":{"source":"iana"},"application/vnd.dm.delegation+xml":{"source":"iana","compressible":true},"application/vnd.dna":{"source":"iana","extensions":["dna"]},"application/vnd.document+json":{"source":"iana","compressible":true},"application/vnd.dolby.mlp":{"source":"apache","extensions":["mlp"]},"application/vnd.dolby.mobile.1":{"source":"iana"},"application/vnd.dolby.mobile.2":{"source":"iana"},"application/vnd.doremir.scorecloud-binary-document":{"source":"iana"},"application/vnd.dpgraph":{"source":"iana","extensions":["dpg"]},"application/vnd.dreamfactory":{"source":"iana","extensions":["dfac"]},"application/vnd.drive+json":{"source":"iana","compressible":true},"application/vnd.ds-keypoint":{"source":"apache","extensions":["kpxx"]},"application/vnd.dtg.local":{"source":"iana"},"application/vnd.dtg.local.flash":{"source":"iana"},"application/vnd.dtg.local.html":{"source":"iana"},"application/vnd.dvb.ait":{"source":"iana","extensions":["ait"]},"application/vnd.dvb.dvbisl+xml":{"source":"iana","compressible":true},"application/vnd.dvb.dvbj":{"source":"iana"},"application/vnd.dvb.esgcontainer":{"source":"iana"},"application/vnd.dvb.ipdcdftnotifaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess":{"source":"iana"},"application/vnd.dvb.ipdcesgaccess2":{"source":"iana"},"application/vnd.dvb.ipdcesgpdd":{"source":"iana"},"application/vnd.dvb.ipdcroaming":{"source":"iana"},"application/vnd.dvb.iptv.alfec-base":{"source":"iana"},"application/vnd.dvb.iptv.alfec-enhancement":{"source":"iana"},"application/vnd.dvb.notif-aggregate-root+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-container+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-generic+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-msglist+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-request+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-ia-registration-response+xml":{"source":"iana","compressible":true},"application/vnd.dvb.notif-init+xml":{"source":"iana","compressible":true},"application/vnd.dvb.pfr":{"source":"iana"},"application/vnd.dvb.service":{"source":"iana","extensions":["svc"]},"application/vnd.dxr":{"source":"iana"},"application/vnd.dynageo":{"source":"iana","extensions":["geo"]},"application/vnd.dzr":{"source":"iana"},"application/vnd.easykaraoke.cdgdownload":{"source":"iana"},"application/vnd.ecdis-update":{"source":"iana"},"application/vnd.ecip.rlp":{"source":"iana"},"application/vnd.eclipse.ditto+json":{"source":"iana","compressible":true},"application/vnd.ecowin.chart":{"source":"iana","extensions":["mag"]},"application/vnd.ecowin.filerequest":{"source":"iana"},"application/vnd.ecowin.fileupdate":{"source":"iana"},"application/vnd.ecowin.series":{"source":"iana"},"application/vnd.ecowin.seriesrequest":{"source":"iana"},"application/vnd.ecowin.seriesupdate":{"source":"iana"},"application/vnd.efi.img":{"source":"iana"},"application/vnd.efi.iso":{"source":"iana"},"application/vnd.emclient.accessrequest+xml":{"source":"iana","compressible":true},"application/vnd.enliven":{"source":"iana","extensions":["nml"]},"application/vnd.enphase.envoy":{"source":"iana"},"application/vnd.eprints.data+xml":{"source":"iana","compressible":true},"application/vnd.epson.esf":{"source":"iana","extensions":["esf"]},"application/vnd.epson.msf":{"source":"iana","extensions":["msf"]},"application/vnd.epson.quickanime":{"source":"iana","extensions":["qam"]},"application/vnd.epson.salt":{"source":"iana","extensions":["slt"]},"application/vnd.epson.ssf":{"source":"iana","extensions":["ssf"]},"application/vnd.ericsson.quickcall":{"source":"iana"},"application/vnd.espass-espass+zip":{"source":"iana","compressible":false},"application/vnd.eszigno3+xml":{"source":"iana","compressible":true,"extensions":["es3","et3"]},"application/vnd.etsi.aoc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.asic-e+zip":{"source":"iana","compressible":false},"application/vnd.etsi.asic-s+zip":{"source":"iana","compressible":false},"application/vnd.etsi.cug+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvcommand+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-bc+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-cod+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsad-npvr+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvservice+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvsync+xml":{"source":"iana","compressible":true},"application/vnd.etsi.iptvueprofile+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mcid+xml":{"source":"iana","compressible":true},"application/vnd.etsi.mheg5":{"source":"iana"},"application/vnd.etsi.overload-control-policy-dataset+xml":{"source":"iana","compressible":true},"application/vnd.etsi.pstn+xml":{"source":"iana","compressible":true},"application/vnd.etsi.sci+xml":{"source":"iana","compressible":true},"application/vnd.etsi.simservs+xml":{"source":"iana","compressible":true},"application/vnd.etsi.timestamp-token":{"source":"iana"},"application/vnd.etsi.tsl+xml":{"source":"iana","compressible":true},"application/vnd.etsi.tsl.der":{"source":"iana"},"application/vnd.eu.kasparian.car+json":{"source":"iana","compressible":true},"application/vnd.eudora.data":{"source":"iana"},"application/vnd.evolv.ecig.profile":{"source":"iana"},"application/vnd.evolv.ecig.settings":{"source":"iana"},"application/vnd.evolv.ecig.theme":{"source":"iana"},"application/vnd.exstream-empower+zip":{"source":"iana","compressible":false},"application/vnd.exstream-package":{"source":"iana"},"application/vnd.ezpix-album":{"source":"iana","extensions":["ez2"]},"application/vnd.ezpix-package":{"source":"iana","extensions":["ez3"]},"application/vnd.f-secure.mobile":{"source":"iana"},"application/vnd.familysearch.gedcom+zip":{"source":"iana","compressible":false},"application/vnd.fastcopy-disk-image":{"source":"iana"},"application/vnd.fdf":{"source":"iana","extensions":["fdf"]},"application/vnd.fdsn.mseed":{"source":"iana","extensions":["mseed"]},"application/vnd.fdsn.seed":{"source":"iana","extensions":["seed","dataless"]},"application/vnd.ffsns":{"source":"iana"},"application/vnd.ficlab.flb+zip":{"source":"iana","compressible":false},"application/vnd.filmit.zfc":{"source":"iana"},"application/vnd.fints":{"source":"iana"},"application/vnd.firemonkeys.cloudcell":{"source":"iana"},"application/vnd.flographit":{"source":"iana","extensions":["gph"]},"application/vnd.fluxtime.clip":{"source":"iana","extensions":["ftc"]},"application/vnd.font-fontforge-sfd":{"source":"iana"},"application/vnd.framemaker":{"source":"iana","extensions":["fm","frame","maker","book"]},"application/vnd.frogans.fnc":{"source":"iana","extensions":["fnc"]},"application/vnd.frogans.ltf":{"source":"iana","extensions":["ltf"]},"application/vnd.fsc.weblaunch":{"source":"iana","extensions":["fsc"]},"application/vnd.fujifilm.fb.docuworks":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.binder":{"source":"iana"},"application/vnd.fujifilm.fb.docuworks.container":{"source":"iana"},"application/vnd.fujifilm.fb.jfi+xml":{"source":"iana","compressible":true},"application/vnd.fujitsu.oasys":{"source":"iana","extensions":["oas"]},"application/vnd.fujitsu.oasys2":{"source":"iana","extensions":["oa2"]},"application/vnd.fujitsu.oasys3":{"source":"iana","extensions":["oa3"]},"application/vnd.fujitsu.oasysgp":{"source":"iana","extensions":["fg5"]},"application/vnd.fujitsu.oasysprs":{"source":"iana","extensions":["bh2"]},"application/vnd.fujixerox.art-ex":{"source":"iana"},"application/vnd.fujixerox.art4":{"source":"iana"},"application/vnd.fujixerox.ddd":{"source":"iana","extensions":["ddd"]},"application/vnd.fujixerox.docuworks":{"source":"iana","extensions":["xdw"]},"application/vnd.fujixerox.docuworks.binder":{"source":"iana","extensions":["xbd"]},"application/vnd.fujixerox.docuworks.container":{"source":"iana"},"application/vnd.fujixerox.hbpl":{"source":"iana"},"application/vnd.fut-misnet":{"source":"iana"},"application/vnd.futoin+cbor":{"source":"iana"},"application/vnd.futoin+json":{"source":"iana","compressible":true},"application/vnd.fuzzysheet":{"source":"iana","extensions":["fzs"]},"application/vnd.genomatix.tuxedo":{"source":"iana","extensions":["txd"]},"application/vnd.gentics.grd+json":{"source":"iana","compressible":true},"application/vnd.geo+json":{"source":"iana","compressible":true},"application/vnd.geocube+xml":{"source":"iana","compressible":true},"application/vnd.geogebra.file":{"source":"iana","extensions":["ggb"]},"application/vnd.geogebra.slides":{"source":"iana"},"application/vnd.geogebra.tool":{"source":"iana","extensions":["ggt"]},"application/vnd.geometry-explorer":{"source":"iana","extensions":["gex","gre"]},"application/vnd.geonext":{"source":"iana","extensions":["gxt"]},"application/vnd.geoplan":{"source":"iana","extensions":["g2w"]},"application/vnd.geospace":{"source":"iana","extensions":["g3w"]},"application/vnd.gerber":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt":{"source":"iana"},"application/vnd.globalplatform.card-content-mgt-response":{"source":"iana"},"application/vnd.gmx":{"source":"iana","extensions":["gmx"]},"application/vnd.google-apps.document":{"compressible":false,"extensions":["gdoc"]},"application/vnd.google-apps.presentation":{"compressible":false,"extensions":["gslides"]},"application/vnd.google-apps.spreadsheet":{"compressible":false,"extensions":["gsheet"]},"application/vnd.google-earth.kml+xml":{"source":"iana","compressible":true,"extensions":["kml"]},"application/vnd.google-earth.kmz":{"source":"iana","compressible":false,"extensions":["kmz"]},"application/vnd.gov.sk.e-form+xml":{"source":"iana","compressible":true},"application/vnd.gov.sk.e-form+zip":{"source":"iana","compressible":false},"application/vnd.gov.sk.xmldatacontainer+xml":{"source":"iana","compressible":true},"application/vnd.grafeq":{"source":"iana","extensions":["gqf","gqs"]},"application/vnd.gridmp":{"source":"iana"},"application/vnd.groove-account":{"source":"iana","extensions":["gac"]},"application/vnd.groove-help":{"source":"iana","extensions":["ghf"]},"application/vnd.groove-identity-message":{"source":"iana","extensions":["gim"]},"application/vnd.groove-injector":{"source":"iana","extensions":["grv"]},"application/vnd.groove-tool-message":{"source":"iana","extensions":["gtm"]},"application/vnd.groove-tool-template":{"source":"iana","extensions":["tpl"]},"application/vnd.groove-vcard":{"source":"iana","extensions":["vcg"]},"application/vnd.hal+json":{"source":"iana","compressible":true},"application/vnd.hal+xml":{"source":"iana","compressible":true,"extensions":["hal"]},"application/vnd.handheld-entertainment+xml":{"source":"iana","compressible":true,"extensions":["zmm"]},"application/vnd.hbci":{"source":"iana","extensions":["hbci"]},"application/vnd.hc+json":{"source":"iana","compressible":true},"application/vnd.hcl-bireports":{"source":"iana"},"application/vnd.hdt":{"source":"iana"},"application/vnd.heroku+json":{"source":"iana","compressible":true},"application/vnd.hhe.lesson-player":{"source":"iana","extensions":["les"]},"application/vnd.hl7cda+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hl7v2+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.hp-hpgl":{"source":"iana","extensions":["hpgl"]},"application/vnd.hp-hpid":{"source":"iana","extensions":["hpid"]},"application/vnd.hp-hps":{"source":"iana","extensions":["hps"]},"application/vnd.hp-jlyt":{"source":"iana","extensions":["jlt"]},"application/vnd.hp-pcl":{"source":"iana","extensions":["pcl"]},"application/vnd.hp-pclxl":{"source":"iana","extensions":["pclxl"]},"application/vnd.httphone":{"source":"iana"},"application/vnd.hydrostatix.sof-data":{"source":"iana","extensions":["sfd-hdstx"]},"application/vnd.hyper+json":{"source":"iana","compressible":true},"application/vnd.hyper-item+json":{"source":"iana","compressible":true},"application/vnd.hyperdrive+json":{"source":"iana","compressible":true},"application/vnd.hzn-3d-crossword":{"source":"iana"},"application/vnd.ibm.afplinedata":{"source":"iana"},"application/vnd.ibm.electronic-media":{"source":"iana"},"application/vnd.ibm.minipay":{"source":"iana","extensions":["mpy"]},"application/vnd.ibm.modcap":{"source":"iana","extensions":["afp","listafp","list3820"]},"application/vnd.ibm.rights-management":{"source":"iana","extensions":["irm"]},"application/vnd.ibm.secure-container":{"source":"iana","extensions":["sc"]},"application/vnd.iccprofile":{"source":"iana","extensions":["icc","icm"]},"application/vnd.ieee.1905":{"source":"iana"},"application/vnd.igloader":{"source":"iana","extensions":["igl"]},"application/vnd.imagemeter.folder+zip":{"source":"iana","compressible":false},"application/vnd.imagemeter.image+zip":{"source":"iana","compressible":false},"application/vnd.immervision-ivp":{"source":"iana","extensions":["ivp"]},"application/vnd.immervision-ivu":{"source":"iana","extensions":["ivu"]},"application/vnd.ims.imsccv1p1":{"source":"iana"},"application/vnd.ims.imsccv1p2":{"source":"iana"},"application/vnd.ims.imsccv1p3":{"source":"iana"},"application/vnd.ims.lis.v2.result+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolconsumerprofile+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolproxy.id+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings+json":{"source":"iana","compressible":true},"application/vnd.ims.lti.v2.toolsettings.simple+json":{"source":"iana","compressible":true},"application/vnd.informedcontrol.rms+xml":{"source":"iana","compressible":true},"application/vnd.informix-visionary":{"source":"iana"},"application/vnd.infotech.project":{"source":"iana"},"application/vnd.infotech.project+xml":{"source":"iana","compressible":true},"application/vnd.innopath.wamp.notification":{"source":"iana"},"application/vnd.insors.igm":{"source":"iana","extensions":["igm"]},"application/vnd.intercon.formnet":{"source":"iana","extensions":["xpw","xpx"]},"application/vnd.intergeo":{"source":"iana","extensions":["i2g"]},"application/vnd.intertrust.digibox":{"source":"iana"},"application/vnd.intertrust.nncp":{"source":"iana"},"application/vnd.intu.qbo":{"source":"iana","extensions":["qbo"]},"application/vnd.intu.qfx":{"source":"iana","extensions":["qfx"]},"application/vnd.iptc.g2.catalogitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.conceptitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.knowledgeitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.newsmessage+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.packageitem+xml":{"source":"iana","compressible":true},"application/vnd.iptc.g2.planningitem+xml":{"source":"iana","compressible":true},"application/vnd.ipunplugged.rcprofile":{"source":"iana","extensions":["rcprofile"]},"application/vnd.irepository.package+xml":{"source":"iana","compressible":true,"extensions":["irp"]},"application/vnd.is-xpr":{"source":"iana","extensions":["xpr"]},"application/vnd.isac.fcs":{"source":"iana","extensions":["fcs"]},"application/vnd.iso11783-10+zip":{"source":"iana","compressible":false},"application/vnd.jam":{"source":"iana","extensions":["jam"]},"application/vnd.japannet-directory-service":{"source":"iana"},"application/vnd.japannet-jpnstore-wakeup":{"source":"iana"},"application/vnd.japannet-payment-wakeup":{"source":"iana"},"application/vnd.japannet-registration":{"source":"iana"},"application/vnd.japannet-registration-wakeup":{"source":"iana"},"application/vnd.japannet-setstore-wakeup":{"source":"iana"},"application/vnd.japannet-verification":{"source":"iana"},"application/vnd.japannet-verification-wakeup":{"source":"iana"},"application/vnd.jcp.javame.midlet-rms":{"source":"iana","extensions":["rms"]},"application/vnd.jisp":{"source":"iana","extensions":["jisp"]},"application/vnd.joost.joda-archive":{"source":"iana","extensions":["joda"]},"application/vnd.jsk.isdn-ngn":{"source":"iana"},"application/vnd.kahootz":{"source":"iana","extensions":["ktz","ktr"]},"application/vnd.kde.karbon":{"source":"iana","extensions":["karbon"]},"application/vnd.kde.kchart":{"source":"iana","extensions":["chrt"]},"application/vnd.kde.kformula":{"source":"iana","extensions":["kfo"]},"application/vnd.kde.kivio":{"source":"iana","extensions":["flw"]},"application/vnd.kde.kontour":{"source":"iana","extensions":["kon"]},"application/vnd.kde.kpresenter":{"source":"iana","extensions":["kpr","kpt"]},"application/vnd.kde.kspread":{"source":"iana","extensions":["ksp"]},"application/vnd.kde.kword":{"source":"iana","extensions":["kwd","kwt"]},"application/vnd.kenameaapp":{"source":"iana","extensions":["htke"]},"application/vnd.kidspiration":{"source":"iana","extensions":["kia"]},"application/vnd.kinar":{"source":"iana","extensions":["kne","knp"]},"application/vnd.koan":{"source":"iana","extensions":["skp","skd","skt","skm"]},"application/vnd.kodak-descriptor":{"source":"iana","extensions":["sse"]},"application/vnd.las":{"source":"iana"},"application/vnd.las.las+json":{"source":"iana","compressible":true},"application/vnd.las.las+xml":{"source":"iana","compressible":true,"extensions":["lasxml"]},"application/vnd.laszip":{"source":"iana"},"application/vnd.leap+json":{"source":"iana","compressible":true},"application/vnd.liberty-request+xml":{"source":"iana","compressible":true},"application/vnd.llamagraphics.life-balance.desktop":{"source":"iana","extensions":["lbd"]},"application/vnd.llamagraphics.life-balance.exchange+xml":{"source":"iana","compressible":true,"extensions":["lbe"]},"application/vnd.logipipe.circuit+zip":{"source":"iana","compressible":false},"application/vnd.loom":{"source":"iana"},"application/vnd.lotus-1-2-3":{"source":"iana","extensions":["123"]},"application/vnd.lotus-approach":{"source":"iana","extensions":["apr"]},"application/vnd.lotus-freelance":{"source":"iana","extensions":["pre"]},"application/vnd.lotus-notes":{"source":"iana","extensions":["nsf"]},"application/vnd.lotus-organizer":{"source":"iana","extensions":["org"]},"application/vnd.lotus-screencam":{"source":"iana","extensions":["scm"]},"application/vnd.lotus-wordpro":{"source":"iana","extensions":["lwp"]},"application/vnd.macports.portpkg":{"source":"iana","extensions":["portpkg"]},"application/vnd.mapbox-vector-tile":{"source":"iana","extensions":["mvt"]},"application/vnd.marlin.drm.actiontoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.conftoken+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.license+xml":{"source":"iana","compressible":true},"application/vnd.marlin.drm.mdcf":{"source":"iana"},"application/vnd.mason+json":{"source":"iana","compressible":true},"application/vnd.maxar.archive.3tz+zip":{"source":"iana","compressible":false},"application/vnd.maxmind.maxmind-db":{"source":"iana"},"application/vnd.mcd":{"source":"iana","extensions":["mcd"]},"application/vnd.medcalcdata":{"source":"iana","extensions":["mc1"]},"application/vnd.mediastation.cdkey":{"source":"iana","extensions":["cdkey"]},"application/vnd.meridian-slingshot":{"source":"iana"},"application/vnd.mfer":{"source":"iana","extensions":["mwf"]},"application/vnd.mfmp":{"source":"iana","extensions":["mfm"]},"application/vnd.micro+json":{"source":"iana","compressible":true},"application/vnd.micrografx.flo":{"source":"iana","extensions":["flo"]},"application/vnd.micrografx.igx":{"source":"iana","extensions":["igx"]},"application/vnd.microsoft.portable-executable":{"source":"iana"},"application/vnd.microsoft.windows.thumbnail-cache":{"source":"iana"},"application/vnd.miele+json":{"source":"iana","compressible":true},"application/vnd.mif":{"source":"iana","extensions":["mif"]},"application/vnd.minisoft-hp3000-save":{"source":"iana"},"application/vnd.mitsubishi.misty-guard.trustweb":{"source":"iana"},"application/vnd.mobius.daf":{"source":"iana","extensions":["daf"]},"application/vnd.mobius.dis":{"source":"iana","extensions":["dis"]},"application/vnd.mobius.mbk":{"source":"iana","extensions":["mbk"]},"application/vnd.mobius.mqy":{"source":"iana","extensions":["mqy"]},"application/vnd.mobius.msl":{"source":"iana","extensions":["msl"]},"application/vnd.mobius.plc":{"source":"iana","extensions":["plc"]},"application/vnd.mobius.txf":{"source":"iana","extensions":["txf"]},"application/vnd.mophun.application":{"source":"iana","extensions":["mpn"]},"application/vnd.mophun.certificate":{"source":"iana","extensions":["mpc"]},"application/vnd.motorola.flexsuite":{"source":"iana"},"application/vnd.motorola.flexsuite.adsi":{"source":"iana"},"application/vnd.motorola.flexsuite.fis":{"source":"iana"},"application/vnd.motorola.flexsuite.gotap":{"source":"iana"},"application/vnd.motorola.flexsuite.kmr":{"source":"iana"},"application/vnd.motorola.flexsuite.ttc":{"source":"iana"},"application/vnd.motorola.flexsuite.wem":{"source":"iana"},"application/vnd.motorola.iprm":{"source":"iana"},"application/vnd.mozilla.xul+xml":{"source":"iana","compressible":true,"extensions":["xul"]},"application/vnd.ms-3mfdocument":{"source":"iana"},"application/vnd.ms-artgalry":{"source":"iana","extensions":["cil"]},"application/vnd.ms-asf":{"source":"iana"},"application/vnd.ms-cab-compressed":{"source":"iana","extensions":["cab"]},"application/vnd.ms-color.iccprofile":{"source":"apache"},"application/vnd.ms-excel":{"source":"iana","compressible":false,"extensions":["xls","xlm","xla","xlc","xlt","xlw"]},"application/vnd.ms-excel.addin.macroenabled.12":{"source":"iana","extensions":["xlam"]},"application/vnd.ms-excel.sheet.binary.macroenabled.12":{"source":"iana","extensions":["xlsb"]},"application/vnd.ms-excel.sheet.macroenabled.12":{"source":"iana","extensions":["xlsm"]},"application/vnd.ms-excel.template.macroenabled.12":{"source":"iana","extensions":["xltm"]},"application/vnd.ms-fontobject":{"source":"iana","compressible":true,"extensions":["eot"]},"application/vnd.ms-htmlhelp":{"source":"iana","extensions":["chm"]},"application/vnd.ms-ims":{"source":"iana","extensions":["ims"]},"application/vnd.ms-lrm":{"source":"iana","extensions":["lrm"]},"application/vnd.ms-office.activex+xml":{"source":"iana","compressible":true},"application/vnd.ms-officetheme":{"source":"iana","extensions":["thmx"]},"application/vnd.ms-opentype":{"source":"apache","compressible":true},"application/vnd.ms-outlook":{"compressible":false,"extensions":["msg"]},"application/vnd.ms-package.obfuscated-opentype":{"source":"apache"},"application/vnd.ms-pki.seccat":{"source":"apache","extensions":["cat"]},"application/vnd.ms-pki.stl":{"source":"apache","extensions":["stl"]},"application/vnd.ms-playready.initiator+xml":{"source":"iana","compressible":true},"application/vnd.ms-powerpoint":{"source":"iana","compressible":false,"extensions":["ppt","pps","pot"]},"application/vnd.ms-powerpoint.addin.macroenabled.12":{"source":"iana","extensions":["ppam"]},"application/vnd.ms-powerpoint.presentation.macroenabled.12":{"source":"iana","extensions":["pptm"]},"application/vnd.ms-powerpoint.slide.macroenabled.12":{"source":"iana","extensions":["sldm"]},"application/vnd.ms-powerpoint.slideshow.macroenabled.12":{"source":"iana","extensions":["ppsm"]},"application/vnd.ms-powerpoint.template.macroenabled.12":{"source":"iana","extensions":["potm"]},"application/vnd.ms-printdevicecapabilities+xml":{"source":"iana","compressible":true},"application/vnd.ms-printing.printticket+xml":{"source":"apache","compressible":true},"application/vnd.ms-printschematicket+xml":{"source":"iana","compressible":true},"application/vnd.ms-project":{"source":"iana","extensions":["mpp","mpt"]},"application/vnd.ms-tnef":{"source":"iana"},"application/vnd.ms-windows.devicepairing":{"source":"iana"},"application/vnd.ms-windows.nwprinting.oob":{"source":"iana"},"application/vnd.ms-windows.printerpairing":{"source":"iana"},"application/vnd.ms-windows.wsd.oob":{"source":"iana"},"application/vnd.ms-wmdrm.lic-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.lic-resp":{"source":"iana"},"application/vnd.ms-wmdrm.meter-chlg-req":{"source":"iana"},"application/vnd.ms-wmdrm.meter-resp":{"source":"iana"},"application/vnd.ms-word.document.macroenabled.12":{"source":"iana","extensions":["docm"]},"application/vnd.ms-word.template.macroenabled.12":{"source":"iana","extensions":["dotm"]},"application/vnd.ms-works":{"source":"iana","extensions":["wps","wks","wcm","wdb"]},"application/vnd.ms-wpl":{"source":"iana","extensions":["wpl"]},"application/vnd.ms-xpsdocument":{"source":"iana","compressible":false,"extensions":["xps"]},"application/vnd.msa-disk-image":{"source":"iana"},"application/vnd.mseq":{"source":"iana","extensions":["mseq"]},"application/vnd.msign":{"source":"iana"},"application/vnd.multiad.creator":{"source":"iana"},"application/vnd.multiad.creator.cif":{"source":"iana"},"application/vnd.music-niff":{"source":"iana"},"application/vnd.musician":{"source":"iana","extensions":["mus"]},"application/vnd.muvee.style":{"source":"iana","extensions":["msty"]},"application/vnd.mynfc":{"source":"iana","extensions":["taglet"]},"application/vnd.nacamar.ybrid+json":{"source":"iana","compressible":true},"application/vnd.ncd.control":{"source":"iana"},"application/vnd.ncd.reference":{"source":"iana"},"application/vnd.nearst.inv+json":{"source":"iana","compressible":true},"application/vnd.nebumind.line":{"source":"iana"},"application/vnd.nervana":{"source":"iana"},"application/vnd.netfpx":{"source":"iana"},"application/vnd.neurolanguage.nlu":{"source":"iana","extensions":["nlu"]},"application/vnd.nimn":{"source":"iana"},"application/vnd.nintendo.nitro.rom":{"source":"iana"},"application/vnd.nintendo.snes.rom":{"source":"iana"},"application/vnd.nitf":{"source":"iana","extensions":["ntf","nitf"]},"application/vnd.noblenet-directory":{"source":"iana","extensions":["nnd"]},"application/vnd.noblenet-sealer":{"source":"iana","extensions":["nns"]},"application/vnd.noblenet-web":{"source":"iana","extensions":["nnw"]},"application/vnd.nokia.catalogs":{"source":"iana"},"application/vnd.nokia.conml+wbxml":{"source":"iana"},"application/vnd.nokia.conml+xml":{"source":"iana","compressible":true},"application/vnd.nokia.iptv.config+xml":{"source":"iana","compressible":true},"application/vnd.nokia.isds-radio-presets":{"source":"iana"},"application/vnd.nokia.landmark+wbxml":{"source":"iana"},"application/vnd.nokia.landmark+xml":{"source":"iana","compressible":true},"application/vnd.nokia.landmarkcollection+xml":{"source":"iana","compressible":true},"application/vnd.nokia.n-gage.ac+xml":{"source":"iana","compressible":true,"extensions":["ac"]},"application/vnd.nokia.n-gage.data":{"source":"iana","extensions":["ngdat"]},"application/vnd.nokia.n-gage.symbian.install":{"source":"iana","extensions":["n-gage"]},"application/vnd.nokia.ncd":{"source":"iana"},"application/vnd.nokia.pcd+wbxml":{"source":"iana"},"application/vnd.nokia.pcd+xml":{"source":"iana","compressible":true},"application/vnd.nokia.radio-preset":{"source":"iana","extensions":["rpst"]},"application/vnd.nokia.radio-presets":{"source":"iana","extensions":["rpss"]},"application/vnd.novadigm.edm":{"source":"iana","extensions":["edm"]},"application/vnd.novadigm.edx":{"source":"iana","extensions":["edx"]},"application/vnd.novadigm.ext":{"source":"iana","extensions":["ext"]},"application/vnd.ntt-local.content-share":{"source":"iana"},"application/vnd.ntt-local.file-transfer":{"source":"iana"},"application/vnd.ntt-local.ogw_remote-access":{"source":"iana"},"application/vnd.ntt-local.sip-ta_remote":{"source":"iana"},"application/vnd.ntt-local.sip-ta_tcp_stream":{"source":"iana"},"application/vnd.oasis.opendocument.chart":{"source":"iana","extensions":["odc"]},"application/vnd.oasis.opendocument.chart-template":{"source":"iana","extensions":["otc"]},"application/vnd.oasis.opendocument.database":{"source":"iana","extensions":["odb"]},"application/vnd.oasis.opendocument.formula":{"source":"iana","extensions":["odf"]},"application/vnd.oasis.opendocument.formula-template":{"source":"iana","extensions":["odft"]},"application/vnd.oasis.opendocument.graphics":{"source":"iana","compressible":false,"extensions":["odg"]},"application/vnd.oasis.opendocument.graphics-template":{"source":"iana","extensions":["otg"]},"application/vnd.oasis.opendocument.image":{"source":"iana","extensions":["odi"]},"application/vnd.oasis.opendocument.image-template":{"source":"iana","extensions":["oti"]},"application/vnd.oasis.opendocument.presentation":{"source":"iana","compressible":false,"extensions":["odp"]},"application/vnd.oasis.opendocument.presentation-template":{"source":"iana","extensions":["otp"]},"application/vnd.oasis.opendocument.spreadsheet":{"source":"iana","compressible":false,"extensions":["ods"]},"application/vnd.oasis.opendocument.spreadsheet-template":{"source":"iana","extensions":["ots"]},"application/vnd.oasis.opendocument.text":{"source":"iana","compressible":false,"extensions":["odt"]},"application/vnd.oasis.opendocument.text-master":{"source":"iana","extensions":["odm"]},"application/vnd.oasis.opendocument.text-template":{"source":"iana","extensions":["ott"]},"application/vnd.oasis.opendocument.text-web":{"source":"iana","extensions":["oth"]},"application/vnd.obn":{"source":"iana"},"application/vnd.ocf+cbor":{"source":"iana"},"application/vnd.oci.image.manifest.v1+json":{"source":"iana","compressible":true},"application/vnd.oftn.l10n+json":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessdownload+xml":{"source":"iana","compressible":true},"application/vnd.oipf.contentaccessstreaming+xml":{"source":"iana","compressible":true},"application/vnd.oipf.cspg-hexbinary":{"source":"iana"},"application/vnd.oipf.dae.svg+xml":{"source":"iana","compressible":true},"application/vnd.oipf.dae.xhtml+xml":{"source":"iana","compressible":true},"application/vnd.oipf.mippvcontrolmessage+xml":{"source":"iana","compressible":true},"application/vnd.oipf.pae.gem":{"source":"iana"},"application/vnd.oipf.spdiscovery+xml":{"source":"iana","compressible":true},"application/vnd.oipf.spdlist+xml":{"source":"iana","compressible":true},"application/vnd.oipf.ueprofile+xml":{"source":"iana","compressible":true},"application/vnd.oipf.userprofile+xml":{"source":"iana","compressible":true},"application/vnd.olpc-sugar":{"source":"iana","extensions":["xo"]},"application/vnd.oma-scws-config":{"source":"iana"},"application/vnd.oma-scws-http-request":{"source":"iana"},"application/vnd.oma-scws-http-response":{"source":"iana"},"application/vnd.oma.bcast.associated-procedure-parameter+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.drm-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.imd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.ltkm":{"source":"iana"},"application/vnd.oma.bcast.notification+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.provisioningtrigger":{"source":"iana"},"application/vnd.oma.bcast.sgboot":{"source":"iana"},"application/vnd.oma.bcast.sgdd+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sgdu":{"source":"iana"},"application/vnd.oma.bcast.simple-symbol-container":{"source":"iana"},"application/vnd.oma.bcast.smartcard-trigger+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.sprov+xml":{"source":"iana","compressible":true},"application/vnd.oma.bcast.stkm":{"source":"iana"},"application/vnd.oma.cab-address-book+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-feature-handler+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-pcc+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-subs-invite+xml":{"source":"iana","compressible":true},"application/vnd.oma.cab-user-prefs+xml":{"source":"iana","compressible":true},"application/vnd.oma.dcd":{"source":"iana"},"application/vnd.oma.dcdc":{"source":"iana"},"application/vnd.oma.dd2+xml":{"source":"iana","compressible":true,"extensions":["dd2"]},"application/vnd.oma.drm.risd+xml":{"source":"iana","compressible":true},"application/vnd.oma.group-usage-list+xml":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+cbor":{"source":"iana"},"application/vnd.oma.lwm2m+json":{"source":"iana","compressible":true},"application/vnd.oma.lwm2m+tlv":{"source":"iana"},"application/vnd.oma.pal+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.detailed-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.final-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.groups+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.invocation-descriptor+xml":{"source":"iana","compressible":true},"application/vnd.oma.poc.optimized-progress-report+xml":{"source":"iana","compressible":true},"application/vnd.oma.push":{"source":"iana"},"application/vnd.oma.scidm.messages+xml":{"source":"iana","compressible":true},"application/vnd.oma.xcap-directory+xml":{"source":"iana","compressible":true},"application/vnd.omads-email+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-file+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omads-folder+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.omaloc-supl-init":{"source":"iana"},"application/vnd.onepager":{"source":"iana"},"application/vnd.onepagertamp":{"source":"iana"},"application/vnd.onepagertamx":{"source":"iana"},"application/vnd.onepagertat":{"source":"iana"},"application/vnd.onepagertatp":{"source":"iana"},"application/vnd.onepagertatx":{"source":"iana"},"application/vnd.openblox.game+xml":{"source":"iana","compressible":true,"extensions":["obgx"]},"application/vnd.openblox.game-binary":{"source":"iana"},"application/vnd.openeye.oeb":{"source":"iana"},"application/vnd.openofficeorg.extension":{"source":"apache","extensions":["oxt"]},"application/vnd.openstreetmap.data+xml":{"source":"iana","compressible":true,"extensions":["osm"]},"application/vnd.opentimestamps.ots":{"source":"iana"},"application/vnd.openxmlformats-officedocument.custom-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.customxmlproperties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawing+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chart+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramcolors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramdata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramlayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.drawingml.diagramstyle+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.extended-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.commentauthors+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.handoutmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesmaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.notesslide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presentation":{"source":"iana","compressible":false,"extensions":["pptx"]},"application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.presprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slide":{"source":"iana","extensions":["sldx"]},"application/vnd.openxmlformats-officedocument.presentationml.slide+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidelayout+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slidemaster+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideshow":{"source":"iana","extensions":["ppsx"]},"application/vnd.openxmlformats-officedocument.presentationml.slideshow.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.slideupdateinfo+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tablestyles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.tags+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.template":{"source":"iana","extensions":["potx"]},"application/vnd.openxmlformats-officedocument.presentationml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.presentationml.viewprops+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.calcchain+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.externallink+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcachedefinition+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotcacherecords+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.pivottable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.querytable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionheaders+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionlog+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedstrings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":{"source":"iana","compressible":false,"extensions":["xlsx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetmetadata+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.tablesinglecells+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.template":{"source":"iana","extensions":["xltx"]},"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.usernames+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.volatiledependencies+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.theme+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.themeoverride+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.vmldrawing":{"source":"iana"},"application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document":{"source":"iana","compressible":false,"extensions":["docx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.glossary+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.endnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.fonttable+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.footnotes+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.template":{"source":"iana","extensions":["dotx"]},"application/vnd.openxmlformats-officedocument.wordprocessingml.template.main+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-officedocument.wordprocessingml.websettings+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.core-properties+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.digital-signature-xmlsignature+xml":{"source":"iana","compressible":true},"application/vnd.openxmlformats-package.relationships+xml":{"source":"iana","compressible":true},"application/vnd.oracle.resource+json":{"source":"iana","compressible":true},"application/vnd.orange.indata":{"source":"iana"},"application/vnd.osa.netdeploy":{"source":"iana"},"application/vnd.osgeo.mapguide.package":{"source":"iana","extensions":["mgp"]},"application/vnd.osgi.bundle":{"source":"iana"},"application/vnd.osgi.dp":{"source":"iana","extensions":["dp"]},"application/vnd.osgi.subsystem":{"source":"iana","extensions":["esa"]},"application/vnd.otps.ct-kip+xml":{"source":"iana","compressible":true},"application/vnd.oxli.countgraph":{"source":"iana"},"application/vnd.pagerduty+json":{"source":"iana","compressible":true},"application/vnd.palm":{"source":"iana","extensions":["pdb","pqa","oprc"]},"application/vnd.panoply":{"source":"iana"},"application/vnd.paos.xml":{"source":"iana"},"application/vnd.patentdive":{"source":"iana"},"application/vnd.patientecommsdoc":{"source":"iana"},"application/vnd.pawaafile":{"source":"iana","extensions":["paw"]},"application/vnd.pcos":{"source":"iana"},"application/vnd.pg.format":{"source":"iana","extensions":["str"]},"application/vnd.pg.osasli":{"source":"iana","extensions":["ei6"]},"application/vnd.piaccess.application-licence":{"source":"iana"},"application/vnd.picsel":{"source":"iana","extensions":["efif"]},"application/vnd.pmi.widget":{"source":"iana","extensions":["wg"]},"application/vnd.poc.group-advertisement+xml":{"source":"iana","compressible":true},"application/vnd.pocketlearn":{"source":"iana","extensions":["plf"]},"application/vnd.powerbuilder6":{"source":"iana","extensions":["pbd"]},"application/vnd.powerbuilder6-s":{"source":"iana"},"application/vnd.powerbuilder7":{"source":"iana"},"application/vnd.powerbuilder7-s":{"source":"iana"},"application/vnd.powerbuilder75":{"source":"iana"},"application/vnd.powerbuilder75-s":{"source":"iana"},"application/vnd.preminet":{"source":"iana"},"application/vnd.previewsystems.box":{"source":"iana","extensions":["box"]},"application/vnd.proteus.magazine":{"source":"iana","extensions":["mgz"]},"application/vnd.psfs":{"source":"iana"},"application/vnd.publishare-delta-tree":{"source":"iana","extensions":["qps"]},"application/vnd.pvi.ptid1":{"source":"iana","extensions":["ptid"]},"application/vnd.pwg-multiplexed":{"source":"iana"},"application/vnd.pwg-xhtml-print+xml":{"source":"iana","compressible":true},"application/vnd.qualcomm.brew-app-res":{"source":"iana"},"application/vnd.quarantainenet":{"source":"iana"},"application/vnd.quark.quarkxpress":{"source":"iana","extensions":["qxd","qxt","qwd","qwt","qxl","qxb"]},"application/vnd.quobject-quoxdocument":{"source":"iana"},"application/vnd.radisys.moml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-conn+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-audit-stream+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-conf+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-base+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-detect+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-fax-sendrecv+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-group+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-speech+xml":{"source":"iana","compressible":true},"application/vnd.radisys.msml-dialog-transform+xml":{"source":"iana","compressible":true},"application/vnd.rainstor.data":{"source":"iana"},"application/vnd.rapid":{"source":"iana"},"application/vnd.rar":{"source":"iana","extensions":["rar"]},"application/vnd.realvnc.bed":{"source":"iana","extensions":["bed"]},"application/vnd.recordare.musicxml":{"source":"iana","extensions":["mxl"]},"application/vnd.recordare.musicxml+xml":{"source":"iana","compressible":true,"extensions":["musicxml"]},"application/vnd.renlearn.rlprint":{"source":"iana"},"application/vnd.resilient.logic":{"source":"iana"},"application/vnd.restful+json":{"source":"iana","compressible":true},"application/vnd.rig.cryptonote":{"source":"iana","extensions":["cryptonote"]},"application/vnd.rim.cod":{"source":"apache","extensions":["cod"]},"application/vnd.rn-realmedia":{"source":"apache","extensions":["rm"]},"application/vnd.rn-realmedia-vbr":{"source":"apache","extensions":["rmvb"]},"application/vnd.route66.link66+xml":{"source":"iana","compressible":true,"extensions":["link66"]},"application/vnd.rs-274x":{"source":"iana"},"application/vnd.ruckus.download":{"source":"iana"},"application/vnd.s3sms":{"source":"iana"},"application/vnd.sailingtracker.track":{"source":"iana","extensions":["st"]},"application/vnd.sar":{"source":"iana"},"application/vnd.sbm.cid":{"source":"iana"},"application/vnd.sbm.mid2":{"source":"iana"},"application/vnd.scribus":{"source":"iana"},"application/vnd.sealed.3df":{"source":"iana"},"application/vnd.sealed.csf":{"source":"iana"},"application/vnd.sealed.doc":{"source":"iana"},"application/vnd.sealed.eml":{"source":"iana"},"application/vnd.sealed.mht":{"source":"iana"},"application/vnd.sealed.net":{"source":"iana"},"application/vnd.sealed.ppt":{"source":"iana"},"application/vnd.sealed.tiff":{"source":"iana"},"application/vnd.sealed.xls":{"source":"iana"},"application/vnd.sealedmedia.softseal.html":{"source":"iana"},"application/vnd.sealedmedia.softseal.pdf":{"source":"iana"},"application/vnd.seemail":{"source":"iana","extensions":["see"]},"application/vnd.seis+json":{"source":"iana","compressible":true},"application/vnd.sema":{"source":"iana","extensions":["sema"]},"application/vnd.semd":{"source":"iana","extensions":["semd"]},"application/vnd.semf":{"source":"iana","extensions":["semf"]},"application/vnd.shade-save-file":{"source":"iana"},"application/vnd.shana.informed.formdata":{"source":"iana","extensions":["ifm"]},"application/vnd.shana.informed.formtemplate":{"source":"iana","extensions":["itp"]},"application/vnd.shana.informed.interchange":{"source":"iana","extensions":["iif"]},"application/vnd.shana.informed.package":{"source":"iana","extensions":["ipk"]},"application/vnd.shootproof+json":{"source":"iana","compressible":true},"application/vnd.shopkick+json":{"source":"iana","compressible":true},"application/vnd.shp":{"source":"iana"},"application/vnd.shx":{"source":"iana"},"application/vnd.sigrok.session":{"source":"iana"},"application/vnd.simtech-mindmapper":{"source":"iana","extensions":["twd","twds"]},"application/vnd.siren+json":{"source":"iana","compressible":true},"application/vnd.smaf":{"source":"iana","extensions":["mmf"]},"application/vnd.smart.notebook":{"source":"iana"},"application/vnd.smart.teacher":{"source":"iana","extensions":["teacher"]},"application/vnd.snesdev-page-table":{"source":"iana"},"application/vnd.software602.filler.form+xml":{"source":"iana","compressible":true,"extensions":["fo"]},"application/vnd.software602.filler.form-xml-zip":{"source":"iana"},"application/vnd.solent.sdkm+xml":{"source":"iana","compressible":true,"extensions":["sdkm","sdkd"]},"application/vnd.spotfire.dxp":{"source":"iana","extensions":["dxp"]},"application/vnd.spotfire.sfs":{"source":"iana","extensions":["sfs"]},"application/vnd.sqlite3":{"source":"iana"},"application/vnd.sss-cod":{"source":"iana"},"application/vnd.sss-dtf":{"source":"iana"},"application/vnd.sss-ntf":{"source":"iana"},"application/vnd.stardivision.calc":{"source":"apache","extensions":["sdc"]},"application/vnd.stardivision.draw":{"source":"apache","extensions":["sda"]},"application/vnd.stardivision.impress":{"source":"apache","extensions":["sdd"]},"application/vnd.stardivision.math":{"source":"apache","extensions":["smf"]},"application/vnd.stardivision.writer":{"source":"apache","extensions":["sdw","vor"]},"application/vnd.stardivision.writer-global":{"source":"apache","extensions":["sgl"]},"application/vnd.stepmania.package":{"source":"iana","extensions":["smzip"]},"application/vnd.stepmania.stepchart":{"source":"iana","extensions":["sm"]},"application/vnd.street-stream":{"source":"iana"},"application/vnd.sun.wadl+xml":{"source":"iana","compressible":true,"extensions":["wadl"]},"application/vnd.sun.xml.calc":{"source":"apache","extensions":["sxc"]},"application/vnd.sun.xml.calc.template":{"source":"apache","extensions":["stc"]},"application/vnd.sun.xml.draw":{"source":"apache","extensions":["sxd"]},"application/vnd.sun.xml.draw.template":{"source":"apache","extensions":["std"]},"application/vnd.sun.xml.impress":{"source":"apache","extensions":["sxi"]},"application/vnd.sun.xml.impress.template":{"source":"apache","extensions":["sti"]},"application/vnd.sun.xml.math":{"source":"apache","extensions":["sxm"]},"application/vnd.sun.xml.writer":{"source":"apache","extensions":["sxw"]},"application/vnd.sun.xml.writer.global":{"source":"apache","extensions":["sxg"]},"application/vnd.sun.xml.writer.template":{"source":"apache","extensions":["stw"]},"application/vnd.sus-calendar":{"source":"iana","extensions":["sus","susp"]},"application/vnd.svd":{"source":"iana","extensions":["svd"]},"application/vnd.swiftview-ics":{"source":"iana"},"application/vnd.sycle+xml":{"source":"iana","compressible":true},"application/vnd.syft+json":{"source":"iana","compressible":true},"application/vnd.symbian.install":{"source":"apache","extensions":["sis","sisx"]},"application/vnd.syncml+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xsm"]},"application/vnd.syncml.dm+wbxml":{"source":"iana","charset":"UTF-8","extensions":["bdm"]},"application/vnd.syncml.dm+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["xdm"]},"application/vnd.syncml.dm.notification":{"source":"iana"},"application/vnd.syncml.dmddf+wbxml":{"source":"iana"},"application/vnd.syncml.dmddf+xml":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["ddf"]},"application/vnd.syncml.dmtnds+wbxml":{"source":"iana"},"application/vnd.syncml.dmtnds+xml":{"source":"iana","charset":"UTF-8","compressible":true},"application/vnd.syncml.ds.notification":{"source":"iana"},"application/vnd.tableschema+json":{"source":"iana","compressible":true},"application/vnd.tao.intent-module-archive":{"source":"iana","extensions":["tao"]},"application/vnd.tcpdump.pcap":{"source":"iana","extensions":["pcap","cap","dmp"]},"application/vnd.think-cell.ppttc+json":{"source":"iana","compressible":true},"application/vnd.tmd.mediaflex.api+xml":{"source":"iana","compressible":true},"application/vnd.tml":{"source":"iana"},"application/vnd.tmobile-livetv":{"source":"iana","extensions":["tmo"]},"application/vnd.tri.onesource":{"source":"iana"},"application/vnd.trid.tpt":{"source":"iana","extensions":["tpt"]},"application/vnd.triscape.mxs":{"source":"iana","extensions":["mxs"]},"application/vnd.trueapp":{"source":"iana","extensions":["tra"]},"application/vnd.truedoc":{"source":"iana"},"application/vnd.ubisoft.webplayer":{"source":"iana"},"application/vnd.ufdl":{"source":"iana","extensions":["ufd","ufdl"]},"application/vnd.uiq.theme":{"source":"iana","extensions":["utz"]},"application/vnd.umajin":{"source":"iana","extensions":["umj"]},"application/vnd.unity":{"source":"iana","extensions":["unityweb"]},"application/vnd.uoml+xml":{"source":"iana","compressible":true,"extensions":["uoml"]},"application/vnd.uplanet.alert":{"source":"iana"},"application/vnd.uplanet.alert-wbxml":{"source":"iana"},"application/vnd.uplanet.bearer-choice":{"source":"iana"},"application/vnd.uplanet.bearer-choice-wbxml":{"source":"iana"},"application/vnd.uplanet.cacheop":{"source":"iana"},"application/vnd.uplanet.cacheop-wbxml":{"source":"iana"},"application/vnd.uplanet.channel":{"source":"iana"},"application/vnd.uplanet.channel-wbxml":{"source":"iana"},"application/vnd.uplanet.list":{"source":"iana"},"application/vnd.uplanet.list-wbxml":{"source":"iana"},"application/vnd.uplanet.listcmd":{"source":"iana"},"application/vnd.uplanet.listcmd-wbxml":{"source":"iana"},"application/vnd.uplanet.signal":{"source":"iana"},"application/vnd.uri-map":{"source":"iana"},"application/vnd.valve.source.material":{"source":"iana"},"application/vnd.vcx":{"source":"iana","extensions":["vcx"]},"application/vnd.vd-study":{"source":"iana"},"application/vnd.vectorworks":{"source":"iana"},"application/vnd.vel+json":{"source":"iana","compressible":true},"application/vnd.verimatrix.vcas":{"source":"iana"},"application/vnd.veritone.aion+json":{"source":"iana","compressible":true},"application/vnd.veryant.thin":{"source":"iana"},"application/vnd.ves.encrypted":{"source":"iana"},"application/vnd.vidsoft.vidconference":{"source":"iana"},"application/vnd.visio":{"source":"iana","extensions":["vsd","vst","vss","vsw"]},"application/vnd.visionary":{"source":"iana","extensions":["vis"]},"application/vnd.vividence.scriptfile":{"source":"iana"},"application/vnd.vsf":{"source":"iana","extensions":["vsf"]},"application/vnd.wap.sic":{"source":"iana"},"application/vnd.wap.slc":{"source":"iana"},"application/vnd.wap.wbxml":{"source":"iana","charset":"UTF-8","extensions":["wbxml"]},"application/vnd.wap.wmlc":{"source":"iana","extensions":["wmlc"]},"application/vnd.wap.wmlscriptc":{"source":"iana","extensions":["wmlsc"]},"application/vnd.webturbo":{"source":"iana","extensions":["wtb"]},"application/vnd.wfa.dpp":{"source":"iana"},"application/vnd.wfa.p2p":{"source":"iana"},"application/vnd.wfa.wsc":{"source":"iana"},"application/vnd.windows.devicepairing":{"source":"iana"},"application/vnd.wmc":{"source":"iana"},"application/vnd.wmf.bootstrap":{"source":"iana"},"application/vnd.wolfram.mathematica":{"source":"iana"},"application/vnd.wolfram.mathematica.package":{"source":"iana"},"application/vnd.wolfram.player":{"source":"iana","extensions":["nbp"]},"application/vnd.wordperfect":{"source":"iana","extensions":["wpd"]},"application/vnd.wqd":{"source":"iana","extensions":["wqd"]},"application/vnd.wrq-hp3000-labelled":{"source":"iana"},"application/vnd.wt.stf":{"source":"iana","extensions":["stf"]},"application/vnd.wv.csp+wbxml":{"source":"iana"},"application/vnd.wv.csp+xml":{"source":"iana","compressible":true},"application/vnd.wv.ssp+xml":{"source":"iana","compressible":true},"application/vnd.xacml+json":{"source":"iana","compressible":true},"application/vnd.xara":{"source":"iana","extensions":["xar"]},"application/vnd.xfdl":{"source":"iana","extensions":["xfdl"]},"application/vnd.xfdl.webform":{"source":"iana"},"application/vnd.xmi+xml":{"source":"iana","compressible":true},"application/vnd.xmpie.cpkg":{"source":"iana"},"application/vnd.xmpie.dpkg":{"source":"iana"},"application/vnd.xmpie.plan":{"source":"iana"},"application/vnd.xmpie.ppkg":{"source":"iana"},"application/vnd.xmpie.xlim":{"source":"iana"},"application/vnd.yamaha.hv-dic":{"source":"iana","extensions":["hvd"]},"application/vnd.yamaha.hv-script":{"source":"iana","extensions":["hvs"]},"application/vnd.yamaha.hv-voice":{"source":"iana","extensions":["hvp"]},"application/vnd.yamaha.openscoreformat":{"source":"iana","extensions":["osf"]},"application/vnd.yamaha.openscoreformat.osfpvg+xml":{"source":"iana","compressible":true,"extensions":["osfpvg"]},"application/vnd.yamaha.remote-setup":{"source":"iana"},"application/vnd.yamaha.smaf-audio":{"source":"iana","extensions":["saf"]},"application/vnd.yamaha.smaf-phrase":{"source":"iana","extensions":["spf"]},"application/vnd.yamaha.through-ngn":{"source":"iana"},"application/vnd.yamaha.tunnel-udpencap":{"source":"iana"},"application/vnd.yaoweme":{"source":"iana"},"application/vnd.yellowriver-custom-menu":{"source":"iana","extensions":["cmp"]},"application/vnd.youtube.yt":{"source":"iana"},"application/vnd.zul":{"source":"iana","extensions":["zir","zirz"]},"application/vnd.zzazz.deck+xml":{"source":"iana","compressible":true,"extensions":["zaz"]},"application/voicexml+xml":{"source":"iana","compressible":true,"extensions":["vxml"]},"application/voucher-cms+json":{"source":"iana","compressible":true},"application/vq-rtcpxr":{"source":"iana"},"application/wasm":{"source":"iana","compressible":true,"extensions":["wasm"]},"application/watcherinfo+xml":{"source":"iana","compressible":true,"extensions":["wif"]},"application/webpush-options+json":{"source":"iana","compressible":true},"application/whoispp-query":{"source":"iana"},"application/whoispp-response":{"source":"iana"},"application/widget":{"source":"iana","extensions":["wgt"]},"application/winhlp":{"source":"apache","extensions":["hlp"]},"application/wita":{"source":"iana"},"application/wordperfect5.1":{"source":"iana"},"application/wsdl+xml":{"source":"iana","compressible":true,"extensions":["wsdl"]},"application/wspolicy+xml":{"source":"iana","compressible":true,"extensions":["wspolicy"]},"application/x-7z-compressed":{"source":"apache","compressible":false,"extensions":["7z"]},"application/x-abiword":{"source":"apache","extensions":["abw"]},"application/x-ace-compressed":{"source":"apache","extensions":["ace"]},"application/x-amf":{"source":"apache"},"application/x-apple-diskimage":{"source":"apache","extensions":["dmg"]},"application/x-arj":{"compressible":false,"extensions":["arj"]},"application/x-authorware-bin":{"source":"apache","extensions":["aab","x32","u32","vox"]},"application/x-authorware-map":{"source":"apache","extensions":["aam"]},"application/x-authorware-seg":{"source":"apache","extensions":["aas"]},"application/x-bcpio":{"source":"apache","extensions":["bcpio"]},"application/x-bdoc":{"compressible":false,"extensions":["bdoc"]},"application/x-bittorrent":{"source":"apache","extensions":["torrent"]},"application/x-blorb":{"source":"apache","extensions":["blb","blorb"]},"application/x-bzip":{"source":"apache","compressible":false,"extensions":["bz"]},"application/x-bzip2":{"source":"apache","compressible":false,"extensions":["bz2","boz"]},"application/x-cbr":{"source":"apache","extensions":["cbr","cba","cbt","cbz","cb7"]},"application/x-cdlink":{"source":"apache","extensions":["vcd"]},"application/x-cfs-compressed":{"source":"apache","extensions":["cfs"]},"application/x-chat":{"source":"apache","extensions":["chat"]},"application/x-chess-pgn":{"source":"apache","extensions":["pgn"]},"application/x-chrome-extension":{"extensions":["crx"]},"application/x-cocoa":{"source":"nginx","extensions":["cco"]},"application/x-compress":{"source":"apache"},"application/x-conference":{"source":"apache","extensions":["nsc"]},"application/x-cpio":{"source":"apache","extensions":["cpio"]},"application/x-csh":{"source":"apache","extensions":["csh"]},"application/x-deb":{"compressible":false},"application/x-debian-package":{"source":"apache","extensions":["deb","udeb"]},"application/x-dgc-compressed":{"source":"apache","extensions":["dgc"]},"application/x-director":{"source":"apache","extensions":["dir","dcr","dxr","cst","cct","cxt","w3d","fgd","swa"]},"application/x-doom":{"source":"apache","extensions":["wad"]},"application/x-dtbncx+xml":{"source":"apache","compressible":true,"extensions":["ncx"]},"application/x-dtbook+xml":{"source":"apache","compressible":true,"extensions":["dtb"]},"application/x-dtbresource+xml":{"source":"apache","compressible":true,"extensions":["res"]},"application/x-dvi":{"source":"apache","compressible":false,"extensions":["dvi"]},"application/x-envoy":{"source":"apache","extensions":["evy"]},"application/x-eva":{"source":"apache","extensions":["eva"]},"application/x-font-bdf":{"source":"apache","extensions":["bdf"]},"application/x-font-dos":{"source":"apache"},"application/x-font-framemaker":{"source":"apache"},"application/x-font-ghostscript":{"source":"apache","extensions":["gsf"]},"application/x-font-libgrx":{"source":"apache"},"application/x-font-linux-psf":{"source":"apache","extensions":["psf"]},"application/x-font-pcf":{"source":"apache","extensions":["pcf"]},"application/x-font-snf":{"source":"apache","extensions":["snf"]},"application/x-font-speedo":{"source":"apache"},"application/x-font-sunos-news":{"source":"apache"},"application/x-font-type1":{"source":"apache","extensions":["pfa","pfb","pfm","afm"]},"application/x-font-vfont":{"source":"apache"},"application/x-freearc":{"source":"apache","extensions":["arc"]},"application/x-futuresplash":{"source":"apache","extensions":["spl"]},"application/x-gca-compressed":{"source":"apache","extensions":["gca"]},"application/x-glulx":{"source":"apache","extensions":["ulx"]},"application/x-gnumeric":{"source":"apache","extensions":["gnumeric"]},"application/x-gramps-xml":{"source":"apache","extensions":["gramps"]},"application/x-gtar":{"source":"apache","extensions":["gtar"]},"application/x-gzip":{"source":"apache"},"application/x-hdf":{"source":"apache","extensions":["hdf"]},"application/x-httpd-php":{"compressible":true,"extensions":["php"]},"application/x-install-instructions":{"source":"apache","extensions":["install"]},"application/x-iso9660-image":{"source":"apache","extensions":["iso"]},"application/x-iwork-keynote-sffkey":{"extensions":["key"]},"application/x-iwork-numbers-sffnumbers":{"extensions":["numbers"]},"application/x-iwork-pages-sffpages":{"extensions":["pages"]},"application/x-java-archive-diff":{"source":"nginx","extensions":["jardiff"]},"application/x-java-jnlp-file":{"source":"apache","compressible":false,"extensions":["jnlp"]},"application/x-javascript":{"compressible":true},"application/x-keepass2":{"extensions":["kdbx"]},"application/x-latex":{"source":"apache","compressible":false,"extensions":["latex"]},"application/x-lua-bytecode":{"extensions":["luac"]},"application/x-lzh-compressed":{"source":"apache","extensions":["lzh","lha"]},"application/x-makeself":{"source":"nginx","extensions":["run"]},"application/x-mie":{"source":"apache","extensions":["mie"]},"application/x-mobipocket-ebook":{"source":"apache","extensions":["prc","mobi"]},"application/x-mpegurl":{"compressible":false},"application/x-ms-application":{"source":"apache","extensions":["application"]},"application/x-ms-shortcut":{"source":"apache","extensions":["lnk"]},"application/x-ms-wmd":{"source":"apache","extensions":["wmd"]},"application/x-ms-wmz":{"source":"apache","extensions":["wmz"]},"application/x-ms-xbap":{"source":"apache","extensions":["xbap"]},"application/x-msaccess":{"source":"apache","extensions":["mdb"]},"application/x-msbinder":{"source":"apache","extensions":["obd"]},"application/x-mscardfile":{"source":"apache","extensions":["crd"]},"application/x-msclip":{"source":"apache","extensions":["clp"]},"application/x-msdos-program":{"extensions":["exe"]},"application/x-msdownload":{"source":"apache","extensions":["exe","dll","com","bat","msi"]},"application/x-msmediaview":{"source":"apache","extensions":["mvb","m13","m14"]},"application/x-msmetafile":{"source":"apache","extensions":["wmf","wmz","emf","emz"]},"application/x-msmoney":{"source":"apache","extensions":["mny"]},"application/x-mspublisher":{"source":"apache","extensions":["pub"]},"application/x-msschedule":{"source":"apache","extensions":["scd"]},"application/x-msterminal":{"source":"apache","extensions":["trm"]},"application/x-mswrite":{"source":"apache","extensions":["wri"]},"application/x-netcdf":{"source":"apache","extensions":["nc","cdf"]},"application/x-ns-proxy-autoconfig":{"compressible":true,"extensions":["pac"]},"application/x-nzb":{"source":"apache","extensions":["nzb"]},"application/x-perl":{"source":"nginx","extensions":["pl","pm"]},"application/x-pilot":{"source":"nginx","extensions":["prc","pdb"]},"application/x-pkcs12":{"source":"apache","compressible":false,"extensions":["p12","pfx"]},"application/x-pkcs7-certificates":{"source":"apache","extensions":["p7b","spc"]},"application/x-pkcs7-certreqresp":{"source":"apache","extensions":["p7r"]},"application/x-pki-message":{"source":"iana"},"application/x-rar-compressed":{"source":"apache","compressible":false,"extensions":["rar"]},"application/x-redhat-package-manager":{"source":"nginx","extensions":["rpm"]},"application/x-research-info-systems":{"source":"apache","extensions":["ris"]},"application/x-sea":{"source":"nginx","extensions":["sea"]},"application/x-sh":{"source":"apache","compressible":true,"extensions":["sh"]},"application/x-shar":{"source":"apache","extensions":["shar"]},"application/x-shockwave-flash":{"source":"apache","compressible":false,"extensions":["swf"]},"application/x-silverlight-app":{"source":"apache","extensions":["xap"]},"application/x-sql":{"source":"apache","extensions":["sql"]},"application/x-stuffit":{"source":"apache","compressible":false,"extensions":["sit"]},"application/x-stuffitx":{"source":"apache","extensions":["sitx"]},"application/x-subrip":{"source":"apache","extensions":["srt"]},"application/x-sv4cpio":{"source":"apache","extensions":["sv4cpio"]},"application/x-sv4crc":{"source":"apache","extensions":["sv4crc"]},"application/x-t3vm-image":{"source":"apache","extensions":["t3"]},"application/x-tads":{"source":"apache","extensions":["gam"]},"application/x-tar":{"source":"apache","compressible":true,"extensions":["tar"]},"application/x-tcl":{"source":"apache","extensions":["tcl","tk"]},"application/x-tex":{"source":"apache","extensions":["tex"]},"application/x-tex-tfm":{"source":"apache","extensions":["tfm"]},"application/x-texinfo":{"source":"apache","extensions":["texinfo","texi"]},"application/x-tgif":{"source":"apache","extensions":["obj"]},"application/x-ustar":{"source":"apache","extensions":["ustar"]},"application/x-virtualbox-hdd":{"compressible":true,"extensions":["hdd"]},"application/x-virtualbox-ova":{"compressible":true,"extensions":["ova"]},"application/x-virtualbox-ovf":{"compressible":true,"extensions":["ovf"]},"application/x-virtualbox-vbox":{"compressible":true,"extensions":["vbox"]},"application/x-virtualbox-vbox-extpack":{"compressible":false,"extensions":["vbox-extpack"]},"application/x-virtualbox-vdi":{"compressible":true,"extensions":["vdi"]},"application/x-virtualbox-vhd":{"compressible":true,"extensions":["vhd"]},"application/x-virtualbox-vmdk":{"compressible":true,"extensions":["vmdk"]},"application/x-wais-source":{"source":"apache","extensions":["src"]},"application/x-web-app-manifest+json":{"compressible":true,"extensions":["webapp"]},"application/x-www-form-urlencoded":{"source":"iana","compressible":true},"application/x-x509-ca-cert":{"source":"iana","extensions":["der","crt","pem"]},"application/x-x509-ca-ra-cert":{"source":"iana"},"application/x-x509-next-ca-cert":{"source":"iana"},"application/x-xfig":{"source":"apache","extensions":["fig"]},"application/x-xliff+xml":{"source":"apache","compressible":true,"extensions":["xlf"]},"application/x-xpinstall":{"source":"apache","compressible":false,"extensions":["xpi"]},"application/x-xz":{"source":"apache","extensions":["xz"]},"application/x-zmachine":{"source":"apache","extensions":["z1","z2","z3","z4","z5","z6","z7","z8"]},"application/x400-bp":{"source":"iana"},"application/xacml+xml":{"source":"iana","compressible":true},"application/xaml+xml":{"source":"apache","compressible":true,"extensions":["xaml"]},"application/xcap-att+xml":{"source":"iana","compressible":true,"extensions":["xav"]},"application/xcap-caps+xml":{"source":"iana","compressible":true,"extensions":["xca"]},"application/xcap-diff+xml":{"source":"iana","compressible":true,"extensions":["xdf"]},"application/xcap-el+xml":{"source":"iana","compressible":true,"extensions":["xel"]},"application/xcap-error+xml":{"source":"iana","compressible":true},"application/xcap-ns+xml":{"source":"iana","compressible":true,"extensions":["xns"]},"application/xcon-conference-info+xml":{"source":"iana","compressible":true},"application/xcon-conference-info-diff+xml":{"source":"iana","compressible":true},"application/xenc+xml":{"source":"iana","compressible":true,"extensions":["xenc"]},"application/xhtml+xml":{"source":"iana","compressible":true,"extensions":["xhtml","xht"]},"application/xhtml-voice+xml":{"source":"apache","compressible":true},"application/xliff+xml":{"source":"iana","compressible":true,"extensions":["xlf"]},"application/xml":{"source":"iana","compressible":true,"extensions":["xml","xsl","xsd","rng"]},"application/xml-dtd":{"source":"iana","compressible":true,"extensions":["dtd"]},"application/xml-external-parsed-entity":{"source":"iana"},"application/xml-patch+xml":{"source":"iana","compressible":true},"application/xmpp+xml":{"source":"iana","compressible":true},"application/xop+xml":{"source":"iana","compressible":true,"extensions":["xop"]},"application/xproc+xml":{"source":"apache","compressible":true,"extensions":["xpl"]},"application/xslt+xml":{"source":"iana","compressible":true,"extensions":["xsl","xslt"]},"application/xspf+xml":{"source":"apache","compressible":true,"extensions":["xspf"]},"application/xv+xml":{"source":"iana","compressible":true,"extensions":["mxml","xhvml","xvml","xvm"]},"application/yang":{"source":"iana","extensions":["yang"]},"application/yang-data+json":{"source":"iana","compressible":true},"application/yang-data+xml":{"source":"iana","compressible":true},"application/yang-patch+json":{"source":"iana","compressible":true},"application/yang-patch+xml":{"source":"iana","compressible":true},"application/yin+xml":{"source":"iana","compressible":true,"extensions":["yin"]},"application/zip":{"source":"iana","compressible":false,"extensions":["zip"]},"application/zlib":{"source":"iana"},"application/zstd":{"source":"iana"},"audio/1d-interleaved-parityfec":{"source":"iana"},"audio/32kadpcm":{"source":"iana"},"audio/3gpp":{"source":"iana","compressible":false,"extensions":["3gpp"]},"audio/3gpp2":{"source":"iana"},"audio/aac":{"source":"iana"},"audio/ac3":{"source":"iana"},"audio/adpcm":{"source":"apache","extensions":["adp"]},"audio/amr":{"source":"iana","extensions":["amr"]},"audio/amr-wb":{"source":"iana"},"audio/amr-wb+":{"source":"iana"},"audio/aptx":{"source":"iana"},"audio/asc":{"source":"iana"},"audio/atrac-advanced-lossless":{"source":"iana"},"audio/atrac-x":{"source":"iana"},"audio/atrac3":{"source":"iana"},"audio/basic":{"source":"iana","compressible":false,"extensions":["au","snd"]},"audio/bv16":{"source":"iana"},"audio/bv32":{"source":"iana"},"audio/clearmode":{"source":"iana"},"audio/cn":{"source":"iana"},"audio/dat12":{"source":"iana"},"audio/dls":{"source":"iana"},"audio/dsr-es201108":{"source":"iana"},"audio/dsr-es202050":{"source":"iana"},"audio/dsr-es202211":{"source":"iana"},"audio/dsr-es202212":{"source":"iana"},"audio/dv":{"source":"iana"},"audio/dvi4":{"source":"iana"},"audio/eac3":{"source":"iana"},"audio/encaprtp":{"source":"iana"},"audio/evrc":{"source":"iana"},"audio/evrc-qcp":{"source":"iana"},"audio/evrc0":{"source":"iana"},"audio/evrc1":{"source":"iana"},"audio/evrcb":{"source":"iana"},"audio/evrcb0":{"source":"iana"},"audio/evrcb1":{"source":"iana"},"audio/evrcnw":{"source":"iana"},"audio/evrcnw0":{"source":"iana"},"audio/evrcnw1":{"source":"iana"},"audio/evrcwb":{"source":"iana"},"audio/evrcwb0":{"source":"iana"},"audio/evrcwb1":{"source":"iana"},"audio/evs":{"source":"iana"},"audio/flexfec":{"source":"iana"},"audio/fwdred":{"source":"iana"},"audio/g711-0":{"source":"iana"},"audio/g719":{"source":"iana"},"audio/g722":{"source":"iana"},"audio/g7221":{"source":"iana"},"audio/g723":{"source":"iana"},"audio/g726-16":{"source":"iana"},"audio/g726-24":{"source":"iana"},"audio/g726-32":{"source":"iana"},"audio/g726-40":{"source":"iana"},"audio/g728":{"source":"iana"},"audio/g729":{"source":"iana"},"audio/g7291":{"source":"iana"},"audio/g729d":{"source":"iana"},"audio/g729e":{"source":"iana"},"audio/gsm":{"source":"iana"},"audio/gsm-efr":{"source":"iana"},"audio/gsm-hr-08":{"source":"iana"},"audio/ilbc":{"source":"iana"},"audio/ip-mr_v2.5":{"source":"iana"},"audio/isac":{"source":"apache"},"audio/l16":{"source":"iana"},"audio/l20":{"source":"iana"},"audio/l24":{"source":"iana","compressible":false},"audio/l8":{"source":"iana"},"audio/lpc":{"source":"iana"},"audio/melp":{"source":"iana"},"audio/melp1200":{"source":"iana"},"audio/melp2400":{"source":"iana"},"audio/melp600":{"source":"iana"},"audio/mhas":{"source":"iana"},"audio/midi":{"source":"apache","extensions":["mid","midi","kar","rmi"]},"audio/mobile-xmf":{"source":"iana","extensions":["mxmf"]},"audio/mp3":{"compressible":false,"extensions":["mp3"]},"audio/mp4":{"source":"iana","compressible":false,"extensions":["m4a","mp4a"]},"audio/mp4a-latm":{"source":"iana"},"audio/mpa":{"source":"iana"},"audio/mpa-robust":{"source":"iana"},"audio/mpeg":{"source":"iana","compressible":false,"extensions":["mpga","mp2","mp2a","mp3","m2a","m3a"]},"audio/mpeg4-generic":{"source":"iana"},"audio/musepack":{"source":"apache"},"audio/ogg":{"source":"iana","compressible":false,"extensions":["oga","ogg","spx","opus"]},"audio/opus":{"source":"iana"},"audio/parityfec":{"source":"iana"},"audio/pcma":{"source":"iana"},"audio/pcma-wb":{"source":"iana"},"audio/pcmu":{"source":"iana"},"audio/pcmu-wb":{"source":"iana"},"audio/prs.sid":{"source":"iana"},"audio/qcelp":{"source":"iana"},"audio/raptorfec":{"source":"iana"},"audio/red":{"source":"iana"},"audio/rtp-enc-aescm128":{"source":"iana"},"audio/rtp-midi":{"source":"iana"},"audio/rtploopback":{"source":"iana"},"audio/rtx":{"source":"iana"},"audio/s3m":{"source":"apache","extensions":["s3m"]},"audio/scip":{"source":"iana"},"audio/silk":{"source":"apache","extensions":["sil"]},"audio/smv":{"source":"iana"},"audio/smv-qcp":{"source":"iana"},"audio/smv0":{"source":"iana"},"audio/sofa":{"source":"iana"},"audio/sp-midi":{"source":"iana"},"audio/speex":{"source":"iana"},"audio/t140c":{"source":"iana"},"audio/t38":{"source":"iana"},"audio/telephone-event":{"source":"iana"},"audio/tetra_acelp":{"source":"iana"},"audio/tetra_acelp_bb":{"source":"iana"},"audio/tone":{"source":"iana"},"audio/tsvcis":{"source":"iana"},"audio/uemclip":{"source":"iana"},"audio/ulpfec":{"source":"iana"},"audio/usac":{"source":"iana"},"audio/vdvi":{"source":"iana"},"audio/vmr-wb":{"source":"iana"},"audio/vnd.3gpp.iufp":{"source":"iana"},"audio/vnd.4sb":{"source":"iana"},"audio/vnd.audiokoz":{"source":"iana"},"audio/vnd.celp":{"source":"iana"},"audio/vnd.cisco.nse":{"source":"iana"},"audio/vnd.cmles.radio-events":{"source":"iana"},"audio/vnd.cns.anp1":{"source":"iana"},"audio/vnd.cns.inf1":{"source":"iana"},"audio/vnd.dece.audio":{"source":"iana","extensions":["uva","uvva"]},"audio/vnd.digital-winds":{"source":"iana","extensions":["eol"]},"audio/vnd.dlna.adts":{"source":"iana"},"audio/vnd.dolby.heaac.1":{"source":"iana"},"audio/vnd.dolby.heaac.2":{"source":"iana"},"audio/vnd.dolby.mlp":{"source":"iana"},"audio/vnd.dolby.mps":{"source":"iana"},"audio/vnd.dolby.pl2":{"source":"iana"},"audio/vnd.dolby.pl2x":{"source":"iana"},"audio/vnd.dolby.pl2z":{"source":"iana"},"audio/vnd.dolby.pulse.1":{"source":"iana"},"audio/vnd.dra":{"source":"iana","extensions":["dra"]},"audio/vnd.dts":{"source":"iana","extensions":["dts"]},"audio/vnd.dts.hd":{"source":"iana","extensions":["dtshd"]},"audio/vnd.dts.uhd":{"source":"iana"},"audio/vnd.dvb.file":{"source":"iana"},"audio/vnd.everad.plj":{"source":"iana"},"audio/vnd.hns.audio":{"source":"iana"},"audio/vnd.lucent.voice":{"source":"iana","extensions":["lvp"]},"audio/vnd.ms-playready.media.pya":{"source":"iana","extensions":["pya"]},"audio/vnd.nokia.mobile-xmf":{"source":"iana"},"audio/vnd.nortel.vbk":{"source":"iana"},"audio/vnd.nuera.ecelp4800":{"source":"iana","extensions":["ecelp4800"]},"audio/vnd.nuera.ecelp7470":{"source":"iana","extensions":["ecelp7470"]},"audio/vnd.nuera.ecelp9600":{"source":"iana","extensions":["ecelp9600"]},"audio/vnd.octel.sbc":{"source":"iana"},"audio/vnd.presonus.multitrack":{"source":"iana"},"audio/vnd.qcelp":{"source":"iana"},"audio/vnd.rhetorex.32kadpcm":{"source":"iana"},"audio/vnd.rip":{"source":"iana","extensions":["rip"]},"audio/vnd.rn-realaudio":{"compressible":false},"audio/vnd.sealedmedia.softseal.mpeg":{"source":"iana"},"audio/vnd.vmx.cvsd":{"source":"iana"},"audio/vnd.wave":{"compressible":false},"audio/vorbis":{"source":"iana","compressible":false},"audio/vorbis-config":{"source":"iana"},"audio/wav":{"compressible":false,"extensions":["wav"]},"audio/wave":{"compressible":false,"extensions":["wav"]},"audio/webm":{"source":"apache","compressible":false,"extensions":["weba"]},"audio/x-aac":{"source":"apache","compressible":false,"extensions":["aac"]},"audio/x-aiff":{"source":"apache","extensions":["aif","aiff","aifc"]},"audio/x-caf":{"source":"apache","compressible":false,"extensions":["caf"]},"audio/x-flac":{"source":"apache","extensions":["flac"]},"audio/x-m4a":{"source":"nginx","extensions":["m4a"]},"audio/x-matroska":{"source":"apache","extensions":["mka"]},"audio/x-mpegurl":{"source":"apache","extensions":["m3u"]},"audio/x-ms-wax":{"source":"apache","extensions":["wax"]},"audio/x-ms-wma":{"source":"apache","extensions":["wma"]},"audio/x-pn-realaudio":{"source":"apache","extensions":["ram","ra"]},"audio/x-pn-realaudio-plugin":{"source":"apache","extensions":["rmp"]},"audio/x-realaudio":{"source":"nginx","extensions":["ra"]},"audio/x-tta":{"source":"apache"},"audio/x-wav":{"source":"apache","extensions":["wav"]},"audio/xm":{"source":"apache","extensions":["xm"]},"chemical/x-cdx":{"source":"apache","extensions":["cdx"]},"chemical/x-cif":{"source":"apache","extensions":["cif"]},"chemical/x-cmdf":{"source":"apache","extensions":["cmdf"]},"chemical/x-cml":{"source":"apache","extensions":["cml"]},"chemical/x-csml":{"source":"apache","extensions":["csml"]},"chemical/x-pdb":{"source":"apache"},"chemical/x-xyz":{"source":"apache","extensions":["xyz"]},"font/collection":{"source":"iana","extensions":["ttc"]},"font/otf":{"source":"iana","compressible":true,"extensions":["otf"]},"font/sfnt":{"source":"iana"},"font/ttf":{"source":"iana","compressible":true,"extensions":["ttf"]},"font/woff":{"source":"iana","extensions":["woff"]},"font/woff2":{"source":"iana","extensions":["woff2"]},"image/aces":{"source":"iana","extensions":["exr"]},"image/apng":{"compressible":false,"extensions":["apng"]},"image/avci":{"source":"iana","extensions":["avci"]},"image/avcs":{"source":"iana","extensions":["avcs"]},"image/avif":{"source":"iana","compressible":false,"extensions":["avif"]},"image/bmp":{"source":"iana","compressible":true,"extensions":["bmp"]},"image/cgm":{"source":"iana","extensions":["cgm"]},"image/dicom-rle":{"source":"iana","extensions":["drle"]},"image/emf":{"source":"iana","extensions":["emf"]},"image/fits":{"source":"iana","extensions":["fits"]},"image/g3fax":{"source":"iana","extensions":["g3"]},"image/gif":{"source":"iana","compressible":false,"extensions":["gif"]},"image/heic":{"source":"iana","extensions":["heic"]},"image/heic-sequence":{"source":"iana","extensions":["heics"]},"image/heif":{"source":"iana","extensions":["heif"]},"image/heif-sequence":{"source":"iana","extensions":["heifs"]},"image/hej2k":{"source":"iana","extensions":["hej2"]},"image/hsj2":{"source":"iana","extensions":["hsj2"]},"image/ief":{"source":"iana","extensions":["ief"]},"image/jls":{"source":"iana","extensions":["jls"]},"image/jp2":{"source":"iana","compressible":false,"extensions":["jp2","jpg2"]},"image/jpeg":{"source":"iana","compressible":false,"extensions":["jpeg","jpg","jpe"]},"image/jph":{"source":"iana","extensions":["jph"]},"image/jphc":{"source":"iana","extensions":["jhc"]},"image/jpm":{"source":"iana","compressible":false,"extensions":["jpm"]},"image/jpx":{"source":"iana","compressible":false,"extensions":["jpx","jpf"]},"image/jxr":{"source":"iana","extensions":["jxr"]},"image/jxra":{"source":"iana","extensions":["jxra"]},"image/jxrs":{"source":"iana","extensions":["jxrs"]},"image/jxs":{"source":"iana","extensions":["jxs"]},"image/jxsc":{"source":"iana","extensions":["jxsc"]},"image/jxsi":{"source":"iana","extensions":["jxsi"]},"image/jxss":{"source":"iana","extensions":["jxss"]},"image/ktx":{"source":"iana","extensions":["ktx"]},"image/ktx2":{"source":"iana","extensions":["ktx2"]},"image/naplps":{"source":"iana"},"image/pjpeg":{"compressible":false},"image/png":{"source":"iana","compressible":false,"extensions":["png"]},"image/prs.btif":{"source":"iana","extensions":["btif"]},"image/prs.pti":{"source":"iana","extensions":["pti"]},"image/pwg-raster":{"source":"iana"},"image/sgi":{"source":"apache","extensions":["sgi"]},"image/svg+xml":{"source":"iana","compressible":true,"extensions":["svg","svgz"]},"image/t38":{"source":"iana","extensions":["t38"]},"image/tiff":{"source":"iana","compressible":false,"extensions":["tif","tiff"]},"image/tiff-fx":{"source":"iana","extensions":["tfx"]},"image/vnd.adobe.photoshop":{"source":"iana","compressible":true,"extensions":["psd"]},"image/vnd.airzip.accelerator.azv":{"source":"iana","extensions":["azv"]},"image/vnd.cns.inf2":{"source":"iana"},"image/vnd.dece.graphic":{"source":"iana","extensions":["uvi","uvvi","uvg","uvvg"]},"image/vnd.djvu":{"source":"iana","extensions":["djvu","djv"]},"image/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"image/vnd.dwg":{"source":"iana","extensions":["dwg"]},"image/vnd.dxf":{"source":"iana","extensions":["dxf"]},"image/vnd.fastbidsheet":{"source":"iana","extensions":["fbs"]},"image/vnd.fpx":{"source":"iana","extensions":["fpx"]},"image/vnd.fst":{"source":"iana","extensions":["fst"]},"image/vnd.fujixerox.edmics-mmr":{"source":"iana","extensions":["mmr"]},"image/vnd.fujixerox.edmics-rlc":{"source":"iana","extensions":["rlc"]},"image/vnd.globalgraphics.pgb":{"source":"iana"},"image/vnd.microsoft.icon":{"source":"iana","compressible":true,"extensions":["ico"]},"image/vnd.mix":{"source":"iana"},"image/vnd.mozilla.apng":{"source":"iana"},"image/vnd.ms-dds":{"compressible":true,"extensions":["dds"]},"image/vnd.ms-modi":{"source":"iana","extensions":["mdi"]},"image/vnd.ms-photo":{"source":"apache","extensions":["wdp"]},"image/vnd.net-fpx":{"source":"iana","extensions":["npx"]},"image/vnd.pco.b16":{"source":"iana","extensions":["b16"]},"image/vnd.radiance":{"source":"iana"},"image/vnd.sealed.png":{"source":"iana"},"image/vnd.sealedmedia.softseal.gif":{"source":"iana"},"image/vnd.sealedmedia.softseal.jpg":{"source":"iana"},"image/vnd.svf":{"source":"iana"},"image/vnd.tencent.tap":{"source":"iana","extensions":["tap"]},"image/vnd.valve.source.texture":{"source":"iana","extensions":["vtf"]},"image/vnd.wap.wbmp":{"source":"iana","extensions":["wbmp"]},"image/vnd.xiff":{"source":"iana","extensions":["xif"]},"image/vnd.zbrush.pcx":{"source":"iana","extensions":["pcx"]},"image/webp":{"source":"apache","extensions":["webp"]},"image/wmf":{"source":"iana","extensions":["wmf"]},"image/x-3ds":{"source":"apache","extensions":["3ds"]},"image/x-cmu-raster":{"source":"apache","extensions":["ras"]},"image/x-cmx":{"source":"apache","extensions":["cmx"]},"image/x-freehand":{"source":"apache","extensions":["fh","fhc","fh4","fh5","fh7"]},"image/x-icon":{"source":"apache","compressible":true,"extensions":["ico"]},"image/x-jng":{"source":"nginx","extensions":["jng"]},"image/x-mrsid-image":{"source":"apache","extensions":["sid"]},"image/x-ms-bmp":{"source":"nginx","compressible":true,"extensions":["bmp"]},"image/x-pcx":{"source":"apache","extensions":["pcx"]},"image/x-pict":{"source":"apache","extensions":["pic","pct"]},"image/x-portable-anymap":{"source":"apache","extensions":["pnm"]},"image/x-portable-bitmap":{"source":"apache","extensions":["pbm"]},"image/x-portable-graymap":{"source":"apache","extensions":["pgm"]},"image/x-portable-pixmap":{"source":"apache","extensions":["ppm"]},"image/x-rgb":{"source":"apache","extensions":["rgb"]},"image/x-tga":{"source":"apache","extensions":["tga"]},"image/x-xbitmap":{"source":"apache","extensions":["xbm"]},"image/x-xcf":{"compressible":false},"image/x-xpixmap":{"source":"apache","extensions":["xpm"]},"image/x-xwindowdump":{"source":"apache","extensions":["xwd"]},"message/cpim":{"source":"iana"},"message/delivery-status":{"source":"iana"},"message/disposition-notification":{"source":"iana","extensions":["disposition-notification"]},"message/external-body":{"source":"iana"},"message/feedback-report":{"source":"iana"},"message/global":{"source":"iana","extensions":["u8msg"]},"message/global-delivery-status":{"source":"iana","extensions":["u8dsn"]},"message/global-disposition-notification":{"source":"iana","extensions":["u8mdn"]},"message/global-headers":{"source":"iana","extensions":["u8hdr"]},"message/http":{"source":"iana","compressible":false},"message/imdn+xml":{"source":"iana","compressible":true},"message/news":{"source":"iana"},"message/partial":{"source":"iana","compressible":false},"message/rfc822":{"source":"iana","compressible":true,"extensions":["eml","mime"]},"message/s-http":{"source":"iana"},"message/sip":{"source":"iana"},"message/sipfrag":{"source":"iana"},"message/tracking-status":{"source":"iana"},"message/vnd.si.simp":{"source":"iana"},"message/vnd.wfa.wsc":{"source":"iana","extensions":["wsc"]},"model/3mf":{"source":"iana","extensions":["3mf"]},"model/e57":{"source":"iana"},"model/gltf+json":{"source":"iana","compressible":true,"extensions":["gltf"]},"model/gltf-binary":{"source":"iana","compressible":true,"extensions":["glb"]},"model/iges":{"source":"iana","compressible":false,"extensions":["igs","iges"]},"model/mesh":{"source":"iana","compressible":false,"extensions":["msh","mesh","silo"]},"model/mtl":{"source":"iana","extensions":["mtl"]},"model/obj":{"source":"iana","extensions":["obj"]},"model/step":{"source":"iana"},"model/step+xml":{"source":"iana","compressible":true,"extensions":["stpx"]},"model/step+zip":{"source":"iana","compressible":false,"extensions":["stpz"]},"model/step-xml+zip":{"source":"iana","compressible":false,"extensions":["stpxz"]},"model/stl":{"source":"iana","extensions":["stl"]},"model/vnd.collada+xml":{"source":"iana","compressible":true,"extensions":["dae"]},"model/vnd.dwf":{"source":"iana","extensions":["dwf"]},"model/vnd.flatland.3dml":{"source":"iana"},"model/vnd.gdl":{"source":"iana","extensions":["gdl"]},"model/vnd.gs-gdl":{"source":"apache"},"model/vnd.gs.gdl":{"source":"iana"},"model/vnd.gtw":{"source":"iana","extensions":["gtw"]},"model/vnd.moml+xml":{"source":"iana","compressible":true},"model/vnd.mts":{"source":"iana","extensions":["mts"]},"model/vnd.opengex":{"source":"iana","extensions":["ogex"]},"model/vnd.parasolid.transmit.binary":{"source":"iana","extensions":["x_b"]},"model/vnd.parasolid.transmit.text":{"source":"iana","extensions":["x_t"]},"model/vnd.pytha.pyox":{"source":"iana"},"model/vnd.rosette.annotated-data-model":{"source":"iana"},"model/vnd.sap.vds":{"source":"iana","extensions":["vds"]},"model/vnd.usdz+zip":{"source":"iana","compressible":false,"extensions":["usdz"]},"model/vnd.valve.source.compiled-map":{"source":"iana","extensions":["bsp"]},"model/vnd.vtu":{"source":"iana","extensions":["vtu"]},"model/vrml":{"source":"iana","compressible":false,"extensions":["wrl","vrml"]},"model/x3d+binary":{"source":"apache","compressible":false,"extensions":["x3db","x3dbz"]},"model/x3d+fastinfoset":{"source":"iana","extensions":["x3db"]},"model/x3d+vrml":{"source":"apache","compressible":false,"extensions":["x3dv","x3dvz"]},"model/x3d+xml":{"source":"iana","compressible":true,"extensions":["x3d","x3dz"]},"model/x3d-vrml":{"source":"iana","extensions":["x3dv"]},"multipart/alternative":{"source":"iana","compressible":false},"multipart/appledouble":{"source":"iana"},"multipart/byteranges":{"source":"iana"},"multipart/digest":{"source":"iana"},"multipart/encrypted":{"source":"iana","compressible":false},"multipart/form-data":{"source":"iana","compressible":false},"multipart/header-set":{"source":"iana"},"multipart/mixed":{"source":"iana"},"multipart/multilingual":{"source":"iana"},"multipart/parallel":{"source":"iana"},"multipart/related":{"source":"iana","compressible":false},"multipart/report":{"source":"iana"},"multipart/signed":{"source":"iana","compressible":false},"multipart/vnd.bint.med-plus":{"source":"iana"},"multipart/voice-message":{"source":"iana"},"multipart/x-mixed-replace":{"source":"iana"},"text/1d-interleaved-parityfec":{"source":"iana"},"text/cache-manifest":{"source":"iana","compressible":true,"extensions":["appcache","manifest"]},"text/calendar":{"source":"iana","extensions":["ics","ifb"]},"text/calender":{"compressible":true},"text/cmd":{"compressible":true},"text/coffeescript":{"extensions":["coffee","litcoffee"]},"text/cql":{"source":"iana"},"text/cql-expression":{"source":"iana"},"text/cql-identifier":{"source":"iana"},"text/css":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["css"]},"text/csv":{"source":"iana","compressible":true,"extensions":["csv"]},"text/csv-schema":{"source":"iana"},"text/directory":{"source":"iana"},"text/dns":{"source":"iana"},"text/ecmascript":{"source":"iana"},"text/encaprtp":{"source":"iana"},"text/enriched":{"source":"iana"},"text/fhirpath":{"source":"iana"},"text/flexfec":{"source":"iana"},"text/fwdred":{"source":"iana"},"text/gff3":{"source":"iana"},"text/grammar-ref-list":{"source":"iana"},"text/html":{"source":"iana","compressible":true,"extensions":["html","htm","shtml"]},"text/jade":{"extensions":["jade"]},"text/javascript":{"source":"iana","compressible":true},"text/jcr-cnd":{"source":"iana"},"text/jsx":{"compressible":true,"extensions":["jsx"]},"text/less":{"compressible":true,"extensions":["less"]},"text/markdown":{"source":"iana","compressible":true,"extensions":["markdown","md"]},"text/mathml":{"source":"nginx","extensions":["mml"]},"text/mdx":{"compressible":true,"extensions":["mdx"]},"text/mizar":{"source":"iana"},"text/n3":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["n3"]},"text/parameters":{"source":"iana","charset":"UTF-8"},"text/parityfec":{"source":"iana"},"text/plain":{"source":"iana","compressible":true,"extensions":["txt","text","conf","def","list","log","in","ini"]},"text/provenance-notation":{"source":"iana","charset":"UTF-8"},"text/prs.fallenstein.rst":{"source":"iana"},"text/prs.lines.tag":{"source":"iana","extensions":["dsc"]},"text/prs.prop.logic":{"source":"iana"},"text/raptorfec":{"source":"iana"},"text/red":{"source":"iana"},"text/rfc822-headers":{"source":"iana"},"text/richtext":{"source":"iana","compressible":true,"extensions":["rtx"]},"text/rtf":{"source":"iana","compressible":true,"extensions":["rtf"]},"text/rtp-enc-aescm128":{"source":"iana"},"text/rtploopback":{"source":"iana"},"text/rtx":{"source":"iana"},"text/sgml":{"source":"iana","extensions":["sgml","sgm"]},"text/shaclc":{"source":"iana"},"text/shex":{"source":"iana","extensions":["shex"]},"text/slim":{"extensions":["slim","slm"]},"text/spdx":{"source":"iana","extensions":["spdx"]},"text/strings":{"source":"iana"},"text/stylus":{"extensions":["stylus","styl"]},"text/t140":{"source":"iana"},"text/tab-separated-values":{"source":"iana","compressible":true,"extensions":["tsv"]},"text/troff":{"source":"iana","extensions":["t","tr","roff","man","me","ms"]},"text/turtle":{"source":"iana","charset":"UTF-8","extensions":["ttl"]},"text/ulpfec":{"source":"iana"},"text/uri-list":{"source":"iana","compressible":true,"extensions":["uri","uris","urls"]},"text/vcard":{"source":"iana","compressible":true,"extensions":["vcard"]},"text/vnd.a":{"source":"iana"},"text/vnd.abc":{"source":"iana"},"text/vnd.ascii-art":{"source":"iana"},"text/vnd.curl":{"source":"iana","extensions":["curl"]},"text/vnd.curl.dcurl":{"source":"apache","extensions":["dcurl"]},"text/vnd.curl.mcurl":{"source":"apache","extensions":["mcurl"]},"text/vnd.curl.scurl":{"source":"apache","extensions":["scurl"]},"text/vnd.debian.copyright":{"source":"iana","charset":"UTF-8"},"text/vnd.dmclientscript":{"source":"iana"},"text/vnd.dvb.subtitle":{"source":"iana","extensions":["sub"]},"text/vnd.esmertec.theme-descriptor":{"source":"iana","charset":"UTF-8"},"text/vnd.familysearch.gedcom":{"source":"iana","extensions":["ged"]},"text/vnd.ficlab.flt":{"source":"iana"},"text/vnd.fly":{"source":"iana","extensions":["fly"]},"text/vnd.fmi.flexstor":{"source":"iana","extensions":["flx"]},"text/vnd.gml":{"source":"iana"},"text/vnd.graphviz":{"source":"iana","extensions":["gv"]},"text/vnd.hans":{"source":"iana"},"text/vnd.hgl":{"source":"iana"},"text/vnd.in3d.3dml":{"source":"iana","extensions":["3dml"]},"text/vnd.in3d.spot":{"source":"iana","extensions":["spot"]},"text/vnd.iptc.newsml":{"source":"iana"},"text/vnd.iptc.nitf":{"source":"iana"},"text/vnd.latex-z":{"source":"iana"},"text/vnd.motorola.reflex":{"source":"iana"},"text/vnd.ms-mediapackage":{"source":"iana"},"text/vnd.net2phone.commcenter.command":{"source":"iana"},"text/vnd.radisys.msml-basic-layout":{"source":"iana"},"text/vnd.senx.warpscript":{"source":"iana"},"text/vnd.si.uricatalogue":{"source":"iana"},"text/vnd.sosi":{"source":"iana"},"text/vnd.sun.j2me.app-descriptor":{"source":"iana","charset":"UTF-8","extensions":["jad"]},"text/vnd.trolltech.linguist":{"source":"iana","charset":"UTF-8"},"text/vnd.wap.si":{"source":"iana"},"text/vnd.wap.sl":{"source":"iana"},"text/vnd.wap.wml":{"source":"iana","extensions":["wml"]},"text/vnd.wap.wmlscript":{"source":"iana","extensions":["wmls"]},"text/vtt":{"source":"iana","charset":"UTF-8","compressible":true,"extensions":["vtt"]},"text/x-asm":{"source":"apache","extensions":["s","asm"]},"text/x-c":{"source":"apache","extensions":["c","cc","cxx","cpp","h","hh","dic"]},"text/x-component":{"source":"nginx","extensions":["htc"]},"text/x-fortran":{"source":"apache","extensions":["f","for","f77","f90"]},"text/x-gwt-rpc":{"compressible":true},"text/x-handlebars-template":{"extensions":["hbs"]},"text/x-java-source":{"source":"apache","extensions":["java"]},"text/x-jquery-tmpl":{"compressible":true},"text/x-lua":{"extensions":["lua"]},"text/x-markdown":{"compressible":true,"extensions":["mkd"]},"text/x-nfo":{"source":"apache","extensions":["nfo"]},"text/x-opml":{"source":"apache","extensions":["opml"]},"text/x-org":{"compressible":true,"extensions":["org"]},"text/x-pascal":{"source":"apache","extensions":["p","pas"]},"text/x-processing":{"compressible":true,"extensions":["pde"]},"text/x-sass":{"extensions":["sass"]},"text/x-scss":{"extensions":["scss"]},"text/x-setext":{"source":"apache","extensions":["etx"]},"text/x-sfv":{"source":"apache","extensions":["sfv"]},"text/x-suse-ymp":{"compressible":true,"extensions":["ymp"]},"text/x-uuencode":{"source":"apache","extensions":["uu"]},"text/x-vcalendar":{"source":"apache","extensions":["vcs"]},"text/x-vcard":{"source":"apache","extensions":["vcf"]},"text/xml":{"source":"iana","compressible":true,"extensions":["xml"]},"text/xml-external-parsed-entity":{"source":"iana"},"text/yaml":{"compressible":true,"extensions":["yaml","yml"]},"video/1d-interleaved-parityfec":{"source":"iana"},"video/3gpp":{"source":"iana","extensions":["3gp","3gpp"]},"video/3gpp-tt":{"source":"iana"},"video/3gpp2":{"source":"iana","extensions":["3g2"]},"video/av1":{"source":"iana"},"video/bmpeg":{"source":"iana"},"video/bt656":{"source":"iana"},"video/celb":{"source":"iana"},"video/dv":{"source":"iana"},"video/encaprtp":{"source":"iana"},"video/ffv1":{"source":"iana"},"video/flexfec":{"source":"iana"},"video/h261":{"source":"iana","extensions":["h261"]},"video/h263":{"source":"iana","extensions":["h263"]},"video/h263-1998":{"source":"iana"},"video/h263-2000":{"source":"iana"},"video/h264":{"source":"iana","extensions":["h264"]},"video/h264-rcdo":{"source":"iana"},"video/h264-svc":{"source":"iana"},"video/h265":{"source":"iana"},"video/iso.segment":{"source":"iana","extensions":["m4s"]},"video/jpeg":{"source":"iana","extensions":["jpgv"]},"video/jpeg2000":{"source":"iana"},"video/jpm":{"source":"apache","extensions":["jpm","jpgm"]},"video/jxsv":{"source":"iana"},"video/mj2":{"source":"iana","extensions":["mj2","mjp2"]},"video/mp1s":{"source":"iana"},"video/mp2p":{"source":"iana"},"video/mp2t":{"source":"iana","extensions":["ts"]},"video/mp4":{"source":"iana","compressible":false,"extensions":["mp4","mp4v","mpg4"]},"video/mp4v-es":{"source":"iana"},"video/mpeg":{"source":"iana","compressible":false,"extensions":["mpeg","mpg","mpe","m1v","m2v"]},"video/mpeg4-generic":{"source":"iana"},"video/mpv":{"source":"iana"},"video/nv":{"source":"iana"},"video/ogg":{"source":"iana","compressible":false,"extensions":["ogv"]},"video/parityfec":{"source":"iana"},"video/pointer":{"source":"iana"},"video/quicktime":{"source":"iana","compressible":false,"extensions":["qt","mov"]},"video/raptorfec":{"source":"iana"},"video/raw":{"source":"iana"},"video/rtp-enc-aescm128":{"source":"iana"},"video/rtploopback":{"source":"iana"},"video/rtx":{"source":"iana"},"video/scip":{"source":"iana"},"video/smpte291":{"source":"iana"},"video/smpte292m":{"source":"iana"},"video/ulpfec":{"source":"iana"},"video/vc1":{"source":"iana"},"video/vc2":{"source":"iana"},"video/vnd.cctv":{"source":"iana"},"video/vnd.dece.hd":{"source":"iana","extensions":["uvh","uvvh"]},"video/vnd.dece.mobile":{"source":"iana","extensions":["uvm","uvvm"]},"video/vnd.dece.mp4":{"source":"iana"},"video/vnd.dece.pd":{"source":"iana","extensions":["uvp","uvvp"]},"video/vnd.dece.sd":{"source":"iana","extensions":["uvs","uvvs"]},"video/vnd.dece.video":{"source":"iana","extensions":["uvv","uvvv"]},"video/vnd.directv.mpeg":{"source":"iana"},"video/vnd.directv.mpeg-tts":{"source":"iana"},"video/vnd.dlna.mpeg-tts":{"source":"iana"},"video/vnd.dvb.file":{"source":"iana","extensions":["dvb"]},"video/vnd.fvt":{"source":"iana","extensions":["fvt"]},"video/vnd.hns.video":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.1dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-1010":{"source":"iana"},"video/vnd.iptvforum.2dparityfec-2005":{"source":"iana"},"video/vnd.iptvforum.ttsavc":{"source":"iana"},"video/vnd.iptvforum.ttsmpeg2":{"source":"iana"},"video/vnd.motorola.video":{"source":"iana"},"video/vnd.motorola.videop":{"source":"iana"},"video/vnd.mpegurl":{"source":"iana","extensions":["mxu","m4u"]},"video/vnd.ms-playready.media.pyv":{"source":"iana","extensions":["pyv"]},"video/vnd.nokia.interleaved-multimedia":{"source":"iana"},"video/vnd.nokia.mp4vr":{"source":"iana"},"video/vnd.nokia.videovoip":{"source":"iana"},"video/vnd.objectvideo":{"source":"iana"},"video/vnd.radgamettools.bink":{"source":"iana"},"video/vnd.radgamettools.smacker":{"source":"iana"},"video/vnd.sealed.mpeg1":{"source":"iana"},"video/vnd.sealed.mpeg4":{"source":"iana"},"video/vnd.sealed.swf":{"source":"iana"},"video/vnd.sealedmedia.softseal.mov":{"source":"iana"},"video/vnd.uvvu.mp4":{"source":"iana","extensions":["uvu","uvvu"]},"video/vnd.vivo":{"source":"iana","extensions":["viv"]},"video/vnd.youtube.yt":{"source":"iana"},"video/vp8":{"source":"iana"},"video/vp9":{"source":"iana"},"video/webm":{"source":"apache","compressible":false,"extensions":["webm"]},"video/x-f4v":{"source":"apache","extensions":["f4v"]},"video/x-fli":{"source":"apache","extensions":["fli"]},"video/x-flv":{"source":"apache","compressible":false,"extensions":["flv"]},"video/x-m4v":{"source":"apache","extensions":["m4v"]},"video/x-matroska":{"source":"apache","compressible":false,"extensions":["mkv","mk3d","mks"]},"video/x-mng":{"source":"apache","extensions":["mng"]},"video/x-ms-asf":{"source":"apache","extensions":["asf","asx"]},"video/x-ms-vob":{"source":"apache","extensions":["vob"]},"video/x-ms-wm":{"source":"apache","extensions":["wm"]},"video/x-ms-wmv":{"source":"apache","compressible":false,"extensions":["wmv"]},"video/x-ms-wmx":{"source":"apache","extensions":["wmx"]},"video/x-ms-wvx":{"source":"apache","extensions":["wvx"]},"video/x-msvideo":{"source":"apache","extensions":["avi"]},"video/x-sgi-movie":{"source":"apache","extensions":["movie"]},"video/x-smv":{"source":"apache","extensions":["smv"]},"x-conference/x-cooltalk":{"source":"apache","extensions":["ice"]},"x-shader/x-fragment":{"compressible":true},"x-shader/x-vertex":{"compressible":true}}');

/***/ }),

/***/ 67891:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"openid-client","version":"5.6.1","description":"OpenID Connect Relying Party (RP, Client) implementation for Node.js runtime, supports passportjs","keywords":["auth","authentication","basic","certified","client","connect","dynamic","electron","hybrid","identity","implicit","oauth","oauth2","oidc","openid","passport","relying party","strategy"],"homepage":"https://github.com/panva/node-openid-client","repository":"panva/node-openid-client","funding":{"url":"https://github.com/sponsors/panva"},"license":"MIT","author":"Filip Skokan <panva.ip@gmail.com>","exports":{"types":"./types/index.d.ts","import":"./lib/index.mjs","require":"./lib/index.js"},"main":"./lib/index.js","types":"./types/index.d.ts","files":["lib","types/index.d.ts"],"scripts":{"format":"npx prettier --loglevel silent --write ./lib ./test ./certification ./types","test":"mocha test/**/*.test.js"},"dependencies":{"jose":"^4.15.1","lru-cache":"^6.0.0","object-hash":"^2.2.0","oidc-token-hash":"^5.0.3"},"devDependencies":{"@types/node":"^16.18.55","@types/passport":"^1.0.13","base64url":"^3.0.1","chai":"^4.3.10","mocha":"^10.2.0","nock":"^13.3.3","prettier":"^2.8.8","readable-mock-req":"^0.2.2","sinon":"^9.2.4","timekeeper":"^2.3.1"},"standard-version":{"scripts":{"postchangelog":"sed -i \'\' -e \'s/### \\\\[/## [/g\' CHANGELOG.md"},"types":[{"type":"feat","section":"Features"},{"type":"fix","section":"Fixes"},{"type":"chore","hidden":true},{"type":"docs","hidden":true},{"type":"style","hidden":true},{"type":"refactor","section":"Refactor","hidden":false},{"type":"perf","section":"Performance","hidden":false},{"type":"test","hidden":true}]}}');

/***/ })

};
;