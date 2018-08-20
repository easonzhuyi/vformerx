
const wrapper = function (value) {
    return {
        success: true,
        errorMsg: '',
        value
    }
}
const relationTypes = [
  {name: '本人', value: '00'},
  {name: '配偶', value: '01'},
]
const defaultOccupation = {
  value: '010103',
  rules: {
    label: '职业',
    type:'hidden',
    vRules: 'required',
    placeholder: '请选择',
    showName:true,
    errorMsg: '请选择投保人职业',
    options: [[
      // 默认职业
      {name:'default', value:'010103'}
    ]]
  }
}
const data = {
  page1: {
    f1: {
      name: {
        value: '',
        rules: {
          label: '姓名',
          type: 'za-input',
          vRules: 'required|username|usernameLength',
          placeholder: '请输入姓名',
          errorMsg: '请输入姓名'
        }
      },
      address : {
        value: {
          "province": "",
          "provinceDesc": "",
          "city": "",
          "cityDesc": "",
          "district": "",
          "districtDesc": "",
          "detail": ""
        },
        rules: {
          label: '地址',
          subLabel: 'detail',
          type: 'za-address',
          vRules: 'required',
          showDetail: true,
          errorMsg: '请输入如何看待寿险营销'
        }
      },
      genderCode: {
        value: 'M',
        rules: {
          label: '性别',
          type: 'za-sex',
          vRules: 'required',
          placeholder: '请选择',
          errorMsg: '请输入性别'
        }
      },
      birthday: {
        value: '1980-01-01',
        rules: {
          label: '出生日期',
          type: 'za-date',
          vRules: 'required',
          placeholder: '请选择',
          errorMsg: '请输入出生日期',
          stime:'',
          etime:'',
        }
      }
    },
    f2: {// 被保人信息
      relation: {
        value: '',
        rules: {
          label: '是投保人',
          type: 'za-select',
          vRules: 'required',
          placeholder: '请选择',
          errorMsg: '请选择与投保人的关系',
          showName: true,
          options: [relationTypes]
        }
      },
      relationFristInsure: {
        value: '',
        rules: {
          label: '是被保人',
          type: 'za-select',
          vRules: 'required',
          placeholder: '请选择',
          errorMsg: '请选择与被保人的关系',
          showName: true,
          options: [relationTypes]
        }
      },
      name: {
        value: '',
        rules: {
          label: '姓名',
          type: 'za-input',
          vRules: 'required|username|usernameLength',
          placeholder: '请输入姓名',
          errorMsg: '请输入姓名'
        }
      },
      genderCode: {
        value: 'M',
        rules: {
          label: '性别',
          type: 'za-sex',
          vRules: 'required',
          placeholder: '请选择',
          errorMsg: '请输入性别'
        }
      },
    },
    f3: {// 添加的被保人信息
      genderCode: {
        value: 'F',
        rules: {
          label: '性别',
          type: 'za-sex',
          vRules: 'required',
          placeholder: '请选择',
          errorMsg: '请输入性别'
        }
      }
    },
  }
}
// const data = [
//   {// 表单初始化数据
//     name: {
//       value: '',
//       rules: {
//         label: '姓名',
//         type: 'za-input',
//         vRules: 'required|username|usernameLength',
//         placeholder: '请输入姓名',
//         errorMsg: '请输入姓名'
//       }
//     }
//   },
//   {// 被保人信息
//     name: {
//       value: '',
//       rules: {
//         label: '姓名',
//         type: 'za-input',
//         vRules: 'required|username|usernameLength',
//         placeholder: '请输入姓名',
//         errorMsg: '请输入姓名'
//       }
//     },
//     genderCode: {
//       value: 'M',
//       rules: {
//         label: '性别',
//         type: 'za-sex',
//         vRules: 'required',
//         placeholder: '请选择',
//         errorMsg: '请输入性别'
//       }
//     },
//   },
//   {// 添加的被保人信息
//     genderCode: {
//       value: 'F',
//       rules: {
//         label: '性别',
//         type: 'za-sex',
//         vRules: 'required',
//         placeholder: '请选择',
//         errorMsg: '请输入性别'
//       }
//     }
//   },
// ]
module.exports = payload => wrapper(data)