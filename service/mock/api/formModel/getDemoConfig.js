const wrapper = function (value) {
    return {
        success: true,
        errorMsg: '',
        value
    }
}

const formModels = {
	formModels: {
		p1: {
			form1: {
				name: {
					name: '自身年龄',
					value: '',
					type: 'string', // number / date / string / address
					rules: {
						label: '姓名',
						type: 'za-input',
						vRules: 'required|username|usernameLength',
						placeholder: '请输入姓名',
						errorMsg: '请输入姓名',
					},
				},
				genderCode: {
					value: 'M',
					rules: {
						label: '性别',
						type: 'za-sex',
						vRules: 'required',
						placeholder: '请选择',
						errorMsg: '请选择性别',
					},
				},
				birthday: {
					value: '1994-01-01',
					rules: {
						label: '出生日期',
						type: 'za-date',
						vRules: 'required',
						placeholder: '请选择',
						errorMsg: '请输入出生日期',
					}
				},
				cardType: {
					value: '',
					rules: {
						label: '证件类型',
						type: 'za-select',
						showName:true,
						readOnly: false,
						vRules: 'required',
						placeholder: '请选择证件类型',
						options: [[
								{
									"value": "01",
									"name": "身份证"
								},
								{
									"value": "02",
									"name": "护照"
								},
							]],
						errorMsg: '请选择证件类型'
					}
				},
				idCard: {
					value: '',
					rules: {
						label: '证件号码',
						type: 'za-input',
						vRules: 'required|idcard',
						placeholder: '请输入身份证号码',
						errorMsg: '请输入身份证号码'
					}
				},
				ppCard: {
					value: '',
					rules: {
						label: '护照',
						type: 'za-input',
						vRules: 'required|passport',
						placeholder: '请输入护照号码',
            errorMsg: '请输入护照号码'
          },
          validators: [
            {
              name: '校验证件类型',
              fields: ['cardType'],
              codes: `
              if($$(1) == '01') {
                return $$.fail(0,'选择为身份证， 此项不显示!!!')
              } else {
                return $$.pass()
              }
            `
            }
          ]
				},
			}
		}
	}

}

module.exports = payload => wrapper(formModels)