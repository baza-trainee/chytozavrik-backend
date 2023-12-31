"use strict";
exports.id = 5522;
exports.ids = [5522];
exports.modules = {

/***/ 59087:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   c: () => (/* binding */ InfiniteQueryObserver)
/* harmony export */ });
/* harmony import */ var _queryObserver_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(35426);
/* harmony import */ var _infiniteQueryBehavior_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(74683);
// src/infiniteQueryObserver.ts


var InfiniteQueryObserver = class extends _queryObserver_js__WEBPACK_IMPORTED_MODULE_0__/* .QueryObserver */ .z {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(client, options) {
    super(client, options);
  }
  bindMethods() {
    super.bindMethods();
    this.fetchNextPage = this.fetchNextPage.bind(this);
    this.fetchPreviousPage = this.fetchPreviousPage.bind(this);
  }
  setOptions(options, notifyOptions) {
    super.setOptions(
      {
        ...options,
        behavior: (0,_infiniteQueryBehavior_js__WEBPACK_IMPORTED_MODULE_1__/* .infiniteQueryBehavior */ .Gm)()
      },
      notifyOptions
    );
  }
  getOptimisticResult(options) {
    options.behavior = (0,_infiniteQueryBehavior_js__WEBPACK_IMPORTED_MODULE_1__/* .infiniteQueryBehavior */ .Gm)();
    return super.getOptimisticResult(options);
  }
  fetchNextPage(options) {
    return this.fetch({
      ...options,
      meta: {
        fetchMore: { direction: "forward" }
      }
    });
  }
  fetchPreviousPage(options) {
    return this.fetch({
      ...options,
      meta: {
        fetchMore: { direction: "backward" }
      }
    });
  }
  createResult(query, options) {
    const { state } = query;
    const result = super.createResult(query, options);
    const { isFetching, isRefetching } = result;
    const isFetchingNextPage = isFetching && state.fetchMeta?.fetchMore?.direction === "forward";
    const isFetchingPreviousPage = isFetching && state.fetchMeta?.fetchMore?.direction === "backward";
    return {
      ...result,
      fetchNextPage: this.fetchNextPage,
      fetchPreviousPage: this.fetchPreviousPage,
      hasNextPage: (0,_infiniteQueryBehavior_js__WEBPACK_IMPORTED_MODULE_1__/* .hasNextPage */ .Qy)(options, state.data),
      hasPreviousPage: (0,_infiniteQueryBehavior_js__WEBPACK_IMPORTED_MODULE_1__/* .hasPreviousPage */ .ZF)(options, state.data),
      isFetchingNextPage,
      isFetchingPreviousPage,
      isRefetching: isRefetching && !isFetchingNextPage && !isFetchingPreviousPage
    };
  }
};

//# sourceMappingURL=infiniteQueryObserver.js.map

/***/ }),

/***/ 42404:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  HydrationBoundary: () => (/* binding */ HydrationBoundary)
});

// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/hydration.js
// src/hydration.ts
function dehydrateMutation(mutation) {
  return {
    mutationKey: mutation.options.mutationKey,
    state: mutation.state,
    ...mutation.meta && { meta: mutation.meta }
  };
}
function dehydrateQuery(query) {
  return {
    state: query.state,
    queryKey: query.queryKey,
    queryHash: query.queryHash,
    ...query.meta && { meta: query.meta }
  };
}
function defaultShouldDehydrateMutation(mutation) {
  return mutation.state.isPaused;
}
function defaultShouldDehydrateQuery(query) {
  return query.state.status === "success";
}
function dehydrate(client, options = {}) {
  const filterMutation = options.shouldDehydrateMutation ?? defaultShouldDehydrateMutation;
  const mutations = client.getMutationCache().getAll().flatMap(
    (mutation) => filterMutation(mutation) ? [dehydrateMutation(mutation)] : []
  );
  const filterQuery = options.shouldDehydrateQuery ?? defaultShouldDehydrateQuery;
  const queries = client.getQueryCache().getAll().flatMap((query) => filterQuery(query) ? [dehydrateQuery(query)] : []);
  return { mutations, queries };
}
function hydrate(client, dehydratedState, options) {
  if (typeof dehydratedState !== "object" || dehydratedState === null) {
    return;
  }
  const mutationCache = client.getMutationCache();
  const queryCache = client.getQueryCache();
  const mutations = dehydratedState.mutations || [];
  const queries = dehydratedState.queries || [];
  mutations.forEach((dehydratedMutation) => {
    mutationCache.build(
      client,
      {
        ...options?.defaultOptions?.mutations,
        mutationKey: dehydratedMutation.mutationKey,
        meta: dehydratedMutation.meta
      },
      dehydratedMutation.state
    );
  });
  queries.forEach(({ queryKey, state, queryHash, meta }) => {
    const query = queryCache.get(queryHash);
    if (query) {
      if (query.state.dataUpdatedAt < state.dataUpdatedAt) {
        const { fetchStatus: _ignored, ...dehydratedQueryState } = state;
        query.setState(dehydratedQueryState);
      }
      return;
    }
    queryCache.build(
      client,
      {
        ...options?.defaultOptions?.queries,
        queryKey,
        queryHash,
        meta
      },
      // Reset fetch status to idle to avoid
      // query being stuck in fetching state upon hydration
      {
        ...state,
        fetchStatus: "idle"
      }
    );
  });
}

//# sourceMappingURL=hydration.js.map
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js
var QueryClientProvider = __webpack_require__(32770);
;// CONCATENATED MODULE: ./node_modules/@tanstack/react-query/build/modern/HydrationBoundary.js
"use client";

// src/HydrationBoundary.tsx



var HydrationBoundary = ({
  children,
  options = {},
  state,
  queryClient
}) => {
  const client = (0,QueryClientProvider.useQueryClient)(queryClient);
  const [hydrationQueue, setHydrationQueue] = react_.useState();
  const optionsRef = react_.useRef(options);
  optionsRef.current = options;
  react_.useMemo(() => {
    if (state) {
      if (typeof state !== "object") {
        return;
      }
      const queryCache = client.getQueryCache();
      const queries = state.queries || [];
      const newQueries = [];
      const existingQueries = [];
      for (const dehydratedQuery of queries) {
        const existingQuery = queryCache.get(dehydratedQuery.queryHash);
        if (!existingQuery) {
          newQueries.push(dehydratedQuery);
        } else {
          const hydrationIsNewer = dehydratedQuery.state.dataUpdatedAt > existingQuery.state.dataUpdatedAt;
          const queryAlreadyQueued = hydrationQueue?.find(
            (query) => query.queryHash === dehydratedQuery.queryHash
          );
          if (hydrationIsNewer && (!queryAlreadyQueued || dehydratedQuery.state.dataUpdatedAt > queryAlreadyQueued.state.dataUpdatedAt)) {
            existingQueries.push(dehydratedQuery);
          }
        }
      }
      if (newQueries.length > 0) {
        hydrate(client, { queries: newQueries }, optionsRef.current);
      }
      if (existingQueries.length > 0) {
        setHydrationQueue(
          (prev) => prev ? [...prev, ...existingQueries] : existingQueries
        );
      }
    }
  }, [client, hydrationQueue, state]);
  react_.useEffect(() => {
    if (hydrationQueue) {
      hydrate(client, { queries: hydrationQueue }, optionsRef.current);
      setHydrationQueue(void 0);
    }
  }, [client, hydrationQueue]);
  return children;
};

//# sourceMappingURL=HydrationBoundary.js.map

/***/ }),

/***/ 74208:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useInfiniteQuery: () => (/* binding */ useInfiniteQuery)
/* harmony export */ });
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(59087);
/* harmony import */ var _useBaseQuery_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(73605);
"use client";

// src/useInfiniteQuery.ts


function useInfiniteQuery(options, queryClient) {
  return (0,_useBaseQuery_js__WEBPACK_IMPORTED_MODULE_0__/* .useBaseQuery */ .r)(
    options,
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    _tanstack_query_core__WEBPACK_IMPORTED_MODULE_1__/* .InfiniteQueryObserver */ .c,
    queryClient
  );
}

//# sourceMappingURL=useInfiniteQuery.js.map

/***/ }),

/***/ 35325:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useIsFetching: () => (/* binding */ useIsFetching)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5149);
/* harmony import */ var _QueryClientProvider_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(32770);
"use client";

// src/useIsFetching.ts



function useIsFetching(filters, queryClient) {
  const client = (0,_QueryClientProvider_js__WEBPACK_IMPORTED_MODULE_1__.useQueryClient)(queryClient);
  const queryCache = client.getQueryCache();
  return react__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore(
    react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
      (onStoreChange) => queryCache.subscribe(_tanstack_query_core__WEBPACK_IMPORTED_MODULE_2__/* .notifyManager */ .V.batchCalls(onStoreChange)),
      [queryCache]
    ),
    () => client.isFetching(filters),
    () => client.isFetching(filters)
  );
}

//# sourceMappingURL=useIsFetching.js.map

/***/ }),

