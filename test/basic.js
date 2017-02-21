require('node-import');

imports('./bin/dymatrix.min.js'); // import needed file with function to global context
const chai = require('chai');
chai.should();
const assert = require('chai').assert;

//global data to acces from any tests
let matrix = null;
let matrixes = [];
let initData = {
    groups: [
        {
            id: 'group1',
            name: 'Global access',
            rows: [
                { id: 'r11', name: 'Access office' },
                { id: 'r12', name: 'Access support stage' },
                { id: 'r13', name: 'Access tech stage' },
                { id: 'r14', name: 'Access kitchen' },
                { id: 'r15', name: 'Access mobile department' }
            ]
        },
        {
            id: 'group2',
            name: 'Services',
            rows: [
                { id: 'r21', name: 'Open any doors' },
                { id: 'r22', name: 'Turning on/off lights' },
                { id: 'r23', name: 'Open windowses' }
            ]
        },
        {
            id: 'group3',
            name: 'Administrative',
            rows: [
                { id: 'r31', name: 'Admin permissions' }
            ]
        },
        {
            id: 'group4',
            name: 'Test features',
            rows: [
                { id: 'r41', name: 'Something else...' }
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
        group1: {
            r11: {
                guest: 'disallow',
                user: 'warn',
                admin: 'disallow',
            },
            r12: {
                guest: 'disallow',
                user: 'allow',
                admin: 'allow',
            },
            r13: {
                guest: 'disallow',
                user: 'warn',
                admin: 'warn',
            },
            r14: {
                guest: 'disallow',
                user: 'disallow',
                admin: 'disallow',
            },
            r15: {
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
    testStructure();
    testValues();
    testBehaviour();
}

function testStructure() {
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
        it('Number of created bulk actions', () => {
            assert.lengthOf(
                matrix.dom.find('.bulk'),
                initData.columns.length * initData.groups.length,
                "Not all bulk buttons were created");
        });
        it('Number of created value cells', () => {
            for (let i = 0; i < initData.groups.length; i++) {
                assert.lengthOf(
                    matrix.dom.find(`[dm-id="${initData.groups[i].id}"] .cell`),
                    initData.groups[i].rows.length * initData.columns.length,
                    `Not all cells were created for group  ${initData.groups[i].id}`);
            }
        });
    });
}

function testValues() {
    describe("Level 2 - values", () => {
        it('Initialization', () => {
            //Matrix to data
            for(let group of initData.groups) {
                for(let row of group.rows) {
                    for(let column of initData.columns) {
                        let cellValue = matrix.get(group.id, row.id, column.id);
                        if (!!cellValue) {
                            assert.equal(cellValue, initData.values[group.id][row.id][column.id]);
                        }
                    }
                }
            }
            //Data to matrixes
            for (let group in initData.values) {
                for (let row in initData.values[group]) {
                    for (let column in initData.values[group][row]) {
                        let value = initData.values[group][row][column];
                        assert.equal(value, matrix.get(group, row, column));
                    }
                }
            }
        });

        it('Bulk init state', () => {
            for(let group of initData.groups) {
                for(let column of initData.columns) {
                    let bulkValue = matrix.getBulkCell(group.id, column.id).attr('dm-bulk');
                    let bulkValueByValues = matrix.getBulkStateByValues(group.id, column.id);
                    bulkValueByValues = bulkValueByValues ? bulkValueByValues : 'empty';
                    assert.equal(bulkValue, bulkValueByValues, `Bulk state doesn't match values: ${group.id}, ${column.id}`);
                }
            }
        });
    });
}

function testBehaviour() {
    describe("Level 3 - behaviour", () => {
        it('Simple click', () => {
            for(let group of initData.groups) {
                for(let row of group.rows) {
                    for(let column of initData.columns) {
                        let cell = matrix.getCell(group.id, row.id, column.id);
                        let oldValue = matrix.get(group.id, row.id, column.id);
                        cell.click();
                        let newValue = matrix.get(group.id, row.id, column.id);
                        assert.isTrue((oldValue != newValue) && (initData.options.length > 0),
                            `Value has not changed or incorrect options number: ${group.id}, ${row.id}, ${column.id}`);
                    }
                }
            }
        });

        it('Cycle click', () => {
            for(let group of initData.groups) {
                for(let row of group.rows) {
                    for(let column of initData.columns) {
                        let cell = matrix.getCell(group.id, row.id, column.id);
                        cell.click(); //to avoid empty init value 
                        let oldValue = matrix.get(group.id, row.id, column.id);
                        for (let i = 0; i < initData.options.length; i++) {
                            cell.click();
                        }
                        let newValue = matrix.get(group.id, row.id, column.id);
                        assert.equal(oldValue, newValue, `Value after clicks should be the same as before`);
                    }
                }
            }
        });

        it('Bulk click', () => {
            for(let group of initData.groups) {
                for(let column of initData.columns) {
                    for(let option of initData.options) {
                        //set bulk
                        matrix.setBulkValues(group.id, column.id, option.id);
                        for(let row of group.rows) {
                            let value = matrix.get(group.id, row.id, column.id);
                            assert.equal(value, option.id, `cell value (${group.id}, ${row.id}, ${column.id}) doesn't equal bulk state ${option.id}`);
                        }
                    }
                }
            }
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

