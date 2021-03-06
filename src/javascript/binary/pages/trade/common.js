/*
 * This contains common functions we need for processing the response
 */

 Element.prototype.hide = function(){
     this.style.display = 'none';
 };

 Element.prototype.show = function(){
     this.style.display = '';
 };

/*
 * function to display contract form as element of ul
 */
 function displayContractForms(id, elements, selected) {
     'use strict';
     var target = document.getElementById(id),
         fragment = document.createDocumentFragment(),
         len = elements.length;

     target.innerHTML = '';

     if (elements) {
         var tree = getContractCategoryTree(elements);
         for(var i=0;i<tree.length;i++){
             
             var el1 = tree[i];
             var li = document.createElement('li');

             li.classList.add('tm-li');
             if(i===0){
                 li.classList.add('first');
             }
             else if(i===tree.length-1){
                 li.classList.add('last');
             }

             if(typeof el1 === 'object'){
                 var fragment2 = document.createDocumentFragment();
                 var flag = 0;
                 var first = '';
                 for(var j=0; j<el1[1].length; j++){
                     var el2 = el1[1][j];
                     var li2 = document.createElement('li'),
                         a2 = document.createElement('a'),
                         content2 = document.createTextNode(elements[el2]);
                     li2.classList.add('tm-li-2');

                     if(j===0){
                        first = el2.toLowerCase();
                        li2.classList.add('first');
                     }
                     else if(j===el1[1].length-1){
                         li2.classList.add('last');
                     }

                     var span_class = '';
                     if (selected && selected === el2.toLowerCase()) {
                         li2.classList.add('active');
                         a2.classList.add('a-active');
                         flag = 1;
                     }
                     
                     a2.classList.add('tm-a-2');
                     a2.appendChild(content2);
                     a2.setAttribute('menuitem',el2.toLowerCase());
                     a2.setAttribute('id', el2.toLowerCase());

                     li2.appendChild(a2);

                     fragment2.appendChild(li2);
                 }
                 if(fragment2.hasChildNodes()){
                     var ul = document.createElement('ul'),
                         a = document.createElement('a'),
                         content = document.createTextNode(elements[el1[0]]);

                     a.appendChild(content);
                     a.setAttribute('class', 'tm-a');
                     a.setAttribute('menuitem',first);
                     ul.appendChild(fragment2);
                     ul.setAttribute('class', 'tm-ul-2');

                     if(flag){
                        li.classList.add('active');
                     }

                     li.appendChild(a);
                     li.appendChild(ul);
                 }
             }
             else{
                 var content3 = document.createTextNode(elements[el1]),
                     a3 = document.createElement('a');

                 if (selected && selected === el1.toLowerCase()) {
                     a3.classList.add('a-active');
                     li.classList.add('active');
                 }
                 a3.appendChild(content3);
                 a3.classList.add('tm-a');
                 a3.setAttribute('menuitem',el1);
                 a3.setAttribute('id', el1.toLowerCase());
                 li.appendChild(a3);
             }
             fragment.appendChild(li);
         }
         if (target) {
             target.appendChild(fragment);
             var list = target.getElementsByClassName('tm-li');
             for(var k=0; k < list.length; k++){
                 var li4 = list[k];
                 li4.addEventListener("mouseover", function(){
                     this.classList.add('hover');
                 });
                 li4.addEventListener("mouseout", function(){
                     this.classList.remove('hover');
                 });
             }
         }
     }
 }


 function displayMarkets(id, elements, selected) {
     'use strict';
     var target= document.getElementById(id),
         fragment =  document.createDocumentFragment();

     while (target && target.firstChild) {
         target.removeChild(target.firstChild);
     }

     for (var key in elements) {
         if (elements.hasOwnProperty(key)){
             var option = document.createElement('option'), content = document.createTextNode(elements[key].name);
             option.setAttribute('value', key);
             if (selected && selected === key) {
                 option.setAttribute('selected', 'selected');
             }
             option.appendChild(content);
             fragment.appendChild(option);

             if(elements[key].submarkets && Object.keys(elements[key].submarkets).length){
                for(var key2 in elements[key].submarkets){
                    if(key2){
                        option = document.createElement('option');
                        option.setAttribute('value', key2);
                        if (selected && selected === key2) {
                            option.setAttribute('selected', 'selected');
                        } 
                        option.textContent = '\xA0\xA0\xA0\xA0'+elements[key].submarkets[key2];
                        fragment.appendChild(option);
                    }
                }
             }
         }
     }
     if (target) {
         target.appendChild(fragment);
     }
 }
/*
 * function to create `option` and append to select box with id `id`
 */
function displayOptions(id, elements, selected) {
    'use strict';
    var target= document.getElementById(id),
        fragment =  document.createDocumentFragment();

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    for (var key in elements) {
        if (elements.hasOwnProperty(key)){
            var option = document.createElement('option'), content = document.createTextNode(elements[key]);
            option.setAttribute('value', key);
            if (selected && selected === key) {
                option.setAttribute('selected', 'selected');
            }
            option.appendChild(content);
            fragment.appendChild(option);
        }
    }
    if (target) {
        target.appendChild(fragment);
    }
}

