var figuraMenu;

import { injectContextMenuItems } from "./ui/context-menu"

Plugin.register('figura-plugin', {
	title: 'Figura Plugin',
	author: 'omoflop',
	description: 'Adds utilities to help with making Figura models',
	icon: 'bar_chart',
	version: '1.0.0',
	variant: 'both',
	onload() {
		injectContextMenuItems()
	},
	onunload() {
		Cube.prototype.menu.structure.splice(Cube.prototype.menu.structure.indexOf(figuraMenu), 1);
		Group.prototype.menu.structure.splice(Group.prototype.menu.structure.indexOf(figuraMenu), 1);
	}
});

