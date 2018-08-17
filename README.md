# vsiren-cli
> A Vue.js project Multiple Entry

## 目录结构说明

- 路由按目录划分，即每个页面对应一个文件夹，每个文件夹包含 index.js,
  main.vue。具体请参考demo
- 路由名称和文件夹保持一致(重要)
- 全面弃用sass. sass对平台的一致性要求太高，node版本不一致或者`npm install` 都会导致node-sass需要重新编译。

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8100
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run createEntry
npm run createEntry target

# run mdev    run dev & mock
npm run mdev

# run all tests
npm test
```

## API MOCK

API : src/api/index.js

``` bash
export const I_HEALTHINFORM = path(healthInform)

export const I_HEALTHINFORM = path(healthInform， true)

true : local mock   mock data from service/mock

false: origin mock

open snap  dir path = service/snap

server/server.js  config origin host

example

var crosshost = 'https://easy-mock.com'

```

## formModel返回数据说明

| 类型            | 返回值 | 备注       |
| --------------- | ------ | ---------- |
| za-select       | String |            |
| za-input        | String |            |
| za-button_group | String |            |
| hidden          | String |            |
| za-text         | String | 值无法修改 |
| za-address      | Object |            |
| za-date         | String |            |
| za-sex          | String |            |
| za-yesno        | String |            |
| za-textarea     | String |            |
| Title           |        | 无返回值   |

