'import "pkg:/source/roku_modules/promises/promises.brs"
'import "pkg:/source/roku_modules/rodash/rodash.brs"
'import "pkg:/source/roku_modules/sgrouter/router.bs"

' Initialize the router
sub init()
    m.__router_activeView = Invalid
    m.__router_focusRequestMade = false
    m.__router_guardInstances = {}
    m.__router_historyStack = []
    m.__router_nameMap = {}
    m.__router_navigationInProgress = false
    m.__router_outlet = Invalid
    m.__router_processingGoBack = false
    m.__router_routes = {}
    m.top.focusable = true
end sub

'*************************************************************************
'#region *** PUBLIC Functions
'*************************************************************************
function _initialize(params = {} as Object) as Dynamic
    m.__router_outlet = params.outlet
    if m.__router_outlet <> Invalid then
        m.__router_outlet.unobserveField("focusedChild")
        m.__router_outlet.observeField("focusedChild", "sgrouter_onFocusChildChanged")
        ' Temp for now
        m.__router_viewTarget = m.__router_outlet.findNode("viewTarget")
        m.__router_keepAliveViewTarget = m.__router_outlet.findNode("keepAliveViewTarget")
    end if
    return m.top
end function

sub _destroy(_ = Invalid as Dynamic)
    if m.__router_outlet <> Invalid then
        m.__router_outlet.unobserveField("focusedChild")
    end if
    m.__router_activeView = Invalid
    m.__router_focusRequestMade = false
    m.__router_guardInstances = {}
    m.__router_historyStack = []
    m.__router_nameMap = {}
    m.__router_navigationInProgress = false
    m.__router_outlet = Invalid
    m.__router_processingGoBack = false
    m.__router_routes = {}
    rodash_removeNodeChildren(m.__router_viewTarget)
    rodash_removeNodeChildren(m.__router_keepAliveViewTarget)
    m.__router_viewTarget = Invalid
    m.__router_keepAliveViewTarget = Invalid
end sub

