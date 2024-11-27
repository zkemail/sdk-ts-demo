self.__BUILD_MANIFEST = {
  "polyfillFiles": [
    "static/chunks/polyfills.js"
  ],
  "devFiles": [
    "react-refresh.js"
  ],
  "ampDevFiles": [],
  "lowPriorityFiles": [],
  "rootMainFiles": [
    "webpack.js",
    "main-app.js"
  ],
  "rootMainFilesTree": {},
  "pages": {
    "/_app": [
      "webpack.js",
      "main.js",
      "pages/_app.js"
    ],
    "/_error": [
      "webpack.js",
      "main.js",
      "pages/_error.js"
    ]
  },
  "ampFirstPages": []
};
self.__BUILD_MANIFEST.lowPriorityFiles = [
"/static/" + process.env.__NEXT_BUILD_ID + "/_buildManifest.js",
,"/static/" + process.env.__NEXT_BUILD_ID + "/_ssgManifest.js",

];