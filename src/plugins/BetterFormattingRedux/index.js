/**
 * @param {import("zerespluginlibrary").Plugin} Plugin 
 * @param {import("zerespluginlibrary").BoundAPI} Api 
 */
module.exports = (Plugin, Api) => {
    const {ContextMenu, DOM, Patcher, UI} = window.BdApi;
    const {DiscordSelectors, PluginUtilities, DiscordModules, Utilities, ReactTools} = Api;

    return class BetterFormattingRedux extends Plugin {
        constructor() {
            super();
            this.isOpen = false;
            this.replaceList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
            this.smallCapsList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀꜱᴛᴜᴠᴡxʏᴢ{|}";
            this.superscriptList = " !\"#$%&'⁽⁾*⁺,⁻./⁰¹²³⁴⁵⁶⁷⁸⁹:;<⁼>?@ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁνᵂˣʸᶻ[\\]^_`ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ{|}";
            this.upsideDownList = " ¡\"#$%℘,)(*+'-˙/0ƖᄅƐㄣϛ9ㄥ86:;>=<¿@∀qƆpƎℲפHIſʞ˥WNOԀQɹS┴∩ΛMXλZ]\\[^‾,ɐqɔpǝɟƃɥᴉɾʞlɯuodbɹsʇnʌʍxʎz}|{";
            this.fullwidthList = "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝";
            this.leetList = " !\"#$%&'()*+,-./0123456789:;<=>?@48CD3FG#IJK1MN0PQЯ57UVWXY2[\\]^_`48cd3fg#ijk1mn0pqЯ57uvwxy2{|}";
            this.thiccList = "　!\"#$%&'()*+,-./0123456789:;<=>?@卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙[\\]^_`卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙{|}";

            this.toolbarString = `<div id="bfredux" class='bf-toolbar'><div class='bf-arrow'></div></div>`;

            this.discordWrappers = {bold: "**", italic: "*", underline: "__", strikethrough: "~~", code: "`", codeblock: "```", spoiler: "||"};

            this.customWrappers = Object.keys(this.defaultSettings.wrappers);
            this.buttonOrder = Object.keys(this.defaultSettings.toolbar);


            this.toolbarData = require("toolbardata.js");
            this.allLanguages = require("languages.js");
            this.mainCSS = require("styles.css");
        }

        async onStart() {
            // await PluginUtilities.addScript("sortableScript", "//rauenzi.github.io/BetterDiscordAddons/Plugins/Sortable.js");
            DOM.addStyle(this.name + "-style", this.mainCSS);
            this.buttonOrder = PluginUtilities.loadData(this.name, "buttonOrder", this.buttonOrder);
            this.setupToolbar();
            Patcher.before(this.name, DiscordModules.MessageActions, "sendMessage", (_, [, msg]) => {
                msg.content = this.format(msg.content);
            });
        }

        onStop() {
            Patcher.unpatchAll(this.name);
            // $("*").off("." + this.name);
            document.querySelector(".bf-toolbar")?.remove();
            // PluginUtilities.removeScript("sortableScript");
            DOM.removeStyle(this.name + "-style");
        }

        observer(e) {
            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;

            const elem = e.addedNodes[0];
            const textarea = elem.matches(DiscordSelectors.Textarea.textArea) ? elem : elem.querySelector(DiscordSelectors.Textarea.textArea);
            if (textarea) this.addToolbar(textarea);
        }

        updateStyle() {
            this.updateSide();
            this.updateOpacity();
            this.updateFontSize();
        }

        updateSide() {
            const toolbar = document.querySelector(".bf-toolbar");
            if (!toolbar) return;
            if (this.settings.style.rightSide) toolbar.classList.remove("bf-left");
            else toolbar.classList.add("bf-left");
        }

        updateOpacity() {
            const toolbar = document.querySelector(".bf-toolbar");
            if (!toolbar) return;
            toolbar.style.opacity = this.settings.style.toolbarOpacity;
        }

        updateFontSize() {
            const toolbar = document.querySelector(".bf-toolbar");
            if (!toolbar) return;
            toolbar.style.fontSize = this.settings.style.fontSize + "%";
        }

        openClose() {
            this.isOpen = !this.isOpen;
            const toolbar = document.querySelector(".bf-toolbar");
            if (!toolbar) return;
            toolbar.classList.toggle("bf-visible");
        }

        escape(s) {
            return s.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
        }

        doFormat(text, wrapper, offset) {

            // If this is not a wrapper, return original
            if (text.substring(offset, offset + wrapper.length) != wrapper) return text;

            let returnText = text;
            const len = text.length;
            const begin = text.indexOf(wrapper, offset);

            if (text[begin - 1] == "\\") return text; // If the wrapper is escaped, remove the backslash and return the text

            let end = text.indexOf(wrapper, begin + wrapper.length);
            if (end != -1) end += wrapper.length - 1;

            // Making it to this point means that we have found a full wrapper
            // This block performs inner chaining
            if (this.settings.plugin.chainFormats) {
                for (let w = 0; w < this.customWrappers.length; w++) {
                    const newText = this.doFormat(returnText, this.settings.wrappers[this.customWrappers[w]], begin + wrapper.length);
                    if (returnText != newText) {
                        returnText = newText;
                        end = end - this.settings.wrappers[this.customWrappers[w]].length * 2;
                    }
                }
            }

            returnText = returnText.replace(new RegExp(`([^]{${begin}})${this.escape(wrapper)}([^]*)${this.escape(wrapper)}([^]{${len - end - 1}})`), (match, before, middle, after) => {
                let letterNum = 0;
                middle = middle.replace(/./g, letter => {
                    const index = this.replaceList.indexOf(letter);
                    letterNum += 1;
                    if (wrapper == this.settings.wrappers.fullwidth) {
                        if (this.settings.formatting.fullWidthMap) return index != -1 ? this.fullwidthList[index] : letter;
                        return index != -1 ? letterNum == middle.length ? letter.toUpperCase() : letter.toUpperCase() + " " : letter;
                    }
                    else if (wrapper == this.settings.wrappers.superscript) {return index != -1 ? this.superscriptList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.smallcaps) {return index != -1 ? this.smallCapsList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.upsidedown) {return index != -1 ? this.upsideDownList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.leet) {return index != -1 ? this.leetList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.thicc) {return index != -1 ? this.thiccList[index] : letter;}
                    else if (wrapper == this.settings.wrappers.varied) {
                        const compare = this.settings.formatting.startCaps ? 1 : 0;
                        if (letter.toLowerCase() == letter.toUpperCase()) letterNum = letterNum - 1;
                        return index != -1 ? letterNum % 2 == compare ? letter.toUpperCase() : letter.toLowerCase() : letter;
                    }
                    return letter;
                });
                if (wrapper == this.settings.wrappers.upsidedown && this.settings.formatting.reorderUpsidedown) return before + middle.split("").reverse().join("") + after;
                return before + middle + after;
            });

            return returnText;
        }

        format(string) {
            let text = string;
            for (let i = 0; i < text.length; i++) {
                if (text[i] == "`") {
                    const next = text.indexOf("`", i + 1);
                    if (next != -1) i = next;
                }
                else if (text[i] == "@") {
                    const match = /@.*#[0-9]*/.exec(text.substring(i));
                    if (match && match.index == 0) i += match[0].length - 1;
                }
                else {
                    for (let w = 0; w < this.customWrappers.length; w++) {
                        if (!this.settings.formats[this.customWrappers[w]]) continue;
                        const newText = this.doFormat(text, this.settings.wrappers[this.customWrappers[w]], i);
                        if (text != newText) {
                            text = newText;
                            i = i - this.settings.wrappers[this.customWrappers[w]].length * 2;
                        }
                    }
                }
            }
            if (this.settings.plugin.closeOnSend) document.querySelector(".bf-toolbar")?.classList.remove("bf-visible");
            return text;
        }

        async wrapSelection(leftWrapper, rightWrapper) {
            if (!rightWrapper) rightWrapper = leftWrapper;
            if (leftWrapper.startsWith("```")) leftWrapper = leftWrapper + "\n";
            if (rightWrapper.startsWith("```")) rightWrapper = "\n" + rightWrapper;
            const textarea = document.querySelector(DiscordSelectors.Textarea.textArea);
            if (!textarea) return;
            if (textarea.tagName === "TEXTAREA") return this.oldWrapSelection(textarea, leftWrapper, rightWrapper);
            const slateNode = ReactTools.getOwnerInstance(textarea);
            const slate = slateNode?.ref?.current?.getSlateEditor();
            if (!slate) return; // bail out if no slate
            
            let offset;  // new cursor offset
            
            if (slate.selection.anchor.offset <= slate.selection.focus.offset) {
                offset = slate.selection.focus.offset + leftWrapper.length;
                slate.apply({ type: "insert_text", text: leftWrapper, path: slate.selection.anchor.path, offset: slate.selection.anchor.offset });
                slate.apply({ type: "insert_text", text: rightWrapper, path: slate.selection.focus.path, offset: slate.selection.focus.offset });
            }
            else {
                offset = slate.selection.anchor.offset + leftWrapper.length;
                slate.apply({ type: "insert_text", text: rightWrapper, path: slate.selection.anchor.path, offset: slate.selection.anchor.offset });
                slate.apply({ type: "insert_text", text: leftWrapper, path: slate.selection.focus.path, offset: slate.selection.focus.offset });
            }
            
            // new selection data
            const newSelection = {
                anchor: { path: slate.selection.anchor.path, offset: offset },
                focus: { path: slate.selection.focus.path, offset: offset }
            };
            
            slate.selection = newSelection; // update selection data
            slate.apply({ type: "insert_text", text: "", path: slate.selection.anchor.path, offset: offset }); // update cursor position
            slateNode.focus();
        }

        oldWrapSelection(textarea, leftWrapper, rightWrapper) {
            let text = textarea.value;
            const start = textarea.selectionStart;
            const len = text.substring(textarea.selectionStart, textarea.selectionEnd).length;
            text = leftWrapper + text.substring(textarea.selectionStart, textarea.selectionEnd) + rightWrapper;
            textarea.focus();
            document.execCommand("insertText", false, text);
            textarea.selectionStart = start + leftWrapper.length;
            textarea.selectionEnd = textarea.selectionStart + len;
        }

        getContextMenu() {
            return ContextMenu.buildMenu(
                Object.keys(this.allLanguages).map(letter => {
                    return {
                        type: "submenu",
                        label: letter,
                        items: Object.keys(this.allLanguages[letter]).map(language => {
                            return {label: this.allLanguages[letter][language], action: () => {this.wrapSelection("```" + language, "```");}};
                        })
                    };
                })
            );
        }

        buildToolbar() {
            const toolbar = DOM.parseHTML(this.toolbarString);
            const sorted = Object.keys(this.settings.toolbar).sort((a,b) => {return this.buttonOrder.indexOf(a) - this.buttonOrder.indexOf(b);});
            for (let i = 0; i < sorted.length; i++) {
                const button = DOM.parseHTML("<div class='format'>");
                if (!this.toolbarData[sorted[i]]) continue;
                button.classList.add(this.toolbarData[sorted[i]].type);
                UI.createTooltip(button, this.toolbarData[sorted[i]].name);
                if (!this.settings.toolbar[sorted[i]]) button.classList.add("disabled");
                if (sorted[i] === "codeblock") {
                    const contextMenu = this.getContextMenu();
                    button.addEventListener("contextmenu", (e) => {
                        ContextMenu.open(e, contextMenu, {align: "bottom"});
                    });
                }
                button.dataset.name = sorted[i];
                if (this.settings.style.icons) button.innerHTML = this.toolbarData[sorted[i]].icon;
                else button.innerHTML = this.toolbarData[sorted[i]].displayName;
                toolbar.append(button);
            }
            // window.Sortable.create(toolbar, {
            //     draggable: ".format", // css-selector of elements, which can be sorted
            //     ghostClass: "ghost",
            //     onUpdate: () => {
            //         const buttons = toolbar.querySelectorAll(".format");
            //         for (let i = 0; i < buttons.length; i++) {
            //             this.buttonOrder[i] = buttons[i].dataset.name;
            //         }
            //         PluginUtilities.saveData(this.name, "buttonOrder", this.buttonOrder);
            //     }
            // });
            if (!this.settings.style.icons) {
                toolbar.addEventListener("mousemove", (e) => {
                    const target = e.currentTarget;
                    const pos = e.pageX - target.parentElement.getBoundingClientRect().left;
                    const width = parseInt(getComputedStyle(target).width);
                    let diff = -1 * width;
                    Array.from(target.children).forEach(elem => {
                        diff += elem.offsetWidth;
                    });
                    target.scrollLeft = (pos / width * diff);
                });
            }

            return toolbar;
        }

        setupToolbar() {
            document.querySelector(".bf-toolbar")?.remove();
            document.querySelectorAll(`${DiscordSelectors.Textarea.textArea}`).forEach(elem => {
                this.addToolbar(elem.children[0]);
            });
        }

        addToolbar(textarea) {
            const toolbarElement = this.buildToolbar();
            if (this.settings.plugin.hoverOpen == true) toolbarElement.classList.add("bf-hover");
            if (this.isOpen) toolbarElement.classList.add("bf-visible");

            const inner = textarea.parentElement.parentElement;
            inner.parentElement.insertBefore(toolbarElement, inner.nextSibling);

            toolbarElement.addEventListener("click", e => {
                    e.preventDefault();
                    e.stopPropagation();
                    const button = e.target.closest("div");
                    if (button.classList.contains("bf-arrow")) {
                        if (!this.settings.plugin.hoverOpen) this.openClose();
                    }
                    else if (button.classList.contains("format")) {
                        let wrapper = "";
                        if (button.classList.contains("native-format")) wrapper = this.discordWrappers[button.dataset.name];
                        else wrapper = this.settings.wrappers[button.dataset.name];
                        this.wrapSelection(wrapper);
                    }
                });

            // textarea.parent().parent().after(toolbarElement)
            //     .siblings(".bf-toolbar")
            //     .off("click." + this.name)
            //     .on("click." + this.name, "div", e => {
            //         e.preventDefault();
            //         e.stopPropagation();
            //         const button = e.currentTarget;
            //         if (button.classList.contains("bf-arrow")) {
            //             if (!this.settings.plugin.hoverOpen) this.openClose();
            //         }
            //         else {
            //             let wrapper = "";
            //             if (button.classList.contains("native-format")) wrapper = this.discordWrappers[button.data("name")];
            //             else wrapper = this.settings.wrappers[button.data("name")];
            //             this.wrapSelection(wrapper);
            //         }
            //     });
            this.updateStyle();
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener(this.updateSettings.bind(this));
            return panel.getElement();
        }

        updateSettings(group, id, value) {

            if (group == "toolbar") this.setupToolbar();
            if (group == "plugin" && id == "hoverOpen") {
                const toolbar = document.querySelector(".bf-toolbar");
                if (value) {
                    toolbar?.classList.remove("bf-visible");
                    toolbar?.classList.add("bf-hover");
                }
                else {
                    toolbar?.classList.remove("bf-hover");
                }
            }

            if (group == "style") {
                if (id == "icons") this.setupToolbar();
                if (id == "rightSide") this.updateSide();
                if (id == "toolbarOpacity") this.updateOpacity();
                if (id == "fontSize") this.updateFontSize();
            }

            // let resetButton = $("<button>");
            // resetButton.on("click", () => {
            //     this.settings = this.defaultSettings;
            //     this.saveSettings();
            //     this.setupToolbar();
            //     panel.empty();
            //     this.generateSettings(panel);
            // });
            // resetButton.text("Reset To Defaults");
            // resetButton.css("float", "right");
            // resetButton.attr("type","button");

            // panel.append(resetButton);
        }

    };
};
