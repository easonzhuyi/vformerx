import axios from 'axios'
import { V_FORMER_SERVER } from '@/api'

const separator = '-';
const __debug__ = true;
const __mock_delay__ = 800;

const settings = {
    vux: null,
    values: {},
    templates: {},
    rules: {},
    dependencies: {}
}

/**
 * 表单的配置信息，格式参考 JSON 文件
 * @typedef {Object} FormModels 
 */

/**
 * @typedef {Object} FormModelItem
 * @property {string} page - 页
 * @property {string} form - 表单
 * @property {string} name - 表单元素
 * @property {Object} model - 表单元素对象
 */

/**
* 字段名对象，包括：页名、表单名、元素名等
* @typedef {Object} Field
* @property {string} page - 页
* @property {string} form - 表单
* @property {string} name - 表单元素
*/

/** 
 * 验证规则
 * @typedef {Object} Rule
 * @property {string} name
 * @property {boolean} server
 * @property {string} self
 * @property {string[]} fields
 * @property {string} template
 * @property {function} callback
 */

/**
 * 验证任务
 * @typedef {Object} Job
 * @property {string} self - 当前元素的全名
 * @property {string[]} fields - 参数名列表
 * @property {string[]} values - 参数值列表
 * @property {string} type - 当前元素的类型，可以为：string / number / date / address
 * @property {boolean} server - 是否为远程验证
 * @property {string} template - 验证模板的名称，可以是本地 templates 中的，也可以是远程服务器中的名称
 * @property {function} callback - 验证函数
 */



/**
 * 将 Field 格式的值连接成完整的名称
 * @param {Field} field - 字段名对象
 */
function fullname(field) {
    return `${field.page}${separator}${field.form}${separator}${field.name}`;
}

/**
 * 遍历所有表单元素
 * @param {FormModels} models - 表单对象
 * @param {function(FormModelItem)} callback - 回调函数，每找到一个元素，就执行此函数
 */
function map(models, callback) {
    for (let page in models) {
        for (let form in models[page]) {
            for (let name in models[page][form]) {
                callback({
                    page, form, name,
                    model: models[page][form][name]
                });
            }
        }
    }
}

/**
 * 载入参数列表对应的值
 * @param {string[]} fields  - 验证规则的参数名列表
 */
function loadParams(fields) {
    return fields.map(item => settings.values[item]);
}

/**
 * 执行本地验证任务
 * @param {Job} job - 验证任务
 */
function executeLocalJob(job) {

    function $$(column) {
        return job.values[column];
    }

    $$.type = function () {
        return job.type;
    }

    $$.number = function (column) {
        return parseInt($$(column))
    }

    $$.fail = function (column, reason) {
        return {
            pass: false,
            reason: 'error_msg'
        }
    }
    $$.stamp = function (column) {
        return parseInt(Date.parse($$(column)))
    }

    $$.pass = function () {
        return {
            pass: true
        }
    }

    return job.callback($$);
}

/**
 * 执行远程验证任务
 * @param {Job} job - 验证作务
 * @param {function} callback - 执行完成之后的回调函数
 */
function executeRemoteJob(job, callback) {
    if (job.length === 0) {
        callback({pass: true});
    } else {
        settings.vux.loading.show({
            text: '正在验证'
        });

        // 此处用于调试，当 __mock_delay__ 大于 0 时，会模拟一个请求延迟的效果
        setTimeout(() => {
            axios.post(V_FORMER_SERVER, job).then(response => {
                callback(response.data);
            }).catch((error) => {
                console.log(error)
                callback({
                    pass: false,
                    reason: error.toString()
                })
            })
        }, (__debug__ && __mock_delay__) ? __mock_delay__ : 0);
    }
}

/**
 * 创建验证规则
 * @param {string} page - 页名
 * @param {string} form - 表单名
 * @param {string} name - 元素名
 * @param {Validator[]} v - 从配置文件读出的验证规则
 * @returns {Rule} 返回创建的验证规则对象
 */
function createRule(page, form, name, v) {
    let callback, template;
    let fname = fullname({ page, form, name });

    let fields = v.fields.map(f => {
        // 如果元素名称不是全名，根据当前元素的位置，动态补全
        if (f.split(separator).length === 1) {
            return `${page}${separator}${form}${separator}${f}`;
        } else {
            return f;
        }
    });

    let server = v.server ? true : false;

    // 如果是远程验证，则保留 template 名称；如果是本地验证，则使用 templates 的回调函数替换
    if (server) {
        template = v.template;
    } else {
        callback = v.template ? settings.templates[v.template]
            : eval(`$$ => {${v.codes}}`);
    }

    return {
        name: v.name,
        server: server,
        self: fname,
        fields: fields,
        template: template,
        callback: callback
    }
}

