---
--- Created By 0xWaleed
--- DateTime: 10/17/21 8:00 PM
---

cfx_require('lmtls-core-client.nui')
cfx_require('lmtls-core-shared.command')

local g_dialogsSessions   = {}

local g_dialogIncremental = 1

local function generate_id()
    local id            = g_dialogIncremental
    g_dialogIncremental = g_dialogIncremental + 1
    return tostring(id)
end

---@param dialog Dialog
function notify_dialog(dialog)
    local status, output = VarGuard({
        type        = 'required|type:string',
        description = 'required|type:string',
        actions     = 'required|type:table',
    }, dialog):validate()
    if not status then
        error(output)
    end

    local id              = generate_id()
    dialog.id             = id
    g_dialogsSessions[id] = dialog;

    for _, action in ipairs(dialog.actions) do
        action.instanceId = id
    end

    core_send_nui_message('dialog', dialog)
    core_nui_enable_keyboard()
end

core_register_nui_callback('dialog-callback', function(data)
    local id  = data.instanceId
    local key = data.key
    print(id, key) -- testing
end)

core_register_nui_callback('disable-focus-callback', function(_)
    core_nui_disable_keyboard()
end)

core_register_command('dev:notify:dialog', function(_, args)
    notify_dialog({
        type        = args[1] or 'success',
        description = args[2] or 'This is the description',
        actions     = {
            {
                code        = 'ESCAPE',
                key         = 'ESC',
                description = 'ESCAPE IT'
            }
        }
    })
end)
