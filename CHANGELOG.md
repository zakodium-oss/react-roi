# Changelog

## [0.6.0](https://github.com/zakodium-oss/react-roi/compare/v0.5.0...v0.6.0) (2023-11-24)


### Features

* pan without the alt key ([6647c62](https://github.com/zakodium-oss/react-roi/commit/6647c622785f3627a1d0a6e864c1079fe3eb59cc))


### Bug Fixes

* correct leaking event listener ([937d005](https://github.com/zakodium-oss/react-roi/commit/937d005a5680d62162a061c6b8d607285a2d5215))
* use correct cursor during action after releasing the alt key ([5467213](https://github.com/zakodium-oss/react-roi/commit/54672135afa01becdf033816a5eb14845a2671f7))

## [0.5.0](https://github.com/zakodium-oss/react-roi/compare/v0.4.0...v0.5.0) (2023-11-23)


### ⚠ BREAKING CHANGES

* the initial configuration is now passed as a single prop to RoiProvider

### Features

* do not scale handlers with zoom level ([6ce10ac](https://github.com/zakodium-oss/react-roi/commit/6ce10ac749b7e7b414ce495e4d6017ddc5e39f7a))
* provide different initial rescaling strategies ([4537913](https://github.com/zakodium-oss/react-roi/commit/45379138b3c3b1dbbc1e9dba0267c029d5bd668f))
* show corner handles inside of ROI boundaries ([f83ef2a](https://github.com/zakodium-oss/react-roi/commit/f83ef2aaf6a202e61e8d3fcc68d7a374d20905e5))

## [0.4.0](https://github.com/zakodium-oss/react-roi/compare/v0.3.0...v0.4.0) (2023-11-22)


### ⚠ BREAKING CHANGES

* roi label must be a string and cannot be a ReactNode anymore
* getStyle prop changed
* rename useRoiActions to useActions
* do not export useRois hook

### Features

* add className support ([#44](https://github.com/zakodium-oss/react-roi/issues/44)) ([c51728f](https://github.com/zakodium-oss/react-roi/commit/c51728fa73e6f890a120aba796695051b6a5e055))
* add readOnly ROI ([#58](https://github.com/zakodium-oss/react-roi/issues/58)) ([b22ec6a](https://github.com/zakodium-oss/react-roi/commit/b22ec6a55b9f0905e104d218f87037908096b0da))
* add renderLabel prop for more flexibility ([7856372](https://github.com/zakodium-oss/react-roi/commit/78563729a8c4f407e4a5816045797561391db061))
* add zoom action ([#60](https://github.com/zakodium-oss/react-roi/issues/60)) ([09f70b3](https://github.com/zakodium-oss/react-roi/commit/09f70b3be04f748f76334a900bd5bfe3a39bc43f))
* add ZoomLevel on provider ([#62](https://github.com/zakodium-oss/react-roi/issues/62)) ([60f4e29](https://github.com/zakodium-oss/react-roi/commit/60f4e290a26e8abfcff70f6ea8a6046820800e2d))
* change corner appearance ([99a15f8](https://github.com/zakodium-oss/react-roi/commit/99a15f8b91c118fc798055eba0258367e8e5cdbc))
* customize resize handler color ([97ab51b](https://github.com/zakodium-oss/react-roi/commit/97ab51b19a3a135eb021c030b93a82cefbdedf8b))
* fit the target inside of the container ([9374eb9](https://github.com/zakodium-oss/react-roi/commit/9374eb9b3fcbba221b29331cdf94336ba52c79af))
* improve default style of roi ([5fdce8f](https://github.com/zakodium-oss/react-roi/commit/5fdce8fbcba9cdea73bd8fe48f2583eb8810aa67))
* pass data about readonly and scale in getStyle callback ([6d28ad1](https://github.com/zakodium-oss/react-roi/commit/6d28ad16fb21e9c40046dffbc8d05fc2a47ff6f8))


### Bug Fixes

* improve interactions when using browser zoom ([ecb14e5](https://github.com/zakodium-oss/react-roi/commit/ecb14e5f22c7c450c979f435fccb2fc33964a18f))
* make sure selected roi is rendered on top of other rois ([#46](https://github.com/zakodium-oss/react-roi/issues/46)) ([6963ba3](https://github.com/zakodium-oss/react-roi/commit/6963ba3424b8bf915965f90a209c094fa07ea367)), closes [#37](https://github.com/zakodium-oss/react-roi/issues/37)
* prevent scrolling while zooming ([3162404](https://github.com/zakodium-oss/react-roi/commit/31624049501c15df3752e0d7073cb7144c19150b))
* rescale roi before updating ([#42](https://github.com/zakodium-oss/react-roi/issues/42)) ([c7068d0](https://github.com/zakodium-oss/react-roi/commit/c7068d08bb6ad9d7aa169b9e34e10f439c81139e))
* unselect roi when cancelling a draw action ([a947c09](https://github.com/zakodium-oss/react-roi/commit/a947c0998e1ae677c0463e1bdac0e63482b3097c))


### Documentation

* add scroll stories ([556c9c2](https://github.com/zakodium-oss/react-roi/commit/556c9c210c74f06a9ffe51ef38a8230fb890732e))
* add stories who update a label ([67ff936](https://github.com/zakodium-oss/react-roi/commit/67ff93662cdc0ca81f15d7f22e0c0d275d8fcfaa))
* fix layout of zoom story ([26c12ef](https://github.com/zakodium-oss/react-roi/commit/26c12ef2719041d2573873d813c701a92df31ae6))

## [0.3.0](https://github.com/zakodium-oss/react-roi/compare/v0.2.0...v0.3.0) (2023-09-08)


### Features

* add panZoom feature ([c1b6710](https://github.com/zakodium-oss/react-roi/commit/c1b6710a1f5135f44b75ad062d8e8ad61a8653c9))
* add RoiList component ([59e380d](https://github.com/zakodium-oss/react-roi/commit/59e380d0e948f6fec3d56dede1d4b04333758994))


### Bug Fixes

* hide content overflowing the container ([c99f839](https://github.com/zakodium-oss/react-roi/commit/c99f8397c10758f0e96ce9fa9865ce5305749915))


### Documentation

* intiated roi with styled label ([bdbdd3b](https://github.com/zakodium-oss/react-roi/commit/bdbdd3b0a2fa04616108cbf8f1b13288592e1f9c))

## [0.2.0](https://github.com/zakodium-oss/react-roi/compare/v0.1.0...v0.2.0) (2023-08-28)


### ⚠ BREAKING CHANGES

* add API implementation close #20 ([#21](https://github.com/zakodium-oss/react-roi/issues/21))

### Code Refactoring

* add API implementation close [#20](https://github.com/zakodium-oss/react-roi/issues/20) ([#21](https://github.com/zakodium-oss/react-roi/issues/21)) ([7265658](https://github.com/zakodium-oss/react-roi/commit/72656588223ea42ad025c3a69e51176dfa4745fe))

## [0.1.0](https://github.com/zakodium-oss/react-roi/compare/v0.0.2...v0.1.0) (2023-07-06)


### Features

* add preview github action ([ee66266](https://github.com/zakodium-oss/react-roi/commit/ee66266ec03ea795114680f38aa68c992c25ab5d))
* allow to work with images and div elements close [#18](https://github.com/zakodium-oss/react-roi/issues/18) ([#19](https://github.com/zakodium-oss/react-roi/issues/19)) ([3cf310f](https://github.com/zakodium-oss/react-roi/commit/3cf310f0a28ecc15c28eadf72861b762d3a22270))

## [0.0.2](https://github.com/zakodium-oss/react-roi/compare/v0.0.1...v0.0.2) (2023-06-29)


### Bug Fixes

* remove private ([61c81cf](https://github.com/zakodium-oss/react-roi/commit/61c81cf774900963df6c285f047ecbbe8d76c5b3))

## 0.0.1 (2023-06-29)


### Features

* add moveable page ([aed693c](https://github.com/zakodium-oss/react-roi/commit/aed693c137403f2b8e51981130bfb73075166d14))
* rename package to react-roi ([4fa1fdc](https://github.com/zakodium-oss/react-roi/commit/4fa1fdc92113c08f40017d8a1b1a4f0454f27c5f))


### Bug Fixes

* allow the addition of multiple rectangles ([c2b7752](https://github.com/zakodium-oss/react-roi/commit/c2b775238a10fa581f930e9bc706c8dfe5776532))
* allow to resize the image ([2cbef46](https://github.com/zakodium-oss/react-roi/commit/2cbef46b8faae31f660b6b3fd1939a2d1dbb0d9e))


### release-as

* 0.0.1 ([9bb690e](https://github.com/zakodium-oss/react-roi/commit/9bb690ea3f4788d3d71988b121948cd392e472db))