/***/ 15085:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useIsMutating: () => (/* binding */ useIsMutating),
/* harmony export */   useMutationState: () => (/* binding */ useMutationState)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(18038);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(80629);
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(5149);
/* harmony import */ var _QueryClientProvider_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(32770);
"use client";

// src/useMutationState.ts



function useIsMutating(filters, queryClient) {
  const client = (0,_QueryClientProvider_js__WEBPACK_IMPORTED_MODULE_1__.useQueryClient)(queryClient);
  return useMutationState(
    { filters: { ...filters, status: "pending" } },
    client
  ).length;
}
function getResult(mutationCache, options) {
  return mutationCache.findAll(options.filters).map(
    (mutation) => options.select ? options.select(
      mutation
    ) : mutation.state
  );
}
function useMutationState(options = {}, queryClient) {
  const mutationCache = (0,_QueryClientProvider_js__WEBPACK_IMPORTED_MODULE_1__.useQueryClient)(queryClient).getMutationCache();
  const optionsRef = react__WEBPACK_IMPORTED_MODULE_0__.useRef(options);
  const result = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
  if (!result.current) {
    result.current = getResult(mutationCache, options);
  }
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    optionsRef.current = options;
  });
  return react__WEBPACK_IMPORTED_MODULE_0__.useSyncExternalStore(
    react__WEBPACK_IMPORTED_MODULE_0__.useCallback(
      (onStoreChange) => mutationCache.subscribe(() => {
        const nextResult = (0,_tanstack_query_core__WEBPACK_IMPORTED_MODULE_2__/* .replaceEqualDeep */ .Q$)(
          result.current,
          getResult(mutationCache, optionsRef.current)
        );
        if (result.current !== nextResult) {
          result.current = nextResult;
          _tanstack_query_core__WEBPACK_IMPORTED_MODULE_3__/* .notifyManager */ .V.schedule(onStoreChange);
        }
      }),
      [mutationCache]
    ),
    () => result.current,
    () => result.current
  );
}

//# sourceMappingURL=useMutationState.js.map

/***/ }),

/***/ 35670:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  useQueries: () => (/* binding */ useQueries)
});

// EXTERNAL MODULE: external "next/dist/compiled/react"
var react_ = __webpack_require__(18038);
// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/modern/notifyManager.js
var notifyManager = __webpack_require__(5149);
// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/modern/queryObserver.js
var modern_queryObserver = __webpack_require__(35426);
// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/modern/subscribable.js
var subscribable = __webpack_require__(64124);
// EXTERNAL MODULE: ./node_modules/@tanstack/query-core/build/modern/utils.js
var utils = __webpack_require__(80629);
;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/queriesObserver.js
// src/queriesObserver.ts




function difference(array1, array2) {
  return array1.filter((x) => !array2.includes(x));
}
function replaceAt(array, index, value) {
  const copy = array.slice(0);
  copy[index] = value;
  return copy;
}
var QueriesObserver = class extends subscribable/* Subscribable */.l {
  #client;
  #result;
  #queries;
  #observers;
  #options;
  #combinedResult;
  constructor(client, queries, options) {
    super();
    this.#client = client;
    this.#queries = queries;
    this.#options = options;
    this.#observers = [];
    this.#setResult([]);
    this.setQueries(queries, options);
  }
  #setResult(value) {
    this.#result = value;
    this.#combinedResult = this.#combineResult(value);
  }
  onSubscribe() {
    if (this.listeners.size === 1) {
      this.#observers.forEach((observer) => {
        observer.subscribe((result) => {
          this.#onUpdate(observer, result);
        });
      });
    }
  }
  onUnsubscribe() {
    if (!this.listeners.size) {
      this.destroy();
    }
  }
  destroy() {
    this.listeners = /* @__PURE__ */ new Set();
    this.#observers.forEach((observer) => {
      observer.destroy();
    });
  }
  setQueries(queries, options, notifyOptions) {
    this.#queries = queries;
    this.#options = options;
    notifyManager/* notifyManager */.V.batch(() => {
      const prevObservers = this.#observers;
      const newObserverMatches = this.#findMatchingObservers(this.#queries);
      newObserverMatches.forEach(
        (match) => match.observer.setOptions(match.defaultedQueryOptions, notifyOptions)
      );
      const newObservers = newObserverMatches.map((match) => match.observer);
      const newResult = newObservers.map(
        (observer) => observer.getCurrentResult()
      );
      const hasIndexChange = newObservers.some(
        (observer, index) => observer !== prevObservers[index]
      );
      if (prevObservers.length === newObservers.length && !hasIndexChange) {
        return;
      }
      this.#observers = newObservers;
      this.#setResult(newResult);
      if (!this.hasListeners()) {
        return;
      }
      difference(prevObservers, newObservers).forEach((observer) => {
        observer.destroy();
      });
      difference(newObservers, prevObservers).forEach((observer) => {
        observer.subscribe((result) => {
          this.#onUpdate(observer, result);
        });
      });
      this.#notify();
    });
  }
  getCurrentResult() {
    return this.#combinedResult;
  }
  getQueries() {
    return this.#observers.map((observer) => observer.getCurrentQuery());
  }
  getObservers() {
    return this.#observers;
  }
  getOptimisticResult(queries) {
    const matches = this.#findMatchingObservers(queries);
    const result = matches.map(
      (match) => match.observer.getOptimisticResult(match.defaultedQueryOptions)
    );
    return [
      result,
      (r) => {
        return this.#combineResult(r ?? result);
      },
      () => {
        return matches.map((match, index) => {
          const observerResult = result[index];
          return !match.defaultedQueryOptions.notifyOnChangeProps ? match.observer.trackResult(observerResult) : observerResult;
        });
      }
    ];
  }
  #combineResult(input) {
    const combine = this.#options?.combine;
    if (combine) {
      return (0,utils/* replaceEqualDeep */.Q$)(this.#combinedResult, combine(input));
    }
    return input;
  }
  #findMatchingObservers(queries) {
    const prevObservers = this.#observers;
    const prevObserversMap = new Map(
      prevObservers.map((observer) => [observer.options.queryHash, observer])
    );
    const defaultedQueryOptions = queries.map(
      (options) => this.#client.defaultQueryOptions(options)
    );
    const matchingObservers = defaultedQueryOptions.flatMap((defaultedOptions) => {
      const match = prevObserversMap.get(defaultedOptions.queryHash);
      if (match != null) {
        return [{ defaultedQueryOptions: defaultedOptions, observer: match }];
      }
      return [];
    });
    const matchedQueryHashes = new Set(
      matchingObservers.map((match) => match.defaultedQueryOptions.queryHash)
    );
    const unmatchedQueries = defaultedQueryOptions.filter(
      (defaultedOptions) => !matchedQueryHashes.has(defaultedOptions.queryHash)
    );
    const getObserver = (options) => {
      const defaultedOptions = this.#client.defaultQueryOptions(options);
      const currentObserver = this.#observers.find(
        (o) => o.options.queryHash === defaultedOptions.queryHash
      );
      return currentObserver ?? new modern_queryObserver/* QueryObserver */.z(this.#client, defaultedOptions);
    };
    const newOrReusedObservers = unmatchedQueries.map((options) => {
      return {
        defaultedQueryOptions: options,
        observer: getObserver(options)
      };
    });
    const sortMatchesByOrderOfQueries = (a, b) => defaultedQueryOptions.indexOf(a.defaultedQueryOptions) - defaultedQueryOptions.indexOf(b.defaultedQueryOptions);
    return matchingObservers.concat(newOrReusedObservers).sort(sortMatchesByOrderOfQueries);
  }
  #onUpdate(observer, result) {
    const index = this.#observers.indexOf(observer);
    if (index !== -1) {
      this.#setResult(replaceAt(this.#result, index, result));
      this.#notify();
    }
  }
  #notify() {
    notifyManager/* notifyManager */.V.batch(() => {
      this.listeners.forEach((listener) => {
        listener(this.#result);
      });
    });
  }
};

//# sourceMappingURL=queriesObserver.js.map
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js
var QueryClientProvider = __webpack_require__(32770);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/isRestoring.js
var modern_isRestoring = __webpack_require__(36955);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/QueryErrorResetBoundary.js
var QueryErrorResetBoundary = __webpack_require__(3233);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/errorBoundaryUtils.js
var errorBoundaryUtils = __webpack_require__(60604);
// EXTERNAL MODULE: ./node_modules/@tanstack/react-query/build/modern/suspense.js
var suspense = __webpack_require__(67652);
;// CONCATENATED MODULE: ./node_modules/@tanstack/react-query/build/modern/useQueries.js
"use client";

// src/useQueries.ts







