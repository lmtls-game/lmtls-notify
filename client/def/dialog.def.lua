---
--- Created By 0xWaleed
--- DateTime: 10/17/21 7:51 PM
---


---
---@class CallableAction
---@field callback function
CallableAction = {}

---
---@class Action : CallableAction
---@field key string
---@field code string
---@field description string
Action         = {}

---
---@class DialogBase
---@field id string
---@field type string
---@field description string
DialogBase     = {}

---@class Dialog : DialogBase
---@field actions CallableAction[]
Dialog         = {}

---@class NuiDialog : DialogBase
---@field actions Action[]
NuiDialog      = {}

