const mongoose = require("mongoose")

const contactSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    messageTextArea: {
        type: String,
        required: true
    }
}, { timestamps: true }, { collection: "Contact" })

const Contact = mongoose.model("Contact", contactSchema)

module.exports = Contact;