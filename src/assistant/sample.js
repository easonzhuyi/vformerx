export const config = {

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

    // 定义表单的初始构结
    formModels: {

        // 定义第一个页面
        'page1': {
            'form1': {
                'birthday': {
                    // number / date / string / address
                    type: 'date',
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
            },

            'form2': {
                'birthday': {
                    type: 'date',
                    name: 'birthday',
                    value: '',
                    rules: {
                        label: '本人生日',
                        type: 'za-input',
                        vRules: 'required|min:1|max:8',
                        placeholder: '请输入',
                        errorMsg: '请输入如何看待寿险营销',
                    },
                    validators: [{
                        name: 'birthday',
                        fields: ['page1-form1-birthday'],
                        template: 'Equals'
                    }],
                }
            },
        },

        // 定义第二个页面
        'page2': {},

        // 定义第三个页面
        'page3': {}
    }
}