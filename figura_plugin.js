/// <reference path="./types/index.d.ts" />

(function() {
    var figuraMenu;

    Plugin.register('figura_plugin', {
        title: 'Figura Plugin',
        author: 'omoflop',
        description: 'Adds utilities to help with making Figura models',
        icon: 'change_history',
        version: '1.2.0',
        variant: 'both',
        onload() {            

            addContextMenuDiv(Cube, -1);
            addContextMenuDiv(Group, -1);
            figuraMenu = {
                children: [
                    {
                        click: function() {
                            let selected = getSelected();
                            if (selected.length > 0) {
                                let name = getPath(selected[0]);
                                if (name != undefined) {
                                    Blockbench.showStatusMessage('Copied path to clipboard', 2000);
                                    navigator.clipboard.writeText(name);
                                }
                            }
                        },
                        name: "Copy Path",
                        description: "Copies the identifier of the selected part",
                        icon: "content_copy",
                        id: "figura_copy_path"
                    },
                    {
                        click: function() {
                        let complexity = 0;
                        Cube.selected.forEach((cube) => {
                            if (cube.visibility) {
                                Object.values(cube.faces).forEach(face => {
                                    console.log(face);
                                    if (face.enabled && face.texture != false) {
                                        complexity += 4;
                                    }
                                });
                            }
                        });
                        Blockbench.showQuickMessage(`Complexity: ${complexity}`, 5000);
                    },
                        name: "Get Complexity",
                        description: "Calculates the complexity of the selection",
                        icon: "calculate",
                        id: "figura_calculate_complexity"
                    },
                    {
                        children: [
                            {
                                click: function() {
                                    let selected = getSelected();
                                    if (selected.length > 0) setParentType("")
                                },
                                name: "Reset",
                                description: "Reset the parent type for this part",
                                icon: "refresh",
                                id: "figura_reset_parent"
                            },
                            
                            makeParentTypeOption("Head",     () => setParentType("Head")),
                            makeParentTypeOption("Body",     () => setParentType("Body")),
                            makeParentTypeOption("Left Arm",  () => setParentType("LeftArm")),
                            makeParentTypeOption("Right Arm", () => setParentType("RightArm")),
                            makeParentTypeOption("Left Leg",  () => setParentType("LeftLeg")),
                            makeParentTypeOption("Right Leg", () => setParentType("RightLeg")),
                            makeParentTypeOption("World",    () => setParentType("World")),
                            makeParentTypeOption("Left Elytra",    () => setParentType("LeftElytra")),
                            makeParentTypeOption("Right Elytra",   () => setParentType("RightElytra")),
                            makeParentTypeOption("Left Parrot",    () => setParentType("LeftParrot")),
                            makeParentTypeOption("Right Parrot",   () => setParentType("RightParrot")),
                        ],
                        icon: "escalator_warning",
                        name: "Set Parent Type",
                        __proto__: Object
                    }
                ],
                icon: "change_history",
                name: "Figura",
                __proto__: Object
            };
            addContextMenuEntry(Cube,  figuraMenu);
            addContextMenuEntry(Group, figuraMenu);

        },
        onunload() {
            Cube.prototype.menu.structure.splice(Cube.prototype.menu.structure.indexOf(figuraMenu), 1);
            Group.prototype.menu.structure.splice(Group.prototype.menu.structure.indexOf(figuraMenu), 1);
        }
    });
    
    

})();

function makeParentTypeOption(type, click) {
    let obj = {
        name: `${type}`,
        description: `Sets the parent type to ${type}`,
        icon: "tag",
        id: `figura_set_parent_${type}`
    }

    obj.click = click

    return obj
}

function setParentType(type) {
    let selected = getSelected();
    if (selected.length > 0) {
        if (!Project.overrides) Project.overrides = {}
        if (!Project.overrides.parentTypes) Project.overrides.parentTypes = {}

        selected.forEach(element => {
            Project.overrides.parentTypes[element.uuid] = type
        });
    }
}

function addContextMenuDiv(menuType, position = -1) {
    addContextMenuEntry(menuType, "_", position);
}

function addContextMenuAction(menuType, action, path, position = -1) {
    addContextMenuEntry(menuType, action, position);
    action.menus.push({menu:menuType.prototype.menu, path:path});
}

function addContextMenuEntry(menuType, object, position = -1) {
    position = position < 0 ? menuType.prototype.menu.structure.length + position + 1 : position;
    menuType.prototype.menu.structure.splice(position, 0, object);
}

function getSelected() {
    let all = []

    if (Group.selected != undefined) all.push(Group.selected)
    if (Cube.selected != undefined) all = pushArray(all, Cube.selected);

    return all
}
function pushArray(a, b) {
    if (b.forEach) {
        b.forEach(element => {
            a.push(element)
        });
    }
    return a
}

function getPath(cube) {
    if (cube.selected) {
        let name = '';
        let last = cube;

        let stackLimit = 0;
        while(last != undefined && stackLimit < 9999) {
            name = last.name + '.' + name;
            last = last.parent;
            stackLimit += 1; // Just in case
        }

        name = 'model.'+name.substring(10, name.length-1);

        let index = 0;
        let duplicates = false;
        cube.getParentArray().forEach((part) => {
            if (part.name === cube.name && part != cube) {
                duplicates = true;
            }
            index += 1;
        })
        if (duplicates) {
            name = name.substring(0, name.length - cube.name.length - 1);
            name += `[${cube.getParentArray().indexOf(cube)+1}]`;
        }
        return name
    }
    return undefined
}
