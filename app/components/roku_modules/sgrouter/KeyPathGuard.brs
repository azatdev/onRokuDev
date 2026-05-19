'import "pkg:/source/roku_modules/rodash/rodash.brs"
'import "pkg:/source/roku_modules/sgrouter/router.bs"

' This component is used as a route guard that checks a keyPath against an expected value
' If the value at the keyPath does not match the expected value, it can show a deny dialog and/or redirect to another route
sub setGuardConfig(guard as Object)
    m.keyPath = rodash_getString(guard, "keyPath")
    m.expectedValue = rodash_get(guard, "expectedValue")
    m.scope = rodash_getString(guard, "scope", "global")
    m.denyDialog = rodash_getAA(guard, "denyDialog")
    m.denyRedirect = rodash_getString(guard, "denyRedirect")
end sub

' This function is called to determine if the route can be activated
function canActivate(currentRequest = {} as Object) as Dynamic
    ' Validate scope
    if m.scope <> "global" AND m.scope <> "scene" then
        return false
    end if
    ' Get the value at the keyPath
    value = rodash_get((function(__bsCondition, m)
            if __bsCondition then
                return m.top.getScene()
            else
                return m.global
            end if
        end function)(m.scope = "scene", m), m.keyPath)
    ' Check if the value matches the expected value
    if rodash_isEqual(value, m.expectedValue) then
        return true
    end if
    ' If the value does not match, show the deny dialog and/or redirect
    if rodash_isNonEmptyAA(m.denyDialog) then
        dialog = createObject("roSGNode", "Dialog")
        dialog.title = rodash_getString(m.denyDialog, "title", "Access Denied")
        dialog.optionsDialog = true
        dialog.message = rodash_getString(m.denyDialog, "message", "You do not have permission to access this screen.")
        m.top.getScene().dialog = dialog
    end if
    if rodash_isNonEmptyString(m.denyRedirect) then
        return sgRouter_createRedirectCommand(m.denyRedirect)
    end if
    return false
end function