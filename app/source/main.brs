sub runUserInterface(_args = {})
    screen = createObject("roSGScreen")
    port = createObject("roMessagePort")

    screen.setMessagePort(port)
    screen.createScene("App")
    screen.show()

    ' Remove leading - to enable RALE
    '-vscode_rale_tracker_entry

    ' Remove leading - to enable RDB
    '-vscode_rdb_on_device_component_entry

    while true
        msg = wait(0, port)
        msgType = type(msg)
        if msgType = "roSGScreenEvent"
            if msg.isScreenClosed()
                return
            end if
        end if
    end while
end sub
