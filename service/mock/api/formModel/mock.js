/**
 * Equals{
   @Override
   public String toString() {
      return "等于";
   }
},EqualsIgnoreCase{
   @Override
   public String toString() {
      return "等于(不分大小写)";
   }
}, NotEquals{
   @Override
   public String toString() {
      return "不等于";
   }
}, NotEqualsIgnoreCase{
   @Override
   public String toString() {
      return "不等于(不分大小写)";
   }
}, LessThen{
   @Override
   public String toString() {
      return "小于";
   }
}, LessThenEquals{
   @Override
   public String toString() {
      return "小于等于";
   }
}, GreaterThen{
   @Override
   public String toString() {
      return "大于";
   }
}, GreaterThenEquals{
   @Override
   public String toString() {
      return "大于等于";
   }
}, In{
   @Override
   public String toString() {
      return "在集合中";
   }
}, NotIn{
   @Override
   public String toString() {
      return "不在集合中";
   }
}, StartWith{
   @Override
   public String toString() {
      return "开始于";
   }
}, NotStartWith{
   @Override
   public String toString() {
      return "不开始于";
   }
}, EndWith{
   @Override
   public String toString() {
      return "结束于";
   }
}, NotEndWith{
   @Override
   public String toString() {
      return "不结束于";
   }
}, Null{
   @Override
   public String toString() {
      return "为空";
   }
}, NotNull{
   @Override
   public String toString() {
      return "不为空";
   }
}, Match{
   @Override
   public String toString() {
      return "匹配";
   }
}, NotMatch{
   @Override
   public String toString() {
      return "不匹配";
   }
}, Contain{
   @Override
   public String toString() {
      return "包含";
   }
}, NotContain{
   @Override
   public String toString() {
      return "不包含";
   }
};
 */

// export const baseChecks = {
//     // 相等
//     quals: `
//         if ($$.number(0) == $$.number(1)) {
//             return $$.pass()
//         } 
//         return $$.fail(0, '数据不相等') 
//     `,
//     // 不相等
//     notEquals: `
//         if ($$.number(0) != $$.number(1)) {
//             return $$.pass()
//         } 
//         return $$.fail(0, '数据相等') 
//     `,
//     // 大于
//     greaterThen: `
//         if ($$.number(0) > $$.number(1)) {
//             return $$.pass()
//         } 
//         return $$.fail(0, '必须大于') 
//     `,
//     // 小于
//     LessThen: `
//         if ($$.number(0) < $$.number(1)) {
//             return $$.pass()
//         } 
//         return $$.fail(0, '必须小于') 
//     `,
//     // // 等于(不分大小写)
//     // equalsIgnoreCase: `
        
//     // `
// }
/**
 * 1. 根据验证表单生成反映射表
 *  - 表名 field validators[验证名] 
 * ```
 * p1-form1-income : [验证名,验证名,验证名],
 * p1-form1-text : [验证名,验证名,验证名],
 * ```
 * 2. 根据反映射表判断当前的验证是否需要执行
 *   - 只验证改变的值
 *   - 执行被改变值的验证函数
 *   - 执行有关于它的验证函数名
 */
// const fd = {
//     p1: {
//         f1: {
//             name: {
//                 value: '',
//                 rules: {},
//                 validators:[
//                     {
//                         name:'nameV',
//                         fields: ['p1-f1-sex']
//                     }
//                 ]
//             },
//             sex: {
//                 value: '',
//                 rules: {},
//                 validators:[
//                     {
//                         name:'sexV',
//                         fields: ['p1-f1-name']
//                     }
//                 ]
//             },
//         }
//     }
// }
// const dev = {
//     'p1-f1-name': ['sexV'],
//     'p1-f1-sex': ['nameV'],
// }

const wrapper = function (value) {
    return {
        success: true,
        errorMsg: '',
        value
    }
}

