const wrapper = function (value) {
	return {
		success: true,
		errorMsg: '',
		value
	}
}

module.exports = payload => wrapper({
    pass: true,
    reason: 'success'
})