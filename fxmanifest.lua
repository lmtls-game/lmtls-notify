---
--- Created By 0xWaleed
--- DateTime: 10/17/21 7:39 PM
---

fx_version 'cerulean'

game 'common'

shared_script '@lmtls-core-shared/require.lua'
shared_script 'varguard/varguard.lua'

client_script 'client/dialog.lua'
client_script 'client/toast.lua'

client_script 'client/exports.lua' --last

ui_page 'client/ui/index.html'

file 'client/ui/index.html'
file 'client/ui/**/*.css'
file 'client/ui/**/*.js'
file 'client/ui/**/*.otf'
file 'client/ui/**/*.svg'
file 'client/ui/**/*.mp3'

file 'js/*.js'

