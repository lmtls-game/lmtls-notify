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

local function get_action_by_code(code, actions)
    for _, action in ipairs(actions) do
        if code == action.code then
            return action
        end
    end
end

---@param dialog Dialog
---@return NuiDialog
local function transform_dialog_to_nui_dialog(dialog)
    local actions = {}

    for _, action in ipairs(dialog.actions) do
        table.insert(actions, {
            instanceId  = dialog.id,
            code        = action.code,
            key         = action.key,
            description = action.description
        })
    end

    return {
        id          = dialog.id,
        type        = dialog.type,
        description = dialog.description,
        actions     = actions,
    }
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

    local nuiDialog       = transform_dialog_to_nui_dialog(dialog)

    core_nui_send_message('dialog', nuiDialog)
    core_nui_enable_focus()
end

nuiCallback.invokeCallback(function(action)
    local id      = action.instanceId
    local dialog  = g_dialogsSessions[id]
    local actions = dialog.actions or {}
    action        = get_action_by_code(action.code, actions)
    if not action then
        return
    end
    action.callback()
end)

core_nui_register_callback('disable-focus-callback', function(_)
    core_nui_disable_focus()
end)

core_register_command('dev:notify:dialog', function(_, args)
    notify_dialog({
        type        = args[1] or 'success',
        description = args[2] or 'This is the description',
        actions     = {
            {
                code        = 'Escape',
                key         = 'ESC',
                description = 'Cancel',
                callback    = function()
                    print('dialog callback event')
                end
            },
            {
                code        = 'Q',
                key         = 'Exit',
                description = 'Quit the game',
                callback    = function()
                    print('Exiting the game')
                end
            }
        }
    })
end)
