'************************
'*** This namespace can be used inside any component that is a view, or child of a view
'*** DO NOT USE THIS FILE OUTSIDE OF A VIEW COMPONENT, such as the main scene
'************************
function sgrouter_initialize(params = {} as Object) as Dynamic
    routerObject = Invalid
    if params.router = Invalid then
        routerObject = createObject("roSGNode", "sgrouter_Router")
    else
        routerObject = params.router
    end if
    if params.outlet = Invalid then
        params.outlet = sgrouter_searchForOutlet(m.top.getScene())
    end if
    ' Validate the outlet
    if sgrouter_utils_isRouter(routerObject) AND sgrouter_utils_isOutlet(params.outlet) then
        m.top.getScene().addFields({
            __router: routerObject
        })
        return routerObject.callfunc("_initialize", params)
    end if
    return Invalid
end function

sub sgrouter_destroy()
    r = sgrouter_getRouter()
    if rodash_isNotInvalid(r) then
        r.callfunc("_destroy", invalid)
        m.top.getScene().removeField("__router")
    end if
end sub

' This function is used to navigate to a different screen
' It will return a promise that will resolve when the navigation is complete
' @since 0.0.1
' @param path - Either a literal path string (e.g. "/home") or an AA for named-route navigation.
' @param options - The options to pass to the router
' @param options.router - The router to use, if not provided, it will try to find the router in the current chain
' @return - A promise that will resolve when the navigation is complete
function sgrouter_navigateTo(path = "" as Dynamic, options = {} as Object) as Dynamic
    if options.router <> Invalid then
        r = options.router
    else
        r = sgrouter_getRouter()
    end if
    if rodash_isNotInvalid(r) then
        return r.callfunc("_navigateTo", path, options)
    end if
    return promises_resolve(true)
end function

function sgrouter_goBack(options = {} as Object) as Dynamic
    if options.router <> Invalid then
        r = options.router
    else
        r = sgrouter_getRouter()
    end if
    if rodash_isNotInvalid(r) then
        return r.callfunc("_goBack", Invalid)
    end if
    return false
end function

' This function is used to add routes to the router
' @since 0.0.1
' @param routes - The routes to add
' @param options - The options to pass to the router
' @param options.router - The router to use, if not provided, it will try to find the router in the current chain
sub sgrouter_addRoutes(routes = [] as Object, options = {} as Object)
    if options.router <> Invalid then
        r = options.router
    else
        r = sgrouter_getRouter()
    end if
    if rodash_isNotInvalid(r) then
        r.callfunc("_addRoutes", routes)
    end if
end sub

' This function is used to get all routes from the router
' @since 0.0.1
' @return - All routes from the router
function sgrouter_getRoutes(options = {} as Object) as Dynamic
    if options.router <> Invalid then
        r = options.router
    else
        r = sgrouter_getRouter()
    end if
    if rodash_isNotInvalid(r) then
        return r.callfunc("_getRoutes", invalid)
    end if
    return {}
end function

' Gets the router from the global scope. Creates the router if it does not exist.
' @since 0.0.1
' @return - The router
function sgrouter_getRouter() as Dynamic
    return m.top.getScene().__router
end function

function sgrouter_searchForOutlet(parent = Invalid as Dynamic) as Dynamic
    if parent = Invalid then
        parent = m.top
    end if
    ' Check to see if you are in the outlet
    if sgrouter_utils_isOutlet(parent) then
        return parent
    end if
    nodes = []
    nodes.append(rodash_getNodeChildren(parent))
    while nodes.count() > 0
        node = nodes.Shift()
        if sgrouter_utils_isOutlet(node) then
            return node
        else
            'push all of this node's children to be searched in the future
            nodes.append(rodash_getNodeChildren(node))
        end if
    end while
    return Invalid
end function

function sgrouter_setFocus(options = {} as Object) as Boolean
    if options.router <> Invalid then
        r = options.router
    else
        r = sgrouter_getRouter()
    end if
    if rodash_isNotInvalid(r) AND rodash_isBoolean(options.focus) then
        return r.callfunc("_setFocus", options.focus)
    end if
    return false
end function

' This function is used to create a redirect command
' Redirect commands are used to redirect the user to a different screen during a guard check
' @since 0.0.1
' @param path - The path to redirect to
' @param routeConfigOverrides - The route config overrides to apply to the new route
' @param context - The context to pass to the router
' @return - A redirect command
function sgrouter_createRedirectCommand(path = "" as String, routeConfigOverrides = {} as Object, context = {} as Object) as Dynamic
    return {
        command: "RedirectCommand"
        path: path
        routeConfigOverrides: routeConfigOverrides
        context: context
    }
end function
function sgrouter_utils_isOutlet(node = Invalid as Object) as Boolean
    return rodash_isNode(node) AND node.hasField("__isOutlet")
end function

function sgrouter_utils_isRouter(node = Invalid as Object) as Boolean
    return rodash_isNode(node) AND node.hasField("__isRouter")
end function

' This function is used to get the current focused chain of nodes
' @since 0.0.1
' @param parent - The parent node to start the search from
' @param maxDepth - The maximum depth to search
' @return - The chain of nodes
function sgrouter_utils_getCurrentFocusedChain(parent = Invalid as Object, maxDepth = 30 as Integer) as Object
    if rodash_isNode(parent) then
        targetNode = parent
    else
        targetNode = m.top.getScene()
    end if
    focusedChild = targetNode.focusedChild
    chain = [
        targetNode
    ]
    if rodash_isNode(focusedChild) then
        while maxDepth > 0 AND NOT rodash_isEqual(focusedChild, targetNode)
            targetNode = focusedChild
            ' There is a chance the chain is incomplete
            if targetNode = Invalid then
                exit while
            end if
            chain.push(targetNode)
            focusedChild = targetNode.focusedChild 'bs:disable-line LINT1005
            maxDepth--
        end while
        return chain
    end if
    return chain
end function