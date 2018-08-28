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
					name: '姓名',
					value: '',
					type: 'string', // number / date / string / address
					rules: {
						label: '姓名',
						type: 'za-input',
						vRules: 'required|cnname',
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
          }, 
          fillers: [{
            name: '自动填写生日',
            target: 'birthday',
            codes: `
              return $$(0).substr(6, 4) + '-' + $$(0).substr(10, 2) + '-' + $$(0).substr(12, 2);
            `
          }],
				},
				ppCard: {
					value: '',
					rules: {
						label: '护照',
						type: 'hidden',
						vRules: 'required|passport',
						placeholder: '请输入护照号码',
						errorMsg: '请输入护照号码'
					}
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
          },
          fillers: [{
            name: '自动填写姓名',
            fields: ['p1-form1-name'],
            target: 'name',
            codes: `
              console.log($$(1));
              if ($$(0)==='00') {
                return $$(1)
              }
            `
          }, {
            name: '自动填写生日',
            fields: ['p1-form1-birthday'],
            target: 'birthday',
            codes: `
              if ($$(0)==='00') {
                return $$(1)
              }
            `
          }]
				},
				name: {
					value: '',
					type: 'string',
					rules: {
						label: '姓名',
						type: 'za-input',
						vRules: 'required|cnname',
						placeholder: '请输入姓名',
						errorMsg: '姓名',
						readOnly: false
					},
					validators: [
						{
							name: '校验关系',
							fields: ['relation', 'p1-form1-name'],
							codes: `
								if($$(1) == '00' && $$(2)!= $$(0)) {
									return $$.fail(0,'选择本人姓名必须一致')
								} else {
									return $$.pass()
								}
							`
						},
						{
								name: 'async',
								fields: ['relation'],
								template: 'ServerEquals',
								server: true
						}
          ],
          // fillers: [{
          //   name: 'copy',
          //   target: 'name2',
          //   codes: `
          //     return $$;
          //   `
          // }]
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
							fields: ['p1-form3-genderCode', 'relation'],
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
						fields: ['p1-form3-birthday', 'relation'],
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
								fields: ['p1-form3-birthday'],
								template: 'Equals'
						}
					]
				},
			},
			form3: {
				name: {
					value: '',
					rules: {
						label: '姓名',
						type: 'za-input',
						vRules: 'required',
						placeholder: '请输入',
						errorMsg: '请输入'
					}
				},
				sex : {
					value: 'M',
					rules: {
						label: '性别',
						type: 'za-sex',
						vRules: 'required',
						placeholder: '请选择',
						readOnly: false,
						errorMsg: '请输入'
					}
				},
				birthDay : {
					value: '',
					rules: {
						label: '出生日期',
						type: 'za-date',
						vRules: 'required',
						placeholder: '请选择',
						errorMsg: '请输入'
					}
				},
				// select: {
				// 	value: '',
				// 	rules: {
				// 		label: '下拉框',
				// 		type: 'za-select',
				// 		showName:true,
				// 		readOnly: false,
				// 		vRules: 'required',
				// 		placeholder: '请选择',
				// 		options: [[
				// 				{
				// 					value: "1",
				// 					name: "option 1"
				// 				},
				// 				{
				// 					value: "2",
				// 					name: "option 2"
				// 				},
				// 			]],
				// 		errorMsg: '请选择'
				// 	}
				// },
				// input: {
				// 	value: '',
				// 	rules: {
				// 		label: 'input',
				// 		type: 'za-input',
				// 		vRules: 'required',
				// 		placeholder: '请输入',
				// 		errorMsg: '请输入'
				// 	}
				// },
				// button_group: {
				// 	value: '',
				// 	rules: {
				// 		label: 'button_group',
				// 		type: 'za-button_group',
				// 		vRules: 'required',
				// 		options: [{name: '选项1', value:'选项1'},{name: '选项2', value:'选项2'}]
				// 	}
				// },
				// text : {
				// 	value: 'this is text',
				// 	rules: {
				// 		label: 'text',
				// 		type: 'za-text'
				// 	}
				// },
				// address : {
				// 	value: {
				// 		"province": "",
				// 		"provinceDesc": "",
				// 		"city": "",
				// 		"cityDesc": "",
				// 		"district": "",
				// 		"districtDesc": "",
				// 		"detail": ""
				// 	},
				// 	rules: {
				// 		label: 'Address',
				// 		subLabel: 'detail',
				// 		type: 'za-address',
				// 		vRules: 'required',
				// 		showDetail: true,
				// 		errorMsg: '请输入'
				// 	}
				// },
				// birthDay : {
				// 	value: '1986-07-02',
				// 	rules: {
				// 		label: 'birthDay',
				// 		type: 'za-date',
				// 		vRules: 'required',
				// 		placeholder: '请选择',
				// 		errorMsg: '请输入'
				// 	}
				// },

				// Married : {
				// 	value: 'Y',
				// 	rules: {
				// 		label: 'Y/N',
				// 		type: 'za-yesno',
				// 		vRules: 'required',
				// 		errorMsg: '请输入'
				// 	}
				// },
				// Reason : {
				// 	value: '',
				// 	rules: {
				// 		label: 'textarea',
				// 		type: 'za-textarea',
				// 		vRules: 'required|min:8',
				// 		placeholder: '请输入',
				// 		errorMsg: '请输入'
				// 	}
				// }
			}
		},
		p2: {
		}
	}

}

module.exports = payload => wrapper(formModels)