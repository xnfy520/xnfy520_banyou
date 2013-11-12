 Ext.define("Xnfy.model.ArticleSelect", {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'id', mapping: 'post_id'},
        {name: 'title', mapping: 'topic_title'},
        {name: 'topicId', mapping: 'topic_id'},
        {name: 'author', mapping: 'author'},
        {name: 'lastPost', mapping: 'post_time', type: 'date', dateFormat: 'timestamp'},
        {name: 'excerpt', mapping: 'post_text'}
    ]
});