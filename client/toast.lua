---
--- Created By 0xWaleed
--- DateTime: 12/4/2021 12:34 AM
---

---@param toast Toast
function notify_toast(toast)
	local status, output = VarGuard({
		text    = 'required|type:string',
		timeout = 'type:number',
	}, toast):validate()

	if not status then
		error(output)
	end

	core_nui_send_message('toast', toast)
end

core_register_command('dev:notify:toast', function(_, args)
	notify_toast({
		text    = args[1] or 'Hello World',
		timeout = tonumber(args[2]),
		icon    = args[3]
	})
end)
