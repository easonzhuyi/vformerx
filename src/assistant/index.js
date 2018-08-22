const separator = '-'

function fullname(obj) {
    return `${obj.page}${separator}${obj.form}${separator}${obj.name}`
}

function findFieldObjectByName(state, name) {
    let parts = name.split(separator)
    return state.formModels[parts[0]][parts[1]][parts[2]]
}

function findFieldObject(state, field) {
    return state.formModels[field.page][field.form][field.name]
}

function validateField (callback, formValues, thisField, info, ...field) {
    let values = [ thisField.value ];

    field.forEach(key => {
        key.split(separator).length === 1
            && (key = `${info.page}${separator}${info.form}${separator}${key}`)

        values.push(formValues[key]);
    });

    function $$(column) {
        return values[column];
    }

    $$.type = function () {
        return thisField.type;
    }

    $$.number = function (column) {
        return parseInt($$(column))
    }
  
    $$.fail = function (column, reason) {
        return {
            pass: false,
            reason: thisField.rules.errorMsg + reason
        }
    }
    $$.stamp = function (column) {
        return parseInt(Date.parse($$(column)))
    }

    $$.type = function () {
        return thisField.type
    }

    $$.pass = function () {
        return {
            pass: true
        }
    }
    // console.log('callback',callback);
    
    return callback($$);
}

function executeValidator(state, validators, fieldObj, field, templates) {
    if (typeof validators === 'undefined') {
        return
    }

    validators.forEach(v => {
        let codes = v.template ? `$$ => {${templates[v.template]}}` : `$$ => {${v.codes}}`
        let callback = evilEval(codes)
        // let callback = eval(codes)
        let result = validateField(callback(), state.formValues, fieldObj, field, ...v.fields)
        console.log(result);
        
    })
}

function evilEval(str) {
    return new Function(`return ${str}`)
}
function map(models, callback) {
    let obj = {};

    for (let page in models) {
        for (let form in models[page]) {
            for (let name in models[page][form]) {
                callback({
                    obj, models, page, form, name
                });
            }
        }
    }

    return obj;
}

function mapPage(models, page, form, callback) {
    let obj = {};
    // console.log(models);
    // for (let form in models[page]) {
        // console.log(models[page][form])
        for (let name in models[page][form]) {
            callback({
                obj, models, page, form, name
            })
        }
    // }

    return obj;
}

function depend({obj, models, page, form, name}) {
    (models[page][form][name].validators || []).forEach(v => {
        (v.fields || []).forEach(target => {
            target.split(separator).length === 1 
                && (target = `${page}${separator}${form}${separator}${target}`)

            obj[target] = obj[target] || [];
            obj[target].push({
                name: fullname({page, form, name}),
                validator: v.name
            })
        })
    })
}

/**
 * @typedef {Object} DataValue
 * @property {string} page - 页名称
 * @property {string} name - 表单名称
 * @property {Object} value - 值
 */

/**
 * 将表单的输入值保存到 store 的 state 里
 * @param {*} state - Vuex 的 state 对象
 * @param {DataValue} data - 包含有输入值的数据包
 */
export function save(state, page, data) {
    for (let key in data.value) {
        let value = data.value[key]

        state.formValues[fullname({
            page: page,
            form: data.name,
            name: key
        })] = value

        state.config.formModels[page][data.name][key].value = value
    }
}

/**
 * 找出配置中的规则依赖，并生成反向依赖表
 * @param {Object} models - 配置
 */
export function findDependencies(models) {
    return map(models, ({obj, models, page, form, name}) => {
        depend({obj, models, page, form, name});
    })
}

export function updateDependencies(dependencies, models, pageName, formName) {
    let dep = mapPage(models, pageName, formName, ({obj, models, page, form, name}) => {
        depend({obj, models, page, form, name});
    });

    // console.log(dep)

    for (let key in dep) {
        if (dependencies[key]) {
            dependencies[key] = [].concat.call(dependencies[key], dep[key]);
            //dependencies[key] = dependencies.concat(dep[key]);
        } else {
            dependencies[key] = [].concat(dep[key]);
        }
    }
}

/**
 * @typedef {Object} Field
 * @property {string} page - 页名称
 * @property {string} form - 表单名称
 * @property {string} name - 表单项名称
 */

/**
 * 验证表单项
 * @param {Object} state - Vuex 的 state 对象
 * @param {Field} field - 表单的名称
 */
export function validate(state, field) {
    let templates = state.config.templates
    let fieldObj = findFieldObject(state.config, field)

    executeValidator(state, fieldObj.validators, fieldObj, field, templates)

    let dependencies = state.config.dependencies[fullname(field)];
    (dependencies || []).forEach(dep => {
        fieldObj = findFieldObjectByName(state.config, dep.name)
        let validators = fieldObj.validators || [];

        let parts = dep.name.split(separator);
        executeValidator(state, 
            validators.filter(v => v.name === dep.validator), fieldObj, {
                page: parts[0],
                form: parts[1],
                name: parts[2]
            }, templates)
    })
}
