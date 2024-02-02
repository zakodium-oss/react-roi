# Changelog

## [0.14.0](https://github.com/zakodium-oss/react-roi/compare/v0.13.1...v0.14.0) (2024-02-02)


### ⚠ BREAKING CHANGES

* action callback defined as props of the provider instead of the container. Action callbacks like onDrawFinish no longer responsible for making the action.

### Features

* set initial zoom level and add onAfterZoomChange callback ([d819099](https://github.com/zakodium-oss/react-roi/commit/d819099639384c6876e7b024e2f0bfc9e4f26f3e))

## [0.13.1](https://github.com/zakodium-oss/react-roi/compare/v0.13.0...v0.13.1) (2024-02-01)


### Bug Fixes

* add vendor prefix for userSelect property ([375ec57](https://github.com/zakodium-oss/react-roi/commit/375ec5743fb22c5c38ac97b7f5ff93ed1bc84a4b))
* disable touch action on the container ([6085bd3](https://github.com/zakodium-oss/react-roi/commit/6085bd325d4b561bf92d1c887f8fc37e7cf4faa1))

## [0.13.0](https://github.com/zakodium-oss/react-roi/compare/v0.12.1...v0.13.0) (2024-02-01)


### Features

* change mouse event to pointer for extended devices compatibility ([732031e](https://github.com/zakodium-oss/react-roi/commit/732031e958798968af71270cd8dd993b00f526f4))

## [0.12.1](https://github.com/zakodium-oss/react-roi/compare/v0.12.0...v0.12.1) (2024-01-31)


### Bug Fixes

* use strict types ([5c1094c](https://github.com/zakodium-oss/react-roi/commit/5c1094cd7eb15aaad50ce3256d3a59115e9cac1a))

## [0.12.0](https://github.com/zakodium-oss/react-roi/compare/v0.11.0...v0.12.0) (2024-01-29)


### Features

* add getNewRoiData prop to initialize roi data on draw ([fde6a87](https://github.com/zakodium-oss/react-roi/commit/fde6a87e35ba9d97b3f9677c7495c9ea388c8a2c))
* on create, move and resize hooks ([99c3782](https://github.com/zakodium-oss/react-roi/commit/99c3782c85377350841431782e3d3fdeb2714af8))
* preserve spaces in label ([039084a](https://github.com/zakodium-oss/react-roi/commit/039084a2f35daef98056bb58badfff47867e7adb))

## [0.11.0](https://github.com/zakodium-oss/react-roi/compare/v0.10.1...v0.11.0) (2024-01-23)


### Features

* allow custom svg to be produced which enables filling roi with custom patterns ([c236822](https://github.com/zakodium-oss/react-roi/commit/c2368224d1bf91758bb0ead517b62b8224e48f0a))

## [0.10.1](https://github.com/zakodium-oss/react-roi/compare/v0.10.0...v0.10.1) (2024-01-23)


### Bug Fixes

* reset TargetImage style properties which can influence it's dimensions ([92e5f3c](https://github.com/zakodium-oss/react-roi/commit/92e5f3c92316dfeeb3c986d8f22bf08d09e5f88c))

## [0.10.0](https://github.com/zakodium-oss/react-roi/compare/v0.9.0...v0.10.0) (2024-01-23)


### ⚠ BREAKING CHANGES

* introduce new hybrid mode

### Features

* add option to initial config to configure initial mode ([1641606](https://github.com/zakodium-oss/react-roi/commit/1641606a97c780d225472ac9269171c5bc2454c4))
* introduce new hybrid mode ([26f71ed](https://github.com/zakodium-oss/react-roi/commit/26f71ed81528a444ed0fa30b3be278cba866d5c2))


### Bug Fixes

* send the container size only when it has a non-zero size ([aed07f9](https://github.com/zakodium-oss/react-roi/commit/aed07f99fbba1b0aa43f38d155903800a9ebcd38))

## [0.9.0](https://github.com/zakodium-oss/react-roi/compare/v0.8.1...v0.9.0) (2024-01-22)


### ⚠ BREAKING CHANGES

* always use target coordinate system in rois and snap roi to pixel ([#93](https://github.com/zakodium-oss/react-roi/issues/93))

### Features

* always use target coordinate system in rois and snap roi to pixel ([#93](https://github.com/zakodium-oss/react-roi/issues/93)) ([443d0c4](https://github.com/zakodium-oss/react-roi/commit/443d0c422fa8772b45a54befecfb67a9d0b9c9de))


### Bug Fixes

* handle size must be at least 1 ([8132008](https://github.com/zakodium-oss/react-roi/commit/8132008cc26f7213fb28c5198af817ca7c58bca7))
* render roi label with constant font size ([4e6d903](https://github.com/zakodium-oss/react-roi/commit/4e6d90393bd2fab716f858068837a28d03f72f75))

## [0.8.1](https://github.com/zakodium-oss/react-roi/compare/v0.8.0...v0.8.1) (2024-01-10)


### Bug Fixes

* allow to pan hover a readOnly roi and other edge cases ([#90](https://github.com/zakodium-oss/react-roi/issues/90)) ([a876b43](https://github.com/zakodium-oss/react-roi/commit/a876b43cba2f65e8cf57702a3cb82d175ea01069))

## [0.8.0](https://github.com/zakodium-oss/react-roi/compare/v0.7.0...v0.8.0) (2023-12-15)


### Features

* add lockZoom & lockPan ([#86](https://github.com/zakodium-oss/react-roi/issues/86)) ([ea7577f](https://github.com/zakodium-oss/react-roi/commit/ea7577f7dc4dd9e16044ed9ca8ac2a47d5026335))
* add spaceAroundTarget zoom option ([#87](https://github.com/zakodium-oss/react-roi/issues/87)) ([280ea22](https://github.com/zakodium-oss/react-roi/commit/280ea22855ef07d521a9524023179154700092c5))

## [0.7.0](https://github.com/zakodium-oss/react-roi/compare/v0.6.1...v0.7.0) (2023-12-08)


### ⚠ BREAKING CHANGES

* there are no keyboard shortcuts anymore, those must be configured by the user

### Features

* add noUnselection prop to prevent unselect by clicking in the container outside of any ROI ([b42f894](https://github.com/zakodium-oss/react-roi/commit/b42f8941652581478d05df4659ef3892d103e6b7))
* add selectRoi action ([8fa6c81](https://github.com/zakodium-oss/react-roi/commit/8fa6c81c720f5cb39a82dab607a8f5c06429a1e1))
* initial selection of an ROI ([597133f](https://github.com/zakodium-oss/react-roi/commit/597133fa53606d0b2759b53e0a4772962265683b))
* remove react-kbs, add cancelAction aciton  and add TargetImage component ([#76](https://github.com/zakodium-oss/react-roi/issues/76)) ([ee07373](https://github.com/zakodium-oss/react-roi/commit/ee0737337ffb7d0b3299007514ddd5f63d4960c9))

## [0.6.1](https://github.com/zakodium-oss/react-roi/compare/v0.6.0...v0.6.1) (2023-12-01)


### Bug Fixes

* make roi move sync with mouse ([#73](https://github.com/zakodium-oss/react-roi/issues/73)) ([b244c2c](https://github.com/zakodium-oss/react-roi/commit/b244c2ca624a18bd7b1953ab37ad17b0e4b5ff36))

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
