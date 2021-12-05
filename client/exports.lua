---
--- Created By 0xWaleed
--- DateTime: 10/24/2021 12:02 AM
---


exports('dialog', notify_dialog)
exports('toast', function(toast)
    if type(toast) ~= 'table' then
        notify_toast({ text = toast })
        return
    end
    notify_toast(toast)
end)
