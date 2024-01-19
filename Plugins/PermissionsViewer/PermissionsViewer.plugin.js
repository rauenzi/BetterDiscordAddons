/**
 * @name PermissionsViewer
 * @description Allows you to view a user's permissions. Thanks to Noodlebox for the idea!
 * @version 0.2.9
 * @author Zerebos
 * @authorId 249746236008169473
 * @website https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/PermissionsViewer
 * @source https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/PermissionsViewer/PermissionsViewer.plugin.js
 */
/*@cc_on
@if (@_jscript)
    
    // Offer to self-install for clueless users that try to run this directly.
    var shell = WScript.CreateObject("WScript.Shell");
    var fs = new ActiveXObject("Scripting.FileSystemObject");
    var pathPlugins = shell.ExpandEnvironmentStrings("%APPDATA%\\BetterDiscord\\plugins");
    var pathSelf = WScript.ScriptFullName;
    // Put the user at ease by addressing them in the first person
    shell.Popup("It looks like you've mistakenly tried to run me directly. \n(Don't do that!)", 0, "I'm a plugin for BetterDiscord", 0x30);
    if (fs.GetParentFolderName(pathSelf) === fs.GetAbsolutePathName(pathPlugins)) {
        shell.Popup("I'm in the correct folder already.", 0, "I'm already installed", 0x40);
    } else if (!fs.FolderExists(pathPlugins)) {
        shell.Popup("I can't find the BetterDiscord plugins folder.\nAre you sure it's even installed?", 0, "Can't install myself", 0x10);
    } else if (shell.Popup("Should I copy myself to BetterDiscord's plugins folder for you?", 0, "Do you need some help?", 0x34) === 6) {
        fs.CopyFile(pathSelf, fs.BuildPath(pathPlugins, fs.GetFileName(pathSelf)), true);
        // Show the user where to put plugins in the future
        shell.Exec("explorer " + pathPlugins);
        shell.Popup("I'm installed!", 0, "Successfully installed", 0x40);
    }
    WScript.Quit();

@else@*/
const config = {
    info: {
        name: "PermissionsViewer",
        authors: [
            {
                name: "Zerebos",
                discord_id: "249746236008169473",
                github_username: "rauenzi",
                twitter_username: "ZackRauen"
            }
        ],
        version: "0.2.9",
        description: "Allows you to view a user's permissions. Thanks to Noodlebox for the idea!",
        github: "https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/PermissionsViewer",
        github_raw: "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/PermissionsViewer/PermissionsViewer.plugin.js"
    },
    changelog: [
        {
            title: "Fixes",
            type: "fixed",
            items: [
                "Fixed for the latest Discord changes!"
            ]
        }
    ],
    defaultConfig: [
        {
            type: "switch",
            id: "contextMenus",
            name: "Context Menus",
            value: true
        },
        {
            type: "switch",
            id: "popouts",
            name: "Popouts",
            value: true
        },
        {
            type: "radio",
            id: "displayMode",
            name: "Modal Display Mode",
            value: "compact",
            options: [
                {
                    name: "Cozy",
                    value: "cozy"
                },
                {
                    name: "Compact",
                    value: "compact"
                }
            ]
        }
    ],
    strings: {
        es: {
            contextMenuLabel: "Permisos",
            popoutLabel: "Permisos",
            modal: {
                header: "Permisos de {{name}}",
                rolesLabel: "Roles",
                permissionsLabel: "Permisos",
                owner: "@propietario"
            },
            settings: {
                popouts: {
                    name: "Mostrar en Popouts",
                    note: "Mostrar los permisos de usuario en popouts como los roles."
                },
                contextMenus: {
                    name: "Botón de menú contextual",
                    note: "Añadir un botón para ver permisos en los menús contextuales."
                }
            }
        },
        pt: {
            contextMenuLabel: "Permissões",
            popoutLabel: "Permissões",
            modal: {
                header: "Permissões de {{name}}",
                rolesLabel: "Cargos",
                permissionsLabel: "Permissões",
                owner: "@dono"
            },
            settings: {
                popouts: {
                    name: "Mostrar em Popouts",
                    note: "Mostrar as permissões em popouts como os cargos."
                },
                contextMenus: {
                    name: "Botão do menu de contexto",
                    note: "Adicionar um botão parar ver permissões ao menu de contexto."
                }
            }
        },
        de: {
            contextMenuLabel: "Berechtigungen",
            popoutLabel: "Berechtigungen",
            modal: {
                header: "{{name}}s Berechtigungen",
                rolesLabel: "Rollen",
                permissionsLabel: "Berechtigungen",
                owner: "@eigentümer"
            },
            settings: {
                popouts: {
                    name: "In Popouts anzeigen",
                    note: "Zeigt die Gesamtberechtigungen eines Benutzers in seinem Popup ähnlich den Rollen an."
                },
                contextMenus: {
                    name: "Kontextmenü-Schaltfläche",
                    note: "Fügt eine Schaltfläche hinzu, um die Berechtigungen mithilfe von Kontextmenüs anzuzeigen."
                }
            }
        },
        en: {
            contextMenuLabel: "Permissions",
            popoutLabel: "Permissions",
            modal: {
                header: "{{name}}'s Permissions",
                rolesLabel: "Roles",
                permissionsLabel: "Permissions",
                owner: "@owner"
            },
            settings: {
                popouts: {
                    name: "Show In Popouts",
                    note: "Shows a user's total permissions in their popout similar to roles."
                },
                contextMenus: {
                    name: "Context Menu Button",
                    note: "Adds a button to view the permissions modal to select context menus."
                },
                displayMode: {
                    name: "Modal Display Mode"
                }
            }
        },
        ru: {
            contextMenuLabel: "Полномочия",
            popoutLabel: "Полномочия",
            modal: {
                header: "Полномочия {{name}}",
                rolesLabel: "Роли",
                permissionsLabel: "Полномочия",
                owner: "Владелец"
            },
            settings: {
                popouts: {
                    name: "Показать во всплывающих окнах",
                    note: "Отображает полномочия пользователя в их всплывающем окне, аналогичном ролям."
                },
                contextMenus: {
                    name: "Кнопка контекстного меню",
                    note: "Добавить кнопку для отображения полномочий с помощью контекстных меню."
                }
            }
        },
        nl: {
            contextMenuLabel: "Permissies",
            popoutLabel: "Permissies",
            modal: {
                header: "{{name}}'s Permissies",
                rolesLabel: "Rollen",
                permissionsLabel: "Permissies",
                owner: "@eigenaar"
            },
            settings: {
                popouts: {
                    name: "Toon in Popouts",
                    note: "Toont de totale rechten van een gebruiker in zijn pop-out, vergelijkbaar met rollen."
                },
                contextMenus: {
                    name: "Contextmenuknop",
                    note: "Voegt een knop toe om de machtigingsmodaliteit voor het selecteren van contextmenu's te bekijken."
                },
                displayMode: {
                    name: "Modale weergavemodus"
                }
            }
        }
    },
    main: "index.js"
};
class Dummy {
    constructor() {this._config = config;}
    start() {}
    stop() {}
}
 
