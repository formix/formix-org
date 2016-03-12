

window._scopes = {
    main: {}
};



/**
 * Creates a DOM Element
 *
 * @param name The name of the DOM Element.
 * @return A JQuery wrapper around the created tag.
 */
function tag(name) {
    return $("<" + name + "></" + name + ">");
}


/**
 * Creates a menu item
 *
 * @param section The section used to create the menu item, should be an
 *                object containing properties "id" and "text"
 * @return A JQuery wrapper around a 
 */
function createMenuItem(section) {
    var a = tag("a");
    a.attr("id", section.id);
    a.attr("href", "#/" + section.id);
    a.html(section.text);
    a.click(function() {
        selectMenuItem(section);
        return false;
    });

    var li = tag("li");
    li.append(a);

    return li;
}


/**
 * Loads the menu items with the given sections.
 *
 * @param menu     The jquery wrapper around the manu UL element.
 * @param sections The array of sections to display in the menu.
 */
function loadMenu(menu, sections) {
    _.each(sections, function(section) {
        var menuItem = createMenuItem(section);
        menu.append(menuItem);
    });
}



function selectMenuItem(item) {
    window.history.pushState(item, "Formix " + item.text, "#/" + item.id);
}


function updateSelectedMenuItem() {
    var url = window.location.href;
    var match = /.+#\/(.*)/.exec(url);
    var itemId = "home";
    if (match && match.length === 2) {
        itemId = match[1];
    }

    if (window._scopes.main.selectedSection) {
        window._scopes.main.selectedSection.removeClass("selected");
    }
    window._scopes.main.selectedSection = $("#" + itemId);
    window._scopes.main.selectedSection.addClass("selected");

    var section = _.find(window._scopes.main.sections, function(s) {
        return s.id === itemId;
    });
    document.title = "Formix " + section.text;
}


function urlChanged(oldUrl, newUrl) {
    updateSelectedMenuItem();
}


$(function() {

    var lastUrl = "";
    setInterval(function() {
        if (lastUrl !== window.location.href) {
            setTimeout(function() {
                urlChanged(lastUrl, window.location.href);
            }, 0);
            lastUrl = window.location.href;
        }
    }, 100);


    window.onpopstate = function() {
        updateSelectedMenuItem();
    };

    $.get("data/sections.json", function(sections) {
        
        window._scopes.main.sections = sections;
        loadMenu($("#menu"), sections);
    
        updateSelectedMenuItem();

    }, "json");
});