/*
 * function to display underlyings
 *
 * we need separate function for this as sorting is different and later
 * we may add submarket to it
 */
function displayUnderlyings(id, elements, selected) {
    'use strict';
    var target= document.getElementById(id),
        fragment =  document.createDocumentFragment();

    while (target && target.firstChild) {
        target.removeChild(target.firstChild);
    }

    if (elements) {
        var keys = Object.keys(elements).sort(function(a, b) {
            return elements[a]['display'].localeCompare(elements[b]['display']);
        });
        keys.forEach(function (key) {
            if (elements.hasOwnProperty(key)){
                var option = document.createElement('option'), content = document.createTextNode(elements[key]['display']);
                option.setAttribute('value', key);
                if (elements[key]['is_active'] !== 1) {
                    option.setAttribute('disabled', true);
                }
                if (selected && selected === key) {
                    option.setAttribute('selected', 'selected');
                }
                option.appendChild(content);
                fragment.appendChild(option);
            }
        });
    }
    if (target) {
        target.appendChild(fragment);
    }
}

/*
 * This maps the form name and barrierCategory we display on
 * trading form to the actual we send it to backend
 * for e.g risefall is mapped to callput with barrierCategory euro_atm
 */
function getFormNameBarrierCategory(displayFormName) {
    'use strict';
    var obj = {};
    if (displayFormName) {
        if(displayFormName === 'risefall') {
            obj['formName'] = 'callput';
            obj['barrierCategory'] = 'euro_atm';
        } else if (displayFormName === 'higherlower') {
            obj['formName'] = 'callput';
            obj['barrierCategory'] = 'euro_non_atm';
        } else if (displayFormName === 'callput'){
            obj['formName'] = displayFormName;
            obj['barrierCategory'] = 'euro_atm';
        } else {
            obj['formName'] = displayFormName;
            obj['barrierCategory'] = '';
        }
    } else {
        obj['formName'] = 'callput';
        obj['barrierCategory'] = 'euro_atm';
    }
    return obj;
}

/*
 * This maps the contract type to where we display on trading form
 * and as there is no mapping on server side so need to create it
 * on front end
 *
 * for example we display CALL on top and PUT to bottom
 */
function contractTypeDisplayMapping(type) {
    'use strict';
    var obj = {
        CALL: "top",
        PUT: "bottom",
        ASIANU: "top",
        ASIAND: "bottom",
        DIGITMATCH: "top",
        DIGITDIFF: "bottom",
        EXPIRYRANGE: "top",
        EXPIRYMISS: "bottom",
        RANGE: "top",
        UPORDOWN: "bottom",
        ONETOUCH: "top",
        NOTOUCH: "bottom",
        SPREADU: "top",
        SPREADD: "bottom"
    };

    return type ? obj[type] : 'top';
}


/*
 * function to check if element is visible or not
 *
 * alternative to jquery $('#id').is(':visible')
 */
function isVisible(elem) {
    'use strict';
    if (elem.offsetWidth === 0 && elem.offsetHeight === 0) {
        return false;
    } else {
        return true;
    }
}

/*
 * function to hide and display the loading icon for price container
 */
function hideLoadingOverlay() {
    'use strict';
    var elm = document.getElementById('loading_container');
    if (elm) {
        elm.style.display = 'none';
    }
}

function showLoadingOverlay() {
    'use strict';
    var elm = document.getElementById('loading_container');
    if (elm) {
        elm.style.display = 'block';
    }
}

function showPriceOverlay() {
    'use strict';
    var elm = document.getElementById('loading_container2');
    if (elm) {
        elm.style.display = 'block';
    }
}

function hidePriceOverlay() {
    'use strict';
    var elm = document.getElementById('loading_container2');
    if (elm) {
        elm.style.display = 'none';
    }
}

/*
 * function to hide contract confirmation overlay container
 */
function hideOverlayContainer() {
    'use strict';
    var elm = document.getElementById('contract_confirmation_container');
    if (elm) {
        elm.style.display = 'none';
    }
    var elm2 = document.getElementById('contracts_list');
    if (elm2) {
        elm2.style.display = 'flex';
    }
}

/*
 * function to assign sorting to market list
 */
function compareMarkets(a, b) {
    var sortedMarkets = {
        'forex': 0,
        'indices': 1,
        'stocks': 2,
        'commodities': 3,
        'random': 4
    };

    if (sortedMarkets[a.toLowerCase()] < sortedMarkets[b.toLowerCase()]) {
        return -1;
    }
    if (sortedMarkets[a.toLowerCase()] > sortedMarkets[b.toLowerCase()]) {
        return 1;
    }
    return 0;
}