if (!global.ZeresPluginLibrary) {
    BdApi.showConfirmationModal("Library Missing", `The library plugin needed for ${config.name ?? config.info.name} is missing. Please click Download Now to install it.`, {
        confirmText: "Download Now",
        cancelText: "Cancel",
        onConfirm: () => {
            require("request").get("https://betterdiscord.app/gh-redirect?id=9", async (err, resp, body) => {
                if (err) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                if (resp.statusCode === 302) {
                    require("request").get(resp.headers.location, async (error, response, content) => {
                        if (error) return require("electron").shell.openExternal("https://betterdiscord.app/Download?id=9");
                        await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), content, r));
                    });
                }
                else {
                    await new Promise(r => require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0PluginLibrary.plugin.js"), body, r));
                }
            });
        }
    });
}
 
module.exports = !global.ZeresPluginLibrary ? Dummy : (([Plugin, Api]) => {
     const plugin = (Plugin, Api) => {
    const {ContextMenu, DOM, Utils} = window.BdApi;
    const {DiscordModules, WebpackModules, Toasts, DiscordClasses, Utilities, DOMTools, ColorConverter, ReactTools} = Api;

    const GuildStore = DiscordModules.GuildStore;
    const SelectedGuildStore = DiscordModules.SelectedGuildStore;
    const MemberStore = DiscordModules.GuildMemberStore;
    const UserStore = DiscordModules.UserStore;
    const DiscordPerms = Object.assign({}, DiscordModules.DiscordPermissions);
    const AvatarDefaults = WebpackModules.getByProps("DEFAULT_AVATARS");
    const ModalClasses = WebpackModules.getByProps("root", "header", "small");
    const Strings = WebpackModules.getModule(m => m.Messages && m.Messages.COPY_ID).Messages;
    const UserPopoutClasses = Object.assign({}, WebpackModules.getByProps("userPopoutOuter"), WebpackModules.getByProps("rolePill"), WebpackModules.getByProps("eyebrow"));
    const RoleClasses = Object.assign({}, DiscordClasses.PopoutRoles, WebpackModules.getByProps("rolePill"), WebpackModules.getByProps("roleName", "roleIcon"));

    if (DiscordPerms.STREAM) {
        DiscordPerms.VIDEO = DiscordPerms.STREAM;
        delete DiscordPerms.STREAM;
    }
    if (DiscordPerms.MANAGE_GUILD) {
        DiscordPerms.MANAGE_SERVER = DiscordPerms.MANAGE_GUILD;
        delete DiscordPerms.MANAGE_GUILD;
    }

    return class PermissionsViewer extends Plugin {
        constructor() {
            super();
            this.css = `.perm-user-avatar {
    border-radius: 50%;
    width: 16px;
    height: 16px;
    margin-right: 3px;
}

.member-perms-header {
    color: var(--header-secondary);
    display: flex;
    justify-content: space-between;
}

.member-perms {
    display: flex;
    flex-wrap: wrap;
    margin-top: 2px;
    max-height: 160px;
    overflow-y: auto;
    overflow-x: hidden;
}

.member-perms .member-perm .perm-circle {
    border-radius: 50%;
    height: 12px;
    margin-right: 4px;
    width: 12px;
}

.member-perms .member-perm .name {
    margin-right: 4px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.perm-details-button {
    cursor: pointer;
    height: 12px;
}

.perm-details {
    display: flex;
    justify-content: flex-end;
}

.member-perm-details {
    cursor: pointer;
}

.member-perm-details-button {
    fill: #72767d;
    height: 10px;
}

/* Modal */

@keyframes permissions-backdrop {
    to { opacity: 0.85; }
}

@keyframes permissions-modal-wrapper {
    to { transform: scale(1); opacity: 1; }
}

@keyframes permissions-backdrop-closing {
    to { opacity: 0; }
}

@keyframes permissions-modal-wrapper-closing {
    to { transform: scale(0.7); opacity: 0; }
}

#permissions-modal-wrapper {
    z-index: 100;
}

#permissions-modal-wrapper .callout-backdrop {
    animation: permissions-backdrop 250ms ease;
    animation-fill-mode: forwards;
    opacity: 0;
    background-color: rgb(0, 0, 0);
    transform: translateZ(0px);
}

#permissions-modal-wrapper.closing .callout-backdrop {
    animation: permissions-backdrop-closing 200ms linear;
    animation-fill-mode: forwards;
    animation-delay: 50ms;
    opacity: 0.85;
}

#permissions-modal-wrapper.closing .modal-wrapper {
    animation: permissions-modal-wrapper-closing 250ms cubic-bezier(0.19, 1, 0.22, 1);
    animation-fill-mode: forwards;
    opacity: 1;
    transform: scale(1);
}

#permissions-modal-wrapper .modal-wrapper {
    animation: permissions-modal-wrapper 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
    animation-fill-mode: forwards;
    transform: scale(0.7);
    transform-origin: 50% 50%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    contain: content;
    justify-content: center;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
    user-select: none;
    z-index: 1000;
}

#permissions-modal-wrapper .modal-body {
    background-color: #36393f;
    height: 440px;
    width: auto;
    /*box-shadow: 0 0 0 1px rgba(32,34,37,.6), 0 2px 10px 0 rgba(0,0,0,.2);*/
    flex-direction: row;
    overflow: hidden;
    display: flex;
    flex: 1;
    contain: layout;
    position: relative;
}

#permissions-modal-wrapper #permissions-modal {
    contain: layout;
    flex-direction: column;
    pointer-events: auto;
    border: 1px solid rgba(28,36,43,.6);
    border-radius: 5px;
    box-shadow: 0 2px 10px 0 rgba(0,0,0,.2);
    overflow: hidden;
}

#permissions-modal-wrapper .header {
    background-color: #35393e;
    box-shadow: 0 2px 3px 0 rgba(0,0,0,.2);
    padding: 12px 20px;
    z-index: 1;
    color: #fff;
    font-size: 16px;
    font-weight: 700;
    line-height: 19px;
}

.role-side, .perm-side {
    flex-direction: column;
    padding-left: 6px;
}

.role-scroller, .perm-scroller {
    contain: layout;
    flex: 1;
    min-height: 1px;
    overflow-y: scroll;
}

#permissions-modal-wrapper .scroller-title {
    color: #fff;
    padding: 8px 0 4px 4px;
    margin-right: 8px;
    border-bottom: 1px solid rgba(0,0,0,0.3);
    display: none;
}

#permissions-modal-wrapper .role-side {
    width: auto;
    min-width: 150px;
    background: #2f3136;
    flex: 0 0 auto;
    overflow: hidden;
    display: flex;
    min-height: 1px;
    position: relative;
}

#permissions-modal-wrapper .role-scroller {
    contain: layout;
    flex: 1;
    min-height: 1px;
    overflow-y: scroll;
    padding-top: 8px;
}

#permissions-modal-wrapper .role-item {
    display: flex;
    border-radius: 2px;
    padding: 6px;
    margin-bottom: 5px;
    cursor: pointer;
    color: #dcddde;
}

#permissions-modal-wrapper .role-item:hover {
    background-color: rgba(0,0,0,0.1);
}

#permissions-modal-wrapper .role-item.selected {
    background-color: rgba(0,0,0,0.2);
}

#permissions-modal-wrapper .perm-side {
    width: 273px;
    background-color: #36393f;
    flex: 0 0 auto;
    display: flex;
    min-height: 1px;
    position: relative;
    padding-left: 10px;
}

#permissions-modal-wrapper .perm-item {
    box-shadow: inset 0 -1px 0 rgba(79,84,92,.3);
    box-sizing: border-box;
    height: 44px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    display: flex;
}

#permissions-modal-wrapper .perm-item.allowed svg {
    fill: #43B581;
}

#permissions-modal-wrapper .perm-item.denied svg {
    fill: #F04747;
}

#permissions-modal-wrapper .perm-name {
    display: inline;
    flex: 1;
    font-size: 16px;
    font-weight: 400;
    overflow: hidden;
    text-overflow: ellipsis;
    user-select: text;
    color: #dcddde;
    margin-left: 10px;
}


.member-perms::-webkit-scrollbar-thumb, .member-perms::-webkit-scrollbar-track,
#permissions-modal-wrapper *::-webkit-scrollbar-thumb, #permissions-modal-wrapper *::-webkit-scrollbar-track {
    background-clip: padding-box;
    border-radius: 7.5px;
    border-style: solid;
    border-width: 3px;
    visibility: hidden;
}

.member-perms:hover::-webkit-scrollbar-thumb, .member-perms:hover::-webkit-scrollbar-track,
#permissions-modal-wrapper *:hover::-webkit-scrollbar-thumb, #permissions-modal-wrapper *:hover::-webkit-scrollbar-track {
    visibility: visible;
}

.member-perms::-webkit-scrollbar-track,
#permissions-modal-wrapper *::-webkit-scrollbar-track {
    border-width: initial;
    background-color: transparent;
    border: 2px solid transparent;
}

.member-perms::-webkit-scrollbar-thumb,
#permissions-modal-wrapper *::-webkit-scrollbar-thumb {
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: move;
    background-color: rgba(32,34,37,.6);
}

.member-perms::-webkit-scrollbar,
#permissions-modal-wrapper *::-webkit-scrollbar {
    height: 8px;
    width: 8px;
}



.theme-light #permissions-modal-wrapper #permissions-modal {
    background: #fff;
}

.theme-light #permissions-modal-wrapper .modal-body {
    background: transparent;
}

.theme-light #permissions-modal-wrapper .header {
    background: transparent;
    color: #000;
}

.theme-light #permissions-modal-wrapper .role-side {
    background: rgba(0,0,0,.2);
}

.theme-light #permissions-modal-wrapper .perm-side {
    background: rgba(0,0,0,.1);
}

.theme-light #permissions-modal-wrapper .role-item,
.theme-light #permissions-modal-wrapper .perm-name {
    color: #000;
}

#permissions-modal-wrapper #permissions-modal {
    width: auto;
}`;
            this.jumbo = `#permissions-modal-wrapper #permissions-modal {
    height: 840px;
}

#permissions-modal-wrapper #permissions-modal .perm-side {
    width: 500px;
}

#permissions-modal .perm-scroller {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
}

#permissions-modal .perm-item {
    width: 50%;
}`;
            this.sectionHTML = `<div class="section__6f61e" id="permissions-popout">
    <h2 class="member-perms-header defaultColor__77578 eyebrow_e5a66c defaultColor__87d87 title_ef4a6d" data-text-variant="eyebrow">
        <div class="member-perms-title">{{label}}</div>
        <span class="perm-details">
            <svg name="Details" viewBox="0 0 24 24" class="perm-details-button" fill="currentColor">
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </svg>
        </span>
    </h2>
    <div class="member-perms {{root}} {{roles}}"></div>
</div>`;
            this.itemHTML = `<div class="member-perm {{role}} {{rolePill}}">
    <div class="perm-circle {{roleCircle}}"></div>
    <div class="name {{roleName}}"></div>
</div>`;
            this.modalHTML = `<div id="permissions-modal-wrapper">
        <div class="callout-backdrop {{backdrop}}"></div>
        <div class="modal-wrapper">
            <div id="permissions-modal" class="{{root}} {{small}}">
                <div class="header"><div class="title">{{header}}</div></div>
                <div class="modal-body">
                    <div class="role-side">
                        <span class="scroller-title role-list-title">{{rolesLabel}}</span>
                        <div class="role-scroller">
        
                        </div>
                    </div>
                    <div class="perm-side">
                        <span class="scroller-title perm-list-title">{{permissionsLabel}}</span>
                        <div class="perm-scroller">
        
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
            this.modalItem = `<div class="perm-item"><span class="perm-name"></span></div>`;
            this.modalButton = `<div class="role-item"><span class="role-name"></span></div>`;
            this.modalButtonUser = `<div class="role-item"><div class="wrapper_de5239 xsmall_d82b57"><div class="image__25781 xsmall_d82b57 perm-user-avatar" style="background-image: url('\\{{avatarUrl}}');"></div></div><span class="role-name marginLeft8_ff311d"></span></div>`;
            this.permAllowedIcon = `<svg height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
            this.permDeniedIcon = `<svg height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/></svg>`;

            this.cancelUserPopout = () => {};
            this.contextMenuPatches = [];
        }

        onStart() {
            DOM.addStyle(this.name, this.css);

            this.sectionHTML = Utilities.formatString(this.sectionHTML, DiscordClasses.UserPopout);
            this.sectionHTML = Utilities.formatString(this.sectionHTML, RoleClasses);
            this.sectionHTML = Utilities.formatString(this.sectionHTML, UserPopoutClasses);
            this.itemHTML = Utilities.formatString(this.itemHTML, RoleClasses);
            this.modalHTML = Utilities.formatString(this.modalHTML, DiscordClasses.Backdrop);
            this.modalHTML = Utilities.formatString(this.modalHTML, {root: ModalClasses.root, small: ModalClasses.small});

            this.promises = {state: {cancelled: false}, cancel() {this.state.cancelled = true;}};
            if (this.settings.popouts) this.bindPopouts();
            if (this.settings.contextMenus) this.bindContextMenus();
            this.setDisplayMode(this.settings.displayMode);
        }

        onStop() {
            DOM.removeStyle(this.name);
            this.promises.cancel();
            this.unbindPopouts();
            this.unbindContextMenus();
        }

        setDisplayMode(mode) {
            if (mode === "cozy") DOM.addStyle(this.name + "-jumbo", this.jumbo);
            else DOM.removeStyle(this.name + "-jumbo");
        }

        patchPopouts(e) {
            const popoutMount = (props) => {
                const popout = document.querySelector(`[class*="userPopout_"], [class*="userPopoutOuter_"]`);
                if (!popout || popout.querySelector("#permissions-popout")) return;
                const user = MemberStore.getMember(props.guildId, props.user.id);
                const guild = GuildStore.getGuild(props.guildId);
                const name = MemberStore.getNick(props.guildId, props.user.id) ?? props.user.username;
                if (!user || !guild || !name) return;

                const userRoles = user.roles.slice(0);
                userRoles.push(guild.id);
                userRoles.reverse();
                let perms = 0n;
                const permBlock = DOMTools.createElement(Utilities.formatString(this.sectionHTML, {label: this.strings.popoutLabel}));
                const memberPerms = permBlock.querySelector(".member-perms");
                const strings = Strings;

                for (let r = 0; r < userRoles.length; r++) {
                    const role = userRoles[r];
                    if (!guild.roles[role]) continue;
                    perms = perms | guild.roles[role].permissions;
                    for (const perm in DiscordPerms) {
                        const permName = strings[perm] || perm.split("_").map(n => n[0].toUpperCase() + n.slice(1).toLowerCase()).join(" ");
                        const hasPerm = (perms & DiscordPerms[perm]) == DiscordPerms[perm];
                        if (hasPerm && !memberPerms.querySelector(`[data-name="${permName}"]`)) {
                            const element = DOMTools.createElement(this.itemHTML);
                            element.classList.add(RoleClasses.rolePill);
                            let roleColor = guild.roles[role].colorString;
                            element.querySelector(".name").textContent = permName;
                            element.setAttribute("data-name", permName);
                            if (!roleColor) roleColor = "#B9BBBE";
                            element.querySelector(".perm-circle").style.backgroundColor = ColorConverter.rgbToAlpha(roleColor, 1);
                            element.style.borderColor = ColorConverter.rgbToAlpha(roleColor, 0.6);
                            memberPerms.prepend(element);
                        }
                    }
                }

                permBlock.querySelector(".perm-details").addEventListener("click", () => {
                    this.showModal(this.createModalUser(name, user, guild));
                });
                let roleList = popout.querySelector(`[class*="roles_"]`);
                roleList = roleList?.parentElement;
                roleList?.parentNode?.insertBefore(permBlock, roleList.nextSibling);
                


                const popoutInstance = ReactTools.getOwnerInstance(popout, {include: ["Popout"]});
                if (!popoutInstance || !popoutInstance.updateOffsets) return;
                popoutInstance.updateOffsets();
            };

            if (!e.addedNodes.length || !(e.addedNodes[0] instanceof Element)) return;
            // console.log(e)
            const element = e.addedNodes[0];
            const popout = element.querySelector(`[class*="userPopout_"], [class*="userPopoutOuter_"]`) ?? element;
            if (!popout || !popout.matches(`[class*="userPopout_"], [class*="userPopoutOuter_"]`)) return;
            const props = Utilities.findInTree(ReactTools.getReactInstance(popout), m => m && m.user, {walkable: ["memoizedProps", "return"]});
            popoutMount(props);
        }

        bindPopouts() {
            this.observer = this.patchPopouts.bind(this);
        }

        unbindPopouts() {
            this.observer = undefined;
        }

        async bindContextMenus() {
            this.patchChannelContextMenu();
            this.patchGuildContextMenu();
            this.patchUserContextMenu();
        }

        unbindContextMenus() {
            for (const cancel of this.contextMenuPatches) cancel();
        }

        patchGuildContextMenu() {
            this.contextMenuPatches.push(ContextMenu.patch("guild-context", (retVal, props) => {
                if (!props?.guild) return retVal; // Ignore non-guild items
                const newItem = ContextMenu.buildItem({
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        this.showModal(this.createModalGuild(props.guild.name, props.guild));
                    }
                });
                retVal.props.children.splice(1, 0, newItem);
            }));
        }

        patchChannelContextMenu() {
            this.contextMenuPatches.push(ContextMenu.patch("channel-context", (retVal, props) => {
                const newItem = ContextMenu.buildItem({
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        if (!Object.keys(props.channel.permissionOverwrites).length) return Toasts.info(`#${props.channel.name} has no permission overrides`);
                        this.showModal(this.createModalChannel(props.channel.name, props.channel, props.guild));
                    }
                });
                retVal.props.children.splice(1, 0, newItem);
            }));
        }

        patchUserContextMenu() {
            this.contextMenuPatches.push(ContextMenu.patch("user-context", (retVal, props) => {
                const guild = GuildStore.getGuild(props.guildId);
                if (!guild) return;

                const newItem = ContextMenu.buildItem({
                    label: this.strings.contextMenuLabel,
                    action: () => {
                        const user = MemberStore.getMember(props.guildId, props.user.id);
                        const name = user.nick ? user.nick : props.user.username;
                        this.showModal(this.createModalUser(name, user, guild));
                    }
                });
                retVal?.props?.children[0]?.props?.children.splice(2, 0, newItem);
            }));
        }

        showModal(modal) {
            const popout = document.querySelector(`[class*="userPopoutOuter-"]`);
            if (popout) popout.style.display = "none";
            const app = document.querySelector(".app-19_DXt");
            if (app) app.append(modal);
            else document.querySelector("#app-mount").append(modal);

            const closeModal = (event) => {
                if (!event.key === "Escape") return;
                modal.classList.add("closing");
                setTimeout(() => {modal.remove();}, 300);
            };
            document.addEventListener("keydown", closeModal, true);
            DOMTools.onRemoved(modal, () => document.removeEventListener("keydown", closeModal, true));
        }

        createModalChannel(name, channel, guild) {
            return this.createModal(`#${name}`, channel.permissionOverwrites, guild.roles, true);
        }

        createModalUser(name, user, guild) {
            const guildRoles = Object.assign({}, guild.roles);
            const userRoles = user.roles.slice(0).filter(r => typeof(guildRoles[r]) !== "undefined");
            
            userRoles.push(guild.id);
            userRoles.sort((a, b) => {return guildRoles[b].position - guildRoles[a].position;});

            if (user.userId == guild.ownerId) {
                const ALL_PERMISSIONS = Object.values(DiscordModules.DiscordPermissions).reduce((all, p) => all | p);
                userRoles.push(user.userId);
                guildRoles[user.userId] = {name: this.strings.modal.owner, permissions: ALL_PERMISSIONS};
            }
            return this.createModal(name, userRoles, guildRoles);
        }

        createModalGuild(name, guild) {
            return this.createModal(name, guild.roles);
        }

        createModal(title, displayRoles, referenceRoles, isOverride = false) {
            if (!referenceRoles) referenceRoles = displayRoles;
            const modal = DOMTools.createElement(Utilities.formatString(Utilities.formatString(this.modalHTML, this.strings.modal), {name: Utils.escapeHTML(title)}));
            const closeModal = () => {
                modal.classList.add("closing");
                setTimeout(() => {modal.remove();}, 300);
            };
            modal.querySelector(".callout-backdrop").addEventListener("click", closeModal);

            const strings = Strings || {};
            for (const r in displayRoles) {
                const role = Array.isArray(displayRoles) ? displayRoles[r] : r;
                const user = UserStore.getUser(role) || {getAvatarURL: () => AvatarDefaults.DEFAULT_AVATARS[Math.floor(Math.random() * AvatarDefaults.DEFAULT_AVATARS.length)], username: role};
                const member = MemberStore.getMember(SelectedGuildStore.getGuildId(), role) || {colorString: ""};
                const item = DOMTools.createElement(!isOverride || displayRoles[role].type == 0 ? this.modalButton : Utilities.formatString(this.modalButtonUser, {avatarUrl: user.getAvatarURL(null, 16, true)})); // getAvatarURL(guildId, size, canAnimate);
                if (!isOverride || displayRoles[role].type == 0) item.style.color = referenceRoles[role].colorString;
                else item.style.color = member.colorString;
                if (isOverride) item.querySelector(".role-name").innerHTML = Utils.escapeHTML(displayRoles[role].type == 0 ? referenceRoles[role].name : user.username);
                else item.querySelector(".role-name").innerHTML = Utils.escapeHTML(referenceRoles[role].name);
                modal.querySelector(".role-scroller").append(item);
                item.addEventListener("click", () => {
                    modal.querySelectorAll(".role-item.selected").forEach(e => e.classList.remove("selected"));
                    item.classList.add("selected");
                    const allowed = isOverride ? displayRoles[role].allow : referenceRoles[role].permissions;
                    const denied = isOverride ? displayRoles[role].deny : null;

                    const permList = modal.querySelector(".perm-scroller");
                    permList.innerHTML = "";
                    for (const perm in DiscordPerms) {
                        const element = DOMTools.createElement(this.modalItem);
                        const permAllowed = (allowed & DiscordPerms[perm]) == DiscordPerms[perm];
                        const permDenied = isOverride ? (denied & DiscordPerms[perm]) == DiscordPerms[perm] : !permAllowed;
                        if (!permAllowed && !permDenied) continue;
                        if (permAllowed) {
                            element.classList.add("allowed");
                            element.prepend(DOMTools.createElement(this.permAllowedIcon));
                        }
                        if (permDenied) {
                            element.classList.add("denied");
                            element.prepend(DOMTools.createElement(this.permDeniedIcon));
                        }
                        element.querySelector(".perm-name").textContent = strings[perm] || perm.split("_").map(n => n[0].toUpperCase() + n.slice(1).toLowerCase()).join(" ");
                        permList.append(element);
                    }
                });
                item.addEventListener("contextmenu", (e) => {
                    ContextMenu.open(e, ContextMenu.buildMenu([
                        {label: Strings.COPY_ID ?? "Copy Id", action: () => {DiscordModules.ElectronModule.copy(role);}}
                    ]));
                });
            }

            modal.querySelector(".role-item").click();

            return modal;
        }

        getSettingsPanel() {
            const panel = this.buildSettingsPanel();
            panel.addListener((id, checked) => {
                if (id == "popouts") {
                    if (checked) this.bindPopouts();
                    else this.unbindPopouts();
                }
                if (id == "contextMenus") {
                    if (checked) this.bindContextMenus();
                    this.unbindContextMenus();
                }
                if (id == "displayMode") this.setDisplayMode(checked);
            });
            return panel.getElement();
        }

    };
};
     return plugin(Plugin, Api);
})(global.ZeresPluginLibrary.buildPlugin(config));
/*@end@*/
