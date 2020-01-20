/*
 * VTB Group. Do not reproduce without permission in writing.
 * Copyright (c) 2019 VTB Group. All rights reserved.
 */
import {get, isMatch} from 'lodash';

interface Window {
    indexedDB?: IDBFactory;
    webkitIndexedDB?: IDBFactory;
    mozIndexedDB?: IDBFactory;
    msIndexedDB?: IDBFactory;
    shimIndexedDB?: IDBFactory;
}

declare const window: Window;

const ACCESS_RIGHTS = {
    READONLY: 'readonly',
    READWRITE: 'readwrite',
    ERSIONCHANGE: 'versionchange'
};

const DB_NAME = 'VTB_DBO';
const STORE_NAME = 'ScrollersFilters';

const indexedDB = window.indexedDB || window.mozIndexedDB ||
    window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

const getNameDB = (uid: string, scrollerName: string) => `${STORE_NAME}.${uid}.${scrollerName}`;

interface EventTargetWithResult<T> extends EventTarget {
    result: T
}

const setUpgradeHandler = (openDb: IDBOpenDBRequest, uid: string, scrollerName: string) => {
    const openDB = openDb;
    const dbName = getNameDB(uid, scrollerName);

    openDB.onupgradeneeded = (event) => {
        const db = (<EventTargetWithResult<IDBDatabase>>event.target).result;
        const store = db.createObjectStore(dbName, {keyPath: 'id', autoIncrement: true});
        store.createIndex('id', 'id');
    };
};

export const getDatabase = (uid: string, scrollerName: string): Promise<IDBDatabase> =>
    new Promise((resolve, reject) => {
        const openDB = indexedDB.open(DB_NAME);

        setUpgradeHandler(openDB, uid, scrollerName);

        openDB.onerror = reject;

        openDB.onsuccess = (event) => {
            resolve((<EventTargetWithResult<IDBDatabase>>event.target).result);
        };
    });

type $Values<O extends object> = O[keyof O];
export type AccessRightsType = $Values<typeof ACCESS_RIGHTS>;

const getObjectStore = (
    db: IDBDatabase,
    uid: string,
    scrollerName: string,
    access: AccessRightsType
): Promise<IDBObjectStore> => (
    new Promise((resolve, reject) => {
        const dbName = getNameDB(uid, scrollerName);
        if (!(db.objectStoreNames).contains(dbName)) {
            reject(new Error(`objectStore ${dbName} not exist`));
        }

        const transaction = db.transaction([dbName], (access as IDBTransactionMode));
        const objectStoreInstance = transaction.objectStore(dbName);
        resolve(objectStoreInstance);
    })
);

const updateVersion = (db: IDBDatabase, uid: string, scrollerName: string): Promise<IDBObjectStore> =>
    new Promise((resolve, reject) => {
        const {version} = db;
        db.close();
        const nextOpenDB = indexedDB.open(DB_NAME, version + 1);
        setUpgradeHandler(nextOpenDB, uid, scrollerName);
        reject();
    });

const openTransaction = (
    uid: string,
    scrollerName: string,
    access: AccessRightsType
): Promise<IDBObjectStore> =>
    getDatabase(uid, scrollerName)
        .then((db: IDBDatabase) => getObjectStore(db, uid, scrollerName, access)
            .catch(() => updateVersion(db, uid, scrollerName)));

export const putFilter = (uid: string, scrollerName: string, filter: Object): Promise<Object> =>
    new Promise((resolve) => {
        openTransaction(uid, scrollerName, ACCESS_RIGHTS.READWRITE)
            .then((os) => {
                const objectStore = os;
                objectStore.put(filter).onsuccess = result => resolve(get(result, 'target.result'));
            });
    });

export const getFilters = (uid: string, scrollerName: string, form?: Object): Promise<Array<Object>> =>
    new Promise((resolve) => {
        openTransaction(uid, scrollerName, ACCESS_RIGHTS.READONLY)
            .then((os) => {
                const objectStore = os;
                const result: Array<Object> = [];
                objectStore.openCursor().onsuccess = (event: Event) => {
                    const cursor = (<EventTargetWithResult<IDBCursorWithValue>>event.target).result;
                    if (!cursor) {
                        resolve(result);
                    } else {
                        const {value} = cursor;
                        if (!form) {
                            result.push(value);
                        } else if (isMatch(value.form, form) && isMatch(form, value.form)) {
                            result.push(value);
                        }
                        cursor.continue();
                    }
                };
            });
    });

type FilterType = {
    id: number | string
}

export const deleteFilter = (uid: string, scrollerName: string, filter: FilterType): Promise<Object> =>
    new Promise((resolve) => {
        openTransaction(uid, scrollerName, ACCESS_RIGHTS.READWRITE)
            .then((os) => {
                const objectStore = os;
                objectStore.delete(filter.id).onsuccess = () => resolve(filter);
            });
    });