function useQueries({
  queries,
  ...options
}, queryClient) {
  const client = (0,QueryClientProvider.useQueryClient)(queryClient);
  const isRestoring = (0,modern_isRestoring.useIsRestoring)();
  const errorResetBoundary = (0,QueryErrorResetBoundary.useQueryErrorResetBoundary)();
  const defaultedQueries = react_.useMemo(
    () => queries.map((opts) => {
      const defaultedOptions = client.defaultQueryOptions(opts);
      defaultedOptions._optimisticResults = isRestoring ? "isRestoring" : "optimistic";
      return defaultedOptions;
    }),
    [queries, client, isRestoring]
  );
  defaultedQueries.forEach((query) => {
    (0,suspense/* ensureStaleTime */.Fb)(query);
    (0,errorBoundaryUtils/* ensurePreventErrorBoundaryRetry */.pf)(query, errorResetBoundary);
  });
  (0,errorBoundaryUtils/* useClearResetErrorBoundary */.JN)(errorResetBoundary);
  const [observer] = react_.useState(
    () => new QueriesObserver(
      client,
      defaultedQueries,
      options
    )
  );
  const [optimisticResult, getCombinedResult, trackResult] = observer.getOptimisticResult(defaultedQueries);
  react_.useSyncExternalStore(
    react_.useCallback(
      (onStoreChange) => isRestoring ? () => void 0 : observer.subscribe(notifyManager/* notifyManager */.V.batchCalls(onStoreChange)),
      [observer, isRestoring]
    ),
    () => observer.getCurrentResult(),
    () => observer.getCurrentResult()
  );
  react_.useEffect(() => {
    observer.setQueries(
      defaultedQueries,
      options,
      {
        listeners: false
      }
    );
  }, [defaultedQueries, options, observer]);
  const shouldAtLeastOneSuspend = optimisticResult.some(
    (result, index) => (0,suspense/* shouldSuspend */.SB)(defaultedQueries[index], result)
  );
  const suspensePromises = shouldAtLeastOneSuspend ? optimisticResult.flatMap((result, index) => {
    const opts = defaultedQueries[index];
    if (opts) {
      const queryObserver = new modern_queryObserver/* QueryObserver */.z(client, opts);
      if ((0,suspense/* shouldSuspend */.SB)(opts, result)) {
        return (0,suspense/* fetchOptimistic */.j8)(opts, queryObserver, errorResetBoundary);
      } else if ((0,suspense/* willFetch */.Z$)(result, isRestoring)) {
        void (0,suspense/* fetchOptimistic */.j8)(opts, queryObserver, errorResetBoundary);
      }
    }
    return [];
  }) : [];
  if (suspensePromises.length > 0) {
    observer.setQueries(
      defaultedQueries,
      options,
      {
        listeners: false
      }
    );
    throw Promise.all(suspensePromises);
  }
  const observerQueries = observer.getQueries();
  const firstSingleResultWhichShouldThrow = optimisticResult.find(
    (result, index) => (0,errorBoundaryUtils/* getHasError */.KJ)({
      result,
      errorResetBoundary,
      throwOnError: defaultedQueries[index]?.throwOnError ?? false,
      query: observerQueries[index]
    })
  );
  if (firstSingleResultWhichShouldThrow?.error) {
    throw firstSingleResultWhichShouldThrow.error;
  }
  return getCombinedResult(trackResult());
}

//# sourceMappingURL=useQueries.js.map

/***/ }),

/***/ 2525:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useSuspenseInfiniteQuery: () => (/* binding */ useSuspenseInfiniteQuery)
/* harmony export */ });
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(59087);
/* harmony import */ var _useBaseQuery_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(73605);
/* harmony import */ var _suspense_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67652);
"use client";

// src/useSuspenseInfiniteQuery.ts



function useSuspenseInfiniteQuery(options, queryClient) {
  return (0,_useBaseQuery_js__WEBPACK_IMPORTED_MODULE_0__/* .useBaseQuery */ .r)(
    {
      ...options,
      enabled: true,
      suspense: true,
      throwOnError: _suspense_js__WEBPACK_IMPORTED_MODULE_1__/* .defaultThrowOnError */ .Ct
    },
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    _tanstack_query_core__WEBPACK_IMPORTED_MODULE_2__/* .InfiniteQueryObserver */ .c,
    queryClient
  );
}

//# sourceMappingURL=useSuspenseInfiniteQuery.js.map

/***/ }),

/***/ 92619:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useSuspenseQueries: () => (/* binding */ useSuspenseQueries)
/* harmony export */ });
/* harmony import */ var _useQueries_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(35670);
/* harmony import */ var _suspense_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67652);
"use client";

// src/useSuspenseQueries.ts


function useSuspenseQueries(options, queryClient) {
  return (0,_useQueries_js__WEBPACK_IMPORTED_MODULE_0__.useQueries)(
    {
      ...options,
      queries: options.queries.map((query) => ({
        ...query,
        suspense: true,
        throwOnError: _suspense_js__WEBPACK_IMPORTED_MODULE_1__/* .defaultThrowOnError */ .Ct,
        enabled: true
      }))
    },
    queryClient
  );
}

//# sourceMappingURL=useSuspenseQueries.js.map

/***/ }),

/***/ 46547:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useSuspenseQuery: () => (/* binding */ useSuspenseQuery)
/* harmony export */ });
/* harmony import */ var _tanstack_query_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(35426);
/* harmony import */ var _useBaseQuery_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(73605);
/* harmony import */ var _suspense_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67652);
"use client";

// src/useSuspenseQuery.ts



function useSuspenseQuery(options, queryClient) {
  return (0,_useBaseQuery_js__WEBPACK_IMPORTED_MODULE_0__/* .useBaseQuery */ .r)(
    {
      ...options,
      enabled: true,
      suspense: true,
      throwOnError: _suspense_js__WEBPACK_IMPORTED_MODULE_1__/* .defaultThrowOnError */ .Ct
    },
    _tanstack_query_core__WEBPACK_IMPORTED_MODULE_2__/* .QueryObserver */ .z,
    queryClient
  );
}

//# sourceMappingURL=useSuspenseQuery.js.map

/***/ }),

/***/ 1849:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   D: () => (/* binding */ dehydrate)
/* harmony export */ });
/* unused harmony exports defaultShouldDehydrateMutation, defaultShouldDehydrateQuery, hydrate */
// src/hydration.ts
function dehydrateMutation(mutation) {
    return {
        mutationKey: mutation.options.mutationKey,
        state: mutation.state,
        ...mutation.meta && {
            meta: mutation.meta
        }
    };
}
function dehydrateQuery(query) {
    return {
        state: query.state,
        queryKey: query.queryKey,
        queryHash: query.queryHash,
        ...query.meta && {
            meta: query.meta
        }
    };
}
function defaultShouldDehydrateMutation(mutation) {
    return mutation.state.isPaused;
}
function defaultShouldDehydrateQuery(query) {
    return query.state.status === "success";
}
function dehydrate(client, options = {}) {
    const filterMutation = options.shouldDehydrateMutation ?? defaultShouldDehydrateMutation;
    const mutations = client.getMutationCache().getAll().flatMap((mutation)=>filterMutation(mutation) ? [
            dehydrateMutation(mutation)
        ] : []);
    const filterQuery = options.shouldDehydrateQuery ?? defaultShouldDehydrateQuery;
    const queries = client.getQueryCache().getAll().flatMap((query)=>filterQuery(query) ? [
            dehydrateQuery(query)
        ] : []);
    return {
        mutations,
        queries
    };
}
function hydrate(client, dehydratedState, options) {
    if (typeof dehydratedState !== "object" || dehydratedState === null) {
        return;
    }
    const mutationCache = client.getMutationCache();
    const queryCache = client.getQueryCache();
    const mutations = dehydratedState.mutations || [];
    const queries = dehydratedState.queries || [];
    mutations.forEach((dehydratedMutation)=>{
        mutationCache.build(client, {
            ...options?.defaultOptions?.mutations,
            mutationKey: dehydratedMutation.mutationKey,
            meta: dehydratedMutation.meta
        }, dehydratedMutation.state);
    });
    queries.forEach(({ queryKey, state, queryHash, meta })=>{
        const query = queryCache.get(queryHash);
        if (query) {
            if (query.state.dataUpdatedAt < state.dataUpdatedAt) {
                const { fetchStatus: _ignored, ...dehydratedQueryState } = state;
                query.setState(dehydratedQueryState);
            }
            return;
        }
        queryCache.build(client, {
            ...options?.defaultOptions?.queries,
            queryKey,
            queryHash,
            meta
        }, // Reset fetch status to idle to avoid
        // query being stuck in fetching state upon hydration
        {
            ...state,
            fetchStatus: "idle"
        });
    });
}
 //# sourceMappingURL=hydration.js.map


/***/ }),

/***/ 77994:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  S: () => (/* binding */ QueryClient)
});