/**
 * 加挂依赖规则
 * @param {FormModelItem} item - 根据表单元素来创建依赖规则，并加挂到 settings.rules / settings.dependencies
 */
function addRulesDependencies(item) {
    // 将当前节点的验证规则加入 settings.rules 中
    let fname = fullname(item);
    let rules = settings.rules[fname] || [];

    (item.model.validators || []).forEach(v => {
        let rule = createRule(item.page, item.form, item.name, v);
        rules.push(rule);

        // 将依赖关系写入 settings.dependencies 中
        v.fields.forEach(f => {
            settings.dependencies[f] = settings.dependencies[f] || [];
            settings.dependencies[f].push(rule);
        })
    })

    settings.rules[fname] = rules;
}

/**
 * 根据验证规则，生成验证任务
 * @param {FormModels} models 
 * @param {Rule[]} rules 
 */
function createJobs(models, rules) {
    let jobs = [];

    rules.forEach(rule => {
        // 载入当前表单元素的值
        let value = settings.values[rule.self];
        // 载入参数列表的值
        let params = loadParams(rule.fields);
        // 将全名分解为三段式
        let parts = rule.self.split(separator);

        jobs.push({
            self: rule.self,
            fields: rule.fields,
            values: [value].concat(params),
            type: models[parts[0]][parts[1]][parts[2]].type,
            server: rule.server,
            template: rule.template,
            callback: rule.callback
        })
    })

    return jobs;
}

/**
 * 将验证规则分类为“本地规则列表”和“远程规则列表”
 * @param  {...Rule} rules 
 */
function divideRules(...rules) {
    let localRules = [], remoteRules = [];

    for (let i = 0; i < rules.length; i++) {
        (rules[i] || []).forEach(rule => {
            (rule.server ? remoteRules : localRules).push(rule);
        })
    }

    return { localRules, remoteRules }
}



/**
 * 初始化，根据配置文件生成初始结构，爬出相关依赖
 * @param {FormModels} models - formModels 对应 state.formModels
 * @param {Object} templates - 对应 state.templates ，保存已经定义好的通用规则
 * @param {Object} vux - Vux 对象，用于在 Ajax 过程中显示蒙板
 */
export function initialize(models, templates, vux) {

    // 重置内部变量
    settings.values = {};
    settings.templates = {};
    settings.rules = {};
    settings.dependencies = {};

    // 设置 vux 实例
    settings.vux = vux;

    // 根据配置文件，生成通用规则的方法列表
    for (let key in templates) {
        settings.templates[key] = eval(`$$ => {${templates[key]}}`);
    }

    // 生成验证规则，计算依赖关系
    map(models, item => {
        addRulesDependencies(item);
    })
}

/**
 * 根据新增元素，更新依赖表
 * @param {FormModels} models - formModels 对应 state.formModels
 * @param {string} page - 新增的表单所在的页名称
 * @param {string} form - 新增的表单的名称
 */
export function update(models, page, form) {
    for (let name in models[page][form]) {
        addRulesDependencies({
            page, form, name,
            model: models[page][form][name]
        })
    }
}

/**
 * 绑定表单的值
 * @param {FormModels} models - formModels 对应 state.formModels
 * @param {Object} data - 数据，其中，data.name 表单名称
 * @param {string} page - 页
 */
export function bind(models, data, page) {
    for (let key in data.value) {
        let value = data.value[key]

        settings.values[fullname({
            page, form: data.name, name: key
        })] = value;

        models[page][data.name][key].value = value
    }
}

/**
 * 验证表单元素
 * @param {FormModels} models - formModels 对应 state.formModels
 * @param {Field} field - 指明当前的表单元素
 */
export function validate(models, field) {
    return new Promise((resolve, reject) => {
        let result = { pass: true };
        let fname = fullname(field);
        let rules = settings.rules[fname];
        let dependencies = settings.dependencies[fname];

        // 将全部验证规则，划分为本地和远程两个队列
        let { localRules, remoteRules } = divideRules(rules, dependencies);

        // 优先执行本地验证规则
        let localJobs = createJobs(models, localRules);
        localJobs.forEach(job => {
            result.pass && (result = executeLocalJob(job))
        })

        // 若本地验证不通过，直接返回，并给出错误提示
        if (!result.pass) {
            resolve(result);
            return;
        }

        // 若本地验证均通过，则将所有远程验证规则合并，一次性请求，并得到验证结果
        let remoteJobs = createJobs(models, remoteRules);
        executeRemoteJob(remoteJobs, result => {
            resolve(result);
        })
    });
}