---
--- Created By 0xWaleed
--- DateTime: 10/24/2021 12:02 AM
---


exports('dialog', notify_dialog)

local function toast_wrapper(toast)
    if type(toast) ~= 'table' then
        notify_toast({ text = toast })
        return
    end
    notify_toast(toast)
end

exports('toast', toast_wrapper)

exports('toast_success', function(text)
    toast_wrapper({ text = text, icon = 'assets/clarity_success-standard-line.svg' })
end)

exports('toast_error', function(text)
    toast_wrapper({ text = text, icon = 'assets/bx_bx-error-alt.svg' })
end)
