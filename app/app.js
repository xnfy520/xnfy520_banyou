Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', 'public/extjs/ux');
Ext.require([
    'Ext.container.Viewport',
    'Ext.ux.data.PagingMemoryProxy',
    'Ext.ux.SlidingPager',
    'Ext.ux.ProgressBarPager',
    'Ext.ux.statusbar.StatusBar',
    'Ext.ux.window.Notification',
    'Ext.ux.form.SearchField',
    'Ext.ux.uploadPanel',
    'Ext.ux.TinyMceField',
    'Ext.ux.toggleslide.ToggleSlide',
    'Ext.ux.toggleslide.Thumb',
    'Ext.ux.TreePicker',
    'Ext.ux.GroupTabPanel'
]);
Ext.application({
    views: [
        'Main'
    ],
    controllers: [
        'ClassifyMenu','ClassifyList','Configuration'
    ],
    autoCreateViewport: true,
    name: 'Xnfy'
});
Ext.QuickTips.init();
Ext.grid.RowEditor.prototype.saveBtnText = "保存";
Ext.grid.RowEditor.prototype.cancelBtnText = '取消';

Ext.apply(Ext.form.VTypes, {
    commodity_combobox_number: function(val, field) {
        return /^\d+$/.test(field.value);
    },
    commodity_combobox_numberText: '请选择所属商品'
});