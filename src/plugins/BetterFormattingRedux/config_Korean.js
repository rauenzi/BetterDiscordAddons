module.exports = {
    info: {
        name: "BetterFormattingRedux",
        authors: [{
            name: "Zerebos",
            discord_id: "249746236008169473",
            github_username: "rauenzi",
            twitter_username: "ZackRauen"
        }],
        version: "2.3.14",
        description: "Enables different types of formatting in standard Discord chat.",
        github: "https://github.com/rauenzi/BetterDiscordAddons/tree/master/Plugins/BetterFormattingRedux",
        github_raw: "https://raw.githubusercontent.com/rauenzi/BetterDiscordAddons/master/Plugins/BetterFormattingRedux/BetterFormattingRedux.plugin.js"
    },
    changelog: [
        {
            title: "GUI Works Again",
            type: "fixed",
            items: [
                "Clicking the buttons works again!",
                "Dragging to reorder the buttons is broken."
            ]
        }
    ],
    main: "index.js",
    defaultConfig: [
        {
            type: "category",
            id: "toolbar",
            name: "툴바 버튼",
            collapsible: true,
            shown: false,
            settings: [
                {type: "switch", id: "bold", name: "굵게", value: true},
                {type: "switch", id: "italic", name: "기울임꼴", value: true},
                {type: "switch", id: "underline", name: "밑줄", value: true},
                {type: "switch", id: "strikethrough", name: "취소선", value: true},
                {type: "switch", id: "spoiler", name: "스포일러주의", value: true},
                {type: "switch", id: "code", name: "코드양식", value: true},
                {type: "switch", id: "codeblock", name: "코드 블록", value: true},
                {type: "switch", id: "superscript", name: "위첨자", value: true},
                {type: "switch", id: "smallcaps", name: "작은 대문자", value: true},
                {type: "switch", id: "fullwidth", name: "넓은 간격", value: true},
                {type: "switch", id: "upsidedown", name: "거꾸로", value: true},
                {type: "switch", id: "varied", name: "대소문자 번갈아 놓기", value: true},
                {type: "switch", id: "leet", name: "Leet", value: false},
                {type: "switch", id: "thicc", name: "Extra Thicc", value: false}
            ]
        },
        {
            type: "category",
            id: "formats",
            name: "활성 포맷",
            collapsible: true,
            shown: false,
            settings: [
                {type: "switch", id: "superscript", name: "위첨자", value: true},
                {type: "switch", id: "smallcaps", name: "작은 대문자", value: true},
                {type: "switch", id: "fullwidth", name: "넓은 간격", value: true},
                {type: "switch", id: "upsidedown", name: "거꾸로", value: true},
                {type: "switch", id: "varied", name: "대소문자 번갈아 놓기", value: true},
                {type: "switch", id: "leet", name: "Leet (1337)", value: false},
                {type: "switch", id: "thicc", name: "Extra Thicc", value: false}
            ]
        },
        {
            type: "category",
            id: "wrappers",
            name: "래퍼 옵션",
            collapsible: true,
            shown: false,
            settings: [
                {type: "textbox", id: "superscript", name: "위첨자", note: "위첨자 텍스트의 래퍼", value: "^^"},
                {type: "textbox", id: "smallcaps", name: "작은 대문자", note: "작은 대문자를 만들기 위한 래퍼", value: "%%"},
                {type: "textbox", id: "fullwidth", name: "넓은 간격", note: "넓은 간격 텍스트의 래퍼", value: "##"},
                {type: "textbox", id: "upsidedown", name: "거꾸로", note: "텍스트를 거꾸로 뒤집기 위한 래퍼", value: "&&"},
                {type: "textbox", id: "varied", name: "대소문자 번갈아 놓기", note: "대소문자 번갈아 놓기위한 래퍼", value: "=="},
                {type: "textbox", id: "leet", name: "Leet (1337)", note: "13375p34k로 말하기 위한 래퍼", value: "++"},
                {type: "textbox", id: "thicc", name: "Extra Thicc", note: "Extra Thicc 텍스트의 래퍼", value: "$$"}
            ]
        },
        {
            type: "category",
            id: "formatting",
            name: "포맷 옵션",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "dropdown",
                    id: "fullWidthMap",
                    name: "넓은 간격 스타일",
                    note: "어떤 종류의 넓은 간격 포맷을 사용할지 선택합니다.",
                    value: true,
                    options: [
                        {label: "T H I S", value: false},
                        {label: "ｔｈｉｓ", value: true}
                    ]
                },
                {type: "switch", id: "reorderUpsidedown", name: "거꾸로 텍스트 재정렬", note: "이 기능을 활성화하면 거꾸로 된 텍스트를 순서대로 나타냅니다.", value: true},
                {type: "switch", id: "fullwidth", name: "대소문자 번갈아 놓기로 시작", note: "이 옵션을 활성화하면 기존 텍스트를 소문자, 대문자 번갈아나타냅니다.", value: true}
            ]
        },
        {
            type: "category",
            id: "plugin",
            name: "기능 옵션",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "dropdown",
                    id: "hoverOpen",
                    name: "툴바 열기",
                    note: "툴바를 언제 표시할지 결정합니다.",
                    value: true,
                    options: [
                        {label: "클릭", value: false},
                        {label: "마우스 포인터가 올라갔을 때", value: true}
                    ]
                },
                {
                    type: "dropdown",
                    id: "chainFormats",
                    name: "포맷 체이닝",
                    note: "래퍼의 우선순위를 내부부터 외부 또는 외부부터 내부로 바꿉니다. 자세한 내용은 GitHub를 참조하십시오.",
                    value: true,
                    options: [
                        {label: "내부", value: false},
                        {label: "외부", value: true}
                    ]
                },
                {type: "switch", id: "closeOnSend", name: "전송 시 닫기", note: "이 옵션을 활성화하면 메시지를 전송할 때 툴바가 닫힙니다.", value: true}
            ]
        },
        {
            type: "category",
            id: "style",
            name: "스타일 옵션",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "dropdown",
                    id: "icons",
                    name: "툴바 스타일",
                    note: "툴바 버튼을 아이콘 또는 텍스트로 전환합니다.",
                    value: true,
                    options: [
                        {label: "텍스트", value: false},
                        {label: "아이콘", value: true}
                    ]
                },
                {
                    type: "dropdown",
                    id: "rightSide",
                    name: "툴바 위치",
                    note: "이 옵션을 활성화하면 툴바 위치를 교체합니다.",
                    value: true,
                    options: [
                        {label: "왼쪽", value: false},
                        {label: "오른쪽", value: true}
                    ]
                },
                {
                    type: "slider",
                    id: "toolbarOpacity",
                    name: "불투명도",
                    note: "이 옵션을 사용하면 툴바를 부분적으로 투명하게 할 수 있습니다.",
                    value: 1,
                    min: 0,
                    max: 1
                },
                {
                    type: "slider",
                    id: "fontSize",
                    name: "폰트 크기",
                    note: "폰트 크기를 0%에서 100% 사이로 조절합니다.",
                    value: 85,
                    min: 0,
                    max: 100
                }
            ]
        },
        {
            type: "category",
            id: "language",
            name: "언어 옵션",
            collapsible: true,
            shown: false,
            settings: [
                {
                    type: "dropdown",
                    id: "selectlanguage",
                    name: "언어 설정",
                    note: "언어를 설정합니다.",
                    value: "English",
                    options: [
                        {
                            label: "English",
                            value: "English"
                        },
                        {
                            label: "한국어",
                            value: "Korean"
                        }
                    ]
                }
            ]
        }
    ]    
};