function getContractCategoryTree(elements){

    var tree = [
        ['updown',
            ['risefall',
            'higherlower']
        ],
        'touchnotouch',
        ['inout',
            ['endsinout',
            'staysinout']
        ],
        'asian',
        'digits',
        'spreads'
    ];

    if(elements){
        tree = tree.map(function(e){
            if(typeof e === 'object'){
                e[1] = e[1].filter(function(e1){
                    return elements[e1];
                });
                if(!e[1].length){
                    e = '';
                }
            }
            else if(!elements[e]){
                e = '';
            }
            return e;
        });
        tree = tree.filter(function(v){ return v.length; });   
    }
    return tree;
}

/*
 * function to get cookie javascript way (use if you don't want to use jquery)
 */
function getCookieItem(sKey) {
    if (!sKey) { return null; }
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
}

/*
 * Display price/spot movement variation to depict price moved up or down
 */
function displayPriceMovement(element, oldValue, currentValue) {
    element.classList.remove('price_moved_down');
    element.classList.remove('price_moved_up');
    if (parseFloat(currentValue) > parseFloat(oldValue)) {
        element.classList.remove('price_moved_down');
        element.classList.add('price_moved_up');
    } else if (parseFloat(currentValue) < parseFloat(oldValue)) {
        element.classList.remove('price_moved_up');
        element.classList.add('price_moved_down');
    }
}

/*
 * function to toggle active class of menu
 */

 function toggleActiveNavMenuElement(nav, eventElement) {
     var liElements = nav.getElementsByTagName("li");
     var classes = eventElement.classList;

     if (!classes.contains('active')) {
         for (var i = 0, len = liElements.length; i < len; i++){
             liElements[i].classList.remove('active');
         }
         classes.add('active');
     }
 }

 function toggleActiveCatMenuElement(nav, eventElementId) {
     var eventElement = document.getElementById(eventElementId);
     var liElements = nav.querySelectorAll('.active, .a-active');
     var classes = eventElement.classList;

     if (!classes.contains('active')) {
         for (var i = 0, len = liElements.length; i < len; i++){
             liElements[i].classList.remove('active');
             liElements[i].classList.remove('a-active');
         }
         classes.add('a-active');

         i = 0;
         var parent;
         while((parent = eventElement.parentElement) && parent.id !== nav.id && i < 10){
             if(parent.tagName === 'LI'){
                 parent.classList.add('active');
             }
             eventElement = parent;
             i++;
         }
     }
 }

/*
 * function to set placeholder text based on current form, used for mobile menu
 */
function setFormPlaceholderContent(name) {
    var formPlaceholder = document.getElementById('contract_form_nav_placeholder');
    if (formPlaceholder) {
        name = name || sessionStorage.getItem('formname');
        formPlaceholder.textContent = Contract.contractForms()[name];
    }
}

/*
 * function to display the profit and return of bet under each trade container
 */
 function displayCommentPrice(node, currency, type, payout) {
     'use strict';

     if (node && type && payout) {
         var profit = payout - type,
             return_percent = (profit/type)*100,
             comment = Content.localize().textNetProfit + ': ' + currency + ' ' + profit.toFixed(2) + ' | ' + Content.localize().textReturn + ' ' + return_percent.toFixed(0) + '%';

         if (isNaN(profit) || isNaN(return_percent)) {
             node.hide();
         } else {
             node.show();
             node.textContent = comment;
         }
     }
 }

/*
 * This function loops through the available contracts and markets
 * that are not supposed to be shown are replaced
 *
 * this is TEMPORARY, it will be removed when we fix backend
 */
function getAllowedContractCategory(contracts) {
    'use strict';
    var obj = {};
    for(var key in contracts) {
        if (contracts.hasOwnProperty(key)) {
            if (!(/spreads/i.test(contracts[key]))) {
                obj[key] = contracts[key];
            }
        }
    }
    return obj;
}

/*
 * This function is used in case where we have input and we don't want to fire
 * event on every change while user is typing for example in case of amount if
 * we want to change 10 to 1000 i.e. two zeros so two input events will be fired
 * normally, this function delay the event based on delay specified in milliseconds
 *
 * Reference
 * http://davidwalsh.name/javascript-debounce-function
 */
function debounce(func, wait, immediate) {
    var timeout;
    var delay = wait || 500;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, delay);
        if (callNow) func.apply(context, args);
    };
}

/*
 * function to check if selected market is allowed for current user
 */
function getDefaultMarket() {
   var mkt = sessionStorage.getItem('market');
   var markets = Symbols.markets();
   if(!mkt ||  !markets[mkt]){
        mkt = Object.keys(markets)[0];
   }
   return mkt;
}

/*
 * this is invoked when submit button is clicked and prevents reloading of page
 */
function addEventListenerForm(){
    document.getElementById('websocket_form').addEventListener("submit", function(evt){
        evt.currentTarget.classList.add('submitted');
        evt.preventDefault();
        return false;
    }, false);
}

/*
 * this creates a button, clicks it, and destroys it to invoke the listener
 */
function submitForm(form) {
    // var button = form.ownerDocument.createElement('input');
    // button.style.display = 'none';
    // button.type = 'submit';
    // form.appendChild(button).click();
    // form.removeChild(button);
}
