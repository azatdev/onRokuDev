function wrapQuotations(str: any) {
    return `"${str}"`
}

function htmlEntities(str: any) {
    return wrapQuotations(String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'));
}

export default {
    s: function (renderedString: any, wrap = true) {
        if (renderedString === undefined) throw new Error();
        return wrap ? wrapQuotations(renderedString) : renderedString
    },
    o: function(renderedString: any) {
        if (renderedString === undefined) throw new Error();
        return JSON.stringify(renderedString)
    },
    stringify: function(renderedString: any) {
        if (renderedString === undefined) throw new Error();
        return htmlEntities(JSON.stringify(renderedString))
    }
}
