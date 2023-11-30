module.exports = (Plugin, Api) => {
    const {DiscordSelectors, PluginUtilities, EmulatedTooltip, DiscordModules, Patcher, Utilities, DCM, DOMTools} = Api;

    return class BetterFormattingRedux extends Plugin {
        constructor() {
            super();
            this.isOpen = false;
            this.replaceList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}";
            this.smallCapsList = " !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ{|}";
            this.superscriptList = " !\"#$%&'⁽⁾*⁺,⁻./⁰¹²³⁴⁵⁶⁷⁸⁹:;<⁼>?@ᴬᴮᶜᴰᴱᶠᴳᴴᴵᴶᴷᴸᴹᴺᴼᴾQᴿˢᵀᵁνᵂˣʸᶻ[\\]^_`ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᑫʳˢᵗᵘᵛʷˣʸᶻ{|}";
            this.upsideDownList = " ¡\"#$%℘,)(*+'-˙/0Ɩ↊Ɛ߈ϛ9ㄥ86:;>=<¿@∀ᗺƆᗡƎℲꓨHIՐꓘꓶWNOԀꝹꓤSꓕꓵΛMX⅄Z]\\[^‾,ɐqɔpǝɟᵷɥᴉɾʞꞁɯuodbɹsʇnʌʍxʎz}|{";
            this.fullwidthList = "　！＂＃＄％＆＇（）＊＋，－．／０１２３４５６７８９：；＜＝＞？＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ｛｜｝";
            this.leetList = " !\"#$%&'()*+,-./0123456789:;<=>?@48CD3FG#IJK1MN0PQЯ57UVWXY2[\\]^_`48cd3fg#ijk1mn0pqЯ57uvwxy2{|}";
            this.thiccList = "　!\"#$%&'()*+,-./0123456789:;<=>?@卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙[\\]^_`卂乃匚刀乇下厶卄工丁长乚从ん口尸㔿尺丂丅凵リ山乂丫乙{|}";

            this.toolbarString = `<div id="bfredux" class='bf-toolbar'><div class='bf-arrow'></div></div>`;

            this.discordWrappers = {bold: "**", italic: "*", underline: "__", strikethrough: "~~", code: "`", codeblock: "```", spoiler: "||"};

            this.customWrappers = Object.keys(this.defaultSettings.wrappers);
            this.buttonOrder = Object.keys(this.defaultSettings.toolbar);


            this.toolbarData = require("toolbardata.js");
            this.allLanguages = require("languages.js");
            this.mainCSS =  require("styles.css");

        }

        async onStart() {

            // Transition code
            for (const format in this.settings.toolbar) {
                if (typeof(this.settings.toolbar[format]) !== "object") continue;
                this.settings.toolbar[format] = this.settings.toolbar[format].enabled || true;
            }

            PluginUtilities.addStyle(this.getName()  + "-style", this.mainCSS);
            this.buttonOrder = PluginUtilities.loadData(this.getName(), "buttonOrder", this.buttonOrder);
            this.setupToolbar();
            Patcher.before(DiscordModules.MessageActions, "sendMessage", (_, [, msg]) => {
                msg.content = this.format(msg.content);
            });
        }

        onStop() {
            Patcher.unpatchAll();
            $("*").off("." + this.getName());
            $(".bf-toolbar").remove();
            PluginUtilities.removeStyle(this.getName() + "-style");
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
            if (this.settings.style.rightSide) { $(".bf-toolbar").removeClass("bf-left"); }
            else { $(".bf-toolbar").addClass("bf-left"); }
        }

        updateOpacity() {
            $(".bf-toolbar").css("opacity", this.settings.style.toolbarOpacity);
        }

        updateFontSize() {
            $(".bf-toolbar").css("font-size", this.settings.style.fontSize + "%");
        }

        openClose() {
            if (this.settings.plugin.hoverOpen) return;
            this.isOpen = !this.isOpen;
            $(".bf-toolbar").toggleClass("bf-visible");
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
            if (this.settings.plugin.closeOnSend) $(".bf-toolbar").removeClass("bf-visible");
            return text;
        }

        async wrapSelection(leftWrapper, rightWrapper) {
            if (!rightWrapper) rightWrapper = leftWrapper;
            if (leftWrapper.startsWith("```")) leftWrapper = leftWrapper + "\n";
            if (rightWrapper.startsWith("```")) rightWrapper = "\n" + rightWrapper;
            const textarea = document.querySelector(DiscordSelectors.Textarea.textArea);
            if (!textarea) return;
            if (textarea.tagName === "TEXTAREA") return this.oldWrapSelection(textarea, leftWrapper, rightWrapper);
            const slateEditor = Utilities.findInTree(textarea.__reactInternalInstance$, e => e && e.wrapText, {walkable: ["return", "stateNode", "editorRef"]});
            if (!slateEditor) return;
            return slateEditor.wrapText(leftWrapper, rightWrapper);
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

        // getContextMenu() {
        //     const items = [];
        //     for (const letter in this.allLanguages) {
        //         const subItems = [];
        //         for (const language in this.allLanguages[letter]) {
        //             ((lang) => {
        //                 subItems.push(new ContextMenu.TextItem(this.allLanguages[letter][lang], {callback: () => {this.wrapSelection("```" + lang + "\n", "```");}}));
        //             })(language);
        //         }
        //         items.push(new ContextMenu.SubMenuItem(letter, new ContextMenu.Menu(true).addItems(...subItems)));
        //     }
        //     return new ContextMenu.Menu().addItems(...items);
        // }

        buildToolbar() {
            const toolbar = DOMTools.createElement(this.toolbarString);
            // if (window.BdApi.getPlugin("Zalgo")) {
            //     this.settings.toolbar.zalgo = true;
            //     if (!this.buttonOrder.includes("zalgo")) this.buttonOrder.push("zalgo");
            // }
            console.log(this.settings.toolbar, this.toolbarData);
            const formats = Object.keys(this.settings.toolbar);//.sort((a,b) => {return this.buttonOrder.indexOf(a) - this.buttonOrder.indexOf(b);});
            for (let i = 0; i < formats.length; i++) {
                const format = formats[i];
                const button = DOMTools.createElement(`<div class="format">`);
                if (!this.toolbarData[format]) continue;
                button.classList.add(this.toolbarData[format].type);
                new EmulatedTooltip(button, this.toolbarData[format].name);
                if (!this.settings.toolbar[format]) button.classList.add("disabled");
                if (format === "codeblock") {
                    // const contextMenu = this.getContextMenu();
                    button.addEventListener("contextmenu", (event) => {
                        const menu = DCM.buildMenu([
                            {type: "group", items: [
                                {type: "toggle", label: "Item Toggle", active: false, action: () => {console.log("TOGGLE ITEM");}},
                                {label: "Menu Item", action: () => {console.log("MENU ITEM");}},
                                {label: "Menu Item", action: () => {console.log("MENU ITEM");}},
                                {type: "group", items: [
                                    {label: "Menu Item", action: () => {console.log("MENU ITEM");}, hint:"hint",tooltip: "WHAT", children: ["where", "are", "we"]},
                                    {label: "Menu Item", action: () => {console.log("MENU ITEM");}},
                                    {type: "image", label: "Image Item", image: "https://cdn.discordapp.com/attachments/292141134614888448/686025522303860760/zere_cube_rotate.gif", action: () => {console.log("MENU ITEM");}},
                                    {label: "Menu Item", action: () => {console.log("MENU ITEM");}},
                                    {label: "Menu Item", action: () => {console.log("MENU ITEM");}},
                                    {type: "submenu", label: "Menu Item", action: () => {console.log("MENU ITEM");}, items: [
                                        {type: "toggle", label: "Item Toggle", active: false, action: () => {console.log("MENU ITEM");}},
                                        {type: "toggle", label: "Item Toggle", active: false, action: () => {console.log("MENU ITEM");}, loading: true},
                                        {type: "toggle", label: "Item Toggle", active: false, action: () => {console.log("MENU ITEM");}},
                                        {type: "slider", label: "Slide Value", onChange: function(){console.log(...arguments);},
                                            renderValue: (value) => {return `$${Math.round(value)}`;}
                                        }
                                    ]}
                                ]}
                            ]}
                        ]);
                        DCM.openContextMenu(event, menu, {align: "bottom"});
                    });
                }
                button.dataset.name = format;
                if (this.settings.style.icons) button.innerHTML = this.toolbarData[format].icon;
                else button.innerHTML = this.toolbarData[format].displayName;
                toolbar.append(button);
            }

            if (!this.settings.style.icons) {
                toolbar.addEventListener("mousemove." + this.getName(), (e) => {
                    const $this = $(e.currentTarget);
                    const pos = e.pageX - $this.parent().offset().left;
                    let diff = -$this.width();
                    $this.children().each((index, elem) => {
                        diff += $(elem).outerWidth();
                    });
                    $this.scrollLeft(pos / $this.width() * diff);
                });
            }

            return toolbar;
        }

        setupToolbar() {
            const existing = document.querySelector(".bf-toolbar");
            if (existing) existing.remove();
            const textAreas = document.querySelectorAll(`${DiscordSelectors.Textarea.textArea}`);
            for (const element of textAreas) {
                this.addToolbar(element.children[0]);
            }
        }

        addToolbar(textarea) {
            const toolbarElement = this.buildToolbar();
            if (this.settings.plugin.hoverOpen == true) toolbarElement.classList.add("bf-hover");
            if (this.isOpen) toolbarElement.classList.add("bf-visible");

            const container = textarea.parentElement.parentElement;
            container.parentElement.insertBefore(toolbarElement, container.nextSibling);
            toolbarElement.addEventListener("click", e => {
                e.preventDefault();
                e.stopPropagation();

                if (e.target.classList.contains("bf-arrow")) return this.openClose();
                
                const button = e.target.closest(".format");
                let wrapper = "";
                if (button.classList.contains("native-format")) wrapper = this.discordWrappers[button.dataset.name];
                else if (button.dataset.name == "zalgo") return this.wrapSelection("{{", "}}");
                else wrapper = this.settings.wrappers[button.dataset.name];
                this.wrapSelection(wrapper);
            });
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
                if (value) $(".bf-toolbar").removeClass("bf-visible").addClass("bf-hover");
                else $(".bf-toolbar").removeClass("bf-hover");
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
