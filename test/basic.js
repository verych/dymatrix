require('node-import');

imports('./dymatrix.js'); // import needed file with function to global context
const chai = require('chai');
chai.should();
const assert = require('chai').assert;

//global data to acces from any tests
let matrix = null;
let matrixes = [];
let initData = {
    groups: [
        {
            id: 'web',
            name: 'Web',
            rows: [
                { id: 'download', name: 'Download file from web' },
                { id: 'share_link', name: 'Create shared link from web' },
                { id: 'download_link', name: 'Download file from shared link' },
                { id: 'view_link', name: 'View file from shared link' },
                { id: 'wopi', name: 'View/edit with Office online' }
            ]
        },
        {
            id: 'mobile',
            name: 'Mobile',
            rows: [
                { id: 'share_link', name: 'Create shared link' },
                { id: 'view', name: 'View' },
                { id: 'open', name: 'Open In' }
            ]
        },
        {
            id: 'desktop',
            name: 'Desktop',
            rows: [
                { id: 'sync', name: 'Sync down' }
            ]
        },
        {
            id: 'outlook',
            name: 'Outlook',
            rows: [
                { id: 'share_link', name: 'Create shared link' }
            ]
        }
    ],
    columns: [
        { id: 'guest', name: 'Guest' },
        { id: 'user', name: 'Registered' },
        { id: 'admin', name: 'Admin' }
    ],
    options: [
        { id: 'allow', name: 'Allow' },
        { id: 'warn', name: 'Warn' },
        { id: 'disallow', name: 'Disallow' }
    ],
    values: {
        web: {
            download: {
                guest: 'disallow',
                user: 'warn',
                admin: 'disallow',
            },
            share_link: {
                guest: 'disallow',
                user: 'allow',
                admin: 'allow',
            },
            download_link: {
                guest: 'disallow',
                user: 'warn',
                admin: 'warn',
            },
            view_link: {
                guest: 'disallow',
                user: 'disallow',
                admin: 'disallow',
            },
            wopi: {
                guest: 'disallow',
                user: 'warn',
                admin: 'allow',
            },
        }
    }
};

function onMatrixCreated(arrayOfMatrix) {
    matrixes = arrayOfMatrix;
    if (arrayOfMatrix.length > 0) {
        matrix = arrayOfMatrix[0];
    }
};

function setUpdate(m, index) {
    m.setData((data) => {
        results[index] = data;
    });
}

function initMatrix(callback) {
    dymatrix.init('container', initData,
            {
                headerPopup: false,
                cellPopup: true
            },
            (results) => {
                onMatrixCreated(results);
                callback();
            });
}
  
/***
/*
/* Tests:
/*
***/

//Sync tests
function runSyncMatrixTests() {
    describe("Level 1 - structure", () => {
        it('Number of created groups', () => {
            assert.lengthOf(
                matrix.dom.find('.group'),
                initData.groups.length,
                "Not all groups were created");
        });
        it('Number of created columns', () => {
            assert.lengthOf(
                matrix.dom.find('.header .column'),
                initData.columns.length * initData.groups.length,
                "Not all columns were created"
                );
        });
        it('Number of created rows', () => {
            for (let i = 0; i < initData.groups.length; i++) {
                assert.lengthOf(
                    matrix.dom.find(`[dm-id="${initData.groups[i].id}"] .row`),
                    initData.groups[i].rows.length,
                    `Not all rows were created for group  ${initData.groups[i].id}`);
            }
        });
        it('Number of created group headers', () => {
            assert.lengthOf(
                matrix.dom.find('.header'),
                initData.groups.length,
                "Not all group headers were created");
        });
    });
}

//Async tests
describe("Dynamic Matrix Tests", () => {
    describe("Level 0 (async) - object creating", () => {
        it("Creating matrix object (without container)", (done) => {
            initMatrix(() => {
                try {
                    // boilerplate to be able to get the assert failures
                    assert.lengthOf(matrixes, 1, "Matrix object has not created");
                    assert.isDefined(matrix.dom, "Matrix has no dom");
                    done();
                    //matrix is created, we can run sync tests:
                    runSyncMatrixTests();
                } catch (error) {
                    done(error);
                }
            });
        });
    });
});

