'import "pkg:/source/roku_modules/sgrouter/router.bs"

sub init()
    m.top.focusable = true
end sub

' Handles the goBack calls when the "back" key is pressed' @param {String} key - The key that was pressed
' @param {Boolean} press - Whether the key was pressed or released
' @returns {Boolean} - Whether the view was hidden or not
function onKeyEvent(key = "" as String, press = false as Boolean) as Boolean
    if NOT press then
        return true
    end if
    if key = "back" then
        return sgRouter_goBack()
    end if
    return false
end function