---
--- Created By 0xWaleed
--- DateTime: 10/17/21 8:00 PM
---

cfx_require('lmtls-core-client.nui')
cfx_require('~.varguard.varguard')

local g_dialogsSessions = {}

---@param dialog Dialog
function notify_dialog(dialog)
    local status, output = VarGuard({
        type = 'required|type:string',
        description = 'required|type:string',
        actions = 'required|type:array',
    }, dialog):validate()
    if not status then
        error(output)
    end

    local id = generate_id()
    dialog.id = id
    g_dialogsSessions[id] = dialog;
    core_send_nui_message('dialog', dialog)
end


core_register_nui_callback('dialog-callback', function(data)
    local id = data.id
    local key = data.key
    print(id, key) -- testing
end)
