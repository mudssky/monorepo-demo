
[CmdletBinding()]
param (
    [ValidateSet("prisma-doc")]
    $Mode
)
    




switch ($Mode) {
    'prisma-doc' {
        Start-Job -ScriptBlock {
            Start-Process 'http://localhost:20300'
        }
        caddy file-server --root ./prisma/docs/ --listen :20300
    }
     
}