;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/utils.js
// src/utils.ts
var isServer =  true || 0;
function noop() {
    return void 0;
}
function functionalUpdate(updater, input) {
    return typeof updater === "function" ? updater(input) : updater;
}
function isValidTimeout(value) {
    return typeof value === "number" && value >= 0 && value !== Infinity;
}
function timeUntilStale(updatedAt, staleTime) {
    return Math.max(updatedAt + (staleTime || 0) - Date.now(), 0);
}
function matchQuery(filters, query) {
    const { type = "all", exact, fetchStatus, predicate, queryKey, stale } = filters;
    if (queryKey) {
        if (exact) {
            if (query.queryHash !== hashQueryKeyByOptions(queryKey, query.options)) {
                return false;
            }
        } else if (!partialMatchKey(query.queryKey, queryKey)) {
            return false;
        }
    }
    if (type !== "all") {
        const isActive = query.isActive();
        if (type === "active" && !isActive) {
            return false;
        }
        if (type === "inactive" && isActive) {
            return false;
        }
    }
    if (typeof stale === "boolean" && query.isStale() !== stale) {
        return false;
    }
    if (typeof fetchStatus !== "undefined" && fetchStatus !== query.state.fetchStatus) {
        return false;
    }
    if (predicate && !predicate(query)) {
        return false;
    }
    return true;
}
function matchMutation(filters, mutation) {
    const { exact, status, predicate, mutationKey } = filters;
    if (mutationKey) {
        if (!mutation.options.mutationKey) {
            return false;
        }
        if (exact) {
            if (hashKey(mutation.options.mutationKey) !== hashKey(mutationKey)) {
                return false;
            }
        } else if (!partialMatchKey(mutation.options.mutationKey, mutationKey)) {
            return false;
        }
    }
    if (status && mutation.state.status !== status) {
        return false;
    }
    if (predicate && !predicate(mutation)) {
        return false;
    }
    return true;
}
function hashQueryKeyByOptions(queryKey, options) {
    const hashFn = options?.queryKeyHashFn || hashKey;
    return hashFn(queryKey);
}
function hashKey(queryKey) {
    return JSON.stringify(queryKey, (_, val)=>isPlainObject(val) ? Object.keys(val).sort().reduce((result, key)=>{
            result[key] = val[key];
            return result;
        }, {}) : val);
}
function partialMatchKey(a, b) {
    if (a === b) {
        return true;
    }
    if (typeof a !== typeof b) {
        return false;
    }
    if (a && b && typeof a === "object" && typeof b === "object") {
        return !Object.keys(b).some((key)=>!partialMatchKey(a[key], b[key]));
    }
    return false;
}
function replaceEqualDeep(a, b) {
    if (a === b) {
        return a;
    }
    const array = isPlainArray(a) && isPlainArray(b);
    if (array || isPlainObject(a) && isPlainObject(b)) {
        const aSize = array ? a.length : Object.keys(a).length;
        const bItems = array ? b : Object.keys(b);
        const bSize = bItems.length;
        const copy = array ? [] : {};
        let equalItems = 0;
        for(let i = 0; i < bSize; i++){
            const key = array ? i : bItems[i];
            copy[key] = replaceEqualDeep(a[key], b[key]);
            if (copy[key] === a[key]) {
                equalItems++;
            }
        }
        return aSize === bSize && equalItems === aSize ? a : copy;
    }
    return b;
}
function shallowEqualObjects(a, b) {
    if (a && !b || b && !a) {
        return false;
    }
    for(const key in a){
        if (a[key] !== b[key]) {
            return false;
        }
    }
    return true;
}
function isPlainArray(value) {
    return Array.isArray(value) && value.length === Object.keys(value).length;
}
function isPlainObject(o) {
    if (!hasObjectPrototype(o)) {
        return false;
    }
    const ctor = o.constructor;
    if (typeof ctor === "undefined") {
        return true;
    }
    const prot = ctor.prototype;
    if (!hasObjectPrototype(prot)) {
        return false;
    }
    if (!prot.hasOwnProperty("isPrototypeOf")) {
        return false;
    }
    return true;
}
function hasObjectPrototype(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
}
function sleep(ms) {
    return new Promise((resolve)=>{
        setTimeout(resolve, ms);
    });
}
function scheduleMicrotask(callback) {
    sleep(0).then(callback);
}
function replaceData(prevData, data, options) {
    if (typeof options.structuralSharing === "function") {
        return options.structuralSharing(prevData, data);
    } else if (options.structuralSharing !== false) {
        return replaceEqualDeep(prevData, data);
    }
    return data;
}
function keepPreviousData(previousData) {
    return previousData;
}
function addToEnd(items, item, max = 0) {
    const newItems = [
        ...items,
        item
    ];
    return max && newItems.length > max ? newItems.slice(1) : newItems;
}
function addToStart(items, item, max = 0) {
    const newItems = [
        item,
        ...items
    ];
    return max && newItems.length > max ? newItems.slice(0, -1) : newItems;
}
 //# sourceMappingURL=utils.js.map

;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/notifyManager.js
// src/notifyManager.ts

function createNotifyManager() {
    let queue = [];
    let transactions = 0;
    let notifyFn = (callback)=>{
        callback();
    };
    let batchNotifyFn = (callback)=>{
        callback();
    };
    const batch = (callback)=>{
        let result;
        transactions++;
        try {
            result = callback();
        } finally{
            transactions--;
            if (!transactions) {
                flush();
            }
        }
        return result;
    };
    const schedule = (callback)=>{
        if (transactions) {
            queue.push(callback);
        } else {
            scheduleMicrotask(()=>{
                notifyFn(callback);
            });
        }
    };
    const batchCalls = (callback)=>{
        return (...args)=>{
            schedule(()=>{
                callback(...args);
            });
        };
    };
    const flush = ()=>{
        const originalQueue = queue;
        queue = [];
        if (originalQueue.length) {
            scheduleMicrotask(()=>{
                batchNotifyFn(()=>{
                    originalQueue.forEach((callback)=>{
                        notifyFn(callback);
                    });
                });
            });
        }
    };
    const setNotifyFunction = (fn)=>{
        notifyFn = fn;
    };
    const setBatchNotifyFunction = (fn)=>{
        batchNotifyFn = fn;
    };
    return {
        batch,
        batchCalls,
        schedule,
        setNotifyFunction,
        setBatchNotifyFunction
    };
}
var notifyManager = createNotifyManager();
 //# sourceMappingURL=notifyManager.js.map

;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/subscribable.js
// src/subscribable.ts
var Subscribable = class {
    constructor(){
        this.listeners = /* @__PURE__ */ new Set();
        this.subscribe = this.subscribe.bind(this);
    }
    subscribe(listener) {
        this.listeners.add(listener);
        this.onSubscribe();
        return ()=>{
            this.listeners.delete(listener);
            this.onUnsubscribe();
        };
    }
    hasListeners() {
        return this.listeners.size > 0;
    }
    onSubscribe() {}
    onUnsubscribe() {}
};
 //# sourceMappingURL=subscribable.js.map

;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/focusManager.js
// src/focusManager.ts


var FocusManager = class extends Subscribable {
    #focused;
    #cleanup;
    #setup;
    constructor(){
        super();
        this.#setup = (onFocus)=>{
            if (!isServer && window.addEventListener) {
                const listener = ()=>onFocus();
                window.addEventListener("visibilitychange", listener, false);
                return ()=>{
                    window.removeEventListener("visibilitychange", listener);
                };
            }
            return;
        };
    }
    onSubscribe() {
        if (!this.#cleanup) {
            this.setEventListener(this.#setup);
        }
    }
    onUnsubscribe() {
        if (!this.hasListeners()) {
            this.#cleanup?.();
            this.#cleanup = void 0;
        }
    }
    setEventListener(setup) {
        this.#setup = setup;
        this.#cleanup?.();
        this.#cleanup = setup((focused)=>{
            if (typeof focused === "boolean") {
                this.setFocused(focused);
            } else {
                this.onFocus();
            }
        });
    }
    setFocused(focused) {
        const changed = this.#focused !== focused;
        if (changed) {
            this.#focused = focused;
            this.onFocus();
        }
    }
    onFocus() {
        this.listeners.forEach((listener)=>{
            listener();
        });
    }
    isFocused() {
        if (typeof this.#focused === "boolean") {
            return this.#focused;
        }
        return globalThis.document?.visibilityState !== "hidden";
    }
};
var focusManager = new FocusManager();
 //# sourceMappingURL=focusManager.js.map

;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/onlineManager.js
// src/onlineManager.ts


var OnlineManager = class extends Subscribable {
    #online;
    #cleanup;
    #setup;
    constructor(){
        super();
        this.#online = true;
        this.#setup = (onOnline)=>{
            if (!isServer && window.addEventListener) {
                const onlineListener = ()=>onOnline(true);
                const offlineListener = ()=>onOnline(false);
                window.addEventListener("online", onlineListener, false);
                window.addEventListener("offline", offlineListener, false);
                return ()=>{
                    window.removeEventListener("online", onlineListener);
                    window.removeEventListener("offline", offlineListener);
                };
            }
            return;
        };
    }
    onSubscribe() {
        if (!this.#cleanup) {
            this.setEventListener(this.#setup);
        }
    }
    onUnsubscribe() {
        if (!this.hasListeners()) {
            this.#cleanup?.();
            this.#cleanup = void 0;
        }
    }
    setEventListener(setup) {
        this.#setup = setup;
        this.#cleanup?.();
        this.#cleanup = setup(this.setOnline.bind(this));
    }
    setOnline(online) {
        const changed = this.#online !== online;
        if (changed) {
            this.#online = online;
            this.listeners.forEach((listener)=>{
                listener(online);
            });
        }
    }
    isOnline() {
        return this.#online;
    }
};
var onlineManager = new OnlineManager();
 //# sourceMappingURL=onlineManager.js.map

