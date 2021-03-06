﻿class Matrix {
    constructor(data, settings)
    {
        //default settings
        this.settings = {
            headerPopup: false,
            cellPopup: true,
            hightlightChanged: true,
        };
        if (settings) {
            this.settings.headerPopup = settings.headerPopup || this.settings.headerPopup;
            this.settings.cellPopup = settings.cellPopup || this.settings.cellPopup;
            this.settings.hightlightChanged = settings.hightlightChanged || this.settings.hightlightChanged;
        }

        this.originalData = data;
        this.data = this.prepareData(data);
        this.dom = this.render();
    }

    setData(callback) {
        this.exportCallback = callback;
    }

    exportData() {
        if (this.exportCallback) {
            this.exportCallback(this.data.values);
        }
    }

    prepareData(data) {
        let prepared = JSON.parse(JSON.stringify(data));
        for (let i = 0; i < prepared.groups.length; i++) {
            for (let j = 0; j < prepared.groups[i].rows.length; j++) {
                for (let l = 0; l < prepared.columns.length; l++) {
                    let value = this.get(prepared.groups[i].id, prepared.groups[i].rows[j].id, prepared.columns[l].id, prepared);
                    this.set(prepared.groups[i].id, prepared.groups[i].rows[j].id, prepared.columns[l].id, value, prepared);
                }
            }
        }
        return prepared;
    }

    render() {
        //helper functions
        function getPopupContents(self, groupId, rowId, columnId) {
            let popupContents = $('<table class="popup-contents noselect"></table>');
            for (let m = 0; m < self.data.options.length; m++) {
                let isLastPopupLine = m == self.data.options.length - 1;
                let popupItemIcon = $(`<td class="popup-icon"><div class="icon dm-${self.data.options[m].id}"></div></td>`);
                let popupItemCaption = $(`<td class="popup-caption"><div>${self.data.options[m].name}</div></td>`);
                let popupItem = $(`<tr dm-option="${self.data.options[m].id}" class="popup-line ${isLastPopupLine ? "last" : "not-last"}"></tr>`);
                popupItem.append(popupItemIcon);
                popupItem.append(popupItemCaption);
                popupContents.append(popupItem);
                //click item event
                popupItem.click(function (e) {
                    self.clickPopupItem(groupId, rowId, columnId, self.data.options[m].id);
                });
            }
            return popupContents;
        }
        //main container
        this.dom = $(`<div class="dm size-${this.data.columns.length}"></div>`);
        //groups
        for (let i = 0; i < this.data.groups.length; i++) {
            let group = $(`<div dm-id="${this.data.groups[i].id}" class="group group-${(i == this.data.groups.length - 1) ? 'last' : i}"></div>`);
            this.dom.append(group);
            //row header
            let header = $(`<div class="header"></div>`);
            group.append(header);
            //row group name
            let rowGroupName = $(`<div class="caption">${this.data.groups[i].name}</div>`);
            header.append(rowGroupName);
            //row header columns
            for (let l = 0; l < this.data.columns.length; l++) {
                let column = $(`<div class="column">${this.data.columns[l].name}</div>`);
                header.append(column);
            }
            //header actions
            //row sub-header
            let actions = $('<div class="actions"></div>');
            group.append(actions);
            //row group name
            let rowActionSkip = $(`<div class="caption">&nbsp;</div>`);
            actions.append(rowActionSkip);
            //row header columns
            for (let l = 0; l < this.data.columns.length; l++) {
                let column = $(`<div dm-column="${this.data.columns[l].id}" class="column tooltip"></div>`);
                actions.append(column);
                //bulk action button
                let actionButton = $(`<div class="action click bulk icon empty"></div>`);
                column.append(actionButton);
                //popup
                if (this.settings.headerPopup) {
                    let popup = $('<div class="tooltip-text"></div>');
                    actionButton.append(popup);
                    //popup contents
                    let popupContents = getPopupContents(this, this.data.groups[i].id, null, this.data.columns[l].id);
                    popup.append(popupContents);
                }
                //click bulk value event
                let self = this;
                actionButton.click(function (e) {
                    let target = $(e.target);
                    if (target.hasClass('action') || target.hasClass('tooltip-text')) {
                        self.bulkClick(actionButton, self.data.groups[i].id, self.data.columns[l].id);
                    }
                });
                //hover event
                column.hover(function () {
                    self.columnHover(column);
                });
            }
            //rows
            let rows = this.data.groups[i].rows;
            for (let j = 0; j < rows.length; j++) {
                let row = $(`<div dm-id="${this.data.groups[i].rows[j].id}" class="row"></div>`);
                group.append(row);
                //row name
                let rowName = $(`<div class="caption">${rows[j].name}</div>`);
                row.append(rowName);
                //cells
                for (let k = 0; k < this.data.columns.length; k++) {
                    let val = this.get(this.data.groups[i].id, this.data.groups[i].rows[j].id, this.data.columns[k].id);
                    let column = $(`<div dm-id="${this.data.columns[k].id}" class="column cell tooltip"></div>`);
                    row.append(column);
                    let icon = $(`<div dm-init="${val}" dm-current="${val}" class="icon dm-${val} value click"></div>`);
                    column.append(icon);
                    //popup
                    if (this.settings.cellPopup) {
                        let popup = $('<div class="tooltip-text"></div>');
                        icon.append(popup);
                        //popup contents
                        let popupContents = getPopupContents(this, this.data.groups[i].id, this.data.groups[i].rows[j].id, this.data.columns[k].id);
                        popup.append(popupContents);
                    }
                    //click value event
                    let self = this;
                    column.find('.value').click(function (e) {
                        let target = $(e.target);
                        if (target.hasClass('value') || target.hasClass('tooltip-text')) {
                            self.valueClick(self.data.groups[i].id, self.data.groups[i].rows[j].id, self.data.columns[k].id);
                        }
                    });
                    //hover event
                    column.hover(function () {
                        self.columnHover(column);
                    });
                }
            }
        }
        this.updateAllBulks();
        this.exportData();
        return this.dom; 
    }

    updateAllBulks() {
        for (let i = 0; i < this.data.groups.length; i++) {
            for (let l = 0; l < this.data.columns.length; l++) {
                this.updateBulkByValues(this.data.groups[i].id, this.data.columns[l].id);
            }
        }
    }

    columnHover(cell) {
        //position
        let popup = cell.find('.tooltip-text');
        if (popup.length == 0) {
            //popup is disabled by config
            return false;
        }
        let border = parseInt(popup.css('borderLeftWidth'));
        let cornerBorder = parseInt(getComputedStyle(popup[0], ':after')['border-left-width']);
        let x = cell.width() / 2 - popup.width() / 2 - border;
        let y = cell.height() + cornerBorder - 10;
        popup.css({ top: y, left: x });
        //actions
        this.updatePopup(cell);
    }

    updatePopup(cell) {
        let actualValue = cell.find('.value').attr('dm-current');
        let actualBulkValue = cell.find('.action').attr('dm-bulk');
        cell.find('.popup-line').removeClass('active');
        let selector = `[dm-option="${actualValue ? actualValue : actualBulkValue}"]`;
        cell.find(selector).addClass("active");
    }

    bulkClick(cell, groupId, columnId, forcedValue) {
        let newValue = forcedValue;
        if (process.env.NODE_ENV == 'development') {
            console.log('bulk', groupId, columnId, cell);
        }
        if (!forcedValue) {
            let currentValue = cell.attr('dm-bulk');
            newValue = this.next(currentValue);
        }
        cell.attr('dm-bulk', newValue); 
        this.updateBulk(cell, groupId, columnId);
        //update values
        this.setBulkValues(groupId, columnId, newValue);
        this.updateBulkValues(groupId, columnId, newValue);
        this.updatePopup(cell.parent());
        //callback
        this.exportData();
    }

    setBulkValues(groupId, columnId, newValue) { 
        if (!this.data.values) {
            this.data.values = {};
        }
        if (!this.data.values[groupId]) {
            this.data.values[groupId] = {};
        }
        let group = this.getGroup(groupId);
        for(let row of group.rows) {
            this.set(groupId, row.id, columnId, newValue);
        }
    }

    getGroup(groupId) {
        for(let group of this.data.groups) {
            if (group.id == groupId) {
                return group;
            }
        }
    }

    updateBulkValues(groupId, columnId) {
        let group = this.getGroup(groupId);
        for(let row of group.rows) {
            this.updateCell(groupId, row.id, columnId);
        }
    }

    updateBulk(cell, groupId, columnId) {
        this.clear(cell);
        if (cell.attr('dm-bulk') == 'empty') {
            cell.addClass(`empty`);
        }
        else {
            cell.addClass(`dm-${cell.attr('dm-bulk')}`);
        }
    }

    valueClick(groupId, rowId, columnId, forcedValue) {
        if (process.env.NODE_ENV == 'development') {
            console.log('click', arguments);
        }
        if (forcedValue) {
            this.set(groupId, rowId, columnId, forcedValue);
        }
        else {
            let currentValue = this.get(groupId, rowId, columnId);
            let newValue = this.next(currentValue);
            this.set(groupId, rowId, columnId, newValue);
        }
        this.updateCell(groupId, rowId, columnId);
        this.updateBulkByValues(groupId, columnId);
        //update popup
        let selector = `[dm-id="${groupId}"] [dm-id="${rowId}"] [dm-id="${columnId}"]`;
        let cell = this.dom.find(selector);
        this.updatePopup(cell);
        //callback
        this.exportData();
    }

    clickPopupItem(groupId, rowId, columnId, newValue) {
        if (process.env.NODE_ENV == 'development') {
            console.log('popup click', arguments);
        }
        if (rowId != null) {
            this.valueClick(groupId, rowId, columnId, newValue);
        }
        else {
            let cell = this.getBulkCell(groupId, columnId)
            this.bulkClick(cell, groupId, columnId, newValue);
        }
    }

    updateBulkByValues(groupId, columnId) {
        let newValue = this.getBulkStateByValues(groupId, columnId);
        if (!newValue) {
            newValue = 'empty';
        }
        if (process.env.NODE_ENV == 'development') {
            console.log('bulk state to:', newValue);
        }
        let cell = this.getBulkCell(groupId, columnId);
        cell.attr('dm-bulk', newValue);
        this.updateBulk(cell, groupId, columnId);
    }

    getBulkCell(groupId, columnId) {
        let selector = `[dm-id="${groupId}"] .actions [dm-column="${columnId}"] .bulk`;
        let cell = this.dom.find(selector);
        return cell;
    }

    getBulkStateByValues(groupId, columnId) {
        let group = this.getGroup(groupId);
        let result = 'empty';
        for(let row of group.rows) {
            let cellValue = this.get(groupId, row.id, columnId);
            if (result == 'empty' && cellValue) {
                result = cellValue;
            }
            else if (result != cellValue) {
                return null;
            }
        }
        return result;
    }

    getCell(groupId, rowId, columnId) {
        let selector = `[dm-id="${groupId}"] [dm-id="${rowId}"] [dm-id="${columnId}"] .value`;
        return this.dom.find(selector);
    }

    updateCell(groupId, rowId, columnId) {
        let cell = this.getCell(groupId, rowId, columnId);
        if (process.env.NODE_ENV == 'development') {
            console.log('old', selector, cell);
        }
        this.clear(cell);
        let newValue = this.get(groupId, rowId, columnId);
        let newClass = `dm-${newValue}`;
        if (process.env.NODE_ENV == 'development') {
            console.log(newValue, newClass);
        }
        cell.addClass(newClass); if (process.env.NODE_ENV == 'development') {
            console.log('new', cell);
        }
        cell.attr('dm-current', newValue);
        if (cell.attr('dm-init') != cell.attr('dm-current')) {
            if (process.env.NODE_ENV == 'development') {
                console.log('cell values:', cell.attr('dm-init'), cell.attr('dm-current'));
            }
            if (this.settings.hightlightChanged) {
                cell.addClass('dm-changed');
            }
        }
    }

    clear(cell) {
        for (let i = 0; i < this.data.options.length; i++) {
            cell.removeClass(`dm-${this.data.options[i].id}`);
        }
        cell.removeClass('empty');
        cell.removeClass('dm-changed');
    }

    next(currentValue) {
        if (!currentValue) {
            currentValue = this.data.options[0].id;
        }
        let index = 0;
        for (let i = 0; i < this.data.options.length; i++) {
            if (this.data.options[i].id == currentValue) {
                index = i;
                break;
            }
        }
        index += 1;
        if (index >= this.data.options.length) {
            index = 0;
        }
        return this.data.options[index].id;
    }

    get(groupId, rowId, columnId, target) {
        if (!target) {
            target = this.data;
        }
        if (target.values && target.values[groupId] && target.values[groupId][rowId] && target.values[groupId][rowId][columnId]) {
            return target.values[groupId][rowId][columnId];
        }
    }

    set(groupId, rowId, columnId, value, target) {
        if (!target) {
            target = this.data;
        }

        if (!target.values) {
            target.values = {};
        }
        if (!target.values[groupId]) {
            target.values[groupId] = {};
        }
        if (!target.values[groupId][rowId]) {
            target.values[groupId][rowId] = {};
        }
        if (target.values && target.values[groupId] && target.values[groupId][rowId]) {
            target.values[groupId][rowId][columnId] = value;
        }
    }
}

module.exports.create = function (data, settings) {
    console.log(process.env.NODE_ENV);
    if(process.env.NODE_ENV == 'development') {
        console.log('development mode');
    }
    return new Matrix(data, settings);
}
