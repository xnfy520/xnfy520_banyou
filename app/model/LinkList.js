Ext.define('Xnfy.model.LinkList', {
    extend: 'Ext.data.Model',
    fields:[{name:'id',type:'int'},'title','pid','indexing', 'cover',{name:'sort',type:'int'},'enabled','remark','create_date','modify_date']
});