;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/retryer.js
// src/retryer.ts



function defaultRetryDelay(failureCount) {
    return Math.min(1e3 * 2 ** failureCount, 3e4);
}
function canFetch(networkMode) {
    return (networkMode ?? "online") === "online" ? onlineManager.isOnline() : true;
}
var CancelledError = class {
    constructor(options){
        this.revert = options?.revert;
        this.silent = options?.silent;
    }
};
function isCancelledError(value) {
    return value instanceof CancelledError;
}
function createRetryer(config) {
    let isRetryCancelled = false;
    let failureCount = 0;
    let isResolved = false;
    let continueFn;
    let promiseResolve;
    let promiseReject;
    const promise = new Promise((outerResolve, outerReject)=>{
        promiseResolve = outerResolve;
        promiseReject = outerReject;
    });
    const cancel = (cancelOptions)=>{
        if (!isResolved) {
            reject(new CancelledError(cancelOptions));
            config.abort?.();
        }
    };
    const cancelRetry = ()=>{
        isRetryCancelled = true;
    };
    const continueRetry = ()=>{
        isRetryCancelled = false;
    };
    const shouldPause = ()=>!focusManager.isFocused() || config.networkMode !== "always" && !onlineManager.isOnline();
    const resolve = (value)=>{
        if (!isResolved) {
            isResolved = true;
            config.onSuccess?.(value);
            continueFn?.();
            promiseResolve(value);
        }
    };
    const reject = (value)=>{
        if (!isResolved) {
            isResolved = true;
            config.onError?.(value);
            continueFn?.();
            promiseReject(value);
        }
    };
    const pause = ()=>{
        return new Promise((continueResolve)=>{
            continueFn = (value)=>{
                const canContinue = isResolved || !shouldPause();
                if (canContinue) {
                    continueResolve(value);
                }
                return canContinue;
            };
            config.onPause?.();
        }).then(()=>{
            continueFn = void 0;
            if (!isResolved) {
                config.onContinue?.();
            }
        });
    };
    const run = ()=>{
        if (isResolved) {
            return;
        }
        let promiseOrValue;
        try {
            promiseOrValue = config.fn();
        } catch (error) {
            promiseOrValue = Promise.reject(error);
        }
        Promise.resolve(promiseOrValue).then(resolve).catch((error)=>{
            if (isResolved) {
                return;
            }
            const retry = config.retry ?? (isServer ? 0 : 3);
            const retryDelay = config.retryDelay ?? defaultRetryDelay;
            const delay = typeof retryDelay === "function" ? retryDelay(failureCount, error) : retryDelay;
            const shouldRetry = retry === true || typeof retry === "number" && failureCount < retry || typeof retry === "function" && retry(failureCount, error);
            if (isRetryCancelled || !shouldRetry) {
                reject(error);
                return;
            }
            failureCount++;
            config.onFail?.(failureCount, error);
            sleep(delay).then(()=>{
                if (shouldPause()) {
                    return pause();
                }
                return;
            }).then(()=>{
                if (isRetryCancelled) {
                    reject(error);
                } else {
                    run();
                }
            });
        });
    };
    if (canFetch(config.networkMode)) {
        run();
    } else {
        pause().then(run);
    }
    return {
        promise,
        cancel,
        continue: ()=>{
            const didContinue = continueFn?.();
            return didContinue ? promise : Promise.resolve();
        },
        cancelRetry,
        continueRetry
    };
}
 //# sourceMappingURL=retryer.js.map

;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/removable.js
// src/removable.ts

var Removable = class {
    #gcTimeout;
    destroy() {
        this.clearGcTimeout();
    }
    scheduleGc() {
        this.clearGcTimeout();
        if (isValidTimeout(this.gcTime)) {
            this.#gcTimeout = setTimeout(()=>{
                this.optionalRemove();
            }, this.gcTime);
        }
    }
    updateGcTime(newGcTime) {
        this.gcTime = Math.max(this.gcTime || 0, newGcTime ?? (isServer ? Infinity : 5 * 60 * 1e3));
    }
    clearGcTimeout() {
        if (this.#gcTimeout) {
            clearTimeout(this.#gcTimeout);
            this.#gcTimeout = void 0;
        }
    }
};
 //# sourceMappingURL=removable.js.map

;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/query.js
// src/query.ts




