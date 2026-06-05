sub runUserInterface(args = {})
    screen = createObject("roSGScreen")
    port = createObject("roMessagePort")

    screen.setMessagePort(port)
    screen.createScene("App")
    scene = screen.getScene()
    ' screen.createScene("Benchmarks")
    ' screen.createScene("TestScene")
    screen.show()
    ' vscode_rale_tracker_entry
    ' vscode_rdb_on_device_component_entry

    scene.observeFieldScopedEx("playSound", port)

    while true
        msg = wait(0, port)
        msgType = type(msg)
        if msgType = "roSGScreenEvent"
            if msg.isScreenClosed()
                return
            end if
        else if msgType = "roSGNodeEvent"
            if msg.getField() = "playSound"
                soundSource = msg.getData()
                playSound(soundSource)
            end if
        end if
    end while
end sub


sub playSound(soundSource)
    ?"main playSound " soundSource
    sound = createObject("roAudioResource", soundSource)
    sound.trigger(50)
end sub
