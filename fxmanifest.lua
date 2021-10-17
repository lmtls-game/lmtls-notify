---
--- Created By 0xWaleed
--- DateTime: 10/17/21 7:39 PM
---

fx_version 'cerulean'

game 'common'


shared_script 'require/require.lua'

local function ui(f) file(string.format('client/ui/%s', f))  end
local function ui_file(f) return file(ui(f)) end

ui_page(ui('index.html'))

ui_file 'index.html'
ui_file '**/*.js'
ui_file '**/*.ttf'
ui_file '**/*.svg'
