class Matrix {
    constructor(data)
    {
        this.data = data;
        this.dom = null;

    }

    render()
    {
        //main container
        this.dom = $(`<div class="dm size-${this.data.columns.length}"></div>`);
        //groups
        for (var i = 0; i < this.data.groups.length; i++) {
            var group = $(`<div class="group group-${(i == this.data.groups.length-1)?'last':i}"></div>`);
            this.dom.append(group);
            //row header
            var header = $(`<div class="header"></div>`);
            group.append(header);
            //row group name
            var rowGroupName = $(`<div class="caption">${this.data.groups[i].name}</div>`);
            header.append(rowGroupName);
            //row header columns
            for (var l = 0; l < this.data.columns.length; l++) {
                var column = $(`<div class="column">${this.data.columns[l].name}</div>`);
                header.append(column);
            }
            //header actions
            //row sub-header
            var actions = $('<div class="actions"></div>');
            group.append(actions);
            //row group name
            var rowActionSkip = $(`<div class="caption">&nbsp;</div>`);
            actions.append(rowActionSkip);
            //row header columns
            for (var l = 0; l < this.data.columns.length; l++) {
                var column = $(`<div class="column"></div>`);
                actions.append(column);
                //bulk action button
                var actionButton = $(`<div class="action click bulk icon empty"></div>`);
                column.append(actionButton);
            }
            //rows
            var rows = this.data.groups[i].rows;
            for (var j = 0; j < rows.length; j++) {
                var row = $(`<div class="row"></div>`);
                group.append(row);
                //row name
                var rowName = $(`<div class="caption">${rows[j].name}</div>`);
                row.append(rowName);
                //cells
                for (var k = 0; k < this.data.columns.length; k++) {
                    var column = $(`<div class="column cell click"><div class="icon warn"></div></div>`);
                    row.append(column);
                }
            }
        }

        return this.dom;
    }
}

module.exports.create = function (data) {

    if(process.env.NODE_ENV == 'development') {
        console.log('development mode');
    }
    return new Matrix(data);
}
