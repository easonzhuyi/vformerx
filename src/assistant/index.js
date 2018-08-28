import axios from 'axios';
import { V_FORMER_SERVER } from '../api';

/* eslint-disable no-new-func */

const separator = '-';
const debug = true;
const mockDelay = 800;

const settings = {
  vux: null,
  bus: null,
  values: {},
  templates: {},
  rules: {},
  dependencies: {},
};

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
  Object.keys(models).forEach(page => {
    const pageModel = models[page];
    Object.keys(pageModel).forEach(form => {
      const formModel = pageModel[form];
      Object.keys(formModel).forEach(name => {
        const model = formModel[name];
        callback({
          page,
          form,
          name,
          model,
        });
      });
    });
  });
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

  $$.type = function getType() {
    return job.type;
  };

  $$.number = function toNumber(column) {
    return Number.parseInt($$(column), 10);
  };

  $$.stamp = function getStamp(column) {
    return Number.parseInt(Date.parse($$(column)), 10);
  };

  $$.pass = function createPassResult() {
    return {
      pass: true,
    };
  };

  $$.fail = function createFailResult(column, reason) {
    return {
      pass: false,
      reason,
    };
  };

  return job.callback($$);
}

/**
 * 执行远程验证任务
 * @param {Job} job - 验证作务
 * @param {function} callback - 执行完成之后的回调函数
 */
