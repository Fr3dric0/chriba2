
export class XHRError extends Error{
    status: number;

    constructor(err?: string, status?: number) {
        super(err);
        this.status = status;
    }

}