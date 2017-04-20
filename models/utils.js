module.exports = {
    middlewareAddCreatedAtField(Schema) {
        Schema.pre('save', function (next) {
            const now = new Date();
            if (!this.created_at) {
                this.created_at = now;
            }
            next();
        });
    },
};
