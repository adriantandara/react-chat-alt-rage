import React, { useState, useCallback, useEffect, useRef, useLayoutEffect } from "react";
import { motion } from 'framer-motion';
import { IoMdSettings } from 'react-icons/io';
import { AiOutlineCaretRight } from 'react-icons/ai';
import style from './Chat.module.scss';

export default function Chat() {
    const [state, setState] = useState({
        messages: [],
        inputHistory: [],
        barStatus: false,
        settingsStatus: false,
        timeStamp: true,
        fontSize: 1.8,
        pageSize: 20,
        inputHistoryIndex: -1,
        inputValue: ''
    });

    const messagesRef = useRef(null);
    const maxMessages = 150;

    /* --- SETTINGS --- */
    const settings = [
        {
            name: 'Font Size',
            type: 'range',
            stateName: 'fontSize',
            className: style.fontsize,
            min: 1.3,
            max: 2,
            step: 0.01,
            onChange: (e) => { 
                mp.trigger("chat::update_chat_data_fontsize", e.target.value); 
                updateState({ fontSize: e.target.value }) 
            },
        },
        {
            name: 'Page Size',
            type: 'range',
            stateName: 'pageSize',
            className: style.pagesize,
            min: 20,
            max: 35,
            step: 0.01,
            onChange: (e) => { 
                mp.trigger("chat::update_chat_data_pagesize", e.target.value); 
                updateState({ pageSize: e.target.value }) 
            },
        },
        {
            name: 'Timestamp',
            type: 'checkbox',
            stateName: 'timeStamp',
            className: style.checkbox,
            onChange: () => { 
                mp.trigger("chat::update_chat_data_timestamp", !state.timeStamp); 
                updateState({ timeStamp: !state.timeStamp }) 
            },
        },
    ];

    /* ---- ARROW FUNCTIONS ---- */
    const updateState = useCallback((newConfig) => setState((prevConfig) => ({ ...prevConfig, ...newConfig })), []);
    const isUserAtBottom = useCallback(() => {
        const { clientHeight, scrollHeight, scrollTop } = messagesRef.current;
        return scrollHeight - scrollTop === clientHeight;
    }, []);

    const addChatMessage = useCallback((msg) => {
        const timestamp = getTimeStamp();
        msg = msg.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const msgWithColor = msg.replace(/\{([0-9a-fA-F]{6})\}([^{}]*)/g, '<span style="color: #$1">$2</span>');
    
        setState((prevState) => {
            const newMessages = [...prevState.messages, { message: msgWithColor, timestamp }];
            if (newMessages.length > maxMessages && isUserAtBottom()) newMessages.shift();
            return { ...prevState, messages: newMessages };
        });
    }, [isUserAtBottom]);

    const fix_html_elements = (element) => {
        return <span dangerouslySetInnerHTML={{__html: element }} />
    };

    const getTimeStamp = () => {
        const today = new Date();
        const hours = String(today.getHours()).padStart(2, "0");
        const minute = String(today.getMinutes()).padStart(2, "0");
        const seconds = String(today.getSeconds()).padStart(2, "0");
        return `[${hours}:${minute}:${seconds}]`;
    };

    const handleKeyDown = useCallback((event) => {
        if (!state.barStatus) return;
        switch (event.key) {
            case 'Enter':
                if (state.inputValue === '') {
                    mp.trigger("chat::hide_client_chat");
                    updateState({ barStatus: false });
                    return;
                }
                const inputHistory = [...state.inputHistory, state.inputValue];
                updateState({ inputHistory, inputHistoryIndex: inputHistory.length, barStatus: false, inputValue: '' });
                mp.trigger("chat::hide_client_chat");
                state.inputValue.startsWith('/') ? mp.trigger("chat::executeChatCommand", state.inputValue.slice(1)) : mp.trigger("chat::sendChatMessage", state.inputValue);
                break;

            case 'ArrowUp':
                if (state.inputHistoryIndex - 1 >= 0) {
                    const inputHistoryIndex = state.inputHistoryIndex - 1;
                    updateState({ inputValue: state.inputHistory[inputHistoryIndex], inputHistoryIndex });
                }
                break;

            case 'ArrowDown':
                if (state.inputHistoryIndex + 1 < state.inputHistory.length) {
                    const inputHistoryIndex = state.inputHistoryIndex + 1;
                    updateState({ inputValue: state.inputHistory[inputHistoryIndex], inputHistoryIndex });
                }
                break;

            case 'Escape':
                updateState({ inputValue: '', barStatus: false });
                mp.trigger("chat::hide_client_chat");
                break;
            default:
                break;
        }
    }, [state, updateState]);

    /* ---- RAGE WINDOWS ---- */
    const rage_windows = {
        set_chat_bar_status: (status) => updateState({ barStatus: status }),
        update_chat_storage: (data) => updateState(data),
        send_chat_message: () => addChatMessage
    }
    Object.assign(window, rage_windows);

    /* ---- USE EFFECTS ---- */
    useLayoutEffect(() => {
        if (messagesRef.current) {
            setTimeout(() => {
                messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
            }, 10);
        }
    }, [state.messages, state.pageSize, state.fontSize, state.timeStamp]);

    useEffect(() => {
        window.addEventListener('keyup', handleKeyDown);
        return () => window.removeEventListener('keyup', handleKeyDown);
    }, [handleKeyDown]);

    return <div className={style.container} tabIndex={0}>
        <ul className={style.messages} ref={messagesRef} style={{ "--fontsize": state.fontSize, "--pagesize": state.pageSize }}>
            {state.messages.map(({ message, timestamp }, index) => (
                <li key={index} className={style.message}>
                    {state.timeStamp && <span className={style.timestamp}>{timestamp}</span>}
                    {" "}
                    {fix_html_elements(message)}
                    
                </li>
            ))}
        </ul>
        {state.barStatus && (
            <div className={style.chatBar}>
                <div className={style.inputSection}>
                    <AiOutlineCaretRight className={style.iconArrow} />
                    <input type="text" autoFocus={true} value={state.inputValue} placeholder="Enter your message here" maxLength={120} className={style.input} onChange={(e) => updateState({ inputValue: e.target.value })} />
                </div>
                <div className={style.settingsIconSection}>
                    <IoMdSettings className={style.settingsIcon} onClick={() => updateState({ settingsStatus: !state.settingsStatus })} />
                </div>
            </div>
        )}
        <span></span>
        {state.settingsStatus && state.barStatus && (
            <motion.div initial={{ translateY: -20, opacity: 0 }} animate={{ translateY: 0, opacity: 1 }} transition={{ duration: 0.3 }} className={style.settingsContainer}>
                {settings.map(setting => (
                    <div className={style.settings} key={setting.name}>
                        <p>{setting.name}:</p>
                        {setting.type === 'checkbox' ? ( <input type={setting.type} checked={state[setting.stateName]} className={setting.className} onChange={setting.onChange} id={setting.name} /> ) : ( <input type={setting.type} value={state[setting.stateName]}  min={setting.min} max={setting.max} step={setting.step} className={setting.className} onChange={setting.onChange} id={setting.name} /> )}
                        {setting.type === 'checkbox' && <label htmlFor={setting.name} className={style.timestamp}></label>}
                    </div>
                ))}
            </motion.div>
        )}
    </div>;
}


