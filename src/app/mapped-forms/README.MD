Mapped Forms Module

Custom controls

To use custom controls, you will need to do the following:

1. Create an editor control by extending the MappedFormControlBase component, or choose one from the FormEditorCatalogue module.
2. If you haven't already, create a subclass of CustomEditorSource which implements the getControl method to return the new editor control type for any field type string for which it should be used. Add it to the AppModule NgModule directive providers list like this: { provide: CustomEditorSource, useClass: AppEditorSource }.
3. Ensure you have the editor control listed in AppModule NgModule directive in the entryComponents list.
