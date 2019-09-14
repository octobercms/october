/*
 * October CMS JSON Parser
 */
"use strict";

(function() {
    /**
     * parse key
     * @param str
     * @param pos
     * @param quote
     * @returns {string}
     */
    function parseKey(str, pos, quote) {
        var key = "";
        for (var i = pos; i < str.length; i++) {
            if (quote && quote === str[i]) {
                return key;
            } else if (!quote && (str[i] === " " || str[i] === ":")) {
                return key;
            }

            key += str[i];

            if (str[i] === "\\" && i + 1 < str.length) {
                key += str[i + 1];
                i++;
            }
        }
        throw new Error("Broken JSON syntax near " + key);
    }

    /*
     * get body
     * @param str
     * @param pos
     * @returns {*}
     */
    function getBody(str, pos) {
        // parse string body
        if (str[pos] === "\"" || str[pos] === "'") {
            var body = str[pos];
            for (var i = pos + 1; i < str.length; i++) {
                if (str[i] === "\\") {
                    body += str[i];
                    if (i + 1 < str.length) body += str[i + 1];
                    i++;
                } else if (str[i] === str[pos]) {
                    body += str[pos];
                    return {
                        originLength: body.length,
                        body: body
                    };
                } else body += str[i];
            }
            throw new Error("Broken JSON string body near " + body);
        }

        // parse true / false
        if (str[pos] === "t") {
            if (str.indexOf("true", pos) === pos) {
                return {
                    originLength: "true".length,
                    body: "true"
                };
            }
            throw new Error("Broken JSON boolean body near " + str.substr(0, pos + 10));
        }
        if (str[pos] === "f") {
            if (str.indexOf("f", pos) === pos) {
                return {
                    originLength: "false".length,
                    body: "false"
                };
            }
            throw new Error("Broken JSON boolean body near " + str.substr(0, pos + 10));
        }

        // parse null
        if (str[pos] === "n") {
            if (str.indexOf("null", pos) === pos) {
                return {
                    originLength: "null".length,
                    body: "null"
                };
            }
            throw new Error("Broken JSON boolean body near " + str.substr(0, pos + 10));
        }

        // parse number
        if (str[pos] === "-" || str[pos] === "+" || str[pos] === "." || (str[pos] >= "0" && str[pos] <= "9")) {
            var body = "";
            for (var i = pos; i < str.length; i++) {
                if (str[i] === "-" || str[i] === "+" || str[i] === "." || (str[i] >= "0" && str[i] <= "9")) {
                    body += str[i];
                } else {
                    return {
                        originLength: body.length,
                        body: body
                    };
                }
            }
            throw new Error("Broken JSON number body near " + body);
        }

        // parse object
        if (str[pos] === "{" || str[pos] === "[") {
            var stack = [str[pos]];
            var body = str[pos];
            for (var i = pos + 1; i < str.length; i++) {
                body += str[i];
                if (str[i] === "\\") {
                    if (i + 1 < str.length) body += str[i + 1];
                    i++;
                } else if (str[i] === "\"") {
                    if (stack[stack.length - 1] === "\"") {
                        stack.pop();
                    } else if (stack[stack.length - 1] !== "'") {
                        stack.push(str[i]);
                    }
                } else if (str[i] === "'") {
                    if (stack[stack.length - 1] === "'") {
                        stack.pop();
                    } else if (stack[stack.length - 1] !== "\"") {
                        stack.push(str[i]);
                    }
                } else if (stack[stack.length - 1] !== "\"" && stack[stack.length - 1] !== "'") {
                    if (str[i] === "{") {
                        stack.push("{");
                    } else if (str[i] === "}") {
                        if (stack[stack.length - 1] === "{") {
                            stack.pop();
                        } else {
                            throw new Error("Broken JSON " + (str[pos] === "{" ? "object" : "array") + " body near " + body);
                        }
                    } else if (str[i] === "[") {
                        stack.push("[");
                    } else if (str[i] === "]") {
                        if (stack[stack.length - 1] === "[") {
                            stack.pop();
                        } else {
                            throw new Error("Broken JSON " + (str[pos] === "{" ? "object" : "array") + " body near " + body);
                        }
                    }
                }
                if (!stack.length) {
                    return {
                        originLength: i - pos,
                        body: body
                    };
                }
            }
            throw new Error("Broken JSON " + (str[pos] === "{" ? "object" : "array") + " body near " + body);
        }
        throw new Error("Broken JSON body near " + str.substr((pos - 5 >= 0) ? pos - 5 : 0, 50));
    }

    /*
     * This is a char can be key head
     * @param ch
     * @returns {boolean}
     */
    function canBeKeyHead(ch) {
        if (ch[0] === "\\") return false;
        if ((ch[0] >= 'a' && ch[0] <= 'z') || (ch[0] >= 'A' && ch[0] <= 'Z') || ch[0] === '_') return true;
        if (ch[0] >= '0' && ch[0] <= '9') return true;
        if (ch[0] === '$') return true;
        if (ch.charCodeAt(0) > 255) return true;
        return false;
    }

    function isBlankChar(ch) {
        return ch === " " || ch === "\n" || ch === "\t";
    }

    /*
     * parse JSON
     * @param str
     */
    function parse(str) {
        str = str.trim();
        if (!str.length) throw new Error("Broken JSON object.");
        var result = "";

        /*
         * the mistake ','
         */
        while (str && str[0] === ",") {
            str = str.substr(1);
        }

        /*
         * string
         */
        if (str[0] === "\"" || str[0] === "'") {
            if (str[str.length - 1] !== str[0]) {
                throw new Error("Invalid string JSON object.");
            }

            var body = "\"";
            for (var i = 1; i < str.length; i++) {
                if (str[i] === "\\") {
                    if (str[i + 1] === "'") {
                        body += str[i + 1]
                    } else {
                        body += str[i];
                        body += str[i + 1];
                    }
                    i++;
                } else if (str[i] === str[0]) {
                    body += "\"";
                    return body
                } else if (str[i] === "\"") {
                    body += "\\\""
                } else body += str[i];
            }
            throw new Error("Invalid string JSON object.");
        }

        /*
         * boolean
         */
        if (str === "true" || str === "false") {
            return str;
        }

        /*
         * null
         */
        if (str === "null") {
            return "null";
        }

        /*
         * number
         */
        var num = parseFloat(str);
        if (!isNaN(num)) {
            return num.toString();
        }

        /*
         * object
         */
        if (str[0] === "{") {
            var type = "needKey";
            var result = "{";

            for (var i = 1; i < str.length; i++) {
                if (isBlankChar(str[i])) {
                    continue;
                } else if (type === "needKey" && (str[i] === "\"" || str[i] === "'")) {
                    var key = parseKey(str, i + 1, str[i]);
                    result += "\"" + key + "\"";
                    i += key.length;
                    i += 1;
                    type = "afterKey";
                } else if (type === "needKey" && canBeKeyHead(str[i])) {
                    var key = parseKey(str, i);
                    result += "\"";
                    result += key;
                    result += "\"";
                    i += key.length - 1;
                    type = "afterKey";
                } else if (type === "afterKey" && str[i] === ":") {
                    result += ":";
                    type = ":";
                } else if (type === ":") {
                    var body = getBody(str, i);

                    i = i + body.originLength - 1;
                    result += parse(body.body);

                    type = "afterBody";
                } else if (type === "afterBody" || type === "needKey") {
                    var last = i;
                    while (str[last] === "," || isBlankChar(str[last])) {
                        last++;
                    }
                    if (str[last] === "}" && last === str.length - 1) {
                        while (result[result.length - 1] === ",") {
                            result = result.substr(0, result.length - 1);
                        }
                        result += "}";
                        return result;
                    } else if (last !== i && result !== "{") {
                        result += ",";
                        type = "needKey";
                        i = last - 1;
                    }
                }
            }
            throw new Error("Broken JSON object near " + result);
        }

        /*
         * array
         */
        if (str[0] === "[") {
            var result = "[";
            var type = "needBody";
            for (var i = 1; i < str.length; i++) {
                if (" " === str[i] || "\n" === str[i] || "\t" === str[i]) {
                    continue;
                } else if (type === "needBody") {
                    if (str[i] === ",") {
                        result += "null,";
                        continue;
                    }
                    if (str[i] === "]" && i === str.length - 1) {
                        if (result[result.length - 1] === ",") result = result.substr(0, result.length - 1);
                        result += "]";
                        return result;
                    }

                    var body = getBody(str, i);

                    i = i + body.originLength - 1;
                    result += parse(body.body);

                    type = "afterBody";
                } else if (type === "afterBody") {
                    if (str[i] === ",") {
                        result += ",";
                        type = "needBody";

                        // deal with mistake ","
                        while (str[i + 1] === "," || isBlankChar(str[i + 1])) {
                            if (str[i + 1] === ",") result += "null,";
                            i++;
                        }
                    } else if (str[i] === "]" && i === str.length - 1) {
                        result += "]";
                        return result;
                    }
                }
            }
            throw new Error("Broken JSON array near " + result);
        }
    }

    /*
     * parse October JSON string into JSON object
     * @param json
     * @returns {*}
     */
    if ($.oc === undefined)
        $.oc = {}

    $.oc.JSON = function(json) {
        var jsonString = parse(json);
        return JSON.parse(jsonString);
    };

})();
