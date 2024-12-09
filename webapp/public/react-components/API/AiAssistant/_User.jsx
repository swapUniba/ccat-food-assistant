export const _User = {
    getChatRoom: _ => {
        return FuxHTTP.get(
            `${WEB_SERVER_URL}/ai-assistant/chat/get-chat-room`, {},
            FuxHTTP.RESOLVE_DATA,
            FuxHTTP.REJECT_MESSAGE
        );
    },
    refreshChatRoom: _ => {
        return FuxHTTP.post(
            `${WEB_SERVER_URL}/ai-assistant/chat/refresh-chat-room`, {},
            FuxHTTP.RESOLVE_DATA,
            FuxHTTP.REJECT_MESSAGE
        );
    },
    getMessages: (room_id, limit, cursor) => {
        return FuxHTTP.get(
            `${WEB_SERVER_URL}/ai-assistant/chat/get-messages`, {
                room_id: room_id,
                limit: limit,
                cursor: cursor
            },
            FuxHTTP.RESOLVE_DATA,
            FuxHTTP.REJECT_MESSAGE
        );
    },
    getMediaContentUrl: (message_id) => {
        return (`${WEB_SERVER_URL}/ai-assistant/chat/get-media-content?message_id=${message_id}`)
    },
    sendTextMessage: (room_id, text, attachments = [], assistant_specific_prompt = null, mode = null) => {
        const formData = new FormData();
        formData.append("room_id", room_id);
        formData.append("text", text);
        if(mode) formData.append("mode", mode);
        if (assistant_specific_prompt) formData.append('assistant_specific_prompt', assistant_specific_prompt);
        if (attachments) {
            attachments.map(a => {
                formData.append("attachments[]", a);
            })
        }
        const xsrf_token = FuxHTTP.getCookie('XSRF-TOKEN');
        if (xsrf_token) formData.append('_token', xsrf_token);

        return new Promise((resolve, reject) => {
            fetch(`${WEB_SERVER_URL}/ai-assistant/chat/send-text-message`, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(json => {
                    json.status === FuxHTTP.STATUS_SUCCESS ? resolve(json.data) : reject(json.message);
                })
                .catch(m => {
                    console.error(m);
                    reject(null);
                });
        })
    }
};