function executeRemoteJob(job, callback) {
  if (job.length === 0) {
    callback({ pass: true });
  } else {
    settings.vux.loading.show({
      text: '正在验证',
    });

    // 此处用于调试，当 mockDelay 大于 0 时，会模拟一个请求延迟的效果
    setTimeout(() => {
      axios.post(V_FORMER_SERVER, job).then(response => {
        callback(response.data.value);
      }).catch((error) => {
        callback({
          pass: false,
          reason: error.toString(),
        });
      });
    }, (debug && mockDelay) ? mockDelay : 0);
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
  const fname = fullname({ page, form, name });
  const fields = v.fields.map(f => {
    // 如果元素名称不是全名，根据当前元素的位置，动态补全
    if (f.split(separator).length === 1) {
      return `${page}${separator}${form}${separator}${f}`;
    }

    return f;
  });


  // 如果是远程验证，则保留 template 名称；如果是本地验证，则使用 templates 的回调函数替换
  const { template, server } = v;
  let callback = null;

  if (!server) {
    callback = template ? settings.templates[template]
      : new Function('$$', v.codes);
  }

  return {
    name: v.name,
    server,
    self: fname,
    fields,
    template,
    callback,
  };
}

/**
 * 加挂依赖规则
 * @param {FormModelItem} item - 根据表单元素来创建依赖规则，并加挂到 settings.rules / settings.dependencies
 */
function addRulesDependencies(item) {
  // 将当前节点的验证规则加入 settings.rules 中
  const fname = fullname(item);
  const rules = settings.rules[fname] || [];

  (item.model.validators || []).forEach(v => {
    const rule = createRule(item.page, item.form, item.name, v);
    rules.push(rule);

    // 将依赖关系写入 settings.dependencies 中
    v.fields.forEach(f => {
      settings.dependencies[f] = settings.dependencies[f] || [];
      settings.dependencies[f].push(rule);
    });
  });

  (item.model.fillers || []).forEach(f => {
    const fillers = settings.fillers[fname] || [];
    const fields = (f.fields || []).map(fi => {
      // 如果元素名称不是全名，根据当前元素的位置，动态补全
      if (fi.split(separator).length === 1) {
        return `${item.page}${separator}${item.form}${separator}${fi}`;
      }
      return fi;
    });

    fillers.push({
      name: f.name,
      codes: f.codes,
      fields,
      target: (f.target.split(separator).length === 1) ? `${item.page}${separator}${item.form}${separator}${f.target}` : f.target,
    });
    settings.fillers[fname] = fillers;
  });

  settings.rules[fname] = rules;
}

/**
 * 根据验证规则，生成验证任务
 * @param {FormModels} models
 * @param {Rule[]} rules
 */
function createJobs(models, rules) {
  const jobs = [];

  rules.forEach(rule => {
    // 载入当前表单元素的值
    const value = settings.values[rule.self];
    // 载入参数列表的值
    const params = loadParams(rule.fields);
    // 将全名分解为三段式
    const parts = rule.self.split(separator);

    jobs.push({
      self: rule.self,
      fields: rule.fields,
      values: [value].concat(params),
      type: models[parts[0]][parts[1]][parts[2]].type,
      server: rule.server,
      template: rule.template,
      callback: rule.callback,
    });
  });

  return jobs;
}

/**
 * 将验证规则分类为“本地规则列表”和“远程规则列表”
 * @param  {...Rule} rules
 */
function divideRules(...rules) {
  const localRules = [];
  const remoteRules = [];

  for (let i = 0; i < rules.length; i += 1) {
    (rules[i] || []).forEach(rule => {
      (rule.server ? remoteRules : localRules).push(rule);
    });
  }

  return { localRules, remoteRules };
}

/**
 * 初始化，根据配置文件生成初始结构，爬出相关依赖
 * @param {FormModels} models - formModels 对应 state.formModels
 * @param {Object} templates - 对应 state.templates ，保存已经定义好的通用规则
 * @param {Object} vux - Vux 对象，用于在 Ajax 过程中显示蒙板
 */
export function initialize(models, templates, vux, bus) {
  // 重置内部变量
  settings.values = {};
  settings.templates = {};
  settings.rules = {};
  settings.dependencies = {};
  settings.fillers = {};

  // 设置 vux 实例
  settings.vux = vux;
  settings.bus = bus;

  // 根据配置文件，生成通用规则的方法列表
  Object.keys(templates).forEach(key => {
    settings.templates[key] = new Function('$$', templates[key]);
  });

  // 生成验证规则，计算依赖关系
  map(models, item => {
    addRulesDependencies(item);
  });
}

/**
 * 根据新增元素，更新依赖表
 * @param {FormModels} models - formModels 对应 state.formModels
 * @param {string} page - 新增的表单所在的页名称
 * @param {string} form - 新增的表单的名称
 */
export function update(models, page, form) {
  Object.keys(models[page][form]).forEach(name => {
    addRulesDependencies({
      page,
      form,
      name,
      model: models[page][form][name],
    });
  });
}

/**
 * 绑定表单的值
 * @param {FormModels} models - formModels 对应 state.formModels
 * @param {Object} data - 数据，其中，data.name 表单名称
 * @param {string} page - 页
 */
export function bind(models, data, page) {
  Object.keys(data.value).forEach(key => {
    const value = data.value[key];
    settings.values[fullname({
      page, form: data.name, name: key,
    })] = value;

    const model = models[page][data.name][key];
    model.value = value;
  });
}

/**
 * 验证表单元素
 * @param {FormModels} models - formModels 对应 state.formModels
 * @param {Field} field - 指明当前的表单元素
 */
export function validate(models, field) {
  return new Promise(resolve => {
    let result = { pass: true };
    const fname = fullname(field);
    const rules = settings.rules[fname];
    const dependencies = settings.dependencies[fname];

    // 将全部验证规则，划分为本地和远程两个队列
    const { localRules, remoteRules } = divideRules(rules, dependencies);

    // 优先执行本地验证规则
    const localJobs = createJobs(models, localRules);
    localJobs.forEach(job => {
      if (result.pass) {
        result = executeLocalJob(job);
      }
    });

    // 若本地验证不通过，直接返回，并给出错误提示
    if (!result.pass) {
      resolve(result);
      return;
    }

    // 若本地验证均通过，则将所有远程验证规则合并，一次性请求，并得到验证结果
    const remoteJobs = createJobs(models, remoteRules);
    executeRemoteJob(remoteJobs, ret => {
      resolve(ret);
    });
  });
}

function compute(name, result) {
  const fillers = settings.fillers[name] || [];
  fillers.forEach(f => {
    const params = loadParams(f.fields);
    const values = [settings.values[name]].concat(params);

    console.log('===============');
    console.log(params);
    console.log(values);
    console.log('===============');

    function $$(column) {
      return values[column];
    }

    $$.number = function toNumber(column) {
      return Number.parseInt($$(column), 10);
    };

    $$.stamp = function getStamp(column) {
      return Number.parseInt(Date.parse($$(column)), 10);
    };

    const callback = new Function('$$', f.codes);
    const value = callback($$);
    result.push({
      name: f.target,
      value,
    });
    settings.values[f.target] = value;
    compute(f.target, result);
  });
}

export function fill(field) {
  const result = [];
  const name = fullname(field);
  compute(name, result);
  return result;
}
