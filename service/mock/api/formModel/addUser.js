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
					},
					validators: [
						{
							name: '验证子女年龄',
							fields: ['p1-form1-text'],
							baseChecks: ['LessThen']
						}
					],
				},
			},
			form2: {
				relation: {
					value: '',
					rules: {
						label: '是投保人',
						type: 'za-select',
						vRules: 'required',
						placeholder: '请选择',
						errorMsg: '请选择与投保人的关系',
						showName: true,
						options: [[
							{ name: '本人', value: '00' },
							{ name: '配偶', value: '01' },
							{ name: '子女', value: '02' },
							{ name: '父母', value: '03' },
							{ name: '其他', value: '06' }
						]]
					}
				},
				name: {
					value: '',
					type: 'string',
					rules: {
						label: '姓名',
						type: 'za-input',
						vRules: 'required|username|usernameLength',
						placeholder: '请输入姓名',
						errorMsg: '姓名',
						readOnly: false
					},
					validators: [
						{
							name: '校验关系',
							fields: ['relation', 'p1-form1-name'],
							codes: `
								if(!$$(1)) {
									return $$.fail(0,'请选择与被保人关系!!!')
								}
								if($$(1) == '00' && $$(2) != $$(0)) {
									return $$.fail(0,'选择本人姓名必须一致')
								}else {
									return $$.pass()
								}
							`
						},
						{
							name: 'name',
							fields: ['p1-form1-name'],
							template: 'Null'
						},
						{
							name: 'name',
							fields: ['p1-form1-name'],
							template: 'NotNull'
						},
					],
				},
				genderCode: {
					value: 'M',
					rules: {
						label: '性别',
						type: 'za-sex',
						vRules: 'required',
						placeholder: '请选择',
						errorMsg: '性别',
						readOnly: false
					},
					validators: [
						{
							name: '校验性别',
							fields: ['p1-form2-genderCode', 'relation'],
							codes: `
							if($$(2) == '00' && $$(1) != $$(0)) {
								return $$.fail(0,'选择为本人，性别必须相同!!!')
							} else if($$(2) == '01' && $$(0) == $$(1)) {
								return $$.fail(0,'性别相同,如何相爱!!!')
							}else {
								return $$.pass()
							}
						`
						}
					]
				},
				birthday: {
					value: '1980-01-01',
					type: 'date',
					rules: {
						label: '出生日期',
						type: 'za-date',
						vRules: 'required',
						placeholder: '请选择',
						errorMsg: '请输入出生日期',
						readOnly: false,
						stime: '1940-01-01',
						etime: '',
					},
					validators: [{
						name: '校验年龄',
						fields: ['p1-form1-birthday', 'relation'],
						codes: `
							if($$(2) == '00' && $$.stamp(0) !== $$.stamp(1)) {
								return $$.fail(0,'关系为本人，请修改生日')
							}else if ($$(2) == '02' && $$.stamp(0) <= $$.stamp(1)) {
								return $$.fail(0,'子女年龄必须小于自己')
							}else if ($$(2) == '03' && $$.stamp(0) >= $$.stamp(1)) {
								return $$.fail(0,'父母年龄必须大于自己')
							}else {
								return $$.pass()
							}
						`
					},
					{
							name: 'birthday',
							fields: ['p1-form1-birthday'],
							template: 'Equals'
					}
					]
				},
			}
		},
		// p2: {
		// }
	}

}

module.exports = payload => wrapper(formModels)