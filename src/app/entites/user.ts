export class User {
    firstname: string;
    lastname: string;
    username: string;
    email: string;
    company_email: string;
    company: string;
    mobile: string;
    office_line: string;
    ice: string;
    whatsapp: string;
    is_admin: boolean;
    password: string;
    constructor() {
        this.firstname = '';
        this.lastname = '';
        this.username = '';
        this.email = '';
        this.company_email = '';
        this.company = '';
        this.mobile = '';
        this.office_line = '';
        this.ice = '';
        this.whatsapp = '';
        this.is_admin = false;
        this.password = '';
    }
}
