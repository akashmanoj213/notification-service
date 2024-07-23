class TextMessage {
    constructor(body, previewUrl = false) {
        this.body = body;
        this.preview_url = previewUrl;
    }
}

module.exports = TextMessage;