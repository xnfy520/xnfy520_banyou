Ext.define('Xnfy.model.ClassifyMenu', {
    extend: 'Ext.data.Model',

    fields: [
        {
            name: 'id',
            type:'int'
        },{
            name:'leaf',
            type:'boolean'
        },
        {
            name:'alias'
        },
        {
            name:'indexing'
        },
        {name:'sort',type:'int'},
        {
            name: 'title'
        }
    ]
});