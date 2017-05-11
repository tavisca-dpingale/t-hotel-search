var AutoComplete = (function () {
    "use strict";
    var AutoComplete = function (params, component) {
        //Construct
        if (this) {
            var i,
                self = this,
                defaultParams = {
                    limit: 10,
                    method: "GET",
                    noResult: component.emptyMessage,
                    paramName: "query",
                    select: function (input, item) {
                        attr(input, { "data-autocomplete-old-value": input.value = attr(item, "data-autocomplete-value", item.innerHTML) });
                        component.selectedValue = attr(item, "data-autocomplete-value", item.innerHTML);
                        component.selectedItem = component.response[attr(item)];
                        if (item.nodeName != "LI") {
                            item = item.parentNode;
                        }
                        var itemIndex = item.getAttribute("data-index");
                        var dataAutocompleteDetail = component.response[itemIndex];
                        component.domHost.dataCity = dataAutocompleteDetail;
                        component.fire('autosuggest-select', component.selectedItem);
                        var setClear = component.children[1];
                        component.fire('tab-next');
                        if (mq) {
                            component.domHost.querySelector("#start1").style.display = "block";
                            component.domHost.querySelector("#end1").style.display = "block";
                            component.domHost.querySelector("#travellField").style.display = "block";
                            component.domHost.querySelector("#Button").style.display = "block";
                            setClear.style.display = "block";
                            var tool = component.domHost.querySelector("#toolbarAutoComplete");
                            tool.hidden = true;
                            var ul = component.querySelector("ul.ulClassMobile");
                            component.querySelector("#dropBox").style.display = "none";
                            component.querySelector("#clearContainer").style.display = "block";
                            ul.removeAttribute("class");
                        }
                        closeBox(component.querySelector(".autocomplete"), false);
                    },
                    open: function (input, result) {
                        var self = this;
                        Array.prototype.forEach.call(result.getElementsByTagName("li"), function (li) {
                            li.onmousedown = function (event) {
                                self.select(input, event.target);
                            };
                        });
                    },

                    post: function (result, res, custParams, cityName) {
                        try {
                            if (!Array.prototype.includes) {
                                Object.defineProperty(Array.prototype, "includes", {
                                    enumerable: false,
                                    value: function (obj) {
                                        var newArr = this.filter(function (el) {
                                            return el == obj;
                                        });
                                        return newArr.length > 0;
                                    }
                                });
                            }
                            component.$.spinner.hidden = true;
                            var response = JSON.parse(res);
                            if (response.status.isSuccessful) {
                                var node = component.querySelector("#dropBox");
                                while (node.hasChildNodes()) {
                                    node.removeChild(node.lastChild);
                                }
                                component.response = new Array();
                                response = response.items;
                                var groupedByType = {};
                                var typeArr2 = [];
                                for (var item in response) {
                                    var cityn = response[item].type.toUpperCase();
                                    if (cityn === 'POINTOFINTEREST') {
                                        cityn = "POINT OF INTEREST";
                                    }
                                    if (!typeArr2.includes(cityn)) {
                                        typeArr2.push(cityn);
                                    }
                                    if (!groupedByType[cityn]) {
                                        groupedByType[cityn] = [];
                                    }
                                    groupedByType[cityn].push(response[item]);
                                }
                                var typeUL = domCreate("ul")
                                var ul = domCreate("ul")
                                var dataIndex = 0;
                                for (var t = 0; t < typeArr2.length; t++) {
                                    for (var i = 0; i < groupedByType[typeArr2[t]].length; i++) {
                                        component.response.push(groupedByType[typeArr2[t]][i]);
                                    }
                                }
                                for (var t = 0; t < typeArr2.length; t++) {
                                    //component.response = groupedByType[typeArr2[t]];

                                    var createLi = function () { return domCreate("li"); },
                                        autoReverse = function (param, limit) {
                                            return (limit < 0) ? param.reverse() : param;
                                        },
                                        addLi = function (ul, li, response, index) {
                                            var tempResponse = response;
                                            if (index === 0 && t === 0) {
                                                tempResponse = "<span class='boldText'>" + tempResponse + "</span>";
                                            }
                                            else {
                                                tempResponse = tempResponse.replace(cityName, "<span class='boldText'>" + cityName + "</span>");
                                            }
                                            li.innerHTML = tempResponse;
                                            attr(li, { "data-autocomplete-value": response });
                                            attr(li, { "data-index": index });
                                            attrClass(li, "liColor");
                                            ul.appendChild(li);
                                            return createLi();
                                        },
                                        addType = function (ul, response) {
                                            var tdiv = domCreate("div");
                                            var p = domCreate("span");
                                            tdiv.id = "line";
                                            tdiv.style.height = "10px";
                                            p.style.color = "Silver";
                                            p.style.borderbottomstyle = "solid";
                                            p.innerHTML = response;
                                            tdiv.appendChild(p);
                                            ul.appendChild(tdiv);
                                        },
                                        empty,
                                        i = 0,
                                        length = groupedByType[typeArr2[t]].length,
                                        li = createLi(),
                                        limit = custParams.limit,
                                        propertie,
                                        properties,
                                        value;
                                    if (length) {
                                        addType(ul, typeArr2[t])
                                        response = autoReverse(groupedByType[typeArr2[t]], limit);
                                        var item = null;
                                        for (; i < length && (i < Math.abs(limit) || !limit); i++) {
                                            if (component.tokenParam != '')
                                                item = response[i][component.tokenParam];
                                            li = addLi(ul, li, item, dataIndex++);
                                        }
                                    }
                                    else {
                                        //If the response is an object or an array and that the response is empty, so this script is here, 
                                        //for the message no response.
                                        empty = true;
                                        attrClass(li, "locked");
                                        li = addLi(ul, li, custParams.noResult);
                                    }
                                }//for
                                if (result.hasChildNodes()) {
                                    result.removeChild(result.lastChild);
                                }
                                if (mq) {
                                    var tool = component.domHost.querySelector("#toolbarAutoComplete");
                                    tool.style.display = "block";
                                    tool.hidden = false;
                                    var inPut = tool.childNodes[2];
                                    result.appendChild(ul);
                                    attrClass(ul, "ulClassMobile");
                                }
                                else {
                                    result.appendChild(ul);
                                }
                                attrClass(result, "autocomplete open");
                                return empty;
                            }//if response
                            else {
                                return empty;
                            }
                        } catch (e) {
                            result.innerHTML = response;
                        }
                    },
                    pre: function (input) {
                        return input.value;
                    },
                    selector: ["input[data-autocomplete]"]
                    // selector:["input[ data-autocomplete-dealy]"]
                },
                selectors;

            self._custArgs = [];
            self._args = merge(defaultParams, params || {});
            selectors = self._args.selector;
            if (!Array.isArray(selectors)) {
                selectors = [selectors];
            }
            selectors.forEach(function (selector) {
                Array.prototype.forEach.call(component.querySelectorAll(selector), function (input) {
                    if (input.nodeName.match(/^INPUT$/i) && input.type.match(/^TEXT|SEARCH$/i)) {
                        var oldValueLabel = "data-autocomplete-old-value",
                            result = component.$.dropBox,
                            request,
                            positionLambda = function () {
                                attr(result, {
                                    "class": "autocomplete"
                                });
                            },
                            destroyLambda = function () {
                                input.onfocus = input.onblur = input.onkeyup = null;
                                input.removeEventListener("position", positionLambda);
                                input.removeEventListener("destroy", destroyLambda);
                                result.parentNode.removeChild(result);
                                self.CustParams(input, true);
                            },
                            focusLamdba = function () {
                                var dataAutocompleteOldValue = attr(input, oldValueLabel);
                                if (!component.caching && result.hasChildNodes()) {
                                    result.removeChild(result.lastChild);
                                }
                                if (!dataAutocompleteOldValue || input.value != dataAutocompleteOldValue) {
                                    attrClass(result, "autocomplete open");
                                }
                            };

                        attr(input, { "autocomplete": "off" });
                        positionLambda(input, result);
                        input.addEventListener("position", positionLambda);
                        input.addEventListener("destroy", destroyLambda);
                        Polymer.dom(component.querySelector('#append')).appendChild(result);
                        input.onfocus = focusLamdba;
                        input.onblur = closeBox(null, result);
                        Polymer.dom(component.$.clearContainer).node.setAttribute('class', 'hide')

                    }

                    input.onkeyup = function (e) {
                        var first = result.querySelector("li:first-child:not(.locked)"),
                            input = e.target,
                            custParams = self.CustParams(input),
                            inputValue = custParams.pre(input),
                            dataAutocompleteOldValue = attr(input, oldValueLabel),
                            keyCode = e.keyCode,
                            currentIndex,
                            position,
                            lisCount,
                            liActive;
                        //------------------------------------------
                        if (this.value == "") {
                            Polymer.dom(component.$.autoInput).node.setAttribute("style", "width:99%");
                            Polymer.dom(component.$.clearContainer).node.setAttribute('class', 'hide')
                        }
                        else {
                            this.domHost.querySelector("#autoSuggest").style.color = "lightgray";
                            Polymer.dom(component.$.autoInput).node.setAttribute("style", "width:99%");
                            Polymer.dom(component.$.clearContainer).node.setAttribute('class', 'unhide')
                        }
                        //--------------------------------------------

                        if (keyCode == 13 && attrClass(result).indexOf("open") != -1) {
                            liActive = result.querySelector("li.active");
                            if (liActive !== null) {
                                self._args.select(input, liActive);
                                attrClass(result, "autocomplete");
                                closeBox(null, result);
                            }

                        }
                        else {

                            if (keyCode == 38 || keyCode == 40) {
                                liActive = result.querySelector("li.active");
                                if (!liActive) {
                                    liActive = result.querySelector("div");
                                }
                                if (liActive) {
                                    currentIndex = Array.prototype.indexOf.call(liActive.parentNode.children, liActive);
                                    position = currentIndex + (keyCode - 39);
                                     ////////////////////////
                                     if(position === 1){
                                        this.domHost.querySelector("#dropBox").scrollTop = 0;
                                    }
                                     if(position === 9){
                                         this.domHost.querySelector("#dropBox").scrollTop = 300;
                                     }
                                     if(position >= 2 && position <= 10 && keyCode ==40){
                                     this.domHost.querySelector("#dropBox").scrollTop = this.domHost.querySelector("#dropBox").scrollTop + 20;
                                    }
                                     if(keyCode == 38){
                                        this.domHost.querySelector("#dropBox").scrollTop = this.domHost.querySelector("#dropBox").scrollTop - 20;
                                    }
                                    ///////////////////////////////
                                    lisCount = result.getElementsByTagName("li").length + 2;

                                    attrClass(liActive, "selected");
                                    if (position <= 0) {
                                        position = lisCount + 1;
                                    } else if (position > lisCount) {
                                        position = 0;
                                    }
                                    var nextElement = liActive.parentElement.childNodes.item(position);

                                    if (nextElement == null || nextElement.tagName == 'DIV') {
                                        nextElement = liActive.parentElement.childNodes.item(position + ((keyCode - 39)));
                                    }
                                    attrClass(nextElement, "active");
                                } else if (first) {
                                    attrClass(first, "active");
                                }
                            } else if (keyCode < 35 || keyCode > 40) {
                                if (inputValue && custParams.url) {
                                    if (inputValue.length >= component.minimumCharacters && component.selectedValue != inputValue) {                                        
                                        component.$.spinner.hidden = false;
                                        setTimeout(function () {
                                            request = ajax(request, custParams, inputValue.trim(), input, result, component.subType, component.queryParams);
                                        }, component.delay);
                                    }
                                    else {
                                        if (result.hasChildNodes()) {
                                            result.removeChild(result.lastChild);
                                        }
                                    }
                                    if (mq) {
                                        if (inputValue.length >= 0) {
                                            if (mq) {
                                                component.domHost.querySelector("#start1").style.display = "none";
                                                component.domHost.querySelector("#end1").style.display = "none";
                                                component.domHost.querySelector("#travellField").style.display = "none";
                                                component.domHost.querySelector("#Button").style.display = "none";
                                                component.domHost.querySelector("#dropBox").style.display = "block";
                                            }
                                            var toolbar = component.domHost.querySelector("#toolbarAutoComplete");
                                            var itm = this;
                                            var cln;
                                            var div;
                                            cln = toolbar.querySelector("#spanAutoId");

                                            if (cln == null) {
                                                cln = itm.cloneNode(true);
                                                div = domCreate("div");
                                                div.style.borderBottom = "1px solid lightgray";
                                                div.style.position = "relative";
                                                div.style.height = "15px";
                                                div.style.width = "100%";
                                                div.setAttribute("id", "cloneDiv")
                                                // div.style.top = "-40px";
                                                div.style.fontSize = "18px";
                                                div.style.fontFamily = "roboto";
                                                div.appendChild(cln);
                                                toolbar.appendChild(div);
                                            }

                                            cln.setAttribute("id", "spanAutoId");
                                            cln.style.width = "";
                                            cln.style.color = "";
                                            attrClass(cln, "automobileInput");
                                            cln.value = input.value;

                                            /*Dummy blank ul to create mobile view on type of 1 char */
                                            var ul = domCreate("ul");
                                            toolbar.style.display = "block";
                                            toolbar.hidden = false;
                                            var inPut = toolbar.childNodes[2];
                                            result.appendChild(ul);
                                            attrClass(ul, "ulClassMobile");

                                            if (inputValue.length >= component.minimumCharacters) {
                                                component.$.spinner.hidden = false;
                                                setTimeout(function () {
                                                    request = ajax(request, custParams, inputValue.trim(), input, result, component.subType, component.queryParams);
                                                }, component.delay);
                                            }
                                            var setvalue = component.domHost.querySelector("#spanAutoId");
                                            setvalue.focus();
                                            setvalue.onkeyup = function (e) {
                                                inputValue = cln.value;
                                                setTimeout(function () {
                                                    if (inputValue.length >= component.minimumCharacters) {
                                                        request = ajax(request, custParams, inputValue.trim(), input, result, component.subType, component.queryParams);
                                                    }
                                                    if (inputValue.length >= 0) {
                                                        var node = component.querySelector("#dropBox");
                                                        while (node.hasChildNodes()) {
                                                            node.removeChild(node.lastChild);
                                                        }
                                                        var toolbar = component.domHost.querySelector("#toolbarAutoComplete");
                                                        var ul = domCreate("ul");
                                                        toolbar.style.display = "block";
                                                        toolbar.hidden = false;
                                                        var inPut = toolbar.childNodes[2];
                                                        node.appendChild(ul);
                                                        attrClass(ul, "ulClassMobile");
                                                    }
                                                }, component.delay);

                                            }
                                        }
                                        else {
                                            component.domHost.querySelector("#toolbarAutoComplete").style.display = "none";
                                            if (result.hasChildNodes()) {
                                                result.removeChild(result.lastChild);
                                            }

                                        }
                                    }
                                }
                            }
                        };
                    }
                });
            });
        } else {
            new AutoComplete(params, component);
        }
    };
    //call to api
    AutoComplete.prototype = {
        CustParams: function (input, toDelete) {
            var dataAutocompleteIdLabel = "data-autocomplete-id",
                self = this,
                prefix = "data-autocomplete",
                params = {
                    limit: prefix + "-limit",
                    method: prefix + "-method",
                    noResult: prefix + "-no-result",
                    paramName: prefix + "-param-name",
                    delay: prefix + "-delay",
                    url: prefix
                },
                paramsAttribute = Object.getOwnPropertyNames(params),
                i;

            if (toDelete) {
                delete self._custArgs[attr(input, dataAutocompleteIdLabel)];
            } else {
                if (!input.hasAttribute(dataAutocompleteIdLabel)) {
                    input.setAttribute(dataAutocompleteIdLabel, self._custArgs.length);

                    for (i = paramsAttribute.length - 1; i >= 0; i--) {
                        params[paramsAttribute[i]] = attr(input, params[paramsAttribute[i]]);
                    }

                    for (i in params) {
                        if (params.hasOwnProperty(i) && !params[i]) {
                            delete params[i];
                        }
                    }

                    if (params.limit) {
                        if (isNaN(params.limit)) {
                            delete params.limit;
                        } else {
                            params.limit = parseInt(params.limit);
                        }
                    }
                    self._custArgs.push(merge(self._args, params));
                }
                return self._custArgs[attr(input, dataAutocompleteIdLabel)];
            }
        }
    };

    function ajax(request, custParams, value, input, result, subType, queryParams) {
        if (request) {
            request.abort();
        }
        var method = custParams.method,
            url = custParams.url;
        url = url + value;
        if (subType != '')
            url = url + "/" + subType;
        if (queryParams != "") {
            url += "?" + queryParams;
        }
        request = new XMLHttpRequest();
        request.open(method, url, true);
        request.setRequestHeader("Content-type", "application/json");
        request.setRequestHeader("Accept", "application/json");
        request.onreadystatechange = function () {
            if (request.readyState == 4 && request.status == 200) {
                if (!custParams.post(result, request.response, custParams, toTitleCase(value))) {
                    custParams.open(input, result);
                }
            }
        };
        request.send(queryParams);
        return request;
    }
    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    }

    function closeBox(result, closeNow) {
        if (closeNow) {
            attrClass(result, "autocomplete");
        }
        else {
            setTimeout(function () { closeBox(result, true); }, 150);
        }
    }

    //Method deported
    function merge(obj1, obj2) {
        var concat = {},
            tmp;
        for (tmp in obj1) {
            concat[tmp] = obj1[tmp];
        }
        for (tmp in obj2) {
            concat[tmp] = obj2[tmp];
        }
        return concat;
    }
    return AutoComplete;
}());

function attr(item, attrs, defaultValue) {
    if (item) {
        try {
            for (var key in attrs) {
                item.setAttribute(key, attrs[key]);
            }
        } catch (e) {
            return item.hasAttribute(attrs) ? item.getAttribute(attrs) : defaultValue;
        }
    }
}

function attrClass(item, value) {
    if (item) {
        return attr(item, !value ? "class" : { "class": value });
    }
}

function domCreate(item) {
    return document.createElement(item);
}
