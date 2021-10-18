---
--- Created By 0xWaleed
--- DateTime: 10/17/21 8:03 PM
---

require('client.dialog')

assert(notify_dialog, 'notify_dialog is not exist.')

expect_to_throw(function() notify_dialog(nil) end)
expect_to_throw(function() notify_dialog(1) end)
expect_to_throw(function() notify_dialog(true) end)
expect_to_throw(function() notify_dialog(function() end) end)

function test_fields()
    ---@type Dialog
    local dialog = {}
    local function reset()
        dialog = {
            type        = 'information',
            description = 'description'
        }
    end

    reset()
    dialog.type = nil
    expect_to_throw(function() notify_dialog(dialog) end)

    reset()
    dialog.description = nil
    expect_to_throw(function() notify_dialog(dialog) end)

    reset()
    dialog.actions = nil
    expect_to_throw(function() notify_dialog(dialog) end)
end

test_fields()
