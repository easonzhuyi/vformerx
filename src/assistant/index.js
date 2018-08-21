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

function validateField (callback, formValues, thisField, ...field) {
    let values = [ thisField.value ];

    field.forEach(key => {
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
            reason: reason
        }
    }
  
    $$.pass = function () {
        return {
            pass: true
        }
    }
      
    return callback($$);
}

function executeValidator(state, validators, fieldObj, templates) {
    if (typeof validators === 'undefined') {
        return
    }

    validators.forEach(v => {
        let codes = v.template ? `$$ => {${templates[v.template]}}` : `$$ => {${v.codes}}`
        let callback = eval(codes)
        let result = validateField(callback, state.formValues, fieldObj, ...v.fields)
        
        console.log(result)
    })
}

function findDependenciesByField(models, obj, page, form, name) {
    console.log(`${page}-${form}-${name}`)
    let fieldObj = models[page][form][name];

    console.log(fieldObj.validators)
    (fieldObj.validators).forEach(vv => {
        console.log(vv)
    })

    (fieldObj.validators || []).forEach(v => {
        (v.fields || []).forEach(target => {
            obj[target] = obj[target] || []
            obj[target].push({
                name: fullname({page, form, name}),
                validator: v.name
            })
        })
    })
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

function depend({obj, models, page, form, name}) {
    (models[page][form][name].validators || []).forEach(v => {
        (v.fields || []).forEach(target => {
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

    executeValidator(state, fieldObj.validators, fieldObj, templates)

    let dependencies = state.config.dependencies[fullname(field)];
    (dependencies || []).forEach(dep => {
        fieldObj = findFieldObjectByName(state.config, dep.name)
        let validators = fieldObj.validators || [];

        executeValidator(state, 
            validators.filter(v => v.name === dep.validator), fieldObj, templates)
    })
}