var Query = class extends Removable {
    constructor(config){
        super();
        this.#abortSignalConsumed = false;
        this.#defaultOptions = config.defaultOptions;
        this.#setOptions(config.options);
        this.#observers = [];
        this.#cache = config.cache;
        this.queryKey = config.queryKey;
        this.queryHash = config.queryHash;
        this.#initialState = config.state || getDefaultState(this.options);
        this.state = this.#initialState;
        this.scheduleGc();
    }
    #initialState;
    #revertState;
    #cache;
    #promise;
    #retryer;
    #observers;
    #defaultOptions;
    #abortSignalConsumed;
    get meta() {
        return this.options.meta;
    }
    #setOptions(options) {
        this.options = {
            ...this.#defaultOptions,
            ...options
        };
        this.updateGcTime(this.options.gcTime);
    }
    optionalRemove() {
        if (!this.#observers.length && this.state.fetchStatus === "idle") {
            this.#cache.remove(this);
        }
    }
    setData(newData, options) {
        const data = replaceData(this.state.data, newData, this.options);
        this.#dispatch({
            data,
            type: "success",
            dataUpdatedAt: options?.updatedAt,
            manual: options?.manual
        });
        return data;
    }
    setState(state, setStateOptions) {
        this.#dispatch({
            type: "setState",
            state,
            setStateOptions
        });
    }
    cancel(options) {
        const promise = this.#promise;
        this.#retryer?.cancel(options);
        return promise ? promise.then(noop).catch(noop) : Promise.resolve();
    }
    destroy() {
        super.destroy();
        this.cancel({
            silent: true
        });
    }
    reset() {
        this.destroy();
        this.setState(this.#initialState);
    }
    isActive() {
        return this.#observers.some((observer)=>observer.options.enabled !== false);
    }
    isDisabled() {
        return this.getObserversCount() > 0 && !this.isActive();
    }
    isStale() {
        return this.state.isInvalidated || !this.state.dataUpdatedAt || this.#observers.some((observer)=>observer.getCurrentResult().isStale);
    }
    isStaleByTime(staleTime = 0) {
        return this.state.isInvalidated || !this.state.dataUpdatedAt || !timeUntilStale(this.state.dataUpdatedAt, staleTime);
    }
    onFocus() {
        const observer = this.#observers.find((x)=>x.shouldFetchOnWindowFocus());
        observer?.refetch({
            cancelRefetch: false
        });
        this.#retryer?.continue();
    }
    onOnline() {
        const observer = this.#observers.find((x)=>x.shouldFetchOnReconnect());
        observer?.refetch({
            cancelRefetch: false
        });
        this.#retryer?.continue();
    }
    addObserver(observer) {
        if (!this.#observers.includes(observer)) {
            this.#observers.push(observer);
            this.clearGcTimeout();
            this.#cache.notify({
                type: "observerAdded",
                query: this,
                observer
            });
        }
    }
    removeObserver(observer) {
        if (this.#observers.includes(observer)) {
            this.#observers = this.#observers.filter((x)=>x !== observer);
            if (!this.#observers.length) {
                if (this.#retryer) {
                    if (this.#abortSignalConsumed) {
                        this.#retryer.cancel({
                            revert: true
                        });
                    } else {
                        this.#retryer.cancelRetry();
                    }
                }
                this.scheduleGc();
            }
            this.#cache.notify({
                type: "observerRemoved",
                query: this,
                observer
            });
        }
    }
    getObserversCount() {
        return this.#observers.length;
    }
    invalidate() {
        if (!this.state.isInvalidated) {
            this.#dispatch({
                type: "invalidate"
            });
        }
    }
    fetch(options, fetchOptions) {
        if (this.state.fetchStatus !== "idle") {
            if (this.state.dataUpdatedAt && fetchOptions?.cancelRefetch) {
                this.cancel({
                    silent: true
                });
            } else if (this.#promise) {
                this.#retryer?.continueRetry();
                return this.#promise;
            }
        }
        if (options) {
            this.#setOptions(options);
        }
        if (!this.options.queryFn) {
            const observer = this.#observers.find((x)=>x.options.queryFn);
            if (observer) {
                this.#setOptions(observer.options);
            }
        }
        if (false) {}
        const abortController = new AbortController();
        const queryFnContext = {
            queryKey: this.queryKey,
            meta: this.meta
        };
        const addSignalProperty = (object)=>{
            Object.defineProperty(object, "signal", {
                enumerable: true,
                get: ()=>{
                    this.#abortSignalConsumed = true;
                    return abortController.signal;
                }
            });
        };
        addSignalProperty(queryFnContext);
        const fetchFn = ()=>{
            if (!this.options.queryFn) {
                return Promise.reject(new Error(`Missing queryFn: '${this.options.queryHash}'`));
            }
            this.#abortSignalConsumed = false;
            if (this.options.persister) {
                return this.options.persister(this.options.queryFn, queryFnContext, this);
            }
            return this.options.queryFn(queryFnContext);
        };
        const context = {
            fetchOptions,
            options: this.options,
            queryKey: this.queryKey,
            state: this.state,
            fetchFn
        };
        addSignalProperty(context);
        this.options.behavior?.onFetch(context, this);
        this.#revertState = this.state;
        if (this.state.fetchStatus === "idle" || this.state.fetchMeta !== context.fetchOptions?.meta) {
            this.#dispatch({
                type: "fetch",
                meta: context.fetchOptions?.meta
            });
        }
        const onError = (error)=>{
            if (!(isCancelledError(error) && error.silent)) {
                this.#dispatch({
                    type: "error",
                    error
                });
            }
            if (!isCancelledError(error)) {
                this.#cache.config.onError?.(error, this);
                this.#cache.config.onSettled?.(this.state.data, error, this);
            }
            if (!this.isFetchingOptimistic) {
                this.scheduleGc();
            }
            this.isFetchingOptimistic = false;
        };
        this.#retryer = createRetryer({
            fn: context.fetchFn,
            abort: abortController.abort.bind(abortController),
            onSuccess: (data)=>{
                if (typeof data === "undefined") {
                    if (false) {}
                    onError(new Error(`${this.queryHash} data is undefined`));
                    return;
                }
                this.setData(data);
                this.#cache.config.onSuccess?.(data, this);
                this.#cache.config.onSettled?.(data, this.state.error, this);
                if (!this.isFetchingOptimistic) {
                    this.scheduleGc();
                }
                this.isFetchingOptimistic = false;
            },
            onError,
            onFail: (failureCount, error)=>{
                this.#dispatch({
                    type: "failed",
                    failureCount,
                    error
                });
            },
            onPause: ()=>{
                this.#dispatch({
                    type: "pause"
                });
            },
            onContinue: ()=>{
                this.#dispatch({
                    type: "continue"
                });
            },
            retry: context.options.retry,
            retryDelay: context.options.retryDelay,
            networkMode: context.options.networkMode
        });
        this.#promise = this.#retryer.promise;
        return this.#promise;
    }
    #dispatch(action) {
        const reducer = (state)=>{
            switch(action.type){
                case "failed":
                    return {
                        ...state,
                        fetchFailureCount: action.failureCount,
                        fetchFailureReason: action.error
                    };
                case "pause":
                    return {
                        ...state,
                        fetchStatus: "paused"
                    };
                case "continue":
                    return {
                        ...state,
                        fetchStatus: "fetching"
                    };
                case "fetch":
                    return {
                        ...state,
                        fetchFailureCount: 0,
                        fetchFailureReason: null,
                        fetchMeta: action.meta ?? null,
                        fetchStatus: canFetch(this.options.networkMode) ? "fetching" : "paused",
                        ...!state.dataUpdatedAt && {
                            error: null,
                            status: "pending"
                        }
                    };
                case "success":
                    return {
                        ...state,
                        data: action.data,
                        dataUpdateCount: state.dataUpdateCount + 1,
                        dataUpdatedAt: action.dataUpdatedAt ?? Date.now(),
                        error: null,
                        isInvalidated: false,
                        status: "success",
                        ...!action.manual && {
                            fetchStatus: "idle",
                            fetchFailureCount: 0,
                            fetchFailureReason: null
                        }
                    };
                case "error":
                    const error = action.error;
                    if (isCancelledError(error) && error.revert && this.#revertState) {
                        return {
                            ...this.#revertState,
                            fetchStatus: "idle"
                        };
                    }
                    return {
                        ...state,
                        error,
                        errorUpdateCount: state.errorUpdateCount + 1,
                        errorUpdatedAt: Date.now(),
                        fetchFailureCount: state.fetchFailureCount + 1,
                        fetchFailureReason: error,
                        fetchStatus: "idle",
                        status: "error"
                    };
                case "invalidate":
                    return {
                        ...state,
                        isInvalidated: true
                    };
                case "setState":
                    return {
                        ...state,
                        ...action.state
                    };
            }
        };
        this.state = reducer(this.state);
        notifyManager.batch(()=>{
            this.#observers.forEach((observer)=>{
                observer.onQueryUpdate();
            });
            this.#cache.notify({
                query: this,
                type: "updated",
                action
            });
        });
    }
};
function getDefaultState(options) {
    const data = typeof options.initialData === "function" ? options.initialData() : options.initialData;
    const hasData = typeof data !== "undefined";
    const initialDataUpdatedAt = hasData ? typeof options.initialDataUpdatedAt === "function" ? options.initialDataUpdatedAt() : options.initialDataUpdatedAt : 0;
    return {
        data,
        dataUpdateCount: 0,
        dataUpdatedAt: hasData ? initialDataUpdatedAt ?? Date.now() : 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        isInvalidated: false,
        status: hasData ? "success" : "pending",
        fetchStatus: "idle"
    };
}
 //# sourceMappingURL=query.js.map

;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/queryCache.js
// src/queryCache.ts




var QueryCache = class extends Subscribable {
    constructor(config = {}){
        super();
        this.config = config;
        this.#queries = /* @__PURE__ */ new Map();
    }
    #queries;
    build(client, options, state) {
        const queryKey = options.queryKey;
        const queryHash = options.queryHash ?? hashQueryKeyByOptions(queryKey, options);
        let query = this.get(queryHash);
        if (!query) {
            query = new Query({
                cache: this,
                queryKey,
                queryHash,
                options: client.defaultQueryOptions(options),
                state,
                defaultOptions: client.getQueryDefaults(queryKey)
            });
            this.add(query);
        }
        return query;
    }
    add(query) {
        if (!this.#queries.has(query.queryHash)) {
            this.#queries.set(query.queryHash, query);
            this.notify({
                type: "added",
                query
            });
        }
    }
    remove(query) {
        const queryInMap = this.#queries.get(query.queryHash);
        if (queryInMap) {
            query.destroy();
            if (queryInMap === query) {
                this.#queries.delete(query.queryHash);
            }
            this.notify({
                type: "removed",
                query
            });
        }
    }
    clear() {
        notifyManager.batch(()=>{
            this.getAll().forEach((query)=>{
                this.remove(query);
            });
        });
    }
    get(queryHash) {
        return this.#queries.get(queryHash);
    }
    getAll() {
        return [
            ...this.#queries.values()
        ];
    }
    find(filters) {
        const defaultedFilters = {
            exact: true,
            ...filters
        };
        return this.getAll().find((query)=>matchQuery(defaultedFilters, query));
    }
    findAll(filters = {}) {
        const queries = this.getAll();
        return Object.keys(filters).length > 0 ? queries.filter((query)=>matchQuery(filters, query)) : queries;
    }
    notify(event) {
        notifyManager.batch(()=>{
            this.listeners.forEach((listener)=>{
                listener(event);
            });
        });
    }
    onFocus() {
        notifyManager.batch(()=>{
            this.getAll().forEach((query)=>{
                query.onFocus();
            });
        });
    }
    onOnline() {
        notifyManager.batch(()=>{
            this.getAll().forEach((query)=>{
                query.onOnline();
            });
        });
    }
};
 //# sourceMappingURL=queryCache.js.map

;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/mutation.js
// src/mutation.ts



