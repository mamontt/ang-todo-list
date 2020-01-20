/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
export interface Client {
    id: number;
    shortName: string;
    internationalName: string;
    resident: true;
    inn: string;
    okpo: string;
    registrationDate: string;
    ogrn: string;
}
