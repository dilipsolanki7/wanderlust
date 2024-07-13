class ExpressError extends Error{
    constructor(status, message){
        super();
        this.statuscode = status;
        this.message = message;
    }
}

module.exports = ExpressError;