var Mutation = class extends Removable {
    constructor(config){
        super();
        this.mutationId = config.mutationId;
        this.#defaultOptions = config.defaultOptions;
        this.#mutationCache = config.mutationCache;
        this.#observers = [];
        this.state = config.state || mutation_getDefaultState();
        this.setOptions(config.options);
        this.scheduleGc();
    }
    #observers;
    #defaultOptions;
    #mutationCache;
    #retryer;
    setOptions(options) {
        this.options = {
            ...this.#defaultOptions,
            ...options
        };
        this.updateGcTime(this.options.gcTime);
    }
    get meta() {
        return this.options.meta;
    }
    addObserver(observer) {
        if (!this.#observers.includes(observer)) {
            this.#observers.push(observer);
            this.clearGcTimeout();
            this.#mutationCache.notify({
                type: "observerAdded",
                mutation: this,
                observer
            });
        }
    }
    removeObserver(observer) {
        this.#observers = this.#observers.filter((x)=>x !== observer);
        this.scheduleGc();
        this.#mutationCache.notify({
            type: "observerRemoved",
            mutation: this,
            observer
        });
    }
    optionalRemove() {
        if (!this.#observers.length) {
            if (this.state.status === "pending") {
                this.scheduleGc();
            } else {
                this.#mutationCache.remove(this);
            }
        }
    }
    continue() {
        return this.#retryer?.continue() ?? // continuing a mutation assumes that variables are set, mutation must have been dehydrated before
        this.execute(this.state.variables);
    }
    async execute(variables) {
        const executeMutation = ()=>{
            this.#retryer = createRetryer({
                fn: ()=>{
                    if (!this.options.mutationFn) {
                        return Promise.reject(new Error("No mutationFn found"));
                    }
                    return this.options.mutationFn(variables);
                },
                onFail: (failureCount, error)=>{
                    this.#dispatch({
                        type: "failed",
                        failureCount,
                        error
                    });
                },
                onPause: ()=>{
                    this.#dispatch({
                        type: "pause"
                    });
                },
                onContinue: ()=>{
                    this.#dispatch({
                        type: "continue"
                    });
                },
                retry: this.options.retry ?? 0,
                retryDelay: this.options.retryDelay,
                networkMode: this.options.networkMode
            });
            return this.#retryer.promise;
        };
        const restored = this.state.status === "pending";
        try {
            if (!restored) {
                this.#dispatch({
                    type: "pending",
                    variables
                });
                await this.#mutationCache.config.onMutate?.(variables, this);
                const context = await this.options.onMutate?.(variables);
                if (context !== this.state.context) {
                    this.#dispatch({
                        type: "pending",
                        context,
                        variables
                    });
                }
            }
            const data = await executeMutation();
            await this.#mutationCache.config.onSuccess?.(data, variables, this.state.context, this);
            await this.options.onSuccess?.(data, variables, this.state.context);
            await this.#mutationCache.config.onSettled?.(data, null, this.state.variables, this.state.context, this);
            await this.options.onSettled?.(data, null, variables, this.state.context);
            this.#dispatch({
                type: "success",
                data
            });
            return data;
        } catch (error) {
            try {
                await this.#mutationCache.config.onError?.(error, variables, this.state.context, this);
                await this.options.onError?.(error, variables, this.state.context);
                await this.#mutationCache.config.onSettled?.(void 0, error, this.state.variables, this.state.context, this);
                await this.options.onSettled?.(void 0, error, variables, this.state.context);
                throw error;
            } finally{
                this.#dispatch({
                    type: "error",
                    error
                });
            }
        }
    }
    #dispatch(action) {
        const reducer = (state)=>{
            switch(action.type){
                case "failed":
                    return {
                        ...state,
                        failureCount: action.failureCount,
                        failureReason: action.error
                    };
                case "pause":
                    return {
                        ...state,
                        isPaused: true
                    };
                case "continue":
                    return {
                        ...state,
                        isPaused: false
                    };
                case "pending":
                    return {
                        ...state,
                        context: action.context,
                        data: void 0,
                        failureCount: 0,
                        failureReason: null,
                        error: null,
                        isPaused: !canFetch(this.options.networkMode),
                        status: "pending",
                        variables: action.variables,
                        submittedAt: Date.now()
                    };
                case "success":
                    return {
                        ...state,
                        data: action.data,
                        failureCount: 0,
                        failureReason: null,
                        error: null,
                        status: "success",
                        isPaused: false
                    };
                case "error":
                    return {
                        ...state,
                        data: void 0,
                        error: action.error,
                        failureCount: state.failureCount + 1,
                        failureReason: action.error,
                        isPaused: false,
                        status: "error"
                    };
            }
        };
        this.state = reducer(this.state);
        notifyManager.batch(()=>{
            this.#observers.forEach((observer)=>{
                observer.onMutationUpdate(action);
            });
            this.#mutationCache.notify({
                mutation: this,
                type: "updated",
                action
            });
        });
    }
};
function mutation_getDefaultState() {
    return {
        context: void 0,
        data: void 0,
        error: null,
        failureCount: 0,
        failureReason: null,
        isPaused: false,
        status: "idle",
        variables: void 0,
        submittedAt: 0
    };
}
 //# sourceMappingURL=mutation.js.map

;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/mutationCache.js
// src/mutationCache.ts




var MutationCache = class extends Subscribable {
    constructor(config = {}){
        super();
        this.config = config;
        this.#mutations = [];
        this.#mutationId = 0;
    }
    #mutations;
    #mutationId;
    #resuming;
    build(client, options, state) {
        const mutation = new Mutation({
            mutationCache: this,
            mutationId: ++this.#mutationId,
            options: client.defaultMutationOptions(options),
            state
        });
        this.add(mutation);
        return mutation;
    }
    add(mutation) {
        this.#mutations.push(mutation);
        this.notify({
            type: "added",
            mutation
        });
    }
    remove(mutation) {
        this.#mutations = this.#mutations.filter((x)=>x !== mutation);
        this.notify({
            type: "removed",
            mutation
        });
    }
    clear() {
        notifyManager.batch(()=>{
            this.#mutations.forEach((mutation)=>{
                this.remove(mutation);
            });
        });
    }
    getAll() {
        return this.#mutations;
    }
    find(filters) {
        const defaultedFilters = {
            exact: true,
            ...filters
        };
        return this.#mutations.find((mutation)=>matchMutation(defaultedFilters, mutation));
    }
    findAll(filters = {}) {
        return this.#mutations.filter((mutation)=>matchMutation(filters, mutation));
    }
    notify(event) {
        notifyManager.batch(()=>{
            this.listeners.forEach((listener)=>{
                listener(event);
            });
        });
    }
    resumePausedMutations() {
        this.#resuming = (this.#resuming ?? Promise.resolve()).then(()=>{
            const pausedMutations = this.#mutations.filter((x)=>x.state.isPaused);
            return notifyManager.batch(()=>pausedMutations.reduce((promise, mutation)=>promise.then(()=>mutation.continue().catch(noop)), Promise.resolve()));
        }).then(()=>{
            this.#resuming = void 0;
        });
        return this.#resuming;
    }
};
 //# sourceMappingURL=mutationCache.js.map

;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/infiniteQueryBehavior.js
// src/infiniteQueryBehavior.ts

function infiniteQueryBehavior(pages) {
    return {
        onFetch: (context, query)=>{
            const fetchFn = async ()=>{
                const options = context.options;
                const direction = context.fetchOptions?.meta?.fetchMore?.direction;
                const oldPages = context.state.data?.pages || [];
                const oldPageParams = context.state.data?.pageParams || [];
                const empty = {
                    pages: [],
                    pageParams: []
                };
                let cancelled = false;
                const addSignalProperty = (object)=>{
                    Object.defineProperty(object, "signal", {
                        enumerable: true,
                        get: ()=>{
                            if (context.signal.aborted) {
                                cancelled = true;
                            } else {
                                context.signal.addEventListener("abort", ()=>{
                                    cancelled = true;
                                });
                            }
                            return context.signal;
                        }
                    });
                };
                const queryFn = context.options.queryFn || (()=>Promise.reject(new Error(`Missing queryFn: '${context.options.queryHash}'`)));
                const fetchPage = async (data, param, previous)=>{
                    if (cancelled) {
                        return Promise.reject();
                    }
                    if (param == null && data.pages.length) {
                        return Promise.resolve(data);
                    }
                    const queryFnContext = {
                        queryKey: context.queryKey,
                        pageParam: param,
                        direction: previous ? "backward" : "forward",
                        meta: context.options.meta
                    };
                    addSignalProperty(queryFnContext);
                    const page = await queryFn(queryFnContext);
                    const { maxPages } = context.options;
                    const addTo = previous ? addToStart : addToEnd;
                    return {
                        pages: addTo(data.pages, page, maxPages),
                        pageParams: addTo(data.pageParams, param, maxPages)
                    };
                };
                let result;
                if (direction && oldPages.length) {
                    const previous = direction === "backward";
                    const pageParamFn = previous ? getPreviousPageParam : getNextPageParam;
                    const oldData = {
                        pages: oldPages,
                        pageParams: oldPageParams
                    };
                    const param = pageParamFn(options, oldData);
                    result = await fetchPage(oldData, param, previous);
                } else {
                    result = await fetchPage(empty, oldPageParams[0] ?? options.initialPageParam);
                    const remainingPages = pages ?? oldPages.length;
                    for(let i = 1; i < remainingPages; i++){
                        const param = getNextPageParam(options, result);
                        result = await fetchPage(result, param);
                    }
                }
                return result;
            };
            if (context.options.persister) {
                context.fetchFn = ()=>{
                    return context.options.persister?.(fetchFn, {
                        queryKey: context.queryKey,
                        meta: context.options.meta,
                        signal: context.signal
                    }, query);
                };
            } else {
                context.fetchFn = fetchFn;
            }
        }
    };
}
function getNextPageParam(options, { pages, pageParams }) {
    const lastIndex = pages.length - 1;
    return options.getNextPageParam(pages[lastIndex], pages, pageParams[lastIndex], pageParams);
}
function getPreviousPageParam(options, { pages, pageParams }) {
    return options.getPreviousPageParam?.(pages[0], pages, pageParams[0], pageParams);
}
function hasNextPage(options, data) {
    if (!data) return false;
    return getNextPageParam(options, data) != null;
}
function hasPreviousPage(options, data) {
    if (!data || !options.getPreviousPageParam) return false;
    return getPreviousPageParam(options, data) != null;
}
 //# sourceMappingURL=infiniteQueryBehavior.js.map

;// CONCATENATED MODULE: ./node_modules/@tanstack/query-core/build/modern/queryClient.js
// src/queryClient.ts