' Function to add routes to the router
' @param {Array} routes - The routes to add
sub _addRoutes(routes = [] as Object)
    for each route in routes
        merged = rodash_merge({
            pattern: route.pattern
            component: ""
            allowReuse: false
            canActivate: []
            clearStackOnResolve: false
            keepAlive: {
                enabled: false
            }
        }, route)
        m.__router_routes[route.pattern] = merged
        if rodash_isNonEmptyString(merged.name) then
            if m.__router_nameMap[merged.name] <> Invalid then
                print "[WARN] sgRouter: duplicate route name """ + merged.name + """ — first registration wins (existing: """ + m.__router_nameMap[merged.name].pattern + """, ignored: """ + merged.pattern + """)"
            else
                m.__router_nameMap[merged.name] = merged
            end if
        end if
    end for
end sub

' Function to get the routes
' @returns {Array} - The routes
function _getRoutes(_ = Invalid as Dynamic) as Dynamic
    return m.__router_routes
end function

' Function to navigate back in the router history
' @returns {Boolean} - Whether the navigation was successful or not
function _goBack(_ = Invalid as Dynamic) as Dynamic
    if m.__router_navigationInProgress then
        return false
    end if
    m.__router_processingGoBack = true
    if m.__router_historyStack.count() <= 1 then
        m.__router_processingGoBack = false
        return false
    end if
    ' Find the previous path from historyStack
    previousPath = m.__router_historyStack[m.__router_historyStack.count() - 2]
    ' Search viewTarget first, then keepAliveViewTarget
    viewToOpen = Invalid
    viewToOpenFromKeepAlive = false
    for each v in rodash_getNodeChildren(m.__router_viewTarget)
        if v.route.path = previousPath then
            viewToOpen = v
            exit for
        end if
    end for
    if viewToOpen = Invalid then
        for each v in rodash_getNodeChildren(m.__router_keepAliveViewTarget)
            if v.route.path = previousPath then
                viewToOpen = v
                viewToOpenFromKeepAlive = true
                exit for
            end if
        end for
    end if
    if viewToOpen = Invalid then
        m.__router_processingGoBack = false
        return false
    end if
    if viewToOpenFromKeepAlive then
        viewToOpen.reparent(m.__router_viewTarget, true)
    end if
    ' An event triggered when a navigation starts.
    sgrouter_dispatchRouterState("NavigationStart", {
        id: viewToOpen.route.id
        route: viewToOpen.route
    })
    ' Close or suspend the current view
    viewToClose = m.__router_activeView
    closePromise = Invalid
    if rodash_getBoolean(viewToClose.route.routeConfig.keepAlive, "enabled") then
        closePromise = sgrouter_suspendView(viewToClose)
    else
        closePromise = sgrouter_closeView(viewToClose)
    end if
    promises_chain(closePromise, viewToOpen).then(sub(_ as Dynamic, view as Dynamic)
        m.__router_focusRequestMade = m.__router_focusRequestMade OR m.__router_processingGoBack
        view.route.navigationState = rodash_merge(view.route.navigationState, {
            fromKeepAlive: false
            fromPopState: true
            fromPushState: false
            fromRedirect: false
        })
        sgrouter_showView(view, true)
    end sub)
    return true
end function

' Function to navigate to a specific route
' @param {String|Object} path - The path to navigate to, or an AA for named routes: { name: String, params: Object }
' @param {Object} options - The route config overrides and navigation options
' @returns {Dynamic} - The result of the navigation
function _navigateTo(path = "" as Dynamic, options = {} as Object) as Dynamic
    if m.__router_navigationInProgress then
        return promises_reject({
            message: "Navigation already in progress"
        })
    end if
    if NOT rodash_isNonEmptyAA(path) AND NOT rodash_isNonEmptyString(path) then
        return promises_reject({
            message: "Invalid path"
        })
    end if
    ' Named route resolution: if path is an AA with a "name" key, resolve to a literal path string
    if rodash_isAA(path) then
        name = path.name
        params = path.params
        if NOT rodash_isNonEmptyString(name) then
            print "[WARN] sgRouter: navigateTo AA arg must include a non-empty ""name"" key"
            return promises_reject({
                message: "navigateTo AA arg must include a non-empty ""name"" key"
            })
        end if
        if m.__router_nameMap[name] = Invalid then
            print "[WARN] sgRouter: no route found with name """ + name + """"
            return promises_reject({
                message: "no route found with name """ + name + """"
            })
        end if
        routeConfig = m.__router_nameMap[name]
        resolved = sgrouter_resolveNamedRoutePath(name, routeConfig.pattern, params)
        if resolved = Invalid then
            return promises_reject({
                message: "missing required param for named route """ + name + """"
            })
        end if
        path = resolved
    end if
    routeConfigOverrides = rodash_getAA(options, "routeConfigOverrides")
    navigationState = rodash_getAA(options, "navigationState")
    context = rodash_getAA(options, "context")
    newRoute = rodash_createNode("Node", sgrouter_findMatchingRoute(path, m.__router_routes))
    ' Merge the route config overrides
    if rodash_isNonEmptyAA(routeConfigOverrides) then
        newRouteConfig = rodash_merge(newRoute.routeConfig, routeConfigOverrides)
        newRoute.routeConfig = newRouteConfig
    end if
    ' Merge the context
    if rodash_isNonEmptyAA(context) then
        newRouteContext = rodash_merge(newRoute.context, context)
        newRoute.context = newRouteContext
    end if
    ' Merge the navigation state
    if rodash_isNonEmptyAA(navigationState) then
        newRouteNavigationState = rodash_merge(newRoute.navigationState, navigationState)
        newRoute.navigationState = newRouteNavigationState
    end if
    ' An event triggered when a navigation starts.
    sgrouter_dispatchRouterState("NavigationStart", {
        id: newRoute.id
        route: newRoute
    })
    if m.__router_outlet = Invalid then
        message = {
            message: "No Outlet found"
        }
        ' An event triggered when a navigation error occurs.
        sgrouter_dispatchRouterState("NavigationError", {
            id: newRoute.id
            error: message
            route: newRoute
        })
    end if
    if NOT rodash_isNonEmptyString(newRoute.routeConfig.pattern) then
        message = {
            message: ("Route " + chr(34) + sgrouter_bslib_toString(newRoute.path) + chr(34) + " not found")
        }
        ' An event triggered when a navigation error occurs.
        sgrouter_dispatchRouterState("NavigationError", {
            id: newRoute.id
            error: message
            route: newRoute
        })
        return promises_reject(message)
    end if
    'An event triggered when routes are recognized.
    sgrouter_dispatchRouterState("RoutesRecognized", {
        id: newRoute.id
        route: newRoute
    })
    'sleep until next tick, then continue work
    return promises_chain(promises_resolve(Invalid), {
        newRoute: newRoute
    }).then(function(_ as Dynamic, internalContext as Dynamic) as Dynamic
        return sgrouter_runGuardChecks(internalContext.newRoute)
    end function).then(function(guardCheckResponse as Dynamic, internalContext as Dynamic) as Dynamic
        if NOT guardCheckResponse.allow then
            if guardCheckResponse.redirect <> Invalid then
                return guardCheckResponse.redirect
            end if
            return promises_reject(guardCheckResponse)
        end if
        id = internalContext.newRoute.id
        newRoute = internalContext.newRoute
        ' Look for a matched pattern
        if rodash_isNonEmptyString(newRoute.routeConfig.pattern) then
            if rodash_isEmptyString(newRoute.routeConfig.component) then
                message = {
                    message: ("No component for route " + chr(34) + sgrouter_bslib_toString(newRoute.path) + chr(34))
                }
                sgrouter_dispatchRouterState("NavigationError", {
                    id: id
                    error: message
                })
                return promises_reject(message)
            end if
            viewsToRemoveOnResolve = []
            if m.__router_activeView <> Invalid then
                oldRoute = m.__router_activeView.route
                ' Reuse the view and call onRouteUpdate if the path or hash is the same, OR if the routeConfig override allows it
                hasHash = rodash_isNonEmptyString(newRoute.hash)
                isSamePath = rodash_isEqual(newRoute.path, oldRoute.path)
                reuse = rodash_getBoolean(newRoute.routeConfig, "allowReuse") OR hasHash OR isSamePath
                if hasHash then
                    if NOT rodash_isEqual(newRoute.routeConfig, oldRoute.routeConfig) then
                        reuse = false
                    end if
                else
                    if NOT rodash_isEqual(newRoute.routeParams.component, oldRoute.routeParams.component) then
                        reuse = false
                    end if
                end if
                if reuse then
                    sgrouter_dispatchRouterState("ResolveStart", {
                        id: id
                        route: newRoute
                    })
                    m.__router_activeView.route = newRoute
                    return promises_chain(m.__router_activeView.callfunc("_onRouteUpdate", {
                        oldRoute: oldRoute
                        newRoute: newRoute
                    }), internalContext).then(function(response as Dynamic, internalContext as Dynamic) as Dynamic
                        return response
                    end function).then(function(response as Dynamic, internalContext as Dynamic) as Dynamic
                        id = internalContext.newRoute.id
                        newRoute = internalContext.newRoute
                        sgrouter_dispatchRouterState("ResolveEnd", {
                            id: id
                            route: newRoute
                        })
                        sgrouter_dispatchRouterState("ActivationEnd", {
                            id: id
                            route: newRoute
                        })
                        sgrouter_dispatchRouterState("NavigationEnd", {
                            id: id
                            route: newRoute
                        })
                        return response
                    end function).toPromise()
                else
                    if newRoute.routeConfig.clearStackOnResolve then
                        for each view in rodash_getNodeChildren(m.__router_viewTarget)
                            viewsToRemoveOnResolve.push(view)
                        end for
                    end if
                end if
            end if
            newRoute.navigationState = rodash_merge(newRoute.navigationState, {
                fromPopState: false
                fromPushState: true
            })
            return sgrouter_addViewToStack(newRoute, viewsToRemoveOnResolve)
        end if
        message = {
            message: ("Route " + chr(34) + sgrouter_bslib_toString(newRoute.path) + chr(34) + " not found")
        }
        sgrouter_dispatchRouterState("NavigationError", {
            id: id
            error: message
        })
        return promises_reject(message)
    end function).catch(function(error as Dynamic) as Dynamic
        m.__router_navigationInProgress = false
        return promises_reject(error)
    end function).toPromise()
end function

' A public function to set the focus on the router
' @param {Boolean} takeFocus - Whether to take focus or not
' @returns {Boolean} - Whether the active view handled the focus or not
function _setFocus(takeFocus as Boolean) as Boolean
    response = false
    if m.__router_activeView <> Invalid AND takeFocus AND m.__router_focusRequestMade <> takeFocus then
        response = m.__router_activeView.callfunc("_handleFocus", {
            routerFocused: true
        })
    end if
    m.__router_focusRequestMade = true
    return response
end function
'*************************************************************************
'#endregion *** PUBLIC Functions
'*************************************************************************
'*************************************************************************
'#region *** PRIVATE Guard Functions
'*************************************************************************

' Function to run guard checks
' @param {Dynamic} route - The route to run the guard checks on
' @returns {Dynamic} - The result of the guard checks
function sgrouter_runGuardChecks(route as Dynamic) as Dynamic
    ' Run guard checks
    canActivateGuard = rodash_get(route.routeConfig, "canActivate")
    sgrouter_dispatchRouterState("GuardsCheckStart", {
        id: route.id
        route: route
    })
    if rodash_isNonEmptyArray(canActivateGuard) then
        for each guard in canActivateGuard
            guardNode = Invalid
            if rodash_isAA(guard) then
                guardNode = rodash_createNode("KeyPathGuard")
                guardNode.callfunc("setGuardConfig", guard)
            else if rodash_isNode(guard) then
                guardNode = guard
            else if rodash_isString(guard) then
                if m.__router_guardInstances[guard] = Invalid then
                    m.__router_guardInstances[guard] = rodash_createNode(guard)
                end if
                guardNode = m.__router_guardInstances[guard]
            end if
            if guardNode <> Invalid then
                canActivateResult = guardNode.callfunc("canActivate", route)
                if rodash_isBoolean(canActivateResult) then
                    canActivate = canActivateResult
                    if NOT canActivate then
                        message = {
                            allow: false
                            message: ("Route " + chr(34) + sgrouter_bslib_toString(route.path) + chr(34) + " is not accessible")
                        }
                        sgrouter_dispatchRouterState("GuardsCheckEnd", {
                            id: route.id
                            route: route
                        })
                        ' An event triggered when a navigation is canceled, directly or indirectly. This can happen for several reasons including when a route guard returns false or initiates a redirect.
                        sgrouter_dispatchRouterState("NavigationCancel", {
                            id: route.id
                            route: route
                        })
                        return promises_resolve(message)
                    end if
                else if rodash_isNonEmptyAA(canActivateResult) then
                    redirectTo = rodash_getString(canActivateResult, "path")
                    if rodash_isNonEmptyString(redirectTo) then
                        ' An event triggered at the end of the Guard phase of routing.
                        sgrouter_dispatchRouterState("GuardsCheckEnd", {
                            id: route.id
                            route: route
                        })
                        ' An event triggered when a navigation is canceled, directly or indirectly. This can happen for several reasons including when a route guard returns false or initiates a redirect.
                        sgrouter_dispatchRouterState("NavigationCancel", {
                            id: route.id
                            route: route
                        })
                        ' Options to merge
                        toMerge = []
                        if rodash_isNonEmptyAA(route.options) then
                            toMerge.push(route.options)
                        end if
                        if rodash_isNonEmptyAA(canActivateResult.options) then
                            toMerge.push(canActivateResult.options)
                        end if
                        toMerge.push({
                            navigationState: {
                                fromRedirect: true
                            }
                        })
                        options = rodash_merge({}, toMerge)
                        ' Reset flag so the redirect can start a fresh navigation
                        m.__router_navigationInProgress = false
                        return promises_resolve({
                            allow: false
                            redirect: _navigateTo(redirectTo, options)
                        })
                    end if
                else
                    message = {
                        allow: false
                        message: ("Invalid Route Guard on " + chr(34) + sgrouter_bslib_toString(route.path) + chr(34))
                    }
                    return promises_resolve(message)
                end if
            end if
        end for
    end if
    ' An event triggered at the start of the activation part of the Resolve phase of routing.
    sgrouter_dispatchRouterState("ActivationStart", {
        id: route.id
        route: route
    })
    ' An event triggered at the end of the Guard phase of routing.
    sgrouter_dispatchRouterState("GuardsCheckEnd", {
        id: route.id
        route: route
    })
    return promises_resolve({
        allow: true
    })
end function
'*************************************************************************
'#endregion *** PRIVATE Guard Functions
'*************************************************************************
'*************************************************************************
'#region *** PRIVATE View Stack Management Functions
'*************************************************************************

' Function to add a view to the view stack
' @param {Dynamic} route - The route to add to the view stack
' @param {Array} closeViews - The views to close/suspend
' @returns {Dynamic} - The result of the view stack management
function sgrouter_addViewToStack(route as Dynamic, closeViews = [] as Object) as Dynamic
    ' An event triggered at the start of the Resolve phase of routing.
    sgrouter_dispatchRouterState("ResolveStart", {
        id: route.id
        route: route
    })
    ' Look for a cached keepAlive view (stable key ignores query-string differences)
    keepAliveView = Invalid
    for each v in rodash_getNodeChildren(m.__router_keepAliveViewTarget)
        if v.route.path = route.path then
            keepAliveView = v
            route.navigationState = rodash_merge(route.navigationState, {
                fromKeepAlive: true
            })
            exit for
        end if
    end for
    toResolve = Invalid
    if keepAliveView <> Invalid then
        view = keepAliveView
        view.id = route.id
        view.route = route
        toResolve = promises_resolve(Invalid)
    else
        componentName = rodash_getString(route, "routeConfig.component")
        ' Create the view and hide it to prevent using texture memory until it is ready to be shown
        view = rodash_createNode(componentName, {
            visible: false
            translation: [
                10000
                10000
            ]
            id: route.id
            route: route
            router: m.top
        })
        if view = Invalid then
            return promises_reject({
                message: ("Failed to create view " + chr(34) + sgrouter_bslib_toString(componentName) + chr(34))
            })
        end if
        toResolve = view.callfunc("_beforeViewOpen", {
            route: route
        })
    end if
    return promises_chain(toResolve, {
        view: view
        closeViews: closeViews
        fromKeepAlive: keepAliveView <> Invalid
    }).then(function(_ as Dynamic, internalContext as Dynamic) as Dynamic
        view = internalContext.view
        ' Ensure the view is in the visible stack (and reparent if it was previously suspended)
        m.__router_viewTarget.appendChild(view)
        view.reparent(m.__router_viewTarget, true)
        ' Determine whether the active view is in the closeViews list.
        isActiveInCloseViews = false
        if m.__router_activeView <> Invalid then
            for each cv in internalContext.closeViews
                if cv.id = m.__router_activeView.id then
                    isActiveInCloseViews = true
                    exit for
                end if
            end for
        end if
        ' Build lifecycle promises to resolve before showing the new view.
        promisesToResolve = []
        ' Handle the active view:
        ' - keepAlive AND not in closeViews: suspend and move to keepAliveViewTarget (awaited)
        ' - in closeViews: just hide; lifecycle is handled by the closeViews loop below
        ' - otherwise: hide and fire onViewSuspend
        if m.__router_activeView <> Invalid then
            if NOT isActiveInCloseViews AND rodash_getBoolean(m.__router_activeView.route.routeConfig.keepAlive, "enabled") then
                promisesToResolve.push(sgrouter_suspendView(m.__router_activeView))
            else
                sgrouter_hideView(m.__router_activeView, NOT isActiveInCloseViews)
            end if
        end if
        ' Close or suspend views in closeViews.
        ' For keepAlive views: only call _onViewSuspend if this view IS the active view (first suspension).
        ' Non-active keepAlive views are already in keepAliveViewTarget from prior forward navigation.
        if rodash_isNonEmptyArray(internalContext.closeViews) then
            for each cv in internalContext.closeViews
                params = {
                    route: cv.route
                }
                if rodash_getBoolean(cv.route.routeConfig.keepAlive, "enabled") then
                    if m.__router_activeView <> Invalid AND cv.id = m.__router_activeView.id then
                        promisesToResolve.push(cv.callfunc("_onViewSuspend", params))
                    end if
                else
                    promisesToResolve.push(cv.callfunc("_beforeViewClose", params))
                end if
            end for
        end if
        return promises_all(promisesToResolve)
    end function).then(function(_ as Dynamic, internalContext as Dynamic) as Dynamic
        'An event triggered at the end of the activation part of the Resolve phase of routing.
        sgrouter_dispatchRouterState("ActivationEnd", {
            id: internalContext.view.id
            route: internalContext.view.route
        })
        ' An event triggered at the end of the Resolve phase of routing.
        sgrouter_dispatchRouterState("ResolveEnd", {
            id: internalContext.view.id
            route: internalContext.view.route
        })
        'now that all lifecycle promises have resolved, show the new view
        return sgrouter_showView(internalContext.view, internalContext.fromKeepAlive)
    end function).then(function(response as Dynamic, internalContext as Dynamic) as Dynamic
        ' Remove/suspend views after the new view is visible.
        ' keepAlive: reparent synchronously (_onViewSuspend already called above).
        ' non-keepAlive: destroy.
        if rodash_isNonEmptyArray(internalContext.closeViews) then
            for each cv in internalContext.closeViews
                if rodash_getBoolean(cv.route.routeConfig.keepAlive, "enabled") then
                    sgrouter_hideView(cv, false)
                    cv.reparent(m.__router_keepAliveViewTarget, true)
                else
                    if sgrouter_hideView(cv, false) then
                        rodash_removeNode(cv)
                    end if
                end if
            end for
        end if
        return response
    end function).catch(function(error as Dynamic) as Dynamic
        return promises_reject(error)
    end function).toPromise()
end function

' Function to close a view
' @param {Dynamic} view - The view to close
' @returns {Dynamic} - The result of the view close
function sgrouter_closeView(view = Invalid as Dynamic) as Dynamic
    view.translation = [
        1000000
        100000
    ]
    view.visible = false
    return promises_onThen(view.callfunc("_beforeViewClose", {
        route: view.route
    }), function(_ as Dynamic, internalContext as Dynamic) as Dynamic
        if sgrouter_hideView(internalContext.view, false) then
            rodash_removeNode(internalContext.view)
        end if
        return true
    end function, {
        view: view
    })
end function

' Function to suspend a view (keepAlive)
' @param {Dynamic} view - The view to suspend
' @returns {Dynamic} - The result of the view suspend
function sgrouter_suspendView(view = Invalid as Dynamic) as Dynamic
    if NOT rodash_isNode(view) then
        return promises_reject({
            message: "Invalid view"
        })
    end if
    view.visible = false
    view.translation = [
        10000
        10000
    ]
    return promises_onThen(view.callfunc("_onViewSuspend", {
        route: view.route
    }), function(_ as Dynamic, ctx as Dynamic) as Dynamic
        sgrouter_hideView(ctx.view, false)
        ctx.view.reparent(m.__router_keepAliveViewTarget, true)
        return true
    end function, {
        view: view
    })
end function

' Tells the view to hide and fire the onViewSuspend lifecycle method if onSuspend is true
' @param {Object} view - The view to hide
' @param {Boolean} onSuspend - Whether to fire the onViewSuspend lifecycle method
function sgrouter_hideView(view as Object, onSuspend = false as Boolean) as Boolean
    success = rodash_isNode(view)
    if success then
        view.visible = false
        view.translation = [
            10000
            10000
        ]
        if onSuspend then
            view.callfunc("_onViewSuspend", {
                route: view.route
            })
        end if
    end if
    return success
end function

' Called when the focus chain of the router changes
' @param {Object} event - The event object
sub sgrouter_onFocusChildChanged(event as Object)
    inFocusChain = event.getData() <> Invalid
    ' Don't update focus state mid-navigation: suspending/reparenting views causes transient
    ' focus loss that would clear m.__router_focusRequestMade. showView.finally restores focus
    ' once the new view is visible.
    if m.__router_navigationInProgress then
        return
    end if
    if NOT m.__router_processingGoBack AND m.__router_activeView <> Invalid AND NOT inFocusChain AND m.__router_focusRequestMade <> inFocusChain then
        m.__router_focusRequestMade = inFocusChain
        m.__router_activeView.callfunc("_handleFocus", {
            routerFocused: inFocusChain
        })
    end if
    m.__router_focusRequestMade = inFocusChain
end sub

' Tells the view to open and fire the handleFocus lifecycle method
' @param {Object} view - The view to show
' @param {Boolean} onResume - Whether the view is being resumed
function sgrouter_showView(view as Object, onResume = false as Boolean) as Dynamic
    if rodash_isNode(view) then
        view.visible = true
        view.translation = [
            0
            0
        ]
        m.__router_activeView = view
        response = Invalid
        params = {
            route: view.route
        }
        if onResume then
            response = view.callfunc("_onViewResume", params)
        else
            response = view.callfunc("_onViewOpen", params)
        end if
        return promises_chain(response, {
            response: response
            view: view
            onResume: onResume
        }).finally(function(context as Dynamic) as Dynamic
            focusSuccess = context.view.callfunc("_handleFocus", {
                routerFocused: m.__router_focusRequestMade
            })
            ' Return focus to the top node if the view didn't handle focus
            if m.__router_focusRequestMade AND NOT focusSuccess then
                m.top.setFocus(true)
            end if
            ' History updates should be based on navigation state, not onResume.
            ' - fromPopState: pop history
            ' - fromPushState: push history (including keepAlive resumes)
            if context.view.route.navigationState.fromPopState then
                m.__router_historyStack.pop()
            else
                if context.view.route.routeConfig.clearStackOnResolve then
                    m.__router_historyStack = []
                end if
                if context.view.route.navigationState.fromPushState then
                    m.__router_historyStack.push(context.view.route.path)
                end if
            end if
            m.__router_processingGoBack = false
            sgrouter_dispatchRouterState("NavigationEnd", {
                id: context.view.id
                route: context.view.route
            })
            return context.response
        end function).toPromise()
    end if
    return promises_reject({
        message: "Invalid view"
    })
end function
'*************************************************************************
'#endregion *** PRIVATE View Stack Management Functions
'*************************************************************************
'*************************************************************************
'#region *** PRIVATE Helper Functions
'*************************************************************************

' Resolve a named route to a literal path string.
' Substitutes :param segments from params AA; leftover params become query string.
' Returns Invalid if a required :param segment has no matching value in params.
function sgrouter_resolveNamedRoutePath(name as String, pattern as String, params = Invalid as Dynamic) as Dynamic
    if params <> Invalid AND type(params) <> "roAssociativeArray" then
        print "[WARN] sgRouter: params for route """ + name + """ must be an associative array, treating as missing"
        params = Invalid
    end if
    segments = pattern.split("/")
    resolvedSegments = []
    usedKeys = {}
    for each segment in segments
        if left(segment, 1) = ":" then
            paramKey = mid(segment, 2)
            if params = Invalid OR params[paramKey] = Invalid then
                print "[WARN] sgRouter: missing required param """ + paramKey + """ for route """ + name + """ (" + pattern + ")"
                return Invalid
            end if
            resolvedSegments.push(params[paramKey].toStr())
            usedKeys[paramKey] = true
        else
            resolvedSegments.push(segment)
        end if
    end for
    resolvedPath = resolvedSegments.join("/")
    ' Append unused params as query string
    if params <> Invalid then
        queryParts = []
        for each key in params
            if usedKeys[key] = Invalid then
                queryParts.push(key + "=" + params[key].toStr())
            end if
        end for
        if queryParts.count() > 0 then
            resolvedPath = resolvedPath + "?" + queryParts.join("&")
        end if
    end if
    return resolvedPath
end function

' Helper function to create a route object
' @param {Object} config - The configuration object
' @returns {Dynamic} - The result of the view open
function sgrouter_createRoute(config = {} as Object) as Object
    return {
        path: rodash_getString(config, "path")
        routeConfig: rodash_getAA(config, "routeConfig")
        context: rodash_merge(sgrouter_createBaseContext(), rodash_getAA(config, "context"))
        navigationState: sgrouter_createBaseNavigationState()
        routeParams: rodash_getAA(config, "routeParams")
        queryParams: rodash_getAA(config, "queryParams")
        hash: rodash_getString(config, "hash")
        id: CreateObject("roDeviceInfo").GetRandomUUID()
        router: m.top
    }
end function

' Helper function to dispatch a router state
' @param {String} stateType - The type of state to dispatch
' @param {Object} context - The context to pass to the state
sub sgrouter_dispatchRouterState(stateType as String, context = {} as Dynamic)
    if stateType = "NavigationStart" then
        m.__router_navigationInProgress = true
    else if stateType = "NavigationEnd" OR stateType = "NavigationError" then
        m.__router_navigationInProgress = false
    end if
    update = {
        type: stateType
        id: rodash_getString(context, "route.id", context.id)
        state: {}
    }
    if rodash_isAA(context.error) then
        update.error = context.error
    end if
    if rodash_isNode(context.route) then
        r = context.route
        update.state = sgrouter_createRouteSnapshot(r)
        update.url = r.path
    end if
    m.top.routerState = update
end sub

function sgrouter_createRouteSnapshot(route as Object) as Object
    return {
        routeConfig: route.routeConfig
        queryParams: route.queryParams
        routeParams: route.routeParams
        hash: route.hash
    }
end function

' Helper function to create a base context object
' @returns {Object} - The base context object
function sgrouter_createBaseContext() as Object
    return {}
end function

function sgrouter_createBaseNavigationState() as Object
    return {
        fromRedirect: false
        fromKeepAlive: false
        fromPopState: false
        fromPushState: false
    }
end function

' Helper function to find a matching route
' @param {String} path - The path to find a matching route for
' @param {Object} routes - The routes to search
' @returns {Dynamic} - The matching route
function sgrouter_findMatchingRoute(path as String, routes as Object) as object
    hash = sgrouter_getHashParam(path)
    if rodash_isNonEmptyString(hash) then
        path = path.replace("#" + hash, "")
    end if
    ' Separate the path from the query string
    pathParts = path.split("?")
    basePath = sgrouter_normalizePath(pathParts[0])
    queryString = Invalid
    if pathParts.count() > 1 then
        queryString = pathParts[1]
    end if
    ' Parse the query string if present
    queryParams = sgrouter_parseQueryString(queryString)
    ' ============================================================
    ' Single-pass match: exact wins immediately; parameterized
    ' tracks the best (most static segments) candidate.
    ' ============================================================
    bestMatchRoutePath = Invalid
    bestMatchParams = Invalid
    bestStaticCount = -1
    pathParts = basePath.split("/")
    for each routePath in routes
        normalizedRoutePath = sgrouter_normalizePath(routePath)
        ' Fast path: exact static match — return immediately
        if normalizedRoutePath = basePath then
            return sgrouter_createRoute({
                path: path
                routeConfig: routes[routePath]
                queryParams: queryParams
                hash: hash
            })
        end if
        ' Parameterized match — segment count must align
        routeParts = normalizedRoutePath.split("/")
        if routeParts.count() = pathParts.count() then
            matchedParams = {}
            isMatch = true
            staticCount = 0
            for i = 0 to routeParts.count() - 1
                routePart = routeParts[i]
                pathPart = pathParts[i]
                if routePart.left(1) = ":" then
                    ' Parameter segment, e.g. :slug
                    paramName = routePart.mid(1)
                    matchedParams[paramName] = pathPart
                else if routePart = pathPart then
                    ' Static segment matched exactly
                    staticCount = staticCount + 1
                else
                    ' Static part does not match; this route is not a candidate
                    isMatch = false
                    exit for
                end if
            end for
            if isMatch then
                ' Prefer routes with more static segments (more specific)
                if staticCount > bestStaticCount then
                    bestStaticCount = staticCount
                    bestMatchRoutePath = routePath
                    bestMatchParams = matchedParams
                end if
            end if
        end if
    end for
    ' If we found at least one parameterized match, return the best one
    if bestMatchRoutePath <> Invalid then
        return sgrouter_createRoute({
            path: path
            routeConfig: routes[bestMatchRoutePath]
            routeParams: bestMatchParams
            queryParams: queryParams
            hash: hash
        })
    end if
    ' ============================================================
    ' 3) No match found; return a "not found" route object
    ' ============================================================
    return sgrouter_createRoute({
        path: path
        queryParams: queryParams
        hash: hash
    })
end function

' Helper Function to get the hash parameter from a URL
' @param {String} url - The URL to get the hash parameter from
' @returns {String} - The hash parameter
function sgrouter_getHashParam(url as String) as String
    if rodash_isEmptyString(url) then
        return ""
    end if
    hashIndex = rodash_stringIndexOf(url, "#")
    if hashIndex = -1 then
        return ""
    end if
    return url.mid(hashIndex + 1)
end function

' Helper function to normalize a path
' @param {String} path - The path to normalize
' @returns {String} - The normalized path
function sgrouter_normalizePath(path as String) as String
    path = path.trim()
    if path.right(1) = "/" then
        path = path.left(path.len() - 1)
    end if
    if path.left(1) <> "/" then
        path = "/" + path
    end if
    return path
end function

' Helper function to parse a query string into an associative array
' @param {Dynamic} queryString - The query string to parse
' @returns {Object} - The parsed query string
function sgrouter_parseQueryString(queryString as Dynamic) as Object
    if NOT rodash_isNonEmptyString(queryString) then
        return {}
    end if
    queryParams = {}
    pairs = queryString.split("&")
    for each pair in pairs
        keyValue = pair.split("=")
        if keyValue.count() = 2 then
            key = keyValue[0]
            value = keyValue[1]
            queryParams[key] = value
        end if
    end for
    return queryParams
end function
'*************************************************************************
'#endregion *** PRIVATE Helper Functions
'*************************************************************************