const formModels = {
    templates: {        
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

        'GreaterThan': `
            if ($$(0).equals($$(1)) {
                return $$.pass();
            } else {
                return $$.fail(0, '必须大于')
            }
        `
    },
    // dependencies: {
    //     'p2-form1-tax': [
    //         {
    //             name: 'p1-form1-income',
    //             validator: 'GreaterThan'
    //         }
    //     ]
    // },
    p1: {
        'form1': {
            income: {
                name: '父母年龄',
                value: '',
                type: 'string', // number / date / string / address
                rules: {
                    label: '父母',
                    type: 'za-input',
                    vRules: 'required|min:1|max:8',
                    placeholder: '请输入',
                    errorMsg: '请输入如何看待寿险营销',
                },
                validators: [
                    // {
                    //     name: '验证父母年龄',
                    //     fields: ['p2-form1-tax'],
                    //     codes: `
                    //       console.log($$.type(0));
                    //       console.log($$.type(1));
                    //       if ($$.number(0) > $$.number(1)) {
                    //           return $$.pass()
                    //       } else {
                    //           return $$.fail(0, '父母的年龄小于子女的年龄') 
                    //       }`
                    // },
                    {
                        name: 'GreaterThan', 
                        fields: ['p2-form1-tax'],
                        template: 'Equals'
                    }
                ],
            },
            text: {
                value: '',
                rules: {
                    label: '本人',
                    type: 'za-input',
                    vRules: 'required|min:1|max:8',
                    placeholder: '请输入',
                    errorMsg: '请输入',
                },
            },
            childen: {
                value: '',
                rules: {
                    label: '子女',
                    type: 'za-input',
                    vRules: 'required|min:1|max:3',
                    placeholder: '请输入',
                    errorMsg: '请输入',
                },
                validators: [
                    {
                        name: '验证子女年龄',
                        fields: ['p1-form1-text'],
                        baseChecks:['LessThen']
                    }
                ],
            },
            // relation: {
            //     value: '',
            //     rules: {
            //       label: '关系',
            //       type: 'za-select',
            //       vRules: 'required',
            //       placeholder: '请选择',
            //       showName: true,
            //       errorMsg: '请选择',
            //       options: [
            //         [
            //             {value: 'self',name: '本人'},
            //             {value: 'sexPartner', name: '情侣'},
            //             {value: 'else', name: '其他'}
            //         ]
            //         ]
            //     }
            // },
            // sex1: {
            //     value: '',
            //     rules: {
            //         label: 'sex1',
            //         type: 'za-sex',
            //         vRules: 'required',
            //         placeholder: '请选择',
            //         errorMsg: '请选择性别',
            //     },
            //     validators: [
            //         {
            //             fields: ['p1-form1-relation','p1-form1-sex2'],
            //             codes: `
            //             if (!$$(1)) {
            //             return $$.fail(0, '请选择关系') 
            //             }
            //             if($$(1) == 'sexPartner' && $$(0) == $$(2)) {
            //             return $$.fail(0, '性别相同，如何恋爱') 
            //             }
            //             if($$(1) == 'self' && $$(0) != $$(2)) {
            //             return $$.fail(0, '性别必须相同') 
            //             }
            //             return $$.pass()
            //             `,
            //             // baseChecks:['quals','equalsIgnoreCase']
            //         }

            //     ],
            // },
            // sex2: {
            //     value: '',
            //     rules: {
            //         label: 'sex2',
            //         type: 'za-sex',
            //         vRules: 'required',
            //         placeholder: '请选择',
            //         errorMsg: '请选择性别',
            //     }
            // },
            
        },
        'form2': {
            
        }
    },
    p2: {
        'form1': {
            D: {
                value: '',
                type: 'numbers',
                rules: {
                    label: '美元',
                    type: 'za-input',
                    vRules: 'required|min:1|max:8',
                    placeholder: '请输入',
                    errorMsg: '请输入如何看待寿险营销',
                },
                fillers: [
                    {
                        name: '换算成人民币',
                        fillers: ['p2-form1-RMB'],
                        codes: `
                           
                        `   
                        // $$(1) = $$(0) * 6  console.log('eval=>', $$(0), $$(1))
                    }
                ]
            },
            RMB: {
                value: '',
                rules: {
                    label: '人民币',
                    type: 'za-input',
                    vRules: 'required|min:1|max:8',
                    placeholder: '请输入',
                    errorMsg: '请输入',
                },
            }
        }
    },
    p3: {
        'form1': {
            other: {
                value: '',
                rules: {
                    label: 'Others',
                    type: 'za-input',
                    vRules: 'required|min:1|max:8',
                    placeholder: '请输入',
                    errorMsg: '请输入如何看待寿险营销',
                    extra: {
                        text: '万元'
                    }
                }
            }
        }
    },
    p4: {
        form1: {
            name: {
                value: '',
                rules: {
                    label: '姓名',
                    type: 'za-input',
                    vRules: 'required',
                    placeholder: '请输入',
                    errorMsg: '请输入姓名',
                },
                // validators: [
                //     {
                //         name: '验证父母年龄',
                //         fields: ['p1-form1-text'],
                //         codes: `
                //           if ($$.number(0) > $$.number(1)) {
                //               return $$.pass()
                //           } else {
                //               return $$.fail(0, '父母的年龄小于子女的年龄') 
                //           }`,
                //         baseChecks:['greaterThen']
                //     }
                // ],
            },
            sex: {
                value: '',
                rules: {
                    label: '性别',
                    type: 'za-sex',
                    vRules: 'required',
                    errorMsg: '请选择',
                },
            },
            date: {
                value: '',
                rules: {
                    label: '出生日期',
                    type: 'za-date',
                    vRules: 'required',
                    placeholder: '请输入',
                    errorMsg: '请输入',
                },
                // validators: [
                //     {
                //         name: '验证子女年龄',
                //         fields: ['p1-form1-text'],
                //         baseChecks:['LessThen']
                //     }
                // ],
            },
        },
        form2: {
            relation: {
                value: '',
                rules: {
                  label: '是被保人',
                  type: 'za-select',
                  vRules: 'required',
                  placeholder: '请选择',
                  showName: true,
                  errorMsg: '请选择',
                  options: [
                    [
                        {value: 'self',name: '本人'},
                        {value: 'sexPartner', name: '情侣'},
                        {value: 'else', name: '其他'}
                    ]
                    ]
                }
            },
            name: {
                value: '',
                rules: {
                    label: '姓名',
                    type: 'za-input',
                    vRules: 'required',
                    placeholder: '请输入',
                    errorMsg: '请输入姓名',
                },
                // validators: [
                //     {
                //         name: '验证父母年龄',
                //         fields: ['p1-form1-text'],
                //         codes: `
                //           if ($$.number(0) > $$.number(1)) {
                //               return $$.pass()
                //           } else {
                //               return $$.fail(0, '父母的年龄小于子女的年龄') 
                //           }`,
                //         baseChecks:['greaterThen']
                //     }
                // ],
            },
            sex: {
                value: '',
                rules: {
                    label: '性别',
                    type: 'za-sex',
                    vRules: 'required',
                    errorMsg: '请选择',
                },
            },
            date: {
                value: '',
                rules: {
                    label: '出生日期',
                    type: 'za-date',
                    vRules: 'required',
                    placeholder: '请输入',
                    errorMsg: '请输入',
                },
                // validators: [
                //     {
                //         name: '验证子女年龄',
                //         fields: ['p1-form1-text'],
                //         baseChecks:['LessThen']
                //     }
                // ],
            },
        },
    }
}

module.exports = payload => wrapper(formModels)