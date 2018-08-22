# 关联验证说明
> 根据后台服务返回配置文件，生成表单界面，进行多表单项联合验证


## 配置文件
### 通用验证规则
> 在 templates 节点下面，定义通用的验证规则，包括：Equals、EqualsIgnoreCase、NotEquals、NotEqualsIgnoreCase、LessThan、LessThanEquals、GreaterThan、GreaterThanEquals、In、NotIn、StartWith、NotStartWith、EndWith、NotEndWith、Null、NotNull、Match、NotMatch、Contain、NotContain 等

```
// 定义通用的验证规则模板
templates: {

    // 判断相等关系
    'Equals': `
        let ret = false
        switch ($$.type()) {
            case 'number': 
                ret = parseInt($$(0)) === parseInt($$(1))
                break
            case 'date':
                let d1 = new Date($$(0))
                let d2 = new Date($$(1))
                ret = d1.getTime() === d2.getTime()
                break
            case 'string':
                ret = $$(0) === $$(1)
                break
            case 'address':
                ret = false
                break;
        }

        return ret ? $$.pass() : $$.fail(0, '必须相等于')
    `,

    // 判断大于关系
    'GreaterThan': `
        return $$.number(0) > $$.number(1) ? $$.pass() : $$.fail(0, '必须大于')
    `
},
```

### 表单配置
> 此节点定义表单的结构内容和验证规则。层级为：formModels 表单集合 => page 页面 => form 表单 => element 表单无素，表单元素继承了 “vformer” 的配置内容，新增 “type” 字段来声明值的类型。

```
// 定义表单的初始构结
formModels: {

    // 定义第一个页面
    'page1': {
        'form1': {
            'birthday': {
                type: 'date', // number / date / string / address
                name: 'birthday',
                value: '',

                rules: {
                    label: '生日',
                    type: 'za-input',
                    vRules: 'required|min:1|max:8',
                    placeholder: '请输入',
                    errorMsg: '请输入如何看待寿险营销',
                },

                validators: [{
                    name: 'birthday',
                    fields: ['page2-form1-birthday'],
                    template: 'Equals'
                }, {
                    name: 'customized',
                    fields: ['page2-form1-name'],
                    coodes: `
                        return $$.number(0) > $$.number(1) ? 
                            $$.pass() : $$.fail(0, '必须大于')
                    `
                }],
            }
        }
    }
}
```
    
### 指定验证规则
> 在元素上的 validators 数组指定验证规则，若存在 template 属性，则调用相应的通用规则，若不存在，则执行 codes 属性内的自定义代码，$$(n) n=0 为当前元素的值，n>0 为 fields 字段对应的值。

```
validators: [{
    name: 'birthday',
    fields: ['page2-form1-birthday'],
    template: 'Equals'
}, {
    name: 'customized',
    fields: ['page2-form1-name'],
    coodes: `
        return $$.number(0) > $$.number(1) ? 
            $$.pass() : $$.fail(0, '必须大于')
    `
}],
``` 

### 依赖计算
#### 以上面代码为例，我们可以把每个元素的 validators 以及 fields 总结成一个验证关系表，如下：

当前元素 | 验证规则 | 关联元素 
---|---|---
page1-form1-birthday | birthday | page2-form1-birthday 
page1-form1-birthday | customized | page2-form1-name 
page1-form2-birthday | birthday | page1-form1-birthday 

#### 我们可以抽像生成以下表格

当前元素 | 验证规则 | 关联元素 1 | 关联元素 2 | 关联元素 3
---|---|---|---|---
A | V1 | B | C | D
B | V2 | A | D
C | V3 | A | B 
D | V4 | A
 
#### 根据依赖进行反向索引，就得到了下表，每个元素对应它所关联的元素及验证规则

当前元素 | 元素:验证规则 | 元素:验证规则 | 元素:验证规则
---|---|---|---
A | B:V2 | C:V3 | D:V4
B | A:V1 | C:V3 | -
C | A:V1 | - | -
D | A:V1 | B:V2 | -

#### 验证顺序

1. 当执行当前元素 validators 中的所有验证规则
2. 根据依赖表，找出对应的关联元素，并执行关联的验证规则
3. 将错误信息写入 msg 等字段