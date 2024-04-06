import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

interface CtrlNavigationSettings {
	enabled: boolean;
}

const DEFAULT_SETTINGS: CtrlNavigationSettings = {
	enabled: true,
};

function shouldMap() {
	const promptShowedUp =
		document.activeElement &&
		document.activeElement.hasClass("prompt-input");
	if (promptShowedUp) {
		return true;
	}

	const suggestionShowedUp = document.querySelector(".suggestion-container");
	if (suggestionShowedUp) {
		return true;
	}

	return false;
}

function downKeyListener(e: KeyboardEvent) {
	if (
		shouldMap() &&
		e.code == "KeyN" &&
		(e.ctrlKey || e.metaKey) &&
		!e.shiftKey
	) {
		e.preventDefault();
		e.stopPropagation();
		document.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "ArrowDown",
				code: "ArrowDown",
			}),
		);
	}
}

function upKeyListener(e: KeyboardEvent) {
	if (
		shouldMap() &&
		e.code == "KeyP" &&
		(e.ctrlKey || e.metaKey) &&
		!e.shiftKey
	) {
		e.preventDefault();
		e.stopPropagation();
		document.dispatchEvent(
			new KeyboardEvent("keydown", {
				key: "ArrowUp",
				code: "ArrowUp",
			}),
		);
	}
}

export default class CtrlNavigationPlugin extends Plugin {
	settings: CtrlNavigationSettings;

	async onload() {
		await this.loadSettings();

		this.registerDomEvent(document, "keydown", downKeyListener);
		this.registerDomEvent(document, "keydown", upKeyListener);

		// This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon(
		// 	"dice",
		// 	"Ctrl Navigation",
		// 	(evt: MouseEvent) => {
		// 		// Called when the user clicks the icon.
		// 		new Notice("This is a notice!");
		// 	},
		// );
		// // Perform additional things with the ribbon
		// ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText("Status Bar Text");

		// This adds a simple command that can be triggered anywhere
		// this.addCommand({
		// 	id: "open-sample-modal-simple",
		// 	name: "Open sample modal (simple)",
		// 	callback: () => {
		// 		new SampleModal(this.app).open();
		// 	},
		// });
		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: "sample-editor-command",
		// 	name: "Sample editor command",
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection("Sample Editor Command");
		// 	},
		// });
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: "open-sample-modal-complex",
		// 	name: "Open sample modal (complex)",
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView =
		// 			this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}
		//
		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	},
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new CtrlNavigationSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, "click", (evt: MouseEvent) => {
		// 	console.log("click", evt);
		// });
		//
		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// 	this.registerInterval(
		// 		window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000),
		// 	);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// class SampleModal extends Modal {
// 	constructor(app: App) {
// 		super(app);
// 	}
//
// 	onOpen() {
// 		const { contentEl } = this;
// 		contentEl.setText("Woah!");
// 	}
//
// 	onClose() {
// 		const { contentEl } = this;
// 		contentEl.empty();
// 	}
// }

class CtrlNavigationSettingTab extends PluginSettingTab {
	plugin: CtrlNavigationPlugin;

	constructor(app: App, plugin: CtrlNavigationPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Enabled")
			.setDesc(
				"Whether to enable mapping `Ctrl-J` to down arrow and `Ctrl-K` to up arrow for suggestions and command list",
			)
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.enabled)
					.onChange(async (value) => {
						this.plugin.settings.enabled = value;
						await this.plugin.saveSettings();
					});
			});
		// .addText((text) =>
		// 	text
		// 		.setPlaceholder("Enter your secret")
		// 		.setValue(this.plugin.settings.enabled)
		// 		.onChange(async (value) => {
		// 			this.plugin.settings.enabled = value;
		// 			await this.plugin.saveSettings();
		// 		}),
		// );
	}
}
