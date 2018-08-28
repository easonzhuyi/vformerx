const wrapper = function (value) {
    return {
        success: true,
        errorMsg: '',
        value
    }
}

const formModels = {
  templates: {
		// 相等
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
			return ret ? $$.pass() : $$.fail(0, '必须相等')
		`,
		// 等于(不分大小写)
		'EqualsIgnoreCase': `
			let ret = false
			switch ($$.type()) {
					case 'number': 
							ret = false
							break
					case 'date':
							ret = false
							break
					case 'string':
							ret = $$(0).toUpperCase() == $$(1).toUpperCase()
							break
					case 'address':
							ret = false
							break;
			}
			return ret ? $$.pass() : $$.fail(0, '必须相等(不分大小写)')
		`,
		// 不等于
		'NotEquals': `
			let ret = false
			switch ($$.type()) {
					case 'number': 
							ret = parseInt($$(0)) !== parseInt($$(1))
							break
					case 'date':
							let d1 = new Date($$(0))
							let d2 = new Date($$(1))
							ret = d1.getTime() !== d2.getTime()
							break
					case 'string':
							ret = $$(0) !== $$(1)
							break
					case 'address':
							ret = false
							break;
			}
			return ret ? $$.pass() : $$.fail(0, '必须不等于')
		`,
		// 不等于(不分大小写)
		'NotEqualsIgnoreCase': `
			let ret = false
			switch ($$.type()) {
					case 'number': 
							ret = false
							break
					case 'date':
							ret = false
							break
					case 'string':
							ret = $$(0).toUpperCase() === $$(1).toUpperCase()
							break
					case 'address':
							ret = false
							break;
			}
			return ret ? $$.pass() : $$.fail(0, '必须不等于')
		`,
		// 小于
		'LessThen': `
			let ret = false
			switch ($$.type()) {
					case 'number': 
							ret = parseInt($$(0)) < parseInt($$(1))
							break
					case 'date':
							let d1 = new Date($$(0))
							let d2 = new Date($$(1))
							ret = d1.getTime() < d2.getTime()
							break
					case 'string':
							ret = false
							break
					case 'address':
							ret = false
							break;
			}
			return ret ? $$.pass() : $$.fail(0, '必须小于')
		`,
		// 小于等于
		'LessThenEquals': `
			let ret = false
			switch ($$.type()) {
					case 'number': 
							ret = parseInt($$(0)) <= parseInt($$(1))
							break
					case 'date':
							let d1 = new Date($$(0))
							let d2 = new Date($$(1))
							ret = d1.getTime() <= d2.getTime()
							break
					case 'string':
							ret = false
							break
					case 'address':
							ret = false
							break;
			}
			return ret ? $$.pass() : $$.fail(0, '必须小于等于')
		`,
		// 大于
		'GreaterThan': `
			let ret = false
				switch ($$.type()) {
						case 'number': 
								ret = parseInt($$(0)) > parseInt($$(1))
								break
						case 'date':
								let d1 = new Date($$(0))
								let d2 = new Date($$(1))
								ret = d1.getTime() > d2.getTime()
								break
						case 'string':
								ret = false
								break
						case 'address':
								ret = false
								break;
				}
			return ret ? $$.pass() : $$.fail(0, '必须大于')
		`,
		// 大于等于
		'GreaterThenEquals': `
			let ret = false
				switch ($$.type()) {
						case 'number': 
								ret = parseInt($$(0)) >= parseInt($$(1))
								break
						case 'date':
								let d1 = new Date($$(0))
								let d2 = new Date($$(1))
								ret = d1.getTime() >= d2.getTime()
								break
						case 'string':
								ret = false
								break
						case 'address':
								ret = false
								break;
				}
			return ret ? $$.pass() : $$.fail(0, '必须大于等于')
		`,
		// 在集合中
		'In': `
			let ret = false
				switch ($$.type()) {
						case 'number': 
								ret = false
								break
						case 'date':
								let d1 = new Date($$(0))
								let d2 = new Date($$(1))
								ret = false
								break
						case 'string':
								ret = false
								break
						case 'address':
								ret = false
								break;
				}
			return ret ? $$.pass() : $$.fail(0, '必须在集合中')
		`,
		// 不在集合中
		'NotIn': `
			let ret = false
				switch ($$.type()) {
						case 'number': 
								ret = false
								break
						case 'date':
								let d1 = new Date($$(0))
								let d2 = new Date($$(1))
								ret = false
								break
						case 'string':
								ret = false
								break
						case 'address':
								ret = false
								break;
				}
			return ret ? $$.pass() : $$.fail(0, '必须不在集合中')
		`,
		// 开始于
		'StartWith': `
			let ret = false
				switch ($$.type()) {
						case 'number': 
							let str1 = $$(0) + ''
							let str2 = $$(1) + ''
							ret = str1.startsWith(str2)
							break
						case 'date':
								let d1 = new Date($$(0))
								let d2 = new Date($$(1))
								ret = false
								break
						case 'string':
								ret = $$(0).startsWith($$(1))
								break
						case 'address':
								ret = false
								break;
				}
			return ret ? $$.pass() : $$.fail(0, '必须开始于')
		`,
		// 不开始于
		'NotStartWith': `
			let ret = false
				switch ($$.type()) {
						case 'number': 
								let str1 = $$(0) + ''
								let str2 = $$(1) + ''
								ret = !str1.startsWith(str2)
								break
						case 'date':
								let d1 = new Date($$(0))
								let d2 = new Date($$(1))
								ret = false
								break
						case 'string':
							ret = !$$(0).startsWith($$(1))
							break
						case 'address':
								ret = false
								break;
				}
			return ret ? $$.pass() : $$.fail(0, '必须不开始于')
		`,
		// 结束于
		'EndWith': `
			let ret = false
				switch ($$.type()) {
						case 'number': 
							let str1 = $$(0) + ''
							let str2 = $$(1) + ''
							ret = str1.endsWith(str2)
							break
						case 'date':
							let d1 = new Date($$(0))
							let d2 = new Date($$(1))
							ret = false
							break
						case 'string':
							ret = $$(0).endsWith($$(1))
							break
						case 'address':
							ret = false
							break;
				}
			return ret ? $$.pass() : $$.fail(0, '必须结束于')
		`,
		// 不结束于
		'NotEndWith': `
			let ret = false
				switch ($$.type()) {
						case 'number': 
							let str1 = $$(0) + ''
							let str2 = $$(1) + ''
							ret = !str1.endsWith(str2)
							break
						case 'date':
							let d1 = new Date($$(0))
							let d2 = new Date($$(1))
							ret = false
							break
						case 'string':
							ret = !$$(0).endsWith($$(1))
							break
						case 'address':
							ret = false
							break;
				}
			return ret ? $$.pass() : $$.fail(0, '必须不结束于')
		`,
		// 为空
		'Null': `
			let ret = false
				switch ($$.type()) {
						case 'number': 
							ret = $$(1) === ''
							break
						case 'date':
							ret = $$(1) === ''
							break
						case 'string':
							ret = $$(1) === ''
							break
						case 'address':
							ret = false
							break;
				}
			return ret ? $$.pass() : $$.fail(0, '必须为空')
		`,
		// 不为空
		'NotNull': `
			let ret = false
				switch ($$.type()) {
						case 'number': 
							ret = $$(1) !== ''
							break
						case 'date':
							ret = $$(1) !== ''
							break
						case 'string':
							ret = $$(1) !== ''
							break
						case 'address':
							ret = false
							break;
				}
			return ret ? $$.pass() : $$.fail(0, '必须不为空')
		`,
	},
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
					value: '02',
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
              fields: ['p1-form1-cardType'],
              codes: `
              if($$(0) && $$(1) == '01') {
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