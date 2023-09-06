---
--- Created By 0xWaleed
--- DateTime: 10/17/21 8:05 PM
---

function is_callable(var)

	local typeOfVar = type(var)

	if typeOfVar == 'function' then
		return true
	end

	if typeOfVar ~= 'table' then
		return false
	end

	local mt = getmetatable(var) or {}

	return not (not mt.__call)

end

function expect_to_throw(callable, message)
	local status, err = pcall(callable)
	if not message then
		assert(not status, 'Expected to throw')
		return
	end
	if message then
		assert(not status, ('Expected to throw with message: %s'):format(message))
		err = err or ''
		assert(string.find(err, message, 1, true), ('Expect error message to be: `%s` got `%s`'):format(message, err))
	end
end

_G.cfx_require = function(file)
	file = string.gsub(file, '%~%.', '')
	if file:find('lmtls%-') then
		return
	end
	return require(file)
end

require('tests/dialog_test')