var QueryClient = class {
    #queryCache;
    #mutationCache;
    #defaultOptions;
    #queryDefaults;
    #mutationDefaults;
    #mountCount;
    #unsubscribeFocus;
    #unsubscribeOnline;
    constructor(config = {}){
        this.#queryCache = config.queryCache || new QueryCache();
        this.#mutationCache = config.mutationCache || new MutationCache();
        this.#defaultOptions = config.defaultOptions || {};
        this.#queryDefaults = /* @__PURE__ */ new Map();
        this.#mutationDefaults = /* @__PURE__ */ new Map();
        this.#mountCount = 0;
    }
    mount() {
        this.#mountCount++;
        if (this.#mountCount !== 1) return;
        this.#unsubscribeFocus = focusManager.subscribe(()=>{
            if (focusManager.isFocused()) {
                this.resumePausedMutations();
                this.#queryCache.onFocus();
            }
        });
        this.#unsubscribeOnline = onlineManager.subscribe(()=>{
            if (onlineManager.isOnline()) {
                this.resumePausedMutations();
                this.#queryCache.onOnline();
            }
        });
    }
    unmount() {
        this.#mountCount--;
        if (this.#mountCount !== 0) return;
        this.#unsubscribeFocus?.();
        this.#unsubscribeFocus = void 0;
        this.#unsubscribeOnline?.();
        this.#unsubscribeOnline = void 0;
    }
    isFetching(filters) {
        return this.#queryCache.findAll({
            ...filters,
            fetchStatus: "fetching"
        }).length;
    }
    isMutating(filters) {
        return this.#mutationCache.findAll({
            ...filters,
            status: "pending"
        }).length;
    }
    getQueryData(queryKey) {
        return this.#queryCache.find({
            queryKey
        })?.state.data;
    }
    ensureQueryData(options) {
        const cachedData = this.getQueryData(options.queryKey);
        return cachedData !== void 0 ? Promise.resolve(cachedData) : this.fetchQuery(options);
    }
    getQueriesData(filters) {
        return this.getQueryCache().findAll(filters).map(({ queryKey, state })=>{
            const data = state.data;
            return [
                queryKey,
                data
            ];
        });
    }
    setQueryData(queryKey, updater, options) {
        const query = this.#queryCache.find({
            queryKey
        });
        const prevData = query?.state.data;
        const data = functionalUpdate(updater, prevData);
        if (typeof data === "undefined") {
            return void 0;
        }
        const defaultedOptions = this.defaultQueryOptions({
            queryKey
        });
        return this.#queryCache.build(this, defaultedOptions).setData(data, {
            ...options,
            manual: true
        });
    }
    setQueriesData(filters, updater, options) {
        return notifyManager.batch(()=>this.getQueryCache().findAll(filters).map(({ queryKey })=>[
                    queryKey,
                    this.setQueryData(queryKey, updater, options)
                ]));
    }
    getQueryState(queryKey) {
        return this.#queryCache.find({
            queryKey
        })?.state;
    }
    removeQueries(filters) {
        const queryCache = this.#queryCache;
        notifyManager.batch(()=>{
            queryCache.findAll(filters).forEach((query)=>{
                queryCache.remove(query);
            });
        });
    }
    resetQueries(filters, options) {
        const queryCache = this.#queryCache;
        const refetchFilters = {
            type: "active",
            ...filters
        };
        return notifyManager.batch(()=>{
            queryCache.findAll(filters).forEach((query)=>{
                query.reset();
            });
            return this.refetchQueries(refetchFilters, options);
        });
    }
    cancelQueries(filters = {}, cancelOptions = {}) {
        const defaultedCancelOptions = {
            revert: true,
            ...cancelOptions
        };
        const promises = notifyManager.batch(()=>this.#queryCache.findAll(filters).map((query)=>query.cancel(defaultedCancelOptions)));
        return Promise.all(promises).then(noop).catch(noop);
    }
    invalidateQueries(filters = {}, options = {}) {
        return notifyManager.batch(()=>{
            this.#queryCache.findAll(filters).forEach((query)=>{
                query.invalidate();
            });
            if (filters.refetchType === "none") {
                return Promise.resolve();
            }
            const refetchFilters = {
                ...filters,
                type: filters.refetchType ?? filters.type ?? "active"
            };
            return this.refetchQueries(refetchFilters, options);
        });
    }
    refetchQueries(filters = {}, options) {
        const fetchOptions = {
            ...options,
            cancelRefetch: options?.cancelRefetch ?? true
        };
        const promises = notifyManager.batch(()=>this.#queryCache.findAll(filters).filter((query)=>!query.isDisabled()).map((query)=>{
                let promise = query.fetch(void 0, fetchOptions);
                if (!fetchOptions.throwOnError) {
                    promise = promise.catch(noop);
                }
                return query.state.fetchStatus === "paused" ? Promise.resolve() : promise;
            }));
        return Promise.all(promises).then(noop);
    }
    fetchQuery(options) {
        const defaultedOptions = this.defaultQueryOptions(options);
        if (typeof defaultedOptions.retry === "undefined") {
            defaultedOptions.retry = false;
        }
        const query = this.#queryCache.build(this, defaultedOptions);
        return query.isStaleByTime(defaultedOptions.staleTime) ? query.fetch(defaultedOptions) : Promise.resolve(query.state.data);
    }
    prefetchQuery(options) {
        return this.fetchQuery(options).then(noop).catch(noop);
    }
    fetchInfiniteQuery(options) {
        options.behavior = infiniteQueryBehavior(options.pages);
        return this.fetchQuery(options);
    }
    prefetchInfiniteQuery(options) {
        return this.fetchInfiniteQuery(options).then(noop).catch(noop);
    }
    resumePausedMutations() {
        return this.#mutationCache.resumePausedMutations();
    }
    getQueryCache() {
        return this.#queryCache;
    }
    getMutationCache() {
        return this.#mutationCache;
    }
    getDefaultOptions() {
        return this.#defaultOptions;
    }
    setDefaultOptions(options) {
        this.#defaultOptions = options;
    }
    setQueryDefaults(queryKey, options) {
        this.#queryDefaults.set(hashKey(queryKey), {
            queryKey,
            defaultOptions: options
        });
    }
    getQueryDefaults(queryKey) {
        const defaults = [
            ...this.#queryDefaults.values()
        ];
        let result = {};
        defaults.forEach((queryDefault)=>{
            if (partialMatchKey(queryKey, queryDefault.queryKey)) {
                result = {
                    ...result,
                    ...queryDefault.defaultOptions
                };
            }
        });
        return result;
    }
    setMutationDefaults(mutationKey, options) {
        this.#mutationDefaults.set(hashKey(mutationKey), {
            mutationKey,
            defaultOptions: options
        });
    }
    getMutationDefaults(mutationKey) {
        const defaults = [
            ...this.#mutationDefaults.values()
        ];
        let result = {};
        defaults.forEach((queryDefault)=>{
            if (partialMatchKey(mutationKey, queryDefault.mutationKey)) {
                result = {
                    ...result,
                    ...queryDefault.defaultOptions
                };
            }
        });
        return result;
    }
    defaultQueryOptions(options) {
        if (options?._defaulted) {
            return options;
        }
        const defaultedOptions = {
            ...this.#defaultOptions.queries,
            ...options?.queryKey && this.getQueryDefaults(options.queryKey),
            ...options,
            _defaulted: true
        };
        if (!defaultedOptions.queryHash) {
            defaultedOptions.queryHash = hashQueryKeyByOptions(defaultedOptions.queryKey, defaultedOptions);
        }
        if (typeof defaultedOptions.refetchOnReconnect === "undefined") {
            defaultedOptions.refetchOnReconnect = defaultedOptions.networkMode !== "always";
        }
        if (typeof defaultedOptions.throwOnError === "undefined") {
            defaultedOptions.throwOnError = !!defaultedOptions.suspense;
        }
        if (typeof defaultedOptions.networkMode === "undefined" && defaultedOptions.persister) {
            defaultedOptions.networkMode = "offlineFirst";
        }
        return defaultedOptions;
    }
    defaultMutationOptions(options) {
        if (options?._defaulted) {
            return options;
        }
        return {
            ...this.#defaultOptions.mutations,
            ...options?.mutationKey && this.getMutationDefaults(options.mutationKey),
            ...options,
            _defaulted: true
        };
    }
    clear() {
        this.#queryCache.clear();
        this.#mutationCache.clear();
    }
};
 //# sourceMappingURL=queryClient.js.map


/***/ }),

/***/ 51838:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   R: () => (/* binding */ e0)
/* harmony export */ });
/* harmony import */ var next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(21313);

const proxy = (0,next_dist_build_webpack_loaders_next_flight_loader_module_proxy__WEBPACK_IMPORTED_MODULE_0__.createProxy)(String.raw`/frontend_app/node_modules/@tanstack/react-query/build/modern/HydrationBoundary.js`)

// Accessing the __esModule property and exporting $$typeof are required here.
// The __esModule getter forces the proxy target to create the default export
// and the $$typeof value is for rendering logic to determine if the module
// is a client boundary.
const { __esModule, $$typeof } = proxy;
const __default__ = proxy.default;

const e0 = proxy["HydrationBoundary"];


/***/ })

};
;